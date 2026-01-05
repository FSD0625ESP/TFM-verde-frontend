import React, { useState, useCallback, useEffect, useMemo } from "react";

export const StoreContext = React.createContext();

export const StoreProvider = ({
  children,
  initialStore = null,
  initialProducts = [],
  initialCategories = [],
}) => {
  const [storeData, setStoreData] = useState(initialStore || {});
  const [storeProducts, setStoreProducts] = useState(initialProducts || []);
  const [allCategories, setAllCategories] = useState(initialCategories || []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //console.log("StoreProvider - received categories (all):", allCategories);

  // sincronizar store
  useEffect(() => {
    if (initialStore) setStoreData(initialStore);
  }, [initialStore]);

  // sincronizar productos
  useEffect(() => {
    if (storeProducts.length === 0 && initialProducts?.length) {
      setStoreProducts(initialProducts);
    }
  }, [initialProducts]);

  // sincronizar categorías
  useEffect(() => {
    setAllCategories(initialCategories || []);
  }, [initialCategories]);

  /* =====================
     CATEGORIES
  ===================== */
  const storeCategories = useMemo(() => {
    if (!storeData?.categories?.length || !allCategories.length) {
      return [];
    }

    const storeCategoryIds = storeData.categories.map((c) =>
      typeof c === "string" ? c : c._id
    );

    const filteredCategories = allCategories.filter((cat) =>
      storeCategoryIds.some((id) => String(id) === String(cat._id))
    );
    //console.log("StoreProvider - store categories:", filteredCategories);

    return filteredCategories;
  }, [storeData?.categories, allCategories]);

  /* =====================
     PRODUCTS
  ===================== */
  const setStoreProductsList = useCallback((updater) => {
    setStoreProducts((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );
  }, []);

  const updateProduct = useCallback((productId, updates) => {
    setStoreProducts((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, ...updates } : p))
    );
  }, []);

  /* =====================
     APPEARANCE
  ===================== */
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

  const value = {
    storeData,
    setStoreData,
    storeProducts,
    setStoreProductsList,
    updateProduct,
    allCategories,
    storeCategories,
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
