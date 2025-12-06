import { TPayment } from "../../../../types";
import { ensureElement } from "../../../../utils/utils";
import { IEvents } from "../../Events";
import { Form, IForm } from "./Form";

interface IFormOrder extends IForm {
  address: string;
  payment: TPayment;
}

export class FormOrder extends Form<IFormOrder> {
  protected paymentButtons: HTMLButtonElement[];
  protected inputAddress: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.paymentButtons = [
      ensureElement<HTMLButtonElement>('button[name="card"]', this.container),
      ensureElement<HTMLButtonElement>('button[name="cash"]', this.container),
    ];
    this.inputAddress = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.paymentButtons.forEach((button: HTMLButtonElement) => {
      button.addEventListener("click", () => {
        this.events.emit("order:paymentChanged", {
          payment: button.name as TPayment,
        });
      });
    });
  }

  set payment(value: TPayment) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.inputAddress.value = value;
  }
}
