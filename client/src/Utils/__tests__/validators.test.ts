import { INITIAL_METADATA_SNIPPET } from '../constants';
import { metadataValidator } from '../validators';
import metadataJson from './validators.test.meta.json';

describe('Validate metadata', () => {
  test('Initial metadata snippet contains no errors', () => {
    // Arrange && Act
    const result = metadataValidator(INITIAL_METADATA_SNIPPET);

    // Assert
    expect(result.metadata).toBe(INITIAL_METADATA_SNIPPET);
    expect(result.errors).toStrictEqual([]);
  });

  test('Valid metadata snippet contains no errors', () => {
    // Arrange
    const meta = JSON.stringify(metadataJson);

    // Act
    const result = metadataValidator(meta);

    // Assert
    expect(result.metadata).toBe(meta);
    expect(result.errors).toStrictEqual([]);
  });

  test('Invalid json contains syntax error', () => {
    // Arrange && Act
    const result = metadataValidator('{,');

    // Assert
    expect(result.metadata).toBe('{,');
    expect(result.errors[0].message).toStrictEqual('Syntax Error: Unexpected token , in JSON at position 1');
  });

  test.each`
    removedKey         | expectedError
    ${'core:datatype'} | ${{ message: "must have required property 'core:datatype'", instancePath: '/global' }}
    ${'core:version'}  | ${{ message: "must have required property 'core:version'", instancePath: '/global' }}
  `('Missing global fields contains errors', ({ removedKey, expectedError }) => {
    // Arrange
    const metaJson = JSON.parse(JSON.stringify(metadataJson));
    delete metaJson.global[removedKey];
    const meta = JSON.stringify(metaJson);

    // Act
    const result = metadataValidator(meta);

    // Assert
    expect(result.metadata).toBe(meta);
    expect(result.errors[0].message).toBe(expectedError.message);
    expect(result.errors[0].instancePath).toBe(expectedError.instancePath);
  });

  test.each`
    removedKey             | expectedError
    ${'core:sample_start'} | ${{ message: "must have required property 'core:sample_start'", instancePath: '/captures/0' }}
  `('Missing required capture fields contains errors', ({ removedKey, expectedError }) => {
    // Arrange
    const metaJson = JSON.parse(JSON.stringify(metadataJson));
    delete metaJson.captures[0][removedKey];
    const meta = JSON.stringify(metaJson);

    // Act
    const result = metadataValidator(meta);

    // Assert
    expect(result.metadata).toBe(meta);
    expect(result.errors[0].message).toBe(expectedError.message);
    expect(result.errors[0].instancePath).toBe(expectedError.instancePath);
  });

  test.each`
    removedKey             | expectedError
    ${'core:sample_start'} | ${{ message: "must have required property 'core:sample_start'", instancePath: '/annotations/0' }}
    ${'core:sample_count'} | ${{ message: "must have required property 'core:sample_count'", instancePath: '/annotations/0' }}
  `('Missing required annotations fields contains errors', ({ removedKey, expectedError }) => {
    // Arrange
    const metaJson = JSON.parse(JSON.stringify(metadataJson));
    delete metaJson.annotations[0][removedKey];
    const meta = JSON.stringify(metaJson);

    // Act
    const result = metadataValidator(meta);

    // Assert
    expect(result.metadata).toBe(meta);
    expect(result.errors[0].message).toBe(expectedError.message);
    expect(result.errors[0].instancePath).toBe(expectedError.instancePath);
  });
});
