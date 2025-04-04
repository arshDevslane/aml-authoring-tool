import { baseApiService } from './BaseApiService';

class MediaService {
  static getInstance(): MediaService {
    return new MediaService();
  }

  async uploadFile(
    data: { fileName: string; category: string; file: File }[],
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ) {
    const formData = new FormData();

    data.forEach((item) => {
      formData.append('files', item.file);
    });

    formData.append('category', data[0].category);

    return baseApiService.post(
      '/api/v1/media/v2/upload',
      'api.media.v2.upload',
      formData,
      { onUploadProgress }
    );
  }
}

export const mediaService = MediaService.getInstance();
