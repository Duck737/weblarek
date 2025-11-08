import { Api } from "./components/base/Api";
import { Cart } from "./components/Models/Cart";
import { Customer } from "./components/Models/Customer";
import { Products } from "./components/Models/Products";
import { ShopApi } from "./components/Communication/ShopApi";
import "./scss/styles.scss";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

const productsModel = new Products();
const cartModel = new Cart();
const customerModel = new Customer();
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

// Каталог
productsModel.setItems(apiProducts.items);
console.log(`Массив товаров из каталога: `, productsModel.getItems());
console.log(
  `Товар по id: `,
  productsModel.getItemsById("412bcf81-7e75-4e70-bdb9-d3c73c9803b7")
);
productsModel.setSelectedItem(apiProducts.items[0]);
console.log(`Выбранный товар: `, productsModel.getSelectedItem());

// Корзина
console.log(`Корзина:`, [...cartModel.getItems()]);
cartModel.addItem(apiProducts.items[1]);
cartModel.addItem(apiProducts.items[2]);
cartModel.addItem(apiProducts.items[3]);
cartModel.addItem(apiProducts.items[0]);
console.log(`Заполненная корзина: `, cartModel.getItems());
console.log(`Товаров в корзине:`, cartModel.getTotalItems());
console.log(
  `Проверка товара в корзине по id`,
  cartModel.checkCartItemById("b06cde61-912f-4663-9751-09956c0eed67")
);
console.log(
  `Проверка несуществующего товара в корзине по id`,
  cartModel.checkCartItemById("b06cde61-912f-4663-9751-09956c0eed6")
);
cartModel.removeItem(apiProducts.items[1].id);
console.log(`Товаров в корзине после удаления:`, cartModel.getTotalItems());
console.log(`Сумма покупки:`, cartModel.getTotalPrice());
cartModel.clearCart();
console.log(`Товаров в корзине после очистки:`, cartModel.getTotalItems());

// Покупатель
customerModel.saveData({
  address: "abc",
  email: "@mail",
  payment: "cash",
});
console.log(`Покупатель:`, customerModel.getData());
console.log(customerModel.validate());
customerModel.clearData();
console.log(`Покупатель после очистки:`, customerModel.getData());

// API
const response = await shopApi.getProducts();
console.log(response);
productsModel.setItems(response.items);
console.log(`Данные с сервера: `, productsModel.products);
