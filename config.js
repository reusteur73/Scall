import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty, @TextProperty, @ColorProperty, Color } from "../Vigilance/index"
import PogObject from "../PogData";
import ScalableGui from "../BloomCore/utils/ScalableGui";


@Vigilant("Scall", "Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Powders Trackers", "Slayers"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    @SwitchProperty({
        name: "firstRun",
        description: "state of the first run",
        category: "General",
        hidden: true,
    })
    firstRun = false;

    // CHAT
    @SwitchProperty({
        name: "Hide pristine",
        description: "Disable pristine messages",
        category: "General",
        subcategory: "Chat"
    })
    hidePristine = false;

    // Pristine
    @SwitchProperty({
        name: "High Pristine Proc",
        description: "Alert when high pristine proc",
        category: "General",
        subcategory: "Pristine Alert"
    })
    highPristineAlert = false;

    @SliderProperty({
        name: "High Pristine Proc Threshold",
        description: "Alert when pristine proc is higher than this value",
        category: "General",
        subcategory: "Pristine Alert",
        min: 1,
        max: 350,
    })
    highPristineNum = 100;

    @SelectorProperty({
        name: "Alert Type",
        description: "Set chat, sound or title alert (sound is cat meow)",
        category: "General",
        subcategory: "Pristine Alert",
        options: ["Chat", "Sound", "Title"]
    })
    alertType = 1;

    saveData = "";
    
    // Send coords
    @SelectorProperty({
        name: "Send coords Keybind",
        description: "Send coords to chat",
        category: "General",
        subcategory: "Other",
        options: ["None", "LControl", "LShift", "LAlt", "RControl", "RShift", "RAlt", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "n", "m", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y"]
    })
    coordsKeybind = 4;

    @SwitchProperty({
        name: "Copy coords to clipboard",
        description: "Copy coords to clipboard while pressing the above keybind",
        category: "General",
        subcategory: "Other"
    })
    copyCoords = false;

    // Hoppity
    @SwitchProperty({
        name: "Send egg locations",
        description: "Send egg locations in global chat.",
        category: "General",
        subcategory: "Hoppity"
    })
    sendHoppity = false;

    // Powders
    @SwitchProperty({
        name: "&bGlacite Powder Tracker",
        description: "&bEnable Glacite Powder Tracker",
        category: "Powders Trackers",
        subcategory: "Glacite"
    })
    glacitePowderTracker = true;

    @ButtonProperty({
        name: "&bMove Glacite Powder Tracker HUD",
        description: "&bSet the position of the Glacite Powder Tracker HUD",
        category: "Powders Trackers",
        subcategory: "Glacite",
        placeholder: "Move"
    })
    moveGlaciteTrackerHUD() {
        const GlaciteGuiData = new PogObject("Scall", {
            GlaciteTracker: {
                x: 0,
                y: 0, 
                scale: 1 
            }
        })
        const editGui = new ScalableGui(GlaciteGuiData, GlaciteGuiData.GlaciteTracker)
        editGui.onRender(() => {
            const myString = `Glacite Powder: 1,000,000\nTotal Gains: 100,000\nGains per Minute: 5,000`;
            Renderer.translate(editGui.getX(), editGui.getY())
            Renderer.scale(editGui.getScale())
            Renderer.drawString(myString, 0, 0)
        })
        editGui.open()
    }

    @SliderProperty({
        name: "&bReset Glacite After",
        description: "&bHide and reset Glacite Powder Tracker after x seconds",
        category: "Powders Trackers",
        subcategory: "Glacite",
        min: 1,
        max: 600,
    })
    resetGlaciteAfter = 90;

    @SwitchProperty({
        name: "&dGemstone Powder Tracker",
        description: "&dEnable Gemstone Powder Tracker",
        category: "Powders Trackers",
        subcategory: "Gemstone"
    })
    gemstonePowderTracker = true;

    @ButtonProperty({
        name: "&dMove Gemstone Powder Tracker HUD",
        description: "&dSet the position of the Gemstone Powder Tracker HUD",
        category: "Powders Trackers",
        subcategory: "Gemstone",
        placeholder: "Move"
    })
    moveGemstoneTrackerHUD() {
        const GemstoneGuiData = new PogObject("Scall", {
            GemstoneTracker: {
                x: 0,
                y: 0,
                scale: 1
            }
        })
        const editGui = new ScalableGui(GemstoneGuiData, GemstoneGuiData.GemstoneTracker)
        editGui.onRender(() => {
            const myString = `Gemstone Powder: 1,000,000\nTotal Gains: 100,000\nGains per Minute: 5,000`;
            Renderer.translate(editGui.getX(), editGui.getY())
            Renderer.scale(editGui.getScale())
            Renderer.drawString(myString, 0, 0)
        })
        editGui.open()
    }
    
    @SliderProperty({
        name: "&dReset Gemstone After",
        description: "&dHide and reset Gemstone Powder Tracker after x seconds",
        category: "Powders Trackers",
        subcategory: "Gemstone",
        min: 1,
        max: 600,
    })
    resetGemstoneAfter = 90;

    @SwitchProperty({
        name: "&dHide Gemstone Loot Chest",
        description: "&dHide common loot from chest to avoid spam (still shows powder and rare loot)",
        category: "Powders Trackers",
        subcategory: "Gemstone"
    })
    hideGemstoneLootChest = true;

    @SwitchProperty({
        name: "&2Mithril Powder Tracker",
        description: "&2Enable Mithril Powder Tracker",
        category: "Powders Trackers",
        subcategory: "Mithril"
    })
    mithrilPowderTracker = true;

    @ButtonProperty({
        name: "&2Move Mithril Powder Tracker HUD",
        description: "&2Set the position of the Mithril Powder Tracker HUD",
        category: "Powders Trackers",
        subcategory: "Mithril",
        placeholder: "Move"
    })
    moveMithrilTrackerHUD() {
        const MithrilGuiData = new PogObject("Scall", {
            MithrilTracker: {
                x: 0,
                y: 0,
                scale: 1
            }
        })
        const editGui = new ScalableGui(MithrilGuiData, MithrilGuiData.MithrilTracker)
        editGui.onRender(() => {
            const myString = `Mithril Powder: 1,000,000\nTotal Gains: 100,000\nGains per Minute: 5,000`;
            Renderer.translate(editGui.getX(), editGui.getY())
            Renderer.scale(editGui.getScale())
            Renderer.drawString(myString, 0, 0)
        })
        editGui.open()
    }
    


    @SliderProperty({
        name: "&2Reset Mithril After",
        description: "&2Hide and reset Mithril Powder Tracker after x seconds",
        category: "Powders Trackers",
        subcategory: "Mithril",
        min: 1,
        max: 600,
    })
    resetMithrilAfter = 90;

    // Other
    @SwitchProperty({
        name: "Debug",
        description: "Enable debug messages",
        category: "General",
        subcategory: "Debug"
    })
    debug = false;

    // Slayers
    @SwitchProperty({
        name: "Slayer Progress HUD",
        description: "Show slayer progress HUD",
        category: "Slayers",
        subcategory: "HUD"
    })
    slayerHud = true;

    @ButtonProperty({
        name: "Move Slayer HUD",
        description: "Set the position of the Slayer HUD",
        category: "Slayers",
        subcategory: "HUD",
        placeholder: "Move"
    })
    moveSlayerHUD() {
        const SlayerGuiData = new PogObject("Scall", {
            SlayerHUD: {
                x: 0,
                y: 0,
                scale: 1
            }
        })
        const editGui = new ScalableGui(SlayerGuiData, SlayerGuiData.SlayerHUD)
        editGui.onRender(() => {
            const myString = `Revenant Horror: 0/100\nSven Packmaster: 0/100\nBlood Father: 0/100`;
            Renderer.translate(editGui.getX(), editGui.getY())
            Renderer.scale(editGui.getScale())
            Renderer.drawString(myString, 0, 0)
        }
        )
        editGui.open()
    }


    @SwitchProperty({
        name: "Slayers Spawn Party Alert",
        description: "Send message in &1&lparty chat&r when a slayer boss spawns",
        category: "Slayers",
        subcategory: "Partying / Alerts / Waypoints"
    })
    messageOnSlayerSpawn = false;

    @SwitchProperty({
        name: "Display Own Waypoints",
        description: "Display your own waypoints",
        category: "Slayers",
        subcategory: "Partying / Alerts / Waypoints"
    })
    displayOwnWaypoints = false;

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", `&a&l[&b&lSCALL&a&l]&r &bv${JSON.parse(FileLib.read("Scall", "metadata.json")).version}` + 
        `\n&aBy &4&lReuS_V2`);
    }
}


export default new Settings();