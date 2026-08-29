"use client";
import dynamic from "next/dynamic";

const HomePageComponent = dynamic(() => import("@/components/HomePage"), {
  ssr: false,
});

export default function HomePage() {
  return <HomePageComponent />;
}
