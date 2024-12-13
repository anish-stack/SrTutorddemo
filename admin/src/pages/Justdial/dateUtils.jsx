export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  export const isDateInRange = (date, startDate, endDate) => {
    if (!startDate && !endDate) return true;
    const checkDate = new Date(date).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    return checkDate >= start && checkDate <= end;
  };