
import React from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <AuthLayout>
      <Helmet>
        <title>Reset Password - Insight Writer AI</title>
      </Helmet>
      <div className="flex flex-col space-y-2 text-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below to reset your password
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
};

export default ResetPassword;
