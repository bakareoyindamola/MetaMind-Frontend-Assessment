'use client'
import React, {createContext, Dispatch, ReducerState, useContext, useReducer} from 'react'
import {type ActionType, type AppContextProps, type AppData, type Task} from './AppContext.types'
import {convertMilliSeconds} from "@component/utils/convertMilliSeconds";

const initialState: AppData = {
    currentModal: "",
    modal: false,
    task: [],
    currentEditingTask: null
}

export const AppVariables = {
    MODAL: 'MODAL',
    ADD_TASK: 'ADD_TASK',
    EDIT_TASK: 'EDIT_TASK',
    SET_EDITING_TASK: 'SET_EDITING_TASK',
    PAUSE_TIMER: 'PAUSE_TIMER',
    UPDATE_TIME_TRACKED: "UPDATE_TIME_TRACKED"
}

const reducer = (state: AppData, action: ActionType) => {
    switch (action.type) {
        case AppVariables.MODAL: {
            return {
                ...state,
                modal: action.modalValue || false,
                currentModal: action.currentModal || ""
            }
        }
        case AppVariables.ADD_TASK: {
            if (action.task) {
                let tempStartDate: Date = new Date(action.task.createdAt);
                let tempStartTime: number = 0;
                let tempEndTime: number = 0;
                let tempTimeLeft: number = 0;

                tempStartTime = action.task.createdAt.getTime()
                tempStartDate = new Date(action.task.createdAt);
                tempEndTime = new Date(new Date(action.task.createdAt).setHours(tempStartDate.getHours() + action.task.totalDuration)).getTime();
                tempTimeLeft = tempEndTime - tempStartTime

                return {
                    ...state,
                    addTaskModal: false,
                    task: [
                        ...state.task,
                        {
                            ...action.task,
                            startTime: tempStartTime,
                            endTime: tempEndTime,
                            timeLeft: tempTimeLeft,
                            updatedAt: action.task.createdAt,
                            validDate: action.task.createdAt,
                            pausedAt: [],
                            startedAt: [],
                            totalTimeSpent: {
                                hours: 0,
                                minutes: 0,
                                seconds: 0
                            },
                            totalTimeTrackedInMilliseconds: 0
                        }
                    ]
                }
            }

            return {
                ...state
            }
        }
        case AppVariables.UPDATE_TIME_TRACKED: {
            let task = state.task;
            let currentDataIndex = state.task.findIndex((item: Task) => item.id === action.updateData?.id)
            if(currentDataIndex !== -1) {
                let currenData: Task = { ...state.task[currentDataIndex] }
                const { hours, seconds, minutes } = convertMilliSeconds(action.updateData?.currentTimeTrackedInMilliseconds || 0)
                currenData = {
                    ...currenData,
                    totalTimeSpent: {
                        hours: hours,
                        minutes: minutes,
                        seconds: Number(seconds.toFixed(0)),
                    },
                    currentTimeTrackedInMilliseconds: action.updateData?.currentTimeTrackedInMilliseconds || 0,
                }

                task[currentDataIndex] = currenData
            }

            return {
                ...state,
                task: [...task]
            }
        }
        case AppVariables.PAUSE_TIMER: {
            if(action.pauseData) {
                let task = state.task;
                let currentDataIndex = state.task.findIndex((item: Task) => item.id === action.pauseData.id)
                if(currentDataIndex !== -1) {
                    let currenData: Task = { ...state.task[currentDataIndex] }
                    const { hours, seconds, minutes } = convertMilliSeconds(action.pauseData.currentTimeTrackedInMilliseconds + currenData.totalTimeTrackedInMilliseconds || 0)
                    currenData = {
                        ...currenData,
                        pausedAt: [...currenData.pausedAt, action.pauseData.pausedDate],
                        startedAt: [...currenData.pausedAt, action.pauseData.startedDate],
                        validDate: action.pauseData.startedDate || currenData.validDate,
                        totalTimeTrackedInMilliseconds: action.pauseData.pausedDate
                            ? action.pauseData.currentTimeTrackedInMilliseconds + currenData.totalTimeTrackedInMilliseconds
                            : currenData.totalTimeTrackedInMilliseconds,
                        currentTimeTrackedInMilliseconds: 0,
                        totalTimeSpent: {
                            hours: action.pauseData.pausedDate ? hours : currenData.totalTimeSpent.hours,
                            minutes: action.pauseData.pausedDate ? minutes : currenData.totalTimeSpent.minutes,
                            seconds: action.pauseData.pausedDate
                                ? Number(seconds.toFixed(0))
                                : Number(currenData.totalTimeSpent.seconds.toFixed(0)),
                        },
                    }

                    task[currentDataIndex] = currenData
                }

                return {
                    ...state,
                    task: [...task]
                }
            }

            return {
                ...state
            }
        }
        case AppVariables.SET_EDITING_TASK: {
            const { hours, seconds, minutes } = convertMilliSeconds(action.editingData?.totalTimeTrackedInMilliseconds || 0)

            return {
                ...state,
                currentEditingTask: {
                    ...action.editingData,
                    totalTimeSpent: {
                        hours: hours,
                        minutes: minutes,
                        seconds: Number(seconds.toFixed(0)),
                    }
                }
            }
        }
        case AppVariables.EDIT_TASK: {
            let task = state.task;
            let currentDataIndex = state.task.findIndex((item: Task) => item.id === action.editingData?.id)

            if(currentDataIndex !== -1) {
                task[currentDataIndex] = action.editingData
            }

            return {
                ...state,
                task: [...task]
            }
        }
        default: {
            throw Error('Unknown action: ' + action.type)
        }
    }
}

const AppContext = createContext<{ state: AppData; dispatch: Dispatch<ActionType>; }>({ state: initialState, dispatch: () => null })

export const AppProvider = ({ children }: AppContextProps) => {
    const [state, dispatch] = useReducer(reducer, initialState as ReducerState<AppData>)

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    return useContext(AppContext)
}
