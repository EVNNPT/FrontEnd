import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ThanhCaiDetail } from '../models/thanh-cai';

@Injectable({
  providedIn: 'root',
})
export class ThanhCaiService {
  private apiURL = `${environment.apiURL}/ThanhCai`;
  constructor(private _httpClient: HttpClient) {}

  getDSThanhCai(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-ds-tc`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  getDetailThanhCai(MaPMIS: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-detail-tc?MaPMIS=${MaPMIS}`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  addThanhCai(param: ThanhCaiDetail): Observable<any> {
    return this._httpClient.post<any>(`${this.apiURL}/add-tc`, param);
  }

  updateThanhCai(param: ThanhCaiDetail): Observable<any> {
    return this._httpClient.post<any>(`${this.apiURL}/update-tc`, param);
  }
}
