"use client";
import { useContext, useEffect, useState } from "react";
import { authContext } from "@/contexts/authContext";
import useAuth from "@/actions/useAuth";
import AccessDeniedComponent from "./AccessDenied";
import LoaderComponent from "./Loader";

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [path, setPath] = useState<string | null>(null);
  useEffect(() => setPath(window.location?.pathname?.slice(1)), []);
  const contextData = useAuth(path);

  return (
    <authContext.Provider value={contextData}>{children}</authContext.Provider>
  );
};

export const Content: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loaded, auth } = useContext(authContext);
  return loaded ? (
    auth ? (
      children
    ) : (
      <AccessDeniedComponent />
    )
  ) : (
    <LoaderComponent type="authenticate" />
  );
};
