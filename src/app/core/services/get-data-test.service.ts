import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetDataTestService {
  constructor(private http: HttpClient) {}

  listDD(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/data-dd-test.json');
  }

  listMBA(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/data-mba-test.json');
  }

  listRL(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/data-ro-le-test.json');
  }

  listTC(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/data-tc-test.json');
  }

  listFDK(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/data-file-dinh-kem-test.json');
  }

  listTBLQ(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/data-tblq-test.json');
  }
}
