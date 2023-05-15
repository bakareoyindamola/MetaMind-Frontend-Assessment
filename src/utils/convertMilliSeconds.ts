export const convertMilliSeconds = (totalTimeTrackedInMilliseconds: number) => {
    const totalTimeTrackedInSeconds = totalTimeTrackedInMilliseconds / 1000;
    const hours = Math.floor(totalTimeTrackedInSeconds / 3600);
    const minutes = Math.floor((totalTimeTrackedInSeconds % 3600) / 60);
    const seconds = totalTimeTrackedInSeconds % 60;

    return {
        hours,
        minutes,
        seconds
    }
}
