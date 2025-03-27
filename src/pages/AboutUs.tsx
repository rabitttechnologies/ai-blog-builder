
import React from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Building2, Users, Trophy, Heart, Lightbulb } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Us | Insight Writer AI</title>
        <meta name="description" content="Learn about the Insight Writer AI team, our mission, and the story behind the most powerful AI blogging platform helping content creators rank #1." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container-wide text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Our Mission: Empowering Content Creators
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
              We're building the future of content creation where AI and human creativity combine to produce outstanding results.
            </p>
          </div>
        </section>
        
        {/* Our story section */}
        <section className="py-20">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-foreground/80 mb-6">
                  Insight Writer AI was founded in 2023 by a team of content creators, SEO specialists, and AI researchers with a shared vision: to democratize high-quality content creation.
                </p>
                <p className="text-lg text-foreground/80 mb-6">
                  After struggling with the challenge of consistently producing high-ranking content, our founders realized that AI could transform the content creation process without sacrificing quality.
                </p>
                <p className="text-lg text-foreground/80">
                  Today, Insight Writer AI is used by thousands of bloggers, content marketers, and businesses to create content that not only ranks well but truly engages readers.
                </p>
              </div>
              <div className="bg-blue-50 p-8 rounded-2xl">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <img 
                    src="/placeholder.svg" 
                    alt="Insight Writer AI Team" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                These core principles guide everything we do at Insight Writer AI.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">User-Centered</h3>
                <p className="text-foreground/70">
                  We design every feature with you in mind, focusing on what truly helps content creators succeed.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-foreground/70">
                  We're committed to providing the best AI writing tools in the market, constantly refining our algorithms.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                <p className="text-foreground/70">
                  We believe in honest, ethical business practices and transparent communication with our users.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-foreground/70">
                  We're always looking ahead, pioneering new ways to combine AI and human creativity.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team section */}
        <section className="py-20">
          <div className="container-wide">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                The passionate people behind Insight Writer AI
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Morgan",
                  role: "CEO & Co-Founder",
                  bio: "AI enthusiast with 15+ years in content marketing and SEO.",
                },
                {
                  name: "Sam Chen",
                  role: "CTO & Co-Founder",
                  bio: "AI researcher and engineer with expertise in NLP and machine learning.",
                },
                {
                  name: "Jordan Lee",
                  role: "Head of Product",
                  bio: "Former content strategist obsessed with creating user-friendly tools.",
                },
                {
                  name: "Taylor Kim",
                  role: "Lead AI Engineer",
                  bio: "NLP specialist with a passion for making AI accessible to everyone.",
                },
                {
                  name: "Casey Rivera",
                  role: "Head of Customer Success",
                  bio: "Helping users get the most out of our platform every day.",
                },
                {
                  name: "Jamie Patel",
                  role: "Content Strategist",
                  bio: "SEO expert who ensures our AI produces truly valuable content.",
                },
              ].map((member, index) => (
                <div key={index} className="glass p-6 rounded-xl flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-blue-100 mb-4"></div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-foreground/70">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Join us CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="container-wide text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              We're always looking for talented individuals who share our passion for AI and content creation.
            </p>
            <a href="/careers" className="inline-flex items-center justify-center h-12 px-8 font-medium bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              View Open Positions
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
