import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('API request received:', req.method);
    
    // 1. Verify JWT token
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { username } = decoded;
      
      console.log('JWT verified for user:', username);
      
      // 2. Initialize Supabase
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      // 3. Process based on method
      if (req.method === 'GET') {
        const queryUsername = req.query.username;
        console.log('Getting accounts for username:', queryUsername);
        
        const { data, error } = await supabase
          .from('cloudinaryacc')
          .select('*')
          .eq('username', queryUsername);
          
        if (error) throw error;
        
        return res.status(200).json({ items: data || [] });
      }
      
      if (req.method === 'POST') {
        const accountData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        console.log('Creating account for:', accountData.username);
        
        // First check if account already exists
        const { data: existing } = await supabase
          .from('cloudinaryacc')
          .select('id')
          .eq('username', accountData.username);
          
        if (existing && existing.length > 0) {
          return res.status(400).json({
            error: 'Account already exists',
            message: 'You already have a Cloudinary account'
          });
        }
        
        // Create new account
        const { data, error } = await supabase
          .from('cloudinaryacc')
          .insert([accountData])
          .select();
          
        if (error) throw error;
        
        return res.status(201).json(data[0]);
      }
      
      // Handle PUT and other methods here
      
      return res.status(405).json({ error: 'Method not allowed' });
      
    } catch (authError) {
      console.error('Authentication error:', authError);
      return res.status(401).json({ error: 'Authentication failed', message: authError.message });
    }
  } catch (error) {
    console.error('API error:', error);
    
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message
    });
  }
}