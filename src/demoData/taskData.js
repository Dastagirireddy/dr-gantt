export default Object.freeze(
  [
    {
      id: 1,
      name: "Launch SaaS Product",
      parent: null,
      percentDone: 50,
      type: "parent"
    },
    {
      id: 2,
      name: "Setup web server",
      parent: 1,
      percentDone: 40,
      type: "parent"
    },
    {
      id: 3,
      name: "Install Apache",
      parent: 2,
      percentDone: 30,
      type: "task"
    },
    {
      id: 4,
      name: "Configure firewall",
      parent: 2,
      percentDone: 25,
      type: "task"
    },
    {
      id: 5,
      name: "Setup load balancer",
      parent: 2,
      percentDone: 15,
      type: "task"
    },
    {
      id: 6,
      name: "Configure ports",
      parent: 1,
      percentDone: 45,
      type: "milestone"
    },
    {
      id: 7,
      name: "Run tests",
      parent: 1,
      percentDone: 46,
      type: "task"
    },
    {
      id: 8,
      name: "Website Design",
      parent: 1,
      percentDone: 20,
      type: "parent"
    },
    {
      id: 9,
      name: "Contact designers",
      parent: 8,
      percentDone: 90,
      type: "milestone"
    },
    {
      id: 10,
      name: "Create shortlist of three designers",
      parent: 1,
      percentDone: 60,
      type: "task"
    },
    {
      id: 11,
      name: "Select & review final design",
      parent: 1,
      percentDone: 36,
      type: "task"
    },
    {
      id: 12,
      name: "Inform management about decision",
      parent: 2,
      percentDone: 79,
      type: "parent"
    },
    {
      id: 13,
      name: "Apply design to web site",
      parent: 12,
      percentDone: 38,
      type: "task"
    },
    {
      id: 14,
      name: "Setup Test Strategy",
      parent: 12,
      percentDone: 69,
      type: "parent"
    },
    {
      id: 15,
      name: "Write test specs",
      parent: 14,
      percentDone: 89,
      type: "task"
    },
    {
      id: 16,
      name: "UI unit tests / individual screens",
      parent: 14,
      percentDone: 30,
      type: "task"
    },
    {
      id: 17,
      name: "Application tests",
      parent: 14,
      percentDone: 45,
      type: "task"
    },
    {
      id: 18,
      name: "Application Implementation",
      parent: 14,
      percentDone: 24,
      type: "task"
    },
    {
      id: 19,
      name: "Authentication module",
      parent: 14,
      percentDone: 56,
      type: "task"
    },
    {
      id: 20,
      name: "Single sign on",
      parent: 14,
      percentDone: 47,
      type: "milestone"
    },
    {
      id: 21,
      name: "Implement role based access",
      parent: 14,
      percentDone: 35,
      type: "parent"
    },
    {
      id: 22,
      name: "Basic test coverage",
      parent: 21,
      percentDone: 90,
      type: "task"
    },
    {
      id: 23,
      name: "Verify high test coverage",
      parent: 21,
      percentDone: 56,
      type: "task"
    },
    {
      id: 24,
      name: "Make backup",
      parent: 21,
      percentDone: 35,
      type: "task"
    },
    {
      id: 25,
      name: "Phase #2",
      parent: 21,
      percentDone: 32,
      type: "task"
    },
    {
      id: 26,
      name: "Authentication module",
      parent: 21,
      percentDone: 24,
      type: "task"
    },
    {
      id: 27,
      name: "Single sign on",
      parent: 21,
      percentDone: 23,
      type: "task"
    },
    {
      id: 28,
      name: "Implement role based access",
      parent: 21,
      percentDone: 34,
      type: "task"
    },
    {
      id: 29,
      name: "Basic test coverage",
      parent: 21,
      percentDone: 12,
      type: "task"
    },
    {
      id: 30,
      name: "Verify high test coverage",
      parent: 21,
      percentDone: 43,
      type: "task"
    },
    {
      id: 31,
      name: "Acceptance phase",
      parent: 21,
      percentDone: 32,
      type: "task"
    },
    {
      id: 32,
      name: "Company bug bash",
      parent: 21,
      percentDone: 78,
      type: "task"
    },
    {
      id: 33,
      name: "Test all web pages",
      parent: 21,
      percentDone: 10,
      type: "task"
    },
    {
      id: 34,
      name: "Verify no broken links",
      parent: 21,
      percentDone: 54,
      type: "task"
    },
    {
      id: 35,
      name: "Make test release",
      parent: 21,
      percentDone: 67,
      type: "task"
    },
    {
      id: 36,
      name: "Send invitation email",
      parent: 21,
      percentDone: 79,
      type: "task"
    },
    {
      id: 37,
      name: "Celebrate launch",
      parent: 21,
      percentDone: 34,
      type: "task"
    }
  ].map((item, index) => {
    return {
      ...item,
      $index: index
    };
  })
);
