import { categoryMap, CDN_URL } from "../../../../utils/constants";
import { ensureElement } from "../../../../utils/utils";
import { Card, ICard, ICardActions } from "./Card";

interface ICardModal extends ICard {
  image: string;
  category: string;
  description: string;
  id: string;
  addButtonText: string;
  buttonDisabled: boolean;
}

type CategoryKey = keyof typeof categoryMap;

export class CardModal extends Card<ICardModal> {
  protected cardImage: HTMLImageElement;
  protected cardCategory: HTMLElement;
  protected cardDescription: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.cardDescription = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    if (actions?.onClick) {
      this.cardButton.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this.cardCategory.textContent = value;

    for (const key in categoryMap) {
      this.cardCategory.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set image(value: string) {
    this.setImage(this.cardImage, CDN_URL + value, this.title);
  }

  set description(value: string) {
    this.cardDescription.textContent = value;
  }

  set addButtonText(value: string) {
    this.cardButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}
