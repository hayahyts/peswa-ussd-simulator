import axios, { AxiosError } from 'axios';
import { RootUSSDRequest, RootResponse } from './types';

export class UssdApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async sendUssdRequest(request: RootUSSDRequest): Promise<{
    response: RootResponse | null;
    error: string | null;
    duration: number;
  }> {
    const startTime = Date.now();
    
    try {
      const response = await axios.post<RootResponse>(
        this.baseUrl,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );
      
      const duration = Date.now() - startTime;
      
      return {
        response: response.data,
        error: null,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response) {
          // Server responded with error status
          return {
            response: null,
            error: `Server error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`,
            duration,
          };
        } else if (axiosError.request) {
          // Request made but no response received
          return {
            response: null,
            error: 'No response from server. Please check if the backend is running.',
            duration,
          };
        } else {
          // Error setting up the request
          return {
            response: null,
            error: `Request error: ${axiosError.message}`,
            duration,
          };
        }
      }
      
      return {
        response: null,
        error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
        duration,
      };
    }
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
