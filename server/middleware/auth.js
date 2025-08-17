import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Token verification failed'
    });
  }
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