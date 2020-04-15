module.exports = {
	name: 'moveall',
	description: 'Moves all the users to the user channel..',
	execute(message, args) {
		let userChannel = message.member.voice.channel;
		let onlineUsers = message.guild.voiceStates.cache;
		//console.log(onlineUsers)
		if (onlineUsers.size > 0) {
			//console.log(onlineUsers)
			onlineUsers.forEach((value, key) => {
				selectedUser = message.guild.member(key);
				console.log(selectedUser);
				//console.log(selectedUser);
				//selectedUser.voice.setChannel(userChannel);
			});
		} else {
			message.reply("There is nobody in a voice channel on this server.");
		}
	},
};


