const express = require('express');
const app = express();
const path = require('path');

// Set your Stripe publishable key
const stripePublishableKey = 'pk_test_dnxIicCufTTvDdOvJJQmsGIt';

// Set view engine to EJS
app.set('view engine', 'ejs');

// Define route to render the payment form
app.get('/', (req, res) => {
  res.render('paymentForm', { stripePublishableKey });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
