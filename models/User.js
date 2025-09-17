const mongoose = require('mongoose');


const AddressSchema = new mongoose.Schema({
street: String,
city: String,
state: String,
zip: String,
country: String,
});


const UserSchema = new mongoose.Schema(
{
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true }, // store hashed password
role: { type: String, enum: ['user', 'admin'], default: 'user' },
address: AddressSchema,
},
{ timestamps: true }
);


module.exports = mongoose.model('User', UserSchema);