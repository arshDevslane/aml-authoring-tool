import { AxiosRequestHeaders } from 'axios';
import { baseApiService } from './BaseApiService';

class UploadService {
  static getInstance(): UploadService {
    return new UploadService();
  }

  async uploadFile(data: {
    signedUrl: string;
    file: any;
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
  }) {
    return baseApiService.put(data.signedUrl, data.file, {
      headers: {
        'ngsw-bypass': 'true',
        'Content-Type': data.file.type,
        'Content-Disposition': `filename=${encodeURIComponent(
          (data.file.name || '').replace(/,/g, '').replace(/\u202F/g, ' ')
        )}`,
      } as unknown as AxiosRequestHeaders,
      extras: {
        useAuth: false,
        requestId: data.file.name,
      },
      onUploadProgress: data?.onUploadProgress,
    });
  }
}

export const uploadService = UploadService.getInstance();
