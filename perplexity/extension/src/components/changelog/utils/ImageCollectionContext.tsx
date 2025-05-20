export const ImageCollectionContext = createContext(false);

export function useImageCollectionContext() {
  return use(ImageCollectionContext);
}
