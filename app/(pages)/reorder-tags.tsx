import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Sortable, SortableItem, type SortableRenderItemProps } from 'react-native-reanimated-dnd'
import { Pressable } from 'react-native-gesture-handler'
import { colors, font } from '@/lib/theme'
import { BackButton } from '@/lib/components/BackButton'
import { StatusBarSpacer } from '@/lib/screens/shared/StatusBarSpacer'
import { activityTags, PERIOD_TAG_ID } from '@/src/db'

// Matches the tag-row visual height used on the Edit Profile screen.
const TAG_ROW_HEIGHT = 53

export default function ReorderTagsPage() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags })),
  )

  const activeTags = useMemo(
    () => allTags.filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [allTags],
  )
  // Period is protected — never reorderable — so keep it out of the sortable set
  // and pin it as a static footer.
  const reorderableTags = useMemo(
    () => activeTags.filter((t) => t.id !== PERIOD_TAG_ID),
    [activeTags],
  )
  const periodTag = useMemo(() => activeTags.find((t) => t.id === PERIOD_TAG_ID), [activeTags])

  const [sortableTags, setSortableTags] = useState(reorderableTags)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [listHeight, setListHeight] = useState(0)

  const activeTagSyncSignature = reorderableTags
    .map((tag) => `${tag.id}:${tag.label}:${tag.emoji}:${tag.isActive}`)
    .sort()
    .join('|')

  useEffect(() => {
    // Sync added/deleted/renamed tags, but ignore sortOrder-only changes so a
    // persisted reorder does not remount the scroller and jump it to the top.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSortableTags((currentTags) => {
      const activeById = new Map(reorderableTags.map((tag) => [tag.id, tag]))
      const currentIds = currentTags.map((tag) => tag.id).sort().join('|')
      const activeIds = reorderableTags.map((tag) => tag.id).sort().join('|')

      if (currentIds !== activeIds) return reorderableTags

      let hasContentChange = false
      const nextTags = currentTags.map((tag) => {
        const activeTag = activeById.get(tag.id)
        if (!activeTag) return tag
        const changed =
          tag.label !== activeTag.label || tag.emoji !== activeTag.emoji || tag.isActive !== activeTag.isActive
        if (changed) hasContentChange = true
        return changed ? activeTag : tag
      })
      return hasContentChange ? nextTags : currentTags
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTagSyncSignature])

  const handleTagDrop = useCallback(
    (_id: string, _position: number, allPositions?: Record<string, number>) => {
      if (!allPositions) return
      reorderableTags.forEach((tag) => {
        const nextSortOrder = allPositions[tag.id]
        if (typeof nextSortOrder !== 'number' || tag.sortOrder === nextSortOrder) return
        activityTags.update(tag.id, (draft) => {
          draft.sortOrder = nextSortOrder
        })
      })
      // Keep Period pinned strictly last everywhere.
      if (periodTag) {
        const lastOrder = reorderableTags.length
        if (periodTag.sortOrder !== lastOrder) {
          activityTags.update(periodTag.id, (draft) => {
            draft.sortOrder = lastOrder
          })
        }
      }
      // NOTE: intentionally do NOT reorder local `data` here. The library's
      // `positions` already hold the new order (kept a clean permutation by the
      // drag), and the sync effect ignores sortOrder-only changes — so the list
      // stays put. Reordering `data` would change the library's dataHash key and
      // remount the scroller, snapping it back to the top after every drop.
    },
    [reorderableTags, periodTag],
  )

  const renderTagItem = useCallback(
    ({ item: tag, id, ...sortableProps }: SortableRenderItemProps<(typeof sortableTags)[number]>) => (
      <SortableItem
        key={id}
        id={id}
        data={tag}
        onDragStart={() => setDraggingId(tag.id)}
        onDrop={(dropId, position, allPositions) => {
          setDraggingId(null)
          handleTagDrop(dropId, position, allPositions)
        }}
        // Android stacks siblings by elevation, not zIndex — lift the dragged row
        // above its neighbors so it doesn't render behind them mid-drag.
        animatedStyle={draggingId === tag.id ? styles.rowDragging : undefined}
        {...sortableProps}
      >
        {/* The whole row is the drag handle — this screen has no other actions. */}
        <SortableItem.Handle style={styles.handle}>
          <View style={[styles.row, { height: TAG_ROW_HEIGHT }]}>
            <View style={styles.labelGroup}>
              <Text style={styles.emoji}>{tag.emoji}</Text>
              <Text style={styles.label}>{tag.label}</Text>
            </View>
            <Ionicons name="reorder-three" size={24} color={colors.stone} />
          </View>
        </SortableItem.Handle>
      </SortableItem>
    ),
    [handleTagDrop, draggingId],
  )

  return (
    <View style={styles.container}>
      <StatusBarSpacer />

      <View style={styles.header}>
        <BackButton onPress={() => router.back()} accessibilityLabel="Back" />
        {/* Title wrapped in a pointerEvents="none" View — an absolute full-width
            title otherwise swallows center taps on the buttons beneath it, and
            pointerEvents set on the Text alone is a no-op on Android. */}
        <View pointerEvents="none" style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Reorder Tags</Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Done"
          hitSlop={12}
          style={styles.doneButton}
        >
          <Text style={styles.doneLabel}>Done</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>Press and hold a tag, then drag to reorder.</Text>

      <View style={styles.listArea} onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}>
        {listHeight > 0 && (
          <Sortable
            data={sortableTags}
            renderItem={renderTagItem}
            itemHeight={TAG_ROW_HEIGHT}
            containerHeight={listHeight}
            itemKeyExtractor={(tag) => tag.id}
            style={styles.sortableList}
            contentContainerStyle={styles.sortableContent}
            useFlatList={false}
          />
        )}
      </View>

      {/* Period is pinned last and cannot be moved. */}
      {periodTag && (
        <View style={[styles.row, styles.periodFooter, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.labelGroup}>
            <Text style={styles.emoji}>{periodTag.emoji}</Text>
            <Text style={styles.label}>{periodTag.label}</Text>
          </View>
          <Ionicons name="lock-closed" size={18} color={colors.muted} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmSand,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingHorizontal: 20,
    flexShrink: 0,
    position: 'relative',
    zIndex: 2,
  },
  headerTitleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: font('playfair', '700'),
    fontSize: 20,
    color: colors.ink,
    textAlign: 'center',
  },
  doneButton: {
    height: 34,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneLabel: {
    fontFamily: font('dmSans', '500'),
    fontSize: 16,
    color: colors.terra,
  },
  hint: {
    fontFamily: font('dmSans', '400'),
    fontSize: 13,
    color: colors.stone,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  listArea: {
    flex: 1,
  },
  sortableList: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  sortableContent: {
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160,100,80,0.08)',
  },
  rowDragging: {
    elevation: 8,
    zIndex: 999,
  },
  handle: {
    width: '100%',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  label: {
    fontFamily: font('dmSans', '400'),
    fontSize: 16,
    color: colors.ink,
    flexShrink: 1,
  },
  periodFooter: {
    minHeight: TAG_ROW_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
})
