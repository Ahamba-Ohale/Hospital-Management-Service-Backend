require('dotenv').config();


const axios = require('axios');

const express = require('express');

const https = require('https');

const Payment = require('../models/paymentModel');

const payStack = {
  acceptPayment: async (req, res) => {
    console.log('Request reached acceptPayment handler');

    try {
      const { email, amount } = req.body;

      const params = {
        email,
        amount: amount * 100,
      };

      const options = {
        method: 'post',
        url: 'https://api.paystack.co/transaction/initialize',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        data: params,
      };

      const response = await axios(options);
      const paymentData = response.data;

      if (paymentData && paymentData.data && paymentData.data.status) {
        console.log('Payment Status:', paymentData.data.status);

        if (paymentData.data.status === 'success') {
          console.log('Payment successful. Saving to database...');

          const payment = new Payment({
            userId: req.user ? req.user._id : null,
            email,
            amount,
            currency: 'NGN',
            transactionId: paymentData.data.reference,
            // ... other relevant fields from paymentData
          });

          await payment.save();
          console.log('Payment saved to database');

          return res.status(200).json(paymentData);
        } else {
          console.log('Payment not successful, not saving to the database');
        }
      } else {
        console.log('Unexpected response from Paystack API:', paymentData);
      }

      return res.status(200).json(paymentData); // Or appropriate status code and response
    } catch (error) {
      console.error('Error in acceptPayment:', error);
      res.status(500).json({ success: false, error: 'An error occurred' });
    }
  },
};

const initializePayment = payStack;
module.exports = initializePayment;

