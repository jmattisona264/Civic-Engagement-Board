let state = {
    issues: [],
    events: []
};


// Loads all data from the Express backend API
async function loadDataFromServer() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        state.issues = data.issues;
        state.events = data.events;
        
        renderIssues();
        renderEvents();
    } catch (error) {
        console.error("Connection error with backend server:", error);
    }
}

function renderIssues() {
    const container = document.getElementById('issues-container');
    container.innerHTML = ''; 

    state.issues.forEach(issue => {
        const issueCard = document.createElement('article');
        issueCard.innerHTML = `
            <h3>${issue.title}</h3>
            <p><strong>Category:</strong> ${issue.category}</p>
            <p>${issue.desc}</p>
            <div class="vote-buttons">
                <span>🔺 Votes: <strong>${issue.votes}</strong></span>
                <button class="vote-btn" onclick="handleUpvote(${issue.id})">Upvote</button>
            </div>
        `;
        container.appendChild(issueCard);
    });
}

function renderEvents() {
    const container = document.getElementById('events-container');
    container.innerHTML = '';

    state.events.forEach(event => {
        const eventItem = document.createElement('li');
        eventItem.style.margin = "10px 0"; 
        eventItem.innerHTML = `<strong>${event.title}</strong> — 📅 ${event.date}`;
        container.appendChild(eventItem);
    });
}

// Upvotes an issue on the server
async function handleUpvote(issueId) {
    try {
        const response = await fetch(`/api/issues/${issueId}/upvote`, {
            method: 'POST'
        });

        if (response.ok) {
            loadDataFromServer(); // Refresh data to get the new vote count
        }
    } catch (error) {
        console.error("Could not complete upvote network request:", error);
    }
}

// Submits a new local issue form to the server
document.getElementById('issue-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const titleInput = document.getElementById('issue-title').value;
    const descInput = document.getElementById('issue-desc').value;
    const categoryInput = document.getElementById('issue-category').value;

    const newIssue = {
        id: Date.now(), 
        title: titleInput,
        desc: descInput,
        category: categoryInput,
        votes: 0,       
        createdAt: Date.now()
    };

    try {
        const response = await fetch('/api/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newIssue)
        });

        if (response.ok) {
            loadDataFromServer();
            this.reset();
        }
    } catch (error) {
        console.error("Issue submittal failed:", error);
    }
});

// Submits a new municipal event form to the server
document.getElementById('event-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const titleInput = document.getElementById('event-title').value;
    const dateInput = document.getElementById('event-date').value;

    const newEvent = {
        id: Date.now(),
        title: titleInput,
        date: dateInput
    };

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });

        if (response.ok) {
            loadDataFromServer();
            this.reset();
        }
    } catch (error) {
        console.error("Event submittal failed:", error);
    }
});

// Runs automatically to pull down data from our server as soon as the browser opens
loadDataFromServer();