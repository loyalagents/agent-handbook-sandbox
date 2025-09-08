# Agent Handbook Sandbox

We are exploring how to create a framework for judging AI Agents based on reputable legal sources from the [Restatement of Agency Law](https://en.wikipedia.org/wiki/Restatement_of_the_Law_of_Agency,_Third) to the [Model Rules of Professional Conduct](https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/).

We're calling this framework the "Agent Handbook". The Handbook compiles a baseline of rules applicable to human-agent interactions into tools that can be used by an LLM agent judge.

This repo is a sandbox for experimenting with simulating and judging human-agent interactions with these tools.

It's a work in progress.

We took inspiration from the [LangWatch Scenario](https://github.com/langwatch/scenario) project.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the index page.

To judge an existing scenario, open [http://localhost:3000/api/judge-scenario-default?scenario=[scenario_id]](http://localhost:3000/api/judge-scenario-default?scenario=[scenario_id]) and wait a few minutes.

