import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface BBox {
  x1: number; y1: number;
  x2: number; y2: number;
}

export interface Detection {
  class_id:   number;
  class_name: string;
  confidence: number;
  bbox:       BBox;
}

export interface DetectResponse {
  detections:      Detection[];
  annotated_image: string;        // base64 JPEG
  image_width:     number;
  image_height:    number;
}

@Injectable({ providedIn: 'root' })
export class DetectionService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  detect(file: File): Observable<DetectResponse> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<DetectResponse>(`${this.api}/detect`, form);
  }
}
