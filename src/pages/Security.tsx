
import React from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Shield, Lock, Server, Database, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const Security = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Security | Insight Writer AI</title>
        <meta name="description" content="Learn about the security measures and data protection protocols we implement at Insight Writer AI to keep your content and personal information safe." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container-wide text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Your Security Is Our Priority
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              At Insight Writer AI, we implement industry-leading security measures to protect your data and content. Learn how we keep your information safe.
            </p>
          </div>
        </section>
        
        {/* Security overview */}
        <section className="py-20">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Security Approach</h2>
                <p className="text-lg text-foreground/80 mb-6">
                  We've built Insight Writer AI with security at its core. Our platform employs multiple layers of protection to ensure the confidentiality, integrity, and availability of your data.
                </p>
                <p className="text-lg text-foreground/80 mb-6">
                  From encrypted data storage to secure access controls, we implement best practices at every level of our infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <a href="#security-measures">Explore Our Security Measures</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/security/whitepaper">Download Security Whitepaper</a>
                  </Button>
                </div>
              </div>
              <div className="bg-blue-50 p-8 rounded-2xl">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="Security Infrastructure" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Security measures */}
        <section id="security-measures" className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Security Measures</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                How we protect your data at every level
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Data Encryption</h3>
                <p className="text-foreground/70">
                  All data is encrypted both in transit and at rest using industry-standard encryption protocols (TLS 1.3, AES-256). Your content is never stored in plaintext.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Infrastructure</h3>
                <p className="text-foreground/70">
                  Our platform is hosted on ISO 27001 and SOC 2 Type II certified cloud providers with redundant systems and regular security audits.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Access Controls</h3>
                <p className="text-foreground/70">
                  Multi-factor authentication, role-based access control, and least privilege principles protect your account and content from unauthorized access.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Data Protection</h3>
                <p className="text-foreground/70">
                  Regular backups, data isolation, and strict data handling procedures ensure your content is protected against loss or unauthorized disclosure.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Compliance</h3>
                <p className="text-foreground/70">
                  We adhere to GDPR, CCPA, and other relevant privacy regulations. Our security program includes regular compliance assessments and updates.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Continuous Monitoring</h3>
                <p className="text-foreground/70">
                  24/7 monitoring, intrusion detection, and automated threat intelligence help us identify and respond to potential security incidents.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Compliance */}
        <section className="py-20">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Compliance & Certifications</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Our commitment to industry standards and compliance
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "GDPR Compliant", logo: "/placeholder.svg" },
                { name: "CCPA Compliant", logo: "/placeholder.svg" },
                { name: "ISO 27001", logo: "/placeholder.svg" },
                { name: "SOC 2 Type II", logo: "/placeholder.svg" }
              ].map((cert, index) => (
                <div key={index} className="flex flex-col items-center glass p-6 rounded-xl">
                  <div className="w-20 h-20 mb-4 bg-gray-100 rounded-lg">
                    <img 
                      src={cert.logo} 
                      alt={`${cert.name} certification`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-center font-medium">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Security FAQ */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Security FAQ</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Common questions about our security practices
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {[
                  {
                    question: "Who can access my content?",
                    answer: "Only you and users you explicitly grant access to can view or edit your content. Our internal systems operate on a strict need-to-know basis, and employee access to customer data is limited, logged, and audited."
                  },
                  {
                    question: "How is my personal information protected?",
                    answer: "We collect only the information necessary to provide our services. All personal information is encrypted and stored according to industry best practices. We never sell your personal information to third parties."
                  },
                  {
                    question: "What happens to my content if I delete my account?",
                    answer: "When you delete your account, we permanently delete your content from our active systems within 30 days. Backup archives that may contain your data are cycled and completely purged within 90 days."
                  },
                  {
                    question: "Do you perform security testing?",
                    answer: "Yes, we conduct regular security assessments including penetration testing, vulnerability scanning, and code reviews. We also maintain a bug bounty program to encourage responsible disclosure of security vulnerabilities."
                  },
                  {
                    question: "How do you handle security incidents?",
                    answer: "We have a comprehensive incident response plan. In the event of a security incident affecting your data, we will notify you promptly, provide details about the impact, and inform you of the steps we're taking to resolve the issue."
                  }
                ].map((faq, index) => (
                  <details key={index} className="glass p-6 rounded-xl group">
                    <summary className="list-none flex justify-between cursor-pointer font-medium text-lg">
                      {faq.question}
                      <span className="text-primary transition-transform group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </span>
                    </summary>
                    <div className="mt-4 text-foreground/70">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Security reporting */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium mb-6">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Security Vulnerability Reporting
                </div>
                <h2 className="text-3xl font-bold mb-6">Found a Security Issue?</h2>
                <p className="text-xl mb-8">
                  We take security vulnerabilities seriously. If you've discovered a potential security issue, please let us know immediately.
                </p>
                <Button className="bg-white text-blue-600 hover:bg-white/90" size="lg" asChild>
                  <a href="mailto:security@insightwriter.ai">Report a Vulnerability</a>
                </Button>
              </div>
              <div className="bg-white/10 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Responsible Disclosure</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-1" />
                    <span>Provide detailed information about the vulnerability</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-1" />
                    <span>Include steps to reproduce the issue</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-1" />
                    <span>Allow us reasonable time to address the issue before public disclosure</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-1" />
                    <span>Do not exploit the vulnerability or access others' data</span>
                  </li>
                </ul>
                <p className="mt-6 text-white/80">
                  We're committed to working with security researchers and will acknowledge your reports within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Security;
