import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';

const PAGE_TITLE = 'Terms of Service';
const PAGE_DESCRIPTION = 'Terms and conditions for using ilhame.id services.';

const TermsPage: NextPage = () => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE}`} />
      <Container data-aos='fade-up'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-neutral-900 dark:text-neutral-100'>
              Terms of Service
            </h1>
            <p className='text-sm text-neutral-600 dark:text-neutral-400'>
              Effective Date: December 13, 2025
            </p>
          </div>

          <div className='space-y-8 text-neutral-700 dark:text-neutral-300'>
            {/* Introduction */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Introduction
              </h2>
              <p>
                Welcome to ilhame.id. These Terms of Service ("Terms") govern
                your access to and use of our website, services, and
                applications (collectively, the "Service"). By accessing or
                using our Service, you agree to be bound by these Terms.
              </p>
              <p>
                Please read these Terms carefully before using our Service. If
                you do not agree to these Terms, you may not access or use the
                Service.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Acceptance of Terms
              </h2>
              <p>
                By creating an account, accessing, or using any part of our
                Service, you acknowledge that you have read, understood, and
                agree to be bound by these Terms, as well as our{' '}
                <a
                  href='/privacy'
                  className='text-blue-600 hover:underline dark:text-blue-400'
                >
                  Privacy Policy
                </a>
                .
              </p>
              <p>
                If you are using the Service on behalf of an organization, you
                represent and warrant that you have the authority to bind that
                organization to these Terms.
              </p>
            </section>

            {/* Description of Service */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Description of Service
              </h2>
              <p>
                ilhame.id is a personal portfolio and blog platform that
                provides:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Personal portfolio and professional information</li>
                <li>Blog posts and articles</li>
                <li>Gallery for image sharing</li>
                <li>Commenting system for user interaction</li>
                <li>Dashboard for authenticated users</li>
                <li>Contact and communication features</li>
              </ul>
              <p className='mt-2'>
                We reserve the right to modify, suspend, or discontinue any part
                of the Service at any time with or without notice.
              </p>
            </section>

            {/* Eligibility */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Eligibility
              </h2>
              <p>To use our Service, you must:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  Be at least 13 years of age or the minimum age required in
                  your jurisdiction
                </li>
                <li>
                  Have the legal capacity to enter into a binding agreement
                </li>
                <li>
                  Not be prohibited from using the Service under applicable laws
                </li>
                <li>
                  Provide accurate and complete information during registration
                </li>
              </ul>
              <p className='mt-2'>
                By using the Service, you represent and warrant that you meet
                these eligibility requirements.
              </p>
            </section>

            {/* User Accounts */}
            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                User Accounts
              </h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200'>
                    Account Creation
                  </h3>
                  <p>
                    To access certain features of the Service, you must create
                    an account. When creating an account:
                  </p>
                  <ul className='mt-2 list-disc space-y-1 pl-6'>
                    <li>
                      You must provide accurate, current, and complete
                      information
                    </li>
                    <li>
                      You must maintain and promptly update your account
                      information
                    </li>
                    <li>
                      You are responsible for maintaining the confidentiality of
                      your account credentials
                    </li>
                    <li>
                      You may not create multiple accounts or share your account
                      with others
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200'>
                    Account Responsibility
                  </h3>
                  <p>
                    You are solely responsible for all activities that occur
                    under your account. You agree to:
                  </p>
                  <ul className='mt-2 list-disc space-y-1 pl-6'>
                    <li>
                      Notify us immediately of any unauthorized access or use of
                      your account
                    </li>
                    <li>
                      Ensure that you log out from your account at the end of
                      each session
                    </li>
                    <li>
                      Accept responsibility for any actions taken through your
                      account
                    </li>
                    <li>Not allow others to use your account</li>
                  </ul>
                  <p className='mt-2'>
                    We are not liable for any loss or damage arising from your
                    failure to maintain account security.
                  </p>
                </div>

                <div>
                  <h3 className='mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200'>
                    Authentication
                  </h3>
                  <p>
                    We use Firebase Authentication to manage user accounts
                    securely. By creating an account, you agree to Firebase's
                    terms and our authentication practices.
                  </p>
                </div>

                <div>
                  <h3 className='mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-200'>
                    Google Sign-In / OAuth Usage
                  </h3>
                  <p>When you use Google Sign-In to authenticate:</p>
                  <ul className='mt-2 list-disc space-y-1 pl-6'>
                    <li>
                      You authorize us to access certain information from your
                      Google account
                    </li>
                    <li>
                      Your use of Google Sign-In is subject to Google's Terms of
                      Service and Privacy Policy
                    </li>
                    <li>
                      We will only access the minimum information necessary
                      (email, name, profile photo)
                    </li>
                    <li>
                      You can revoke our access to your Google account at any
                      time through your Google account settings
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities & Acceptable Use */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                User Responsibilities & Acceptable Use
              </h2>
              <p>When using our Service, you agree to:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Comply with all applicable laws and regulations</li>
                <li>
                  Respect the rights of others, including intellectual property
                  rights
                </li>
                <li>Use the Service only for lawful purposes</li>
                <li>Not interfere with or disrupt the Service or servers</li>
                <li>
                  Not attempt to gain unauthorized access to any part of the
                  Service
                </li>
                <li>Provide accurate information and not impersonate others</li>
                <li>
                  Maintain the security and confidentiality of your account
                </li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Prohibited Activities
              </h2>
              <p>You may not use the Service to:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  Post or transmit any content that is illegal, harmful,
                  threatening, abusive, harassing, defamatory, vulgar, obscene,
                  or otherwise objectionable
                </li>
                <li>Violate any intellectual property rights of others</li>
                <li>Upload viruses, malware, or any malicious code</li>
                <li>
                  Attempt to probe, scan, or test the vulnerability of the
                  Service
                </li>
                <li>
                  Engage in any automated use of the Service, such as scraping
                  or bots, without permission
                </li>
                <li>
                  Collect or harvest any personally identifiable information
                  from the Service
                </li>
                <li>
                  Impersonate any person or entity or misrepresent your
                  affiliation
                </li>
                <li>Spam, phish, or engage in any fraudulent activity</li>
                <li>
                  Interfere with or disrupt the Service or other users'
                  experience
                </li>
                <li>
                  Use the Service for any commercial purpose without
                  authorization
                </li>
              </ul>
              <p className='mt-3'>
                We reserve the right to investigate and take appropriate action
                against anyone who violates these prohibitions, including
                removing content and terminating accounts.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Intellectual Property
              </h2>
              <div className='space-y-3'>
                <div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
                    Our Content
                  </h3>
                  <p>
                    All content, features, and functionality of the Service,
                    including but not limited to text, graphics, logos, icons,
                    images, audio, video, software, and their arrangement, are
                    the exclusive property of ilhame.id and are protected by
                    copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className='mt-2'>
                    You may not reproduce, distribute, modify, create derivative
                    works, publicly display, republish, download, store, or
                    transmit any of our content without prior written consent.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
                    User Content
                  </h3>
                  <p>
                    By posting, uploading, or submitting content to the Service
                    ("User Content"), you:
                  </p>
                  <ul className='mt-2 list-disc space-y-1 pl-6'>
                    <li>Retain ownership of your User Content</li>
                    <li>
                      Grant us a worldwide, non-exclusive, royalty-free license
                      to use, reproduce, modify, adapt, publish, and display
                      your User Content in connection with operating and
                      providing the Service
                    </li>
                    <li>
                      Represent and warrant that you own or have the necessary
                      rights to your User Content
                    </li>
                    <li>
                      Represent that your User Content does not violate any
                      third-party rights or applicable laws
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Third-Party Services
              </h2>
              <p>
                Our Service may contain links to third-party websites, services,
                or integrations, including:
              </p>
              <ul className='list-disc space-y-1 pl-6'>
                <li>Google Sign-In and OAuth services</li>
                <li>Firebase Authentication</li>
                <li>Cloudflare Turnstile</li>
                <li>External links shared in content</li>
              </ul>
              <p className='mt-2'>
                These third-party services are not under our control, and we are
                not responsible for their content, privacy policies, or
                practices. Your use of third-party services is at your own risk
                and subject to their respective terms and conditions.
              </p>
            </section>

            {/* Service Availability */}
            <section className='space-y-4'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Service Availability
              </h2>

              <div className='space-y-3'>
                <div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
                    Modifications
                  </h3>
                  <p>
                    We reserve the right to modify, update, or discontinue any
                    aspect of the Service at any time, with or without notice.
                    This includes:
                  </p>
                  <ul className='mt-2 list-disc space-y-1 pl-6'>
                    <li>Adding, removing, or changing features</li>
                    <li>Updating design and user interface</li>
                    <li>
                      Changing pricing or introducing fees for certain features
                    </li>
                    <li>Modifying technical requirements</li>
                  </ul>
                  <p className='mt-2'>
                    We will not be liable to you or any third party for any
                    modification, suspension, or discontinuation of the Service.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-medium text-neutral-800 dark:text-neutral-200'>
                    Downtime
                  </h3>
                  <p>
                    We strive to maintain high availability, but the Service may
                    be temporarily unavailable due to:
                  </p>
                  <ul className='mt-2 list-disc space-y-1 pl-6'>
                    <li>Scheduled maintenance</li>
                    <li>Technical issues or server problems</li>
                    <li>Security updates</li>
                    <li>Force majeure events beyond our control</li>
                  </ul>
                  <p className='mt-2'>
                    We do not guarantee uninterrupted access to the Service and
                    are not liable for any downtime or unavailability.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination of Accounts */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Termination of Accounts
              </h2>
              <p>
                We reserve the right to suspend or terminate your account and
                access to the Service at our sole discretion, without notice or
                liability, for any reason, including but not limited to:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Violation of these Terms</li>
                <li>Engaging in prohibited activities</li>
                <li>Providing false or misleading information</li>
                <li>Inactivity for an extended period</li>
                <li>Requests from law enforcement or government agencies</li>
                <li>Technical or security concerns</li>
              </ul>
              <p className='mt-3'>
                You may also terminate your account at any time through your
                account settings or by contacting us. Upon termination:
              </p>
              <ul className='mt-2 list-disc space-y-1 pl-6'>
                <li>
                  Your right to access and use the Service will immediately
                  cease
                </li>
                <li>
                  Your data may be deleted in accordance with our Privacy Policy
                </li>
                <li>
                  Provisions of these Terms that by their nature should survive
                  termination will remain in effect
                </li>
              </ul>
            </section>

            {/* Disclaimer of Warranties */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Disclaimer of Warranties
              </h2>
              <p className='font-medium'>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p>
                To the fullest extent permitted by law, we disclaim all
                warranties, including but not limited to:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>
                  Implied warranties of merchantability, fitness for a
                  particular purpose, and non-infringement
                </li>
                <li>
                  Warranties regarding accuracy, reliability, or completeness of
                  content
                </li>
                <li>
                  Warranties that the Service will be uninterrupted, secure, or
                  error-free
                </li>
                <li>
                  Warranties regarding the results obtained from using the
                  Service
                </li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p className='mt-3'>
                We do not warrant that the Service will meet your requirements
                or that any errors will be corrected. Your use of the Service is
                at your sole risk.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Limitation of Liability
              </h2>
              <p className='font-medium'>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ILHAME.ID AND ITS
                AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND
                LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
                PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR
                ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              <p className='mt-2'>This limitation applies to:</p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Any errors, mistakes, or inaccuracies in the Service</li>
                <li>
                  Personal injury or property damage resulting from your use of
                  the Service
                </li>
                <li>
                  Unauthorized access to or use of our servers or any personal
                  information
                </li>
                <li>
                  Interruption or cessation of transmission to or from the
                  Service
                </li>
                <li>
                  Any bugs, viruses, or malicious code transmitted through the
                  Service
                </li>
                <li>Loss or damage to any content or data</li>
                <li>Any conduct or content of third parties on the Service</li>
              </ul>
              <p className='mt-3'>
                Our total liability to you for all claims arising from or
                relating to the Service shall not exceed the amount you paid us,
                if any, in the twelve (12) months preceding the claim, or $100,
                whichever is greater.
              </p>
              <p className='mt-2'>
                Some jurisdictions do not allow the exclusion of certain
                warranties or limitation of liability for incidental or
                consequential damages. In such jurisdictions, our liability will
                be limited to the maximum extent permitted by law.
              </p>
            </section>

            {/* Indemnification */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless ilhame.id, its
                affiliates, and their respective officers, directors, employees,
                agents, and licensors from and against any claims, liabilities,
                damages, losses, costs, expenses, or fees (including reasonable
                attorneys' fees) arising from or relating to:
              </p>
              <ul className='list-disc space-y-2 pl-6'>
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>
                  Your violation of any rights of another party, including
                  intellectual property rights
                </li>
                <li>Your User Content</li>
                <li>Any activity conducted through your account</li>
              </ul>
              <p className='mt-2'>
                We reserve the right to assume the exclusive defense and control
                of any matter subject to indemnification, at your expense. You
                agree to cooperate with our defense of such claims.
              </p>
            </section>

            {/* Changes to the Terms */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Changes to These Terms
              </h2>
              <p>
                We may revise these Terms from time to time at our sole
                discretion. Changes may be necessary to:
              </p>
              <ul className='list-disc space-y-1 pl-6'>
                <li>Reflect changes in our Service or business practices</li>
                <li>Comply with legal requirements</li>
                <li>Address security or technical issues</li>
                <li>Improve clarity or correct errors</li>
              </ul>
              <p className='mt-2'>When we make changes, we will:</p>
              <ul className='mt-2 list-disc space-y-1 pl-6'>
                <li>Update the "Effective Date" at the top of this page</li>
                <li>Post the revised Terms on this page</li>
                <li>
                  Notify you through the Service or via email for material
                  changes
                </li>
              </ul>
              <p className='mt-3'>
                Your continued use of the Service after changes are posted
                constitutes your acceptance of the revised Terms. If you do not
                agree to the changes, you must stop using the Service and may
                delete your account.
              </p>
            </section>

            {/* Governing Law */}
            <section className='space-y-3'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of Indonesia, without regard to its conflict of
                law provisions.
              </p>
              <p className='mt-2'>
                Any disputes arising from or relating to these Terms or the
                Service shall be subject to the exclusive jurisdiction of the
                courts located in Indonesia. You agree to submit to the personal
                jurisdiction of such courts.
              </p>
              <p className='mt-2'>
                If any provision of these Terms is found to be invalid or
                unenforceable, the remaining provisions will remain in full
                force and effect. Our failure to enforce any right or provision
                of these Terms will not constitute a waiver of such right or
                provision.
              </p>
            </section>

            {/* Contact Information */}
            <section className='space-y-3 border-t border-neutral-300 pt-6 dark:border-neutral-700'>
              <h2 className='text-2xl font-semibold text-neutral-900 dark:text-neutral-100'>
                Contact Information
              </h2>
              <p>
                If you have any questions, concerns, or feedback regarding these
                Terms of Service, please contact us:
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
              <p className='mt-4 text-sm'>
                Thank you for using ilhame.id. We appreciate your compliance
                with these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
};

export default TermsPage;
