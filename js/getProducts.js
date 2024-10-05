import { conexionDB } from "./conexionDB.js";

const ulList = document.querySelector("[data-list]");

// Solo exportamos esta funcion para utilizarla en el componente de Filtrado de productos
export default function createProductCard(productName, productPrice, productUrl) {
    const product = document.createElement('li');
    product.className = "product-list__item";

    product.innerHTML = `

        <img src="${productUrl}" alt="Product 1 - Description of product" class="product-list__image" itemprop="image">
        <h3 class="product-list__name" itemprop="name">${productName}</h3>
        <hr class="card-divider">
        <p class="card-footer" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
            <span itemprop="price" content="USD">$${productPrice}</span>
            <i class="fas fa-trash-can"></i> 
        </p>
    `
    // console.log(product)
    return product;
}


async function renderProducts() {
    const listProduct = await conexionDB.listProducts();

    listProduct.forEach(productItem => ulList.appendChild(createProductCard(productItem.productName, productItem.productPrice, productItem.productUrl)));

}

renderProducts();
