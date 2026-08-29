"use client";
import { useEffect, useMemo, useState } from "react";
import {
  PublicClientApplication,
  AccountInfo,
  RedirectRequest,
  AuthenticationResult,
} from "@azure/msal-browser";
import { bouncer } from "@/actions/bouncer";

const msalClientId = process.env.NEXT_PUBLIC_MSAL_CLIENT_ID ?? "";

const msalInstance = msalClientId
  ? new PublicClientApplication({
      auth: {
        clientId: msalClientId,
        authority:
          process.env.NEXT_PUBLIC_MSAL_AUTHORITY ??
          "https://login.microsoftonline.com/common",
        redirectUri: process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI ?? "/",
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
      },
    })
  : null;

const TOKEN_REFRESH_INTERVAL = 30 * 1000 * 60;

export default function useAuth(pathname: string | null) {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [auth, setAuth] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [token, setToken] = useState("");

  const user_ref = useMemo(
    () => account?.username?.toLocaleLowerCase() ?? "",
    [account],
  );
  const name = useMemo(() => account?.name ?? "", [account]);

  const getToken = async (acc: AccountInfo): Promise<string | null> => {
    if (!msalInstance) return null;
    try {
      const response: AuthenticationResult =
        await msalInstance.acquireTokenSilent({
          scopes: ["User.read"],
          account: acc,
          forceRefresh: true,
        });
      return response.accessToken;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("interaction_required")
      ) {
        await msalInstance.loginRedirect({ scopes: ["User.read"] });
      }
      return null;
    }
  };

  const refreshAuthState = async (currentAccount: AccountInfo) => {
    const newToken = await getToken(currentAccount);
    if (newToken) {
      setToken(newToken);
      const isAuthorized = await bouncer(
        newToken,
        currentAccount.username?.toLowerCase() || "",
        pathname || "",
      );
      setAuth(isAuthorized);
    } else if (msalInstance) {
      setAuth(false);
      setToken("");
      setAccount(null);
      await msalInstance.logoutRedirect();
    }
  };

  useEffect(() => {
    if (pathname == null) return;

    const checkAuth = async () => {
      try {
        if (!msalInstance) {
          setToken("dev-token");
          setAccount({
            username: "dev@localhost",
            name: "Local Developer",
          } as AccountInfo);
          setAuth(true);
          return;
        }

        await msalInstance.initialize();
        const currentAccount = msalInstance.getAllAccounts()[0];

        if (currentAccount) {
          await refreshAuthState(currentAccount);
          setAccount(currentAccount);
        } else {
          const response = await msalInstance.handleRedirectPromise();
          if (response?.account) {
            await refreshAuthState(response.account);
            setAccount(response.account);
          } else {
            await login();
          }
        }
      } catch (error) {
        console.error("Error during MSAL initialization:", error);
      } finally {
        setLoaded(true);
      }
    };

    void checkAuth();

    const refreshInterval = setInterval(async () => {
      const currentAccount = msalInstance?.getAllAccounts()[0];
      if (currentAccount) {
        await refreshAuthState(currentAccount);
      }
    }, TOKEN_REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [pathname]);

  const login = async () => {
    if (!msalInstance) return;
    const loginRequest: RedirectRequest = { scopes: ["User.read"] };
    try {
      await msalInstance.loginRedirect(loginRequest);
    } catch {
      try {
        await msalInstance.loginPopup(loginRequest);
      } catch (error) {
        console.error("Login Failed: ", error);
      }
    }
  };

  const logout = async () => {
    if (!msalInstance) {
      setAuth(false);
      setToken("");
      setAccount(null);
      return;
    }
    try {
      await msalInstance.logoutRedirect();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { name, user_ref, auth, loaded, token, logout };
}
