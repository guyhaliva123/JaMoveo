"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
// Remove duplicate WebSocketProvider import
// import { WebSocketProvider } from "@/lib/websocket-context";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
