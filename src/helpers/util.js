import axios from "axios";

export const useInstance = () => {
  return axios.create({
    baseURL: acadlixOptions?.api_url,
    timeout: 10000,
    headers: {
      Accept: "application/json",
    },
  });
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
  if (Boolean(Number(quiz?.random_question))) {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }
  if (Boolean(Number(quiz?.sort_by_subject))) {
    questions = [
      ...questions
        ?.map((a) => {
          let data = {...a};
          data.subject_name = a?.subject?.subject_name ?? "Uncategorized";
          return data;
        })
        ?.sort((a, b) => a?.subject_name?.localeCompare(b?.subject_name)),
    ];
  }

  if(Boolean(Number(quiz?.optional_subject)) && quiz?.subject_times?.length > 0){
    const optional_subjects = quiz?.subject_times?.filter(s => s?.optional)?.map(s => s?.subject_id);
    questions = [
      ...questions?.filter(q => !optional_subjects?.includes(q?.subject_id)),
      ...questions?.filter(q => optional_subjects?.includes(q?.subject_id)),
    ];
  }
  if(Boolean(Number(quiz?.subject_wise_question))){
      let newQuestion = [];
      quiz?.subject_times?.forEach(s => {
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
    throw new Error("Array length and order length must be the same.");
  }

  // Create a new array to store shuffled objects
  let shuffledArray = [];

  // Rearrange objects based on desired order
  order.forEach((index) => {
    shuffledArray.push(arr[index]);
  });

  return shuffledArray;
};
