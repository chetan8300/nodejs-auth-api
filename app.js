const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log('connected to auth db'); })

// Middlewares
app.use(express.json())

// Route Middleware
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(4000, () => { console.log('Server up and running'); });