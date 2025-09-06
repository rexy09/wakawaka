import { DateValue } from "@mantine/dates";

export function useUtilities() {
  const getFormattedDate = (value: DateValue) => {
    let formattedDate: string = "";
    if (value !== null) {
      const date =
        value?.getDate() < 10 ? `0${value?.getDate()}` : value?.getDate();
      const month =
        value && value.getMonth() + 1 < 10
          ? `0${value?.getMonth() + 1}`
          : value?.getMonth() + 1;
      formattedDate = `${value?.getFullYear()}-${month}-${date}`;
    } else {
      formattedDate = "";
    }

    return formattedDate;
  };

  function isDateRangeValid(fromDate: string, toDate: string) {
    // Parse the date strings into Date objects
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Check if the toDate is not earlier than the fromDate
    if (toDateObj < fromDateObj) {
      return false;
    }

    // If all checks pass, the dates are considered valid
    return true;
  }

  const capitalize = (str: string, lower = false) =>
    (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
      match.toUpperCase()
    );

  const getISODateTimeString = () => {
    const date = new Date();
    const pad = (num: number) => String(num).padStart(2, "0");
    const localISODate = `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
      date.getMinutes()
    )}:${pad(date.getSeconds())}`;
    
    return localISODate;
  };

  return {
    getFormattedDate,
    isDateRangeValid,
    capitalize,
    getISODateTimeString,
  };
}

// export function useResponseHandler() {
//   const notifyError = (text: string) => toast.error(text);

//   const notifySuccess = (text: string) => toast.success(text);

//   const handleFromErrorResponse = (data: any, form: any) => {
//     for (const field in data.errors) {
//       if (data.errors.hasOwnProperty(field)) {
//         const fieldErrors = data.errors[field];
//         // Iterate over the array of error messages for the current field
//         for (const errorMessage of fieldErrors) {
//           toast.error(errorMessage);
//           form.setFieldError(field, errorMessage);

//           // errorMessages.push(`${field}: ${errorMessage}`);
//         }
//       }
//     }
//   };

//   const handleErrorResponse = (data: any) => {
//     for (const field in data.errors) {
//       if (data.errors.hasOwnProperty(field)) {
//         const fieldErrors = data.errors[field];
//         // Iterate over the array of error messages for the current field
//         for (const errorMessage of fieldErrors) {
//           toast.error(errorMessage);
//         }
//       }
//     }
//   };

//   return {
//     handleFromErrorResponse,
//     handleErrorResponse,
//     notifyError,
//     notifySuccess,
//   };
// }

export function convertMetersToKilometers(meters: number): string {
  if (meters < 0) {
    throw new Error("Distance cannot be negative");
  }

  const kilometers = meters / 1000;
  return `${kilometers.toFixed(2)} km`;
}

export function convertSecondsToReadableTime(secondsStr: string): string {
  const seconds = parseInt(secondsStr, 10);

  if (isNaN(seconds) || seconds < 0) {
    throw new Error(
      "Invalid input: time must be a positive number in string format"
    );
  }

  // Convert seconds to minutes
  const totalMinutes = Math.floor(seconds / 60);

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const remainingMinutes = totalMinutes % 60;

  let result = "";
  if (days > 0) {
    result += `${days} day${days > 1 ? "s" : ""} `;
  }
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""} `;
  }
  if (remainingMinutes > 0 || result === "") {
    result += `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
  }

  return result.trim();
}
export function timestampToISO(seconds: number, nanoseconds: number): string {
  // Validate inputs
  if (typeof seconds !== "number" || typeof nanoseconds !== "number") {
    throw new Error("Seconds and nanoseconds must be numbers");
  }

  // Convert to milliseconds
  const milliseconds: number = seconds * 1000 + nanoseconds / 1000000;

  // Create Date object
  const date: Date = new Date(milliseconds);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid timestamp");
  }

  // Return ISO 8601 formatted string
  return date.toISOString();
}
export function formatDateTime(
  dateTimeStr: string,
  formatType: "short" | "long" = "short"
): string {
  const date = new Date(dateTimeStr);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const options: Intl.DateTimeFormatOptions =
    formatType === "long"
      ? {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        }
      : {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };

  return date.toLocaleDateString("en-US", options);
}

export function formatOrderStateText(state: string): string {
  return state
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getColorForStateMui(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
    case "bidding":
      return "#3D81DB";
    case "paid":
    case "delivered":
      return "#1C8C3F";
    case "accepted":
      return "rgba(33, 150, 243)"; // MUI blue with 50% opacity
    case "started":
      return "rgba(63, 81, 181)";
    case "delayed":
      return "#DBAA00";
    default:
      return "rgba(244, 67, 54)"; // MUI red with 50% opacity
  }
}
