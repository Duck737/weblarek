import { ensureElement } from "../../../utils/utils";
import { Card, ICard, ICardActions } from "./Card";

interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected basketCardIndex: HTMLElement;
  protected basketRemoveButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.basketCardIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    this.basketRemoveButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    if (actions?.onClick) {
      this.basketRemoveButton.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.basketCardIndex.textContent = String(value);
  }
}
