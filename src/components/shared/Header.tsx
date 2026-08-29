"use client";
import React, { useContext, useState } from "react";
import { authContext } from "@/contexts/authContext";
import { Button } from "primereact/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/example", label: "Example" },
];

export default function Header() {
  const { loaded, name, logout } = useContext(authContext);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <div style={{ height: "10vh" }} />
      <header className="header-container">
        <button
          className="menu-toggle-btn"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          type="button"
        >
          ☰
        </button>
        {loaded && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <h4 style={{ color: "white", margin: 0 }}>{name || "Not Signed In"}</h4>
            <Button
              icon="pi pi-sign-out"
              style={{
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={() => {
                void logout();
              }}
            />
          </div>
        )}
        <a href="/" className="header-wrap">
          <span style={{ color: "white", fontWeight: 600 }}>Logo</span>
        </a>
      </header>
      {isPanelOpen && (
        <nav className="nav-panel">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
