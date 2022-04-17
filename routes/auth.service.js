import axios from "axios";

let bp = require('../../frontend/src/components/Path.js');
// const API_URL = "http://localhost:8080/api/";

class AuthService {
    login(email, password) {
        return axios
            .post(bp.buildPath('api/login'), {
                email,
                password
            })
            .then(response => {
                if (response.data) {
                    localStorage.setItem("auth-token", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("auth-token");
    }

    // Registration function
    // TODO: create functionality for an administrator to create user accounts
    register(username, firstname, lastname, email, password) {
        return axios.post(bp.buildPath('api/register'), {
            username,
            firstname,
            lastname,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('auth-token'));
    }
}
export default new AuthService();