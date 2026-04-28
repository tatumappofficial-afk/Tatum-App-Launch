import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useLiveQuery } from '@tanstack/react-db'
import { generateId as uuid } from '@/src/utils/uuid'
import { LogSessionScreen } from '@/lib/screens/LogSessionScreen'
import { DatePickerDropdown } from '@/lib/components/DatePickerDropdown'
import { activityTags, encounters, partners } from '@/src/db'

export default function LogSessionRoute() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const isEditing = !!id
  const now = new Date()

  const { data: allPartners = [] } = useLiveQuery((q) =>
    q.from({ partners }).select(({ partners }) => ({ ...partners }))
  )
  const { data: allTags = [] } = useLiveQuery((q) =>
    q.from({ activityTags }).select(({ activityTags }) => ({ ...activityTags }))
  )
  const { data: allEncounters = [] } = useLiveQuery((q) =>
    q.from({ encounters }).select(({ encounters }) => ({ ...encounters }))
  )

  const existingEncounter = isEditing ? allEncounters.find(e => e.id === id) : null

  const [selectedDate, setSelectedDate] = useState(now)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [rating, setRating] = useState(7)
  const [notes, setNotes] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Pre-populate state when editing an existing encounter
  useEffect(() => {
    if (isEditing && existingEncounter && !initialized) {
      const dateObj = new Date(existingEncounter.date + 'T00:00:00')
      setSelectedDate(dateObj)
      setCalMonth(dateObj.getMonth())
      setCalYear(dateObj.getFullYear())
      setSelectedPartnerIds(existingEncounter.partnerId ? [existingEncounter.partnerId] : [])
      setSelectedActivities(existingEncounter.activities)
      setRating(existingEncounter.stars ?? 7)
      setNotes(existingEncounter.notes ?? '')
      setInitialized(true)
    }
  }, [isEditing, existingEncounter, initialized])

  const dateDisplay = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const partnerItems = allPartners.filter(p => p.isActive).map(p => ({
    id: p.id,
    initials: p.avatarValue,
    gradient: p.avatarGradient,
    name: p.displayName,
  }))

  const activityItems = allTags
    .filter(t => t.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(t => ({
      id: t.emoji,
      emoji: t.emoji,
      label: t.label,
    }))

  // Logged days for the calendar dropdown's current month view
  const calMonthStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`
  const monthEncounters = allEncounters.filter(e => e.date.startsWith(calMonthStr))
  const loggedDaysMap = new Map<number, { emojis: string[]; count: number }>()
  for (const enc of monthEncounters) {
    const day = parseInt(enc.date.split('-')[2], 10)
    const existing = loggedDaysMap.get(day)
    if (existing) {
      existing.emojis.push(...enc.activities)
      existing.count++
    } else {
      loggedDaysMap.set(day, { emojis: [...enc.activities], count: 1 })
    }
  }
  const loggedDays = [...loggedDaysMap.entries()].map(([day, data]) => ({
    day,
    emoji: data.emojis[0] || '✨',
    hasMultiple: data.count > 1 || data.emojis.length > 1,
  }))

  const isCalCurrentMonth = calMonth === now.getMonth() && calYear === now.getFullYear()

  function handleMonthChange(delta: number) {
    let newMonth = calMonth + delta
    let newYear = calYear
    if (newMonth < 0) { newMonth = 11; newYear-- }
    else if (newMonth > 11) { newMonth = 0; newYear++ }
    setCalMonth(newMonth)
    setCalYear(newYear)
  }

  function handleDaySelect(day: number) {
    const newDate = new Date(calYear, calMonth, day)
    setSelectedDate(newDate)
    setTimeout(() => setCalendarOpen(false), 280)
  }

  function handlePartnerToggle(id: string) {
    setSelectedPartnerIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  function handleActivityToggle(id: string) {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  function handleDelete() {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session? This can\u2019t be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              encounters.delete(id!)
            } catch (err) {
              console.error('Failed to delete encounter:', err)
            }
            router.dismiss()
          },
        },
      ],
    )
  }

  async function handleSave() {
    if (selectedActivities.length === 0) {
      Alert.alert('Missing activity', 'Must choose one activity')
      return
    }

    const nowStr = new Date().toISOString()
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    const partnerId = selectedPartnerIds[0] || null

    try {
      if (isEditing && existingEncounter) {
        encounters.update(id, (draft) => {
          draft.date = dateStr
          draft.activities = selectedActivities
          draft.partnerId = partnerId
          draft.stars = rating
          draft.notes = notes || null
          draft.updatedAt = nowStr
        })
      } else {
        encounters.insert({
          id: uuid(),
          date: dateStr,
          activities: selectedActivities,
          partnerId,
          stars: rating,
          notes: notes || null,
          createdAt: nowStr,
          updatedAt: nowStr,
        })
      }
      setShowSuccess(true)
      setTimeout(() => router.back(), 900)
    } catch (err) {
      console.error('Failed to save encounter:', err)
      router.back()
    }
  }

  const calendarContent = (
    <DatePickerDropdown
      month={calMonth}
      year={calYear}
      today={isCalCurrentMonth ? now.getDate() : undefined}
      selectedDay={
        selectedDate.getMonth() === calMonth && selectedDate.getFullYear() === calYear
          ? selectedDate.getDate()
          : undefined
      }
      loggedDays={loggedDays}
      onDaySelect={handleDaySelect}
      onMonthChange={handleMonthChange}
    />
  )

  return (
    <LogSessionScreen
      title={isEditing ? 'Edit Session' : 'Log a Session'}
      saveLabel={isEditing ? 'Save Changes' : 'Save Session'}
      date={dateDisplay}
      partners={partnerItems}
      selectedPartnerIds={selectedPartnerIds}
      activities={activityItems}
      selectedActivityIds={selectedActivities}
      rating={rating}
      notes={notes}
      onPartnerToggle={handlePartnerToggle}
      onActivityToggle={handleActivityToggle}
      onRatingChange={setRating}
      onNotesChange={setNotes}
      onSave={handleSave}
      onDelete={isEditing ? handleDelete : undefined}
      onAddPartner={() => router.push('/(sheets)/edit-partner')}
      onClose={() => router.dismiss()}
      onDatePress={() => setCalendarOpen(prev => !prev)}
      calendarOpen={calendarOpen}
      calendarContent={calendarContent}
      showSuccess={showSuccess}
      successLabel={isEditing ? 'Session updated' : 'Session added'}
    />
  )
}
