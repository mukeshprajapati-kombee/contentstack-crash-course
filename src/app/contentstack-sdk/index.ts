import contentstack, { Region } from "@contentstack/delivery-sdk";
import ContentstackLivePreview, {
  IStackSdk,
} from "@contentstack/live-preview-utils";
import { gqlRequest } from "./graphql-client";

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
  const query = `
    query PageQuery($url: String!) {
      all_page(where: {url: $url}) {
        items {
         blocks {
            ... on PageBlocksBlock {
              __typename
              block {
                title
                copy
                layout
                imageConnection {
                  edges {
                    node {
                      url
                      unique_identifier
                      title
                      permanent_url
                      content_type
                      description
                      file_size
                      filename
                      metadata
                      parent_uid
                      system {
                        uid
                      }
                    }
                  }
                }
              }
            }
          }
          title
          description
          url
          rich_text
          imageConnection {
            edges {
              node {
                url
                title
              }
            }
          }
          system {
            uid
            branch
          }
        }
      }
    }
  `;

  const res = await gqlRequest(query, {
    variables: { url },
  });

  const data = await res.json();
  const page = data.data.all_page.items[0];

  if (page) {
    const transformed = {
      ...page,
      uid: page.system.uid,
      image: page.imageConnection?.edges[0]?.node,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blocks: page.blocks?.map((item: any) => ({
        block: {
          ...item.block,
          image: item.block.imageConnection?.edges[0]?.node,
        },
      })),
    };

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true") {
      contentstack.Utils.addEditableTags(transformed, "page", true);
    }

    return transformed;
  }

  return null;
}
