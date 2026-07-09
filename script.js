const machineContainer = document.getElementById("machineContainer");

async function loadMachines() {

    try {

        const response = await fetch("https://blw-smart-machine-system.onrender.com/api/machines");

        const machines = await response.json();

document.getElementById("machineCount").innerText = machines.length;
        machineContainer.innerHTML = "";

        machines.forEach(machine => {

    machineContainer.innerHTML += `

    <div class="col-lg-4 col-md-6 col-sm-12 mb-4">

        <div class="card machine-card shadow-lg h-100">

            <img src="${machine.image}"
                 class="card-img-top"
                 style="height:220px; object-fit:cover;">

            <div class="card-body">

                <h4 class="fw-bold text-primary">
                    ${machine.machine_name}
                </h4>

                <hr>

                <p>
                    <i class="bi bi-upc-scan"></i>
                    <b>Code:</b> ${machine.machine_code}
                </p>

                <p>
                    <i class="bi bi-building"></i>
                    <b>Department:</b> ${machine.department}
                </p>

                <p>
                    <i class="bi bi-person-fill"></i>
                    <b>Operator:</b> ${machine.operator}
                </p>

                <button
                    class="btn btn-primary w-100"
                    onclick="viewMachine('${machine._id}')">

                    <i class="bi bi-eye-fill"></i>

                    View Details

                </button>

            </div>

        </div>

    </div>

    `;

});

    }

    catch(error){

        console.log(error);

    }

}

function viewMachine(id){

    window.location.href=`machine.html?id=${id}`;

}

loadMachines();
