import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FileDinhKem } from 'src/app/core/models/file-dinh-kem';
import { GetDataTestService } from 'src/app/core/services/get-data-test.service';

@Component({
  selector: 'app-thanh-cai-detail',
  templateUrl: './thanh-cai-detail.component.html',
  styleUrls: ['./thanh-cai-detail.component.css']
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
    private getDataTestService: GetDataTestService
  ) {}

  ngOnInit() {
    this._route.paramMap.subscribe((params) => {
      var id = params.get('id')!;
      if (id == 'add') {
        this.formType = false;
      } else {
        this.getDataTestService.listTC().subscribe((client) => {
          client.forEach((element) => {
            if (element.MAPMIS == id) {
              this.formType = true;
              this.thanhCaiDetailForm.patchValue({
                MAPMIS: element.MAPMIS,
                TENTHANHCAI: element.TENTHANHCAI,
                MADVQL: element.MADVQL,
                TENCONGTY: element.TENCONGTY,
                TRUYENTAIDIEN: element.TRUYENTAIDIEN,
                CAPDA: element.CAPDA,
                SOHIEU: element.SOHIEU,
                SOHUU: element.SOHUU,
                NGAYLAPDAT: new Date(element.NGAYLAPDAT),
                NGAYVH: new Date(element.NGAYVH),
                THUOCTRAM: element.THUOCTRAM,
                TENTRAM: element.TENTRAM,
                SOHIEUBANVE: element.SOHIEUBANVE,
                SODODANHSO: element.SODODANHSO,
                COTTENHIENTHI: element.COTTENHIENTHI,
                DAHIENTHITRENSD: element.DAHIENTHITRENSD == 'Y' ? true : false,
                HIENTHITEN: element.HIENTHITEN == 'Y' ? true : false,
                HOATDONG: element.HOATDONG == 'Y' ? true : false,
                TTHIENTAI: element.TTHIENTAI,
                JSONGEO: element.JSONGEO,
                MAUDONG: element.MAUDONG,
                MAUCAT: element.MAUCAT,
                GHICHU: element.GHICHU,
              });
              this.getDataTestService.listFDK().subscribe((client) => {
                client.forEach(element => {
                  if (element.MADT == id && element.MALOAITHIETBI == "TC") {
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
                    this.dataSource = new MatTableDataSource<FileDinhKem>(this.ELEMENT_DATA);
                  }
                });
              });
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
          if (element.MADT == id && element.MALOAITHIETBI == "TC") {
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
      console.log(this.thanhCaiDetailForm.getRawValue());
    } else {
      console.log('Update');
      console.log(this.thanhCaiDetailForm.getRawValue());
    }
  }

  onClickGoBack() {
    this._router.navigate(['/admin/thanh-cai-list']);
  }
}
