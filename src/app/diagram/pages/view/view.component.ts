import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DiagramService } from 'src/app/core';
import { MayBienApDetailComponent } from '../may-bien-ap-detail/may-bien-ap-detail.component';
import { RoleDetailComponent } from '../role-detail/role-detail.component';
import { ThanhCaiDetailComponent } from '../thanh-cai-detail/thanh-cai-detail.component';
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
  private deviceTypeNames: string[] = ['role', 'thanhCai', 'mayBienAp'];
  public deviceTypeName: string = '';
  @ViewChild('drawer', { static: true }) private drawer!: MatDrawer;

  @ViewChild('detailContainer', {
    read: ViewContainerRef,
  })
  detailContainer!: ViewContainerRef;

  componentRoleDetailRef!: ComponentRef<RoleDetailComponent>;
  componentThanhCaiDetailRef!: ComponentRef<ThanhCaiDetailComponent>;
  componentMayBienApDetailRef!: ComponentRef<MayBienApDetailComponent>;

  private initMap(): void {
    // Init map
    this.map = L.map('map', {
      center: [0, 0],
      zoom: 17,
      maxZoom: 25,
      minZoom: 10,
      // crs: L.CRS.EPSG4326,
    });

    // Title
    const tiles = L.tileLayer(this.imgBackgroundMap, {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://ftiglobal.com.vn/">FTI Global</a>',
    });
    tiles.addTo(this.map);

    this.diagramService.setMap(L, this.map);

    this.diagramService.mapAddControlAndLayers();

    this.diagramService.layerSelect.subscribe((res) => {
      if (res === null) {
        return;
      }
      // Hiển thị
      const layer = res.layer;
      const feature = layer.feature;
      const deviceTypeName = feature.properties.deviceTypeName;
      const found =
        this.deviceTypeNames.findIndex((ele) => ele === deviceTypeName) === -1
          ? false
          : true;

      this.detailContainer.clear();
      this.componentRoleDetailRef?.destroy();
      this.componentThanhCaiDetailRef?.destroy();
      this.componentMayBienApDetailRef?.destroy();

      if (deviceTypeName === 'role') {
        const roleDetail =
          this._resolver.resolveComponentFactory(RoleDetailComponent);
        this.componentRoleDetailRef =
          this.detailContainer.createComponent(roleDetail);
      } else if (deviceTypeName === 'thanhCai') {
        const thanhCaiDetail = this._resolver.resolveComponentFactory(
          ThanhCaiDetailComponent
        );
        this.componentThanhCaiDetailRef =
          this.detailContainer.createComponent(thanhCaiDetail);
      } else if (deviceTypeName === 'mayBienAp') {
        const mayBienApDetail = this._resolver.resolveComponentFactory(
          MayBienApDetailComponent
        );
        this.componentMayBienApDetailRef =
          this.detailContainer.createComponent(mayBienApDetail);
      }

      this.deviceTypeName = deviceTypeName;

      if (!this.drawer.opened && found) {
        this.drawer.open();
      } else if (this.drawer.opened && !found) {
        this.drawer.close();
      }
    });
  }

  constructor(
    private diagramService: DiagramService,
    private _resolver: ComponentFactoryResolver
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
