let members = [];

// DOM
const addMemberBtn = document.getElementById("addMemberBtn");
const modal = document.getElementById("memberModal");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("memberForm");
const membersTable = document.querySelector("#membersTable tbody");
const modalTitle = document.getElementById("modalTitle");

// --------------------
// Función para obtener miembros desde la API
// --------------------
async function loadMembers() {
    try {
        const response = await fetch("api/getMembers.php");
        if (!response.ok) throw new Error("Error al cargar los miembros");
        members = await response.json();
        renderTable();
    } catch (error) {
        console.error("Error:", error);
        alert("❌ No se pudieron cargar los miembros desde la API");
    }
}

// --------------------
// Render tabla
// --------------------
function renderTable() {
    membersTable.innerHTML = "";
    members.forEach((member, index) => {
        membersTable.innerHTML += `
            <tr>
                <td>${member.user_id}</td>
                <td>${member.username}</td>
                <td>${member.level}</td>
                <td>${member.ilvl}</td>
                <td>${member.character_role}</td>
                <td>${member.guild_role}</td>
                <td>
                    <button class="edit-btn" onclick="editMember(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteMember(${index})">Delete</button>
                </td>
            </tr>`;
    });
}

// --------------------
// Abrir modal
// --------------------
addMemberBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    modalTitle.textContent = "Add New Member";
    form.reset();
    limpiarErrores();
    document.getElementById("editingIndex").value = "";
});

// --------------------
// Cerrar modal
// --------------------
closeModal.addEventListener("click", closeAndResetModal);
window.onclick = function (event) {
    if (event.target == modal) closeAndResetModal();
};

function closeAndResetModal() {
    modal.style.display = "none";
    form.reset();
    limpiarErrores();
}

// --------------------
// Validaciones
// --------------------
function esEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function mostrarError(input, mensaje) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error")) {
        error = document.createElement("span");
        error.classList.add("error");
        input.insertAdjacentElement("afterend", error);
    }
    error.textContent = mensaje;
}

function limpiarErrores() {
    document.querySelectorAll(".error").forEach(e => e.remove());
}

// --------------------
// Guardar (Create / Update) con API
// --------------------
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    limpiarErrores();

    const editingIndex = document.getElementById("editingIndex").value;
    const userIdInput = document.getElementById("user_id");
    const emailInput = document.getElementById("email");

    if (userIdInput.value.trim() === "") {
        mostrarError(userIdInput, "El user_id es obligatorio");
        return;
    }

    if (!esEmailValido(emailInput.value)) {
        mostrarError(emailInput, "Email no válido");
        return;
    }

    const newMember = {
        user_id: userIdInput.value,
        username: document.getElementById("username").value,
        level: parseInt(document.getElementById("level").value),
        ilvl: parseInt(document.getElementById("ilvl").value),
        character_role: document.getElementById("character_role").value,
        guild_role: document.getElementById("guild_role").value,
        main_archetype: document.getElementById("main_archetype").value,
        secondary_archetype: document.getElementById("secondary_archetype").value,
        email: emailInput.value,
        notify_email: document.getElementById("notify_email").checked
    };

    try {
        let url = "";
        let method = "";

        if (editingIndex !== "") {
            // Update
            url = "api/updateMembers.php";
            method = "POST"; // tu endpoint acepta POST o PUT
        } else {
            // Create
            url = "api/addMember.php";
            method = "POST";
        }

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMember)
        });

        const result = await response.json();

        if (result.status === "success") {
            alert(`✔ ${result.message}`);
            loadMembers(); // recargar tabla desde API
            closeAndResetModal();
        } else {
            alert(`❌ ${result.message}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Ocurrió un error al guardar el miembro");
    }
});

// --------------------
// Editar
// --------------------
function editMember(index) {
    const member = members[index];
    modal.style.display = "flex";
    modalTitle.textContent = "Edit Member";

    document.getElementById("editingIndex").value = index;
    document.getElementById("user_id").value = member.user_id;
    document.getElementById("username").value = member.username;
    document.getElementById("level").value = member.level;
    document.getElementById("ilvl").value = member.ilvl;
    document.getElementById("character_role").value = member.character_role;
    document.getElementById("guild_role").value = member.guild_role;
    document.getElementById("main_archetype").value = member.main_archetype;
    document.getElementById("secondary_archetype").value = member.secondary_archetype;
    document.getElementById("email").value = member.email;
    document.getElementById("notify_email").checked = member.notify_email;
}

// --------------------
// Eliminar (solo local por ahora, luego API)
// --------------------
function deleteMember(index) {
    if (confirm("¿Seguro que deseas eliminar este miembro?")) {
        const user_id = members[index].user_id;

        fetch("api/deleteMember.php", {
            method: "POST", // o DELETE según tu endpoint
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id })
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === "success") {
                    alert(`✔ ${result.message}`);
                    loadMembers();
                } else {
                    alert(`❌ ${result.message}`);
                }
            })
            .catch(err => {
                console.error(err);
                alert("❌ Error al eliminar miembro");
            });
    }
}

// --------------------
// Inicializamos tabla con datos de la API
// --------------------
loadMembers();
