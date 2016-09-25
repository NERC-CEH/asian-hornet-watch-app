'use strict';

const BUILD = 'dist/_build/';

const pkg = require('../../package.json');

module.exports = (grunt) => {
  return {
    // Fix double define problem
    latlon: {
      src: ['dist/_build/vendor/latlon/js/latlon-ellipsoidal.js',
        'dist/_build/vendor/latlon/js/latlon-spherical.js'],
      overwrite: true,
      replacements: [
        {
          from: 'if (typeof module != \'undefined\' && module.exports) ' +
          'module.exports.Vector3d = Vector3d;',
          to: '',
        },
        {
          from: 'if (typeof define == \'function\' && define.amd) ' +
          'define([], function() { return Vector3d; });',
          to: '',
        },
        {
          from: 'if (typeof define == \'function\' && define.amd) ' +
          'define([\'Dms\'], function() { return LatLon; });',
          to: '',
        },
      ],
    },
    // Fix iOS 8 readonly broken IndexedDB
    indexedDBShim: {
      src: ['dist/_build/vendor/IndexedDBShim/js/IndexedDBShim.js'],
      overwrite: true,
      replacements: [
        {
          from: 'shim(\'indexedDB\', idbModules.shimIndexedDB);',
          to: 'shim(\'_indexedDB\', idbModules.shimIndexedDB);',
        },
        {
          from: 'shim(\'IDBKeyRange\', idbModules.IDBKeyRange);',
          to: 'shim(\'_IDBKeyRange\', idbModules.IDBKeyRange);',
        },
      ],
    },

    // ratchet's modal functionality is not compatable with spa routing
    ratchet: {
      src: ['dist/_build/vendor/ratchet/js/ratchet.js'],
      overwrite: true,
      replacements: [{
        from: 'getModal(event)',
        to: 'null',
      }],
    },

    // need to remove Ratchet's default fonts to work with fontello ones
    ratchet_fonts: {
      src: ['dist/_build/vendor/ratchet/css/ratchet.css'],
      dest: BUILD + 'styles/ratchet.css',
      replacements: [
        {
          from: /font-family: Ratchicons;/g,
          to: '',
        },
        {
          from: /src: url\(\"\.\.\/fonts.*;/g,
          to: '',
        }],
    },

    // moving the stylesheet to root makes the path different
    fontello_fonts: {
      src: ['src/common/vendor/fontello/css/icons.css'],
      dest: `${BUILD}styles/icons.css`,
      replacements: [
        {
          from: /\.\.\/font\//g,
          to: '\.\/font\/',
        }],
    },

    // Cordova config changes
    cordova_config: {
      src: [
        'config/cordova.xml',
      ],
      dest: 'dist/cordova/config.xml',
      replacements: [
        {
          from: /\{ID\}/g, // string replacement
          to: () => pkg.id,
        },
        {
          from: /\{APP_VER\}/g, // string replacement
          to: () => pkg.version,
        },
        {
          from: /\{APP_TITLE\}/g,
          to: () => pkg.title,
        },
        {
          from: /\{APP_DESCRIPTION\}/g,
          to: () => pkg.description,
        },
        {
          from: /\{BUNDLE_VER\}/g,
          to: () => pkg.build,
        },
        {
          from: /\{MIN_SDK\}/g,
          to() {
            return grunt.option('oldversion') ? 16 : 19;
          },
        },
        {
          from: /\{ANDROID_BUNDLE_VER\}/g,
          to() {
            let version = pkg.version.replace(/\./g, '') + pkg.build;
            if (!grunt.option('oldversion')) {
              version += 8;
            }
            return version;
          },
        },
      ],
    },
  };
};
