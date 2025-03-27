
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary py-12">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/enterprise" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Enterprise
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} Insight Writer AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
