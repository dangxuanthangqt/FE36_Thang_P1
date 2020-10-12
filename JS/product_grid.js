var oldProducts = document.querySelectorAll(".grid-content__card .card");
var productGrid = document.querySelector(".grid-content__card");

var pagination = document.querySelector(".grid-content__pagination__list");

var quantityShow = document.getElementById("quantityShow");
var elementNumber;
var prePage = document.getElementById("prePage");
var nextPage = document.getElementById("nextPage");
var quantityProduct = 6;
var pageNumber = 1;
var maxPageNumber = 1;
var cart = JSON.parse(localStorage.getItem("cart")) || [];
//---------------------------------------

function removeOldProducts(oldProducts) {
  for (val of oldProducts) {
    val.remove();
  }
}
function removePNumbers() {
  var paginationNumbers = document.querySelectorAll(
    ".grid-content__pagination__list li"
  );
  for (val of paginationNumbers) {
    val.remove();
  }
}
removeOldProducts(oldProducts);

//----------------------------------------http request------------------------------------------------
async function getProductsFetch(endpoint) {
  try {
    let res = await fetch(endpoint);
    return await res.json();
  } catch (error) {
    throw error;
  }
}

function getProductsXML(method, url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      // truyen vao call back onnload khi nhan phan hoi
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
}

//------------------------------------------------------------------------------------------
function renderProductHTML(products) {
  for (val of products) {
    
    let discount;
    if (val.discount === "NEW") {
      discount = `<button class="btn btn--circle btn--primary discount">${val.discount}</button>`;
    } else {
      if (val.discount === "") discount = ``;
      else
        discount = `<button class="btn btn--circle btn--red discount">${val.discount}</button>`;
    }
    let card_action = `
               <div class="card__action">
                    <img src=${val.src} alt=""/>
                        ${discount}
                    <div class="card__action__content"><button onclick="handleAddToCart(this)" data-arg1=${val.id} class="btn btn--primary btn--rounded" >MUA NGAY </button>
                      <button onclick="pushIdProductToStore(this)" data-arg1=${val.id} class="btn btn--circle55"><i class="fas fa-search"></i></button>
                    </div>
                </div>`;
    let card_content = `
    <div class="card__content">
        <p class="card__content__desc">${val.title}</p>
        <ul class="card__content__star"> <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
        </ul>
        <p class="card__content__price">${formatCurrency(val.price)}  đ 
            <del>250.000 đ</del>
        </p>
    </div>
  
  `;
    let card = `
            <div class="card">
                ${card_action}
                ${card_content}
            </div>`;

    productGrid.innerHTML += card;
  }
}
//----------------------------------------------------------------
function renderProductByFetch(endpoint) {
  console.log(endpoint);
  getProductsFetch(endpoint)
    .then((products) => {
      renderProductHTML(products);
    })
    .catch((error) => alert(error));
}

function renderProductsByXML(endpoint) {
  getProductsXML("GET", endpoint)
    .then((products) => {
      // console.log(JSON.parse(products))

      renderProductHTML(JSON.parse(products));
    })
    .catch((error) => alert(error));
}

//--------------------------------
function renderPagination(limit = 6) {
  removePNumbers();
  getProductsFetch("http://localhost:3000/products").then((products) => {
    let length = Math.ceil(products.length / limit);
    maxPageNumber = length;
    for (let i = 1; i <= length; i++) {
      pagination.innerHTML += `<li>
      <button id="pageNumber"  onclick="myPagination(${i},this)"> ${i}</button>
      </li>`;
    }
    elementNumber = document.querySelectorAll(
      ".grid-content__pagination__list li button"
    );
    elementNumber[0].style.backgroundColor = "#3fb871";
  });
}

quantityShow.onchange = function () { //select quantity Show
  quantityProduct = quantityShow.value;
  pageNumber = 1;
  renderPagination(quantityProduct);
  callApiPagination(pageNumber, quantityProduct);
};

prePage.onclick = function () {
  if (pageNumber > 1) {
    pageNumber -= 1;

    elementNumber[pageNumber - 1].style.backgroundColor = "#3fb871";
    elementNumber[pageNumber].style.backgroundColor = "white";

    callApiPagination(pageNumber, quantityProduct);
  }
};
nextPage.onclick = function () {
  if (pageNumber < maxPageNumber) {
    pageNumber += 1;
    console.log(pageNumber);
    elementNumber[pageNumber - 1].style.backgroundColor = "#3fb871";
    elementNumber[pageNumber - 2].style.backgroundColor = "white";

    callApiPagination(pageNumber, quantityProduct);
  }
};
function callApiPagination(page, limit) {
  let endpoint = `http://localhost:3000/products?_page=${page}&_limit=${limit}`;

  let oldProducts1 = document.querySelectorAll(".grid-content__card .card");

  removeOldProducts(oldProducts1);
 renderProductByFetch(endpoint);
  //renderProductsByXML(endpoint)
}
function myPagination(number, _this) {
  pageNumber = number;
  console.log(pageNumber);
  for (let i = 0; i < maxPageNumber; i++) {
    if (i !== pageNumber - 1) elementNumber[i].style.backgroundColor = "white";
  }

  // _this.style.backgroundColor = "#3fb871";
  elementNumber[pageNumber - 1].style.backgroundColor = "#3fb871";
  callApiPagination(pageNumber, quantityProduct);
}
//---------------start
callApiPagination(pageNumber, quantityProduct);
renderPagination(quantityProduct);
//-----------------

function handleAddToCart(tag) {
  let accessToken = localStorage.getItem("accessToken");
  let id = tag.getAttribute('data-arg1')
  if (!accessToken) {
    if (confirm("You must login before buy product !")) {
      window.location.href = "./login.html";
    }
  } else {
    if (checkProductExist(cart, id)) {
      cart.unshift({ id: id, quantity: 1 });
      localStorage.setItem("cart",JSON.stringify(cart));
      getQuantity();
      alert("Add to cart successfully !");
      localStorage.setItem("paymentCheck", false);

    }else{
      alert("Product already exist !")
    }
  }
}

function pushIdProductToStore(tag) { // truyen sting xike
  let id = tag.getAttribute('data-arg1')
  sessionStorage.setItem("IdProductDetail", id);
  window.location.href = "./detail-product.html";
}

function formatCurrency(n, separate = ".") {
  var s = n.toString();
  var regex = /\B(?=(\d{3})+(?!\d))/g;
  var ret = s.replace(regex, separate);
  return ret;
}

function checkProductExist(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id == id) {
      return false;
    }
  }
  return true;
}
