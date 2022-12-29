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
  @ViewChild(BaseChartDirective) chart_SLTB: BaseChartDirective | undefined;
  
  public barChartOptions_SLTB: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      datalabels: {
        display: false,
        anchor: 'end',
        align: 'end',
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

  constructor(private _dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.chartSLTB();
    this.chartSTLBDC();
  }

  async chartSLTB(){
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
            backgroundColor: ['#0070ff'],
          },
        ],
      };
      this.chart_SLTB?.update();
      // this._dashboardService.getSLTBDongCat().subscribe((res2) => {});
    });
  }

  async chartSTLBDC(){

  }
}
