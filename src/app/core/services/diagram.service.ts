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

  //#region "Layer"
  private roleLayer: any;
  private roleSelected: any = null;
  //#endregion

  //#region "Thanh cái"
  private thanhCaiLayer: any;
  private thanhCaiSelected: any = null;
  //#endregion

  //#region "Máy biến áp"
  private mayBienApLayer: any;
  private mayBienApSelected: any = null;
  //#endregion

  //#region "Observable"
  public featureSelected: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  //#endregion

  constructor(private http: HttpClient) {}

  getRoleData(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${this.roleGeoJSON}`);
  }

  initDrawControl(L: any, map: any): void {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
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
    map.addControl(drawControl);
  }

  initMayBienApLayer(L: any, map: any): any {
    this.mayBienApLayer = L.geoJSON(undefined, {
      draggable: true,
      transform: true,
      onEachFeature: (feature: any, layer: any) => {
        layer.dragging.disable();
      },
      weight: 5,
      lineCap: 'square',
    }).addTo(map);
    this.mayBienApLayer.on('click', (e: any) => {
      if (this.mayBienApSelected != null) {
        this.mayBienApSelected.dragging.disable();
      }
      this.mayBienApSelected = e.layer;
      this.mayBienApSelected.dragging.enable();
      this.featureSelected.next({
        L: L,
        map: map,
        selected: this.mayBienApSelected,
        layer: this.mayBienApLayer,
      });
    });
    return this.mayBienApSelected;
  }

  initThanhCaiLayer(L: any, map: any): any {
    this.thanhCaiLayer = L.geoJSON(undefined, {
      draggable: true,
      transform: true,
      onEachFeature: (feature: any, layer: any) => {
        layer.dragging.disable();
        layer.on('click', (e: any) => {});
      },
      weight: 8,
      lineCap: 'square',
    }).addTo(map);
    this.thanhCaiLayer.on('click', (e: any) => {
      if (this.thanhCaiSelected != null) {
        this.thanhCaiSelected.dragging.disable();
      }
      this.thanhCaiSelected = e.layer;
      this.thanhCaiSelected.dragging.enable();
      this.featureSelected.next({
        L: L,
        map: map,
        selected: this.thanhCaiSelected,
        layer: this.thanhCaiLayer,
      });
    });
    return this.thanhCaiSelected;
  }

  initRoleLayer(L: any, map: any): any {
    this.roleLayer = L.geoJSON(undefined, {
      draggable: true,
      transform: true,
      onEachFeature: (feature: any, layer: any) => {
        const properties = layer.feature.properties;
        if (properties.isEdit === undefined || !properties.isEdit) {
          layer.dragging.disable();
        } else {
          layer.dragging.enable();
        }
        layer.on('click', (e: any) => {
          const properties = e.target.feature.properties;
          e.target.dragging.enable();
          if (properties.isEdit === undefined || !properties.isEdit) {
            if (this.roleSelected != null) {
              this.roleSelected.dragging.disable();
            }
            this.roleSelected = e.target;
            this.roleSelected.dragging.enable();
            this.featureSelected.next({
              L: L,
              map: map,
              // Layer Select
              selected: this.roleSelected,
              // Layer Groups
              layer: this.roleLayer,
            });
          }
        });
      },
      style: (feature: any) => {
        const color = feature.properties?.color || '#0000ff';
        return { color: color };
      },
      lineCap: 'square',
      weight: 5,
    }).addTo(map);
    return this.roleLayer;
  }

  drawEvents(L: any, map: any) {
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      const midLatLng = e.midLatLng;
      if (e.layerType === 'role') {
        const role = new L.polyline(layer._latlngs);
        let fRole = role.toGeoJSON();
        fRole.properties.id = uuidv4();
        fRole.properties.deviceTypeName = 'role';
        fRole.properties.name = '';
        fRole.properties.color = '#0000ff';
        fRole.properties.rotate = '0';
        fRole.properties.midLat = midLatLng.lat;
        fRole.properties.midLng = midLatLng.lng;
        this.roleLayer.addData(fRole);
        console.log(this.roleLayer)
        // const pTmp = new L.point(fRole.geometry.coordinates[0][0][1], fRole.geometry.coordinates[0][0][0]);
        // const point = L.CRS.EPSG4326.unproject(pTmp);
        // console.log(fRole.geometry.coordinates[0][0])
        // console.log(point)
        // const deviceTranform = new L.TransfromDevice(map);
        // const fRoleEdit = deviceTranform
        //   .rotateRole(layer._latlngs, midLatLng, 90)
        //   .toGeoJSON();
        // this.roleLayer.addData(fRoleEdit);
        // console.log(fRole)
      } else if (e.layerType === 'thanhCai') {
        const thanhCai = new L.polyline(layer._latlngs);
        let fThanhCai = thanhCai.toGeoJSON();
        fThanhCai.properties.id = uuidv4();
        fThanhCai.properties.deviceTypeName = 'thanhCai';
        fThanhCai.properties.name = '';
        fThanhCai.properties.color = '#0000ff';
        fThanhCai.properties.rotate = '0';
        this.thanhCaiLayer.addData(fThanhCai);
      } else if (e.layerType === 'mayBienAp') {
        const mayBienAp = new L.polyline(layer._latlngs);
        let fMayBienAp = mayBienAp.toGeoJSON();
        fMayBienAp.properties.id = uuidv4();
        fMayBienAp.properties.deviceTypeName = 'mayBienAp';
        fMayBienAp.properties.name = '';
        fMayBienAp.properties.color = '#0000ff';
        fMayBienAp.properties.rotate = '0';
        this.mayBienApLayer.addData(fMayBienAp);
      }
    });
  }
}
