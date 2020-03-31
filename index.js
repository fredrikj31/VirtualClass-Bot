const { Client, MessageEmbed } = require('discord.js');

const { config } = require('dotenv');

const client = new Client({
	disableEveryone: true
});

config({
	path: __dirname + "/.env"
})


client.on("ready", () => {
	console.log(`I'm online! My name is ${client.user.username}`);

	client.user.setActivity('Students study!', { type: 'WATCHING' })
});

client.on("message", async message => {
	
	const prefix = "!"

	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member) message.member = await message.guild.fetchMember(message);


	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	//Commands
	if (cmd === "ping") {
		const msg = await message.channel.send(`🏓 Pinging....`);

        msg.edit(`🏓 Pong! Latency is ${Math.floor(msg.createdAt - message.createdAt)}ms`);
	}

	if (cmd === "moveall") {
		const ownerChannel = message.member.voice.channel
		//if (ownerChannel) {
			// Get the Guild and store it under the variable "list"
			const offlineMembers = guild.members.filter(member => member.presence.status === "offline");

			console.log(offlineMembers);

			// Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
			//list.members.forEach(member => console.log(member.user.username)); 
		/*} else {
			message.reply("You need to join a voice channel first!");
		}*/
	} 
})

client.login(process.env.TOKEN);