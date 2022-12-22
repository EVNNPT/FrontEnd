import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiagramService } from 'src/app/core';

@Component({
  selector: 'app-thanh-cai-detail',
  templateUrl: './thanh-cai-detail.component.html',
  styleUrls: ['./thanh-cai-detail.component.css'],
})
export class ThanhCaiDetailComponent implements OnInit, OnDestroy {
  public thanhCaiForm = this._fb.group({
    color: [''],
    rotate: [''],
  });
  // Thanh Cái Layer đang chỉnh sửa.
  private _thanhCaiLayer: any;
  // Thanh Cái Properties Id đang chỉnh sửa.
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
        this._thanhCaiLayer = res.layer;
        // Bật tính năng drag cho layerEdit
        this._thanhCaiLayer.dragging.enable();

        const properties = this._thanhCaiLayer.feature.properties;
        this._fPropertieId = properties.id;

        // Fill Data To Form Thanh Cái Detail
        this.thanhCaiForm.patchValue({
          rotate: properties.rotate,
          color: properties.color,
        });
      }
    );

    this._formValueChangeSubcribe = this.thanhCaiForm.valueChanges.subscribe(
      (res) => {
        const properties = this._thanhCaiLayer.feature.properties;
        if (properties.color !== res.color) {
          // Cập nhật thuộc tính
          properties.color = res.color;
          // Cập nhật view
          this._thanhCaiLayer.setStyle({
            color: properties.color,
          });
        }
        let changeLatLng = false;
        if (properties.rotate !== res.rotate) {
          const angleA = -parseInt(properties.rotate);
          properties.rotate = res.rotate;
          const angleB = parseInt(properties.rotate);
          this._diagramService.rotate(this._thanhCaiLayer, angleA, angleB);
          changeLatLng = true;
        }
        if (changeLatLng) {
          this._diagramService.removeSnapLayer(this._thanhCaiLayer);
          this._diagramService.addSnapLayer(this._thanhCaiLayer);
        }
      }
    );
  }
}
