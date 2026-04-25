// Mock data for templates
export const MOCK_TEMPLATES = [
  {
    id: 'template_1',
    partyId: 'BJP',
    templateName: 'Election 2024 Blue',
    category: 'election',
    thumbnail: 'https://via.placeholder.com/200x200?text=Template+1',
    content: { type: 'basic' },
    isOfficial: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'template_2',
    partyId: 'INC',
    templateName: 'Congress Classic',
    category: 'election',
    thumbnail: 'https://via.placeholder.com/200x200?text=Template+2',
    content: { type: 'basic' },
    isOfficial: true,
    createdAt: new Date().toISOString(),
  },
];

// Mock data for party logos
export const MOCK_PARTY_LOGOS = [
  {
    id: 'logo_1',
    partyId: 'BJP',
    logoUrl: 'https://via.placeholder.com/100x100?text=BJP',
    slogan: 'Bharat Ko Banayenge Atmanirbhar',
    color: '#FF9900',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'logo_2',
    partyId: 'INC',
    logoUrl: 'https://via.placeholder.com/100x100?text=INC',
    slogan: 'Save India',
    color: '#3366CC',
    createdAt: new Date().toISOString(),
  },
];

// Mock campaigns
export const MOCK_CAMPAIGNS = [
  {
    id: 'campaign_1',
    userId: 'user_1',
    title: 'Election Drive 2024',
    description: 'Campaign for local elections',
    type: 'poster',
    templateId: 'template_1',
    content: {},
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'campaign_2',
    userId: 'user_1',
    title: 'Social Awareness',
    description: 'Awareness campaign',
    type: 'video',
    templateId: 'template_1',
    content: {},
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
