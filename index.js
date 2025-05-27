const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const TOKEN = 'TOKEN_BOT';
const GUILD_ID = 'ID_DU_SERVEUR';
const ROLE_ID = 'ID_ROLE_A_BAN'; // ID du rôle à bannir
const ALLOWED_USERS = ['ADMIN_DU_BOT_1', 'ADMIN_DU_BOT_2']; // Liste des utilisateurs autorisés ajouter des valeurs dans le tableau
const BAN_REASON = 'Quel sont les raisons du bannissement ?'; // RAISON DU BANISSEMENT A REMPLIR


client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!banRole') {
        // Vérifier si l'utilisateur est autorisé
        if (!ALLOWED_USERS.includes(message.author.id)) {
            console.log(`Utilisateur non autorisé : ${message.author.tag} (${message.author.id})`);
            return message.reply("Désolé, vous n'êtes pas autorisé à utiliser cette commande.");
        }

        try {
            console.log("Chargement des membres...");
            await message.guild.members.fetch();

            // Vérifier si le message vient du bon serveur
            if (message.guild.id !== GUILD_ID) {
                return message.channel.send("Cette commande ne peut être utilisée que sur le serveur autorisé.");
            }

            console.log("Recherche du rôle...");
            const role = await message.guild.roles.fetch(ROLE_ID);

            if (!role) {
                console.error(`Rôle introuvable avec l'ID : ${ROLE_ID}`);
                return message.channel.send(`Rôle introuvable. Vérifie l'ID : ${ROLE_ID}`);
            }

            const members = Array.from(role.members.values());
            const totalMembers = members.length;

            if (totalMembers === 0) {
                console.log(`Aucun membre trouvé avec le rôle : ${role.name}`);
                return message.channel.send(`Aucun membre ne possède le rôle : ${role.name}`);
            }

            console.log(`Début du bannissement des ${totalMembers} membres...`);

            for (let i = 0; i < totalMembers; i++) {
                const member = members[i];
                const remaining = totalMembers - (i + 1);

                try {
                    //Fonction pour envoyer un message DM avant le bannissement ne fonctionne pas si le membre a désactivé les DMs
                    await member.send(`Vous êtes banni du serveur ${message.guild.name}.\n${BAN_REASON}`);
                    console.log(`Message DM envoyé à : ${member.user.tag}`);
                } catch (err) {
                    console.error(`Erreur d'envoi de DM à : ${member.user.tag}`, err);
                }

                // Fonction pour bannir l'utilisateur
                try {
                    await member.ban({ reason: BAN_REASON });
                    console.log(`Membre banni : ${member.user.tag}. Restants : ${remaining}`);
                } catch (err) {
                    console.error(`Impossible de bannir : ${member.user.tag}`, err);
                }

                // Pause entre chaque bannissement pour éviter le rate-limit (403) de discord
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Pause supplémentaire après chaque 10 bannissements pour aussi éviter le rate-limit (403) de discord
                if ((i + 1) % 10 === 0 && remaining > 0) {
                    console.log("Pause de 15 secondes après 10 bannissements...");
                    await new Promise(resolve => setTimeout(resolve, 15000));
                }
            }

            message.channel.send(`Tous les membres avec le rôle "${role.name}" ont été bannis.`);
        } catch (error) {
            console.error('Une erreur est survenue :', error);
            message.channel.send('Une erreur est survenue. Vérifie la console.');
        }
    }
});

client.login(TOKEN);
