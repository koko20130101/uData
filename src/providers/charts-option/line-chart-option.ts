export const LineChartOption_1 = () => ({
    color: ['#f45a1e', '#294181'],
    title: {
        show: true,
        text: '',
        subtext: '单位（万元）',
        y: -7,
        x: 'right',
        subtextStyle: {
            color: '#464654',
            fontWeight: 'bold'
        }
    },
    tooltip: {
        trigger: 'axis',  // 触发：axis为轴，item为点
        showDelay: 0,   //tips显示延迟
        hideDelay: 1000, //tips隐藏延迟
        transitionDuration: 0,  //tips动画间隔
        backgroundColor: 'rgba(244,90,30,1)',
        axisPointer: {  //坐标轴指示器
            type: 'line',  // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {
                color: '#36364a',
                width: 1,
                type: 'solid'
            }
        },
        formatter: function (params) {
            var res = params[0].name;
            for (var i = 0; i < params.length; i++) {
                res += '<br/>' + params[i].seriesName + ' : ' + params[i].data;
            }
            return res;
        }
    },
    legend: {
        top: 20,
        left: 10,
        data: [{name: '本月', icon: 'circle'},{name: '上月', icon: 'circle'}],
        textStyle: {
            color: '#787878',
            fontWeight: 700
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: "#565475"
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#333'
                }
            },
            data: ['1:00', '5:00', '13:00', '17:00', '21:00', '22:00', '23:00'],
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: "#565475"
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#262633']
                }
            },
        }
    ],
    series: [
        {
            name: '本月',
            type: 'line',
            symbol: 'emptyCircle',   //节点标志图
            showSymbol: true,
            smooth: true,
            symbolSize: 4,  //标志图形大小
        },
        {
            name: '上月',
            type: 'line',
            symbol: 'emptyCircle',   //节点标志图
            showSymbol: true,
            smooth: true,
            symbolSize: 4,  //标志图形大小
        }
    ]
});