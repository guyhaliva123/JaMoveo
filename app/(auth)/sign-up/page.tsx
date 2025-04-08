import SignupForm from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
