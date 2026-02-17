const User = require('../users/user.model');
const { hashPassword, comparePassword } = require('../utils/hashPassword');


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
        console.error(`Registration fail.. ${err.messafe}`);
        return res.status(500).json({message: "User registration failed..."});
    }
};