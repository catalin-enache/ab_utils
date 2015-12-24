'use strict';


let horizontalSliderCommon = {
    height: '4px'
};

let sliderCommon = {
    background: {
        backgroundColor: 'gray',
        cursor: 'pointer'
    },

    foreground: {
        backgroundColor: 'indianred'
    }
};

export default {
    horizontalSlider: {
        background: Object.assign({}, horizontalSliderCommon, sliderCommon.background, {}),
        foreground: Object.assign({}, horizontalSliderCommon, sliderCommon.foreground, {})
    }
};
