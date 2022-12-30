import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MayBienApDetail } from '../models/may-bien-ap';

@Injectable({
  providedIn: 'root',
})
export class MayBienApService {
  private apiURL = `${environment.apiURL}/MayBienAp`;
  constructor(private _httpClient: HttpClient) {}

  getDSMayBienAp(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-ds-mba`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  getDetailMayBienAp(MaPMIS: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-detail-mba?MaPMIS=${MaPMIS}`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  addMayBienAp(param: MayBienApDetail): Observable<any> {
    return this._httpClient.post<any>(`${this.apiURL}/add-mba`, param);
  }

  updateMayBienAp(param: MayBienApDetail): Observable<any> {
    return this._httpClient.post<any>(`${this.apiURL}/update-mba`, param);
  }

  deleteMayBienAp(param: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/delete-mba?id=${param}`);
  }

  getFileDinhKem(MaLoaiThietBi: string, MaDT: string): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-file-dinh-kem-mba?MaLoaiThietBi=${MaLoaiThietBi}&MaDT=${MaDT}`).pipe(
      map((result) => {
        return result;
      })
    );
  }
}
