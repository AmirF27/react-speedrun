const rp = require('request-promise');

const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';

function BookService(title) {
  this.title = title;
}

BookService.prototype.search = function search(callback) {
  const options = {
    url: GOOGLE_BOOKS_URL,
    qs: { q: this.title },
    json: true
  };

  rp(options).
    then(function fulfilled(res) {
      const books = res.items.map(function(book) {
        return {
          title: book.volumeInfo.title,
          image_url: book.volumeInfo.imageLinks.thumbnail
        };
      });
      callback(null, books);
    }).
    catch(callback);
};

module.exports = BookService;
