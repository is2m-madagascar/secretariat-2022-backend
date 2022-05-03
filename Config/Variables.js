const niveaux = ["L1", "L2", "L3", "M1", "M2"];

const mentions = [
  {
    mention: "Mathématiques appliquées et informatiques",
    code: "MI",
    specialisations: [
      {
        label: "Création multimédia",
        code: "CM",
      },
      {
        label: "Génie logiciel",
        code: "GL",
      },
    ],
  },
  {
    mention: "Economie-Management",
    code: "EM",
    specialisations: [
      {
        label: "Econométrie",
        code: "EC",
      },
      {
        label: "Marketing",
        code: "MA",
      },
      {
        label: "Management d'entreprise",
        code: "ME",
      },
    ],
  },
  {
    mention: "Management et Ingénierie économique",
    code: "MIE",
    specialisations: [
      {
        label: "Entrepreneuriat",
        code: "EN",
      },
      {
        label: "Expertise économique et gestion de projet",
        code: "EG",
      },
    ],
  },
  {
    mention: "Technologie et méthodes informatiques",
    code: "TMI",
    specialisations: [
      {
        label: "Méthodes informatiques appliquées à la gestion d'entreprise",
        code: "MIAGE",
      },
    ],
  },
];

const inscription = 50000

const frais = [
  {
    code: ["MIL1", "EML1", "MIEENM1", "MIEEGM1"],
    frais: 950000,
    inscription,
  },
  {
    code: ["MIL2", "EML2", "TMIMIAGEM1", "TMIMIAGEM2", "MIEENM2", "MIEEGM2"],
    frais: 1150000,
    inscription,
  },
  {
    code: ["MIGLL3", "MICML3", "EMECL3", "EMMAL3", "EMMEL3"],
    frais: 1350000,
    inscription,
  },
];

const grades = [
  {
    assistant: 10526.3,
    maitre_de_conference: 12631.6,
  },
];

module.exports = {
  niveaux,
  frais,
  mentions,
  grades,
};
