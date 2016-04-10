var createGraphicsNode = require('./create-graphics-item'),

    renderers = {
        circle: function (nodes, node, graphics, x0, y0) {
            graphics.drawCircle(
                x0 + (node.props.x || 0),
                y0 + (node.props.y || 0),
                node.props.diameter || 0
            );
        },
        rect: function (nodes, node, graphics, x0, y0) {
            graphics.drawRect(
                x0 + (node.props.x || 0),
                y0 + (node.props.y || 0),
                node.props.width || 0,
                node.props.height || 0
            );
        },
        line: function (nodes, node, graphics, x0, y0) {
            graphics.moveTo(
                x0 + (node.props.x1 || 0),
                y0 + (node.props.y1 || 0)
            );
            graphics.lineTo(
                x0 + (node.props.x2 || 0),
                y0 + (node.props.y2 || 0)
            );
        },
        lineto: function (nodes, node, graphics, x0, y0) {
            graphics.lineTo(
                x0 + (node.props.x || 0),
                y0 + (node.props.y || 0)
            );
        },
        curveto: function (nodes, node, graphics, x0, y0) {
            graphics.quadraticCurveTo(
                node.props.cpx + x0,
                node.props.cpy + y0,
                node.props.x + x0,
                node.props.y + y0
            );
        },
        shape: function (nodes, node, graphics, x0, y0) {
            var sx0 = x0 + (node.props.x || 0),
                sy0 = y0 + (node.props.y || 0);

            if (node.props.d) {
                var parts = node.props.d.match(/([a-z][0-9,]+)/g);
                for (var i = 0; i < parts.length; i++) {
                    var part = parts[i],
                        command = part.charAt(0),
                        v = part.match(/[0-9]+/g).map(function (v) {
                            return parseFloat(v);
                        });

                    switch (command) {
                        case 'l':
                            graphics.lineTo(v[0] + sx0, v[1] + sy0);
                            break;
                        case 'c':
                            graphics.drawCircle(v[0] + sx0, v[1] + sy0, v[2]);
                            break;
                        case 'r':
                            graphics.drawRect(v[0] + sx0, v[1] + sy0, v[2], v[3]);
                            break;
                        case 'm':
                            graphics.moveTo(v[0] + sx0, v[1] + sy0);
                            break;
                        case 'q':
                            graphics.quadraticCurveTo(v[0], v[1], v[2] + sx0, v[3] + sy0);
                            break;
                    }
                }
            }

            for (i = 0; i < node.children.length; i++) {
                var child = nodes.byId(node.children[i]);
                if (renderers[child.tag]) {
                    renderers[child.tag](nodes, child, graphics, sx0, sy0);
                }
            }
        }
    };

module.exports = Object.keys(renderers).reduce(function (acc, type) {
    acc[type] = createGraphicsNode(renderers[type]);
    return acc;
}, {});
