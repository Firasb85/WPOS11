import { ApiResponse } from '~/lib/types';

export abstract class BaseService {
  protected async handleApiError(error: any): Promise<never> {
    if (error instanceof Error) {
      throw {
        message: error.message,
        code: 'SERVICE_ERROR'
      };
    }
    throw error;
  }

  protected async executeQuery<T>(
    fn: () => Promise<T>
  ): Promise<ApiResponse<T>> {
    try {
      const data = await fn();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
