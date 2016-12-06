var Simulator = function (UPS) {
    console.log("Simulator.new");
    try {
        this.DT = 1.0 / UPS;
        this.time = 0.0;
        this.ships = [];
        this.shots = [];
        this.impacts = [];

        this.decos = [];

        var slowGun = new GunPattern(.05, .02);
        slowGun.projectile.audio = null;

        this.collisionDetector = new CollisionDetector(this);

      /*  var leader = new Enemy(new Vec(0, 0), null);
        var sider1 = new Enemy(new Vec(0, 0), leader);
        var sider2 = new Enemy(new Vec(0, 0), leader);
        this.register("ship", leader);
        this.register("ship", sider1);
        this.register("ship", sider2);*/

        //player
        this.player = new Player();
        this.register("ship", this.player);
    } catch (e) {
        console.log("ERROR(Arena.new): " + e);
    }
}



Simulator.prototype.register = function (type, sim) {
    sim.creationTime = this.time;
    if (type === "ship") {
        this.ships.push(sim);
    } else if (type === "shot") {
        this.shots.push(sim);
    } else if (type === "impact") {
        this.impacts.push(sim);
    } else if (type === "deco") {
        this.decos.push(sim);
    }
}

Simulator.prototype.update = function () {
    //console.log("Arena.update(" + this.name + ")");




    try {

        while (this.decos.length < 1000) {
            var position = new Vec(Math.random() - .5, Math.random() - .5);
            position.scale(10000);
            position.x += this.player.position.x;
            position.y += this.player.position.y;
            var sim = new Star(position);
            this.register("deco", sim);
        }


        //update
        for (var key in this.decos) {
            var sim = this.decos[key];
            sim.update(this.DT);
            if (sim.isDestroyed()) {
                this.decos.splice(this.decos.indexOf(sim), 1);
            }
        }

        for (var key in this.ships) {
            var ship = this.ships[key];
            ship.update(this.DT);
            if (ship.isDestroyed()) {
                this.ships.splice(this.ships.indexOf(ship), 1);
                for (var i = 0; i < 250; i++) {
                    var explosion = new Sim(EXPLOSION_DISPLAY, ship.position, 25);
                    var angle = Math.random() * FULL_CIRCLE;
                    explosion.speed = new Vec(Math.cos(angle), Math.sin(angle));
                    explosion.speed.normalize(2000 * Math.random());
                    explosion.retroEngine = .05;
                    explosion.lifeTime = .1 + 1.0 * Math.random();
                    this.register("deco", explosion);
                }


            }
        }
        for (var key in this.shots) {
            var shot = this.shots[key];
            shot.update(this.DT);
            if (shot.isDestroyed()) {
                this.shots.splice(this.shots.indexOf(shot), 1);
            }
        }

        this.collisionDetector.update();

        for (var key in this.impacts) {
            var sim = this.impacts[key];
            sim.update(this.DT);
            if (sim.isDestroyed()) {
                this.impacts.splice(this.impacts.indexOf(sim), 1);
            }
        }
        this.time += this.DT;
    } catch (e) {
        console.log("ERROR(Simulator.update): " + e);
    }
}