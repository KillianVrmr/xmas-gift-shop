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


// Add toy to child
fetch('http://localhost:3000/children/1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toys: child.toys
    })
  });

  // fetch data
  function fetchdata() {
    output.innerHTML = ''; // Clear the output area
    fetch(url) // Fetch data from your JSON server
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                const noChildrenMessage = document.createElement('div');
                noChildrenMessage.className = 'no-children-message';
                noChildrenMessage.textContent = 'No children added yet. Add a child!';
                output.appendChild(noChildrenMessage);
                return;
            }

            // Sort children by goodness in descending order
            const sortedData = data.sort((a, b) => b.goodness - a.goodness);
            sortedData.forEach(child => {
                output.innerHTML += `
                    <div class="child-item" id="child-${child.id}">
                        <span class="child-content">
                            <strong>${child.name}</strong> (Location: ${child.location})<br>
                            Goodness: ${child.goodness}<br>
                            Toys: ${child.toys.length > 0 
                                ? child.toys.map(toy => toy.name).join(', ') 
                                : 'No toys assigned yet'}
                        </span>
                        <div class="button-group">
                            <button onclick="editChild('${child.id}')">Edit</button>
                            <button onclick="deleteChild('${child.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching children:', e));
}

// load saved posts
function loadSavedChildren() {
    try {
        const savedChildren = JSON.parse(localStorage.getItem('savedChildren') || '[]');
        savedOutput.innerHTML = '';

        if (savedChildren.length === 0) {
            const noChildrenMessage = document.createElement('div');
            noChildrenMessage.className = 'no-children-message';
            noChildrenMessage.textContent = 'No saved children yet!';
            savedOutput.appendChild(noChildrenMessage);
            return;
        }

        // Sort saved children by goodness in descending order
        savedChildren.sort((a, b) => b.goodness - a.goodness);
        savedChildren.forEach(child => {
            const childDiv = document.createElement('div');
            childDiv.className = 'child-item';
            childDiv.innerHTML = `
                <span>
                    <strong>${child.name}</strong> (Location: ${child.location})<br>
                    Goodness: ${child.goodness}<br>
                    Toys: ${child.toys.length > 0 
                        ? child.toys.map(toy => toy.name).join(', ') 
                        : 'No toys assigned yet'}
                </span>
                <button onclick="removeFromSaved('${child.id}')">Remove</button>
            `;
            savedOutput.appendChild(childDiv);
        });
    } catch (error) {
        console.error('Error loading saved children:', error);
        localStorage.setItem('savedChildren', '[]'); // Reset saved data on error
    }
}
  
// Initial load
fetchdata();
loadSavedPosts();