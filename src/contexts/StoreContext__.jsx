import React, { useState, useCallback, useEffect } from "react";

export const StoreContext = React.createContext();

export const StoreProvider = ({
  children,
  initialStore = null,
  initialProducts = [],
}) => {
  const [storeData, setStoreData] = useState(initialStore || {});
  const [storeProducts, setStoreProducts] = useState(initialProducts || []);

  // Sincronizar storeData cuando initialStore cambia
  useEffect(() => {
    if (initialStore) {
      setStoreData(initialStore);
    }
  }, [initialStore]);

  // Sincronizar storeProducts cuando initialProducts cambia
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setStoreProducts(initialProducts);
    }
  }, [initialProducts]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualizar datos de la tienda
  const updateStoreAppearance = useCallback((appearanceData) => {
    setStoreData((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        ...appearanceData,
      },
    }));
  }, []);

  // Alternar sección de destacados
  const toggleFeaturedSection = useCallback(
    (enabled) => {
      updateStoreAppearance({ showFeaturedSection: enabled });
    },
    [updateStoreAppearance]
  );

  // Alternar sección de ofertas
  const toggleOfferSection = useCallback(
    (enabled) => {
      updateStoreAppearance({ showOfferSection: enabled });
    },
    [updateStoreAppearance]
  );

  // Alternar slider
  const toggleSlider = useCallback(
    (enabled) => {
      updateStoreAppearance({ showSlider: enabled });
    },
    [updateStoreAppearance]
  );

  // Actualizar imágenes del slider
  const updateSliderImages = useCallback(
    (images) => {
      updateStoreAppearance({ sliderImages: images });
    },
    [updateStoreAppearance]
  );

  // Agregar imagen al slider
  const addSliderImage = useCallback((imageUrl) => {
    setStoreData((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        sliderImages: [...(prev.appearance?.sliderImages || []), imageUrl],
      },
    }));
  }, []);

  // Remover imagen del slider
  const removeSliderImage = useCallback((imageUrl) => {
    setStoreData((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        sliderImages:
          prev.appearance?.sliderImages?.filter((img) => img !== imageUrl) ||
          [],
      },
    }));
  }, []);

  // Establecer productos de la tienda
  /* const setStoreProductsList = useCallback((products) => {
        setStoreProducts(products);
    }, []); */
  const setStoreProductsList = useCallback((updater) => {
    setStoreProducts((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );
  }, []);

  // Actualizar un producto individual
  const updateProduct = useCallback((productId, updates) => {
    setStoreProducts((prev) =>
      prev.map((product) =>
        product._id === productId ? { ...product, ...updates } : product
      )
    );
  }, []);

  const value = {
    storeData,
    setStoreData,
    storeProducts,
    setStoreProductsList,
    updateProduct,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateStoreAppearance,
    toggleFeaturedSection,
    toggleOfferSection,
    toggleSlider,
    updateSliderImages,
    addSliderImage,
    removeSliderImage,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
