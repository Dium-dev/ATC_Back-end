/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Does everything 'clearMocks' does, but also replaces every mock implementation with an
  // empty function before each test, returning undefined.
  resetMocks: true,

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    'node_modules',
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
  ],

  modulePaths: [
    '<rooDir>/src',
    '<rootDir>',
  ],

  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // Reset the module registry before running each individual test
  resetModules: true,

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/src/',
    '<rootDir>',
  ],
};

export default config;
