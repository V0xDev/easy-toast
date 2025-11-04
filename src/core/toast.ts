import {
  iconButtonClose,
  iconError,
  iconInfo,
  iconSuccess,
  iconWarning,
} from "../components/icons";
import type { ToastConfig, ToastVariant } from "../types/toast";

let defaultConfig: ToastConfig = {
  closeDuration: 3000,
  autoClose: true,
  position: "top-right",
  limit: 5,
  pauseOnHover: true,
  closeOnClick: false,
  hideProgressbar: false,
};

class ToastInstance {
  element: HTMLDivElement;
  #config: ToastConfig;

  #timerId?: number;
  #appearAnimationId?: number;
  #progressbar?: HTMLElement;
  #remaining: number;
  #startTime: number;

  constructor(variant: ToastVariant, textContent: string, config: ToastConfig) {
    this.#config = config;
    this.#remaining = config.closeDuration;
    this.#startTime = Date.now();
    this.element = this.#buildToastElement(variant, textContent, config);
    this.#attachListeners();
  }

  show(container: HTMLElement) {
    container.appendChild(this.element);

    this.#appearAnimationId = requestAnimationFrame(() => {
      this.element.classList.add("--show");
      this.#appearAnimationId = undefined;
    });

    if (this.#config.autoClose) {
      this.#startTimer();
    }
  }

  #remove() {
    if (this.element.classList.contains("--removing")) return;
    this.element.classList.add("--removing");

    if (this.#appearAnimationId) cancelAnimationFrame(this.#appearAnimationId);
    if (this.#timerId) clearTimeout(this.#timerId);
    if (this.#progressbar)
      this.#progressbar.style.animationPlayState = "paused";

    this.element.classList.remove("--show");
    this.element.addEventListener(
      "transitionend",
      () => this.element.remove(),
      { once: true }
    );
  }

  #attachListeners() {
    if (this.#config.autoClose && this.#config.pauseOnHover) {
      this.element.addEventListener(
        "mouseenter",
        this.#handleMouseEnter.bind(this)
      );
      this.element.addEventListener(
        "mouseleave",
        this.#handleMouseLeave.bind(this)
      );
    }

    if (this.#config.closeOnClick) {
      this.element.addEventListener("click", () => this.#remove());
    }

    this.element
      .querySelector("[data-toast-close]")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.#remove();
      });
  }

  #startTimer() {
    this.#startTime = Date.now();
    this.#timerId = window.setTimeout(() => this.#remove(), this.#remaining);
  }

  #handleMouseEnter() {
    if (!this.#timerId) return;
    clearTimeout(this.#timerId);
    this.#timerId = undefined;
    this.#remaining -= Date.now() - this.#startTime;
    if (this.#progressbar)
      this.#progressbar.style.animationPlayState = "paused";
  }

  #handleMouseLeave() {
    if (this.#timerId) return;
    if (this.#progressbar)
      this.#progressbar.style.animationPlayState = "running";
    this.#startTimer();
  }

  #buildToastElement(
    variant: ToastVariant,
    textContent: string,
    config: ToastConfig
  ) {
    const toastElement = document.createElement("div");
    toastElement.className = `toast --variant-${variant}`;

    if (config.closeOnClick) {
      toastElement.classList.add("--closeOnClick");
    }

    const alertElement = this.#buildAlert();
    const iconElement = this.#buildIcon(variant);

    if (iconElement) {
      alertElement.appendChild(iconElement);
    }

    alertElement.append(
      this.#buildContent(textContent),
      this.#buildCloseButton()
    );

    if (!config.hideProgressbar && config.autoClose) {
      alertElement.appendChild(this.#buildProgressbar(config));
    }

    toastElement.appendChild(alertElement);
    return toastElement;
  }

  #buildAlert() {
    const alertElement = document.createElement("div");
    alertElement.className = "toast-alert";
    return alertElement;
  }

  #buildIcon(variant: ToastVariant) {
    const icons: Record<ToastVariant, string | undefined> = {
      default: undefined,
      error: iconError,
      info: iconInfo,
      success: iconSuccess,
      warning: iconWarning,
    };
    const iconHTML = icons[variant];

    if (!iconHTML) return null;

    const iconElement = document.createElement("div");
    iconElement.className = "before";
    iconElement.innerHTML = iconHTML;
    return iconElement;
  }

  #buildContent(textContent: string) {
    const contentElement = document.createElement("div");
    contentElement.className = "content";
    contentElement.innerText = textContent;
    return contentElement;
  }

  #buildCloseButton() {
    const afterElement = document.createElement("div");
    afterElement.className = "after";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.setAttribute("data-toast-close", "true");
    closeButton.innerHTML = iconButtonClose;

    afterElement.appendChild(closeButton);
    return afterElement;
  }

  #buildProgressbar(config: ToastConfig) {
    const progressbarWrapper = document.createElement("div");
    progressbarWrapper.className = "toast-progressbar";

    this.#progressbar = document.createElement("div");
    this.#progressbar.className =
      "toast-progressbar-animation toast-progressbar-animation-start";
    this.#progressbar.style.animationDuration = `${config.closeDuration}ms`;

    progressbarWrapper.appendChild(this.#progressbar);
    return progressbarWrapper;
  }
}

class Toast {
  #wrapper: HTMLDivElement;

  constructor(initialConfig: Partial<ToastConfig> = {}) {
    defaultConfig = { ...defaultConfig, ...initialConfig };
    this.#wrapper = this.#createWrapper();
  }

  #createWrapper() {
    let easyToastRoot = document.querySelector(".easy-toast") as HTMLDivElement;
    if (easyToastRoot) {
      const existingWrapper = easyToastRoot.querySelector(
        ".easy-toast-wrapper"
      ) as HTMLDivElement;
      if (existingWrapper) return existingWrapper;
    }
    if (!easyToastRoot) {
      easyToastRoot = document.createElement("div");
      easyToastRoot.className = "easy-toast";
      document.body.appendChild(easyToastRoot);
    }

    const wrapper = document.createElement("div");
    wrapper.className = "easy-toast-wrapper";
    wrapper.classList.add(`--${defaultConfig.position}`);
    easyToastRoot.appendChild(wrapper);
    console.log("%c✅ easy-toast initialized", "color: #00944fff;");
    return wrapper;
  }

  create(
    newConfig: Partial<ToastConfig> = {},
    variant: ToastVariant,
    textContent: string
  ) {
    const config = { ...defaultConfig, ...newConfig };

    const currentToastCount = this.#wrapper.children.length;
    if (config.limit > 0 && currentToastCount >= config.limit) {
      return;
    }

    this.#wrapper.className = `easy-toast-wrapper --${config.position}`;

    const toastInstance = new ToastInstance(variant, textContent, config);
    toastInstance.show(this.#wrapper);
  }
}

export { Toast };
