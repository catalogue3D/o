const BIN_ID = "YOUR_BIN_ID_HERE"; // remplace par ton Bin ID
const API_KEY = "YOUR_API_KEY_HERE"; // remplace par ta clé JSONBin

const addObjectBtn = document.getElementById('addObjectBtn');
const formContainer = document.getElementById('formContainer');
const cancelBtn = document.getElementById('cancelBtn');
const objectForm = document.getElementById('objectForm');
const objectList = document.getElementById('objectList');

let objects = [];

// --- Affichage ---
function displayObjects() {
  objectList.innerHTML = '';
  objects.forEach((obj, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${obj.image}" alt="${escapeHtml(obj.name)}">
      <h3>${escapeHtml(obj.name)}</h3>
      <p>${escapeHtml(obj.description)}</p>
      <button onclick="deleteObject(${index})">🗑️ Supprimer</button>
    `;

    if (obj.link) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) window.open(obj.link, '_blank');
      });
    }

    objectList.appendChild(card);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// --- Local fallback ---
function saveLocal() {
  localStorage.setItem('objects', JSON.stringify(objects));
}
function loadLocal() {
  try {
    const raw = localStorage.getItem('objects');
    if (raw) objects = JSON.parse(raw);
  } catch (e) { objects = []; }
}

// --- JSONBin ---
async function loadFromJsonBin() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`);
    if (!res.ok) throw new Error('Erreur fetch bin');
    const json = await res.json();
    if (Array.isArray(json.record)) {
      objects = json.record;
      saveLocal();
      displayObjects();
      console.log('Chargé depuis JSONBin (' + objects.length + ' objets).');
      return;
    }
  } catch (err) {
    console.warn('Impossible de charger JSONBin, utilisation du cache local.', err);
    loadLocal();
    displayObjects();
  }
}

async function saveToJsonBin() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(objects)
    });
    if (!res.ok) throw new Error('Erreur sauvegarde JSONBin');
    saveLocal();
    console.log('Sauvegarde sur JSONBin réussite.');
  } catch (err) {
    console.error('Erreur JSONBin, sauvegarde locale conservée.', err);
    saveLocal();
  }
}

// --- UI ---
addObjectBtn.addEventListener('click', () => formContainer.classList.remove('hidden'));
cancelBtn.addEventListener('click', () => formContainer.classList.add('hidden'));

objectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const description = document.getElementById('description').value.trim();
  const imageFile = document.getElementById('image').files[0];
  const link = document.getElementById('link').value.trim();

  if (!imageFile) {
    alert("Merci d'ajouter une image !");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(event) {
    const newObj = { name, description, image: event.target.result, link };
    objects.push(newObj);
    displayObjects();
    objectForm.reset();
    formContainer.classList.add('hidden');
    saveLocal();
    await saveToJsonBin();
  };
  reader.readAsDataURL(imageFile);
});

window.deleteObject = async function(index) {
  if (!confirm('Supprimer cet objet ?')) return;
  objects.splice(index, 1);
  displayObjects();
  saveLocal();
  await saveToJsonBin();
}

// --- Init ---
(async function init() {
  await loadFromJsonBin();
})();
