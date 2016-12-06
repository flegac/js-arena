var Impact = function(position, radius) {
    var sim = new Sim(IMPACT_DISPLAY, position, radius);
    sim.lifeTime = .3;
    return sim;
}