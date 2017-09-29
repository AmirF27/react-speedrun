const rp = require('request-promise');

const YELP_URL = 'https://api.yelp.com/v3/businesses/search';

function Nightlife(location) {
  this.location = location;
}

Nightlife.prototype.search = function search(callback) {
  const headers = {
    Authorization: 'Bearer ' + process.env.YELP_ACCESS_TOKEN
  };
  const params = {
    term: 'bars',
    location: this.location
  };

  rp({ url: YELP_URL, headers, qs: params, json: true }).
    then(function fulfilled(res) {
      const bars = res.businesses.map(function(bar) {
        return {
          name: bar.name,
          image_url: bar.image_url,
          url: bar.url,
          rating: bar.rating
        };
      });
      callback(null, bars);
    }).
    catch(function rejected(err) {
      console.dir(err);
      callback(err);
    });
};

module.exports = Nightlife;
