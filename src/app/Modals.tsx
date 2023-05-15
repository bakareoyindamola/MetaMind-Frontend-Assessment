import React from 'react'
import {AppVariables, useApp} from "@component/context";
import {AddTask} from "@component/app/AddTask";
import {EditTask} from "@component/app/EditTask";

export const Modals = () => {
    const { state: AppState } = useApp()

    if(AppState.modal && AppState.currentModal === AppVariables.ADD_TASK) {
        return <AddTask />
    }

    if(AppState.modal && AppState.currentModal === AppVariables.EDIT_TASK) {
        return <EditTask />
    }

    return <div />
}
