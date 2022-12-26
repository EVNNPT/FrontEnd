import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DuongDayList } from 'src/app/core/models/duong-day';
import { DuongDayService } from 'src/app/core/services/duong-day.service';

@Component({
  selector: 'app-duong-day-list',
  templateUrl: './duong-day-list.component.html',
  styleUrls: ['./duong-day-list.component.css'],
})
export class DuongDayListComponent implements OnInit {
  ELEMENT_DATA: DuongDayList[] = [];
  displayedColumns: string[] = [
    'TENCONGTY',
    'TRUYENTAIDIEN',
    'TENDUONGDAY',
    'CAPDA',
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _router: Router,
    private _duongDayService: DuongDayService
  ) {}

  ngOnInit() {
    this._duongDayService.getDSDuongDay().subscribe((client) => {
      if (client.length < 5) {
        for (var i = 0; i < client.length; i++) {
          var cusObj = new DuongDayList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENDUONGDAY = client[i].tenduongday;
          cusObj.CAPDA = client[i].capda;
          this.ELEMENT_DATA.push(cusObj)
        }
      } else {
        for (var i = 0; i < 5; i++) {
          var cusObj = new DuongDayList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENDUONGDAY = client[i].tenduongday;
          cusObj.CAPDA = client[i].capda;
          this.ELEMENT_DATA.push(cusObj)
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<DuongDayList>(this.ELEMENT_DATA);
    });
  }

  changePagination(event: any) {
    this._duongDayService.getDSDuongDay().subscribe((client) => {
      this.ELEMENT_DATA = [];
      var start = event.pageIndex * event.pageSize;
      var limit = start + event.pageSize;
      for (var i = start; i < limit; i++) {
        if (i < client.length) {
          var cusObj = new DuongDayList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENDUONGDAY = client[i].tenduongday;
          cusObj.CAPDA = client[i].capda;
          this.ELEMENT_DATA.push(cusObj)
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<DuongDayList>(this.ELEMENT_DATA);
    });
  }

  onClickAdd() {
    this._router.navigate(['/admin/duong-day-detail', 'add']);
  }

  onClickDetail(event: any) {
    this._router.navigate(['/admin/duong-day-detail', event.MAPMIS]);
  }
}
