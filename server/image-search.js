const rp = require('request-promise');

const CUSTOM_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

module.exports = function(wagner) {
  return wagner.invoke(function(Image) {
    function ImageSearch(options) {
      Image.call(this, {
        search_term: options.search_term,
        date: Date.now()
      });

      this.offset = options.offset;
    }

    ImageSearch.prototype = Object.create(Image.prototype);

    Object.assign(ImageSearch.prototype, {
      performSearch(cb) {
        rp(this.buildSearchUrl())
          .then(function fulfilled(response) {
            results = JSON.parse(response).items.map(function(item) {
              return {
                title: item.title,
                url: item.link,
                context: item.image.contextLink
              };
            });

            this.save();
            cb(results);
          }.bind(this));
      },

      buildSearchUrl() {
        verifyParams();

        let url = `${CUSTOM_SEARCH_URL}?key=${process.env.GOOGLE_API_KEY}&` +
                    `cx=${process.env.SEARCH_ENGINE_ID}&` +
                    `q=${this.search_term}&searchType=image`;

        if (this.offset && this.offset >= 0) {
          url += `&start=${this.offset + 1}`;
        }

        return url;
      }
    });

    return ImageSearch;
  });
};

function verifyParams() {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('Google API key not set');
    process.exit(1);
  }

  if (!process.env.SEARCH_ENGINE_ID) {
    console.error('Search engine ID not set');
    process.exit(1);
  }
}
