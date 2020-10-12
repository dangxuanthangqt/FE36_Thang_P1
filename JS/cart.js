var table = document.querySelector(".cart__table tbody");
var cart = JSON.parse(localStorage.getItem("cart")) || [];
var totalnotax = document.querySelector("#totalnotax");
var tax = document.querySelector("#tax");
var total = document.querySelector("#total");
var paymentConfirm = document.querySelector("#paymentConfirm");

function removeAllItem() {
  var rows_item = document.querySelectorAll(".tr-item");
  for (val of rows_item) {
    val.remove();
  }
}
removeAllItem();
function renderItems() {
  if (cart.length == 0) {
    //removeAllItem();
    let empty = `
        <tr class="tr-item"> 
            <td colspan="6">Chưa có sản phẩm trong giỏ hàng</td> 
        </tr>
        `;
    table.innerHTML += empty;
    totalnotax.innerHTML = "0";
    tax.innerHTML = "0";
    total.innerHTML = "0";
  } else {
    getAllItem();
  }
}
renderItems();
function getAllItem() {
  // removeAllItem();
  const PromiseArray = cart.map((e) => {
    let enpoint = `http://localhost:3000/products/${e.id}`;
    return getProductsFetch(enpoint);
  });
  Promise.all(PromiseArray).then((arrrayRes) => {
    var ListProduct = arrrayRes.map((e) => {
      let quantityEachProduct = getQuantityEachProduct(e);
      return {
        ...e,
        quantity: quantityEachProduct,
      };
    });
    renderItemHTML(ListProduct);
    updatePayment();
  });
}
function renderItemHTML(arrayItem) {
  for (val of arrayItem) {
    table.innerHTML += `
        <tr class="tr-item">
        <td><img src="${val.src}" alt=""/></td>
        <td> 
          <p>${val.title}</p>
        </td>
        <td> 
          <p>${formatCurrency(val.price)} </p>
        </td>
        <td> 
          <input onchange="handleChange(this)" data-id=${val.id} data-price=${
      val.price
    } class="quantityOfItem" type="number" name="quantity" min="1" max="100" value="${
      val.quantity
    }"/>
        </td>
        <td>
          <p class="thanhtien">${formatCurrency(val.price * val.quantity)} </p>
        </td>
        <td>
          <button onclick="handleDeleteItem(event,this)" data-id=${
            val.id
          } class="btn-deleteItem"> <i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>`;
  }
}
function updatePayment() {
  var thanhtien = document.querySelectorAll(".thanhtien");
  var temp = 0;
  for (val of thanhtien) {
    temp += parseFloat(unformatCurrency(val.innerHTML, ""));
  }
  totalnotax.innerHTML = formatCurrency(temp);
  tax.innerHTML = formatCurrency(temp * 0.1);
  total.innerHTML = formatCurrency(temp + temp * 0.1);
}
function handleChange(_this) {
  var price = _this.getAttribute("data-price");
  var id = _this.getAttribute("data-id");

  if (_this.value <= 0) {
    _this.value = 1;
    _this.parentNode.nextElementSibling.innerHTML = `<p class="thanhtien">${formatCurrency(
      _this.value * price
    )} Đ</p>`;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].quantity = parseInt(_this.value);
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    _this.parentNode.nextElementSibling.innerHTML = `<p class="thanhtien">${formatCurrency(
      _this.value * price
    )} Đ</p>`;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].quantity = parseInt(_this.value);
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  updatePayment();
}
function handleDeleteItem(event, _this) {
  event.preventDefault();
  let id = _this.getAttribute("data-id");
  if (window.confirm("Bạn có muốn xóa sản phẩm này không ?")) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id == id) {
        cart.splice(i, 1);
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  removeAllItem();
  renderItems();
}

//--------------------check

function checkLogin() {
  let icon = document.querySelector(".processbar__login i");
  let text = document.querySelector(".processbar__login p");
  if (localStorage.getItem("accessToken")) {
    icon.style.color = "#3fb871";
    text.style.color = "#3fb871";
  } else {
    alert("You must login !");
    window.location.href = "./login.html";
  }
}
checkLogin();
function checkAddressInfor() {
  let icon = document.querySelector(".processbar__address i");
  let text = document.querySelector(".processbar__address p");
  if (JSON.parse(localStorage.getItem("addressInfor"))) {
    icon.style.color = "#3fb871";
    text.style.color = "#3fb871";
  }
}
function checkPaymentInfor() {
  let icon = document.querySelector(".processbar__payment i");
  let text = document.querySelector(".processbar__payment p");
  if (JSON.parse(localStorage.getItem("paymentCheck"))== true) {
    icon.style.color = "#3fb871";
    text.style.color = "#3fb871";
  }
}
checkPaymentInfor()
checkAddressInfor();
//--------------------

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

var form_address = document.forms["form-address"];
form_address.onsubmit = (e) => {
  e.preventDefault();

  var formData = new FormData(form_address);

  var data = {};
  for (var pair of formData.entries()) {
    //pair la tung mang con [[key: value],[...]]
    data = {
      ...data,
      [pair[0]]: pair[1],
    };
  }
  localStorage.setItem("addressInfor", JSON.stringify(data));
  checkAddressInfor();
  modal.style.display = "none";
};

var huydonhang = document.querySelector("#huydonhang");
huydonhang.onclick = (e) => {
  e.preventDefault();
  if (confirm("Bạn có muốn hủy đơn hàng này không ?")) {
    localStorage.removeItem("cart");
    location.reload();
  }
};

var tieptucmua = document.querySelector("#tieptucmua");
tieptucmua.onclick = (e) => {
  e.preventDefault();
  location.href = "./grid.html";
};

var btnSubmit = document.forms["form-cart"];
btnSubmit.onsubmit = async (e) => {
  e.preventDefault();
  if (localStorage.getItem("addressInfor") == null) {
    if (
      window.confirm("Bạn phải nhập địa chỉ trước khi xác nhận thanh toán !")
    ) {
      modal.style.display = "block";
    }
  } else {
    if (cart.length == 0) {
      if (window.confirm("Quay trờ về để thêm sản phẩm ")) {
        window.location.href = "./grid.html";
      }
    } else {
      if (window.confirm("Xác nhận thanh toán ?")) {
        let data = {};
        let user_id = localStorage.getItem("accessToken");
        let addressInfor = JSON.parse(localStorage.getItem("addressInfor"));
        let totaltemp = parseInt(unformatCurrency(total.innerHTML));
        data = {
          user_id: user_id,
          ...addressInfor,
          cart: cart,
          total: totaltemp,
        };
        
        //const res = await postData("http://localhost:3000/invoices", data);
        const res = await fetch("http://localhost:3000/invoices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        alert(json.message);
        
        localStorage.removeItem("cart");
        localStorage.setItem("paymentCheck",true)
        
      }
    }
  }
};

