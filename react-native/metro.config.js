const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Configuración adicional para resolver módulos
  config.resolver = {
    ...config.resolver,
    alias: {
      "@": "./src",
      "@screens": "./src/screens",
      "@components": "./src/components",
      "@api": "./src/api",
      "@types": "./src/types",
      "@utils": "./src/utils",
    },
  };

  return config;
})();
