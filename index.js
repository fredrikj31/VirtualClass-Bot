const { Client, MessageEmbed } = require("discord.js");

const PREFIX = "!"

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

	//console.log(reaction)

	/*console.log(
		`${user.username} reacted on ${reaction.message.author.username}'s message with ${reaction.emoji}`
	);*/

	if (reaction.message.author.username === client.user.username) {
		// HAND FUNCTION
		if (reaction.emoji.name === "✋") {
			if (handCooldown.has(user.id)) {
				user.send(
					"Do not spam this function. You can use this every second."
				);
			} else {
				//Function
				console.log("You reacted with thumbs up.");
				//? Function that adds user to role and edits the username
				let handRole = reaction.message.guild.roles.cache.find(
					(role) => role.name === "Hand"
				);
				let userGuild = reaction.message.guild.members.fetch(user);
	
				//Added to hands role
				(await userGuild).roles.add(handRole.id);
	
				//Change their nickname
				console.log((await userGuild).displayName);
				(await userGuild).setNickname(
					`${(await userGuild).displayName} ----- 👋`
				);
	
				//Adds the cooldown
				handCooldown.add(user.id);
				setTimeout(() => {
					// Removes the user from the set after a minute
					handCooldown.delete(user.id);
				}, 1000);
			}
		}
		// HELP FUNCTION
		if (reaction.message.channel.name === "help") {
			if (reaction.emoji.name === "✅") {
				let userGuild = reaction.message.guild.members.fetch(user);
				if ((await userGuild).roles.cache.find(r => r.name === "Teacher")) {
					//console.log(reaction.message);

					var messageId = reaction.message.id;

					//console.log(reaction.message.channel)

					reaction.message.channel.messages.fetch(messageId)
					.then((message) => {
						message.delete();
					})
					.catch(console.error);
				}
			}
		}
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

	/*console.log(
		`${user.username} removed his/her reaction on ${reaction.message.author.username}'s message with ${reaction.emoji}`
	);*/
	

	if (reaction.message.author.username === client.user.username) {
		// HAND FUNCTION
		if (reaction.emoji.name === "✋") {
			if (handCooldown.has(user.id)) {
				user.send(
					"Do not spam this function. You can use this every second."
				);
			} else {
				//console.log("You reacted with thumbs up.");
				//? Function that adds user to role and edits the username
				let handRole = reaction.message.guild.roles.cache.find(
					(role) => role.name === "Hand"
				);
				let userGuild = reaction.message.guild.members.fetch(user);
	
				//Added to hands role
				(await userGuild).roles.remove(handRole.id);
	
				//Change their nickname
				//console.log((await userGuild).displayName);
				let stripedUsername = (await userGuild).displayName
					.split("-----")[0]
					.trim();
				(await userGuild).setNickname(stripedUsername);
	
				//Adds the cooldown
				handCooldown.add(user.id);
				setTimeout(() => {
					// Removes the user from the set after a minute
					handCooldown.delete(user.id);
				}, 1000);
			}
		}
	}
});

client.on("message", async (message) => {
	if (message.author.bot) return;
	if (message.content.indexOf(PREFIX) !== 0) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "ping") {
		if (message.member.roles.cache.find(r => r.name === "Teacher")) {
			const msg = await message.channel.send(`🏓 Pinging....`);

			msg.edit(
				`🏓 Pong! Latency is ${Math.floor(
					msg.createdAt - message.createdAt
				)}ms`
			);
		} else {
			message.reply(":x: You don't have permission to use this command.");
		}
	}

	if (command === "moveall") {
		if (message.member.roles.cache.find(r => r.name === "Teacher")) {
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
		} else {
			message.reply(":x: You don't have permission to use this command.");
		}
	}

	if (command === "setuphand") {
		if (message.member.roles.cache.find(r => r.name === "Teacher")) {
			message.delete();
			const exampleEmbed = new MessageEmbed()
				.setColor("#0099ff")
				.setTitle("✋ Raise/Lower Hand")
				.setDescription(
					"You need to react to this message, but do not spam it."
				)
				.addFields(
					{
						name: "To raise your hand.",
						value: "React with this emoji: ✋",
					},
					{ name: "To lower your hand.", value: "Remove your reaction." }
				)
				.setTimestamp()
				.setFooter("Setup Timestamp");

			var embedMSG = message.channel.send(exampleEmbed);

			(await embedMSG).react("✋");
		} else {
			message.reply(":x: You don't have permission to use this command.");
		}
	}

	if (command == "purge") {
		if (message.member.roles.cache.find(r => r.name === "Teacher")) {
			const amount = args[0]; // Amount of messages which should be deleted

			if (!amount)
				return message.reply(
					"You haven't given an amount of messages which should be deleted!"
				); // Checks if the `amount` parameter is given
			if (isNaN(amount))
				return message.reply("The amount parameter isn`t a number!"); // Checks if the `amount` parameter is a number. If not, the command throws an error

			if (amount > 50)
				return message.reply(
					"You can`t delete more than 50 messages at once!"
				); // Checks if the `amount` integer is bigger than 100
			if (amount < 1)
				return message.reply("You have to delete at least 1 message!"); // Checks if the `amount` integer is smaller than 1

			await message.channel.messages
				.fetch({ limit: amount })
				.then((messages) => {
					// Fetches the messages
					message.channel.bulkDelete(
						messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
					);
				});

			console.log(`Deleted ${amount} messages`);
		} else {
			message.reply(":x: You don't have permission to use this command.");
		} 
	}

	if (command === "servercache") {
		if (message.member.roles.cache.find(r => r.name === "Teacher")) {
			console.log(message.guild);
		} else {
			message.reply(":x: You don't have permission to use this command.");
		}
	}

	if (command === "absence") {
		if (message.member.roles.cache.find(r => r.name === "Teacher")) {
			//Command: /absence <time before result>

			userTyped = message.author;

			if (!args[0])
				return message.reply(
					":x: You need to define a custom time in minutes. !absence <time in minutes>"
				);
			if (isNaN(args[0]))
				return message.reply(
					":x: You did not specify a number. !absence <time in minutes>"
				);

			var timeLeft = args[0] * 60 * 1000;

			message.delete();

			const exampleEmbed = new MessageEmbed()
				.setColor("#0099ff")
				.setTitle("✅ Present Check")
				.setDescription(
					"If you are present this lesson, react to this message."
				)
				.addFields({
					name: "React to be absence.",
					value: "React with this emoji: ✅",
				})
				.setTimestamp()
				.setFooter("Absence Date: ");

			var absenceMessage = message.channel.send(exampleEmbed);

			var timeCreated = (await absenceMessage).createdAt;

			(await absenceMessage).react("✅");

			const filter = (reaction, user) => reaction.emoji.name === "✅";

			const collector = (await absenceMessage).createReactionCollector(
				filter,
				{ time: timeLeft }
			);
			//collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
			collector.on("end", (collected) => {
				let reaction = collected.first();
				//console.log(reaction);
				//console.log("-----------------------");
				//console.log(reaction.users.cache);
				var i = 1;
				var finalList = [];
				var creatingList = new Promise((resolve, reject) => {
					reaction.users.cache.forEach((element) => {
						if (i == 1) {
							i += 1;
							return;
						}
						i += 1;
						//console.log(element)
						var serverUsername = message.guild.members.fetch(
							element.id
						);
						serverUsername.then((user) => {
							//console.log(user.nickname)
							finalList.push(user.nickname);
						});
					});
					resolve();
				});
				creatingList.then(() => {
					//console.log(finalList);

					topLine = "------------------------------------------------------------- **Present Status** -------------------------------------------------------------\n"
					bottomLine = "\n---------------------------------------------------------------------------------------------------------------------------------------------"

					outputMessage = topLine + "The present status you created at: " + "`" + timeCreated + "` is finish, and the results are here. \n\n **These students were present:**\n" + finalList.map((item, i) => `${i + 1}. ${item}`).join("\r\n") + bottomLine

					userTyped.send(outputMessage);
				});
			});
		} else {
			message.reply(":x: You don't have permission to use this command.");
		}
	}

	if (command === "help") {
		// Command: !help <voice channel> <Optional text>

		var userGuild = message.member.guild.members.fetch(message.author);
		var voiceChannel = args[0]
		var extraComment = args.slice(1).join(" ");

		if (!voiceChannel) {
			message.reply(":x: You need to type in your voicechannel.");
		}

		//Finding the help channel
		var helpChannel = message.guild.channels.cache.find(c => c.name === "help");
		if(!helpChannel) return message.channel.send(":x: Could not find the help channel. Create a channel called (help) to make this function work.");

		const helpEmbed = new MessageEmbed()
			.setColor("#0099ff")
			.setAuthor("✍️ Help needed")
			.setTitle(`${(await (await userGuild).displayName)} wants your help.`)
			.setThumbnail(message.author.avatarURL())
			.addFields(
				{ name: 'Voice Channel:', value: voiceChannel, inline: true },
				{ name: 'Extra Comment:', value: extraComment, inline: true },
				{ name: 'Mark this as done', value: 'Click this ✅ to mark it as done.' },
			)
			.setTimestamp()
			.setFooter("Help Time: ");

		var sendEmbed = helpChannel.send(helpEmbed);

		(await sendEmbed).react("✅")
	}

	if (command === "commands") {
	}

	if (command == "test") {
		console.log(message.author.avatarURL())
		message.channel.send("Hey!");
	}
});

client.login(process.env.IP);
