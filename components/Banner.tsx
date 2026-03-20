import React from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

export default function AdBanner() {
  // const adUnitId = TestIds.BANNER;
  const adUnitId = "ca-app-pub-8421586383850459/6275001671";

  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        height: isLoaded ? undefined : 0,
        overflow: "hidden",
      }}
    >
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          console.log("Ad loaded");
          setIsLoaded(true);
        }}
        onAdFailedToLoad={(error) => {
          console.log("Ad failed:", error);
        }}
      />
    </View>
  );
}
