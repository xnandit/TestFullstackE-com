const bcrypt = require('bcrypt');

const saltRounds = 10;
const plainTextPasswordAdmin = 'admin123';
const plainTextPasswordCustomer = 'customer123';

bcrypt.hash(plainTextPasswordAdmin, saltRounds, function(err, hashAdmin) {
    if (err) throw err;
    console.log('Admin hashed password:', hashAdmin);

    bcrypt.hash(plainTextPasswordCustomer, saltRounds, function(err, hashCustomer) {
        if (err) throw err;
        console.log('Customer hashed password:', hashCustomer);
    });
});