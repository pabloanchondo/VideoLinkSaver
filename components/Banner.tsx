import React from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

export default function AdBanner() {
  // const adUnitId = TestIds.BANNER;
  const adUnitId = "ca-app-pub-8421586383850459/6275001671";

  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />
    </View>
  );
}
