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
  private _drawnItems: any;

  private _duongDayLayers: any;
  private _roleLayers: any;
  private _thanhCaiLayers: any;
  private _mayBienApLayers: any;
  private _snapLayers: any;

  private _opacity: number = 0;
  private _drawExtUtil: any;
  private _tranformDevice: any;

  //#region "Observable"
  public layerSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  //#endregion

  constructor(private http: HttpClient) {}

  //#region "Get"
  public get map() {
    return this._map;
  }

  public get L() {
    return this._L;
  }

  public get duongDayLayers() {
    return this._duongDayLayers;
  }

  public get roleLayers() {
    return this._roleLayers;
  }

  public get thanhCaiLayers() {
    return this._thanhCaiLayers;
  }

  public get mayBienApLayers() {
    return this._mayBienApLayers;
  }

  public get snapLayers() {
    return this._snapLayers;
  }

  public get drawExtUtil() {
    return this._drawExtUtil;
  }

  public get tranformDevice() {
    return this._tranformDevice;
  }

  //#endregion

  setMap(L: any, map: any) {
    this._L = L;
    this._map = map;
    this._drawExtUtil = new this._L.DrawExtUtil(this._map);
    this._tranformDevice = new this._L.TransfromDevice(
      this._map,
      this._drawExtUtil
    );
  }

  mapAddControlAndLayers() {
    this._initDrawControl();
    this._initMayBienApLayer();
    this._initThanhCaiLayer();
    this._initRoleLayer();
    this._initDuongDayLayer();
    this._drawEvents();
  }

  getRoleData(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/${this.roleGeoJSON}`);
  }

  private _initDrawControl() {
    this._drawnItems = new this._L.FeatureGroup();
    this._map.addLayer(this._drawnItems);
    const drawControl = new this._L.Control.Draw({
      edit: {
        featureGroup: this._drawnItems,
        edit: false,
        remove: false,
      },
      draw: {
        duongDay: true,
        polyline: false,
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
    this._snapLayers = this._L.layerGroup([]).addTo(this._map);
    const guideLayers = [this._snapLayers];
    drawControl.setDrawingOptions({
      duongDay: { guideLayers: guideLayers },
    });
    this._map.addControl(drawControl);
  }

  private _initMayBienApLayer() {
    this._mayBienApLayers = this._L
      .geoJSON(undefined, {
        draggable: true,
        onEachFeature: (feature: any, layer: any) => {
          layer.dragging.disable();
          this.addSnapLayer(layer);
          layer.on('dragend', (event: any) => {
            const layer = event.target;
            this.removeSnapLayer(layer);
            this.addSnapLayer(layer);
          });
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
      const layerSelectNew = e.layer;
      this._disableDragSelectCur(layerSelectNew);
      this.layerSelect.next({
        layer: layerSelectNew,
      });
    });
  }

  private _initThanhCaiLayer() {
    this._thanhCaiLayers = this._L
      .geoJSON(undefined, {
        draggable: true,
        onEachFeature: (feature: any, layer: any) => {
          layer.dragging.disable();
          this.addSnapLayer(layer);
          layer.on('dragend', (event: any) => {
            const layer = event.target;
            this.removeSnapLayer(layer);
            this.addSnapLayer(layer);
          });
        },
        style: (feature: any) => {
          const color = feature.properties?.color || '#0000ff';
          return { color: color };
        },
        weight: 9,
        lineCap: 'square',
      })
      .addTo(this._map);
    this._thanhCaiLayers.on('click', (e: any) => {
      const layerSelectNew = e.layer;
      this._disableDragSelectCur(layerSelectNew);
      this.layerSelect.next({
        layer: layerSelectNew,
      });
    });
  }

  private _initRoleLayer() {
    this._roleLayers = this._L
      .geoJSON(undefined, {
        draggable: true,
        onEachFeature: (feature: any, layer: any) => {
          layer.dragging.disable();
          this.addSnapLayer(layer);
          layer.on('dragend', (event: any) => {
            const layer = event.target;
            this.removeSnapLayer(layer);
            this.addSnapLayer(layer);
          });
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
      const layerSelectNew = e.layer;
      this._disableDragSelectCur(layerSelectNew);
      this.layerSelect.next({
        layer: layerSelectNew,
      });
    });
  }

  private _initDuongDayLayer() {
    this._duongDayLayers = this._L
      .geoJSON(undefined, {
        draggable: false,
        onEachFeature: (feature: any, layer: any) => {},
        style: (feature: any) => {
          const color = feature.properties?.color || '#0000ff';
          return { color: color };
        },
        lineCap: 'square',
        weight: 5,
      })
      .addTo(this._map);
  }

  private _drawEvents() {
    const L = this._L;
    this._map.on(this._L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      // this._drawnItems.addLayer(layer);
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
      } else if (e.layerType === 'duongDay') {
        const line = new L.polyline(layer._latlngs);
        let fLine = line.toGeoJSON();
        fLine.properties.id = uuidv4();
        fLine.properties.deviceTypeName = 'duongDay';
        fLine.properties.name = '';
        fLine.properties.color = '#0000ff';
        fLine.properties.rotate = '0';
        this._duongDayLayers.addData(fLine);
      }
    });
  }

  private _disableDragSelectCur(layer: any): void {
    const layerSelectCur = this.layerSelect.getValue()?.layer;
    if (layerSelectCur && layerSelectCur._leaflet_id !== layer._leaflet_id) {
      layerSelectCur.dragging.disable();
    }
  }

  public rotate(layer: any, angleA: number, angleB: number): void {
    const properties = layer.feature.properties;
    switch (properties.deviceTypeName) {
      case 'role':
        layer.setLatLngs(
          this._tranformDevice.rotateRole(layer, angleA).getLatLngs()
        );
        layer.setLatLngs(
          this._tranformDevice.rotateRole(layer, angleB).getLatLngs()
        );
        break;
      case 'thanhCai':
        layer.setLatLngs(
          this._tranformDevice.rotateThanhCai(layer, angleA).getLatLngs()
        );
        layer.setLatLngs(
          this._tranformDevice.rotateThanhCai(layer, angleB).getLatLngs()
        );
        break;
      case 'mayBienAp':
        layer.setLatLngs(
          this._tranformDevice.rotateMayBienAp(layer, angleA).getLatLngs()
        );
        layer.setLatLngs(
          this._tranformDevice.rotateMayBienAp(layer, angleB).getLatLngs()
        );
        break;
    }
  }

  public removeSnapLayer(layer: any): void {
    const properties = layer.feature.properties;
    // Remove
    for (var i = 0; i < properties.snapLayerIds?.length; i++) {
      this._snapLayers.removeLayer(properties.snapLayerIds[i]);
    }
    properties.snapLayerIds = [];
  }

  public addSnapLayer(layer: any): void {
    const properties = layer.feature.properties;
    switch (properties.deviceTypeName) {
      case 'role':
        this._addRoleSnapLayer(layer);
        break;
      case 'thanhCai':
        this._addThanhCaiSnapLayer(layer);
        break;
      case 'mayBienAp':
        this._addMayBienApSnapLayer(layer);
        break;
    }
  }

  private _addRoleSnapLayer(layer: any): void {
    // Add
    const properties = layer.feature.properties;
    const pMs = this._drawExtUtil.getSnapPoints(layer);
    const rotate = parseInt(properties.rotate);

    let markerM1 = null;
    let markerM2 = null;
    if (rotate === 0) {
      markerM1 = this._L.marker(pMs[0], {
        opacity: this._opacity,
      });
      markerM2 = this._L.marker(pMs[1], {
        opacity: this._opacity,
      });
    } else if (rotate === 90) {
      markerM1 = this._L.marker(pMs[2], {
        opacity: this._opacity,
      });
      markerM2 = this._L.marker(pMs[3], {
        opacity: this._opacity,
      });
    }
    this._snapLayers.addLayer(markerM1);
    this._snapLayers.addLayer(markerM2);
    // Set Leaflet Id
    properties.snapLayerIds = [markerM1._leaflet_id, markerM2._leaflet_id];
  }

  private _addThanhCaiSnapLayer(layer: any): void {
    const properties = layer.feature.properties;
    const snapLayer = this._L.polyline(layer.getLatLngs(), {
      opacity: this._opacity,
    });
    this._snapLayers.addLayer(snapLayer);
    // Set Leaflet Id
    properties.snapLayerIds = [snapLayer._leaflet_id];
  }

  private _addMayBienApSnapLayer(layer: any): void {
    const properties = layer.feature.properties;
    // Tạo 2 điểm bắt snap cho Rơle
    const pMs = this._drawExtUtil.getSnapPoints(layer);
    const rotate = parseInt(properties.rotate);
    let markerM1 = null;
    let markerM2 = null;
    if (rotate === 0 || rotate === 180) {
      markerM1 = this._L.marker(pMs[2], {
        opacity: this._opacity,
      });
      markerM2 = this._L.marker(pMs[3], {
        opacity: this._opacity,
      });
    } else if (rotate === 90 || rotate === 270) {
      markerM1 = this._L.marker(pMs[0], {
        opacity: this._opacity,
      });
      markerM2 = this._L.marker(pMs[1], {
        opacity: this._opacity,
      });
    }
    this._snapLayers.addLayer(markerM1);
    this._snapLayers.addLayer(markerM2);
    // Set Leaflet Id
    properties.snapLayerIds = [markerM1._leaflet_id, markerM2._leaflet_id];
  }
}
