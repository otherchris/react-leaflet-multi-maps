import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import cleanProps from './cleanProps';

const onTileSet = (props, e) => {
  const tiles = e.target.id;
  const p = cloneDeep(props);
  if (tiles === 'street') {
    p.tileLayerProps = {
      url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    };
  } else {
    p.tileLayerProps = {
      url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    };
  }
  cleanProps(p, props.onShapeChange, noop);
};

export default onTileSet;
