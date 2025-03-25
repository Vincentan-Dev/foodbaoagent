import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests for login
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    console.log(`Auth attempt for user: ${username}, password length: ${password ? password.length : 'none'}`);
    
    // Initialize Supabase client 
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data, error } = await supabase.rpc('auth', {
      p_username: username,
      p_password: password
    });
    
    console.log('Auth response:', error ? 'ERROR' : 'SUCCESS', data?.success);
    
    if (error) console.error('Supabase error:', error);
    
    if (error || !data || !data.success) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: data?.message || error?.message || 'Invalid credentials' 
      });
    }
    
    // Map user_role to role if needed
    const userData = {
      ...data.user,
      role: data.user.role || data.user.user_role // Use role if it exists, otherwise use user_role
    };
    
    // Create JWT token
    const token = jwt.sign(
      {
        userId: userData.id,
        username: userData.username,
        role: userData.role,
        email: userData.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Return user info and token
    return res.status(200).json({
      user: userData,
      token: token
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Authentication failed', message: error.message });
  }
}
