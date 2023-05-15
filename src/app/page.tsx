'use client'
import React from 'react'
import styled from 'styled-components'
import {AppVariables, useApp} from "@component/context";
import {TaskListing} from "@component/app/TaskListing";
import {Modals} from "@component/app/Modals";

export default function Home() {
    const { dispatch: AppDispatch } = useApp()

  return (
    <Wrapper>
      <HeaderWrapper>
          <HeaderText>Tasks</HeaderText>

          <HeaderButton
              onClick={() => AppDispatch({ type: AppVariables.MODAL, modalValue: true, currentModal: AppVariables.ADD_TASK })}
          >
              Create new task
          </HeaderButton>
      </HeaderWrapper>
      <Modals />
      <TaskListing />
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

const HeaderButton = styled.button`
  font-size: 14px;
  line-height: normal;
  height: 36px;
  padding: 0 16px 0 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: rgb(255, 255, 255);
  background-color: rgb(201, 94, 190);
`
