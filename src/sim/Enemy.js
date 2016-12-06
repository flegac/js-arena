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