/**
 * Fair Housing Policy Page
 */

import Link from 'next/link'
import { Shield, Users, Home, Heart } from 'lucide-react'

export const metadata = {
  title: 'Fair Housing Policy',
  description: 'RentUSA is committed to upholding Fair Housing laws and preventing discrimination.'
}

export default function FairHousingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-12 w-12 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Fair Housing Policy
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            RentUSA is committed to equal housing opportunity
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: November 2, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-primary max-w-none">
          <h2>Our Commitment</h2>
          <p className="text-lg">
            RentUSA is committed to ensuring equal housing opportunity for all persons in accordance with federal, state, and local Fair Housing laws. We do not tolerate discrimination in housing based on protected characteristics.
          </p>

          <h2>The Fair Housing Act</h2>
          <p>
            The Fair Housing Act, enacted in 1968 and amended in 1988, prohibits discrimination in housing based on:
          </p>
          <ul>
            <li><strong>Race or Color</strong></li>
            <li><strong>National Origin</strong></li>
            <li><strong>Religion</strong></li>
            <li><strong>Sex (including gender identity and sexual orientation)</strong></li>
            <li><strong>Familial Status</strong> (families with children under 18, pregnant persons)</li>
            <li><strong>Disability</strong> (physical or mental impairments)</li>
          </ul>

          <h2>Additional Protected Classes</h2>
          <p>
            Many states and localities have additional protected classes under their fair housing laws, which may include:
          </p>
          <ul>
            <li>Age</li>
            <li>Marital status</li>
            <li>Sexual orientation</li>
            <li>Gender identity</li>
            <li>Source of income</li>
            <li>Military/veteran status</li>
            <li>Ancestry</li>
          </ul>

          <h2>Prohibited Discrimination</h2>
          <p>
            Under Fair Housing laws, it is illegal to:
          </p>
          <ul>
            <li>Refuse to rent or sell housing based on protected characteristics</li>
            <li>Set different terms, conditions, or privileges for rental</li>
            <li>Provide different housing services or facilities</li>
            <li>Falsely deny that housing is available</li>
            <li>Use discriminatory advertising or statements</li>
            <li>Refuse to make reasonable accommodations for persons with disabilities</li>
            <li>Harass, intimidate, or interfere with fair housing rights</li>
            <li>Deny access or membership to multiple listing services</li>
          </ul>

          <h2>RentUSA's Policy</h2>
          <h3>For All Users</h3>
          <p>
            RentUSA prohibits discrimination in all aspects of our service. We:
          </p>
          <ul>
            <li>Do not allow discriminatory listings or advertisements</li>
            <li>Monitor listings for compliance with Fair Housing laws</li>
            <li>Remove listings that violate Fair Housing requirements</li>
            <li>Provide equal access to all features and services</li>
            <li>Train our staff on Fair Housing requirements</li>
          </ul>

          <h3>For Landlords</h3>
          <p>
            Landlords using RentUSA must:
          </p>
          <ul>
            <li>Comply with all federal, state, and local Fair Housing laws</li>
            <li>Not include discriminatory preferences or limitations in listings</li>
            <li>Apply uniform screening criteria to all applicants</li>
            <li>Make reasonable accommodations for persons with disabilities</li>
            <li>Not make discriminatory statements in communications</li>
          </ul>

          <h3>For Renters</h3>
          <p>
            If you believe you have experienced housing discrimination:
          </p>
          <ul>
            <li>Document all interactions and communications</li>
            <li>Report the incident to RentUSA immediately</li>
            <li>File a complaint with HUD or your local Fair Housing agency</li>
            <li>Consider consulting with a fair housing attorney</li>
          </ul>

          <h2>Reasonable Accommodations</h2>
          <p>
            Under Fair Housing law, landlords must make reasonable accommodations for persons with disabilities, which may include:
          </p>
          <ul>
            <li>Allowing service animals and emotional support animals</li>
            <li>Permitting modifications to units (at tenant's expense)</li>
            <li>Adjusting policies, practices, or procedures</li>
            <li>Providing accessible parking spaces</li>
            <li>Accepting alternative forms of income verification</li>
          </ul>

          <h2>Familial Status Protections</h2>
          <p>
            It is illegal to discriminate against families with children, including:
          </p>
          <ul>
            <li>Refusing to rent to families with children</li>
            <li>Imposing different terms for families with children</li>
            <li>Restricting families to certain units or buildings</li>
            <li>Advertising "adults only" or "no children"</li>
          </ul>
          <p>
            <strong>Exception:</strong> Housing specifically designated for seniors (55+ or 62+) may qualify for familial status exemptions under specific conditions.
          </p>

          <h2>Discriminatory Advertising</h2>
          <p>
            The following are examples of prohibited language in housing advertisements:
          </p>
          <ul>
            <li>"No children" or "Adults only"</li>
            <li>"Perfect for Christian family"</li>
            <li>"No wheelchairs"</li>
            <li>"English speakers only"</li>
            <li>"Ideal for professional couple"</li>
            <li>"Walking distance to church/synagogue/mosque"</li>
          </ul>

          <h2>Reporting Violations</h2>
          <h3>Report to RentUSA</h3>
          <p>
            If you encounter a listing or user that violates Fair Housing laws on our platform:
          </p>
          <ul>
            <li>Email: fairhousing@rentusa.com</li>
            <li>Phone: 1-800-RENT-USA</li>
            <li>Use the "Report Listing" button on any property page</li>
          </ul>

          <h3>File a HUD Complaint</h3>
          <p>
            You can file a complaint with the U.S. Department of Housing and Urban Development (HUD):
          </p>
          <ul>
            <li>Online: <a href="https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">File Online</a></li>
            <li>Phone: 1-800-669-9777 (English) or 1-800-927-9275 (TTY)</li>
            <li>Mail: Office of Fair Housing and Equal Opportunity, U.S. Department of Housing and Urban Development, 451 7th Street S.W., Washington, DC 20410</li>
          </ul>

          <h3>State and Local Agencies</h3>
          <p>
            Many states and cities have their own Fair Housing agencies that can investigate complaints and may provide additional protections beyond federal law.
          </p>

          <h2>Investigation and Enforcement</h2>
          <p>
            When RentUSA receives a Fair Housing complaint, we:
          </p>
          <ol>
            <li>Promptly investigate all allegations</li>
            <li>Take immediate action on verified violations</li>
            <li>Remove discriminatory listings</li>
            <li>Suspend or terminate accounts that violate our policy</li>
            <li>Cooperate with government investigations</li>
          </ol>

          <h2>Resources and Education</h2>
          <p>
            Learn more about Fair Housing:
          </p>
          <ul>
            <li><a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">HUD Fair Housing</a></li>
            <li><a href="https://nationalfairhousing.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">National Fair Housing Alliance</a></li>
            <li>Local Fair Housing organizations in your area</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            For questions about our Fair Housing Policy:
          </p>
          <ul>
            <li>Email: fairhousing@rentusa.com</li>
            <li>Phone: 1-800-RENT-USA</li>
            <li>Mail: RentUSA Fair Housing Compliance, 123 Main Street, Suite 500, New York, NY 10001</li>
          </ul>
        </div>

        {/* Equal Housing Opportunity Statement */}
        <div className="mt-8 bg-primary-50 border-2 border-primary-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Home className="h-12 w-12 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Equal Housing Opportunity
              </h3>
              <p className="text-gray-700 mb-4">
                RentUSA is pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the Nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Housing for All</span>
              </div>
            </div>
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
