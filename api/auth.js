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
    
    // Initialize Supabase client 
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Call the test_auth function we created in Supabase
    const { data, error } = await supabase.rpc('test_auth', {
      p_username: username,
      p_password: password
    });
    
    if (error || !data || !data.success) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: data?.message || error?.message || 'Invalid credentials' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      {
        userId: data.user.id,
        username: data.user.username,
        role: data.user.role,
        email: data.user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user info and token
    res.status(200).json({
      user: data.user,
      token: token
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed', message: error.message });
  }
}