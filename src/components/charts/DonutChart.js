import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import PropTypes from 'prop-types';
import React from 'react'

const DonutChart = ({
    value = 0,
    color = "#4CAF50",
    restColor = "#E0E0E0",
    size = 100
}) => {

    const data = [
        { label: "progress", value },
        { label: "rest", value: 100 - value },
    ];

    const center = size / 2;
    const innerRadius = size / 2 - 15;
    const outerRadius = size / 2;

    return (
        <svg width={size} height={size}>
            <Group top={center} left={center}>
                <Pie
                    data={data}
                    pieValue={(d) => d.value}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    cornerRadius={3}
                >
                    {(pie) =>
                        pie.arcs.map((arc, i) => {
                            const fill =
                                arc.data.label === "progress" ? color : restColor;
                            return (
                                <path
                                    key={i}
                                    d={pie.path(arc) ?? undefined}
                                    fill={fill}
                                />
                            );
                        })
                    }
                </Pie>
                <text
                    textAnchor="middle"
                    dy=".33em"
                    fontSize={16}
                    fontWeight="bold"
                >
                    {value}%
                </text>
            </Group>
        </svg>
    );
};

export default DonutChart

DonutChart.propTypes = {
    value: PropTypes.oneOfType(
        [PropTypes.number, PropTypes.string]
    ).isRequired,
    color: PropTypes.string,
    restColor: PropTypes.string,
    size: PropTypes.number,
};