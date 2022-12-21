import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiagramService } from 'src/app/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-may-bien-ap-detail',
  templateUrl: './may-bien-ap-detail.component.html',
  styleUrls: ['./may-bien-ap-detail.component.css'],
})
export class MayBienApDetailComponent implements OnInit, OnDestroy {
  public mayBienApForm = this.fb.group({
    color: [''],
    rotate: [''],
  });
  // Layer Group Máy Biến Áp.
  private _mayBienApLayers: any;
  // Máy Biến Áp Layer đang chỉnh sửa.
  private _mayBienApLayer: any;
  // Snap Layers
  private _snapLayers: any;
  // Máy Biến Áp Properties đang chỉnh sửa.
  private _fProperties: any = null;

  private _L: any;
  private _map: any;
  private _drawExtUtil: any;
  private _tranformDevice: any;

  private _mapDataSubcribe: any;
  private _layerEditSubcribe: any;
  private _layerSelectSubcribe: any;
  private _formValueChangeSubcribe: any;

  constructor(
    private diagramService: DiagramService,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this._mapDataSubcribe.unsubscribe();
    this._layerEditSubcribe.unsubscribe();
    this._layerSelectSubcribe.unsubscribe();
    this._formValueChangeSubcribe.unsubscribe();
    this._mapDataSubcribe = null;
    this._layerEditSubcribe = null;
    this._layerSelectSubcribe = null;
    this._formValueChangeSubcribe = null;
    this._snapLayers = null;
    this._drawExtUtil = null;
    this._tranformDevice = null;
    this._fProperties = null;
  }

  ngOnInit(): void {
    this._mapDataSubcribe = this.diagramService.mapData.subscribe((res) => {
      if (res === null) return;
      this._mayBienApLayers = res.mayBienApLayers;
      this._map = res.map;
      this._L = res.L;
      this._snapLayers = res.snapLayers;
      this._drawExtUtil = res.drawExtUtil;
      this._tranformDevice = res.tranformDevice;
    });

    this._layerEditSubcribe = this.diagramService.layerEdit.subscribe((res) => {
      if (res === null) return;
      this._mayBienApLayer = res.layer;
      // Bật tính năng drag cho layerEdit
      this._mayBienApLayer.dragging.enable();
    });

    this._layerSelectSubcribe = this.diagramService.layerSelect.subscribe(
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
        this._mayBienApLayer = res.layer;
        this._fProperties = { ...this._mayBienApLayer.feature.properties };

        // Remove Máy Biến Áp Layer Selected
        this._removeLayer();

        // Clone Máy Biến Áp Layer
        let fTmp = this._L.polyline(this._mayBienApLayer._latlngs).toGeoJSON();

        // this.fProperties.color = '#ff0000';
        this._fProperties.isEdit = true;

        fTmp.properties = this._fProperties;

        // Add Clone Máy Biến Áp Layer
        this._mayBienApLayers.addData(fTmp);

        // Fill Data To Form Máy Biến Áp Detail
        this.mayBienApForm.patchValue({
          rotate: this._fProperties.rotate,
          color: this._fProperties.color,
        });
      }
    );

    this._formValueChangeSubcribe = this.mayBienApForm.valueChanges.subscribe(
      (res) => {
        // Remove Máy Biến Áp Layer Selected
        this._removeLayer();

        this._fProperties.id = uuidv4();
        if (this._fProperties.color !== res.color) {
          this._fProperties.color = res.color;
        }
        if (this._fProperties.rotate !== res.rotate) {
          const centerPoint = this._drawExtUtil.getCenterPoint(
            this._mayBienApLayer
          );
          let angle = -parseInt(this._fProperties.rotate);
          // Xoay ngược lại trả về góc 0°
          this._mayBienApLayer = this._tranformDevice.rotateMayBienAp(
            this._mayBienApLayer._latlngs,
            centerPoint,
            angle
          );
          // Xoay góc
          this._fProperties.rotate = res.rotate;
          angle = parseInt(this._fProperties.rotate);
          this._mayBienApLayer = this._tranformDevice.rotateMayBienAp(
            this._mayBienApLayer._latlngs,
            centerPoint,
            angle
          );
        }
        let fTmp = this._L.polyline(this._mayBienApLayer._latlngs).toGeoJSON();
        fTmp.properties = this._fProperties;
        this._mayBienApLayers.addData(fTmp);
      }
    );
  }

  private _removeLayer(): void {
    // Remove Snap LayerId
    const properties = this._mayBienApLayer.feature.properties;
    for (var i = 0; i < properties.snapLayerIds.length; i++) {
      this._snapLayers.removeLayer(properties.snapLayerIds[i]);
    }
    // Remove Máy Biến Áp Layer Selected
    this._mayBienApLayers.removeLayer(this._mayBienApLayer);
  }
}
