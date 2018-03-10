const request = require('request');

const getGeodata = (ipaddr, callback) => {
	const url = `http://getcitydetails.geobytes.com/GetCityDetails?fqcn=${ipaddr}`;
    // console.log(url);

	request.get(url, (err, res, body) => {
		if (err) console.error(err);
		const geodata = JSON.parse(body);

		callback({
			'latitude': parseFloat(geodata.geobyteslatitude),
			'longitude': parseFloat(geodata.geobyteslongitude),
            'fqcn': geodata.geobytesfqcn
		});
    });
}

module.exports = getGeodata;
