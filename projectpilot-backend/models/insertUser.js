const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function insertUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = [
      { email: 'user@project.com', password: 'user123', role: 'user' },
      { email: 'admin@project.com', password: 'admin123', role: 'admin' },
    ];
    await User.insertMany(users);
    console.log('✅ Users inserted!');
    process.exit();
  } catch (err) {
    console.error('❌ Error inserting users:', err);
    process.exit(1);
  }
}

insertUsers();
