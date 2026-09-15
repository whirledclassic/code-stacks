window.MISSIONS = [
  {
    id: "first-blood",
    title: "First Blood",
    file: "main.js",
    difficulty: "Warmup",
    blurb: "Log the name of the game.",
    spec: ["console.log exactly CODE STACKS"],
    hint: "console.log(\"CODE STACKS\");",
    starter: "console.log(\"CODE STACKS\");",
    checks: [
      { name: "logs at least one line", code: "if (!console.logs || !console.logs.length) throw new Error(\"Use console.log.\");" },
      { name: "exactly one log", code: "if (!console.logs || console.logs.length !== 1) throw new Error(\"Need exactly 1 log.\");" },
      { name: "text is CODE STACKS", code: "if (!console.logs || String(console.logs[0]) !== \"CODE STACKS\") throw new Error(\"Need exactly CODE STACKS.\");" }
    ]
  },
  {
    id: "greeter",
    title: "Greeter",
    file: "greet.js",
    difficulty: "Easy",
    blurb: "Ship greet(name).",
    spec: ["function greet(name) returns Hello, name!"],
    hint: "function greet(name) { return \"Hello, \" + name + \"!; }",
    checks: [
      { name: "greet exists", code: "if (typeof greet !== \"function\") throw new Error(\"greet is not a function.\");" },
      { name: "greet Ada", code: "if (typeof greet !== \"function\" || greet(\"Ada\") !== \"Hello, Ada!\") throw new Error(\"greet Ada failed.\");" }
    ]
  },
  {
    id: "adder",
    title: "The Adder",
    file: "math.js",
    difficulty: "Easy",
    blurb: "add(a, b) returns the sum.",
    spec: ["add(2,3)===5"],
    hint: "function add(a, b) { return a + b; }",
    checks: [
      { name: "add exists", code: "if (typeof add !== \"function\") throw new Error(\"add missing.\");" },
      { name: "add(2,3)", code: "if (typeof add !== \"function\" || add(2,3) !== 5) throw new Error(\"need 5.\");" }
    ]
  },
  {
    id: "toolbox",
    title: "Toolbox",
    file: "lib.js",
    difficulty: "Project",
    blurb: "Build a tiny library on exports, one line at a time.",
    spec: ["exports.clamp", "exports.pad", "exports.once"],
    hint: "exports.clamp = function(n,lo,hi){ return n<lo?lo:(n>hi?hi:n); };",
    checks: [
      { name: "exports.clamp exists", code: "if (typeof exports.clamp !== \"function\") throw new Error(\"Set exports.clamp.\");" },
      { name: "clamp range", code: "if (typeof exports.clamp !== \"function\") throw new Error(\"clamp missing\"); if (exports.clamp(-2,0,10) !== 0 || exports.clamp(3,0,10) !== 3 || exports.clamp(99,0,10) !== 10) throw new Error(\"clamp range\");" },
      { name: "exports.pad exists", code: "if (typeof exports.pad !== \"function\") throw new Error(\"Set exports.pad.\");" },
      { name: "exports.once exists", code: "if (typeof exports.once !== \"function\") throw new Error(\"Set exports.once.\");" }
    ]
  },
  {
    id: "ledger",
    title: "Ledger",
    file: "ledger.js",
    difficulty: "Project",
    blurb: "Counter module on exports, one method per turn.",
    spec: ["exports.create() -> { n: 0 }", "exports.inc", "exports.dec", "exports.value"],
    hint: "exports.create = function () { return { n: 0 }; };",
    checks: [
      { name: "create", code: "if (typeof exports.create !== \"function\") throw new Error(\"exports.create\"); var s = exports.create(); if (!s || s.n !== 0) throw new Error(\"{ n: 0 }\");" },
      { name: "inc", code: "if (typeof exports.create !== \"function\" || typeof exports.inc !== \"function\") throw new Error(\"inc\"); var s = exports.create(); if (exports.inc(s) !== 1 || s.n !== 1) throw new Error(\"inc\");" },
      { name: "dec", code: "if (typeof exports.create !== \"function\" || typeof exports.inc !== \"function\" || typeof exports.dec !== \"function\") throw new Error(\"dec\"); var s = exports.create(); exports.inc(s); if (exports.dec(s) !== 0) throw new Error(\"dec\");" },
      { name: "value", code: "if (typeof exports.value !== \"function\") throw new Error(\"value\"); if (exports.value({ n: 4 }) !== 4) throw new Error(\"value\");" }
    ]
  }
];
