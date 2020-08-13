import Command from "../core/command";
import {CommonLibrary, logs} from "../core/lib";
import {Config, Storage} from "../core/structures";
import {PermissionNames, getPermissionLevel} from "../core/permissions";

function getLogBuffer(type: string)
{
	return {files: [{
		attachment: Buffer.alloc(logs[type].length, logs[type]),
		name: `${Date.now()}.${type}.log`
	}]};
}

export default new Command({
	description: "An all-in-one command to do admin stuff. You need to be either an admin of the server or one of the bot's mechanics to use this command.",
	async run($: CommonLibrary): Promise<any>
	{
		if(!$.member)
			return $.channel.send("Couldn't find a member object for you! Did you make sure you used this in a server?");
		const permLevel = getPermissionLevel($.member);
		$.channel.send(`${$.author.toString()}, your permission level is \`${PermissionNames[permLevel]}\` (${permLevel}).`);
	},
	subcommands:
	{
		set: new Command({
			description: "Set different per-guild settings for the bot.",
			run: "You have to specify the option you want to set.",
			permission: Command.PERMISSIONS.ADMIN,
			subcommands:
			{
				prefix: new Command({
					description: "Set a custom prefix for your guild. Removes your custom prefix if none is provided.",
					usage: "(<prefix>)",
					async run($: CommonLibrary): Promise<any>
					{
						Storage.getGuild($.guild?.id || "N/A").prefix = null;
						Storage.save();
						$.channel.send(`The custom prefix for this guild has been removed. My prefix is now back to \`${Config.prefix}\`.`);
					},
					any: new Command({
						async run($: CommonLibrary): Promise<any>
						{
							Storage.getGuild($.guild?.id || "N/A").prefix = $.args[0];
							Storage.save();
							$.channel.send(`The custom prefix for this guild is now \`${$.args[0]}\`.`);
						}
					})
				})
			}
		}),
		diag: new Command({
			description: "Requests a debug log with the \"info\" verbosity level.",
			permission: Command.PERMISSIONS.BOT_SUPPORT,
			async run($: CommonLibrary): Promise<any>
			{
				$.channel.send(getLogBuffer("info"));
			},
			any: new Command({
				description: `Select a verbosity to listen to. Available levels: \`[${Object.keys(logs)}]\``,
				async run($: CommonLibrary): Promise<any>
				{
					const type = $.args[0];
					
					if(type in logs)
						$.channel.send(getLogBuffer(type));
					else
						$.channel.send(`Couldn't find a verbosity level named \`${type}\`! The available types are \`[${Object.keys(logs)}]\`.`);
				}
			})
		}),
		status: new Command({
			description: "Changes the bot's status.",
			permission: Command.PERMISSIONS.BOT_SUPPORT,
			async run($: CommonLibrary): Promise<any>
			{
				$.channel.send('Setting status to `online`...');
			},
			any: new Command({
				description: `Select a status to set to. Available statuses: \`online\`, \`idle\`, \`dnd\`, \`invisible\``,
				async run($: CommonLibrary): Promise<any>
				{
					let statuses = ['online', 'idle', 'dnd', 'invisible'];
					if (!statuses.includes($.args[0])) return $.channel.send("That status doesn't exist!");
					else {
						$.client.user?.setStatus($.args[0]);
						$.channel.send(`Setting status to \`${$.args[0]}\`...`);
					}
				}
			})
		}),
		purge: new Command({
			description: "Purges bot messages.",
			permission: Command.PERMISSIONS.BOT_SUPPORT,
			async run($: CommonLibrary): Promise<any>
			{
				$.message.delete();
				const msgs = await $.channel.messages.fetch({
					limit: 100
				});
				const travMessages = msgs.filter(m => m.author.id === $.client.user?.id);

				await $.message.channel.send(`Found ${travMessages.size} messages to delete.`)
					.then(m => m.delete({
						timeout: 5000
					}));
				await $.message.channel.bulkDelete(travMessages);
			}
		}),
		nick: new Command({
			description: "Change the bot's nickname.",
			permission: Command.PERMISSIONS.BOT_SUPPORT,
			async run($: CommonLibrary): Promise<any>
			{
				try {
					const nickName = $.args.join(" ");
					const trav = $.guild?.members.cache.find(member => member.id === $.client.user?.id);
					await trav?.setNickname(nickName);
					$.message.delete({timeout: 5000});
					$.channel.send(`Nickname set to \`${nickName}\``)
						.then(m => m.delete({timeout: 5000}));
				} catch (e) {
					console.log(e);
				}
			}
		}),
		guilds: new Command({
			description: "Shows a list of all guilds the bot is a member of.",
			permission: Command.PERMISSIONS.BOT_SUPPORT,
			async run($: CommonLibrary): Promise<any>
			{
				const guildList = $.client.guilds.cache.array()
					.map(e => e.name);
				$.channel.send(guildList);
			}
		}),
		activity: new Command({
			description: "Set the activity of the bot.",
			permission: Command.PERMISSIONS.BOT_SUPPORT,
			usage: "<type> <string>",
			async run($: CommonLibrary): Promise<any>
			{
				// if ($.args[0]) {
				// 	$.message.delete();
				// 	$.client.user?.setActivity($.args.join(" "));
				// } else {
				// 	$.message.delete();
				// 	$.client.user?.setActivity(".help", {
				// 		type: "LISTENING"
				// 	});
				// }
				$.client.user?.setActivity(".help", {
					type: "LISTENING"
				});
			},
			subcommands:
			{
				playing: new Command({
					description: "Set the \`Playing\` status for the bot.",
					usage: "<string>",
					async run($: CommonLibrary): Promise<any>
					{
						$.client.user?.setActivity($.args.join(" "), {
							type: "PLAYING"
						})
						$.channel.send(`Set status to \`Playing ${$.args.join(" ")}\``)
					}
				}),
				streaming: new Command({
					description: "Set the \`Streaming\` status for the bot.",
					usage: "<string>",
					async run($: CommonLibrary): Promise<any>
					{
						$.client.user?.setActivity($.args.join(" "), {
							type: "STREAMING"
						})
						$.channel.send(`Set status to \`Streaming ${$.args.join(" ")}\``)
					}
				}),
				listening: new Command({
					description: "Set the \`Listening to\` status for the bot.",
					usage: "<string>",
					async run($: CommonLibrary): Promise<any>
					{
						$.client.user?.setActivity($.args.join(" "), {
							type: "LISTENING"
						})
						$.channel.send(`Set status to \`Listening to ${$.args.join(" ")}\``)
					}
				}),
				watching: new Command({
					description: "Set the \`Watching\` status for the bot.",
					usage: "<string>",
					async run($: CommonLibrary): Promise<any>
					{
						$.client.user?.setActivity($.args.join(" "), {
							type: "WATCHING"
						})
						$.channel.send(`Set status to \`Watching ${$.args.join(" ")}\``)
					}
				})
			}
		})
	}
});