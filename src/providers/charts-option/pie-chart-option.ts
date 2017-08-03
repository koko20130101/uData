export const PieChartOptions_1 = () => ({
    color: ['#f31a52', '#f7bb2b', '#32a1ff'],
    tooltip: {
        trigger: 'item',
        formatter: "{b}: {d}%",
        backgroundColor: 'rgba(0,0,0,.6)',
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        y:'center',
        data: [{name: '', icon: 'circle'}],
        textStyle: {
            color: '#787878',
            fontWeight: 700
        },
    },
    series: [
        {
            name:'',
            type:'pie',
            center:['60%','50%'],
            radius: ['40%', '65%'],
            avoidLabelOverlap: true,
            label: {
                normal: {
                    show:true,
                    position: 'inner',
                    formatter: function (params) {
                        return (params.percent - 0).toFixed(0) + '%'
                    }
                },
                emphasis: {
                    show: true,
                    position: 'center',
                    textStyle: {
                        fontSize: '18',
                        fontWeight: 'bold'
                    },
                    formatter: function (params) {
                        return (params.percent - 0).toFixed(0) + '%'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[]
        }
    ]
});
