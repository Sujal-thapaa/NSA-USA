# 🚀 Stripe Payment Integration Setup Guide

Your NSA Website now has a complete Stripe payment system! Here's everything you need to know to get it running.

## 📋 What's Been Added

### Frontend Updates
- **donation.html**: Updated with Stripe Elements form and success modal
- **donation.css**: Added professional styling for Stripe Elements and payment UI
- **donation.js**: Complete Stripe.js integration with payment confirmation

### Backend Server
- **stripe-demo/server.js**: Express server with payment intent endpoint
- **stripe-demo/test.html**: Simple test page for quick payment testing
- **stripe-demo/README.md**: Detailed backend documentation

## 🔧 Setup Instructions

### Step 1: Get Your Stripe Secret Key

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **test secret key** (starts with `sk_test_`)
3. Open `stripe-demo/server.js`
4. Replace line 3:
   ```javascript
   const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY_HERE');
   ```
   With:
   ```javascript
   const stripe = require('stripe')('sk_test_YOUR_ACTUAL_SECRET_KEY');
   ```

### Step 2: Start the Backend Server

```bash
cd stripe-demo
npm start
```

The server will start on `http://localhost:3001`

### Step 3: Open the Donation Page

Open `donation.html` in your browser and test the donation flow!

## 🧪 Testing with Stripe Test Cards

Use these test card numbers:

| Card Number | Description | Expected Result |
|-------------|-------------|-----------------|
| `4242 4242 4242 4242` | Successful payment | ✅ Payment succeeds |
| `4000 0000 0000 0002` | Generic decline | ❌ Payment declined |
| `4000 0025 0000 3155` | Requires authentication | 🔐 3D Secure popup |
| `4000 0000 0000 9995` | Insufficient funds | ❌ Insufficient funds |

**Test Details:**
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any valid ZIP code

## 🎯 Quick Test Options

### Option 1: Full Website Test
1. Start the server: `cd stripe-demo && npm start`
2. Open `donation.html` in browser
3. Click "Donate Now" button
4. Fill form and test payment

### Option 2: Simple Test Page
1. Start the server: `cd stripe-demo && npm start`
2. Open `http://localhost:3001/test.html`
3. Use test card `4242 4242 4242 4242`
4. Complete payment

## ✨ Features Included

### 🔒 Security
- ✅ Test mode only (no real money)
- ✅ Server-side payment intent creation
- ✅ Client-side payment confirmation
- ✅ Secure Stripe Elements for card input

### 🎨 UI/UX
- ✅ Professional Stripe Elements styling
- ✅ Responsive design
- ✅ Loading states and error handling
- ✅ Success confirmation modal
- ✅ Real-time form validation

### 💳 Payment Flow
1. User selects donation amount
2. Fills in personal details
3. Enters card information (Stripe Elements)
4. Frontend calls backend `/create-payment-intent`
5. Backend creates PaymentIntent with Stripe
6. Frontend confirms payment with card details
7. Success/error handling with user feedback

## 🐛 Troubleshooting

### Server Won't Start
- Check if port 3001 is available
- Verify you're in the `stripe-demo` directory
- Run `npm install` if needed

### Payment Fails
- Verify you've set the correct secret key
- Check browser console for errors
- Ensure server is running on port 3001
- Try different test cards

### CORS Issues
- Server includes CORS middleware
- If issues persist, try accessing via `http://localhost:3001/donation.html`

### Network Errors
- Check that backend server is running
- Verify the frontend is making requests to `http://localhost:3001`
- Check browser network tab for failed requests

## 📁 File Structure

```
NSA-Website/
├── donation.html          # Updated with Stripe form
├── donation.css           # Stripe Elements styling
├── donation.js            # Stripe integration logic
├── stripe-demo/
│   ├── server.js          # Express server
│   ├── test.html          # Simple test page
│   ├── package.json       # Dependencies
│   └── README.md          # Backend docs
└── STRIPE_SETUP.md        # This file
```

## 🚀 Next Steps

### For Development
- Test all payment scenarios
- Customize styling to match your brand
- Add donation amount validation
- Test on different devices/browsers

### For Production
1. Replace test keys with live keys
2. Set up webhook endpoints
3. Add proper logging
4. Implement database storage
5. Set up SSL/HTTPS
6. Add rate limiting

## 💡 Usage Examples

### Successful Test Payment
1. Amount: `$5.00`
2. Card: `4242 4242 4242 4242`
3. Expiry: `12/25`
4. CVC: `123`
5. Result: ✅ "Thank You for Your Donation!" modal

### Declined Payment Test
1. Amount: `$10.00`
2. Card: `4000 0000 0000 0002`
3. Result: ❌ "Your card was declined" error message

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Check the server logs in terminal
3. Verify all keys are correct
4. Test with different browsers
5. Try the simple test page first

## 🎉 Congratulations!

Your NSA Website now has a professional, secure donation system powered by Stripe! The integration handles:

- ✅ Secure payment processing
- ✅ Professional UI/UX
- ✅ Error handling
- ✅ Success confirmations
- ✅ Test mode safety
- ✅ Responsive design

Happy testing! 🎊
