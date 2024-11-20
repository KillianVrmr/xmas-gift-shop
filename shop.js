const url = 'http://localhost:3000/children';
const toysUrl = 'http://localhost:3000/toys';

const output = document.getElementById('output');
const savedOutput = document.getElementById('savedOutput');

// Add new post
document.getElementById('addChildButton').addEventListener('click', () => {
    const newPost = {
        name: document.getElementById('childName').value,
        goodness: document.getElementById('childGoodScore').value,
        location: document.getElementById('childCity').value,
        toys: [] 
    };
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
        fetchdata();
        document.getElementById('childName').value = '';
        document.getElementById('childGoodScore').value = '';
        document.getElementById('childCity').value = '';
    })
    .catch(e => console.error('Error adding post:', e));
});

// DATABASE FUNCTIONS
// Fetch data from database
function fetchdata() {
    output.innerHTML = '';
    fetch(url)
        .then(res => res.json())
        .then(data => {

            if (data.length === 0) {
                
                const noPostsMessage = document.createElement('div');
                noPostsMessage.className = 'no-posts-message';
                noPostsMessage.textContent = 'No posts available. Add your first post!'; 
                output.appendChild(noPostsMessage);
                return;
            }
            
            // Sort posts by goodness-level
            const sortedData = data.sort((a, b) => b.goodness - a.goodness);
            sortedData.forEach(child => {
              
                const childIdentity = document.createElement('div');
                childIdentity.id = `${child.id}`;
                childIdentity.className = "childList";
                // Create the edit button
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
            
                // Create the input element and hide it by default
                const input = document.createElement('input');
                input.id = `input-${child.id}`
                input.type = 'text';
                input.style.display = 'none';
                //display elements
                const childName = document.createElement('p');
                childName.textContent = child.name;
                const childGoodness = document.createElement("p");
                childGoodness.textContent = child.goodness;
                const childLocation = document.createElement('p');
                childLocation.textContent = child.location;

                const dropdown = document.createElement('select');
                dropdown.id = `dropdown-${child.id}`;
                // Create the save to local button
                const saveLocalButton = document.createElement('button');
                saveLocalButton.id = `localSave-${child.id}`
                saveLocalButton.textContent = 'Save to Local';
            
                // Create the save to db button
                const saveDbButton = document.createElement('button');
                saveDbButton.id = `DBSave-${child.id}`
                saveDbButton.textContent = 'Save to DB';
            
                // Create the delete button
                const deleteButton = document.createElement('button');
                deleteButton.id = `delete-${child.id}`
                deleteButton.textContent = 'Delete';
            
                // Add event listeners to the buttons
                editButton.addEventListener('click', () => {
                    console.log(`${child.id}`)
                   editChild(`${child.id}`)
                });
                dropdown.addEventListener('focus', () => {fillDropdown(child.id)} )
                saveLocalButton.addEventListener('click', () => {
                    saveToLocal(child.id, child.name, child.goodness, child.location)
                });
            
                saveDbButton.addEventListener('click', () => {
                    saveToDb(child.id)
                });
            
                deleteButton.addEventListener('click', () => {
                    deleteChild(child.id)
                });
            
                // Append the elements to the parent element
                
                const masterElement = document.getElementById(output.id);
                masterElement.appendChild(childIdentity);
                const parentElement = document.getElementById(childIdentity.id);
                console.log(parentElement, childIdentity);
                parentElement.appendChild(childName);
                parentElement.appendChild(childGoodness);
                parentElement.appendChild(childLocation);
                parentElement.appendChild(editButton);
                parentElement.appendChild(input);
                parentElement.appendChild(dropdown);
                parentElement.appendChild(saveLocalButton);
                parentElement.appendChild(saveDbButton);
                parentElement.appendChild(deleteButton);
            });
        })
        .catch(e => console.error('Error fetching posts:', e));
}

function fillDropdown(id){
    
    const dropdownElement = document.getElementById(`dropdown-${id}`)
    dropdownElement.innerHTML = '';
    dropdownElement.setAttribute('multiple', 'multiple');
    fetch(toysUrl)
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            // Create an option element
            const option = document.createElement('option');
            option.value = item.id; // Adjust based on your data structure
            option.text = item.name; // Adjust based on your data structure
            dropdownElement.appendChild(option);})})
    .catch(e => console.error('Error failed to create dropdown menu:', e))
}

// Editing the childeren
function editChild(id){
    const parentElement = document.getElementById(id)
    console.log(parentElement)
    const inputElement = parentElement.querySelector('input');
    if (!inputElement) {
        console.error(`Element with ID '${id}' not found.`);
        return;
    }
    
    // Check and set display property
    inputElement.style.display = 'block'; // Unhide the element by setting it to 'block'

}
//original saveToDb function
// function saveToDb(id){
//     console.log("this is all the info given in"+ id)
//     const newName = document.getElementById(`editChildName${id}`).value;
//     fetch(`${url}/${id}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             name: newName
//         })
//     })
//     .then(() => fetchdata())
//     .catch(e => console.error('Error updating post:', e)); 
// }

function saveToDb(id){
    const newName = document.getElementById(`input-${id}`).value;
    const unselectedValues = Array.from(document.getElementById(`dropdown-${id}`).options)
    .filter(option => option.selected)
    .map(option => option.text);
    
    console.log(unselectedValues)

    fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: newName ,toys: unselectedValues
        })

    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        fetchdata(); // Refresh data
        // Hide input field and Save button after saving
        inputField.hidden = true;
        saveButton.hidden = true;
    })
    .catch(e => console.error('Error updating post:', e));
}

// Delete post from database 
function deleteChild(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error deleting post:', e));
}

// LOCALSTORAGE FUNCTIONS
function loadSavedPosts() {
    try {
        const savedChildren = JSON.parse(localStorage.getItem('savedChildren') || '[]');
        savedOutput.innerHTML = '';
        
        if (savedChildren.length === 0) {
            const noChildrenMessage = document.createElement('div');
            noChildrenMessage.className = 'no-posts-message';
            noChildrenMessage.textContent = 'No saved posts yet!';
            savedOutput.appendChild(noChildrenMessage);
            return;
        }

        // Sort saved posts by timestamp in descending order
        savedChildren.sort((a, b) => b.goodness - a.goodness);
        savedChildren.forEach(child => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-item';
            postDiv.innerHTML = `
                <span>${child.name} <br> Goodness score: ${child.goodness} Location: ${child.location}<br></span>
                <button onclick="removeFromSaved('${child.id}')">Remove</button>
            `;
            savedOutput.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error loading saved children:', error);
        localStorage.setItem('savedChildren', '[]');
    }
}

function saveToLocal(childId, childName, childGoodness, childLocation) {
    try {
        const child = {
            id: childId,  // postId is received as a string
            name: childName,
            goodness: childGoodness,
            location: childLocation
        };
        
        const savedChildren = JSON.parse(localStorage.getItem('savedChildren') || '[]');
        
        if (!savedChildren.some(c => c.id === child.id)) {  // Comparing strings with strings
            savedChildren.push(child);
            localStorage.setItem('savedChildren', JSON.stringify(savedChildren));
            loadSavedPosts();
        } else {
            alert('This post is already saved!');
        }
    } catch (error) {
        console.error('Error saving post:', error);
    }
}

function removeFromSaved(childId) {
    try {
        const savedChildren = JSON.parse(localStorage.getItem('savedChildren') || '[]');
        // Convert postId to string for consistent comparison
        const childIdString = String(childId);
        const updatedChildren = savedChildren.filter(post => post.id !== childIdString);
        localStorage.setItem('savedChildren', JSON.stringify(updatedChildren));
        loadSavedPosts();
    } catch (error) {
        console.error('Error removing saved post:', error);
    }
}
//this function makes all the types of toys to be able to added on as a visual indicator but also,
// mirrors this in the databank since thats used for the actual choices
document.getElementById('addToyType').addEventListener('click', function() {
    // Your event handling code here
    const toyType = document.getElementById('toyType').value;
    let exists = false;
    if(toyType != ""){
        fetch(toysUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if(toyType==item.name){exists=true}
                console.log(exists,toyType,item.name)
                console.log('Button clicked!',exists);
            })
            if(!exists)
                {
                    const newToyType = document.createElement('div');
                    newToyType.textContent = toyType;
                    document.getElementById('toyTypes').appendChild(newToyType);
                    fetch(toysUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: toyType })})
                }
        
        }).catch(error => console.error("Could not find toys in databank", error))}}
    
    
    
);

fetchToys();
fetchdata(); // haalt uit json database
loadSavedPosts(); // haalt uit localstorage 

