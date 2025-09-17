const mongoose = require('mongoose');


const OrderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
});


const OrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [OrderItemSchema],
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ['pending', 'paid', 'shipped', 'cancelled'], default: 'pending' },
        paymentInfo: { type: mongoose.Schema.Types.Mixed },
        shippingAddress: { type: mongoose.Schema.Types.Mixed },
    },
    { timestamps: true }
);


module.exports = mongoose.model('Order', OrderSchema);