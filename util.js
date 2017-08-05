const rand = el => el ? Math.floor(el * rand()) : Math.random();

const empty = len => new Array(len).fill(0);
const range = len => empty(len).map((_, i) => i);

const inside = (point, vs) => {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

const arrEq = (a1, a2) => a1.length==a2.length && a1.every((v,i) => v === a2[i]);

module.exports = { rand, empty, range, arrEq, inside };