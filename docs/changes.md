Moved from lunr.search to lunr.query() for searching

Removed isExactSearch from config.

Extends searchableField with a per field based boost via the config.

The boost is a integer, higher number is more boost.

```js
var fields = [("fieldname": 10)];
```

Added config.searchMatcherConfiguration to the configuration

defaults to

```js
{
   wildcard: lunr.Query.wildcard.NONE,
}
```

Full example with new config options

```js
var itemsjs = require('itemsjs')(data, {
  sortings: {
    year_asc: {
      // field name in data
      field: 'year',
      // possible values asc or desc
      order: 'asc'
    },
    year_name_asc: {
      // Multiple criteria possible
      field: ['date', 'name'],
      order: ['asc', 'asc']
    }
  },
  aggregations: {
    tags: {
      title: 'Tags',
      // conjunctive facet (AND)
      conjunction: true,
      // the default is 10
      size: 20
    },
    rating: {
      title: 'Actors',
      // non conjunctive facet (OR)
      conjunction: false,
      // it is sorting by value (not by count). 'count' is the default
      sort: 'term',
      order: 'asc',
      size: 5
    }
  },
  searchableFields: ['name':10, 'tags':0],
  searchMatcher: {
      wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING ,
   }
});
```