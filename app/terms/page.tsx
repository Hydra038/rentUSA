/**
 * Terms of Service Page
 */

import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service',
  description: 'Read RentUSA\'s Terms of Service to understand your rights and responsibilities.'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last updated: November 2, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-primary max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using RentUSA ("the Platform", "we", "us", or "our"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these Terms of Service, please do not use this Platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            RentUSA is an online platform that connects property renters with landlords and property managers. We provide tools to search for rental properties, list properties, and facilitate communication between parties. RentUSA does not own, manage, or rent any properties listed on the Platform.
          </p>

          <h2>3. User Accounts</h2>
          <h3>3.1 Registration</h3>
          <p>
            To access certain features, you must create an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Maintain the security of your password and account</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Be responsible for all activities under your account</li>
          </ul>

          <h3>3.2 Account Types</h3>
          <p>We offer three types of user accounts:</p>
          <ul>
            <li><strong>Renter:</strong> Search and save listings, contact landlords</li>
            <li><strong>Landlord:</strong> List properties, manage listings, respond to inquiries</li>
            <li><strong>Admin:</strong> Platform management and oversight</li>
          </ul>

          <h2>4. Listing Guidelines for Landlords</h2>
          <h3>4.1 Accurate Information</h3>
          <p>
            Landlords must provide truthful, accurate, and complete information about their properties, including:
          </p>
          <ul>
            <li>Property address and location</li>
            <li>Rental price and terms</li>
            <li>Property condition and amenities</li>
            <li>Availability dates</li>
            <li>Pet policies and restrictions</li>
            <li>Any additional fees or requirements</li>
          </ul>

          <h3>4.2 Photos and Images</h3>
          <p>
            All photos must accurately represent the property. Stock photos or misleading images are prohibited. You warrant that you have the right to use all images you upload.
          </p>

          <h3>4.3 Prohibited Listings</h3>
          <p>You may not list properties that:</p>
          <ul>
            <li>Violate local housing laws or regulations</li>
            <li>Are discriminatory in nature</li>
            <li>Are fraudulent or misleading</li>
            <li>Violate fair housing laws</li>
          </ul>

          <h2>5. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit spam, unsolicited messages, or advertising</li>
            <li>Use the Platform for fraudulent purposes</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Attempt to gain unauthorized access to the Platform</li>
            <li>Interfere with the proper functioning of the Platform</li>
            <li>Scrape or extract data using automated tools</li>
          </ul>

          <h2>6. Fees and Payments</h2>
          <h3>6.1 Free Services</h3>
          <p>
            Basic listing creation and rental searches are free. We may offer premium features for a fee.
          </p>

          <h3>6.2 Premium Features</h3>
          <p>
            Landlords may purchase premium listing features such as featured placement, highlighted listings, or additional photos. All fees are non-refundable unless otherwise stated.
          </p>

          <h2>7. Content Ownership and License</h2>
          <h3>7.1 Your Content</h3>
          <p>
            You retain ownership of content you post. By posting, you grant RentUSA a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content on the Platform.
          </p>

          <h3>7.2 Our Content</h3>
          <p>
            The Platform and its original content, features, and functionality are owned by RentUSA and are protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2>8. Disclaimers and Limitation of Liability</h2>
          <h3>8.1 No Warranty</h3>
          <p>
            THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
          </p>

          <h3>8.2 Third-Party Transactions</h3>
          <p>
            RentUSA is not a party to any rental agreements or transactions between users. We do not verify the identity or backgrounds of users. You are solely responsible for evaluating rental properties and landlords.
          </p>

          <h3>8.3 Limitation of Liability</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, RENTUSA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR BUSINESS INTERRUPTION.
          </p>

          <h2>9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless RentUSA from any claims, damages, losses, liabilities, and expenses arising from your use of the Platform or violation of these Terms.
          </p>

          <h2>10. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion. You may delete your account at any time through your account settings.
          </p>

          <h2>11. Dispute Resolution</h2>
          <h3>11.1 Informal Resolution</h3>
          <p>
            Before filing a claim, you agree to contact us at legal@rentusa.com to attempt informal resolution.
          </p>

          <h3>11.2 Arbitration</h3>
          <p>
            Any disputes not resolved informally shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
          </p>

          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of material changes by email or through a notice on the Platform. Your continued use after changes constitutes acceptance of the new Terms.
          </p>

          <h2>14. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us:
          </p>
          <ul>
            <li>Email: legal@rentusa.com</li>
            <li>Phone: 1-800-RENT-USA</li>
            <li>Address: 123 Main Street, Suite 500, New York, NY 10001</li>
          </ul>

          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
