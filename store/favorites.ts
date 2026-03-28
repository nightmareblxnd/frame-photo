import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

interface FavoritesStore {
  items: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  setFavorites: (items: FavoriteItem[]) => void; 
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleFavorite: (item) => {
        const currentItems = get().items;
        const exists = currentItems.some((i) => i.id === item.id);
        
        if (exists) {
          set({ items: currentItems.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...currentItems, item] });
        }
      },

     
      setFavorites: (items) => {
        set({ items });
      },
      
    }),
    {
      name: 'favorites-storage',
    }
  )
);