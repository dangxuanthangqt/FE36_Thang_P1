//alert(sessionStorage.getItem("IdProductDetail"));
var img = document.querySelector(".product-images__1");
var productInforTop = document.querySelector(".product-contents__top");
var productInforDesc = document.querySelector(".product-contents__desc");
var productQuantity = document.querySelector(
  ".product-contents__quality input"
);
var btnAdd = document.querySelector(".product-contents__quality .btn--add");
var btnSub = document.querySelector(".product-contents__quality .btn--sub");
var btnBuy = document.querySelector(".product-contents__action button");
async function getProductsByFetch(endpoint) {
  try {
    let res = await fetch(endpoint);
    return await res.json();
  } catch (error) {
    throw error;
  }
}
function removeDetailProduct() {
  img.innerHTML = "";
  productInforTop.innerHTML = "";
  productInforDesc.innerHTML = "";
}
//removeDetailProduct();

function renderProductByFetch(endpoint) {
  console.log(endpoint);
  getProductsByFetch(endpoint)
    .then((product) => {
      renderProductHTML(product);
    })
    .catch((error) => alert(error));
}
function renderProductHTML(product) {
  img.innerHTML = `<img src="${product.src}" alt="">`;
  productInforTop.innerHTML = `
              <p class="product-contents__top__name">${product.title}</p>
              <ul class="card__content__star"> <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
              </ul>
              <p class="card__content__price">
                ${formatCurrency(product.price)}  đ 
                <del>1.000.000 đ</del>
              </p>
    `;
  productInforDesc.innerText = `${product.description}`;
}
function renderMain() {
  var id = sessionStorage.getItem("IdProductDetail");
  if (id) {
    var endpoint = `http://localhost:3000/products/${id}`;
    renderProductByFetch(endpoint);
  } else {
    window.location.href = "./grid.html";
  }
}

renderMain();

btnAdd.onclick = () => {
  productQuantity.value = parseInt(productQuantity.value) + 1;
};
btnSub.onclick = () => {
  if (productQuantity.value > 1)
    productQuantity.value = parseInt(productQuantity.value) - 1;
};
btnBuy.onclick = () => {
  let accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    let IdProductDetail = sessionStorage.getItem("IdProductDetail");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (checkProductExist(cart, IdProductDetail)) { //check id ton tai trong gio hang
      cart.unshift({
        id: IdProductDetail,
        quantity: parseInt(productQuantity.value),
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("paymentCheck", false);

      getQuantity();
    } else {
      // ton tai false

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == IdProductDetail) {
          cart[i].quantity = parseInt(productQuantity.value);
          localStorage.setItem("cart", JSON.stringify(cart));
          localStorage.setItem("paymentCheck", false);

        }
      }
    }
  }
  else{
    if (confirm("You must login before buy product !")) {
    return window.location.href = "./login.html";
    }
  }
 return window.location.href="./cart.html"
};

function formatCurrency(n, separate = ".") {
  var s = n.toString();
  var regex = /\B(?=(\d{3})+(?!\d))/g;
  var ret = s.replace(regex, separate);
  return ret;
}
