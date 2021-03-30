import Event from "../core/event";
import {client} from "../index";
import * as discord from "discord.js";

export default new Event<"channelCreate">({
    async on(channel) {
        const botGuilds = client.guilds;
        if (channel instanceof discord.GuildChannel) {
            const createdGuild = await botGuilds.fetch(channel.guild.id);
            console.log(`Channel created in '${createdGuild.name}' called '#${channel.name}'`);
        }
    }
});
