

export const parseTimestamp = (time: number) => new Date(time);

export const formatTimestamp = (date: Date) => date.toLocaleDateString("no");