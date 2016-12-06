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