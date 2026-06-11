import { create } from 'zustand';

interface TemporalCameraStoreState {
  selectedImages: string[];

  addSelectedImage: (image: string) => void;
  clearImages: () => void;
}

export const useCameraStore = create<TemporalCameraStoreState>()((set) => ({
  selectedImages: [],

  addSelectedImage: (image) => {
    //!actualizamos es state con la funcion dispatch set()
    set((state) => ({ selectedImages: [...state.selectedImages, image] }));
  },
 //! reseteamos el selectedImages a un arreglo vacio
  clearImages: () => set({ selectedImages: [] }),
}));