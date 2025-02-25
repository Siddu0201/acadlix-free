import axios from "axios";
import { __ } from "@wordpress/i18n";

export const useInstance = () => {
  return axios.create({
    baseURL: acadlixOptions?.api_url,
    timeout: acadlixOptions?.max_execution_time ?? 10000,
    headers: {
      Accept: "application/json",
    },
  });
};

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

const formatPrice = (price = 0) => {
  if (isNaN(price)) return price;

  // Split the number into the integer and decimal parts
  let [integerPart, decimalPart] = parseFloat(price)
    .toFixed(acadlixOptions?.settings?.acadlix_number_of_decimals)
    .split(".");

  // Add thousand separators to the integer part
  integerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    acadlixOptions?.settings?.acadlix_thousand_separator
  );

  // Join the integer and decimal parts with the custom decimal separator
  return Number(
    decimalPart
      ? integerPart +
      acadlixOptions?.settings?.acadlix_decimal_seprator +
      decimalPart
      : integerPart
  );
};

export const currencyPosition = (price = 0, currency_symbol = '') => {
  let symbol = currency_symbol !== '' ? currency_symbol : acadlixOptions?.currency_symbol;
  let newPrice = formatPrice(price);
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

export const strtotime = (dateString) => {
  const timestamp = Date.parse(dateString);
  return isNaN(timestamp) ? false : timestamp;
}

