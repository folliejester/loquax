require('dotenv').config()
const config = require('./config.json')
async function slashcom(config, guildID, guildname) {
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [{
  name: 'help',
  description: 'Shows the help embed!'
},
{
  name: 'chatbot',
  description: 'Mentions the chatbot registered channel'
},
{
  name: 'setcb',
  description: 'Set the current channel for chatbot usage'
},
{
  name: 'delcb',
  description: 'Remove the channel for chatbot usage'
},
{
  name: 'ping',
  description: `Check the bot's ping`
},
{
  name: 'uptime',
  description: `Check how long the bot is online for`
},
{
  name: 'prefix',
  description: 'Check the prefix'
},
{
  name: 'resetprefix',
  description: 'Reset the prefix set for this server'
}
]; 

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing application (/) commands for ${guildname}\n`);

    await rest.put(
      Routes.applicationGuildCommands(config.client_ID, guildID),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands for ${guildname}`);
  } catch (error) {
    console.error(`${guildname} (${guildID}) needs to re-add the bot.`);
  }
})();
}

const Discord = require("discord.js");
const db = require("quick.db");
const fetch = require("node-fetch");
const { default_prefix } = require("./config.json");

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

/*const { AutoPoster } = require('topgg-autoposter')
AutoPoster(config.topdotgg_token, client)
.on('posted', (stats) => {
  console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
});*/

client.on('ready', async () => {
  console.log(client.user.username + " is online bitches!\n");
  client.guilds.cache.forEach(guild => {
    client.user.setActivity(`${client.guilds.cache.size} servers | ${client.users.cache.size} members | since 30th October '21 | ~commands | ~getsyden`, { type: 'LISTENING' });
    console.log(`${guild.id}\t${guild.me.permissions.has('ADMINISTRATOR')}\t${guild.memberCount}\t${guild.name}`);
    slashcom(config, guild.id, guild.name)
    });
      
    let chan = await client.channels.fetch("758969560060919810");
    const embed = new Discord.MessageEmbed()
    .setColor("ff2779")
    .setTitle("Loquax Hosting Now!")
    .setImage("https://media.giphy.com/media/z8vquH3Dhg8MxTzali/giphy.gif")
    //.setTimestamp()
    chan.send({embeds:[embed]})
});

client.on("guildCreate", async guild => {
  if (!guild.available) return;
  let Prefix = db.get(`prefix_${guild.id}`);
  if (Prefix === null) Prefix = default_prefix;
  let owner = await guild.members.fetch(guild.ownerId);
  const app = await client.application.fetch();
  const embed = new Discord.MessageEmbed()
  .setColor('ff2779')
  .setAuthor(`Made by ${app.owner.username}#${app.owner.discriminator}`,app.owner.avatarURL({format: "jpeg",dynamic:true, size:1024}))
  .setTitle(app.name +' | '+ client.user.username+'#'+client.user.discriminator)
  .setDescription(`Hello ${owner.user.username}, thank you for having me onboard.\nMy name is Loquax, talkative in Latin, the name kinda suits me though.\nThis message is sent to you because I have been added to a server you own, also, this message serve as a notification of me joining your server.\nTo setup, type the follow command in your server's channel : \`${Prefix}setcb\` and the channel will be registered for me to chat.\nTo remove it, type \`${Prefix}delcb\` in the any channel and the registered channel will be removed.\nIf you face any trouble, join the [support server](https://discord.gg/FgjzdwB "Syden's Test & Support Server") to get assistance.\nI'd also appreciate your support to the project at [Buy Me A Coffee](https://buymeacoffee.com/Loquax "Loquax's BMC Page").`)
  .setImage('https://i.imgur.com/uXZU4Iw.gif')
  .setThumbnail(app.iconURL({format:"jpeg",size:1024,dynamic:true}))
  .setFooter('https://buymeacoffee.com/Loquax','https://bmc-dev.s3.us-east-2.amazonaws.com/assets/icons/bmc_icon_black.png')
  owner.send({embeds:[embed]})
  .catch(err => {
    return;// guild.channels.fetch();
  })
  slashcom(config, guild.id, guild.name)
  client.user.setActivity(`${client.guilds.cache.size} servers | ${client.users.cache.size} members | since 4th June, 20 | ~commands | ~getsyden`, { type: 'LISTENING' });
  let joinChannel = await client.channels.fetch("758969811299467276");
  var big = " ";
  if (!guild.large) big = "small";
  else return (big = "large");
  const joinembed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor(`Owned by ${owner.user.tag}`, owner.user.avatarURL({ format: "jpg", size: 1024, dynamic: true }), `https://discordapp.com/users/${guild.ownerID}`)
    .setTitle(`Joined a new guild, ${guild.name}!`)
    //.setURL(invite.code)
    .setThumbnail(guild.iconURL({ format: "jpg", size: 1024, dynamic: true }))
    .setDescription(`This ${big} happy guild has ${guild.memberCount.toString()} members!`)
    .addFields(
      { name: "ID", value: guild.id, inline: true },
      { name: "Vanity URL Code", value: (guild.vanityURLCode) || "None", inline: true },
      { name: "Preffered Locale", value: (guild.preferredLocale || "None Yet"), inline: true }
    )
    .setImage( (guild.splashURL) || guild.iconURL({ format: "jpg", size: 1024, dynamic: true }) )
    .setTimestamp();
  joinChannel.send({embeds: [joinembed]});
});

  client.on("guildDelete", async guild =>{
    client.user.setActivity(`${client.guilds.cache.size} servers | ${client.users.cache.size} members | since 4th June, 20 | ~commands | ~getsyden`, { type: 'LISTENING' });
    let kickChannel = client.channels.cache.get("758969811299467276");
    var big = " ";
    if (!guild.large) big = "small";
    else return (big = "large");
    let owner = await guild.members.fetch(guild.ownerId);
    const joinembed = new Discord.MessageEmbed()
    .setColor("RED")
    .setAuthor(`Owned by ${owner.user.tag}`, owner.user.avatarURL({ format: "jpg", size: 1024, dynamic: true }), `https://discordapp.com/users/${guild.ownerID}`)
    .setTitle(`Got kicked from ${guild.name} 😭`)
    //.setURL(inv.url)
    .setThumbnail(guild.iconURL({ format: "jpg", size: 1024, dynamic: true }))
    .setDescription(`Served this ${big} happy guild of ${guild.memberCount.toString()} members since ${new Date(guild.joinedTimestamp)}!`)
    .addFields(
      { name: "ID", value: guild.id, inline: true },
      { name: "Vanity URL Code", value: (guild.vanityURLCode) || "None", inline: true },
      { name: "Preffered Locale", value: (guild.preferredLocale || "None"), inline: true }
    )
    .setImage((guild.splashURL) || guild.iconURL({ format: "jpg", size: 1024, dynamic: true }))
    .setTimestamp();
    kickChannel.send({embeds: [joinembed]});
});

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
  if(msg.content.includes("https://discord.gift/"))
  {
    let nitch = client.channels.cache.get('827939701255176213')
    nitch.send(`<@&758041355388846171>\n${msg.content}`);
  }
  if (!msg.guild) return;
  let Prefix = db.get(`prefix_${msg.guildId}`);
  if (Prefix === null) Prefix = default_prefix;
  if(msg.content == `<@!${config.client_ID}>` || msg.content == `<@${config.client_ID}>`) return msg.reply(`Bot's prefix for this guild is \`\`${Prefix}\`\`\nTo customise it, kindly use the \`\`${Prefix}prefix\`\` command!`)
  .catch(err => {
    return;
  })
  if (msg.content.startsWith(Prefix)) 
  {
    commands(msg, Prefix);
  }
  let chatbotchan = db.get(`chatbot_${msg.guildId}`);
  if(chatbotchan === null) return;
  if (msg.channel.id == chatbotchan)
  {
    if(msg.content.startsWith(Prefix)) return;
    const string = msg.content.toLowerCase();
    let chat = "";
    removeEmojis(string)
    function removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return chat = string.replace(regex, "");
    }
    if(chat.length < 1) return;
    msg.channel.sendTyping();
    const { message } = await fetch(`https://api.udit.gq/api/chatbot?message=${chat.replaceAll('follie','udit')}&name=${msg.guild.me.displayName}&user=${msg.author.id}&gender=female`)
    .then (response => response.json())
    .catch(err => {
      console.log(err.message)
    })
    return msg.reply(message.replaceAll('Udit','Follie').replace('a great A.I. R&D team based in CA. This is developed by them to help people all over the world with artificial intellegence.','my dear great botmaster.'))
    .catch(err => {
    return;
  })
  }   
});

async function commands(msg, Prefix) 
{
  let fullCommand = msg.content.substr(Prefix.length);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let args = splitCommand.slice(1);
  let content = primaryCommand.toLowerCase();

  if (content == "help")
{
  const version = require("./package.json");
  const app = await client.application.fetch();
  const embed = new Discord.MessageEmbed()
  .setColor('ff2779')
  .setAuthor(`Made by ${app.owner.username}#${app.owner.discriminator}`,app.owner.avatarURL({format: "jpeg",dynamic:true, size:1024}))
  .setTitle(app.name +' | '+ client.user.username+'#'+client.user.discriminator)
  .setURL('https://dsc.gg/loquax')
  .setDescription(`Hello ${msg.member.displayName},\nPrefix for this server is ${Prefix}\n\nTo setup, type the follow command in your server's channel : \`${Prefix}setcb\` and the channel will be registered for me to chat.\nTo remove it, type \`${Prefix}delcb\` in the any channel and the registered channel will be removed.\nTo change the prefix type \`${Prefix}prefix [your preffered symbol]\`\nTo check the bot's ping, type \`${Prefix}ping\`\nTo check how long the bot is online for, type \`${Prefix}uptime\`\nYou can also use the slash command interaction by typing a forward slash/ and choose the preferred interaction you want.\nIf you face any trouble, [click to join the support server](https://discord.gg/FgjzdwB "Syden's Test & Support Server") to get assistance.\nI'd also appreciate your support to the project at [Buy Me A Coffee](https://buymeacoffee.com/Loquax "Loquax's BMC Page").\n\n[Invite me](https://discord.com/oauth2/authorize?client_id=903855063359950888&permissions=517611052096&scope=bot%20applications.commands "Vanity : dsc.gg/loquax") | [Github](https://github.com/folliejester/loquax "Open Source") | [VPS Host](https://www.vultr.com/?ref=8913956 "Vultr VPS") | [Community Server](https://discord.gg/96vgbea "The Rushia's Cult!")`)
  .setImage('https://i.imgur.com/uXZU4Iw.gif')
  .setThumbnail(app.iconURL({format:"jpeg",size:1024,dynamic:true}))
  .setFooter('https://buymeacoffee.com/Loquax','https://bmc-dev.s3.us-east-2.amazonaws.com/assets/icons/bmc_icon_black.png')
  .addField('Launched on','30th October 2021',true)
  .addField('API and environment',`[discord.js v${version.dependencies['discord.js'].replace('^',"")}](https://discord.js.org/#/ "Imagine a bot")\n[Node.js v${version.engines.node.replace('.x',"")}](https://nodejs.org/en/ "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.")`,true)
  msg.author.send({embeds:[embed]})
  .then( m=> {
    msg.react('🇩')
    .then(ms => {
      msg.react('🇲');
    })
  .catch( ec => {
    msg.reply("Check your DM!")
    .catch(mec => {
      return;
    })
  })
})
.catch(err => {
  return msg.reply({embeds: [embed]})
  .catch(err => {
    return msg.react("❌")
    .catch(er => {
      return;
    })
  })
})
}
else if (content == "ping") 
  {
    pingCommand(msg)
  }
  else if (content == "uptime") 
  {
    uptimeCommand(msg, args)
  }
else if(content == "setcb")
  {
    if (!msg.member.permissions.has('MANAGE_CHANNELS')) return msg.reply('You are not authorized to execute this command.')
    .catch(err => {
      return msg.react("❌")
      .catch(er => {
        return;
      })
    })
    db.set(`chatbot_${msg.guildId}`, msg.channel.id)
    let cbch = await db.get(`chatbot_${msg.guildId}`);
    return await msg.reply(`Channel <#${cbch}> has been successfully setup for Loquax's AI Chatbot.\nThank you for having Loquax.`)
    .catch(err => {
      return msg.react("✅")
      .catch(er => {
        return;
      })
    })
  }
  else if(content == "delcb")
  {
   if (!msg.member.permissions.has('MANAGE_CHANNELS')) return msg.reply('You are not authorized to execute this command.')
   .catch(err => {
    return msg.react("❌")
    .catch(er => {
      return;
    })
  })
  let cbch = db.get(`chatbot_${msg.guildId}`);
  db.delete(`chatbot_${msg.guildId}`);
   return await msg.reply(`Channel <#${cbch}> has been successfully removed for Loquax's AI Chatbot.\nThank you for trying Loquax.`)
   .catch(err => {
    return msg.react("✅")
    .catch(er => {
      return;
    })
  })
  }
  else if(content == "prefix")
  {
    const { default_prefix } = require("./config.json")
    if(msg.author.id !== msg.guild.ownerId) return msg.reply("Only guild owner is authorized to use that command!")
    .catch(err => {
      return msg.react("❌")
      .catch(er => {
        return;
      })
    })
    if(!args[0]) return msg.reply("Mention the prefix following the command")
    .catch(err => {
      return msg.react("❌")
      .catch(er => {
        return;
      })
    })
    if(args[1]) return msg.reply("Prefix cannot contain any space in between")
    .catch(err => {
      return msg.react("❌")
      .catch(er => {
        return;
      })
    }) 
    if(args[0].length > 3) return msg.reply("Prefix must be less than 3 characters")
    .catch(err => {
      return msg.react("❌")
      .catch(er => {
        return;
      })
    })
    if(args.join("") === default_prefix)
    {
      db.delete(`prefix_${msg.guildId}`)
      return await msg.reply("Bot's prefix has been reset ✅")
      .catch(err => {
        return msg.react("❌")
        .catch(er => {
          return;
        })
      })
    }
    db.set(`prefix_${msg.guildId}`, args[0])
    return await msg.reply(`Bot's prefix has been set to ${args[0]}`)
    .catch(err => {
      return msg.react("❌")
      .catch(er => {
        return;
      })
    })
  }
}

async function pingCommand(msg)
{
  const m = await msg.channel.send("Pinging . .. ...")
  .catch(err => {
    return msg.react("❌")
    .catch(er => {
      return;
    })
  })
  let sign = "", sign2 = "";
  
  if((m.createdTimestamp - msg.createdTimestamp) < 100) sign = "🟢";
  else if((m.createdTimestamp - msg.createdTimestamp) > 99 && (m.createdTimestamp - msg.createdTimestamp) < 150) sign = "🟡";
  else if((m.createdTimestamp - msg.createdTimestamp) > 149 && (m.createdTimestamp - msg.createdTimestamp) < 300) sign = "🟠";
  else if((m.createdTimestamp - msg.createdTimestamp) > 299) sign = "🔴";

  if(msg.client.ws.ping < 100) sign2 = "🟢";
  else if(msg.client.ws.ping > 99 && msg.client.ws.ping < 150) sign2 = "🟡";
  else if(msg.client.ws.ping > 149 && msg.client.ws.ping < 300) sign2 = "🟠";
  else if(msg.client.ws.ping > 299) sign2 = "🔴";

  const pingembed = new Discord.MessageEmbed()
    .setColor("ff2779")
    .setTitle("Loquax's Latency")
    .addFields(
      {name: "Latency",value: `${m.createdTimestamp - msg.createdTimestamp}ms ${sign}`,inline: true},
      {name: "API Latency",value: `${Math.round(msg.client.ws.ping)}ms ${sign2}`,inline: true}
    );
  await m.edit({content:"Pinged!", embeds: [pingembed]})
  .catch(err => {
    return msg.react("❌")
    .catch(er => {
      return;
    })
  })
}

function uptimeCommand(msg)
{
  var day, hour, minute, seconds;
  seconds = Math.floor(client.uptime / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  const uptime = `${day} days, ${hour} hours, ${minute} minutes and ${seconds} seconds`;
  const utembed = new Discord.MessageEmbed()
  .setColor("ff2779")
  .setDescription(uptime)
  .setTitle('Hosting Duration 🕛')
  return msg.reply({embeds: [utembed]})
  .catch(err => {
    return msg.react("❌")
    .catch(er => {
      return;
    })
  })
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if(!interaction.inGuild()) return;
  let Prefix = db.get(`prefix_${interaction.guildId}`);
  if (Prefix === null) Prefix = default_prefix;
  if(interaction.commandName === 'prefix')
  {
    return interaction.reply(`Bot's prefix for this guild is \`\`${Prefix}\`\`\nTo customise it, kindly use the \`\`${Prefix}prefix\`\` command!`)
    .catch(err => {
      return;
    })
  }
  else if (interaction.commandName === 'chatbot')
  {
    let chatbotchan = db.get(`chatbot_${interaction.guildId}`);
    if(chatbotchan === null) return interaction.reply('There are no channel registered for chatbot usage in this server.')
    .catch(err => {
      return;
    })
    return interaction.reply(`The channel set for chatbot in this server is <#${chatbotchan}>`)
    .catch(err => {
      return;
    })
  }
  else if (interaction.commandName === 'setcb')
  {
    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply('You are not authorized to execute this command.')
    .catch(err => {
      return;
    })
    db.set(`chatbot_${interaction.guildId}`, interaction.channel.id)
    let cbch = await db.get(`chatbot_${interaction.guildId}`);
    return await interaction.reply(`Channel <#${cbch}> has been successfully setup for Loquax's AI Chatbot.\nThank you for having Loquax.`)
    .catch(err => {
      return;
    })
  }
  else if (interaction.commandName === 'delcb')
  {
    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply('You are not authorized to execute this command.')
    .catch(err => {
      return;
    })
    let cbch = db.get(`chatbot_${interaction.guildId}`);
    db.delete(`chatbot_${interaction.guildId}`);
    return await interaction.reply(`Channel <#${cbch}> has been successfully removed for Loquax's AI Chatbot.\nThank you for trying Loquax.`)
    .catch(err => {
      return;
    })
  }
  else if (interaction.commandName === 'resetprefix')
  {
    const { default_prefix } = require("./config.json");
    if(interaction.user.id !== interaction.guild.ownerId) return interaction.reply("Only guild owner is authorized to use that command!")
    .catch(err => {
      return;
    })
    db.delete(`prefix_${interaction.guildId}`)
    return await interaction.reply("Bot's prefix has been reset to `~`, the tilde symbol.")
    .catch(err => {
      return;
    })
  }
  else if (interaction.commandName === 'ping') {
    await interaction.reply("Pinging . .. ...")
    .catch(err => {
      return;
    })
    const m1 = await interaction.fetchReply()
    let sign = "", sign2 = "";
  
  if((m1.createdTimestamp - interaction.createdTimestamp) < 100) sign = "🟢";
  else if((m1.createdTimestamp - interaction.createdTimestamp) > 99 && (m1.createdTimestamp - interaction.createdTimestamp) < 150) sign = "🟡";
  else if((m1.createdTimestamp - interaction.createdTimestamp) > 149 && (m1.createdTimestamp - interaction.createdTimestamp) < 300) sign = "🟠";
  else if((m1.createdTimestamp - interaction.createdTimestamp) > 299) sign = "🔴";

  if(interaction.client.ws.ping < 100) sign2 = "🟢";
  else if(interaction.client.ws.ping > 99 && interaction.client.ws.ping < 150) sign2 = "🟡";
  else if(interaction.client.ws.ping > 149 && interaction.client.ws.ping < 300) sign2 = "🟠";
  else if(interaction.client.ws.ping > 299) sign2 = "🔴";

  const pingembed = new Discord.MessageEmbed()
    .setColor("ff2779")
    .setTitle("Syden's Latency")
    .addFields(
      {name: "Latency",value: `${m1.createdTimestamp - interaction.createdTimestamp}ms ${sign}`,inline: true},
      {name: "API Latency",value: `${Math.round(interaction.client.ws.ping)}ms ${sign2}`,inline: true}
    );
  await interaction.editReply({content:"Pinged!", embeds: [pingembed]})
  }
  else if (interaction.commandName === "uptime") {
    var day, hour, minute, seconds;
  seconds = Math.floor(client.uptime / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  const uptime = `${day} days, ${hour} hours, ${minute} minutes and ${seconds} seconds`;
  const utembed = new Discord.MessageEmbed()
  .setColor("ff2779")
  .setDescription(uptime)
  .setTitle('Hosting Duration 🕛')
  return interaction.reply({embeds: [utembed]})
  .catch(err => {
    return;
  })
  }
});

client.login(process.env.DISCORD_TOKEN);
