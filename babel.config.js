module.exports = {
  presets: [
    [
      `@babel/preset-env`,
      {
        modules: false,
        },
    ],
  ],
  plugins: ["@babel/plugin-syntax-dynamic-import"],
  env: {
    test: {
      presets: [
        [`@babel/preset-env`,
          {
            targets: {
              node: `current`,
            },
          },
        ],
      ],
    },
  },
};
