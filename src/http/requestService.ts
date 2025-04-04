import HttpService from "./httpService";
class RequestService extends HttpService {
    Controller: string = '';
    constructor() {
        super();
        this.Controller = 'request';
    }

    async updateStatus<T>(requestID: string, data: Record<string, any> = {}): Promise<T> {
        try {
            const response = await this.http.post<T>(this.getUrl(`/updateStatus/${requestID}`), data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new RequestService();
