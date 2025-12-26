document.addEventListener("DOMContentLoaded", () => {
    const addObjectBtn = document.getElementById("addObjectBtn");
    const formContainer = document.getElementById("formContainer");
    const objectForm = document.getElementById("objectForm");
    const cancelBtn = document.getElementById("cancelBtn");
    const objectList = document.getElementById("objectList");

    let objects = JSON.parse(localStorage.getItem("objects")) || [];

    function saveObjects() {
        localStorage.setItem("objects", JSON.stringify(objects));
    }

    function displayObjects() {
        objectList.innerHTML = "";

        if (objects.length === 0) {
            objectList.innerHTML = "<p style='text-align:center;width:100%'>Aucune impression enregistrée.</p>";
            return;
        }

        objects.forEach((obj, index) => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.addEventListener("click", () => {
                if (obj.link && obj.link.trim() !== "") {
                    window.open(obj.link, "_blank");
                }
            });

            card.innerHTML = `
                <img src="${obj.image}" alt="Image">
                <h3>${obj.name}</h3>
                <p>${obj.description}</p>
                <button class="delete-btn">🗑 Supprimer</button>
            `;

            // Bouton supprimer
            const deleteBtn = card.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // empêche l'ouverture du lien
                const confirmDelete = confirm("Supprimer cet objet ?");
                if (confirmDelete) {
                    objects.splice(index, 1);
                    saveObjects();
                    displayObjects();
                }
            });

            objectList.appendChild(card);
        });
    }

    addObjectBtn.addEventListener("click", () => {
        formContainer.classList.remove("hidden");
    });

    cancelBtn.addEventListener("click", () => {
        objectForm.reset();
        formContainer.classList.add("hidden");
    });

    objectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const imageFile = document.getElementById("image").files[0];
        const link = document.getElementById("link").value;

        const reader = new FileReader();
        reader.onload = () => {
            objects.push({
                name,
                description,
                image: reader.result,
                link
            });

            saveObjects();
            displayObjects();
            objectForm.reset();
            formContainer.classList.add("hidden");
        };

        reader.readAsDataURL(imageFile);
    });

    displayObjects();
});
