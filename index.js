const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request-promise');

// Set your Stripe publishable key
const stripePublishableKey = 'pk_test_dnxIicCufTTvDdOvJJQmsGIt';

// Salesforce credentials
const salesforceCredentials = {
  clientId: '3MVG9p1Q1BCe9GmBa.vd3k6U6tisbR1DMPjMzaiBN7xn.uqsguNxOYdop1n5P_GB1yHs3gzBQwezqI6q37bh9', // Replace with your Salesforce Consumer Key
  clientSecret: '1AAD66E5E5BF9A0F6FCAA681ED6720A797AC038BC6483379D55C192C1DC93190', // Replace with your Salesforce Consumer Secret
  username: 'admin@unblindedmastery.com', // Your Salesforce username
  password: 'Unblinded2023$', // Concatenate your password and security token
  grantType: 'password',
};

// Set view engine to EJS
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('paymentForm', { stripePublishableKey });
});

app.post('/submit', async (req, res) => {

  const { token, name, email } = req.body;
  
  try {
    const accessTokenResponse = await request({
      method: 'POST',
      uri: 'https://login.salesforce.com/services/oauth2/token',
      form: {
        grant_type: salesforceCredentials.grantType,
        client_id: salesforceCredentials.clientId,
        client_secret: salesforceCredentials.clientSecret,
        username: salesforceCredentials.username,
        password: salesforceCredentials.password
      },
      json: true
    });

    console.log('Access Token Response:', accessTokenResponse);


    const accessToken = accessTokenResponse.access_token;

    // Query Salesforce for the account
    const accountQueryResponse = await request({
      method: 'GET',
      uri: 'https://unblindedmastery.my.salesforce.com/services/data/v58.0/query',
      qs: {
        q: `SELECT Id FROM Account WHERE Email__c = '${email}'`,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: true
    });

    console.log('Account Query Response:', accountQueryResponse);
    const accountId = accountQueryResponse.records[0].Id;

    // Update the Payment_Token__c field
    const updateFieldResponse = await request({
      method: 'PATCH',
      uri: `https://unblindedmastery.my.salesforce.com/services/data/v58.0/sobjects/Account/${accountId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        Payment_Token__c: token
      },
      json: true
    });

    console.log('Update Field Response:', updateFieldResponse);
    
  } catch (error) {
    console.error('Error:', error);
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
