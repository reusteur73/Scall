if(!GlStateManager) {
    var GL11=Java.type("org.lwjgl.opengl.GL11")
    var GlStateManager=Java.type("net.minecraft.client.renderer.GlStateManager")
}

/**
 * Get the area of the player.
 * @returns {string} The area of the player.
 */
export function getArea() {
    try {
        const lines = TabList.getNames();
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("Area:")) {
                return lines[i].replace(/§./g, "").split("Area:")[1].trim();
            }
        }
        return "Unknown";
    } catch (error) {
        return "Unknown";
    }
}

/**
 * This contains a value "drawState", this dictates whether or not this draw or not. Default to 0. Check for 1 in a "renderOverlay" to draw. (must set to draw.)
 * @returns
 */
export class Title
{
    /**
     *
     * @param {{text: string, scale: number, time: number, yOffset: number, xOffset: number}} param0
     */
    constructor({text, scale = 5, time = 3000, yOffset = 0, xOffset = 0})
    {
        this.text = text
        this.scale = scale
        this.time = time
        this.yOffset = yOffset
        this.xOffset = xOffset
        this.drawState = 0
        this.drawing = false

        register("renderOverlay", () => {
            this.drawing = false
            if(this.drawState == 1)
            {
                this.drawing = true

                const title = new Text(this.text,
                    Renderer.screen.getWidth()/2 + this.xOffset,
                    Renderer.screen.getHeight()/2 - Renderer.screen.getHeight()/14 + this.yOffset
                )
                if(this.drawTimestamp == undefined)
                {
                    this.drawTimestamp = Date.now()
                    this.drawState = 1
                }
                else if (Date.now() - this.drawTimestamp > this.time)
                {
                    this.drawTimestamp = undefined
                    this.drawState = 2
                }
                else
                {
                    title.setAlign("CENTER")
                    .setShadow(true)
                    .setScale(this.scale)
                    .draw()
                    this.drawState = 1
                }
            }
        })
    }

    draw()
    {
        this.drawState = 1
    }

    isDrawing()
    {
        return this.drawing
    }
}

/**
 * Adds commas to the number.
 * @param {Number} num
 * @returns
 */
export function addCommas(num) {
    try {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } catch (error) {
        return 0
    }
}

/**
 * Convert string to a number.
 * @param {*} string 
 * @returns Number
 */
export function stringToNumber(string) {
    return parseInt(string.replace(/,/g, ""));
}

/**
 * Converts seconds to a standard message.
 * @param {Number} seconds
 * @returns String
 */
export function secondsToMessage(seconds)
{
    let hour = Math.floor(seconds/60/60)
    if(hour < 1)
        return `${Math.floor(seconds/60)}m ${Math.floor(seconds%60)}s`
    else
        return `${hour}h ${Math.floor(seconds/60) - hour*60}m`
}

/**
 * Get key from string
 * @param {String} key
 * @returns
 */
export function getKey(key){
    switch (key) {
        case "None":
            return 0
        case "a":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_A, "Coords KeyBind");
        case "b":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_B, "Coords KeyBind");
        case "c":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_C, "Coords KeyBind");
        case "d":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_D, "Coords KeyBind");
        case "e":
            return Client.getKeyBindFromKey(Keyboard.KEY_E, "Coords KeyBind");
        case "f":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_F, "Coords KeyBind");
        case "g":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_G, "Coords KeyBind");
        case "h":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_H, "Coords KeyBind");
        case "i":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_I, "Coords KeyBind");
        case "j":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_J, "Coords KeyBind");
        case "k":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_K, "Coords KeyBind");
        case "l":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_L, "Coords KeyBind");
        case "m":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_M, "Coords KeyBind");
        case "n":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_N, "Coords KeyBind");
        case "o":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_O, "Coords KeyBind");
        case "p":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_P, "Coords KeyBind");
        case "q":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_Q, "Coords KeyBind");
        case "r":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_R, "Coords KeyBind");
        case "s":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_S, "Coords KeyBind");
        case "t":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_T, "Coords KeyBind");
        case "u":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_U, "Coords KeyBind");
        case "v":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_V, "Coords KeyBind");
        case "w":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_W, "Coords KeyBind");
        case "x":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_X, "Coords KeyBind");
        case "y":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_Y, "Coords KeyBind");
        case "z":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_Z, "Coords KeyBind");
        case "LControl":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_LCONTROL, "Coords KeyBind");
        case "LShift":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_LSHIFT, "Coords KeyBind");
        case "LAlt":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_LMENU, "Coords KeyBind");
        case "RControl":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_RCONTROL, "Coords KeyBind");
        case "RShift":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_RSHIFT, "Coords KeyBind");
        case "RAlt":
            return keyBind = Client.getKeyBindFromKey(Keyboard.KEY_RMENU, "Coords KeyBind");
        default:
            return 0


    }
}

/**
 * Removes Minecraft formatting from text.
 * @param {String} text The text to remove formatting from.
 * @returns {string} The text without formatting.
 */
export function removeFormatting(text) {
    if (text.includes("§")) {
        return text.replace(/§./g, "");
    } else if (text.includes("&")) {
        return text.replace(/&./g, "");
    } else {
        return text;
    }
}

export function getSackAddedValue(siblings) {
    let items = {};
    let amount = 0;
    siblings.forEach((line) => {
        if (line.text.trim() === "" || line.text.includes("Sack)") || line.text.includes("settings")) return;
        if (line.text.includes("+")) amount = stringToNumber(line.text.split("+")[1].trim());
        else items[line.text.trim()] = amount;
    });
    return items;
}

export function formatPercentage(percentage) {
    let color;
    if (percentage < 34) {
        color = "&c";
    } else if (percentage < 67) {
        color = "&e"; 
    } else {
        color = "&a"; 
    }
    return `${color}${percentage}%`;
}
