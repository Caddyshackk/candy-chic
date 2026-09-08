import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "shows",
        label: "Shows",
        path: "content/shows",
        format: "json",
        ui: {
          allowedActions: {
            create: true,
            delete: true,
          },
        },
        fields: [
          {
            type: "string",
            name: "date",
            label: "Date (YYYY-MM-DD)",
            required: true,
          },
          {
            type: "string",
            name: "label",
            label: "Display Date (e.g. OCT 22)",
            required: true,
          },
          {
            type: "string",
            name: "venue",
            label: "Venue Name",
            required: true,
          },
          {
            type: "string",
            name: "city",
            label: "City, State",
            required: true,
          },
          {
            type: "string",
            name: "url",
            label: "Ticket URL (leave blank if not available)",
          },
        ],
      },
    ],
  },
});
