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