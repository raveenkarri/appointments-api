const express = require("express");
const router = express.Router();
const db = require("../db.js");

// Get all doctors
router.get("/doctors", (req, res) => {
    db.query("SELECT * FROM doctors", (err, results) => {
        if (err) {
            console.error("Error fetching doctors:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
     return res.status(200).json(results);
      
    })
});
// Get a doctor by ID
router.get("/doctors/:id", (req, res) => {
    const doctorId = req.params.id; 
    db.query("SELECT * FROM doctors WHERE id = ?", [doctorId], (err, results) => {
        if (err) {
            console.error("Error fetching doctor:", err);
            return res.status(500).json({ error: "Internal server error" });
        }   
        if (results.length === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }   
        return res.status(200).json(results[0]);
    });
}); 
// Create a new doctor
router.post("/doctors", (req, res) => {
  const {
    name,
    specialization,
    qualification,
    experience,
    email,
    phone,
    location,
    profile_image,
    available_days,
    timings,
    bio,
    consultation_fee,
  } = req.body;

  if (!name || !specialization) {
    return res.status(400).json({ error: "Name and specialization are required" });
  }

  const query = `
    INSERT INTO doctors (
      name, specialization, qualification, experience,
      email, phone, location, profile_image,
      available_days, timings, bio, consultation_fee
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    specialization,
    qualification,
    experience,
    email,
    phone,
    location,
    profile_image,
    available_days,
    timings,
    bio,
    consultation_fee,
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error creating doctor:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(201).json({ id: results.insertId, name, specialization });
  });
});
    

// Update a doctor
router.put("/doctors/:id", (req, res) => {
  const doctorId = req.params.id;
  if (!doctorId) {
    return res.status(400).json({ error: "Doctor id required for update!" });
  }
  const {
    name,
    specialization,
    qualification,
    experience,
    email,
    phone,
    location,
    profile_image,
    available_days,
    timings,
    bio,
    consultation_fee,
  } = req.body;

  if (!name || !specialization) {
    return res.status(400).json({ error: "Name and specialization are required" });
  }

  const query = `
    UPDATE doctors SET
      name = ?, specialization = ?, qualification = ?, experience = ?,
      email = ?, phone = ?, location = ?, profile_image = ?,
      available_days = ?, timings = ?, bio = ?, consultation_fee = ?
    WHERE id = ?
  `;

  const values = [
    name,
    specialization,
    qualification,
    experience,
    email,
    phone,
    location,
    profile_image,
    available_days,
    timings,
    bio,
    consultation_fee,
    doctorId,
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error updating doctor:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    return res.status(200).json({ message: "Doctor updated successfully" });
  });
});


// Delete a doctor
router.delete("/doctors/:id", (req, res) => {
    const doctorId = req.params.id;
    db.query("DELETE FROM doctors WHERE id = ?", [doctorId], (err, results) => {
        if (err) {
            console.error("Error deleting doctor:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        return res.status(204).send(); // No content
    });
}   
);


module.exports = router;