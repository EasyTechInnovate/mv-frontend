/**
 * Converts an array of objects to a CSV string.
 * @param {Array<Object>} data The data to convert.
 * @param {Array<{key: string, label: string}>} headers The headers for the CSV file.
 * @returns {string} The CSV string.
 */
const jsonToCsv = (data, headers) => {
  const csvRows = [];
  // Add headers
  csvRows.push(headers.map((h) => h.label).join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header.key];
      let stringValue = (value === null || value === undefined) ? "" : String(value);

      // Add a single quote prefix for values that look like numbers but should be treated as text by Excel
      // This specifically targets potential Aadhaar/PAN numbers or other long numeric IDs
      const keyLowerCase = header.key.toLowerCase();
      if (
        stringValue.length > 0 &&
        !isNaN(Number(stringValue)) && // Check if it can be parsed as a number
        (keyLowerCase === 'aadhaar' || keyLowerCase === 'pan' || keyLowerCase.includes('id') || keyLowerCase.includes('number')) // Heuristic for identifier fields
      ) {
        stringValue = `'${stringValue}`;
      }
      const escaped = stringValue.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

/**
 * Triggers a download of a CSV file.
 * @param {string} filename The name of the file to download.
 * @param {string} csvString The CSV content.
 */
export const exportToCsv = (filename, csvString) => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default jsonToCsv;
