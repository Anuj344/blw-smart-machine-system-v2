const API_URL = "https://blw-smart-machine-system.onrender.com/api/machines";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");
let currentMachineCode = "";

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
            currentMachineCode = machine.machine_code;

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

// =============================
// AI CHATBOT
// =============================

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(sender, text) {

    const div = document.createElement("div");

    div.className =
        sender === "user"
        ? "user-message"
        : "ai-message";

    div.innerHTML = `
        <span>${text}</span>
    `;

    chatMessages.appendChild(div);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}

async function sendMessage() {

    const message = chatInput.value.trim();

    if (!message) return;

    addMessage("user", message);

    chatInput.value = "";

   const typing = document.createElement("div");

typing.className = "typing";

typing.id = "typing";

typing.innerHTML = "🤖 AI is typing...";

chatMessages.appendChild(typing);

chatMessages.scrollTop =
chatMessages.scrollHeight;

    try {

        const response = await fetch(
            "https://blw-smart-machine-system.onrender.com/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    machineCode: currentMachineCode,

                    message: message

                })

            }
        );

        const data = await response.json();

        document.getElementById("typing")?.remove();

        if (data.success) {

            addMessage("ai", data.reply);

        } else {

            addMessage("ai", data.message);

        }

    } catch (error) {

        chatMessages.removeChild(chatMessages.lastChild);

        addMessage(
            "ai",
            "Server Error. Please try again."
        );

        console.log(error);

    }

}

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        sendMessage();

    }

});

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

// =========================
// VOICE SEARCH
// =========================

const voiceBtn =
document.getElementById("voiceBtn");

if ('webkitSpeechRecognition' in window) {

    const recognition =
    new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    voiceBtn.addEventListener("click",()=>{

        recognition.start();

    });

    recognition.onresult=(event)=>{

        const text =
        event.results[0][0].transcript;

        chatInput.value = text;
        sendMessage();
    };

    recognition.onerror=(e)=>{

        console.log(e);

    };

}else{

    voiceBtn.style.display="none";

}

// PAGE LOAD

loadMachine();
