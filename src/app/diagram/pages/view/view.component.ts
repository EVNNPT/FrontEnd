import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DiagramService } from 'src/app/core';
//#region 'import leaflet'
require('leaflet');
require('leaflet-path-transform');
require('leaflet-geometryutil');
require('proj4leaflet');
require('../../../../libs/leaflet-draw/dist/leaflet.draw.js');
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
  private roleLayer: any;
  @ViewChild('drawer', { static: true }) private drawer!: MatDrawer;

  private initMap(): void {
    // Init map
    this.map = L.map('map', {
      center: [12.576009912063801, -4.768066406250001],
      zoom: 13,
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
    this.diagramService.getRoleData('234').subscribe((res) => {
      this.roleLayer.addData(res);
    });
    //#endregion

    // Draw events
    this.diagramService.drawEvents(L, this.map);
    // this.map.on(L.Draw.Event.CREATED, (e: any) => {
    //   const layer = e.layer;
    //   if (e.layerType === 'role') {
    //     const role = new L.polyline(layer._latlngs);
    //     let fRole = role.toGeoJSON();
    //     fRole.properties.id = uuidv4();
    //     this.roleLayer.addData(fRole);
    //   }
    // });

    this.map.on('click', (e: any) => {
      // console.log(this.drawer.toggle());
    });
    this.diagramService.layerEvents.subscribe((res) => {
      console.log(res);
    });
  }

  constructor(private diagramService: DiagramService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
