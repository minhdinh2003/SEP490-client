import HttpService from "./httpService";
class TaskTemplateService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'taskTemplate';
  }
}

export default new TaskTemplateService();
