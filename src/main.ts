import { useToast } from "./hooks/toast";

function pageLoad() {
  const { standard, info, success, warning, error } = useToast();
  const btnDefault = document.querySelector(".btnDefault");
  const btnInfo = document.querySelector(".btnInfo");
  const btnSuccess = document.querySelector(".btnSuccess");
  const btnWarning = document.querySelector(".btnWarning");
  const btnError = document.querySelector(".btnError");

  btnDefault?.addEventListener("click", () => {
    standard("Заявка на рассмотрении", {
      position: "top-left",
      closeOnClick: true,
    });
  });

  btnInfo?.addEventListener("click", () => {
    info("Заявка была успешно добавлена", {
      position: "bottom-center",
    });
  });

  btnSuccess?.addEventListener("click", () => {
    success("Заявка была успешно отправлена", {
      position: "top-right",
    });
  });

  btnWarning?.addEventListener("click", () => {
    warning("Внимание!! Заявка находится в обработке", {
      position: "bottom-left",
    });
  });

  btnError?.addEventListener("click", () => {
    error("Слишком много заявок, повторите позже...", {
      position: "bottom-right",
    });
  });
}
pageLoad();
