const express = require('express');
const mongoose = require('mongoose');

const app = express();

// 1. MIDDLEWARE
app.use(express.json()); // Essential for SPA/Fetch
app.use(express.static('public')); // Serves index.html

// 2. DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/sportsDB')
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ Connection Error:", err));

// 3. SCHEMA & MODEL
const Person = mongoose.model('Person', new mongoose.Schema({
    name: { type: String, required: true },
    favoriteSports: [String] // Array of strings
}));

// 4. API ROUTES

// Get All Persons
app.get('/api/persons', async (req, res) => {
    const people = await Person.find();
    res.json(people);
});

// Create or Update Helper: Converts string to clean array
const cleanSports = (input) => {
    if (Array.isArray(input)) return input;
    return input.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

// Create Person
app.post('/api/persons', async (req, res) => {
    try {
        const { name, sports } = req.body;
        const person = await Person.create({
            name,
            favoriteSports: cleanSports(sports)
        });
        res.status(201).json(person);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Update Person
app.put('/api/persons/:id', async (req, res) => {
    try {
        const { name, sports } = req.body;
        const person = await Person.findByIdAndUpdate(req.params.id, {
            name,
            favoriteSports: cleanSports(sports)
        }, { new: true });
        res.json(person);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete Person
app.delete('/api/persons/:id', async (req, res) => {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(3000, () => console.log("🚀 Server: http://localhost:3000"));
