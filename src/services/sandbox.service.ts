import axios from "axios";

export default class Sandbox {

    static BASE_URL = 'https://api.sandbox.co.in'

    static async refreshAccessToken(accessToken: string) {
        const headers = {
            'Authorization': accessToken,
            'accept': 'application/json',
            'x-api-key': process.env.SANDBOX_KEY,
            'x-api-version': process.env.SANDBOX_API_VERSION
        };


        const res = await axios.post(`${Sandbox.BASE_URL}/authorize?request_token=${accessToken}`, {}, { headers });

        const { access_token } = res.data;

        return access_token;
    }

    static async generateAccessToken() {
        const headers = {
            'accept': 'application/json',
            'x-api-key': process.env.SANDBOX_KEY,
            'x-api-secret': process.env.SANDBOX_SECRET,
            'x-api-version': process.env.SANDBOX_API_VERSION
        };

        const res = await axios.post(`${Sandbox.BASE_URL}/authenticate`, {}, { headers });

        const { access_token } = res.data;

        return access_token;
    }

}