let customerCart = JSON.parse(localStorage.getItem("cartStorage")) || [];


if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

const shopProducts = [];

function ready () {

  switch(document.body.id) {
    case "index":
      generateDadJoke();
      populateCart();
      break;
    case "shop": 
      generateProductCards();
      populateCart();
      break;
    case "cart":
      populateCartCheckout();
      break;
    default:
      populateCart();
      break;
  }


  const removeCartItemButtons = document.getElementsByClassName("btn-remove-cart-item");
  for(let i = 0; i < removeCartItemButtons.length; i++) {
  const button = removeCartItemButtons[i];
  button.addEventListener("click", removeCartItem);
  }

  let quantity = document.getElementsByClassName("cart-item-quantity-input");
  for(let i = 0; i < quantity.length; i++) {
    const input = quantity[i];
    input.addEventListener("change", quantityChanged);
  }

  const openCartButton = document.getElementsByClassName("btn-open-cart");
  for(let i = 0; i < openCartButton.length; i++) {
    const button = openCartButton[i];
    button.addEventListener("click", updateCartTotal);
  }


  if(document.body.id === "cart") {
    document.getElementById("btn-purchase").addEventListener("click", purchaseClicked);
  }
}

function generateProductCards() {
  const shopProducts = document.querySelector(".shop-products"); 
  const productTemplate = document.getElementById("product-template");

  for (const item of storeProducts) {
    const shopProduct = productTemplate.content.cloneNode(true);

    // shopProduct.querySelector(".shop-item-image").src = item.images;
    shopProduct.querySelector(".shop-item-name").innerText = item.name;
    shopProduct.querySelector(".shop-item-productinfo").innerText = item.productinfo;
    shopProduct.querySelector(".shop-item-id").innerText = `Id: ${item.id}`;
    shopProduct.querySelector(".shop-item-price").innerText = `${item.price} kr`;

    const moreInfoButton = shopProduct.querySelector(".btn-more-info");
    moreInfoButton.addEventListener("click", (() => {generateModal(item.id)}));

    shopProducts.append(shopProduct);
  }
  let footer = document.getElementById("shop-footer");
  footer.classList.remove("d-none");
}

function addItemToCartClicked(event){
  const button = event.target;
  const shopItem = button.parentElement.parentElement.parentElement;

  const id = shopItem.querySelector(".shop-item-id").innerText.replace("Id: ", "");
  const name = shopItem.querySelector(".shop-item-name").innerText;
  const price = shopItem.querySelector(".shop-item-price").innerText;
  const imageSrc = shopItem.querySelector(".shop-item-image").src;

  console.log(id, name, price, imageSrc);
  addItemToCart(id, name, price, imageSrc);
  updateCartTotal();
}

function addItemToCartClicked2(id){
  const item = storeProducts.find(element => element.id === id);

  addItemToCart(item.id, item.name, item.price, item.images);
  updateCartTotal();
}

function addItemToCart(id, name, price, imageSrc) {
  const cartItems = document.querySelector(".cart-items");
  const cartItemsId = cartItems.getElementsByClassName("cart-item-id");

  for(let i = 0; i < cartItemsId.length; i++) {
    if(cartItemsId[i].textContent == `Id: ${id}`) {
      alert("Den här varan finns redan i din varukorg!");
      return;
    }
  }

  const cartItemTemplate = document.getElementById("cart-item-template");
  const cartItem = cartItemTemplate.content.cloneNode(true);

  cartItem.querySelector(".cart-item-id").innerText = `Id: ${id}`;
  cartItem.querySelector(".cart-item-name").innerText = name;
  cartItem.querySelector(".cart-item-price").innerText = price;
  cartItem.querySelector(".cart-item-image").src = imageSrc;

  cartItem.querySelector(".btn-remove-cart-item").addEventListener("click", removeCartItem);
  cartItem.querySelector(".cart-item-quantity-input").addEventListener("change", quantityChanged);

  cartItems.append(cartItem);
  
  updateCartTotal();
  customerCart.push(new CartItem(id, name, price, imageSrc, 1));
  saveCart();
}

function removeCartItem(event) {
  var buttonClicked = event.target;

  const buttonItem = buttonClicked.parentElement.parentElement;
  const buttonItemId = buttonItem.querySelector(".cart-item-id").innerText.replace("Id: ", "");
  
  customerCart = customerCart.filter(cartItem => cartItem.id != buttonItemId);
  saveCart();

  buttonClicked.parentElement.parentElement.remove();

  updateCartTotal();
}

function updateCartTotal() {
  const allCartItems = document.getElementsByClassName("cart-item");
  let cartTotal = 0;

  for(let i = 0; i < allCartItems.length; i++) {
    const currentCartItem = allCartItems[i];
    const currentItemPriceElement = currentCartItem.getElementsByClassName("cart-item-price")[0];
    const currentItemQuantityElement = currentCartItem.getElementsByClassName("cart-item-quantity-input")[0];

    const price = parseFloat(currentItemPriceElement.innerText.replace(" kr", ""));
    const quantity = currentItemQuantityElement.value;

    cartTotal = cartTotal + (price * quantity);
  }
  cartTotal = Math.round(cartTotal * 100) / 100;

  const cartPriceTotal = document.getElementById("cart-items-total");
  cartPriceTotal.innerText = `${cartTotal} kr`;
  saveCart();
}

function quantityChanged(event) {
  const input = event.target;
  if(isNaN(input.value) || input.value <= 0){
    input.value = 1;
  }
  const inputItem = input.parentElement.parentElement;
  let inputItemId = inputItem.querySelector(".cart-item-id").innerText.replace("Id: ", "");

  updateQuantityCart(input.value, inputItemId);
  updateCartTotal();
}

function populateCart() {

  if(customerCart === null) {
    return;
  }

  const cart = document.querySelector(".cart-items");
  const cartItemTemplate = document.querySelector("template#cart-item-template");

  if(customerCart.length > 0){
    for(const cartItem of customerCart) {
      const newCartItem = cartItemTemplate.content.cloneNode(true);
  
      newCartItem.querySelector(".cart-item-id").innerText = `Id: ${cartItem.id}`;
      newCartItem.querySelector(".cart-item-name").innerText = cartItem.name;
      newCartItem.querySelector(".cart-item-price").innerText = cartItem.price;
      newCartItem.querySelector(".cart-item-image").src = cartItem.imageSrc;
      newCartItem.querySelector(".cart-item-quantity-input").value = cartItem.amount;
  
      newCartItem.querySelector(".btn-remove-cart-item").addEventListener("click", removeCartItem);
      newCartItem.querySelector(".cart-item-quantity-input").addEventListener("change", quantityChanged);
  
      cart.append(newCartItem);
    }
  }
  updateCartTotal();
}

function populateCartCheckout() {
  const checkoutCart = document.querySelector(".checkout-cart-items");
  const checkoutCartItemTemplate = document.querySelector("template#checkout-cart-item-template");

  if(customerCart.length == 0) {
    const newCheckoutCartItem = checkoutCartItemTemplate.content.cloneNode(true);
    
    newCheckoutCartItem.querySelector(".checkout-cart-item-name").innerText = "Din kundvagn är tom!";
    newCheckoutCartItem.querySelector(".checkout-cart-item-price").innerText = 0;

    checkoutCart.append(newCheckoutCartItem);
    updateCheckoutCartTotal();
    return;
  }

  if(customerCart.length > 0){
    for(const cartItem of customerCart) {
      const newCheckoutCartItem = checkoutCartItemTemplate.content.cloneNode(true);
  
      newCheckoutCartItem.querySelector(".checkout-cart-item-id").innerText = (cartItem.id);
      newCheckoutCartItem.querySelector(".checkout-cart-item-name").innerText = cartItem.name;
      newCheckoutCartItem.querySelector(".checkout-cart-item-price").innerText = cartItem.price;
      newCheckoutCartItem.querySelector(".checkout-cart-item-quantity").innerText = cartItem.amount;
  
      checkoutCart.append(newCheckoutCartItem);
    }
  }
  updateCheckoutCartTotal();
}


function loadCart () {
  customerCart = JSON.parse(localStorage.getItem("cartStorage"));
}

function saveCart() {
  localStorage.setItem("cartStorage", JSON.stringify(customerCart)); 
}

function updateQuantityCart(value, id) {
  for (const cartItem of customerCart) {
    if(cartItem.id === id) {
      cartItem.amount = value;
    }
  }
}

function updateCheckoutCartTotal() {
  const allCartItems = document.getElementsByClassName("checkout-item");
  let cartTotal = 0;

  for(let i = 0; i < allCartItems.length; i++) {
    const currentCartItem = allCartItems[i];
    const currentItemPriceElement = currentCartItem.getElementsByClassName("checkout-cart-item-price")[0];
    const currentItemQuantityElement = currentCartItem.getElementsByClassName("checkout-cart-item-quantity")[0];

    const price = parseFloat(currentItemPriceElement.innerText.replace(" kr", ""));
    const quantity = currentItemQuantityElement.innerText;


    cartTotal = cartTotal + (price * quantity);
  }
  cartTotal = Math.round(cartTotal * 100) / 100;


  const cartPriceTotal = document.getElementById("checkout-cart-total");
  cartPriceTotal.innerText = `${cartTotal} kr`;

}

function purchaseClicked() {
  alert("Tack för ditt köp!");

  customerCart = [];

  saveCart();
  loadCart();

  location.reload();
}

async function generateDadJoke() {
  const response = await fetch("https://icanhazdadjoke.com", {
  headers: {
    Accept: "application/json",
  },
});
  if(response.status === 200) {
    const jsonResponse = await response.json(); 

    const punschline = document.getElementById("dad-joke");
    punschline.innerText = jsonResponse.joke;
  }
}

function generateModal(id) {
  const item = storeProducts.find(element => element.id === id);

  document.querySelector(".modal-item-image").src = item.images;
  document.querySelector(".modal-item-name").innerText = item.name;
  document.querySelector(".modal-item-productinfo").innerText = item.productinfo;
  document.querySelector(".modal-item-price").innerText = `${item.price} kr`;
  document.querySelector(".modal-item-ingredients").innerText = item.ingredients;

  const addToCartButton = document.querySelector(".btn-add-item-to-cart");
  addToCartButton.setAttribute("onClick", `addItemToCartClicked2(${item.id})`);
  // addToCartButton.addEventListener("click", (() => {addItemToCart(item.id, item.name, item.price, item.images);}));
}

class CartItem {
  constructor(id, name, price, imageSrc, amount) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.imageSrc = imageSrc;
    this.amount = amount;
  }
}