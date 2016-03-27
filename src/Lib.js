define(function (require) {
    'use strict';

    var IfControl = require('./IfControl');
    var EachControl = require('./EachControl');
    var OutputControl = require('./OutputControl');


    var Lib = {};


    Lib.componentMap = {};


    Lib.mount = function (element, Component, initialState) {
        var rootComponent = new Component(element);
        var stack = [];
        // TODO: `addToTree` should probably be refactored.
        var addToTree = function (control) {
            var element = control.element;
            var otherControl;
            var i = stack.length;
            if (control.constructor !== OutputControl) {
                stack.push(control);
            }
            while (--i >= 0) {
                otherControl = stack[i];
                if (otherControl.element.contains(element) || otherControl.element === element) {
                    otherControl.children.push(control);
                    return;
                }
            }
            rootComponent.children.push(control);
        };
        var elements = element.querySelectorAll('[data-out], [data-if], [data-component], [data-each]');
        Array.prototype.forEach.call(elements, function (element, i) {
            var outExpr = element.dataset.out;
            var ifExpr = element.dataset.if;
            var componentExpr = element.dataset.component;
            var eachExpr = element.dataset.each;
            var compiled;

            if (outExpr) {
                compiled = Lib.compileExpression(outExpr);
                addToTree(new OutputControl(element, compiled));
            }
            if (ifExpr) {
                compiled = Lib.compileExpression(ifExpr);
                addToTree(new IfControl(element, compiled));
            }
            if (componentExpr) {
                var Component = Lib.componentMap[componentExpr];
                compiled = Lib.compileExpression(element.dataset.state);
                addToTree(new Component(element, compiled));
            }
            if (eachExpr) {
                addToTree(new EachControl(element));
            }
        });

        rootComponent.setState(initialState);

        return rootComponent;
    };


    Lib.compileExpression = function (expression) {
        // comma-separated argument definition seems to be a little faster than the `new Function(arg1, arg2, body)` way
        return new Function('state, loop', 'return ' + expression + ';');
    };


    return Lib;
});
