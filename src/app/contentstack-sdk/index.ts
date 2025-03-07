import contentstack, {
  QueryOperation,
  Region,
} from "@contentstack/delivery-sdk";
import { Page } from "./types";
import ContentstackLivePreview, {
  IStackSdk,
} from "@contentstack/live-preview-utils";

export const stack = contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
  region: Region.US,
  live_preview: {
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true",
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,
    host: "rest-preview.contentstack.com",
    // process.env.NEXT_PUBLIC_CONTENTSTACK_REGION === "EU"
    //   ? "eu-rest-preview.contentstack.com"
    //   : "rest-preview.contentstack.com",
  },
});

export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: true,
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true",
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
    },
    clientUrlParams: {
      host: "app.contentstack.com",
    },
    editButton: {
      enable: true,
    },
  });
}

export async function getKombee(url: string) {
  const result = await stack
    .contentType("page")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Page>();

  if (result.entries) {
    const entry = result.entries[0];

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true") {
      contentstack.Utils.addEditableTags(entry, "page", true);
    }

    return entry;
  }
}
