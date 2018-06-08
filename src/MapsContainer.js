import React from 'react';
import map from 'lodash/map';
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
    if (!isEqual(this.state.controlBindPoint, nextState.controlBindPoint)) return true;
    return false;
  }

  setViewBindPoint(m, index) {
    console.log('call view bond point', index)
    if (this.state.viewBindPoints[index] === 'm') {
      const new_bp = cloneDeep(this.state.viewBindPoints)
      new_bp[index] = m
      if (m && m.leafletElement) m.leafletElement.dragging.disable();
      this.setState({ viewBindPoints: new_bp });
    }
  }

  setControlBindPoint(m) {
    console.log('call control bond point', m)
    if (this.state.controlBindPoint === 'm') {
      this.setState({ controlBindPoint: m });
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      let el = document.querySelector('a.leaflet-draw-edit-remove');
      if (!el) el = { onclick: '' };
      el.onclick = () => {
        const _p = cloneDeep(this.props);
        _p.remove = !this.props.remove;
        el.classname = 'leaflet-draw-edit-remove';
      };
    }
    this.setState({allMapsProps: this.props.allMapsProps});
  }

  onMove() {
    console.log('called onmove')
    const center = this.state.controlBindPoints[index].leafletElement.getCenter();
    const amp = cloneDeep(this.state.allMapsProps);
    amp.center = center
    console.log(amp)
    this.setState({allMapsProps: amp})
  }

  controlMap() {
    return (
      <div className="mao-wrapper control">
        <MapComponent
          {...this.state.allMapsProps}
          {...this.state.controlMapsProps}
          bindPoint={this.state.controlBindPoint}
          setBindPoint={this.setControlBindPoint.bind(this)}
        />
      </div>
    );
  }

  viewMaps() {
    return map(this.props.viewMapProps, (p, i) => {
      return (
        <div className="map-wrapper view">
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
