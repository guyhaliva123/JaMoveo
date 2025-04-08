"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signup } from "@/actions/signup";
import { useRouter } from "next/navigation";
import { Instrument } from "@prisma/client";
import ClipLoader from "react-spinners/ClipLoader";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signup({
        email,
        password,
        instrument: instrument as Instrument,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        router.push("/login");
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={`w-full border-gray-300 ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={`w-full border-gray-300 ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
          </div>
          <div className="space-y-2">
            <Select
              value={instrument}
              onValueChange={setInstrument}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your instrument" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem
                  value="DRUMS"
                  className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Drums
                </SelectItem>
                <SelectItem
                  value="GUITAR"
                  className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Guitar
                </SelectItem>
                <SelectItem
                  value="BASS"
                  className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Bass
                </SelectItem>
                <SelectItem
                  value="SAXOPHONE"
                  className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Saxophone
                </SelectItem>
                <SelectItem
                  value="KEYBOARD"
                  className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Keyboard
                </SelectItem>
                <SelectItem
                  value="VOCALS"
                  className="hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Vocals
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <ClipLoader size={20} color="#ffffff" />
                <span>Signing up...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </CardContent>
      {!isLoading && (
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
