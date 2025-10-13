
'use client';

import { create, useStore } from 'zustand';
import type { ResizedImage, ResizingOptions } from '@/lib/types';
import { createContext, useContext, useRef, type ReactNode } from 'react';

export interface ImageState {
  images: ResizedImage[];
  resizingOptions: ResizingOptions | null;
  isResizing: boolean;
  resizeProgress: number;
  history: ResizedImage[][];
  historyIndex: number;
  setImages: (images: ResizedImage[] | ((currentImages: ResizedImage[]) => ResizedImage[])) => void;
  setResizingOptions: (options: ResizingOptions) => void;
  setIsResizing: (isResizing: boolean) => void;
  setResizeProgress: (progress: number | ((prev: number) => number)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
  reset: () => void;
}

export const createImageStore = () =>
  create<ImageState>((set, get) => ({
    images: [],
    resizingOptions: null,
    isResizing: false,
    resizeProgress: 0,
    history: [[]],
    historyIndex: 0,
    setImages: (updater) => {
        set((state) => {
          const newImages = typeof updater === 'function' ? updater(state.images) : updater;
          const imageMap = new Map(state.images.map(i => [i.id, i]));
          newImages.forEach(i => imageMap.set(i.id, i));
          return { images: Array.from(imageMap.values()) };
        });
      },
    setResizingOptions: (options) => set({ resizingOptions: options }),
    setIsResizing: (isResizing) => set({ isResizing }),
    setResizeProgress: (progress) =>
      set((state) => ({
        resizeProgress:
          typeof progress === 'function'
            ? progress(state.resizeProgress)
            : progress,
      })),
    saveToHistory: () => {
      set((state) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push([...state.images]);
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },
    undo: () => {
      set((state) => {
        if (state.historyIndex > 0) {
          return {
            images: state.history[state.historyIndex - 1],
            historyIndex: state.historyIndex - 1,
          };
        }
        return state;
      });
    },
    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          return {
            images: state.history[state.historyIndex + 1],
            historyIndex: state.historyIndex + 1,
          };
        }
        return state;
      });
    },
    canUndo: () => {
      const state = get();
      return state.historyIndex > 0;
    },
    canRedo: () => {
      const state = get();
      return state.historyIndex < state.history.length - 1;
    },
    reset: () =>
      set({
        images: [],
        resizingOptions: null,
        isResizing: false,
        resizeProgress: 0,
        history: [[]],
        historyIndex: 0,
      }),
  }));

export type ImageStore = ReturnType<typeof createImageStore>;

export const ImageStoreContext = createContext<ImageStore | null>(null);

export const ImageStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<ImageStore>();
  if (!storeRef.current) {
    storeRef.current = createImageStore();
  }
  return (
    <ImageStoreContext.Provider value={storeRef.current}>
      {children}
    </ImageStoreContext.Provider>
  );
};

export const useImageStore = <T,>(selector: (store: ImageState) => T): T => {
  const imageStoreContext = useContext(ImageStoreContext);

  if (!imageStoreContext) {
    throw new Error(`useImageStore must be used within ImageStoreProvider`);
  }

  return useStore(imageStoreContext, selector);
};

    