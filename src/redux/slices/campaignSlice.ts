import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Campaign {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'poster' | 'video';
  templateId: string;
  content: any;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
  draftCount: number;
  completedCount: number;
}

const initialState: CampaignState = {
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  error: null,
  draftCount: 0,
  completedCount: 0,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns = action.payload;
      state.draftCount = action.payload.filter(c => c.status === 'draft').length;
      state.completedCount = action.payload.filter(c => c.status === 'completed').length;
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.unshift(action.payload);
      if (action.payload.status === 'draft') {
        state.draftCount += 1;
      } else {
        state.completedCount += 1;
      }
    },
    updateCampaign: (state, action: PayloadAction<Campaign>) => {
      const index = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },
    setCurrentCampaign: (state, action: PayloadAction<Campaign | null>) => {
      state.currentCampaign = action.payload;
    },
    deleteCampaign: (state, action: PayloadAction<string>) => {
      const campaign = state.campaigns.find(c => c.id === action.payload);
      if (campaign) {
        if (campaign.status === 'draft') {
          state.draftCount -= 1;
        } else {
          state.completedCount -= 1;
        }
      }
      state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setCampaigns,
  addCampaign,
  updateCampaign,
  setCurrentCampaign,
  deleteCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
