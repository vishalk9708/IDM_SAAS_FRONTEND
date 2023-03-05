const DROPDOWN_OPTIONS = {
  alignment: "left",
  autoTrigger: true,
  closeOnClick: true,
  constrainWidth: true,
  container: null,
  coverTrigger: true,
  hover: false,
  inDuration: 150,
  onCloseEnd: null,
  onCloseStart: null,
  onOpenEnd: null,
  onOpenStart: null,
  outDuration: 250,
};

const NAVBAR_OPTIONS = {
  draggable: true,
  edge: "left",
  inDuration: 250,
  onCloseEnd: null,
  onCloseStart: null,
  onOpenEnd: null,
  onOpenStart: null,
  outDuration: 200,
  preventScrolling: true,
};

const DIGIX_ADMIN_USERS = [
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "Cheker",
    value: "Checker",
  },
  {
    label: "Auditor",
    value: "Auditor",
  },
];

const DATAUTILITY_ADMIN_USERS = [
  {
    label: "Admin",
    value: "Admin",
  },
];

const DATAENGINEERING_ADMIN_USERS = [
  {
    label: "Admin",
    value: "Admin",
  },
];

const UNIT_ADMIN_USERS = [
    {
      label: "Admin",
      value: "Admin",
    },
    {
      label: "Unit",
      value: "Unit",
    },
]

const AUDIT_ADMIN_USERS = [
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "Audit",
    value: "Audit",
  },
]

const AMC_ADMIN_USERS = [
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "AMC",
    value: "AMC",
  },
]

const KFIN_ADMIN_USERS = [
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "SuperUser",
    value: "SuperUser",
  },
]

const QUEST_ADMIN_USERS = [UNIT_ADMIN_USERS, AUDIT_ADMIN_USERS, AMC_ADMIN_USERS, KFIN_ADMIN_USERS];

// const AUDIT_ADMIN_USERS = [
//   {
//     label: "Admin",
//     value: "Admin",
//   },
//   {
//     label: "Audit",
//     value: "Audit",
//   },
//   {
//     label: "Unit",
//     value: "Unit",
//   },
//   {
//     label: "AMC",
//     value: "AMC",
//   },
// ];

const NPS_ADMIN_USERS = [
  {
    label: "User",
    value: "User",
  },
  {
    label: "Checker",
    value: "Checker",
  },
  {
    label: "Auditor",
    value: "Auditor",
  },
  {
    label: "Admin",
    value: "Admin",
  },
];

export {
  DROPDOWN_OPTIONS,
  NAVBAR_OPTIONS,
  DIGIX_ADMIN_USERS,
  DATAUTILITY_ADMIN_USERS,
  DATAENGINEERING_ADMIN_USERS,
  // AUDIT_ADMIN_USERS,
  QUEST_ADMIN_USERS,
  NPS_ADMIN_USERS
};
