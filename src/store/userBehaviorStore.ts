import { create } from 'zustand';

export interface UserBehaviorState {
  currentPage: string;
  timeOnPage: number;
  scrollDepth: number;
  nodesClickedInBlueprint: string[];
  lastSemanticQuery: string;
  semanticQueryResultCount: number;
  sessionStartTime: number;
}

interface UserBehaviorActions {
  setCurrentPage: (page: string) => void;
  setTimeOnPage: (time: number) => void;
  setScrollDepth: (depth: number) => void;
  addClickedNode: (nodeId: string) => void;
  setLastSemanticQuery: (query: string) => void;
  setSemanticQueryResultCount: (count: number) => void;
  resetSession: () => void;
}

const initialState: UserBehaviorState = {
  currentPage: '/',
  timeOnPage: 0,
  scrollDepth: 0,
  nodesClickedInBlueprint: [],
  lastSemanticQuery: '',
  semanticQueryResultCount: 0,
  sessionStartTime: Date.now(),
};

export const useUserBehaviorStore = create<UserBehaviorState & UserBehaviorActions>((set, get) => ({
  ...initialState,

  setCurrentPage: (page) => {
    set({ 
      currentPage: page, 
      timeOnPage: 0, 
      scrollDepth: 0,
      sessionStartTime: Date.now()
    });
  },

  setTimeOnPage: (time) => set({ timeOnPage: time }),

  setScrollDepth: (depth) => set({ scrollDepth: depth }),

  addClickedNode: (nodeId) => {
    const current = get().nodesClickedInBlueprint;
    if (!current.includes(nodeId)) {
      set({ nodesClickedInBlueprint: [...current, nodeId] });
    }
  },

  setLastSemanticQuery: (query) => set({ lastSemanticQuery: query }),

  setSemanticQueryResultCount: (count) => set({ semanticQueryResultCount: count }),

  resetSession: () => set(initialState),
}));