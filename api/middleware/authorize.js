import jwt from 'jsonwebtoken';

export function authorize(handler, allowedRoles = ['ADMIN']) {
  return async (req, res) => {
    try {
      // Extract token from Authorization header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user role is allowed
      if (!allowedRoles.includes(decoded.role)) {
        console.log(`Access denied: User role ${decoded.role} not in allowed roles [${allowedRoles.join(', ')}]`);
        return res.status(403).json({ error: 'Permission denied' });
      }
      
      // Attach user info to request
      req.user = decoded;
      
      // Call the original handler
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized', message: error.message });
    }
  };
}