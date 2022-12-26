import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DuongDayDetail } from 'src/app/core/models/duong-day';
import { FileDinhKem } from 'src/app/core/models/file-dinh-kem';
import { ThietBiLienQuan } from 'src/app/core/models/thiet-bi-lq';
import { DuongDayService } from 'src/app/core/services/duong-day.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DialogThemMoiDtlqComponent } from '../../dialog/dialog-them-moi-dtlq/dialog-them-moi-dtlq.component';

@Component({
  selector: 'app-duong-day-detail',
  templateUrl: './duong-day-detail.component.html',
  styleUrls: ['./duong-day-detail.component.css'],
})
export class DuongDayDetailComponent implements OnInit {
  duongDayDetailForm = new FormGroup({
    MAPMIS: new FormControl(''),
    TENDUONGDAY: new FormControl(''),
    MADVQL: new FormControl(''),
    TENCONGTY: new FormControl(''),
    TRUYENTAIDIEN: new FormControl(''),
    CAPDA: new FormControl(''),
    SOHIEU: new FormControl(''),
    SOHUU: new FormControl(''),
    NGAYLAPDAT: new FormControl(new Date()),
    NGAYVH: new FormControl(new Date()),
    TUTRAM: new FormControl(''),
    TENTUTRAM: new FormControl(''),
    DENTRAM: new FormControl(''),
    TENDENTRAM: new FormControl(''),
    SOHIEUBANVE: new FormControl(''),
    SODODANHSO: new FormControl(''),
    MACH: new FormControl(''),
    COTTENHIENTHI: new FormControl(''),
    DAHIENTHITRENSD: new FormControl(false),
    HIENTHITEN: new FormControl(false),
    HOATDONG: new FormControl(false),
    TTHIENTAI: new FormControl(''),
    JSONGEO: new FormControl(''),
    MAUDONG: new FormControl(''),
    MAUCAT: new FormControl(''),
    DAUNOIDAU: new FormControl(''),
    DAUNOICUOI: new FormControl(''),
    GHICHU: new FormControl(''),
  });
  ELEMENT_DATA: FileDinhKem[] = [];
  ELEMENT_DATA_TBLQ: ThietBiLienQuan[] = [];
  displayedColumns: string[] = ['TENFILE', 'DUONGDAN', 'DOWNLOAD', 'DELETE'];
  displayedColumnsTBLQ: string[] = ['LOAITBKHAC', 'TENTHIETBI', 'DELETE'];
  dataSource: any;
  dataSourceTBLQ: any;
  formType: boolean = true;
  id: string = '';

  @ViewChild('MatPaginator') paginator!: MatPaginator;
  @ViewChild('MatPaginator_TBLQ') paginator_TBLQ!: MatPaginator;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _duongDayService: DuongDayService,
    private _toastService: ToastService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this._route.paramMap.subscribe((params) => {
      var id = params.get('id')!;
      this.id = id;
      if (id == 'add') {
        this.formType = false;
      } else {
        this._duongDayService.getDetailDuongDay(id).subscribe((client) => {
          this.formType = true;
          this.duongDayDetailForm.patchValue({
            MAPMIS: client.mapmis,
            TENDUONGDAY: client.tenduongday,
            MADVQL: client.madvql,
            TENCONGTY: client.tencongty,
            TRUYENTAIDIEN: client.truyentaidien,
            CAPDA: client.capda,
            SOHIEU: client.sohieu,
            SOHUU: client.sohuu,
            NGAYLAPDAT: new Date(client.ngaylapdat),
            NGAYVH: new Date(client.ngayvh),
            TUTRAM: client.tutram,
            TENTUTRAM: client.tentutram,
            DENTRAM: client.dentram,
            TENDENTRAM: client.tendentram,
            SOHIEUBANVE: client.sohieubanve,
            SODODANHSO: client.sododanhso,
            MACH: client.mach,
            COTTENHIENTHI: client.cottenhienthi,
            DAHIENTHITRENSD: client.dahienthitrensd == 'Y' ? true : false,
            HIENTHITEN: client.hienthiten == 'Y' ? true : false,
            HOATDONG: client.hoatdong == 'Y' ? true : false,
            TTHIENTAI: client.tthientai,
            JSONGEO: client.jsongeo,
            MAUDONG: client.maudong,
            MAUCAT: client.maucat,
            DAUNOIDAU: client.daunoidau,
            DAUNOICUOI: client.daunoicuoi,
            GHICHU: client.ghichu,
          });
          // this.getDataTestService.listFDK().subscribe((client) => {
          //   client.forEach((element) => {
          //     if (element.MADT == id && element.MALOAITHIETBI == "DUONGDAY") {
          //       if (client.length < 5) {
          //         for (var i = 0; i < client.length; i++) {
          //           this.ELEMENT_DATA.push(client[i]);
          //         }
          //       } else {
          //         for (var i = 0; i < 5; i++) {
          //           this.ELEMENT_DATA.push(client[i]);
          //         }
          //       }
          //       this.paginator.length = client.length;
          //       this.dataSource = new MatTableDataSource<FileDinhKem>(
          //         this.ELEMENT_DATA
          //       );
          //     }
          //   });
          // });
          // this.getDataTestService.listTBLQ().subscribe((client) => {
          //   client.forEach((element) => {
          //     if (element.MADUONGDAY == id) {
          //       if (client.length < 5) {
          //         for (var i = 0; i < client.length; i++) {
          //           this.ELEMENT_DATA_TBLQ.push(client[i]);
          //         }
          //       } else {
          //         for (var i = 0; i < 5; i++) {
          //           this.ELEMENT_DATA_TBLQ.push(client[i]);
          //         }
          //       }
          //       this.paginator_TBLQ.length = client.length;
          //       this.dataSourceTBLQ = new MatTableDataSource<ThietBiLienQuan>(
          //         this.ELEMENT_DATA_TBLQ
          //       );
          //     }
          //   });
          // })
          this.duongDayDetailForm.controls['MAPMIS'].disable();
        });
      }
    });
  }

  changePagination(event: any) {
    // this._route.paramMap.subscribe((params) => {
    //   var id = params.get('id')!;
    //   this.getDataTestService.listFDK().subscribe((client) => {
    //     client.forEach((element) => {
    //       if (element.MADT == id && element.MALOAITHIETBI == "DUONGDAY") {
    //         this.ELEMENT_DATA = [];
    //         var start = event.pageIndex * event.pageSize;
    //         var limit = start + event.pageSize;
    //         for (var i = start; i < limit; i++) {
    //           if (i < client.length) {
    //             this.ELEMENT_DATA.push(client[i]);
    //           }
    //         }
    //         this.paginator.length = client.length;
    //         this.dataSource = new MatTableDataSource<FileDinhKem>(
    //           this.ELEMENT_DATA
    //         );
    //       }
    //     });
    //   });
    // });
  }

  changePagination_TBLQ(event: any) {
    // this._route.paramMap.subscribe((params) => {
    //   var id = params.get('id')!;
    //   this.getDataTestService.listTBLQ().subscribe((client) => {
    //     client.forEach((element) => {
    //       if (element.MADUONGDAY == id) {
    //         this.ELEMENT_DATA_TBLQ = [];
    //         var start = event.pageIndex * event.pageSize;
    //         var limit = start + event.pageSize;
    //         for (var i = start; i < limit; i++) {
    //           if (i < client.length) {
    //             this.ELEMENT_DATA_TBLQ.push(client[i]);
    //           }
    //         }
    //         this.paginator_TBLQ.length = client.length;
    //         this.dataSourceTBLQ = new MatTableDataSource<ThietBiLienQuan>(
    //           this.ELEMENT_DATA_TBLQ
    //         );
    //       }
    //     });
    //   });
    // });
  }

  onClickDetail(event: any) {
    if (event.DUONGDAN == null || event.DUONGDAN == '') {
      return;
    }
    var linkFile = event.DUONGDAN;
    window.open(linkFile);
  }

  onClickAddOrUpdate() {
    if (this.formType == false) {
      console.log('Add');
      var item = this.duongDayDetailForm.getRawValue();
      var itemAdd: DuongDayDetail = new DuongDayDetail();
      itemAdd.Mapmis = item.MAPMIS;
      itemAdd.Tenduongday = item.TENDUONGDAY;
      itemAdd.Madvql = item.MADVQL;
      itemAdd.Tencongty = item.TENCONGTY;
      itemAdd.Truyentaidien = item.TRUYENTAIDIEN;
      itemAdd.Capda = item.CAPDA;
      itemAdd.Sohieu = item.SOHIEU;
      itemAdd.Sohuu = item.SOHUU;
      itemAdd.Ngaylapdat = item.NGAYLAPDAT;
      itemAdd.Ngayvh = item.NGAYVH;
      itemAdd.Tutram = item.TUTRAM;
      itemAdd.Tentutram = item.TENTUTRAM;
      itemAdd.Dentram = item.DENTRAM;
      itemAdd.Tendentram = item.TENDENTRAM;
      itemAdd.Sohieubanve = item.SOHIEUBANVE;
      itemAdd.Sododanhso = item.SODODANHSO;
      itemAdd.Mach = item.MACH;
      itemAdd.Cottenhienthi = item.COTTENHIENTHI;
      itemAdd.Dahienthitrensd = item.DAHIENTHITRENSD == true ? 'Y' : 'N';
      itemAdd.Hienthiten = item.HIENTHITEN == true ? 'Y' : 'N';
      itemAdd.Hoatdong = item.HOATDONG == true ? 'Y' : 'N';
      itemAdd.Tthientai = item.TTHIENTAI;
      itemAdd.Maudong = item.MAUDONG;
      itemAdd.Maucat = item.MAUCAT;
      itemAdd.Daunoidau = item.DAUNOIDAU;
      itemAdd.Daunoicuoi = item.DAUNOICUOI;
      itemAdd.Ghichu = item.GHICHU;
      this._duongDayService.addDuongDay(itemAdd).subscribe(
        (result) => {
          if (result.fail) {
            this._toastService.show(result.message, {
              classname: 'bg-danger text-light',
              delay: 5000,
              header: 'Xảy ra lỗi',
            });
          } else {
            this._toastService.show(result.message, {
              classname: 'bg-success text-light',
              delay: 5000,
              header: 'Thông báo',
            });
          }
        },
        (err) => {
          this._toastService.show(err, {
            classname: 'bg-danger text-light',
            delay: 5000,
            header: 'Xảy ra lỗi',
          });
        }
      );
    } else {
      console.log('Update');
      var item = this.duongDayDetailForm.getRawValue();
      var itemAdd: DuongDayDetail = new DuongDayDetail();
      itemAdd.Mapmis = item.MAPMIS;
      itemAdd.Tenduongday = item.TENDUONGDAY;
      itemAdd.Madvql = item.MADVQL;
      itemAdd.Tencongty = item.TENCONGTY;
      itemAdd.Truyentaidien = item.TRUYENTAIDIEN;
      itemAdd.Capda = item.CAPDA;
      itemAdd.Sohieu = item.SOHIEU;
      itemAdd.Sohuu = item.SOHUU;
      itemAdd.Ngaylapdat = item.NGAYLAPDAT;
      itemAdd.Ngayvh = item.NGAYVH;
      itemAdd.Tutram = item.TUTRAM;
      itemAdd.Tentutram = item.TENTUTRAM;
      itemAdd.Dentram = item.DENTRAM;
      itemAdd.Tendentram = item.TENDENTRAM;
      itemAdd.Sohieubanve = item.SOHIEUBANVE;
      itemAdd.Sododanhso = item.SODODANHSO;
      itemAdd.Mach = item.MACH;
      itemAdd.Cottenhienthi = item.COTTENHIENTHI;
      itemAdd.Dahienthitrensd = item.DAHIENTHITRENSD == true ? 'Y' : 'N';
      itemAdd.Hienthiten = item.HIENTHITEN == true ? 'Y' : 'N';
      itemAdd.Hoatdong = item.HOATDONG == true ? 'Y' : 'N';
      itemAdd.Tthientai = item.TTHIENTAI;
      itemAdd.Maudong = item.MAUDONG;
      itemAdd.Maucat = item.MAUCAT;
      itemAdd.Daunoidau = item.DAUNOIDAU;
      itemAdd.Daunoicuoi = item.DAUNOICUOI;
      itemAdd.Ghichu = item.GHICHU;
      this._duongDayService.updateDuongDay(itemAdd).subscribe(
        (result) => {
          if (result.fail) {
            this._toastService.show(result.message, {
              classname: 'bg-danger text-light',
              delay: 5000,
              header: 'Xảy ra lỗi',
            });
          } else {
            this._toastService.show(result.message, {
              classname: 'bg-success text-light',
              delay: 5000,
              header: 'Thông báo',
            });
          }
        },
        (err) => {
          this._toastService.show(err, {
            classname: 'bg-danger text-light',
            delay: 5000,
            header: 'Xảy ra lỗi',
          });
        }
      );
    }
  }

  onClickGoBack() {
    this._router.navigate(['/admin/duong-day-list']);
  }

  openDialog() {
    // const dialogRef = this.dialog.open(DialogThemMoiDtlqComponent, {data: { id: this.id },});
    // dialogRef.afterClosed().subscribe(result => {
    //   this.ELEMENT_DATA_TBLQ = [];
    //   this.getDataTestService.listTBLQ().subscribe((client) => {
    //     client.forEach((element) => {
    //       if (element.MADUONGDAY == this.id) {
    //         if (client.length < 5) {
    //           for (var i = 0; i < client.length; i++) {
    //             this.ELEMENT_DATA_TBLQ.push(client[i]);
    //           }
    //         } else {
    //           for (var i = 0; i < 5; i++) {
    //             this.ELEMENT_DATA_TBLQ.push(client[i]);
    //           }
    //         }
    //         this.paginator_TBLQ.length = client.length;
    //         this.dataSourceTBLQ = new MatTableDataSource<ThietBiLienQuan>(
    //           this.ELEMENT_DATA_TBLQ
    //         );
    //       }
    //     });
    //   })
    // });
  }

  openDiagram() {
    this._router.navigate(['/diagram/view']);
  }
}
