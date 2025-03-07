const GRAPHQL_HOST_NAME = "graphql.contentstack.com";

const graphqlUrl = new URL(
  `https://${GRAPHQL_HOST_NAME}/stacks/${process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY}?environment=${process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT}`
);

function getHeaders() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append(
    "access_token",
    process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string
  );
  return headers;
}

export const gqlRequest = async (
  gql: string,
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables?: Record<string, any>;
    operationName?: string;
  }
) => {
  const headers = getHeaders();

  if (options?.operationName) {
    graphqlUrl.searchParams.set(
      "operationName",
      JSON.stringify(options.operationName)
    );
  }

  if (options?.variables) {
    graphqlUrl.searchParams.set("variables", JSON.stringify(options.variables));
  }

  graphqlUrl.searchParams.set("query", gql);

  const res = await fetch(graphqlUrl.toString(), {
    method: "GET",
    headers: headers,
  });

  return res;
};
