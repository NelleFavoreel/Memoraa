import { toast } from "react-toastify";

export default function useNotification() {
  const notifySuccess = (message) => {
    const width = window.innerWidth;
    console.log("Current width:", width);
    if (width >= 900) {
      toast.success(message);
    }
  };

  const notifyError = (message) => {
    const width = window.innerWidth;
    console.log("Current width:", width);
    if (width >= 900) {
      toast.error(message);
    }
  };

  return { notifySuccess, notifyError };
}
