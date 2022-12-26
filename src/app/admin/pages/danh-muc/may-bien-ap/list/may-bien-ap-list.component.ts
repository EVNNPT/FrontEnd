import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MayBienApList } from 'src/app/core/models/may-bien-ap';
import { MayBienApService } from 'src/app/core/services/may-bien-ap.service';

@Component({
  selector: 'app-may-bien-ap-list',
  templateUrl: './may-bien-ap-list.component.html',
  styleUrls: ['./may-bien-ap-list.component.css'],
})
export class MayBienApListComponent implements OnInit {
  ELEMENT_DATA: MayBienApList[] = [];
  displayedColumns: string[] = [
    'TENCONGTY',
    'TRUYENTAIDIEN',
    'TENMBA',
    'TENTRAM',
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _router: Router,
    private _mayBienApService: MayBienApService
  ) {}

  ngOnInit() {
    this._mayBienApService.getDSMayBienAp().subscribe((client) => {
      if (client.length < 5) {
        for (var i = 0; i < client.length; i++) {
          var cusObj = new MayBienApList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENMBA = client[i].tenmba;
          cusObj.TENTRAM = client[i].tentram;
          this.ELEMENT_DATA.push(cusObj);
        }
      } else {
        for (var i = 0; i < 5; i++) {
          var cusObj = new MayBienApList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENMBA = client[i].tenmba;
          cusObj.TENTRAM = client[i].tentram;
          this.ELEMENT_DATA.push(cusObj);
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<MayBienApList>(
        this.ELEMENT_DATA
      );
    });
  }

  changePagination(event: any) {
    this._mayBienApService.getDSMayBienAp().subscribe((client) => {
      this.ELEMENT_DATA = [];
      var start = event.pageIndex * event.pageSize;
      var limit = start + event.pageSize;
      for (var i = start; i < limit; i++) {
        if (i < client.length) {
          var cusObj = new MayBienApList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENMBA = client[i].tenmba;
          cusObj.TENTRAM = client[i].tentram;
          this.ELEMENT_DATA.push(cusObj);
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<MayBienApList>(
        this.ELEMENT_DATA
      );
    });
  }

  onClickAdd() {
    this._router.navigate(['/admin/may-bien-ap-detail', 'add']);
  }

  onClickDetail(event: any) {
    this._router.navigate(['/admin/may-bien-ap-detail', event.MAPMIS]);
  }
}
