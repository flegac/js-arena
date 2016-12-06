var GunPattern = function (rof, precision, projectileSpeed) {
    console.log("GunPattern.new");
    try {
        this.rateOfFire = rof;
        this.precision = precision;
        this.projectile = new ProjectilePattern(PROJECTILE_DISPLAY, projectileSpeed, 7);
    } catch (e) {
        console.log("ERROR(GunPattern.new): " + e);
    }
}

GunPattern.prototype.create = function () {
    return new Gun(this);
}