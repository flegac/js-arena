var AI = function (sim) {
    this.sim = sim;
}

AI.prototype.update = function () {
    var target = ARENA.player;

    var dist = this.sim.position.distance(target.position);
    var angle = this.sim.position.getAngularDirection(target.position);
    var correction = getAngularCorrection(this.sim.angle, angle);

    this.sim.trust = false;
    this.sim.turnLeft = false;
    this.sim.turnRight = false;
    this.sim.autofire = false;

    var spinSpeed = Math.abs(this.sim.spin);


    if (correction > 0) {
        this.sim.turnRight = true;
    } else {
        this.sim.turnLeft = true;
    }

    if (Math.abs(correction) < .3 && dist > 250) {
        this.sim.trust = true;
    }
    if (Math.abs(correction) < .15 && dist < 600 && target.life > 0) {
        this.sim.autofire = true;
    }

    this.sim.spin *= .97;

}