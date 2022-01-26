
// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare: function() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc: function(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy: function(array, view, offset) {
    offset >>>= 0;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offset >>>= 1; break;
      case 4: offset >>>= 2; break;
      case 8: offset >>>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}


// VoidPtr
/** @suppress {undefinedVars, duplicate} @this{Object} */function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// rcConfig
/** @suppress {undefinedVars, duplicate} @this{Object} */function rcConfig() {
  this.ptr = _emscripten_bind_rcConfig_rcConfig_0();
  getCache(rcConfig)[this.ptr] = this;
};;
rcConfig.prototype = Object.create(WrapperObject.prototype);
rcConfig.prototype.constructor = rcConfig;
rcConfig.prototype.__class__ = rcConfig;
rcConfig.__cache__ = {};
Module['rcConfig'] = rcConfig;

  rcConfig.prototype['get_width'] = rcConfig.prototype.get_width = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_width_0(self);
};
    rcConfig.prototype['set_width'] = rcConfig.prototype.set_width = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_width_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'width', { get: rcConfig.prototype.get_width, set: rcConfig.prototype.set_width });
  rcConfig.prototype['get_height'] = rcConfig.prototype.get_height = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_height_0(self);
};
    rcConfig.prototype['set_height'] = rcConfig.prototype.set_height = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_height_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'height', { get: rcConfig.prototype.get_height, set: rcConfig.prototype.set_height });
  rcConfig.prototype['get_tileSize'] = rcConfig.prototype.get_tileSize = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_tileSize_0(self);
};
    rcConfig.prototype['set_tileSize'] = rcConfig.prototype.set_tileSize = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_tileSize_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'tileSize', { get: rcConfig.prototype.get_tileSize, set: rcConfig.prototype.set_tileSize });
  rcConfig.prototype['get_borderSize'] = rcConfig.prototype.get_borderSize = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_borderSize_0(self);
};
    rcConfig.prototype['set_borderSize'] = rcConfig.prototype.set_borderSize = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_borderSize_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'borderSize', { get: rcConfig.prototype.get_borderSize, set: rcConfig.prototype.set_borderSize });
  rcConfig.prototype['get_cs'] = rcConfig.prototype.get_cs = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_cs_0(self);
};
    rcConfig.prototype['set_cs'] = rcConfig.prototype.set_cs = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_cs_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'cs', { get: rcConfig.prototype.get_cs, set: rcConfig.prototype.set_cs });
  rcConfig.prototype['get_ch'] = rcConfig.prototype.get_ch = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_ch_0(self);
};
    rcConfig.prototype['set_ch'] = rcConfig.prototype.set_ch = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_ch_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'ch', { get: rcConfig.prototype.get_ch, set: rcConfig.prototype.set_ch });
  rcConfig.prototype['get_bmin'] = rcConfig.prototype.get_bmin = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_rcConfig_get_bmin_1(self, arg0);
};
    rcConfig.prototype['set_bmin'] = rcConfig.prototype.set_bmin = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0, arg1) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_rcConfig_set_bmin_2(self, arg0, arg1);
};
    Object.defineProperty(rcConfig.prototype, 'bmin', { get: rcConfig.prototype.get_bmin, set: rcConfig.prototype.set_bmin });
  rcConfig.prototype['get_bmax'] = rcConfig.prototype.get_bmax = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_rcConfig_get_bmax_1(self, arg0);
};
    rcConfig.prototype['set_bmax'] = rcConfig.prototype.set_bmax = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0, arg1) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_rcConfig_set_bmax_2(self, arg0, arg1);
};
    Object.defineProperty(rcConfig.prototype, 'bmax', { get: rcConfig.prototype.get_bmax, set: rcConfig.prototype.set_bmax });
  rcConfig.prototype['get_walkableSlopeAngle'] = rcConfig.prototype.get_walkableSlopeAngle = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_walkableSlopeAngle_0(self);
};
    rcConfig.prototype['set_walkableSlopeAngle'] = rcConfig.prototype.set_walkableSlopeAngle = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_walkableSlopeAngle_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'walkableSlopeAngle', { get: rcConfig.prototype.get_walkableSlopeAngle, set: rcConfig.prototype.set_walkableSlopeAngle });
  rcConfig.prototype['get_walkableHeight'] = rcConfig.prototype.get_walkableHeight = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_walkableHeight_0(self);
};
    rcConfig.prototype['set_walkableHeight'] = rcConfig.prototype.set_walkableHeight = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_walkableHeight_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'walkableHeight', { get: rcConfig.prototype.get_walkableHeight, set: rcConfig.prototype.set_walkableHeight });
  rcConfig.prototype['get_walkableClimb'] = rcConfig.prototype.get_walkableClimb = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_walkableClimb_0(self);
};
    rcConfig.prototype['set_walkableClimb'] = rcConfig.prototype.set_walkableClimb = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_walkableClimb_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'walkableClimb', { get: rcConfig.prototype.get_walkableClimb, set: rcConfig.prototype.set_walkableClimb });
  rcConfig.prototype['get_walkableRadius'] = rcConfig.prototype.get_walkableRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_walkableRadius_0(self);
};
    rcConfig.prototype['set_walkableRadius'] = rcConfig.prototype.set_walkableRadius = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_walkableRadius_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'walkableRadius', { get: rcConfig.prototype.get_walkableRadius, set: rcConfig.prototype.set_walkableRadius });
  rcConfig.prototype['get_maxEdgeLen'] = rcConfig.prototype.get_maxEdgeLen = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_maxEdgeLen_0(self);
};
    rcConfig.prototype['set_maxEdgeLen'] = rcConfig.prototype.set_maxEdgeLen = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_maxEdgeLen_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'maxEdgeLen', { get: rcConfig.prototype.get_maxEdgeLen, set: rcConfig.prototype.set_maxEdgeLen });
  rcConfig.prototype['get_maxSimplificationError'] = rcConfig.prototype.get_maxSimplificationError = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_maxSimplificationError_0(self);
};
    rcConfig.prototype['set_maxSimplificationError'] = rcConfig.prototype.set_maxSimplificationError = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_maxSimplificationError_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'maxSimplificationError', { get: rcConfig.prototype.get_maxSimplificationError, set: rcConfig.prototype.set_maxSimplificationError });
  rcConfig.prototype['get_minRegionArea'] = rcConfig.prototype.get_minRegionArea = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_minRegionArea_0(self);
};
    rcConfig.prototype['set_minRegionArea'] = rcConfig.prototype.set_minRegionArea = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_minRegionArea_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'minRegionArea', { get: rcConfig.prototype.get_minRegionArea, set: rcConfig.prototype.set_minRegionArea });
  rcConfig.prototype['get_mergeRegionArea'] = rcConfig.prototype.get_mergeRegionArea = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_mergeRegionArea_0(self);
};
    rcConfig.prototype['set_mergeRegionArea'] = rcConfig.prototype.set_mergeRegionArea = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_mergeRegionArea_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'mergeRegionArea', { get: rcConfig.prototype.get_mergeRegionArea, set: rcConfig.prototype.set_mergeRegionArea });
  rcConfig.prototype['get_maxVertsPerPoly'] = rcConfig.prototype.get_maxVertsPerPoly = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_maxVertsPerPoly_0(self);
};
    rcConfig.prototype['set_maxVertsPerPoly'] = rcConfig.prototype.set_maxVertsPerPoly = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_maxVertsPerPoly_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'maxVertsPerPoly', { get: rcConfig.prototype.get_maxVertsPerPoly, set: rcConfig.prototype.set_maxVertsPerPoly });
  rcConfig.prototype['get_detailSampleDist'] = rcConfig.prototype.get_detailSampleDist = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_detailSampleDist_0(self);
};
    rcConfig.prototype['set_detailSampleDist'] = rcConfig.prototype.set_detailSampleDist = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_detailSampleDist_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'detailSampleDist', { get: rcConfig.prototype.get_detailSampleDist, set: rcConfig.prototype.set_detailSampleDist });
  rcConfig.prototype['get_detailSampleMaxError'] = rcConfig.prototype.get_detailSampleMaxError = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_rcConfig_get_detailSampleMaxError_0(self);
};
    rcConfig.prototype['set_detailSampleMaxError'] = rcConfig.prototype.set_detailSampleMaxError = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_rcConfig_set_detailSampleMaxError_1(self, arg0);
};
    Object.defineProperty(rcConfig.prototype, 'detailSampleMaxError', { get: rcConfig.prototype.get_detailSampleMaxError, set: rcConfig.prototype.set_detailSampleMaxError });
  rcConfig.prototype['__destroy__'] = rcConfig.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_rcConfig___destroy___0(self);
};
// Vec3
/** @suppress {undefinedVars, duplicate} @this{Object} */function Vec3(x, y, z) {
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (x === undefined) { this.ptr = _emscripten_bind_Vec3_Vec3_0(); getCache(Vec3)[this.ptr] = this;return }
  if (y === undefined) { this.ptr = _emscripten_bind_Vec3_Vec3_1(x); getCache(Vec3)[this.ptr] = this;return }
  if (z === undefined) { this.ptr = _emscripten_bind_Vec3_Vec3_2(x, y); getCache(Vec3)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_Vec3_Vec3_3(x, y, z);
  getCache(Vec3)[this.ptr] = this;
};;
Vec3.prototype = Object.create(WrapperObject.prototype);
Vec3.prototype.constructor = Vec3;
Vec3.prototype.__class__ = Vec3;
Vec3.__cache__ = {};
Module['Vec3'] = Vec3;

  Vec3.prototype['get_x'] = Vec3.prototype.get_x = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_get_x_0(self);
};
    Vec3.prototype['set_x'] = Vec3.prototype.set_x = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Vec3_set_x_1(self, arg0);
};
    Object.defineProperty(Vec3.prototype, 'x', { get: Vec3.prototype.get_x, set: Vec3.prototype.set_x });
  Vec3.prototype['get_y'] = Vec3.prototype.get_y = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_get_y_0(self);
};
    Vec3.prototype['set_y'] = Vec3.prototype.set_y = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Vec3_set_y_1(self, arg0);
};
    Object.defineProperty(Vec3.prototype, 'y', { get: Vec3.prototype.get_y, set: Vec3.prototype.set_y });
  Vec3.prototype['get_z'] = Vec3.prototype.get_z = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3_get_z_0(self);
};
    Vec3.prototype['set_z'] = Vec3.prototype.set_z = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Vec3_set_z_1(self, arg0);
};
    Object.defineProperty(Vec3.prototype, 'z', { get: Vec3.prototype.get_z, set: Vec3.prototype.set_z });
  Vec3.prototype['__destroy__'] = Vec3.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Vec3___destroy___0(self);
};
// Triangle
/** @suppress {undefinedVars, duplicate} @this{Object} */function Triangle() {
  this.ptr = _emscripten_bind_Triangle_Triangle_0();
  getCache(Triangle)[this.ptr] = this;
};;
Triangle.prototype = Object.create(WrapperObject.prototype);
Triangle.prototype.constructor = Triangle;
Triangle.prototype.__class__ = Triangle;
Triangle.__cache__ = {};
Module['Triangle'] = Triangle;

Triangle.prototype['getPoint'] = Triangle.prototype.getPoint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_Triangle_getPoint_1(self, n), Vec3);
};;

  Triangle.prototype['__destroy__'] = Triangle.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Triangle___destroy___0(self);
};
// DebugNavMesh
/** @suppress {undefinedVars, duplicate} @this{Object} */function DebugNavMesh() {
  this.ptr = _emscripten_bind_DebugNavMesh_DebugNavMesh_0();
  getCache(DebugNavMesh)[this.ptr] = this;
};;
DebugNavMesh.prototype = Object.create(WrapperObject.prototype);
DebugNavMesh.prototype.constructor = DebugNavMesh;
DebugNavMesh.prototype.__class__ = DebugNavMesh;
DebugNavMesh.__cache__ = {};
Module['DebugNavMesh'] = DebugNavMesh;

DebugNavMesh.prototype['getTriangleCount'] = DebugNavMesh.prototype.getTriangleCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_DebugNavMesh_getTriangleCount_0(self);
};;

DebugNavMesh.prototype['getTriangle'] = DebugNavMesh.prototype.getTriangle = /** @suppress {undefinedVars, duplicate} @this{Object} */function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_DebugNavMesh_getTriangle_1(self, n), Triangle);
};;

  DebugNavMesh.prototype['__destroy__'] = DebugNavMesh.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_DebugNavMesh___destroy___0(self);
};
// dtNavMesh
/** @suppress {undefinedVars, duplicate} @this{Object} */function dtNavMesh() { throw "cannot construct a dtNavMesh, no constructor in IDL" }
dtNavMesh.prototype = Object.create(WrapperObject.prototype);
dtNavMesh.prototype.constructor = dtNavMesh;
dtNavMesh.prototype.__class__ = dtNavMesh;
dtNavMesh.__cache__ = {};
Module['dtNavMesh'] = dtNavMesh;

  dtNavMesh.prototype['__destroy__'] = dtNavMesh.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_dtNavMesh___destroy___0(self);
};
// NavmeshData
/** @suppress {undefinedVars, duplicate} @this{Object} */function NavmeshData() {
  this.ptr = _emscripten_bind_NavmeshData_NavmeshData_0();
  getCache(NavmeshData)[this.ptr] = this;
};;
NavmeshData.prototype = Object.create(WrapperObject.prototype);
NavmeshData.prototype.constructor = NavmeshData;
NavmeshData.prototype.__class__ = NavmeshData;
NavmeshData.__cache__ = {};
Module['NavmeshData'] = NavmeshData;

  NavmeshData.prototype['get_dataPointer'] = NavmeshData.prototype.get_dataPointer = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_NavmeshData_get_dataPointer_0(self);
};
    NavmeshData.prototype['set_dataPointer'] = NavmeshData.prototype.set_dataPointer = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_NavmeshData_set_dataPointer_1(self, arg0);
};
    Object.defineProperty(NavmeshData.prototype, 'dataPointer', { get: NavmeshData.prototype.get_dataPointer, set: NavmeshData.prototype.set_dataPointer });
  NavmeshData.prototype['get_size'] = NavmeshData.prototype.get_size = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_NavmeshData_get_size_0(self);
};
    NavmeshData.prototype['set_size'] = NavmeshData.prototype.set_size = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_NavmeshData_set_size_1(self, arg0);
};
    Object.defineProperty(NavmeshData.prototype, 'size', { get: NavmeshData.prototype.get_size, set: NavmeshData.prototype.set_size });
  NavmeshData.prototype['__destroy__'] = NavmeshData.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_NavmeshData___destroy___0(self);
};
// NavPath
/** @suppress {undefinedVars, duplicate} @this{Object} */function NavPath() { throw "cannot construct a NavPath, no constructor in IDL" }
NavPath.prototype = Object.create(WrapperObject.prototype);
NavPath.prototype.constructor = NavPath;
NavPath.prototype.__class__ = NavPath;
NavPath.__cache__ = {};
Module['NavPath'] = NavPath;

NavPath.prototype['getPointCount'] = NavPath.prototype.getPointCount = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_NavPath_getPointCount_0(self);
};;

NavPath.prototype['getPoint'] = NavPath.prototype.getPoint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_NavPath_getPoint_1(self, n), Vec3);
};;

  NavPath.prototype['__destroy__'] = NavPath.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_NavPath___destroy___0(self);
};
// dtObstacleRef
/** @suppress {undefinedVars, duplicate} @this{Object} */function dtObstacleRef() { throw "cannot construct a dtObstacleRef, no constructor in IDL" }
dtObstacleRef.prototype = Object.create(WrapperObject.prototype);
dtObstacleRef.prototype.constructor = dtObstacleRef;
dtObstacleRef.prototype.__class__ = dtObstacleRef;
dtObstacleRef.__cache__ = {};
Module['dtObstacleRef'] = dtObstacleRef;

  dtObstacleRef.prototype['__destroy__'] = dtObstacleRef.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_dtObstacleRef___destroy___0(self);
};
// dtCrowdAgentParams
/** @suppress {undefinedVars, duplicate} @this{Object} */function dtCrowdAgentParams() {
  this.ptr = _emscripten_bind_dtCrowdAgentParams_dtCrowdAgentParams_0();
  getCache(dtCrowdAgentParams)[this.ptr] = this;
};;
dtCrowdAgentParams.prototype = Object.create(WrapperObject.prototype);
dtCrowdAgentParams.prototype.constructor = dtCrowdAgentParams;
dtCrowdAgentParams.prototype.__class__ = dtCrowdAgentParams;
dtCrowdAgentParams.__cache__ = {};
Module['dtCrowdAgentParams'] = dtCrowdAgentParams;

  dtCrowdAgentParams.prototype['get_radius'] = dtCrowdAgentParams.prototype.get_radius = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_radius_0(self);
};
    dtCrowdAgentParams.prototype['set_radius'] = dtCrowdAgentParams.prototype.set_radius = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_radius_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'radius', { get: dtCrowdAgentParams.prototype.get_radius, set: dtCrowdAgentParams.prototype.set_radius });
  dtCrowdAgentParams.prototype['get_height'] = dtCrowdAgentParams.prototype.get_height = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_height_0(self);
};
    dtCrowdAgentParams.prototype['set_height'] = dtCrowdAgentParams.prototype.set_height = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_height_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'height', { get: dtCrowdAgentParams.prototype.get_height, set: dtCrowdAgentParams.prototype.set_height });
  dtCrowdAgentParams.prototype['get_maxAcceleration'] = dtCrowdAgentParams.prototype.get_maxAcceleration = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_maxAcceleration_0(self);
};
    dtCrowdAgentParams.prototype['set_maxAcceleration'] = dtCrowdAgentParams.prototype.set_maxAcceleration = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_maxAcceleration_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'maxAcceleration', { get: dtCrowdAgentParams.prototype.get_maxAcceleration, set: dtCrowdAgentParams.prototype.set_maxAcceleration });
  dtCrowdAgentParams.prototype['get_maxSpeed'] = dtCrowdAgentParams.prototype.get_maxSpeed = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_maxSpeed_0(self);
};
    dtCrowdAgentParams.prototype['set_maxSpeed'] = dtCrowdAgentParams.prototype.set_maxSpeed = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_maxSpeed_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'maxSpeed', { get: dtCrowdAgentParams.prototype.get_maxSpeed, set: dtCrowdAgentParams.prototype.set_maxSpeed });
  dtCrowdAgentParams.prototype['get_collisionQueryRange'] = dtCrowdAgentParams.prototype.get_collisionQueryRange = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_collisionQueryRange_0(self);
};
    dtCrowdAgentParams.prototype['set_collisionQueryRange'] = dtCrowdAgentParams.prototype.set_collisionQueryRange = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_collisionQueryRange_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'collisionQueryRange', { get: dtCrowdAgentParams.prototype.get_collisionQueryRange, set: dtCrowdAgentParams.prototype.set_collisionQueryRange });
  dtCrowdAgentParams.prototype['get_pathOptimizationRange'] = dtCrowdAgentParams.prototype.get_pathOptimizationRange = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_pathOptimizationRange_0(self);
};
    dtCrowdAgentParams.prototype['set_pathOptimizationRange'] = dtCrowdAgentParams.prototype.set_pathOptimizationRange = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_pathOptimizationRange_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'pathOptimizationRange', { get: dtCrowdAgentParams.prototype.get_pathOptimizationRange, set: dtCrowdAgentParams.prototype.set_pathOptimizationRange });
  dtCrowdAgentParams.prototype['get_separationWeight'] = dtCrowdAgentParams.prototype.get_separationWeight = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_separationWeight_0(self);
};
    dtCrowdAgentParams.prototype['set_separationWeight'] = dtCrowdAgentParams.prototype.set_separationWeight = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_separationWeight_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'separationWeight', { get: dtCrowdAgentParams.prototype.get_separationWeight, set: dtCrowdAgentParams.prototype.set_separationWeight });
  dtCrowdAgentParams.prototype['get_updateFlags'] = dtCrowdAgentParams.prototype.get_updateFlags = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_updateFlags_0(self);
};
    dtCrowdAgentParams.prototype['set_updateFlags'] = dtCrowdAgentParams.prototype.set_updateFlags = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_updateFlags_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'updateFlags', { get: dtCrowdAgentParams.prototype.get_updateFlags, set: dtCrowdAgentParams.prototype.set_updateFlags });
  dtCrowdAgentParams.prototype['get_obstacleAvoidanceType'] = dtCrowdAgentParams.prototype.get_obstacleAvoidanceType = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_obstacleAvoidanceType_0(self);
};
    dtCrowdAgentParams.prototype['set_obstacleAvoidanceType'] = dtCrowdAgentParams.prototype.set_obstacleAvoidanceType = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_obstacleAvoidanceType_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'obstacleAvoidanceType', { get: dtCrowdAgentParams.prototype.get_obstacleAvoidanceType, set: dtCrowdAgentParams.prototype.set_obstacleAvoidanceType });
  dtCrowdAgentParams.prototype['get_queryFilterType'] = dtCrowdAgentParams.prototype.get_queryFilterType = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_dtCrowdAgentParams_get_queryFilterType_0(self);
};
    dtCrowdAgentParams.prototype['set_queryFilterType'] = dtCrowdAgentParams.prototype.set_queryFilterType = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_queryFilterType_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'queryFilterType', { get: dtCrowdAgentParams.prototype.get_queryFilterType, set: dtCrowdAgentParams.prototype.set_queryFilterType });
  dtCrowdAgentParams.prototype['get_userData'] = dtCrowdAgentParams.prototype.get_userData = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_dtCrowdAgentParams_get_userData_0(self), VoidPtr);
};
    dtCrowdAgentParams.prototype['set_userData'] = dtCrowdAgentParams.prototype.set_userData = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_dtCrowdAgentParams_set_userData_1(self, arg0);
};
    Object.defineProperty(dtCrowdAgentParams.prototype, 'userData', { get: dtCrowdAgentParams.prototype.get_userData, set: dtCrowdAgentParams.prototype.set_userData });
  dtCrowdAgentParams.prototype['__destroy__'] = dtCrowdAgentParams.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_dtCrowdAgentParams___destroy___0(self);
};
// NavMesh
/** @suppress {undefinedVars, duplicate} @this{Object} */function NavMesh() {
  this.ptr = _emscripten_bind_NavMesh_NavMesh_0();
  getCache(NavMesh)[this.ptr] = this;
};;
NavMesh.prototype = Object.create(WrapperObject.prototype);
NavMesh.prototype.constructor = NavMesh;
NavMesh.prototype.__class__ = NavMesh;
NavMesh.__cache__ = {};
Module['NavMesh'] = NavMesh;

NavMesh.prototype['destroy'] = NavMesh.prototype.destroy = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_NavMesh_destroy_0(self);
};;

NavMesh.prototype['build'] = NavMesh.prototype.build = /** @suppress {undefinedVars, duplicate} @this{Object} */function(positions, positionCount, indices, indexCount, config) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof positions == 'object') { positions = ensureFloat32(positions); }
  if (positionCount && typeof positionCount === 'object') positionCount = positionCount.ptr;
  if (typeof indices == 'object') { indices = ensureInt32(indices); }
  if (indexCount && typeof indexCount === 'object') indexCount = indexCount.ptr;
  if (config && typeof config === 'object') config = config.ptr;
  _emscripten_bind_NavMesh_build_5(self, positions, positionCount, indices, indexCount, config);
};;

NavMesh.prototype['buildFromNavmeshData'] = NavMesh.prototype.buildFromNavmeshData = /** @suppress {undefinedVars, duplicate} @this{Object} */function(data) {
  var self = this.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  _emscripten_bind_NavMesh_buildFromNavmeshData_1(self, data);
};;

NavMesh.prototype['getNavmeshData'] = NavMesh.prototype.getNavmeshData = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_getNavmeshData_0(self), NavmeshData);
};;

NavMesh.prototype['freeNavmeshData'] = NavMesh.prototype.freeNavmeshData = /** @suppress {undefinedVars, duplicate} @this{Object} */function(data) {
  var self = this.ptr;
  if (data && typeof data === 'object') data = data.ptr;
  _emscripten_bind_NavMesh_freeNavmeshData_1(self, data);
};;

NavMesh.prototype['getDebugNavMesh'] = NavMesh.prototype.getDebugNavMesh = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_getDebugNavMesh_0(self), DebugNavMesh);
};;

NavMesh.prototype['getClosestPoint'] = NavMesh.prototype.getClosestPoint = /** @suppress {undefinedVars, duplicate} @this{Object} */function(position) {
  var self = this.ptr;
  if (position && typeof position === 'object') position = position.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_getClosestPoint_1(self, position), Vec3);
};;

NavMesh.prototype['getRandomPointAround'] = NavMesh.prototype.getRandomPointAround = /** @suppress {undefinedVars, duplicate} @this{Object} */function(position, maxRadius) {
  var self = this.ptr;
  if (position && typeof position === 'object') position = position.ptr;
  if (maxRadius && typeof maxRadius === 'object') maxRadius = maxRadius.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_getRandomPointAround_2(self, position, maxRadius), Vec3);
};;

NavMesh.prototype['moveAlong'] = NavMesh.prototype.moveAlong = /** @suppress {undefinedVars, duplicate} @this{Object} */function(position, destination) {
  var self = this.ptr;
  if (position && typeof position === 'object') position = position.ptr;
  if (destination && typeof destination === 'object') destination = destination.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_moveAlong_2(self, position, destination), Vec3);
};;

NavMesh.prototype['getNavMesh'] = NavMesh.prototype.getNavMesh = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_getNavMesh_0(self), dtNavMesh);
};;

NavMesh.prototype['computePath'] = NavMesh.prototype.computePath = /** @suppress {undefinedVars, duplicate} @this{Object} */function(start, end) {
  var self = this.ptr;
  if (start && typeof start === 'object') start = start.ptr;
  if (end && typeof end === 'object') end = end.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_computePath_2(self, start, end), NavPath);
};;

NavMesh.prototype['setDefaultQueryExtent'] = NavMesh.prototype.setDefaultQueryExtent = /** @suppress {undefinedVars, duplicate} @this{Object} */function(extent) {
  var self = this.ptr;
  if (extent && typeof extent === 'object') extent = extent.ptr;
  _emscripten_bind_NavMesh_setDefaultQueryExtent_1(self, extent);
};;

NavMesh.prototype['getDefaultQueryExtent'] = NavMesh.prototype.getDefaultQueryExtent = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_getDefaultQueryExtent_0(self), Vec3);
};;

NavMesh.prototype['addCylinderObstacle'] = NavMesh.prototype.addCylinderObstacle = /** @suppress {undefinedVars, duplicate} @this{Object} */function(position, radius, height) {
  var self = this.ptr;
  if (position && typeof position === 'object') position = position.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_addCylinderObstacle_3(self, position, radius, height), dtObstacleRef);
};;

NavMesh.prototype['addBoxObstacle'] = NavMesh.prototype.addBoxObstacle = /** @suppress {undefinedVars, duplicate} @this{Object} */function(position, extent, angle) {
  var self = this.ptr;
  if (position && typeof position === 'object') position = position.ptr;
  if (extent && typeof extent === 'object') extent = extent.ptr;
  if (angle && typeof angle === 'object') angle = angle.ptr;
  return wrapPointer(_emscripten_bind_NavMesh_addBoxObstacle_3(self, position, extent, angle), dtObstacleRef);
};;

NavMesh.prototype['removeObstacle'] = NavMesh.prototype.removeObstacle = /** @suppress {undefinedVars, duplicate} @this{Object} */function(obstacle) {
  var self = this.ptr;
  if (obstacle && typeof obstacle === 'object') obstacle = obstacle.ptr;
  _emscripten_bind_NavMesh_removeObstacle_1(self, obstacle);
};;

NavMesh.prototype['update'] = NavMesh.prototype.update = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_NavMesh_update_0(self);
};;

  NavMesh.prototype['__destroy__'] = NavMesh.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_NavMesh___destroy___0(self);
};
// Crowd
/** @suppress {undefinedVars, duplicate} @this{Object} */function Crowd(maxAgents, maxAgentRadius, nav) {
  if (maxAgents && typeof maxAgents === 'object') maxAgents = maxAgents.ptr;
  if (maxAgentRadius && typeof maxAgentRadius === 'object') maxAgentRadius = maxAgentRadius.ptr;
  if (nav && typeof nav === 'object') nav = nav.ptr;
  this.ptr = _emscripten_bind_Crowd_Crowd_3(maxAgents, maxAgentRadius, nav);
  getCache(Crowd)[this.ptr] = this;
};;
Crowd.prototype = Object.create(WrapperObject.prototype);
Crowd.prototype.constructor = Crowd;
Crowd.prototype.__class__ = Crowd;
Crowd.__cache__ = {};
Module['Crowd'] = Crowd;

Crowd.prototype['destroy'] = Crowd.prototype.destroy = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Crowd_destroy_0(self);
};;

Crowd.prototype['addAgent'] = Crowd.prototype.addAgent = /** @suppress {undefinedVars, duplicate} @this{Object} */function(position, params) {
  var self = this.ptr;
  if (position && typeof position === 'object') position = position.ptr;
  if (params && typeof params === 'object') params = params.ptr;
  return _emscripten_bind_Crowd_addAgent_2(self, position, params);
};;

Crowd.prototype['removeAgent'] = Crowd.prototype.removeAgent = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  _emscripten_bind_Crowd_removeAgent_1(self, idx);
};;

Crowd.prototype['update'] = Crowd.prototype.update = /** @suppress {undefinedVars, duplicate} @this{Object} */function(dt) {
  var self = this.ptr;
  if (dt && typeof dt === 'object') dt = dt.ptr;
  _emscripten_bind_Crowd_update_1(self, dt);
};;

Crowd.prototype['getAgentPosition'] = Crowd.prototype.getAgentPosition = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  return wrapPointer(_emscripten_bind_Crowd_getAgentPosition_1(self, idx), Vec3);
};;

Crowd.prototype['getAgentVelocity'] = Crowd.prototype.getAgentVelocity = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  return wrapPointer(_emscripten_bind_Crowd_getAgentVelocity_1(self, idx), Vec3);
};;

Crowd.prototype['getAgentNextTargetPath'] = Crowd.prototype.getAgentNextTargetPath = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  return wrapPointer(_emscripten_bind_Crowd_getAgentNextTargetPath_1(self, idx), Vec3);
};;

Crowd.prototype['getAgentState'] = Crowd.prototype.getAgentState = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  return _emscripten_bind_Crowd_getAgentState_1(self, idx);
};;

Crowd.prototype['overOffmeshConnection'] = Crowd.prototype.overOffmeshConnection = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  return !!(_emscripten_bind_Crowd_overOffmeshConnection_1(self, idx));
};;

Crowd.prototype['agentGoto'] = Crowd.prototype.agentGoto = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx, destination) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  if (destination && typeof destination === 'object') destination = destination.ptr;
  _emscripten_bind_Crowd_agentGoto_2(self, idx, destination);
};;

Crowd.prototype['agentTeleport'] = Crowd.prototype.agentTeleport = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx, destination) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  if (destination && typeof destination === 'object') destination = destination.ptr;
  _emscripten_bind_Crowd_agentTeleport_2(self, idx, destination);
};;

Crowd.prototype['getAgentParameters'] = Crowd.prototype.getAgentParameters = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  return wrapPointer(_emscripten_bind_Crowd_getAgentParameters_1(self, idx), dtCrowdAgentParams);
};;

Crowd.prototype['setAgentParameters'] = Crowd.prototype.setAgentParameters = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx, params) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  if (params && typeof params === 'object') params = params.ptr;
  _emscripten_bind_Crowd_setAgentParameters_2(self, idx, params);
};;

Crowd.prototype['setDefaultQueryExtent'] = Crowd.prototype.setDefaultQueryExtent = /** @suppress {undefinedVars, duplicate} @this{Object} */function(extent) {
  var self = this.ptr;
  if (extent && typeof extent === 'object') extent = extent.ptr;
  _emscripten_bind_Crowd_setDefaultQueryExtent_1(self, extent);
};;

Crowd.prototype['getDefaultQueryExtent'] = Crowd.prototype.getDefaultQueryExtent = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Crowd_getDefaultQueryExtent_0(self), Vec3);
};;

Crowd.prototype['getCorners'] = Crowd.prototype.getCorners = /** @suppress {undefinedVars, duplicate} @this{Object} */function(idx) {
  var self = this.ptr;
  if (idx && typeof idx === 'object') idx = idx.ptr;
  return wrapPointer(_emscripten_bind_Crowd_getCorners_1(self, idx), NavPath);
};;

  Crowd.prototype['__destroy__'] = Crowd.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_Crowd___destroy___0(self);
};