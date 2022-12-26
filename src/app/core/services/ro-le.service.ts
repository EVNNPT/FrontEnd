import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RoLeDetail } from '../models/ro-le';

@Injectable({
  providedIn: 'root',
})
export class RoLeService {
  private apiURL = `${environment.apiURL}/RoLe`;
  constructor(private _httpClient: HttpClient) {}

  getDSRoLe(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-ds-rl`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  getDetailRoLe(MaPMIS: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-detail-rl?MaPMIS=${MaPMIS}`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  addRoLe(param: RoLeDetail): Observable<any> {
    return this._httpClient.post<any>(`${this.apiURL}/add-rl`, param);
  }

  updateRoLe(param: RoLeDetail): Observable<any> {
    return this._httpClient.post<any>(`${this.apiURL}/update-rl`, param);
  }
}
