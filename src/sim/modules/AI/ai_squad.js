var AI_Squad = function (sim, leader) {
    this.sim = sim;
    this.leader = leader;
}

AI_Squad.prototype.update = function () {
    if (this.leader != null && this.leader.life <= 0) {
        this.leader = null;
    }
    var target = ARENA.player;
    var leader = this.leader !== null ? this.leader : target;

    var targetDist = this.sim.position.distance(target.position);


    target = targetDist < 200 ? target : leader;
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


    if (target === leader) {


        if (Math.abs(correction) < .3 && dist > 150) {
            this.sim.trust = true;
        }
    } else {

        if (correction > 0) {
            this.sim.turnRight = true;
        } else {
            this.sim.turnLeft = true;
        }



        if (Math.abs(correction) < .15 && dist < 600 && target.life > 0) {
            this.sim.autofire = true;
        }
    }



    this.sim.spin *= .97;

}