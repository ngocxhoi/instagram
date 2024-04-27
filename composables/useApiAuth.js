export async function useApiAuth(path, options) {
  let header = {};
  let responses;
  const token = useCookie("XSRF-TOKEN");

  if (token.value) {
    header["X-XSRF-TOKEN"] = token.value;
    header["accept"] = "application/json";
  }

  let { data } = await useFetch("http://localhost:8000" + path, {
    credentials: "include",
    watch: false,
    ...options,
    headers: {
      ...header,
      ...options?.headers,
    },
    onResponse({ request, response, options }) {
      responses = response;
    },
  });

  return {
    data,
    responses,
  };
}
