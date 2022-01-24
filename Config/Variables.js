const niveaux = ["L1", "L2", "L3", "M1", "M2"];

const mentions = [
  {
    mention: "Mathématiques appliquées et informatiques",
    code: "MI",
    specialisations: ["Création multimédia", "Génie logiciel"],
  },
  {
    mention: "Economie-Management",
    code: "EM",
    specialisations: ["Econométrie", "Marketing", "Management d'entreprise"],
  },
];

const fraisScolarite = {
  L1: 950000,
  L2: 1150000,
  L3: 1250000,
  M1: 950000,
  M2: 1150000,
};

const fraisInscription = 50000;

const grades = [{ assistant: 10526.3, maitre_de_conference: 12631.6 }];

module.exports = {
  niveaux,
  mentions,
  fraisScolarite,
  fraisInscription,
  grades,
};
