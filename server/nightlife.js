const rp = require('request-promise');

const YELP_URL = 'https://api.yelp.com/v3/businesses/search';

function Nightlife(options) {
  this.location = options.location;
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
          id: bar.id,
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

Nightlife.prototype.markUserAttendance = function markUserAttendance(bars) {
  for (let userBar of this.userBars) {
    for (let bar of bars) {
      if (userBar == bar.id) {
        bar.userAttending = true;
      }
    }
  }

  return bars;
};

module.exports = Nightlife;
