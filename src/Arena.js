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