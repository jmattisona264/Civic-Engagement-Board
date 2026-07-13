const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));


// GET Endpoint: Pulls clean, sorted database columns straight out of the cloud
app.get('/api/data', async (req, res) => {
    try {
        // Query both tables simultaneously from our cloud database
        const dbIssues = await prisma.issue.findMany({
            orderBy: { votes: 'desc' } // Delivers highest-voted items first automatically!
        });
        const dbEvents = await prisma.event.findMany();

        res.status(200).json({
            issues: dbIssues,
            events: dbEvents
        });
    } catch (error) {
        console.error("Database query exception:", error);
        res.status(500).json({ error: "Failed to pull registry entries from cloud database." });
    }
});

// POST Endpoint: Creates a permanent data row in the cloud Issue table
app.post('/api/issues', async (req, res) => {
    const { title, desc, category } = req.body;
    
    if (!title || !desc || !category) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    try {
        const createdIssue = await prisma.issue.create({
            data: {
                title,
                desc,
                category,
                votes: 0
            }
        });
        res.status(201).json({ message: "Saved to cloud DB!", data: createdIssue });
    } catch (error) {
        console.error("Database write failure:", error);
        res.status(500).json({ error: "Failed to persist issue inside database storage." });
    }
});

// POST Endpoint: Creates a permanent data row in the cloud Event table
app.post('/api/events', async (req, res) => {
    const { title, date } = req.body;
    
    if (!title || !date) {
        return res.status(400).json({ error: "Event text or date parameters missing." });
    }

    try {
        const createdEvent = await prisma.event.create({
            data: { title, date }
        });
        res.status(201).json({ message: "Event saved to cloud DB!", data: createdEvent });
    } catch (error) {
        console.error("Database write failure:", error);
        res.status(500).json({ error: "Failed to schedule event inside database storage." });
    }
});

// POST Endpoint: Atomically increments a target entry vote metric directly inside PostgreSQL
app.post('/api/issues/:id/upvote', async (req, res) => {
    const issueId = parseInt(req.params.id);

    try {
        const updatedIssue = await prisma.issue.update({
            where: { id: issueId },
            data: {
                votes: { increment: 1 } // Native SQL atomic update operation
            }
        });
        res.status(200).json({ message: "Vote tracked globally!", currentVotes: updatedIssue.votes });
    } catch (error) {
        console.error("Failed to alter record metrics:", error);
        res.status(404).json({ error: "Target node tracking index not found." });
    }
});

// Fallback 404 handler for unknown route endpoints
app.use((req, res) => {
    res.status(404).send("<h2>⚠️ Error 404: The requested route path does not exist.</h2>");
});

app.listen(PORT, () => {
    console.log(`🚀 Server successfully launched at http://localhost:${PORT}`);
});