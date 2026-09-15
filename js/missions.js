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
    hint: "function greet(name) { return \"Hello, \" + name + \"!\"; }",
    checks: [
      { name: "greet exists", code: "if (typeof greet !== \"function\") throw new Error(\"greet is not a function.\");" },
      { name: "greet Ada", code: "if (typeof greet !== \"function\" || greet(\"Ada\") !== \"Hello, Ada!\") throw new Error(\"greet(\"Ada\") failed.\");" },
      { name: "greet Stacks", code: "if (typeof greet !== \"function\" || greet(\"Stacks\") !== \"Hello, Stacks!\") throw new Error(\"greet(\"Stacks\") failed.\");" }
    ]
  },
  {
    id: "adder",
    title: "The Adder",
    file: "math.js",
    difficulty: "Easy",
    blurb: "add(a, b) returns the sum.",
    spec: ["add(2,3)===5", "add(-1,1)===0"],
    hint: "function add(a, b) { return a + b; }",
    checks: [
      { name: "add exists", code: "if (typeof add !== \"function\") throw new Error(\"add missing.\");" },
      { name: "add(2,3)", code: "if (typeof add !== \"function\" || add(2,3) !== 5) throw new Error(\"need 5.\");" },
      { name: "add(-1,1)", code: "if (typeof add !== \"function\" || add(-1,1) !== 0) throw new Error(\"need 0.\");" }
    ]
  },
  {
    id: "toolbox",
    title: "Toolbox",
    file: "lib.js",
    difficulty: "Project",
    blurb: "Build a tiny library on exports, one line at a time.",
    spec: [
      "Put functions on the exports object.",
      "exports.clamp(n, lo, hi)",
      "exports.pad(s, n)",
      "exports.once(fn)"
    ],
    hint: "exports.clamp = function(n,lo,hi){ return n<lo?lo:(n>hi?hi:n); };",
    checks: [
      { name: "exports.clamp exists", code: "if (typeof exports.clamp !== \"function\") throw new Error(\"Set exports.clamp.\");" },
      { name: "clamp range", code: "if (typeof exports.clamp !== \"function\") throw new Error(\"clamp missing\"); if (exports.clamp(-2,0,10) !== 0 || exports.clamp(3,0,10) !== 3 || exports.clamp(99,0,10) !== 10) throw new Error(\"clamp(-2,0,10)=0, clamp(3,0,10)=3, clamp(99,0,10)=10\");" },
      { name: "exports.pad exists", code: "if (typeof exports.pad !== \"function\") throw new Error(\"Set exports.pad.\");" },
      { name: "pad left zeros", code: "if (typeof exports.pad !== \"function\") throw new Error(\"pad missing\"); if (exports.pad(\"7\", 3) !== \"007\" && exports.pad(\"7\", 3) !== \"  7\") throw new Error(\"pad(\"7\",3) should be 007 or similar width 3.\");" },
      { name: "exports.once exists", code: "if (typeof exports.once !== \"function\") throw new Error(\"Set exports.once.\");" },
      { name: "once only first call", code: "if (typeof exports.once !== \"function\") throw new Error(\"once missing\"); var n=0; var f=exports.once(function(){ n += 1; return n; }); if (f() !== 1) throw new Error(\"first call should run\"); f(); f(); if (n !== 1) throw new Error(\"later calls must not run the fn again\");" }
    ]
  }
];
