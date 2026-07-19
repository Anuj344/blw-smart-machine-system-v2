
// ================================
// API URL
// ================================

const API_URL = "https://blw-smart-machine-system.onrender.com/api/machines";
<<<<<<< HEAD
=======

>>>>>>> 14b2e9c (Update API URL)
// ================================
// GET MACHINE ID
// ================================

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

// ================================
// TOKEN
// ================================

const token = localStorage.getItem("token");

// ================================
// FORM
// ================================

const form = document.getElementById("editForm");

// ================================
// CHECK LOGIN
// ================================

if (!token) {

    alert("Login Required");

    window.location.href = "login.html";

}

// ================================
// LOAD MACHINE
// ================================

async function loadMachine() {

    try {

        const response = await fetch(

            `${API_URL}/${id}`,

            {

                method: "GET",

                headers: {

                    Authorization: "Bearer " + token

                }

            }

        );
const result = await response.json();

console.log(result);

if (!response.ok) {

    alert(result.message || "Machine Not Found");

    window.location.href = "admin.html";

    return;

}

const machine = result.machine;

        // ================================
        // BASIC DETAILS
        // ================================

        document.getElementById("machineName").value =
            machine.machine_name || "";

        document.getElementById("machineCode").value =
            machine.machine_code || "";

        document.getElementById("department").value =
            machine.department || "";

        document.getElementById("manufacturer").value =
            machine.manufacturer || "";

        document.getElementById("year").value =
            machine.year || "";

        document.getElementById("operator").value =
            machine.operator || "";

        document.getElementById("location").value =
            machine.location || "";

        document.getElementById("status").value =
            machine.status || "Working";

        // ================================
        // DESCRIPTION
        // ================================

        document.getElementById("introduction").value =
            machine.introduction || "";

        document.getElementById("working").value =
            machine.working_principle || "";

        // ================================
        // ARRAY DATA
        // ================================

        document.getElementById("applications").value =
            (machine.applications || []).join(", ");

        document.getElementById("safety").value =
            (machine.safety || []).join(", ");

        document.getElementById("maintenance").value =
            (machine.maintenance || []).join(", ");

        document.getElementById("parts").value =
            (machine.parts || []).join(", ");

                    // ================================
        // IMAGE PREVIEW
        // ================================

        const preview = document.getElementById("previewImage");

        if (machine.image) {

            preview.src = machine.image;

            preview.style.display = "block";

        } else {

            preview.style.display = "none";

        }

    } catch (error) {

        console.error(error);

        alert("Unable to Load Machine Data");

    }

}

// ==========================================
// LOAD MACHINE ON PAGE START
// ==========================================

loadMachine();

// ==========================================
// IMAGE PREVIEW ON CHANGE
// ==========================================

document.getElementById("image").addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const preview = document.getElementById("previewImage");

        preview.src = e.target.result;

        preview.style.display = "block";

    };

    reader.readAsDataURL(file);

});

// ==========================================
// UPDATE MACHINE
// ==========================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
        "machine_name",
        document.getElementById("machineName").value.trim()
    );

    formData.append(
        "machine_code",
        document.getElementById("machineCode").value.trim()
    );

    formData.append(
        "department",
        document.getElementById("department").value.trim()
    );

    formData.append(
        "manufacturer",
        document.getElementById("manufacturer").value.trim()
    );

    formData.append(
        "year",
        document.getElementById("year").value.trim()
    );

    formData.append(
        "operator",
        document.getElementById("operator").value.trim()
    );

    formData.append(
        "location",
        document.getElementById("location").value.trim()
    );

    formData.append(
        "status",
        document.getElementById("status").value
    );

    formData.append(
        "introduction",
        document.getElementById("introduction").value.trim()
    );

    formData.append(
        "working_principle",
        document.getElementById("working").value.trim()
    );

    formData.append(
        "applications",
        document.getElementById("applications").value.trim()
    );

    formData.append(
        "safety",
        document.getElementById("safety").value.trim()
    );

    formData.append(
        "maintenance",
        document.getElementById("maintenance").value.trim()
    );

    formData.append(
        "parts",
        document.getElementById("parts").value.trim()
    );

    const image = document.getElementById("image").files[0];

    if (image) {

        formData.append("image", image);

    }

        // ==========================================
    // UPDATE REQUEST
    // ==========================================

    try {

        const submitBtn = form.querySelector("button[type='submit']");

        submitBtn.disabled = true;

        submitBtn.innerHTML =
            `<span class="spinner-border spinner-border-sm"></span> Updating...`;

        const response = await fetch(

            `${API_URL}/${id}`,

            {

                method: "PUT",

                headers: {

                    Authorization: "Bearer " + token

                },

                body: formData

            }

        );

        const data = await response.json();

        console.log("Update Response :", data);

        submitBtn.disabled = false;

        submitBtn.innerHTML =
            `<i class="bi bi-check-circle"></i> Update Machine`;

        if (!response.ok) {

            showToast(

                data.message || "Unable to Update Machine",

                "danger"

            );

            return;

        }

        showToast(

            "✅ Machine Updated Successfully",

            "success"

        );

        setTimeout(() => {

            window.location.href = "admin.html";

        }, 1500);

    }

    catch (error) {

        console.error(error);

        showToast(

            "Network Error",

            "danger"

        );

        const submitBtn = form.querySelector("button[type='submit']");

        submitBtn.disabled = false;

        submitBtn.innerHTML =
            `<i class="bi bi-check-circle"></i> Update Machine`;

    }

});

// ================================
// TOAST NOTIFICATION
// ================================

function showToast(message, type = "success") {

    const toast = document.getElementById("liveToast");

    const toastMessage = document.getElementById("toastMessage");

    // Bootstrap Toast available nahi hai
    if (!toast || !toastMessage) {

        alert(message);

        return;

    }

    // Background Color

    toast.classList.remove(

        "text-bg-success",

        "text-bg-danger",

        "text-bg-warning",

        "text-bg-info"

    );

    toast.classList.add(`text-bg-${type}`);

    toastMessage.innerHTML = message;

    const bsToast = new bootstrap.Toast(toast);

    bsToast.show();

}

// ================================
// IMAGE LOAD ERROR
// ================================

const previewImage = document.getElementById("previewImage");

if (previewImage) {

    previewImage.onerror = function () {

        this.src =
            "https://via.placeholder.com/350x250?text=No+Image";

    };

}

// ================================
// CHECK REQUIRED FIELDS
// ================================

function validateForm() {

    const requiredFields = [

        "machineName",

        "machineCode",

        "department",

        "location"

    ];

    for (let id of requiredFields) {

        const element = document.getElementById(id);

        if (!element.value.trim()) {

            showToast(

                element.placeholder + " is Required",

                "warning"

            );

            element.focus();

            return false;

        }

    }

    return true;

}

// ==========================================
// AUTO UPPERCASE MACHINE CODE
// ==========================================

const machineCode = document.getElementById("machineCode");

if (machineCode) {

    machineCode.addEventListener("keyup", function () {

        this.value = this.value.toUpperCase();

    });

}

// ==========================================
// YEAR VALIDATION
// ==========================================

const yearInput = document.getElementById("year");

if (yearInput) {

    yearInput.addEventListener("input", function () {

        if (

            this.value !== "" &&

            !/^[0-9]{4}$/.test(this.value)

        ) {

            this.style.borderColor = "red";

        }

        else {

            this.style.borderColor = "#ced4da";

        }

    });

}

// ==========================================
// PAGE LOADING EFFECT
// ==========================================

window.addEventListener("load", function () {

    document.body.style.opacity = "1";

});

// ==========================================
// CONSOLE
// ==========================================

console.log("==================================");

console.log("BLW EDIT MODULE LOADED");

console.log("Machine ID :", id);

console.log("Token :", token);

console.log("==================================");
