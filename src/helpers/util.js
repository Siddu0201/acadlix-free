import axios from "axios"

export const useInstance = () => { 
    return axios.create({
        baseURL: acadlixOptions?.api_url,
        timeout: 10000,
        headers: {
            'Accept': 'application/json', 
        },
    })
}

export const arrayRandomize = (array) => {
    let count = 0;
    let newArray = array
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
    for (let i = 0; i < newArray.length; i++) {
        if (i == newArray[i]?.position) {
            count++;
        }
    }
    if(count === newArray?.length){
        return arrayRandomize(array);
    }else{
        return newArray;
    }
}

export const randomizePosition = (array) => {
    let positions = array.map(obj => obj.position);

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
}

export const secondsToHms = (d) => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 9 ? h : "0" + h;
    var mDisplay = m > 9 ? m : "0" + m;
    var sDisplay = s > 9 ? s : "0" + s;
    return hDisplay + ":" + mDisplay + ":" + sDisplay; 
}

export const updateQuestions = (questions = [], quiz={}) => {
    if(Boolean(Number(quiz?.random_question))){
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        if(Boolean(Number(quiz?.sort_by_subject))){
            questions = [...questions?.map(a => {
                a.subject_name = a?.subject?.subject_name ?? 'Uncategorized';
                return a;
            })?.sort((a, b) => a?.subject_name?.localeCompare(b?.subject_name))]
        }
        return questions;
    }
    if(Boolean(Number(quiz?.sort_by_subject))){
        questions = [...questions?.map(a => {
            let data = [...a];
            data.subject_name = a?.subject?.subject_name ?? 'Uncategorized';
            return data;
        })?.sort((a, b) => a?.subject_name?.localeCompare(b?.subject_name))]
    }
    return questions;
}

export const updateAnswer = (options = [], random = false, notlast= false) => {
    if(random){
        if(notlast){
            const arrayToShuffle = options.slice(0, options.length - 1);
            for (let i = arrayToShuffle.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
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
}