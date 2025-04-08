import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
