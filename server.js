const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas connection
mongoose.connect("mongodb+srv://sfayazmr1:Abcd1234@cluster0.zoxzw.mongodb.net/mydata?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

// Define User Schema
const UserSchema = new mongoose.Schema({ 
    fullName: String, 
    rollNumber: String, 
    email: String, 
    password: String, 
    phone: String, 
    city: String 
});

// Define User Model
const User = mongoose.model('User', UserSchema);

// POST: Add a new user
app.post('/users', async (req, res) => {
    try {
        const { fullName, rollNumber, email } = req.body;
        if (!fullName || !rollNumber || !email) {
            return res.status(400).send("Missing required fields");
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.send("User Added Successfully");
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

// GET: Retrieve all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});

// PUT: Update a user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).send("User not found");
        res.send("User Updated Successfully");
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// DELETE: Delete a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).send("User not found");
        res.send("User Deleted Successfully");
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Start Server
app.listen(3000, () => console.log('Server running on port 3000'));
