const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) 
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST add product to databse
exports.addProduct = async(req,res) => {
  const { name,price,description,stockQuantity} = req.body;
  try{
      if(!name || !price || !description || stockQuantity === undefined) {
          return res.status(400).json({message: 'All fields are required'});
      }

      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
          return res.status(400).json({message:'Product with this name already exists'})
      }

      const newProduct = new Product({ name,price,description,stockQuantity});
      await newProduct.save();

      res.status(201).json({ message: 'Product added successfully', product: newProduct});
  } catch (err) {
      res.status(500).json({message: 'Error adding product', error: err.message});
      
  }
}

// POST add product to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Create and save cart item
    const cartItem = new Cart({ productId, quantity });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update cart item quantity
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cartItem = await Cart.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    if (!cartItem) 
      return res.status(404).json({ message: 'Cart item not found' });
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem) 
      return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Cart item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) 
      return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user and return JWT token
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) 
      return res.status(404).json({ message: 'User not found' });

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

