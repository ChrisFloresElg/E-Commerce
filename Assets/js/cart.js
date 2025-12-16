$(document).ready(function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let products = [];

  // PRODUCTOS JSON
  $.getJSON("assets/json/products.json", function (data) {
    products = data;
    updateCartUI();
  });

  // AGREGAR AL CARRITO
  $(document).on("click", ".add-to-cart", function () {
    const id = parseInt($(this).data("id"));
    addToCartById(id);
  });

  function addToCartById(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const found = cart.find((item) => item.id === product.id);

    if (found) {
      found.qty++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty: 1,
      });
    }

    saveCart();
    updateCartUI();
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    updateCartUI();
  }

  function changeQty(id, qty) {
    const item = cart.find((i) => i.id === id);
    if (item) {
      item.qty += qty;
      if (item.qty <= 0) removeFromCart(id);
    }
    saveCart();
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartUI() {
    let html = "";
    let total = 0;

    cart.forEach((item) => {
      total += item.price * item.qty;

      html += `
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
            <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">X</button>
          </td>
        </tr>
      `;
    });

    $("#cart-items").html(html);
    $("#cart-total").text(`$${total.toLocaleString()}`);
    $("#cart-count").text(cart.length);
  }

  // SUMAR O RESTAR UN PRODUCTO
  $(document).on("click", ".remove-item", function () {
    removeFromCart(parseInt($(this).data("id")));
  });

  $(document).on("click", ".increase", function () {
    changeQty(parseInt($(this).data("id")), 1);
  });

  $(document).on("click", ".decrease", function () {
    changeQty(parseInt($(this).data("id")), -1);
  });
});
