
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: 09/10/2025</p>

      <div className="prose prose-sm prose-invert mt-8 max-w-none dark:prose-invert">
        <h2 className="mt-8 text-2xl font-semibold">Our Privacy Commitment</h2>
        <p>At ImageResizerNow, we are committed to protecting your privacy and ensuring the security of your personal information and images. This Privacy Policy explains how we collect, use, and protect your information when you use our service.</p>

        <h2 className="mt-8 text-2xl font-semibold">1. Information We Collect</h2>
        <h3 className="mt-4 text-xl font-semibold">1.1 Images You Upload</h3>
        <p>When you use our service, you may upload images for processing. We collect and temporarily store these images solely for the purpose of providing our resizing and conversion services.</p>
        
        <h3 className="mt-4 text-xl font-semibold">1.2 Account Information</h3>
        <p>If you create an account, we collect:</p>
        <ul>
          <li>Name and email address</li>
          <li>Account preferences and settings</li>
          <li>Usage statistics and processing history</li>
          <li>Subscription and billing information</li>
        </ul>
        
        <h3 className="mt-4 text-xl font-semibold">1.3 Technical Information</h3>
        <p>We automatically collect certain technical information, including:</p>
        <ul>
          <li>IP address and browser information</li>
          <li>Device type and operating system</li>
          <li>Usage patterns and service performance data</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">2. How We Use Your Information</h2>
        <h3 className="mt-4 text-xl font-semibold">2.1 Image Processing</h3>
        <p>Your uploaded images are processed automatically by our systems to provide the resizing, conversion, and compression services you request. No human ever views your images during processing.</p>

        <h3 className="mt-4 text-xl font-semibold">2.2 Service Improvement</h3>
        <p>We use aggregated, anonymized data to:</p>
        <ul>
          <li>Improve our service performance and reliability</li>
          <li>Develop new features and functionality</li>
          <li>Optimize processing algorithms</li>
          <li>Analyze usage patterns and trends</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">2.3 Account Management</h3>
        <p>For registered users, we use your information to:</p>
        <ul>
          <li>Provide personalized service and recommendations</li>
          <li>Track usage against your subscription limits</li>
          <li>Send important service updates and notifications</li>
          <li>Process payments and manage subscriptions</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">3. Data Retention and Deletion</h2>
        <p><strong>Automatic Image Deletion:</strong> All uploaded images are automatically deleted from our servers within 24 hours of processing. We do not store your images permanently.</p>

        <h3 className="mt-4 text-xl font-semibold">3.1 Account Data</h3>
        <p>Account information is retained for as long as your account is active. You may request deletion of your account and associated data at any time.</p>

        <h3 className="mt-4 text-xl font-semibold">3.2 Usage Analytics</h3>
        <p>Aggregated, anonymized usage data may be retained indefinitely for service improvement purposes. This data cannot be linked to individual users.</p>

        <h2 className="mt-8 text-2xl font-semibold">4. Information Sharing and Disclosure</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information or images to third parties.</p>

        <h3 className="mt-4 text-xl font-semibold">4.1 Service Providers</h3>
        <p>We may share information with trusted third-party service providers who assist us in:</p>
        <ul>
          <li>Cloud storage and processing infrastructure</li>
          <li>Payment processing and billing</li>
          <li>Email delivery and communication</li>
          <li>Analytics and performance monitoring</li>
        </ul>
        <p>All service providers are bound by strict confidentiality agreements.</p>

        <h3 className="mt-4 text-xl font-semibold">4.2 Legal Requirements</h3>
        <p>We may disclose information if required by law or to:</p>
        <ul>
          <li>Comply with legal processes or government requests</li>
          <li>Protect our rights, property, or safety</li>
          <li>Protect the rights, property, or safety of our users</li>
          <li>Investigate fraud or security issues</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">5. Data Security</h2>
        <p>We implement industry-standard security measures to protect your information:</p>
        <ul>
            <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
            <li><strong>Access Controls:</strong> Strict access controls limit who can access your data</li>
            <li><strong>Regular Audits:</strong> Regular security audits and vulnerability assessments</li>
            <li><strong>Secure Infrastructure:</strong> Hosted on secure, enterprise-grade cloud infrastructure</li>
            <li><strong>Monitoring:</strong> Continuous monitoring for security threats and anomalies</li>
        </ul>
        <p><strong>Note:</strong> While we implement strong security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>

        <h2 className="mt-8 text-2xl font-semibold">6. Your Rights and Choices</h2>
        <h3 className="mt-4 text-xl font-semibold">6.1 Access and Control</h3>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account and associated data</li>
          <li>Export your data in a portable format</li>
          <li>Opt out of marketing communications</li>
        </ul>

        <h3 className="mt-4 text-xl font-semibold">6.2 Processing Preferences</h3>
        <p>You can choose to:</p>
        <ul>
            <li>Use client-side processing for maximum privacy</li>
            <li>Opt out of usage analytics</li>
            <li>Control cookie preferences</li>
            <li>Manage notification settings</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">7. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar technologies to:</p>
        <ul>
            <li>Remember your preferences and settings</li>
            <li>Analyze service usage and performance</li>
            <li>Provide personalized experiences</li>
            <li>Ensure service security and prevent fraud</li>
        </ul>
        <p>You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect service functionality.</p>

        <h2 className="mt-8 text-2xl font-semibold">8. International Data Transfers</h2>
        <p>Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.</p>

        <h2 className="mt-8 text-2xl font-semibold">9. Children's Privacy</h2>
        <p>Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.</p>

        <h2 className="mt-8 text-2xl font-semibold">10. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
        <ul>
            <li>Posting the updated policy on our website</li>
            <li>Sending email notifications to registered users</li>
            <li>Displaying prominent notices in the service interface</li>
        </ul>
        <p>Your continued use of the service after changes become effective constitutes acceptance of the updated Privacy Policy.</p>

        <h2 className="mt-8 text-2xl font-semibold">11. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
        <address className="not-italic">
            <strong>General Inquiries</strong><br />
            Email: <a href="mailto:imageresizernow2025@gmail.com">imageresizernow2025@gmail.com</a><br/>
            Phone: +255656029304
        </address>
        <address className="mt-4 not-italic">
            <strong>Data Protection Officer</strong><br />
            Email: <a href="mailto:imageresizernow2025@gmail.com">imageresizernow2025@gmail.com</a><br/>
            Address: CongoTower, Dar Es Salaam Tanzania
        </address>

        <h2 className="mt-8 text-2xl font-semibold">12. Compliance</h2>
        <p>This Privacy Policy is designed to comply with applicable data protection laws, including:</p>
        <ul>
          <li>General Data Protection Regulation (GDPR)</li>
          <li>California Consumer Privacy Act (CCPA)</li>
          <li>Children's Online Privacy Protection Act (COPPA)</li>
          <li>Other applicable regional privacy laws</li>
        </ul>
      </div>
    </div>
  );
}
