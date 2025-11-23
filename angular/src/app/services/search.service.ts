import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {

  baseUrl = 'https://api.hova-tovabb.hu';

  constructor(private http: HttpClient) {}

  searchStation(query: string): Observable<any[]> {
    return this.http.post<any>(`${this.baseUrl}/searchStation`, { query })
      .pipe(map(res => res?.results ?? []));
  }

  // 🔵 EREDETI
  searchRoutes(from: any, to: any): Observable<any[]> {
    const payload = {
      from: {
        name: from.lsname,
        settlementId: from.settlement_id,
        ls_id: from.ls_id,
        siteCode: from.site_code,
      },
      to: {
        name: to.lsname,
        settlementId: to.settlement_id,
        ls_id: to.ls_id,
        siteCode: to.site_code,
      }
    };

    return this.http.post<any>(`${this.baseUrl}/searchRoutes`, payload)
      .pipe(
        map(res => {
          if (!res?.results?.talalatok) return [];
          return Object.values(res.results.talalatok);
        })
      );
  }

  // 🔵 ÚJ: dátum + óra + perc
  searchRoutesCustom(from: any, to: any, date: string, hour: number, minute: number): Observable<any[]> {
    const payload = {
      from: {
        name: from.lsname,
        settlementId: from.settlement_id,
        ls_id: from.ls_id,
        siteCode: from.site_code,
      },
      to: {
        name: to.lsname,
        settlementId: to.settlement_id,
        ls_id: to.ls_id,
        siteCode: to.site_code,
      },
      date,
      hour,
      minute
    };

    return this.http.post<any>(`${this.baseUrl}/searchRoutesCustom`, payload)
      .pipe(
        map(res => {
          if (!res?.results?.talalatok) return [];
          return Object.values(res.results.talalatok);
        })
      );
  }
}
