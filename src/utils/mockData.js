// Helper to generate mock images
export const generateMockContent = (count) => Array.from({ length: count }, (_, i) => ({
  id: `mock-${i}`,
  url: `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop&sig=${i}`,
  name: `Design_Asset_${i + 1}.jpg`,
  comments: [] 
}));

export const initialFolders = [
  { id: 1, name: "Minimalist Lofts", items: 6, date: "Oct 24", cover: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop", content: generateMockContent(6) },
  { id: 2, name: "Industrial Offices", items: 4, date: "Nov 02", cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop", content: generateMockContent(4) },
  { id: 3, name: "Eco-Brutalist", items: 8, date: "Nov 15", cover: "https://images.unsplash.com/photo-1518005020951-ecc8e1213bc4?q=80&w=800&auto=format&fit=crop", content: generateMockContent(8) },
  { id: 4, name: "Scandinavian Homes", items: 3, date: "Nov 18", cover: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=800&auto=format&fit=crop", content: generateMockContent(3) },
  { id: 5, name: "Dark Modernism", items: 7, date: "Nov 21", cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", content: generateMockContent(7) },
  { id: 6, name: "Luxury Retail", items: 5, date: "Nov 23", cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop", content: generateMockContent(5) },
];

export const initialChannels = [
  { 
    id: 'general', 
    name: '# general', 
    type: 'channel',
    description: 'General discussion about architecture and design.',
    members: [
      { id: 1, name: "Sarah Chen", role: "admin", avatar: "SC" },
      { id: 2, name: "Marcus V.", role: "member", avatar: "MV" },
      { id: 3, name: "Elena R.", role: "member", avatar: "ER" },
      { id: 4, name: "David K.", role: "member", avatar: "DK" },
      { id: 99, name: "You", role: "admin", avatar: "AT" }
    ]
  },
  { 
    id: 'feedback', 
    name: '# feedback', 
    type: 'channel',
    description: 'Request feedback on your latest blueprints and renders.',
    members: [
       { id: 1, name: "Sarah Chen", role: "admin", avatar: "SC" },
       { id: 99, name: "You", role: "admin", avatar: "AT" }
    ]
  },
  { id: 'showcases', name: '# showcases', type: 'channel', description: 'Show off your finished projects.', members: [] },
  { id: 'jobs', name: '# jobs', type: 'channel', description: 'Career opportunities and freelance gigs.', members: [] },
  { id: 'resources', name: '# resources', type: 'channel', description: 'Asset packs, textures, and tutorials.', members: [] }
];

export const initialMessages = [
  { id: 1, user: "Sarah Chen", avatar: "SC", text: "Has anyone tried the new brutalist texture pack?", time: "10:30 AM", isMe: false, channelId: 'general' },
  { id: 2, user: "You", avatar: "AT", text: "Yes! It works perfectly for the museum project I'm drafting.", time: "10:32 AM", isMe: true, channelId: 'general' },
  { id: 3, user: "Marcus V.", avatar: "MV", text: "Could you share the spec sheet for the lighting rendering? It looks incredible.", time: "10:45 AM", isMe: false, channelId: 'general' },
];

export const COLORS = {
  primary: '#aebf96',
  primaryDark: '#9aa885',
  background: '#000000',
  surface: '#0a0a0a',
  surfaceLight: '#121212',
  surfaceLighter: '#1a1a1a',
  border: 'rgba(255,255,255,0.05)',
  borderLight: 'rgba(255,255,255,0.1)',
  text: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
};
