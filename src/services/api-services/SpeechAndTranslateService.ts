import { baseApiService } from './BaseApiService';

class SpeechAndTranslateService {
  static getSpeechAndTranslateService() {
    return new SpeechAndTranslateService();
  }

  async getTranslatedText(
    input_string: string,
    target_language: string
  ): Promise<{
    result: {
      output: {
        source: string;
        target: string;
      };
    };
  }> {
    return baseApiService.post(`/api/v1/translate`, 'api.translate', {
      input_string,
      target_language,
    });
  }

  async getSpeechSynthesis({
    input_string,
    target_language,
  }: {
    input_string: string;
    target_language: string;
  }): Promise<{
    result: {
      identifier: string;
      description_hash: string;
      language: string;
      audio_url: string;
    };
  }> {
    return baseApiService.post(`/api/v1/tts/generate`, 'api.tts.generate', {
      input_string,
      target_language,
    });
  }

  async getAudioList(questionId: string) {
    return baseApiService.post(
      `/api/v1/tts/list/${questionId}`,
      'api.tts.list',
      {}
    );
  }
}

export const speechAndTranslateService =
  SpeechAndTranslateService.getSpeechAndTranslateService();
