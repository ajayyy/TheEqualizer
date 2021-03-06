import Command from "../command";
import * as DiscordJS from "discord.js";

export = new Command
(
	"source",

	async (message: DiscordJS.Message) =>
	{
		let command: Array<string> = message.content.split(' ');

		if (command.length > 1)
			message.reply("If you were looking for my source code, you can find it here:");
		else
			message.reply("My source code is located here:");

		message.channel.send("https://github.com/ZLima12/TheEqualizer");

		return Command.ExitStatus.Success;
	}
);
