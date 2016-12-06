var Engine = function (pattern) {
    console.log("Engine.new");
    this.pattern = pattern;
    this.parent = null;
    this.position = null;
    this.angle = 0;
}

Engine.prototype.apply = function () {
    var direction = this.parent.angle + this.angle;
    var force = new Vec(Math.cos(direction), Math.sin(direction));
    force.normalize(this.pattern.power);

    var spinForce = new Vec(Math.cos(this.angle - FULL_CIRCLE / 4), Math.sin(this.angle - FULL_CIRCLE / 4));
    spinForce.normalize(this.pattern.power * .0005);
    var spin = (spinForce.x * this.position.y - spinForce.y * this.position.x);


    this.parent.speed.x += force.x;
    this.parent.speed.y += force.y;
    this.parent.spin += spin;
}


Engine.prototype.paint = function () {
    var k = Math.pow(this.pattern.power / 50, .75);

    ctx.save();
    ctx.translate(-this.position.x, -this.position.y);
    ctx.rotate(-this.angle);
    ctx.scale(.2 + k, .2 + k);
    ctx.translate(-17, 0);
    ctx.drawImage(this.pattern.image, 0, 0);
    ctx.restore();
}