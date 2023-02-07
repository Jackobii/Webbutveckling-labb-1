if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

const shopProducts = [];
const removeCartItemButtons = document.getElementsByClassName("btn-remove-cart-item");

for(let i = 0; i < removeCartItemButtons.length; i++) {
  const button = removeCartItemButtons[i];
  button.addEventListener("click", function() {
    console.log("clicked");
  })
}

function ready () {

  generateProductCards();
}

function generateProductCards() {
  const shopProducts = document.querySelector(".shop-products"); 
  const productTemplate = document.getElementById("product-template");

  for (const item of storeProducts) {
    const shopProduct = productTemplate.content.cloneNode(true);

    shopProduct.querySelector(".shop-item-image").src = item.images;
    shopProduct.querySelector(".shop-item-name").innerText = item.name;
    shopProduct.querySelector(".shop-item-productinfo").innerText = item.productinfo;
    shopProduct.querySelector(".shop-item-ingredients").innerText = `Innehåller: ${item.ingredients}`;
    shopProduct.querySelector(".shop-item-id").innerText = `Id: ${item.id}`;
    shopProduct.querySelector(".shop-item-price").innerText = `${item.price} kr`;

    shopProducts.append(shopProduct)
  }
}
