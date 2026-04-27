const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get the token from the Authorization header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. If no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 4. Attach the decoded payload (which contains the userId) to the request object
    // This makes req.user.userId available in all your protected routes!
    req.user = decoded;
    
    // 5. Move on to the actual route controller
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Not authorized, token failed or expired' });
  }
};

module.exports = { protect };