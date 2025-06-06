import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

const PieChart = (props) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy previous chart instance if it exists
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            // Create new chart instance
            chartInstanceRef.current = new Chart(ctx, {
                type: 'doughnut',
                data: props.lineChartData,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#041f39' // Change y-axis text color
                            }
                        },
                        x: {
                            ticks: {
                                color: '#041f39' // Change x-axis text color
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#041f39' // Change legend text color
                            }
                        }
                    }
                }
            });
        }

        // Cleanup on unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [props.lineChartData]);

    return (
        <div className='p-3 w-full'>
            <h4 className='text-2xl'>Current Success Rate</h4>
            <canvas ref={chartRef} />
        </div>
    );
}

export default PieChart;
