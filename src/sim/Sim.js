var Sim = function (display, position, radius) {
    //  console.log("Sim.new");
    try {
        //paint
        this.display = display;

        //physics
        this.creationTime = -1;
        this.lifeTime = -1;

        this.radius = radius;
        this.position = new Vec(position.x, position.y);
        this.speed = new Vec(0, 0);
        this.angle = 0;
        this.spin = 0;

        this.life = 100;

        this.ai = null;

        this.engines = [];
        this.engines["all"] = [];
        this.engines["trust"] = [];
        this.engines["turnLeft"] = [];
        this.engines["turnRight"] = [];
        this.engines["brake"] = [];
        this.retroEngine = 0;

        this.trust = false;
        this.turnLeft = false;
        this.turnRight = false;
        this.brake = false;


        this.guns = [];
        this.autofire = false;

        this.shields = [];
    } catch (e) {
        console.log("ERROR(Sim.new): " + e);
    }
}

Sim.prototype.getActiveShield = function () {
    var activeShield = null;
    for (var key in this.shields) {
        var shield = this.shields[key];
        if (shield.life > 0 && (activeShield == null || shield.radius > activeShield.radius)) {
            activeShield = shield;
            break;
        }
    }
    return activeShield;
}

Sim.prototype.isDestroyed = function () {
    var delta = ARENA.simulator.time - this.creationTime;
    var timeDestruction = this.lifeTime > 0 && delta > this.lifeTime;
    var lifeDestruction = this.life <= 0;

    return timeDestruction || lifeDestruction;

}

Sim.prototype.assignEngine = function (type, module) {
    try {
        this.engines[type].push(module);
    } catch (e) {
        console.log("ERROR(Sim.assignEngine): " + e);
    }
}

Sim.prototype.attachEngine = function (position, angle, module) {
    try {
        module.parent = this;
        module.position = position;
        module.angle = angle;
        this.engines["all"].push(module);
    } catch (e) {
        console.log("ERROR(Sim.attachEngine): " + e);
    }
}

Sim.prototype.attachGun = function (position, angle, module) {
    module.parent = this;
    module.position = position;
    module.angle = angle;
    this.guns.push(module);
}

Sim.prototype.attachShield = function (shield) {
    shield.parent = this;
    this.shields.push(shield);
}

Sim.prototype.shoot = function () {
    for (var key in this.guns) {
        this.guns[key].shoot();
    }
}

Sim.prototype.update = function (dt) {
    try {
        //AI
        if (this.ai !== null) {
            this.ai.update();
        }

        //spin
        var updateAngle = isFinite(this.spin);
        if (updateAngle) {
            this.angle += this.spin * dt;
            this.angle %= FULL_CIRCLE;
        } else {
            console.log("ERROR(Ship.update) : spin.isNaN");
        }



        //position
        this.position.x += this.speed.x * dt;
        this.position.y += this.speed.y * dt;

        //shield
        for (var key in this.shields) {
            var shield = this.shields[key];
            if (shield.life > 0 && shield.life < shield.maxLife) {
                shield.life += 5.0 * dt;
            }
        }

        //autofire
        if (this.autofire) {
            this.shoot();
        }

        if (this.trust) {
            for (var key in this.engines["trust"]) {
                this.engines["trust"][key].apply();
            }
        }
        if (this.turnLeft) {
            for (var key in this.engines["turnLeft"]) {
                this.engines["turnLeft"][key].apply();
            }
        }
        if (this.turnRight) {
            for (var key in this.engines["turnRight"]) {
                this.engines["turnRight"][key].apply();
            }
        }
        if (this.brake) {
            for (var key in this.engines["brake"]) {
                this.engines["brake"][key].apply();
            }
        }

        //  if (!(this.turnLeft || this.turnRight)) {
        this.spin *= (1.0 - this.retroEngine);
        // }

        //   if (!(this.trust || this.brake || this.turnLeft || this.turnRight)) {
        this.speed.scale(1.0 - this.retroEngine);
        //  }

    } catch (e) {
        console.log("ERROR(Ship.update): " + e);
    }
}


Sim.prototype.paint = function () {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle + FULL_CIRCLE / 4);

    for (var key in this.shields) {
        this.shields[key].paint();
    }

    if (this.trust) {
        for (var key in this.engines["trust"]) {
            this.engines["trust"][key].paint();
        }
    }
    if (this.turnLeft) {
        for (var key in this.engines["turnLeft"]) {
            this.engines["turnLeft"][key].paint();
        }
    }
    if (this.turnRight) {
        for (var key in this.engines["turnRight"]) {
            this.engines["turnRight"][key].paint();
        }
    }
    if (this.brake) {
        for (var key in this.engines["brake"]) {
            this.engines["brake"][key].paint();
        }
    }


    //draw sim
    this.display.paint();

    ctx.restore();

}