import React from "react";
import type { Metadata } from "next";
import Header from "@/components/shared/Header";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "StatementFlow | Bank Statement to CSV",
  description: "Turn a batch of bank statements into one clean transactions CSV.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui, viewport-fit=cover"
        />
      </head>
      <body>
        <Header />
        <div
          className="page"
          style={{
            height: "90vh",
            overflowY: "auto",
            position: "fixed",
            top: "10vh",
            width: "100vw",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
