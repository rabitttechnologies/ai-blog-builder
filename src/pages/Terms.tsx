
import React from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms of Service | Insight Writer AI</title>
        <meta name="description" content="Review the terms of service for Insight Writer AI, including user rights and responsibilities when using our AI content creation platform." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
          <div className="container-wide text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
              Last updated: May 15, 2025
            </p>
          </div>
        </section>
        
        {/* Terms content */}
        <section className="py-12">
          <div className="container max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p>
                These Terms of Service ("Terms") govern your access to and use of the Insight Writer AI platform and services. Please read these Terms carefully before using our services.
              </p>
              
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our services.
              </p>
              
              <h2>Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. The updated version will be effective when it is posted on this page. Your continued use of our services after any changes indicates your acceptance of the modified Terms.
              </p>
              
              <h2>Account Registration</h2>
              <p>
                To use certain features of our services, you may need to create an account. You agree to provide accurate and complete information when creating your account and to keep your account information updated.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h2>User Conduct</h2>
              <p>
                You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul>
                <li>Use our services in any way that violates any applicable law or regulation</li>
                <li>Infringe the intellectual property rights of others</li>
                <li>Attempt to gain unauthorized access to our systems or user accounts</li>
                <li>Use our services to generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Use our services to generate content that promotes discrimination, bigotry, racism, hatred, harassment, or harm against any individual or group</li>
                <li>Use our services to generate spam, malware, or other malicious content</li>
                <li>Interfere with or disrupt the integrity or performance of our services</li>
                <li>Engage in any activity that could damage, disable, overburden, or impair our services</li>
              </ul>
              
              <h2>Content Generation and Ownership</h2>
              <p>
                Our services enable you to generate content using our AI technology. You are responsible for the content you generate and how you use it.
              </p>
              <p>
                You retain ownership of the content you generate using our services, subject to any rights we may have in our underlying technology and services.
              </p>
              <p>
                You grant us a non-exclusive, worldwide, royalty-free license to use, copy, modify, and display your content solely to provide and improve our services.
              </p>
              
              <h2>Intellectual Property</h2>
              <p>
                Our services and all content and materials included on or in our services, such as text, graphics, logos, images, software, and code, are the property of Insight Writer AI or our licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our services without our prior written consent, except as expressly provided in these Terms.
              </p>
              
              <h2>Subscriptions and Payments</h2>
              <p>
                Some of our services require payment of fees. You agree to pay all fees associated with your subscription plan.
              </p>
              <p>
                Subscription fees are billed in advance on a recurring basis depending on your plan (monthly, quarterly, or annually). You authorize us to charge your payment method for all fees incurred.
              </p>
              <p>
                All payments are non-refundable, except as expressly provided in these Terms or required by law.
              </p>
              
              <h2>Cancellation and Termination</h2>
              <p>
                You may cancel your subscription at any time through your account settings. Upon cancellation, your subscription will remain active until the end of your current billing period.
              </p>
              <p>
                We may terminate or suspend your account and access to our services at any time, without prior notice or liability, for any reason, including if you breach these Terms.
              </p>
              
              <h2>Disclaimer of Warranties</h2>
              <p>
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT OUR SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
              
              <h2>Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL INSIGHT WRITER AI, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF OUR SERVICES, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR OUR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO US FOR THE SERVICES GIVING RISE TO THE CLAIM DURING THE 12-MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.
              </p>
              
              <h2>Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Insight Writer AI, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from or relating to your use of our services, your content, or your violation of these Terms.
              </p>
              
              <h2>Governing Law</h2>
              <p>
                These Terms and your use of our services shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law.
              </p>
              <p>
                Any legal action or proceeding arising out of or relating to these Terms or our services shall be brought exclusively in the federal or state courts located in San Francisco, California, and you consent to the personal jurisdiction of such courts.
              </p>
              
              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: legal@insightwriter.ai<br />
                Address: 123 Innovation Way, Suite 400, San Francisco, CA 94107, United States
              </p>
            </div>
            
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/60">
                  Have questions about our terms?
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

export default Terms;
