import HttpService from "./httpService";
class ChatService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'chat';
  }
}

export default new ChatService();
