const url = 'http://localhost:3000/children';
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
            
            // Sort posts by timestamp in descending order
            const sortedData = data.sort((a, b) => b.goodness - a.goodness);
            sortedData.forEach(child => {
                output.innerHTML += `
                    <div class="child-item" id="child-${child.id}">
                        <span class="child-content">${child.name} (Goodness: ${child.goodness}) (Toys: ${child.toys.length})</span>
                        <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-name" value="${child.name}">
                            <input type="number" class="edit-goodness" value="${child.goodness}">
                            <input type="number" class="edit-toys-count" value="${child.toys.length}">
                            <button class="smallbutton" onclick="saveEdit('${child.id}')">S</button>
                            <button class="smallbutton" onclick="cancelEdit('${child.id}')">X</button>
                        </div>
                        <div class="button-group">
                            <button onclick="editChild('editChildName${child.id}')">Edit</button>
                            <input type="text" id="editChildName${child.id}" hidden>
                            <button onclick="saveToDb('${child.id}')">Save</button>
                            <button onclick="deleteChild('${child.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching posts:', e));
}
// Editing the childeren
function editChild(id){
    console.log(id)
    document.getElementById(id).hidden = false;
}

function saveToDb(id){
    console.log("this is all the info given in"+ id)
    const newName = document.getElementById(`editChildName${id}`).value;
    fetch(`${url}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newName
        })
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error deleting post:', e)); 
}

// Delete post from database 
function deleteChild(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error deleting post:', e));
}

// Initial load
fetchdata();
//loadSavedPosts();