import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RoLeList } from 'src/app/core/models/ro-le';
import { RoLeService } from 'src/app/core/services/ro-le.service';
import { DialogXoaComponent } from '../../dialog/dialog-xoa/dialog-xoa.component';

@Component({
  selector: 'app-ro-le-list',
  templateUrl: './ro-le-list.component.html',
  styleUrls: ['./ro-le-list.component.css'],
})
export class RoLeListComponent implements OnInit {
  ELEMENT_DATA: RoLeList[] = [];
  displayedColumns: string[] = [
    'TENCONGTY',
    'TRUYENTAIDIEN',
    'TENROLE',
    'TENTRAM',
    'DELETE',
  ];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _router: Router,
    public dialog: MatDialog,
    private _roLeService: RoLeService
  ) {}

  ngOnInit() {
    this._roLeService.getDSRoLe().subscribe((client) => {
      if (client.length < 5) {
        for (var i = 0; i < client.length; i++) {
          var cusObj = new RoLeList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENROLE = client[i].tenrole;
          cusObj.TENTRAM = client[i].tentram;
          this.ELEMENT_DATA.push(cusObj);
        }
      } else {
        for (var i = 0; i < 5; i++) {
          var cusObj = new RoLeList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENROLE = client[i].tenrole;
          cusObj.TENTRAM = client[i].tentram;
          this.ELEMENT_DATA.push(cusObj);
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<RoLeList>(this.ELEMENT_DATA);
    });
  }

  changePagination(event: any) {
    this._roLeService.getDSRoLe().subscribe((client) => {
      this.ELEMENT_DATA = [];
      var start = event.pageIndex * event.pageSize;
      var limit = start + event.pageSize;
      for (var i = start; i < limit; i++) {
        if (i < client.length) {
          var cusObj = new RoLeList();
          cusObj.MAPMIS = client[i].mapmis;
          cusObj.TENCONGTY = client[i].tencongty;
          cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
          cusObj.TENROLE = client[i].tenrole;
          cusObj.TENTRAM = client[i].tentram;
          this.ELEMENT_DATA.push(cusObj);
        }
      }
      this.paginator.length = client.length;
      this.dataSource = new MatTableDataSource<RoLeList>(this.ELEMENT_DATA);
    });
  }

  onClickAdd() {
    this._router.navigate(['/admin/ro-le-detail', 'add']);
  }

  onClickDetail(event: any) {
    this._router.navigate(['/admin/ro-le-detail', event.MAPMIS]);
  }

  openDialogDelete(event: any) {
    var id = event.MAPMIS;
    const dialogRef = this.dialog.open(DialogXoaComponent, {
      data: { idDDay: '', idMBA: '', idRL: id, idTC: '' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ELEMENT_DATA = [];
      this._roLeService.getDSRoLe().subscribe((client) => {
        if (client.length < 5) {
          for (var i = 0; i < client.length; i++) {
            var cusObj = new RoLeList();
            cusObj.MAPMIS = client[i].mapmis;
            cusObj.TENCONGTY = client[i].tencongty;
            cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
            cusObj.TENROLE = client[i].tenrole;
            cusObj.TENTRAM = client[i].tentram;
            this.ELEMENT_DATA.push(cusObj);
          }
        } else {
          for (var i = 0; i < 5; i++) {
            var cusObj = new RoLeList();
            cusObj.MAPMIS = client[i].mapmis;
            cusObj.TENCONGTY = client[i].tencongty;
            cusObj.TRUYENTAIDIEN = client[i].truyentaidien;
            cusObj.TENROLE = client[i].tenrole;
            cusObj.TENTRAM = client[i].tentram;
            this.ELEMENT_DATA.push(cusObj);
          }
        }
        this.paginator.length = client.length;
        this.paginator.pageIndex = 0;
        this.dataSource = new MatTableDataSource<RoLeList>(this.ELEMENT_DATA);
      });
    });
  }
}
