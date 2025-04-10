import React from "react";
import Link from "next/link";

const LoginForm: React.FC = () => {
  return (
    <div className="text-sm text-gray-500">
      Don&apos;t have an account?{" "}
      <Link href="/sign-up" className="text-blue-500 hover:underline">
        Sign up
      </Link>
    </div>
  );
};

export default LoginForm;
