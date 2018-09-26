const getTopFromFeeds = (feeds, field, num = 5) => {
    const counter = {};

    for (let i in feeds) {
        let fieldValue = feeds[i]._source[field];

        if (fieldValue && fieldValue !== '') {
            if (!counter.hasOwnProperty(fieldValue)) {
                counter[fieldValue] = 1;
            } else {
                counter[fieldValue]++;
            }
        }
    }

    let keys = Object.keys(counter);

    return keys.sort((a, b) => {
        return counter[b] - counter[a];
    }).slice(0, num).map(key => ({
        name: key,
        value: counter[key]
    }));
};

export default getTopFromFeeds;
