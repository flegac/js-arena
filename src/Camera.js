var Camera = function (position, angle) {
    this.position = position;
    this.angle = angle;
    this.scale = 0.65;
}

Camera.prototype.use = function () {
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.position.x, -this.position.y);
    ctx.rotate(this.angle);
}