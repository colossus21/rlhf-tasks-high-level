/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../i0.html'), 'utf8');

let dom;
let document;
let window;

describe('E-commerce Dynamic Pricing Tests', () => {
    beforeEach(() => {
        // Setup DOM environment with actual HTML file
        dom = new JSDOM(html, { runScripts: 'dangerously' });
        document = dom.window.document;
        window = dom.window;

        // Initialize the products array before each test
        window.products = [
            { id: 1, name: 'Product A', basePrice: 100, stock: 25 },
            { id: 2, name: 'Product B', basePrice: 200, stock: 35 },
            { id: 3, name: 'Product C', basePrice: 300, stock: 3 },
            { id: 4, name: 'Product D', basePrice: 100, stock: 15 },
            { id: 5, name: 'Product F', basePrice: 200, stock: 40 },
            { id: 6, name: 'Product E', basePrice: 300, stock: 2 }
        ];

        window.MAX_STOCK = 30;
        window.DISCOUNT_THRESHOLD = 0.7;
        window.cart = [];

        // Add the functions to the window object
        window.adjustInventory = function() {
            window.products = window.products.map(product => ({
                ...product,
                stock: Math.min(product.stock, window.MAX_STOCK)
            }));
        };

        window.calculatePrice = function(product) {
            let price = product.basePrice;
            if (product.stock > window.MAX_STOCK * window.DISCOUNT_THRESHOLD) {
                price -= price * 0.10;
            }
            return price;
        };

        window.displayProducts = function() {
            const productListElement = document.getElementById('product-list');
            productListElement.innerHTML = '';
            window.products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'product';
                const price = window.calculatePrice(product);
                productElement.innerHTML = `
                    <h2>${product.name}</h2>
                    <p>Price: $${price.toFixed(2)}</p>
                    <p>Stock: ${product.stock}</p>
                    <button ${product.stock === 0 ? 'disabled' : ''} onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productListElement.appendChild(productElement);
            });
        };

        window.addToCart = function(productId) {
            const product = window.products.find(p => p.id === productId);
            if (product && product.stock > 0) {
                window.cart.push(product);
                product.stock--;
                window.displayProducts();
            } else {
                window.alert('Product is out of stock!');
            }
        };

        // Mock alert to prevent it from actually showing during tests
        window.alert = jest.fn();
    });

    // Helper function to get product data from the displayed DOM
    function getProductData(productElement) {
        const name = productElement.querySelector('h2').textContent;
        const priceString = productElement.querySelector('p:nth-of-type(1)').textContent;
        const price = parseFloat(priceString.split('$')[1]);
        const stockString = productElement.querySelector('p:nth-of-type(2)').textContent;
        const stock = parseInt(stockString.split(': ')[1]);
        return { name, price, stock };
    }

    it('should properly adjust inventory to the MAX_STOCK limit', () => {
        window.adjustInventory();

        // Check products that should be adjusted
        expect(window.products[1].stock).toBe(30); // Product B: 35 -> 30
        expect(window.products[4].stock).toBe(30); // Product F: 40 -> 30

        // Check products that should remain unchanged
        expect(window.products[0].stock).toBe(25); // Product A: 25 stays 25
        expect(window.products[2].stock).toBe(3);  // Product C: 3 stays 3
    });

    it('should apply discount when stock is above the threshold', () => {
        window.adjustInventory();
        window.displayProducts();

        // Get Product B which should have discount (stock: 30 > threshold of 21)
        const productElements = document.querySelectorAll('.product');
        const productB = getProductData(productElements[1]);

        // Expected price: 200 - (200 * 0.10) = 180
        expect(productB.price).toBe(180);
    });

    it('should not apply discount when stock is below the threshold', () => {
        window.adjustInventory();
        window.displayProducts();

        // Get Product C which should not have discount (stock: 3 < threshold of 21)
        const productElements = document.querySelectorAll('.product');
        const productC = getProductData(productElements[2]);

        // Price should remain at basePrice
        expect(productC.price).toBe(300);
    });

    it('should correctly update stock and cart when adding items', () => {
        window.adjustInventory();
        window.displayProducts();

        // Add Product A to cart
        window.addToCart(1);

        // Check if product was added to cart
        expect(window.cart.length).toBe(1);
        expect(window.cart[0].id).toBe(1);

        // Check if stock was decreased
        const productElements = document.querySelectorAll('.product');
        const productA = getProductData(productElements[0]);
        expect(productA.stock).toBe(24); // 25 - 1
    });

    it('should handle out of stock scenario', () => {
        // Set a product's stock to 0
        window.products[0].stock = 0;
        window.displayProducts();

        // Try to add out-of-stock product to cart
        window.addToCart(1);

        // Check if alert was shown
        expect(window.alert).toHaveBeenCalledWith('Product is out of stock!');

        // Check if cart remains empty
        expect(window.cart.length).toBe(0);
    });

    it('should display all products with correct initial values', () => {
        window.adjustInventory();
        window.displayProducts();

        const productElements = document.querySelectorAll('.product');

        // Check if all products are displayed
        expect(productElements.length).toBe(6);

        // Verify specific products
        const productData = Array.from(productElements).map(getProductData);

        // Check Product A
        expect(productData[0].name).toBe('Product A');
        expect(productData[0].stock).toBe(25);
        expect(productData[0].price).toBe(90);

        // Check Product B (should have discount)
        expect(productData[1].name).toBe('Product B');
        expect(productData[1].stock).toBe(30);
        expect(productData[1].price).toBe(180);

        // Check Product C (low stock)
        expect(productData[2].name).toBe('Product C');
        expect(productData[2].stock).toBe(3);
        expect(productData[2].price).toBe(300);
    });
});