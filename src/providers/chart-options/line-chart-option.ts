export const LineChartOptions1 = {
    title: {
        text: '雨量流量关系图',
        subtext: '数据来自西安兰特水电测控技术有限公司',
        x: 'center',
        align: 'right'
    },
    grid: {
        bottom: 80
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['流量', '降雨量'],
        x: 'left'
    },
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 65,
            end: 85
        },
        {
            type: 'inside',
            realtime: true,
            start: 65,
            end: 85
        }
    ],
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: false },
            data: []
        }
    ],
    yAxis: [
        {
            name: '流量(m^3/s)',
            type: 'value',
            max: 500
        },
        {
            name: '降雨量(mm)',
            nameLocation: 'start',
            max: 5,
            type: 'value',
            inverse: true
        }
    ],
    series: [
        {
            name: '流量',
            type: 'line',
            animation: false,
            areaStyle: {
                normal: {}
            },
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            markArea: {
                silent: true,
                data: [[{
                    xAxis: '2009/9/12\n7:00'
                }, {
                    xAxis: '2009/9/22\n7:00'
                }]]
            },
            data: []
        },
        {
            name: '降雨量',
            type: 'line',
            yAxisIndex: 1,
            animation: false,
            areaStyle: {
                normal: {}
            },
            lineStyle: {
                normal: {
                    width: 1
                }
            },
            markArea: {
                silent: true,
                data: [[{
                    xAxis: '2009/9/10\n7:00'
                }, {
                    xAxis: '2009/9/20\n7:00'
                }]]
            },
            data: []
        }
    ]
};