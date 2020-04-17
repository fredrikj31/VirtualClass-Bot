const { Client, MessageEmbed } = require("discord.js");
const { TOKEN, PREFIX } = require("./settings.json");

const handCooldown = new Set();

const client = new Client({
	disableEveryone: true,
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.on("ready", () => {
	console.log(`I'm online! My name is ${client.user.username}`);

	client.user.setActivity(`Serving ${client.guilds.cache.size} classrooms`, {
		type: "WATCHING",
	});
});

// Hands reaction
client.on("messageReactionAdd", async (reaction, user) => {

	if (user.bot) return;

	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log(
				"Something went wrong when fetching the message: ",
				error
			);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	//console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	//console.log(`${reaction.count} user(s) have given the same reaction to this message!`);

	//console.log(reaction.emoji.name);
	/*console.log(reaction);
	console.log("-----------------");
	console.log(user)*/

	console.log(
		`${user.username} reacted on ${reaction.message.author.username}'s message with ${reaction.emoji}`
	);

	if (reaction.emoji.name === "✋" || reaction.emoji.name === "👍") {
		//Function
		console.log("You reacted with thumbs up.");
		//? Function that adds user to role and edits the username
		let handRole = reaction.message.guild.roles.cache.find(
			(role) => role.name === "Hands"
		);
		let userGuild = reaction.message.guild.members.fetch(user);

		//Added to hands role
		(await userGuild).roles.add(handRole.id);

		//Change their nickname
		console.log((await userGuild).displayName);
		(await userGuild).setNickname(
			`${(await userGuild).displayName} ----- 👋`
		);
	}
});

client.on("messageReactionRemove", async (reaction, user) => {

	if (user.bot) return;

	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log(
				"Something went wrong when fetching the message: ",
				error
			);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	console.log(
		`${user.username} removed his/her reaction on ${reaction.message.author.username}'s message with ${reaction.emoji}`
	);

	if (reaction.emoji.name === "✋" || reaction.emoji.name === "👍") {
		console.log("You reacted with thumbs up.");
		//? Function that adds user to role and edits the username
		let handRole = reaction.message.guild.roles.cache.find(
			(role) => role.name === "Hands"
		);
		let userGuild = reaction.message.guild.members.fetch(user);

		//Added to hands role
		(await userGuild).roles.remove(handRole.id);

		//Change their nickname
		console.log((await userGuild).displayName);
		let stripedUsername = (await userGuild).displayName
			.split("-----")[0]
			.trim();
		(await userGuild).setNickname(stripedUsername);
	}
});

client.on("message", async (message) => {
	if (message.author.bot) return;
	if (message.content.indexOf(PREFIX) !== 0) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "ping") {
		const msg = await message.channel.send(`🏓 Pinging....`);

		msg.edit(
			`🏓 Pong! Latency is ${Math.floor(
				msg.createdAt - message.createdAt
			)}ms`
		);
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
			message.channel.send(
				":x: You are not connected to a voice channel."
			);
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
				message.channel.send(
					":x: There is nobody in a voice channel on this server."
				);
			}
		}
	}

	if (command === "setuphand") {
		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('✋ Raise/Lower Hand')
			.setDescription("You need to react to this message for the system to work.")
			.addFields(
				{ name: 'To raise your hand.', value: 'React with this emoji: ✋'},
				{ name: 'To lower your hand.', value: 'Remove your reaction.'},
			)
			.setTimestamp()
			.setFooter('Setup Timestamp');

		var embedMSG = message.channel.send(exampleEmbed);

		(await embedMSG).react("✋")
	}

	if (command === "servercache") {
		console.log(message.guild);
	}

	if (command === "test") {
		message.channel.send("Hey")
	}
});

client.login(TOKEN);
