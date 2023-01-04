import { Component, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  countDuongDay: number = 0;
  countRole: number = 0;
  countMBA: number = 0;
  countThanhCai: number = 0;

  @ViewChild(BaseChartDirective) chart_SLTB: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart_SLTBDC: BaseChartDirective | undefined;

  public barChartOptions_SLTB: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      datalabels: {
        display: true,
        anchor: 'center',
        align: 'center',
      },
    },
    scales: {
      xAxes: {
        title: {
          display: true,
          align: 'center',
          text: 'Loại thiết bị',
        },
      },
      yAxes: {
        title: {
          display: true,
          align: 'center',
          text: 'Số lượng',
        },
      },
    },
  };
  public barChartType_SLTB: ChartType = 'bar';
  public barChartPlugins_SLTB = [DataLabelsPlugin];
  public barChartData_SLTB!: ChartData<'bar'>;

  public barChartOptions_SLTBDC: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      datalabels: {
        display: true,
        anchor: 'center',
        align: 'center',
      },
    },
    scales: {
      xAxes: {
        title: {
          display: true,
          align: 'center',
          text: 'Loại thiết bị',
        },
      },
      yAxes: {
        title: {
          display: true,
          align: 'center',
          text: 'Số lượng',
        },
      },
    },
  };
  public barChartType_SLTBDC: ChartType = 'bar';
  public barChartPlugins_SLTBDC = [DataLabelsPlugin];
  public barChartData_SLTBDC!: ChartData<'bar'>;

  constructor(private _dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.countItem();
    this.chartSLTB();
    this.chartSTLBDC();
  }

  async countItem() {
    this._dashboardService.getSoLuongTB().subscribe(async (res) => {
      this.countDuongDay = res[0].soluong;
      this.countRole = res[1].soluong;
      this.countMBA = res[2].soluong;
      this.countThanhCai = res[3].soluong;
    });
  }

  async chartSLTB() {
    this._dashboardService.getSoLuongTB().subscribe(async (res) => {
      this.barChartData_SLTB = {
        labels: [
          res[0].loaitb.toString(),
          res[1].loaitb.toString(),
          res[2].loaitb.toString(),
          res[3].loaitb.toString(),
        ],
        datasets: [
          {
            data: [
              res[0].soluong,
              res[1].soluong,
              res[2].soluong,
              res[3].soluong,
            ],
            label: '',
            backgroundColor: ['#ffff99', '#99ff99', '#ffb366', '#b3ecff'],
            hoverBackgroundColor: ['#ffff99', '#99ff99', '#ffb366', '#b3ecff'],
            hoverBorderColor: ['#ffff99', '#99ff99', '#ffb366', '#b3ecff'],
            borderColor: ['#ffff99', '#99ff99', '#ffb366', '#b3ecff'],
          },
        ],
      };
      this.chart_SLTB?.update();
    });
  }

  async chartSTLBDC() {
    this._dashboardService.getSLTBDongCat().subscribe((res) => {
      this.barChartData_SLTBDC = {
        labels: [
          res[0].loaitb.toString(),
          res[1].loaitb.toString(),
          res[2].loaitb.toString(),
          res[3].loaitb.toString(),
        ],
        datasets: [
          {
            data: [
              res[0].soluongdong,
              res[1].soluongdong,
              res[2].soluongdong,
              res[3].soluongdong,
            ],
            label: 'Đóng',
            backgroundColor: ['#ffff99', '#99ff99', '#ffb366', '#b3ecff'],
            hoverBackgroundColor: ['#ffff99', '#99ff99', '#ffb366', '#b3ecff'],
            hoverBorderColor: ['#ffff99', '#99ff99', '#ffb366', '#b3ecff'],
            borderColor: ['#ffff99', '#99ff99', '#ffb366', '#b3ecff'],
            stack: 'Stack 0',
          },
          {
            data: [
              res[0].soluongcat,
              res[1].soluongcat,
              res[2].soluongcat,
              res[3].soluongcat,
            ],
            label: 'Cắt',
            backgroundColor: ['#ffff00', '#00e600', '#ff8000', '#66a3ff'],
            hoverBackgroundColor: ['#ffff00', '#00e600', '#ff8000', '#66a3ff'],
            hoverBorderColor: ['#ffff00', '#00e600', '#ff8000', '#66a3ff'],
            borderColor: ['#ffff00', '#00e600', '#ff8000', '#66a3ff'],
            stack: 'Stack 0',
          },
        ],
      };
      this.chart_SLTBDC?.update();
    });
  }
}
