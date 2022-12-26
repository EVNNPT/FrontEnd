import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DuongDayDetail } from '../models/duong-day';

@Injectable({
  providedIn: 'root',
})
export class DuongDayService {
  private apiURL = `${environment.apiURL}/DuongDay`;
  constructor(private _httpClient: HttpClient) {}

  getDSDuongDay(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-ds-dd`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  getDetailDuongDay(MaPMIS: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-detail-dd?MaPMIS=${MaPMIS}`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  addDuongDay(param: DuongDayDetail): Observable<any> {
    return this._httpClient.post<any>(`${this.apiURL}/add-dd`, param);
  }

  updateDuongDay(param: DuongDayDetail): Observable<any> {
    return this._httpClient.post<any>(`${this.apiURL}/update-dd`, param);
  }
}
