export const BarChartOptions_1 = () =>({
    color: ['#1e7fec', '#494964'],
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
        data: [{name: '发布金额'}, {name: '融资金额'}],
        textStyle: {
            color: '#787878',
            fontWeight: 700
        },
    },
    grid: {
        left: 70,
        right: '4%',
        bottom: '8%',
        containLabel: false
    },
    xAxis: [
        {
            type: 'category',
            show: true,
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
            barGap: 0,
            barWidth: 0,
        },
        {
            name: '融资金额',
            type: "bar",
            barGap: 0,
            barWidth: 0,
        },
    ]
});

export const BarChartOption_2 = () =>({
    color: ['#db9713', '#fcc355', '#1d8a8e', '#40cacc', '#b2162c', '#ec1e3b'],
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,.7)',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
    xAxis: [
        {
            type: 'value',
            show: false,
            max:'50%',
            min:'50%'
        }
    ],
    yAxis: [
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
            data: []
        }
    ],
    series: [
        {
            name: '引入',
            type: 'bar',
            stack: '资金',
            label: {
                normal:{
                    show: false,
                    position: 'insideRight',
                    formatter: function (params) {
                        return Math.abs(params.value);
                    }
                }
            }
        },
        {
            name: '存量',
            type: 'bar',
            stack: '资金',
            label: {
                normal:{
                    show: true,
                    position: 'insideRight'
                }
            }
        },
        {
            name: '销售',
            type: 'bar',
            stack: '资金',
            label: {
                normal:{
                    show: false,
                    position: 'insideLeft'
                }
            }
        },
        {
            name: '回滚',
            type: 'bar',
            stack: '资金',
            label: {
                normal:{
                    show: true,
                    position: 'insideLeft'
                }
            }
        },
        {
            name: '引入利率',
            type: 'bar',
            stack: '利率',
            label: {
                normal:{
                    show: true,
                    position: 'insideRight',
                    textStyle:{
                        color:'#FFF'
                    }
                }
            }
        },
        {
            name: '销售利率',
            type: 'bar',
            stack: '利率',
            label: {
                normal:{
                    show: true,
                    position: 'insideLeft',
                    textStyle:{
                        color:'#FFF'
                    }
                }
            }
        }
    ]
});
