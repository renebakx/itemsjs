var _ = require('./../vendor/lodash');
var lunr = require('lunr');

/**
* responsible for making full text searching on items
* config provide only searchableFields
*/
var Fulltext = function Fulltext(items, config) {
  Fulltext.config = config || {};
  var searchableFields = config.searchableFields || [];
  this.items = items; // creating index

  this.idx = lunr(function () {
    var _this = this;

    _.forEach(searchableFields, function (boost, fieldname) {
      _this.field(fieldname, { boost: boost });
    });
    this.ref("id");
    var i = 1;

    _.map(items, function (doc) {
      if (!doc.id) {
        doc.id = i;
        ++i;
      }

      _this.add(doc);
    });
  });
  this.store = _.mapKeys(items, function (doc) {
    return doc.id;
  });
};

Fulltext.prototype = {
  search: function search(SearchQuery) {
    var searchMatcher = Fulltext.config.searchMatcher || {
      wildcard: lunr.Query.wildcard.NONE,
    };
    var _this2 = this;

    if (!SearchQuery) {
      return this.items;
    }
    var results = _this2.idx.query(function (q) {
      q.term(lunr.tokenizer(SearchQuery), searchMatcher);
    });

    return _.map(results, function (val) {
      var item = _this2.store[val.ref]; //delete item.id;

      return item;
    });
  },
};
module.exports = Fulltext;
