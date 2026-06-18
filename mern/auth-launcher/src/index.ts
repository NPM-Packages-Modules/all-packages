export interface AuthLauncherKit {
  features: readonly string[];
}

export const authLauncher = {
  install(): AuthLauncherKit {
    return {
      features: ["JWT", "Refresh Tokens", "RBAC", "Email Verify", "Password Reset"],
    };
  },
};
