import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  aiAssistantOpen: boolean;
  isSearchOpen: boolean;
  accentColor: string;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleAIAssistant: () => void;
  toggleSearch: () => void;
  setAccentColor: (color: string) => void;
  applyThemeToDOM: () => void;
}

const ACCENT_COLORS = {
  blue: 'blue',
  purple: 'purple',
  teal: 'teal',
  indigo: 'indigo',
  rose: 'rose',
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => {
      // Get system preference for dark/light mode
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme: Theme = 'system';
      const defaultAccentColor = ACCENT_COLORS.blue;
      
      // Function to apply theme to DOM
      const applyThemeToDOM = () => {
        const state = get();
        const isDark = 
          state.theme === 'dark' || 
          (state.theme === 'system' && prefersDark);
        
        // Apply dark mode class to HTML element
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      // Call once on initialization
      setTimeout(() => {
        applyThemeToDOM();
      }, 0);
      
      return {
        theme: defaultTheme,
      sidebarOpen: true,
      aiAssistantOpen: false,
        isSearchOpen: false,
        accentColor: defaultAccentColor,
        setTheme: (theme: Theme) => {
          set({ theme });
          setTimeout(() => get().applyThemeToDOM(), 0);
        },
        toggleTheme: () => {
          const currentTheme = get().theme;
          const newTheme: Theme = 
            currentTheme === 'light' ? 'dark' : 
            currentTheme === 'dark' ? 'system' : 'light';
          
          set({ theme: newTheme });
          setTimeout(() => get().applyThemeToDOM(), 0);
        },
        toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
        toggleAIAssistant: () => set((state) => ({ 
        aiAssistantOpen: !state.aiAssistantOpen 
      })),
        toggleSearch: () => set((state) => ({
          isSearchOpen: !state.isSearchOpen
        })),
        setAccentColor: (color: string) => set({ accentColor: color }),
        applyThemeToDOM,
      };
    },
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        accentColor: state.accentColor,
      })
    }
  )
);

// Add a listener for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme, applyThemeToDOM } = useUIStore.getState();
    if (theme === 'system') {
      applyThemeToDOM();
    }
  });
}