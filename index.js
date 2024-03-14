const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Set your Stripe publishable key
const stripePublishableKey = 'pk_test_dnxIicCufTTvDdOvJJQmsGIt';

// Set view engine to EJS
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('paymentForm', { stripePublishableKey });
});

// Handle form submission
app.post('/submit', (req, res) => {

  console.log(req.body);
  
  // Respond to the client
  res.status(200).send('Payment successfully processed.');
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
