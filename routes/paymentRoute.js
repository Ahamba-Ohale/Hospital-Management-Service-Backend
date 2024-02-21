const express = require('express');
const router = express.Router();
const initializePayment = require('../payment-controller/paymentController');
const { verifySignature } = require('../payment-controller/webhookController');

router.post('/acceptPayment', initializePayment.acceptPayment);
router.post('/webhook', verifySignature);

module.exports = router;
