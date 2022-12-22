import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiagramService } from 'src/app/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.css'],
})
export class RoleDetailComponent implements OnInit, OnDestroy {
  public roleForm = this._fb.group({
    color: [''],
    rotate: [''],
  });
  // Layer Group Role.
  private _roleLayers: any;
  // Role Layer đang chỉnh sửa.
  private _roleLayer: any;
  // Snap Layers
  private _snapLayers: any;
  // Role Properties đang chỉnh sửa.
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
    this._roleLayers = _diagramService.roleLayers;
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
        this._roleLayer = res.layer;
        // Bật tính năng drag cho layerEdit
        this._roleLayer.dragging.enable();
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
        this._roleLayer = res.layer;
        this._fProperties = { ...this._roleLayer.feature.properties };

        // Remove Role Layer Selected
        this._removeLayer();

        // Clone Role Layer
        let fTmp = this._L.polyline(this._roleLayer._latlngs).toGeoJSON();

        // this.fProperties.color = '#ff0000';
        this._fProperties.isEdit = true;

        fTmp.properties = this._fProperties;

        // Add Clone Role Layer
        this._roleLayers.addData(fTmp);

        // Fill Data To Form Role Detail
        this.roleForm.patchValue({
          rotate: this._fProperties.rotate,
          color: this._fProperties.color,
        });
      }
    );

    this._formValueChangeSubcribe = this.roleForm.valueChanges.subscribe(
      (res) => {
        // Remove Role Layer Selected
        this._removeLayer();
        // Create Role Layer
        this._fProperties.id = uuidv4();
        if (this._fProperties.color !== res.color) {
          this._fProperties.color = res.color;
        }
        if (this._fProperties.rotate !== res.rotate) {
          const centerPoint = this._drawExtUtil.getCenterPoint(this._roleLayer);
          let angle = -parseInt(this._fProperties.rotate);
          // Xoay ngược lại trả về góc 0°
          this._roleLayer = this._tranformDevice.rotateRole(
            this._roleLayer._latlngs,
            centerPoint,
            angle
          );
          // Xoay góc
          this._fProperties.rotate = res.rotate;
          angle = parseInt(this._fProperties.rotate);
          this._roleLayer = this._tranformDevice.rotateRole(
            this._roleLayer._latlngs,
            centerPoint,
            angle
          );
        }
        let fTmp = this._L.polyline(this._roleLayer._latlngs).toGeoJSON();
        fTmp.properties = this._fProperties;
        this._roleLayers.addData(fTmp);
      }
    );
  }

  private _removeLayer(): void {
    this._roleLayer.redraw();
    // Remove Snap LayerId
    const properties = this._roleLayer.feature.properties;
    for (var i = 0; i < properties.snapLayerIds.length; i++) {
      this._snapLayers.removeLayer(properties.snapLayerIds[i]);
    }
    // Remove Role Layer Selected
    this._roleLayers.removeLayer(this._roleLayer);
  }
}
