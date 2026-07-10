// --- Global State Management ---
let cart = JSON.parse(localStorage.getItem('mudera_cart')) || [];

// --- Cart UI Synchronization ---
function updateCartUI() {
    // 1. Update Header Count (All pages)
    document.querySelectorAll('#cart-count').forEach(node => { node.textContent = cart.length; });

    // 2. Update Side Cart (if on a page with a side-cart container)
    const sideContainer = document.getElementById('cart-items-container');
    if (sideContainer) {
        sideContainer.innerHTML = cart.length === 0 ? `<p style="text-align:center; color:#777; margin-top:20px;">ATELIER IS EMPTY</p>` : '';
        let subtotal = 0;
        cart.forEach((item, index) => {
            subtotal += item.price;
            sideContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" style="width:50px; object-fit:cover;">
                    <div><h4>${item.name}</h4><p>₹${item.price.toLocaleString()}</p>
                    <button onclick="removeFromCart(${index})">REMOVE</button></div>
                </div>`;
        });
        const totalNode = document.getElementById('cart-total');
        if (totalNode) totalNode.textContent = `₹${subtotal.toLocaleString()}`;
    }

    // 3. Update Checkout Summary (Only on checkout.html)
    const checkoutList = document.getElementById('checkout-summary-list');
    if (checkoutList) {
        checkoutList.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            checkoutList.innerHTML += `<div class="cart-item-row"><span>${item.name.toUpperCase()}</span><span>₹${item.price.toLocaleString()}</span></div>`;
        });
        const checkoutTotal = document.getElementById('total-price-val');
        if (checkoutTotal) checkoutTotal.textContent = `₹${total.toLocaleString()}`;
    }
}

// --- Cart Actions ---
window.addToCart = function(name, price, img) {
    cart.push({ name, price, img });
    localStorage.setItem('mudera_cart', JSON.stringify(cart));
    updateCartUI();
    // If on product page, show the cart; otherwise, just update UI
    if(document.getElementById('side-cart')) openSideCart();
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('mudera_cart', JSON.stringify(cart));
    updateCartUI();
};

window.openSideCart = function() { gsap.to("#side-cart", { x: "0%", duration: 0.6, ease: "power4.out" }); };
window.closeSideCart = function() { gsap.to("#side-cart", { x: "100%", duration: 0.6, ease: "power4.inOut" }); };

document.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
    
    // UI Event Listeners
    const trigger = document.getElementById('cart-trigger');
    const closeBtn = document.querySelector('.close-cart');
    if (trigger) trigger.addEventListener('click', openSideCart);
    if (closeBtn) closeBtn.addEventListener('click', closeSideCart);

    // Landing Page Animations
    if (document.getElementById('heroTitle')) {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to("#mainHeader", { opacity: 1, y: 0, duration: 1 })
          .to("#heroSub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
          .to("#heroTitle", { opacity: 1, y: 0, duration: 1 }, "-=0.6")
          .to("#heroBtn", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6");
    }
});


// Add these variables/functions to your existing scripts.js
let currentQty = 1;

window.changeQty = function(val) {
    currentQty = Math.max(1, currentQty + val);
    document.getElementById('qty-val').textContent = currentQty;
};

// Update your addToCart function to accept qty
window.addToCart = function(name, price, img, qty = 1) {
    for(let i = 0; i < qty; i++) {
        cart.push({ name, price, img });
    }
    localStorage.setItem('mudera_cart', JSON.stringify(cart));
    updateCartUI();
    openSideCart();
};

// Back to Top Button Logic
window.addEventListener('scroll', () => {
    const btn = document.getElementById('topBtn');
    if (btn) btn.style.display = window.scrollY > 300 ? 'block' : 'none';
});