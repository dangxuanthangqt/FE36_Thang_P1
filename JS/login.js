function validateEmail() {
  var email = document.forms["login"]["email"];
  var regEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (!regEx.test(email.value)) {
    return "Email is invalid !";
  } else {
    return "";
  }
}
function validateData() {
  let error = "";
  error += validateEmail();
  return error;
}
var form = document.forms["login"];
form.onsubmit = async (e) => {
  e.preventDefault();
  let x = validateData();
  if (x.length) {
    alert(x);
  } else {
    var formData = new FormData(form);
    var data = {};
    for (var pair of formData.entries()) {
      data = {
        ...data,
        [pair[0]]: pair[1],
      };
    }

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.status == 200) {
      alert(json.message);
      localStorage.setItem("accessToken", json.accessToken);

      window.location.href = "./grid.html";
    } else {
      alert(json.message);
    }
  }
};
var gotoLogin = document.querySelector("#gotoLogin");
gotoLogin.onclick = () => {
  return (window.location.href = "./register.html");
};
