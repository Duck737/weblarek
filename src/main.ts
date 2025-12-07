import { Api } from "./components/base/Api";
import { Cart } from "./components/Models/Cart";
import { Customer } from "./components/Models/Customer";
import { Products } from "./components/Models/Products";
import { ShopApi } from "./components/Communication/ShopApi";
import "./scss/styles.scss";
import { API_URL } from "./utils/constants";
import { CardCatalog } from "./components/Views/Card/CardCatalog.ts";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Gallery } from "./components/Views/Gallery.ts";
import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/Views/Modal.ts";
import { CardModal } from "./components/Views/Card/CardModal.ts";
import { Basket } from "./components/Views/Basket.ts";
import { Header } from "./components/Views/Header.ts";
import { IOrderData, IProduct, TPayment } from "./types";
import { CardBasket } from "./components/Views/Card/CardBasket.ts";
import { FormOrder } from "./components/Views/Form/FormOrder.ts";
import { FormContact } from "./components/Views/Form/FormContact.ts";
import { OrderSuccess } from "./components/Views/OrderSuccess.ts";

const api = new Api(API_URL);
const shopApi = new ShopApi(api);
const events = new EventEmitter();

const productsModel = new Products(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);

const header = new Header(events, ensureElement<HTMLElement>(".header"));

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));

const cardPreviewTemplate = cloneTemplate<HTMLElement>("#card-preview");
const cardPreview = new CardModal(cardPreviewTemplate, {
  onClick: () => {
    const item = productsModel.getSelectedItem();
    if (!item) return;

    if (cartModel.checkCartItemById(item.id)) {
      cartModel.removeItem(item.id);
    } else {
      cartModel.addItem(item);
    }
    events.emit("product:selected");
  },
});

const basketTemplate = cloneTemplate<HTMLElement>("#basket");
const basket = new Basket(events, basketTemplate);

let currentStep: "order" | "contacts" = "order";
const orderTemplate = cloneTemplate<HTMLElement>("#order");
const formOrder = new FormOrder(events, orderTemplate);

const contactsTemplate = cloneTemplate<HTMLElement>("#contacts");
const formContacts = new FormContact(events, contactsTemplate);

const orderSuccessTemplate = cloneTemplate<HTMLElement>("#success");
const orderSuccess = new OrderSuccess(events, orderSuccessTemplate);

events.on("catalog:changed", () => {
  const itemCards = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), {
      onClick: () => productsModel.setSelectedItem(item),
    });
    return card.render(item);
  });
  gallery.render({ items: itemCards });
});

events.on("product:selected", () => {
  const item = productsModel.getSelectedItem();
  if (!item) return;

  const isInCart = cartModel.checkCartItemById(item.id);

  modal.render({
    content: cardPreview.render({
      ...item,
      buttonDisabled: item.price === null,
      addButtonText:
        item.price === null
          ? "Недоступно"
          : isInCart
          ? "Удалить из корзины"
          : "В корзину",
    }),
  });
  modal.openModalWindow();
});

events.on("basket:open", () => {
  modal.render({ content: basket.render() });
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
  const customerData = customerModel.getData();
  const validation = customerModel.validate();
  const errors = [validation.email, validation.phone].filter((e): e is string =>
    Boolean(e)
  );
  modal.render({
    content: formContacts.render({
      email: customerData.email,
      phone: customerData.phone,
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
  shopApi
    .sendOrder(orderData)
    .then(() => {
      orderSuccess.totalPrice = orderData.total;
      cartModel.clearCart();
      customerModel.clearData();
      modal.render({ content: orderSuccess.render() });
    })
    .catch((error) => console.error("Ошибка заказа: ", error));
});

events.on("customer:updated", () => {
  const customerData = customerModel.getData();
  const validation = customerModel.validate();

  if (currentStep === "order") {
    const errors = [validation.payment, validation.address].filter(
      (e): e is string => Boolean(e)
    );
    formOrder.render({
      ...customerData,
      buttonDisabled: errors.length === 0,
      errors,
    });
  } else {
    const errors = [validation.email, validation.phone].filter(
      (e): e is string => Boolean(e)
    );
    formContacts.render({
      email: customerData.email,
      phone: customerData.phone,
      buttonDisabled: errors.length === 0,
      errors,
    });
  }
});

events.on("basket:order", () => {
  currentStep = "order";
  const customerData = customerModel.getData();
  const validation = customerModel.validate();
  const errors = [validation.payment, validation.address].filter(
    (e): e is string => Boolean(e)
  );
  modal.render({
    content: formOrder.render({
      ...customerData,
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
