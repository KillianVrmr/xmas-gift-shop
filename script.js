document.addEventListener("DOMContentLoaded", () => {
    const inputField1 = document.getElementById("text-input1");
    const inputField2 = document.getElementById("text-input2");
    const saveButton = document.getElementById("save-btn");
    const displayContainer = document.getElementById("display-container");

    // Array to store display container data
    let data = [];

    // Fetch existing data from db.json
    async function fetchData() {
        try {
            const response = await fetch("http://localhost:3000/data");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            data = await response.json();
            renderData();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Save data to db.json via backend
    async function saveData() {
        try {
            const response = await fetch("http://localhost:3000/data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error("Failed to save data");
            }
        } catch (error) {
            console.error("Error saving data:", error);
        }
    }

    // Render the data from the array
    function renderData() {
        displayContainer.innerHTML = ""; // Clear current content
        data.forEach((entry, index) => {
            const displayBox = document.createElement("div");
            displayBox.classList.add("display-box");

            const displayText1 = document.createElement("span");
            displayText1.classList.add("display-text");
            displayText1.textContent = `Field 1: ${entry.field1}`;

            const displayText2 = document.createElement("span");
            displayText2.classList.add("display-text");
            displayText2.textContent = `Field 2: ${entry.field2}`;

            const actionButtons = document.createElement("div");
            actionButtons.classList.add("action-buttons");

            const editButton = document.createElement("button");
            editButton.classList.add("edit-btn");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => {
                const newText1 = prompt("Edit first field:", entry.field1);
                const newText2 = prompt("Edit second field:", entry.field2);

                if (newText1 !== null && newText1.trim() !== "") {
                    entry.field1 = newText1;
                }
                if (newText2 !== null && newText2.trim() !== "") {
                    entry.field2 = newText2;
                }

                renderData();
                saveData();
            });

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                data.splice(index, 1);
                renderData();
                saveData();
            });

            actionButtons.appendChild(editButton);
            actionButtons.appendChild(deleteButton);

            displayBox.appendChild(displayText1);
            displayBox.appendChild(displayText2);
            displayBox.appendChild(actionButtons);

            displayContainer.appendChild(displayBox);
        });
    }

    saveButton.addEventListener("click", () => {
        const text1 = inputField1.value.trim();
        const text2 = inputField2.value.trim();

        if (text1 === "" || text2 === "") {
            alert("Please fill out both fields!");
            return;
        }

        data.push({ field1: text1, field2: text2 });
        renderData();
        saveData();

        inputField1.value = "";
        inputField2.value = "";
    });

    // Load initial data
    fetchData();
});
