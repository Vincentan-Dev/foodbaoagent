// server.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Auth API
app.post('/api/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data, error } = await supabase.rpc('auth', {
      p_username: username,
      p_password: password
    });
    
    if (error || !data || !data.success) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: data?.message || error?.message || 'Invalid credentials' 
      });
    }
    
    // Create token for the client
    const token = jwt.sign(
      {
        userId: data.user_id,
        username: data.username,
        role: data.role,
        email: data.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    return res.json({
      success: true,
      token,
      user: {
        userId: data.user_id,
        username: data.username,
        role: data.role,
        email: data.email
      }
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Cloudinary accounts endpoint
app.get('/api/cloudinary/accounts', async (req, res) => {
  try {
    // Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username } = decoded;
    
    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const queryUsername = req.query.username;
    console.log('Getting accounts for username:', queryUsername);
    
    const { data, error } = await supabase
      .from('cloudinaryacc')
      .select('*')
      .eq('username', queryUsername);
      
    if (error) throw error;
    
    return res.status(200).json({ items: data || [] });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
});

app.post('/api/cloudinary/accounts', async (req, res) => {
  try {
    // Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { username } = decoded;
    
    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const accountData = req.body;
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
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Debug API endpoint
app.get('/api/debug', async (req, res) => {
  // Copy your debug.js code here
  try {
    // Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    };
    
    console.log('Environment check:', envCheck);
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Try to initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log('Supabase client initialized');
    
    // Try a simple query
    const { data: tables, error: tablesError } = await supabase
      .from('_tables')
      .select('name');
    
    if (tablesError) throw tablesError;
    
    // Check if our table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'cloudinaryacc')
      .eq('table_schema', 'public');
    
    return res.status(200).json({
      success: true,
      message: 'Supabase connection successful',
      envCheck,
      tables: tables || [],
      cloudinaryTableExists: tableExists && tableExists.length > 0
    });
    
  } catch (error) {
    console.error('API debug error:', error);
    
    return res.status(500).json({ 
      error: 'Debug API error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Implement other API routes (PUT, DELETE, etc.)

// Catch-all route to serve your frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});