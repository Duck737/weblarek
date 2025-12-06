import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
  totalPrice: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected orderTitle: HTMLElement;
  protected orderDescription: HTMLElement;
  protected orderCloseButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.orderTitle = ensureElement<HTMLElement>(
      ".order-success__title",
      this.container
    );
    this.orderDescription = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.orderCloseButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.orderCloseButton.addEventListener("click", () => {
      this.events.emit("success:confirm");
    });
  }

  set totalPrice(value: number) {
    this.orderDescription.textContent = `Списано ${value} синапсов`;
  }
}
