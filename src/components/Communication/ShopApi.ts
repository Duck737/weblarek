import {
  IApi,
  IOrderData,
  IOrderDataResponse,
  IProductListResponse,
} from "../../types";

export class ShopApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProductListResponse> {
    const products = await this.api.get<IProductListResponse>("/product/");
    return products;
  }

  async sendOrder(orderData: IOrderData): Promise<IOrderDataResponse> {
    return await this.api.post("/order/", orderData);
  }
}
