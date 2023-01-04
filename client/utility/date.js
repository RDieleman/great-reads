const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Juli",
    "Aug",
    "Sep",
    'Oct',
    "Nov",
    "Dec"
]

const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thur",
    "Fri",
    "Sat",
    "Sun"
]


export const formatDateString = (date) => {
    const d = new Date(date);

    return `${days[d.getUTCDay()]}, ${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}