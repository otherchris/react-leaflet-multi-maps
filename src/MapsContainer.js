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
      !isEqual(nextProps.allMapsProps.matches, this.props.allMapsProps.matches) ||
      !isEqual(nextProps.allMapsProps.points, this.props.allMapsProps.points) ||
      !isEqual(nextProps.allMapsProps.features, this.props.allMapsProps.features) ||
      !isEqual(nextProps.allMapsProps.remove, this.props.allMapsProps.remove) ||
      !isEqual(nextProps.allMapsProps.edit, this.props.allMapsProps.edit) ||
      !isEqual(nextProps.allMapsProps.extraProps, this.props.allMapsProps.extraProps) ||
      !isEqual(nextProps.allMapsProps.tileLayerProps, this.props.allMapsProps.tileLayerProps)) {
      return true;
    }
    if (!isEqual(this.state.viewBindPoints, nextState.viewBindPoints)) return true;
    if (!isEqual(this.state.allMapsProps.center, nextState.allMapsProps.center)) return true;
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

  componentDidMount() {
    this.setState({allMapsProps: this.props.allMapsProps});
  }

  onMove() {
    const center = this.state.controlBindPoint.leafletElement.getCenter();
    const zoom = this.state.controlBindPoint.leafletElement.getZoom();
    const amp = cloneDeep(this.state.allMapsProps);
    amp.center = center
    amp.zoom = zoom
    this.setState({allMapsProps: amp})
  }

  controlMap() {
    const allMapsProps = merge(this.state.allMapsProps, {features: this.props.allMapsProps.features})
    return (
      <div className="mao-wrapper control">
        <MapComponent
          {...allMapsProps}
          {...this.state.controlMapsProps}
          bindPoint={this.state.controlBindPoint}
          setBindPoint={this.setControlBindPoint.bind(this)}
          onMove={this.onMove.bind(this)}
          edit={true}
        />
      </div>
    );
  }

  viewMaps() {
    return map(this.props.viewMapProps, (p, i) => {
      return (
        <div key={i} className="map-wrapper view">
          <MapComponent
            {...this.state.allMapsProps}
            {...p}
            bindPoint={this.state.viewBindPoints[i]}
            bindPointIndex={i}
            setBindPoint={this.setViewBindPoint.bind(this)}
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
