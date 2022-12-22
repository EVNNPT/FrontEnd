import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiagramService } from 'src/app/core';

@Component({
  selector: 'app-may-bien-ap-detail',
  templateUrl: './may-bien-ap-detail.component.html',
  styleUrls: ['./may-bien-ap-detail.component.css'],
})
export class MayBienApDetailComponent implements OnInit, OnDestroy {
  public mayBienApForm = this._fb.group({
    color: [''],
    rotate: [''],
  });
  // Máy Biến Áp Layer đang chỉnh sửa.
  private _mayBienApLayer: any;
  // Máy Biến Áp Properties Id đang chỉnh sửa.
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
        this._mayBienApLayer = res.layer;
        // Bật tính năng drag cho layerEdit
        this._mayBienApLayer.dragging.enable();
        const properties = this._mayBienApLayer.feature.properties;
        this._fPropertieId = properties.id;

        // Fill Data To Form Máy Biến Áp Detail
        this.mayBienApForm.patchValue({
          rotate: properties.rotate,
          color: properties.color,
        });
      }
    );

    this._formValueChangeSubcribe = this.mayBienApForm.valueChanges.subscribe(
      (res) => {
        const properties = this._mayBienApLayer.feature.properties;
        if (properties.color !== res.color) {
          // Cập nhật thuộc tính
          properties.color = res.color;
          // Cập nhật view
          this._mayBienApLayer.setStyle({
            color: properties.color,
          });
        }
        let changeLatLng = false;
        if (properties.rotate !== res.rotate) {
          const angleA = -parseInt(properties.rotate);
          properties.rotate = res.rotate;
          const angleB = parseInt(properties.rotate);
          this._diagramService.rotate(this._mayBienApLayer, angleA, angleB);
          changeLatLng = true;
        }
        if (changeLatLng) {
          this._diagramService.removeSnapLayer(this._mayBienApLayer);
          this._diagramService.addSnapLayer(this._mayBienApLayer);
        }
      }
    );
  }
}
