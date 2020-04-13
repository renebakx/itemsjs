(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.itemsjs = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports = require('./src/index');

},{"./src/index":5}],2:[function(require,module,exports){
/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.8
 * Copyright (C) 2019 Oliver Nightingale
 * @license MIT
 */

;(function(){

/**
 * A convenience function for configuring and constructing
 * a new lunr Index.
 *
 * A lunr.Builder instance is created and the pipeline setup
 * with a trimmer, stop word filter and stemmer.
 *
 * This builder object is yielded to the configuration function
 * that is passed as a parameter, allowing the list of fields
 * and other builder parameters to be customised.
 *
 * All documents _must_ be added within the passed config function.
 *
 * @example
 * var idx = lunr(function () {
 *   this.field('title')
 *   this.field('body')
 *   this.ref('id')
 *
 *   documents.forEach(function (doc) {
 *     this.add(doc)
 *   }, this)
 * })
 *
 * @see {@link lunr.Builder}
 * @see {@link lunr.Pipeline}
 * @see {@link lunr.trimmer}
 * @see {@link lunr.stopWordFilter}
 * @see {@link lunr.stemmer}
 * @namespace {function} lunr
 */
var lunr = function (config) {
  var builder = new lunr.Builder

  builder.pipeline.add(
    lunr.trimmer,
    lunr.stopWordFilter,
    lunr.stemmer
  )

  builder.searchPipeline.add(
    lunr.stemmer
  )

  config.call(builder, builder)
  return builder.build()
}

lunr.version = "2.3.8"
/*!
 * lunr.utils
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * A namespace containing utils for the rest of the lunr library
 * @namespace lunr.utils
 */
lunr.utils = {}

/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf lunr.utils
 * @function
 */
lunr.utils.warn = (function (global) {
  /* eslint-disable no-console */
  return function (message) {
    if (global.console && console.warn) {
      console.warn(message)
    }
  }
  /* eslint-enable no-console */
})(this)

/**
 * Convert an object to a string.
 *
 * In the case of `null` and `undefined` the function returns
 * the empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {Any} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf lunr.utils
 */
lunr.utils.asString = function (obj) {
  if (obj === void 0 || obj === null) {
    return ""
  } else {
    return obj.toString()
  }
}

/**
 * Clones an object.
 *
 * Will create a copy of an existing object such that any mutations
 * on the copy cannot affect the original.
 *
 * Only shallow objects are supported, passing a nested object to this
 * function will cause a TypeError.
 *
 * Objects with primitives, and arrays of primitives are supported.
 *
 * @param {Object} obj The object to clone.
 * @return {Object} a clone of the passed object.
 * @throws {TypeError} when a nested object is passed.
 * @memberOf Utils
 */
lunr.utils.clone = function (obj) {
  if (obj === null || obj === undefined) {
    return obj
  }

  var clone = Object.create(null),
      keys = Object.keys(obj)

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i],
        val = obj[key]

    if (Array.isArray(val)) {
      clone[key] = val.slice()
      continue
    }

    if (typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean') {
      clone[key] = val
      continue
    }

    throw new TypeError("clone is not deep and does not support nested objects")
  }

  return clone
}
lunr.FieldRef = function (docRef, fieldName, stringValue) {
  this.docRef = docRef
  this.fieldName = fieldName
  this._stringValue = stringValue
}

lunr.FieldRef.joiner = "/"

lunr.FieldRef.fromString = function (s) {
  var n = s.indexOf(lunr.FieldRef.joiner)

  if (n === -1) {
    throw "malformed field ref string"
  }

  var fieldRef = s.slice(0, n),
      docRef = s.slice(n + 1)

  return new lunr.FieldRef (docRef, fieldRef, s)
}

lunr.FieldRef.prototype.toString = function () {
  if (this._stringValue == undefined) {
    this._stringValue = this.fieldName + lunr.FieldRef.joiner + this.docRef
  }

  return this._stringValue
}
/*!
 * lunr.Set
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * A lunr set.
 *
 * @constructor
 */
lunr.Set = function (elements) {
  this.elements = Object.create(null)

  if (elements) {
    this.length = elements.length

    for (var i = 0; i < this.length; i++) {
      this.elements[elements[i]] = true
    }
  } else {
    this.length = 0
  }
}

/**
 * A complete set that contains all elements.
 *
 * @static
 * @readonly
 * @type {lunr.Set}
 */
lunr.Set.complete = {
  intersect: function (other) {
    return other
  },

  union: function (other) {
    return other
  },

  contains: function () {
    return true
  }
}

/**
 * An empty set that contains no elements.
 *
 * @static
 * @readonly
 * @type {lunr.Set}
 */
lunr.Set.empty = {
  intersect: function () {
    return this
  },

  union: function (other) {
    return other
  },

  contains: function () {
    return false
  }
}

/**
 * Returns true if this set contains the specified object.
 *
 * @param {object} object - Object whose presence in this set is to be tested.
 * @returns {boolean} - True if this set contains the specified object.
 */
lunr.Set.prototype.contains = function (object) {
  return !!this.elements[object]
}

/**
 * Returns a new set containing only the elements that are present in both
 * this set and the specified set.
 *
 * @param {lunr.Set} other - set to intersect with this set.
 * @returns {lunr.Set} a new set that is the intersection of this and the specified set.
 */

lunr.Set.prototype.intersect = function (other) {
  var a, b, elements, intersection = []

  if (other === lunr.Set.complete) {
    return this
  }

  if (other === lunr.Set.empty) {
    return other
  }

  if (this.length < other.length) {
    a = this
    b = other
  } else {
    a = other
    b = this
  }

  elements = Object.keys(a.elements)

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i]
    if (element in b.elements) {
      intersection.push(element)
    }
  }

  return new lunr.Set (intersection)
}

/**
 * Returns a new set combining the elements of this and the specified set.
 *
 * @param {lunr.Set} other - set to union with this set.
 * @return {lunr.Set} a new set that is the union of this and the specified set.
 */

lunr.Set.prototype.union = function (other) {
  if (other === lunr.Set.complete) {
    return lunr.Set.complete
  }

  if (other === lunr.Set.empty) {
    return this
  }

  return new lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)))
}
/**
 * A function to calculate the inverse document frequency for
 * a posting. This is shared between the builder and the index
 *
 * @private
 * @param {object} posting - The posting for a given term
 * @param {number} documentCount - The total number of documents.
 */
lunr.idf = function (posting, documentCount) {
  var documentsWithTerm = 0

  for (var fieldName in posting) {
    if (fieldName == '_index') continue // Ignore the term index, its not a field
    documentsWithTerm += Object.keys(posting[fieldName]).length
  }

  var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5)

  return Math.log(1 + Math.abs(x))
}

/**
 * A token wraps a string representation of a token
 * as it is passed through the text processing pipeline.
 *
 * @constructor
 * @param {string} [str=''] - The string token being wrapped.
 * @param {object} [metadata={}] - Metadata associated with this token.
 */
lunr.Token = function (str, metadata) {
  this.str = str || ""
  this.metadata = metadata || {}
}

/**
 * Returns the token string that is being wrapped by this object.
 *
 * @returns {string}
 */
lunr.Token.prototype.toString = function () {
  return this.str
}

/**
 * A token update function is used when updating or optionally
 * when cloning a token.
 *
 * @callback lunr.Token~updateFunction
 * @param {string} str - The string representation of the token.
 * @param {Object} metadata - All metadata associated with this token.
 */

/**
 * Applies the given function to the wrapped string token.
 *
 * @example
 * token.update(function (str, metadata) {
 *   return str.toUpperCase()
 * })
 *
 * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.
 * @returns {lunr.Token}
 */
lunr.Token.prototype.update = function (fn) {
  this.str = fn(this.str, this.metadata)
  return this
}

/**
 * Creates a clone of this token. Optionally a function can be
 * applied to the cloned token.
 *
 * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.
 * @returns {lunr.Token}
 */
lunr.Token.prototype.clone = function (fn) {
  fn = fn || function (s) { return s }
  return new lunr.Token (fn(this.str, this.metadata), this.metadata)
}
/*!
 * lunr.tokenizer
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index. Uses `lunr.tokenizer.separator` to split strings, change
 * the value of this property to change how strings are split into tokens.
 *
 * This tokenizer will convert its parameter to a string by calling `toString` and
 * then will split this string on the character in `lunr.tokenizer.separator`.
 * Arrays will have their elements converted to strings and wrapped in a lunr.Token.
 *
 * Optional metadata can be passed to the tokenizer, this metadata will be cloned and
 * added as metadata to every token that is created from the object to be tokenized.
 *
 * @static
 * @param {?(string|object|object[])} obj - The object to convert into tokens
 * @param {?object} metadata - Optional metadata to associate with every token
 * @returns {lunr.Token[]}
 * @see {@link lunr.Pipeline}
 */
lunr.tokenizer = function (obj, metadata) {
  if (obj == null || obj == undefined) {
    return []
  }

  if (Array.isArray(obj)) {
    return obj.map(function (t) {
      return new lunr.Token(
        lunr.utils.asString(t).toLowerCase(),
        lunr.utils.clone(metadata)
      )
    })
  }

  var str = obj.toString().toLowerCase(),
      len = str.length,
      tokens = []

  for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {
    var char = str.charAt(sliceEnd),
        sliceLength = sliceEnd - sliceStart

    if ((char.match(lunr.tokenizer.separator) || sliceEnd == len)) {

      if (sliceLength > 0) {
        var tokenMetadata = lunr.utils.clone(metadata) || {}
        tokenMetadata["position"] = [sliceStart, sliceLength]
        tokenMetadata["index"] = tokens.length

        tokens.push(
          new lunr.Token (
            str.slice(sliceStart, sliceEnd),
            tokenMetadata
          )
        )
      }

      sliceStart = sliceEnd + 1
    }

  }

  return tokens
}

/**
 * The separator used to split a string into tokens. Override this property to change the behaviour of
 * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see lunr.tokenizer
 */
lunr.tokenizer.separator = /[\s\-]+/
/*!
 * lunr.Pipeline
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * lunr.Pipelines maintain an ordered list of functions to be applied to all
 * tokens in documents entering the search index and queries being ran against
 * the index.
 *
 * An instance of lunr.Index created with the lunr shortcut will contain a
 * pipeline with a stop word filter and an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with lunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */
lunr.Pipeline = function () {
  this._stack = []
}

lunr.Pipeline.registeredFunctions = Object.create(null)

/**
 * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token
 * string as well as all known metadata. A pipeline function can mutate the token string
 * or mutate (or add) metadata for a given token.
 *
 * A pipeline function can indicate that the passed token should be discarded by returning
 * null, undefined or an empty string. This token will not be passed to any downstream pipeline
 * functions and will not be added to the index.
 *
 * Multiple tokens can be returned by returning an array of tokens. Each token will be passed
 * to any downstream pipeline functions and all will returned tokens will be added to the index.
 *
 * Any number of pipeline functions may be chained together using a lunr.Pipeline.
 *
 * @interface lunr.PipelineFunction
 * @param {lunr.Token} token - A token from the document being processed.
 * @param {number} i - The index of this token in the complete list of tokens for this document/field.
 * @param {lunr.Token[]} tokens - All tokens for this document/field.
 * @returns {(?lunr.Token|lunr.Token[])}
 */

/**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @param {String} label - The label to register this function with
 */
lunr.Pipeline.registerFunction = function (fn, label) {
  if (label in this.registeredFunctions) {
    lunr.utils.warn('Overwriting existing registered function: ' + label)
  }

  fn.label = label
  lunr.Pipeline.registeredFunctions[fn.label] = fn
}

/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @private
 */
lunr.Pipeline.warnIfFunctionNotRegistered = function (fn) {
  var isRegistered = fn.label && (fn.label in this.registeredFunctions)

  if (!isRegistered) {
    lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n', fn)
  }
}

/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with lunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised - The serialised pipeline to load.
 * @returns {lunr.Pipeline}
 */
lunr.Pipeline.load = function (serialised) {
  var pipeline = new lunr.Pipeline

  serialised.forEach(function (fnName) {
    var fn = lunr.Pipeline.registeredFunctions[fnName]

    if (fn) {
      pipeline.add(fn)
    } else {
      throw new Error('Cannot load unregistered function: ' + fnName)
    }
  })

  return pipeline
}

/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.
 */
lunr.Pipeline.prototype.add = function () {
  var fns = Array.prototype.slice.call(arguments)

  fns.forEach(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)
    this._stack.push(fn)
  }, this)
}

/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */
lunr.Pipeline.prototype.after = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  pos = pos + 1
  this._stack.splice(pos, 0, newFn)
}

/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */
lunr.Pipeline.prototype.before = function (existingFn, newFn) {
  lunr.Pipeline.warnIfFunctionNotRegistered(newFn)

  var pos = this._stack.indexOf(existingFn)
  if (pos == -1) {
    throw new Error('Cannot find existingFn')
  }

  this._stack.splice(pos, 0, newFn)
}

/**
 * Removes a function from the pipeline.
 *
 * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.
 */
lunr.Pipeline.prototype.remove = function (fn) {
  var pos = this._stack.indexOf(fn)
  if (pos == -1) {
    return
  }

  this._stack.splice(pos, 1)
}

/**
 * Runs the current list of functions that make up the pipeline against the
 * passed tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @returns {Array}
 */
lunr.Pipeline.prototype.run = function (tokens) {
  var stackLength = this._stack.length

  for (var i = 0; i < stackLength; i++) {
    var fn = this._stack[i]
    var memo = []

    for (var j = 0; j < tokens.length; j++) {
      var result = fn(tokens[j], j, tokens)

      if (result === null || result === void 0 || result === '') continue

      if (Array.isArray(result)) {
        for (var k = 0; k < result.length; k++) {
          memo.push(result[k])
        }
      } else {
        memo.push(result)
      }
    }

    tokens = memo
  }

  return tokens
}

/**
 * Convenience method for passing a string through a pipeline and getting
 * strings out. This method takes care of wrapping the passed string in a
 * token and mapping the resulting tokens back to strings.
 *
 * @param {string} str - The string to pass through the pipeline.
 * @param {?object} metadata - Optional metadata to associate with the token
 * passed to the pipeline.
 * @returns {string[]}
 */
lunr.Pipeline.prototype.runString = function (str, metadata) {
  var token = new lunr.Token (str, metadata)

  return this.run([token]).map(function (t) {
    return t.toString()
  })
}

/**
 * Resets the pipeline by removing any existing processors.
 *
 */
lunr.Pipeline.prototype.reset = function () {
  this._stack = []
}

/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @returns {Array}
 */
lunr.Pipeline.prototype.toJSON = function () {
  return this._stack.map(function (fn) {
    lunr.Pipeline.warnIfFunctionNotRegistered(fn)

    return fn.label
  })
}
/*!
 * lunr.Vector
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * A vector is used to construct the vector space of documents and queries. These
 * vectors support operations to determine the similarity between two documents or
 * a document and a query.
 *
 * Normally no parameters are required for initializing a vector, but in the case of
 * loading a previously dumped vector the raw elements can be provided to the constructor.
 *
 * For performance reasons vectors are implemented with a flat array, where an elements
 * index is immediately followed by its value. E.g. [index, value, index, value]. This
 * allows the underlying array to be as sparse as possible and still offer decent
 * performance when being used for vector calculations.
 *
 * @constructor
 * @param {Number[]} [elements] - The flat list of element index and element value pairs.
 */
lunr.Vector = function (elements) {
  this._magnitude = 0
  this.elements = elements || []
}


/**
 * Calculates the position within the vector to insert a given index.
 *
 * This is used internally by insert and upsert. If there are duplicate indexes then
 * the position is returned as if the value for that index were to be updated, but it
 * is the callers responsibility to check whether there is a duplicate at that index
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @returns {Number}
 */
lunr.Vector.prototype.positionForIndex = function (index) {
  // For an empty vector the tuple can be inserted at the beginning
  if (this.elements.length == 0) {
    return 0
  }

  var start = 0,
      end = this.elements.length / 2,
      sliceLength = end - start,
      pivotPoint = Math.floor(sliceLength / 2),
      pivotIndex = this.elements[pivotPoint * 2]

  while (sliceLength > 1) {
    if (pivotIndex < index) {
      start = pivotPoint
    }

    if (pivotIndex > index) {
      end = pivotPoint
    }

    if (pivotIndex == index) {
      break
    }

    sliceLength = end - start
    pivotPoint = start + Math.floor(sliceLength / 2)
    pivotIndex = this.elements[pivotPoint * 2]
  }

  if (pivotIndex == index) {
    return pivotPoint * 2
  }

  if (pivotIndex > index) {
    return pivotPoint * 2
  }

  if (pivotIndex < index) {
    return (pivotPoint + 1) * 2
  }
}

/**
 * Inserts an element at an index within the vector.
 *
 * Does not allow duplicates, will throw an error if there is already an entry
 * for this index.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 */
lunr.Vector.prototype.insert = function (insertIdx, val) {
  this.upsert(insertIdx, val, function () {
    throw "duplicate index"
  })
}

/**
 * Inserts or updates an existing index within the vector.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 * @param {function} fn - A function that is called for updates, the existing value and the
 * requested value are passed as arguments
 */
lunr.Vector.prototype.upsert = function (insertIdx, val, fn) {
  this._magnitude = 0
  var position = this.positionForIndex(insertIdx)

  if (this.elements[position] == insertIdx) {
    this.elements[position + 1] = fn(this.elements[position + 1], val)
  } else {
    this.elements.splice(position, 0, insertIdx, val)
  }
}

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 */
lunr.Vector.prototype.magnitude = function () {
  if (this._magnitude) return this._magnitude

  var sumOfSquares = 0,
      elementsLength = this.elements.length

  for (var i = 1; i < elementsLength; i += 2) {
    var val = this.elements[i]
    sumOfSquares += val * val
  }

  return this._magnitude = Math.sqrt(sumOfSquares)
}

/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector - The vector to compute the dot product with.
 * @returns {Number}
 */
lunr.Vector.prototype.dot = function (otherVector) {
  var dotProduct = 0,
      a = this.elements, b = otherVector.elements,
      aLen = a.length, bLen = b.length,
      aVal = 0, bVal = 0,
      i = 0, j = 0

  while (i < aLen && j < bLen) {
    aVal = a[i], bVal = b[j]
    if (aVal < bVal) {
      i += 2
    } else if (aVal > bVal) {
      j += 2
    } else if (aVal == bVal) {
      dotProduct += a[i + 1] * b[j + 1]
      i += 2
      j += 2
    }
  }

  return dotProduct
}

/**
 * Calculates the similarity between this vector and another vector.
 *
 * @param {lunr.Vector} otherVector - The other vector to calculate the
 * similarity with.
 * @returns {Number}
 */
lunr.Vector.prototype.similarity = function (otherVector) {
  return this.dot(otherVector) / this.magnitude() || 0
}

/**
 * Converts the vector to an array of the elements within the vector.
 *
 * @returns {Number[]}
 */
lunr.Vector.prototype.toArray = function () {
  var output = new Array (this.elements.length / 2)

  for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {
    output[j] = this.elements[i]
  }

  return output
}

/**
 * A JSON serializable representation of the vector.
 *
 * @returns {Number[]}
 */
lunr.Vector.prototype.toJSON = function () {
  return this.elements
}
/* eslint-disable */
/*!
 * lunr.stemmer
 * Copyright (C) 2019 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 */

/**
 * lunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token - The string to stem
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 * @function
 */
lunr.stemmer = (function(){
  var step2list = {
      "ational" : "ate",
      "tional" : "tion",
      "enci" : "ence",
      "anci" : "ance",
      "izer" : "ize",
      "bli" : "ble",
      "alli" : "al",
      "entli" : "ent",
      "eli" : "e",
      "ousli" : "ous",
      "ization" : "ize",
      "ation" : "ate",
      "ator" : "ate",
      "alism" : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti" : "al",
      "iviti" : "ive",
      "biliti" : "ble",
      "logi" : "log"
    },

    step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical" : "ic",
      "ful" : "",
      "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

  var re_mgr0 = new RegExp(mgr0);
  var re_mgr1 = new RegExp(mgr1);
  var re_meq1 = new RegExp(meq1);
  var re_s_v = new RegExp(s_v);

  var re_1a = /^(.+?)(ss|i)es$/;
  var re2_1a = /^(.+?)([^s])s$/;
  var re_1b = /^(.+?)eed$/;
  var re2_1b = /^(.+?)(ed|ing)$/;
  var re_1b_2 = /.$/;
  var re2_1b_2 = /(at|bl|iz)$/;
  var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
  var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var re_1c = /^(.+?[^aeiou])y$/;
  var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;

  var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;

  var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
  var re2_4 = /^(.+?)(s|t)(ion)$/;

  var re_5 = /^(.+?)e$/;
  var re_5_1 = /ll$/;
  var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");

  var porterStemmer = function porterStemmer(w) {
    var stem,
      suffix,
      firstch,
      re,
      re2,
      re3,
      re4;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
      w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = re_1a
    re2 = re2_1a;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = re_1b;
    re2 = re2_1b;
    if (re.test(w)) {
      var fp = re.exec(w);
      re = re_mgr0;
      if (re.test(fp[1])) {
        re = re_1b_2;
        w = w.replace(re,"");
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1];
      re2 = re_s_v;
      if (re2.test(stem)) {
        w = stem;
        re2 = re2_1b_2;
        re3 = re3_1b_2;
        re4 = re4_1b_2;
        if (re2.test(w)) { w = w + "e"; }
        else if (re3.test(w)) { re = re_1b_2; w = w.replace(re,""); }
        else if (re4.test(w)) { w = w + "e"; }
      }
    }

    // Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
    re = re_1c;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      w = stem + "i";
    }

    // Step 2
    re = re_2;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step2list[suffix];
      }
    }

    // Step 3
    re = re_3;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      suffix = fp[2];
      re = re_mgr0;
      if (re.test(stem)) {
        w = stem + step3list[suffix];
      }
    }

    // Step 4
    re = re_4;
    re2 = re2_4;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      if (re.test(stem)) {
        w = stem;
      }
    } else if (re2.test(w)) {
      var fp = re2.exec(w);
      stem = fp[1] + fp[2];
      re2 = re_mgr1;
      if (re2.test(stem)) {
        w = stem;
      }
    }

    // Step 5
    re = re_5;
    if (re.test(w)) {
      var fp = re.exec(w);
      stem = fp[1];
      re = re_mgr1;
      re2 = re_meq1;
      re3 = re3_5;
      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
        w = stem;
      }
    }

    re = re_5_1;
    re2 = re_mgr1;
    if (re.test(w) && re2.test(w)) {
      re = re_1b_2;
      w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
      w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
  };

  return function (token) {
    return token.update(porterStemmer);
  }
})();

lunr.Pipeline.registerFunction(lunr.stemmer, 'stemmer')
/*!
 * lunr.stopWordFilter
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * lunr.generateStopWordFilter builds a stopWordFilter function from the provided
 * list of stop words.
 *
 * The built in lunr.stopWordFilter is built using this generator and can be used
 * to generate custom stopWordFilters for applications or non English languages.
 *
 * @function
 * @param {Array} token The token to pass through the filter
 * @returns {lunr.PipelineFunction}
 * @see lunr.Pipeline
 * @see lunr.stopWordFilter
 */
lunr.generateStopWordFilter = function (stopWords) {
  var words = stopWords.reduce(function (memo, stopWord) {
    memo[stopWord] = stopWord
    return memo
  }, {})

  return function (token) {
    if (token && words[token.toString()] !== token.toString()) return token
  }
}

/**
 * lunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 *
 * @function
 * @implements {lunr.PipelineFunction}
 * @params {lunr.Token} token - A token to check for being a stop word.
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 */
lunr.stopWordFilter = lunr.generateStopWordFilter([
  'a',
  'able',
  'about',
  'across',
  'after',
  'all',
  'almost',
  'also',
  'am',
  'among',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'because',
  'been',
  'but',
  'by',
  'can',
  'cannot',
  'could',
  'dear',
  'did',
  'do',
  'does',
  'either',
  'else',
  'ever',
  'every',
  'for',
  'from',
  'get',
  'got',
  'had',
  'has',
  'have',
  'he',
  'her',
  'hers',
  'him',
  'his',
  'how',
  'however',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'just',
  'least',
  'let',
  'like',
  'likely',
  'may',
  'me',
  'might',
  'most',
  'must',
  'my',
  'neither',
  'no',
  'nor',
  'not',
  'of',
  'off',
  'often',
  'on',
  'only',
  'or',
  'other',
  'our',
  'own',
  'rather',
  'said',
  'say',
  'says',
  'she',
  'should',
  'since',
  'so',
  'some',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'tis',
  'to',
  'too',
  'twas',
  'us',
  'wants',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'who',
  'whom',
  'why',
  'will',
  'with',
  'would',
  'yet',
  'you',
  'your'
])

lunr.Pipeline.registerFunction(lunr.stopWordFilter, 'stopWordFilter')
/*!
 * lunr.trimmer
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * lunr.trimmer is a pipeline function for trimming non word
 * characters from the beginning and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token The token to pass through the filter
 * @returns {lunr.Token}
 * @see lunr.Pipeline
 */
lunr.trimmer = function (token) {
  return token.update(function (s) {
    return s.replace(/^\W+/, '').replace(/\W+$/, '')
  })
}

lunr.Pipeline.registerFunction(lunr.trimmer, 'trimmer')
/*!
 * lunr.TokenSet
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * A token set is used to store the unique list of all tokens
 * within an index. Token sets are also used to represent an
 * incoming query to the index, this query token set and index
 * token set are then intersected to find which tokens to look
 * up in the inverted index.
 *
 * A token set can hold multiple tokens, as in the case of the
 * index token set, or it can hold a single token as in the
 * case of a simple query token set.
 *
 * Additionally token sets are used to perform wildcard matching.
 * Leading, contained and trailing wildcards are supported, and
 * from this edit distance matching can also be provided.
 *
 * Token sets are implemented as a minimal finite state automata,
 * where both common prefixes and suffixes are shared between tokens.
 * This helps to reduce the space used for storing the token set.
 *
 * @constructor
 */
lunr.TokenSet = function () {
  this.final = false
  this.edges = {}
  this.id = lunr.TokenSet._nextId
  lunr.TokenSet._nextId += 1
}

/**
 * Keeps track of the next, auto increment, identifier to assign
 * to a new tokenSet.
 *
 * TokenSets require a unique identifier to be correctly minimised.
 *
 * @private
 */
lunr.TokenSet._nextId = 1

/**
 * Creates a TokenSet instance from the given sorted array of words.
 *
 * @param {String[]} arr - A sorted array of strings to create the set from.
 * @returns {lunr.TokenSet}
 * @throws Will throw an error if the input array is not sorted.
 */
lunr.TokenSet.fromArray = function (arr) {
  var builder = new lunr.TokenSet.Builder

  for (var i = 0, len = arr.length; i < len; i++) {
    builder.insert(arr[i])
  }

  builder.finish()
  return builder.root
}

/**
 * Creates a token set from a query clause.
 *
 * @private
 * @param {Object} clause - A single clause from lunr.Query.
 * @param {string} clause.term - The query clause term.
 * @param {number} [clause.editDistance] - The optional edit distance for the term.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.fromClause = function (clause) {
  if ('editDistance' in clause) {
    return lunr.TokenSet.fromFuzzyString(clause.term, clause.editDistance)
  } else {
    return lunr.TokenSet.fromString(clause.term)
  }
}

/**
 * Creates a token set representing a single string with a specified
 * edit distance.
 *
 * Insertions, deletions, substitutions and transpositions are each
 * treated as an edit distance of 1.
 *
 * Increasing the allowed edit distance will have a dramatic impact
 * on the performance of both creating and intersecting these TokenSets.
 * It is advised to keep the edit distance less than 3.
 *
 * @param {string} str - The string to create the token set from.
 * @param {number} editDistance - The allowed edit distance to match.
 * @returns {lunr.Vector}
 */
lunr.TokenSet.fromFuzzyString = function (str, editDistance) {
  var root = new lunr.TokenSet

  var stack = [{
    node: root,
    editsRemaining: editDistance,
    str: str
  }]

  while (stack.length) {
    var frame = stack.pop()

    // no edit
    if (frame.str.length > 0) {
      var char = frame.str.charAt(0),
          noEditNode

      if (char in frame.node.edges) {
        noEditNode = frame.node.edges[char]
      } else {
        noEditNode = new lunr.TokenSet
        frame.node.edges[char] = noEditNode
      }

      if (frame.str.length == 1) {
        noEditNode.final = true
      }

      stack.push({
        node: noEditNode,
        editsRemaining: frame.editsRemaining,
        str: frame.str.slice(1)
      })
    }

    if (frame.editsRemaining == 0) {
      continue
    }

    // insertion
    if ("*" in frame.node.edges) {
      var insertionNode = frame.node.edges["*"]
    } else {
      var insertionNode = new lunr.TokenSet
      frame.node.edges["*"] = insertionNode
    }

    if (frame.str.length == 0) {
      insertionNode.final = true
    }

    stack.push({
      node: insertionNode,
      editsRemaining: frame.editsRemaining - 1,
      str: frame.str
    })

    // deletion
    // can only do a deletion if we have enough edits remaining
    // and if there are characters left to delete in the string
    if (frame.str.length > 1) {
      stack.push({
        node: frame.node,
        editsRemaining: frame.editsRemaining - 1,
        str: frame.str.slice(1)
      })
    }

    // deletion
    // just removing the last character from the str
    if (frame.str.length == 1) {
      frame.node.final = true
    }

    // substitution
    // can only do a substitution if we have enough edits remaining
    // and if there are characters left to substitute
    if (frame.str.length >= 1) {
      if ("*" in frame.node.edges) {
        var substitutionNode = frame.node.edges["*"]
      } else {
        var substitutionNode = new lunr.TokenSet
        frame.node.edges["*"] = substitutionNode
      }

      if (frame.str.length == 1) {
        substitutionNode.final = true
      }

      stack.push({
        node: substitutionNode,
        editsRemaining: frame.editsRemaining - 1,
        str: frame.str.slice(1)
      })
    }

    // transposition
    // can only do a transposition if there are edits remaining
    // and there are enough characters to transpose
    if (frame.str.length > 1) {
      var charA = frame.str.charAt(0),
          charB = frame.str.charAt(1),
          transposeNode

      if (charB in frame.node.edges) {
        transposeNode = frame.node.edges[charB]
      } else {
        transposeNode = new lunr.TokenSet
        frame.node.edges[charB] = transposeNode
      }

      if (frame.str.length == 1) {
        transposeNode.final = true
      }

      stack.push({
        node: transposeNode,
        editsRemaining: frame.editsRemaining - 1,
        str: charA + frame.str.slice(2)
      })
    }
  }

  return root
}

/**
 * Creates a TokenSet from a string.
 *
 * The string may contain one or more wildcard characters (*)
 * that will allow wildcard matching when intersecting with
 * another TokenSet.
 *
 * @param {string} str - The string to create a TokenSet from.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.fromString = function (str) {
  var node = new lunr.TokenSet,
      root = node

  /*
   * Iterates through all characters within the passed string
   * appending a node for each character.
   *
   * When a wildcard character is found then a self
   * referencing edge is introduced to continually match
   * any number of any characters.
   */
  for (var i = 0, len = str.length; i < len; i++) {
    var char = str[i],
        final = (i == len - 1)

    if (char == "*") {
      node.edges[char] = node
      node.final = final

    } else {
      var next = new lunr.TokenSet
      next.final = final

      node.edges[char] = next
      node = next
    }
  }

  return root
}

/**
 * Converts this TokenSet into an array of strings
 * contained within the TokenSet.
 *
 * This is not intended to be used on a TokenSet that
 * contains wildcards, in these cases the results are
 * undefined and are likely to cause an infinite loop.
 *
 * @returns {string[]}
 */
lunr.TokenSet.prototype.toArray = function () {
  var words = []

  var stack = [{
    prefix: "",
    node: this
  }]

  while (stack.length) {
    var frame = stack.pop(),
        edges = Object.keys(frame.node.edges),
        len = edges.length

    if (frame.node.final) {
      /* In Safari, at this point the prefix is sometimes corrupted, see:
       * https://github.com/olivernn/lunr.js/issues/279 Calling any
       * String.prototype method forces Safari to "cast" this string to what
       * it's supposed to be, fixing the bug. */
      frame.prefix.charAt(0)
      words.push(frame.prefix)
    }

    for (var i = 0; i < len; i++) {
      var edge = edges[i]

      stack.push({
        prefix: frame.prefix.concat(edge),
        node: frame.node.edges[edge]
      })
    }
  }

  return words
}

/**
 * Generates a string representation of a TokenSet.
 *
 * This is intended to allow TokenSets to be used as keys
 * in objects, largely to aid the construction and minimisation
 * of a TokenSet. As such it is not designed to be a human
 * friendly representation of the TokenSet.
 *
 * @returns {string}
 */
lunr.TokenSet.prototype.toString = function () {
  // NOTE: Using Object.keys here as this.edges is very likely
  // to enter 'hash-mode' with many keys being added
  //
  // avoiding a for-in loop here as it leads to the function
  // being de-optimised (at least in V8). From some simple
  // benchmarks the performance is comparable, but allowing
  // V8 to optimize may mean easy performance wins in the future.

  if (this._str) {
    return this._str
  }

  var str = this.final ? '1' : '0',
      labels = Object.keys(this.edges).sort(),
      len = labels.length

  for (var i = 0; i < len; i++) {
    var label = labels[i],
        node = this.edges[label]

    str = str + label + node.id
  }

  return str
}

/**
 * Returns a new TokenSet that is the intersection of
 * this TokenSet and the passed TokenSet.
 *
 * This intersection will take into account any wildcards
 * contained within the TokenSet.
 *
 * @param {lunr.TokenSet} b - An other TokenSet to intersect with.
 * @returns {lunr.TokenSet}
 */
lunr.TokenSet.prototype.intersect = function (b) {
  var output = new lunr.TokenSet,
      frame = undefined

  var stack = [{
    qNode: b,
    output: output,
    node: this
  }]

  while (stack.length) {
    frame = stack.pop()

    // NOTE: As with the #toString method, we are using
    // Object.keys and a for loop instead of a for-in loop
    // as both of these objects enter 'hash' mode, causing
    // the function to be de-optimised in V8
    var qEdges = Object.keys(frame.qNode.edges),
        qLen = qEdges.length,
        nEdges = Object.keys(frame.node.edges),
        nLen = nEdges.length

    for (var q = 0; q < qLen; q++) {
      var qEdge = qEdges[q]

      for (var n = 0; n < nLen; n++) {
        var nEdge = nEdges[n]

        if (nEdge == qEdge || qEdge == '*') {
          var node = frame.node.edges[nEdge],
              qNode = frame.qNode.edges[qEdge],
              final = node.final && qNode.final,
              next = undefined

          if (nEdge in frame.output.edges) {
            // an edge already exists for this character
            // no need to create a new node, just set the finality
            // bit unless this node is already final
            next = frame.output.edges[nEdge]
            next.final = next.final || final

          } else {
            // no edge exists yet, must create one
            // set the finality bit and insert it
            // into the output
            next = new lunr.TokenSet
            next.final = final
            frame.output.edges[nEdge] = next
          }

          stack.push({
            qNode: qNode,
            output: next,
            node: node
          })
        }
      }
    }
  }

  return output
}
lunr.TokenSet.Builder = function () {
  this.previousWord = ""
  this.root = new lunr.TokenSet
  this.uncheckedNodes = []
  this.minimizedNodes = {}
}

lunr.TokenSet.Builder.prototype.insert = function (word) {
  var node,
      commonPrefix = 0

  if (word < this.previousWord) {
    throw new Error ("Out of order word insertion")
  }

  for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
    if (word[i] != this.previousWord[i]) break
    commonPrefix++
  }

  this.minimize(commonPrefix)

  if (this.uncheckedNodes.length == 0) {
    node = this.root
  } else {
    node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child
  }

  for (var i = commonPrefix; i < word.length; i++) {
    var nextNode = new lunr.TokenSet,
        char = word[i]

    node.edges[char] = nextNode

    this.uncheckedNodes.push({
      parent: node,
      char: char,
      child: nextNode
    })

    node = nextNode
  }

  node.final = true
  this.previousWord = word
}

lunr.TokenSet.Builder.prototype.finish = function () {
  this.minimize(0)
}

lunr.TokenSet.Builder.prototype.minimize = function (downTo) {
  for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
    var node = this.uncheckedNodes[i],
        childKey = node.child.toString()

    if (childKey in this.minimizedNodes) {
      node.parent.edges[node.char] = this.minimizedNodes[childKey]
    } else {
      // Cache the key for this node since
      // we know it can't change anymore
      node.child._str = childKey

      this.minimizedNodes[childKey] = node.child
    }

    this.uncheckedNodes.pop()
  }
}
/*!
 * lunr.Index
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * An index contains the built index of all documents and provides a query interface
 * to the index.
 *
 * Usually instances of lunr.Index will not be created using this constructor, instead
 * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be
 * used to load previously built and serialized indexes.
 *
 * @constructor
 * @param {Object} attrs - The attributes of the built search index.
 * @param {Object} attrs.invertedIndex - An index of term/field to document reference.
 * @param {Object<string, lunr.Vector>} attrs.fieldVectors - Field vectors
 * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.
 * @param {string[]} attrs.fields - The names of indexed document fields.
 * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.
 */
lunr.Index = function (attrs) {
  this.invertedIndex = attrs.invertedIndex
  this.fieldVectors = attrs.fieldVectors
  this.tokenSet = attrs.tokenSet
  this.fields = attrs.fields
  this.pipeline = attrs.pipeline
}

/**
 * A result contains details of a document matching a search query.
 * @typedef {Object} lunr.Index~Result
 * @property {string} ref - The reference of the document this result represents.
 * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.
 * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.
 */

/**
 * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple
 * query language which itself is parsed into an instance of lunr.Query.
 *
 * For programmatically building queries it is advised to directly use lunr.Query, the query language
 * is best used for human entered text rather than program generated text.
 *
 * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported
 * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'
 * or 'world', though those that contain both will rank higher in the results.
 *
 * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can
 * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding
 * wildcards will increase the number of documents that will be found but can also have a negative
 * impact on query performance, especially with wildcards at the beginning of a term.
 *
 * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term
 * hello in the title field will match this query. Using a field not present in the index will lead
 * to an error being thrown.
 *
 * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term
 * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported
 * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.
 * Avoid large values for edit distance to improve query performance.
 *
 * Each term also supports a presence modifier. By default a term's presence in document is optional, however
 * this can be changed to either required or prohibited. For a term's presence to be required in a document the
 * term should be prefixed with a '+', e.g. `+foo bar` is a search for documents that must contain 'foo' and
 * optionally contain 'bar'. Conversely a leading '-' sets the terms presence to prohibited, i.e. it must not
 * appear in a document, e.g. `-foo bar` is a search for documents that do not contain 'foo' but may contain 'bar'.
 *
 * To escape special characters the backslash character '\' can be used, this allows searches to include
 * characters that would normally be considered modifiers, e.g. `foo\~2` will search for a term "foo~2" instead
 * of attempting to apply a boost of 2 to the search term "foo".
 *
 * @typedef {string} lunr.Index~QueryString
 * @example <caption>Simple single term query</caption>
 * hello
 * @example <caption>Multiple term query</caption>
 * hello world
 * @example <caption>term scoped to a field</caption>
 * title:hello
 * @example <caption>term with a boost of 10</caption>
 * hello^10
 * @example <caption>term with an edit distance of 2</caption>
 * hello~2
 * @example <caption>terms with presence modifiers</caption>
 * -foo +bar baz
 */

/**
 * Performs a search against the index using lunr query syntax.
 *
 * Results will be returned sorted by their score, the most relevant results
 * will be returned first.  For details on how the score is calculated, please see
 * the {@link https://lunrjs.com/guides/searching.html#scoring|guide}.
 *
 * For more programmatic querying use lunr.Index#query.
 *
 * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.
 * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.
 * @returns {lunr.Index~Result[]}
 */
lunr.Index.prototype.search = function (queryString) {
  return this.query(function (query) {
    var parser = new lunr.QueryParser(queryString, query)
    parser.parse()
  })
}

/**
 * A query builder callback provides a query object to be used to express
 * the query to perform on the index.
 *
 * @callback lunr.Index~queryBuilder
 * @param {lunr.Query} query - The query object to build up.
 * @this lunr.Query
 */

/**
 * Performs a query against the index using the yielded lunr.Query object.
 *
 * If performing programmatic queries against the index, this method is preferred
 * over lunr.Index#search so as to avoid the additional query parsing overhead.
 *
 * A query object is yielded to the supplied function which should be used to
 * express the query to be run against the index.
 *
 * Note that although this function takes a callback parameter it is _not_ an
 * asynchronous operation, the callback is just yielded a query object to be
 * customized.
 *
 * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.
 * @returns {lunr.Index~Result[]}
 */
lunr.Index.prototype.query = function (fn) {
  // for each query clause
  // * process terms
  // * expand terms from token set
  // * find matching documents and metadata
  // * get document vectors
  // * score documents

  var query = new lunr.Query(this.fields),
      matchingFields = Object.create(null),
      queryVectors = Object.create(null),
      termFieldCache = Object.create(null),
      requiredMatches = Object.create(null),
      prohibitedMatches = Object.create(null)

  /*
   * To support field level boosts a query vector is created per
   * field. An empty vector is eagerly created to support negated
   * queries.
   */
  for (var i = 0; i < this.fields.length; i++) {
    queryVectors[this.fields[i]] = new lunr.Vector
  }

  fn.call(query, query)

  for (var i = 0; i < query.clauses.length; i++) {
    /*
     * Unless the pipeline has been disabled for this term, which is
     * the case for terms with wildcards, we need to pass the clause
     * term through the search pipeline. A pipeline returns an array
     * of processed terms. Pipeline functions may expand the passed
     * term, which means we may end up performing multiple index lookups
     * for a single query term.
     */
    var clause = query.clauses[i],
        terms = null,
        clauseMatches = lunr.Set.complete

    if (clause.usePipeline) {
      terms = this.pipeline.runString(clause.term, {
        fields: clause.fields
      })
    } else {
      terms = [clause.term]
    }

    for (var m = 0; m < terms.length; m++) {
      var term = terms[m]

      /*
       * Each term returned from the pipeline needs to use the same query
       * clause object, e.g. the same boost and or edit distance. The
       * simplest way to do this is to re-use the clause object but mutate
       * its term property.
       */
      clause.term = term

      /*
       * From the term in the clause we create a token set which will then
       * be used to intersect the indexes token set to get a list of terms
       * to lookup in the inverted index
       */
      var termTokenSet = lunr.TokenSet.fromClause(clause),
          expandedTerms = this.tokenSet.intersect(termTokenSet).toArray()

      /*
       * If a term marked as required does not exist in the tokenSet it is
       * impossible for the search to return any matches. We set all the field
       * scoped required matches set to empty and stop examining any further
       * clauses.
       */
      if (expandedTerms.length === 0 && clause.presence === lunr.Query.presence.REQUIRED) {
        for (var k = 0; k < clause.fields.length; k++) {
          var field = clause.fields[k]
          requiredMatches[field] = lunr.Set.empty
        }

        break
      }

      for (var j = 0; j < expandedTerms.length; j++) {
        /*
         * For each term get the posting and termIndex, this is required for
         * building the query vector.
         */
        var expandedTerm = expandedTerms[j],
            posting = this.invertedIndex[expandedTerm],
            termIndex = posting._index

        for (var k = 0; k < clause.fields.length; k++) {
          /*
           * For each field that this query term is scoped by (by default
           * all fields are in scope) we need to get all the document refs
           * that have this term in that field.
           *
           * The posting is the entry in the invertedIndex for the matching
           * term from above.
           */
          var field = clause.fields[k],
              fieldPosting = posting[field],
              matchingDocumentRefs = Object.keys(fieldPosting),
              termField = expandedTerm + "/" + field,
              matchingDocumentsSet = new lunr.Set(matchingDocumentRefs)

          /*
           * if the presence of this term is required ensure that the matching
           * documents are added to the set of required matches for this clause.
           *
           */
          if (clause.presence == lunr.Query.presence.REQUIRED) {
            clauseMatches = clauseMatches.union(matchingDocumentsSet)

            if (requiredMatches[field] === undefined) {
              requiredMatches[field] = lunr.Set.complete
            }
          }

          /*
           * if the presence of this term is prohibited ensure that the matching
           * documents are added to the set of prohibited matches for this field,
           * creating that set if it does not yet exist.
           */
          if (clause.presence == lunr.Query.presence.PROHIBITED) {
            if (prohibitedMatches[field] === undefined) {
              prohibitedMatches[field] = lunr.Set.empty
            }

            prohibitedMatches[field] = prohibitedMatches[field].union(matchingDocumentsSet)

            /*
             * Prohibited matches should not be part of the query vector used for
             * similarity scoring and no metadata should be extracted so we continue
             * to the next field
             */
            continue
          }

          /*
           * The query field vector is populated using the termIndex found for
           * the term and a unit value with the appropriate boost applied.
           * Using upsert because there could already be an entry in the vector
           * for the term we are working with. In that case we just add the scores
           * together.
           */
          queryVectors[field].upsert(termIndex, clause.boost, function (a, b) { return a + b })

          /**
           * If we've already seen this term, field combo then we've already collected
           * the matching documents and metadata, no need to go through all that again
           */
          if (termFieldCache[termField]) {
            continue
          }

          for (var l = 0; l < matchingDocumentRefs.length; l++) {
            /*
             * All metadata for this term/field/document triple
             * are then extracted and collected into an instance
             * of lunr.MatchData ready to be returned in the query
             * results
             */
            var matchingDocumentRef = matchingDocumentRefs[l],
                matchingFieldRef = new lunr.FieldRef (matchingDocumentRef, field),
                metadata = fieldPosting[matchingDocumentRef],
                fieldMatch

            if ((fieldMatch = matchingFields[matchingFieldRef]) === undefined) {
              matchingFields[matchingFieldRef] = new lunr.MatchData (expandedTerm, field, metadata)
            } else {
              fieldMatch.add(expandedTerm, field, metadata)
            }

          }

          termFieldCache[termField] = true
        }
      }
    }

    /**
     * If the presence was required we need to update the requiredMatches field sets.
     * We do this after all fields for the term have collected their matches because
     * the clause terms presence is required in _any_ of the fields not _all_ of the
     * fields.
     */
    if (clause.presence === lunr.Query.presence.REQUIRED) {
      for (var k = 0; k < clause.fields.length; k++) {
        var field = clause.fields[k]
        requiredMatches[field] = requiredMatches[field].intersect(clauseMatches)
      }
    }
  }

  /**
   * Need to combine the field scoped required and prohibited
   * matching documents into a global set of required and prohibited
   * matches
   */
  var allRequiredMatches = lunr.Set.complete,
      allProhibitedMatches = lunr.Set.empty

  for (var i = 0; i < this.fields.length; i++) {
    var field = this.fields[i]

    if (requiredMatches[field]) {
      allRequiredMatches = allRequiredMatches.intersect(requiredMatches[field])
    }

    if (prohibitedMatches[field]) {
      allProhibitedMatches = allProhibitedMatches.union(prohibitedMatches[field])
    }
  }

  var matchingFieldRefs = Object.keys(matchingFields),
      results = [],
      matches = Object.create(null)

  /*
   * If the query is negated (contains only prohibited terms)
   * we need to get _all_ fieldRefs currently existing in the
   * index. This is only done when we know that the query is
   * entirely prohibited terms to avoid any cost of getting all
   * fieldRefs unnecessarily.
   *
   * Additionally, blank MatchData must be created to correctly
   * populate the results.
   */
  if (query.isNegated()) {
    matchingFieldRefs = Object.keys(this.fieldVectors)

    for (var i = 0; i < matchingFieldRefs.length; i++) {
      var matchingFieldRef = matchingFieldRefs[i]
      var fieldRef = lunr.FieldRef.fromString(matchingFieldRef)
      matchingFields[matchingFieldRef] = new lunr.MatchData
    }
  }

  for (var i = 0; i < matchingFieldRefs.length; i++) {
    /*
     * Currently we have document fields that match the query, but we
     * need to return documents. The matchData and scores are combined
     * from multiple fields belonging to the same document.
     *
     * Scores are calculated by field, using the query vectors created
     * above, and combined into a final document score using addition.
     */
    var fieldRef = lunr.FieldRef.fromString(matchingFieldRefs[i]),
        docRef = fieldRef.docRef

    if (!allRequiredMatches.contains(docRef)) {
      continue
    }

    if (allProhibitedMatches.contains(docRef)) {
      continue
    }

    var fieldVector = this.fieldVectors[fieldRef],
        score = queryVectors[fieldRef.fieldName].similarity(fieldVector),
        docMatch

    if ((docMatch = matches[docRef]) !== undefined) {
      docMatch.score += score
      docMatch.matchData.combine(matchingFields[fieldRef])
    } else {
      var match = {
        ref: docRef,
        score: score,
        matchData: matchingFields[fieldRef]
      }
      matches[docRef] = match
      results.push(match)
    }
  }

  /*
   * Sort the results objects by score, highest first.
   */
  return results.sort(function (a, b) {
    return b.score - a.score
  })
}

/**
 * Prepares the index for JSON serialization.
 *
 * The schema for this JSON blob will be described in a
 * separate JSON schema file.
 *
 * @returns {Object}
 */
lunr.Index.prototype.toJSON = function () {
  var invertedIndex = Object.keys(this.invertedIndex)
    .sort()
    .map(function (term) {
      return [term, this.invertedIndex[term]]
    }, this)

  var fieldVectors = Object.keys(this.fieldVectors)
    .map(function (ref) {
      return [ref, this.fieldVectors[ref].toJSON()]
    }, this)

  return {
    version: lunr.version,
    fields: this.fields,
    fieldVectors: fieldVectors,
    invertedIndex: invertedIndex,
    pipeline: this.pipeline.toJSON()
  }
}

/**
 * Loads a previously serialized lunr.Index
 *
 * @param {Object} serializedIndex - A previously serialized lunr.Index
 * @returns {lunr.Index}
 */
lunr.Index.load = function (serializedIndex) {
  var attrs = {},
      fieldVectors = {},
      serializedVectors = serializedIndex.fieldVectors,
      invertedIndex = Object.create(null),
      serializedInvertedIndex = serializedIndex.invertedIndex,
      tokenSetBuilder = new lunr.TokenSet.Builder,
      pipeline = lunr.Pipeline.load(serializedIndex.pipeline)

  if (serializedIndex.version != lunr.version) {
    lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '" + lunr.version + "' does not match serialized index '" + serializedIndex.version + "'")
  }

  for (var i = 0; i < serializedVectors.length; i++) {
    var tuple = serializedVectors[i],
        ref = tuple[0],
        elements = tuple[1]

    fieldVectors[ref] = new lunr.Vector(elements)
  }

  for (var i = 0; i < serializedInvertedIndex.length; i++) {
    var tuple = serializedInvertedIndex[i],
        term = tuple[0],
        posting = tuple[1]

    tokenSetBuilder.insert(term)
    invertedIndex[term] = posting
  }

  tokenSetBuilder.finish()

  attrs.fields = serializedIndex.fields

  attrs.fieldVectors = fieldVectors
  attrs.invertedIndex = invertedIndex
  attrs.tokenSet = tokenSetBuilder.root
  attrs.pipeline = pipeline

  return new lunr.Index(attrs)
}
/*!
 * lunr.Builder
 * Copyright (C) 2019 Oliver Nightingale
 */

/**
 * lunr.Builder performs indexing on a set of documents and
 * returns instances of lunr.Index ready for querying.
 *
 * All configuration of the index is done via the builder, the
 * fields to index, the document reference, the text processing
 * pipeline and document scoring parameters are all set on the
 * builder before indexing.
 *
 * @constructor
 * @property {string} _ref - Internal reference to the document reference field.
 * @property {string[]} _fields - Internal reference to the document fields to index.
 * @property {object} invertedIndex - The inverted index maps terms to document fields.
 * @property {object} documentTermFrequencies - Keeps track of document term frequencies.
 * @property {object} documentLengths - Keeps track of the length of documents added to the index.
 * @property {lunr.tokenizer} tokenizer - Function for splitting strings into tokens for indexing.
 * @property {lunr.Pipeline} pipeline - The pipeline performs text processing on tokens before indexing.
 * @property {lunr.Pipeline} searchPipeline - A pipeline for processing search terms before querying the index.
 * @property {number} documentCount - Keeps track of the total number of documents indexed.
 * @property {number} _b - A parameter to control field length normalization, setting this to 0 disabled normalization, 1 fully normalizes field lengths, the default value is 0.75.
 * @property {number} _k1 - A parameter to control how quickly an increase in term frequency results in term frequency saturation, the default value is 1.2.
 * @property {number} termIndex - A counter incremented for each unique term, used to identify a terms position in the vector space.
 * @property {array} metadataWhitelist - A list of metadata keys that have been whitelisted for entry in the index.
 */
lunr.Builder = function () {
  this._ref = "id"
  this._fields = Object.create(null)
  this._documents = Object.create(null)
  this.invertedIndex = Object.create(null)
  this.fieldTermFrequencies = {}
  this.fieldLengths = {}
  this.tokenizer = lunr.tokenizer
  this.pipeline = new lunr.Pipeline
  this.searchPipeline = new lunr.Pipeline
  this.documentCount = 0
  this._b = 0.75
  this._k1 = 1.2
  this.termIndex = 0
  this.metadataWhitelist = []
}

/**
 * Sets the document field used as the document reference. Every document must have this field.
 * The type of this field in the document should be a string, if it is not a string it will be
 * coerced into a string by calling toString.
 *
 * The default ref is 'id'.
 *
 * The ref should _not_ be changed during indexing, it should be set before any documents are
 * added to the index. Changing it during indexing can lead to inconsistent results.
 *
 * @param {string} ref - The name of the reference field in the document.
 */
lunr.Builder.prototype.ref = function (ref) {
  this._ref = ref
}

/**
 * A function that is used to extract a field from a document.
 *
 * Lunr expects a field to be at the top level of a document, if however the field
 * is deeply nested within a document an extractor function can be used to extract
 * the right field for indexing.
 *
 * @callback fieldExtractor
 * @param {object} doc - The document being added to the index.
 * @returns {?(string|object|object[])} obj - The object that will be indexed for this field.
 * @example <caption>Extracting a nested field</caption>
 * function (doc) { return doc.nested.field }
 */

/**
 * Adds a field to the list of document fields that will be indexed. Every document being
 * indexed should have this field. Null values for this field in indexed documents will
 * not cause errors but will limit the chance of that document being retrieved by searches.
 *
 * All fields should be added before adding documents to the index. Adding fields after
 * a document has been indexed will have no effect on already indexed documents.
 *
 * Fields can be boosted at build time. This allows terms within that field to have more
 * importance when ranking search results. Use a field boost to specify that matches within
 * one field are more important than other fields.
 *
 * @param {string} fieldName - The name of a field to index in all documents.
 * @param {object} attributes - Optional attributes associated with this field.
 * @param {number} [attributes.boost=1] - Boost applied to all terms within this field.
 * @param {fieldExtractor} [attributes.extractor] - Function to extract a field from a document.
 * @throws {RangeError} fieldName cannot contain unsupported characters '/'
 */
lunr.Builder.prototype.field = function (fieldName, attributes) {
  if (/\//.test(fieldName)) {
    throw new RangeError ("Field '" + fieldName + "' contains illegal character '/'")
  }

  this._fields[fieldName] = attributes || {}
}

/**
 * A parameter to tune the amount of field length normalisation that is applied when
 * calculating relevance scores. A value of 0 will completely disable any normalisation
 * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b
 * will be clamped to the range 0 - 1.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */
lunr.Builder.prototype.b = function (number) {
  if (number < 0) {
    this._b = 0
  } else if (number > 1) {
    this._b = 1
  } else {
    this._b = number
  }
}

/**
 * A parameter that controls the speed at which a rise in term frequency results in term
 * frequency saturation. The default value is 1.2. Setting this to a higher value will give
 * slower saturation levels, a lower value will result in quicker saturation.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */
lunr.Builder.prototype.k1 = function (number) {
  this._k1 = number
}

/**
 * Adds a document to the index.
 *
 * Before adding fields to the index the index should have been fully setup, with the document
 * ref and all fields to index already having been specified.
 *
 * The document must have a field name as specified by the ref (by default this is 'id') and
 * it should have all fields defined for indexing, though null or undefined values will not
 * cause errors.
 *
 * Entire documents can be boosted at build time. Applying a boost to a document indicates that
 * this document should rank higher in search results than other documents.
 *
 * @param {object} doc - The document to add to the index.
 * @param {object} attributes - Optional attributes associated with this document.
 * @param {number} [attributes.boost=1] - Boost applied to all terms within this document.
 */
lunr.Builder.prototype.add = function (doc, attributes) {
  var docRef = doc[this._ref],
      fields = Object.keys(this._fields)

  this._documents[docRef] = attributes || {}
  this.documentCount += 1

  for (var i = 0; i < fields.length; i++) {
    var fieldName = fields[i],
        extractor = this._fields[fieldName].extractor,
        field = extractor ? extractor(doc) : doc[fieldName],
        tokens = this.tokenizer(field, {
          fields: [fieldName]
        }),
        terms = this.pipeline.run(tokens),
        fieldRef = new lunr.FieldRef (docRef, fieldName),
        fieldTerms = Object.create(null)

    this.fieldTermFrequencies[fieldRef] = fieldTerms
    this.fieldLengths[fieldRef] = 0

    // store the length of this field for this document
    this.fieldLengths[fieldRef] += terms.length

    // calculate term frequencies for this field
    for (var j = 0; j < terms.length; j++) {
      var term = terms[j]

      if (fieldTerms[term] == undefined) {
        fieldTerms[term] = 0
      }

      fieldTerms[term] += 1

      // add to inverted index
      // create an initial posting if one doesn't exist
      if (this.invertedIndex[term] == undefined) {
        var posting = Object.create(null)
        posting["_index"] = this.termIndex
        this.termIndex += 1

        for (var k = 0; k < fields.length; k++) {
          posting[fields[k]] = Object.create(null)
        }

        this.invertedIndex[term] = posting
      }

      // add an entry for this term/fieldName/docRef to the invertedIndex
      if (this.invertedIndex[term][fieldName][docRef] == undefined) {
        this.invertedIndex[term][fieldName][docRef] = Object.create(null)
      }

      // store all whitelisted metadata about this token in the
      // inverted index
      for (var l = 0; l < this.metadataWhitelist.length; l++) {
        var metadataKey = this.metadataWhitelist[l],
            metadata = term.metadata[metadataKey]

        if (this.invertedIndex[term][fieldName][docRef][metadataKey] == undefined) {
          this.invertedIndex[term][fieldName][docRef][metadataKey] = []
        }

        this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata)
      }
    }

  }
}

/**
 * Calculates the average document length for this index
 *
 * @private
 */
lunr.Builder.prototype.calculateAverageFieldLengths = function () {

  var fieldRefs = Object.keys(this.fieldLengths),
      numberOfFields = fieldRefs.length,
      accumulator = {},
      documentsWithField = {}

  for (var i = 0; i < numberOfFields; i++) {
    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
        field = fieldRef.fieldName

    documentsWithField[field] || (documentsWithField[field] = 0)
    documentsWithField[field] += 1

    accumulator[field] || (accumulator[field] = 0)
    accumulator[field] += this.fieldLengths[fieldRef]
  }

  var fields = Object.keys(this._fields)

  for (var i = 0; i < fields.length; i++) {
    var fieldName = fields[i]
    accumulator[fieldName] = accumulator[fieldName] / documentsWithField[fieldName]
  }

  this.averageFieldLength = accumulator
}

/**
 * Builds a vector space model of every document using lunr.Vector
 *
 * @private
 */
lunr.Builder.prototype.createFieldVectors = function () {
  var fieldVectors = {},
      fieldRefs = Object.keys(this.fieldTermFrequencies),
      fieldRefsLength = fieldRefs.length,
      termIdfCache = Object.create(null)

  for (var i = 0; i < fieldRefsLength; i++) {
    var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]),
        fieldName = fieldRef.fieldName,
        fieldLength = this.fieldLengths[fieldRef],
        fieldVector = new lunr.Vector,
        termFrequencies = this.fieldTermFrequencies[fieldRef],
        terms = Object.keys(termFrequencies),
        termsLength = terms.length


    var fieldBoost = this._fields[fieldName].boost || 1,
        docBoost = this._documents[fieldRef.docRef].boost || 1

    for (var j = 0; j < termsLength; j++) {
      var term = terms[j],
          tf = termFrequencies[term],
          termIndex = this.invertedIndex[term]._index,
          idf, score, scoreWithPrecision

      if (termIdfCache[term] === undefined) {
        idf = lunr.idf(this.invertedIndex[term], this.documentCount)
        termIdfCache[term] = idf
      } else {
        idf = termIdfCache[term]
      }

      score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[fieldName])) + tf)
      score *= fieldBoost
      score *= docBoost
      scoreWithPrecision = Math.round(score * 1000) / 1000
      // Converts 1.23456789 to 1.234.
      // Reducing the precision so that the vectors take up less
      // space when serialised. Doing it now so that they behave
      // the same before and after serialisation. Also, this is
      // the fastest approach to reducing a number's precision in
      // JavaScript.

      fieldVector.insert(termIndex, scoreWithPrecision)
    }

    fieldVectors[fieldRef] = fieldVector
  }

  this.fieldVectors = fieldVectors
}

/**
 * Creates a token set of all tokens in the index using lunr.TokenSet
 *
 * @private
 */
lunr.Builder.prototype.createTokenSet = function () {
  this.tokenSet = lunr.TokenSet.fromArray(
    Object.keys(this.invertedIndex).sort()
  )
}

/**
 * Builds the index, creating an instance of lunr.Index.
 *
 * This completes the indexing process and should only be called
 * once all documents have been added to the index.
 *
 * @returns {lunr.Index}
 */
lunr.Builder.prototype.build = function () {
  this.calculateAverageFieldLengths()
  this.createFieldVectors()
  this.createTokenSet()

  return new lunr.Index({
    invertedIndex: this.invertedIndex,
    fieldVectors: this.fieldVectors,
    tokenSet: this.tokenSet,
    fields: Object.keys(this._fields),
    pipeline: this.searchPipeline
  })
}

/**
 * Applies a plugin to the index builder.
 *
 * A plugin is a function that is called with the index builder as its context.
 * Plugins can be used to customise or extend the behaviour of the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied when building the index.
 *
 * The plugin function will be called with the index builder as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index builder as its context.
 *
 * @param {Function} plugin The plugin to apply.
 */
lunr.Builder.prototype.use = function (fn) {
  var args = Array.prototype.slice.call(arguments, 1)
  args.unshift(this)
  fn.apply(this, args)
}
/**
 * Contains and collects metadata about a matching document.
 * A single instance of lunr.MatchData is returned as part of every
 * lunr.Index~Result.
 *
 * @constructor
 * @param {string} term - The term this match data is associated with
 * @param {string} field - The field in which the term was found
 * @param {object} metadata - The metadata recorded about this term in this field
 * @property {object} metadata - A cloned collection of metadata associated with this document.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData = function (term, field, metadata) {
  var clonedMetadata = Object.create(null),
      metadataKeys = Object.keys(metadata || {})

  // Cloning the metadata to prevent the original
  // being mutated during match data combination.
  // Metadata is kept in an array within the inverted
  // index so cloning the data can be done with
  // Array#slice
  for (var i = 0; i < metadataKeys.length; i++) {
    var key = metadataKeys[i]
    clonedMetadata[key] = metadata[key].slice()
  }

  this.metadata = Object.create(null)

  if (term !== undefined) {
    this.metadata[term] = Object.create(null)
    this.metadata[term][field] = clonedMetadata
  }
}

/**
 * An instance of lunr.MatchData will be created for every term that matches a
 * document. However only one instance is required in a lunr.Index~Result. This
 * method combines metadata from another instance of lunr.MatchData with this
 * objects metadata.
 *
 * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.
 * @see {@link lunr.Index~Result}
 */
lunr.MatchData.prototype.combine = function (otherMatchData) {
  var terms = Object.keys(otherMatchData.metadata)

  for (var i = 0; i < terms.length; i++) {
    var term = terms[i],
        fields = Object.keys(otherMatchData.metadata[term])

    if (this.metadata[term] == undefined) {
      this.metadata[term] = Object.create(null)
    }

    for (var j = 0; j < fields.length; j++) {
      var field = fields[j],
          keys = Object.keys(otherMatchData.metadata[term][field])

      if (this.metadata[term][field] == undefined) {
        this.metadata[term][field] = Object.create(null)
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k]

        if (this.metadata[term][field][key] == undefined) {
          this.metadata[term][field][key] = otherMatchData.metadata[term][field][key]
        } else {
          this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key])
        }

      }
    }
  }
}

/**
 * Add metadata for a term/field pair to this instance of match data.
 *
 * @param {string} term - The term this match data is associated with
 * @param {string} field - The field in which the term was found
 * @param {object} metadata - The metadata recorded about this term in this field
 */
lunr.MatchData.prototype.add = function (term, field, metadata) {
  if (!(term in this.metadata)) {
    this.metadata[term] = Object.create(null)
    this.metadata[term][field] = metadata
    return
  }

  if (!(field in this.metadata[term])) {
    this.metadata[term][field] = metadata
    return
  }

  var metadataKeys = Object.keys(metadata)

  for (var i = 0; i < metadataKeys.length; i++) {
    var key = metadataKeys[i]

    if (key in this.metadata[term][field]) {
      this.metadata[term][field][key] = this.metadata[term][field][key].concat(metadata[key])
    } else {
      this.metadata[term][field][key] = metadata[key]
    }
  }
}
/**
 * A lunr.Query provides a programmatic way of defining queries to be performed
 * against a {@link lunr.Index}.
 *
 * Prefer constructing a lunr.Query using the {@link lunr.Index#query} method
 * so the query object is pre-initialized with the right index fields.
 *
 * @constructor
 * @property {lunr.Query~Clause[]} clauses - An array of query clauses.
 * @property {string[]} allFields - An array of all available fields in a lunr.Index.
 */
lunr.Query = function (allFields) {
  this.clauses = []
  this.allFields = allFields
}

/**
 * Constants for indicating what kind of automatic wildcard insertion will be used when constructing a query clause.
 *
 * This allows wildcards to be added to the beginning and end of a term without having to manually do any string
 * concatenation.
 *
 * The wildcard constants can be bitwise combined to select both leading and trailing wildcards.
 *
 * @constant
 * @default
 * @property {number} wildcard.NONE - The term will have no wildcards inserted, this is the default behaviour
 * @property {number} wildcard.LEADING - Prepend the term with a wildcard, unless a leading wildcard already exists
 * @property {number} wildcard.TRAILING - Append a wildcard to the term, unless a trailing wildcard already exists
 * @see lunr.Query~Clause
 * @see lunr.Query#clause
 * @see lunr.Query#term
 * @example <caption>query term with trailing wildcard</caption>
 * query.term('foo', { wildcard: lunr.Query.wildcard.TRAILING })
 * @example <caption>query term with leading and trailing wildcard</caption>
 * query.term('foo', {
 *   wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
 * })
 */

lunr.Query.wildcard = new String ("*")
lunr.Query.wildcard.NONE = 0
lunr.Query.wildcard.LEADING = 1
lunr.Query.wildcard.TRAILING = 2

/**
 * Constants for indicating what kind of presence a term must have in matching documents.
 *
 * @constant
 * @enum {number}
 * @see lunr.Query~Clause
 * @see lunr.Query#clause
 * @see lunr.Query#term
 * @example <caption>query term with required presence</caption>
 * query.term('foo', { presence: lunr.Query.presence.REQUIRED })
 */
lunr.Query.presence = {
  /**
   * Term's presence in a document is optional, this is the default value.
   */
  OPTIONAL: 1,

  /**
   * Term's presence in a document is required, documents that do not contain
   * this term will not be returned.
   */
  REQUIRED: 2,

  /**
   * Term's presence in a document is prohibited, documents that do contain
   * this term will not be returned.
   */
  PROHIBITED: 3
}

/**
 * A single clause in a {@link lunr.Query} contains a term and details on how to
 * match that term against a {@link lunr.Index}.
 *
 * @typedef {Object} lunr.Query~Clause
 * @property {string[]} fields - The fields in an index this clause should be matched against.
 * @property {number} [boost=1] - Any boost that should be applied when matching this clause.
 * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.
 * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.
 * @property {number} [wildcard=lunr.Query.wildcard.NONE] - Whether the term should have wildcards appended or prepended.
 * @property {number} [presence=lunr.Query.presence.OPTIONAL] - The terms presence in any matching documents.
 */

/**
 * Adds a {@link lunr.Query~Clause} to this query.
 *
 * Unless the clause contains the fields to be matched all fields will be matched. In addition
 * a default boost of 1 is applied to the clause.
 *
 * @param {lunr.Query~Clause} clause - The clause to add to this query.
 * @see lunr.Query~Clause
 * @returns {lunr.Query}
 */
lunr.Query.prototype.clause = function (clause) {
  if (!('fields' in clause)) {
    clause.fields = this.allFields
  }

  if (!('boost' in clause)) {
    clause.boost = 1
  }

  if (!('usePipeline' in clause)) {
    clause.usePipeline = true
  }

  if (!('wildcard' in clause)) {
    clause.wildcard = lunr.Query.wildcard.NONE
  }

  if ((clause.wildcard & lunr.Query.wildcard.LEADING) && (clause.term.charAt(0) != lunr.Query.wildcard)) {
    clause.term = "*" + clause.term
  }

  if ((clause.wildcard & lunr.Query.wildcard.TRAILING) && (clause.term.slice(-1) != lunr.Query.wildcard)) {
    clause.term = "" + clause.term + "*"
  }

  if (!('presence' in clause)) {
    clause.presence = lunr.Query.presence.OPTIONAL
  }

  this.clauses.push(clause)

  return this
}

/**
 * A negated query is one in which every clause has a presence of
 * prohibited. These queries require some special processing to return
 * the expected results.
 *
 * @returns boolean
 */
lunr.Query.prototype.isNegated = function () {
  for (var i = 0; i < this.clauses.length; i++) {
    if (this.clauses[i].presence != lunr.Query.presence.PROHIBITED) {
      return false
    }
  }

  return true
}

/**
 * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}
 * to the list of clauses that make up this query.
 *
 * The term is used as is, i.e. no tokenization will be performed by this method. Instead conversion
 * to a token or token-like string should be done before calling this method.
 *
 * The term will be converted to a string by calling `toString`. Multiple terms can be passed as an
 * array, each term in the array will share the same options.
 *
 * @param {object|object[]} term - The term(s) to add to the query.
 * @param {object} [options] - Any additional properties to add to the query clause.
 * @returns {lunr.Query}
 * @see lunr.Query#clause
 * @see lunr.Query~Clause
 * @example <caption>adding a single term to a query</caption>
 * query.term("foo")
 * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>
 * query.term("foo", {
 *   fields: ["title"],
 *   boost: 10,
 *   wildcard: lunr.Query.wildcard.TRAILING
 * })
 * @example <caption>using lunr.tokenizer to convert a string to tokens before using them as terms</caption>
 * query.term(lunr.tokenizer("foo bar"))
 */
lunr.Query.prototype.term = function (term, options) {
  if (Array.isArray(term)) {
    term.forEach(function (t) { this.term(t, lunr.utils.clone(options)) }, this)
    return this
  }

  var clause = options || {}
  clause.term = term.toString()

  this.clause(clause)

  return this
}
lunr.QueryParseError = function (message, start, end) {
  this.name = "QueryParseError"
  this.message = message
  this.start = start
  this.end = end
}

lunr.QueryParseError.prototype = new Error
lunr.QueryLexer = function (str) {
  this.lexemes = []
  this.str = str
  this.length = str.length
  this.pos = 0
  this.start = 0
  this.escapeCharPositions = []
}

lunr.QueryLexer.prototype.run = function () {
  var state = lunr.QueryLexer.lexText

  while (state) {
    state = state(this)
  }
}

lunr.QueryLexer.prototype.sliceString = function () {
  var subSlices = [],
      sliceStart = this.start,
      sliceEnd = this.pos

  for (var i = 0; i < this.escapeCharPositions.length; i++) {
    sliceEnd = this.escapeCharPositions[i]
    subSlices.push(this.str.slice(sliceStart, sliceEnd))
    sliceStart = sliceEnd + 1
  }

  subSlices.push(this.str.slice(sliceStart, this.pos))
  this.escapeCharPositions.length = 0

  return subSlices.join('')
}

lunr.QueryLexer.prototype.emit = function (type) {
  this.lexemes.push({
    type: type,
    str: this.sliceString(),
    start: this.start,
    end: this.pos
  })

  this.start = this.pos
}

lunr.QueryLexer.prototype.escapeCharacter = function () {
  this.escapeCharPositions.push(this.pos - 1)
  this.pos += 1
}

lunr.QueryLexer.prototype.next = function () {
  if (this.pos >= this.length) {
    return lunr.QueryLexer.EOS
  }

  var char = this.str.charAt(this.pos)
  this.pos += 1
  return char
}

lunr.QueryLexer.prototype.width = function () {
  return this.pos - this.start
}

lunr.QueryLexer.prototype.ignore = function () {
  if (this.start == this.pos) {
    this.pos += 1
  }

  this.start = this.pos
}

lunr.QueryLexer.prototype.backup = function () {
  this.pos -= 1
}

lunr.QueryLexer.prototype.acceptDigitRun = function () {
  var char, charCode

  do {
    char = this.next()
    charCode = char.charCodeAt(0)
  } while (charCode > 47 && charCode < 58)

  if (char != lunr.QueryLexer.EOS) {
    this.backup()
  }
}

lunr.QueryLexer.prototype.more = function () {
  return this.pos < this.length
}

lunr.QueryLexer.EOS = 'EOS'
lunr.QueryLexer.FIELD = 'FIELD'
lunr.QueryLexer.TERM = 'TERM'
lunr.QueryLexer.EDIT_DISTANCE = 'EDIT_DISTANCE'
lunr.QueryLexer.BOOST = 'BOOST'
lunr.QueryLexer.PRESENCE = 'PRESENCE'

lunr.QueryLexer.lexField = function (lexer) {
  lexer.backup()
  lexer.emit(lunr.QueryLexer.FIELD)
  lexer.ignore()
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexTerm = function (lexer) {
  if (lexer.width() > 1) {
    lexer.backup()
    lexer.emit(lunr.QueryLexer.TERM)
  }

  lexer.ignore()

  if (lexer.more()) {
    return lunr.QueryLexer.lexText
  }
}

lunr.QueryLexer.lexEditDistance = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.EDIT_DISTANCE)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexBoost = function (lexer) {
  lexer.ignore()
  lexer.acceptDigitRun()
  lexer.emit(lunr.QueryLexer.BOOST)
  return lunr.QueryLexer.lexText
}

lunr.QueryLexer.lexEOS = function (lexer) {
  if (lexer.width() > 0) {
    lexer.emit(lunr.QueryLexer.TERM)
  }
}

// This matches the separator used when tokenising fields
// within a document. These should match otherwise it is
// not possible to search for some tokens within a document.
//
// It is possible for the user to change the separator on the
// tokenizer so it _might_ clash with any other of the special
// characters already used within the search string, e.g. :.
//
// This means that it is possible to change the separator in
// such a way that makes some words unsearchable using a search
// string.
lunr.QueryLexer.termSeparator = lunr.tokenizer.separator

lunr.QueryLexer.lexText = function (lexer) {
  while (true) {
    var char = lexer.next()

    if (char == lunr.QueryLexer.EOS) {
      return lunr.QueryLexer.lexEOS
    }

    // Escape character is '\'
    if (char.charCodeAt(0) == 92) {
      lexer.escapeCharacter()
      continue
    }

    if (char == ":") {
      return lunr.QueryLexer.lexField
    }

    if (char == "~") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexEditDistance
    }

    if (char == "^") {
      lexer.backup()
      if (lexer.width() > 0) {
        lexer.emit(lunr.QueryLexer.TERM)
      }
      return lunr.QueryLexer.lexBoost
    }

    // "+" indicates term presence is required
    // checking for length to ensure that only
    // leading "+" are considered
    if (char == "+" && lexer.width() === 1) {
      lexer.emit(lunr.QueryLexer.PRESENCE)
      return lunr.QueryLexer.lexText
    }

    // "-" indicates term presence is prohibited
    // checking for length to ensure that only
    // leading "-" are considered
    if (char == "-" && lexer.width() === 1) {
      lexer.emit(lunr.QueryLexer.PRESENCE)
      return lunr.QueryLexer.lexText
    }

    if (char.match(lunr.QueryLexer.termSeparator)) {
      return lunr.QueryLexer.lexTerm
    }
  }
}

lunr.QueryParser = function (str, query) {
  this.lexer = new lunr.QueryLexer (str)
  this.query = query
  this.currentClause = {}
  this.lexemeIdx = 0
}

lunr.QueryParser.prototype.parse = function () {
  this.lexer.run()
  this.lexemes = this.lexer.lexemes

  var state = lunr.QueryParser.parseClause

  while (state) {
    state = state(this)
  }

  return this.query
}

lunr.QueryParser.prototype.peekLexeme = function () {
  return this.lexemes[this.lexemeIdx]
}

lunr.QueryParser.prototype.consumeLexeme = function () {
  var lexeme = this.peekLexeme()
  this.lexemeIdx += 1
  return lexeme
}

lunr.QueryParser.prototype.nextClause = function () {
  var completedClause = this.currentClause
  this.query.clause(completedClause)
  this.currentClause = {}
}

lunr.QueryParser.parseClause = function (parser) {
  var lexeme = parser.peekLexeme()

  if (lexeme == undefined) {
    return
  }

  switch (lexeme.type) {
    case lunr.QueryLexer.PRESENCE:
      return lunr.QueryParser.parsePresence
    case lunr.QueryLexer.FIELD:
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expected either a field or a term, found " + lexeme.type

      if (lexeme.str.length >= 1) {
        errorMessage += " with value '" + lexeme.str + "'"
      }

      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }
}

lunr.QueryParser.parsePresence = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  switch (lexeme.str) {
    case "-":
      parser.currentClause.presence = lunr.Query.presence.PROHIBITED
      break
    case "+":
      parser.currentClause.presence = lunr.Query.presence.REQUIRED
      break
    default:
      var errorMessage = "unrecognised presence operator'" + lexeme.str + "'"
      throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    var errorMessage = "expecting term or field, found nothing"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.FIELD:
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expecting term or field, found '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseField = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  if (parser.query.allFields.indexOf(lexeme.str) == -1) {
    var possibleFields = parser.query.allFields.map(function (f) { return "'" + f + "'" }).join(', '),
        errorMessage = "unrecognised field '" + lexeme.str + "', possible fields: " + possibleFields

    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.fields = [lexeme.str]

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    var errorMessage = "expecting term, found nothing"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      return lunr.QueryParser.parseTerm
    default:
      var errorMessage = "expecting term, found '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseTerm = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  parser.currentClause.term = lexeme.str.toLowerCase()

  if (lexeme.str.indexOf("*") != -1) {
    parser.currentClause.usePipeline = false
  }

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    case lunr.QueryLexer.PRESENCE:
      parser.nextClause()
      return lunr.QueryParser.parsePresence
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseEditDistance = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  var editDistance = parseInt(lexeme.str, 10)

  if (isNaN(editDistance)) {
    var errorMessage = "edit distance must be numeric"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.editDistance = editDistance

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    case lunr.QueryLexer.PRESENCE:
      parser.nextClause()
      return lunr.QueryParser.parsePresence
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

lunr.QueryParser.parseBoost = function (parser) {
  var lexeme = parser.consumeLexeme()

  if (lexeme == undefined) {
    return
  }

  var boost = parseInt(lexeme.str, 10)

  if (isNaN(boost)) {
    var errorMessage = "boost must be numeric"
    throw new lunr.QueryParseError (errorMessage, lexeme.start, lexeme.end)
  }

  parser.currentClause.boost = boost

  var nextLexeme = parser.peekLexeme()

  if (nextLexeme == undefined) {
    parser.nextClause()
    return
  }

  switch (nextLexeme.type) {
    case lunr.QueryLexer.TERM:
      parser.nextClause()
      return lunr.QueryParser.parseTerm
    case lunr.QueryLexer.FIELD:
      parser.nextClause()
      return lunr.QueryParser.parseField
    case lunr.QueryLexer.EDIT_DISTANCE:
      return lunr.QueryParser.parseEditDistance
    case lunr.QueryLexer.BOOST:
      return lunr.QueryParser.parseBoost
    case lunr.QueryLexer.PRESENCE:
      parser.nextClause()
      return lunr.QueryParser.parsePresence
    default:
      var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'"
      throw new lunr.QueryParseError (errorMessage, nextLexeme.start, nextLexeme.end)
  }
}

  /**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */
  ;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory)
    } else if (typeof exports === 'object') {
      /**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */
      module.exports = factory()
    } else {
      // Browser globals (root is window)
      root.lunr = factory()
    }
  }(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return lunr
  }))
})();

},{}],3:[function(require,module,exports){
"use strict";

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
      _this.field(fieldname, {
        boost: boost
      });
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
      wildcard: lunr.Query.wildcard.NONE
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
  }
};
module.exports = Fulltext;

},{"./../vendor/lodash":7,"lunr":2}],4:[function(require,module,exports){
"use strict";

var _ = require('./../vendor/lodash');

module.exports.includes = function (items, filters) {
  return !filters || _.every(filters, function (val) {
    // Do not match substring when using filters
    if (typeof items === 'string' || items instanceof String) return val === items;else return _.includes(items, val); // If collection is a string, it's checked for a substring of value
  });
};
/**
 * not sure if mathematically correct
 */


module.exports.includes_any = function (items, filters) {
  //return !filters || (_.isArray(filters) && !filters.length) || _.some(filters, (val) => {
  return !filters || filters instanceof Array && filters.length === 0 || _.some(filters, function (val) {
    // Do not match substring when using filters
    if (typeof items === 'string' || items instanceof String) return val === items;else return _.includes(items, val); // If collection is a string, it's checked for a substring of value
  });
};
/**
 * if included particular elements (not array)
 */


module.exports.includes_any_element = function (items, filters) {
  return _.some(filters, function (val) {
    // Do not match substring when using filters
    if (typeof items === 'string' || items instanceof String) return val === items;else return _.includes(items, val); // If collection is a string, it's checked for a substring of value
  });
};

module.exports.intersection = function (a, b) {
  if (!b) {
    return a;
  }

  return _.intersection(a, _.flatten(b));
};

var clone = function clone(val) {
  try {
    return JSON.parse(JSON.stringify(val));
  } catch (e) {
    return val;
  }
};

module.exports.mergeAggregations = function (aggregations, input) {
  return _.mapValues(clone(aggregations), function (val, key) {
    if (!val.field) {
      val.field = key;
    }

    var filters = [];

    if (input.filters && input.filters[key]) {
      filters = input.filters[key];
    }

    val.filters = filters;
    var not_filters = [];

    if (input.not_filters && input.not_filters[key]) {
      not_filters = input.not_filters[key];
    }

    if (input.exclude_filters && input.exclude_filters[key]) {
      not_filters = input.exclude_filters[key];
    }

    val.not_filters = not_filters;
    return val;
  });
};
/**
 * should be moved to the new facet class
 */


var is_conjunctive_agg = function is_conjunctive_agg(aggregation) {
  return aggregation.conjunction !== false;
};

var is_disjunctive_agg = function is_disjunctive_agg(aggregation) {
  return aggregation.conjunction === false;
};

var is_not_filters_agg = function is_not_filters_agg(aggregation) {
  return aggregation.not_filters instanceof Array && aggregation.not_filters.length > 0;
};

var is_empty_agg = function is_empty_agg(aggregation) {
  return aggregation.type === 'is_empty';
};

var conjunctive_field = function conjunctive_field(set, filters) {
  return module.exports.includes(set, filters);
};

var disjunctive_field = function disjunctive_field(set, filters) {
  return module.exports.includes_any(set, filters);
};

var not_filters_field = function not_filters_field(set, filters) {
  return !module.exports.includes_any_element(set, filters);
};

var check_empty_field = function check_empty_field(set, filters) {
  var output = ['not_empty'];

  if (set === '' || set === undefined || set === null || set instanceof Array && set.length === 0) {
    //return true;
    output = ['empty'];
  } // check also if filters is not empty array


  if (filters && !module.exports.includes(output, filters)) {
    return false;
  }

  return output;
};
/*var empty_field = function(set, filters) {
  if (set === undefined || set === null || (set instanceof Array && set.length === 0)) {
    return true;
  }

  return false;
}*/


module.exports.is_conjunctive_agg = is_conjunctive_agg;
module.exports.is_disjunctive_agg = is_disjunctive_agg;
module.exports.is_not_filters_agg = is_not_filters_agg;
module.exports.is_empty_agg = is_empty_agg;
module.exports.conjunctive_field = conjunctive_field;
module.exports.disjunctive_field = disjunctive_field;
module.exports.not_filters_field = not_filters_field;
module.exports.check_empty_field = check_empty_field;

},{"./../vendor/lodash":7}],5:[function(require,module,exports){
"use strict";

var service = require('./lib');

var _ = require('./../vendor/lodash');

var helpers = require('./helpers');

var Fulltext = require('./fulltext');

module.exports = function itemsjs(items, configuration) {
  configuration = configuration || {}; // responsible for full text search over the items
  // it makes inverted index and it is very fast

  var fulltext = new Fulltext(items, configuration);
  return {
    /**
     * per_page
     * page
     * query
     * sort
     * filters
     */
    search: function search(input) {
      input = input || {};
      /**
       * merge configuration aggregation with user input
       */

      input.aggregations = helpers.mergeAggregations(configuration.aggregations, input);
      return service.search(items, input, configuration, fulltext);
    },

    /**
     * returns list of similar elements to specified item id
     * id
     */
    similar: function similar(id, options) {
      return service.similar(items, id, options);
    },

    /**
     * returns list of elements for specific aggregation i.e. list of tags
     * name (aggregation name)
     * query
     * per_page
     * page
     */
    aggregation: function aggregation(input) {
      return service.aggregation(items, input, configuration.aggregations);
    },

    /**
     * reindex items
     * reinitialize fulltext search
     */
    reindex: function reindex(newItems) {
      items = newItems;
      fulltext = new Fulltext(items, configuration);
    }
  };
};

},{"./../vendor/lodash":7,"./fulltext":3,"./helpers":4,"./lib":6}],6:[function(require,module,exports){
"use strict";

var _ = require('./../vendor/lodash');

var helpers = require('./helpers');

var Fulltext = require('./fulltext');
/**
 * search by filters
 */


module.exports.search = function (items, input, configuration, fulltext) {
  input = input || {};
  var search_time = 0; // make search by query first

  if (fulltext) {
    var search_start_time = new Date().getTime();
    items = fulltext.search(input.query);
    search_time = new Date().getTime() - search_start_time;
  }
  /**
   * making a items filtering after search and before faceting
   * after search because search is very fast (faster than O(n) while filtering is O(n) and faceting is like O(n x m))
   * the goal is to make a library more customizable for developers
   */


  if (input.filter instanceof Function) {
    items = items.filter(input.filter);
  } // @deprecated


  if (input.prefilter instanceof Function) {
    items = input.prefilter(items);
  }
  /**
   * responsible for filtering items by aggregation values (processed input)
   * not sure now about the reason but probably performance
   */


  var filtered_items = module.exports.items_by_aggregations(items, input.aggregations);
  var per_page = input.per_page || 12;
  var page = input.page || 1;
  /**
   * sorting items
   */

  var sorting_time = 0;

  if (input.sort) {
    var sorting_start_time = new Date().getTime();
    filtered_items = module.exports.sorted_items(filtered_items, input.sort, configuration.sortings);
    sorting_time = new Date().getTime() - sorting_start_time;
  }
  /**
   * calculating facets
   */


  var facets_start_time = new Date().getTime();
  var aggregations = module.exports.aggregations(items, input.aggregations);
  var facets_time = new Date().getTime() - facets_start_time;
  return {
    pagination: {
      per_page: per_page,
      page: page,
      total: filtered_items.length
    },
    timings: {
      facets: facets_time,
      search: search_time,
      sorting: sorting_time
    },
    data: {
      items: filtered_items.slice((page - 1) * per_page, page * per_page),
      aggregations: aggregations
    }
  };
};
/**
 * returns list of elements in aggregation
 * useful for autocomplete or list all aggregation options
 */


module.exports.aggregation = function (items, input, aggregations) {
  var per_page = input.per_page || 10;
  var page = input.page || 1;

  if (input.name && (!aggregations || !aggregations[input.name])) {
    throw new Error("Please define aggregation \"".concat(input.name, "\" in config"));
  }

  var buckets = module.exports.buckets(items, input.name, aggregations[input.name], aggregations);

  if (input.query) {
    buckets = _.filter(buckets, function (val) {
      // responsible for query
      // counterpart to startsWith
      return val.key.toLowerCase().indexOf(input.query.toLowerCase()) === 0;
    });
  }

  return {
    pagination: {
      per_page: per_page,
      page: page,
      total: buckets.length
    },
    data: {
      buckets: buckets.slice((page - 1) * per_page, page * per_page)
    }
  };
};
/**
 * return items by sort
 */


module.exports.sorted_items = function (items, sort, sortings) {
  if (sortings && sortings[sort]) {
    sort = sortings[sort];
  }

  if (sort.field) {
    return _.orderBy(items, sort.field, sort.order || 'asc');
  }

  return items;
};
/**
 * return items which pass filters (aggregations)
 */


module.exports.items_by_aggregations = function (items, aggregations) {
  return _.filter(items, function (item) {
    return module.exports.filterable_item(item, aggregations);
  });
};
/**
 * it returns list of aggregations with buckets
 * it calculates based on object filters like {tags: ['drama', '1980s']} against list of items
 * in realtime
 *
 * @TODO
 * consider caching aggregations results in startup time
 */


module.exports.aggregations = function (items, aggregations) {
  var position = 0;
  return _.mapValues(aggregations, function (val, key) {
    // key is a 'tags' and val is ['drama', '1980s']
    ++position;
    return {
      name: key,
      title: val.title || key.charAt(0).toUpperCase() + key.slice(1),
      position: position,
      buckets: module.exports.buckets(items, key, val, aggregations).slice(0, val.size || 10)
    };
  });
};
/**
 * checks if item is passing aggregations - if it's filtered or not
 * @TODO should accept filters (user input) as the parameter
 * and not user params merged with global config
 * should be is_filterable_item
 */


module.exports.filterable_item = function (item, aggregations) {
  var keys = _.keys(aggregations);

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];

    if (helpers.is_empty_agg(aggregations[key])) {
      if (helpers.check_empty_field(item[aggregations[key].field], aggregations[key].filters)) {
        continue;
      }

      return false;
    } else if (helpers.is_not_filters_agg(aggregations[key]) && !helpers.not_filters_field(item[key], aggregations[key].not_filters)) {
      return false;
    } else if (helpers.is_disjunctive_agg(aggregations[key]) && !helpers.disjunctive_field(item[key], aggregations[key].filters)) {
      return false;
    } else if (helpers.is_conjunctive_agg(aggregations[key]) && !helpers.conjunctive_field(item[key], aggregations[key].filters)) {
      return false;
    }
  }

  return true;
};
/*
 * returns array of item key values only if they are passing aggregations criteria
 */


module.exports.bucket_field = function (item, aggregations, key) {
  var keys = _.keys(aggregations);
  /**
   * responsible for narrowing facets with not_filter filter
   */


  for (var i = 0; i < keys.length; ++i) {
    var it = keys[i];

    if (helpers.is_not_filters_agg(aggregations[it])) {
      if (!helpers.not_filters_field(item[it], aggregations[it].not_filters)) {
        return [];
      }
    }
  }

  for (var i = 0; i < keys.length; ++i) {
    if (keys[i] === key) {
      continue;
    }

    var it = keys[i];

    if (helpers.is_empty_agg(aggregations[it])) {
      if (!helpers.check_empty_field(item[aggregations[it].field], aggregations[it].filters)) {
        return [];
      } else {
        continue;
      }
    } else if (helpers.is_disjunctive_agg(aggregations[it]) && !helpers.disjunctive_field(item[it], aggregations[it].filters)) {
      return [];
    } else if (helpers.is_conjunctive_agg(aggregations[it]) && !helpers.conjunctive_field(item[it], aggregations[it].filters)) {
      return [];
    }
  }

  if (helpers.is_empty_agg(aggregations[key])) {
    var temp = helpers.check_empty_field(item[aggregations[key].field], aggregations[key].filters);

    if (temp) {
      return temp;
    }

    return [];
  }

  if (helpers.is_disjunctive_agg(aggregations[key]) || helpers.includes(item[key], aggregations[key].filters)) {
    return item[key] ? _.flatten([item[key]]) : [];
  }

  return [];
};
/*
 * fields count for one item based on aggregation options
 * returns buckets objects
 */


module.exports.bucket = function (item, aggregations) {
  return _.mapValues(aggregations, function (val, key) {
    return module.exports.bucket_field(item, aggregations, key);
  });
};
/**
 * returns buckets list for items for specific key and aggregation configuration
 *
 * @TODO it should be more lower level and should not be dependent directly on user configuration
 * should be able to sort buckets alphabetically, by count and by asc or desc
 */


module.exports.buckets = function (items, field, agg, aggregations) {
  var buckets = _.transform(items, function (result, item) {
    item = module.exports.bucket(item, aggregations);
    var elements = item[field];

    if (agg.conjunction !== false && helpers.includes(elements, agg.filters) //|| agg.conjunction === false && helpers.includes_any(elements, agg.filters)
    || agg.conjunction === false) {
      // go through elements in item field
      for (var i = 0; elements && i < elements.length; ++i) {
        var key = elements[i];

        if (!result[key]) {
          result[key] = 1;
        } else {
          result[key] += 1;
        }
      }
    }
  }, {}); // transform object of objects to array of objects


  buckets = _.map(buckets, function (val, key) {
    return {
      key: key,
      doc_count: val,
      selected: _.includes(agg.filters, key)
    };
  });

  if (agg.sort === 'term') {
    buckets = _.orderBy(buckets, ['selected', 'key'], ['desc', agg.order || 'asc']);
  } else {
    buckets = _.orderBy(buckets, ['selected', 'doc_count', 'key'], ['desc', agg.order || 'desc', 'asc']);
  }

  return buckets;
};
/**
 * returns list of elements in aggregation
 * useful for autocomplete or list all aggregation options
 */


module.exports.similar = function (items, id, options) {
  var result = [];
  var per_page = options.per_page || 10;
  var minimum = options.minimum || 0;
  var page = options.page || 1;
  var item;

  for (var i = 0; i < items.length; ++i) {
    if (items[i].id == id) {
      item = items[i];
      break;
    }
  }

  if (!options.field) {
    throw new Error("Please define field in options");
  }

  var field = options.field;
  var sorted_items = [];

  for (var i = 0; i < items.length; ++i) {
    if (items[i].id !== id) {
      var intersection = _.intersection(item[field], items[i][field]);

      if (intersection.length >= minimum) {
        sorted_items.push(items[i]);
        sorted_items[sorted_items.length - 1].intersection_length = intersection.length;
      }
    }
  }

  sorted_items = _.orderBy(sorted_items, ['intersection_length'], ['desc']);
  return {
    pagination: {
      per_page: per_page,
      page: page,
      total: sorted_items.length
    },
    data: {
      items: sorted_items.slice((page - 1) * per_page, page * per_page)
    }
  };
};

},{"./../vendor/lodash":7,"./fulltext":3,"./helpers":4}],7:[function(require,module,exports){
(function (global){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @license
 * Lodash (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash include="some,forEach,map,mapKeys,mapValues,every,includes,intersection,filter,keys,clone,flatten,transform,sortBy,orderBy" -o lib/lodash.js -p`
 */
;
(function () {
  function t(t, e) {
    return t.set(e[0], e[1]), t;
  }

  function e(t, e) {
    return t.add(e), t;
  }

  function n(t, e, n) {
    switch (n.length) {
      case 0:
        return t.call(e);

      case 1:
        return t.call(e, n[0]);

      case 2:
        return t.call(e, n[0], n[1]);

      case 3:
        return t.call(e, n[0], n[1], n[2]);
    }

    return t.apply(e, n);
  }

  function r(t, e) {
    for (var n = -1, r = null == t ? 0 : t.length; ++n < r && false !== e(t[n], n, t);) {
      ;
    }

    return t;
  }

  function o(t, e) {
    for (var n = -1, r = null == t ? 0 : t.length; ++n < r;) {
      if (!e(t[n], n, t)) return false;
    }

    return true;
  }

  function u(t, e) {
    for (var n = -1, r = null == t ? 0 : t.length, o = 0, u = []; ++n < r;) {
      var c = t[n];
      e(c, n, t) && (u[o++] = c);
    }

    return u;
  }

  function c(t, e) {
    return !(null == t || !t.length) && -1 < (e === e ? d(t, e, 0) : s(t, b, 0));
  }

  function i(t, e) {
    for (var n = -1, r = null == t ? 0 : t.length, o = Array(r); ++n < r;) {
      o[n] = e(t[n], n, t);
    }

    return o;
  }

  function a(t, e) {
    for (var n = -1, r = e.length, o = t.length; ++n < r;) {
      t[o + n] = e[n];
    }

    return t;
  }

  function f(t, e, n) {
    for (var r = -1, o = null == t ? 0 : t.length; ++r < o;) {
      n = e(n, t[r], r, t);
    }

    return n;
  }

  function l(t, e) {
    for (var n = -1, r = null == t ? 0 : t.length; ++n < r;) {
      if (e(t[n], n, t)) return true;
    }

    return false;
  }

  function s(t, e, n) {
    var r = t.length;

    for (n += -1; ++n < r;) {
      if (e(t[n], n, t)) return n;
    }

    return -1;
  }

  function b(t) {
    return t !== t;
  }

  function h(t) {
    return function (e) {
      return null == e ? Zt : e[t];
    };
  }

  function p(t, e) {
    var n = t.length;

    for (t.sort(e); n--;) {
      t[n] = t[n].c;
    }

    return t;
  }

  function y(t) {
    return function (e) {
      return t(e);
    };
  }

  function j(t, e) {
    return i(e, function (e) {
      return t[e];
    });
  }

  function v(t) {
    var e = -1,
        n = Array(t.size);
    return t.forEach(function (t, r) {
      n[++e] = [r, t];
    }), n;
  }

  function g(t) {
    var e = Object;
    return function (n) {
      return t(e(n));
    };
  }

  function _(t) {
    var e = -1,
        n = Array(t.size);
    return t.forEach(function (t) {
      n[++e] = t;
    }), n;
  }

  function d(t, e, n) {
    --n;

    for (var r = t.length; ++n < r;) {
      if (t[n] === e) return n;
    }

    return -1;
  }

  function A() {}

  function m(t) {
    var e = -1,
        n = null == t ? 0 : t.length;

    for (this.clear(); ++e < n;) {
      var r = t[e];
      this.set(r[0], r[1]);
    }
  }

  function w(t) {
    var e = -1,
        n = null == t ? 0 : t.length;

    for (this.clear(); ++e < n;) {
      var r = t[e];
      this.set(r[0], r[1]);
    }
  }

  function O(t) {
    var e = -1,
        n = null == t ? 0 : t.length;

    for (this.clear(); ++e < n;) {
      var r = t[e];
      this.set(r[0], r[1]);
    }
  }

  function S(t) {
    var e = -1,
        n = null == t ? 0 : t.length;

    for (this.__data__ = new O(); ++e < n;) {
      this.add(t[e]);
    }
  }

  function k(t) {
    this.size = (this.__data__ = new w(t)).size;
  }

  function z(t, e) {
    var n = On(t),
        r = !n && wn(t),
        o = !n && !r && Sn(t),
        u = !n && !r && !o && kn(t);

    if (n = n || r || o || u) {
      for (var r = t.length, c = String, i = -1, a = Array(r); ++i < r;) {
        a[i] = c(i);
      }

      r = a;
    } else r = [];

    var f,
        c = r.length;

    for (f in t) {
      !e && !Ie.call(t, f) || n && ("length" == f || o && ("offset" == f || "parent" == f) || u && ("buffer" == f || "byteLength" == f || "byteOffset" == f) || _t(f, c)) || r.push(f);
    }

    return r;
  }

  function x(t, e, n) {
    var r = t[e];
    Ie.call(t, e) && Ft(r, n) && (n !== Zt || e in t) || $(t, e, n);
  }

  function F(t, e) {
    for (var n = t.length; n--;) {
      if (Ft(t[n][0], e)) return n;
    }

    return -1;
  }

  function I(t, e) {
    return t && ut(e, Wt(e), t);
  }

  function E(t, e) {
    return t && ut(e, Gt(e), t);
  }

  function $(t, e, n) {
    "__proto__" == e && We ? We(t, e, {
      configurable: true,
      enumerable: true,
      value: n,
      writable: true
    }) : t[e] = n;
  }

  function B(t, e, n, o, u, c) {
    var i,
        a = 1 & e,
        f = 2 & e,
        l = 4 & e;
    if (n && (i = u ? n(t, o, u, c) : n(t)), i !== Zt) return i;
    if (!Mt(t)) return t;

    if (o = On(t)) {
      if (i = jt(t), !a) return ot(t, i);
    } else {
      var s = gn(t),
          b = "[object Function]" == s || "[object GeneratorFunction]" == s;
      if (Sn(t)) return nt(t, a);

      if ("[object Object]" == s || "[object Arguments]" == s || b && !u) {
        if (i = f || b ? {} : typeof t.constructor != "function" || mt(t) ? {} : bn(Pe(t)), !a) return f ? it(t, E(i, t)) : ct(t, I(i, t));
      } else {
        if (!ye[s]) return u ? t : {};
        i = vt(t, s, B, a);
      }
    }

    if (c || (c = new k()), u = c.get(t)) return u;
    c.set(t, i);
    var f = l ? f ? st : lt : f ? Gt : Wt,
        h = o ? Zt : f(t);
    return r(h || t, function (r, o) {
      h && (o = r, r = t[o]), x(i, o, B(r, e, n, o, t, c));
    }), i;
  }

  function M(t, e) {
    var n = true;
    return hn(t, function (t, r, o) {
      return n = !!e(t, r, o);
    }), n;
  }

  function U(t, e) {
    var n = [];
    return hn(t, function (t, r, o) {
      e(t, r, o) && n.push(t);
    }), n;
  }

  function D(t, e, n, r, o) {
    var u = -1,
        c = t.length;

    for (n || (n = gt), o || (o = []); ++u < c;) {
      var i = t[u];
      0 < e && n(i) ? 1 < e ? D(i, e - 1, n, r, o) : a(o, i) : r || (o[o.length] = i);
    }

    return o;
  }

  function L(t, e) {
    return t && pn(t, e, Wt);
  }

  function P(t, e) {
    e = et(e, t);

    for (var n = 0, r = e.length; null != t && n < r;) {
      t = t[St(e[n++])];
    }

    return n && n == r ? t : Zt;
  }

  function N(t, e, n) {
    return e = e(t), On(t) ? e : a(e, n(t));
  }

  function V(t) {
    if (null == t) t = t === Zt ? "[object Undefined]" : "[object Null]";else if (Te && Te in Object(t)) {
      var e = Ie.call(t, Te),
          n = t[Te];

      try {
        t[Te] = Zt;
        var r = true;
      } catch (t) {}

      var o = $e.call(t);
      r && (e ? t[Te] = n : delete t[Te]), t = o;
    } else t = $e.call(t);
    return t;
  }

  function C(t) {
    return Ut(t) && "[object Arguments]" == V(t);
  }

  function R(t, e, n, r, o) {
    if (t === e) e = true;else if (null == t || null == e || !Ut(t) && !Ut(e)) e = t !== t && e !== e;else t: {
      var u = On(t),
          c = On(e),
          i = u ? "[object Array]" : gn(t),
          a = c ? "[object Array]" : gn(e),
          i = "[object Arguments]" == i ? "[object Object]" : i,
          a = "[object Arguments]" == a ? "[object Object]" : a,
          f = "[object Object]" == i,
          c = "[object Object]" == a;

      if ((a = i == a) && Sn(t)) {
        if (!Sn(e)) {
          e = false;
          break t;
        }

        u = true, f = false;
      }

      if (a && !f) o || (o = new k()), e = u || kn(t) ? at(t, e, n, r, R, o) : ft(t, e, i, n, r, R, o);else {
        if (!(1 & n) && (u = f && Ie.call(t, "__wrapped__"), i = c && Ie.call(e, "__wrapped__"), u || i)) {
          t = u ? t.value() : t, e = i ? e.value() : e, o || (o = new k()), e = R(t, e, n, r, o);
          break t;
        }

        if (a) {
          e: if (o || (o = new k()), u = 1 & n, i = lt(t), c = i.length, a = lt(e).length, c == a || u) {
            for (f = c; f--;) {
              var l = i[f];

              if (!(u ? l in e : Ie.call(e, l))) {
                e = false;
                break e;
              }
            }

            if ((a = o.get(t)) && o.get(e)) e = a == e;else {
              a = true, o.set(t, e), o.set(e, t);

              for (var s = u; ++f < c;) {
                var l = i[f],
                    b = t[l],
                    h = e[l];
                if (r) var p = u ? r(h, b, l, e, t, o) : r(b, h, l, t, e, o);

                if (p === Zt ? b !== h && !R(b, h, n, r, o) : !p) {
                  a = false;
                  break;
                }

                s || (s = "constructor" == l);
              }

              a && !s && (n = t.constructor, r = e.constructor, n != r && "constructor" in t && "constructor" in e && !(typeof n == "function" && n instanceof n && typeof r == "function" && r instanceof r) && (a = false)), o["delete"](t), o["delete"](e), e = a;
            }
          } else e = false;
        } else e = false;
      }
    }
    return e;
  }

  function T(t, e) {
    var n = e.length,
        r = n;
    if (null == t) return !r;

    for (t = Object(t); n--;) {
      var o = e[n];
      if (o[2] ? o[1] !== t[o[0]] : !(o[0] in t)) return false;
    }

    for (; ++n < r;) {
      var o = e[n],
          u = o[0],
          c = t[u],
          i = o[1];

      if (o[2]) {
        if (c === Zt && !(u in t)) return false;
      } else if (o = new k(), void 0 === Zt ? !R(i, c, 3, void 0, o) : 1) return false;
    }

    return true;
  }

  function W(t) {
    return Ut(t) && Bt(t.length) && !!pe[V(t)];
  }

  function G(t) {
    return typeof t == "function" ? t : null == t ? Ht : _typeof(t) == "object" ? On(t) ? H(t[0], t[1]) : K(t) : Qt(t);
  }

  function q(t, e) {
    var n = -1,
        r = It(t) ? Array(t.length) : [];
    return hn(t, function (t, o, u) {
      r[++n] = e(t, o, u);
    }), r;
  }

  function K(t) {
    var e = pt(t);
    return 1 == e.length && e[0][2] ? wt(e[0][0], e[0][1]) : function (n) {
      return n === t || T(n, e);
    };
  }

  function H(t, e) {
    return At(t) && e === e && !Mt(e) ? wt(St(t), e) : function (n) {
      var r = Rt(n, t);
      return r === Zt && r === e ? Tt(n, t) : R(e, r, 3);
    };
  }

  function J(t, e, n) {
    var r = -1;
    return e = i(e.length ? e : [Ht], y(bt())), t = q(t, function (t) {
      return {
        a: i(e, function (e) {
          return e(t);
        }),
        b: ++r,
        c: t
      };
    }), p(t, function (t, e) {
      var r;

      t: {
        r = -1;

        for (var o = t.a, u = e.a, c = o.length, i = n.length; ++r < c;) {
          var a;

          e: {
            a = o[r];
            var f = u[r];

            if (a !== f) {
              var l = a !== Zt,
                  s = null === a,
                  b = a === a,
                  h = Lt(a),
                  p = f !== Zt,
                  y = null === f,
                  j = f === f,
                  v = Lt(f);

              if (!y && !v && !h && a > f || h && p && j && !y && !v || s && p && j || !l && j || !b) {
                a = 1;
                break e;
              }

              if (!s && !h && !v && a < f || v && l && b && !s && !h || y && l && b || !p && b || !j) {
                a = -1;
                break e;
              }
            }

            a = 0;
          }

          if (a) {
            r = r >= i ? a : a * ("desc" == n[r] ? -1 : 1);
            break t;
          }
        }

        r = t.b - e.b;
      }

      return r;
    });
  }

  function Q(t) {
    return function (e) {
      return P(e, t);
    };
  }

  function X(t) {
    return _n(Ot(t, Ht), t + "");
  }

  function Y(t, e) {
    var n;
    return hn(t, function (t, r, o) {
      return n = e(t, r, o), !n;
    }), !!n;
  }

  function Z(t) {
    if (typeof t == "string") return t;
    if (On(t)) return i(t, Z) + "";
    if (Lt(t)) return sn ? sn.call(t) : "";
    var e = t + "";
    return "0" == e && 1 / t == -te ? "-0" : e;
  }

  function tt(t) {
    return Et(t) ? t : [];
  }

  function et(t, e) {
    return On(t) ? t : At(t, e) ? [t] : dn(Ct(t));
  }

  function nt(t, e) {
    if (e) return t.slice();
    var n = t.length,
        n = Le ? Le(n) : new t.constructor(n);
    return t.copy(n), n;
  }

  function rt(t) {
    var e = new t.constructor(t.byteLength);
    return new De(e).set(new De(t)), e;
  }

  function ot(t, e) {
    var n = -1,
        r = t.length;

    for (e || (e = Array(r)); ++n < r;) {
      e[n] = t[n];
    }

    return e;
  }

  function ut(t, e, n) {
    var r = !n;
    n || (n = {});

    for (var o = -1, u = e.length; ++o < u;) {
      var c = e[o],
          i = Zt;
      i === Zt && (i = t[c]), r ? $(n, c, i) : x(n, c, i);
    }

    return n;
  }

  function ct(t, e) {
    return ut(t, jn(t), e);
  }

  function it(t, e) {
    return ut(t, vn(t), e);
  }

  function at(t, e, n, r, o, u) {
    var c = 1 & n,
        i = t.length,
        a = e.length;
    if (i != a && !(c && a > i)) return false;
    if ((a = u.get(t)) && u.get(e)) return a == e;
    var a = -1,
        f = true,
        s = 2 & n ? new S() : Zt;

    for (u.set(t, e), u.set(e, t); ++a < i;) {
      var b = t[a],
          h = e[a];
      if (r) var p = c ? r(h, b, a, e, t, u) : r(b, h, a, t, e, u);

      if (p !== Zt) {
        if (p) continue;
        f = false;
        break;
      }

      if (s) {
        if (!l(e, function (t, e) {
          if (!s.has(e) && (b === t || o(b, t, n, r, u))) return s.push(e);
        })) {
          f = false;
          break;
        }
      } else if (b !== h && !o(b, h, n, r, u)) {
        f = false;
        break;
      }
    }

    return u["delete"](t), u["delete"](e), f;
  }

  function ft(t, e, n, r, o, u, c) {
    switch (n) {
      case "[object DataView]":
        if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) break;
        t = t.buffer, e = e.buffer;

      case "[object ArrayBuffer]":
        if (t.byteLength != e.byteLength || !u(new De(t), new De(e))) break;
        return true;

      case "[object Boolean]":
      case "[object Date]":
      case "[object Number]":
        return Ft(+t, +e);

      case "[object Error]":
        return t.name == e.name && t.message == e.message;

      case "[object RegExp]":
      case "[object String]":
        return t == e + "";

      case "[object Map]":
        var i = v;

      case "[object Set]":
        if (i || (i = _), t.size != e.size && !(1 & r)) break;
        return (n = c.get(t)) ? n == e : (r |= 2, c.set(t, e), e = at(i(t), i(e), r, o, u, c), c["delete"](t), e);

      case "[object Symbol]":
        if (ln) return ln.call(t) == ln.call(e);
    }

    return false;
  }

  function lt(t) {
    return N(t, Wt, jn);
  }

  function st(t) {
    return N(t, Gt, vn);
  }

  function bt() {
    var t = A.iteratee || Jt,
        t = t === Jt ? G : t;
    return arguments.length ? t(arguments[0], arguments[1]) : t;
  }

  function ht(t, e) {
    var n = t.__data__,
        r = _typeof(e);

    return ("string" == r || "number" == r || "symbol" == r || "boolean" == r ? "__proto__" !== e : null === e) ? n[typeof e == "string" ? "string" : "hash"] : n.map;
  }

  function pt(t) {
    for (var e = Wt(t), n = e.length; n--;) {
      var r = e[n],
          o = t[r];
      e[n] = [r, o, o === o && !Mt(o)];
    }

    return e;
  }

  function yt(t, e) {
    var n = null == t ? Zt : t[e];
    return (!Mt(n) || Ee && Ee in n ? 0 : ($t(n) ? Be : se).test(kt(n))) ? n : Zt;
  }

  function jt(t) {
    var e = t.length,
        n = t.constructor(e);
    return e && "string" == typeof t[0] && Ie.call(t, "index") && (n.index = t.index, n.input = t.input), n;
  }

  function vt(n, r, o, u) {
    var c = n.constructor;

    switch (r) {
      case "[object ArrayBuffer]":
        return rt(n);

      case "[object Boolean]":
      case "[object Date]":
        return new c(+n);

      case "[object DataView]":
        return r = u ? rt(n.buffer) : n.buffer, new n.constructor(r, n.byteOffset, n.byteLength);

      case "[object Float32Array]":
      case "[object Float64Array]":
      case "[object Int8Array]":
      case "[object Int16Array]":
      case "[object Int32Array]":
      case "[object Uint8Array]":
      case "[object Uint8ClampedArray]":
      case "[object Uint16Array]":
      case "[object Uint32Array]":
        return r = u ? rt(n.buffer) : n.buffer, new n.constructor(r, n.byteOffset, n.length);

      case "[object Map]":
        return r = u ? o(v(n), 1) : v(n), f(r, t, new n.constructor());

      case "[object Number]":
      case "[object String]":
        return new c(n);

      case "[object RegExp]":
        return r = new n.constructor(n.source, ae.exec(n)), r.lastIndex = n.lastIndex, r;

      case "[object Set]":
        return r = u ? o(_(n), 1) : _(n), f(r, e, new n.constructor());

      case "[object Symbol]":
        return ln ? Object(ln.call(n)) : {};
    }
  }

  function gt(t) {
    return On(t) || wn(t) || !!(Re && t && t[Re]);
  }

  function _t(t, e) {
    return e = null == e ? 9007199254740991 : e, !!e && (typeof t == "number" || he.test(t)) && -1 < t && 0 == t % 1 && t < e;
  }

  function dt(t, e, n) {
    if (!Mt(n)) return false;

    var r = _typeof(e);

    return !!("number" == r ? It(n) && _t(e, n.length) : "string" == r && e in n) && Ft(n[e], t);
  }

  function At(t, e) {
    if (On(t)) return false;

    var n = _typeof(t);

    return !("number" != n && "symbol" != n && "boolean" != n && null != t && !Lt(t)) || re.test(t) || !ne.test(t) || null != e && t in Object(e);
  }

  function mt(t) {
    var e = t && t.constructor;
    return t === (typeof e == "function" && e.prototype || ze);
  }

  function wt(t, e) {
    return function (n) {
      return null != n && n[t] === e && (e !== Zt || t in Object(n));
    };
  }

  function Ot(t, e) {
    var r = void 0,
        r = He(r === Zt ? t.length - 1 : r, 0);
    return function () {
      for (var o = arguments, u = -1, c = He(o.length - r, 0), i = Array(c); ++u < c;) {
        i[u] = o[r + u];
      }

      for (u = -1, c = Array(r + 1); ++u < r;) {
        c[u] = o[u];
      }

      return c[r] = e(i), n(t, this, c);
    };
  }

  function St(t) {
    if (typeof t == "string" || Lt(t)) return t;
    var e = t + "";
    return "0" == e && 1 / t == -te ? "-0" : e;
  }

  function kt(t) {
    if (null != t) {
      try {
        return Fe.call(t);
      } catch (t) {}

      return t + "";
    }

    return "";
  }

  function zt(t, e) {
    return (On(t) ? r : hn)(t, bt(e, 3));
  }

  function xt(t, e) {
    function n() {
      var r = arguments,
          o = e ? e.apply(this, r) : r[0],
          u = n.cache;
      return u.has(o) ? u.get(o) : (r = t.apply(this, r), n.cache = u.set(o, r) || u, r);
    }

    if (typeof t != "function" || null != e && typeof e != "function") throw new TypeError("Expected a function");
    return n.cache = new (xt.Cache || O)(), n;
  }

  function Ft(t, e) {
    return t === e || t !== t && e !== e;
  }

  function It(t) {
    return null != t && Bt(t.length) && !$t(t);
  }

  function Et(t) {
    return Ut(t) && It(t);
  }

  function $t(t) {
    return !!Mt(t) && (t = V(t), "[object Function]" == t || "[object GeneratorFunction]" == t || "[object AsyncFunction]" == t || "[object Proxy]" == t);
  }

  function Bt(t) {
    return typeof t == "number" && -1 < t && 0 == t % 1 && 9007199254740991 >= t;
  }

  function Mt(t) {
    var e = _typeof(t);

    return null != t && ("object" == e || "function" == e);
  }

  function Ut(t) {
    return null != t && _typeof(t) == "object";
  }

  function Dt(t) {
    return typeof t == "string" || !On(t) && Ut(t) && "[object String]" == V(t);
  }

  function Lt(t) {
    return _typeof(t) == "symbol" || Ut(t) && "[object Symbol]" == V(t);
  }

  function Pt(t) {
    return t ? (t = Vt(t), t === te || t === -te ? 1.7976931348623157e308 * (0 > t ? -1 : 1) : t === t ? t : 0) : 0 === t ? t : 0;
  }

  function Nt(t) {
    t = Pt(t);
    var e = t % 1;
    return t === t ? e ? t - e : t : 0;
  }

  function Vt(t) {
    if (typeof t == "number") return t;
    if (Lt(t)) return ee;
    if (Mt(t) && (t = typeof t.valueOf == "function" ? t.valueOf() : t, t = Mt(t) ? t + "" : t), typeof t != "string") return 0 === t ? t : +t;
    t = t.replace(ce, "");
    var e = le.test(t);
    return e || be.test(t) ? ve(t.slice(2), e ? 2 : 8) : fe.test(t) ? ee : +t;
  }

  function Ct(t) {
    return null == t ? "" : Z(t);
  }

  function Rt(t, e, n) {
    return t = null == t ? Zt : P(t, e), t === Zt ? n : t;
  }

  function Tt(t, e) {
    var n;

    if (n = null != t) {
      n = t;
      var r;
      r = et(e, n);

      for (var o = -1, u = r.length, c = false; ++o < u;) {
        var i = St(r[o]);
        if (!(c = null != n && null != n && i in Object(n))) break;
        n = n[i];
      }

      c || ++o != u ? n = c : (u = null == n ? 0 : n.length, n = !!u && Bt(u) && _t(i, u) && (On(n) || wn(n)));
    }

    return n;
  }

  function Wt(t) {
    if (It(t)) t = z(t);else if (mt(t)) {
      var e,
          n = [];

      for (e in Object(t)) {
        Ie.call(t, e) && "constructor" != e && n.push(e);
      }

      t = n;
    } else t = Ke(t);
    return t;
  }

  function Gt(t) {
    if (It(t)) t = z(t, true);else if (Mt(t)) {
      var e,
          n = mt(t),
          r = [];

      for (e in t) {
        ("constructor" != e || !n && Ie.call(t, e)) && r.push(e);
      }

      t = r;
    } else {
      if (e = [], null != t) for (n in Object(t)) {
        e.push(n);
      }
      t = e;
    }
    return t;
  }

  function qt(t) {
    return null == t ? [] : j(t, Wt(t));
  }

  function Kt(t) {
    return function () {
      return t;
    };
  }

  function Ht(t) {
    return t;
  }

  function Jt(t) {
    return G(typeof t == "function" ? t : B(t, 1));
  }

  function Qt(t) {
    return At(t) ? h(St(t)) : Q(t);
  }

  function Xt() {
    return [];
  }

  function Yt() {
    return false;
  }

  var Zt,
      te = 1 / 0,
      ee = NaN,
      ne = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      re = /^\w*$/,
      oe = /^\./,
      ue = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      ce = /^\s+|\s+$/g,
      ie = /\\(\\)?/g,
      ae = /\w*$/,
      fe = /^[-+]0x[0-9a-f]+$/i,
      le = /^0b[01]+$/i,
      se = /^\[object .+?Constructor\]$/,
      be = /^0o[0-7]+$/i,
      he = /^(?:0|[1-9]\d*)$/,
      pe = {};
  pe["[object Float32Array]"] = pe["[object Float64Array]"] = pe["[object Int8Array]"] = pe["[object Int16Array]"] = pe["[object Int32Array]"] = pe["[object Uint8Array]"] = pe["[object Uint8ClampedArray]"] = pe["[object Uint16Array]"] = pe["[object Uint32Array]"] = true, pe["[object Arguments]"] = pe["[object Array]"] = pe["[object ArrayBuffer]"] = pe["[object Boolean]"] = pe["[object DataView]"] = pe["[object Date]"] = pe["[object Error]"] = pe["[object Function]"] = pe["[object Map]"] = pe["[object Number]"] = pe["[object Object]"] = pe["[object RegExp]"] = pe["[object Set]"] = pe["[object String]"] = pe["[object WeakMap]"] = false;
  var ye = {};
  ye["[object Arguments]"] = ye["[object Array]"] = ye["[object ArrayBuffer]"] = ye["[object DataView]"] = ye["[object Boolean]"] = ye["[object Date]"] = ye["[object Float32Array]"] = ye["[object Float64Array]"] = ye["[object Int8Array]"] = ye["[object Int16Array]"] = ye["[object Int32Array]"] = ye["[object Map]"] = ye["[object Number]"] = ye["[object Object]"] = ye["[object RegExp]"] = ye["[object Set]"] = ye["[object String]"] = ye["[object Symbol]"] = ye["[object Uint8Array]"] = ye["[object Uint8ClampedArray]"] = ye["[object Uint16Array]"] = ye["[object Uint32Array]"] = true, ye["[object Error]"] = ye["[object Function]"] = ye["[object WeakMap]"] = false;

  var je,
      ve = parseInt,
      ge = (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global && global.Object === Object && global,
      _e = (typeof self === "undefined" ? "undefined" : _typeof(self)) == "object" && self && self.Object === Object && self,
      de = ge || _e || Function("return this")(),
      Ae = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && exports && !exports.nodeType && exports,
      me = Ae && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && module && !module.nodeType && module,
      we = me && me.exports === Ae,
      Oe = we && ge.process;

  t: {
    try {
      je = Oe && Oe.binding && Oe.binding("util");
      break t;
    } catch (t) {}

    je = void 0;
  }

  var Se = je && je.isTypedArray,
      ke = Array.prototype,
      ze = Object.prototype,
      xe = de["__core-js_shared__"],
      Fe = Function.prototype.toString,
      Ie = ze.hasOwnProperty,
      Ee = function () {
    var t = /[^.]+$/.exec(xe && xe.keys && xe.keys.IE_PROTO || "");
    return t ? "Symbol(src)_1." + t : "";
  }(),
      $e = ze.toString,
      Be = RegExp("^" + Fe.call(Ie).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
      Me = we ? de.Buffer : Zt,
      Ue = de.Symbol,
      De = de.Uint8Array,
      Le = Me ? Me.f : Zt,
      Pe = g(Object.getPrototypeOf),
      Ne = Object.create,
      Ve = ze.propertyIsEnumerable,
      Ce = ke.splice,
      Re = Ue ? Ue.isConcatSpreadable : Zt,
      Te = Ue ? Ue.toStringTag : Zt,
      We = function () {
    try {
      var t = yt(Object, "defineProperty");
      return t({}, "", {}), t;
    } catch (t) {}
  }(),
      Ge = Object.getOwnPropertySymbols,
      qe = Me ? Me.isBuffer : Zt,
      Ke = g(Object.keys),
      He = Math.max,
      Je = Math.min,
      Qe = Date.now,
      Xe = yt(de, "DataView"),
      Ye = yt(de, "Map"),
      Ze = yt(de, "Promise"),
      tn = yt(de, "Set"),
      en = yt(de, "WeakMap"),
      nn = yt(Object, "create"),
      rn = kt(Xe),
      on = kt(Ye),
      un = kt(Ze),
      cn = kt(tn),
      an = kt(en),
      fn = Ue ? Ue.prototype : Zt,
      ln = fn ? fn.valueOf : Zt,
      sn = fn ? fn.toString : Zt,
      bn = function () {
    function t() {}

    return function (e) {
      return Mt(e) ? Ne ? Ne(e) : (t.prototype = e, e = new t(), t.prototype = Zt, e) : {};
    };
  }();

  m.prototype.clear = function () {
    this.__data__ = nn ? nn(null) : {}, this.size = 0;
  }, m.prototype["delete"] = function (t) {
    return t = this.has(t) && delete this.__data__[t], this.size -= t ? 1 : 0, t;
  }, m.prototype.get = function (t) {
    var e = this.__data__;
    return nn ? (t = e[t], "__lodash_hash_undefined__" === t ? Zt : t) : Ie.call(e, t) ? e[t] : Zt;
  }, m.prototype.has = function (t) {
    var e = this.__data__;
    return nn ? e[t] !== Zt : Ie.call(e, t);
  }, m.prototype.set = function (t, e) {
    var n = this.__data__;
    return this.size += this.has(t) ? 0 : 1, n[t] = nn && e === Zt ? "__lodash_hash_undefined__" : e, this;
  }, w.prototype.clear = function () {
    this.__data__ = [], this.size = 0;
  }, w.prototype["delete"] = function (t) {
    var e = this.__data__;
    return t = F(e, t), !(0 > t) && (t == e.length - 1 ? e.pop() : Ce.call(e, t, 1), --this.size, true);
  }, w.prototype.get = function (t) {
    var e = this.__data__;
    return t = F(e, t), 0 > t ? Zt : e[t][1];
  }, w.prototype.has = function (t) {
    return -1 < F(this.__data__, t);
  }, w.prototype.set = function (t, e) {
    var n = this.__data__,
        r = F(n, t);
    return 0 > r ? (++this.size, n.push([t, e])) : n[r][1] = e, this;
  }, O.prototype.clear = function () {
    this.size = 0, this.__data__ = {
      hash: new m(),
      map: new (Ye || w)(),
      string: new m()
    };
  }, O.prototype["delete"] = function (t) {
    return t = ht(this, t)["delete"](t), this.size -= t ? 1 : 0, t;
  }, O.prototype.get = function (t) {
    return ht(this, t).get(t);
  }, O.prototype.has = function (t) {
    return ht(this, t).has(t);
  }, O.prototype.set = function (t, e) {
    var n = ht(this, t),
        r = n.size;
    return n.set(t, e), this.size += n.size == r ? 0 : 1, this;
  }, S.prototype.add = S.prototype.push = function (t) {
    return this.__data__.set(t, "__lodash_hash_undefined__"), this;
  }, S.prototype.has = function (t) {
    return this.__data__.has(t);
  }, k.prototype.clear = function () {
    this.__data__ = new w(), this.size = 0;
  }, k.prototype["delete"] = function (t) {
    var e = this.__data__;
    return t = e["delete"](t), this.size = e.size, t;
  }, k.prototype.get = function (t) {
    return this.__data__.get(t);
  }, k.prototype.has = function (t) {
    return this.__data__.has(t);
  }, k.prototype.set = function (t, e) {
    var n = this.__data__;

    if (n instanceof w) {
      var r = n.__data__;
      if (!Ye || 199 > r.length) return r.push([t, e]), this.size = ++n.size, this;
      n = this.__data__ = new O(r);
    }

    return n.set(t, e), this.size = n.size, this;
  };

  var hn = function (t, e) {
    return function (n, r) {
      if (null == n) return n;
      if (!It(n)) return t(n, r);

      for (var o = n.length, u = e ? o : -1, c = Object(n); (e ? u-- : ++u < o) && false !== r(c[u], u, c);) {
        ;
      }

      return n;
    };
  }(L),
      pn = function (t) {
    return function (e, n, r) {
      var o = -1,
          u = Object(e);
      r = r(e);

      for (var c = r.length; c--;) {
        var i = r[t ? c : ++o];
        if (false === n(u[i], i, u)) break;
      }

      return e;
    };
  }(),
      yn = We ? function (t, e) {
    return We(t, "toString", {
      configurable: true,
      enumerable: false,
      value: Kt(e),
      writable: true
    });
  } : Ht,
      jn = Ge ? function (t) {
    return null == t ? [] : (t = Object(t), u(Ge(t), function (e) {
      return Ve.call(t, e);
    }));
  } : Xt,
      vn = Ge ? function (t) {
    for (var e = []; t;) {
      a(e, jn(t)), t = Pe(t);
    }

    return e;
  } : Xt,
      gn = V;

  (Xe && "[object DataView]" != gn(new Xe(new ArrayBuffer(1))) || Ye && "[object Map]" != gn(new Ye()) || Ze && "[object Promise]" != gn(Ze.resolve()) || tn && "[object Set]" != gn(new tn()) || en && "[object WeakMap]" != gn(new en())) && (gn = function gn(t) {
    var e = V(t);
    if (t = (t = "[object Object]" == e ? t.constructor : Zt) ? kt(t) : "") switch (t) {
      case rn:
        return "[object DataView]";

      case on:
        return "[object Map]";

      case un:
        return "[object Promise]";

      case cn:
        return "[object Set]";

      case an:
        return "[object WeakMap]";
    }
    return e;
  });

  var _n = function (t) {
    var e = 0,
        n = 0;
    return function () {
      var r = Qe(),
          o = 16 - (r - n);

      if (n = r, 0 < o) {
        if (800 <= ++e) return arguments[0];
      } else e = 0;

      return t.apply(Zt, arguments);
    };
  }(yn),
      dn = function (t) {
    t = xt(t, function (t) {
      return 500 === e.size && e.clear(), t;
    });
    var e = t.cache;
    return t;
  }(function (t) {
    var e = [];
    return oe.test(t) && e.push(""), t.replace(ue, function (t, n, r, o) {
      e.push(r ? o.replace(ie, "$1") : n || t);
    }), e;
  }),
      An = X(function (t) {
    var e = i(t, tt);

    if (e.length && e[0] === t[0]) {
      t = e[0].length;

      for (var n = e.length, r = n, o = Array(n), u = 1 / 0, a = []; r--;) {
        var f = e[r],
            u = Je(f.length, u);
        o[r] = 120 <= t && 120 <= f.length ? new S(r && f) : Zt;
      }

      var f = e[0],
          l = -1,
          s = o[0];

      t: for (; ++l < t && a.length < u;) {
        var b = f[l],
            h = b,
            b = 0 !== b ? b : 0;

        if (s ? !s.has(h) : !c(a, h)) {
          for (r = n; --r;) {
            var p = o[r];
            if (p ? !p.has(h) : !c(e[r], h)) continue t;
          }

          s && s.push(h), a.push(b);
        }
      }

      e = a;
    } else e = [];

    return e;
  }),
      mn = X(function (t, e) {
    if (null == t) return [];
    var n = e.length;
    return 1 < n && dt(t, e[0], e[1]) ? e = [] : 2 < n && dt(e[0], e[1], e[2]) && (e = [e[0]]), J(t, D(e, 1), []);
  });

  xt.Cache = O;
  var wn = C(function () {
    return arguments;
  }()) ? C : function (t) {
    return Ut(t) && Ie.call(t, "callee") && !Ve.call(t, "callee");
  },
      On = Array.isArray,
      Sn = qe || Yt,
      kn = Se ? y(Se) : W;
  A.constant = Kt, A.filter = function (t, e) {
    return (On(t) ? u : U)(t, bt(e, 3));
  }, A.flatten = function (t) {
    return (null == t ? 0 : t.length) ? D(t, 1) : [];
  }, A.intersection = An, A.iteratee = Jt, A.keys = Wt, A.keysIn = Gt, A.map = function (t, e) {
    return (On(t) ? i : q)(t, bt(e, 3));
  }, A.mapKeys = function (t, e) {
    var n = {};
    return e = bt(e, 3), L(t, function (t, r, o) {
      $(n, e(t, r, o), t);
    }), n;
  }, A.mapValues = function (t, e) {
    var n = {};
    return e = bt(e, 3), L(t, function (t, r, o) {
      $(n, r, e(t, r, o));
    }), n;
  }, A.memoize = xt, A.orderBy = function (t, e, n, r) {
    return null == t ? [] : (On(e) || (e = null == e ? [] : [e]), n = r ? Zt : n, On(n) || (n = null == n ? [] : [n]), J(t, e, n));
  }, A.property = Qt, A.sortBy = mn, A.transform = function (t, e, n) {
    var o = On(t),
        u = o || Sn(t) || kn(t);

    if (e = bt(e, 4), null == n) {
      var c = t && t.constructor;
      n = u ? o ? new c() : [] : Mt(t) && $t(c) ? bn(Pe(t)) : {};
    }

    return (u ? r : L)(t, function (t, r, o) {
      return e(n, t, r, o);
    }), n;
  }, A.values = qt, A.clone = function (t) {
    return B(t, 4);
  }, A.eq = Ft, A.every = function (t, e, n) {
    var r = On(t) ? o : M;
    return n && dt(t, e, n) && (e = Zt), r(t, bt(e, 3));
  }, A.forEach = zt, A.get = Rt, A.hasIn = Tt, A.identity = Ht, A.includes = function (t, e, n, r) {
    return t = It(t) ? t : qt(t), n = n && !r ? Nt(n) : 0, r = t.length, 0 > n && (n = He(r + n, 0)), Dt(t) ? n <= r && -1 < t.indexOf(e, n) : !!r && -1 < (e === e ? d(t, e, n) : s(t, b, n));
  }, A.isArguments = wn, A.isArray = On, A.isArrayLike = It, A.isArrayLikeObject = Et, A.isBuffer = Sn, A.isFunction = $t, A.isLength = Bt, A.isObject = Mt, A.isObjectLike = Ut, A.isString = Dt, A.isSymbol = Lt, A.isTypedArray = kn, A.stubArray = Xt, A.stubFalse = Yt, A.some = function (t, e, n) {
    var r = On(t) ? l : Y;
    return n && dt(t, e, n) && (e = Zt), r(t, bt(e, 3));
  }, A.toFinite = Pt, A.toInteger = Nt, A.toNumber = Vt, A.toString = Ct, A.each = zt, A.VERSION = "4.17.4", typeof define == "function" && _typeof(define.amd) == "object" && define.amd ? (de._ = A, define(function () {
    return A;
  })) : me ? ((me.exports = A)._ = A, Ae._ = A) : de._ = A;
}).call(void 0);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
