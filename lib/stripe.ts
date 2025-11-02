/**
 * Stripe Configuration
 * Handles payment processing for landlord subscriptions
 * and featured listings
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Subscription Price IDs (configure these in your Stripe Dashboard)
export const STRIPE_PLANS = {
  BASIC: {
    name: 'Basic Plan',
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
    amount: 2999, // $29.99
    features: ['Up to 5 listings', 'Basic support', 'Standard visibility'],
  },
  PREMIUM: {
    name: 'Premium Plan',
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium',
    amount: 9999, // $99.99
    features: [
      'Unlimited listings',
      'Priority support',
      'Featured placement',
      'Analytics dashboard',
    ],
  },
  FEATURED_LISTING: {
    name: 'Featured Listing',
    priceId: process.env.STRIPE_FEATURED_PRICE_ID || 'price_featured',
    amount: 4999, // $49.99 one-time
    features: ['30-day featured placement', 'Top search results'],
  },
}

/**
 * Create a Stripe Checkout session for subscription or one-time payment
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  mode: 'subscription' | 'payment' = 'subscription'
) {
  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/landlord?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/landlord?canceled=true`,
    client_reference_id: userId,
    metadata: {
      userId,
    },
  })

  return session
}

/**
 * Create a Stripe Portal session for subscription management
 */
export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/landlord`,
  })

  return session
}
