import {removeFormatting} from './functions';
import Settings from "./config";

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