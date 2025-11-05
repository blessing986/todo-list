export default {
  expo: {
    name: "mzb_audiophile",
    slug: "mzb_audiophile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mzb.audiophile",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.mzb.audiophile",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      convexUrl:
        process.env.EXPO_PUBLIC_CONVEX_URL ||
        "https://little-butterfly-666.convex.cloud",
      eas: {
        projectId: "ad002c86-1312-4539-ba45-1455814d1839", // Add this line
      },
    },
  },
};
