const API_URL = "http://192.168.1.22:5000/api/machines";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

// LOAD MACHINE

async function loadMachine() {

    try {

        const response = await fetch(

            `${API_URL}/${id}`

        );

        if (!response.ok) {

            throw new Error("Machine Not Found");

        }

        const result = await response.json();

        const machine = result.machine || result;

        document.getElementById("machineImage").src =
            machine.image;

        document.getElementById("machineName").innerText =
            machine.machine_name;

        document.getElementById("machineCode").innerText =
            machine.machine_code;

        document.getElementById("department").innerText =
            machine.department;

        document.getElementById("manufacturer").innerText =
            machine.manufacturer;

        document.getElementById("year").innerText =
            machine.year || "Not Available";

        document.getElementById("operator").innerText =
            machine.operator;

        document.getElementById("location").innerText =
            machine.location;

        document.getElementById("status").innerHTML =
            getStatusBadge(machine.status);

        document.getElementById("introduction").innerText =
            machine.introduction;

        document.getElementById("working").innerText =
            machine.working_principle;

        loadList(

            "applications",

            machine.applications

        );

        loadList(

            "safety",

            machine.safety

        );

        loadList(

            "maintenance",

            machine.maintenance

        );

        loadList(

            "parts",

            machine.parts

        );

    }

    catch(error){

        console.log(error);

        document.body.innerHTML =

        `

        <div class="container mt-5">

        <div class="alert alert-danger">

        Machine Not Found

        </div>

        </div>

        `;

    }

}

// STATUS BADGE

function getStatusBadge(status){

switch(status){

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

// LOAD ARRAY DATA

function loadList(id, items) {

    const ul = document.getElementById(id);

    if (!ul) return;

    ul.innerHTML = "";

    if (!items || items.length === 0) {

        ul.innerHTML =

        "<li>Not Available</li>";

        return;

    }

    items.forEach(item => {

        ul.innerHTML +=

        `<li>${item}</li>`;

    });

}

// PRINT MACHINE DETAILS

function printMachine() {

    window.print();

}

// DOWNLOAD PDF

function downloadPDF() {

    window.open(

        `${API_URL}/pdf/${id}`,

        "_blank"

    );

}

// SHARE MACHINE

async function shareMachine() {

    const url = window.location.href;

    if (navigator.share) {

        try {

            await navigator.share({

                title: "BLW Machine Information",

                text: "Machine Details",

                url: url

            });

        }

        catch (error) {

            console.log(error);

        }

    }

    else {

        navigator.clipboard.writeText(url);

        alert("Machine Link Copied");

    }

}

// BACK BUTTON

function goBack() {

    window.history.back();

}

// PAGE LOAD

loadMachine();