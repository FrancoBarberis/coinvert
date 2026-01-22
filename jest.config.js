
// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  // Si usás paths en tsconfig (ej: "@/components/Button")
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

    // Ignorar/Mockear estilos y assets
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/test/__mocks__/fileMock.js',

    // Mocks para Next que suelen fallar en Jest
    '^next/router$': '<rootDir>/test/__mocks__/nextRouterMock.js',
    '^next/image$': '<rootDir>/test/__mocks__/nextImageMock.js',
  },

  // Si usás libs ESM que necesitan transformarse (agregá aquí los nombres)
  transformIgnorePatterns: [
    'node_modules/(?!(nanoid|uuid|your-esm-lib)/)', // opcional
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testPathIgnorePatterns: ['/node_modules/', '/.next/'],

  // Opcional: patrones de test
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],

};
``
