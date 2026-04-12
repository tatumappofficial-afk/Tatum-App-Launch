import { useState } from 'react'
import { AddTagModal } from '@/lib/screens/AddTagModal'
import { useRouter } from 'expo-router'

export default function AddTagRoute() {
  const router = useRouter()
  const [selectedEmoji, setSelectedEmoji] = useState('🍆')
  const [tagName, setTagName] = useState('')

  return (
    <AddTagModal
      existingTags={[]}
      usedEmojis={[]}
      selectedEmoji={selectedEmoji}
      tagName={tagName}
      onClose={() => router.back()}
      onCancel={() => router.back()}
      onAddTag={() => router.back()}
      onEmojiSelect={setSelectedEmoji}
      onTagNameChange={setTagName}
    />
  )
}
