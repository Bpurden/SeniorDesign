// Not particularly useful right now but could be in the future with protected routes?
export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('auth-token'));
    if (user && user.accessToken) {
        // for Node.js Express back-end
        return { 'x-access-token': user.accessToken };
    } else {
        return {};
    }
}