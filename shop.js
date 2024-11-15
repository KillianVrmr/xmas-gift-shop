const url = 'http://localhost:3000/toys';

// Add new post
document.getElementById('addChildButton').addEventListener('click', () => {
    const newPost = {
        title: document.getElementById('childName').value,
        goodness: document.getElementById('childGoodScore').value,
        location: document.getElementById('childCity').value
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