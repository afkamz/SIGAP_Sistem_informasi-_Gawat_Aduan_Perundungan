import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export const TrendLineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderRadius: 12,
        padding: [10, 14],
        textStyle: { color: '#ffffff', fontSize: 11, fontFamily: 'inherit' },
        formatter: (params) => {
          let month = params[0]?.axisValue || '';
          let res = `<div class="font-bold text-white mb-1.5">Bulan ${month} 2024</div>`;
          params.forEach((item) => {
            const dotColor = item.seriesName === 'Internal' ? '#0284c7' : '#94a3b8';
            res += `<div class="flex items-center justify-between gap-4 text-xs">
              <span style="color:${dotColor}">● ${item.seriesName}:</span>
              <strong class="text-white">${item.value} kasus</strong>
            </div>`;
          });
          return res;
        }
      },
      legend: {
        show: false // We show custom legend on top right of the card
      },
      grid: {
        top: 25,
        left: '2%',
        right: '2%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: { color: '#64748b', fontSize: 11, fontWeight: 500 }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        interval: 10,
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
      },
      series: [
        {
          name: 'Internal',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 7,
          data: [8, 12, 15, 9, 18, 10, 24, 15, 12, 10, 8],
          lineStyle: { color: '#0284c7', width: 2.5 },
          itemStyle: { color: '#0284c7', borderWidth: 2, borderColor: '#ffffff' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(2, 132, 199, 0.15)' },
              { offset: 1, color: 'rgba(2, 132, 199, 0.0)' }
            ])
          }
        },
        {
          name: 'Nasional',
          type: 'line',
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          data: [13, 16, 14, 17, 14, 12, 16, 17, 15, 14, 13],
          lineStyle: { color: '#94a3b8', width: 1.8, type: 'dashed' },
          itemStyle: { color: '#ffffff', borderWidth: 1.5, borderColor: '#94a3b8' }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} className="w-full h-64 sm:h-72" />;
};

export default TrendLineChart;
