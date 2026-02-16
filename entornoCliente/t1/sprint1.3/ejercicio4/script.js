document.addEventListener("DOMContentLoaded", () => {
    loadParties();

    // Toggle formulario abrir/cerrar y limpiar campos
    const toggleBtn = document.getElementById("toggleFormBtn");
    const formContainer = document.getElementById("formContainer");

    toggleBtn.addEventListener("click", () => {
        if (formContainer.style.display === "none") {
            formContainer.style.display = "block";   // mostrar
            document.getElementById("partyForm").reset(); // limpiar campos al abrir
            document.getElementById("message").textContent = ""; // limpiar mensajes previos
        } else {
            formContainer.style.display = "none";    // ocultar
        }
    });

    document.getElementById("partyForm").addEventListener("submit", createParty);
});

function createParty(event) {
    event.preventDefault();

    const creatorId = document.getElementById("creatorId").value.trim();
    const plannedStart = document.getElementById("plannedStart").value;
    const levelCap = document.getElementById("levelCap").value;
    const itemLevelCap = document.getElementById("itemLevelCap").value;
    const message = document.getElementById("message");

    // Validar fecha futura
    const today = new Date().toISOString().split("T")[0];
    if (plannedStart <= today) {
        message.textContent = "❌ La fecha debe ser futura.";
        message.style.color = "red";
        return;
    }

    fetch('api/save_party.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, plannedStart, levelCap, itemLevelCap })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                message.textContent = "✅ Party creada correctamente.";
                message.style.color = "green";
                document.getElementById("partyForm").reset(); // limpiar campos después de enviar
                loadParties();
            } else {
                message.textContent = "❌ Error al crear la party.";
                message.style.color = "red";
            }
        });
}

function loadParties() {
    fetch('api/load_parties.php')
        .then(res => res.json())
        .then(data => displayParties(data))
        .catch(() => {
            document.getElementById("partyTableBody").innerHTML =
                `<tr><td colspan="6">Error al cargar las parties.</td></tr>`;
        });
}

function displayParties(parties) {
    const tableBody = document.getElementById("partyTableBody");
    tableBody.innerHTML = "";

    if (!parties || parties.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6">No hay parties creadas.</td></tr>`;
        return;
    }

    parties.forEach(party => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${party.partyId}</td>
            <td>${party.creatorId}</td>
            <td>${party.plannedStart}</td>
            <td>${party.levelCap}</td>
            <td>${party.itemLevelCap}</td>
            <td>${party.members ? party.members.length : 0}</td>
        `;
        tableBody.appendChild(row);
    });
}
