import React, {useEffect, useState} from 'react'
import {AnimatePresence, motion} from "framer-motion"
import styled from 'styled-components'
import {AppVariables, useApp} from "@component/context";
import { v4 as uuidv4 } from 'uuid';
import Calendar from "react-calendar";
import {checkDateAgainstCurrentTime} from "@component/utils/checkDate";

type ValidationProps = {
    trackTime?: false | { message: string }
    date?: false | { message: string }
}
export const AddTask = () => {
    const { state: AppState, dispatch: AppDispatch } = useApp()
    const [taskName, setTaskName] = useState<string>("");
    const [trackTime, setTrackTime] = useState<string>("");
    const [date, onChangeDate] = useState(new Date());
    const [currentDateIsValid, setCurrentDateIsValid] = useState<boolean>(true);
    const [isOn, setIsOn] = useState(true);
    const [errorObject, setErrorObject] = useState<ValidationProps>({})

    const toggleSwitch = () => {
        setIsOn(value => !value);
    };

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        let validationErrors: null | ValidationProps = null;

        const now = new Date();

        // React Calendar doesn't specify the exact time on the returned date object, so same date here would be false,
        // reason why I had to add the currentDateIsValid check
        if(!currentDateIsValid && new Date(date) < now) {
            validationErrors = {
                ...validationErrors,
                date: { message: 'Start time cannot be in the past' }
            }
        }

        if(Number(trackTime) <= 0) {
            validationErrors = {
                ...validationErrors,
                trackTime: { message: "Estimate time can't be less than 0" }
            }
        }

        if (validationErrors !== null) {
            setErrorObject(validationErrors)
        } else {
            AppDispatch({ type: AppVariables.MODAL, modalValue: false })
            AppDispatch({
                type: AppVariables.ADD_TASK,
                task: {
                    id: uuidv4(),
                    name: taskName,
                    totalDuration: Number(trackTime),
                    createdAt: currentDateIsValid ? new Date() : date,
                    autoStart: currentDateIsValid && isOn
                }
            })
        }
    }

    useEffect(() => {
        // Set date error to false
        setErrorObject({
            ...errorObject,
            date: false
        })

        setCurrentDateIsValid(checkDateAgainstCurrentTime(date))
    }, [date])

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
			            <HeaderText>Add Task</HeaderText>

			            <form onSubmit={handleSubmit}>
				            <LabelWrapper>
					            <LabelText>
						            Name
						            <InputWrapper>
							            <Input
								            value={taskName}
								            onChange={e => setTaskName(e.target.value)}
								            without_border="false"
							            />
						            </InputWrapper>
					            </LabelText>
				            </LabelWrapper>
                          <LabelWrapper>
                            <LabelText>
                              Start Date
                              <CalenderWrapper>
	                              <Calendar
                                    onChange={onChangeDate}
                                    value={date}
                                  />
                                  {errorObject.date && <ErrorMessage>{errorObject.date.message}</ErrorMessage>}
                              </CalenderWrapper>
                            </LabelText>
                          </LabelWrapper>

                            {currentDateIsValid && <LabelWrapper>
	                            <LabelText style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "8px 0 16px" }}>
		                            Start Task Immediately
		                            <input type="checkbox" checked={isOn} onChange={toggleSwitch} />
	                            </LabelText>
                            </LabelWrapper>}

				            <LabelWrapper>
					            <LabelText>
						            Time estimate
						            <InputWrapper>
							            <CustomizedInput>
								            <Input
									            value={trackTime}
									            onChange={e => setTrackTime(e.target.value)}
									            onFocus={() => {
                                                  setErrorObject({
                                                      ...errorObject,
                                                      trackTime: false
                                                  })
                                              }}
									            type="number"
												without_border="true"
								            />
								            <Span>hours</Span>
							            </CustomizedInput>
                                        {errorObject.trackTime && <ErrorMessage>{errorObject.trackTime.message}</ErrorMessage>}
						            </InputWrapper>
					            </LabelText>
				            </LabelWrapper>

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
  margin: 8px 0 16px;
`

const Input = styled.input<{ without_border: string }>`
  width: 100%;
  font-size: 14px;
  border-radius: 8px;
  box-shadow: none;
  padding: 9px 11px;
  ${({ without_border }) => without_border === "false" ? `border: 1px solid rgb(241, 240, 242)` : 'border: none'}
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

const ErrorMessage = styled.span`
  color: rgb(227, 40, 23);
  font-size: 10px;
  font-weight: 500;
  margin: 5px 12px 0;
  text-transform: initial;
  display: inline-block;
`;

const CalenderWrapper = styled.div`
  margin: 8px 0 16px;
`
