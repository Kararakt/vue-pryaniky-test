export const usePopup = () => {
  const isPopupVisible = ref(false);

  const showPopup = () => {
    return (isPopupVisible.value = true);
  };

  const hidePopup = () => {
    return (isPopupVisible.value = false);
  };

  return {
    isPopupVisible,
    showPopup,
    hidePopup,
  };
};
