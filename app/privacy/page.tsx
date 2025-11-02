/**
 * Privacy Policy Page
 */

import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Learn how RentUSA collects, uses, and protects your personal information.'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: November 2, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-primary max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Name and email address</li>
            <li>Account credentials</li>
            <li>Property listing information (for landlords)</li>
            <li>Search preferences and favorites</li>
            <li>Communication with landlords or renters</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <ul>
            <li>With landlords when you inquire about a property</li>
            <li>With service providers who assist in our operations</li>
            <li>When required by law or to protect rights and safety</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>5. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Export your data</li>
          </ul>

          <h2>7. Third-Party Services</h2>
          <p>
            Our platform may integrate with third-party services (Google OAuth, Stripe, Cloudinary). These services have their own privacy policies.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our service is not intended for users under 18 years of age. We do not knowingly collect information from children.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at privacy@rentusa.com
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
