const express = require('express');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('/models/Product');
const { protect } = require('../middleware/auth');


// If using Stripe uncomment and `npm i stripe` then use:
// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


const router = express.Router();


// Create order from cart
router.post('/create', protect, async (req, res) => {
try {
const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });


// calculate total amount
let total = 0;
const orderItems = cart.items.map((it) => {
const price = it.product.price || 0;
total += price * it.qty;
return { product: it.product._id, qty: it.qty, priceAtPurchase: price };
});


// OPTIONAL: integrate payment gateway here. For example, create Stripe PaymentIntent
// const paymentIntent = await stripe.paymentIntents.create({
// amount: Math.round(total * 100), // in cents
// currency: 'usd',
// });


const order = await Order.create({
user: req.user.id,
items: orderItems,
totalAmount: total,
status: 'paid', // change based on payment verification
paymentInfo: { method: req.body.method || 'none' },
shippingAddress: req.body.shippingAddress || {},
});


// clear cart
cart.items = [];
await cart.save();


res.status(201).json(order);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// Get user's orders
router.get('/', protect, async (req, res) => {
try {
const orders = await Order.find({ user: req.user.id }).populate('items.product');
res.json(orders);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;