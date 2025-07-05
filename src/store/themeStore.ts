import { create } from 'zustand';

export type ThemeSkin = 'galyarderos' | 'blueprint' | 'terminal' | 'quantum';

export interface ThemeState {
  currentSkin: ThemeSkin;
  isArchitectLevel: boolean;
  hasUnlockedReality: boolean;
}

interface ThemeActions {
  setSkin: (skin: ThemeSkin) => void;
  setArchitectLevel: (isArchitect: boolean) => void;
  unlockReality: () => void;
  applyTheme: () => void;
}

const initialState: ThemeState = {
  currentSkin: 'galyarderos',
  isArchitectLevel: false,
  hasUnlockedReality: false,
};

export const useThemeStore = create<ThemeState & ThemeActions>((set, get) => ({
  ...initialState,

  setSkin: (skin) => {
    set({ currentSkin: skin });
    localStorage.setItem('galyarder_reality_skin', skin);
    get().applyTheme();
  },

  setArchitectLevel: (isArchitect) => {
    set({ isArchitectLevel: isArchitect });
    if (isArchitect && !get().hasUnlockedReality) {
      get().unlockReality();
    }
  },

  unlockReality: () => {
    set({ hasUnlockedReality: true });
    localStorage.setItem('galyarder_reality_unlocked', 'true');
  },

  applyTheme: () => {
    const { currentSkin } = get();
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-galyarderos', 'theme-blueprint', 'theme-terminal', 'theme-quantum');
    
    // Apply new theme
    root.classList.add(`theme-${currentSkin}`);
  },
}));

// Initialize theme on load
if (typeof window !== 'undefined') {
  const storedSkin = localStorage.getItem('galyarder_reality_skin') as ThemeSkin;
  const realityUnlocked = localStorage.getItem('galyarder_reality_unlocked') === 'true';
  
  if (storedSkin && realityUnlocked) {
    useThemeStore.getState().setSkin(storedSkin);
    useThemeStore.getState().unlockReality();
  }
}