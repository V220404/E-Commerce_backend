const express = require('express');
const Product = require('/models/Product');
const { protect, admin } = require('../middleware/auth');


const router = express.Router();


// GET all products (with simple pagination & optional category filter)
router.get('/', async (req, res) => {
try {
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const skip = (page - 1) * limit;
const filter = {};
if (req.query.category) filter.category = req.query.category;


const products = await Product.find(filter).skip(skip).limit(limit);
const total = await Product.countDocuments(filter);


res.json({ products, page, totalPages: Math.ceil(total / limit), total });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// GET one
router.get('/:id', async (req, res) => {
try {
const product = await Product.findById(req.params.id);
if (!product) return res.status(404).json({ message: 'Product not found' });
res.json(product);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// ADMIN - create product
router.post('/', protect, admin, async (req, res) => {
try {
// if using multer you will get files here. For now expect JSON with images[] URLs
const { name, description, price, images, category, stock } = req.body;
const p = await Product.create({ name, description, price, images, category, stock });
res.status(201).json(p);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// ADMIN - update
router.put('/:id', protect, admin, async (req, res) => {
try {
const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
if (!updated) return res.status(404).json({ message: 'Product not found' });
res.json(updated);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


// ADMIN - delete
router.delete('/:id', protect, admin, async (req, res) => {
try {
const removed = await Product.findByIdAndDelete(req.params.id);
if (!removed) return res.status(404).json({ message: 'Product not found' });
res.json({ message: 'Product removed' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;