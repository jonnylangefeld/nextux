import { RJSFSchema } from "@rjsf/utils"

export const contactFormSchema: RJSFSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "A form to be filled out using voice, with witty and engaging questions.",
  type: "object",
  properties: {
    superpower: {
      type: "string",
      title: "If you could have a superpower for a day, what would it be?",
    },
    fictionalCity: {
      type: "string",
      title: "Which fictional city would you choose to live in?",
      enum: ["Gotham", "Metropolis", "Narnia", "Middle-Earth", "Wakanda", "Neverland"],
    },
    desertedIslandItems: {
      type: "array",
      title: "What items would you bring to a deserted island? (Choose three)",
      items: {
        type: "string",
        enum: ["Matches", "Book", "Guitar", "Sunscreen", "Satellite Phone", "Hammock", "Laptop"],
      },
      minItems: 1,
      maxItems: 3,
      uniqueItems: true,
    },
    timeTravelDate: {
      type: "string",
      title: "If you could time travel, which date would you go to first?",
      format: "date",
      description: "a date in format YYYY-MM-DD",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    },
    pineapplePizza: {
      type: "boolean",
      title: "Pineapple on your pizza?",
      oneOf: [
        {
          title: "Yum! 😋",
          const: true,
        },
        {
          title: "No way! 🤢",
          const: false,
        },
      ],
    },
  },
  required: ["superpower", "fictionalCity", "desertedIslandItems", "timeTravelDate", "pineapplePizza"],
}
