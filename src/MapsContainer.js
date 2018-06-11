import React from 'react';
import map from 'lodash/map';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import each from 'lodash/each';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import MapComponent from './MapComponent';

class MapsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewBindPoints: map(props.viewMapProps, () => 'm'),
      controlBindPoint: 'm',
      mapState: { ...props } };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(nextProps.points, this.props.points) ||
      !isEqual(nextProps.features, this.props.features) ||
      !isEqual(nextProps.remove, this.props.remove) ||
      !isEqual(nextProps.edit, this.props.edit) ||
      !isEqual(nextProps.extraProps, this.props.extraProps) ||
      !isEqual(nextProps.tileLayerProps, this.props.tileLayerProps)) {
      return true;
    }
    if (!isEqual(this.state.viewBindPoints, nextState.viewBindPoints)) return true;
    if (!isEqual(this.state.center, nextState.center)) return true;
    if (!isEqual(this.state.controlBindPoint, nextState.controlBindPoint)) return true;
    return false;
  }

  setViewBindPoint(m, index) {
    if (this.state.viewBindPoints[index] === 'm') {
      const new_bp = cloneDeep(this.state.viewBindPoints)
      new_bp[index] = m
      if (m && m.leafletElement) m.leafletElement.dragging.disable();
      this.setState({ viewBindPoints: new_bp });
    }
  }

  setControlBindPoint(m) {
    if (this.state.controlBindPoint === 'm') {
      this.setState({ controlBindPoint: m });
    }
  }

  onMove() {
    const center = this.state.controlBindPoint.leafletElement.getCenter();
    const zoom = this.state.controlBindPoint.leafletElement.getZoom();
    this.setState({center, zoom})
  }

  controlMap() {
    return (
      <div className="mao-wrapper control">
        <MapComponent
          features={this.props.features}
          remove={this.props.remove}
          onShapeChange={this.props.onShapeChange}
          {...this.state.controlMapsProps}
          bindPoint={this.state.controlBindPoint}
          setBindPoint={this.setControlBindPoint.bind(this)}
          onMove={this.onMove.bind(this)}
          edit={true}
          zoom={this.state.zoom}
          center={this.state.center}
        />
      </div>
    );
  }

  viewMaps() {
    return map(this.props.viewMapProps, (p, i) => {
      return (
        <div key={i} className="map-wrapper view">
          <MapComponent
            features={this.props.features}
            {...p}
            bindPoint={this.state.viewBindPoints[i]}
            bindPointIndex={i}
            setBindPoint={this.setViewBindPoint.bind(this)}
            edit={false}
            zoom={this.state.zoom}
            center={this.state.center}
            hideGeo={true}
          />
        </div>
      );
    });
  }

  render() {
    const extraProps = {};
    each(this.props.extraProps, (p) => { extraProps[p] = this.props[p]; });
    return (
      <div className="multi-map-container">
        {this.controlMap()}
        {this.viewMaps()}
      </div>
    );
  }
}

MapsContainer.defaultProps = {
  onShapeChange: noop,
};

export default MapsContainer;
