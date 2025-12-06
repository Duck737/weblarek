import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modalCloseButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.modalCloseButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );
    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );

    this.modalCloseButton.addEventListener("click", () => {
      this.closeModalWindow();
    });
    this.container.addEventListener("click", (e: MouseEvent) => {
      if (e.target === this.container) {
        this.closeModalWindow();
      }
    });
  }

  set content(value: HTMLElement) {
    this.modalContent.replaceChildren(value);
  }

  openModalWindow(): void {
    this.container.classList.add("modal_active");
  }

  closeModalWindow(): void {
    this.container.classList.remove("modal_active");
  }
}
