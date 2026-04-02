import * as localAuthentication from "expo-local-authentication";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useLocalAuthentication = () => {
  const [isLogginEnabled, setIsLoginEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [isLogged, setIsLogged] = useState(false);

  const { t } = useTranslation("common");
  const { t: terr } = useTranslation("errors");

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
      console.log(terr("auth.errorChecking"), e);
      setIsLoginEnabled(false);
    }
  };

  const toggleLogin = async (enabled: boolean) => {
    try {
      if (!enabled) {
        const authenticated = await authenticate();
        if (!authenticated.success) {
          return { success: false, message: terr("auth.authenticationFailed") };
        }
      }
      await setItemAsync("mustLogin", enabled ? "true" : "");
      setIsLoginEnabled(enabled);
      return { success: true };
    } catch (e) {
      return { success: false, message: terr("auth.errorToggling") };
    }
  };

  const checkSupport = async () => {
    try {
      const supported = await localAuthentication.hasHardwareAsync();
      setIsSupported(supported);
    } catch (e) {
      setIsSupported(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const enrolled = await localAuthentication.isEnrolledAsync();
      setIsEnrolled(enrolled);
    } catch (e) {
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
          message: terr("auth.errorCheckingSupport"),
        };
      }

      if (!isEnrolled) {
        return {
          success: false,
          message: terr("auth.errorCheckingEnrollment"),
        };
      }

      const result = await localAuthentication.authenticateAsync({
        promptMessage: t("auth.promptMessage"),
        fallbackLabel: t("auth.fallbackLabel"),
      });
      setIsLogged(result.success);
      return { success: result.success };
    } catch (e) {
      return { success: false, message: terr("auth.errorAuth") };
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
