import React from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import updateShapes from './updateShapes';
import cleanProps from './cleanProps';

const EditTools = (p) => {
  if (p.edit && p.bindPoint !== 'm') {
    return (
      <FeatureGroup>
        <EditControl
          position='topright'
          draw={{
            polyline: false,
            circlemarker: false,
            circle: false,
            marker: {
              icon: p.markerIcon,
            },
          }}
          edit={{
            edit: false,
          }}
          onCreated={updateShapes.bind(this, p, p.bindPoint.leafletElement)}
        />
      </FeatureGroup>
    );
  }
  return null;
};

export default EditTools;

