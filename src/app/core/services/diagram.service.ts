import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Observer, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class DiagramService {
  private readonly baseURL: string = '/assets/data';
  private readonly roleGeoJSON: string = 'roleGeoJSON.json';

  private _map: any;
  private _L: any;

  private _roleLayers: any;
  private _thanhCaiLayers: any;
  private _mayBienApLayers: any;

  //#region "Observable"
  public layerSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public layerEdit: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public mapData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  //#endregion

  constructor(private http: HttpClient) {}

  setMap(L: any, map: any) {
    this._L = L;
    this._map = map;
  }

  mapAddControlAndLayers() {
    this._initDrawControl();
    this._initMayBienApLayer();
    this._initThanhCaiLayer();
    this._initRoleLayer();

    this._drawEvents();
    this.mapData.next({
      L: this._L,
      map: this._map,
      roleLayers: this._roleLayers,
      thanhCaiLayers: this._thanhCaiLayers,
      mayBienApLayers: this._mayBienApLayers,
    });
  }

  getRoleData(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${this.roleGeoJSON}`);
  }

  private _initDrawControl(): void {
    const drawnItems = new this._L.FeatureGroup();
    this._map.addLayer(drawnItems);
    const drawControl = new this._L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: false,
      },
      draw: {
        polyline: true,
        polygon: false,
        marker: false,
        circle: false,
        rectangle: false,
        circlemarker: false,
        role: true,
        thanhCai: true,
        mayBienAp: true,
      },
    });
    this._map.addControl(drawControl);
  }

  private _initMayBienApLayer(): any {
    this._mayBienApLayers = this._L
      .geoJSON(undefined, {
        draggable: true,
        // transform: true,
        onEachFeature: (feature: any, layer: any) => {
          const properties = layer.feature.properties;
          if (properties.isEdit !== undefined && properties.isEdit) {
            this.layerEdit.next({
              layer: layer,
            });
          }
        },
        style: (feature: any) => {
          const color = feature.properties?.color || '#0000ff';
          return { color: color };
        },
        weight: 5,
        lineCap: 'square',
      })
      .addTo(this._map);
    this._mayBienApLayers.on('click', (e: any) => {
      this.layerSelect.next({
        layer: e.layer,
      });
    });
  }

  private _initThanhCaiLayer(): any {
    this._thanhCaiLayers = this._L
      .geoJSON(undefined, {
        draggable: true,
        onEachFeature: (feature: any, layer: any) => {
          const properties = layer.feature.properties;
          if (properties.isEdit !== undefined && properties.isEdit) {
            this.layerEdit.next({
              layer: layer,
            });
          }
        },
        style: (feature: any) => {
          const color = feature.properties?.color || '#0000ff';
          return { color: color };
        },
        weight: 8,
        lineCap: 'square',
      })
      .addTo(this._map);
    this._thanhCaiLayers.on('click', (e: any) => {
      this.layerSelect.next({
        layer: e.layer,
      });
    });
  }

  private _initRoleLayer(): any {
    this._roleLayers = this._L
      .geoJSON(undefined, {
        draggable: true,
        onEachFeature: (feature: any, layer: any) => {
          const properties = layer.feature.properties;
          if (properties.isEdit !== undefined && properties.isEdit) {
            this.layerEdit.next({
              layer: layer,
            });
          }
        },
        style: (feature: any) => {
          const color = feature.properties?.color || '#0000ff';
          return { color: color };
        },
        lineCap: 'square',
        weight: 5,
      })
      .addTo(this._map);
    this._roleLayers.on('click', (e: any) => {
      this.layerSelect.next({
        layer: e.layer,
      });
    });
  }

  private _drawEvents() {
    const L = this._L;
    this._map.on(this._L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      if (e.layerType === 'role') {
        const role = new L.polyline(layer._latlngs);
        let fRole = role.toGeoJSON();
        fRole.properties.id = uuidv4();
        fRole.properties.deviceTypeName = 'role';
        fRole.properties.name = '';
        fRole.properties.color = '#0000ff';
        fRole.properties.rotate = '0';
        this._roleLayers.addData(fRole);
      } else if (e.layerType === 'thanhCai') {
        const thanhCai = new L.polyline(layer._latlngs);
        let fThanhCai = thanhCai.toGeoJSON();
        fThanhCai.properties.id = uuidv4();
        fThanhCai.properties.deviceTypeName = 'thanhCai';
        fThanhCai.properties.name = '';
        fThanhCai.properties.color = '#0000ff';
        fThanhCai.properties.rotate = '0';
        this._thanhCaiLayers.addData(fThanhCai);
      } else if (e.layerType === 'mayBienAp') {
        const mayBienAp = new L.polyline(layer._latlngs);
        let fMayBienAp = mayBienAp.toGeoJSON();
        fMayBienAp.properties.id = uuidv4();
        fMayBienAp.properties.deviceTypeName = 'mayBienAp';
        fMayBienAp.properties.name = '';
        fMayBienAp.properties.color = '#0000ff';
        fMayBienAp.properties.rotate = '0';
        this._mayBienApLayers.addData(fMayBienAp);
      }
    });
  }
}
