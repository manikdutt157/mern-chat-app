import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettings = create(
  persist(
    (set) => ({
      showComposingIndicator: true,
      toggleComposingIndicator: () =>
        set((state) => ({ showComposingIndicator: !state.showComposingIndicator })),
    }),
    {
      name: 'user-settings',
    }
  )
);

export default useSettings; 