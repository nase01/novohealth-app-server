const isDate = (input) => {
    // Regular expression to match YYYY-MM-DD format
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  
    if (!dateRegex.test(input)) return false;
  
    const [year, month, day] = input.split('-').map(Number);
    const date = new Date(year, month - 1, day);
  
    // Check if the date object matches input (handles cases like 2023-02-30)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };
  
  module.exports = {
    isDate
  };