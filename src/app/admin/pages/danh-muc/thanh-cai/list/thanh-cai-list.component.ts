import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ThanhCaiList } from 'src/app/core/models/thanh-cai';
import { ThanhCaiService } from 'src/app/core/services/thanh-cai.service';

@Component({
  selector: 'app-thanh-cai-list',
  templateUrl: './thanh-cai-list.component.html',
  styleUrls: ['./thanh-cai-list.component.css'],
})
export class ThanhCaiListComponent implements OnInit {
  ELEMENT_DATA: ThanhCaiList[] = [];
  displayedColumns: string[] = [
    'TENCONGTY',
    'TRUYENTAIDIEN',
    'TENTHANHCAI',
    'CAPDA',
    'TENTRAM',
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _router: Router,
    private _thanhCaiService: ThanhCaiService
  ) {}

  ngOnInit() {
    this._thanhCaiService.getDSThanhCai().subscribe((client) => {
      if (client.length < 5) {
        for (var i = 0; i < client.length; i++) {
          var cusObj = new ThanhCaiList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENTHANHCAI = client[i].tenthanhcai;
          cusObj.TENTRAM = client[i].tentram;
          cusObj.CAPDA = client[i].capda;
          this.ELEMENT_DATA.push(cusObj);
        }
      } else {
        for (var i = 0; i < 5; i++) {
          var cusObj = new ThanhCaiList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENTHANHCAI = client[i].tenthanhcai;
          cusObj.TENTRAM = client[i].tentram;
          cusObj.CAPDA = client[i].capda;
          this.ELEMENT_DATA.push(cusObj);
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<ThanhCaiList>(this.ELEMENT_DATA);
    });
  }

  changePagination(event: any) {
    this._thanhCaiService.getDSThanhCai().subscribe((client) => {
      this.ELEMENT_DATA = [];
      var start = event.pageIndex * event.pageSize;
      var limit = start + event.pageSize;
      for (var i = start; i < limit; i++) {
        if (i < client.length) {
          var cusObj = new ThanhCaiList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENTHANHCAI = client[i].tenthanhcai;
          cusObj.TENTRAM = client[i].tentram;
          cusObj.CAPDA = client[i].capda;
          this.ELEMENT_DATA.push(cusObj);
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<ThanhCaiList>(this.ELEMENT_DATA);
    });
  }

  onClickAdd() {
    this._router.navigate(['/admin/thanh-cai-detail', 'add']);
  }

  onClickDetail(event: any) {
    this._router.navigate(['/admin/thanh-cai-detail', event.MAPMIS]);
  }
}
