import { render, fireEvent, screen } from "@testing-library/react";
import {EditTask} from "@component/app/EditTask";

describe("EditTask", () => {
    it("submits the form with the correct values", () => {
        const mockDispatch = jest.fn();
        const mockState = {
            currentEditingTask: {
                name: "ThugDeveloper",
                totalDuration: 5,
                totalTimeSpent: { hours: 1, minutes: 30, seconds: 0 },
                validDate: new Date(2022, 5, 14),
                timeLeft: 100000,
            },
            modal: true,
        };
        jest.mock("@component/context", () => ({
            useApp: () => ({
                state: mockState,
                dispatch: mockDispatch,
            }),
        }));

        render(<EditTask />);
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: "Bakare Oyindamola" },
        });
        fireEvent.change(screen.getByLabelText(/time estimate/i), {
            target: { value: 4 },
        });
        fireEvent.change(screen.getByLabelText(/hours/i), {
            target: { value: 2 },
        });
        fireEvent.change(screen.getByLabelText(/minutes/i), {
            target: { value: 0 },
        });
        fireEvent.change(screen.getByLabelText(/seconds/i), {
            target: { value: 30 },
        });

        fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

        expect(mockDispatch).toHaveBeenCalledWith({
            type: "MODAL",
            modalValue: false,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
            type: "EDIT_TASK",
            editingData: {
                ...mockState.currentEditingTask,
                autoStart: false,
                updatedAt: expect.any(Date),
                validDate: expect.any(Date),
                name: "Bakare Oyindamola",
                totalDuration: 5,
                startTime: expect.any(Number),
                endTime: expect.any(Number),
                currentPauseTime: 0,
                totalTimeTrackedInMilliseconds: expect.any(Number),
                totalTimeSpent: { hours: 2, minutes: 0, seconds: 30 },
            },
        });
    });
});
