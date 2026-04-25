import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Template {
  id: string;
  partyId: string;
  templateName: string;
  category: string;
  thumbnail: string;
  content: any;
  isOfficial: boolean;
  createdAt: string;
}

interface PartyLogo {
  id: string;
  partyId: string;
  logoUrl: string;
  slogan: string;
  color: string;
}

interface TemplateState {
  templates: Template[];
  partyLogos: PartyLogo[];
  currentTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  selectedPartyId: string | null;
}

const initialState: TemplateState = {
  templates: [],
  partyLogos: [],
  currentTemplate: null,
  isLoading: false,
  error: null,
  selectedPartyId: null,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTemplates: (state, action: PayloadAction<Template[]>) => {
      state.templates = action.payload;
    },
    setPartyLogos: (state, action: PayloadAction<PartyLogo[]>) => {
      state.partyLogos = action.payload;
    },
    addTemplate: (state, action: PayloadAction<Template>) => {
      state.templates.unshift(action.payload);
    },
    setCurrentTemplate: (state, action: PayloadAction<Template | null>) => {
      state.currentTemplate = action.payload;
    },
    setSelectedParty: (state, action: PayloadAction<string>) => {
      state.selectedPartyId = action.payload;
    },
    updateTemplate: (state, action: PayloadAction<Template>) => {
      const index = state.templates.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setTemplates,
  setPartyLogos,
  addTemplate,
  setCurrentTemplate,
  setSelectedParty,
  updateTemplate,
} = templateSlice.actions;

export default templateSlice.reducer;
