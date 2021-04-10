import {Command, NamedCommand} from "../../core";
import {random} from "../../lib";

const responses = [
    "boomer",
    "zoomer",
    "the last generationer",
    "the last airbender",
    "fire nation",
    "fire lord",
    "guy fieri",
    "guy from final fight",
    "haggar",
    "Max Thunder from Streets of Rage 2",
    "police guy who fires bazookas",
    "Mr. X",
    "Leon Its Wrong If Its Not Ada Wong S. Kennedy.",
    "Jill",
    "JFK",
    "george bush",
    "obama",
    "the world",
    "copy of scott pilgrim vs the world",
    "ok",
    "ko",
    "Hot Daddy Venomous",
    "big daddy",
    "John Cena",
    "BubbleSpurJarJarBinks",
    "T-Series",
    "pewdiepie",
    "markiplier",
    "jacksepticeye",
    "vanossgaming",
    "miniladd",
    "Traves",
    "Wilbur Soot",
    "sootrhianna",
    "person with tiny ears",
    "anti-rabbit",
    "homo sapiens",
    "homo",
    "cute kitty",
    "ugly kitty",
    "sadness",
    "doomer",
    "gloomer",
    "bloomer",
    "edgelord",
    "weeb",
    "m'lady",
    "Mr. Crabs",
    "hand",
    "lahoma",
    "big man",
    "fox",
    "pear",
    "cat",
    "large man"
];

export default new NamedCommand({
    description: "Sends random ok message.",
    async run({send, message, channel, guild, author, member, client, args}) {
        send(`ok ${random(responses)}`);
    }
});
