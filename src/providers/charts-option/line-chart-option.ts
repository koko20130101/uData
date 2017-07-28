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
        data: [{name: '本月', icon: 'circle'}, {name: '上月', icon: 'circle'}],
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
            type: 'line',  //图形类型
            smooth: false,   //平滑曲线
            symbol: 'emptyCircle',   //节点标志图
            symbolSize: 4,  //标志图形大小
        },
        {
            name: '上月',
            type: 'line',
            smooth: false,   //平滑曲线
            symbol: 'circle',   //节点
            symbolSize: 2,
        }
    ]
});
export const LineChartOption_2 = () => (
{
    color: ['#21f33b', '#294181'],
    title: {
        show: false
    },
    legend: {
        show: false,
        data: ['资产', '资金']
    },
    tooltip: {  //tips信息
        show: false,
        formatter: '{b}<br/>{a0}：{c0}%%'
    },
    grid: {
        left: '12%',
        right: '0%',
        bottom: '4%',
        top:'5%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            splitLine: {
                lineStyle: {
                    color: 'transparent'
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'transparent'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#666'
                },
                margin: 20
            },
            data: []
        }
    ],
    yAxis: [
        {
            type: 'value',
            min: -2,
            max: 2,
            axisLine: {
                lineStyle: {
                    color: 'transparent'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#666'
                }

            },
            splitNumber: 4,
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['#02322f','#016e68', '#016e68','#02322f',]
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#013633'
                }
            }
        }
    ],
    series: [
        {
            name: '资产',
            type: 'line',
            symbol: 'emptyCircle',
            symbolSize: 4,
            itemStyle: {
                normal: {
                    textStyle: {
                        color: '#04b0a6'
                    }
                }

            },
            data: []
        }
    ]
}
);
