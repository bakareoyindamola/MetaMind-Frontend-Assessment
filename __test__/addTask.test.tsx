import "@testing-library/jest-dom";
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AddTask} from "@component/app/AddTask";

describe('renders Add Task modal', () => {
    it('renders add task component', () => {
        render(<AddTask />);
        const header = screen.getByText(/Add Task/i, { exact: true })
        expect(header).toBeInTheDocument();
    });
});

test('saves task on form submission', () => {
    const mockDispatch = jest.fn();
    jest.mock("@component/context", () => ({
        useApp: () => ({
            state: {},
            dispatch: mockDispatch,
        }),
    }));

    const { getByLabelText, getByText } = render(<AddTask />);

    const taskNameInput = getByLabelText(/Name/i);
    userEvent.type(taskNameInput, 'Example Task Name');

    const startDateInput = getByLabelText(/Start Date/i);
    userEvent.click(startDateInput);
    const todayButton = screen.getByRole('button', { name: /today/i });
    fireEvent.click(todayButton);

    const timeEstimateInput = getByLabelText(/Time estimate/i);
    userEvent.type(timeEstimateInput, '2');

    const saveButton = getByText(/save/i);
    fireEvent.click(saveButton);

    expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ADD_TASK',
        task: {
            name: 'Example Task Name',
            totalDuration: 2,
            createdAt: expect.any(Date),
            autoStart: true,
            id: expect.any(String)
        }
    });
});
