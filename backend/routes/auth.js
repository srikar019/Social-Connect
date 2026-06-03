const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter name, email, and password' });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Handle a random avatar for premium onboarding feel
    const randomId = Math.floor(Math.random() * 70);
    const avatar = `https://i.pravatar.cc/150?img=${randomId}`;

    user = new User({
      name,
      email,
      password,
      avatar,
      bio: 'Ready to share my thoughts!',
      location: 'San Francisco, CA'
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT token payload
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        handle: `@${user.name.toLowerCase().replace(/\s+/g, '')}`
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            handle: payload.user.handle,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password' });
  }

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const handle = `@${user.name.toLowerCase().replace(/\s+/g, '')}`;

    // Payload
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        handle
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            handle,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile details
// @access  Private
router.put('/profile', auth, async (req, res) => {
  const { name, bio, location } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    await user.save();

    // Propagate user profile cache changes to their posts for UI consistency
    const handle = `@${user.name.toLowerCase().replace(/\s+/g, '')}`;
    await Post.updateMany(
      { creator: user.id },
      { 
        $set: { 
          name: user.name, 
          handle,
          avatar: user.avatar 
        } 
      }
    );

    res.json({
      id: user.id,
      name: user.name,
      handle,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;
