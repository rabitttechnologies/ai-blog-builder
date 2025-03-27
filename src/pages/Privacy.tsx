
import React from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy | Insight Writer AI</title>
        <meta name="description" content="Learn about how Insight Writer AI collects, uses, and protects your personal information." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
          <div className="container-wide text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Last updated: May 15, 2025
            </p>
          </div>
        </section>
        
        {/* Policy content */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p>
                At Insight Writer AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              
              <h2>Information We Collect</h2>
              
              <h3>Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide when using our services, including:
              </p>
              <ul>
                <li>Name, email address, and contact information</li>
                <li>Billing information and payment details</li>
                <li>Account credentials</li>
                <li>User preferences and settings</li>
                <li>Communications with our team</li>
              </ul>
              
              <h3>Content Data</h3>
              <p>
                We collect the content you create, upload, or input into our platform, including:
              </p>
              <ul>
                <li>Articles, blog posts, and other text content</li>
                <li>Keywords and topic information</li>
                <li>Content preferences and settings</li>
              </ul>
              
              <h3>Usage Information</h3>
              <p>
                We automatically collect certain information about your device and how you interact with our services:
              </p>
              <ul>
                <li>Device information (browser type, operating system, IP address)</li>
                <li>Usage patterns and feature interaction</li>
                <li>Time spent on the platform and pages visited</li>
                <li>Referring websites or sources</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>
                We use the collected information for various purposes:
              </p>
              <ul>
                <li>To provide, maintain, and improve our services</li>
                <li>To process transactions and manage your account</li>
                <li>To personalize your experience and content recommendations</li>
                <li>To communicate with you about your account, updates, and support</li>
                <li>To analyze usage patterns and optimize our platform</li>
                <li>To protect against fraud and unauthorized access</li>
                <li>To comply with legal obligations</li>
              </ul>
              
              <h2>How We Share Your Information</h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul>
                <li>With service providers who perform services on our behalf</li>
                <li>With your consent or at your direction</li>
                <li>To comply with legal obligations</li>
                <li>In connection with a business transaction (merger, acquisition, etc.)</li>
                <li>To protect our rights, privacy, safety, or property</li>
              </ul>
              <p>
                We do not sell your personal information to third parties.
              </p>
              
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
              </p>
              
              <h2>Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul>
                <li>Right to access and receive a copy of your data</li>
                <li>Right to rectification of inaccurate information</li>
                <li>Right to erasure of your data</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided below.
              </p>
              
              <h2>Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              
              <h2>Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under 16 years of age. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child under 16, we will promptly delete that information.
              </p>
              
              <h2>International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We take steps to ensure that your information receives an adequate level of protection in the countries where we process it.
              </p>
              
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p>
                Email: privacy@insightwriter.ai<br />
                Address: 123 Innovation Way, Suite 400, San Francisco, CA 94107, United States
              </p>
            </div>
            
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/60">
                  Need to contact us about your privacy?
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/contact">
                    Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
