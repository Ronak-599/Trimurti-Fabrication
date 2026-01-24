// Admin login controller
// Read email and password from request body
// Compare with ADMIN_EMAIL and ADMIN_PASSWORD from environment variables
// If valid, generate JWT token
// Return token in response
const jwt = require('jsonwebtoken');

exports.adminLogin = (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
};
