// Collections
export {
  partnersCollection, encountersCollection, notesCollection,
  desiresCollection, whispersCollection, affirmationsCollection,
  appStateCollection,
} from './collections';

// Hooks
export {
  useEncountersByMonth, useEncountersByDateRange, useEncountersByDate, useEncounterById,
  useEncountersByPartnerId, useEncountersCount,
  useActivePartners, usePartnerById, usePartnerMap,
  useRecentDesires, useWhisperHistory,
  useUserProfile, useShownMilestones, useLastAffirmation,
} from './hooks';

// Mutations
export {
  insertEncounter, updateEncounter, removeEncounter,
  insertPartner, updatePartner, archivePartner,
  insertNote, removeNote,
  insertDesireEntry, markDesireActedOn, removeDesireEntry,
  insertWhisperMessage,
  updateUserProfile, updateUserSettings,
  markMilestoneShown, setLastAffirmation, setOnboardingComplete,
} from './mutations';

// Database
export { getDatabase, closeDatabase } from './database';

// Persistence
export { hydrateCollections } from './persistence';
