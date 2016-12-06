var Arena = function (name, width, height) {
    console.log("Arena.new(" + name + ")");
    try {
        this.name = name;
        this.width = width;
        this.height = height;


        this.simulator = new Simulator(FPS);
        this.player = this.simulator.player;

        this.crosshair = new Sim(CROSSHAIR_DISPLAY, new Vec(0, 0), 45);
        this.camera = new Camera(this.simulator.player.position, 0);
    } catch (e) {
        console.log("ERROR(Arena.new): " + e);
    }
}

Arena.prototype.register = function (type, sim) {
    this.simulator.register(type, sim);
}

Arena.prototype.update = function () {
    this.simulator.update();
    this.paint();
}

Arena.prototype.paint = function () {
    try {
        //clear screen
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;
        ctx.fillStyle = "#1e307b";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.save();
        ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(-FULL_CIRCLE / 4);

        var k = this.player.speed.getNorm();
        k = 1.0 / (Math.pow(1 + k / 1000, .6));
        ctx.scale(.25 + k, .25 + k);



        this.camera.use();


        //paint decos
        for (var key in this.simulator.decos) {
            this.simulator.decos[key].paint();
        }

        //paint shots
        for (var key in this.simulator.shots) {
            this.simulator.shots[key].paint();
        }



        //paint ships
        for (var key in this.simulator.ships) {
            this.simulator.ships[key].paint();
        }

        //paint impacts
        for (var key in this.simulator.impacts) {
            this.simulator.impacts[key].paint();
        }

        //paint crosshair
        //    ARENA.paintAt(this.crosshair);



        ctx.restore();


        ctx.font = "20px Georgia";

        ctx.strokeText("hull: ", 10, 50);
        ctx.strokeText("\t" + this.player.life, 10, 70);
        ctx.strokeText("shields: ", 10, 90);
        for (var key in this.player.shields) {
            var shield = this.player.shields[key];
            ctx.strokeText("\t" + shield.life .toFixed(0) + "/" + shield.maxLife, 10, 110);
        }
    } catch (e) {
        console.log("ERROR(Arena.paint): " + e);
    }
}
var Arena=function(t,i,s){console.log("Arena.new("+t+")");try{this.name=t,this.width=i,this.height=s,this.simulator=new Simulator(FPS),this.player=this.simulator.player,this.crosshair=new Sim(CROSSHAIR_DISPLAY,new Vec(0,0),45),this.camera=new Camera(this.simulator.player.position,0)}catch(e){console.log("ERROR(Arena.new): "+e)}};Arena.prototype.register=function(t,i){this.simulator.register(t,i)},Arena.prototype.update=function(){this.simulator.update(),this.paint()},Arena.prototype.paint=function(){try{ctx.canvas.width=this.width,ctx.canvas.height=this.height,ctx.fillStyle="#1e307b",ctx.fillRect(0,0,this.width,this.height),ctx.save(),ctx.translate(this.width/2,this.height/2),ctx.rotate(-FULL_CIRCLE/4);var t=this.player.speed.getNorm();t=1/Math.pow(1+t/1e3,.6),ctx.scale(.25+t,.25+t),this.camera.use();for(var i in this.simulator.decos)this.simulator.decos[i].paint();for(var i in this.simulator.shots)this.simulator.shots[i].paint();for(var i in this.simulator.ships)this.simulator.ships[i].paint();for(var i in this.simulator.impacts)this.simulator.impacts[i].paint();ctx.restore(),ctx.font="20px Georgia",ctx.strokeText("hull: ",10,50),ctx.strokeText("	"+this.player.life,10,70),ctx.strokeText("shields: ",10,90);for(var i in this.player.shields){var s=this.player.shields[i];ctx.strokeText("	"+s.life.toFixed(0)+"/"+s.maxLife,10,110)}}catch(e){console.log("ERROR(Arena.paint): "+e)}};
var Camera = function (position, angle) {
    this.position = position;
    this.angle = angle;
    this.scale = 0.65;
}

Camera.prototype.use = function () {
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.position.x, -this.position.y);
    ctx.rotate(this.angle);
}
var CollisionDetector = function (simulator) {
    this.simulator = simulator;
}


CollisionDetector.prototype.update = function () {
    try {

        for (var key1 in this.simulator.ships) {
            var ship1 = this.simulator.ships[key1];
            var shield1 = ship1.getActiveShield();
            var sim1 = shield1 != null ? shield1 : ship1;


            for (var key2 in this.simulator.ships) {
                var ship2 = this.simulator.ships[key2];
                var shield2 = ship2.getActiveShield();
                var sim2 = shield2 != null ? shield2 : ship2;

                var direction = ship1.position.getDirection(ship2.position);
                var dist = direction.getNorm();
                direction.x += (Math.random() - .5) * .01;
                direction.y += (Math.random() - .5) * .01;
                direction.scale(.8);

                //ship hull collision
                if (dist < ship1.radius + ship2.radius) {
                    ship1.speed.x -= direction.x;
                    ship1.speed.y -= direction.y;
                    ship2.speed.x += direction.x;
                    ship2.speed.y += direction.y;
                    continue;
                }


                //shield collision
                if (sim1 === shield1) {
                    direction.scale(.4);
                }
                if (sim2 === shield2) {
                    direction.scale(.4);
                }

                if (dist < sim1.radius + sim2.radius) {
                    ship1.speed.x -= direction.x;
                    ship1.speed.y -= direction.y;
                    ship2.speed.x += direction.x;
                    ship2.speed.y += direction.y;
                }



            }
        }







        for (var key1 in this.simulator.shots) {
            var shot = this.simulator.shots[key1];
            if (250*(this.simulator.time - shot.creationTime) < shot.speed.getNorm()  * this.simulator.DT) {
                continue;
            }
            for (var key2 in this.simulator.ships) {
                var ship = this.simulator.ships[key2];
                var shield = ship.getActiveShield();

                if (shield != null && ship.position.distance(shot.position) < shield.radius + shot.radius) {
                    shot.creationTime = -1000;
                    this.simulator.register("impact", new Impact(shot.position, 15));
                    shield.life -= shot.damage;
                    shieldStop = true;
                    break;
                }


                if (ship.position.distance(shot.position) < ship.radius + shot.radius) {
                    shot.creationTime = -1000;
                    this.simulator.register("impact", new Impact(shot.position, 15));
                    ship.life -= shot.damage;
                }
            }
        }
    } catch (e) {
        console.log("ERROR(CollisionDetector.update): " + e);
    }
}
var Controller = {};

Controller.fireKey = 32;

Controller.trustKey = 90;
Controller.leftKey = 81;
Controller.rightKey = 68;
Controller.brakeKey = 83;



Controller.onmousemove = function (event) {
  //  ARENA.crosshair.position = new Vec(event.clientX - 10, event.clientY - 10);
}
Controller.onmouseup = function (event) {
    ARENA.player.autofire = false;
    //    console.log("autoFire: " + ARENA.player.autofire);
}
Controller.onmousedown = function (event) {
    ARENA.player.autofire = true;
    //  console.log("autoFire: " + ARENA.player.autofire);
}
Controller.onwheel = function (event) {
//    console.log("zoom");
  //  ARENA.camera.scale *= 0.9;
}

Controller.onkeydown = function (event) {
    var keycode = event.keyCode || event.which;
  //  console.log(keycode);
    if (keycode === this.trustKey && !ARENA.player.trust) {
        ARENA.player.trust = true;
    }
    if (keycode === this.leftKey && !ARENA.player.turnLeft) {
        ARENA.player.turnLeft = true;
    }
    if (keycode === this.rightKey && !ARENA.player.turnRight) {
        ARENA.player.turnRight = true;
    }
    if (keycode === this.brakeKey && !ARENA.player.brake) {
        ARENA.player.brake = true;
    }

    if (keycode === this.fireKey && !ARENA.player.autofire) {
        ARENA.player.autofire = true;
    }

}

Controller.onkeyup = function (event) {
    var keycode = event.keyCode || event.which;
    if (keycode === this.trustKey && ARENA.player.trust) {
        ARENA.player.trust = false;
    }
    if (keycode === this.leftKey && ARENA.player.turnLeft) {
        ARENA.player.turnLeft = false;
    }
    if (keycode === this.rightKey && ARENA.player.turnRight) {
        ARENA.player.turnRight = false;
    }
    if (keycode === this.brakeKey && ARENA.player.brake) {
        ARENA.player.brake = false;
    }
    if (keycode === this.fireKey && ARENA.player.autofire) {
        ARENA.player.autofire = false;
    }
}

Controller.update = function (dt) {
    try {
        var player = ARENA.player;
        var mouse = ARENA.crosshair.position;

        var angularDirection = player.position.getAngularDirection(mouse);
     //   player.spin = isFinite(angularDirection) ? getAngularCorrection(player.angle, angularDirection) / dt : 0;
        //   player.speed = player.position.getDirection(mouse);
        //    player.speed.scale(.05);
        //   player.speed.scale(1.0 / dt);


        //      console.log(player);

    } catch (e) {
        console.log("ERROR(Controller.update): " + e);
    }
}
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
var Simulator=function(t){console.log("Simulator.new");try{this.DT=1/t,this.time=0,this.ships=[],this.shots=[],this.impacts=[],this.decos=[];var i=new GunPattern(.05,.02);i.projectile.audio=null,this.collisionDetector=new CollisionDetector(this),this.player=new Player,this.register("ship",this.player)}catch(s){console.log("ERROR(Arena.new): "+s)}};Simulator.prototype.register=function(t,i){i.creationTime=this.time,"ship"===t?this.ships.push(i):"shot"===t?this.shots.push(i):"impact"===t?this.impacts.push(i):"deco"===t&&this.decos.push(i)},Simulator.prototype.update=function(){try{for(;this.decos.length<1e3;){var t=new Vec(Math.random()-.5,Math.random()-.5);t.scale(1e4),t.x+=this.player.position.x,t.y+=this.player.position.y;var i=new Star(t);this.register("deco",i)}for(var s in this.decos){var i=this.decos[s];i.update(this.DT),i.isDestroyed()&&this.decos.splice(this.decos.indexOf(i),1)}for(var s in this.ships){var e=this.ships[s];if(e.update(this.DT),e.isDestroyed()){this.ships.splice(this.ships.indexOf(e),1);for(var o=0;250>o;o++){var h=new Sim(EXPLOSION_DISPLAY,e.position,25),r=Math.random()*FULL_CIRCLE;h.speed=new Vec(Math.cos(r),Math.sin(r)),h.speed.normalize(2e3*Math.random()),h.retroEngine=.05,h.lifeTime=.1+1*Math.random(),this.register("deco",h)}}}for(var s in this.shots){var a=this.shots[s];a.update(this.DT),a.isDestroyed()&&this.shots.splice(this.shots.indexOf(a),1)}this.collisionDetector.update();for(var s in this.impacts){var i=this.impacts[s];i.update(this.DT),i.isDestroyed()&&this.impacts.splice(this.impacts.indexOf(i),1)}this.time+=this.DT}catch(n){console.log("ERROR(Simulator.update): "+n)}};

var FULL_CIRCLE = Math.PI * 2;

var Vec = function (x, y) {
    this.x = x;
    this.y = y;
}

Vec.prototype.scale = function (k) {
    this.x *= k;
    this.y *= k;
}

Vec.prototype.getNorm = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}


Vec.prototype.normalize = function (length) {
    this.scale(length / this.getNorm());
}

Vec.prototype.toString = function () {
    return "Vec[" + this.x + "," + this.y + "]";
}

Vec.prototype.getDirection = function (vec) {
    return new Vec(vec.x - this.x, vec.y - this.y);
}

Vec.prototype.distance = function(vec) {
    return this.getDirection(vec).getNorm();   
}

Vec.prototype.getAngularDirection = function (vec) {
    var direction = this.getDirection(vec);
    var norm = direction.getNorm();
    var angle = Math.acos(direction.x / norm);
    if (direction.y < 0) {
        angle = -angle;
    }
    return (FULL_CIRCLE + angle) % FULL_CIRCLE;
}

function getAngularCorrection(a1, a2) {
    var right = a2 - a1;
    var left = a1 - a2;
    if (right < 0) {
        right = FULL_CIRCLE - a1 + a2;
    }
    if (left < 0) {
        left = FULL_CIRCLE - a2 + a1;
    }
    if (Math.abs(left) < Math.abs(right)) {
        return -left;
    }
    return right;
}
function getAngularCorrection(t,i){var e=i-t,s=t-i;return 0>e&&(e=FULL_CIRCLE-t+i),0>s&&(s=FULL_CIRCLE-i+t),Math.abs(s)<Math.abs(e)?-s:e}var FULL_CIRCLE=2*Math.PI,Vec=function(t,i){this.x=t,this.y=i};Vec.prototype.scale=function(t){this.x*=t,this.y*=t},Vec.prototype.getNorm=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},Vec.prototype.normalize=function(t){this.scale(t/this.getNorm())},Vec.prototype.toString=function(){return"Vec["+this.x+","+this.y+"]"},Vec.prototype.getDirection=function(t){return new Vec(t.x-this.x,t.y-this.y)},Vec.prototype.distance=function(t){return this.getDirection(t).getNorm()},Vec.prototype.getAngularDirection=function(t){var i=this.getDirection(t),e=i.getNorm(),s=Math.acos(i.x/e);return i.y<0&&(s=-s),(FULL_CIRCLE+s)%FULL_CIRCLE};
try {
    var Inventory = {};
    Inventory.guns = [];
    Inventory.engines = [];

    // guns
    //Inventory.guns["basic"] = new GunPattern(.15, .005);
    //Inventory.guns["sniper"] = new GunPattern(.25, .0001);
    //  Inventory.guns["shotgun"] = new GunPattern(.1, .1);

    
    //engines
    //Inventory.engines["basic"] = new EnginePattern(30);
} catch (e) {
    console.log("ERROR(Inventory.init): " + e);
}
var Enemy = function (position, leader) {
    try {
        //config
        var gunAngle = -.015;
        var engineAngle = -.075;
        var basicEngine = new EnginePattern(30);
        var basicGun = new GunPattern(1.0, .01, 800);




        //sim
        var sim = new Sim(SHIP_DISPLAY, position, 30);
        //AI
        sim.ai = new AI(sim);
        sim.ai = new AI_Collider(sim);
       // sim.ai = new AI_Squad(sim, leader);
        
        

        //engines
        var centerE = basicEngine.create();
        var leftE = basicEngine.create();
        var rightE = basicEngine.create();
        var leftE2 = basicEngine.create();
        var rightE2 = basicEngine.create();


        sim.attachEngine(new Vec(0, -20), 0, centerE);

        sim.attachEngine(new Vec(-12, 0), 0, leftE);
        sim.attachEngine(new Vec(12, 0), FULL_CIRCLE / 2, leftE2);

        sim.attachEngine(new Vec(12, -0), 0, rightE);
        sim.attachEngine(new Vec(-12, 0), FULL_CIRCLE / 2, rightE2);


        sim.assignEngine("trust", centerE);
        sim.assignEngine("turnLeft", leftE);
        sim.assignEngine("turnLeft", leftE2);
        sim.assignEngine("turnRight", rightE);
        sim.assignEngine("turnRight", rightE2);
        sim.retroEngine = .05;

        //guns 
        sim.attachGun(new Vec(0, 12), gunAngle, basicGun.create());
        sim.attachGun(new Vec(0, -12), -gunAngle, basicGun.create());

        //shields
        sim.attachShield(new Shield(50, 100));


    } catch (e) {
        console.log("ERROR(Ennemy.new): " + e);
    }
    return sim;
}
var Player = function () {
    try {
        //config
        var gunAngle = -.015;
        var engineAngle = -.075;
        var basicEngine = new EnginePattern(45);
        var basicGun = new GunPattern(.1, .001, 1500);
        basicGun.projectile.damage = 20;


        //sim
        var sim = new Sim(SHIP_DISPLAY, new Vec(0, 0), 30);

        //engines
        var centerE = basicEngine.create();
        var leftE = basicEngine.create();
        var rightE = basicEngine.create();
        var brakeE = basicEngine.create();


        sim.attachEngine(new Vec(0, -20), 0, centerE);
        sim.attachEngine(new Vec(-12, -20), -engineAngle, leftE);
        sim.attachEngine(new Vec(12, -20), engineAngle, rightE);
        sim.attachEngine(new Vec(0, 20), FULL_CIRCLE / 2, brakeE);

        sim.assignEngine("trust", centerE);
        sim.assignEngine("turnLeft", leftE);
        sim.assignEngine("turnRight", rightE);
        sim.assignEngine("brake", brakeE);
        sim.retroEngine = .05;

        //guns 
        sim.attachGun(new Vec(0, 12), gunAngle, basicGun.create());
        sim.attachGun(new Vec(0, -12), -gunAngle, basicGun.create());

        //shields
        sim.attachShield(new Shield(50, 250));
    } catch (e) {
        console.log("ERROR(Player.new): " + e);
    }
    return sim;
}
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
var Star = function (position) {
    try {
        //sim
        var radius = 15 + Math.random() * 35;


        var display = new Painter(starImage, radius, new Vec(0, 0), 0);

        var sim = new Sim(display, position, radius);
        sim.lifeTime = 1.0 + Math.random() * 20.0;
    } catch (e) {
        console.log("ERROR(Star.new): " + e);
    }
    return sim;
}
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
var Shape = function(radius) {
    this.position = position;
    this.radius = radius;
}

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
var AI_Collider = function (sim) {
    this.sim = sim;
}

AI_Collider.prototype.update = function () {
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

    if (Math.abs(correction) < .3 && dist > 0) {
        this.sim.trust = true;
    }
    if (Math.abs(correction) < .15 && dist < 600 && target.life > 0) {
        this.sim.autofire = true;
    }

    this.sim.spin *= .97;

}
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

var EnginePattern = function (power) {
    console.log("EnginePattern.new");
    this.power = power;
    this.image = fireImage;
}

EnginePattern.prototype.create = function () {
    return new Engine(this);
}

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
var Impact = function(position, radius) {
    var sim = new Sim(IMPACT_DISPLAY, position, radius);
    sim.lifeTime = .3;
    return sim;
}
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
