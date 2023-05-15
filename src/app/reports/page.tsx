'use client'
import React, {useState} from 'react'
import styled from 'styled-components'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {useApp} from "@component/context";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Reports() {
    const { state, dispatch: AppDispatch } = useApp()

    const groupByDay = state.task.length > 0 && state.task.reduce((group, task) => {
        const { validDate } = task;
        group[validDate.toDateString()] = group[validDate.toDateString()] ?? [];
        group[validDate.toDateString()].push(task);
        return group;
    }, {});

    const [currentLabel, setCurrentLabel] = useState<string[]>(Object.keys(groupByDay))

    const data = {
        labels: currentLabel,
        datasets: [
            {
                label: 'Weekly Summary',
                data: Object.keys(groupByDay).map((item) => {
                    return groupByDay[item].reduce((group, task) => {
                        const { totalTimeTrackedInMilliseconds } = task;

                        // Currently only filtering by seconds
                        if (totalTimeTrackedInMilliseconds > group) {
                            group = totalTimeTrackedInMilliseconds
                        }

                        return group
                    }, 0)
                }),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const options = {
        type: 'bar',
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'This Week',
            },
        },
    };

    return (
        <Wrapper>
            <HeaderWrapper>
                <HeaderText>Reports</HeaderText>
            </HeaderWrapper>
            <BarWrapper>
                <Bar options={options} data={data} />
            </BarWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.main``

const HeaderWrapper = styled.div`
  padding: 0 20px;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgrey;
  box-shadow: rgba(44, 19, 56, 0.13) 0 2px 6px 0;
  position: sticky;
  width: 100%;
`

const HeaderText = styled.h2`
  color: rgb(44, 19, 56);
  font-size: 16px;
  line-height: 1.3;
  font-weight: 600;
`

const BarWrapper = styled.div`
  height: 800px;
  width: 100%;
`
