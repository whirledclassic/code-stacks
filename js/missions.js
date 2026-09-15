window.MISSIONS = [
  {
    id: "first-blood",
    title: "First Blood",
    file: "main.js",
    difficulty: "Warmup",
    blurb: "Get something running. Print the name of the game.",
    spec: ["Write a program that logs exactly one line:", "CODE STACKS", "No extra spaces. No extra logs. Just that."],
    hint: "console.log(\"CODE STACKS\");",
    checks: [
      { name: "logs at least one line", code: "if (!console.logs || !console.logs.length) throw new Error(\"Nothing was logged. Use console.log.\");" },
      { name: "exactly one log", code: "if (!console.logs || console.logs.length !== 1) throw new Error(\"Expected exactly 1 log line.\");" },
      { name: "text is CODE STACKS", code: "if (!console.logs || String(console.logs[0]) !== \"CODE STACKS\") throw new Error(\"Need exactly CODE STACKS.\");" }
    ]
  },
  {
    id: "greeter",
    title: "Greeter",
    file: "greet.js",
    difficulty: "Easy",
    blurb: "Ship a function the next person can trust.",
    spec: ["Define a function greet(name).", "greet(\"Ada\") returns \"Hello, Ada!\".", "greet(\"Stacks\") returns \"Hello, Stacks!\"."],
    hint: "function greet(name) { return \"Hello, \" + name + \"!\"; }",
    checks: [
      { name: "greet exists", code: "if (typeof greet !== \"function\") throw new Error(\"greet is not a function.\");" },
      { name: "greet(\"Ada\")", code: "if (typeof greet !== \"function\") throw new Error(\"greet missing\"); var a = greet(\"Ada\"); if (a !== \"Hello, Ada!\") throw new Error(\"returned \" + JSON.stringify(a));" },
      { name: "greet(\"Stacks\")", code: "if (typeof greet !== \"function\") throw new Error(\"greet missing\"); var b = greet(\"Stacks\"); if (b !== \"Hello, Stacks!\") throw new Error(\"returned \" + JSON.stringify(b));" }
    ]
  },
  {
    id: "adder",
    title: "The Adder",
    file: "math.js",
    difficulty: "Easy",
    blurb: "One clean utility.",
    spec: ["Define add(a, b) that returns the sum.", "add(2, 3) === 5", "add(-1, 1) === 0"],
    hint: "function add(a, b) { return a + b; }",
    checks: [
      { name: "add exists", code: "if (typeof add !== \"function\") throw new Error(\"add is not a function.\");" },
      { name: "add(2, 3) === 5", code: "if (typeof add !== \"function\" || add(2, 3) !== 5) throw new Error(\"add(2, 3) should be 5.\");" },
      { name: "add(-1, 1) === 0", code: "if (typeof add !== \"function\" || add(-1, 1) !== 0) throw new Error(\"add(-1, 1) should be 0.\");" }
    ]
  }
];
