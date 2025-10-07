# Billing System Documentation

## Overview

This billing system provides a comprehensive solution for managing subscriptions, payments, and user limits in your website builder application. It supports multiple payment gateways including Stripe, JazzCash, EasyPaisa, and Bank Transfer.

## Features

### 🎯 Subscription Management
- **Free Plan**: 1 website, 5 pages, 10 products, 100MB storage, 5 AI generations
- **Pro Plan**: 5 websites, 50 pages, 100 products, 1GB storage, 100 AI generations (PKR 2,999/month)
- **Agency Plan**: 50 websites, 500 pages, 1000 products, 10GB storage, 1000 AI generations (PKR 9,999/month)

### 💳 Payment Gateways
- **Stripe**: International payments with webhook support
- **JazzCash**: Pakistani mobile payment gateway
- **EasyPaisa**: Pakistani mobile payment gateway
- **Bank Transfer**: Manual payment processing

### 📊 Usage Tracking
- Real-time usage monitoring
- AI quota management
- Feature access control
- Usage alerts and notifications

## Components

### 1. BillingDashboard (`/components/billing/BillingDashboard.tsx`)
Main billing interface with tabs for:
- Plans overview
- Payment methods
- Usage tracking
- Payment history

### 2. SubscriptionPlan (`/components/billing/SubscriptionPlan.tsx`)
Reusable component for displaying subscription plans with:
- Feature comparison
- Pricing display
- Upgrade buttons
- Current plan highlighting

### 3. PaymentMethodForm (`/components/billing/PaymentMethodForm.tsx`)
Payment method management with support for:
- Credit/debit cards
- Bank transfers
- Mobile payments (JazzCash/EasyPaisa)
- Default payment method selection

### 4. BillingHistory (`/components/billing/BillingHistory.tsx`)
Payment history with features:
- Transaction filtering
- Status tracking
- Invoice downloads
- Export functionality

## API Integration

### Backend Endpoints
The system integrates with these backend endpoints:

```typescript
// Subscription endpoints
GET /api/subscriptions - Get all available subscriptions
GET /api/subscriptions/:id - Get specific subscription
GET /api/subscriptions/default - Get default subscription
POST /api/subscriptions/upgrade - Upgrade subscription
POST /api/subscriptions/confirm-upgrade - Confirm upgrade
GET /api/subscriptions/limits/:userId - Get user limits

// Payment endpoints
POST /api/payments/create-intent - Create payment intent
POST /api/payments/confirm - Confirm payment
GET /api/payments/history - Get payment history
```

### Frontend API Helpers
All API calls are handled through `apiHelpers` in `/lib/api.ts`:

```typescript
// Example usage
const subscriptions = await apiHelpers.getSubscriptions()
const result = await apiHelpers.upgradeSubscription({
  userId: 'user-id',
  subscriptionId: 'subscription-id',
  paymentGateway: 'STRIPE',
  customerEmail: 'user@example.com'
})
```

## Usage

### 1. Access Billing Page
Navigate to `/dashboard/billing` in your application.

### 2. View Current Plan
The billing dashboard shows:
- Current subscription details
- Usage statistics
- Feature access status
- AI quota remaining

### 3. Upgrade Subscription
1. Go to the "Plans" tab
2. Select desired subscription plan
3. Choose payment method
4. Complete payment process

### 4. Manage Payment Methods
1. Go to the "Payment" tab
2. Add new payment methods
3. Set default payment method
4. Remove unused methods

### 5. View Payment History
1. Go to the "History" tab
2. Filter by status or gateway
3. Download invoices
4. Export payment data

## Configuration

### Environment Variables
Set these environment variables for payment gateways:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# JazzCash
JAZZCASH_MERCHANT_ID=your_merchant_id
JAZZCASH_PASSWORD=your_password
JAZZCASH_RETURN_URL=https://yourdomain.com/billing/success
JAZZCASH_CANCEL_URL=https://yourdomain.com/billing/cancel

# EasyPaisa
EASYPAISA_MERCHANT_ID=your_merchant_id
EASYPAISA_PASSWORD=your_password
EASYPAISA_RETURN_URL=https://yourdomain.com/billing/success
EASYPAISA_CANCEL_URL=https://yourdomain.com/billing/cancel
```

### Database Schema
The system uses these Prisma models:
- `User` - User information and subscription link
- `Subscription` - Subscription plans and features
- `Payment` - Payment transactions
- `Order` - Order management for e-commerce

## Customization

### Adding New Payment Gateways
1. Add gateway configuration to environment variables
2. Update `PaymentService` in backend
3. Add gateway option to frontend forms
4. Implement webhook handling

### Modifying Subscription Plans
1. Update subscription data in `SubscriptionService`
2. Modify plan features in database
3. Update frontend plan display components
4. Adjust user limit calculations

### Customizing UI
All components use Tailwind CSS and shadcn/ui components:
- Modify colors in component files
- Update icons from Lucide React
- Customize layouts and spacing
- Add new features to existing components

## Security Considerations

1. **Payment Data**: Never store sensitive payment information
2. **API Keys**: Keep all API keys secure and use environment variables
3. **Webhooks**: Verify webhook signatures for all payment gateways
4. **User Limits**: Always validate limits on the backend
5. **Access Control**: Implement proper authentication and authorization

## Troubleshooting

### Common Issues

1. **Payment Failures**
   - Check API key configuration
   - Verify webhook endpoints
   - Review payment gateway logs

2. **Subscription Not Updating**
   - Confirm webhook processing
   - Check database transactions
   - Verify user ID mapping

3. **Usage Limits Not Enforcing**
   - Review limit calculation logic
   - Check user subscription status
   - Verify feature access controls

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
ENABLE_LOGGING=true
```

## Support

For issues or questions:
1. Check the backend logs for error details
2. Verify API endpoint responses
3. Test payment flows in sandbox mode
4. Review webhook delivery status

## Future Enhancements

- [ ] Recurring billing automation
- [ ] Invoice generation and emailing
- [ ] Refund processing interface
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Tax calculation integration
- [ ] Coupon and discount system
- [ ] Usage-based billing options
