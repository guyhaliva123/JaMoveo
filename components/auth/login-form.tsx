"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

// Connect to your Socket.IO server
const socket = io("http://localhost:3000"); // adjust the URL/port as needed

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [song, setSong] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.error) {
      console.error("Login failed:", result.error);
      return;
    }

    if (result.success) {
      router.push("/");
      router.refresh();
    }
  };

  useEffect(() => {
    // Listen to the event that beamed the song details
    socket.on("songSelected", (songData) => {
      setSong(songData);
    });
    // Cleanup the listener on component unmount
    return () => {
      socket.off("songSelected");
    };
  }, []);

  return (
    <div>
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-gray-300"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Log in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      {song && (
        <div className="mt-4 text-center text-gray-600">
          Selected Song: {JSON.stringify(song)}
        </div>
      )}
    </div>
  );
}
