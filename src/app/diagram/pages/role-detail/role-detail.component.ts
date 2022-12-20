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
  public roleForm = this.fb.group({
    color: [''],
    rotate: [''],
  });
  // Layer Group Role.
  private _roleLayers: any;
  // Role Layer đang chỉnh sửa.
  private _roleLayer: any;
  // Role Properties đang chỉnh sửa.
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
    this._drawExtUtil = null;
    this._tranformDevice = null;
    this._fProperties = null;
  }

  ngOnInit(): void {
    this._mapDataSubcribe = this.diagramService.mapData.subscribe((res) => {
      if (res === null) return;
      this._roleLayers = res.roleLayers;
      this._map = res.map;
      this._L = res.L;
    });

    this._layerEditSubcribe = this.diagramService.layerEdit.subscribe((res) => {
      if (res === null) return;
      this._roleLayer = res.layer;
      // Bật tính năng drag cho layerEdit
      this._roleLayer.dragging.enable();
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
        this._roleLayer = res.layer;
        this._fProperties = { ...this._roleLayer.feature.properties };
        this._drawExtUtil = new this._L.DrawExtUtil(this._map);
        this._tranformDevice = new this._L.TransfromDevice(this._map);

        // Remove Role Layer Selected
        this._roleLayers.removeLayer(this._roleLayer);

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
        this._roleLayers.removeLayer(this._roleLayer);
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
}
