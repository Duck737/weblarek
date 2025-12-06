import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../Component";

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export interface ICard {
  title: string;
  price: number | null;
}

export class Card<T extends ICard> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(protected container: HTMLElement) {
    super(container);

    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.cardPrice.textContent = "Бесценно";
    } else {
      this.cardPrice.textContent = `${value} синапсов`;
    }
  }
}
