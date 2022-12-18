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
  private roleLayers: any;
  private roleLayer: any;
  private roleLayerClone: any;
  private fRoleClone: any;
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
      // Reference
      this.map = res.map;
      this.L = res.L;
      this.roleLayers = res.layer;
      this.roleLayer = res.selected;

      // Remove Role Layer Selected
      this.roleLayers.removeLayer(this.roleLayer);

      // Clone Role Layer
      const properties = this.roleLayer.feature.properties;

      this.fRoleClone = this.L.polyline(
        this.roleLayer._latlngs
      ).toGeoJSON();

      this.fRoleClone.properties = {...properties}

      this.fRoleClone.properties.isEdit = true
      this.fRoleClone.properties.color = '#ff0000';

      console.log(this.fRoleClone)

      // Add Clone Role Layer
      this.roleLayerClone = this.roleLayers.addData(this.fRoleClone);

      console.log(this.roleLayerClone)

      // Fill Data To Form Role Detail

      const roleCloneProperties = this.fRoleClone.properties;
      this.roleForm.patchValue({
        rotate: roleCloneProperties.rotate,
        color: roleCloneProperties.color,
      });
    });

    this.roleForm.valueChanges.subscribe((res) => {
      const properties = this.fRoleClone.properties;
      // if (properties.color !== res.color) {
      //   this.roleSelectEdit.setStyle({ color: res.color });
      //   this.fRoleEdit.properties.color = res.color;
      // }
      // if (properties.rotate !== res.rotate) {
      //   // this.map.removeLayer(this.roleSelectEdit);

      //   const deviceTranform = new this.L.TransfromDevice(this.map);
      //   const midLatLng = new this.L.latLng(
      //     this.roleSelectOrigin.feature.properties.midLat,
      //     this.roleSelectOrigin.feature.properties.midLng
      //   );

      //   console.log(this.fRoleEdit.geometry.coordinates);

      //   this.L.marker(midLatLng).addTo(this.map);
      //   this.fRoleEdit = deviceTranform
      //     .rotateRole(this.fRoleEdit.geometry.coordinates, midLatLng, 90)
      //     .toGeoJSON();
      //   console.log(this.fRoleEdit);

      //   this.fRoleEdit.properties.isEdit = true;
      //   this.fRoleEdit.properties.color = res.color;
      //   this.fRoleEdit.properties.rotate = res.rotate;

      //   this.roleSelectEdit = this.roleLayer.addData(this.fRoleEdit);
      // }
    });
  }
}
