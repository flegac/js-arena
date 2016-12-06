var ProjectilePattern = function (display, speed, radius) {
    this.display = display;
    this.radius = radius;
    this.speed = speed;
    this.lifeTime = .5;
    
    this.audio = shotAudio;
    this.damage = 5;
}

ProjectilePattern.prototype.create = function(position) {
    var sim = new Sim(this.display, position, this.radius);
    sim.lifeTime = this.lifeTime;
    sim.damage = this.damage;
    return sim;
}