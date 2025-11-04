import { Toast } from "../core/toast";
import type { ToastConfig } from "../types/toast";

const toastManager = new Toast();

function useToast() {
  const standard = (content: string, newConfig?: Partial<ToastConfig>) => {
    toastManager.create(newConfig, "default", content);
  };
  const info = (content: string, newConfig?: Partial<ToastConfig>) => {
    toastManager.create(newConfig, "info", content);
  };
  const success = (content: string, newConfig?: Partial<ToastConfig>) => {
    toastManager.create(newConfig, "success", content);
  };
  const warning = (content: string, newConfig?: Partial<ToastConfig>) => {
    toastManager.create(newConfig, "warning", content);
  };
  const error = (content: string, newConfig?: Partial<ToastConfig>) => {
    toastManager.create(newConfig, "error", content);
  };

  return { standard, info, success, warning, error };
}

export { useToast };
