import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDinhKem } from 'src/app/core/models/file-dinh-kem';
import { ThanhCaiDetail } from 'src/app/core/models/thanh-cai';
import { GetDataTestService } from 'src/app/core/services/get-data-test.service';
import { ThanhCaiService } from 'src/app/core/services/thanh-cai.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-thanh-cai-detail',
  templateUrl: './thanh-cai-detail.component.html',
  styleUrls: ['./thanh-cai-detail.component.css'],
})
export class ThanhCaiDetailComponent implements OnInit {
  thanhCaiDetailForm = new FormGroup({
    MAPMIS: new FormControl(''),
    TENTHANHCAI: new FormControl(''),
    MADVQL: new FormControl(''),
    TENCONGTY: new FormControl(''),
    TRUYENTAIDIEN: new FormControl(''),
    CAPDA: new FormControl(''),
    SOHIEU: new FormControl(''),
    SOHUU: new FormControl(''),
    NGAYLAPDAT: new FormControl(new Date()),
    NGAYVH: new FormControl(new Date()),
    THUOCTRAM: new FormControl(''),
    TENTRAM: new FormControl(''),
    SOHIEUBANVE: new FormControl(''),
    SODODANHSO: new FormControl(''),
    COTTENHIENTHI: new FormControl(''),
    DAHIENTHITRENSD: new FormControl(false),
    HIENTHITEN: new FormControl(false),
    HOATDONG: new FormControl(false),
    TTHIENTAI: new FormControl(''),
    JSONGEO: new FormControl(''),
    MAUDONG: new FormControl(''),
    MAUCAT: new FormControl(''),
    GHICHU: new FormControl(''),
  });
  ELEMENT_DATA: FileDinhKem[] = [];
  displayedColumns: string[] = ['TENFILE', 'DUONGDAN', 'DOWNLOAD', 'DELETE'];
  dataSource: any;
  formType: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _thanhCaiService: ThanhCaiService,
    private _toastService: ToastService
  ) {}

  ngOnInit() {
    this._route.paramMap.subscribe((params) => {
      var id = params.get('id')!;
      if (id == 'add') {
        this.formType = false;
      } else {
        this._thanhCaiService.getDetailThanhCai(id).subscribe((client) => {
          this.formType = true;
          this.thanhCaiDetailForm.patchValue({
            MAPMIS: client.mapmis,
            TENTHANHCAI: client.tenthanhcai,
            MADVQL: client.madvql,
            TENCONGTY: client.tencongty,
            TRUYENTAIDIEN: client.truyentaidien,
            CAPDA: client.capda,
            SOHIEU: client.sohieu,
            SOHUU: client.sohuu,
            NGAYLAPDAT: new Date(client.ngaylapdat),
            NGAYVH: new Date(client.ngayvh),
            THUOCTRAM: client.thuoctram,
            TENTRAM: client.tentram,
            SOHIEUBANVE: client.sohieubanve,
            SODODANHSO: client.sododanhso,
            COTTENHIENTHI: client.cottenhienthi,
            DAHIENTHITRENSD: client.dahienthitrensd == 'Y' ? true : false,
            HIENTHITEN: client.hienthiten == 'Y' ? true : false,
            HOATDONG: client.hoatdong == 'Y' ? true : false,
            TTHIENTAI: client.tthientai,
            JSONGEO: client.jsongeo,
            MAUDONG: client.maudong,
            MAUCAT: client.maucat,
            GHICHU: client.ghichu,
          });
          // this.getDataTestService.listFDK().subscribe((client) => {
          //   client.forEach(element => {
          //     if (element.MADT == id && element.MALOAITHIETBI == "TC") {
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
          //       this.dataSource = new MatTableDataSource<FileDinhKem>(this.ELEMENT_DATA);
          //     }
          //   });
          // });
          this.thanhCaiDetailForm.controls['MAPMIS'].disable();
        });
      }
    });
  }

  changePagination(event: any) {
    // this._route.paramMap.subscribe((params) => {
    //   var id = params.get('id')!;
    //   this.getDataTestService.listFDK().subscribe((client) => {
    //     client.forEach((element) => {
    //       if (element.MADT == id && element.MALOAITHIETBI == "TC") {
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
      var item = this.thanhCaiDetailForm.getRawValue();
      var itemAdd: ThanhCaiDetail = new ThanhCaiDetail();
      itemAdd.Mapmis = item.MAPMIS;
      itemAdd.Tenthanhcai = item.TENTHANHCAI;
      itemAdd.Madvql = item.MADVQL;
      itemAdd.Tencongty = item.TENCONGTY;
      itemAdd.Truyentaidien = item.TRUYENTAIDIEN;
      itemAdd.Capda = item.CAPDA;
      itemAdd.Sohieu = item.SOHIEU;
      itemAdd.Sohuu = item.SOHUU;
      itemAdd.Ngaylapdat = item.NGAYLAPDAT;
      itemAdd.Ngayvh = item.NGAYVH;
      itemAdd.Thuoctram = item.THUOCTRAM;
      itemAdd.Tentram = item.TENTRAM;
      itemAdd.Sohieubanve = item.SOHIEUBANVE;
      itemAdd.Sododanhso = item.SODODANHSO;
      itemAdd.Cottenhienthi = item.COTTENHIENTHI;
      itemAdd.Dahienthitrensd = item.DAHIENTHITRENSD == true ? 'Y' : 'N';
      itemAdd.Hienthiten = item.HIENTHITEN == true ? 'Y' : 'N';
      itemAdd.Hoatdong = item.HOATDONG == true ? 'Y' : 'N';
      itemAdd.Tthientai = item.TTHIENTAI;
      itemAdd.Jsongeo = item.JSONGEO;
      itemAdd.Maudong = item.MAUDONG;
      itemAdd.Maucat = item.MAUCAT;
      itemAdd.Ghichu = item.GHICHU;
      this._thanhCaiService.addThanhCai(itemAdd).subscribe(
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
      var item = this.thanhCaiDetailForm.getRawValue();
      var itemAdd: ThanhCaiDetail = new ThanhCaiDetail();
      itemAdd.Mapmis = item.MAPMIS;
      itemAdd.Tenthanhcai = item.TENTHANHCAI;
      itemAdd.Madvql = item.MADVQL;
      itemAdd.Tencongty = item.TENCONGTY;
      itemAdd.Truyentaidien = item.TRUYENTAIDIEN;
      itemAdd.Capda = item.CAPDA;
      itemAdd.Sohieu = item.SOHIEU;
      itemAdd.Sohuu = item.SOHUU;
      itemAdd.Ngaylapdat = item.NGAYLAPDAT;
      itemAdd.Ngayvh = item.NGAYVH;
      itemAdd.Thuoctram = item.THUOCTRAM;
      itemAdd.Tentram = item.TENTRAM;
      itemAdd.Sohieubanve = item.SOHIEUBANVE;
      itemAdd.Sododanhso = item.SODODANHSO;
      itemAdd.Cottenhienthi = item.COTTENHIENTHI;
      itemAdd.Dahienthitrensd = item.DAHIENTHITRENSD == true ? 'Y' : 'N';
      itemAdd.Hienthiten = item.HIENTHITEN == true ? 'Y' : 'N';
      itemAdd.Hoatdong = item.HOATDONG == true ? 'Y' : 'N';
      itemAdd.Tthientai = item.TTHIENTAI;
      itemAdd.Jsongeo = item.JSONGEO;
      itemAdd.Maudong = item.MAUDONG;
      itemAdd.Maucat = item.MAUCAT;
      itemAdd.Ghichu = item.GHICHU;
      this._thanhCaiService.updateThanhCai(itemAdd).subscribe(
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
    this._router.navigate(['/admin/thanh-cai-list']);
  }

  openDiagram() {
    this._router.navigate(['/diagram/view']);
  }
}
