// Initialize Google Pay client
const paymentsClient = new google.payments.api.PaymentsClient({
    environment: 'TEST' // Change to 'PRODUCTION' in live environment
});

// Define the Google Pay Payment Request
const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
                gateway: 'example', // Replace with your payment gateway (e.g., Stripe)
                gatewayMerchantId: 'exampleMerchantId', // Your Google Pay Merchant ID
            },
        },
    }],
    transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: '800', // Example price (should be dynamically set)
        currencyCode: 'USD',
    },
    merchantInfo: {
        merchantName: 'Your Merchant Name',
    },
};

// Check if Google Pay is available
function onGooglePayLoaded() {
    paymentsClient.isReadyToPay(paymentDataRequest)
        .then(function(response) {
            if (response.result) {
                createGooglePayButton(); // Create the button if available
            } else {
                console.log("Google Pay is not available.");
            }
        })
        .catch(function(error) {
            console.error("Error checking Google Pay availability", error);
        });
}

// Create Google Pay button and add it to the page
function createGooglePayButton() {
    const button = paymentsClient.createButton({
        onClick: onGooglePayButtonClicked, // Define the onClick function for the button
    });
    document.getElementById('google-pay-button').appendChild(button);
}

// Handle the Google Pay button click event
function onGooglePayButtonClicked() {
    paymentsClient.loadPaymentData(paymentDataRequest)
        .then(function(paymentData) {
            // Handle the payment data (send to server for processing)
            console.log("Payment data received:", paymentData);
            // You would send this data to your server for payment processing here
        })
        .catch(function(error) {
            console.error("Payment failed", error);
        });
}

// Load Google Pay API when the page is ready
window.onload = onGooglePayLoaded;
