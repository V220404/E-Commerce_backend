require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const { errorHandler } = require('./middleware/errorHandler');


const app = express();


// middlewares
app.use(express.json());
app.use(cors());
// serve static uploads (if using local file uploads)
app.use('/uploads', express.static('uploads'));


// connect DB
connectDB();


// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


// error handler (should be last)
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));