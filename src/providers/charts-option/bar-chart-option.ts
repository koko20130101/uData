export const BarChartOptions_1 = () => ({
    color: [ '#1e7fec','#494964'],
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
        itemWidth: 20,
        itemHeight: 15,
        data: ['发布金额','融资金额'],
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
            show:false,
            boundaryGap: true, //坐标轴两端空白策略
            axisLabel: {  //X坐标文字属性
                textStyle: {
                    color: '#474754',
                    fontWeight: 700
                }
            },
            axisLine: {
                show: false  //显示X坐标
            },
            splitLine: { //垂直网格线
                show: false
            },
            textStyle: {
                color: ['#FFF']
            },
            axisTick: false,  //坐标小分隔线
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
            name: '发布金额',
            type: "bar",
            barGap:0,
            barWidth:0,
        },
        {
            name: '融资金额',
            type: "bar",
            barGap:0,
            barWidth:0,
        },
    ]
});

export const BarChartOption_2 = () =>({
    color: ['#db9713', '#fcc355', '#1d8a8e', '#40cacc', '#b2162c', '#ec1e3b'],
    tooltip : {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,.7)',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        top: 10,
        left: 10,
        itemWidth: 10,
        itemHeight: 15,
        textStyle: {
            color: '#787878',
            fontWeight: 700
        },
        data: ['引入', '存量', '销售', '回滚', '引入利率', '销售利率'],
        selectedMode: false
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'value',
            show :false
        }
    ],
    yAxis : [
        {
            type: 'category', //类目型
            axisLine: {
                show: true,  //Y轴
                lineStyle: {
                    color: '#1e1e28',
                    width: 2,
                    type: 'solid'
                }
            },
            axisLabel: {  //Y坐标标签属性
                textStyle: {
                    color: '#565475',
                    fontWeight: 700
                }
            },
            splitLine: {   //水平网格线
                show: true,
                lineStyle: {
                    color: ['#262633']
                }
            },
            axisTick: {show: false},  //坐标小标记
            data: ['7月01日', '7月02日', '7月03日', '7月04日', '7月05日', '7月06日', '7月07日']
        }
    ],
    series : [
        {
            name: '引入',
            type: 'bar',
            stack: '资金',
            itemStyle: {
                normal: {
                    label: {
                        show: false,
                        position: 'insideLeft',
                        formatter: function (params) {
                            return Math.abs(params.value);
                        }
                    }
                }
            },
            data: [-200, -170, -240, -326, -200, -220, -210]
        },
        {
            name: '存量',
            type: 'bar',
            stack: '资金',
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'insideRight',
                        formatter: function (params) {
                            return Math.abs(params.value);
                        }
                    }
                }
            },
            data: [-120, -32, -41, -74, -90, -50, -20]
        },
        {
            name: '销售',
            type: 'bar',
            stack: '资金',
            itemStyle: {
                normal: {
                    label: {show: false, position: 'insideLeft'}
                }
            },
            data: [120, 132, 101, 134, 190, 230, 210]
        },
        {
            name: '回滚',
            type: 'bar',
            stack: '资金',
            itemStyle: {
                normal: {
                    label: {show: true, position: 'insideLeft'}
                }
            },
            data: [120, 132, 101, 134, 190, 230, 210]
        },
        {
            name: '引入利率',
            type: 'bar',
            stack: '利率',
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'insideRight',
                        formatter: function (params) {
                            return Math.abs(params.value);
                        }
                    }
                }
            },
            data: [-120, -132, -101, -134, -190, -230, -210]
        },
        {
            name: '销售利率',
            type: 'bar',
            stack: '利率',
            itemStyle: {
                normal: {
                    label: {show: true, position: 'insideLeft'}
                }
            },
            data: [120, 132, 101, 134, 190, 230, 210]
        }
    ]
});

export const BarChartDataset1 = [
    [10, 52, 200, 334, 390, 330, 220]
];

export const BarChartDataset2 = [
    [200, 32, 444, 666, 88, 352, 380]
];