import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MayBienApList } from 'src/app/core/models/may-bien-ap';
import { GetDataTestService } from 'src/app/core/services/get-data-test.service';

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
    private getDataTestService: GetDataTestService
  ) {}

  ngOnInit() {
    this.getDataTestService.listMBA().subscribe((client) => {
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
      this.dataSource = new MatTableDataSource<MayBienApList>(this.ELEMENT_DATA);
    });
  }

  changePagination(event: any) {
    this.getDataTestService.listMBA().subscribe((client) => {
      this.ELEMENT_DATA = [];
      var start = event.pageIndex * event.pageSize;
      var limit = start + event.pageSize;
      for (var i = start; i < limit; i++) {
        if(i<client.length){
          this.ELEMENT_DATA.push(client[i]);
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<MayBienApList>(this.ELEMENT_DATA);
    });
  }

  onClickAdd() {
    this._router.navigate(['/admin/may-bien-ap-detail', 'add']);
  }

  onClickDetail(event: any) {
    this._router.navigate(['/admin/may-bien-ap-detail', event.MAPMIS]);
  }
}