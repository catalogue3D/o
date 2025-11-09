const addBtn = document.getElementById("addObjectBtn");
const formContainer = document.getElementById("formContainer");
const saveBtn = document.getElementById("saveObject");
const cancelBtn = document.getElementById("cancelAdd");
const listContainer = document.getElementById("objectsList");

let creations = JSON.parse(localStorage.getItem("creations3D")) || [];

function afficherObjet(objet) {
  const card = document.createElement("div");
  card.classList.add("object-card");

  card.innerHTML = `
    <h3>${objet.nom}</h3>
    <p>${objet.description}</p>
    ${
      objet.lien
        ? `<a href="${objet.lien}" target="_blank">🔗 Voir sur MakerWorld</a>`
        : ""
    }
  `;

  listContainer.appendChild(card);
}

// Affiche les objets enregistrés
creations.forEach(afficherObjet);

// Ouvre le formulaire
addBtn.addEventListener("click", () => {
  formContainer.classList.remove("hidden");
});

// Annule l’ajout
cancelBtn.addEventListener("click", () => {
  formContainer.classList.add("hidden");
});

// Sauvegarde une nouvelle fiche
saveBtn.addEventListener("click", () => {
  const nom = document.getElementById("objectName").value.trim();
  const desc = document.getElementById("objectDesc").value.trim();
  const lien = document.getElementById("objectLink").value.trim();

  if (!nom || !desc) {
    alert("Merci de remplir au moins le nom et la description !");
    return;
  }

  const nouvelObjet = { nom, description: desc, lien };
  creations.push(nouvelObjet);

  localStorage.setItem("creations3D", JSON.stringify(creations));

  afficherObjet(nouvelObjet);

  document.getElementById("objectName").value = "";
  document.getElementById("objectDesc").value = "";
  document.getElementById("objectLink").value = "";

  formContainer.classList.add("hidden");
});
