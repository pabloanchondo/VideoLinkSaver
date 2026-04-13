import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type TYPE = "info" | "success" | "error";

export const showToast = (
  title: string = "Info",
  message: string,
  type: TYPE = "success",
) => {
  Toast.show({
    type: getType(type),
    title,
    textBody: message,
  });
};

const getType = (type: TYPE): ALERT_TYPE => {
  switch (type) {
    case "info":
      return ALERT_TYPE.INFO;
    case "success":
      return ALERT_TYPE.SUCCESS;
    case "error":
      return ALERT_TYPE.DANGER;
    default:
      return ALERT_TYPE.INFO;
  }
};
