/**
 * Deployment definition ID pattern.
 */
export const deploymentIDPattern = /^[a-z][a-z-_]*[a-z]+$/;

/**
 * Validator implementation to check assignments (e.g. environment variables, ports, etc.) defined in the editor.
 *
 * @param value raw input value to validate
 */
export const assignmentPatternValidator = (value?: string): boolean => {

  if (!value) {
    return true;
  }

  return value.split(/\r?\n/)
    .every(line => /^.+[->].+$/.test(line));
}
