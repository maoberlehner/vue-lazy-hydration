import babel from 'rollup-plugin-babel';

export default {
  external: [`vue`],
  plugins: [
    babel(),
  ],
};
