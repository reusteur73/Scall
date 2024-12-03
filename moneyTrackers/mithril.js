import request from "../../requestV2";
import Settings from "../config";
import { secondsToMessage, removeFormatting, addCommas, formatPercentage } from "../functions";

let mithrilMatrice = [
    {name: "Mithril",id: "MITHRIL_ORE", sellPrice: null, roughEq: 1},
    {name: "Enchanted Mithril",id: "ENCHANTED_MITHRIL", sellPrice: null, roughEq: 160},
    {name: "Refined Mithril",id: "REFINED_MITHRIL", sellPrice: null, roughEq: 25600},
];

let mithrilTracker;
resetMithrilTracker();

export function addValuesToMithrilTracker(type, amount){
    let name = mithrilMatrice.find(e => e.name === type).id;
    if (mithrilTracker.lastUpdate === null && mithrilTracker.timeUpdated === null && mithrilTracker.trackingId === null) {
        mithrilTracker.sessionTime = Date.now();
        mithrilTracker.lastUpdate = mithrilTracker.sessionTime
        mithrilTracker.timeUpdated = 1;
        mithrilTracker.trackingId = name;
    }
    mithrilTracker.roughEquivalents += amount;
    if(mithrilTracker.lastApiCall === null || Date.now() - mithrilTracker.lastApiCall > (60000*5)) { // refresh prices every 5 minutes
        mithrilTracker.lastApiCall = Date.now();
        request({
            url: "https://api.hypixel.net/skyblock/bazaar",
            json: true
        }).then((response) => {
            mithrilMatrice.forEach(e => {
                e.sellPrice = response.products[e.id].quick_status.buyPrice;
            })
            if (!mithrilTracker.visible && Settings.mithrilTracker && mithrilTracker.timeUpdated > 3) {
                mithrilTracker.visible = true;
            }
            mithrilTracker.timeUpdated++;
            mithrilTracker.lastUpdate = Date.now();
            mithrilTracker.wantedMined =  Math.floor(mithrilTracker.roughEquivalents / mithrilMatrice[Settings.mithrilSellingMethod + 1].roughEq);
            mithrilTracker.progressToWanted = ((mithrilTracker.roughEquivalents / mithrilMatrice[Settings.mithrilSellingMethod + 1].roughEq) * 100).toFixed(2);    
        }).catch(err => {
            console.log("Coin tracker: " + err)
        });
    } else {
        if (!mithrilTracker.visible && Settings.mithrilTracker && mithrilTracker.timeUpdated > 3) {
            mithrilTracker.visible = true;
        }
        mithrilTracker.timeUpdated++;
        mithrilTracker.lastUpdate = Date.now();
        mithrilTracker.wantedMined = Math.floor(mithrilTracker.roughEquivalents / mithrilMatrice[Settings.mithrilSellingMethod + 1].roughEq);
        mithrilTracker.progressToWanted = ((mithrilTracker.roughEquivalents / mithrilMatrice[Settings.mithrilSellingMethod + 1].roughEq) * 100).toFixed(2);
    }
}

function resetMithrilTracker() {
    mithrilTracker = {
        roughEquivalents: 0,
        wantedMined: 0,
        progressToWanted: 0,
        moneyMade: 0,
        moneyPerHour: 0,
        sessionTime: null,
        lastUpdate: null,
        timeUpdated: null,
        trackingId: null,
        visible: false,
        lastApiCall: null,
        x: 0,
        y: 0
    };
}

register("renderOverlay", () => {
    if (Settings.mithrilTracker && mithrilTracker.visible) {
        if (Date.now() - mithrilTracker.lastUpdate > (60000*2)) { resetMithrilTracker(); return; }
        if (Math.random() < 0.01) mithrilTracker.x = (data = JSON.parse(FileLib.read("Scall", ".data.json"))["MithrilCoinTracker"]).x, mithrilTracker.y = data.y;
        let lines = [], elapsedTime = (Date.now() - mithrilTracker.sessionTime) / 1000;
        let wantedEqv = mithrilTracker.roughEquivalents / mithrilMatrice[Settings.mithrilSellingMethod + 1].roughEq;
        mithrilTracker.moneyMade = wantedEqv * mithrilMatrice[Settings.mithrilSellingMethod + 1].sellPrice;
        if (Math.random() < 0.01) mithrilTracker.moneyPerHour = Math.floor(mithrilTracker.moneyMade / ((Date.now() - mithrilTracker.sessionTime) / (1000 * 60 * 60))); 
        lines.push(`     &a&lMithril Tracker&r     `);
        lines.push(`&6&l• Earnings`);
        lines.push(`  &7• Money Made: &e$${addCommas(Math.round(mithrilTracker.moneyMade))}`);
        if (mithrilTracker.moneyPerHour > 0) lines.push(`  &7• Money Per Hour: &e$${addCommas(mithrilTracker.moneyPerHour)}`);
        lines.push(`&6&l• Progress`);
        if (Settings.mithrilSellingMethod === 1) lines.push(`  &7• Progress to ${mithrilMatrice[Settings.mithrilSellingMethod+1].name}: ${formatPercentage(mithrilTracker.progressToWanted)}`);
        lines.push(`  &7• ${mithrilMatrice[Settings.mithrilSellingMethod+1].name} Mined: &e${mithrilTracker.wantedMined}`);
        lines.push(`  &7• Ore Equivalents: &e${addCommas(mithrilTracker.roughEquivalents)}`); 
        lines.push(`&6&l• Session Info`);
        lines.push(`  &7• Elapsed Time: &e${secondsToMessage(elapsedTime)}`);
        lines.push(`  &7• Sell Method: &e${mithrilMatrice[Settings.mithrilSellingMethod +1].name}`);

        let width = Math.max(...lines.map(line => Renderer.getStringWidth(removeFormatting(line)))) + 24;
        let height = (lines.length * 10) + 6;

        Renderer.drawRect(Renderer.color(0, 0, 0, 128), mithrilTracker.x - 5, mithrilTracker.y - 5, width, height);
        lines.forEach((line, index) => {
            Renderer.drawString(line, mithrilTracker.x, mithrilTracker.y + (index * 10));
        });
    }
});