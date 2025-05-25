// src/hooks/useNotification.js
import { useToastStore } from "@heroui/toast";

export function useNotification() {
  const { addToast } = useToastStore();

  function notifySuccess(title, description = "") {
    addToast({
      title,
      description,
      type: "success",
    });
  }

  function notifyError(title, description = "") {
    addToast({
      title,
      description,
      type: "error",
    });
  }

  return { notifySuccess, notifyError };
}
