export default async function authHeader() {
  const token = await JSON.parse(localStorage.getItem('accessToken'));
  const data = { Authorization: 'Bearer ' + token.token};
  console.log(data);
  if (token) {
    console.log(1)
    return data;
  } else {
    console.log(2)
    return {};
  }
}
