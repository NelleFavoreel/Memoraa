import { toast } from "react-toastify";

export default function useNotification() {
  const notifySuccess = (message) => {
    toast.success(message);
  };

  const notifyError = (message) => {
    toast.error(message);
  };

  return { notifySuccess, notifyError };
}
