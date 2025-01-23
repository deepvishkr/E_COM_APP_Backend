// Middleware for JWT authentication


const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) 
      return res.status(401).json({ message: 'No token provided' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err)
         return res.status(401).json({ message: 'Token is not valid' });
      req.userId = decodedToken.id;
      next();
    });
  };
  