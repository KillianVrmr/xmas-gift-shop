const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DB_FILE = "db.json";

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Endpoint to get current data
app.get("/data", (req, res) => {
    fs.readFile(DB_FILE, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error reading database file" });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to update the db.json file
app.post("/data", (req, res) => {
    const newData = req.body;
    fs.writeFile(DB_FILE, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: "Error writing to database file" });
        }
        res.send({ message: "Database updated successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
