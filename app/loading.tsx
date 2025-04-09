import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-pink-100">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-xl font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
}
