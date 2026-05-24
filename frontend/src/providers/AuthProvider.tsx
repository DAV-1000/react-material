import React, { useEffect, useMemo, useState } from "react";
import { User } from "../types";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchUser = async () => {
            try {
                const res = await fetch("/.auth/me");

                if (cancelled) return;

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.clientPrincipal ?? null);
                } else {
                    setUser(null);
                }
            } catch {
                if (!cancelled) {
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setUserLoading(false);
                }
            }
        };

        fetchUser();

        return () => {
            cancelled = true;
        };
    }, []);

    const contextValue = useMemo(
        () => ({
            user,
            userLoading,
        }),
        [user, userLoading]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};