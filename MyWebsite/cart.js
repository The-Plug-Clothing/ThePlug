// cart.js - handles Add to Cart and cart count across all pages

// Grab cart from localStorage or start fresh
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
}

// Show a toast notification
function showToast(message) {
  let toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#222";
  toast.style.color = "#fff";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  toast.style.zIndex = 9999;
  toast.style.opacity = 0;
  toast.style.transition = "opacity 0.3s ease";

  document.body.appendChild(toast);

  setTimeout(() => { toast.style.opacity = 1; }, 50);
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Add product to cart
function addToCart(product, price, size = "M") {
  price = parseFloat(price);

  // Check if item with same product + size already exists
  const existingItem = cart.find(item => item.product === product && item.size === size);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ product, price, size, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`${product} (${size}) added to cart ✅`);
}

// Render cart table (for cart.html)
function renderCartTable() {
  const container = document.getElementById("cart-items");
  if (!container) return; // Only run on cart page

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    container.innerHTML += `
      <tr>
        <td>${item.product} (${item.size})</td>
        <td>${item.qty}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button class="remove-btn" data-index="${index}">❌ Remove</button></td>
      </tr>
    `;
  });

  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  // Remove item functionality
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.index;
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartTable();
      updateCartCount();
    });
  });
}

// Attach event listeners to Add to Cart buttons
function attachCartEvents() {
  document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.dataset.product;
      const price = button.dataset.price;

      // Check for a size selector in the page
      const sizeSelect = document.querySelector(".size-select");
      const size = sizeSelect ? sizeSelect.value : "M";

      addToCart(product, price, size);
      renderCartTable();
    });
  });
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  attachCartEvents();
  renderCartTable();
});
