import Settings from "./config"
import { Title,removeFormatting } from "./functions"

// Pristine alert
register("chat", (amount, event) => {
    if(!Settings.highPristineAlert) return
    if(amount < Settings.highPristineNum) return
    if(Settings.alertType == 0) {
        ChatLib.chat(prefix + ` &a&lHigh pristine proc: &r&d${amount} &r&a&l!`);
    } else if(Settings.alertType == 1) {
        World.playSound("mob.cat.meow", 100, 1);
    } else if(Settings.alertType == 2) {
        const title = new Title({text: `&a&lHigh proc &r&d${amount}&a&l!`, scale: 3, time: 750})
        title.draw()
    }
}).setCriteria(/PRISTINE! You found (?:.+) Flawed (?:.+) Gemstone x([1-9][0-9]{0,2}|500)!/g)

// Pristine Hider
register('chat', (message, event) => {
    if (Settings.hidePristine) {
        return cancel(event);
    }
}).setCriteria(/PRISTINE! You found (.+)/);

// Hoppity's egg
register("chat", (place, event) => {
    if (Settings.sendHoppity){
        let entities = World.getAllEntities();
        let nearest = null;
        let distance = 1000;
        let xyz = "";
        entities.forEach(entity => {
            let name = entity.getName();
            if (name === "Armor Stand") {
                let x = Math.round(entity.getX());
                let y = Math.round(entity.getY());
                let z = Math.round(entity.getZ());
                let dist = Math.sqrt(Math.pow(Player.getX() - x, 2) + Math.pow(Player.getY() - y, 2) + Math.pow(Player.getZ() - z, 2));
                if (dist < distance) {
                    distance = dist;
                    nearest = entity;
                    xyz = "(" + x + " " + y + " " + z + ").";
                }
            }
        });
        if (nearest !== null) {
            ChatLib.say("[SCALL] Hoppity's egg " + removeFormatting(place) + " " + xyz);
        }
    }
}).setCriteria(/.*(?:&r&d&lHOPPITY'S HUNT &r&dYou found a &r&(?:\d|\S)Chocolate (?:.*) Egg &r&d(.*)&r&d!&r).*/g);