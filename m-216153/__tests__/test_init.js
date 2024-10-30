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

    // Helper function to get product data from the displayed DOM
    function getProductData(productElement) {
        const name = productElement.querySelector('h2').textContent;
        const priceString = productElement.querySelector('p:nth-of-type(1)').textContent;
        const price = parseFloat(priceString.split(': $')[1]);
        const stockString = productElement.querySelector('p:nth-of-type(2)').textContent;
        const stock = parseInt(stockString.split(': ')[1]);

        return { name, price, stock };
    }

    it('should properly adjust inventory to the MAX_STOCK limit', () => {
        // Added stock values exceeding MAX_STOCK for testing purposes
        window.products = [
            { id: 1, name: 'Product A', basePrice: 100, stock: 35 },
            { id: 2, name: 'Product B', basePrice: 200, stock: 50 }
        ];

        window.adjustInventory();

        expect(window.products[0].stock).toBe(30);
        expect(window.products[1].stock).toBe(30);
    });

    it('should apply discount when stock is above the threshold', () => {
        window.products = [
            { id: 1, name: 'Product A', basePrice: 100, stock: 22 } // Above 70% of 30
        ];

        window.displayProducts();

        const productElement = document.querySelector('.product');
        const { price } = getProductData(productElement);

        expect(price).toBe(90); // 100 - (100 * 0.10) = 90
    });

    it('should not apply discount when stock is below the threshold', () => {
        window.products = [
            { id: 1, name: 'Product A', basePrice: 100, stock: 20 } // Below 70% of 30
        ];

        window.displayProducts();

        const productElement = document.querySelector('.product');
        const { price } = getProductData(productElement);

        expect(price).toBe(100);
    });


    it('should display the correct stock quantity and price for various scenarios', () => {
        window.displayProducts();

        const productElements = document.querySelectorAll('.product');

        // Verify a product with stock and discount (e.g., 'Product B')
        const productB = getProductData(productElements[1]);
        expect(productB.name).toBe('Product B');
        expect(productB.stock).toBe(30);
        expect(productB.price).toBe(180); // Discounted price

        // Verify a product with stock and no discount (e.g., 'Product C')
        const productC = getProductData(productElements[2]);
        expect(productC.name).toBe('Product C');
        expect(productC.stock).toBe(3);
        expect(productC.price).toBe(300);

        // Verify 'Add to Cart' button functionality when adding and removing items
        const addToCartButton = productElements[0].querySelector('button');
        addToCartButton.click();

        const updatedProductA = getProductData(document.querySelectorAll('.product')[0]);
        expect(updatedProductA.stock).toBe(24);
        expect(window.cart.length).toBe(1);

        // Add more assertions as needed for other products and edge cases
    });

    // Add tests for addToCart (out of stock scenario) and edge cases
    it('addToCart should handle out of stock scenario', () => {
        window.products = [
            { id: 1, name: 'Product A', basePrice: 100, stock: 0 }
        ];
        window.displayProducts();

        const alertMock = jest.spyOn(window, 'alert');
        const addToCartButton = document.querySelector('button');
        addToCartButton.click();

        expect(alertMock).toHaveBeenCalledWith('Product is out of stock!');
    });

    // ... Add more tests as needed to cover other edge cases (e.g., invalid product IDs)
});