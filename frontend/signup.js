document.addEventListener("DOMContentLoaded", function () {
  // Select the sign-up button
  const signUpBtn = document.querySelector("#sign-up-btn");

  if (signUpBtn) {
    // make sure it exists
    signUpBtn.onclick = function () {
      const firstNameInput = document.querySelector("#first-name-input");
      const lastNameInput = document.querySelector("#last-name-input");
      const usernameInput = document.querySelector("#username-input");
      const passwordInput = document.querySelector("#password-input"); // later: encrypt
      const ageInput = document.querySelector("#age-input");
      const salaryInput = document.querySelector("#salary-input");

      fetch("http://localhost:5050/signup", {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          firstName: firstNameInput.value,
          lastName: lastNameInput.value,
          username: usernameInput.value,
          password: passwordInput.value,
          age: ageInput.value,
          salary: salaryInput.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Signup response:", data);
          window.location.href = "index.html";
        })
        .catch((err) => console.error(err));
    };
  } else {
    console.log("No sign up button");
  }
});
