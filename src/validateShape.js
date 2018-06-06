import cloneDeep from 'lodash/cloneDeep';

const validateShape = (_feature, validateFunc) => {
  const feature = cloneDeep(_feature);
  const newErrors = validateFunc(feature);
  if (newErrors && newErrors.length > 0) feature.properties.errors = newErrors;
  else delete feature.properties.errors;
  return feature;
};

export default validateShape;
