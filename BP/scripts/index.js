import { world, system } from "@minecraft/server";
import { JsonDatabase } from "./database.js";
console.warn(`§l[Region add-on] §aReloaded!§r`)
const db = new JsonDatabase("DB:Region").load()

const prefix = "§7[§l§bРегионы§r§7] §r"
const pref = "-"
const adminTag = "Admin"
const max_regions = 3


if (db.get(`Regions`) == undefined) {
    db.set(`Regions`, [])
}


/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function fixDistance(rg) {
    let distance;
    if (rg.type == "diamond_block") {
        distance = {
            x: regionDistance["minecraft:diamond_block"].x,
            y: regionDistance["minecraft:diamond_block"].y,
            z: regionDistance["minecraft:diamond_block"].z
        }
    }
    if (rg.type == "emerald_block") {
        distance = {
            x: regionDistance["minecraft:emerald_block"].x,
            y: regionDistance["minecraft:emerald_block"].y,
            z: regionDistance["minecraft:emerald_block"].z
        }
    }
    if (rg.type == "netherite_block") {
        distance = {
            x: regionDistance["minecraft:netherite_block"].x,
            y: regionDistance["minecraft:netherite_block"].y,
            z: regionDistance["minecraft:netherite_block"].z
        }
    }
    return distance;
}

/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function checkRegion(pos) {
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        let rg = db.get(`Regions`)[i];
        if (
        (rg.x1 + fixDistance(rg).x) <= pos.x &&
        rg.x2 + fixDistance(rg).x >= pos.x &&
        rg.y1 + fixDistance(rg).y <= pos.y &&
        rg.y2 + fixDistance(rg).y >= pos.y &&
        rg.z1 + fixDistance(rg).z <= pos.z &&
        rg.z2 + fixDistance(rg).z >= pos.z &&
        rg.dimension == pos.dimension) {
            return db.get(`Regions`)[i];
        }
        if (
        (rg.x1 - fixDistance(rg).x) <= pos.x &&
        rg.x2 - fixDistance(rg).x >= pos.x &&
        rg.y1 - fixDistance(rg).y <= pos.y &&
        rg.y2 - fixDistance(rg).y >= pos.y &&
        rg.z1 - fixDistance(rg).z <= pos.z &&
        rg.z2 - fixDistance(rg).z >= pos.z &&
        rg.dimension == pos.dimension) {
            return db.get(`Regions`)[i];
        }
        if (
        (rg.x1 - fixDistance(rg).x) <= pos.x &&
        rg.x2 + fixDistance(rg).x >= pos.x &&
        rg.y1 - fixDistance(rg).y <= pos.y &&
        rg.y2 + fixDistance(rg).y >= pos.y &&
        rg.z1 - fixDistance(rg).z <= pos.z &&
        rg.z2 + fixDistance(rg).z >= pos.z &&
        rg.dimension == pos.dimension) {
            return db.get(`Regions`)[i];
        }
    }
    return undefined;
}

/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function getPlayerRegions(player) {
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
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
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
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.afterEvents.playerPlaceBlock.subscribe((data) => {
    const { player: player, block: block } = data
    if (!player.isSneaking) {
    if (block.typeId == "minecraft:diamond_block" || block.typeId == "minecraft:emerald_block" || block.typeId == "minecraft:netherite_block") {
    if (getPlayerRegions(player) >= max_regions) return player.sendMessage(prefix + `У вас максимальное количество регионов (${getPlayerRegions(player)}/${max_regions})!`),
    player.runCommandAsync(`setblock ${block.location.x} ${block.location.y} ${block.location.z} air`),
    player.runCommandAsync(`give @s ${block.typeId?.replace("minecraft:", "")}`);
    const pos = {
        x: block.location.x,
        y: block.location.y,
        z: block.location.z,
        dimension: player.dimension.id
    }
    if (checkRegion(pos) == undefined) {
        createRG(player, block)
    } else {
        player.sendMessage(prefix + `Вы пересикаете другой регион!`)
        player.runCommandAsync(`setblock ${block.location.x} ${block.location.y} ${block.location.z} air`)
        player.runCommandAsync(`give @s ${block.typeId?.replace("minecraft:", "")}`)
    }
    }
    }
})

/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
const regionDistance = {
    "minecraft:diamond_block": {
        x: 8,
        y: 8,
        z: 8
    },
    "minecraft:emerald_block": {
        x: 16,
        y: 16,
        z: 16
    },
    "minecraft:netherite_block": {
        x: 24,
        y: 24,
        z: 24
    }
}

/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function createRG(player, block) {
    if (block.typeId == "minecraft:diamond_block") {
        const dataSave = {
            owner: player.name,
            access: [],
            x1: block.location.x - regionDistance["minecraft:diamond_block"].x,
            x2: block.location.x + regionDistance["minecraft:diamond_block"].x,
            y1: block.location.y - regionDistance["minecraft:diamond_block"].y,
            y2: block.location.y + regionDistance["minecraft:diamond_block"].y,
            z1: block.location.z - regionDistance["minecraft:diamond_block"].z,
            z2: block.location.z + regionDistance["minecraft:diamond_block"].z,
            dimension: player.dimension.id,
            Coords: {
                x: block.location.x,
                y: block.location.y,
                z: block.location.z
            },
            type: "diamond_block"
        }
        let regions = []
        regions = db.get(`Regions`)
        regions.push(dataSave)
        db.set(`Regions`, regions)
        player.runCommandAsync(`summon floating:text ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.y} ${block.location.x} enter_water "§bАлмазный §fрегион\nВладелец: §g${player.name}"`)
        player.sendMessage(prefix + `Вы создали регион!`)
    }
    if (block.typeId == "minecraft:emerald_block") {
        const dataSave = {
            owner: player.name,
            access: [],
            x1: block.location.x - regionDistance["minecraft:emerald_block"].x,
            x2: block.location.x + regionDistance["minecraft:emerald_block"].x,
            y1: block.location.y - regionDistance["minecraft:emerald_block"].y,
            y2: block.location.y + regionDistance["minecraft:emerald_block"].y,
            z1: block.location.z - regionDistance["minecraft:emerald_block"].z,
            z2: block.location.z + regionDistance["minecraft:emerald_block"].z,
            dimension: player.dimension.id,
            Coords: {
                x: block.location.x,
                y: block.location.y,
                z: block.location.z
            },
            type: "emerald_block"
        }
        let regions = []
        regions = db.get(`Regions`)
        regions.push(dataSave)
        db.set(`Regions`, regions)
        player.runCommandAsync(`summon floating:text ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.y} ${block.location.x} enter_water "§aИзумрудный §fрегион\nВладелец: §g${player.name}"`)
        player.sendMessage(prefix + `Вы создали регион!`)
    }
    if (block.typeId == "minecraft:netherite_block") {
        const dataSave = {
            owner: player.name,
            access: [],
            x1: block.location.x - regionDistance["minecraft:netherite_block"].x,
            x2: block.location.x + regionDistance["minecraft:netherite_block"].x,
            y1: block.location.y - regionDistance["minecraft:netherite_block"].y,
            y2: block.location.y + regionDistance["minecraft:netherite_block"].y,
            z1: block.location.z - regionDistance["minecraft:netherite_block"].z,
            z2: block.location.z + regionDistance["minecraft:netherite_block"].z,
            dimension: player.dimension.id,
            Coords: {
                x: block.location.x,
                y: block.location.y,
                z: block.location.z
            },
            type: "netherite_block"
        }
        let regions = []
        regions = db.get(`Regions`)
        regions.push(dataSave)
        db.set(`Regions`, regions)
        player.runCommandAsync(`summon floating:text ${block.location.x} ${block.location.y} ${block.location.z} ${block.location.y} ${block.location.x} enter_water "§cНезеритовый §fрегион\nВладелец: §g${player.name}"`)
        player.sendMessage(prefix + `Вы создали регион!`)
    }
}

/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function deleteRG(player, block, data) {
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i].owner === player.name &&
        db.get(`Regions`)[i].Coords.x == block.location.x &&
        db.get(`Regions`)[i].Coords.y == block.location.y &&
        db.get(`Regions`)[i].Coords.z == block.location.z
        ) {
            if (player.name !== db.get(`Regions`)[i].owner) return player.sendMessage(prefix + `Сломать регион может только его владелец!`), data.cancel = true;
            player.sendMessage(prefix + `Регион удалён!`)
            player.runCommandAsync(`event entity @e[type=floating:text, r=8] text:despawn`)
            let regions = []
            regions = db.get(`Regions`)
            regions.splice(i, 1)
            db.set(`Regions`, regions)
        }
    }
}

/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
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
    let rgs = 0
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i].x1 <= pos.x && db.get(`Regions`)[i].x2 >= pos.x && db.get(`Regions`)[i].y1 <= pos.y && db.get(`Regions`)[i].y2 >= pos.y && db.get(`Regions`)[i].z1 <= pos.z && db.get(`Regions`)[i].z2 >= pos.z && db.get(`Regions`)[i].dimension == player.dimension.id) {
            if (db.get(`Regions`)[i].owner !== player.name && !db.get(`Regions`)[i].access.includes(player.name) && !player.hasTag(adminTag)) {
                rgs++
            }
        }
    }
    if (rgs > 0) {
        data.cancel = true
        player.sendMessage(`§l§cЭй!§r §7Извините, но вы не можете делать это здесь.`)
    } else {
        deleteRG(player, block, data)
    }
})


/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
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
    let rgs = 0
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        if (db.get(`Regions`)[i].x1 <= pos.x && db.get(`Regions`)[i].x2 >= pos.x && db.get(`Regions`)[i].y1 <= pos.y && db.get(`Regions`)[i].y2 >= pos.y && db.get(`Regions`)[i].z1 <= pos.z && db.get(`Regions`)[i].z2 >= pos.z && db.get(`Regions`)[i].dimension == player.dimension.id) {
            if (db.get(`Regions`)[i].owner !== player.name && !db.get(`Regions`)[i].access.includes(player.name)  && !player.hasTag(adminTag)) {
                rgs++
            }
        }
    }
    if (rgs > 0) {
        data.cancel = true
        player.sendMessage(`§l§cЭй!§r §7Извините, но вы не можете делать это здесь.`)
    }
})

/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function getRegion(pos) {
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
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.beforeEvents.chatSend.subscribe((data) => {
    const { sender: player, message: message } = data
    const args = message.split(" ")
    if (message.startsWith(`${pref}rg`)) {
        const pos = {
            x: player.location.x,
            y: player.location.y,
            z: player.location.z,
            dimension: player.dimension.id
        }
        data.cancel = true
        if (args[1] == "info") {
            if (getRegion(pos) !== undefined) {
                player.sendMessage(prefix + `Регион игрока §g${getRegion(pos).owner}`)
                if (getRegion(pos).access.length > 0) {
                    player.sendMessage(`${prefix}Участники: §g${getRegion(pos).access.join("§r, §g")}`)
                }
            } else {
                player.sendMessage(prefix + `Свободная территория`)
            }
        } else if (args[1] == "add") {
            if (getRegion(pos) == undefined)  return player.sendMessage(prefix + `Вы должны находится в своём регионе!`);
            if (getRegion(pos).owner !== player.name) return player.sendMessage(prefix + `Вы не владелец данного региона!`);
            if (player.name == args[2]) return player.sendMessage(prefix + `Вы не можете добавить в регион самого себя!`);
            if (getRegion(pos).access.includes(args[2])) return player.sendMessage(prefix + `Игрок §g${args[2]}§r уже состоит в вашем регионе!`);
            if (!args[2]) return player.sendMessage(prefix + `Игрок не найден!`);
            addAccess(player, `${args[2]}`, getRegion(pos))
            player.sendMessage(prefix + `Игрок §g${args[2]}§r добавлен в регион!`)
            const [target] = world.getPlayers({ name: args[2] })
            try {
            target.sendMessage(prefix + `Игрок §g${player.name}§r добавил вас в свой регион!`)
            } catch (e) {}
        } else if (args[1] == "kick") {
            if (getRegion(pos) == undefined)  return player.sendMessage(prefix + `Вы должны находится в своём регионе!`);
            if (getRegion(pos).owner !== player.name) return player.sendMessage(prefix + `Вы не владелец данного региона!`);
            if (player.name == args[2]) return player.sendMessage(prefix + `Вы не можете кикнуть из региона самого себя!`);
            if (!args[2]) return player.sendMessage(prefix + `Игрок не найден!`);
            if (!getRegion(pos).access.includes(args[2])) return player.sendMessage(prefix + `Игрок §g${args[2]}§r не состоит в вашем регионе!`);
            removeAccess(player, `${args[2]}`, getRegion(pos))
            player.sendMessage(prefix + `Игрок §g${args[2]}§r кикнут из региона!`)
            const [target] = world.getPlayers({ name: args[2] })
            try {
            target.sendMessage(prefix + `Игрок §g${player.name}§r кикнул вас из региона!`)
            } catch (e) {}
        } else if (args[1] == "help") {
            player.sendMessage(prefix+ `§g${pref}rg help §r- помощь по регионам`)
            player.sendMessage(prefix+ `§g${pref}rg info §r- информация о регионе`)
            player.sendMessage(prefix+ `§g${pref}rg list §r- ваши регионы/участие в регионах`)
            player.sendMessage(prefix+ `§g${pref}rg add <ник> §r- добавить игрока в регион`)
            player.sendMessage(prefix+ `§g${pref}rg kick <ник> §r- кикнуть игрока из региона`)
        } else if (args[1] == "list") {
            if (listRegions(player).length > 0) {
                player.sendMessage(prefix + `Ваши регионы/участие в регионах: `)
                player.sendMessage(prefix + `${listRegions(player).join(`\n§r${prefix}`)}`)
            } else {
                player.sendMessage(prefix + `У вас нет регионов!`)
            }
        } else {
            player.sendMessage(prefix + `Не известный аргумент!`)
        }
    }
})

/**
 * Copyright (C) 2023 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
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
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function removeAccess(player, target, rg) {
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
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function addAccess(player, target, rg) {
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
 * Project: GitHub: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
 */
system.runInterval(() => {
    let regions = []
    regions = db.get(`Regions`)
    for (let i = 0; i < db.get(`Regions`).length; i++) {
        try {
        if (world.getDimension(db.get(`Regions`)[i].dimension).getBlock({ x: db.get(`Regions`)[i].Coords.x, y: db.get(`Regions`)[i].Coords.y, z: db.get(`Regions`)[i].Coords.z }).typeId !== "minecraft:diamond_block" &&
        world.getDimension(db.get(`Regions`)[i].dimension).getBlock({ x: db.get(`Regions`)[i].Coords.x, y: db.get(`Regions`)[i].Coords.y, z: db.get(`Regions`)[i].Coords.z }).typeId !== "minecraft:emerald_block" &&
        world.getDimension(db.get(`Regions`)[i].dimension).getBlock({ x: db.get(`Regions`)[i].Coords.x, y: db.get(`Regions`)[i].Coords.y, z: db.get(`Regions`)[i].Coords.z }).typeId !== "minecraft:netherite_block") {
            world.getDimension(db.get(`Regions`)[i].dimension).runCommandAsync(`tellraw @a[name="${db.get(`Regions`)[i].owner}"] {"rawtext":[{"text":"${prefix}Регион на координатах §g${db.get(`Regions`)[i].Coords.x} ${db.get(`Regions`)[i].Coords.y} ${db.get(`Regions`)[i].Coords.z}§r удалён!"}]}`)
            world.getDimension(db.get(`Regions`)[i].dimension).runCommandAsync(`event entity @e[type=floating:text,
            x=${db.get(`Regions`)[i].Coords.x},
            dx=${db.get(`Regions`)[i].Coords.x},
            y=${db.get(`Regions`)[i].Coords.y},
            dy=${db.get(`Regions`)[i].Coords.y},
            z=${db.get(`Regions`)[i].Coords.z},
            dz=${db.get(`Regions`)[i].Coords.z}] text:despawn`)
            regions.splice(i, 1)
            db.set(`Regions`, regions)
        }
        } catch (e) { /* Ignored error */}
    }
}, 10)
