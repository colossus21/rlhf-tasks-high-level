/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../i6.html'), 'utf8');

let dom;
let document;
let window;

describe('E-commerce Dynamic Pricing Tests', () => {
    beforeEach(() => {
        dom = new JSDOM(html, { runScripts: 'dangerously' });
        document = dom.window.document;
        window = dom.window;
    });

    function getProductData(productElement) {
        const name = productElement.querySelector('h2').textContent;
        const priceString = productElement.querySelector('p:nth-of-type(1)').textContent;
        const price = parseFloat(priceString.split(': $')[1]);
        const stockString = productElement.querySelector('p:nth-of-type(2)').textContent;
        const stock = parseInt(stockString.split(': ')[1]);

        return { name, price, stock };
    }

    it('should apply discount when stock is above the threshold', () => {
        window.products = [
            { id: 1, name: 'Product A', basePrice: 100, stock: 25 }
        ];

        window.displayProducts();
        const productElement = document.querySelector('.product');
        const { price } = getProductData(productElement);

        expect(price).toBe(90);  // 10% discount applied
    });

    it('should not apply discount when stock is below the threshold', () => {
        window.products = [
            { id: 1, name: 'Product A', basePrice: 90, stock: 18 }
        ];

        window.displayProducts();

        const productElement = document.querySelector('.product');
        const data = getProductData(productElement);

        expect(data.price).toBe(90);
    });

    it('addToCart should handle out of stock scenario', () => {
        window.products = [
            { id: 1, name: 'Product A', basePrice: 100, stock: 0 }
        ];

        window.displayProducts();
        const addToCartButton = document.querySelector('button');
        addToCartButton.click();
        expect(addToCartButton.disabled).toBe(false);
    });

    it('should update stock when a product is added to the cart', () => {
        window.products = [
            { id: 1, name: 'Product A', basePrice: 100, stock: 26 }
        ];

        window.displayProducts();

        let productElement = document.querySelector('.product');
        const addToCartButton = document.querySelector('button');
        addToCartButton.click();
        let updatedProductData = getProductData(productElement);
        expect(updatedProductData.stock).toBe(25);
    });

});
