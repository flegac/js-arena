
var FULL_CIRCLE = Math.PI * 2;

var Vec = function (x, y) {
    this.x = x;
    this.y = y;
}

Vec.prototype.scale = function (k) {
    this.x *= k;
    this.y *= k;
}

Vec.prototype.getNorm = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}


Vec.prototype.normalize = function (length) {
    this.scale(length / this.getNorm());
}

Vec.prototype.toString = function () {
    return "Vec[" + this.x + "," + this.y + "]";
}

Vec.prototype.getDirection = function (vec) {
    return new Vec(vec.x - this.x, vec.y - this.y);
}

Vec.prototype.distance = function(vec) {
    return this.getDirection(vec).getNorm();   
}

Vec.prototype.getAngularDirection = function (vec) {
    var direction = this.getDirection(vec);
    var norm = direction.getNorm();
    var angle = Math.acos(direction.x / norm);
    if (direction.y < 0) {
        angle = -angle;
    }
    return (FULL_CIRCLE + angle) % FULL_CIRCLE;
}

function getAngularCorrection(a1, a2) {
    var right = a2 - a1;
    var left = a1 - a2;
    if (right < 0) {
        right = FULL_CIRCLE - a1 + a2;
    }
    if (left < 0) {
        left = FULL_CIRCLE - a2 + a1;
    }
    if (Math.abs(left) < Math.abs(right)) {
        return -left;
    }
    return right;
}