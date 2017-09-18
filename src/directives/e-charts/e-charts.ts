import {
    Directive,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    SimpleChange,
    OnChanges,
    OnDestroy,
    NgZone
} from '@angular/core';
import eCharts from 'echarts/lib/echarts';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
//引入折线图
import 'echarts/lib/chart/line';
//引入柱状图
import 'echarts/lib/chart/bar';
//引入饼图
import 'echarts/lib/chart/pie';

@Directive({
  selector: '[eCharts]'
})
export class EChartsDirective implements OnChanges, OnDestroy {
  @Input() options: any;
  @Input() dataSet: any[];

  @Output() chartInit: EventEmitter<any> = new EventEmitter<any>();

  myChart: any = null;

  constructor(private el: ElementRef, private _ngZone: NgZone) {
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    // console.log(this.myChart);
    if (changes['dataSet']) {
      this.onDataSetChange(this.dataSet);
    }
    // console.log(this.options);
    if (changes['options']) {
      this.onOptionsChange(this.options);
    }
  }

  ngOnDestroy() {
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
      // console.log(99)
    }
  }

  private createChart() {
    // return eCharts.init(this.el.nativeElement)
    return this._ngZone.runOutsideAngular(() => {
      return eCharts.init(this.el.nativeElement)
    });
  }

  private onOptionsChange(opt: any) {
    if (opt) {
      //如果没有eChart实例
      if (!this.myChart) {
        this.myChart = this.createChart();

        // 输出eCharts 实例:
        this.chartInit.emit(this.myChart);
      }
      if (this.hasData()) {
        this.updateChart();
      } else if (this.dataSet && this.dataSet.length) {
        this.mergeDataSet(this.dataSet);
        this.updateChart();
      }
    }
  }

  /**
   * 检查选项是否有数据集
   */
  private hasData(): boolean {
    if (!this.options.series || !this.options.series.length) {
      return false;
    }

    for (let item of this.options.series) {
      if (item.data && item.data.length > 0) {
        return true;
      }
    }

    return false;
  }

  //设置数据
  private onDataSetChange(dataSet: any[]) {
    if (this.myChart && this.options) {
      if (!this.options.series) {
        this.options.series = [];
      }
      this.mergeDataSet(dataSet);
    }
  }

  //合并数据
  private mergeDataSet(dataSet: any) {
    for (let key in dataSet) {
      switch (key) {
        case 'legend':
          for (let i = 0; i < dataSet.legend.length; i++) {
            if (!!this.options.legend.data) {
              if (!this.options.legend.data[i]) {
                this.options.legend.data[i] = {};
                Object.assign(this.options.legend.data[i], this.options.legend.data[0]);
                this.options.legend.data[i].name = dataSet.legend[i];
              } else {
                this.options.legend.data[i].name = dataSet.legend[i];
              }
            }
            /*if(!!this.options.series) {
             if (!this.options.series[i]) {
             this.options.series[i] = {name: dataSet.legend[i]};
             } else {
             this.options.series[i].name = dataSet.legend[i];
             }
             }*/
          }
          break;
        case 'xAxis':
          for (let i = 0; i < dataSet.xAxis.length; i++) {
            if (!this.options.xAxis[i]) {
              this.options.xAxis[i] = dataSet.xAxis[i];
            } else {
              Object.assign(this.options.xAxis[i],dataSet.xAxis[i])
            }
          }
          break;
        case 'yAxis':
          for (let i = 0; i < dataSet.yAxis.length; i++) {
            if (!this.options.yAxis[i]) {
              this.options.yAxis[i] = dataSet.yAxis[i];
            } else {
              Object.assign(this.options.yAxis[i],dataSet.yAxis[i])
            }
          }
          break;
        case 'series':
          for (let i = 0; i < dataSet.series.length; i++) {
            if (!this.options.series[i]) {
              this.options.series[i] = {};
              Object.assign(this.options.series[i], this.options.series[0]);
            }
            this.options.series[i].data = dataSet.series[i];
            if(!!dataSet.legend) {
              this.options.series[i].name = dataSet.legend[i];
            }
          }
          break;
      }
    }
    this.updateChart();
  }

  //更新图表
  private updateChart() {
    this.myChart.setOption(this.options);
    this.myChart.resize();
  }
}