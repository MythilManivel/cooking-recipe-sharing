const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mern-auth', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({ email: String, password: String });
const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.json({ success: false, message: 'Email already exists' });

  const user = new User({ email, password });
  await user.save();
  res.json({ success: true });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.json({ success: false, message: 'Invalid credentials' });

  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
