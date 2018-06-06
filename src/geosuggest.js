import React from 'react';
import Geosuggest from 'react-geosuggest';
import { onLocationSelect } from './MapHelpers';

const FindPoint = (props) => (
  <Geosuggest
    className="geosuggest"
    onSuggestSelect={onLocationSelect.bind(this, props)}
    // onClick={(e) => { e.stopPropagation(); }}
    style={{
      input: {
        width: '20rem',
      },
      suggests: {
        listStyle: 'none',
        width: '20rem',
        overflow: 'hidden',
        backgroundColor: 'rgba(247, 247, 247, .8)',
      },
    }}
  />
);

export default FindPoint;
