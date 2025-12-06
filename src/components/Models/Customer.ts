import { ICustomer, IValidation, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Customer {
  private payment: TPayment = "";
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  constructor(protected events: IEvents) {}

  setData(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    this.events.emit("customer:updated");
  }

  getData(): ICustomer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  clearData(): void {
    this.payment = "";
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events.emit("customer:updated");
  }

  validate(): IValidation {
    const errors: IValidation = {};

    if (!this.payment || this.payment.trim() === "") {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.address || this.address.trim() === "") {
      errors.address = "Укажите адрес";
    }
    if (!this.phone || this.phone.trim() === "") {
      errors.phone = "Укажите телефон";
    }
    if (!this.email || this.email.trim() === "") {
      errors.email = "Укажите email";
    }

    return errors;
  }
}
