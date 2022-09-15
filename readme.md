## TODO

    * Détruire votre database
    * Recréer votre basse
    * Passer le dump => `mysql -u <username> -p flight_sell < ./api/sql/2022-09-15-19-23-origin.sql`

## 1) Commandes

`npx prisma introspect` - Crée le 'prisma.schema'
`npx prisma generate` - Regénérer les modèles prisma

## 2) Breaking and Change Log [*]

**Script SQL**

    * Plus de pluriels dans les noms des tables
    * Plus de descriptif des id inutiles
    * Renommage de la table: User => Customer
    * Ajout d'une contrainte unique sur la mail

**Build**

    * Ajout de la génération des modèles au moment du lancement du serveur (script `start`)