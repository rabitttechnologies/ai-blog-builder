
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const AuthButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => navigate('/login')}
      >
        Log in
      </Button>
      <Button 
        size="sm"
        onClick={() => navigate('/signup')}
      >
        Start Free Trial
      </Button>
    </div>
  );
};

export default AuthButtons;
