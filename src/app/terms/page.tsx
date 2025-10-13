
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
      <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: 09/10/2025</p>

      <div className="prose prose-sm prose-invert mt-8 max-w-none dark:prose-invert">
        <h2 className="mt-8 text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p>By accessing and using ImageResizerNow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

        <h2 className="mt-8 text-2xl font-semibold">2. Description of Service</h2>
        <p>ImageResizerNow is a web-based image processing service that allows users to:</p>
        <ul>
          <li>Resize images to custom dimensions or preset sizes</li>
          <li>Convert images between different formats (JPG, PNG, WebP)</li>
          <li>Compress images to reduce file size</li>
          <li>Process multiple images in batch operations</li>
          <li>Download processed images individually or as ZIP files</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">3. User Accounts and Registration</h2>
        <p>While you may use our service without creating an account, registered users enjoy additional benefits including:</p>
        <ul>
          <li>Higher daily processing limits</li>
          <li>Cloud storage for processed images</li>
          <li>Usage tracking and analytics</li>
          <li>Priority customer support</li>
        </ul>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

        <h2 className="mt-8 text-2xl font-semibold">4. Acceptable Use Policy</h2>
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Upload, process, or distribute illegal, harmful, or inappropriate content</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon intellectual property rights of others</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use the service for commercial purposes beyond the scope of your subscription</li>
          <li>Upload images containing malware, viruses, or other harmful code</li>
          <li>Resell or redistribute the service without permission</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">5. Image Processing and Data Handling</h2>
        <p><strong>Privacy and Security:</strong> We process your images using industry-standard security measures. Images are processed automatically without human review.</p>
        <p><strong>Data Retention:</strong> All uploaded images are automatically deleted from our servers within 24 hours of processing. We do not store your images permanently.</p>
        <p><strong>Processing Location:</strong> Images may be processed on our servers or in your browser (client-side processing) depending on your settings and the features used.</p>

        <h2 className="mt-8 text-2xl font-semibold">6. Subscription Plans and Billing</h2>
        <p>We offer the following subscription tiers:</p>
        <ul>
            <li><strong>Free Plan:</strong> 5 images per day, basic features</li>
            <li><strong>Starter Plan:</strong> 50 images per day, cloud storage</li>
            <li><strong>Pro Plan:</strong> 200 images per day, advanced features</li>
        </ul>
        <p>Subscription fees are billed in advance and are non-refundable except as required by law. You may cancel your subscription at any time.</p>

        <h2 className="mt-8 text-2xl font-semibold">7. Intellectual Property Rights</h2>
        <p>You retain all rights to your uploaded images. By using our service, you grant us a limited, non-exclusive license to process your images solely for the purpose of providing the service.</p>
        <p>The ImageResizerNow service, including its design, functionality, and underlying technology, is protected by intellectual property laws and remains our exclusive property.</p>

        <h2 className="mt-8 text-2xl font-semibold">8. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, ImageResizerNow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the service.</p>
        <p>Our total liability to you for any claims arising from or related to the service shall not exceed the amount you paid us in the 12 months preceding the claim.</p>

        <h2 className="mt-8 text-2xl font-semibold">9. Service Availability</h2>
        <p>We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend the service for maintenance, updates, or technical issues.</p>
        <p>We reserve the right to modify or discontinue the service at any time with reasonable notice to users.</p>

        <h2 className="mt-8 text-2xl font-semibold">10. Termination</h2>
        <p>We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including if you breach these Terms of Service.</p>
        <p>Upon termination, your right to use the service will cease immediately, and we may delete your account and any associated data.</p>

        <h2 className="mt-8 text-2xl font-semibold">11. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes via email or through the service interface.</p>
        <p>Your continued use of the service after changes become effective constitutes acceptance of the new terms.</p>

        <h2 className="mt-8 text-2xl font-semibold">12. Governing Law</h2>
        <p>These Terms of Service shall be governed by and construed in accordance with the laws of the United Republic of Tanzania, without regard to conflict of law principles.</p>

        <h2 className="mt-8 text-2xl font-semibold">13. Contact Information</h2>
        <p>If you have any questions about these Terms of Service, please contact us at:</p>
        <address className="not-italic">
          Email: <a href="mailto:imageresizernow2025@gmail.com">imageresizernow2025@gmail.com</a><br/>
          Address: CongoTower, Dar Es Salaam Tanzania<br/>
          Phone: +255656029304
        </address>
      </div>
    </div>
  );
}
