import React from 'react';
import omit from 'lodash/omit';
import each from 'lodash/each';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import MapComponent from './MapComponent';

class MapsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { bindPoint: 'm', mapState: { ...props } };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(nextProps.matches, this.props.matches) ||
      !isEqual(nextProps.points, this.props.points) ||
      !isEqual(nextProps.features, this.props.features) ||
      !isEqual(nextProps.remove, this.props.remove) ||
      !isEqual(nextProps.edit, this.props.edit) ||
      !isEqual(nextProps.extraProps, this.props.extraProps) ||
      !isEqual(nextProps.tileLayerProps, this.props.tileLayerProps)) {
      return true;
    }
    if (!isEqual(this.state.bindPoint, nextState.bindPoint)) return true;
    return false;
  }

  setBindPoint(m) {
    if (this.state.bindPoint === 'm') {
      this.setState({ bindPoint: m });
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

  render() {
    const extraProps = {};
    each(this.props.extraProps, (p) => { extraProps[p] = this.props[p]; });
    return (
      <div>
        <MapComponent
          {...cloneDeep(omit(this.props, 'extraProps'))}
          {...extraProps}
          bindPoint={this.state.bindPoint}
          setBindPoint={this.setBindPoint.bind(this)}
        />
        <MapComponent
          {...cloneDeep(omit(this.props, 'extraProps'))}
          {...extraProps}
          bindPoint={this.state.bindPoint}
          setBindPoint={this.setBindPoint.bind(this)}
        />
        <MapComponent
          {...cloneDeep(omit(this.props, 'extraProps'))}
          {...extraProps}
          bindPoint={this.state.bindPoint}
          setBindPoint={this.setBindPoint.bind(this)}
        />
      </div>
    );
  }
}

MapsContainer.defaultProps = {
  onShapeChange: noop,
  validateFunc: noop,
};

export default MapsContainer;
