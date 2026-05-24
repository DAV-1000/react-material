import { createContext } from "react";
import { User } from "../types";

export interface AuthContextType {
  user: User | null;
  userLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);