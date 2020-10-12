function validateFullName() {
  var fullName = document.forms["register"]["fullName"];

  if (!fullName.value) {
    return "Full name is required !";
  } else {
    return "";
  }
}
function validatePhoneNumber() {
  var phoneNumber = document.forms["register"]["phoneNumber"];
  var regEx = /^0(1\d{9}|9\d{8})$/;

  if (!regEx.test(phoneNumber.value)) {
    return "Phone number is invalid ! !";
  } else {
    return "";
  }
}
function validateEmail() {
  var email = document.forms["register"]["email"];
  var regEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (!regEx.test(email.value)) {
    return "Email is invalid !";
  } else {
    return "";
  }
}
function validateYourWebsite() {
  var yourWebsite = document.forms["register"]["yourWebsite"];
  var regEx = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

  if (!regEx.test(yourWebsite.value)) {
    return "Website is invalid !";
  } else {
    return "";
  }
}
function validatePassword() {
  var password = document.forms["register"]["password"];
  var regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/; // number , lower , uper
  let check = false;

  if (!regEx.test(password.value)) {
    return "Password is invalid !";
  } else {
    return "";
  }
}
function validateConfirmPass() {
  var password = document.forms["register"]["password"];
  var confirmPassword = document.forms["register"]["confirmPassword"];

  if (password.value !== confirmPassword.value) {
    return "Password is not match !";
  } else {
    return "";
  }
}
function validateData() {
  let error = "";
  error += validateFullName();
  error += validatePhoneNumber();
  error += validateEmail();
  error += validateYourWebsite();
  error += validatePassword();
  error += validateConfirmPass();
  return error;
}
var form = document.forms["register"];

form.onsubmit = async (event) => {
  event.preventDefault();
  let x = validateData();

  if (x.length) {
    alert(x);
  } else {
    var formData = new FormData(document.getElementById("formElem"));
    var data = {};
    for (var pair of formData.entries()) {
      data = {
        ...data,
        [pair[0]]: pair[1],
      };
    }
    delete data.confirmPassword;
    console.log(data);

    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.status == 200) {
      if (confirm(json.message)) {
        window.location.href = "./login.html";
      }
    } else {
      alert(json.message);
    }
  }
};
