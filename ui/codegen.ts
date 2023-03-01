import type { CodegenConfig } from '@graphql-codegen/cli';
 
const config: CodegenConfig = {
  schema: '../api/schema.graphql',
  documents: './src/**/*.ts',
  generates: {
    './graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular'],
      config: {
        addExplicitOverride: true,
      }
    }
  }
};

export default config;