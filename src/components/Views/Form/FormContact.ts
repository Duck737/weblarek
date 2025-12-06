import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form, IForm } from "./Form";

interface IFormContact extends IForm {
  email: string;
  phone: string;
}

export class FormContact extends Form<IFormContact> {
  protected inputEmail: HTMLInputElement;
  protected inputPhone: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.inputEmail = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.inputPhone = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );
  }

  set email(value: string) {
    this.inputEmail.value = value;
  }
  set phone(value: string) {
    this.inputPhone.value = value;
  }
}
