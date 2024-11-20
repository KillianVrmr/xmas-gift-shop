const url = 'http://localhost:3000/children';
const toyUrl = 'http://localhost:3000/toys';
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
                output.innerHTML += `
                    <div class="child-item" id="child-${child.id}">
                        <span class="child-content"><strong>${child.name}</strong><br> (Goodness: ${child.goodness})(Location:${child.location})(Toys: ${child.toys.map(toy => toy.name).join(', ') || 'None'})</span>

                        <div class="button-group">
                            <button onclick="editChild('${child.id}')">Edit</button>
                            <input type="text" id="editChildName${child.id}" hidden>
                            <button id="saveButton${child.id}" hidden onclick="saveToDb('${child.id}')">Save Changes</button>
                            <button onclick="saveToLocal('${child.id}', '${child.name}', ${child.goodness}, '${child.location}')">Save Locally</button>
                            <button onclick="deleteChild('${child.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching posts:', e));
}

// loadin toy url
function fetchToys() {
    toyDiv.innerHTML = '';
    fetch(toyUrl)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                const noPostsMessage = document.createElement('div');
                noPostsMessage.className = 'no-posts-message';
                noPostsMessage.textContent = 'No posts available. Add your first post!';
                output.appendToy(noPostsMessage);
                return;
            }
            
            //dit nog vervangen door andere sorteermanier
            const sortedData = data.sort((a, b) => b.goodness - a.goodness);

            sortedData.forEach(toy => {
                output.innerHTML += `
                    <div class="toy-item" id="toy${toy.id}">
                        <span class="toy-content"><strong>${toy.name}</strong><br></span>    
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching posts:', e));
}

// Editing the childeren
function editChild(id) {
    const inputField = document.getElementById(`editChildName${id}`);
    const saveButton = document.getElementById(`saveButton${id}`);
    
    inputField.hidden = false;
    saveButton.hidden = false;

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

function saveToDb(id) {
    const inputField = document.getElementById(`editChildName${id}`);
    const saveButton = document.getElementById(`saveButton${id}`);
    
    const newName = inputField.value;
    
    fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
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


fetchToys();
fetchdata(); // haalt uit json database
loadSavedPosts(); // haalt uit localstorage 

