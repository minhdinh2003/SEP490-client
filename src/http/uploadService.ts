import { ServiceResponse } from '@/type/service.response';
import HttpService from './httpService';

class UploadService extends HttpService {
  Controller: string = '';
  constructor() {
    super();
    this.Controller = 'file';
  }
  async upload(file: File): Promise<ServiceResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.http.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

export default new UploadService();
