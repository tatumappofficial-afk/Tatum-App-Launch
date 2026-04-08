import type { WhisperTemplate } from '@/client/schemas';

export const WHISPER_TEMPLATES: WhisperTemplate[] = [
  // DESIRE - Free
  {
    id: 'desire-1',
    category: 'desire',
    prompt: "I've been thinking about you...",
    messageBody: "I've been thinking about you all day. Just wanted you to know you're on my mind.",
    tier: 'free',
  },
  {
    id: 'desire-2',
    category: 'desire',
    prompt: 'I keep replaying last night...',
    messageBody: "I keep replaying last night in my head. You really know how to make me feel something.",
    tier: 'free',
  },
  {
    id: 'desire-3',
    category: 'desire',
    prompt: 'I miss being close to you',
    messageBody: "I miss being close to you. Can we make some time for just us soon?",
    tier: 'free',
  },
  {
    id: 'desire-4',
    category: 'desire',
    prompt: "There's something I want to tell you",
    messageBody: "There's something I've been wanting to say... I want more of us. More closeness, more you.",
    tier: 'free',
  },
  {
    id: 'desire-5',
    category: 'desire',
    prompt: 'You make me feel alive',
    messageBody: "You make me feel more alive than you know. I just needed you to hear that today.",
    tier: 'free',
  },
  // DESIRE - Premium
  {
    id: 'desire-6',
    category: 'desire',
    prompt: "I can't stop thinking about your touch",
    messageBody: "I can't stop thinking about the way you touch me. It stays with me long after.",
    tier: 'premium',
  },
  {
    id: 'desire-7',
    category: 'desire',
    prompt: 'I want to be closer tonight',
    messageBody: "I want to be closer to you tonight. Just you and me, nothing else.",
    tier: 'premium',
  },

  // APPRECIATION - Free
  {
    id: 'appreciation-1',
    category: 'appreciation',
    prompt: 'Last night meant everything to me',
    messageBody: "Last night meant everything to me. I hope you know that. Thank you for showing up the way you do.",
    tier: 'free',
  },
  {
    id: 'appreciation-2',
    category: 'appreciation',
    prompt: 'You make me feel safe',
    messageBody: "You make me feel safe in a way I didn't know I needed. I just wanted to say thank you.",
    tier: 'free',
  },
  {
    id: 'appreciation-3',
    category: 'appreciation',
    prompt: 'I feel so seen by you',
    messageBody: "I feel so seen when I'm with you. That means more than you know.",
    tier: 'free',
  },
  {
    id: 'appreciation-4',
    category: 'appreciation',
    prompt: "Thank you for being patient with me",
    messageBody: "Thank you for being patient with me. Your kindness doesn't go unnoticed.",
    tier: 'free',
  },
  {
    id: 'appreciation-5',
    category: 'appreciation',
    prompt: 'You showed up for me today',
    messageBody: "You showed up for me today in a way that really mattered. I love that about you.",
    tier: 'free',
  },
  // APPRECIATION - Premium
  {
    id: 'appreciation-6',
    category: 'appreciation',
    prompt: 'The way you hold me changes everything',
    messageBody: "The way you hold me changes everything about my day. I carry it with me.",
    tier: 'premium',
  },

  // INVITATION - Free
  {
    id: 'invitation-1',
    category: 'invitation',
    prompt: 'What if we made tonight about us?',
    messageBody: "What if we turned off our phones tonight and just made it about us? I think we both need it.",
    tier: 'free',
  },
  {
    id: 'invitation-2',
    category: 'invitation',
    prompt: "Let's not wait until we're tired",
    messageBody: "Let's not wait until we're too tired tonight. I want to be present with you.",
    tier: 'free',
  },
  {
    id: 'invitation-3',
    category: 'invitation',
    prompt: 'I have something in mind for us',
    messageBody: "I have something in mind for us tonight. Clear your evening?",
    tier: 'free',
  },
  {
    id: 'invitation-4',
    category: 'invitation',
    prompt: 'Come find me when you get home',
    messageBody: "Come find me when you get home. I'll be waiting.",
    tier: 'free',
  },
  {
    id: 'invitation-5',
    category: 'invitation',
    prompt: "Can we just be together tonight?",
    messageBody: "Can we just be together tonight? No plans, no agenda. Just us.",
    tier: 'free',
  },
  // INVITATION - Premium
  {
    id: 'invitation-6',
    category: 'invitation',
    prompt: "I booked us some alone time",
    messageBody: "I'm making sure we have some real alone time soon. You and me. That's the whole plan.",
    tier: 'premium',
  },

  // PLAYFUL - Free
  {
    id: 'playful-1',
    category: 'playful',
    prompt: 'I have an idea... come home early?',
    messageBody: "I have an idea and it involves you coming home early. Interested?",
    tier: 'free',
  },
  {
    id: 'playful-2',
    category: 'playful',
    prompt: "You're in trouble when you get home",
    messageBody: "Just so you know... you're in the best kind of trouble when you get home.",
    tier: 'free',
  },
  {
    id: 'playful-3',
    category: 'playful',
    prompt: "I just had a thought about you...",
    messageBody: "I just had a thought about you and now I'm smiling. Thought you should know.",
    tier: 'free',
  },
  {
    id: 'playful-4',
    category: 'playful',
    prompt: 'Counting down the hours...',
    messageBody: "Counting down the hours until I see you. Fair warning: I might not let you go.",
    tier: 'free',
  },
  {
    id: 'playful-5',
    category: 'playful',
    prompt: "Don't make plans tonight",
    messageBody: "Don't make plans tonight. I already did. They involve you.",
    tier: 'free',
  },
  // PLAYFUL - Premium
  {
    id: 'playful-6',
    category: 'playful',
    prompt: "Guess what I'm wearing",
    messageBody: "Guess what I'm wearing right now. Hint: it's for you.",
    tier: 'premium',
  },
  {
    id: 'playful-7',
    category: 'playful',
    prompt: 'I dare you to come home right now',
    messageBody: "I dare you to come home right now. I promise it'll be worth it.",
    tier: 'premium',
  },
];

export function getTemplatesByCategory(category: WhisperTemplate['category']): WhisperTemplate[] {
  return WHISPER_TEMPLATES.filter((t) => t.category === category);
}

export function getFreeTemplates(): WhisperTemplate[] {
  return WHISPER_TEMPLATES.filter((t) => t.tier === 'free');
}
