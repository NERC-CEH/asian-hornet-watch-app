module.exports = {
  main: {
    files: [
      // IMAGES
      {
        src: 'src/common/images/*', dest: 'dist/main/images/',
        expand: true, flatten: true,
      },
      // FONTS
      {
        src: 'src/common/vendor/fontello/font/*', dest: 'dist/main/font/',
        expand: true, flatten: true,
      },
    ],
  },
};
