import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiagramService } from 'src/app/core';

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
  // Role Layer đang chỉnh sửa.
  private _roleLayer: any;
  // Role Properties Id đang chỉnh sửa.
  private _fPropertieId: any = null;

  private _layerSelectSubcribe: any;
  private _formValueChangeSubcribe: any;

  constructor(
    private _diagramService: DiagramService,
    private _fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this._layerSelectSubcribe.unsubscribe();
    this._formValueChangeSubcribe.unsubscribe();
    this._layerSelectSubcribe = null;
    this._formValueChangeSubcribe = null;
  }

  ngOnInit(): void {
    this._layerSelectSubcribe = this._diagramService.layerSelect.subscribe(
      (res) => {
        if (
          res === null ||
          (this._fPropertieId !== null &&
            res.layer.feature.properties.id === this._fPropertieId)
        ) {
          return;
        }
        this._roleLayer = res.layer;
        // Bật tính năng drag cho layerEdit
        this._roleLayer.dragging.enable();
        const properties = this._roleLayer.feature.properties;
        this._fPropertieId = properties.id;

        // Fill Data To Form Máy Biến Áp Detail
        this.roleForm.patchValue({
          rotate: properties.rotate,
          color: properties.color,
        });
      }
    );

    this._formValueChangeSubcribe = this.roleForm.valueChanges.subscribe(
      (res) => {
        const properties = this._roleLayer.feature.properties;
        if (properties.color !== res.color) {
          // Cập nhật thuộc tính
          properties.color = res.color;
          // Cập nhật view
          this._roleLayer.setStyle({
            color: properties.color,
          });
        }
        let changeLatLng = false;
        if (properties.rotate !== res.rotate) {
          const angleA = -parseInt(properties.rotate);
          properties.rotate = res.rotate;
          const angleB = parseInt(properties.rotate);
          this._diagramService.rotate(this._roleLayer, angleA, angleB);
          changeLatLng = true;
        }
        if (changeLatLng) {
          this._diagramService.removeSnapLayer(this._roleLayer);
          this._diagramService.addSnapLayer(this._roleLayer);
        }
      }
    );
  }
}
