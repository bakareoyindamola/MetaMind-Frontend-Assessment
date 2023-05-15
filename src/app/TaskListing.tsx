'use client'
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {AppVariables, useApp} from "@component/context";
import {Task} from "@component/context/AppContext/AppContext.types";
import {formatAMPM} from "@component/utils/formatAMPM";
import {convertMilliSeconds} from "@component/utils/convertMilliSeconds";

const TaskList = ({value}: { value: Task }) => {
    const { state, dispatch: AppDispatch } = useApp()
    const [active, setActive] = useState<boolean>(value.autoStart)
    const [currentTimeTracked, setCurrentTimeTracked] = useState<number>(0)

    useEffect(() => {
        let id;
        if(active && value.autoStart) {
            id = setInterval(() => {
                const currentTimeTrackedInMilliseconds = Date.parse(new Date().toISOString()) - Date.parse(value.validDate.toISOString())

                setCurrentTimeTracked(currentTimeTrackedInMilliseconds)

                if(value.timeLeft > 0) {
                    AppDispatch({
                        type: AppVariables.UPDATE_TIME_TRACKED,
                        updateData: {
                            id: value.id,
                            currentTimeTrackedInMilliseconds
                        }
                    })
                }

            }, 1000)
        }

        return () => clearInterval(id)
    }, [active, state])

    return (
        <TableBodyRow>
            <TableBody>
                <span>{value.name}</span>
            </TableBody>
            <TableBody>
                <span>
                    {new Intl.DateTimeFormat('en-GB', {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                    }).format(new Date(String(value.validDate)))}
                </span>
            </TableBody>
            <TableBody>
                <span>{("0" + value.totalTimeSpent.hours).slice(-2)} : {("0" + value.totalTimeSpent.minutes).slice(-2)} : {("0" + value.totalTimeSpent.seconds).slice(-2)}</span>
            </TableBody>
            <TableBody>
                <span>{formatAMPM(value.startTime)} - {formatAMPM(value.endTime)} </span>
            </TableBody>
            <TableBody>
                <div>
                    {value.autoStart && <OptionButton
	                    onClick={() => {
                          setActive(value => !value)
                            if(active) {
                                AppDispatch({
                                    type: AppVariables.PAUSE_TIMER,
                                    pauseData: {
                                        id: value.id,
                                        pausedDate: new Date(),
                                        currentTimeTrackedInMilliseconds: currentTimeTracked,
                                    }
                                })
                            } else {
                                AppDispatch({
                                    type: AppVariables.PAUSE_TIMER,
                                    pauseData: {
                                        id: value.id,
                                        startedDate: new Date(),
                                    }
                                })
                            }
                      }}
                    >
                        {active ? "Take a break" : "Start"}
                    </OptionButton>}
                    <OptionButton
                        onClick={() => {
                            AppDispatch({ type: AppVariables.MODAL, modalValue: true, currentModal: AppVariables.EDIT_TASK })
                            AppDispatch({ type: AppVariables.SET_EDITING_TASK, editingData: {
                                    ...value,
                                    currentTimeTrackedInMilliseconds: currentTimeTracked,
                                }
                            })
                        }}
                    >
                        Edit
                    </OptionButton>
                </div>
            </TableBody>
        </TableBodyRow>
    )
}

export const TaskListing = () => {
    const { state: AppState } = useApp()

    return (
        <Wrapper>
            <thead>
                <tr>
                    <TableHead>
                        <span>Task Name</span>
                    </TableHead>
                    <TableHead>
                        <span>Date</span>
                    </TableHead>
                    <TableHead>
                        <span>Tracking Time</span>
                    </TableHead>
                    <TableHead>
                        <span>Time Duration</span>
                    </TableHead>
                    <TableHead></TableHead>
                </tr>
            </thead>
            <tbody>
            {AppState.task.length > 0 && AppState.task.map((value: Task) => {
                return (
                    <TaskList key={value.id} value={value} />
                )
            })}
            </tbody>
        </Wrapper>
    )
}

const Wrapper = styled.table`
  width: 100%;
  border-radius: 0;
  padding: 0;
  background-color: rgb(255, 255, 255);
  border-top: none;
  border-collapse: initial;
  box-shadow: rgb(235, 231, 235) 0 -1px 0 0 inset;
  table-layout: fixed;
  border-spacing: 0;
  margin-top: 50px;
`

const TableHead = styled.th`
  height: 50px;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  vertical-align: middle;
  color: rgb(115, 96, 123);
  cursor: default;
  text-transform: uppercase;
  box-shadow: rgb(235, 231, 235) 0 -1px 0 0 inset;
  text-align: left;
  
  &:first-of-type {
    padding-left: 20px;
  }
`

const TableBodyRow = styled.tr`
  @media (hover: hover) {
    & > td:last-of-type div {
      opacity: 0;
    }
  }

  &:hover {
    & > td:last-of-type div {
      opacity: 1;
    }
  }
`

const TableBody = styled.td`
  vertical-align: middle;
  box-shadow: rgb(235, 231, 235) 0px -1px 0 0 inset;
  line-height: normal;
  min-width: 0;
  height: auto;
  overflow: hidden;
  padding: 10px;
  white-space: nowrap;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  
  div {
    transition: opacity 0.3s;
  }
  
  &:first-of-type {
    padding-left: 20px;
  }
`

const OptionButton = styled.button`
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 10px;
  background-color: rgb(243, 239, 237);
  color: rgb(44, 19, 56);
  font-size: 12px;
  cursor: pointer;
`

