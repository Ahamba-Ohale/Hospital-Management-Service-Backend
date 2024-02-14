const express = require('express');
const router = express.Router();
const initializePayment = require('../payment-controller/paymentController'); // import the controller


router.post('/acceptPayment', initializePayment.acceptPayment);

module.exports = router
























// const express = require('express');
// const PaymentController = require('../payment-controller/paymentController');
// const router = express.Router();

// const paymentControllerInstance = new PaymentController();

// router.post('/makePayment', async (req, res) => {
//     const { amount, description, date } = req.body;

//     try {
//         const paymentResult = await paymentControllerInstance.makePayment(amount, description, date);
//         res.status(200).json({
//             success: true,
//             payment: paymentResult
//         });
//     } catch (error) {
//         console.error('Error in makePayment route:', error); // Log the error to the console for debugging purposes
//         res.status(400).json({
//             success: false,
//             error: error.message || 'An unknown error occurred' // Provide a default error message if the error object is not defined
//         });
//     }
// });

// // This is the route for making payments
// // router.post('/makePayment', async (req, res) => {
// //     const { amount, description, date } = req.body;

// //     try {
// //         const paymentResult = await paymentControllerInstance.makePayment(amount, description, date);
// //         res.status(200).json({
// //             success: true,
// //             payment: paymentResult
// //         });
// //     } catch (error) {
// //         res.status(400).json({
// //             success: false,
// //             error: error.message
// //         });
// //     }
// // });

// module.exports = router;



// // const express = require('express');
// // const paymentController = require('../payment-controller/paymentController');
// // const router = express.Router();

// // const paymentController = new paymentController();

// // //this is the route for making payments
// // router.post('/makePayment', (req, res) => {
// //     const { amount, description, date } = req.body;

// //     try {
// //         const paymentResult = paymentController.makePayment(amount, description, date);
// //         res.status(200).json({
// //             success: true,
// //             payment: paymentResult
// //         });
// //     } catch (error) {
// //         res.status(400).json({
// //             success: false,
// //             error: error.message
// //         });
// //     }
// // });

// // module.exports = router;