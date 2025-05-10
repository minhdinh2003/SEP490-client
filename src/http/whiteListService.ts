import HttpService from './httpService';

class WhiteListService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'whitelist';
  }
}

export default new WhiteListService();
