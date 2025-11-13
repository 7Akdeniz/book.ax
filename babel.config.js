module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@features': './src/features',
            '@components': './src/components',
            '@navigation': './src/navigation',
            '@services': './src/services',
            '@store': './src/store',
            '@utils': './src/utils',
            '@types': './src/types',
            '@assets': './assets',
          },
        },
      ],
      // 'react-native-reanimated/plugin', // Temporär deaktiviert wegen SDK 54 Kompatibilitätsproblemen
    ],
  };
};
