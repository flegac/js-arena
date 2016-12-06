var Painter = function (image, radius, position, angle) {
    this.image = image;
    this.radius = radius;
    this.position = position;
    this.angle = angle;
}

Painter.prototype.paint = function () {
    ctx.rotate(this.angle);
    var k = this.radius / Math.min(this.image.width, this.image.height);
    ctx.translate(-this.radius / 2, -this.radius / 2);
    ctx.scale(k, k);
    ctx.drawImage(this.image, 0, 0);
}