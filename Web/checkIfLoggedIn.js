sessionToken = localStorage.getItem("sessionToken");

// Checks if the user is logged in
if (sessionToken && sessionToken != "") {
    // Gets the sign_up and login elements inside the navbar
    const sign_up = document.getElementById("sign_up");
    const login = document.getElementById("login");

    // Changes the navbar to the "logged in" version
    sign_up.innerText="My Account"
    sign_up.href="account.html"

    login.innerText="Log Out"
    login.href="sign_out.html"
}