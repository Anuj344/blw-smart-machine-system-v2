// API URL

const API_URL = "http://192.168.1.22:5000/api/machines";

// Global Variables

let allMachines = [];

let departmentChart = null;

let statusChart = null;


// LOGIN CHECK

const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

// TOAST

function showToast(message, type = "success") {

    const toast = document.getElementById("liveToast");

    const msg = document.getElementById("toastMessage");

    if (!toast || !msg) {

        alert(message);

        return;

    }

    toast.className =
        `toast text-bg-${type}`;

    msg.innerHTML = message;

    new bootstrap.Toast(toast).show();

}

// LOAD MACHINES

async function loadMachines() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("Unable to fetch machines");

        }

        const result = await response.json();

        // Compatible with both APIs

        allMachines = result.machines || result;

        displayMachines(allMachines);

        updateDashboard(allMachines);

        loadDepartmentFilter(allMachines);

        createDepartmentChart(allMachines);

        createStatusChart(allMachines);

    }

    catch (error) {

        console.log(error);

        showToast(

            "Failed to Load Machines",

            "danger"

        );

    }

}

// DASHBOARD

function updateDashboard(machines) {

    document.getElementById(

        "totalMachines"

    ).innerText = machines.length;

    const departments = [

        ...new Set(

            machines.map(

                machine => machine.department

            )

        )

    ];

    document.getElementById(

        "totalDepartments"

    ).innerText = departments.length;

    const operators = [

        ...new Set(

            machines.map(

                machine => machine.operator

            )

        )

    ];

    document.getElementById(

        "totalOperators"

    ).innerText = operators.length;

    document.getElementById(

        "totalQR"

    ).innerText = machines.length;

}

// DEPARTMENT FILTER

function loadDepartmentFilter(machines) {

    const filter =

        document.getElementById(

            "departmentFilter"

        );

    if (!filter) return;

    filter.innerHTML =

        `<option value="">All Departments</option>`;

    const departments = [

        ...new Set(

            machines.map(

                machine => machine.department

            )

        )

    ];

    departments.forEach(department => {

        filter.innerHTML +=

        `

        <option value="${department}">

        ${department}

        </option>

        `;

    });

}

// ADD MACHINE

const form = document.getElementById("machineForm");

if (form) {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData();

        formData.append(
            "machine_name",
            document.getElementById("machineName").value
        );

        formData.append(
            "machine_code",
            document.getElementById("machineCode").value
        );

        formData.append(
            "department",
            document.getElementById("department").value
        );

        formData.append(
            "manufacturer",
            document.getElementById("manufacturer").value
        );

        formData.append(
            "year",
            document.getElementById("year").value
        );

        formData.append(
            "operator",
            document.getElementById("operator").value
        );

        formData.append(
            "location",
            document.getElementById("location").value
        );

        formData.append(
            "status",
            document.getElementById("status").value
        );

        formData.append(
            "introduction",
            document.getElementById("introduction").value
        );

        formData.append(
            "working_principle",
            document.getElementById("working").value
        );

        formData.append(
            "applications",
            document.getElementById("applications").value
        );

        formData.append(
            "safety",
            document.getElementById("safety").value
        );

        formData.append(
            "maintenance",
            document.getElementById("maintenance").value
        );

        formData.append(
            "parts",
            document.getElementById("parts").value
        );

        const image =
            document.getElementById("image").files[0];

        if (image) {

            formData.append("image", image);

        }

        try {

            const response = await fetch(

                API_URL,

                {

                    method: "POST",

                    headers: {

                        Authorization:

                            `Bearer ${token}`

                    },

                    body: formData

                }

            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(

                    data.message ||

                    "Unable to Save"

                );

            }

            showToast(

                "✅ Machine Saved Successfully",

                "success"

            );

            // QR

            document.getElementById(

                "qrSection"

            ).style.display = "block";

            document.getElementById(

                "qrImage"

            ).src = data.machine.qrCode;

            document.getElementById(

                "downloadQR"

            ).href = data.machine.qrCode;

            form.reset();

            loadMachines();

        }

        catch (error) {

            console.log(error);

            showToast(

                error.message,

                "danger"

            );

        }

    });

}

// DOWNLOAD QR

function downloadQRCode(base64) {

    const a = document.createElement("a");

    a.href = base64;

    a.download = "MachineQR.png";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}

// IMAGE PREVIEW

const imageInput =

document.getElementById("image");

if (imageInput) {

    imageInput.addEventListener(

        "change",

        function () {

            const file = this.files[0];

            if (!file) return;

            const reader =

                new FileReader();

            reader.onload = function (e) {

                const preview =

                    document.getElementById(

                        "previewImage"

                    );

                if (preview) {

                    preview.src =

                        e.target.result;

                }

            };

            reader.readAsDataURL(file);

        }

    );

}

// DISPLAY MACHINES

function displayMachines(machines) {

    const list = document.getElementById("machineList");

    if (!list) return;

    list.innerHTML = "";

    if (machines.length === 0) {

        list.innerHTML = `

        <div class="col-12">

            <div class="alert alert-warning text-center">

                No Machines Found

            </div>

        </div>

        `;

        return;

    }

    machines.forEach(machine => {

        list.innerHTML += `

<div class="col-lg-4 col-md-6 mb-4">

<div class="card shadow-lg border-0 h-100">

<img

src="${machine.image}"

class="card-img-top"

style="height:220px;object-fit:cover;">

<div class="card-body">

<h4 class="fw-bold text-primary">

${machine.machine_name}

</h4>

<hr>

<p>

<b>Machine Code :</b>

${machine.machine_code}

</p>

<p>

<b>Department :</b>

${machine.department}

</p>

<p>

<b>Operator :</b>

${machine.operator}

</p>

<p>

<b>Status :</b>

${getStatusBadge(machine.status)}

</p>

<div class="d-grid gap-2">

<button

class="btn btn-primary"

onclick="viewMachine('${machine._id}')">

<i class="bi bi-eye-fill"></i>

View

</button>

<button

class="btn btn-warning"

onclick="editMachine('${machine._id}')">

<i class="bi bi-pencil-square"></i>

Edit

</button>

<button

class="btn btn-danger"

onclick="deleteMachine('${machine._id}')">

<i class="bi bi-trash-fill"></i>

Delete

</button>

<button

class="btn btn-dark"

onclick="downloadPDF('${machine._id}')">

📄 PDF

</button>

<button

class="btn btn-success"

onclick="downloadQRCode('${machine.qrCode}')">

<i class="bi bi-qr-code"></i>

QR Code

</button>

</div>

</div>

</div>

</div>

`;

    });

}

// STATUS BADGE

function getStatusBadge(status) {

    switch (status) {

        case "Working":

            return `<span class="badge bg-success">

            🟢 Working

            </span>`;

        case "Maintenance":

            return `<span class="badge bg-warning text-dark">

            🟡 Maintenance

            </span>`;

        case "Breakdown":

            return `<span class="badge bg-danger">

            🔴 Breakdown

            </span>`;

        default:

            return `<span class="badge bg-secondary">

            Unknown

            </span>`;

    }

}

// VIEW MACHINE

function viewMachine(id) {

    window.location.href =

        "machine.html?id=" + id;

}

// EDIT MACHINE

function editMachine(id) {

    window.location.href =

        "edit.html?id=" + id;

}

// PDF DOWNLOAD

function downloadPDF(id) {

    window.open(

        API_URL + "/pdf/" + id,

        "_blank"

    );

}

// DELETE MACHINE

async function deleteMachine(id) {

    if (!confirm("Are you sure you want to delete this machine?")) {

        return;

    }

    try {

        const response = await fetch(

            API_URL + "/" + id,

            {

                method: "DELETE",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        showToast(

            "🗑 Machine Deleted Successfully",

            "success"

        );

        loadMachines();

    }

    catch (error) {

        console.log(error);

        showToast(error.message, "danger");

    }

}

// SEARCH MACHINE

const searchInput = document.getElementById("searchMachine");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase().trim();

        const filtered = allMachines.filter(machine =>

            machine.machine_name.toLowerCase().includes(keyword) ||

            machine.machine_code.toLowerCase().includes(keyword) ||

            machine.department.toLowerCase().includes(keyword) ||

            machine.operator.toLowerCase().includes(keyword)

        );

        displayMachines(filtered);

    });

}

// DEPARTMENT FILTER

const departmentFilter =

document.getElementById("departmentFilter");

if (departmentFilter) {

    departmentFilter.addEventListener(

        "change",

        function () {

            const value = this.value;

            if (value === "") {

                displayMachines(allMachines);

                return;

            }

            const filtered = allMachines.filter(machine =>

                machine.department === value

            );

            displayMachines(filtered);

        }

    );

}

// EXPORT EXCEL

function downloadExcel() {

    window.open(

        API_URL + "/excel",

        "_blank"

    );

}

// LOGOUT

function logout() {

    if (!confirm("Logout from Admin Panel?")) {

        return;

    }

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

// DEPARTMENT CHART

function createDepartmentChart(machines) {

    if (!document.getElementById("departmentChart")) return;

    if (departmentChart) {

        departmentChart.destroy();

    }

    const counts = {};

    machines.forEach(machine => {

        counts[machine.department] =

            (counts[machine.department] || 0) + 1;

    });

    departmentChart = new Chart(

        document.getElementById("departmentChart"),

        {

            type: "bar",

            data: {

                labels: Object.keys(counts),

                datasets: [

                    {

                        label: "Machines",

                        data: Object.values(counts),

                        backgroundColor: "#0d6efd"

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        }

    );

}

// STATUS CHART

function createStatusChart(machines) {

    if (!document.getElementById("statusChart")) return;

    if (statusChart) {

        statusChart.destroy();

    }

    const status = {

        Working: 0,

        Maintenance: 0,

        Breakdown: 0

    };

    machines.forEach(machine => {

        if (status[machine.status] !== undefined) {

            status[machine.status]++;

        }

    });

    statusChart = new Chart(

        document.getElementById("statusChart"),

        {

            type: "pie",

            data: {

                labels: [

                    "Working",

                    "Maintenance",

                    "Breakdown"

                ],

                datasets: [

                    {

                        data: [

                            status.Working,

                            status.Maintenance,

                            status.Breakdown

                        ],

                        backgroundColor: [

                            "#198754",

                            "#ffc107",

                            "#dc3545"

                        ]

                    }

                ]

            },

            options: {

                responsive: true

            }

        }

    );

}

// INITIAL LOAD

window.onload = function () {

    loadMachines();

};