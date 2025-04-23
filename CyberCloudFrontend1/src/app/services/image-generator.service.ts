import { Injectable,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {

  constructor() { }
  private httpClient = inject(HttpClient);

  textToImage(data: any) {
    const headers = new HttpHeaders().set('x-api-key', `${environment.apiKey}`);
    return this.httpClient.post(
      `${environment.baseURL}/text-to-image/v1`,
      data,
      {
        headers,
        responseType: 'arraybuffer',
      }
    );
  }
}
