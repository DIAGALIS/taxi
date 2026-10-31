# Site Taxi Mazarine (démonstration)

Site statique de six pages, prêt pour GitHub Pages. Aucune installation nécessaire.

## Les pages
| Adresse | Fichier | Rôle |
|---|---|---|
| `/` | `index.html` | Accueil avec formulaire en tête |
| `/roissy-cdg/` | `roissy-cdg/index.html` | Page de campagne Roissy-CDG |
| `/orly/` | `orly/index.html` | Page de campagne Orly |
| `/tarifs/` | `tarifs/index.html` | Tous les tarifs |
| `/merci/` | `merci/index.html` | Page de remerciement après envoi (non indexée) |
| `/mentions-legales/` | `mentions-legales/index.html` | Mentions légales à compléter |

Les pages de campagne n'ont pas de menu : le visiteur ne voit que le formulaire et le numéro à appeler.

## Où modifier quoi
- **Téléphone, e-mail, tarifs aéroports, délai de rappel, mentions légales** : `config.js`. Un seul fichier, appliqué à toutes les pages.
- **Branchement du formulaire** : `formEndpoint` dans `config.js` (voir plus bas).
- **Couleurs, polices, mise en page** : `style.css`. Les couleurs sont en haut du fichier.
- **Comportement du formulaire** : `script.js`.
- **Textes d'une page** : le fichier `index.html` de cette page. Utilisez Ctrl + F pour retrouver une phrase.
- **Nom de la marque** : cherchez « Mazarine » dans tous les fichiers (touche point dans le dépôt GitHub pour ouvrir l'éditeur, puis recherche et remplacement global).

Note : le téléphone et les tarifs sont aussi écrits dans le HTML, pour les moteurs de recherche. `config.js` les remplace à l'affichage. Si vous les changez, faites aussi un remplacement global dans les fichiers HTML afin que Google voie les mêmes valeurs.

## Recevoir les demandes
Tant que `formEndpoint` est vide, le site est en mode démonstration : le récapitulatif s'affiche mais rien n'est envoyé.
1. Créez un formulaire chez un service d'envoi (Formspree, Formspark ou autre) et copiez son adresse.
2. Collez-la dans `formEndpoint` de `config.js`.
3. Testez : après l'envoi, le visiteur arrive sur `/merci/` et vous recevez la demande par e-mail.

Chaque demande contient aussi la page d'origine et, si présents dans l'adresse, `gclid` et les paramètres `utm_*` des campagnes.
Le formulaire contient un champ piège anti-spam. Pour plus de protection, activez l'anti-spam de votre service de formulaires.

## Ajouter une page de campagne
1. Copiez le dossier `roissy-cdg` et renommez-le (par exemple `gare-de-lyon`).
2. Dans son `index.html`, changez le titre, la description, le titre de page (H1), les tarifs et `data-dest` (la destination préremplie dans le formulaire).
3. Ajoutez l'adresse dans `sitemap.xml`.

## Google Ads
- Utilisez l'adresse de la page de campagne comme URL finale (par exemple `https://reserver.votresite.fr/roissy-cdg/`).
- Le suivi des conversions n'est pas installé. Il faut ajouter la balise Google après un bandeau de consentement (Consent Mode v2), à l'emplacement indiqué en commentaire dans `merci/index.html`.

## Avant la mise en ligne
- [ ] Remplacer le nom, le logo et le numéro fictif.
- [ ] Vérifier les tarifs réglementés et les engagements écrits dans les FAQ.
- [ ] Compléter les mentions légales et la section données personnelles (faire relire).
- [ ] Remplacer `VOTRE-DOMAINE` dans `robots.txt` et `sitemap.xml`.
- [ ] Retirer la phrase de démonstration du pied de page.
- [ ] Renseigner `formEndpoint` et tester un envoi.

## Mettre en ligne sur GitHub Pages
Dépôt GitHub : **Add file > Upload files**, glissez tout le contenu du dossier (fichiers et sous-dossiers), puis **Commit changes**. Dans **Settings > Pages**, la source est la branche `main`, dossier `/ (root)`.
