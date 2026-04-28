export const getColorByPlatform = (
  platform: "youtube" | "tiktok" | "facebook" | "instagram" | "generic",
) => {
  let color = "#6366F1";

  switch (platform) {
    case "youtube":
      color = "#FF0000";
      break;
    case "tiktok":
      color = "#000000";
      break;
    case "facebook":
      color = "#1877F2";
      break;
    case "instagram":
      color = "#E1306C";
      break;
    default:
      color = "#6366F1";
  }
  return color;
};
