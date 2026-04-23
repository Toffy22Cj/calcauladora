module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Plugin para alias de rutas
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            "@screens": "./src/screens",
            "@components": "./src/components",
            "@api": "./src/api",
            "@types": "./src/types",
            "@utils": "./src/utils",
          },
        },
      ],
      // Plugin para React Native Reanimated (si se usa en el futuro)
      // 'react-native-reanimated/plugin',
    ],
  };
};
