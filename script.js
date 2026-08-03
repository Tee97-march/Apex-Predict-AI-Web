const status = document.getElementById("status");

window.onload = () => {
    status.innerHTML = "✅ AI Engine Ready";
};

function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if(username === "" || password === ""){

        alert("Please enter Username and Password.");

        return;

    }

    status.innerHTML = "🔄 Authenticating...";

    setTimeout(() => {

        status.innerHTML = "✅ Login Successful";

        alert(
            "Welcome to APEX Predict AI Version 2.1 XL"
        );

    },2000);

}
