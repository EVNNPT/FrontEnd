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
  public layerEvents: Subject<any | void> = new Subject<any | void>();
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
      this.layerEvents.next(this.mayBienApSelected.feature);
    });
    return this.mayBienApSelected;
  }

  initThanhCaiLayer(L: any, map: any): any {
    this.thanhCaiLayer = L.geoJSON(undefined, {
      draggable: true,
      transform: true,
      onEachFeature: (feature: any, layer: any) => {
        layer.dragging.disable();
      },
      weight: 6,
      lineCap: 'square',
    }).addTo(map);
    this.thanhCaiLayer.on('click', (e: any) => {
      if (this.thanhCaiSelected != null) {
        this.thanhCaiSelected.dragging.disable();
      }
      this.thanhCaiSelected = e.layer;
      this.thanhCaiSelected.dragging.enable();
      this.layerEvents.next(this.thanhCaiSelected.feature);
      console.log(this.thanhCaiSelected.feature);
      const coordinates = this.thanhCaiSelected.feature.geometry.coordinates;
      const matrix = new L.Matrix(1, 0, 0, 1, 0, 0);
      const matrixA = matrix.rotate(Math.PI / 2);
      console.log(matrixA);
      L.polyline([
        matrixA.transform(coordinates[0]),
        coordinates[1],
        matrixA.transform(coordinates[1]),
      ]).addTo(map);
      // const matrix = new L.Matrix(1, 0, 0, 1, 0, 0);
      // const pA = L.point(1, 1);
      // console.log(pA);
      // const matrixA = matrix.rotate(Math.PI, pA);
      // console.log(matrixA);
      // console.log(matrixA.transform(pA));
    });
    return this.thanhCaiSelected;
  }

  initRoleLayer(L: any, map: any): any {
    this.roleLayer = L.geoJSON(undefined, {
      draggable: true,
      transform: true,
      onEachFeature: (feature: any, layer: any) => {
        layer.dragging.disable();
      },
      lineCap: 'square',
      weight: 5,
    }).addTo(map);
    this.roleLayer.on('click', (e: any) => {
      if (this.roleSelected != null) {
        this.roleSelected.dragging.disable();
      }
      this.roleSelected = e.layer;
      this.roleSelected.dragging.enable();
      this.layerEvents.next(this.roleSelected.feature);
    });
    return this.roleLayer;
  }

  drawEvents(L: any, map: any) {
    map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      if (e.layerType === 'role') {
        const role = new L.polyline(layer._latlngs);
        let fRole = role.toGeoJSON();
        fRole.properties.id = uuidv4();
        this.roleLayer.addData(fRole);
      } else if (e.layerType === 'thanhCai') {
        const thanhCai = new L.polyline(layer._latlngs);
        let fThanhCai = thanhCai.toGeoJSON();
        fThanhCai.properties.id = uuidv4();
        this.thanhCaiLayer.addData(fThanhCai);
      } else if (e.layerType === 'mayBienAp') {
        const mayBienAp = new L.polyline(layer._latlngs);
        console.log(mayBienAp);
        let fMayBienAp = mayBienAp.toGeoJSON();
        fMayBienAp.properties.id = uuidv4();
        this.mayBienApLayer.addData(fMayBienAp);
      }
    });
  }
}
