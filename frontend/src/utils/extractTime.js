export function extractTime(dateString){
    const date  = new Date(dateString);
    const hour  = padZero(date.getHours());
    const minutes  = padZero(date.getMinutes());
    return `${hour}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
} 