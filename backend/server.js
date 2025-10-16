const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const User = require('./models/User');


const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;


// ✅ MongoDB Connection
app.use(express.json())
app.use(cors());

mongoose
    .connect(process.env.MONGODB_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected  to Mongodb");
    })
    .catch((err) => {
        console.error("Mongodb cannection error", err);
    });

// ✅ Start Server
app.listen(PORT, () => {
    console.log('Listening on port' + PORT)
},)

// -------------------- SIGNUP --------------------
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 🔹 Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during signup', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// ----- SIGNIN --------
app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { email: user.email } });
    } catch (error) {
        console.error('Error during signin', error);
        res.status(500).json({ message: 'Server error during signin' });
    }
});


function authenticateToken(req, res, next){
    const authHeader =req.headers['authorization'];
    const token =authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401)
        .json({message:'No token provided, authorization denied'});
    }


    // console.log(token);

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(403).json({message:'Invalid or expried token'})
    }
}

app.get("/api/profile", authenticateToken, async (req, res)=>{
    try{
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-password");
        
        if(!user){
            return res.status(404).json({message:'User not found.'});
        }
        return res.json({user});
    }catch (error){
        console.log("error fetching profile", error);
        res.status(500).json({message:"Server error"});
    }
    
});