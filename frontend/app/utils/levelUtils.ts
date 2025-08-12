const getCurrentCost = (level: number) => {
    if(level < 6) { return 25; }
    else if(level < 11) { return 50; }
    else if(level < 21) { return 100; }
    else if(level < 31) { return 200; }
    else if(level < 51) { return 250; }
    else if(level < 76) { return 500; }
    else if(level < 100) { return 750; }
    else { return 1000; };
} 

export const getLevel = (xp: number) => {
    let currentLevel = 1
    let currentCost = 25
    let leftToNext = 0;
    while(xp >= currentCost) {
        xp -= currentCost
        currentLevel++
        currentCost = getCurrentCost(currentLevel)
    }
    const progress = Math.floor((xp / currentCost) * 100)
    leftToNext = currentCost - xp
    return {"level": currentLevel, "progress": progress, "left": leftToNext}
} 



// levels 1-5 : 25XP each needed
// levels 5-10 : 50XP each neededF
// levels 10-20 : 100XP each needed
// levels 20-30 : 200XP each needed
// levels 30-50 : 250XP each needed
// levels 50-75 : 500XP each needed
// levels 75-100 : 750XP each needed
// levels 100+: 1000XP each needed