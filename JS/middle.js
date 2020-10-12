var productQuantityInCart = document.getElementById('productQuantityInCart');

var viewCart = document.getElementById('viewCart');
function getQuantity(){
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var quantity = cart.length;
    productQuantityInCart.innerText = quantity.toString();
    
}

getQuantity();
// viewCart.onclick=()=>{
//     window.location.href="./login.html"
// }

function checkProductExist(list, id) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        return false;
      }
    }
    return true;
  }
  async function getProductsFetch(endpoint) {
    try {
      let res = await fetch(endpoint);
      return await res.json();
    } catch (error) {
      throw error;
    }
  }
  async function postData (endpoint, data){
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }


  function getQuantityEachProduct(item){
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    for(val of cart){
      if(val.id===item.id)
      return val.quantity;
    }
  }
  function formatCurrency(n, separate = ".") {
    var s = n.toString();
    var regex = /\B(?=(\d{3})+(?!\d))/g;
    var ret = s.replace(regex, separate);
    return ret;
  }
  function unformatCurrency(n, separate = "") {
    var s = n.toString();
    var ret = s.replace(/[.]/g, separate);
    return ret;
  }