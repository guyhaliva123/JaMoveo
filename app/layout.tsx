// app/layout.tsx (server component)
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import ClientProviders from "./ClientProviders"; // or "../lib/ClientProviders"
import { WebSocketProvider } from "@/lib/websocket-context";

export const metadata: Metadata = {
  title: "JaMoveo",
  description: "Rehearsal app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* EVERYTHING under /app is now inside <SocketProvider> */}
        <WebSocketProvider>
          <ClientProviders>{children}</ClientProviders>
        </WebSocketProvider>
      </body>
    </html>
  );
}
