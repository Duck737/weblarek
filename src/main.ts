import { Api } from "./components/base/Api";
import { Cart } from "./components/Models/Cart";
import { Customer } from "./components/Models/Customer";
import { Products } from "./components/Models/Products";
import { ShopApi } from "./components/Communication/ShopApi";
import "./scss/styles.scss";
import { API_URL } from "./utils/constants";
import { CardCatalog } from "./components/base/Views/Card/CardCatalog";
import { cloneTemplate } from "./utils/utils";
import { Gallery } from "./components/base/Views/Gallery";
import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/base/Views/Modal";
import { CardModal } from "./components/base/Views/Card/CardModal";
import { Basket } from "./components/base/Views/Basket";
import { Header } from "./components/base/Views/Header";
import { IOrderData, IProduct, TPayment } from "./types";
import { CardBasket } from "./components/base/Views/Card/CardBasket.ts";
import { FormOrder } from "./components/base/Views/Form/FormOrder.ts";
import { FormContact } from "./components/base/Views/Form/FormContact.ts";
import { OrderSuccess } from "./components/base/Views/OrderSuccess.ts";

const api = new Api(API_URL);
const shopApi = new ShopApi(api);
const events = new EventEmitter();

const productsModel = new Products(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);

const gallery = new Gallery(document.querySelector(".gallery") as HTMLElement);

const modal = new Modal(events, document.querySelector("#modal-container") as HTMLElement);

const header = new Header(events, document.querySelector(".header") as HTMLElement);

const basketTemplate = cloneTemplate<HTMLElement>("#basket");
const basket = new Basket(events, basketTemplate);

let currentStep: 'order' | 'contacts' = 'order';
const orderTemplate = cloneTemplate<HTMLElement>("#order");
const formOrder = new FormOrder(events, orderTemplate);

const contactsTemplate = cloneTemplate<HTMLElement>("#contacts");
const formContacts = new FormContact(events, contactsTemplate);

const orderSuccessTemplate = cloneTemplate<HTMLElement>("#success");
const orderSuccess = new OrderSuccess(events, orderSuccessTemplate);


events.on("catalog:changed", () => {
  const itemCards = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render(item);
  });
  gallery.render({ items: itemCards });
});

events.on("card:select", (item: IProduct) => {
  const isInCart = cartModel.checkCartItemById(item.id);
  const cardPreview = new CardModal(cloneTemplate("#card-preview"), {
    onClick: () => {
      if (isInCart) {
        cartModel.removeItem(item.id);
      } else {
        cartModel.addItem(item);
      }
      events.emit("card:select", item);
    },
  });
  modal.render({
    content: cardPreview.render({
      ...item,
      buttonDisabled: item.price === null,
      addButtonText: isInCart ? "Удалить из корзины" : "В корзину",
    }),
  });
  modal.openModalWindow();
});

events.on("basket:open", () => {
  events.emit("basket:changed");
  modal.openModalWindow();
});

events.on("basket:removed", (item: IProduct) => {
  cartModel.removeItem(item.id);
});

events.on("basket:changed", () => {
  const cartTotalItems = cartModel.getTotalItems();
  header.render({ counter: cartTotalItems });

  const cartItems = cartModel.getItems().map((item, index) => {
    const cartItem = new CardBasket(cloneTemplate("#card-basket"), {
      onClick: () => events.emit("basket:removed", item),
    });
    return cartItem.render({
      price: item.price,
      title: item.title,
      index: index + 1,
    });
  });

  const renderedBasket = basket.render({
    list: cartItems,
    totalPrice: cartModel.getTotalPrice(),
    basketOrderButtonDisabled: cartTotalItems === 0,
  });

  modal.render({ content: renderedBasket });
});

events.on("order:paymentChanged", (data: { payment: TPayment }) => {
  customerModel.setData({
    payment: data.payment,
  });
});

events.on("form:input", (data: { field: string; value: string }) => {
  const fieldMap: Record<string, string> = {
    address: "address",
    email: "email",
    phone: "phone",
  };

  const modelField = fieldMap[data.field];
  if (modelField) {
    customerModel.setData({ [modelField]: data.value });
  }
});

events.on("order:submit", () => {
  currentStep = "contacts";
  const customerInfo = customerModel.getData();
  const validation = customerModel.validate();
  const errors = [validation.email, validation.phone].filter(
    (e): e is string => Boolean(e)
  );
  modal.render({
    content: formContacts.render({
      email: customerInfo.email,
      phone: customerInfo.phone,
      buttonDisabled: errors.length === 0,
      errors,
    }),
  });
});

events.on("contacts:submit", () => {
  const orderData: IOrderData = {
    ...customerModel.getData(),
    total: cartModel.getTotalPrice(),
    items: cartModel.getItems().map((item) => item.id),
  };
  shopApi.sendOrder(orderData).then(() => {
    orderSuccess.totalPrice = orderData.total;
    cartModel.clearCart();
    customerModel.clearData();
    modal.render({ content: orderSuccess.render() });
  })
  .catch(error => console.error("Ошибка заказа: ", error));
});

events.on("customer:updated", () => {
  const validation = customerModel.validate();

  if (currentStep === "order") {
    const errors = [validation.payment, validation.address].filter((e): e is string => Boolean(e));
    formOrder.render({
      ...customerModel.getData(),
      buttonDisabled: errors.length === 0,
      errors,
    });
  } else {
    const errors = [validation.email, validation.phone].filter((e): e is string => Boolean(e));
    formContacts.render({
      email: customerModel.getData().email,
      phone: customerModel.getData().phone,
      buttonDisabled: errors.length === 0,
      errors,
    });
  }
});

events.on("basket:order", () => {
  currentStep = 'order'
  if (cartModel.getTotalItems() === 0) {
    return;
  }

  const validation = customerModel.validate();
  const errors = [validation.payment, validation.address].filter(
    (e): e is string => Boolean(e)
  );
  modal.render({
    content: formOrder.render({
      ...customerModel.getData(),
      buttonDisabled: errors.length === 0,
      errors,
    }),
  });
});

events.on("success:confirm", () => {
  modal.closeModalWindow();
});

// API
const loadProduct = async () => {
  try {
    const res = await shopApi.getProducts();
    productsModel.setItems(res.items);
  } catch (err) {
    console.log(err);
  }
};

loadProduct();
