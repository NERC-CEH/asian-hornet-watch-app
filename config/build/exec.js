require('dotenv').config({ silent: true }); // get local environment variables from .env
// var keystorePassword = grunt.config('keystore');

module.exports = function (grunt) {
  return {
    data_init: {
      command() {
        return 'cd src/info/species/data && ' +
          'python make.py species &&' +
          'mkdir -p ../../../../dist/_build &&' +
          'mv *data.json ../../../../dist/_build &&' +
          'rm -rf __pycache__ && ' +
          'rm -f *.pyc && ' +
          'rm -f warnings.log';
      },
      stdout: true,
    },
    cordova_init: {
      command: './node_modules/.bin/cordova create dist/cordova',
      stdout: true,
    },
    cordova_clean_www: {
      command: 'rm -R -f dist/cordova/www/* && rm -f dist/cordova/config.xml',
      stdout: true,
    },
    cordova_rebuild: {
      command: 'cd dist/cordova/ && ../../node_modules/.bin/cordova prepare ios android',
      stdout: true,
    },
    cordova_copy_dist: {
      command: 'cp -R dist/main/* dist/cordova/www/',
      stdout: true,
    },
    cordova_add_platforms: {
      // android@6.4.0 because of https://github.com/ionic-team/ionic/issues/13857#issuecomment-381744212
      // ios@4.4.0 because of https://github.com/ionic-team/ionic/issues/12849#issuecomment-328472880
      command: 'cd dist/cordova && ../../node_modules/.bin/cordova platforms add ios@4.4.0 android@6.4.0',
      stdout: true,
    },
    /**
     * $ANDROID_KEYSTORE must be set up to point to your android certificates keystore
     */
    cordova_android_build: {
      command() {
        const pass = grunt.config('keystore-password');
        return `cd dist/cordova && 
            mkdir -p dist && 
            ../../node_modules/.bin/cordova --release build android && 
            cd platforms/android/build/outputs/apk/release &&
            jarsigner -sigalg SHA1withRSA -digestalg SHA1 -keystore ${process.env.KEYSTORE} -storepass ${pass} android-release-unsigned.apk irecord &&
            zipalign 4 android-release-unsigned.apk main.apk && 
            mv -f main.apk ../../../../../../dist/`;
      },

      stdout: true,
      stdin: true,
    },
  }
};
