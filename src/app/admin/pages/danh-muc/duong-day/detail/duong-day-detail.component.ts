import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDinhKem } from 'src/app/core/models/file-dinh-kem';
import { ThietBiLienQuan } from 'src/app/core/models/thiet-bi-lq';
import { GetDataTestService } from 'src/app/core/services/get-data-test.service';
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
  id: string = "";

  @ViewChild("MatPaginator") paginator!: MatPaginator;
  @ViewChild("MatPaginator_TBLQ") paginator_TBLQ!: MatPaginator;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private getDataTestService: GetDataTestService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this._route.paramMap.subscribe((params) => {
      var id = params.get('id')!;
      this.id = id;
      if (id == 'add') {
        this.formType = false;
      } else {
        this.getDataTestService.listDD().subscribe((client) => {
          client.forEach((element) => {
            if (element.MAPMIS == id) {
              this.formType = true;
              this.duongDayDetailForm.patchValue({
                MAPMIS: element.MAPMIS,
                TENDUONGDAY: element.TENDUONGDAY,
                MADVQL: element.MADVQL,
                TENCONGTY: element.TENCONGTY,
                TRUYENTAIDIEN: element.TRUYENTAIDIEN,
                CAPDA: element.CAPDA,
                SOHIEU: element.SOHIEU,
                SOHUU: element.SOHUU,
                NGAYLAPDAT: new Date(element.NGAYLAPDAT),
                NGAYVH: new Date(element.NGAYVH),
                TUTRAM: element.TUTRAM,
                TENTUTRAM: element.TENTUTRAM,
                DENTRAM: element.DENTRAM,
                TENDENTRAM: element.TENDENTRAM,
                SOHIEUBANVE: element.SOHIEUBANVE,
                SODODANHSO: element.SODODANHSO,
                MACH: element.MACH,
                COTTENHIENTHI: element.COTTENHIENTHI,
                DAHIENTHITRENSD: element.DAHIENTHITRENSD == 'Y' ? true : false,
                HIENTHITEN: element.HIENTHITEN == 'Y' ? true : false,
                HOATDONG: element.HOATDONG == 'Y' ? true : false,
                TTHIENTAI: element.TTHIENTAI,
                JSONGEO: element.JSONGEO,
                MAUDONG: element.MAUDONG,
                MAUCAT: element.MAUCAT,
                DAUNOIDAU: element.DAUNOIDAU,
                DAUNOICUOI: element.DAUNOICUOI,
                GHICHU: element.GHICHU,
              });
              this.getDataTestService.listFDK().subscribe((client) => {
                client.forEach((element) => {
                  if (element.MADT == id && element.MALOAITHIETBI == "DUONGDAY") {
                    if (client.length < 5) {
                      for (var i = 0; i < client.length; i++) {
                        this.ELEMENT_DATA.push(client[i]);
                      }
                    } else {
                      for (var i = 0; i < 5; i++) {
                        this.ELEMENT_DATA.push(client[i]);
                      }
                    }
                    this.paginator.length = client.length;
                    this.dataSource = new MatTableDataSource<FileDinhKem>(
                      this.ELEMENT_DATA
                    );
                  }
                });
              });
              this.getDataTestService.listTBLQ().subscribe((client) => {
                client.forEach((element) => {
                  if (element.MADUONGDAY == id) {
                    if (client.length < 5) {
                      for (var i = 0; i < client.length; i++) {
                        this.ELEMENT_DATA_TBLQ.push(client[i]);
                      }
                    } else {
                      for (var i = 0; i < 5; i++) {
                        this.ELEMENT_DATA_TBLQ.push(client[i]);
                      }
                    }
                    this.paginator_TBLQ.length = client.length;
                    this.dataSourceTBLQ = new MatTableDataSource<ThietBiLienQuan>(
                      this.ELEMENT_DATA_TBLQ
                    );
                  }
                });
              })
            }
            // this.duongDayDetailForm.controls['MAPMIS'].disable();
          });
        });
      }
    });
  }

  changePagination(event: any) {
    this._route.paramMap.subscribe((params) => {
      var id = params.get('id')!;
      this.getDataTestService.listFDK().subscribe((client) => {
        client.forEach((element) => {
          if (element.MADT == id && element.MALOAITHIETBI == "DUONGDAY") {
            this.ELEMENT_DATA = [];
            var start = event.pageIndex * event.pageSize;
            var limit = start + event.pageSize;
            for (var i = start; i < limit; i++) {
              if (i < client.length) {
                this.ELEMENT_DATA.push(client[i]);
              }
            }
            this.paginator.length = client.length;
            this.dataSource = new MatTableDataSource<FileDinhKem>(
              this.ELEMENT_DATA
            );
          }
        });
      });
    });
  }

  changePagination_TBLQ(event: any) {
    this._route.paramMap.subscribe((params) => {
      var id = params.get('id')!;
      this.getDataTestService.listTBLQ().subscribe((client) => {
        client.forEach((element) => {
          if (element.MADUONGDAY == id) {
            this.ELEMENT_DATA_TBLQ = [];
            var start = event.pageIndex * event.pageSize;
            var limit = start + event.pageSize;
            for (var i = start; i < limit; i++) {
              if (i < client.length) {
                this.ELEMENT_DATA_TBLQ.push(client[i]);
              }
            }
            this.paginator_TBLQ.length = client.length;
            this.dataSourceTBLQ = new MatTableDataSource<ThietBiLienQuan>(
              this.ELEMENT_DATA_TBLQ
            );
          }
        });
      });
    });
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
      console.log(this.duongDayDetailForm.getRawValue());
    } else {
      console.log('Update');
      console.log(this.duongDayDetailForm.getRawValue());
      console.log(this.duongDayDetailForm.getRawValue().NGAYLAPDAT?.toLocaleDateString())
    }
  }

  onClickGoBack() {
    this._router.navigate(['/admin/duong-day-list']);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogThemMoiDtlqComponent, {data: { id: this.id },});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
