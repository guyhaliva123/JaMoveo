"use client";

import { ReactNode } from "react";
// Remove duplicate WebSocketProvider import
// import { WebSocketProvider } from "@/lib/websocket-context";

export default function ClientProviders({ children }: { children: ReactNode }) {
  // Just return children without wrapping in a duplicate WebSocketProvider
  return <>{children}</>;
}
