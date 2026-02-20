const User = require('../users/user.model');
const { hashPassword, comparePassword } = require('../../utils/authUtils/passwordUtils');
const { generateToken, verifyToken } = require('../../utils/authUtils/tokenUtils');


// user registration
const register = async (req, res) => {
    try {
        const { email, password, confirmPassword, role } = req.body;
        
        // check password match 
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }    
        
        // check user already exists
        const isUserexists  = await User.findOne({email});
        if (isUserexists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // check if the first user account
        const isFirstAcc = await User.countDocuments() === 0;
        if (isFirstAcc) {
            req.body.role = "admin";
        }
        
        // hash password
        const hashedPassword = await hashPassword(password);
        req.body.password = hashedPassword;
        
        // create user
        const user = await User.create(req.body);
        return res.status(201).json({ message: "User registered successfully", user });


    } catch (err) {
        console.error(`Registration fail.. ${err.message}`);
        return res.status(500).json({message: "User registration failed..."});
    }
};

// user login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // compare password
        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // generate token 
        const token = generateToken(user._id, user.role);
        
        // return response with token
        return res.status(200).json({ message: "User logged in successfully", token });
        
    } catch (err) {
        console.error(`Login fail... ${err.message}`);
        return res.status(500).json({message: "User login failed..."});
    }
};

// user logout 
const logout = async (req, res) => {
    try {
        // extract token from headers
        const token = req.headers.authorization.split(" ")[1];
        
        // verify token
        const decoded = await verifyToken(token);
        
        res.clearCookie("token", { httpOnly: true });
        
        return res.status(200).json({ message: "User logged out successfully" });
        
    } catch (err) {
        console.error(`Logout fail... ${err.message}`);
        return res.status(500).json({message: "User logout failed..."});

    }
};

module.exports = {
    register,
    login,
    logout
};