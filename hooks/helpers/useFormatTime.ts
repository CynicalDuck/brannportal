export default function useFormatTime(minutes: number) {
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes} minutes`;
    } else {
        return `${minutes} minutes`;
    }
}