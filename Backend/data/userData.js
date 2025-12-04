const bcrypt = require('bcryptjs');

// We need to hash passwords manually here because insertMany bypasses the .pre('save') middleware!
// For a real app, you might handle this differently, but this is fine for seeding.
const hash = (pass) => bcrypt.hashSync(pass, 10);

const users = [
  {
    username: 'admin',
    password: hash('admin123'),
    role: 'admin',
    passwordChangeRequired: false,
  },
  {
    username: 'john',
    password: hash('123456'),
    role: 'user',
    passwordChangeRequired: true, // This user will be forced to change password
  },
];

module.exports = users;