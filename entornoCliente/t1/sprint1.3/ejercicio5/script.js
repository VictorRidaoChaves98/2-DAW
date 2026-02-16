let parties = [];
let currentPartyId = null;

window.onload = () => {
    loadParties();
    setupModal();
};

function loadParties() {
    fetch('api/parties_list.php')
        .then(res => res.json())
        .then(data => {
            parties = data;
            renderTable();
        })
        .catch(err => console.error("Error al cargar parties:", err));
}

function renderTable() {
    const tbody = document.querySelector("#partyTable tbody");
    tbody.innerHTML = "";

    if (parties.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">No hay parties creadas.</td></tr>`;
        return;
    }

    parties.forEach(party => {
        const numMembers = party.members ? party.members.length : 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${party.partyId}</td>
      <td>${party.creatorId}</td>
      <td>${party.plannedStart}</td>
      <td>${party.levelCap}</td>
      <td>${party.ilvlCap}</td>
      <td>${numMembers}</td>
      <td>
        <button onclick="openAddMemberModal(${party.partyId})">Add Member</button>
        <button onclick="openMembersList(${party.partyId})">Ver/Remover Miembros</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function openAddMemberModal(partyId) {
    const party = parties.find(p => p.partyId === partyId);
    if (!party) return;

    const numMembers = party.members ? party.members.length : 0;

    // ✅ Verificar límite de 4 miembros antes de abrir el modal
    if (numMembers >= 4) {
        document.getElementById("modalMessage").innerHTML = `<p style="color:red">❌ La party ya tiene 4 miembros, no se pueden añadir más.</p>`;
        return;
    }

    currentPartyId = partyId;
    document.getElementById("addMemberModal").style.display = "block";
    document.getElementById("modalMessage").innerHTML = "";
    document.getElementById("membersList").innerHTML = "";
    document.getElementById("addMemberForm").reset();
}

function openMembersList(partyId) {
    const party = parties.find(p => p.partyId === partyId);
    if (!party) return;

    let membersHtml = "<h4>Miembros de la party</h4><ul>";
    party.members.forEach(m => {
        membersHtml += `<li>${m.userId} (${m.role}) 
      ${m.userId !== party.creatorId ? `<button onclick="removeMember(${partyId}, '${m.userId}')">Remove</button>` : ''}</li>`;
    });
    membersHtml += "</ul>";

    document.getElementById("membersList").innerHTML = membersHtml;
}

function setupModal() {
    const modal = document.getElementById("addMemberModal");
    const closeBtn = document.querySelector(".closeBtn");

    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

    document.getElementById("addMemberForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const userId = document.getElementById("newUserId").value.trim();
        const role = document.getElementById("newUserRole").value;

        if (!userId || !role) {
            document.getElementById("modalMessage").innerHTML = "<p style='color:red'>Todos los campos son obligatorios</p>";
            return;
        }

        addMember(currentPartyId, userId, role);
    });
}

function addMember(partyId, userId, role) {
    fetch('api/add_member.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partyId, userId, role })
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("modalMessage").innerHTML = `<p style="color:${data.success ? 'green' : 'red'}">${data.message}</p>`;
            if (data.success) loadParties();
        })
        .catch(err => console.error("Error al añadir miembro:", err));
}

function removeMember(partyId, userId) {
    fetch('api/remove_member.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partyId, userId })
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("modalMessage").innerHTML = `<p style="color:${data.success ? 'green' : 'red'}">${data.message}</p>`;
            if (data.success) loadParties();
        })
        .catch(err => console.error("Error al remover miembro:", err));
}
