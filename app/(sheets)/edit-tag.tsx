import { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { generateId as uuid } from '@/src/utils/uuid'
import { AddTagModal } from '@/lib/screens/AddTagModal'
import { SuccessOverlay } from '@/lib/components/SuccessOverlay'
import { activityTags, deactivateTag, PERIOD_TAG_ID } from '@/src/db'
import { useSheetDismiss } from '@/app/(sheets)/_layout'

const PERIOD_LOCKED_HINT =
  'Period is part of Tatum’s wellness tracking. Its emoji and name stay fixed, and it can’t be deleted.'

export default function EditTagRoute() {
  const dismissSheet = useSheetDismiss()
  const { id } = useLocalSearchParams<{ id?: string }>()

  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags })),
  )

  const tag = id ? allTags.find((t) => t.id === id) : undefined
  const locked = tag?.id === PERIOD_TAG_ID

  // Local edit buffer — hydrated from the tag once it's available. We don't
  // commit until the user taps Save, so the live row stays untouched while
  // they're typing.
  const [tagName, setTagName] = useState(tag?.label ?? '')
  const [userPickedEmoji, setUserPickedEmoji] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    if (!tag || hydrated) return
    setTagName(tag.label)
    setUserPickedEmoji(tag.emoji)
    setHydrated(true)
  }, [tag, hydrated])

  const selectedEmoji = userPickedEmoji ?? tag?.emoji ?? ''

  const activeTags = allTags.filter((t) => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder)
  // Exclude the tag being edited so its own emoji + name stay selectable.
  const otherTags = activeTags.filter((t) => t.id !== id)
  const existingTags = otherTags.map((t) => ({ emoji: t.emoji, name: t.label }))
  const usedEmojis = otherTags.map((t) => t.emoji)

  const [showSuccess, setShowSuccess] = useState(false)
  const [successLabel, setSuccessLabel] = useState('')
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
    },
    [],
  )

  function handleSave() {
    if (!tag || locked) return
    const label = tagName.trim()
    if (!label || !selectedEmoji) return
    const isDuplicate = otherTags.some((t) => t.label.toLowerCase() === label.toLowerCase())
    if (isDuplicate) return

    // Swapping the emoji retires the old one — semantically a delete of that
    // emoji's current name. Record it as an inactive row (invisible to every
    // picker, which all filter isActive) so pre-snapshot legacy sessions and
    // aggregates using the old emoji still resolve its last name instead of
    // falling through to an older dead generation or the bare glyph.
    if (selectedEmoji !== tag.emoji) {
      activityTags.insert({
        id: uuid(),
        emoji: tag.emoji,
        label: tag.label,
        sortOrder: tag.sortOrder,
        isDefault: false,
        isActive: false,
        deactivatedAt: new Date().toISOString(),
      })
    }

    activityTags.update(tag.id, (draft) => {
      draft.label = label
      draft.emoji = selectedEmoji
    })
    setSuccessLabel(`${selectedEmoji}  ${label} updated`)
    setShowSuccess(true)
    dismissTimer.current = setTimeout(dismissSheet, 900)
  }

  function handleDelete() {
    if (!tag || locked) return
    Alert.alert('Delete tag', `Delete “${tag.emoji} ${tag.label}”? Past sessions will keep this tag in their record.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Soft delete. Sessions logged while this tag was current keep its
          // name via their encounter_tag_labels snapshots; the row itself is
          // kept (with deactivatedAt stamped) so sessions from before
          // snapshotting existed can still resolve a name for this emoji.
          deactivateTag(tag.id)
          setSuccessLabel(`${tag.emoji}  ${tag.label} removed`)
          setShowSuccess(true)
          dismissTimer.current = setTimeout(dismissSheet, 700)
        },
      },
    ])
  }

  // Tag not found (deleted while sheet was open, or stale route param) — just
  // dismiss; nothing meaningful to render.
  if (!tag) {
    return null
  }

  return (
    <>
      <AddTagModal
        mode="edit"
        existingTags={existingTags}
        usedEmojis={usedEmojis}
        selectedEmoji={selectedEmoji}
        tagName={tagName}
        onClose={dismissSheet}
        onCancel={dismissSheet}
        onAddTag={handleSave}
        onEmojiSelect={setUserPickedEmoji}
        onTagNameChange={setTagName}
        onDelete={handleDelete}
        locked={locked}
        lockedHint={locked ? PERIOD_LOCKED_HINT : undefined}
      />
      <SuccessOverlay visible={showSuccess} label={successLabel} />
    </>
  )
}
