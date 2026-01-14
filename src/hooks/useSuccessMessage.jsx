import { useState } from "react";

export const useSuccessMessage = () => {
  const [modal, setModal] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const showSuccess = (message) => {
    setModal({
      open: true,
      type: "success",
      message,
    });
  };

  const showError = (message) => {
    setModal({
      open: true,
      type: "error",
      message,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  return {
    modal,
    showSuccess,
    showError,
    closeModal,
  };
};
