import L from 'leaflet';
import noop from 'lodash/noop';
import remove from 'lodash/remove';
import map from 'lodash/map';
import range from 'lodash/range';
import reverse from 'lodash/reverse';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import cleanProps from './cleanProps';
import getBounds from './getBounds';
import updateShapes from './updateShapes';

const validCoordsArray = (arr) =>
  arr &&
  arr.length &&
  arr.length === 2 &&
  arr[0] < 180 &&
  arr[0] > -180 &&
  arr[1] < 90 &&
  arr[1] > -90;

const validLatlngObject = (c) => typeof c.lat === 'number' && typeof c.lng === 'number';
const validGeoJSONPoint = (c) => c.type === 'Point' && validCoordsArray(c.coordinates);
const validGeoJSONPointFeature = (c) => c.type === 'Feature' && validGeoJSONPoint(c.geometry);

export const onLocationSelect = (props, loc) => {
  const { b, f } = loc.gmaps.geometry.viewport;
  const b1 = L.latLng(f.b, b.b);
  const b2 = L.latLng(f.f, b.f);

  const p = cloneDeep(props);
  p.center = {
    type: 'Feature',
    properties: {
      bounds: L.latLngBounds(b1, b2),
    },
    geometry: {
      coordinates: [loc.location.lng, loc.location.lat],
      type: 'Point',
    },
  };
  p.points.push(p.center);

  cleanProps(p, props.onShapeChange, noop);

  props.bindPoint.leafletElement.fitBounds(L.latLngBounds(b1, b2));
};

// input a geoJSON point geometry
export const makeCenterLeaflet = (c) => {
  if (c.lat && c.lng) return L.latLng(c);
  if (validGeoJSONPointFeature(c)) {
    const coords = c.geometry.coordinates;
    return L.latLng(coords[1], coords[0]);
  }
  if (validGeoJSONPoint(c)) return L.latLng(c.coordinates[1], c.coordinates[0]);
  return {};
};

export const makePoint = (cee) => {
  const c = cloneDeep(cee);
  if (!c) return { type: 'Point', coordinates: [-85.751528, 38.257222] };
  if (validCoordsArray(c)) return { type: 'Point', coordinates: reverse(c) };
  if (validLatlngObject(c)) return { type: 'Point', coordinates: [c.lng, c.lat] };
  if (validGeoJSONPoint(c)) return c;
  if (validGeoJSONPointFeature(c)) return c.geometry;
  return { type: 'Point', coordinates: [-85.751528, 38.257222] };
};

export const generateIcon = (html) => new L.divIcon({
  className: 'my-div-icon',
  html,
});

export const indexByKey = (arr, key) => {
  let index = -1;
  map(arr, (val, ind) => {
    if (val.properties && (val.properties.key === key)) index = ind;
  });
  return index;
};

export const polygonArrayToProp = (polys) => map(polys, (poly) => {
  // Don't rechange polys coming from map edit
  if (poly.geometry.type === 'Polygon') {
    return poly;
  }
  // Can't do anything with a non-trivial MultiPolygon
  if (poly.geometry.coordinates[0].length > 1) {
    const p = poly.properties;
    p.noEdit = true;
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: flatten(poly.geometry.coordinates),
      },
      properties: p,
    };
  }
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: flatten(poly.geometry.coordinates),
    },
    properties: poly.properties,
  };
});

export const removeListener = (props, next) => {
  const p = cloneDeep(props);
  p.remove = next;
  cleanProps(p, props.onShapeChange, noop);
};

export const removeHandler = (props) => {
  const p = cloneDeep(props);
  p.remove = !props.remove;
  cleanProps(p, props.onShapeChange, noop);
};

export const makePoints = (arr) => map(arr, makePoint);

// TODO: Get rid of this nasty hack
export const incForce = (obj) => {
  const o = cloneDeep(obj);
  if (obj.force) {
    o.force = obj.force + 1;
    return o;
  }
  o.force = 1;
  return o;
};

export const removeAllFeatures = (props) => {
  const p = cloneDeep(props);
  remove(p.features, () => true);
  remove(p.points, () => true);
  cleanProps(p, props.onShapeChange, noop);

};

export const zoomToShapes = (props, _map) => {
  if (_map && _map.leafletElement) {
    const { features, points } = props;
    if (features.length > 0 || points.length > 0) {
      const bounds = getBounds(features, points);
      _map.leafletElement.fitBounds(bounds);
    }
  }
};
