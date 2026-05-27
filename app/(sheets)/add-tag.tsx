import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from '@tanstack/react-db'
import { useRouter } from 'expo-router'
import { generateId as uuid } from '@/src/utils/uuid'
import { AddTagModal } from '@/lib/screens/AddTagModal'
import { SuccessOverlay } from '@/lib/components/SuccessOverlay'
import { activityTags } from '@/src/db'
import { TAG_EMOJIS } from '@/lib/data/tagEmojis'
import { useSheetDismiss } from '@/app/(sheets)/_layout'

export default function AddTagRoute() {
  const router = useRouter()
  const dismissSheet = useSheetDismiss()
  const [userPickedEmoji, setUserPickedEmoji] = useState<string | null>(null)
  const [tagName, setTagName] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successLabel, setSuccessLabel] = useState('')
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
  }, [])

  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags }))
  )

  const activeTags = allTags
    .filter(t => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const existingTags = activeTags.map(t => ({ emoji: t.emoji, name: t.label }))
  const usedEmojis = activeTags.map(t => t.emoji)

  // Default = first emoji in TAG_EMOJIS not already used. Once the user picks something,
  // userPickedEmoji wins so the live-query hydrating later can't yank their selection.
  const selectedEmoji = userPickedEmoji
    ?? TAG_EMOJIS.find(e => !usedEmojis.includes(e))
    ?? TAG_EMOJIS[0]

  function handleAddTag() {
    const label = tagName.trim()
    if (!label || !selectedEmoji) return

    // Reject case-insensitive duplicates of existing active tags. The modal also
    // disables the Add Tag button in this state, but defend at the boundary.
    const isDuplicate = activeTags.some(t => t.label.toLowerCase() === label.toLowerCase())
    if (isDuplicate) return

    // New tags insert at the top of the list (sortOrder less than existing min).
    const minOrder = activeTags.reduce((min, t) => Math.min(min, t.sortOrder), 0)

    activityTags.insert({
      id: uuid(),
      emoji: selectedEmoji,
      label,
      sortOrder: minOrder - 1,
      isDefault: false,
      isActive: true,
    })

    setSuccessLabel(`${selectedEmoji}  ${label} added`)
    setShowSuccess(true)
    dismissTimer.current = setTimeout(dismissSheet, 900)
  }

  return (
    <>
      <AddTagModal
        existingTags={existingTags}
        usedEmojis={usedEmojis}
        selectedEmoji={selectedEmoji}
        tagName={tagName}
        onClose={dismissSheet}
        onCancel={dismissSheet}
        onAddTag={handleAddTag}
        onEmojiSelect={setUserPickedEmoji}
        onTagNameChange={setTagName}
      />
      <SuccessOverlay visible={showSuccess} label={successLabel} />
    </>
  )
}
