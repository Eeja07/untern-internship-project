import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to ensure user is a student
export const requireStudent = (req, res, next) => {
  if (req.user.user_type !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to students only'
    });
  }
  next();
};

// Middleware to ensure user is a company
export const requireCompany = (req, res, next) => {
  if (req.user.user_type !== 'company') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to companies only'
    });
  }
  next();
};

export { JWT_SECRET };