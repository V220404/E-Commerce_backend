const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema(
{
name: { type: String, required: true },
description: { type: String },
price: { type: Number, required: true },
images: [{ type: String }], // store urls or local paths
category: { type: String },
stock: { type: Number, default: 0 },
metadata: { type: mongoose.Schema.Types.Mixed },
},
{ timestamps: true }
);


module.exports = mongoose.model('Product', ProductSchema);