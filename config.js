/* ================================================================
   CONFIGURATION DU SITE : c'est le seul fichier à modifier pour
   changer le téléphone, les tarifs, l'e-mail ou brancher le formulaire.
   Enregistrez, puis rechargez le site (Ctrl + Maj + R).
   ================================================================ */
window.SITE = {
  nom: "Taxi Mazarine",
  tel: "01 99 00 67 24",            // numéro affiché
  telLien: "+33199006724",    // numéro pour le bouton d'appel, format international sans espaces
  email: "contact@exemple.fr",
  rappel: "15 minutes",      // délai de rappel annoncé sur la page de remerciement

  // Forfaits aéroports en euros (exemples : à vérifier avant mise en ligne)
  tarifs: {
    cdgDroite: 56,
    cdgGauche: 65,
    orlyGauche: 36,
    orlyDroite: 44
  },

  // FORMULAIRE : adresse d'envoi fournie par votre service de formulaires
  // (par exemple Formspree : "https://formspree.io/f/xxxxxxxx").
  // Tant que ce champ est vide, le site reste en mode démonstration :
  // la demande est affichée à l'écran mais n'est envoyée à personne.
  formEndpoint: "",

  // MENTIONS LÉGALES : à compléter avec vos informations réelles
  raison: "À compléter : raison sociale",
  forme: "À compléter : forme juridique et capital",
  siret: "À compléter : numéro SIRET",
  adresse: "À compléter : adresse du siège",
  licence: "À compléter : autorisation de stationnement (ADS) et carte professionnelle",
  directeur: "À compléter : responsable de la publication"
};
