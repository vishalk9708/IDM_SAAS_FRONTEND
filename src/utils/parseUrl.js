const parseUrl = (urlquery) => {

    // console.log('url = ', urlquery)

    const url = new URL(urlquery);

    // parse query string
    const params = new URLSearchParams(url.search);

    // console.log('params = ', params)

    const obj = {};

    // iterate over all keys
    for (const key of params.keys()) {
        if (params.getAll(key).length > 1) {
            obj[key] = params.getAll(key);
        } else {
            obj[key] = params.get(key);
        }
    }
    console.log('in ParseUrl', obj)
    return obj;
};

export default parseUrl;
