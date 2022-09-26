## Déploiement :
  
**Côté api :**
  
    1/ Installer votre base MySQL  
    2/ Crée une base de donnée s'appelant `flight_sell`  
    3/ Importer les données du fichier INTECH-FLIGHTSELL-SIMAJCHEL-GONI-SERHAT-VILLALONGA\api2\src\sql\origin.sql dans la base de donnée crée précedemment  
    4/ Lancer la commande `npm install`  
    5/ Insérer l'accès à la bdd dans le .env  
    6/ Lancer la commande `npx prisma introspect` (Crée le 'prisma.schema')  
    7/ Lancer la commande `npx prisma pull` et `npx prisma generate` (Regénérer les modèles prisma)  
    8/ Lancer `npm run dev`  
  
**Côté application :**  
  
    1/ Lancer la commande `npm install`  
    2/ Lancer la commande `npm run dev`  