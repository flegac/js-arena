var Gun = function (gunPattern) {
    try {
        this.gunPattern = gunPattern;
        this.parent = null;
        this.position = null;
        this.angle = null;
        this.lastShotTime = 0.0;
    } catch (e) {
        console.log("ERROR(Gun.new): " + e);
    }
}


Gun.prototype.shoot = function () {

    try {
        var delta = ARENA.simulator.time - this.lastShotTime;
        if (delta < this.gunPattern.rateOfFire) {
            return;
        }
        this.lastShotTime = ARENA.simulator.time;

        var gunPolarAngle = new Vec(0, 0).getAngularDirection(this.position);
        var gunPolarRadius = this.position.getNorm();

        var shotPosition = new Vec(this.parent.position.x + gunPolarRadius * Math.cos(gunPolarAngle + this.parent.angle), this.parent.position.y + gunPolarRadius * Math.sin(gunPolarAngle + this.parent.angle));
        var shotAngle = this.parent.angle + this.angle;
        shotAngle += (2 * Math.random() * this.gunPattern.precision - this.gunPattern.precision);
        var shotSpeed = new Vec(Math.cos(shotAngle), Math.sin(shotAngle));
        shotSpeed.normalize(this.gunPattern.projectile.speed);
        shotSpeed.x += this.parent.speed.x;
        shotSpeed.y += this.parent.speed.y;


        var shot = this.gunPattern.projectile.create(shotPosition);
        shot.angle = shotAngle;
        shot.speed = shotSpeed;

        ARENA.register("shot", shot);

        var audio = this.gunPattern.projectile.audio;
        if (audio != null) {
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }
    } catch (e) {
        console.log("ERROR(Gun.shoot): " + e);
    }
}