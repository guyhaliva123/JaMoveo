import SignupForm from "@/components/auth/signup-form";
import { checkAdminExists } from "@/actions/admin";

export default async function SignupPage() {
  const adminExists = await checkAdminExists();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100">
      <div className="w-full max-w-md">
        <SignupForm showRoleSelect={adminExists} />
      </div>
    </div>
  );
}
