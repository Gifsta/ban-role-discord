# Bot de Bannissement de Rôle Discord

## Description

Ce projet est un **bot Discord** développé en **Node.js** utilisant la bibliothèque **discord.js**. Il permet de bannir automatiquement tous les membres possédant un rôle spécifique sur un serveur donné.

## Fonctionnalités

* Vérification des autorisations des utilisateurs autorisés à exécuter la commande.
* Bannissement de tous les membres avec un rôle donné.
* Envoi d'un message privé (DM) avant le bannissement (si les DMs sont activés).
* Gestion des délais pour éviter les limitations de taux (rate limits) de l'API Discord.

## Prérequis

* **Node.js** v16.9.0 ou supérieur
* Un compte Discord avec accès au serveur et au bot
* Un bot Discord configuré via le [Discord Developer Portal](https://discord.com/developers/applications)

## Installation

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/votre-utilisateur/discord-role-ban-bot.git
   cd discord-role-ban-bot
   ```
2. Installez les dépendances :

   ```bash
   npm install
   ```

## Configuration

1. Ouvre le fichier `index.js` à la racine du projet.
2. Modifie directement dans `index.js` les constantes de configuration :

   ```js
   const TOKEN = 'VOTRE_TOKEN_DE_BOT';         // Token du bot Discord
   const GUILD_ID = 'ID_DU_SERVEUR';          // ID du serveur où le bot opérera
   const ROLE_ID = 'ID_DU_ROLE';              // ID du rôle à bannir
   const ALLOWED_USERS = ['ID1','ID2','ID3']; // Liste des IDs autorisés
   const BAN_REASON = 'RAISON_DU_BANNISSEMENT'; // Raison du bannissement
   ```
3. Enregistre les modifications et relance le bot.

## Utilisation

1. Lancez le bot :

   ```bash
   node index.js
   ```
2. Dans le serveur Discord configuré, tapez la commande :

   ```
   !banRole
   ```
3. Le bot :

   * Vérifiera que l'auteur est dans la liste `ALLOWED_USERS`.
   * Chargera tous les membres du serveur.
   * Trouvera le rôle correspondant à `ROLE_ID`.
   * Pour chaque membre ayant ce rôle :

     1. Tente d'envoyer un message privé (DM) avec la raison du bannissement.
     2. Banni le membre avec la raison spécifiée.
     3. Attend 2 secondes entre chaque bannissement pour éviter les rate limits.
     4. Pause de 15 secondes après chaque 10 bannissements.

## Permissions requises

Le bot doit posséder les permissions suivantes dans votre serveur :

* **Bannir des membres** (`BAN_MEMBERS`)
* **Lire l'historique des messages**
* **Envoyer des messages**
* **Envoyer des messages privés**

## Limitations et sécurité

* Assurez-vous que le bot n'a pas de permissions excessives.
* Vérifiez la fiabilité des IDs (`GUILD_ID`, `ROLE_ID`, `ALLOWED_USERS`).
* Les délais (`setTimeout`) sont paramétrables dans `index.js` pour s'adapter aux limites de votre serveur.

## Contribution

Les pull requests sont les bienvenues. Pour toute modification majeure, veuillez ouvrir une issue d'abord pour discuter des changements.

## Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.
