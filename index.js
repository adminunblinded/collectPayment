const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const jsforce = require('jsforce');

// Set your Stripe publishable key
const stripePublishableKey = 'pk_test_dnxIicCufTTvDdOvJJQmsGIt';

// Salesforce credentials
const salesforceCredentials = {
  clientId: '3MVG9p1Q1BCe9GmBa.vd3k6U6tisbR1DMPjMzaiBN7xn.uqsguNxOYdop1n5P_GB1yHs3gzBQwezqI6q37bh9', // Replace with your Salesforce Consumer Key
  clientSecret: '1AAD66E5E5BF9A0F6FCAA681ED6720A797AC038BC6483379D55C192C1DC93190', // Replace with your Salesforce Consumer Secret
  username: 'admin@unblindedmastery.com', // Your Salesforce username
  password: 'Unblinded2023$' // Concatenate your password and security token
};

// Set view engine to EJS
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('paymentForm', { stripePublishableKey });
});

// Handle form submission
app.post('/submit', async (req, res) => {

  const { token, name, email } = req.body;
  console.log('Token:', token);

  // Authenticate with Salesforce
  const conn = new jsforce.Connection();
  try {
    await conn.login(salesforceCredentials.username, salesforceCredentials.password);
    console.log('Connected to Salesforce');

    console.log('Associating email with Salesforce account');
  } catch (error) {
    console.error('Error connecting to Salesforce:', error);
    res.status(500).send('Error processing payment.');
    return;
  }

  // Respond to the client
  res.status(200).send('Payment successfully processed.');
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
