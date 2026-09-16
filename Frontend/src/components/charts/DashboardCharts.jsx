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
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: '#334155',
        textStyle: { color: '#ffffff', fontSize: 12 }
      },
      legend: {
        data: ['Sekolah Kita (2024)', 'Baseline Daerah (Kaltim/Aceh)'],
        bottom: 0,
        textStyle: { fontSize: 11, color: '#64748b' }
      },
      grid: {
        top: 20,
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#64748b', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#64748b', fontSize: 11 }
      },
      series: [
        {
          name: 'Sekolah Kita (2024)',
          type: 'line',
          smooth: true,
          data: [12, 19, 15, 24, 18, 14],
          lineStyle: { color: '#0284c7', width: 3 },
          itemStyle: { color: '#0284c7' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(2, 132, 199, 0.25)' },
              { offset: 1, color: 'rgba(2, 132, 199, 0.0)' }
            ])
          }
        },
        {
          name: 'Baseline Daerah (Kaltim/Aceh)',
          type: 'line',
          smooth: true,
          data: [10, 14, 13, 16, 15, 12],
          lineStyle: { color: '#94a3b8', width: 2, type: 'dashed' },
          itemStyle: { color: '#94a3b8' }
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

  return <div ref={chartRef} className="w-full h-72" />;
};

export const CategoryBarChart = ({ categories = [] }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const names = categories.map((c) =>
      c.nama.length > 20 ? c.nama.substring(0, 18) + '...' : c.nama
    );
    const counts = categories.map((c) => c.count);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        textStyle: { color: '#ffffff', fontSize: 12 }
      },
      grid: {
        top: 15,
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: { color: '#64748b', fontSize: 11 }
      },
      yAxis: {
        type: 'category',
        data: names.reverse(),
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#475569', fontSize: 11 }
      },
      series: [
        {
          name: 'Jumlah Aduan',
          type: 'bar',
          data: counts.reverse(),
          barWidth: '55%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#38bdf8' },
              { offset: 1, color: '#0284c7' }
            ]),
            borderRadius: [0, 6, 6, 0]
          }
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
  }, [categories]);

  return <div ref={chartRef} className="w-full h-72" />;
};

