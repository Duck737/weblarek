import { IProduct } from "../../types";

export class Products {
  private products: IProduct[];

  private selectedProduct: IProduct | null;

  constructor() {}

  setItems(products: IProduct[]): void {
    this.products = products;
  }

  getItems(): IProduct[] {
    return this.products;
  }

  getItemsById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedItem(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedItem(): IProduct | null {
    return this.selectedProduct;
  }
}
