var _ = require('./../vendor/lodash');
var lunr = require('lunr');

/**
 * responsible for making full text searching on items
 * config provide only searchableFields
 */
var Fulltext = function Fulltext(items, config) {
  config = config || {};
  config.searchableFields = config.searchableFields || [];
  this.items = items; // creating index

  this.idx = lunr(function () {
    var _this = this;

    // currently schema hardcoded
    this.field("name", {
      boost: 10,
    });
    var self = this;

    _.forEach(config.searchableFields, function (field) {
      self.field(field);
    });

    this.ref("id");

    var i = 1;
    _.map(items, function (doc) {
      if (!doc.id) {
        doc.id = i;
        ++i;
      }
      self.add(doc);
    });
  });
  this.store = _.mapKeys(items, function (doc) {
    return doc.id;
  });
};

Fulltext.prototype = {

  search: function(query) {
    if (!query) {
      return this.items;
    }
    return _.map(this.idx.search(query), (val) => {
      var item = this.store[val.ref]
      //delete item.id;
      return item;
    })
  }
}

module.exports = Fulltext;
