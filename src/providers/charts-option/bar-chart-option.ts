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

export const BarChartDataset1 = [
    [10, 52, 200, 334, 390, 330, 220]
];

export const BarChartDataset2 = [
    [200, 32, 444, 666, 88, 352, 380]
];