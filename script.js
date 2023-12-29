let navbar = document.querySelector(".nav-bar");

document.querySelector("#menu-btn").onclick = (e) => {
  e.preventDefault();
  navbar.classList.toggle("active");
};

window.onscroll = () => {
  navbar.classList.remove("active");
};

// Get the product boxes
const productBoxes = document.querySelectorAll(".box");

// Get the cart items container
const cartItemsContainer = document.getElementById("cart-items");

// Get the total price element
const totalPriceElement = document.getElementById("total-price");

// Get the cart button
const cartBtn = document.getElementById("cart-btn");

// Get the sidebar element
const sidebar = document.getElementById("sidebar");

// Get the quantity-pop element
const quantityPop = document.querySelector(".quantity-pop");

// Initialize cart items array and total price
let cartItems = [];
let totalPrice = 0;

// Function to update the cart HTML
function updateCart() {
  // Clear the cart items container
  cartItemsContainer.innerHTML = "";

  // Loop through each item in the cart
  cartItems.forEach((item) => {
    const { id, name, price, quantity, imageSrc } = item;

    // Create a list item for the cart item
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${imageSrc}" alt="${name}" />
        </div>
        <div class="cart-item-details">
          <span class="cart-item-name">${name}</span>
          <div class="cart-item-quantity">
            <button class="subtract-btn" data-id="${id}">-</button>
            <span class="quantity">${quantity}</span>
            <button class="add-btn" data-id="${id}">+</button>
          </div>
          <div class="cart-item-price">$${(price * quantity).toFixed(2)}</div>
          <button class="delete-btn" data-id="${id}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;

    // Add event listeners for the controls
    const subtractBtn = cartItem.querySelector(".subtract-btn");
    const addBtn = cartItem.querySelector(".add-btn");
    const deleteBtn = cartItem.querySelector(".delete-btn");

    subtractBtn.addEventListener("click", () => subtractFromCart(id));
    addBtn.addEventListener("click", () => addToCart(id));
    deleteBtn.addEventListener("click", () => deleteFromCart(id));

    // Append the cart item to the container
    cartItemsContainer.appendChild(cartItem);
  });

  // Update the total price
  totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

// Function to find an item in the cart by its id
function findCartItemById(id) {
  return cartItems.find((item) => item.id === id);
}

// Function to add a product to the cart
function addToCart(id) {
  const productBox = productBoxes[id];
  const name = productBox.querySelector("h3").textContent;
  const price = parseFloat(
    productBox.querySelector(".price").textContent.slice(1)
  );
  const imageSrc = productBox.querySelector("img").src;

  let cartItem = findCartItemById(id);

  if (cartItem) {
    // Increment the quantity if the item already exists in the cart
    cartItem.quantity++;
  } else {
    // Add a new item to the cart if it doesn't exist
    cartItem = {
      id,
      name,
      price,
      quantity: 1,
      imageSrc,
    };
    cartItems.push(cartItem);
  }

  // Update the total price
  totalPrice += price;

  // Update the cart HTML
  updateCart();

  // Update the quantity display
  updateQuantityDisplay(id);

  // Update the quantity-pop element
  updateQuantityPop();
}

// Function to subtract a product from the cart
function subtractFromCart(id) {
  const cartItem = findCartItemById(id);

  if (cartItem && cartItem.quantity > 1) {
    // Decrement the quantity if it's more than 1
    cartItem.quantity--;

    // Update the total price
    totalPrice -= cartItem.price;

    // Update the cart HTML
    updateCart();

    // Update the quantity display
    updateQuantityDisplay(id);

    // Update the quantity-pop element
    updateQuantityPop();
  }
}

// Function to delete a product from the cart
function deleteFromCart(id) {
  const cartItemIndex = cartItems.findIndex((item) => item.id === id);

  if (cartItemIndex !== -1) {
    const cartItem = cartItems[cartItemIndex];

    // Decrease the total price by the item's price multiplied by its quantity
    totalPrice -= cartItem.price * cartItem.quantity;

    // Remove the item from the cart
    cartItems.splice(cartItemIndex, 1);

    // Update the cart HTML
    updateCart();

    // Update the quantity display// Update the quantity display
    updateQuantityDisplay(id);

    // Update the quantity-pop element
    updateQuantityPop();
  }
}

// Function to update the quantity display
function updateQuantityDisplay(id) {
  const productBox = productBoxes[id];
  const quantityDisplay = productBox.querySelector(".quantity");
  const cartItem = findCartItemById(id);

  if (quantityDisplay && cartItem) {
    quantityDisplay.textContent = cartItem.quantity;
  }
}

// Function to update the quantity-pop element
function updateQuantityPop() {
  quantityPop.textContent = cartItems.length;
  quantityPop.classList.add("show");

  // Remove the 'show' class after 2 seconds
  setTimeout(() => {
    quantityPop.classList.remove("show");
  }, 2000);
}

// Function to show the sidebar
function showSidebar() {
  sidebar.style.display = "block";
}
// Attach event listener to the cart button
cartBtn.addEventListener("click", showSidebar);

// Function to hide the sidebar
function hideSidebar() {
  sidebar.style.display = "none";
}

// Attach event listeners to the "add to cart" buttons
productBoxes.forEach((box, id) => {
  const addToCartBtn = box.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", (event) => {
    event.preventDefault();
    addToCart(id);
    updateQuantityDisplay(id);
  });
});
