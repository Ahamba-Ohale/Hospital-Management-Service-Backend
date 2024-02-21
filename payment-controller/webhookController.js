// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Verify Paystack webhook signature
function verifySignature(req, res, next) {
  const signature = req.headers['x-paystack-signature'];
  const payload = JSON.stringify(req.body);
  const calculatedSignature = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');

  if (calculatedSignature === signature) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Invalid signature' });
  }
}

// Handle Paystack webhook events
app.post('/webhook', verifySignature, (req, res) => {
  const event = req.body.event;

  switch (event) {
    case 'charge.success':
      const charge = req.body.data;
      console.log(`Payment of ₦${charge.amount} was successful. Transaction reference: ${charge.reference}`);
      break;

    case 'charge.failed':
      const failedCharge = req.body.data;
      console.log(`Payment of ₦${failedCharge.amount} failed. Transaction reference: ${failedCharge.reference}`);
      break;

    default:
      console.log(`Unhandled Paystack webhook event: ${event}`);
      break;
  }

  res.status(200).json({ success: true });
});




module.exports = { verifySignature };