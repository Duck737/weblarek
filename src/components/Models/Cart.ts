import { IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";

export class Cart {
  private cartItems: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.cartItems;
  }

  addItem(product: IProduct): void {
    this.cartItems.push(product);
    this.events.emit("basket:changed");
  }

  removeItem(productId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
    this.events.emit("basket:changed");
  }

  clearCart(): void {
    this.cartItems = [];
    this.events.emit("basket:changed");
  }

  getTotalPrice(): number {
    let total = 0;

    for (const item of this.cartItems) {
      total = total + (item.price ?? 0);
    }

    return total;
  }

  getTotalItems(): number {
    return this.cartItems.length;
  }

  checkCartItemById(productId: string): boolean {
    return this.cartItems.some((item) => item.id === productId);
  }
}
