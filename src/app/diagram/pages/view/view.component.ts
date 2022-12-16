import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DiagramService } from 'src/app/core';
//#region 'import leaflet'
require('leaflet');
require('leaflet-path-transform');
require('leaflet-geometryutil');
require('proj4leaflet');
require('../../../../libs/leaflet-extension/leaflet.extension.js');
require('../../../../libs/leaflet-draw/leaflet.draw.js');

declare let L: any;
//#endregion

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements AfterViewInit {
  private map: any;
  private imgBackgroundMap = '/assets/images/white_bkg.png';
  private deviceTypeNames: string[] = ['role'];
  public deviceTypeName: string = '';
  private roleLayer: any;
  private thanhCaiLayer: any;
  private mayBienApLayer: any;
  @ViewChild('drawer', { static: true }) private drawer!: MatDrawer;

  private initMap(): void {
    // Init map
    this.map = L.map('map', {
      center: [0, 0],
      zoom: 18,
      maxZoom: 20,
      minZoom: 13,
    });

    // Title
    const tiles = L.tileLayer(this.imgBackgroundMap, {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://ftiglobal.com.vn/">FTI Global</a>',
    });
    tiles.addTo(this.map);
    // Draw control
    this.diagramService.initDrawControl(L, this.map);
    //#region "Layer"
    // Role
    this.roleLayer = this.diagramService.initRoleLayer(L, this.map);
    // this.diagramService.getRoleData('234').subscribe((res) => {
    //   this.roleLayer.addData(res);
    // });
    //#endregion

    //#region "Thanh cái"
    this.thanhCaiLayer = this.diagramService.initThanhCaiLayer(L, this.map);
    //#endregion

    //#region "Máy biến áp"
    this.mayBienApLayer = this.diagramService.initMayBienApLayer(L, this.map);
    //#endregion

    // Draw events
    this.diagramService.drawEvents(L, this.map);

    this.map.on('click', (e: any) => {
      // console.log(this.drawer.toggle());
    });

    this.diagramService.featureSelected.subscribe((res) => {
      if (res === null) {
        return;
      }
      // Hiển thị
      const feature = res.selected.feature;
      this.deviceTypeName = feature.properties.deviceTypeName;
      const found = this.deviceTypeNames.find(
        (ele) => ele === this.deviceTypeName
      );
      if (!this.drawer.opened && found) {
        this.drawer.open();
      } else if (this.drawer.opened && !found) {
        this.drawer.close();
      }
    });
  }

  constructor(private diagramService: DiagramService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
