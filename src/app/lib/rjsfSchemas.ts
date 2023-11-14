import { RJSFSchema } from "@rjsf/utils"

export const wittyFormSchema: RJSFSchema = {
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
      description: "The capitalization of the city name is intentional.",
      enum: ["Gotham", "Metropolis", "Narnia", "Middle-Earth", "Wakanda", "Neverland", "Stars Hollow", "Springfield"],
    },
    desertedIslandItems: {
      type: "array",
      title: "What items would you bring to a deserted island? (Choose three)",
      items: {
        type: "string",
        enum: ["Matches", "Book", "Guitar", "Sunscreen", "Satellite Phone", "Hammock", "Laptop", "Swimsuit"],
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
  required: ["superpower", "fictionalCity", "desertedIslandItems", "timeTravelDate"],
}

export const contactFormSchema: RJSFSchema = {
  type: "object",
  description: "The personal data typically put into a contact form",
  properties: {
    firstName: {
      title: "First Name",
      type: "string",
      description: "the first name of the person",
    },
    lastName: {
      title: "Last Name",
      type: "string",
      description: "the first name of the person",
    },
    address: {
      type: "object",
      title: "Address",
      description: "the home address of the person",
      properties: {
        street: {
          title: "Street",
          type: "string",
          description: "the street of the address including the street number",
        },
        city: {
          title: "City",
          type: "string",
          description:
            "the city of the address. Use your knowledge about cities and their zip codes to get the right one",
        },
        stateAbbreviation: {
          title: "State",
          type: "string",
          description: "the two letter state abbreviation of the address",
          pattern: "^[A-Z]{2}$",
          enum: [
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY",
          ],
        },
        zipCode: {
          title: "Zip Code",
          type: "string",
          description: "the zip code of the address",
          pattern: "^\\d{5}$",
        },
      },
      required: ["street", "city", "stateAbbreviation", "zipCode"],
    },
    emailAddress: {
      title: "Email Address",
      type: "string",
      format: "email",
      description: "the email address of the person",
    },
    birthDate: {
      title: "Birth Date",
      type: "string",
      description: "the date of birth of the person in YYYY-MM-DD",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    },
  },
  required: ["firstName", "lastName", "address", "birthDate"],
}

export const creditCardFormSchema: RJSFSchema = {
  type: "object",
  description: "the fields of a credit card form",
  required: ["cardNumber", "cardholderName", "expirationDate", "cvv"],
  properties: {
    cardNumber: {
      type: "string",
      description: "The credit card number",
      pattern: "^[0-9]{13,19}$",
      examples: "4111111111111111",
    },
    cardholderName: {
      type: "string",
      description: "The first and last name as embossed on the card",
      examples: "John Doe",
    },
    expirationDate: {
      type: "object",
      title: "Expiration Date",
      description: "The expiration date of the credit card",
      properties: {
        month: {
          type: "integer",
          description: "the month of the credit card expiration date",
          minimum: 1,
          maximum: 12,
        },
        year: {
          type: "integer",
          description: "the year of the credit card expiration date",
          examples: [2030, 2034],
        },
      },
      required: ["month", "year"],
    },
    cvv: {
      type: "string",
      description: "The card verification value (usually 3 or 4 digits)",
      pattern: "^[0-9]{3,4}$",
      examples: "123",
    },
  },
}
