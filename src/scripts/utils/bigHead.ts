const accessories = ['none', 'roundGlasses', 'tinyGlasses', 'shades'];
const body = ['chest', 'breasts'];
const circleColors = ['blue'];
const clothing = ['shirt', 'dressShirt', 'vneck', 'tankTop', 'dress'];
const clothingColors = ['white', 'blue', 'black', 'green', 'red'];
const eyebrows = ['raised', 'leftLowered', 'serious', 'angry', 'concerned'];
const eyes = ['normal', 'happy', 'content', 'squint', 'simple'];
const facialHair = ['none', 'none2', 'none3', 'stubble', 'mediumBeard'];
const graphics = ['none'];
const hair = [
    'none',
    'long',
    'bun',
    'short',
    'pixie',
    'balding',
    'buzz',
    'afro',
    'bob',
];
const hairColors = [
    'blonde',
    'orange',
    'black',
    'white',
    'brown',
    'blue',
    'pink',
];
const hats = ['none', 'none2', 'none3', 'none4', 'none5', 'beanie', 'turban'];
const hatColors = ['white', 'blue', 'black', 'green', 'red'];
const lashes = ['true', 'false'];
const lipColors = ['red', 'purple', 'pink', 'turqoise', 'green'];
const faceMask = [false];
const mouth = ['grin', 'sad', 'openSmile', 'lips', 'open', 'serious'];
const skinTones = ['light', 'yellow', 'brown', 'dark', 'red', 'black'];

const randEl = <T extends any>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

const randomOptions = () => ({
    accessory: randEl(accessories),
    body: randEl(body),
    circleColor: randEl(circleColors),
    clothing: randEl(clothing),
    clothingColor: randEl(clothingColors),
    eyebrows: randEl(eyebrows),
    eyes: randEl(eyes),
    facialHair: randEl(facialHair),
    graphic: randEl(graphics),
    hair: randEl(hair),
    hairColor: randEl(hairColors),
    hat: randEl(hats),
    hatColor: randEl(hatColors),
    lashes: randEl(lashes),
    lipColor: randEl(lipColors),
    faceMask: randEl(faceMask),
    mouth: randEl(mouth),
    skinTone: randEl(skinTones),
});

export default randomOptions;
