"use client";

import { ClipLoader as Spinner } from "react-spinners";

interface ClipLoaderProps {
  size?: number;
  color?: string;
}

export function ClipLoader({ size = 35, color = "#3B82F6" }: ClipLoaderProps) {
  return <Spinner color={color} size={size} aria-label="Loading" />;
}
