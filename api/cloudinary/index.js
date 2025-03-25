import { createClient } from '@supabase/supabase-js';
import { authorize } from '../middleware/authorize';

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Everyone with valid token can read
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('cloudinaryacc')
        .select('*');
        
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    // POST - Only admins can create
    if (req.method === 'POST') {
      // User role is already verified by authorize middleware
      const { data, error } = await supabase
        .from('cloudinaryacc')
        .insert(req.body);
        
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    // PUT - All users can update
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const { data, error } = await supabase
        .from('cloudinaryacc')
        .update(updates)
        .match({ id });
        
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    // DELETE - Only admins can delete (enforced by middleware)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const { data, error } = await supabase
        .from('cloudinaryacc')
        .delete()
        .match({ id });
        
      if (error) throw error;
      return res.status(200).json({ message: 'Record deleted' });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Different endpoints with different permission levels
export default {
  // Anyone authenticated can read
  read: authorize(handler, ['USER', 'ADMIN']),
  
  // Anyone authenticated can update
  update: authorize(handler, ['USER', 'ADMIN']),
  
  // Only admins can create
  create: authorize(handler, ['ADMIN']),
  
  // Only admins can delete
  delete: authorize(handler, ['ADMIN'])
};