/**
 * Cookie Policy Page
 */

import Link from 'next/link'

export const metadata = {
  title: 'Cookie Policy',
  description: 'Learn how RentUSA uses cookies to improve your experience.'
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-600">
            Last updated: November 2, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-primary max-w-none">
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>
            RentUSA uses cookies for the following purposes:
          </p>

          <h3>2.1 Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable:
          </p>
          <ul>
            <li>User authentication and account access</li>
            <li>Security features</li>
            <li>Shopping cart functionality (for premium features)</li>
            <li>Session management</li>
          </ul>

          <h3>2.2 Performance Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website:
          </p>
          <ul>
            <li>Page visit tracking</li>
            <li>Error monitoring</li>
            <li>Load time analysis</li>
            <li>Usage statistics</li>
          </ul>

          <h3>2.3 Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalization:
          </p>
          <ul>
            <li>Remembering your preferences (language, region)</li>
            <li>Saved searches and favorites</li>
            <li>Custom display settings</li>
            <li>Recently viewed properties</li>
          </ul>

          <h3>2.4 Targeting/Advertising Cookies</h3>
          <p>
            These cookies are used to deliver relevant advertisements:
          </p>
          <ul>
            <li>Tracking ad performance</li>
            <li>Personalized marketing</li>
            <li>Retargeting campaigns</li>
            <li>Interest-based advertising</li>
          </ul>

          <h2>3. Third-Party Cookies</h2>
          <p>
            We may use third-party services that also set cookies on your device:
          </p>

          <h3>3.1 Google Analytics</h3>
          <p>
            We use Google Analytics to analyze website traffic and user behavior. Google may use cookies to collect information about your use of our site.
          </p>

          <h3>3.2 Authentication Providers</h3>
          <p>
            When you sign in using Google or other third-party services, they may set their own cookies.
          </p>

          <h3>3.3 Payment Processors</h3>
          <p>
            Services like Stripe may use cookies when processing payments for premium features.
          </p>

          <h2>4. Types of Cookies We Use</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left">Cookie Name</th>
                <th className="text-left">Purpose</th>
                <th className="text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session_id</td>
                <td>Authentication and session management</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>user_preferences</td>
                <td>Store user settings and preferences</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>_ga</td>
                <td>Google Analytics tracking</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>search_history</td>
                <td>Remember recent searches</td>
                <td>30 days</td>
              </tr>
            </tbody>
          </table>

          <h2>5. Managing Cookies</h2>
          <h3>5.1 Browser Settings</h3>
          <p>
            Most web browsers allow you to manage cookies through their settings. You can:
          </p>
          <ul>
            <li>View which cookies are stored</li>
            <li>Delete all or specific cookies</li>
            <li>Block third-party cookies</li>
            <li>Block all cookies (may affect functionality)</li>
          </ul>

          <h3>5.2 Browser-Specific Instructions</h3>
          <p>
            <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data<br />
            <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data<br />
            <strong>Safari:</strong> Preferences → Privacy → Manage Website Data<br />
            <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions
          </p>

          <h3>5.3 Opt-Out Tools</h3>
          <p>
            You can opt out of Google Analytics tracking by installing the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>

          <h2>6. Do Not Track Signals</h2>
          <p>
            Some browsers include a "Do Not Track" (DNT) feature. Currently, there is no industry standard for how to respond to DNT signals. We do not currently respond to DNT signals, but we respect your privacy choices.
          </p>

          <h2>7. Cookie Consent</h2>
          <p>
            When you first visit RentUSA, we may display a cookie consent banner. By continuing to use our site, you consent to our use of cookies as described in this policy.
          </p>
          <p>
            You can withdraw your consent at any time by:
          </p>
          <ul>
            <li>Clearing your cookies through browser settings</li>
            <li>Adjusting your cookie preferences in our cookie settings</li>
            <li>Contacting us at privacy@rentusa.com</li>
          </ul>

          <h2>8. Mobile Applications</h2>
          <p>
            Our mobile applications may use similar technologies (like device identifiers) to provide functionality and collect usage data. You can manage these through your device settings.
          </p>

          <h2>9. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us:
          </p>
          <ul>
            <li>Email: privacy@rentusa.com</li>
            <li>Phone: 1-800-RENT-USA</li>
            <li>Mail: RentUSA, 123 Main Street, Suite 500, New York, NY 10001</li>
          </ul>

          <h2>11. Additional Resources</h2>
          <p>
            For more information about cookies and online privacy:
          </p>
          <ul>
            <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">All About Cookies</a></li>
            <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Your Online Choices</a></li>
            <li><a href="https://www.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Network Advertising Initiative</a></li>
          </ul>
        </div>

        {/* Related Links */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Related Policies</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </Link>
          </div>
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
