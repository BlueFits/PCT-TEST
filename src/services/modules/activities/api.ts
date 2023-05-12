import { token } from "./token";

class ActiviesApi {
    async getActivities() {
        const response = await fetch(`http://localhost:3000/tools/get_live?token=${token}`);
        if (!response.ok) {
            const err = await response.json();
            console.error("err", err);
        } else {
            const data = await response.json();
            return data;
        }
    }

    async scanActivity({ affected_url, code }: { affected_url: string; code: string; }) {

        const response = await fetch(`http://localhost:3000/tools/scan`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                affected_url,
                code
            }),
        });

        if (!response.ok) {
            /* Handle token expiration refresh here */
            const err = await response.json();
            console.error("err", err)

        } else {
            const result: { data: { errors: Array<any>, adobe: any } } = await response.json();
            return result;
        }
    }
}

export default new ActiviesApi();