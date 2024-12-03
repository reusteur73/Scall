import request from "../../requestV2";
import Settings from "../config";
import { secondsToMessage, removeFormatting, addCommas, formatPercentage } from "../functions";


let gemstonesPrices = {Flawed: {}, Rough: {}, Fine: {}, Flawless: {}, Perfect: {}};
let gemstoneTracker;
let gemMatrice = {
    0: {name: "Flawed", roughEq: 80},
    1: {name: "Fine", roughEq: 6400},
    2: {name: "Flawless", roughEq: 512000},
    3: {name: "Perfect", roughEq: 2560000}
};
resetGemstoneTracker();

export function addValuesToGemTracker(gem, type, amount){
    let name;
    if (type === "Flawed") { amount *= 80; name = `FLAWED_${gem.toUpperCase()}_GEM` }
    else name = `ROUGH_${gem.toUpperCase()}_GEM`;
    
    if (gemstoneTracker.lastUpdate === null && gemstoneTracker.timeUpdated === null && gemstoneTracker.gemTracking === null) {
        gemstoneTracker.sessionTime = Date.now();
        gemstoneTracker.lastUpdate = gemstoneTracker.sessionTime
        gemstoneTracker.timeUpdated = 1;
        gemstoneTracker.gemTracking = gem;
    } else if (gemstoneTracker.gemTracking !== gem) {
        return; // skipping to prevent wrong stats
    }
    gemstoneTracker.roughEquivalents += amount;
    if(gemstoneTracker.lastApiCall === null || Date.now() - gemstoneTracker.lastApiCall > (60000*5)) { // refresh prices every 5 minutes
        gemstoneTracker.lastApiCall = Date.now();
        request({
            url: "https://api.hypixel.net/skyblock/bazaar",
            json: true
        }).then((response) => {
            Object.keys(response.products).forEach(i => {
                if (i.startsWith("FLAWED_")) gemstonesPrices.Flawed[i] = Settings.gemstoneNpcPrice ? 240 : Math.max(240, response.products[i].quick_status.buyPrice);
                else if(i.startsWith("FINE_")) gemstonesPrices.Fine[i] = Settings.gemstoneNpcPrice ? 19200 : Math.max(19200, response.products[i].quick_status.buyPrice);
                else if(i.startsWith("FLAWLESS_")) gemstonesPrices.Flawless[i] = Settings.gemstoneNpcPrice ? 1536000 : Math.max(1536000, response.products[i].quick_status.buyPrice);
                else if(i.startsWith("PERFECT_")) gemstonesPrices.Perfect[i] = Settings.gemstoneNpcPrice ? 10240000 : Math.max(10240000, response.products[i].quick_status.buyPrice);
            })         
            if (!gemstoneTracker.visible && Settings.gemstoneTracker && gemstoneTracker.timeUpdated > 3) {
                gemstoneTracker.visible = true;
            }
            gemstoneTracker.timeUpdated++;
            gemstoneTracker.lastUpdate = Date.now();
            gemstoneTracker.wantedMined =  Math.floor(gemstoneTracker.roughEquivalents / gemMatrice[Settings.gemstoneSellingMethod].roughEq);
            gemstoneTracker.progressToWanted = ((gemstoneTracker.roughEquivalents / gemMatrice[Settings.gemstoneSellingMethod].roughEq) * 100).toFixed(2);    
        }).catch(err => {
            console.log("Coin tracker: " + err)
        });
    } else {
        if (!gemstoneTracker.visible && Settings.gemstoneTracker && gemstoneTracker.timeUpdated > 3) {
            gemstoneTracker.visible = true;
        }
        gemstoneTracker.timeUpdated++;
        gemstoneTracker.lastUpdate = Date.now();
        gemstoneTracker.wantedMined = Math.floor(gemstoneTracker.roughEquivalents / gemMatrice[Settings.gemstoneSellingMethod].roughEq);
        gemstoneTracker.progressToWanted = ((gemstoneTracker.roughEquivalents / gemMatrice[Settings.gemstoneSellingMethod].roughEq) * 100).toFixed(2);
    }
}

function resetGemstoneTracker(){
    gemstoneTracker = {
        sessionTime: 0,
        lastUpdate: null,
        timeUpdated: null,
        roughEquivalents: 0,
        progressToWanted: 0,
        wantedMined: 0,
        moneyMade: 0,
        moneyPerHour: 0,
        gemTracking: null,
        visible: false,
        x: 0,
        y: 0,
        lastApiCall: null
    };
}

register("renderOverlay", () => {
    if (gemstoneTracker.visible) {
        if (Date.now() - gemstoneTracker.lastUpdate > (60000*2)) { resetGemstoneTracker(); return; }
        if (Math.random() < 0.01) gemstoneTracker.x = (data = JSON.parse(FileLib.read("Scall", ".data.json"))["GemstoneCoinTracker"]).x, gemstoneTracker.y = data.y;
        let lines = [], elapsedTime = (Date.now() - gemstoneTracker.sessionTime) / 1000;
        let wantedEqv = gemstoneTracker.roughEquivalents / gemMatrice[Settings.gemstoneSellingMethod].roughEq;
        gemstoneTracker.moneyMade = wantedEqv * gemstonesPrices[gemMatrice[Settings.gemstoneSellingMethod].name][`${gemMatrice[Settings.gemstoneSellingMethod].name.toUpperCase()}_${gemstoneTracker.gemTracking.toUpperCase()}_GEM`];
        if (Math.random() < 0.01) gemstoneTracker.moneyPerHour = Math.floor(gemstoneTracker.moneyMade / ((Date.now() - gemstoneTracker.sessionTime) / (1000 * 60 * 60))); 
        lines.push(`     &a&l${gemstoneTracker.gemTracking} Gemstone Tracker&r     `);
        lines.push(`&6&l• Earnings`);
        lines.push(`  &7• Money Made: &e$${addCommas(Math.round(gemstoneTracker.moneyMade))}`);
        if (gemstoneTracker.moneyPerHour > 0) lines.push(`  &7• Money Per Hour: &e$${addCommas(gemstoneTracker.moneyPerHour)}`);
        lines.push(`&6&l• Progress`);
        lines.push(`  &7• Progress to ${gemMatrice[Settings.gemstoneSellingMethod].name}: ${formatPercentage(gemstoneTracker.progressToWanted)}`);
        lines.push(`  &7• ${gemMatrice[Settings.gemstoneSellingMethod].name} Mined: &e${gemstoneTracker.wantedMined}`);
        lines.push(`  &7• Rough Equivalents: &e${addCommas(gemstoneTracker.roughEquivalents)}`); 
        lines.push(`&6&l• Session Info`);
        lines.push(`  &7• Elapsed Time: &e${secondsToMessage(elapsedTime)}`);
        lines.push(`  &7• Sell Method: &e${gemMatrice[Settings.gemstoneSellingMethod].name}`);

        let width = Math.max(...lines.map(line => Renderer.getStringWidth(removeFormatting(line)))) + 24;
        let height = (lines.length * 10) + 6;

        Renderer.drawRect(Renderer.color(0, 0, 0, 128), gemstoneTracker.x - 5, gemstoneTracker.y - 5, width, height);
        lines.forEach((line, index) => {
            Renderer.drawString(line, gemstoneTracker.x, gemstoneTracker.y + (index * 10));
        });
    }
});
