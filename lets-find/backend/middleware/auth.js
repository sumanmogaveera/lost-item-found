const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        console.log('401 Unauthorized: No token provided for path:', req.path);
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log('403 Forbidden: Token verification failed for path:', req.path, err.message);
        res.status(403).json({ msg: 'Token is not valid' });
    }
}

module.exports = authenticateToken;
