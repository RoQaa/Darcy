const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
// Schema for individual order products

const orderProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  color: {
    type: String,
    required: true
  },
  total_price: {
    type: Number,
    //   required: true
  }
});

// Schema for the order containing multiple products
const orderSchema = new mongoose.Schema({
  products: [orderProductSchema], // Array of products in the order
  total_order_price: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
  },
  governate: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  order_number: {
    type: Number,
    unique: true, // Ensure that the order number is unique
  },


});



// Apply the auto-increment plugin to the order_number field
orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });

// Middleware to calculate total_price for each product and total_order_price before saving the order
orderSchema.pre('save', async function (next) {
  try {
    // Populate product prices for all products in the order
    await this.populate('products.product');

    // Calculate total_price for each product
    this.products.forEach(product => {
      product.total_price = product.product.price * product.quantity;
    });

    // Calculate total_order_price
    this.total_order_price = this.products.reduce((acc, product) => acc + product.total_price, 0);

    next();
  } catch (error) {
    next(error);
  }
});

orderSchema.pre(/^find/, function (next) {
  this.select('-__v -user')
  next();
})
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
