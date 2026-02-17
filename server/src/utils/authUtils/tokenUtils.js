const jwt = require('jsonwebtoken');

// create jwt token
const createJwtToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// verify jwt token
const verifyJwtToken = (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return payload;
    
    } catch (err) {
        console.log(`Invalid token: ${err.message}`);
        return null;
    }
};

module.exports = { 
    createJwtToken, 
    verifyJwtToken
};