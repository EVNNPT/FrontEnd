import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiagramService } from 'src/app/core';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.css'],
})
export class RoleDetailComponent implements OnInit {
  public roleForm = this.fb.group({
    roleName: [''],
    color: [''],
    rotate: [''],
  });
  private roleSelectOrigin: any;
  private roleSelectEdit: any;
  private roleLayer: any;
  private fRoleEdit: any;
  private L: any;
  private map: any;

  constructor(
    private diagramService: DiagramService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.diagramService.featureSelected.subscribe((res) => {
      if (res === null) {
        return;
      }
      this.map = res.map;
      this.L = res.L;
      this.roleLayer = res.layer;
      this.roleSelectOrigin = res.selected;
      this.map.removeLayer(this.roleSelectOrigin);

      const properties = this.roleSelectOrigin.feature.properties;
      this.fRoleEdit = this.L.polyline(
        this.roleSelectOrigin._latlngs
      ).toGeoJSON();

      this.fRoleEdit.properties.isEdit = true;
      this.fRoleEdit.properties.color = properties.color;
      this.fRoleEdit.properties.rotate = properties.rotate;

      this.roleSelectEdit = this.roleLayer.addData(this.fRoleEdit);

      this.roleForm.patchValue({
        rotate: properties.rotate,
        color: properties.color,
      });
    });

    this.roleForm.valueChanges.subscribe((res) => {
      const properties = this.fRoleEdit.properties;
      if (properties.color !== res.color) {
        this.roleSelectEdit.setStyle({ color: res.color });
        this.fRoleEdit.properties.color = res.color;
      }
      if (properties.rotate !== res.rotate) {
        // this.map.removeLayer(this.roleSelectEdit);

        const deviceTranform = new this.L.TransfromDevice(this.map);
        const midLatLng = new this.L.latLng(
          this.roleSelectOrigin.feature.properties.midLat,
          this.roleSelectOrigin.feature.properties.midLng
        );

        console.log(this.fRoleEdit.geometry.coordinates);

        this.L.marker(midLatLng).addTo(this.map);
        this.fRoleEdit = deviceTranform
          .rotateRole(this.fRoleEdit.geometry.coordinates, midLatLng, 90)
          .toGeoJSON();
        console.log(this.fRoleEdit);

        this.fRoleEdit.properties.isEdit = true;
        this.fRoleEdit.properties.color = res.color;
        this.fRoleEdit.properties.rotate = res.rotate;

        this.roleSelectEdit = this.roleLayer.addData(this.fRoleEdit);
      }
      // console.log(this.roleSelectEdit);
      // this.roleSelectEdit.setStyle({ color: res.color });
      // this.roleSelectEdit.setStyle({ color: res.color });
      // const deviceTranform = new this.L.TransfromDevice(this.map);
      // const midLatLng = new this.L.latLng(
      //   this.roleSelectOrigin.feature.properties.midLat,
      //   this.roleSelectOrigin.feature.properties.midLng
      // );
      // const rRole = deviceTranform.rotateRole(
      //   this.roleSelectEdit._latlngs,
      //   midLatLng,
      //   90
      // );
      // this.map.removeLayer(this.roleSelectEdit);
      // this.roleSelectEdit = rRole.addTo(this.map);
      // console.log(rRole);
      // const angle = res.rotate;
    });
  }
}
