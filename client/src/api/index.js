async function request(url, data, requestMethod = "POST") {
  let resp;
  let request = {
    method: requestMethod,
    headers: { "Content-Type": "application/json" }
  };

  if (requestMethod == "POST") {
    request.body = JSON.stringify(data);
  }

  return await fetch(url, request).then((response) => {
    resp = response;
    return response.json();
  }).then((result) => {
    if (!result) {
      throw new Error();
    }
    result.pass = true;
    if (!resp.ok) {
      result.pass = false;
    }
    return result;
  }).catch((error) => {
    return { pass: false, msg: "Unexpected error, try again", error: JSON.stringify(error) };
  });
}

const local = true;
let API_URL = "";
if (local) {
  API_URL = "http://10.0.0.10:5000";
} else {
  API_URL = "https://netanel.vps.webdock.cloud:5000";
}



export async function login({ username, password }) {
  return await request(API_URL + "/auth/login", { username, password });
}

export async function fetchHome() {
  return await request(API_URL + "/main", "", "GET");
}

export async function fetchBySymbol(symbol) {
  return await request(API_URL + "/stock/"+symbol, "", "GET");
}

export async function fetchGraph(stockid, range) {
  return await request(API_URL + "/stock/"+stockid+"/graph/"+range, "", "GET");
}

export async function fetchSuggestions(ignoresymbol) {
  return await request(API_URL + "/stock/suggestions/"+ignoresymbol, "", "GET");
}

export async function fetchArticles() {
  return await request(API_URL + "/main/articles", "", "GET");
}

export async function fetchAll(query) {
  return await request(API_URL + "/main/stocks/"+query, "", "GET");
}

export async function suggestion(query) {
  return await request(API_URL + "/stock/suggestion/"+query, "", "GET");
}

