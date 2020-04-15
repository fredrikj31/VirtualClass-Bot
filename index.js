const { Client, Collection } = require("discord.js");
const { TOKEN, PREFIX } = require("./settings.json");

const client = new Client({
	disableEveryone: true,
});

client.on("ready", () => {
	console.log(`I'm online! My name is ${client.user.username}`);

	client.user.setActivity(`Serving ${client.guilds.cache.size} classrooms`, {
		type: "WATCHING",
	});
});

client.on("message", async (message) => {
	if (message.author.bot) return;
	if (message.content.indexOf(PREFIX) !== 0) return;

	const args = message.content
		.slice(PREFIX.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "ping") {
		const msg = await message.channel.send(`🏓 Pinging....`);

		msg.edit(`🏓 Pong! Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms`);
	}

	if (command === "say") {
		const sayMessage = args.join(" ");
		message.delete().catch((O_o) => {});
		message.channel.send(sayMessage);
	}

	if (command === "moveall") {
		let userChannel = message.member.voice.channel;
		let onlineUsers = message.guild.voiceStates.cache;
		if (!userChannel) {
			message.channel.send(":x: You are not connected to a voice channel.");
		} else {
			//console.log(onlineUsers)
			if (onlineUsers.size > 0) {
				//console.log(onlineUsers)
				onlineUsers.forEach((value, key) => {
					selectedUser = message.guild.member(key);
					//console.log(selectedUser);
					selectedUser.voice.setChannel(userChannel);
				});
			} else {
				message.channel.send(":x: There is nobody in a voice channel on this server.");
			}
		}
	}
});

client.login(TOKEN);
