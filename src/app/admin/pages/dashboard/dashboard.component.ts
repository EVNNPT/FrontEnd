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
  @ViewChild(BaseChartDirective) chart_DDDC: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart_RLDC: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart_MBADC: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) chart_TCDC: BaseChartDirective | undefined;

  public barChartOptions_SLTB: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      datalabels: {
        display: false,
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
        display: false,
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

  public pieChartOptions_DDDC: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      datalabels: {
        display: false,
        anchor: 'center',
        align: 'center',
      },
    },
  };
  public pieChartType_DDDC: ChartType = 'pie';
  public pieChartPlugins_DDDC = [DataLabelsPlugin];
  public pieChartData_DDDC!: ChartData<'pie'>;

  public pieChartOptions_RLDC: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      datalabels: {
        display: false,
        anchor: 'center',
        align: 'center',
      },
    },
  };
  public pieChartType_RLDC: ChartType = 'pie';
  public pieChartPlugins_RLDC = [DataLabelsPlugin];
  public pieChartData_RLDC!: ChartData<'pie'>;

  public pieChartOptions_MBADC: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      datalabels: {
        display: false,
        anchor: 'center',
        align: 'center',
      },
    },
  };
  public pieChartType_MBADC: ChartType = 'pie';
  public pieChartPlugins_MBADC = [DataLabelsPlugin];
  public pieChartData_MBADC!: ChartData<'pie'>;

  public pieChartOptions_TCDC: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      datalabels: {
        display: false,
        anchor: 'center',
        align: 'center',
      },
    },
  };
  public pieChartType_TCDC: ChartType = 'pie';
  public pieChartPlugins_TCDC = [DataLabelsPlugin];
  public pieChartData_TCDC!: ChartData<'pie'>;

  constructor(private _dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.countItem();
    this.chartSLTB();
    this.chartSTLBDC();
    this.pieDDDC();
    this.pieRLDC();
    this.pieMBADC();
    this.pieTCDC();
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
            label: 'Số lượng',
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

  async pieDDDC() {
    this._dashboardService.getSLTBDongCat().subscribe((res) => {
      this.pieChartData_DDDC = {
        labels: ['Đóng', 'Cắt'],
        datasets: [
          {
            data: [res[0].soluongdong, res[0].soluongcat],
            backgroundColor: ['#4dffdb', '#ffff4d'],
            hoverBackgroundColor: ['#4dffdb', '#ffff4d'],
            hoverBorderColor: ['#4dffdb', '#ffff4d'],
            borderColor: ['#4dffdb', '#ffff4d'],
          },
        ],
      };
      this.chart_DDDC?.update();
    });
  }

  async pieRLDC() {
    this._dashboardService.getSLTBDongCat().subscribe((res) => {
      this.pieChartData_RLDC = {
        labels: ['Đóng', 'Cắt'],
        datasets: [
          {
            data: [res[1].soluongdong, res[1].soluongcat],
            backgroundColor: ['#b3b3ff', '#ffb3b3'],
            hoverBackgroundColor: ['#b3b3ff', '#ffb3b3'],
            hoverBorderColor: ['#b3b3ff', '#ffb3b3'],
            borderColor: ['#b3b3ff', '#ffb3b3'],
          },
        ],
      };
      this.chart_RLDC?.update();
    });
  }

  async pieMBADC() {
    this._dashboardService.getSLTBDongCat().subscribe((res) => {
      this.pieChartData_MBADC = {
        labels: ['Đóng', 'Cắt'],
        datasets: [
          {
            data: [res[2].soluongdong, res[2].soluongcat],
            backgroundColor: ['#ff704d', '#e6e600'],
            hoverBackgroundColor: ['#ff704d', '#e6e600'],
            hoverBorderColor: ['#ff704d', '#e6e600'],
            borderColor: ['#ff704d', '#e6e600'],
          },
        ],
      };
      this.chart_MBADC?.update();
    });
  }

  async pieTCDC() {
    this._dashboardService.getSLTBDongCat().subscribe((res) => {
      this.pieChartData_TCDC = {
        labels: ['Đóng', 'Cắt'],
        datasets: [
          {
            data: [res[3].soluongdong, res[3].soluongcat],
            backgroundColor: ['#ffb84d', '#80ff80'],
            hoverBackgroundColor: ['#ffb84d', '#80ff80'],
            hoverBorderColor: ['#ffb84d', '#80ff80'],
            borderColor: ['#ffb84d', '#80ff80'],
          },
        ],
      };
      this.chart_TCDC?.update();
    });
  }
}
