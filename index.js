//import axios from "../axios"
/// <reference types="../CTAutocomplete" />
import Settings from "./config"
import { getKey } from "./functions";
import "./powdersTrackers"
import "./hoppity"
import "./slayers"
import "./moneyTrackers/index"

const prefix = '&a&l[&b&lSCALL&a&l]&r';

// Open GUI
register("command", () => Settings.openGUI()).setName("scall").setAliases(["sc"]);

register("step", () => {
  if(Settings.coordsKeybind > 0) {
    const options = ["None", "LControl", "LShift", "LAlt", "RControl", "RShift", "RAlt", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "n", "m", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y"]
    if (getKey(options[Settings.coordsKeybind]).isPressed()) {
      let x = Math.round(Player.getX());
      let y = Math.round(Player.getY());
      let z = Math.round(Player.getZ());
      const coords = Math.round(x) + " " + Math.round(y) + " " + Math.round(z);
      const scall_format = " x: " + x + " | y: " + y + " | z: " + z;
      ChatLib.say("[SCALL] " + Player.getName() + " "+ scall_format + " (" + coords + ")");
      if (Settings.copyCoords) { // COPY TO CLIPBOARD
        Java.type("net.minecraft.client.gui.GuiScreen").func_146275_d(coords);
      }
    }
  }
});