import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiURL = `${environment.apiURL}/DuongDay`;
  constructor(private _httpClient: HttpClient) {}

  getSoLuongTB(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-sl-tb`).pipe(
      map(result => {
        return result;
      })
    )
  }

  getSLTBDongCat(): Observable<any> {
    return this._httpClient.get<any>(`${this.apiURL}/get-sltb-dong-cat`).pipe(
      map(result => {
        return result;
      })
    )
  }
}
