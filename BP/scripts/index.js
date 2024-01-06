import { world, system, ItemStack } from "@minecraft/server";
import { JsonDatabase } from "./database.js";
import config from "./config.js"
console.warn("§l[Region add-on] §aФункции и скрипты перезагружены!")
const db = new JsonDatabase("DB:Regions").load()

if (db.get("Regions") === undefined) {
    db.set("Regions", [])
}


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function getDimension(dimension) {
    if (dimension == "minecraft:overworld") return "§aВерхний мир";
    if (dimension == "minecraft:nether") return "§cНезер";
    if (dimension == "minecraft:the_end") return "§5Край";
}


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function getPlayerOwnerRegionsCount(player) {
    let regions = 0
    for (const region of db.get("Regions")) {
        if (region.owner == player) {
            regions++
        }
    }
    return regions
}


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function listRegions(player) {
    let regions = []
    for (const region of db.get("Regions")) {
        if (region.owner == player || region.access.includes(player)) {
            const { owner, dimension } = region
            const { x, y, z } = region.Coords
            regions.push(`Владелец: §g${region.owner}§r | Координаты: §g${x}§f, §g${y}§f, §g${z} §r| Мир: §g${getDimension(dimension)}`)
        }
    }
    return regions
}


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function nearRegions(data) {
    for (const region of db.get("Regions")) {
        const { x, y, z } = data
        const { x1, x2, y1, y2, z1, z2, dimension } = region
        const block = config.RegionBlocks[data.type]
        if (
            x1 + block.x <= x &&
            x2 + block.x >= x &&
            y1 + block.y <= y &&
            y2 + block.y >= y &&
            z1 + block.z <= z &&
            z2 + block.z >= z &&
            dimension == data.dimension
        ) return true
        if (
            x1 - block.x <= x &&
            x2 - block.x >= x &&
            y1 - block.y <= y &&
            y2 - block.y >= y &&
            z1 - block.z <= z &&
            z2 - block.z >= z &&
            dimension == data.dimension
        ) return true
        if (
            x1 - block.x <= x &&
            x2 + block.x >= x &&
            y1 - block.y <= y &&
            y2 + block.y >= y &&
            z1 - block.z <= z &&
            z2 + block.z >= z &&
            dimension == data.dimension
        ) return true
    }
}


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function createRegion(player, block) {
    const { RegionBlocks } = config
    const { x, y, z } = block.location
    const { x: RegionX, y: RegionY, z: RegionZ } = RegionBlocks[block.typeId]
    const dataSave = {
        owner: player.name,
        access: [],
        x1: x - RegionX,
        x2: x + RegionX,
        y1: y - RegionY,
        y2: y + RegionY,
        z1: z - RegionZ,
        z2: z + RegionZ,
        dimension: player.dimension.id,
        Coords: { x: x, y: y, z: z },
        type: block.typeId
    }
    db.get("Regions").push(dataSave)
    db.set("Regions", db.get("Regions"))
    if (config.Hologram == true) {
        player.runCommandAsync(`summon regions_floating:text ${x} ${y} ${z} ${y} ${x} enter_water "${RegionBlocks[block.typeId].name} §rрегион\nВладелец: §g${player.name}"`)
    }
    player.sendMessage(config.prefix + "Вы успешно создали регион!")
    if (config.Lightning == true) {
        player.runCommandAsync(`summon lightning_bolt ${x} ${y + 2} ${z}`)
    }
}


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function deleteRegion(player, block) {
    for (let i = 0; i < db.get("Regions").length; i++) {
        const region = db.get("Regions")[i]
        const { x, y, z } = block.location
        if (region.owner === player.name &&
        region.Coords.x == x &&
        region.Coords.y == y &&
        region.Coords.z == z) {
            db.get("Regions").splice(i, 1)
            db.set("Regions", db.get("Regions"))
            player.sendMessage(config.prefix + "Регион успешно удалён!")
            player.runCommandAsync(`event entity @e[type=regions_floating:text, r=9] text:despawn`)
            if (config.Lightning == true) {
                player.runCommandAsync(`summon lightning_bolt ${x} ${y + 2} ${z}`)
            }
        }
    }
}


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
function checkRegion(player) {
    const { x, y, z } = player.location
    for (const region of db.get("Regions")) {
        if (region.x1 <= x &&
        region.x2 >= x &&
        region.y1 <= y &&
        region.y2 >= y &&
        region.z1 <= z &&
        region.z2 >= z &&
        region.dimension == player.dimension.id) {
            return region
        }
    }
}



/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (!config.RegionBlocks[block.typeId] || player.isSneaking) return;
    const { x, y, z } = block.location
    if (getPlayerOwnerRegionsCount(player.name) >= config.max_regions) {
        player.sendMessage(config.prefix + `У вас максимальное количество регионов! (${getPlayerOwnerRegionsCount(player.name)}/${config.max_regions})`)
        player.getComponent("inventory").container.addItem(new ItemStack(block.typeId))
        player.dimension.getBlock({ x: x, y: y, z: z }).setType("minecraft:air")
        return;
    }
    if (nearRegions({ x: x, y: y, z: z, dimension: player.dimension.id, type: block.typeId })) {
        player.sendMessage(config.prefix + "Вы пересикаете другой регион!")
        player.getComponent("inventory").container.addItem(new ItemStack(block.typeId))
        player.dimension.getBlock({ x: x, y: y, z: z }).setType("minecraft:air")
        return;
    }
    createRegion(player, block)
})



/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.beforeEvents.playerBreakBlock.subscribe((data) => {
    const { player, block } = data
    const { x, y, z } = block.location
    let isRegion;
    for (const region of db.get("Regions")) {
        const { x1, x2, y1, y2, z1, z2, dimension } = region
        if (x1 <= x &&
        x2 >= x &&
        y1 <= y &&
        y2 >= y &&
        z1 <= z &&
        z2 >= z &&
        dimension == player.dimension.id
        ) {
            if (region.owner !== player.name &&
            !region.access.includes(player.name) &&
            !player.hasTag(config.admin_tag)) {
                data.cancel = true
                player.sendMessage(config.Message)
                if (config.Particles == true) {
                    player.runCommandAsync(`particle minecraft:basic_smoke_particle ${x} ${y + 1.5} ${z}`)
                    player.runCommandAsync(`particle minecraft:falling_dust_concrete_powder_particle ${x} ${y + 1.5} ${z}`)
                    }
                }
                return;
            }
            if (config.RegionBlocks[block.typeId] && region.owner !== player.name) {
                data.cancel = true
                player.sendMessage(config.prefix + "Только владелец может сломать регион!")
                return;
            }
            deleteRegion(player, block)
        }
    }
})



/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
let timeMessage = {}
let timeParticle = {}
world.beforeEvents.playerInteractWithBlock.subscribe((data) => {
    const { player, block } = data
    const { x, y, z } = block.location
    for (const region of db.get("Regions")) {
        if (region.x1 <= x &&
        region.x2 >= x &&
        region.y1 <= y &&
        region.y2 >= y &&
        region.z1 <= z &&
        region.z2 >= z &&
        region.dimension == player.dimension.id) {
            if (region.owner !== player.name &&
            !region.access.includes(player.name) &&
            !player.hasTag(config.admin_tag)) {
                data.cancel = true
                if (timeMessage[player.name] < Date.now() || timeMessage[player.name] == undefined) {
                    player.sendMessage(config.Message)
                    timeMessage[player.name] = Date.now() + 1000
                }
                if (config.Particles == true) {
                    if (timeParticle[player.name] < Date.now() || timeParticle[player.name] == undefined) {
                        player.runCommandAsync(`particle minecraft:basic_smoke_particle ${x} ${y + 1.5} ${z}`)
                        player.runCommandAsync(`particle minecraft:falling_dust_concrete_powder_particle ${x} ${y + 1.5} ${z}`)
                        timeParticle[player.name] = Date.now() + 250
                    }
                }
            }
        }
    }
})



/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
world.beforeEvents.chatSend.subscribe((data) => {
    const { sender: player, message } = data
    const prefix = config.command_prefix
    const args = message.trim().slice(prefix.length).split(/\s+/g)
    if (message.startsWith(`${prefix}rg`)) {
        data.cancel = true
        if (!args[1]) return player.sendMessage(config.prefix + `Используйте §g${prefix}rg help§r для помощи.`);
        if (args[1] == "help") {
            player.sendMessage("§2--- Помощь по регионам ---")
            player.sendMessage(`${prefix}rg help - помощь по регионам`)
            player.sendMessage(`${prefix}rg info - информация о регионе`)
            player.sendMessage(`${prefix}rg add <ник> - добавить игрока в регион`)
            player.sendMessage(`${prefix}rg kick <ник> - кикнуть игрока из региона`)
            player.sendMessage(`${prefix}rg list - ваши регионы/участие в регионах`)
        } else if (args[1] == "info") {
            const region = checkRegion(player)
            if (region) {
                player.sendMessage(config.prefix + `Регион игрока §g${region.owner}`)
                if (region.access.length > 0) {
                    player.sendMessage(config.prefix + `Участники: §g${region.access.join("§r, §g")}`)
                }
                return;
            }
            player.sendMessage(config.prefix + "Свободная территория")
        } else if (args[1] == "add") {
            const region = checkRegion(player)
            if (region) {
                if (region.owner !== player.name) return player.sendMessage(config.prefix + "Вы не владелец региона!");
                if (!args[2]) return player.sendMessage(config.prefix + `Используйте §g${prefix}rg add <ник>`);
                if (region.access.includes(args[2])) return player.sendMessage(config.prefix + `Игрок §g${args[2]}§r уже состоит в вашем регионе!`);
                if (region.owner == args[2]) return player.sendMessage(config.prefix + "Вы владелец региона!");
                region.access.push(args[2])
                db.set("Regions", db.get("Regions"))
                player.sendMessage(config.prefix + `Игрок §g${args[2]}§r добавлен в регион!`)
                player.runCommandAsync(`tellraw "${args[2]}" {"rawtext":[{"text":"${config.prefix}Игрок §g${player.name}§r добавил вас в свой регион!"}]}`)
                return;
            }
            player.sendMessage(config.prefix + "Вы должны находится в своём регионе!")
        } else if (args[1] == "kick") {
            const region = checkRegion(player)
            if (region) {
                if (region.owner !== player.name) return player.sendMessage(config.prefix + "Вы не владелец региона!");
                if (!args[2]) return player.sendMessage(config.prefix + `Используйте §g${prefix}rg kick <ник>`);
                if (region.owner == args[2]) return player.sendMessage(config.prefix + "Вы не можете кикнуть себя из региона!");
                if (!region.access.includes(args[2])) return player.sendMessage(config.prefix + `Игрок §g${args[2]}§r не состоит в вашем регионе!`);
                for (let i = 0; i < region.access.length; i++) {
                    if (region.access[i] == args[2]) {
                        region.access.splice(i, 1)
                        db.set("Regions", db.get("Regions"))
                    }
                }
                player.sendMessage(config.prefix + `Игрок §g${args[2]}§r удалён из вашего региона!`)
                player.runCommandAsync(`tellraw "${args[2]}" {"rawtext":[{"text":"${config.prefix}Игрок §g${player.name}§r удалил вас из своего региона!"}]}`)
                return;
            }
            player.sendMessage(config.prefix + "Вы должны находится в своём регионе!")
        } else if (args[1] == "list") {
            const regions = listRegions(player.name)
            if (regions.length > 0) {
                player.sendMessage(config.prefix + "Ваши регионы/участие в регионах:")
                player.sendMessage(config.prefix + `${regions.join(`§r\n${config.prefix}`)}`)
            } else {
                player.sendMessage(config.prefix + "У вас нет регионов!")
            }
        } else {
            player.sendMessage(config.prefix + `Не известный аргумент! Используйте §g${prefix}rg help§r для помощи.`)
        }
    }
})



/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
system.runInterval(() => {
    for (let i = 0; i < db.get("Regions").length; i++) {
        const region = db.get("Regions")[i]
        try {
            const { x, y, z } = region.Coords
            if (world.getDimension(region.dimension).getBlock({ x: x, y: y, z: z }).typeId !== region.type) {
                world.getDimension("overworld").runCommandAsync(`tellraw "${region.owner}" {"rawtext":[{"text":"${config.prefix}Регион на координатах §g${x} ${y} ${z}§r удалён!"}]}`)
                world.getDimension(region.dimension).runCommandAsync(`event entity @e[type=regions_floating:text, x=${x}, dx=${x}, y=${y}, dy=${y}, z=${z}, dz=${z}] text:despawn`)
                if (config.Lightning == true) {
                    world.getDimension(region.dimension).runCommandAsync(`summon lightning_bolt ${x} ${y} ${z}`)
                }
                db.get("Regions").splice(i, 1)
                db.set("Regions", db.get("Regions"))
            }
        } catch { /* Ignoring errors */ }
    }
}, 20)



/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Region-system
 * Discord: WhiteeCattt
*/
system.runInterval(() => {
    const overworld = world.getDimension("overworld")
    const nether = world.getDimension("nether")
    const the_end = world.getDimension("the_end")
    for (let i = 0; i < db.get("Regions").length; i++) {
        const region = db.get("Regions")[i]
        try {
            for (const entity of overworld.getEntities({ type: "regions_floating:text" })) {
                const { x, y, z } = entity.location
                if (!config.RegionBlocks[overworld.getBlock({ x: x, y: y, z: z }).typeId]) {
                    entity.runCommandAsync("event entity @s text:despawn")
                }
            }
            for (const entity of nether.getEntities({ type: "regions_floating:text" })) {
                const { x, y, z } = entity.location
                if (!config.RegionBlocks[nether.getBlock({ x: x, y: y, z: z }).typeId]) {
                    entity.runCommandAsync("event entity @s text:despawn")
                }
            }
            for (const entity of the_end.getEntities({ type: "regions_floating:text" })) {
                const { x, y, z } = entity.location
                if (!config.RegionBlocks[the_end.getBlock({ x: x, y: y, z: z }).typeId]) {
                    entity.runCommandAsync("event entity @s text:despawn")
                }
            }
        } catch { /* Ignoring errors */ }
    }
}, 20)
