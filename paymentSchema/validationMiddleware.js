
// this code check and validate the user input of paymentModel
function validatePaymentData(amount, description, date) {
    // the validation logic is written below
    if(typeof amount !== 'number' || amount <= 0){
        throw new error(' invalid amount for payment')
    }
    return true;
}

module.exports = {validatePaymentData};