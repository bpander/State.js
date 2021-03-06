define(function (require) {
    'use strict';

    var Control = require('./Control');


    function OutputControl (element, expression) {
        Control.call(this, element, expression);

    }
    OutputControl.prototype = Object.create(Control.prototype);
    OutputControl.prototype.constructor = OutputControl;


    OutputControl.merge = function (target, props) {
        var prop;
        var oldVal;
        var newVal;
        for (prop in props) {
            if (props.hasOwnProperty(prop)) {
                newVal = props[prop];
                if (typeof newVal === 'object') {
                    OutputControl.merge(target[prop], newVal);
                    continue;
                }
                oldVal = target[prop];
                if (oldVal !== newVal) {
                    target[prop] = props[prop];
                }
            }
        }
    };


    OutputControl.prototype.acceptState = function (state, loop) {
        var props = this.expression(state, loop);
        OutputControl.merge(this.element, props);
    };


    return OutputControl;
});
