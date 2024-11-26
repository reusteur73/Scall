import { getArea, addCommas, secondsToMessage, stringToNumber } from "./functions";
import Settings from "./config";

function getPowderFromTab(powderName) {
    if (powderName === "Unknown") return "Unknown";
    let wantedMatch;
    switch (powderName) {
        case "Mithril":
            wantedMatch = "§r Mithril: §r§2";
            break;
        case "Gemstone":
            wantedMatch = "§r Gemstone: §r§d";
            break;
        case "Glacite":
            wantedMatch = "§r Glacite: §r§b";
            break;
        default:
            return "Unknown";
    }
    const lines = TabList.getNames();

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(wantedMatch)) {
            return lines[i].replace(wantedMatch, "").replace("§r", "");
        }
    }
    return "Unknown";
}

function createHUD(trackerType) {
    const data = JSON.parse(FileLib.read("Scall", ".data.json"))[trackerType];
    return {
        x: data.x,
        y: data.y,
        text: "",
        visible: false,
        startPowder: null,
        totalGains: 0,
        gainsPerMinute: 0,
        isGainBetter: false,
        lastUpdateTime: null,
        sessionStartTime: null,
        name: trackerType
    };
}

function loadHUDCoordinates(hud) {
    const data = JSON.parse(FileLib.read("Scall", ".data.json"))[hud.name];
    hud.x = data.x;
    hud.y = data.y;
}

function renderHUD(hud) {
    if (hud.visible && hud.text !== "") {
        loadHUDCoordinates(hud);
        let text = hud.text;
        let x = hud.x;
        let y = hud.y;
        let lines = text.split("\n");
        let width = Math.max(...lines.map(line => Renderer.getStringWidth(line))) + 10;
        let height = (lines.length * 10) + 10;
        Renderer.drawRect(Renderer.color(0, 0, 0, 128), x - 5, y - 5, width, height);
        lines.forEach((line, index) => {
            Renderer.drawString(line, x, y + (index * 10));
        });
    }
}

function updateHUD(hud, powderName) {
    let elapsedTimeMinutes = (Date.now() - hud.sessionStartTime) / 60000;
    let elapsedTimeHours = elapsedTimeMinutes / 60;

    let gainsPerMinute;
    if (elapsedTimeMinutes < 1) { // avoid rate going crazy when less than a minute has passed
        gainsPerMinute = hud.totalGains;
    } else {
        gainsPerMinute = (hud.totalGains / elapsedTimeMinutes).toFixed(0);
    }
    hud.gainsPerMinute = gainsPerMinute;

    let gainsPerHour = null;
    if (elapsedTimeHours >= 1) {
        gainsPerHour = (hud.totalGains / elapsedTimeHours).toFixed(0);
        hud.gainsPerHour = gainsPerHour;
    }

    let color;
    switch (powderName) {
        case "Mithril":
            color = "&2";
            break;
        case "Gemstone":
            color = "&d";
            break;
        case "Glacite":
            color = "&b";
            break;
        default:
            return "Unknown";
    }

    hud.text = `${color}${powderName} Powder: &e${addCommas(hud.startPowder)}\n` +
               `${color}Session Gains: &e${addCommas(hud.totalGains)}\n` +
               `${color}Gains per Minute: &a${addCommas(gainsPerMinute)}\n`;
    if (gainsPerHour !== null) {
        hud.text += `${color}Gains per Hour: &a${color}${addCommas(gainsPerHour)}\n`;
    }
    hud.text += `${color}Session Time: &e${secondsToMessage((Date.now() - hud.sessionStartTime) / 1000)}`;
}

function updatePowderTracker(hud, powderName, area, validAreas) {
    if (Settings[`${powderName.toLowerCase()}PowderTracker`] && validAreas.includes(area)) {
        let p1 = getPowderFromTab(powderName);
        let powder = stringToNumber(p1);
        if (powder != "Unknown") {
            if (hud.startPowder === null) {
                hud.startPowder = powder;
            } else if (hud.startPowder !== powder) {
                if (hud.sessionStartTime === null) hud.sessionStartTime = Date.now();
                if (hud.startPowder > powder) {
                    hud.startPowder = powder;
                } else {
                    let gainM = powder - hud.startPowder;
                    if (hud.totalGains < (hud.totalGains + gainM)) hud.isGainBetter = true;
                    else hud.isGainBetter = false;
                    hud.totalGains += gainM;
                    hud.startPowder = powder;

                }
                hud.lastUpdateTime = Date.now();
                if (!hud.visible) hud.visible = true;
                updateHUD(hud, powderName);
            }
        }
    }
}

let glacitePowderHUD = createHUD("GlaciteTracker");
let gemstonePowderHUD = createHUD("GemstoneTracker");
let mithrilPowderHUD = createHUD("MithrilTracker");

register("renderOverlay", () => {
    renderHUD(glacitePowderHUD);
    renderHUD(gemstonePowderHUD);
    renderHUD(mithrilPowderHUD);
});

register("step", () => {
    try {
        let area = getArea();
        if (area === "Unknown") return;
        
        updatePowderTracker(glacitePowderHUD, "Glacite", area, ["Dwarven Mines", "Mineshaft"]);
        updatePowderTracker(gemstonePowderHUD, "Gemstone", area, ["Crystal Hollows", "Dwarven Mines", "Mineshaft"]);
        updatePowderTracker(mithrilPowderHUD, "Mithril", area, ["Dwarven Mines", "Crystal Hollows"]);
        let names = ["Glacite", "Gemstone", "Mithril"];

        [glacitePowderHUD, gemstonePowderHUD, mithrilPowderHUD].forEach((hud,index) => {
            if (Date.now() - hud.lastUpdateTime > Settings[`reset${names[index]}After`] * 1000) {
                hud.visible = false;
                hud.startPowder = null;
                hud.totalGains = 0;
                hud.text = "";
                hud.sessionStartTime = Date.now();
                hud.lastUpdateTime = Date.now();
            }
            if (hud.visible) updateHUD(hud, names[index]);
        });
    } catch (error) {
        console.error("Error in step event from powdersTrackers: " + error);
    }
}).setDelay(1);


register("chat", (event) => {
    if (Settings.hideGemstoneLootChest) {
        cancel(event);
    }
}).setCriteria(/(?:&r  &r&6&lCHEST LOCKPICKED &r)|(?:&r&e&l▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬&r)|(?:&r    &r&f(?:[^a-z]) Rough (?:[a-zA-Z]*) Gemstone &r&8x(?:\S*)&r)|(?:&r  &r&a&lREWARDS&r)|(?:&r    &r&a(?:[^a-z]) Flawed (?:[a-zA-Z]*) Gemstone(?: &r&8x3)?&r)|(?:&r    &r&d(?:Diamond|Gold) Essence(?: &r&8x(?:\d*))?&r)|(?:&r    &r&9Ascension Rope&r)/gm);

register("chat", (amount, event) => {
    if (Settings.hideGemstoneLootChest) {
        let am = stringToNumber(amount);
        let color
        if (am >3500) {
            color = "&2";
            World.playSound("fireworks.twinkle", 1, 1);
        } else if (am < 3500 && am > 1000) {
            color = "&e";
        } else {
            color = "&7";
        }
        let newMessage = "      &dGemstone +&l" + color + addCommas(am);
        ChatLib.chat(newMessage);
        cancel(event);
    }
}).setCriteria(/&r    &r&dGemstone Powder &r&8x(\S*)&r/);
