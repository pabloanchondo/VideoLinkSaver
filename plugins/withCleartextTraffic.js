const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withCleartextTraffic(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;

    if (!manifest.manifest.application) {
      manifest.manifest.application = [{}];
    }

    manifest.manifest.application[0].$[
      "android:usesCleartextTraffic"
    ] = "true";

    return config;
  });
};