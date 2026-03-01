
// DARK CLOTHES - ECOMMERCE ES6

const API_URL = "https://fakestoreapi.com/products";


let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];


const productContainer = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");


const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();


    products = data.filter(
      product =>
        product.category === "men's clothing" ||
        product.category === "women's clothing"
    );

    renderProducts();
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
};

// RENDER PRODUCTOS

const renderProducts = () => {
  productContainer.innerHTML = "";

  products.forEach(product => {
    const priceCLP = Math.round(product.price * 950);

    productContainer.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" 
               class="card-img-top p-3" 
               style="height:250px; object-fit:contain;" />
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">${product.title}</h6>
            <p class="card-text text-muted">$${priceCLP.toLocaleString()}</p>
            <button class="btn btn-dark mt-auto add-to-cart" 
                    data-id="${product.id}">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    `;
  });
};


// AGREGAR AL CARRITO

const addToCart = id => {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const priceCLP = Math.round(product.price * 950);

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.title,
      price: priceCLP,
      img: product.image,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
};


// ACTUALIZAR UI CARRITO

const updateCartUI = () => {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    cartItems.innerHTML += `
      <tr>
        <td>
          <img src="${item.img}" width="60" class="me-2">
          ${item.name}
        </td>
        <td>$${item.price.toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-dark decrease" data-id="${item.id}">-</button>
          <span class="mx-2">${item.qty}</span>
          <button class="btn btn-sm btn-dark increase" data-id="${item.id}">+</button>
        </td>
        <td>$${(item.price * item.qty).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-danger remove" data-id="${item.id}">X</button>
        </td>
      </tr>
    `;
  });

  cartTotal.textContent = `$${total.toLocaleString()}`;
  cartCount.textContent = cart.length;
};


const changeQuantity = (id, amount) => {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  updateCartUI();
};


const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};


document.addEventListener("click", e => {

  if (e.target.classList.contains("add-to-cart")) {
    const id = parseInt(e.target.dataset.id);
    addToCart(id);
  }

  if (e.target.classList.contains("increase")) {
    changeQuantity(parseInt(e.target.dataset.id), 1);
  }

  if (e.target.classList.contains("decrease")) {
    changeQuantity(parseInt(e.target.dataset.id), -1);
  }

  if (e.target.classList.contains("remove")) {
    changeQuantity(parseInt(e.target.dataset.id), -999);
  }
});


fetchProducts();
updateCartUI();