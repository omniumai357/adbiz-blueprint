
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "./useAuthActions";

export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const authActions = useAuthActions();

  const handleSignUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    const result = await authActions.signUp(email, password, metadata);
    if (result.success) {
      navigate("/auth", { state: { message: result.message } });
    }
    return result;
  };

  const handleSignIn = async (email: string, password: string) => {
    const result = await authActions.signIn(email, password);
    if (result.success) {
      navigate("/");
    }
    return result;
  };

  const handleSignOut = async () => {
    const result = await authActions.signOut();
    if (result.success) {
      navigate("/");
    }
    return result;
  };

  const handleResetPassword = async (email: string) => {
    const result = await authActions.resetPassword(email);
    if (result.success) {
      navigate("/auth", { state: { message: result.message } });
    }
    return result;
  };

  const handleUpdatePassword = async (newPassword: string) => {
    const result = await authActions.updatePassword(newPassword);
    if (result.success) {
      navigate("/");
    }
    return result;
  };

  return {
    handleSignUp,
    handleSignIn,
    handleSignOut,
    handleResetPassword,
    handleUpdatePassword
  };
};
