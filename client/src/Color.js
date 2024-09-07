/**
 * Access to the names of the CSS variables of the colours
 * that form the main colour scheme
 */
const Color = Object.freeze({
    RED: Symbol("--vibrant-red"),
    GREEN: Symbol("--vibrant-green"),
    BLUE: Symbol("--vibrant-blue"),
    YELLOW: Symbol("--vibrant-yellow"),
    GREY: Symbol("--mundane-grey"),
});

export default Color;