import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(products: IProduct[]): void {
    this.products = products;

    this.events.emit("catalog:changed", { products: this.products });
  }

  getItems(): IProduct[] {
    return this.products;
  }

  getItemsById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedItem(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("product:selected");
  }

  getSelectedItem(): IProduct | null {
    return this.selectedProduct;
  }
}
