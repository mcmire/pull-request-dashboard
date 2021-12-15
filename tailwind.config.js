module.exports = {
  mode: 'jit',
  content: ['./src/components/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        'inner-darker': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
