export function convertToDate(isoString: string) {
  const date = new Date(isoString);
  return date.toISOString().split('T')[0]; // Extract the date part in YYYY-MM-DD format
}

export function getCommaSeparatedNumbers(numbersObject: object) {
  // Check if any of the values in the numbers object are null
  const numberArray = Object.values(numbersObject || {}).map((value) =>
    value === null ? '-' : value
  );

  return numberArray.length === 0 || numberArray.every((val) => val === '-')
    ? '-'
    : numberArray.join(', ');
}

export function toReadableFormat(input: string): string {
  // Replace dashes with spaces and capitalize the first letter of each word
  return input
    .split('-') // Split the string by dash
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter
    .join(' '); // Join the words with a space
}
