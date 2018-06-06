import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import noop from 'lodash/noop';
import reduce from 'lodash/reduce';
import omit from 'lodash/omit';
import cleanProps from './cleanProps';
import { cleanPoly } from './clean';
import { indexByKey, areaAccumulator, incForce } from './MapHelpers';

// Sometimes clicking a polygon opens/closes for editing, sometimes it
// deletes the poly
export const clickFeature = (props, e) => {
  if (!props.edit) return;
  if (props.remove) {
    const s = cloneDeep(props);
    const key = e.layer.options.uuid;
    const features = filter(s.features, (feat) => key !== feat.properties.key);
    s.features = cloneDeep(features);
    cleanProps(s, props.onShapeChange, noop);
  } else {
    const key = e.layer.options.uuid;
    const p = cloneDeep(props);
    const { features } = p;
    const index = indexByKey(features, key);
    const editable = features[index].properties.editable || false;
    if (editable) features[index] = cleanPoly(e.layer.toGeoJSON(), props.maxAreaEach, props.validateFunc);
    features[index].properties.editable = !editable;
    p.openFeature = !editable;
    p.features = features;
    p.totalArea = reduce(features, areaAccumulator, 0);
    p.legendProps = omit(props, 'legendProps');
    cleanProps(incForce(p), props.onShapeChange, noop);
  }
};

export const clickPoint = (props, e) => {
  if (!props.edit) return;
  if (props.remove) {
    const key = e.target.options.uuid;
    const points = filter(props.points, (point) => key !== point.properties.key);
    const s = cloneDeep(props);
    s.points = points;
    s.legendProps = omit(s, 'legendProps');
    s.remove = false;
    cleanProps(s, props.onShapeChange, noop);
  } else {
    const makeCircle = !!props.makeCircleOn;
    if (!makeCircle) {
      const s = cloneDeep(props);
      const newCircleCenter = e.target.toGeoJSON();
      s.makeCircleOn = true;
      s.newCircleCenter = newCircleCenter;
      cleanProps(s, props.onShapeChange, noop);
    }
  }
};

