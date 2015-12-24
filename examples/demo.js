'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import {Slider, TextField} from '../src';

const Application = React.createClass({
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

ReactDOM.render(
    <Application>
        <Slider />
        <TextField />
    </Application>,
    document.getElementById('content')
);