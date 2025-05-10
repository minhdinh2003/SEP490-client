import HttpService from "./httpService";
class TaskDetailService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'taskDetail';
  }
}

export default new TaskDetailService();
