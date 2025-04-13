import { createContext, ReactNode, useContext } from "react";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Simplified mock version of auth context
type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: {
    mutate: (credentials: any) => void;
    isPending: boolean;
  };
  logoutMutation: {
    mutate: () => void;
    isPending: boolean;
  };
  registerMutation: {
    mutate: (credentials: any) => void;
    isPending: boolean;
  };
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  loginMutation: {
    mutate: (credentials) => console.log("Login attempt", credentials),
    isPending: false
  },
  logoutMutation: {
    mutate: () => console.log("Logout attempt"),
    isPending: false
  },
  registerMutation: {
    mutate: (credentials) => console.log("Register attempt", credentials),
    isPending: false
  }
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  return (
    <AuthContext.Provider
      value={{
        user: null,
        isLoading: false,
        error: null,
        loginMutation: {
          mutate: (credentials) => {
            console.log("Login attempt", credentials);
            toast({
              title: "Login Demo",
              description: "This is a demo. Authentication is not fully implemented.",
            });
          },
          isPending: false
        },
        logoutMutation: {
          mutate: () => {
            console.log("Logout attempt");
            toast({
              title: "Logout Demo",
              description: "This is a demo. Authentication is not fully implemented.",
            });
          },
          isPending: false
        },
        registerMutation: {
          mutate: (credentials) => {
            console.log("Register attempt", credentials);
            toast({
              title: "Register Demo",
              description: "This is a demo. Authentication is not fully implemented.",
            });
          },
          isPending: false
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}