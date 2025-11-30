// // 📁 server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// app.get('/', (req, res) => {
//   res.send('🚀 Backend is running and MongoDB is connected!');
// });
// const projectRoutes = require('./routes/projectRoutes');
// const taskRoutes = require('./routes/taskRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/projects', projectRoutes);
// app.use('/api/tasks', taskRoutes);

// // MongoDB Connection
// // mongoose.connect(process.env.MONGO_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true
// // })
// mongoose.connect(process.env.MONGO_URI)

// .then(() => console.log('✅ MongoDB Connected'))
// .catch((err) => console.error('❌ MongoDB connection error:', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// dotenv.config(); // Load environment variables

// const app = express(); // ✅ Initialize express before using `app`

// // Middleware
// app.use(express.json());

// // Test route
// app.get('/', (req, res) => {
//   res.send('🚀 Backend is running and MongoDB is connected!');
// });

// app.get('/', (req, res) => {
//   res.send('🚀 Hello from ProjectPilot backend!');
// });


// // Connect to MongoDB
// // mongoose.connect(process.env.MONGO_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true
// // })
// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log('✅ MongoDB Connected'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// const projectRoutes = require('./routes/projectRoutes');
// app.use('/api/projects', projectRoutes);  // ✅ This is fine

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const User = require('./models/User');


// dotenv.config(); // Load environment variables

// const app = express(); // ✅ Initialize express before using `app`

// // Middleware
// app.use(express.json());

// // ✅ Single test route
// app.get('/', (req, res) => {
//   res.send('🚀 ProjectPilot backend is running and MongoDB is connected!');
// });



// // app.get('/', async (req, res) => {
// //   try {
// //     const users = await User.find(); // if you are using MongoDB
// //     res.json(users);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });


// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// // Routes
// const projectRoutes = require('./routes/projectRoutes');
// app.use('/api/projects', projectRoutes);

// const userRoutes = require('./routes/userRoutes');
// app.use('/', userRoutes);


// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });




// const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const cors = require('cors');

// dotenv.config();

// const app = express();
// app.use(express.json());

// // MongoDB connect
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// // Test route
// app.get('/', (req, res) => {
//   res.send('🚀 ProjectPilot backend is running!');
// });


// app.use(cors({
//   origin: 'http://localhost:3000', // ✅ Allow requests from your React frontend
//   credentials: true               // Optional: allows cookies/auth headers
// }));


// app.use(cors({ origin: 'http://localhost:3000' }));

// // Routes
// const projectRoutes = require('./routes/projectRoutes');
// const userRoutes = require('./routes/userRoutes');

// app.use('/api/projects', projectRoutes);
// // app.use('/', userRoutes);
// app.use('/api/users', userRoutes);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });




const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// const app = express();
// app.use(express.json());

// Enable CORS before any routes
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
