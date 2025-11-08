import { IProduct } from "../../types";

export class Cart {
  private cartItems: IProduct[] = [];

  constructor() {}

  getItems(): IProduct[] {
    return this.cartItems;
  }

  addItem(product: IProduct): void {
    this.cartItems.push(product);
  }

  removeItem(productId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  getTotalPrice(): number {
    let total = 0;

    for (const item of this.cartItems) {
      total = total + item.price;
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
