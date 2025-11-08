import {
  IApi,
  IOrderData,
  IOrderDataResponse,
  IProduct,
  IProductListResponse,
} from "../../types";

export class ShopApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductListResponse[]> {
    const products = await this.api.get<IProductListResponse[]>("/product/");
    return products;
  }

  async sendOrder(orderData: IOrderData): Promise<IOrderDataResponse> {
    await this.api.post("/order/", orderData);
  }
}
