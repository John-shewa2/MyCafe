const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/userData'); // We will create this next
const products = require('./data/productData'); // We will create this next
const User = require('./models/user');
const Product = require('./models/products'); // Note: Your file is named 'products.js' with an 's'
const Order = require('./models/order');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // 1. Wipe the Database clean
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Add Users
    const createdUsers = await User.insertMany(users);
    
    // 3. Make the first user the "Admin"
    const adminUser = createdUsers[0]._id;

    // 4. Add Products
    // We want to link products to the admin user (optional, but good practice)
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('✅ Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Df Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// If we run "node seeder.js -d", it destroys data. Otherwise, it imports.
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}