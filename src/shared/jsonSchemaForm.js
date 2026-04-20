export function enrichSchema(propSchema, propName, parentSchema) {
  return {
    ...propSchema,
    isRequired: parentSchema?.required?.includes(propName) || false,
  };
}

export function getDefaultValue(schema, { arrayItem = false } = {}) {
  if (schema?.default !== undefined) {
    return structuredClone(schema.default);
  }
  switch (schema?.type) {
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      return {};
    case 'string':
      return arrayItem ? '' : null;
    case 'number':
    case 'integer':
      return arrayItem ? 0 : null;
    default:
      return null;
  }
}

export function buildNestedValidationErrorMap(errors) {
  const result = {};
  if (!errors) {
    return result;
  }
  Object.keys(errors).forEach((key) => {
    const dotIdx = key.indexOf('.');
    if (dotIdx < 0) {
      return;
    }
    const head = key.slice(0, dotIdx);
    const tail = key.slice(dotIdx + 1);
    if (!result[head]) {
      result[head] = {};
    }
    result[head][tail] = errors[key];
  });
  return result;
}
