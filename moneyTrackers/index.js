/// <reference types="../../CTAutocomplete" />
import Settings from "../config"
import { getSackAddedValue } from "../functions";
import { addValuesToGemTracker } from "./gemstone";

function getGemName(name) {
    return name.split(" ")[1];
}

register("chat", (totalItems, lastSec, event) => {
    let siblings = event.message.func_150253_a()[0].func_150256_b().func_150210_i().func_150702_b().func_150253_a();
    added = getSackAddedValue(siblings);

    Object.entries(added).forEach(([key, value]) => {
        if (key.includes("Rough") || key.includes("Flawed")) {
            console.log(key);
            addValuesToGemTracker(key.split(" ")[2].trim(), key.split(" ")[1].trim(), value);
        } 
    });
}).setCriteria(/&6\[Sacks] &r&a\+(\S*)&r&e items&r&e\.&r&8 \(Last (\d*)s\.\)&r/g);