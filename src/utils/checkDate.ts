export const checkDateAgainstCurrentTime = (date: Date) => {
    const initialSelectedTime = new Date(date);
    const selectedTimeOffset = initialSelectedTime.getTimezoneOffset();
    const selectedTime = new Date(initialSelectedTime.getTime() - (selectedTimeOffset * 60 * 1000));
    const selectedTimeISOString = selectedTime.toISOString().slice(0, 10)
    const currentTimeISOString = new Date().toISOString().slice(0, 10)

    return selectedTimeISOString === currentTimeISOString
}
