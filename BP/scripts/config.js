export default {
    prefix: "§7[§l§bРегионы§r§7] §r", //Префикс от сообщений
    pref: "-", //Префикс от команд
    adminTag: "Admin", //Тег администратора (С ним игрок сможет ломать блоки в чужих регионах)
    maxRegions: 3, //Максимальное количество регионов
    Lightning: true, //Вызов молнии при создании и удалении региона
    RegionBlocks: {
        "minecraft:diamond_block": {
            name: "§bАлмазный",
            x: 8,
            y: 8,
            z: 8
        },
        "minecraft:emerald_block": {
            name: "§aИзумрудный",
            x: 16,
            y: 16,
            z: 16
        },
        "minecraft:netherite_block": {
            name: "§cНезеритовый",
            x: 24,
            y: 24,
            z: 24
        }
    }
}
