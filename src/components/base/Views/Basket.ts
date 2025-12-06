import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";
import { IEvents } from "../Events";

interface IBasket {
  list: HTMLElement[];
  totalPrice: number;
  basketOrderButtonDisabled?: boolean;
}

export class Basket extends Component<IBasket> {
  protected itemList: HTMLElement;
  protected itemsPrice: HTMLElement;
  protected basketOrderButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.itemList = ensureElement<HTMLElement>(".basket__list", this.container);
    this.itemsPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.basketOrderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.basketOrderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set list(items: HTMLElement[]) {
    this.itemList.replaceChildren(...items);
  }

  set totalPrice(value: number) {
    this.itemsPrice.textContent = `${value} синапсов`;
  }

  // todo:
  set basketOrderButtonDisabled(disabled: boolean) {
    this.basketOrderButton.disabled = disabled;
  }
}
