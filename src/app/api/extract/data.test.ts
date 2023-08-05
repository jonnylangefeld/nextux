import fs from "fs"
import path from "path"

interface useCase {
  fileBase64: string
  jsonSchema: { [key: string]: unknown }
  transcript: string
}

const simpleFileBuffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/simple.mp3"))
export const simple: useCase = {
  fileBase64: simpleFileBuffer.toString("base64"),
  jsonSchema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "The entire content",
      },
    },
  },
  transcript: "Hello, world.",
}

const complexFileBuffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/complex.mp3"))
export const complex: useCase = {
  fileBase64: complexFileBuffer.toString("base64"),
  jsonSchema: {
    type: "object",
    properties: {
      travelers: {
        type: "array",
        description: "List of travelers",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description:
                "The name of the traveler. If it contains a spelled out version of the name, respond by concatenating the spelled out letters into one word.",
            },
          },
        },
      },
      fromAirportCodes: {
        type: "array",
        description: "List of IATA airport codes for the departure airport",
        items: {
          type: "string",
          description: "three letter airport code. If a city is given, transform into the major airport code.",
          minLength: 3,
          maxLength: 3,
          pattern: "^[A-Z]{3}$",
          examples: ["JFK", "MUC", "BER", "CDG", "SIN", "FRA", "MEX"],
        },
      },
      toAirportCodes: {
        type: "array",
        description: "List of IATA airport codes for the destination airport",
        items: {
          type: "string",
          description: "three letter airport code. If a city is given, transform into the major airport code.",
          minLength: 3,
          maxLength: 3,
          pattern: "^[A-Z]{3}$",
          examples: ["JFK", "MUC", "BER", "CDG", "SIN", "FRA", "MEX"],
        },
      },
      fromDate: {
        type: "string",
        description: "The date of departure in the format YYYY-MM-DD",
      },
      toDate: {
        type: "string",
        description: "The date of arrival in the format YYYY-MM-DD",
      },
    },
  },
  transcript:
    "Okay, so my name is Johnny, that's spelled J-O-N-N-Y, and I want to travel with my wife, Mackenzie, that's spelled M-C-K-E-N-Z-I-E, from any airport in and around San Francisco, like SFO, or Oakland, or San Jose. And we want to fly down to LA, and we want to travel next Wednesday through Sunday.",
}

const complexLongFileBuffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/complex-long.mp3"))
export const complexLong: useCase = {
  fileBase64: complexLongFileBuffer.toString("base64"),
  jsonSchema: {},
  transcript:
    "So my name is Johnny, and that's spelled J-O-N-N-Y, and I'm traveling with my wife, that's spelled M-C-K-E-N-Z-I-E, and we want to travel from any airport in or around San Francisco, like SFO or Oakland or San Jose, and we want to travel to Los Angeles, and we would like to fly next Wednesday through Sunday.",
}

const contactFileBuffer = fs.readFileSync(path.resolve(__dirname, "../../__testdata__/contact.mp3"))
export const contact: useCase = {
  fileBase64: contactFileBuffer.toString("base64"),
  jsonSchema: {
    type: "object",
    description: "The personal data typically put into a contact form",
    properties: {
      firstName: {
        type: "string",
        description: "the first name of the person",
      },
      lastName: {
        type: "string",
        description: "the first name of the person",
      },
      address: {
        type: "object",
        description: "the home address of the person",
        properties: {
          street: {
            type: "string",
            description: "the street of the address including the street number",
          },
          city: {
            type: "string",
            description:
              "the city of the address. Use your knowledge about cities and their zip codes to get the right one",
          },
          stateAbbreviation: {
            type: "string",
            description: "the two letter state abbreviation of the address",
            pattern: "^[A-Z]{2}$",
          },
          zipCode: {
            type: "string",
            description: "the zip code of the address",
            pattern: "^\\d{5}$",
          },
        },
        required: ["street", "city", "state", "zipCode"],
      },
      birthDate: {
        type: "string",
        description: "the date of birth of the person in YYYY-MM-DD",
        pattern: "^\\d{4}-\\d{2}-\\d{2}$",
      },
    },
    required: ["firstName", "lastName", "address", "birthDate"],
  },
  transcript:
    "Okay, so my first name is Johnny, that's spelled J-O-N-N-Y, and my last name is Langefeld, that's spelled L-A-N-G-E-F-E-L-D. And my address is 1 Ferry Building in San Francisco, California, 94105. And I'm born on July 22, 1991.",
}
