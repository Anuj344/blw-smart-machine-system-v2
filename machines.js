const API_URL = "https://blw-smart-machine-system.onrender.com/api/machines";
<<<<<<< HEAD
=======

>>>>>>> 14b2e9c (Update API URL)
let allMachines = [];

// LOAD MACHINES

async function loadMachines() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("Unable to load machines");

        }

        const result = await response.json();

        allMachines = result.machines || result;

        document.getElementById("machineCount").innerText =
            allMachines.length;

        displayMachines(allMachines);

    }

    catch (error) {

        console.log(error);

        document.getElementById("machineContainer").innerHTML =

        `

        <div class="col-12">

        <div class="alert alert-danger">

        Unable to Load Machines

        </div>

        </div>

        `;

    }

}

// DISPLAY MACHINES

function displayMachines(machines){

const container =

document.getElementById("machineContainer");

container.innerHTML="";

if(machines.length===0){

container.innerHTML=

`

<div class="col-12">

<div class="alert alert-warning text-center">

No Machine Found

</div>

</div>

`;

return;

}

machines.forEach(machine=>{

container.innerHTML+=`

<div class="col-lg-4 col-md-6 mb-4">

<div class="card shadow-lg border-0 h-100">

<img

src="${machine.image}"

class="card-img-top"

style="height:220px;object-fit:cover;">

<div class="card-body">

<h4 class="text-primary fw-bold">

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

<b>Location :</b>

${machine.location}

</p>

<a

href="machine.html?id=${machine._id}"

class="btn btn-primary w-100">

View Details

</a>

</div>

</div>

</div>

`;

});

}

// LIVE SEARCH

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase().trim();

        const filteredMachines = allMachines.filter(machine => {

            return (

                (machine.machine_name || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (machine.machine_code || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (machine.department || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (machine.location || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (machine.manufacturer || "")
                .toLowerCase()
                .includes(keyword)

                ||

                (machine.operator || "")
                .toLowerCase()
                .includes(keyword)

            );

        });

        displayMachines(filteredMachines);

    });

}

// CARD HOVER EFFECT

document.addEventListener("mouseover", function(e){

    const card = e.target.closest(".card");

    if(card){

        card.style.transform = "translateY(-6px)";

        card.style.transition = "0.3s";

    }

});

document.addEventListener("mouseout", function(e){

    const card = e.target.closest(".card");

    if(card){

        card.style.transform = "translateY(0px)";

    }

});

// LOADING SPINNER

function showLoading(){

    document.getElementById("machineContainer").innerHTML =

    `

    <div class="col-12 text-center">

        <div class="spinner-border text-primary">

        </div>

        <p class="mt-3">

            Loading Machines...

        </p>

    </div>

    `;

}

// RELOAD MACHINES

function refreshMachines(){

    showLoading();

    loadMachines();

}

// INITIAL LOAD

showLoading();

loadMachines();
