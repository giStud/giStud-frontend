export default function authHeader() {
  const token = JSON.parse(localStorage.getItem('accessToken'));
  const data = { Authorization: 'Bearer ' + token.token};
  if (token) {
    return data;
  } else {
    return {};
  }
}
