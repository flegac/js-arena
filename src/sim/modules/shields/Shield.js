var Shield = function (radius, life) {
    console.log("Shield.new");
    this.parent = null;
    this.radius = radius;
    this.life = life;
    this.maxLife = life;
}

Shield.prototype.paint = function () {
    var ratio = 1.0 - Math.min(1.0, this.life / this.maxLife);
    if (this.life <= 0) {
        return;
    }

    var grd = ctx.createRadialGradient(0, 0, this.radius * ratio, 0, 0, this.radius);
    grd.addColorStop(0, "rgba(255, 255, 255, .1)");
    grd.addColorStop(1, "rgba(255, 255, 255, .3)");


    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();

}