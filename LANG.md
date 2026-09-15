# Languages

Ready now: **JavaScript**.

Adapter API:

    Engine.registerLanguage(id, { run: fn, test: fn })
    Engine.hasLanguage(id)
    Engine.languages()

Missions may set `language: "javascript"`. The match passes that id into run/test.

A second language is ready to *plug in* when a runner exists. It is not ready to ship as a dropdown. Python/Lua still have no executor in this repo.
