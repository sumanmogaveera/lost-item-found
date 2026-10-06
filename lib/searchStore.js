import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  filters: {
    q: '',
    category: '',
    location: '',
    status: '',
    area: '',
    timeframe: '',
    startDate: '',
    endDate: '',
  },
  setFilters: (newFilters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters } 
    })),
  resetFilters: () => 
    set({ 
      filters: { q: '', category: '', location: '', status: '', area: '', timeframe: '', startDate: '', endDate: '' } 
    }),
}));
