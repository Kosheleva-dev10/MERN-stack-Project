import moment from 'moment';

export const capitalizeSentence = (sentence, forEachWord = false) => {
    if (forEachWord) {
        return sentence.split(' ').map(eachWord => capitalizeWord(eachWord)).join(' ');
    } else {
        return capitalizeWord(sentence);
    }
};

export const capitalizeWord = (word) => {
    return String(word[0]).toUpperCase() + String(word.substring(1)).toLowerCase();
}

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const timeFromNow = (timestamp) => {
    timestamp = new Date(timestamp).getTime();
    
    return moment(timestamp).fromNow()
}

export const secsToHMS = (currentSeconds) => {
    return new Date(currentSeconds * 1000).toISOString().substr(11, 8)
}

export const dateToLocalString = (stamp) => {
    return new Date(stamp).toLocaleString()
}

/**
 * 
 * @param {Array} histories 
 */
export const getClickedPopupCount = (histories) => {
    const clickedPopups = histories.filter((item) => (item.isClicked === true));

    return clickedPopups.length
}

/**
 * 
 * @param {Array} histories 
 */
export const getlostPopupCount = (histories) => {
    const losts = histories.filter((item) => (!item.isClicked));
    return losts.length
}
