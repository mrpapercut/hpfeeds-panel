import request from 'request';

const getGeodata = (ipaddr, cb) => {
    const url = `http://getcitydetails.geobytes.com/GetCityDetails?fqcn=${ipaddr}`;

    request.get(url, (err, res, body) => {
        const geodata = JSON.parse(body);

        cb(err, {
            'latitude': parseFloat(geodata.geobyteslatitude),
            'longitude': parseFloat(geodata.geobyteslongitude),
            'fqcn': `${geodata.geobytescity}, ${geodata.geobytescountry}`
        });
    });
};

export default getGeodata;
