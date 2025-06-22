import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

const BarChart = (props) => {
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
                type: 'bar',
                data: props.lineChartData,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            display: false, // Hide y-axis
                            beginAtZero: true,
                            ticks: {
                                color: '#041f39', // Change y-axis text color
                                padding: 10,
                            }
                        },
                        x: {
                            display: true, // Hide x-axis
                            ticks: {
                                padding: 10,
                                color: '#041f39' // Change x-axis text color
                            },
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                color: '#041f39', // Change legend text color
                                layout: {
                                    padding: 100,
                                }
                            },
                            padding: 100,
                        },
                    },
                    layout: {

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
        <div className='bg-dark text-blue p-3 w-full'>
            <h4 className='text-2xl mb-28'>Current Success Rate</h4>
            <canvas ref={chartRef} />
        </div>
    );
}

export default BarChart;
