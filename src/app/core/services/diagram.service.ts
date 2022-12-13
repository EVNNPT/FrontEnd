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
      },
    });
    map.addControl(drawControl);
  }

  initRoleLayer(L: any, map: any): any {
    this.roleLayer = L.geoJSON(undefined, {
      draggable: true,
      transform: true,
      onEachFeature: (feature: any, layer: any) => {
        layer.dragging.disable();
      },
    }).addTo(map);
    this.roleLayer.on('click', (e: any) => {
      if (this.roleSelected != null) {
        this.roleSelected.transform.disable();
      }
      this.roleSelected = e.layer;
      this.roleSelected.transform.enable();
      this.roleSelected.transform.setOptions({
        rotation: true,
        scaling: false,
      });
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
      }
    });
  }
}
