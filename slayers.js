import { getArea, removeFormatting, stringToNumber, secondsToMessage, addCommas } from "./functions";
import Settings from "./config";
import { drawCoolWaypoint, trace } from "./renderUtil";
import renderBeaconBeam from "../BeaconBeam"

register('step', () => sendMessageOnSlayerSpawn()).setFps(3);
let slayersList = [
    {"entityName": "☠ Revenant Horror", "uuid": null,"raison": "RevenantHorror","euuid": null, created: null},
    {"entityName": "☠ Tarantula Broodfather", "uuid": null, "raison": "Broodfather","euuid": null, created: null},
    {"entityName": "☠ Sven Packmaster", "uuid": null, "raison": "Packmaster","euuid": null, created: null},
    {"entityName": "☠ Voidgloom Seraph", "uuid": null,"raison": "VoidgloomSeraph","euuid": null, created: null},
    {"entityName": "☠ Riftstalker Bloodfiend", "uuid": null,"raison": "RiftstalkerBloodfiend","euuid": null, created: null},
    {"entityName": "☠ Inferno Demonlord", "uuid": null,"raison": "Demonlord","euuid": null, created: null}
];

let slayerHud, waypoints = [];
resetSlayerHud();

let GAINS = {
    "Zombie": {
        rewards: [0,5,25,100,500,500,500,1500],
        needed: [0,5,15,200,1000,5000,20000,100000,400000,1000000]
    },
    "Wolf": {
        rewards: [0,5,25,100,500,500,500,500],
        needed: [0,10,30,250,1500,5000,20000,100000,400000,1000000]
    },
    "Spider": {
        rewards: [0,5,25,100,500,500,500,500],
        needed: [0,5,25,200,1000,5000,20000,100000,400000,1000000]
    },
    "Enderman": {
        rewards: [0,5,25,100,500,500,500,500],
        needed: [0,10,30,250,1500,5000,20000,100000,400000,1000000]
    },
    "Blaze": {
        rewards: [0,5,25,100,500,500,500,500],
        needed: [0,10,30,250,1500,5000,20000,100000,400000,1000000]
    },
    "Vampire": {
        rewards: [0,10,25,60,120,160,160,160],
        needed: [0,20,75,240,840,2400]
    },
};

function sendMessageOnSlayerSpawn() {
    try {
        waypoints.forEach(waypoint => {
            if (Date.now() - waypoint.created > 60000) {
                removeWaypoint(waypoint.x, waypoint.y, waypoint.z);
            }
        });
        if (getArea() === "Kuudra" || getArea() === "Catacombs" || !Settings.messageOnSlayerSpawn) {
            return;
        }
        const entities = World.getAllEntitiesOfType(Java.type("net.minecraft.entity.item.EntityArmorStand"));

        slayersList.forEach(slayer => {
            const slayerOwner = entities.find(entity => {
                const plainName = entity?.getName()?.removeFormatting();
                return plainName.includes('Spawned by: ' + Player.getName());
            });

            if (!slayerOwner) {
                return;
            }

            const currentSlayerUUID = slayerOwner.getUUID();

            if (currentSlayerUUID === slayer.uuid) {
                return;
            }

            slayer.uuid = currentSlayerUUID;

            const slayerEntity = entities.find(entity => {
                const plainName = entity?.getName()?.removeFormatting();
                const position = entity.getPos();
                slayer.euuid = entity.getUUID();
                return plainName.includes(slayer.entityName)
                    && !plainName?.endsWith(' 0❤')
                    && position.x === slayerOwner.getPos().x && position.z === slayerOwner.getPos().z
                    && entity.getPitch() === slayerOwner.getPitch()
            });

            if (!slayerEntity) {
                return;
            }
            slayer.spawned = true;
            const location = `x: ${Math.round(slayerEntity.getX())} | y: ${Math.round(slayerEntity.getY())} | z: ${Math.round(slayerEntity.getZ())}`;
            const message = `${slayer.raison} ${location}`;
            ChatLib.command('cc ' + message);
        });
    } catch (e) {
        console.error(e);
        ChatLib.chat(`[Scall] Failed to send the message on Slayer spawn.` + e);
    }
}

function resetSlayerHud() {
    slayerHud = {
        x: 0,
        y: 0,
        text: "",
        visible: false,
        sessionExpGain: 0,
        sessionKills: 0,
        currentGain: 0,
        gainPerHour: 0,
        nextLvlEta: 0,
        wholeLvlExp: null,
        nextLvlExpReq: 0,
        bossTimes: [],
        lastTimeBoss: null,
        lastUpdateTime: null,
        sessionStartTime: null,
        slayerType: null,
        resetNext: false
    };
}

function removeWaypoint(x, y, z) {
    waypoints = waypoints.filter(waypoint => waypoint.x !== x || waypoint.y !== y || waypoint.z !== z);
}
register("chat", (preMsg, x,y,z,event) => {
    if (!Settings.displayOwnWaypoints && removeFormatting(preMsg).includes(Player.getName())) return;
    const name = "Scall Waypoint";
    x = parseInt(x);
    y = parseInt(y);
    z = parseInt(z);

    const message= new TextComponent(`&a&l[&b&lSCALL&a&l] &aFound coords! Waypoint set at &6&l${x} ${y} ${z}` + " &l&n&cCLICK TO REMOVE&r").setClick(
        "run_command", `/scrm ${x} ${y} ${z}`).setHoverValue("&c&lClick to remove this waypoint");
    
    let created = Date.now();
    waypoints.push({x, y, z, name, created});

    ChatLib.chat(message);
}).setCriteria(/(.*)x: (-?[0-9]*) \| y: (-?[0-9]*) \| z: (-?[0-9]*)(?:.*)/g);

register("chat", (event) => {
    waypoints = [];
}).setCriteria(/&r&9Party &8> (?:.*)&f: &r\[Scall] Slayer quest complete!&r|&r&bCo-op > (?:.*)&f: &r\[Scall] Slayer quest complete!&r/g);

register("command", (x, y, z) => {
    removeWaypoint(parseInt(x), parseInt(y), parseInt(z));
    ChatLib.chat(`&a&l[&b&lSCALL&a&l] &aRemoved waypoint at &6&l${x} ${y} ${z}`);
}).setName("scrm");

register("renderWorld", () => {
    waypoints.forEach(waypoint => {
        drawCoolWaypoint(waypoint.x, waypoint.y, waypoint.z, 0, 255, 0, {name: waypoint.name, phase: true});
        trace(waypoint.x + 0.5, waypoint.y+ 0.5, waypoint.z + 0.5, 0, 1, 0, 1, 3);
        renderBeaconBeam(waypoint.x, waypoint.y, waypoint.z, 0, 255, 0, 0.7, 0, 300);
    });
});

register('step', () => {
    let scoreBoard = Scoreboard.getLines();
    slayersList.forEach(slayer => {
        if (!slayer.spawned || !Settings.messageOnSlayerSpawn) {
            return;
        }
        scoreBoard.forEach(line => {
            line = removeFormatting(line.toString());
            if (line.includes("Boss slain!") || line.includes(") Combat XP")){
                ChatLib.command('cc [Scall] Slayer quest complete!');
                slayer.spawned = false;
            }
        });

    });
    if (slayerHud.visible && Date.now() - slayerHud.lastUpdateTime > 300000) {
        resetSlayerHud();
    }
}).setFps(3);

register("renderOverlay", () => {
    if (Settings.slayerHud && slayerHud.visible && slayerHud.text !== "") {
        if (Math.random() < 0.01) slayerHud.x = (data = JSON.parse(FileLib.read("Scall", ".data.json"))["SlayerHUD"]).x, slayerHud.y = data.y;
        let lines = slayerHud.text.split("\n");
        let width = Math.max(...lines.map(line => Renderer.getStringWidth(removeFormatting(line)))) + 8;
        let height = (lines.length * 10) + 6;
        let elapsedTime = (Date.now() - slayerHud.sessionStartTime) / 1000;
        lines[lines.length - 1] = `&r&7Session time: &r&d${secondsToMessage(elapsedTime)}`;
        Renderer.drawRect(Renderer.color(0, 0, 0, 128), slayerHud.x - 5, slayerHud.y - 5, width, height);
        lines.forEach((line, index) => {
            Renderer.drawString(line, slayerHud.x, slayerHud.y + (index * 10));
        });
    }
});

register("chat", (slayerType, level, neededExp, event) => {
    if (Settings.slayerHud) {
        try {
            let Avg = null, Best = null, killUntilLvlText = "", killUntilLvl = null, _xpText, _level = stringToNumber(level), _neededExp = stringToNumber(neededExp);
            if (!slayerHud.visible) slayerHud.visible = true;
            if (slayerHud.sessionStartTime === null) slayerHud.sessionStartTime = Date.now();
            if (slayerHud.nextLvlExpReq === 0) slayerHud.nextLvlExpReq = _neededExp;
            if (slayerHud.wholeLvlExp === null) slayerHud.wholeLvlExp = GAINS[slayerType].needed[_level+1];
            if (slayerHud.sessionKills === 1) {
                slayerHud.currentGain = slayerHud.nextLvlExpReq - _neededExp;
                slayerHud.sessionExpGain += slayerHud.currentGain * 2;
                _xpText = `&r&7Session EXP: &r&d${addCommas(slayerHud.sessionExpGain)}`;
                slayerHud.bossTimes.push(Date.now() - slayerHud.lastTimeBoss);
                Best = secondsToMessage(Math.min(...slayerHud.bossTimes)  / 1000);
                Avg = secondsToMessage(slayerHud.bossTimes.reduce((a, b) => a + b, 0) / slayerHud.bossTimes.length / 1000);
                killUntilLvl = Math.ceil(_neededExp / slayerHud.currentGain);
                killUntilLvlText = `(${killUntilLvl} Kills)`;
            } else if (slayerHud.sessionKills > 1) {
                slayerHud.sessionExpGain += slayerHud.currentGain;
                slayerHud.bossTimes.push(Date.now() - slayerHud.lastTimeBoss);
                slayerHud.lastTimeBoss = Date.now();
                _xpText = `&r&7Session EXP: &r&d${addCommas(slayerHud.sessionExpGain)}`;
                Avg = secondsToMessage(slayerHud.bossTimes.reduce((a, b) => a + b, 0) / slayerHud.bossTimes.length / 1000);
                Best = secondsToMessage(Math.min(...slayerHud.bossTimes) / 1000);
                killUntilLvl = Math.ceil(_neededExp / slayerHud.currentGain);
                killUntilLvlText = `(${killUntilLvl} Kills)`;
            } else if (slayerHud.sessionKills === 0) {
                _xpText = "&r&7Session EXP: &cNeed more data (1)";
                _xpHourText = "&r&7EXP/h: &cNeed more data (1)";
                slayerHud.lastTimeBoss = Date.now();
                Best = "&cNeed more data (1)";
                Avg = "&cNeed more data (1)";
            }
            let _ETA
            if (slayerHud.sessionKills < 3) _ETA = `&cNeed more data (${3 - (slayerHud.sessionKills + 1) + 1 })`;
            else if (slayerHud.sessionKills >= 3) _ETA = secondsToMessage(Math.round(_neededExp / slayerHud.gainPerHour * 3600));
            slayerHud.sessionKills++;
            slayerHud.slayerType = slayerType;
            slayerHud.lastUpdateTime = Date.now();
            let elapsedTime = (Date.now() - slayerHud.sessionStartTime) / 1000;
            let expPerHour = slayerHud.sessionExpGain / elapsedTime * 3600;
            if (slayerHud.sessionKills >= 2) _xpHourText = `&r&7EXP/h: &r&d${addCommas(Math.round(expPerHour))}`;
            slayerHud.gainPerHour = expPerHour;
            slayerHud.nextLvlEta = Math.round(_neededExp / expPerHour * 3600);
            let currrentBossXp = slayerHud.wholeLvlExp - _neededExp;
            if (slayerHud.sessionKills > 2 && !slayerHud.resetNext && killUntilLvl === 1) slayerHud.resetNext = true;
            if (slayerHud.resetNext &&  slayerHud.sessionKills > 2) {
                resetSlayerHud();
                ChatLib.chat("&r&7[&r&b&lSCALL&r&7] &r&cSeems like you are done with this level, resetting the HUD.");
            }
            slayerHud.text = `&r      &4&l☠ &2&l${slayerType} Slayer LVL ${_level}&r
${_xpText}
${_xpHourText}
&r&7Next LVL in &r&d${addCommas(_neededExp)} XP ${killUntilLvlText}&r
&r&7Progress: &r&d${addCommas(currrentBossXp)}&r&7/&r&d${addCommas(slayerHud.wholeLvlExp)} (${Math.round(currrentBossXp / slayerHud.wholeLvlExp * 100)}%)&r
&r&7ETA: &r&d${_ETA}&r
&r&7Kills: &r&d${slayerHud.sessionKills}&r
&r&7Best Time: &r&d${Best}&r
&r&7Average Time: &r&d${Avg}&r
&r&7Session time: &r&d${secondsToMessage(elapsedTime)}`;
        } catch (e) {
            console.error("[SCALL] ", e);
        }
    }
}).setCriteria(/&r   &r&e(.*) Slayer LVL ([1-9]) &r&5- &r&7Next LVL in &r&d(\S*) XP&r&7!&r/g);