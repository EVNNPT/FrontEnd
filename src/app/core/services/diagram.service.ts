import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Observer, Subject } from 'rxjs';
// import { v4 as uuidv4 } from 'uuid';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DiagramService {
  private readonly _baseURL: string = '/assets/data';
  private readonly roleGeoJSON: string = 'roleGeoJSON.json';
  private readonly _apiURL: string = environment.apiURL;
  private readonly _diagramCtrl: string = 'diagram';
  private readonly _addOrUpdateFeature: string = 'add-or-update-feature';
  private readonly _deleteFeature: string = 'delete-feature';

  constructor(private _http: HttpClient) {}

  getRoleData(id: string): Observable<any> {
    return this._http.get<any>(`${this._baseURL}/${this.roleGeoJSON}`);
  }

  public deleteFeature(layer: any, L: any): Observable<any> {
    var data = {
      id: layer.id,
      featureType: 0,
    };
    if (layer instanceof L.DuongDay) {
      data.featureType = 3;
    } else if (layer instanceof L.Role) {
      data.featureType = 0;
    } else if (layer instanceof L.MayBienAp) {
      data.featureType = 2;
    } else {
      data.featureType = 1;
    }
    const uri = `${this._apiURL}/${this._diagramCtrl}/${this._deleteFeature}`;
    return this._http.post<any>(uri, data);
  }

  public getDiagram(
    id: string,
    L: any,
    drawLayer: any,
    guideLayers: any
  ): void {
    this._http.get<any>(`${this._apiURL}/diagram/${id}`).subscribe((ret) => {
      ret.roles.forEach((ele: any) => {
        ele.options.guideLayers = guideLayers;
        const layer = L.role(ele.centerPoint, ele.options);
        drawLayer.addLayer(layer);
        layer.id = ele.id;
      });
      ret.thanhCais.forEach((ele: any) => {
        ele.options.guideLayers = guideLayers;
        const layer = L.thanhCai(ele.centerPoint, ele.options);
        drawLayer.addLayer(layer);
        layer.id = ele.id;
      });
      ret.mayBienAps.forEach((ele: any) => {
        ele.options.guideLayers = guideLayers;
        const layer = L.mayBienAp(ele.centerPoint, ele.options);
        drawLayer.addLayer(layer);
        layer.id = ele.id;
      });
      ret.duongDays.forEach((ele: any) => {
        ele.options.guideLayers = guideLayers;
        const layer = L.duongDay(ele.latLngs, ele.options);
        drawLayer.addLayer(layer);
        layer.id = ele.id;
      });
    });
  }

  public addOrUpdateGeoDuongDay(layer: any): Observable<any> {
    const data = {
      centerPoint: layer.getCenterCus(layer),
      id: layer.id || '',
      featureType: 3,
      options: {
        chieuDai: layer.options.chieuDai,
        chieuRong: layer.options.chieuRong,
        gocXoay: layer.options.gocXoay,
        weight: layer.options.weight,
        color: layer.options.color,
        lineCap: layer.options.lineCap,
        lineJoin: layer.options.lineJoin,
      },
      latLngs: layer.getLatLngs(),
    };
    const uri = `${this._apiURL}/${this._diagramCtrl}/${this._addOrUpdateFeature}`;
    return this._http.post<any>(uri, data);
  }

  public addOrUpdateGeoRole(layer: any): Observable<any> {
    const data = {
      centerPoint: layer.getCenterCus(layer),
      id: layer.id || '',
      featureType: 0,
      options: {
        chieuDai: layer.options.chieuDai,
        chieuRong: layer.options.chieuRong,
        gocXoay: layer.options.gocXoay,
        weight: layer.options.weight,
        color: layer.options.color,
        lineCap: layer.options.lineCap,
        lineJoin: layer.options.lineJoin,
      },
    };
    const uri = `${this._apiURL}/${this._diagramCtrl}/${this._addOrUpdateFeature}`;
    return this._http.post<any>(uri, data);
  }

  public addOrUpdateGeoThanhCai(layer: any): Observable<any> {
    const data = {
      centerPoint: layer.getCenterCus(),
      id: layer.id || '',
      featureType: 1,
      options: {
        chieuDai: layer.options.chieuDai,
        gocXoay: layer.options.gocXoay,
        weight: layer.options.weight,
        color: layer.options.color,
        lineCap: layer.options.lineCap,
        lineJoin: layer.options.lineJoin,
      },
    };
    const uri = `${this._apiURL}/${this._diagramCtrl}/${this._addOrUpdateFeature}`;
    return this._http.post<any>(uri, data);
  }

  public addOrUpdateGeoMayBienAp(layer: any): Observable<any> {
    const data = {
      centerPoint: layer.getLatLng(),
      id: layer.id || '',
      featureType: 2,
      options: {
        chieuDai: layer.options.chieuDai,
        gocXoay: layer.options.gocXoay,
        weight: layer.options.weight,
        color: layer.options.color,
        lineCap: layer.options.lineCap,
        lineJoin: layer.options.lineJoin,
      },
    };
    const uri = `${this._apiURL}/${this._diagramCtrl}/${this._addOrUpdateFeature}`;
    return this._http.post<any>(uri, data);
  }
}
