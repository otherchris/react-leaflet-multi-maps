import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep';
import cleanProps from './cleanProps';

// updateShapes called by onCreated callback in Leaflet map
//
// e.layer represents the newly created vector layer
const updateShapes = (props, map, e) => {
  const p = cloneDeep(props);
  const geoJSON = e.layer.toGeoJSON();
  switch (geoJSON.geometry.type) {
  case 'Polygon':
    p.features.push(geoJSON);
    map.removeLayer(e.layer);
    break;
  case 'Point':
    p.points.push(geoJSON);
    map.removeLayer(e.layer);
    // p.newCircleCenter = geoJSON;
    // p.newCircleRadius = 0.1;
    // p.makeCircleOn = true;
    break;
  default:
    break;
  }
  cleanProps(p, props.onShapeChange, noop);
};

export default updateShapes;

