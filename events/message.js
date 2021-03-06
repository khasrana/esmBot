const fs = require("fs");

module.exports = async (client, message) => {
  // requested by saltypepper#1212
  if (message.author.id === "339614400526942218" && message.content === "Haha fuck you esmbot, kekbot is offline") {
    message.channel.send("no u <@339614400526942218>");
  }

  // ignore messages from other bots
  if (message.author.bot) return;

  // esmBot is scared of DMs
  if (!message.guild) return;

  // prefix can be a mention or a set of special characters
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const guildConf = client.settings.ensure(message.guild.id, client.defaults);
  const prefix = prefixMention.test(message.content) ? message.content.match(prefixMention)[0] : guildConf.prefix;

  // ignore unrelated messages
  if (message.content.startsWith(prefix) === false && message.mentions.has(client.user) !== true && message.content.indexOf("😂") <= -1 && message.content.toLowerCase().indexOf("yeah") <= -1 && message.guild.id !== "433408970955423765") return;

  // esmServer/18's base specific stuff
  if (!message.guild.me.permissions.has("ADD_REACTIONS") && !message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS")) {
    if (message.guild.id === "433601545855172609" && message.mentions.has(client.user) === true || message.guild.id === "425800147008487436" && message.mentions.has(client.user) === true || message.guild.id === "322114245632327703" && message.mentions.has(client.user) === true) {
      client.logger.log("[ESM] Reacted to ping");
      message.react(client.emojis.get("433628233783836672"));
    }
    if (message.guild.id === "433601545855172609" && message.content.indexOf("😂") > -1 || message.guild.id === "322114245632327703" && message.content.indexOf("😂") > -1) {
      client.logger.log("[ESM] Reacted to tears of joy emoji");
      await message.react("🇽");
      await message.react("🇩");
    }
  }
  // requested by hepointatsquib#4622
  /*if (message.content.toLowerCase().indexOf("yeah") > -1 && message.guild.id === "322114245632327703") {
    client.logger.log("[ESM] Reacted to yeah");
    await message.react(client.emojis.get("483102768341712896"));
  }*/
  if (message.channel.id === "434076900160307212" && message.guild.id === "433408970955423765") {
    const generalChannel = client.guilds.get("322114245632327703").channels.get("322114245632327703");
    if (message.attachments.array().length !== 0) {
      generalChannel.send(message.content, {
        files: [message.attachments.array()[0].url]
      });
    } else {
      generalChannel.send(message.content);
    }
  }

  // separate commands and args
  const escapedPrefix = client.regexEscape(prefix);
  const prefixRegex = new RegExp(`^(${escapedPrefix})`);
  const args = message.content.replace(prefixRegex, "").trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // check if command exists
  const cmd = client.commands.get(`${command}.js`) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;

  // check is user is banned from using commands
  fs.readFile("./bannedusers.json", (error, data) => {
    if (error) throw new Error(error);
    if (JSON.parse(data).indexOf(message.author.id) > -1) {
      client.logger.cmd(`[CMD] ${message.author.username} (${message.author.id}) tried to run the command ${command}, but they are banned!`);
    } else {
      // actually run the command
      client.logger.cmd(`[CMD] ${message.author.username} (${message.author.id}) ran command ${command}`);
      cmd.run(client, message, args);
    }
  });
};
