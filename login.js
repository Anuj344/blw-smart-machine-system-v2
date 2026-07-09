const API_URL = "https://blw-smart-machine-system.onrender.com/api/auth";
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if (!username || !password) {

        showToast("Enter Username & Password", "danger");

        return;

    }

    const loginBtn =
        form.querySelector("button");

    loginBtn.disabled = true;

    loginBtn.innerHTML =
        "Logging in...";

    try {

        const response = await fetch(

            "https://blw-smart-machine-system.onrender.com/api/auth/login",

            {

                method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password

                })

            }

        );

        const data = await response.json();

        if (response.ok && data.success) {

            localStorage.setItem(

                "token",

                data.token

            );

            showToast(

                "Login Successful",

                "success"

            );

            setTimeout(() => {

                window.location.href =
                    "admin.html";

            }, 1000);

        }

        else {

            showToast(

                data.message,

                "danger"

            );

        }

    }

    catch (error) {

        console.log(error);

        showToast(

            "Server Error",

            "danger"

        );

    }

    loginBtn.disabled = false;

    loginBtn.innerHTML =
        "Login";

});

// =======================
// Toast
// =======================

function showToast(message, type = "success") {

    const toast =
        document.getElementById("liveToast");

    if (!toast) {

        alert(message);

        return;

    }

    document.getElementById(

        "toastMessage"

    ).innerHTML = message;

    toast.className =
        "toast text-bg-" + type;

    new bootstrap.Toast(toast).show();

}
