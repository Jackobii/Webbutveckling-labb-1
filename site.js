if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }

const shopProducts = [];

function ready () {

  generateProductCards();
}

function generateProductCards() {
  const shopProducts = document.querySelector(".shop-products"); 
  const productTemplate = document.getElementById("product-template");
  const productCard = productTemplate.content.cloneNode(true);

  for (const item of storeProducts) {
    const shopProduct = productTemplate.content.cloneNode(true);
    console.log(item);

    shopProduct.querySelector(".shop-item-image").src = item.images;
    shopProduct.querySelector(".shop-item-name").innerText = item.name;
    shopProduct.querySelector(".shop-item-productinfo").innerText = item.productinfo;
    shopProduct.querySelector(".shop-item-ingredients").innerText = `Innehåller: ${item.ingredients}`;
    shopProduct.querySelector(".shop-item-price").innerText = `${item.price} kr`;

    shopProducts.append(shopProduct)
  }
}
