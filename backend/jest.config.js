import { createDefaultPreset } from 'ts-jest/dist/index.js';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverage: true,
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>/src/'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
