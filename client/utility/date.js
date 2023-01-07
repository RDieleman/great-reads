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
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thur",
    "Fri",
    "Sat"
]


export const formatDateString = (date) => {
    const d = new Date(date);

    return `${days[d.getUTCDay()]}, ${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}