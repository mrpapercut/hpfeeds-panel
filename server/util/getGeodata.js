import request from 'request';
import {logError} from './log';

const getGeodata = (ipaddr, cb) => {
    const url = `http://getcitydetails.geobytes.com/GetCityDetails?fqcn=${ipaddr}`;

    request.get(url, (err, res, body) => {
        try {
            const geodata = JSON.parse(body);

            cb(err, {
                latitude: parseFloat(geodata.geobyteslatitude),
                longitude: parseFloat(geodata.geobyteslongitude),
                city: geodata.geobytescity,
                country: geodata.geobytescountry
            });
        } catch (e) {
            logError(e, body);
        }
    });
};

export default getGeodata;
