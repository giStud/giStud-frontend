import TokenService from "./tokenService";

export default function authHeader() {
  const token = TokenService.getLocalAccessToken();
  if (token) {
    console.log("not empty access token")
    return { Authorization: 'Bearer ' + token};
  } else {
    console.log("empty access token")
    return {};
  }
}
