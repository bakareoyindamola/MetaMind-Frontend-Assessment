import React, {useState} from 'react'
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import {AnimatePresence, motion} from "framer-motion"
import styled from 'styled-components'
import {AppVariables, useApp} from "@component/context";
import {checkDateAgainstCurrentTime} from "@component/utils/checkDate";

export const EditTask = () => {
    const { state: AppState, dispatch: AppDispatch } = useApp()
    const [taskName, setTaskName] = useState<string>(AppState.currentEditingTask?.name || "");
    const [trackTime, setTrackTime] = useState<string>(String(AppState.currentEditingTask?.totalDuration) || "");
    const [trackedTime, setTrackedTime] = useState<{ hours: string, minutes: string, seconds: string }>({
        hours: `${('0' + AppState.currentEditingTask?.totalTimeSpent.hours).slice(-2)}` || "0",
        minutes: `${('0' + AppState.currentEditingTask?.totalTimeSpent.minutes).slice(-2)}` || "0",
        seconds: `${('0' + AppState.currentEditingTask?.totalTimeSpent.seconds).slice(-2)}` || "0"
    });
    const [date, onChangeDate] = useState(new Date(AppState.currentEditingTask?.validDate || 0));

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        if(AppState.currentEditingTask) {
            const totalSeconds = Number(trackedTime.hours) * 3600 + Number(trackedTime.minutes) * 60 + Number(trackedTime.seconds);
            const totalMilliSeconds = totalSeconds * 1000;

            if(totalMilliSeconds < AppState.currentEditingTask.timeLeft) {
                AppDispatch({ type: AppVariables.MODAL, modalValue: false })
                AppDispatch({
                    type: AppVariables.EDIT_TASK,
                    editingData: {
                        ...AppState.currentEditingTask,
                        autoStart: date.getTime() <= new Date().getTime(),
                        updatedAt: new Date(),
                        validDate: date,
                        name: taskName,
                        totalDuration: Number(trackTime),
                        startTime: date.getTime(),
                        endTime: date.getTime() + (trackTime*60*60*1000),
                        timeLeft: (date.getTime() + (trackTime*60*60*1000)) - date.getTime(),
                        currentPauseTime: 0,
                        totalTimeTrackedInMilliseconds: totalMilliSeconds,
                        totalTimeSpent: {
                            hours: Number(trackedTime.hours),
                            minutes: Number(trackedTime.minutes),
                            seconds: Number(trackedTime.seconds),
                        },
                    }
                })
            } else {
                console.log("Total Duration cannot be greater than time estimate")
            }
        }

    }

    return (
        <AnimatePresence>
            {AppState.modal && <Wrapper
                key="modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <InnerWrapper>
                    <ContentWrapper>
                        <CloseButton
                            type="button"
                            onClick={() => AppDispatch({ type: AppVariables.MODAL, modalValue: false })}
                        >
                            X
                        </CloseButton>
                        <HeaderText>Edit Task</HeaderText>

                        <form onSubmit={handleSubmit}>
                            <LabelWrapper>
                                <LabelText>
                                    Name
                                    <InputWrapper>
                                        <Input
                                            value={taskName}
                                            onChange={e => setTaskName(e.target.value)}
                                            without_border='true'
                                        />
                                    </InputWrapper>
                                </LabelText>
                            </LabelWrapper>
                            <LabelWrapper>
                                <LabelText>
                                    Time estimate
                                    <InputWrapper>
                                        <CustomizedInput>
                                            <Input
                                                value={trackTime}
                                                onChange={e => setTrackTime(e.target.value)}
                                                type="number"
                                                without_border="false"
                                            />
                                            <Span>hours</Span>
                                        </CustomizedInput>
                                    </InputWrapper>
                                </LabelText>
                            </LabelWrapper>
                              <LabelWrapper>
                                <LabelText>
	                                Duration
	                                <FlexWrapper>
		                                <InputWrapper>
			                                <CustomizedInput>
				                                <Input
					                                value={trackedTime.hours}
					                                onChange={e => setTrackedTime({
                                                        ...trackedTime,
                                                        hours: ("0" + e.target.value).slice(-2)
                                                    })}
					                                type="number"
					                                without_border="false"
                                                    maxLength={2}
				                                />
				                                <Span>hours</Span>
			                                </CustomizedInput>
		                                </InputWrapper>
		                                <InputWrapper>
			                                <CustomizedInput>
				                                <Input
					                                value={trackedTime.minutes}
										            onChange={e => setTrackedTime({
                                                        ...trackedTime,
                                                        minutes: ("0" + e.target.value).slice(-2)
                                                    })}
					                                type="number"
					                                without_border="false"
										            maxLength={2}
				                                />
				                                <Span>minutes</Span>
			                                </CustomizedInput>
		                                </InputWrapper>
		                                <InputWrapper>
			                                <CustomizedInput>
				                                <Input
					                                value={trackedTime.seconds}
										            onChange={e => setTrackedTime({
                                                        ...trackedTime,
                                                        seconds: ("0" + e.target.value).slice(-2)
                                                    })}
					                                type="number"
					                                without_border="false"
										            maxLength={2}
				                                />
				                                <Span>seconds</Span>
			                                </CustomizedInput>
		                                </InputWrapper>
	                                </FlexWrapper>
                                </LabelText>
                              </LabelWrapper>
	                        <Calendar
                              onChange={(e) => {
                                  onChangeDate(checkDateAgainstCurrentTime(e) ? AppState.currentEditingTask?.validDate : e)
                              }}
                              value={date}
                            />

                            <Button
                                disabled={taskName === ""}
                                type="submit"
                            >
                                save
                            </Button>
                        </form>
                    </ContentWrapper>
                </InnerWrapper>
            </Wrapper>}
        </AnimatePresence>
    )
}

const Wrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(44, 19, 56, 0.7);
  z-index: 1000;
`

const InnerWrapper = styled.div`
  position: absolute;
  top: 100px;
  left: 40px;
  right: 40px;
  margin: 0 auto;
  outline: none;
  padding: 0;
  width: 360px;
  border-radius: 8px;
  background-color: #FFF;
`

const ContentWrapper = styled.div`
  padding: 20px;
  position: relative;
`

const HeaderText = styled.h1`
  font-size: 14px;
  line-height: 1.64;
  font-weight: 500;
  margin-bottom: 25px;
`

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
  cursor: pointer;
  border-top-right-radius: 8px;
  background: transparent;
  color: #000;
`;

const LabelWrapper = styled.div``

const LabelText = styled.label`
  color: rgb(44, 19, 56);
  font-size: 11px;
  line-height: normal;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: block;
`

const InputWrapper = styled.div`
  margin: 10px 0;
`

const Input = styled.input<{ without_border: string }>`
  width: 100%;
  font-size: 14px;
  border-radius: 8px;
  box-shadow: none;
  padding: 9px 11px;
  ${({ without_border }) => without_border !== "false" ? `border: 1px solid rgb(241, 240, 242)` : 'border: none'}
`
const CustomizedInput = styled.div`
  border: 1px solid rgb(241, 240, 242);
  border-radius: 8px;
  display: flex;
  align-items: center;
`

const Button = styled.button`
  margin-top: 15px;
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: rgb(255, 255, 255);
  background-color: rgb(201, 94, 190);
  text-align: center;
  font-size: 14px;
  text-transform: capitalize;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`

const Span = styled.span`
  color: rgb(115, 96, 123);
  font-size: 14px;
  display: block;
  padding: 0 10px;
  text-transform: lowercase;
`

const FlexWrapper = styled.div`
  display: flex;
  gap: 3px;
  
  span {
    font-size: 10px;
    padding: 0 5px;
  }
`
