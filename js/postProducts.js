import { conexionDB } from "./conexionDB.js";

const formProduct = document.querySelector("[data-form]");

async function sendProduct(e) {

    e.preventDefault();
    
    const productName = document.querySelector("[data-prodName]").value;
    const productPrice = Number(document.querySelector("[data-prodPrice]").value);
    const productUrl = document.querySelector("[data-prodUrl]").value;

    
     
    // TODO: Add automatic count

    try {
        await conexionDB.sendProducts(productName, productPrice, productUrl);
    } catch (e) {
        alert(e);
    }

}


formProduct.addEventListener("submit", e => sendProduct(e));