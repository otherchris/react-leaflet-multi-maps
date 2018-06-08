import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import merge from 'lodash/merge';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import {
  Map,
  TileLayer,
  GeoJSON,
} from 'react-leaflet';
import './leaflet.css';
import './leaflet.draw.css';
import FindPoint from './geosuggest';
import EditTools from './EditTools';
import { clickFeature } from './clickShape';
import onTileSet from './onTileSet';
import {
  makeCenterLeaflet,
  removeAllFeatures,
  removeHandler,
  generateIcon,
  polygonArrayToProp,
  zoomToShapes,
} from './MapHelpers';
import defaultIcon from './defaultIcon';
import cleanProps from './cleanProps';
import points from './points';
import './main.css';

const defaultCenter = {
  type: 'Point',
  coordinates: [-85.751528, 38.257222],
};

const style = {
  color: 'green',
  fill: true,
  fillColor: 'green',
  fillOpacity: 0.45,
};
const deleteStyle = {
  color: 'red',
  fill: true,
  fillColor: 'red',
  fillOpacity: 0.45,
};
const errorStyle = {
  color: 'red',
  fillColor: 'red',
  dashArray: '1,5',
  fillOpacity: '0.1',
};
const hoveredStyle = {
  color: 'blue',
  fill: true,
  fillOpacity: 0.45,
};

const RemovePolyBanner = (
  <div className="alert alert-info" role="alert">
    Click a shape to remove.
  </div>
);

const MapComponent = (props) => {
  const {
    tileLayerProps, height,
  } = props;
  merge(style, props.style);
  merge(hoveredStyle, props.hoveredStyle);

  // Create Leaflet GeoJSON components from features in container state
  const features = map(polygonArrayToProp(props.features), (result) => {
    const p = result.properties;
    const thisStyle = cloneDeep(style);
    if (p.errors && p.errors.length && p.errors.length > 0) {
      merge(thisStyle, errorStyle);
    }
    if (props.edit && props.remove) {
      merge(thisStyle, deleteStyle);
    }
    return (
      <GeoJSON
        style={thisStyle}
        data={result}
        key={uuid.v4()}
        uuid={p.key || uuid.v4()}
        editable={p.editable}
        onClick={clickFeature.bind(this, props)}
        onMouseOut={(e) => { e.layer.setStyle(thisStyle); }}
        onMouseOver={(e) => { e.layer.setStyle(hoveredStyle); }}
      >
      </GeoJSON>
    );
  });
  const removePolyBanner = props.edit && props.remove
    ? RemovePolyBanner
    : '';
  const zoomButton = props.features.length > 0 || props.points.length > 0 ? (
    <button type="button" className="zoom-button btn btn-secondary btn-sm"
      onClick={zoomToShapes.bind(this, props, props.bindPoint)}
    >
      Zoom to shapes
    </button>
  ) : '';
  const removeAllButton = ((props.features.length > 0 || props.points.length > 0) && props.edit) ? (
    <button
      type="button"
      className="btn btn-danger btn-sm"
      onClick={removeAllFeatures.bind(this, props)}
    >
      Remove all shapes
    </button>
  ) : '';
  const satButton = (
    <button type="button" className="btn btn-secondary btn-sm maps-tiles"
      id="sat" onClick={onTileSet.bind(this, props)}
    >
     Satellite View
    </button>
  );
  const streetButton = (
    <button type="button" className="btn btn-secondary btn-sm maps-tiles"
      id="street" onClick={onTileSet.bind(this, props)}
    >
     Street View
    </button>
  );
  const openFeatureMessage = (props.openFeature) ? (
    <div>
      Click the polygon again to finish editing
    </div>
  ) : '';
  const rH = () => { removeHandler(props); };
  if (props.bindPoint &&
    isEqual(props.center, defaultCenter)) {
    zoomToShapes(props, props.bindPoint);
  }
  cleanProps(props, props.onShapeChange, noop);
  const center = (props.center && props.center.lat) ?
    makeCenterLeaflet(props.center) :
    makeCenterLeaflet(defaultCenter);
  return (
    <div>
      {openFeatureMessage}
      <Map
        ref={m => { props.setBindPoint(m, props.bindPointIndex); }}
        style={{ height }}
        minZoom = {3}
        maxZoom = {18}
        center = {center}
        zoom = {props.zoom || 9}
        onMoveend={props.onMove}
      >
        {removePolyBanner}
        <FindPoint {...props} />
        <TileLayer
          url={tileLayerProps.url}
          attribution={tileLayerProps.attribution}
          subdomains= {tileLayerProps.subdomains}
        />
        <EditTools {...props} removeHandler={rH} />
        {features}
        <div className="map-btn-group btn-group">
          {zoomButton}
          {removeAllButton}
          {props.tileLayerProps.url === 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' ?
            satButton :
            streetButton
          }
        </div>
        <div className="map-remove-poly-banner">
          {removePolyBanner}
        </div>
      </Map>
      <div className="map-below-map">
        {props.legendComponent(props)}
        {props.maxArea < props.totalArea ? 'Area too large, cannot save' : ''}
      </div>
    </div>
  );
};

MapComponent.propTypes = {
  bindPoint: PropTypes.object,
  bounds: PropTypes.array,
  center: PropTypes.object,
  clickPoly: PropTypes.func,
  edit: PropTypes.bool,
  geolocate: PropTypes.bool,
  handleSubmit: PropTypes.func,
  height: PropTypes.number,
  hoveredStyle: PropTypes.object,
  includeZipRadius: PropTypes.bool,
  markerIcon: PropTypes.object,
  legendComponent: PropTypes.func,
  legendProps: PropTypes.object,
  makeCircle: PropTypes.func,
  makeCircleOn: PropTypes.bool,
  maxArea: PropTypes.number,
  onCreated: PropTypes.func,
  onLocationSelect: PropTypes.func,
  onTileSet: PropTypes.func,
  openFeature: PropTypes.bool,
  points: PropTypes.arrayOf(PropTypes.object),
  features: PropTypes.arrayOf(PropTypes.object),
  radiusChange: PropTypes.func,
  refresh: PropTypes.string,
  remove: PropTypes.bool,
  removeAllFeatures: PropTypes.func,
  setCenter: PropTypes.arrayOf(PropTypes.number),
  setCenterAndZoom: PropTypes.func,
  style: PropTypes.object,
  submitText: PropTypes.string,
  tileLayerProps: PropTypes.object,
  tooltipOptions: PropTypes.object,
  totalArea: PropTypes.number,
  unit: PropTypes.string,
  update: PropTypes.string,
  zipRadiusChange: PropTypes.func,
  zoom: PropTypes.number,
  zoomToShapes: PropTypes.func,
};

MapComponent.defaultProps = {
  bindPoint: {},
  center: defaultCenter,
  features: [],
  height: 400,
  legendComponent: noop,
  makeCircleOn: false,
  markerIcon: generateIcon(defaultIcon),
  onShapeChange: (a, cb) => { cb(null, a); },
  points: [],
  remove: false,
  tileLayerProps: {
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  zoom: 9,
};
export default MapComponent;
