document.addEventListener("DOMContentLoaded", () => {
    const addObjectBtn = document.getElementById("addObjectBtn");
    const formContainer = document.getElementById("formContainer");
    const objectForm = document.getElementById("objectForm");
    const cancelBtn = document.getElementById("cancelBtn");
    const objectList = document.getElementById("objectList");

    let objects = JSON.parse(localStorage.getItem("objects")) || [];

    // Afficher les objets
    function displayObjects() {
        objectList.innerHTML = "";

        objects.forEach((obj, index) => {
            const card = document.createElement("div");
            card.classList.add("card");

            // Correction : clic = ouvre MakerWorld si lien présent
            card.addEventListener("click", () => {
                if (obj.link && obj.link.trim() !== "") {
                    window.open(obj.link, "_blank");
                }
            });

            card.innerHTML = `
                <img src="${obj.image}" alt="Image">
                <h3>${obj.name}</h3>
                <p>${obj.description}</p>
            `;

            objectList.appendChild(card);
        });
    }

    // Bouton ouvrir formulaire
    addObjectBtn.addEventListener("click", () => {
        formContainer.classList.remove("hidden");
    });

    // Annuler formulaire
    cancelBtn.addEventListener("click", () => {
        objectForm.reset();
        formContainer.classList.add("hidden");
    });

    // Ajouter un objet
    objectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const imageFile = document.getElementById("image").files[0];
        const link = document.getElementById("link").value;

        const reader = new FileReader();
        reader.onload = () => {
            const imageBase64 = reader.result;

            const newObj = { name, description, image: imageBase64, link };
            objects.push(newObj);

            localStorage.setItem("objects", JSON.stringify(objects));

            displayObjects();
            objectForm.reset();
            formContainer.classList.add("hidden");
        };

        reader.readAsDataURL(imageFile);
    });

    displayObjects();
});
