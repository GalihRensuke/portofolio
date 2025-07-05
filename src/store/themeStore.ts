import { create } from 'zustand';

export type ThemeSkin = 'galyarderos' | 'blueprint' | 'terminal' | 'quantum';

export interface ThemeState {
  currentSkin: ThemeSkin;
  isArchitectLevel: boolean;
  hasUnlockedReality: boolean;
  isDarkMode: boolean;
}

interface ThemeActions {
  setSkin: (skin: ThemeSkin) => void;
  setArchitectLevel: (isArchitect: boolean) => void;
  unlockReality: () => void;
  applyTheme: () => void;
  toggleTheme: () => void;
}

const initialState: ThemeState = {
  currentSkin: 'galyarderos',
  isArchitectLevel: false,
  hasUnlockedReality: false,
  isDarkMode: false,
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

  toggleTheme: () => {
    const { isDarkMode } = get();
    set({ isDarkMode: !isDarkMode });
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('galyarder_dark_mode', !isDarkMode ? 'true' : 'false');
  },

  applyTheme: () => {
    const { currentSkin, isDarkMode } = get();
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-galyarderos', 'theme-blueprint', 'theme-terminal', 'theme-quantum');
    
    // Add new theme class
    root.classList.add(`theme-${currentSkin}`);
    
    // Apply dark mode if enabled
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
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