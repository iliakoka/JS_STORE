const productsList = document.querySelector("#product-list");
const productForm = document.querySelector("#product-form");
const name = document.querySelector("#name");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const image = document.querySelector("#image");
const submitButton = document.querySelector("#submitButton");
const submitEditedButton = document.querySelector("#editButton");
const editTitle = document.querySelector("#edit-title");
const addTitle = document.querySelector("#add-title");
const cartIcon = document.querySelector(".material-symbols-outlined");
const cartList = document.querySelector(".cart-list");

let containerExist = false;
cartIcon.addEventListener("click", () => {
  if (containerExist) {
    cartList.style.display = "none";
    containerExist = false;
  } else {
    cartList.style.display = "block";
    containerExist = true;
  }
});

function getProducts() {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((products) => {
      productsList.innerHTML = "";

      products.forEach((product) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
        <img class="image" src="${product.image}" alt="${product.name}" width="100%"/>
        <div class="product-content">
        <strong>${product.name}</strong> - $${product.price}
        <p>${product.description}</p>
        <button class="delte-button" data-id="${product.id}">Delete</button>
        <button class="edit-button" data-id="${product.id}">Edit</button>
        <button class="addToCart-button" data-id="${product.id}">Add to cart</button>
        </div>
        `;

        const deleteButton = listItem.querySelector(".delte-button");
        deleteButton.addEventListener("click", () => {
          deleteProduct(product.id);
        });

        const editButton = listItem.querySelector(".edit-button");
        editButton.addEventListener("click", () => {
          name.value = product.name;
          description.value = product.description;
          price.value = product.price;
          image.value = product.image;
          submitButton.style.display = "none";
          addTitle.style.display = "none";
          submitEditedButton.style.display = "block";
          editTitle.style.display = "block";
          const targetScrollPosition = productForm.offsetTop;
          window.scrollTo({
            top: targetScrollPosition,
            behavior: "smooth",
          });

          submitEditedButton.addEventListener("click", () => {
            editProduct(product.id);
          });
        });

        const addToCartButton = listItem.querySelector(".addToCart-button");
        addToCartButton.addEventListener("click", () => {
          addToCartArray(product.id);
          cartList.style.display = "block";
          containerExist = true;
        });
        productsList.appendChild(listItem);
      });
    });
}

let cartArray = [];
function addToCartArray(id) {
  fetch(`http://localhost:3000/products/${id}`)
    .then((response) => response.json())
    .then((product) => {
      cartArray.push({
        name: product.name,
        price: product.price,
        image: product.image,
        id: product.id,
      });
      renderCart(cartArray);
    });
}

function renderCart(arr) {
  if (arr.length === 0) {
    cartList.innerHTML = "Here should be selected Products...";
  } else {
    cartList.innerHTML = "";
  }
  arr.forEach((product) => {
    const cartItem = document.createElement("li");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <img class="cart-image" src="${product.image}" alt="${product.name}" width="100%"/>
            <div class="cart-product-content">
            <strong>${product.name}</strong> - $${product.price}
            <button class="cart-delete-button" data-id="${product.id}"><span class="material-symbols-outlined">delete</span></button>
            `;

    const deleteFromCartButton = cartItem.querySelector(".cart-delete-button");
    deleteFromCartButton.addEventListener("click", () => {
      const productIndex = arr.indexOf(product);
      arr.splice(productIndex, 1);
      renderCart(cartArray);
    });

    cartList.appendChild(cartItem);
  });
}

function addProduct() {
  const productName = name.value;
  const productPrice = parseFloat(price.value);
  const productDescription = description.value;
  const productImage = image.value;

  const newProduct = {
    name: productName,
    price: productPrice,
    description: productDescription,
    image: productImage,
  };

  fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  }).then(() => {
    getProducts();
    productForm.reset();
  });
}

function editProduct(id) {
  const productName = name.value;
  const productPrice = parseFloat(price.value);
  const productDescription = description.value;
  const productImage = image.value;

  const editedProduct = {
    name: productName,
    price: productPrice,
    description: productDescription,
    image: productImage,
  };

  fetch(`http://localhost:3000/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => {
    getProducts();
    productForm.reset();
  });
}

function deleteProduct(id) {
  fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  }).then(() => {
    getProducts();
  });
}

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  addProduct();
});
getProducts();
