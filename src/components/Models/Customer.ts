import { ICustomer, IValidation, TPayment } from "../../types";

export class Customer {
  private payment: TPayment;
  private address: string;
  private phoneNumber: string;
  private email: string;

  constructor() {}

  setData(data: Partial<ICustomer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.phoneNumber !== undefined) {
      this.phoneNumber = data.phoneNumber;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
  }

  getData(): ICustomer {
    return {
      payment: this.payment,
      address: this.address,
      phoneNumber: this.phoneNumber,
      email: this.email,
    };
  }

  clearData(): void {
    this.payment = "";
    this.address = "";
    this.phoneNumber = "";
    this.email = "";
  }

  validate(): IValidation {
    const errors: IValidation = {};

    if (!this.payment || this.payment.trim() === "") {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.address || this.address.trim() === "") {
      errors.address = "Укажите адрес";
    }
    if (!this.phoneNumber || this.phoneNumber.trim() === "") {
      errors.phoneNumber = "Укажите телефон";
    }
    if (!this.email || this.email.trim() === "") {
      errors.email = "Укажите email";
    }

    return errors;
  }
}
