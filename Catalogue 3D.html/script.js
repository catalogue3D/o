const addObjectBtn = document.getElementById('addObjectBtn');
const formContainer = document.getElementById('formContainer');
const cancelBtn = document.getElementById('cancelBtn');
const objectForm = document.getElementById('objectForm');
const objectList = document.getElementById('objectList');

let objects = JSON.parse(localStorage.getItem('objects')) || [];

// Ouvrir formulaire
addObjectBtn.addEventListener('click', () => {
  formContainer.classList.remove('hidden');
});

// Annuler
cancelBtn.addEventListener('click', () => {
  formContainer.classList.add('hidden');
});

// Ajouter un objet
objectForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const link = document.getElementById('link').value.trim();
  const imageFile = document.getElementById('image').files[0];

  if (!imageFile) {
    alert("Merci d'ajouter une image !");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const newObj = { name, description, image: event.target.result, link };
    objects.push(newObj);
    localStorage.setItem('objects', JSON.stringify(objects));
    displayObjects();
    objectForm.reset();
    formContainer.classList.add('hidden');
  };
  reader.readAsDataURL(imageFile);
});

// Afficher les objets
function displayObjects() {
  objectList.innerHTML = '';
  objects.forEach((obj, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${obj.image}" alt="${obj.name}">
      <h3>${obj.name}</h3>
      <p>${obj.description}</p>
      <button onclick="deleteObject(${index})">🗑️ Supprimer</button>
    `;

    // Si un lien MakerWorld est présent, ouvrir au clic sur la carte
    if(obj.link) {
      card.addEventListener('click', () => {
        window.open(obj.link, '_blank');
      });
    }

    objectList.appendChild(card);
  });
}

// Supprimer objet
function deleteObject(index) {
  objects.splice(index, 1);
  localStorage.setItem('objects', JSON.stringify(objects));
  displayObjects();
}

// Afficher au chargement
displayObjects();
