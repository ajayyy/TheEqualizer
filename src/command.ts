import * as DiscordJS from "discord.js";

import Documentation from "./doc-container";

class Command
{
	protected action: (message: DiscordJS.Message) => Promise<Command.ExitStatus>;
	get Action(): (message: DiscordJS.Message) => Promise<Command.ExitStatus>
	{ return this.action }

	protected name: string;
	get Name(): string
	{ return this.name }

	protected documentation: Documentation;
	get Documentation(): Documentation
	{ return this.documentation }

	constructor(name: string, action: (message: DiscordJS.Message) => Promise<Command.ExitStatus>)
	{
		this.action = action;
		this.name = name;
		this.documentation = new Documentation(this.name);
		this.documentation.loadSync();
	}
}

namespace Command
{
	export const enum ExitStatus
	{
		Success,
		Failure,
		CommandNotFound,
		BadInvocation,
		BadInvokeNoReply,
		NotInVoiceChannel
	}

	export const SupportedCommands: Array<string> =
	[
		"cancel",
		"destroy",
		"eval",
		"help",
		"list-commands",
		"mute",
		"ping",
		"source",
		"unmute",
		"vote",
		"kick"
	];

	export function messageToArray(message: DiscordJS.Message): Array<string>
	{
		let command: Array<string> = message.content.split(' ');
		command[0] = command[0].substring(1);
		return command;
	}

	export var loadedCommands: Map<string, Command> = new Map<string, Command>();

	export function loadCommandsSync(): void
	{
		for (let command of Command.SupportedCommands)
			Command.loadedCommands.set(command, require("./commands/" + command));
	}

	export async function runCommand(message: DiscordJS.Message): Promise<Command.ExitStatus>
	{
		let messageArray: Array<string> = Command.messageToArray(message);
		let command: Command = Command.loadedCommands.get(messageArray[0]);

		if (command === undefined)
		{
			message.reply('`' + messageArray[0] + "` is not a valid command.");
			return Command.ExitStatus.CommandNotFound;
		}

		let exitStatus: Command.ExitStatus = await command.Action(message);

		switch (exitStatus)
		{
			case Command.ExitStatus.BadInvocation:
				message.reply("Bad invocation. From the documentation: \n\n" + command.Documentation.Invocation);
				break;
			case Command.ExitStatus.NotInVoiceChannel:
				message.reply("You must be in the voice channel to vote in this poll");
				break;
		}

		return exitStatus;
	}
}

export default Command;
