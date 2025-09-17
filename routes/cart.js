const express = require('express');
const Cart = require('/models/Cart.js');
const Product = require('/models/Product.js');
const { protect } = require('../middleware/auth');


const router = express.Router();


// Get current user's cart
router.get('/', protect, async (req, res) => {
try {
let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
if (!cart) cart = { items: [] };
res.json(cart);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Add / update item
router.post('/add', protect, async (req, res) => {
try {
const { productId, qty } = req.body;
if (!productId || !qty) return res.status(400).json({ message: 'Missing fields' });


const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: 'Product not found' });


let cart = await Cart.findOne({ user: req.user.id });
if (!cart) {
cart = await Cart.create({ user: req.user.id, items: [{ product: productId, qty }] });
return res.status(201).json(cart);
}


const idx = cart.items.findIndex((i) => i.product.toString() === productId);
if (idx === -1) cart.items.push({ product: productId, qty });
else cart.items[idx].qty = qty; // replace quantity


await cart.save();
const populated = await cart.populate('items.product');
res.json(populated);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// Remove item
router.delete('/remove/:productId', protect, async (req, res) => {
try {
const { productId } = req.params;
const cart = await Cart.findOne({ user: req.user.id });
if (!cart) return res.status(404).json({ message: 'Cart not found' });


cart.items = cart.items.filter((i) => i.product.toString() !== productId);
await cart.save();
res.json(cart);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;