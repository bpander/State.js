define(function (require) {
    'use strict';

    var Control = require('./Control');
    var IterationControl = require('./IterationControl');


    function EachControl (element, expression, keyExpression) {
        Control.call(this, element, expression);

        this.keyExpression = keyExpression;

        this.template = document.createElement('template');

        this.iterations = {};

    }
    EachControl.prototype = Object.create(Control.prototype);
    EachControl.prototype.constructor = EachControl;


    EachControl.prototype.acceptState = function (state, loop) {
        // TODO: This should also be able to iterate over objects
        var arr = this.expression(state, loop);
        loop = {
            key: null,
            val: null,
            outer: loop
        };
        var docFrag = document.createDocumentFragment();
        arr.forEach(function (item, i) {
            loop.key = i;
            loop.val = item;
            // TODO: The default should just key off of the index
            var key = this.keyExpression(state, loop);
            var iteration = this.iterations[key];
            if (iteration === undefined) {
                iteration = IterationControl.from(this);
                this.iterations[key] = iteration;
            }
            iteration.acceptState(state, loop);
            iteration.childNodes.forEach(function (node) {
                docFrag.appendChild(node);
            });
        }, this);
        // TODO: It should probably be smarter about how it updates the list
        // Like, it won't touch the node if it's in the correct spot
        this.element.innerHTML = '';
        this.element.appendChild(docFrag);
    };


    return EachControl;
});
