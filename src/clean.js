import cloneDeep from 'lodash/cloneDeep';
import uuid from 'uuid';
import validateShape from './validateShape';

export const cleanPoly = (poly, maxAreaEach, validateFunc) => {
  let p = cloneDeep(poly);

  if (!p.properties) p.properties = {};
  // Add area

  // Check max area
  if (p.properties.area > maxAreaEach) p.properties.tooLarge = true;

  // Tag with id if not already tagged
  if (!p.properties.key) p.properties.key = uuid.v4();

  // Fix if 'Polygon' type
  if (p.geometry.type === 'Polygon') {
    p.geometry.type = 'MultiPolygon';
    p.geometry.coordinates = [poly.geometry.coordinates];
  }

  // Add errors if needed
  return validateShape(p, validateFunc);
};

export const cleanPoint = (point) => {
  const p = cloneDeep(point);

  // Tag with id if not already tagged
  if (!p.properties.key) p.properties.key = uuid.v4();

  return p;
};
