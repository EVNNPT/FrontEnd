import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiagramService } from 'src/app/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-thanh-cai-detail',
  templateUrl: './thanh-cai-detail.component.html',
  styleUrls: ['./thanh-cai-detail.component.css'],
})
export class ThanhCaiDetailComponent implements OnInit, OnDestroy {
  public roleForm = this._fb.group({
    color: [''],
    rotate: [''],
  });
  // Layer Group Thanh Cái.
  private _thanhCaiLayers: any;
  // Thanh Cái Layer đang chỉnh sửa.
  private _thanhCaiLayer: any;
  // Snap Layers
  private _snapLayers: any;
  // Thanh Cái Properties đang chỉnh sửa.
  private _fProperties: any = null;

  private _L: any;
  private _map: any;
  private _drawExtUtil: any;
  private _tranformDevice: any;

  private _layerEditSubcribe: any;
  private _layerSelectSubcribe: any;
  private _formValueChangeSubcribe: any;

  constructor(
    private _diagramService: DiagramService,
    private _fb: FormBuilder
  ) {
    this._map = _diagramService.map;
    this._L = _diagramService.L;
    this._thanhCaiLayers = _diagramService.thanhCaiLayers;
    this._snapLayers = _diagramService.snapLayers;
    this._drawExtUtil = _diagramService.drawExtUtil;
    this._tranformDevice = _diagramService.tranformDevice;
  }

  ngOnDestroy(): void {
    this._layerEditSubcribe.unsubscribe();
    this._layerSelectSubcribe.unsubscribe();
    this._formValueChangeSubcribe.unsubscribe();
    this._layerEditSubcribe = null;
    this._layerSelectSubcribe = null;
    this._formValueChangeSubcribe = null;
    this._fProperties = null;
  }

  ngOnInit(): void {
    this._layerEditSubcribe = this._diagramService.layerEdit.subscribe(
      (res) => {
        if (res === null) return;
        this._thanhCaiLayer = res.layer;
        // Bật tính năng drag cho layerEdit
        this._thanhCaiLayer.dragging.enable();
      }
    );

    this._layerSelectSubcribe = this._diagramService.layerSelect.subscribe(
      (res) => {
        // Dữ liệu nhận được khác null hoặc id nhận được === id hiện tại
        if (
          res === null ||
          (this._fProperties !== null &&
            res.layer.feature.properties.id === this._fProperties.id)
        ) {
          return;
        }
        // Reference
        this._thanhCaiLayer = res.layer;
        this._fProperties = { ...this._thanhCaiLayer.feature.properties };

        // Remove Thanh Cái Layer Selected
        this._removeLayer();

        // Clone Thanh Cái Layer
        let fTmp = this._L.polyline(this._thanhCaiLayer._latlngs).toGeoJSON();

        // this.fProperties.color = '#ff0000';
        this._fProperties.isEdit = true;

        fTmp.properties = this._fProperties;

        // Add Clone Thanh Cái Layer
        this._thanhCaiLayers.addData(fTmp);

        // Fill Data To Form Thanh Cái Detail
        this.roleForm.patchValue({
          rotate: this._fProperties.rotate,
          color: this._fProperties.color,
        });
      }
    );

    this._formValueChangeSubcribe = this.roleForm.valueChanges.subscribe(
      (res) => {
        // Remove Thanh Cái Layer Selected
        this._removeLayer();
        this._fProperties.id = uuidv4();
        if (this._fProperties.color !== res.color) {
          this._fProperties.color = res.color;
        }
        if (this._fProperties.rotate !== res.rotate) {
          const centerPoint = this._drawExtUtil.getCenterPoint(
            this._thanhCaiLayer
          );
          let angle = -parseInt(this._fProperties.rotate);
          // Xoay ngược lại trả về góc 0°
          this._thanhCaiLayer = this._tranformDevice.rotateThanhCai(
            this._thanhCaiLayer._latlngs,
            centerPoint,
            angle
          );
          // Xoay góc
          this._fProperties.rotate = res.rotate;
          angle = parseInt(this._fProperties.rotate);
          this._thanhCaiLayer = this._tranformDevice.rotateThanhCai(
            this._thanhCaiLayer._latlngs,
            centerPoint,
            angle
          );
        }
        let fTmp = this._L.polyline(this._thanhCaiLayer._latlngs).toGeoJSON();
        fTmp.properties = this._fProperties;
        this._thanhCaiLayers.addData(fTmp);
      }
    );
  }

  private _removeLayer(): void {
    // Remove Snap LayerId
    const properties = this._thanhCaiLayer.feature.properties;
    for (var i = 0; i < properties.snapLayerIds.length; i++) {
      this._snapLayers.removeLayer(properties.snapLayerIds[i]);
    }
    // Remove Thanh Cái Layer Selected
    this._thanhCaiLayers.removeLayer(this._thanhCaiLayer);
  }
}
