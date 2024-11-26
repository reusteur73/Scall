//import axios from "../axios"
/// <reference types="../CTAutocomplete" />
import Settings from "./config"
import { Title, getKey } from "./functions";
import "./powdersTrackers"
import "./hoppity"
import "./slayers"

const prefix = '&a&l[&b&lSCALL&a&l]&r';

// Pristine Hider
register('chat', (messag, event) => {
  if (Settings.hidePristine) {
    return cancel(event);
  }
}).setCriteria(/PRISTINE! You found (.+)/);

// Open GUI
register("command", () => Settings.openGUI()).setName("scall").setAliases(["sc"]);

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

register("step", () => {
  if(Settings.coordsKeybind > 0) {
    const options = ["None", "LControl", "LShift", "LAlt", "RControl", "RShift", "RAlt", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "n", "m", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y"]
    if (getKey(options[Settings.coordsKeybind]).isPressed()) {
      const coords = Math.round(Player.getX()) + " " + Math.round(Player.getY()) + " " + Math.round(Player.getZ());
      ChatLib.say("[SC] " + coords);
      if (Settings.copyCoords) { // COPY TO CLIPBOARD
        Java.type("net.minecraft.client.gui.GuiScreen").func_146275_d(coords);
      }
    }
  }
});