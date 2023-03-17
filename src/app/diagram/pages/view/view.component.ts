import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DiagramService } from 'src/app/core';
import * as L from 'leaflet';
import '../../../../libs/leaflet-draw/leaflet.draw-src.js';
import '../../../../libs/leaflet-snap/leaflet.snap.js';
import { Observable } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav/index.js';
import { LabelDetail } from 'src/app/core/models/label-detail';
import { LabelDetailComponent } from '../label-detail/label-detail.component.js';
import { Router } from '@angular/router';
import { RoLeService } from 'src/app/core/services/ro-le.service';
import { RoLeDetail } from 'src/app/core/models/ro-le';
// import { LabelDetail } from 'src/app/core/models/label-detail.js';

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
  private _markerLabel: any;
  private _markerRole: any;
  typeForm: string = 'Label';

  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  @ViewChild('labelDetail', { static: true })
  labelDetail!: LabelDetailComponent;

  constructor(
    private _diagramService: DiagramService,
    private router: Router,
    private _roLeService: RoLeService
  ) {}

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
    } else if (layer instanceof this._L.ThanhCai) {
      return this._diagramService.addOrUpdateGeoThanhCai(layer);
    } else {
      return this._diagramService.addOrUpdateGeoLabel(layer);
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
      label: {
        guideLayers: this._guideLayers,
        snapDistance: 10,
        repeatMode: true,
      },
    });

    if (this.router.url.includes('edit')) {
      this._map.addControl(drawControl);
    }

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
          !(layer instanceof this._L.ThanhCai) &&
          !(layer instanceof this._L.Label)
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
          !(layer instanceof this._L.ThanhCai) &&
          !(layer instanceof this._L.Label)
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
        !(layer instanceof this._L.ThanhCai) &&
        !(layer instanceof this._L.Label)
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
      if (layer instanceof this._L.Label && this.router.url.includes('edit')) {
        this.drawer.close();
        this._markerLabel = layer;
        var dataLabel = new LabelDetail(
          layer.options.text,
          layer.options.fontSize,
          layer.options.fontFamily,
          layer.options.fontColor,
          layer.options.isBold,
          layer.options.isItalic
        );
        this.labelDetail.setFormDataLabel(dataLabel);
        this.typeForm = 'Label';
        this.drawer.open();
        return;
      }
      if (layer instanceof this._L.Role && this.router.url.includes('edit')) {
        this.drawer.close();
        this._markerRole = layer;
        this.labelDetail.setFormDataRole(id);
        this.typeForm = 'Role';
        this.drawer.open();
        return;
      }
      if (layer instanceof this._L.Role) {
        url = `/admin/ro-le-detail/${id}`;
      } else if (layer instanceof this._L.DuongDay) {
        url = `/admin/duong-day-detail/${id}`;
      } else if (layer instanceof this._L.ThanhCai) {
        url = `/admin/thanh-cai-detail/${id}`;
      } else if (layer instanceof this._L.MayBienAp) {
        url = `/admin/may-bien-ap-detail/${id}`;
      }
      if (url != '') {
        window.open(url);
      }
    });

    this._L.guideLayer(this._map, {
      height: 50,
      width: 50,
      layer: gridLayer,
      zoom: 17,
    });
  }

  formEvent(event: any): void {
    if (event.isConfirm) {
      // Confirm
      if (event.typeForm == 'Label') {
        if (this._markerLabel == null) {
          this._map.fire(this._L.Draw.Event.FINISHDRAWLABEL, event.formData);
        } else {
          this._L.setOptions(this._markerLabel, event.formData);
          this._markerLabel.updateImage();
          this._addOrUpdateGeo(this._markerLabel).subscribe((res) => {
            if (this._markerLabel.id === undefined || this._markerLabel.id === '') {
              this._markerLabel.id = res.id;
            }
          });
          // this._map.fire(this._L.Draw.Event.FINISHEDITLABEL, {
          //   marker: this._markerLabel,
          //   options: event.formData,
          // });
        }
      } else if (event.typeForm == 'Role') {
        var itemAdd: RoLeDetail = new RoLeDetail();
        itemAdd.Mapmis = event.formData.MAPMIS;
        itemAdd.Madvql = event.formData.MADVQL;
        itemAdd.Tencongty = event.formData.TENCONGTY;
        itemAdd.Truyentaidien = event.formData.TRUYENTAIDIEN;
        itemAdd.Tenrole = event.formData.TENROLE;
        itemAdd.Sohieu = event.formData.SOHIEU;
        itemAdd.Sohuu = event.formData.SOHUU;
        itemAdd.Ngaylapdat = event.formData.NGAYLAPDAT;
        itemAdd.Ngayvh = event.formData.NGAYVH;
        itemAdd.Thuoctram = event.formData.THUOCTRAM;
        itemAdd.Tentram = event.formData.TENTRAM;
        itemAdd.Hangsx = event.formData.HANGSX;
        itemAdd.Soserial = event.formData.SOSERIAL;
        itemAdd.Sohieubanve = event.formData.SOHIEUBANVE;
        itemAdd.Sododanhso = event.formData.SODODANHSO;
        itemAdd.Mach = event.formData.MACH;
        itemAdd.Tbbaove = event.formData.TBBAOVE;
        itemAdd.Tubv = event.formData.TUBV;
        itemAdd.Cottenhienthi = event.formData.COTTENHIENTHI;
        itemAdd.Dahienthitrensd =
          event.formData.DAHIENTHITRENSD == true ? 'Y' : 'N';
        itemAdd.Hienthiten = event.formData.HIENTHITEN == true ? 'Y' : 'N';
        itemAdd.Hoatdong = event.formData.HOATDONG == true ? 'Y' : 'N';
        itemAdd.Tthientai = event.formData.TTHIENTAI;
        itemAdd.Jsongeo = event.formData.JSONGEO;
        itemAdd.Maudong = event.formData.MAUDONG;
        itemAdd.Maucat = event.formData.MAUCAT;
        itemAdd.Daunoidau = event.formData.DAUNOIDAU;
        itemAdd.Daunoicuoi = event.formData.DAUNOICUOI;
        itemAdd.Ghichu = event.formData.GHICHU;
        this._roLeService.updateRoLe(itemAdd).subscribe((result) => {
          // if (!result.fail) {
          //   var colorchange = '';
          //   if (event.formData.TTHIENTAI == 'Đóng') {
          //     colorchange = event.formData.MAUDONG
          //   } else {
          //     colorchange = event.formData.MAUCAT
          //   }
          //   // this._L.setOptions(this._markerRole, { color: colorchange});
          //   this._markerRole.setStyle({ color: colorchange });
          // }
          this._diagramService.getDiagram(
            '1',
            this._L,
            this._drawLayer,
            this._guideLayers
          );
        });
      }
    }
    this.drawer.close();
  }
}
