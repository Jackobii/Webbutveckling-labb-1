if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

const shopProducts = [];

function ready () {

  generateProductCards();

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

  const addToCartButtons = document.getElementsByClassName("btn-add-item-to-cart");
  for(let i = 0; i < addToCartButtons.length; i++) {
    const button = addToCartButtons[i];
    button.addEventListener("click", addItemToCartClicked);
  }

  const openCartButton = document.getElementsByClassName("btn-open-cart");
  for(let i = 0; i < openCartButton.length; i++) {
    const button = openCartButton[i];
    button.addEventListener("click", updateCartTotal);
  }
}

function generateProductCards() {
  const shopProducts = document.querySelector(".shop-products"); 
  const productTemplate = document.getElementById("product-template");

  for (const item of storeProducts) {
    const shopProduct = productTemplate.content.cloneNode(true);

    shopProduct.querySelector(".shop-item-image").src = item.images;
    shopProduct.querySelector(".shop-item-name").innerText = item.name;
    shopProduct.querySelector(".shop-item-productinfo").innerText = item.productinfo;
    shopProduct.querySelector(".shop-item-id").innerText = `Id: ${item.id}`;
    shopProduct.querySelector(".shop-item-price").innerText = `${item.price} kr`;

    shopProducts.append(shopProduct);
  }
}

function addItemToCartClicked(event){
  const button = event.target;
  const shopItem = button.parentElement.parentElement.parentElement;

  const id = shopItem.querySelector(".shop-item-id").innerText;
  const name = shopItem.querySelector(".shop-item-name").innerText;
  const price = shopItem.querySelector(".shop-item-price").innerText;
  const imageSrc = shopItem.querySelector(".shop-item-image").src;

  console.log(id, name, price, imageSrc);
  addItemToCart(id, name, price, imageSrc);
  updateCartTotal();
}

function addItemToCart(id, name, price, imageSrc) {
  const cartItems = document.querySelector(".cart-items");
  const cartItemsId = cartItems.getElementsByClassName("cart-item-id");

  for(let i = 0; i < cartItemsId.length; i++) {
    if(cartItemsId[i].textContent == id) {
      alert("Den här varan finns redan i din varukorg!");
      return;
    }
  }

  const cartItemTemplate = document.getElementById("cart-item-template");
  const cartItem = cartItemTemplate.content.cloneNode(true);

  cartItem.querySelector(".cart-item-id").innerText = id;
  cartItem.querySelector(".cart-item-name").innerText = name;
  cartItem.querySelector(".cart-item-price").innerText = price;
  cartItem.querySelector(".cart-item-image").src = imageSrc;

  cartItem.querySelector(".btn-remove-cart-item").addEventListener("click", removeCartItem);
  cartItem.querySelector(".cart-item-quantity-input").addEventListener("change", quantityChanged);

  cartItems.append(cartItem);

  updateCartTotal();
}

function removeCartItem(event) {
  var buttonClicked = event.target;
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

    const price = parseFloat(currentItemPriceElement.innerText.replace(' |k|r|', ''));
    const quantity = currentItemQuantityElement.value;

    cartTotal = cartTotal + (price * quantity);
  }
  cartTotal = Math.round(cartTotal * 100) / 100;
  const cartPriceTotal = document.getElementById("cart-items-total");
  cartPriceTotal.innerText = `${cartTotal} kr`;
}

function quantityChanged(event) {
  const input = event.target;
  if(isNaN(input.value) || input.value <= 0){
    input.value = 1;
  }
  updateCartTotal();
}
