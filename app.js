const defaultIssues = [
    {
        id: 1,
        title: "Large Pothole on Hermit Street.",
        desc: "The pothole on the right side of the street needs fixing. Locals are concerned.",
        category: "Infrastructure",
        votes: 35,
        createdAt: new Date("2026-05-20").getTime()
    },
    {
        id: 2,
        title: "Trash scattered in the Queen Street Park",
        desc: "A littering issue seems to be prevalent and poses health risks.",
        category: "Public/Environmental Health",
        votes: 48,
        createdAt: new Date("2026-05-26").getTime()
    }
];

const defaultEvents = [
    { id: 1, title: "Town Hall Meeting", date: "2026-06-26" },
    {id : 2, title: "Neighborhood Community Service Clean Up", date: "2026-06-13"}
];

let state = {
    issues: JSON.parse(localStorage.getItem('civic_issues')) || defaultIssues,
    events: JSON.parse(localStorage.getItem('civic_events')) || defaultEvents

};

function saveState() {
    localStorage.setItem('civic_issues', JSON.stringify(state.issues));
    localStorage.setItem('civic_events', JSON.stringify(state.events));
}