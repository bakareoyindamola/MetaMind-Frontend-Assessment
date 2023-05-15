import { type ReactNode } from 'react'

export type AppContextProps = {
    children: ReactNode
}

export type ActionType = {
    type: string;
    currentModal?: string;
    modalValue?: boolean
    task?: TaskCreation
    updateData?: {
        id: string
        currentTimeTrackedInMilliseconds: number
    }
    pauseData?: {
        id: string
        pausedDate?: Date
        startedDate?: Date
        currentTimeTrackedInMilliseconds?: number
    }
    editingData?: Task
};

export type TaskCreation = {
    id: string
    name: string
    totalDuration: Number
    createdAt: Date
    autoStart: boolean
}

export type Task = {
    id: string
    name: string
    totalDuration: Number
    createdAt: Date
    updatedAt: Date
    validDate: Date
    startTime: number
    endTime: number
    timeLeft: number
    autoStart: boolean
    pausedAt: Date[] | []
    startedAt: Date[] | []
    totalTimeSpent: {
        hours: number
        minutes: number
        seconds: number
    }
    totalTimeTrackedInMilliseconds: number
    currentTimeTrackedInMilliseconds: number
}

export type AppData = {
    currentModal: string
    modal: boolean
    task: [] | Task[]
    currentEditingTask: Task | null
}
