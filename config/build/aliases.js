module.exports = (grunt) => {
  return {
    default: [
      'init',
      'run',
      'webpack:main',
    ],

    init: [
      'exec:data_init',
      'copy',
      'vendor',
    ],

    vendor: [
      'replace:latlon',
      'replace:ratchet',
      'replace:ratchet_fonts',
      'replace:fontello_fonts',
      'replace:photoswipe',
    ],

    run: [
      'jst',
    ],

    // Development run
    update: [
      'run',
      'webpack:main',
    ],

    // Development update
    dev: [
      'init',
      'run',
      'webpack:dev',
    ],

    // Development run
    'dev:update': [
      'run',
      'webpack:dev',
    ],

    test: [
      'karma:local',
    ],
    'test:sauce': [
      'karma:sauce',
    ],

    // Cordova set up
    cordova: [
      // prepare www source
      'default',

      // init cordova source
      // add www source to cordova
      'exec:cordova_init',

      'exec:cordova_clean_www',
      'exec:cordova_copy_dist',
      // 'cordova:_prepAndroid', // !!!!! use this to switch between android and ios
      'replace:cordova_config',
      'replace:cordova_build',
      'exec:cordova_add_platforms',
    ],


    /**
     * Updates cordova project - use after tinkering with src or congig
     */
    'cordova:update': [
      // update www
      'exec:cordova_clean_www',
      'exec:cordova_copy_dist',
      'replace:cordova_config',
      'replace:cordova_build',
      'exec:cordova_rebuild',
    ],

    'cordova:android': [
      'prompt:keystore',
      // new
      'cordova:_prepAndroid',
      'replace:cordova_config',
      'replace:cordova_build',
      'exec:cordova_android_build',

      // old
      'cordova:_prepAndroidOld',
      'replace:cordova_config',
      'replace:cordova_build',
      'exec:cordova_android_build_old',
    ],


    /**
     * Sets up the right SDK version and package ID for the config generator
     */
    'cordova:_prepAndroid': () => {
      grunt.option('android', true);
    },
    'cordova:_prepAndroidOld': () => {
      grunt.option('android', true);
      grunt.option('oldversion', true);
    },
  };
};
