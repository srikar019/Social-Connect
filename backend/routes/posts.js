const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');



// @route   GET api/posts
// @desc    Get all posts in the public timeline
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    
    // Convert Mongoose documents to plain JSON objects to add isPromoted fields easily
    const postsJson = posts.map(post => {
      const obj = post.toObject();
      obj.id = obj._id.toString(); // Map _id to id for React frontend consistency
      return obj;
    });



    res.json(postsJson);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error retrieving feed posts' });
  }
});

// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  const { text, image } = req.body;

  if (!text && !image) {
    return res.status(400).json({ message: 'Post must contain either text or an image' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const handle = `@${user.name.toLowerCase().replace(/\s+/g, '')}`;

    const newPost = new Post({
      text,
      image,
      creator: user.id,
      name: user.name,
      handle,
      avatar: user.avatar,
      likes: [],
      comments: []
    });

    const post = await newPost.save();
    
    const postJson = post.toObject();
    postJson.id = postJson._id.toString();

    res.json(postJson);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// @route   POST api/posts/:id/like
// @desc    Toggle like state on a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userHandle = req.user.handle; // Unique handle of the user e.g. @srikar
    
    // Check if the user already liked the post
    const likeIndex = post.likes.indexOf(userHandle);

    if (likeIndex > -1) {
      // User liked it already -> unlike (remove handle)
      post.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked it -> like (push handle)
      post.likes.push(userHandle);
    }



    await post.save();

    const postJson = post.toObject();
    postJson.id = postJson._id.toString();

    res.json(postJson);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error toggling post like' });
  }
});

// @route   POST api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Comment text content is required' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      name: req.user.name,
      handle: req.user.handle,
      text,
      time: new Date()
    };

    post.comments.unshift(newComment); // Add new comment to the top of list
    await post.save();



    const postJson = post.toObject();
    postJson.id = postJson._id.toString();

    res.json(postJson);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error appending comment' });
  }
});

module.exports = router;
