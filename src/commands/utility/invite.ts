import {NamedCommand} from "../../core";

export default new NamedCommand({
    description: "Gives you the invite link.",
    async run({send, client, args}) {
        send(
            `https://discordapp.com/api/oauth2/authorize?client_id=${client.user!.id}&permissions=${
                args[0] || 8
            }&scope=bot`
        );
    }
});