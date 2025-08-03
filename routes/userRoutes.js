const express = require("express");
const router = express.Router();
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all users
router.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {     
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Internal server error" });
        }                               
        return res.status(200).json(results);
    });
}); 


// Create a new user
router.post("/users/register", (req, res) => {
    const { name, email, password , phone} = req.body; 
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }   
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = "INSERT INTO users (name, email, password,phone) VALUES (?, ?, ?,?)";
    const values = [name, email, hashedPassword , phone];

    db.query(query, values, (err, results) => { 
        if (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(201).json({ id: results.insertId, name, email });
    });
});

// User login   
router.post("/users/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }   
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);    
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }   
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
}   );
// Update a user
router.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    const { name, email , phone} = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }
    const query = `
        UPDATE users            
        SET name = ?, email = ?,phone = ?
        WHERE id = ?
    `;
    const values = [name, email,phone , userId];   
    db.query(query, values, (err, results) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }       
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }   
        console.log(token);
        return res.status(200).json({ message: "User updated successfully" });
            
    });
});     

module.exports = router;