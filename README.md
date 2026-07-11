Mon fichier README.md explicite
🧬 Plateforme Full-Stack : Gestion de Clients & Visualisation Scientifique.
Ce projet universitaire consiste en une application web découplée conçue pour centraliser la gestion d'un portefeuille de clients et publier des rapports d'analyses biologiques complexes (visualisation de profils d'expression de gènes et séquençages d'ADN à haut débit). L'application intègre également un espace collaboratif de discussion scientifique sous chaque publication.
 Architecture & Technologies:
**Front-end** : React (Vite), Tailwind CSS, Axios, React Router Dom  
**Back-end** : Laravel 11 (REST API), Eloquent ORM  
**Base de données** : MySQL (PhpMyAdmin)
**Fonctionnalités Implémentées**  **Dashboard Scientifique :** Visualisation des rapports d'analyses et des graphiques associés.  **Espace de Discussion :** Système de commentaires interactif en temps réel sous chaque article, intégré directement sur la page d'accueil avec intégrité relationnelle (onDelete cascade). 
**Gestion de clients :** Fiches clients dynamiques et structurées. 
 📦 Procédure d'Installation et Lancement Pour cloner et exécuter ce projet localement, suivez les étapes ci-dessous. 
   1. Préparation du Back-end (Laravel) 
Résultat du code
Fichier généré avec succès. `bash cd ologoblog-api composer install cp .env.example .env # Configurez ensuite votre base de données relationnelle 'ologoblog_db' dans le fichier .env php artisan key:generate php artisan migrate php artisan storage:link php artisan serve 
  2. Préparation du Front-end (React)
Bash
cd ologoblog-front npm install npm run dev 
🔬 Protocoles de Tests & Résolution d'Anomalies
Au cours du cycle de développement, une phase rigoureuse de débogage a permis de stabiliser l'application face à deux anomalies majeures :
Résolution SQLSTATE[42S22] (Unknown column 'image') : Remise en conformité des schémas de base de données MySQL via l'exécution complète des migrations Laravel et la synchronisation des liens symboliques de stockage.

Correctif de Rendering et Parsing JSX : Sécurisation du rendu de l'interface React en encapsulant le gestionnaire d'erreurs onError de l'élément d'affichage d'images de couverture pour éviter les crashs si le lien de stockage est manquant.
