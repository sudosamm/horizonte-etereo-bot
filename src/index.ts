import { Client, GatewayIntentBits, Events, ActivityType} from 'discord.js';
import 'dotenv/config';

//Define as intenções iniciais do bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Primeiro carregamento do bot: informa no terminal que o bot está pronto e em quantos servidores ele está conectado.
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Bot online como ${readyClient.user.tag}!`);
    console.log(`Conectado a ${readyClient.guilds.cache.size} servidor(es)!`);

    // Lista de atividades para o bot
    const activities = [
        { name: "anomalias no espaço-tempo", type: ActivityType.Playing },
        { name: "as estrelas colidirem", type: ActivityType.Watching },
        { name: "ecos do multiverso", type: ActivityType.Listening }
    ];

    // Contador do bot
    let i = 0;

    // Define o primeiro estado do bot, para evitar a possibilidade do mesmo ficar sem atividades nos primeiros 30s ao inicializar.
    client.user?.setActivity(activities[i].name, { type: activities[i].type });

    // Utilizo setInterval para executar a função de troca a cada 30s
    setInterval(() => {
        const activity = activities[i];
        client.user?.setActivity(activity.name, { type: activity.type });
        i = (i+1) % activities.length;
    }, 30000);
});

// Executa ações ao enviar mensagens no chat do servidor
client.on(Events.MessageCreate, (message) => {
    // Ignora mensagens de outros bots, inclusive de si mesmo
    if(message.author.bot) return;

    // Comando de ping
    if(message.content == `!ping`){
        const latency = Date.now() - message.createdTimestamp;
        message.reply(`Pong! Latência de ${latency}ms!`);
    }

    // Comando de informações
    if(message.content == `!info`){
        const channel = message.channel;
        const author = message.author;
        const guild = message.guild;
        message.reply([
            `Olá, você deve ser <@${author.id}>, correto?`,
            `Estamos ${channel.isTextBased() ? `no canal <#${channel.id}>` : 'em um canal desconhecido.'}.`,
            `Esta mensagem está sendo enviada no ${guild?.name ?? 'privado'}.`,
        ].join('\n'));
    }
});

// Conexão com o Discord
client.login(process.env.DISCORD_TOKEN);