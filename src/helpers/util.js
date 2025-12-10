import axios from "axios";
import { __ } from "@wordpress/i18n";
import { dateI18n, format, getSettings } from "@wordpress/date";

export const useInstance = () => {
  return axios.create({
    baseURL: acadlixOptions?.api_url,
    timeout: acadlixOptions?.max_execution_time ?? 10000,
    headers: {
      Accept: "application/json",
    },
  });
};

export const handleQueryError = (result = {}) => {
  if (result.isError) {
    const code = result?.error?.response?.data?.code;
    const status = result?.error?.response?.status;
    switch (code) {
      case 'rest_cookie_invalid_nonce':
        if (status === 403) {
          window.location.reload();
        }
        break;
      default:
        break;
    }
  }
}

export const handleMutationError = (error = {}) => {
  const code = error?.response?.data?.code;
  const status = error?.response?.status;
  switch (code) {
    case 'rest_cookie_invalid_nonce':
      if (status === 403) {
        window.location.reload();
      }
      break;
    default:
      break;
  }
}

export const hasCapability = (cap) => {
  return window?.acadlixOptions?.capabilities?.[cap] ?? false;
};

export const arrayRandomize = (array) => {
  const shuffledArray = array.slice();

  // Fisher-Yates shuffle algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Check if shuffled array is the same as initial array
  if (arraysEqual(shuffledArray, array)) {
    // If they are the same, recursively shuffle again
    return arrayRandomize(array);
  }

  return shuffledArray;
};

const arraysEqual = (array1, array2) => {
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
};

export const randomizePosition = (array) => {
  let positions = array.map((obj) => obj.position);

  // Shuffle positions array
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Update position values in the original array
  array.forEach((obj, index) => {
    obj.position = positions[index];
  });
  return array;
};

export const secondsToHms = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 9 ? h : "0" + h;
  var mDisplay = m > 9 ? m : "0" + m;
  var sDisplay = s > 9 ? s : "0" + s;
  return hDisplay + ":" + mDisplay + ":" + sDisplay;
};

export const updateQuestions = (questions = [], quiz = {}) => {
  if (Boolean(Number(quiz?.rendered_metas?.quiz_settings?.random_question))) {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }
  if (Boolean(Number(quiz?.rendered_metas?.quiz_settings?.sort_by_subject))) {
    questions = [
      ...questions
        ?.map((a) => {
          let data = { ...a };
          data.subject_name = a?.subject?.subject_name ?? "Uncategorized";
          return data;
        })
        ?.sort((a, b) => a?.subject_name?.localeCompare(b?.subject_name)),
    ];
  }

  if (Boolean(Number(quiz?.rendered_metas?.quiz_settings?.optional_subject)) && quiz?.rendered_metas?.quiz_settings?.subject_times?.length > 0) {
    const optional_subjects = quiz?.rendered_metas?.quiz_settings?.subject_times?.filter(s => s?.optional)?.map(s => s?.subject_id);
    questions = [
      ...questions?.filter(q => !optional_subjects?.includes(q?.subject_id)),
      ...questions?.filter(q => optional_subjects?.includes(q?.subject_id)),
    ];
  }
  if (Boolean(Number(quiz?.rendered_metas?.quiz_settings?.subject_wise_question))) {
    let newQuestion = [];
    quiz?.rendered_metas?.quiz_settings?.subject_times?.forEach(s => {
      const filteredQuestion = questions?.filter(q => q?.subject_id === s?.subject_id);
      newQuestion = [...newQuestion, ...filteredQuestion?.slice(0, s?.specific_number_of_questions)];
    });
    questions = newQuestion;
  }
  return questions;
};

export const updateAnswer = (options = [], random = false, notlast = false) => {
  if (random) {
    if (notlast) {
      const arrayToShuffle = options.slice(0, options.length - 1);
      for (let i = arrayToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayToShuffle[i], arrayToShuffle[j]] = [
          arrayToShuffle[j],
          arrayToShuffle[i],
        ];
      }

      // Combine the shuffled array with the last element
      const shuffledArray = arrayToShuffle.concat(options.slice(-1));

      return shuffledArray;
    }
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }
  return options;
};

export const shuffleArrayBasedOnOrder = (arr, order) => {
  if (arr.length !== order.length) {
    throw new Error(__('Array length and order length must be the same.', 'acadlix'));
  }

  // Create a new array to store shuffled objects
  let shuffledArray = [];

  // Rearrange objects based on desired order
  order.forEach((index) => {
    shuffledArray.push(arr[index]);
  });

  return shuffledArray;
};

// Contain some error
// export const formatPrice = (price = 0, as) => {
//   if (isNaN(price)) return price;

//   // Split the number into the integer and decimal parts
//   let [integerPart, decimalPart] = parseFloat(price)
//     .toFixed(acadlixOptions?.settings?.acadlix_number_of_decimals)
//     .split(".");

//   // Add thousand separators to the integer part
//   integerPart = integerPart.replace(
//     /\B(?=(\d{3})+(?!\d))/g,
//     acadlixOptions?.settings?.acadlix_thousand_separator
//   );

//   // Join the integer and decimal parts with the custom decimal separator
//   return decimalPart
//     ? isNaN(integerPart +
//       acadlixOptions?.settings?.acadlix_decimal_separator +
//       decimalPart)
//       ? integerPart + acadlixOptions?.settings?.acadlix_decimal_separator + decimalPart
//       : Number(integerPart + acadlixOptions?.settings?.acadlix_decimal_separator + decimalPart)
//     : Number(integerPart)
//     ;
// };

export const formatPrice = (price = 0, asString = false) => {
  const num = parseFloat(String(price).replace(/[^0-9.-]/g, ""));
  if (isNaN(num)) return asString ? "0.00" : 0;

  const decimals = acadlixOptions?.settings?.acadlix_number_of_decimals ?? 2;
  const thousandSep = acadlixOptions?.settings?.acadlix_thousand_separator ?? ",";
  const decimalSep = acadlixOptions?.settings?.acadlix_decimal_separator ?? ".";

  const fixed = num.toFixed(decimals);

  if (!asString) {
    // return as clean number
    return parseFloat(fixed);
  }

  // format as string with thousand + decimal separators
  let [integerPart, decimalPart = ""] = fixed.split(".");
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);

  // return `${integerPart}${decimalSep}${decimalPart}`;
  return decimalPart
    ? `${integerPart}${decimalSep}${decimalPart}`
    : integerPart;
};

export const currencyPosition = (price = 0, currency_symbol = '') => {
  let symbol = currency_symbol !== '' ? currency_symbol : acadlixOptions?.currency_symbol;
  let newPrice = formatPrice(price, true);
  // console.log(newPrice);
  // let newPrice = price;
  switch (acadlixOptions?.settings?.acadlix_currency_position) {
    case "Left ( $99.99 )":
      return `${symbol}${newPrice}`;
    case "Right ( 99.99$ )":
      return `${newPrice}${symbol}`;
    case "Left with space ( $ 99.99 )":
      return `${symbol} ${newPrice}`;
    case "Right with space ( 99.99 $ )":
      return `${newPrice} ${symbol}`;
    default:
      return `${symbol}${price}`;
  }
};

export const convertTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  return {
    hours: hours,
    minutes: minutes,
    seconds: secs
  };
}

/**
 * Extracts the YouTube video ID from a given URL.
 *
 * @param {string} [url=""] - The URL to extract the ID from.
 *
 * @returns {string|null} - The YouTube video ID if found, otherwise null.
 */
export const getYouTubeVideoId = (url = "") => {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url?.match(youtubeRegex);
  return match?.[1] ?? null;
};

/**
 * Extracts the Vimeo video ID from a given URL.
 *
 * @param {string} [url=""] - The URL to extract the ID from.
 *
 * @returns {string|null} - The extracted video ID, or null if no match is found.
 */
export const getVimeoVideoId = (url = "") => {
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const match = url?.match(vimeoRegex);
  return match?.[1] ?? null;
};

export const convertToPostDate = (obj) => {
  if (!obj || typeof obj !== "object" || !obj.$isDayjsObject) {
    throw new Error(__('Invalid object. Ensure it\'s a Day.js object.', 'acadlix'));
  }

  if (isNaN(obj.$y) || isNaN(obj.$M) || isNaN(obj.$D) || isNaN(obj.$H) || isNaN(obj.$m) || isNaN(obj.$s)) {
    return "";
  }

  // Extract year, month, day, hour, minute, second
  const year = obj.$y; // Year
  const month = String(obj.$M + 1).padStart(2, "0"); // Month (0-based, so +1)
  const day = String(obj.$D).padStart(2, "0"); // Day
  const hour = String(obj.$H).padStart(2, "0"); // Hour
  const minute = String(obj.$m).padStart(2, "0"); // Minute
  const second = String(obj.$s).padStart(2, "0"); // Second

  // Construct WordPress post_date format
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}


/**
 * Converts a given date string to a Unix timestamp.
 *
 * @param {string} dateString - The date string to convert.
 *
 * @returns {number|false} - The Unix timestamp, or false if the conversion failed.
 */
export const strtotime = (dateString) => {
  if (!dateString) return false;
  const date = format("Y-m-d H:i:s", dateString);
  const timestamp = Date.parse(date);
  return isNaN(timestamp) ? false : timestamp;
}

/**
 * Converts a given date string to a database format.
 *
 * @param {string} date - The date string to convert.
 *
 * @returns {string} - The date in database format (Y-m-d H:i:s).
 */
export const getDbFormatDate = (date) => {
  if (!date) return "";
  const date_time_format = "Y-m-d H:i:s";
  return format(date_time_format, date);
}

/**
 * Converts a given date string to a format based on the user's settings.
 *
 * @param {string} date - The date string to convert.
 *
 * @returns {string} - The formatted date string.
 */
export const getFormatDate = (date, withTime = true) => {
  if (!date) return "";
  const date_settings = getSettings();
  let date_format = date_settings?.formats?.date || "Y-m-d";

  if (withTime) {
    const time_format = date_settings?.formats?.time || "H:i:s";
    date_format = `${date_format} ${time_format}`;
  }
  return format(date_format, date);
}

/**
 * Returns the current date string in the database format.
 *
 * @returns {string} - The current date string in the database format (Y-m-d H:i:s).
 */
export const getCurrentDateString = () => {
  const date_time_format = "Y-m-d H:i:s";
  return strtotime(dateI18n(date_time_format));
}

/**
 * Returns the current offset based on the user's settings.
 *
 * @returns {string} - The current offset based on the user's settings.
 */
export const getOffset = () => {
  const date_settings = getSettings();
  if (date_settings?.timezone?.string) {
    return date_settings?.timezone?.string;
  }

  if (date_settings?.timezone?.offset > 0) {
    return `UTC+${date_settings?.timezone?.offsetFormatted}`;
  } else {
    return `UTC${date_settings?.timezone?.offsetFormatted}`;
  }
}

export const getStripHtml = (html) => {
  let doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

export const nameToInitials = (name) => {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .join("");
}


export const getNumberStep = (step = 2) => {
  if (typeof step !== "number" || Number.isNaN(step) || step <= 0) {
    return 0.01;
  }
  return 1 / Math.pow(10, step);
};

export const convertToUnitPrice = (amount = 0) => {
  if (isNaN(amount)) {
    throw new Error(__("Invalid amount", "acadlix"));
  }
  const decimalPlaces =
    acadlixCheckoutOptions?.settings?.acadlix_number_of_decimals ?? 2;
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(
    Number(
      amount
        .toString()
        .replace(
          acadlixCheckoutOptions?.settings?.acadlix_thousand_separator || "",
          ""
        )
    ) * multiplier
  );
};

export const generateFileName = (name, separator = "_") => {
  return name
    .trim()                                // remove leading/trailing spaces
    .toLowerCase()                         // lowercase
    .replace(/[\s]+/g, separator)          // replace spaces with separator
    .replace(/[^a-z0-9\-_]+/g, "")         // remove all unsafe filename chars
    .replace(new RegExp(`${separator}+`, "g"), separator) // remove duplicate separators
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), ""); // remove separators at start/end
}

export const maskEmail = (email, unmaskCount = 1, maskDomain = false) => {
    const parts = email.split("@");
    if (parts.length !== 2) return email;

    let [user, domain] = parts;

    // --- Handle username masking ---
    if (unmaskCount < 0) unmaskCount = 0;
    if (unmaskCount > user.length) unmaskCount = user.length;

    const visibleUser = user.slice(0, unmaskCount);
    const maskedUser = visibleUser + "*".repeat(user.length - unmaskCount);

    // --- Handle domain masking ---
    if (maskDomain) {
        const domainParts = domain.split(".");
        const domainName = domainParts[0];
        const tld = domainParts.slice(1).join("."); // .com, .in, .co.in

        const maskedDomainName =
            domainName[0] + "*".repeat(domainName.length - 1);

        domain = maskedDomainName + (tld ? "." + tld : "");
    }

    return maskedUser + "@" + domain;
}

export const maskMobile = (mobile, unmaskCount = 4) => {
    const digits = mobile.replace(/\D/g, ""); // remove non-digits

    if (digits.length < unmaskCount) return mobile; // not enough digits to mask

    const visible = digits.slice(-unmaskCount);
    const masked = "*".repeat(digits.length - unmaskCount) + visible;

    return masked;
}



