import * as localAuthentication from "expo-local-authentication";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";

export const useLocalAuthentication = () => {
  const [isLogginEnabled, setIsLoginEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    handleInit();
  }, []);

  const handleInit = async () => {
    await checkSupport();
    await checkEnrollment();
    await checkMustLogin();
  };

  const checkMustLogin = async () => {
    try {
      const mustLogin = await getItemAsync("mustLogin");
      setIsLoginEnabled(!!mustLogin);
    } catch (e) {
      console.log("Error checking local authentication enrollment", e);
      setIsLoginEnabled(false);
    }
  };

  const toggleLogin = async (enabled: boolean) => {
    try {
      if (!enabled) {
        const authenticated = await authenticate();
        if (!authenticated.success) {
          return { success: false, message: "Authentication failed" };
        }
      }
      await setItemAsync("mustLogin", enabled ? "true" : "");
      setIsLoginEnabled(enabled);
      return { success: true };
    } catch (e) {
      console.log("Error toggling local authentication", e);
      return { success: false, message: "Error toggling local authentication" };
    }
  };

  const checkSupport = async () => {
    try {
      const supported = await localAuthentication.hasHardwareAsync();
      setIsSupported(supported);
    } catch (e) {
      console.log("Error checking local authentication support", e);
      setIsSupported(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const enrolled = await localAuthentication.isEnrolledAsync();
      setIsEnrolled(enrolled);
    } catch (e) {
      console.log("Error checking local authentication enrollment", e);
      setIsEnrolled(false);
    }
  };

  const authenticate = async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      if (!isSupported) {
        return {
          success: false,
          message: "Local authentication not supported",
        };
      }

      if (!isEnrolled) {
        return {
          success: false,
          message: "No biometric methods enrolled",
        };
      }

      const result = await localAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access your videos",
        fallbackLabel: "Use Passcode",
      });
      setIsLogged(result.success);
      return { success: result.success };
    } catch (e) {
      console.log("Error during local authentication", e);
      return { success: false, message: "Error during local authentication" };
    }
  };

  return {
    isSupported,
    isEnrolled,
    checkSupport,
    checkEnrollment,
    authenticate,
    isLogginEnabled,
    toggleLogin,
    checkMustLogin,
    isLogged,
  };
};
