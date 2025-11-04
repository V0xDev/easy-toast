type ToastVariant = "default" | "success" | "warning" | "error" | "info";

type ToastPosition =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type ToastConfig = {
  closeDuration: number;
  autoClose: boolean;
  position: ToastPosition;
  limit: number;
  pauseOnHover: boolean;
  closeOnClick: boolean;
  hideProgressbar: boolean;
};

export type { ToastVariant, ToastPosition, ToastConfig };
