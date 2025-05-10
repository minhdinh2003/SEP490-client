import HttpService from "./httpService";
class ReviewService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'review';
  }
}

export default new ReviewService();
