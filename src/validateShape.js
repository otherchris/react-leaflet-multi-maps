import cloneDeep from 'lodash/cloneDeep';

const validateShape = (_feature, validateFunc) => {
  const feature = cloneDeep(_feature);
  return feature;
};

export default validateShape;
