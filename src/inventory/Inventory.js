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