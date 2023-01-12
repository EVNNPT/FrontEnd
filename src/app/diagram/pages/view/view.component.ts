import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DiagramService } from 'src/app/core';
import * as L from 'leaflet';
import '../../../../libs/leaflet-draw/leaflet.draw-src.js';
import '../../../../libs/leaflet-snap/leaflet.snap.js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  private imgBackgroundMap = '/assets/images/white_bkg.png';
  private _L: any;
  private _map: any;
  private _drawLayer: any;
  private _guideLayers: any;

  constructor(private _diagramService: DiagramService) {}

  ngOnInit(): void {
    this._initMap();
    this._diagramService.getDiagram(
      '1',
      this._L,
      this._drawLayer,
      this._guideLayers
    );
  }

  private _addOrUpdateGeo(layer: any): Observable<any> {
    if (layer instanceof this._L.DuongDay) {
      return this._diagramService.addOrUpdateGeoDuongDay(layer);
    } else if (layer instanceof this._L.Role) {
      return this._diagramService.addOrUpdateGeoRole(layer);
    } else if (layer instanceof this._L.MayBienAp) {
      return this._diagramService.addOrUpdateGeoMayBienAp(layer);
    } else {
      return this._diagramService.addOrUpdateGeoThanhCai(layer);
    }
  }

  // Init map
  private _initMap(): void {
    this._L = L as any;

    this._map = this._L.map('map', {
      center: [0, 0],
      zoom: 18,
      maxZoom: 20,
      minZoom: 10,
    });

    // Title
    this._L
      .tileLayer(this.imgBackgroundMap, {
        // attribution: '&copy; <a href="https://ftiglobal.com.vn/">FTI Global</a>',
      })
      .addTo(this._map);

    this._drawLayer = this._L.featureGroup().addTo(this._map);
    const gridLayer = this._L.featureGroup().addTo(this._map);
    const deviceSnapLayer = this._L.featureGroup().addTo(this._map);

    this._L.control
      .layers(
        {},
        { DrawLayer: this._drawLayer },
        { position: 'topright', collapsed: false }
      )
      .addTo(this._map);
    this._L.control
      .layers(
        {},
        { GridLayer: gridLayer },
        { position: 'topright', collapsed: false }
      )
      .addTo(this._map);
    this._L.control
      .layers(
        {},
        { DeviceSnapLayer: deviceSnapLayer },
        { position: 'topright', collapsed: false }
      )
      .addTo(this._map);

    let drawControl = new this._L.Control.Draw({
      edit: {
        featureGroup: this._drawLayer,
        poly: {
          allowIntersection: false,
        },
        edit: {
          selectedPathOptions: {
            dashArray: '10, 15',
            fill: false,
            fillColor: '#fe57a1',
            // Whether to user the existing layers color
            maintainColor: false,
          },
        },
        remove: true,
      },
      draw: {
        polyline: false,
      },
    });

    this._guideLayers = [gridLayer, deviceSnapLayer];

    drawControl.setDrawingOptions({
      duongDay: {
        guideLayers: this._guideLayers,
        snapDistance: 10,
        weight: 5,
        lineCap: 'square',
        lineJoin: 'square',
        color: 'red',
      },
      role: {
        guideLayers: this._guideLayers,
        snapDistance: 10,
        gocXoay: 0,
        weight: 8,
        lineCap: 'square',
        lineJoin: 'square',
      },
      thanhCai: {
        guideLayers: this._guideLayers,
        snapDistance: 10,
        gocXoay: 90,
        weight: 10,
        lineCap: 'square',
      },
      mayBienAp: {
        guideLayers: this._guideLayers,
        snapDistance: 10,
        gocXoay: 0,
        weight: 8,
        lineCap: 'square',
      },
    });

    this._map.addControl(drawControl);

    this._map.on(this._L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      this._drawLayer.addLayer(layer);
      this._addOrUpdateGeo(layer).subscribe((res) => {
        if (layer.id === undefined || layer.id === '') {
          layer.id = res.id;
        }
      });
    });

    this._map.on(this._L.Draw.Event.EDITED, (e: any) => {
      e.layers.eachLayer((ele: any) => {
        const layer = ele;
        if (
          !(layer instanceof this._L.DuongDay) &&
          !(layer instanceof this._L.ThanhCai)
        ) {
          const layerSnap = layer.getLayerSnap();
          deviceSnapLayer.addLayer(layerSnap);
          deviceSnapLayer.removeLayer(layer.snapLayerId);
          layer.snapLayerId = this._L.Util.stamp(layerSnap);
        }
        this._addOrUpdateGeo(layer).subscribe((res) => {
          if (layer.id === undefined || layer.id === '') {
            layer.id = res.id;
          }
        });
      });
    });

    this._map.on(this._L.Draw.Event.DELETED, (e: any) => {
      e.layers.eachLayer((layer: any) => {
        if (
          !(layer instanceof this._L.DuongDay) &&
          !(layer instanceof this._L.ThanhCai)
        ) {
          deviceSnapLayer.removeLayer(layer.snapLayerId);
        }
        this._diagramService.deleteFeature(layer, this._L).subscribe(() => {});
      });
    });

    this._drawLayer.on('layeradd', (e: any) => {
      const layer = e.layer;
      if (
        !(layer instanceof this._L.DuongDay) &&
        !(layer instanceof this._L.ThanhCai)
      ) {
        const layerSnap = layer.getLayerSnap();
        deviceSnapLayer.addLayer(layerSnap);
        layer.snapLayerId = this._L.Util.stamp(layerSnap);
      }
    });

    this._drawLayer.on('click', (e: any) => {
      const layer = e.layer;
      const id = layer.id;
      let url = '';
      if (layer instanceof this._L.Role) {
        url = `/admin/ro-le-detail/${id}`;
      } else if (layer instanceof this._L.DuongDay) {
        url = `/admin/duong-day-detail/${id}`;
      } else if (layer instanceof this._L.ThanhCai) {
        url = `/admin/thanh-cai-detail/${id}`;
      } else if (layer instanceof this._L.MayBienAp) {
        url = `/admin/may-bien-ap-detail/${id}`;
      }
      window.open(url);
    });

    this._L.guideLayer(this._map, {
      height: 50,
      width: 50,
      layer: gridLayer,
      zoom: 17,
    });
  }
}
