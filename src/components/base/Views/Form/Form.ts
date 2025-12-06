import { ensureElement } from "../../../../utils/utils";
import { Component } from "../../Component";
import { IEvents } from "../../Events";

export interface IForm {
  errors: string[];
  buttonDisabled: string | boolean;
}

export class Form<T extends IForm> extends Component<T> {
  protected formErrors: HTMLElement;
  protected formButton: HTMLButtonElement;
  protected formName: string;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.formButton = ensureElement<HTMLButtonElement>(
      ".button[type=submit]",
      this.container
    );
    this.formErrors = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );
    this.formName = this.container.getAttribute("name") || "form";

    // this.container.setAttribute('novalidate', 'true')

    this.container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.name) {
        let value = target.value;
        if (["address", "email", "phone"].includes(target.name)) {
          value = value.trim();
        }
        this.events.emit("form:input", {
          field: target.name,
          value: value,
        });
      }
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.formName}:submit`);
    });
  }

  set errors(errors: string[]) {
    this.formErrors.textContent = errors.join(". ");
  }
  set buttonDisabled(valid: string | boolean) {
    this.formButton.disabled = !valid;
  }
}
