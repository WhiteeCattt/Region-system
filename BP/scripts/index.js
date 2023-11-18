import { world, system } from "@minecraft/server";
import { JsonDatabase } from "./database.js";
import config from "./config.js"
console.warn(`§l[Region add-on] §aReloaded!§r`)
const db = new JsonDatabase("DB:Region").load()
const RegionBlocks = config.RegionBlocks

if (db.get(`Regions`) === undefined) {
    db.set(`Regions`, [])
}


/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function getPlayerRegions(player) {
    //Количество регионов игрока
    let allPlayerRegions = 0
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i].owner == player.name) {
            allPlayerRegions++
        }
    }
    return allPlayerRegions;
}


/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function getDim(dimension) {
    if (dimension == "minecraft:overworld") {
        return "§aВерхний мир"
    }
    if (dimension == "minecraft:nether") {
        return "§cАдский мир"
    }
    if (dimension == "minecraft:the_end") {
        return "§5Край"
    }
    return undefined;
}


/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function nearRegions(RegionData) {
    //Проверяет, пересикает ли блок региона установленный игроком другой регион
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        const rg = db.get(`Regions`)[i];
        for (const RegionBlock of Object.keys(RegionBlocks)) {
            if (RegionBlock == RegionData.type) {
                if (
                    (rg.x1 + RegionBlocks[RegionBlock].x) <= RegionData.x &&
                    rg.x2 + RegionBlocks[RegionBlock].x >= RegionData.x &&
                    rg.y1 + RegionBlock.y <= RegionData.y &&
                    rg.y2 + RegionBlocks[RegionBlock].y >= RegionData.y &&
                    rg.z1 + RegionBlocks[RegionBlock].z <= RegionData.z &&
                    rg.z2 + RegionBlocks[RegionBlock].z >= RegionData.z &&
                    rg.dimension == RegionData.dimension) {
                        return db.get(`Regions`)[i];
                    }
                if (
                    (rg.x1 - RegionBlocks[RegionBlock].x) <= RegionData.x &&
                    rg.x2 - RegionBlocks[RegionBlock].x >= RegionData.x &&
                    rg.y1 - RegionBlocks[RegionBlock].y <= RegionData.y &&
                    rg.y2 - RegionBlocks[RegionBlock].y >= RegionData.y &&
                    rg.z1 - RegionBlocks[RegionBlock].z <= RegionData.z &&
                    rg.z2 - RegionBlocks[RegionBlock].z >= RegionData.z &&
                    rg.dimension == RegionData.dimension) {
                        return db.get(`Regions`)[i];
                    }
                if (
                    (rg.x1 - RegionBlocks[RegionBlock].x) <= RegionData.x &&
                    rg.x2 + RegionBlocks[RegionBlock].x >= RegionData.x &&
                    rg.y1 - RegionBlocks[RegionBlock].y <= RegionData.y &&
                    rg.y2 + RegionBlocks[RegionBlock].y >= RegionData.y &&
                    rg.z1 - RegionBlocks[RegionBlock].z <= RegionData.z &&
                    rg.z2 + RegionBlocks[RegionBlock].z >= RegionData.z &&
                    rg.dimension == RegionData.dimension) {
                        return db.get(`Regions`)[i];
                    }
            }
        }
    }
    return undefined;
}


/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function checkRegion(pos) {
    //Проверяет, находится ли игрок в регионе
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i].x1 <= pos.x && db.get(`Regions`)[i].x2 >= pos.x && db.get(`Regions`)[i].y1 <= pos.y && db.get(`Regions`)[i].y2 >= pos.y && db.get(`Regions`)[i].z1 <= pos.z && db.get(`Regions`)[i].z2 >= pos.z && db.get(`Regions`)[i].dimension == pos.dimension) {
            return db.get(`Regions`)[i]
        }
    }
    return undefined;
}



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.afterEvents.playerPlaceBlock.subscribe((data) => {
    const { player, block } = data;
    let isRegionBlock;
    for (const RegionBlock of Object.keys(RegionBlocks)) {
        if (RegionBlock == block.typeId) {
            isRegionBlock = true
        }
    }
    if (!player.isSneaking && isRegionBlock) {
        if (getPlayerRegions(player) >= config.maxRegions) return player.sendMessage(config.prefix + `У вас максимальное количество регионов (${getPlayerRegions(player)}/${config.maxRegions})!`),
        player.runCommandAsync(`setblock ${block.location.x} ${block.location.y} ${block.location.z} air`),
        player.runCommandAsync(`give @s ${block.typeId?.replace("minecraft:", "")}`);
        const RegionData = {
        x: block.location.x,
        y: block.location.y,
        z: block.location.z,
        dimension: player.dimension.id,
        type: block.typeId
        }
        if (nearRegions(RegionData)) {
            player.sendMessage(config.prefix + `Вы пересикаете другой регион!`)
            player.runCommandAsync(`setblock ${block.location.x} ${block.location.y} ${block.location.z} air`)
            player.runCommandAsync(`give @s ${block.typeId?.replace("minecraft:", "")}`)
        } else {
            createRegion(player, block)
        }
    }
});



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function createRegion(player, block) {
    for (const RegionBlock of Object.keys(RegionBlocks)) {
        if (RegionBlock == block.typeId) {
            const dataSave = {
                owner: player.name,
                access: [],
                x1: block.location.x - RegionBlocks[RegionBlock].x,
                x2: block.location.x + RegionBlocks[RegionBlock].x,
                y1: block.location.y - RegionBlocks[RegionBlock].y,
                y2: block.location.y + RegionBlocks[RegionBlock].y,
                z1: block.location.z - RegionBlocks[RegionBlock].z,
                z2: block.location.z + RegionBlocks[RegionBlock].z,
                dimension: player.dimension.id,
                Coords: {
                    x: block.location.x,
                    y: block.location.y,
                    z: block.location.z
                },
                type: block.typeId
            }
            let regions = []
            regions = db.get(`Regions`)
            regions.push(dataSave)
            db.set(`Regions`, regions)
            player.runCommandAsync(`summon floating:text ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.y} ${block.location.x} enter_water "${RegionBlocks[RegionBlock].name} §rрегион\nВладелец: §g${player.name}"`)
            player.sendMessage(config.prefix + `Вы создали регион!`)
            if (config.Lightning == true) {
                player.runCommandAsync(`summon lightning_bolt ${block.location.x} ${block.location.y + 2} ${block.location.z}`)
            }
        }
    }
}



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.beforeEvents.playerBreakBlock.subscribe((data) => {
    const { player: player, block: block } = data
    const pos = {
        x: block.location.x,
        y: block.location.y,
        z: block.location.z,
        dimension: player.dimension.id
    }
    let isRegion;
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i].x1 <= pos.x && db.get(`Regions`)[i].x2 >= pos.x && db.get(`Regions`)[i].y1 <= pos.y && db.get(`Regions`)[i].y2 >= pos.y && db.get(`Regions`)[i].z1 <= pos.z && db.get(`Regions`)[i].z2 >= pos.z && db.get(`Regions`)[i].dimension == player.dimension.id) {
            if (db.get(`Regions`)[i].owner !== player.name && !db.get(`Regions`)[i].access.includes(player.name)) {
                isRegion = true
            }
        }
    }
    if (isRegion) {
        data.cancel = true
        player.sendMessage(`§l§cЭй!§r §7Извините, но вы не можете делать это здесь.`)
    } else {
        for (const RegionBlock of Object.keys(RegionBlocks)) {
            if (RegionBlock == block.typeId) {
                deleteRegion(player, block)
            }
        }
    }
})



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function deleteRegion(player, block) {
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i].owner === player.name &&
        db.get(`Regions`)[i].Coords.x == block.location.x &&
        db.get(`Regions`)[i].Coords.y == block.location.y &&
        db.get(`Regions`)[i].Coords.z == block.location.z) {
            let regions = []
            regions = db.get(`Regions`)
            regions.splice(i, 1)
            db.set(`Regions`, regions)
            player.sendMessage(config.prefix + `Регион удалён!`)
            player.runCommandAsync(`event entity @e[type=floating:text, r=8] text:despawn`)
            if (config.Lightning == true) {
                player.runCommandAsync(`summon lightning_bolt ${block.location.x} ${block.location.y + 2} ${block.location.z}`)
            }
        }
    }
}



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.beforeEvents.itemUseOn.subscribe((data) => {
    const { source: player, block: block } = data
    const pos = {
        x: block.location.x,
        y: block.location.y,
        z: block.location.z,
        dimension: player.dimension.id
    }
    let isRegion;
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i].x1 <= pos.x && db.get(`Regions`)[i].x2 >= pos.x && db.get(`Regions`)[i].y1 <= pos.y && db.get(`Regions`)[i].y2 >= pos.y && db.get(`Regions`)[i].z1 <= pos.z && db.get(`Regions`)[i].z2 >= pos.z && db.get(`Regions`)[i].dimension == player.dimension.id) {
            if (db.get(`Regions`)[i].owner !== player.name && !db.get(`Regions`)[i].access.includes(player.name)  && !player.hasTag(config.adminTag)) {
                isRegion = true
            }
        }
    }
    if (isRegion) {
        data.cancel = true
        player.sendMessage(`§l§cЭй!§r §7Извините, но вы не можете делать это здесь.`)
    }
})



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.beforeEvents.chatSend.subscribe((data) => {
    const { sender: player, message: message } = data
    const args = message.split(" ")
    if (message.startsWith(`${config.pref}rg`)) {
        const pos = {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z,
            dimension: player.dimension.id
        }
        data.cancel = true
        if (args[1] == "info") {
            if (checkRegion(pos) !== undefined) {
                player.sendMessage(config.prefix + `Регион игрока §g${checkRegion(pos).owner}`)
                if (checkRegion(pos).access.length > 0) {
                    player.sendMessage(`${config.prefix}Участники: §g${checkRegion(pos).access.join("§r, §g")}`)
                }
            } else {
                player.sendMessage(config.prefix + `Свободная территория`)
            }
        } else if (args[1] == "add") {
            if (checkRegion(pos) == undefined)  return player.sendMessage(config.prefix + `Вы должны находится в своём регионе!`);
            if (checkRegion(pos).owner !== player.name) return player.sendMessage(config.prefix + `Вы не владелец данного региона!`);
            if (player.name == args[2]) return player.sendMessage(config.prefix + `Вы не можете добавить в регион самого себя!`);
            if (checkRegion(pos).access.includes(args[2])) return player.sendMessage(config.prefix + `Игрок §g${args[2]}§r уже состоит в вашем регионе!`);
            if (!args[2]) return player.sendMessage(config.prefix + `Игрок не найден!`);
            addAccess(player, `${args[2]}`, checkRegion(pos))
            player.sendMessage(config.prefix + `Игрок §g${args[2]}§r добавлен в регион!`)
            const [target] = world.getPlayers({ name: args[2] })
            try {
            target.sendMessage(config.prefix + `Игрок §g${player.name}§r добавил вас в свой регион!`)
            } catch (e) {}
        } else if (args[1] == "kick") {
            if (checkRegion(pos) == undefined)  return player.sendMessage(config.prefix + `Вы должны находится в своём регионе!`);
            if (checkRegion(pos).owner !== player.name) return player.sendMessage(config.prefix + `Вы не владелец данного региона!`);
            if (player.name == args[2]) return player.sendMessage(prefix + `Вы не можете кикнуть из региона самого себя!`);
            if (!args[2]) return player.sendMessage(config.prefix + `Игрок не найден!`);
            if (!checkRegion(pos).access.includes(args[2])) return player.sendMessage(config.prefix + `Игрок §g${args[2]}§r не состоит в вашем регионе!`);
            removeAccess(player, `${args[2]}`, checkRegion(pos))
            player.sendMessage(config.prefix + `Игрок §g${args[2]}§r кикнут из региона!`)
            const [target] = world.getPlayers({ name: args[2] })
            try {
            target.sendMessage(config.prefix + `Игрок §g${player.name}§r кикнул вас из региона!`)
            } catch (e) {}
        } else if (args[1] == "help") {
            player.sendMessage(config.prefix + `§g${config.pref}rg help §r- помощь по регионам`)
            player.sendMessage(config.prefix + `§g${config.pref}rg info §r- информация о регионе`)
            player.sendMessage(config.prefix + `§g${config.pref}rg list §r- ваши регионы/участие в регионах`)
            player.sendMessage(config.prefix + `§g${config.pref}rg add <ник> §r- добавить игрока в регионах`)
            player.sendMessage(config.prefix + `§g${config.pref}rg kick <ник> §r- кикнуть игрока из региона`)
        } else if (args[1] == "list") {
            if (listRegions(player).length > 0) {
                player.sendMessage(config.prefix + `Ваши регионы/участие в регионах: `)
                player.sendMessage(config.prefix + `${listRegions(player).join(`\n§r${config.prefix}`)}`)
            } else {
                player.sendMessage(config.prefix + `У вас нет регионов!`)
            }
        } else {
            player.sendMessage(config.prefix + `Не известный аргумент! Используйте §g${config.pref}rg help §rдля помощи!`)
        }
    }
})



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function listRegions(player) {
    let rgs = []
    for (const rg of db.get(`Regions`)) {
        if (rg.owner == player.name || rg.access.includes(player.name)) {
            rgs.push(`Владелец: §g${rg.owner}§r | Координаты: §g${rg.Coords.x.toFixed(0)} ${rg.Coords.y.toFixed(0)} ${rg.Coords.z.toFixed(0)} §r| Мир: §g${getDim(rg.dimension)}`)
        }
    }
    return rgs
}


/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function removeAccess(player, target, rg) {
    //Удалить игрока из региона
    let regions = []
    let accessed = rg.access
    for (let i = 0; i < accessed.length; i++) {
        if (accessed[i].includes(`${target}`)) {
            accessed.splice(i, 1)
        }
    }
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i] !== rg) {
            regions.push({
                owner: db.get(`Regions`)[i].owner,
                access: db.get(`Regions`)[i].access,
                x1: db.get(`Regions`)[i].x1,
                x2: db.get(`Regions`)[i].x2,
                y1: db.get(`Regions`)[i].y1,
                y2: db.get(`Regions`)[i].y2,
                z1: db.get(`Regions`)[i].z1,
                z2: db.get(`Regions`)[i].z2,
                dimension: db.get(`Regions`)[i].dimension,
                Coords: {
                    x: db.get(`Regions`)[i].Coords.x,
                    y: db.get(`Regions`)[i].Coords.y,
                    z: db.get(`Regions`)[i].Coords.z
                },
                type: db.get(`Regions`)[i].type
            })
        }
    }
    const dataSave = {
        owner: rg.owner,
        access: accessed,
        x1: rg.x1,
        x2: rg.x2,
        y1: rg.y1,
        y2: rg.y2,
        z1: rg.z1,
        z2: rg.z2,
        dimension: rg.dimension,
        Coords: {
            x: rg.Coords.x,
            y: rg.Coords.y,
            z: rg.Coords.z
        },
        type: rg.type
    }
    regions.push(dataSave)
    db.set(`Regions`, regions)
}


/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function addAccess(player, target, rg) {
    //Добавить игрока в регион
    let regions = []
    rg.access.push(`${target}`)
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i] !== rg) {
            regions.push({
                owner: db.get(`Regions`)[i].owner,
                access: db.get(`Regions`)[i].access,
                x1: db.get(`Regions`)[i].x1,
                x2: db.get(`Regions`)[i].x2,
                y1: db.get(`Regions`)[i].y1,
                y2: db.get(`Regions`)[i].y2,
                z1: db.get(`Regions`)[i].z1,
                z2: db.get(`Regions`)[i].z2,
                dimension: db.get(`Regions`)[i].dimension,
                Coords: {
                    x: db.get(`Regions`)[i].Coords.x,
                    y: db.get(`Regions`)[i].Coords.y,
                    z: db.get(`Regions`)[i].Coords.z
                },
                type: db.get(`Regions`)[i].type
            })
        }
    }
    const dataSave = {
        owner: rg.owner,
        access: rg.access,
        x1: rg.x1,
        x2: rg.x2,
        y1: rg.y1,
        y2: rg.y2,
        z1: rg.z1,
        z2: rg.z2,
        dimension: rg.dimension,
        Coords: {
            x: rg.Coords.x,
            y: rg.Coords.y,
            z: rg.Coords.z
        },
        type: rg.type
    }
    regions.push(dataSave)
    db.set(`Regions`, regions)
}



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
 */
system.runInterval(() => {
    //Проверяет, есть ли блок на координатах сущности, если нет - удаляет её
    try {
        for (const entity of world.getDimension("overworld").getEntities({ type: "floating:text" })) {
            for (const RegionBlock of Object.keys(RegionBlocks)) {
                if (world.getDimension("overworld").getBlock({
                    x: entity.location.x,
                    y: entity.location.y,
                    z: entity.location.z
                }).typeId == "minecraft:air") {
                    entity.runCommandAsync(`event entity @s text:despawn`)
                }
            }
        }
        for (const entity of world.getDimension("nether").getEntities({ type: "floating:text" })) {
            for (const RegionBlock of Object.keys(RegionBlocks)) {
                if (world.getDimension("overworld").getBlock({
                    x: entity.location.x,
                    y: entity.location.y,
                    z: entity.location.z
                }).typeId == "minecraft:air") {
                    entity.runCommandAsync(`event entity @s text:despawn`)
                }
            }
        }
        for (const entity of world.getDimension("the_end").getEntities({ type: "floating:text" })) {
            for (const RegionBlock of Object.keys(RegionBlocks)) {
                if (world.getDimension("overworld").getBlock({
                    x: entity.location.x,
                    y: entity.location.y,
                    z: entity.location.z
                }).typeId == "minecraft:air") {
                    entity.runCommandAsync(`event entity @s text:despawn`)
                }
            }
        }
    } catch (e) { /* Ignored errors */ }
})



/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
 */
system.runInterval(() => {
    //Проверяет, есть блок региона на координатах или нет, если нет - удаляет его
    let regions = []
    regions = db.get(`Regions`)
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        for (const RegionBlock of Object.keys(RegionBlocks)) {
            try {
                if (world.getDimension(db.get(`Regions`)[i].dimension).getBlock({
                    x: db.get(`Regions`)[i].Coords.x,
                    y: db.get(`Regions`)[i].Coords.y,
                    z: db.get(`Regions`)[i].Coords.z
                }).typeId !== db.get(`Regions`)[i].type) {
                    world.getDimension("overworld").runCommandAsync(`tellraw @a[name="${db.get(`Regions`)[i].owner}"] {"rawtext":[{"text":"${config.prefix}Регион на координатах §g${db.get(`Regions`)[i].Coords.x} ${db.get(`Regions`)[i].Coords.y} ${db.get(`Regions`)[i].Coords.z}§r удалён!"}]}`)
                    world.getDimension(db.get(`Regions`)[i].dimension).runCommandAsync(`event entity @e[type=floating:text,
                    x=${db.get(`Regions`)[i].Coords.x},
                    dx=${db.get(`Regions`)[i].Coords.x},
                    y=${db.get(`Regions`)[i].Coords.y},
                    dy=${db.get(`Regions`)[i].Coords.y},
                    z=${db.get(`Regions`)[i].Coords.z},
                    dz=${db.get(`Regions`)[i].Coords.z}] text:despawn`)
                    if (config.Lightning == true) {
                        world.getDimension(db.get(`Regions`)[i].dimension).runCommandAsync(`summon lightning_bolt ${db.get(`Regions`)[i].Coords.x} ${db.get(`Regions`)[i].Coords.y + 2} ${db.get(`Regions`)[i].Coords.z}`)
                    }
                    regions.splice(i, 1)
                    db.set(`Regions`, regions)
                }
            } catch (e) { /* Ignored errors */ }
        }
    }
})
