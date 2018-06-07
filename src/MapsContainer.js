import React from 'react';
import map from 'lodash/map';
import omit from 'lodash/omit';
import each from 'lodash/each';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import MapComponent from './MapComponent';

class MapsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bindPoints: map(props.singleMapProps, () => 'm'), mapState: { ...props } };
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
    if (!isEqual(this.state.bindPoint, nextState.bindPoint)) return true;
    return false;
  }

  setBindPoint(m, index) {
    if (this.state.bindPoints[index] === 'm') {
      const new_bp = cloneDeep(this.state.bindPoints)
      new_bp[index] = m
      this.setState({ bindPoints: new_bp });
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
  }

  maps() {
    return map(this.props.singleMapProps, (p, i) => {
      return (
        <MapComponent
          {...this.props.allMapsProps}
          {...p}
          bindPoint={this.state.bindPoints[i]}
          bindPointndex={i}
          setBindPoint={this.setBindPoint.bind(this)}
        />
      );
    });
  }

  render() {
    const extraProps = {};
    each(this.props.extraProps, (p) => { extraProps[p] = this.props[p]; });
    return (
      <div>
        {(this.maps())}
      </div>
    );
  }
}

MapsContainer.defaultProps = {
  onShapeChange: noop,
};

export default MapsContainer;
