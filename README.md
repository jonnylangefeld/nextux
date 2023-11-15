# nextUX

[![Main](https://github.com/jonnylangefeld/nextux/actions/workflows/main.yml/badge.svg)](https://github.com/jonnylangefeld/nextux/actions/workflows/main.yml)

This app showcases how to use the [OpenAI](https://openai.com) API to extract structured data from a recording spoken into a microphone. We make use of the [Whisper API](https://whisper.openai.com), as well as [function calling](https://platform.openai.com/docs/guides/function-calling) to extract the data. Most of the AI magic is located in the [`src/app/api/extract/functions.ts`](src/app/api/extract/functions.ts) file. The UI showcases a demo with a form that can be filled out with your voice.

Try it out at [nextux.ai](https://nextux.ai).

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Styling with [Tailwind](https://tailwindcss.com) and [daisyUI](https://daisyui.com)

This project uses [Tailwind](https://tailwindcss.com) for styling. The setup is explained in their [Quickstart](https://tailwindcss.com/docs/guides/nextjs). We use [daisyUI](https://daisyui.com) on top of Tailwind for some additional components. The setup is explained in their [Quickstart](https://daisyui.com/docs/installation). DaisyUI is a plugin for Tailwind that adds components and utilities with a dark mode. It also adds first-class support for extended variants and more. Since all daisyUI classes are just an extended list to the Tailwind classes, all utilities such as auto-completion, class sorting or modifiers work out of the box. DaisyUI also reduces the amount of custom components checked into the repository and therefore reduces the code food print.

## Feature Flags with [Hypertune](https://hypertune.com)

Feature flags are set via [Hypertune](https://hypertune.com). To change them navigate [here](https://app.hypertune.com/projects/2736/draft). Reload the page after changing variables. The setup is explained in their [Quickstart](https://docs.hypertune.com/getting-started/feature-flags-quickstart).

## Logging with [Betterstack](https://beterstack.com)

Logs are sent to [Betterstack](https://beterstack.com). To view them navigate [here](https://logs.betterstack.com/team/210187/tail). The setup is explained in their [Quickstart](https://betterstack.com/docs/logs/javascript/nextjs/). Use them like the following:

```ts
import { log } from "@logtail/next"

log.info("")
log.warn("")
// etc.
```

## Emails with [Plunk](https://useplunk.com/)

Emails for the waitlist feature are being programmatically sent using Plunk. Manage all sign-ups [here](https://app.useplunk.com/).

## Testing with [JEST](https://jestjs.io)

The backend is tested using JEST. The setup is explained in their [Quickstart](https://jestjs.io/docs/en/getting-started). All tests are next to the files they are testing with the extension `*.test.ts`. Run all tests locally via `npm run test`. Tests are automatically run on every commit via [GitHub Actions](https://github.com/jonnylangefeld/nextux/actions).

## API Integration Tests with [POLLY.JS](https://netflix.github.io/pollyjs)

All calls to third party APIs are being mocked from a prerecording using Polly.js. The setup is explained in their [Quickstart](https://netflix.github.io/pollyjs/#/quick-start?id=quick-start). All recordings are stored in `__recordings__` directories.

## Animations with [Rive](https://rive.app)

The recording button is animated using [Rive](https://rive.app).

## API Types Defined with [protobuf](https://protobuf.dev/)

The API types are defined using [protobuf](https://protobuf.dev/) and the source of truth is stored in the [`proto`](proto) directory. The fields are annotated with [`ts-to-zod`](https://www.npmjs.com/package/ts-to-zod) annotations. Run `npm run types` to generate the typescript files and the `zod` schema.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The app is deployed via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
