import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';

const PAGE_TITLE = 'Privacy Policy';
const PAGE_DESCRIPTION =
  'Information about how we collect, use, and protect your data.';

const PrivacyPage: NextPage = () => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE}`} />
      <Container data-aos='fade-up'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100'>
              Privacy Policy
            </h1>
            <p className='text-sm text-neutral-600 dark:text-neutral-400'>
              Last updated: December 13, 2025
            </p>
          </div>

          <div className='space-y-8 text-neutral-700 dark:text-neutral-300'>
            {/* Introduction */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Introduction
              </h2>
              <p>
                Welcome to ilhame.id. We respect your privacy and are committed
                to protecting your personal data. This privacy policy explains
                how we collect, use, store, and protect your information when
                you use our website and services.
              </p>
            </section>

            {/* Scope of This Policy */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Scope of This Policy
              </h2>
              <p>
                This privacy policy applies to all services provided by
                ilhame.id, including all subdomains and related applications. By
                using our services, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Information We Collect
              </h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200'>
                    Personal Information
                  </h3>
                  <p className='mb-2'>
                    We collect the following personal information:
                  </p>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li>
                      <strong>Name:</strong> Your full name or display name
                    </li>
                    <li>
                      <strong>Email Address:</strong> Used for account creation
                      and communication
                    </li>
                    <li>
                      <strong>Profile Photo:</strong> Optional profile image
                      from your authentication provider
                    </li>
                    <li>
                      <strong>User-Generated Content:</strong> Blog posts,
                      comments, gallery images, and other content you create
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200'>
                    Authentication Data (Google OAuth)
                  </h3>
                  <p className='mb-2'>
                    When you sign in using Google OAuth, we receive:
                  </p>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li>Your Google account email address</li>
                    <li>Your Google profile name</li>
                    <li>Your Google profile picture (if available)</li>
                    <li>
                      A unique identifier from Google to authenticate your
                      account
                    </li>
                  </ul>
                  <p className='mt-2'>
                    We use Firebase Authentication to securely handle this
                    process. We do not receive or store your Google password.
                  </p>
                </div>

                <div>
                  <h3 className='mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200'>
                    Technical Information
                  </h3>
                  <ul className='list-disc space-y-2 pl-6'>
                    <li>
                      <strong>IP Address:</strong> For security and analytics
                      purposes
                    </li>
                    <li>
                      <strong>Browser Type and Version:</strong> To optimize
                      user experience
                    </li>
                    <li>
                      <strong>Device Information:</strong> Operating system,
                      device type, and screen resolution
                    </li>
                    <li>
                      <strong>Usage Data:</strong> Pages visited, time spent,
                      and interaction patterns
                    </li>
                    <li>
                      <strong>Cookies:</strong> Session cookies for
                      authentication and preference storage
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                How We Use Your Information
              </h2>
              <p>
                We use the collected information for the following purposes:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  <strong>Account Management:</strong> Create and manage your
                  user account, authenticate your identity
                </li>
                <li>
                  <strong>Service Delivery:</strong> Provide and maintain our
                  services, display your content
                </li>
                <li>
                  <strong>Personalization:</strong> Remember your preferences
                  and customize your experience
                </li>
                <li>
                  <strong>Communication:</strong> Respond to inquiries, provide
                  support, and send important updates
                </li>
                <li>
                  <strong>Analytics:</strong> Understand usage patterns to
                  improve features and performance
                </li>
                <li>
                  <strong>Security:</strong> Detect and prevent fraud, abuse,
                  and security threats
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Comply with legal
                  obligations and enforce our terms of service
                </li>
              </ul>
            </section>

            {/* Data Sharing & Disclosure */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Data Sharing & Disclosure
              </h2>
              <p>
                We do not sell your personal information. We may share your data
                only in the following circumstances:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly agree
                  to share information
                </li>
                <li>
                  <strong>Service Providers:</strong> With trusted third-party
                  services (e.g., hosting, authentication) that help us operate
                  our platform
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  court order, or legal process
                </li>
                <li>
                  <strong>Protection of Rights:</strong> To protect the rights,
                  property, or safety of ilhame.id, our users, or others
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
              </ul>
            </section>

            {/* Data Storage & Security */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Data Storage & Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                data:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  <strong>Encryption:</strong> All data is encrypted in transit
                  using HTTPS/TLS and at rest in our databases
                </li>
                <li>
                  <strong>Secure Authentication:</strong> Firebase
                  Authentication with OAuth 2.0 for secure sign-in
                </li>
                <li>
                  <strong>Database Security:</strong> PostgreSQL database with
                  strict access controls and regular security audits
                </li>
                <li>
                  <strong>Access Controls:</strong> Role-based access with
                  principle of least privilege
                </li>
                <li>
                  <strong>Regular Backups:</strong> Automated backups to prevent
                  data loss
                </li>
                <li>
                  <strong>Monitoring:</strong> Continuous monitoring for
                  suspicious activity and security threats
                </li>
                <li>
                  <strong>Updates:</strong> Regular security patches and
                  dependency updates
                </li>
              </ul>
              <p className='mt-3'>
                While we strive to protect your personal information, no method
                of transmission over the Internet or electronic storage is 100%
                secure. We cannot guarantee absolute security but are committed
                to protecting your data using reasonable measures.
              </p>
            </section>

            {/* Data Retention */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Data Retention
              </h2>
              <p>
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                privacy policy. Specifically:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  <strong>Account Data:</strong> Retained while your account is
                  active
                </li>
                <li>
                  <strong>Content:</strong> Blog posts, comments, and gallery
                  items remain until you delete them
                </li>
                <li>
                  <strong>Analytics Data:</strong> Aggregated and anonymized
                  data may be retained indefinitely
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Some data may be retained
                  longer to comply with legal obligations
                </li>
              </ul>
              <p className='mt-2'>
                When you delete your account, we will remove your personal
                information from our active databases, though some data may
                remain in backups for a limited period.
              </p>
            </section>

            {/* User Rights */}
            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Your Rights
              </h2>
              <p>You have the following rights regarding your personal data:</p>

              <div className='space-y-3'>
                <div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
                    Right to Access
                  </h3>
                  <p>
                    You can request a copy of the personal data we hold about
                    you. You can view most of your data through your account
                    dashboard.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
                    Right to Update
                  </h3>
                  <p>
                    You can update your profile information, including your name
                    and profile photo, at any time through your account
                    settings.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
                    Right to Deletion
                  </h3>
                  <p>
                    You have the right to request deletion of your personal
                    data. You can delete your account and associated data
                    through the dashboard or by contacting us. Please note that
                    some information may be retained for legal or legitimate
                    business purposes.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
                    Additional Rights
                  </h3>
                  <ul className='list-disc space-y-1 pl-6'>
                    <li>
                      Right to data portability (receive your data in a
                      structured format)
                    </li>
                    <li>Right to object to processing of your personal data</li>
                    <li>
                      Right to restrict processing in certain circumstances
                    </li>
                    <li>Right to withdraw consent at any time</li>
                  </ul>
                </div>
              </div>

              <p className='mt-3'>
                To exercise these rights, please contact us through the
                information provided below.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Third-Party Services
              </h2>
              <p>We use the following third-party services:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  <strong>Google Sign-In (OAuth):</strong> For secure
                  authentication. Google's privacy policy applies to data shared
                  through their service.
                  <a
                    href='https://policies.google.com/privacy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ml-1 text-blue-600 hover:underline dark:text-blue-400'
                  >
                    View Google Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Firebase Authentication:</strong> Manages user
                  authentication securely.
                  <a
                    href='https://firebase.google.com/support/privacy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ml-1 text-blue-600 hover:underline dark:text-blue-400'
                  >
                    View Firebase Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Vercel:</strong> Hosting and deployment platform.
                  <a
                    href='https://vercel.com/legal/privacy-policy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ml-1 text-blue-600 hover:underline dark:text-blue-400'
                  >
                    View Vercel Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Cloudflare Turnstile:</strong> For bot protection and
                  security.
                  <a
                    href='https://www.cloudflare.com/privacypolicy/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ml-1 text-blue-600 hover:underline dark:text-blue-400'
                  >
                    View Cloudflare Privacy Policy
                  </a>
                </li>
              </ul>
              <p className='mt-2'>
                These services may collect and process data according to their
                own privacy policies. We recommend reviewing their policies to
                understand how they handle your information.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Children's Privacy
              </h2>
              <p>
                Our services are not intended for users under the age of 13. We
                do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us
                immediately. If we discover that we have collected information
                from a child under 13, we will take steps to delete that
                information as soon as possible.
              </p>
            </section>

            {/* Changes to This Privacy Policy */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update this privacy policy from time to time to reflect
                changes in our practices or for legal, operational, or
                regulatory reasons. We will notify you of any material changes
                by:
              </p>
              <ul className='list-disc space-y-1 pl-6'>
                <li>Posting the updated policy on this page</li>
                <li>
                  Updating the "Last updated" date at the top of this policy
                </li>
                <li>
                  Sending an email notification for significant changes (if you
                  have an account)
                </li>
              </ul>
              <p className='mt-2'>
                We encourage you to review this privacy policy periodically.
                Your continued use of our services after changes are posted
                constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section className='space-y-3 border-t border-neutral-300 pt-6 dark:border-neutral-700'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Contact Information
              </h2>
              <p>
                If you have any questions, concerns, or requests regarding this
                privacy policy or our data practices, please contact us:
              </p>
              <ul className='space-y-2'>
                <li>
                  <strong>Through our contact form:</strong>{' '}
                  <a
                    href='/contact'
                    className='text-blue-600 hover:underline dark:text-blue-400'
                  >
                    ilhame.id/contact
                  </a>
                </li>
                <li>
                  <strong>Website:</strong>{' '}
                  <a
                    href='https://ilhame.id'
                    className='text-blue-600 hover:underline dark:text-blue-400'
                  >
                    https://ilhame.id
                  </a>
                </li>
              </ul>
              <p className='mt-3'>
                We will respond to your inquiries within a reasonable timeframe,
                typically within 30 days.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PrivacyPage;
