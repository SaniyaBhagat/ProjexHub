// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// router.post('/api/users', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email, password });

//   if (user) {
//     res.json({ message: 'Login successful', role: user.role });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// });

// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;





// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // Login route
// router.post('/api/users', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email, password });

//     if (user) {
//       res.json({ message: 'Login successful', role: user.role });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Login error', error: err.message });
//   }
// });

// // Optional: Get all users
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ message: 'Login successful', role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
router.post('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
