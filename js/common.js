/**
 * Created by Gregory on 6/19/17.
 */

export function maxHPForLevel(lvl) {
    return 30 * lvl;
}

export function maxXPForLevel(lvl) {
    return (Math.pow(2, lvl) - Math.pow(2, lvl - 1)) * 150;
}