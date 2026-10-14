/* MetaDB legacy build (tools/legacy-build.mjs) for Chrome 74 engines — do not edit; regenerate. */
(function () {
  function replaceChildren() {
    while (this.lastChild) this.removeChild(this.lastChild);
    this.append.apply(this, arguments);
  }
  [Element, Document, DocumentFragment].forEach(function (C) {
    if (!C.prototype.replaceChildren) C.prototype.replaceChildren = replaceChildren;
  });
  if (!Promise.allSettled) {
    Promise.allSettled = function (list) {
      return Promise.all(Array.from(list, function (p) {
        return Promise.resolve(p).then(
          function (value) { return { status: "fulfilled", value: value }; },
          function (reason) { return { status: "rejected", reason: reason }; }
        );
      }));
    };
  }
  if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (find, to) {
      return typeof find === "string" ? this.split(find).join(to) : this.replace(find, to);
    };
  }
})();

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// js/vendor/fflate.module.js
var fflate_module_exports = {};
__export(fflate_module_exports, {
  AsyncCompress: () => AsyncGzip,
  AsyncDecompress: () => AsyncDecompress,
  AsyncDeflate: () => AsyncDeflate,
  AsyncGunzip: () => AsyncGunzip,
  AsyncGzip: () => AsyncGzip,
  AsyncInflate: () => AsyncInflate,
  AsyncUnzipInflate: () => AsyncUnzipInflate,
  AsyncUnzlib: () => AsyncUnzlib,
  AsyncZipDeflate: () => AsyncZipDeflate,
  AsyncZlib: () => AsyncZlib,
  Compress: () => Gzip,
  DecodeUTF8: () => DecodeUTF8,
  Decompress: () => Decompress,
  Deflate: () => Deflate,
  EncodeUTF8: () => EncodeUTF8,
  FlateErrorCode: () => FlateErrorCode,
  Gunzip: () => Gunzip,
  Gzip: () => Gzip,
  Inflate: () => Inflate,
  Unzip: () => Unzip,
  UnzipInflate: () => UnzipInflate,
  UnzipPassThrough: () => UnzipPassThrough,
  Unzlib: () => Unzlib,
  Zip: () => Zip,
  ZipDeflate: () => ZipDeflate,
  ZipPassThrough: () => ZipPassThrough,
  Zlib: () => Zlib,
  compress: () => gzip,
  compressSync: () => gzipSync,
  decompress: () => decompress,
  decompressSync: () => decompressSync,
  deflate: () => deflate,
  deflateSync: () => deflateSync,
  gunzip: () => gunzip,
  gunzipSync: () => gunzipSync,
  gzip: () => gzip,
  gzipSync: () => gzipSync,
  inflate: () => inflate,
  inflateSync: () => inflateSync,
  strFromU8: () => strFromU8,
  strToU8: () => strToU8,
  unzip: () => unzip,
  unzipSync: () => unzipSync,
  unzlib: () => unzlib,
  unzlibSync: () => unzlibSync,
  zip: () => zip,
  zipSync: () => zipSync,
  zlib: () => zlib,
  zlibSync: () => zlibSync
});
function StrmOpt(opts, cb) {
  if (typeof opts == "function")
    cb = opts, opts = {};
  this.ondata = cb;
  return opts;
}
function deflate(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt
  ], function(ev) {
    return pbf(deflateSync(ev.data[0], ev.data[1]));
  }, 0, cb);
}
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
function inflate(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt
  ], function(ev) {
    return pbf(inflateSync(ev.data[0], gopt(ev.data[1])));
  }, 1, cb);
}
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function gzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt,
    gze,
    function() {
      return [gzipSync];
    }
  ], function(ev) {
    return pbf(gzipSync(ev.data[0], ev.data[1]));
  }, 2, cb);
}
function gzipSync(data, opts) {
  if (!opts)
    opts = {};
  var c = crc(), l = data.length;
  c.p(data);
  var d = dopt(data, opts, gzhl(opts), 8), s = d.length;
  return gzh(d, opts), wbytes(d, s - 8, c.d()), wbytes(d, s - 4, l), d;
}
function gunzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt,
    guze,
    function() {
      return [gunzipSync];
    }
  ], function(ev) {
    return pbf(gunzipSync(ev.data[0], ev.data[1]));
  }, 3, cb);
}
function gunzipSync(data, opts) {
  var st = gzs(data);
  if (st + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
function zlib(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bDflt,
    zle,
    function() {
      return [zlibSync];
    }
  ], function(ev) {
    return pbf(zlibSync(ev.data[0], ev.data[1]));
  }, 4, cb);
}
function zlibSync(data, opts) {
  if (!opts)
    opts = {};
  var a = adler();
  a.p(data);
  var d = dopt(data, opts, opts.dictionary ? 6 : 2, 4);
  return zlh(d, opts), wbytes(d, d.length - 4, a.d()), d;
}
function unzlib(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return cbify(data, opts, [
    bInflt,
    zule,
    function() {
      return [unzlibSync];
    }
  ], function(ev) {
    return pbf(unzlibSync(ev.data[0], gopt(ev.data[1])));
  }, 5, cb);
}
function unzlibSync(data, opts) {
  return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function decompress(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzip(data, opts, cb) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflate(data, opts, cb) : unzlib(data, opts, cb);
}
function decompressSync(data, opts) {
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, opts) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, opts) : unzlibSync(data, opts);
}
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i = 0; i < str.length; ++i)
      ar_1[i] = str.charCodeAt(i);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = function(v) {
    ar[ai++] = v;
  };
  for (var i = 0; i < l; ++i) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i << 1));
      n.set(ar);
      ar = n;
    }
    var c = str.charCodeAt(i);
    if (c < 128 || latin1)
      w(c);
    else if (c < 2048)
      w(192 | c >> 6), w(128 | c & 63);
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
    else
      w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }
  return slc(ar, 0, ai);
}
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
function zip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var r = {};
  fltn(data, "", r, opts);
  var k = Object.keys(r);
  var lft = k.length, o = 0, tot = 0;
  var slft = lft, files = new Array(lft);
  var term = [];
  var tAll = function() {
    for (var i2 = 0; i2 < term.length; ++i2)
      term[i2]();
  };
  var cbd = function(a, b) {
    mt(function() {
      cb(a, b);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var cbf = function() {
    var out = new u8(tot + 22), oe = o, cdl = tot - o;
    tot = 0;
    for (var i2 = 0; i2 < slft; ++i2) {
      var f = files[i2];
      try {
        var l = f.c.length;
        wzh(out, tot, f, f.f, f.u, l);
        var badd = 30 + f.f.length + exfl(f.extra);
        var loc = tot + badd;
        out.set(f.c, loc);
        wzh(out, o, f, f.f, f.u, l, tot, f.m), o += 16 + badd + (f.m ? f.m.length : 0), tot = loc + l;
      } catch (e) {
        return cbd(e, null);
      }
    }
    wzf(out, o, files.length, cdl, oe);
    cbd(null, out);
  };
  if (!lft)
    cbf();
  var _loop_1 = function(i2) {
    var fn = k[i2];
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var c = crc(), size = file.length;
    c.p(file);
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    var compression = p.level == 0 ? 0 : 8;
    var cbl = function(e, d) {
      if (e) {
        tAll();
        cbd(e, null);
      } else {
        var l = d.length;
        files[i2] = mrg(p, {
          size,
          crc: c.d(),
          c: d,
          f,
          m,
          u: s != fn.length || m && com.length != ms,
          compression
        });
        o += 30 + s + exl + l;
        tot += 76 + 2 * (s + exl) + (ms || 0) + l;
        if (!--lft)
          cbf();
      }
    };
    if (s > 65535)
      cbl(err(11, 0, 1), null);
    if (!compression)
      cbl(null, file);
    else if (size < 16e4) {
      try {
        cbl(null, deflateSync(file, p));
      } catch (e) {
        cbl(e, null);
      }
    } else
      term.push(deflate(file, p, cbl));
  };
  for (var i = 0; i < slft; ++i) {
    _loop_1(i);
  }
  return tAll;
}
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data, "", r, opts);
  var o = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535)
      err(11);
    var d = compression ? deflateSync(file, p) : file, l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f,
      m,
      u: s != fn.length || m && com.length != ms,
      o,
      compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }
  var out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (var i = 0; i < files.length; ++i) {
    var f = files[i];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}
function unzip(data, opts, cb) {
  if (!cb)
    cb = opts, opts = {};
  if (typeof cb != "function")
    err(7);
  var term = [];
  var tAll = function() {
    for (var i2 = 0; i2 < term.length; ++i2)
      term[i2]();
  };
  var files = {};
  var cbd = function(a, b) {
    mt(function() {
      cb(a, b);
    });
  };
  mt(function() {
    cbd = cb;
  });
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558) {
      cbd(err(13, 0, 1), null);
      return tAll;
    }
  }
  ;
  var lft = b2(data, e + 8);
  if (lft) {
    var c = lft;
    var o = b4(data, e + 16);
    var z = o == 4294967295 || c == 65535;
    if (z) {
      var ze = b4(data, e - 12);
      z = b4(data, ze) == 101075792;
      if (z) {
        c = lft = b4(data, ze + 32);
        o = b4(data, ze + 48);
      }
    }
    var fltr = opts && opts.filter;
    var _loop_3 = function(i2) {
      var _a2 = zh(data, o, z), c_1 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
      o = no;
      var cbl = function(e2, d) {
        if (e2) {
          tAll();
          cbd(e2, null);
        } else {
          if (d)
            files[fn] = d;
          if (!--lft)
            cbd(null, files);
        }
      };
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_1
      })) {
        if (!c_1)
          cbl(null, slc(data, b, b + sc));
        else if (c_1 == 8) {
          var infl = data.subarray(b, b + sc);
          if (su < 524288 || sc > 0.8 * su) {
            try {
              cbl(null, inflateSync(infl, { out: new u8(su) }));
            } catch (e2) {
              cbl(e2, null);
            }
          } else
            term.push(inflate(infl, { size: su }, cbl));
        } else
          cbl(err(14, "unknown compression type " + c_1, 1), null);
      } else
        cbl(null, null);
    };
    for (var i = 0; i < c; ++i) {
      _loop_3(i);
    }
  } else
    cbd(null, {});
  return tAll;
}
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = o == 4294967295 || c == 65535;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}
var ch2, wk, u8, u16, i32, fleb, fdeb, clim, freb, _a, fl, revfl, _b, fd, revfd, rev, x, i, hMap, flt, i, i, i, i, fdt, i, flm, flrm, fdm, fdrm, max, bits, bits16, shft, slc, FlateErrorCode, ec, err, inflt, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, deo, et, dflt, crct, crc, adler, dopt, mrg, wcln, ch, cbfs, wrkr, bInflt, bDflt, gze, guze, zle, zule, pbf, gopt, cbify, astrm, astrmify, b2, b4, b8, wbytes, gzh, gzs, gzl, gzhl, zlh, zls, Deflate, AsyncDeflate, Inflate, AsyncInflate, Gzip, AsyncGzip, Gunzip, AsyncGunzip, Zlib, AsyncZlib, Unzlib, AsyncUnzlib, Decompress, AsyncDecompress, fltn, te, td, tds, dutf8, DecodeUTF8, EncodeUTF8, dbf, slzh, zh, z64e, exfl, wzh, wzf, ZipPassThrough, ZipDeflate, AsyncZipDeflate, Zip, UnzipPassThrough, UnzipInflate, AsyncUnzipInflate, Unzip, mt;
var init_fflate_module = __esm({
  "js/vendor/fflate.module.js"() {
    ch2 = {};
    wk = function(c, id, msg, transfer, cb) {
      var w = new Worker(ch2[id] || (ch2[id] = URL.createObjectURL(new Blob([
        c + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'
      ], { type: "text/javascript" }))));
      w.onmessage = function(e) {
        var d = e.data, ed = d.$e$;
        if (ed) {
          var err2 = new Error(ed[0]);
          err2["code"] = ed[1];
          err2.stack = ed[2];
          cb(err2, null);
        } else
          cb(null, d);
      };
      w.postMessage(msg, transfer);
      return w;
    };
    u8 = Uint8Array;
    u16 = Uint16Array;
    i32 = Int32Array;
    fleb = new u8([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      4,
      4,
      4,
      4,
      5,
      5,
      5,
      5,
      0,
      /* unused */
      0,
      0,
      /* impossible */
      0
    ]);
    fdeb = new u8([
      0,
      0,
      0,
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      /* unused */
      0,
      0
    ]);
    clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    freb = function(eb, start) {
      var b = new u16(31);
      for (var i = 0; i < 31; ++i) {
        b[i] = start += 1 << eb[i - 1];
      }
      var r = new i32(b[30]);
      for (var i = 1; i < 30; ++i) {
        for (var j = b[i]; j < b[i + 1]; ++j) {
          r[j] = j - b[i] << 5 | i;
        }
      }
      return { b, r };
    };
    _a = freb(fleb, 2);
    fl = _a.b;
    revfl = _a.r;
    fl[28] = 258, revfl[258] = 28;
    _b = freb(fdeb, 0);
    fd = _b.b;
    revfd = _b.r;
    rev = new u16(32768);
    for (i = 0; i < 32768; ++i) {
      x = (i & 43690) >> 1 | (i & 21845) << 1;
      x = (x & 52428) >> 2 | (x & 13107) << 2;
      x = (x & 61680) >> 4 | (x & 3855) << 4;
      rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
    }
    hMap = function(cd, mb2, r) {
      var s = cd.length;
      var i = 0;
      var l = new u16(mb2);
      for (; i < s; ++i) {
        if (cd[i])
          ++l[cd[i] - 1];
      }
      var le = new u16(mb2);
      for (i = 1; i < mb2; ++i) {
        le[i] = le[i - 1] + l[i - 1] << 1;
      }
      var co;
      if (r) {
        co = new u16(1 << mb2);
        var rvb = 15 - mb2;
        for (i = 0; i < s; ++i) {
          if (cd[i]) {
            var sv = i << 4 | cd[i];
            var r_1 = mb2 - cd[i];
            var v = le[cd[i] - 1]++ << r_1;
            for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
              co[rev[v] >> rvb] = sv;
            }
          }
        }
      } else {
        co = new u16(s);
        for (i = 0; i < s; ++i) {
          if (cd[i]) {
            co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
          }
        }
      }
      return co;
    };
    flt = new u8(288);
    for (i = 0; i < 144; ++i)
      flt[i] = 8;
    for (i = 144; i < 256; ++i)
      flt[i] = 9;
    for (i = 256; i < 280; ++i)
      flt[i] = 7;
    for (i = 280; i < 288; ++i)
      flt[i] = 8;
    fdt = new u8(32);
    for (i = 0; i < 32; ++i)
      fdt[i] = 5;
    flm = /* @__PURE__ */ hMap(flt, 9, 0);
    flrm = /* @__PURE__ */ hMap(flt, 9, 1);
    fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
    fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
    max = function(a) {
      var m = a[0];
      for (var i = 1; i < a.length; ++i) {
        if (a[i] > m)
          m = a[i];
      }
      return m;
    };
    bits = function(d, p, m) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
    };
    bits16 = function(d, p) {
      var o = p / 8 | 0;
      return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
    };
    shft = function(p) {
      return (p + 7) / 8 | 0;
    };
    slc = function(v, s, e) {
      if (s == null || s < 0)
        s = 0;
      if (e == null || e > v.length)
        e = v.length;
      return new u8(v.subarray(s, e));
    };
    FlateErrorCode = {
      UnexpectedEOF: 0,
      InvalidBlockType: 1,
      InvalidLengthLiteral: 2,
      InvalidDistance: 3,
      StreamFinished: 4,
      NoStreamHandler: 5,
      InvalidHeader: 6,
      NoCallback: 7,
      InvalidUTF8: 8,
      ExtraFieldTooLong: 9,
      InvalidDate: 10,
      FilenameTooLong: 11,
      StreamFinishing: 12,
      InvalidZipData: 13,
      UnknownCompressionMethod: 14
    };
    ec = [
      "unexpected EOF",
      "invalid block type",
      "invalid length/literal",
      "invalid distance",
      "stream finished",
      "no stream handler",
      ,
      "no callback",
      "invalid UTF-8 data",
      "extra field too long",
      "date not in range 1980-2099",
      "filename too long",
      "stream finishing",
      "invalid zip data"
      // determined by unknown compression method
    ];
    err = function(ind, msg, nt) {
      var e = new Error(msg || ec[ind]);
      e.code = ind;
      if (Error.captureStackTrace)
        Error.captureStackTrace(e, err);
      if (!nt)
        throw e;
      return e;
    };
    inflt = function(dat, st, buf, dict) {
      var sl = dat.length, dl = dict ? dict.length : 0;
      if (!sl || st.f && !st.l)
        return buf || new u8(0);
      var noBuf = !buf;
      var resize = noBuf || st.i != 2;
      var noSt = st.i;
      if (noBuf)
        buf = new u8(sl * 3);
      var cbuf = function(l2) {
        var bl = buf.length;
        if (l2 > bl) {
          var nbuf = new u8(Math.max(bl * 2, l2));
          nbuf.set(buf);
          buf = nbuf;
        }
      };
      var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
      var tbts = sl * 8;
      do {
        if (!lm) {
          final = bits(dat, pos, 1);
          var type = bits(dat, pos + 1, 3);
          pos += 3;
          if (!type) {
            var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
            if (t > sl) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt + l);
            buf.set(dat.subarray(s, t), bt);
            st.b = bt += l, st.p = pos = t * 8, st.f = final;
            continue;
          } else if (type == 1)
            lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
          else if (type == 2) {
            var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
            var tl = hLit + bits(dat, pos + 5, 31) + 1;
            pos += 14;
            var ldt = new u8(tl);
            var clt = new u8(19);
            for (var i = 0; i < hcLen; ++i) {
              clt[clim[i]] = bits(dat, pos + i * 3, 7);
            }
            pos += hcLen * 3;
            var clb = max(clt), clbmsk = (1 << clb) - 1;
            var clm = hMap(clt, clb, 1);
            for (var i = 0; i < tl; ) {
              var r = clm[bits(dat, pos, clbmsk)];
              pos += r & 15;
              var s = r >> 4;
              if (s < 16) {
                ldt[i++] = s;
              } else {
                var c = 0, n = 0;
                if (s == 16)
                  n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
                else if (s == 17)
                  n = 3 + bits(dat, pos, 7), pos += 3;
                else if (s == 18)
                  n = 11 + bits(dat, pos, 127), pos += 7;
                while (n--)
                  ldt[i++] = c;
              }
            }
            var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
            lbt = max(lt);
            dbt = max(dt);
            lm = hMap(lt, lbt, 1);
            dm = hMap(dt, dbt, 1);
          } else
            err(1);
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
        }
        if (resize)
          cbuf(bt + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (; ; lpos = pos) {
          var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
          pos += c & 15;
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (!c)
            err(2);
          if (sym < 256)
            buf[bt++] = sym;
          else if (sym == 256) {
            lpos = pos, lm = null;
            break;
          } else {
            var add = sym - 254;
            if (sym > 264) {
              var i = sym - 257, b = fleb[i];
              add = bits(dat, pos, (1 << b) - 1) + fl[i];
              pos += b;
            }
            var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
            if (!d)
              err(3);
            pos += d & 15;
            var dt = fd[dsym];
            if (dsym > 3) {
              var b = fdeb[dsym];
              dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
            }
            if (pos > tbts) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt + 131072);
            var end = bt + add;
            if (bt < dt) {
              var shift = dl - dt, dend = Math.min(dt, end);
              if (shift + bt < 0)
                err(3);
              for (; bt < dend; ++bt)
                buf[bt] = dict[shift + bt];
            }
            for (; bt < end; ++bt)
              buf[bt] = buf[bt - dt];
          }
        }
        st.l = lm, st.p = lpos, st.b = bt, st.f = final;
        if (lm)
          final = 1, st.m = lbt, st.d = dm, st.n = dbt;
      } while (!final);
      return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
    };
    wbits = function(d, p, v) {
      v <<= p & 7;
      var o = p / 8 | 0;
      d[o] |= v;
      d[o + 1] |= v >> 8;
    };
    wbits16 = function(d, p, v) {
      v <<= p & 7;
      var o = p / 8 | 0;
      d[o] |= v;
      d[o + 1] |= v >> 8;
      d[o + 2] |= v >> 16;
    };
    hTree = function(d, mb2) {
      var t = [];
      for (var i = 0; i < d.length; ++i) {
        if (d[i])
          t.push({ s: i, f: d[i] });
      }
      var s = t.length;
      var t2 = t.slice();
      if (!s)
        return { t: et, l: 0 };
      if (s == 1) {
        var v = new u8(t[0].s + 1);
        v[t[0].s] = 1;
        return { t: v, l: 1 };
      }
      t.sort(function(a, b) {
        return a.f - b.f;
      });
      t.push({ s: -1, f: 25001 });
      var l = t[0], r = t[1], i0 = 0, i1 = 1, i2 = 2;
      t[0] = { s: -1, f: l.f + r.f, l, r };
      while (i1 != s - 1) {
        l = t[t[i0].f < t[i2].f ? i0++ : i2++];
        r = t[i0 != i1 && t[i0].f < t[i2].f ? i0++ : i2++];
        t[i1++] = { s: -1, f: l.f + r.f, l, r };
      }
      var maxSym = t2[0].s;
      for (var i = 1; i < s; ++i) {
        if (t2[i].s > maxSym)
          maxSym = t2[i].s;
      }
      var tr = new u16(maxSym + 1);
      var mbt = ln(t[i1 - 1], tr, 0);
      if (mbt > mb2) {
        var i = 0, dt = 0;
        var lft = mbt - mb2, cst = 1 << lft;
        t2.sort(function(a, b) {
          return tr[b.s] - tr[a.s] || a.f - b.f;
        });
        for (; i < s; ++i) {
          var i2_1 = t2[i].s;
          if (tr[i2_1] > mb2) {
            dt += cst - (1 << mbt - tr[i2_1]);
            tr[i2_1] = mb2;
          } else
            break;
        }
        dt >>= lft;
        while (dt > 0) {
          var i2_2 = t2[i].s;
          if (tr[i2_2] < mb2)
            dt -= 1 << mb2 - tr[i2_2]++ - 1;
          else
            ++i;
        }
        for (; i >= 0 && dt; --i) {
          var i2_3 = t2[i].s;
          if (tr[i2_3] == mb2) {
            --tr[i2_3];
            ++dt;
          }
        }
        mbt = mb2;
      }
      return { t: new u8(tr), l: mbt };
    };
    ln = function(n, l, d) {
      return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
    };
    lc = function(c) {
      var s = c.length;
      while (s && !c[--s])
        ;
      var cl = new u16(++s);
      var cli = 0, cln = c[0], cls = 1;
      var w = function(v) {
        cl[cli++] = v;
      };
      for (var i = 1; i <= s; ++i) {
        if (c[i] == cln && i != s)
          ++cls;
        else {
          if (!cln && cls > 2) {
            for (; cls > 138; cls -= 138)
              w(32754);
            if (cls > 2) {
              w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
              cls = 0;
            }
          } else if (cls > 3) {
            w(cln), --cls;
            for (; cls > 6; cls -= 6)
              w(8304);
            if (cls > 2)
              w(cls - 3 << 5 | 8208), cls = 0;
          }
          while (cls--)
            w(cln);
          cls = 1;
          cln = c[i];
        }
      }
      return { c: cl.subarray(0, cli), n: s };
    };
    clen = function(cf, cl) {
      var l = 0;
      for (var i = 0; i < cl.length; ++i)
        l += cf[i] * cl[i];
      return l;
    };
    wfblk = function(out, pos, dat) {
      var s = dat.length;
      var o = shft(pos + 2);
      out[o] = s & 255;
      out[o + 1] = s >> 8;
      out[o + 2] = out[o] ^ 255;
      out[o + 3] = out[o + 1] ^ 255;
      for (var i = 0; i < s; ++i)
        out[o + i + 4] = dat[i];
      return (o + 4 + s) * 8;
    };
    wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
      wbits(out, p++, final);
      ++lf[256];
      var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
      var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
      var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
      var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
      var lcfreq = new u16(19);
      for (var i = 0; i < lclt.length; ++i)
        ++lcfreq[lclt[i] & 31];
      for (var i = 0; i < lcdt.length; ++i)
        ++lcfreq[lcdt[i] & 31];
      var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
      var nlcc = 19;
      for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
        ;
      var flen = bl + 5 << 3;
      var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
      var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
      if (bs >= 0 && flen <= ftlen && flen <= dtlen)
        return wfblk(out, p, dat.subarray(bs, bs + bl));
      var lm, ll, dm, dl;
      wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
      if (dtlen < ftlen) {
        lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
        var llm = hMap(lct, mlcb, 0);
        wbits(out, p, nlc - 257);
        wbits(out, p + 5, ndc - 1);
        wbits(out, p + 10, nlcc - 4);
        p += 14;
        for (var i = 0; i < nlcc; ++i)
          wbits(out, p + 3 * i, lct[clim[i]]);
        p += 3 * nlcc;
        var lcts = [lclt, lcdt];
        for (var it = 0; it < 2; ++it) {
          var clct = lcts[it];
          for (var i = 0; i < clct.length; ++i) {
            var len = clct[i] & 31;
            wbits(out, p, llm[len]), p += lct[len];
            if (len > 15)
              wbits(out, p, clct[i] >> 5 & 127), p += clct[i] >> 12;
          }
        }
      } else {
        lm = flm, ll = flt, dm = fdm, dl = fdt;
      }
      for (var i = 0; i < li; ++i) {
        var sym = syms[i];
        if (sym > 255) {
          var len = sym >> 18 & 31;
          wbits16(out, p, lm[len + 257]), p += ll[len + 257];
          if (len > 7)
            wbits(out, p, sym >> 23 & 31), p += fleb[len];
          var dst = sym & 31;
          wbits16(out, p, dm[dst]), p += dl[dst];
          if (dst > 3)
            wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
        } else {
          wbits16(out, p, lm[sym]), p += ll[sym];
        }
      }
      wbits16(out, p, lm[256]);
      return p + ll[256];
    };
    deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
    et = /* @__PURE__ */ new u8(0);
    dflt = function(dat, lvl, plvl, pre, post, st) {
      var s = st.z || dat.length;
      var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
      var w = o.subarray(pre, o.length - post);
      var lst = st.l;
      var pos = (st.r || 0) & 7;
      if (lvl) {
        if (pos)
          w[0] = st.r >> 3;
        var opt = deo[lvl - 1];
        var n = opt >> 13, c = opt & 8191;
        var msk_1 = (1 << plvl) - 1;
        var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
        var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
        var hsh = function(i2) {
          return (dat[i2] ^ dat[i2 + 1] << bs1_1 ^ dat[i2 + 2] << bs2_1) & msk_1;
        };
        var syms = new i32(25e3);
        var lf = new u16(288), df = new u16(32);
        var lc_1 = 0, eb = 0, i = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
        for (; i + 2 < s; ++i) {
          var hv = hsh(i);
          var imod = i & 32767, pimod = head[hv];
          prev[imod] = pimod;
          head[hv] = imod;
          if (wi <= i) {
            var rem = s - i;
            if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
              pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i - bs, pos);
              li = lc_1 = eb = 0, bs = i;
              for (var j = 0; j < 286; ++j)
                lf[j] = 0;
              for (var j = 0; j < 30; ++j)
                df[j] = 0;
            }
            var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
            if (rem > 2 && hv == hsh(i - dif)) {
              var maxn = Math.min(n, rem) - 1;
              var maxd = Math.min(32767, i);
              var ml = Math.min(258, rem);
              while (dif <= maxd && --ch_1 && imod != pimod) {
                if (dat[i + l] == dat[i + l - dif]) {
                  var nl = 0;
                  for (; nl < ml && dat[i + nl] == dat[i + nl - dif]; ++nl)
                    ;
                  if (nl > l) {
                    l = nl, d = dif;
                    if (nl > maxn)
                      break;
                    var mmd = Math.min(dif, nl - 2);
                    var md = 0;
                    for (var j = 0; j < mmd; ++j) {
                      var ti = i - dif + j & 32767;
                      var pti = prev[ti];
                      var cd = ti - pti & 32767;
                      if (cd > md)
                        md = cd, pimod = ti;
                    }
                  }
                }
                imod = pimod, pimod = prev[imod];
                dif += imod - pimod & 32767;
              }
            }
            if (d) {
              syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
              var lin = revfl[l] & 31, din = revfd[d] & 31;
              eb += fleb[lin] + fdeb[din];
              ++lf[257 + lin];
              ++df[din];
              wi = i + l;
              ++lc_1;
            } else {
              syms[li++] = dat[i];
              ++lf[dat[i]];
            }
          }
        }
        for (i = Math.max(i, wi); i < s; ++i) {
          syms[li++] = dat[i];
          ++lf[dat[i]];
        }
        pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i - bs, pos);
        if (!lst) {
          st.r = pos & 7 | w[pos / 8 | 0] << 3;
          pos -= 7;
          st.h = head, st.p = prev, st.i = i, st.w = wi;
        }
      } else {
        for (var i = st.w || 0; i < s + lst; i += 65535) {
          var e = i + 65535;
          if (e >= s) {
            w[pos / 8 | 0] = lst;
            e = s;
          }
          pos = wfblk(w, pos + 1, dat.subarray(i, e));
        }
        st.i = s;
      }
      return slc(o, 0, pre + shft(pos) + post);
    };
    crct = /* @__PURE__ */ function() {
      var t = new Int32Array(256);
      for (var i = 0; i < 256; ++i) {
        var c = i, k = 9;
        while (--k)
          c = (c & 1 && -306674912) ^ c >>> 1;
        t[i] = c;
      }
      return t;
    }();
    crc = function() {
      var c = -1;
      return {
        p: function(d) {
          var cr = c;
          for (var i = 0; i < d.length; ++i)
            cr = crct[cr & 255 ^ d[i]] ^ cr >>> 8;
          c = cr;
        },
        d: function() {
          return ~c;
        }
      };
    };
    adler = function() {
      var a = 1, b = 0;
      return {
        p: function(d) {
          var n = a, m = b;
          var l = d.length | 0;
          for (var i = 0; i != l; ) {
            var e = Math.min(i + 2655, l);
            for (; i < e; ++i)
              m += n += d[i];
            n = (n & 65535) + 15 * (n >> 16), m = (m & 65535) + 15 * (m >> 16);
          }
          a = n, b = m;
        },
        d: function() {
          a %= 65521, b %= 65521;
          return (a & 255) << 24 | (a & 65280) << 8 | (b & 255) << 8 | b >> 8;
        }
      };
    };
    dopt = function(dat, opt, pre, post, st) {
      if (!st) {
        st = { l: 1 };
        if (opt.dictionary) {
          var dict = opt.dictionary.subarray(-32768);
          var newDat = new u8(dict.length + dat.length);
          newDat.set(dict);
          newDat.set(dat, dict.length);
          dat = newDat;
          st.w = dict.length;
        }
      }
      return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
    };
    mrg = function(a, b) {
      var o = {};
      for (var k in a)
        o[k] = a[k];
      for (var k in b)
        o[k] = b[k];
      return o;
    };
    wcln = function(fn, fnStr, td2) {
      var dt = fn();
      var st = fn.toString();
      var ks = st.slice(st.indexOf("[") + 1, st.lastIndexOf("]")).replace(/\s+/g, "").split(",");
      for (var i = 0; i < dt.length; ++i) {
        var v = dt[i], k = ks[i];
        if (typeof v == "function") {
          fnStr += ";" + k + "=";
          var st_1 = v.toString();
          if (v.prototype) {
            if (st_1.indexOf("[native code]") != -1) {
              var spInd = st_1.indexOf(" ", 8) + 1;
              fnStr += st_1.slice(spInd, st_1.indexOf("(", spInd));
            } else {
              fnStr += st_1;
              for (var t in v.prototype)
                fnStr += ";" + k + ".prototype." + t + "=" + v.prototype[t].toString();
            }
          } else
            fnStr += st_1;
        } else
          td2[k] = v;
      }
      return fnStr;
    };
    ch = [];
    cbfs = function(v) {
      var tl = [];
      for (var k in v) {
        if (v[k].buffer) {
          tl.push((v[k] = new v[k].constructor(v[k])).buffer);
        }
      }
      return tl;
    };
    wrkr = function(fns, init, id, cb) {
      if (!ch[id]) {
        var fnStr = "", td_1 = {}, m = fns.length - 1;
        for (var i = 0; i < m; ++i)
          fnStr = wcln(fns[i], fnStr, td_1);
        ch[id] = { c: wcln(fns[m], fnStr, td_1), e: td_1 };
      }
      var td2 = mrg({}, ch[id].e);
      return wk(ch[id].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + init.toString() + "}", id, td2, cbfs(td2), cb);
    };
    bInflt = function() {
      return [u8, u16, i32, fleb, fdeb, clim, fl, fd, flrm, fdrm, rev, ec, hMap, max, bits, bits16, shft, slc, err, inflt, inflateSync, pbf, gopt];
    };
    bDflt = function() {
      return [u8, u16, i32, fleb, fdeb, clim, revfl, revfd, flm, flt, fdm, fdt, rev, deo, et, hMap, wbits, wbits16, hTree, ln, lc, clen, wfblk, wblk, shft, slc, dflt, dopt, deflateSync, pbf];
    };
    gze = function() {
      return [gzh, gzhl, wbytes, crc, crct];
    };
    guze = function() {
      return [gzs, gzl];
    };
    zle = function() {
      return [zlh, wbytes, adler];
    };
    zule = function() {
      return [zls];
    };
    pbf = function(msg) {
      return postMessage(msg, [msg.buffer]);
    };
    gopt = function(o) {
      return o && {
        out: o.size && new u8(o.size),
        dictionary: o.dictionary
      };
    };
    cbify = function(dat, opts, fns, init, id, cb) {
      var w = wrkr(fns, init, id, function(err2, dat2) {
        w.terminate();
        cb(err2, dat2);
      });
      w.postMessage([dat, opts], opts.consume ? [dat.buffer] : []);
      return function() {
        w.terminate();
      };
    };
    astrm = function(strm) {
      strm.ondata = function(dat, final) {
        return postMessage([dat, final], [dat.buffer]);
      };
      return function(ev) {
        if (ev.data.length) {
          strm.push(ev.data[0], ev.data[1]);
          postMessage([ev.data[0].length]);
        } else
          strm.flush();
      };
    };
    astrmify = function(fns, strm, opts, init, id, flush, ext) {
      var t;
      var w = wrkr(fns, init, id, function(err2, dat) {
        if (err2)
          w.terminate(), strm.ondata.call(strm, err2);
        else if (!Array.isArray(dat))
          ext(dat);
        else if (dat.length == 1) {
          strm.queuedSize -= dat[0];
          if (strm.ondrain)
            strm.ondrain(dat[0]);
        } else {
          if (dat[1])
            w.terminate();
          strm.ondata.call(strm, err2, dat[0], dat[1]);
        }
      });
      w.postMessage(opts);
      strm.queuedSize = 0;
      strm.push = function(d, f) {
        if (!strm.ondata)
          err(5);
        if (t)
          strm.ondata(err(4, 0, 1), null, !!f);
        strm.queuedSize += d.length;
        w.postMessage([d, t = f], [d.buffer]);
      };
      strm.terminate = function() {
        w.terminate();
      };
      if (flush) {
        strm.flush = function() {
          w.postMessage([]);
        };
      }
    };
    b2 = function(d, b) {
      return d[b] | d[b + 1] << 8;
    };
    b4 = function(d, b) {
      return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
    };
    b8 = function(d, b) {
      return b4(d, b) + b4(d, b + 4) * 4294967296;
    };
    wbytes = function(d, b, v) {
      for (; v; ++b)
        d[b] = v, v >>>= 8;
    };
    gzh = function(c, o) {
      var fn = o.filename;
      c[0] = 31, c[1] = 139, c[2] = 8, c[8] = o.level < 2 ? 4 : o.level == 9 ? 2 : 0, c[9] = 3;
      if (o.mtime != 0)
        wbytes(c, 4, Math.floor(new Date(o.mtime || Date.now()) / 1e3));
      if (fn) {
        c[3] = 8;
        for (var i = 0; i <= fn.length; ++i)
          c[i + 10] = fn.charCodeAt(i);
      }
    };
    gzs = function(d) {
      if (d[0] != 31 || d[1] != 139 || d[2] != 8)
        err(6, "invalid gzip data");
      var flg = d[3];
      var st = 10;
      if (flg & 4)
        st += (d[10] | d[11] << 8) + 2;
      for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
        ;
      return st + (flg & 2);
    };
    gzl = function(d) {
      var l = d.length;
      return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
    };
    gzhl = function(o) {
      return 10 + (o.filename ? o.filename.length + 1 : 0);
    };
    zlh = function(c, o) {
      var lv = o.level, fl2 = lv == 0 ? 0 : lv < 6 ? 1 : lv == 9 ? 3 : 2;
      c[0] = 120, c[1] = fl2 << 6 | (o.dictionary && 32);
      c[1] |= 31 - (c[0] << 8 | c[1]) % 31;
      if (o.dictionary) {
        var h = adler();
        h.p(o.dictionary);
        wbytes(c, 2, h.d());
      }
    };
    zls = function(d, dict) {
      if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || (d[0] << 8 | d[1]) % 31)
        err(6, "invalid zlib data");
      if ((d[1] >> 5 & 1) == +!dict)
        err(6, "invalid zlib data: " + (d[1] & 32 ? "need" : "unexpected") + " dictionary");
      return (d[1] >> 3 & 4) + 2;
    };
    Deflate = /* @__PURE__ */ function() {
      function Deflate2(opts, cb) {
        if (typeof opts == "function")
          cb = opts, opts = {};
        this.ondata = cb;
        this.o = opts || {};
        this.s = { l: 0, i: 32768, w: 32768, z: 32768 };
        this.b = new u8(98304);
        if (this.o.dictionary) {
          var dict = this.o.dictionary.subarray(-32768);
          this.b.set(dict, 32768 - dict.length);
          this.s.i = 32768 - dict.length;
        }
      }
      Deflate2.prototype.p = function(c, f) {
        this.ondata(dopt(c, this.o, 0, 0, this.s), f);
      };
      Deflate2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (this.s.l)
          err(4);
        var endLen = chunk.length + this.s.z;
        if (endLen > this.b.length) {
          if (endLen > 2 * this.b.length - 32768) {
            var newBuf = new u8(endLen & -32768);
            newBuf.set(this.b.subarray(0, this.s.z));
            this.b = newBuf;
          }
          var split2 = this.b.length - this.s.z;
          this.b.set(chunk.subarray(0, split2), this.s.z);
          this.s.z = this.b.length;
          this.p(this.b, false);
          this.b.set(this.b.subarray(-32768));
          this.b.set(chunk.subarray(split2), 32768);
          this.s.z = chunk.length - split2 + 32768;
          this.s.i = 32766, this.s.w = 32768;
        } else {
          this.b.set(chunk, this.s.z);
          this.s.z += chunk.length;
        }
        this.s.l = final & 1;
        if (this.s.z > this.s.w + 8191 || final) {
          this.p(this.b, final || false);
          this.s.w = this.s.i, this.s.i -= 2;
        }
      };
      Deflate2.prototype.flush = function() {
        if (!this.ondata)
          err(5);
        if (this.s.l)
          err(4);
        this.p(this.b, false);
        this.s.w = this.s.i, this.s.i -= 2;
      };
      return Deflate2;
    }();
    AsyncDeflate = /* @__PURE__ */ function() {
      function AsyncDeflate2(opts, cb) {
        astrmify([
          bDflt,
          function() {
            return [astrm, Deflate];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Deflate(ev.data);
          onmessage = astrm(strm);
        }, 6, 1);
      }
      return AsyncDeflate2;
    }();
    Inflate = /* @__PURE__ */ function() {
      function Inflate2(opts, cb) {
        if (typeof opts == "function")
          cb = opts, opts = {};
        this.ondata = cb;
        var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
        this.s = { i: 0, b: dict ? dict.length : 0 };
        this.o = new u8(32768);
        this.p = new u8(0);
        if (dict)
          this.o.set(dict);
      }
      Inflate2.prototype.e = function(c) {
        if (!this.ondata)
          err(5);
        if (this.d)
          err(4);
        if (!this.p.length)
          this.p = c;
        else if (c.length) {
          var n = new u8(this.p.length + c.length);
          n.set(this.p), n.set(c, this.p.length), this.p = n;
        }
      };
      Inflate2.prototype.c = function(final) {
        this.s.i = +(this.d = final || false);
        var bts = this.s.b;
        var dt = inflt(this.p, this.s, this.o);
        this.ondata(slc(dt, bts, this.s.b), this.d);
        this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
        this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
      };
      Inflate2.prototype.push = function(chunk, final) {
        this.e(chunk), this.c(final);
      };
      return Inflate2;
    }();
    AsyncInflate = /* @__PURE__ */ function() {
      function AsyncInflate2(opts, cb) {
        astrmify([
          bInflt,
          function() {
            return [astrm, Inflate];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Inflate(ev.data);
          onmessage = astrm(strm);
        }, 7, 0);
      }
      return AsyncInflate2;
    }();
    Gzip = /* @__PURE__ */ function() {
      function Gzip2(opts, cb) {
        this.c = crc();
        this.l = 0;
        this.v = 1;
        Deflate.call(this, opts, cb);
      }
      Gzip2.prototype.push = function(chunk, final) {
        this.c.p(chunk);
        this.l += chunk.length;
        Deflate.prototype.push.call(this, chunk, final);
      };
      Gzip2.prototype.p = function(c, f) {
        var raw = dopt(c, this.o, this.v && gzhl(this.o), f && 8, this.s);
        if (this.v)
          gzh(raw, this.o), this.v = 0;
        if (f)
          wbytes(raw, raw.length - 8, this.c.d()), wbytes(raw, raw.length - 4, this.l);
        this.ondata(raw, f);
      };
      Gzip2.prototype.flush = function() {
        Deflate.prototype.flush.call(this);
      };
      return Gzip2;
    }();
    AsyncGzip = /* @__PURE__ */ function() {
      function AsyncGzip2(opts, cb) {
        astrmify([
          bDflt,
          gze,
          function() {
            return [astrm, Deflate, Gzip];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Gzip(ev.data);
          onmessage = astrm(strm);
        }, 8, 1);
      }
      return AsyncGzip2;
    }();
    Gunzip = /* @__PURE__ */ function() {
      function Gunzip2(opts, cb) {
        this.v = 1;
        this.r = 0;
        Inflate.call(this, opts, cb);
      }
      Gunzip2.prototype.push = function(chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        this.r += chunk.length;
        if (this.v) {
          var p = this.p.subarray(this.v - 1);
          var s = p.length > 3 ? gzs(p) : 4;
          if (s > p.length) {
            if (!final)
              return;
          } else if (this.v > 1 && this.onmember) {
            this.onmember(this.r - p.length);
          }
          this.p = p.subarray(s), this.v = 0;
        }
        Inflate.prototype.c.call(this, final);
        if (this.s.f && !this.s.l && !final) {
          this.v = shft(this.s.p) + 9;
          this.s = { i: 0 };
          this.o = new u8(0);
          this.push(new u8(0), final);
        }
      };
      return Gunzip2;
    }();
    AsyncGunzip = /* @__PURE__ */ function() {
      function AsyncGunzip2(opts, cb) {
        var _this = this;
        astrmify([
          bInflt,
          guze,
          function() {
            return [astrm, Inflate, Gunzip];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Gunzip(ev.data);
          strm.onmember = function(offset) {
            return postMessage(offset);
          };
          onmessage = astrm(strm);
        }, 9, 0, function(offset) {
          return _this.onmember && _this.onmember(offset);
        });
      }
      return AsyncGunzip2;
    }();
    Zlib = /* @__PURE__ */ function() {
      function Zlib2(opts, cb) {
        this.c = adler();
        this.v = 1;
        Deflate.call(this, opts, cb);
      }
      Zlib2.prototype.push = function(chunk, final) {
        this.c.p(chunk);
        Deflate.prototype.push.call(this, chunk, final);
      };
      Zlib2.prototype.p = function(c, f) {
        var raw = dopt(c, this.o, this.v && (this.o.dictionary ? 6 : 2), f && 4, this.s);
        if (this.v)
          zlh(raw, this.o), this.v = 0;
        if (f)
          wbytes(raw, raw.length - 4, this.c.d());
        this.ondata(raw, f);
      };
      Zlib2.prototype.flush = function() {
        Deflate.prototype.flush.call(this);
      };
      return Zlib2;
    }();
    AsyncZlib = /* @__PURE__ */ function() {
      function AsyncZlib2(opts, cb) {
        astrmify([
          bDflt,
          zle,
          function() {
            return [astrm, Deflate, Zlib];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Zlib(ev.data);
          onmessage = astrm(strm);
        }, 10, 1);
      }
      return AsyncZlib2;
    }();
    Unzlib = /* @__PURE__ */ function() {
      function Unzlib2(opts, cb) {
        Inflate.call(this, opts, cb);
        this.v = opts && opts.dictionary ? 2 : 1;
      }
      Unzlib2.prototype.push = function(chunk, final) {
        Inflate.prototype.e.call(this, chunk);
        if (this.v) {
          if (this.p.length < 6 && !final)
            return;
          this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
        }
        if (final) {
          if (this.p.length < 4)
            err(6, "invalid zlib data");
          this.p = this.p.subarray(0, -4);
        }
        Inflate.prototype.c.call(this, final);
      };
      return Unzlib2;
    }();
    AsyncUnzlib = /* @__PURE__ */ function() {
      function AsyncUnzlib2(opts, cb) {
        astrmify([
          bInflt,
          zule,
          function() {
            return [astrm, Inflate, Unzlib];
          }
        ], this, StrmOpt.call(this, opts, cb), function(ev) {
          var strm = new Unzlib(ev.data);
          onmessage = astrm(strm);
        }, 11, 0);
      }
      return AsyncUnzlib2;
    }();
    Decompress = /* @__PURE__ */ function() {
      function Decompress2(opts, cb) {
        this.o = StrmOpt.call(this, opts, cb) || {};
        this.G = Gunzip;
        this.I = Inflate;
        this.Z = Unzlib;
      }
      Decompress2.prototype.i = function() {
        var _this = this;
        this.s.ondata = function(dat, final) {
          _this.ondata(dat, final);
        };
      };
      Decompress2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (!this.s) {
          if (this.p && this.p.length) {
            var n = new u8(this.p.length + chunk.length);
            n.set(this.p), n.set(chunk, this.p.length);
          } else
            this.p = chunk;
          if (this.p.length > 2) {
            this.s = this.p[0] == 31 && this.p[1] == 139 && this.p[2] == 8 ? new this.G(this.o) : (this.p[0] & 15) != 8 || this.p[0] >> 4 > 7 || (this.p[0] << 8 | this.p[1]) % 31 ? new this.I(this.o) : new this.Z(this.o);
            this.i();
            this.s.push(this.p, final);
            this.p = null;
          }
        } else
          this.s.push(chunk, final);
      };
      return Decompress2;
    }();
    AsyncDecompress = /* @__PURE__ */ function() {
      function AsyncDecompress2(opts, cb) {
        Decompress.call(this, opts, cb);
        this.queuedSize = 0;
        this.G = AsyncGunzip;
        this.I = AsyncInflate;
        this.Z = AsyncUnzlib;
      }
      AsyncDecompress2.prototype.i = function() {
        var _this = this;
        this.s.ondata = function(err2, dat, final) {
          _this.ondata(err2, dat, final);
        };
        this.s.ondrain = function(size) {
          _this.queuedSize -= size;
          if (_this.ondrain)
            _this.ondrain(size);
        };
      };
      AsyncDecompress2.prototype.push = function(chunk, final) {
        this.queuedSize += chunk.length;
        Decompress.prototype.push.call(this, chunk, final);
      };
      return AsyncDecompress2;
    }();
    fltn = function(d, p, t, o) {
      for (var k in d) {
        var val = d[k], n = p + k, op = o;
        if (Array.isArray(val))
          op = mrg(o, val[1]), val = val[0];
        if (val instanceof u8)
          t[n] = [val, op];
        else {
          t[n += "/"] = [new u8(0), op];
          fltn(val, n, t, o);
        }
      }
    };
    te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
    td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
    tds = 0;
    try {
      td.decode(et, { stream: true });
      tds = 1;
    } catch (e) {
    }
    dutf8 = function(d) {
      for (var r = "", i = 0; ; ) {
        var c = d[i++];
        var eb = (c > 127) + (c > 223) + (c > 239);
        if (i + eb > d.length)
          return { s: r, r: slc(d, i - 1) };
        if (!eb)
          r += String.fromCharCode(c);
        else if (eb == 3) {
          c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
        } else if (eb & 1)
          r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
        else
          r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
      }
    };
    DecodeUTF8 = /* @__PURE__ */ function() {
      function DecodeUTF82(cb) {
        this.ondata = cb;
        if (tds)
          this.t = new TextDecoder();
        else
          this.p = et;
      }
      DecodeUTF82.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        final = !!final;
        if (this.t) {
          this.ondata(this.t.decode(chunk, { stream: true }), final);
          if (final) {
            if (this.t.decode().length)
              err(8);
            this.t = null;
          }
          return;
        }
        if (!this.p)
          err(4);
        var dat = new u8(this.p.length + chunk.length);
        dat.set(this.p);
        dat.set(chunk, this.p.length);
        var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
        if (final) {
          if (r.length)
            err(8);
          this.p = null;
        } else
          this.p = r;
        this.ondata(s, final);
      };
      return DecodeUTF82;
    }();
    EncodeUTF8 = /* @__PURE__ */ function() {
      function EncodeUTF82(cb) {
        this.ondata = cb;
      }
      EncodeUTF82.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        if (this.d)
          err(4);
        this.ondata(strToU8(chunk), this.d = final || false);
      };
      return EncodeUTF82;
    }();
    dbf = function(l) {
      return l == 1 ? 3 : l < 6 ? 2 : l == 9 ? 1 : 0;
    };
    slzh = function(d, b) {
      return b + 30 + b2(d, b + 26) + b2(d, b + 28);
    };
    zh = function(d, b, z) {
      var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
      var _a2 = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a2[0], su = _a2[1], off = _a2[2];
      return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
    };
    z64e = function(d, b) {
      for (; b2(d, b) != 1; b += 4 + b2(d, b + 2))
        ;
      return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
    };
    exfl = function(ex) {
      var le = 0;
      if (ex) {
        for (var k in ex) {
          var l = ex[k].length;
          if (l > 65535)
            err(9);
          le += l + 4;
        }
      }
      return le;
    };
    wzh = function(d, b, f, fn, u, c, ce, co) {
      var fl2 = fn.length, ex = f.extra, col = co && co.length;
      var exl = exfl(ex);
      wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
      if (ce != null)
        d[b++] = 20, d[b++] = f.os;
      d[b] = 20, b += 2;
      d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
      d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
      var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
      if (y < 0 || y > 119)
        err(10);
      wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
      if (c != -1) {
        wbytes(d, b, f.crc);
        wbytes(d, b + 4, c < 0 ? -c - 2 : c);
        wbytes(d, b + 8, f.size);
      }
      wbytes(d, b + 12, fl2);
      wbytes(d, b + 14, exl), b += 16;
      if (ce != null) {
        wbytes(d, b, col);
        wbytes(d, b + 6, f.attrs);
        wbytes(d, b + 10, ce), b += 14;
      }
      d.set(fn, b);
      b += fl2;
      if (exl) {
        for (var k in ex) {
          var exf = ex[k], l = exf.length;
          wbytes(d, b, +k);
          wbytes(d, b + 2, l);
          d.set(exf, b + 4), b += 4 + l;
        }
      }
      if (col)
        d.set(co, b), b += col;
      return b;
    };
    wzf = function(o, b, c, d, e) {
      wbytes(o, b, 101010256);
      wbytes(o, b + 8, c);
      wbytes(o, b + 10, c);
      wbytes(o, b + 12, d);
      wbytes(o, b + 16, e);
    };
    ZipPassThrough = /* @__PURE__ */ function() {
      function ZipPassThrough2(filename) {
        this.filename = filename;
        this.c = crc();
        this.size = 0;
        this.compression = 0;
      }
      ZipPassThrough2.prototype.process = function(chunk, final) {
        this.ondata(null, chunk, final);
      };
      ZipPassThrough2.prototype.push = function(chunk, final) {
        if (!this.ondata)
          err(5);
        this.c.p(chunk);
        this.size += chunk.length;
        if (final)
          this.crc = this.c.d();
        this.process(chunk, final || false);
      };
      return ZipPassThrough2;
    }();
    ZipDeflate = /* @__PURE__ */ function() {
      function ZipDeflate2(filename, opts) {
        var _this = this;
        if (!opts)
          opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new Deflate(opts, function(dat, final) {
          _this.ondata(null, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
      }
      ZipDeflate2.prototype.process = function(chunk, final) {
        try {
          this.d.push(chunk, final);
        } catch (e) {
          this.ondata(e, null, final);
        }
      };
      ZipDeflate2.prototype.push = function(chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
      };
      return ZipDeflate2;
    }();
    AsyncZipDeflate = /* @__PURE__ */ function() {
      function AsyncZipDeflate2(filename, opts) {
        var _this = this;
        if (!opts)
          opts = {};
        ZipPassThrough.call(this, filename);
        this.d = new AsyncDeflate(opts, function(err2, dat, final) {
          _this.ondata(err2, dat, final);
        });
        this.compression = 8;
        this.flag = dbf(opts.level);
        this.terminate = this.d.terminate;
      }
      AsyncZipDeflate2.prototype.process = function(chunk, final) {
        this.d.push(chunk, final);
      };
      AsyncZipDeflate2.prototype.push = function(chunk, final) {
        ZipPassThrough.prototype.push.call(this, chunk, final);
      };
      return AsyncZipDeflate2;
    }();
    Zip = /* @__PURE__ */ function() {
      function Zip2(cb) {
        this.ondata = cb;
        this.u = [];
        this.d = 1;
      }
      Zip2.prototype.add = function(file) {
        var _this = this;
        if (!this.ondata)
          err(5);
        if (this.d & 2)
          this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, false);
        else {
          var f = strToU8(file.filename), fl_1 = f.length;
          var com = file.comment, o = com && strToU8(com);
          var u = fl_1 != file.filename.length || o && com.length != o.length;
          var hl_1 = fl_1 + exfl(file.extra) + 30;
          if (fl_1 > 65535)
            this.ondata(err(11, 0, 1), null, false);
          var header = new u8(hl_1);
          wzh(header, 0, file, f, u, -1);
          var chks_1 = [header];
          var pAll_1 = function() {
            for (var _i = 0, chks_2 = chks_1; _i < chks_2.length; _i++) {
              var chk = chks_2[_i];
              _this.ondata(null, chk, false);
            }
            chks_1 = [];
          };
          var tr_1 = this.d;
          this.d = 0;
          var ind_1 = this.u.length;
          var uf_1 = mrg(file, {
            f,
            u,
            o,
            t: function() {
              if (file.terminate)
                file.terminate();
            },
            r: function() {
              pAll_1();
              if (tr_1) {
                var nxt = _this.u[ind_1 + 1];
                if (nxt)
                  nxt.r();
                else
                  _this.d = 1;
              }
              tr_1 = 1;
            }
          });
          var cl_1 = 0;
          file.ondata = function(err2, dat, final) {
            if (err2) {
              _this.ondata(err2, dat, final);
              _this.terminate();
            } else {
              cl_1 += dat.length;
              chks_1.push(dat);
              if (final) {
                var dd = new u8(16);
                wbytes(dd, 0, 134695760);
                wbytes(dd, 4, file.crc);
                wbytes(dd, 8, cl_1);
                wbytes(dd, 12, file.size);
                chks_1.push(dd);
                uf_1.c = cl_1, uf_1.b = hl_1 + cl_1 + 16, uf_1.crc = file.crc, uf_1.size = file.size;
                if (tr_1)
                  uf_1.r();
                tr_1 = 1;
              } else if (tr_1)
                pAll_1();
            }
          };
          this.u.push(uf_1);
        }
      };
      Zip2.prototype.end = function() {
        var _this = this;
        if (this.d & 2) {
          this.ondata(err(4 + (this.d & 1) * 8, 0, 1), null, true);
          return;
        }
        if (this.d)
          this.e();
        else
          this.u.push({
            r: function() {
              if (!(_this.d & 1))
                return;
              _this.u.splice(-1, 1);
              _this.e();
            },
            t: function() {
            }
          });
        this.d = 3;
      };
      Zip2.prototype.e = function() {
        var bt = 0, l = 0, tl = 0;
        for (var _i = 0, _a2 = this.u; _i < _a2.length; _i++) {
          var f = _a2[_i];
          tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b2 = 0, _c = this.u; _b2 < _c.length; _b2++) {
          var f = _c[_b2];
          wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
          bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
      };
      Zip2.prototype.terminate = function() {
        for (var _i = 0, _a2 = this.u; _i < _a2.length; _i++) {
          var f = _a2[_i];
          f.t();
        }
        this.d = 2;
      };
      return Zip2;
    }();
    UnzipPassThrough = /* @__PURE__ */ function() {
      function UnzipPassThrough2() {
      }
      UnzipPassThrough2.prototype.push = function(data, final) {
        this.ondata(null, data, final);
      };
      UnzipPassThrough2.compression = 0;
      return UnzipPassThrough2;
    }();
    UnzipInflate = /* @__PURE__ */ function() {
      function UnzipInflate2() {
        var _this = this;
        this.i = new Inflate(function(dat, final) {
          _this.ondata(null, dat, final);
        });
      }
      UnzipInflate2.prototype.push = function(data, final) {
        try {
          this.i.push(data, final);
        } catch (e) {
          this.ondata(e, null, final);
        }
      };
      UnzipInflate2.compression = 8;
      return UnzipInflate2;
    }();
    AsyncUnzipInflate = /* @__PURE__ */ function() {
      function AsyncUnzipInflate2(_, sz) {
        var _this = this;
        if (sz < 32e4) {
          this.i = new Inflate(function(dat, final) {
            _this.ondata(null, dat, final);
          });
        } else {
          this.i = new AsyncInflate(function(err2, dat, final) {
            _this.ondata(err2, dat, final);
          });
          this.terminate = this.i.terminate;
        }
      }
      AsyncUnzipInflate2.prototype.push = function(data, final) {
        if (this.i.terminate)
          data = slc(data, 0);
        this.i.push(data, final);
      };
      AsyncUnzipInflate2.compression = 8;
      return AsyncUnzipInflate2;
    }();
    Unzip = /* @__PURE__ */ function() {
      function Unzip2(cb) {
        this.onfile = cb;
        this.k = [];
        this.o = {
          0: UnzipPassThrough
        };
        this.p = et;
      }
      Unzip2.prototype.push = function(chunk, final) {
        var _this = this;
        if (!this.onfile)
          err(5);
        if (!this.p)
          err(4);
        if (this.c > 0) {
          var len = Math.min(this.c, chunk.length);
          var toAdd = chunk.subarray(0, len);
          this.c -= len;
          if (this.d)
            this.d.push(toAdd, !this.c);
          else
            this.k[0].push(toAdd);
          chunk = chunk.subarray(len);
          if (chunk.length)
            return this.push(chunk, final);
        } else {
          var f = 0, i = 0, is = void 0, buf = void 0;
          if (!this.p.length)
            buf = chunk;
          else if (!chunk.length)
            buf = this.p;
          else {
            buf = new u8(this.p.length + chunk.length);
            buf.set(this.p), buf.set(chunk, this.p.length);
          }
          var l = buf.length, oc = this.c, add = oc && this.d;
          var _loop_2 = function() {
            var _a2;
            var sig = b4(buf, i);
            if (sig == 67324752) {
              f = 1, is = i;
              this_1.d = null;
              this_1.c = 0;
              var bf = b2(buf, i + 6), cmp_1 = b2(buf, i + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i + 26), es = b2(buf, i + 28);
              if (l > i + 30 + fnl + es) {
                var chks_3 = [];
                this_1.k.unshift(chks_3);
                f = 2;
                var sc_1 = b4(buf, i + 18), su_1 = b4(buf, i + 22);
                var fn_1 = strFromU8(buf.subarray(i + 30, i += 30 + fnl), !u);
                if (sc_1 == 4294967295) {
                  _a2 = dd ? [-2] : z64e(buf, i), sc_1 = _a2[0], su_1 = _a2[1];
                } else if (dd)
                  sc_1 = -1;
                i += es;
                this_1.c = sc_1;
                var d_1;
                var file_1 = {
                  name: fn_1,
                  compression: cmp_1,
                  start: function() {
                    if (!file_1.ondata)
                      err(5);
                    if (!sc_1)
                      file_1.ondata(null, et, true);
                    else {
                      var ctr = _this.o[cmp_1];
                      if (!ctr)
                        file_1.ondata(err(14, "unknown compression type " + cmp_1, 1), null, false);
                      d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                      d_1.ondata = function(err2, dat3, final2) {
                        file_1.ondata(err2, dat3, final2);
                      };
                      for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                        var dat2 = chks_4[_i];
                        d_1.push(dat2, false);
                      }
                      if (_this.k[0] == chks_3 && _this.c)
                        _this.d = d_1;
                      else
                        d_1.push(et, true);
                    }
                  },
                  terminate: function() {
                    if (d_1 && d_1.terminate)
                      d_1.terminate();
                  }
                };
                if (sc_1 >= 0)
                  file_1.size = sc_1, file_1.originalSize = su_1;
                this_1.onfile(file_1);
              }
              return "break";
            } else if (oc) {
              if (sig == 134695760) {
                is = i += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
                return "break";
              } else if (sig == 33639248) {
                is = i -= 4, f = 3, this_1.c = 0;
                return "break";
              }
            }
          };
          var this_1 = this;
          for (; i < l - 4; ++i) {
            var state_1 = _loop_2();
            if (state_1 === "break")
              break;
          }
          this.p = et;
          if (oc < 0) {
            var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 134695760 && 4)) : buf.subarray(0, i);
            if (add)
              add.push(dat, !!f);
            else
              this.k[+(f == 2)].push(dat);
          }
          if (f & 2)
            return this.push(buf.subarray(i), final);
          this.p = buf.subarray(i);
        }
        if (final) {
          if (this.c)
            err(13);
          this.p = null;
        }
      };
      Unzip2.prototype.register = function(decoder) {
        this.o[decoder.compression] = decoder;
      };
      return Unzip2;
    }();
    mt = typeof queueMicrotask == "function" ? queueMicrotask : typeof setTimeout == "function" ? setTimeout : function(fn) {
      fn();
    };
  }
});

// js/check.js
var ENDPOINT = "https://graph.oculus.com/graphql";
var NODE = "https://graph.oculus.com";
var HISTORY_DOC_ID = "2885322071572384";
var RIFT_META_DOC_ID = "24830095600010314";
var DEFAULT_TOKEN = "OC|1966835873381466|";
(function migrate() {
  try {
    for (const key of ["token", "acToken", "relay", "images", "details", "devDownloads", "limit", "store"]) {
      const old = localStorage.getItem(`oculusdb.${key}`);
      if (old !== null && localStorage.getItem(`metadb.${key}`) === null) {
        localStorage.setItem(`metadb.${key}`, old);
      }
      localStorage.removeItem(`oculusdb.${key}`);
    }
  } catch {
  }
})();
var settingsCache = null;
try {
  window.addEventListener("storage", (e) => {
    if (e.key === null || e.key.startsWith("metadb.")) settingsCache = null;
  });
} catch {
}
function loadSettings() {
  settingsCache != null ? settingsCache : settingsCache = readSettings();
  return { ...settingsCache, hidden: [...settingsCache.hidden] };
}
function readSettings() {
  var _a2;
  try {
    return {
      token: localStorage.getItem("metadb.token") || DEFAULT_TOKEN,
      acToken: localStorage.getItem("metadb.acToken") || "",
      relay: localStorage.getItem("metadb.relay") || "",
      images: localStorage.getItem("metadb.images") === "1",
      details: localStorage.getItem("metadb.details") === "1",
      devDownloads: localStorage.getItem("metadb.devDownloads") === "1",
      /* Off by default: the box on Apps and games that downloads by binary ID. */
      binDownload: localStorage.getItem("metadb.binDownload") === "1",
      /* Set once the guided tour has been finished or skipped. */
      tourDone: localStorage.getItem("metadb.tourDone") === "1",
      /* On unless turned off: a build with an OBB is no use without it. */
      obb: localStorage.getItem("metadb.obb") !== "0",
      /* Off by default: fetch the library on load and tint apps you own. */
      autoOwned: localStorage.getItem("metadb.autoOwned") === "1",
      /* Off by default: fetch the account's DLC, playtime or cloud backups as
         soon as the page opens, rather than waiting for a Get button. */
      autoDlc: localStorage.getItem("metadb.autoDlc") === "1",
      autoPlaytime: localStorage.getItem("metadb.autoPlaytime") === "1",
      autoBackups: localStorage.getItem("metadb.autoBackups") === "1",
      /* On unless turned off, same as the OBB lookup above. */
      wide: localStorage.getItem("metadb.wide") !== "0",
      /* On unless turned off, like the store button. */
      motion: localStorage.getItem("metadb.motion") !== "0",
      motionSpeed: localStorage.getItem("metadb.motionSpeed") || "180",
      fontSize: localStorage.getItem("metadb.fontSize") || "16",
      limit: localStorage.getItem("metadb.limit") || "",
      /* Starting values for the on-page pickers. */
      hmd: localStorage.getItem("metadb.hmd") || "EUREKA",
      searchSort: localStorage.getItem("metadb.searchSort") || "relevance",
      mineSort: localStorage.getItem("metadb.mineSort") || "az",
      buildSort: localStorage.getItem("metadb.buildSort") || "released",
      /* Which install trigger the Default apps tab starts on. */
      defaultTrigger: localStorage.getItem("metadb.defaultTrigger") || "AUTO_UPDATER",
      /* Inside the headset app: "downgrade" (its home layout) or "site". */
      layout: localStorage.getItem("metadb.layout") || "downgrade",
      /* Downgrade's "Show apps not installed". */
      dgAll: localStorage.getItem("metadb.dgAll") === "1",
      /* On unless explicitly turned off, so it keeps its old behaviour. */
      store: localStorage.getItem("metadb.store") !== "0",
      /* Developer: log every request to the console. Off by default. */
      log: localStorage.getItem("metadb.log") === "1",
      /* Column classes the user has switched off. */
      hidden: ((_a2 = localStorage.getItem("metadb.hidden")) != null ? _a2 : "").split(",").filter(Boolean)
    };
  } catch {
    return {
      token: DEFAULT_TOKEN,
      acToken: "",
      relay: "",
      images: false,
      details: false,
      devDownloads: false,
      binDownload: false,
      tourDone: false,
      obb: true,
      autoOwned: false,
      autoDlc: false,
      autoPlaytime: false,
      autoBackups: false,
      wide: true,
      motion: true,
      motionSpeed: "180",
      fontSize: "16",
      limit: "",
      hmd: "EUREKA",
      searchSort: "relevance",
      mineSort: "az",
      buildSort: "released",
      defaultTrigger: "AUTO_UPDATER",
      store: true,
      hidden: []
    };
  }
}
function saveSettings(patch) {
  settingsCache = null;
  try {
    for (const [key, value] of Object.entries(patch)) {
      const name = `metadb.${key}`;
      if (typeof value === "boolean") {
        localStorage.setItem(name, value ? "1" : "0");
        continue;
      }
      const stored = Array.isArray(value) ? value.join(",") : value;
      if (stored) localStorage.setItem(name, stored);
      else localStorage.removeItem(name);
    }
  } catch {
    throw new Error("this browser refused to store the settings");
  }
}
function clearSettings() {
  settingsCache = null;
  try {
    for (const key of ["token", "acToken", "relay", "images", "details", "devDownloads", "binDownload", "tourDone", "obb", "autoOwned", "autoDlc", "autoPlaytime", "autoBackups", "wide", "motion", "motionSpeed", "fontSize", "hidden", "limit", "store", "hmd", "searchSort", "mineSort", "buildSort", "defaultTrigger", "log", "layout", "dgAll"]) {
      localStorage.removeItem(`metadb.${key}`);
    }
  } catch {
  }
  clearSecrets();
}
var BUILT_IN_RELAY = "/api?url={url}";
var builtInMissing = false;
var needsRelay = () => builtInMissing && !loadSettings().relay;
var SECRET_COOKIE = "metadb.secrets";
var SECRET_MAX_AGE = 60 * 60 * 24 * 365;
function writeCookie(name, value, maxAge) {
  try {
    const bits2 = [
      `${name}=${encodeURIComponent(value)}`,
      "path=/",
      `max-age=${maxAge}`,
      "SameSite=Strict"
    ];
    if (location.protocol === "https:") bits2.push("Secure");
    document.cookie = bits2.join("; ");
  } catch {
  }
}
function clearSecrets() {
  writeCookie(SECRET_COOKIE, "", 0);
}
function route(url) {
  const relay = loadSettings().relay || BUILT_IN_RELAY;
  return relay.includes("{url}") ? relay.replace("{url}", encodeURIComponent(url)) : relay + encodeURIComponent(url);
}
var forLog = (url) => String(url).replace(/(access_token=)[^&]*/i, "$1<token>");
function withoutToken(query) {
  const p = new URLSearchParams(query);
  p.delete("access_token");
  return p.toString();
}
function emitLog(detail) {
  try {
    window.dispatchEvent(new CustomEvent("metadb:log", { detail }));
  } catch {
  }
}
async function getJSON(url) {
  const { relay, log } = loadSettings();
  const started = log ? performance.now() : 0;
  const q = url.indexOf("?");
  const base = q === -1 ? url : url.slice(0, q);
  const query = q === -1 ? "" : url.slice(q + 1);
  const post = base === ENDPOINT;
  const target = post ? route(ENDPOINT) : route(url);
  const init = post ? {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: query
  } : { headers: { Accept: "application/json" } };
  const logUrl = post ? `${ENDPOINT}?${withoutToken(query)}` : forLog(url);
  let res;
  try {
    res = await fetch(target, init);
  } catch {
    if (log) emitLog({ url: logUrl, error: "no reply \u2014 relay unreachable or blocked" });
    throw new Error(
      relay ? "could not reach the relay \u2014 check the URL on the Settings page" : "the browser blocked this request; set a relay URL on the Settings page"
    );
  }
  if (log) {
    emitLog({ url: logUrl, status: res.status, ms: Math.round(performance.now() - started) });
  }
  if (!relay && res.status === 404) {
    builtInMissing = true;
    throw new Error(
      "this site has no built-in relay \u2014 set a relay URL on the Settings page"
    );
  }
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = stitch(text);
  }
  if (!json) {
    const snippet = text.trim() ? `${res.status}: ${text.trim().replace(/\s+/g, " ").slice(0, 120)}` : `${res.status} with an empty body`;
    throw new Error(
      res.ok ? `the reply was not JSON \u2014 got ${snippet}` : `store returned ${snippet}`
    );
  }
  if (!res.ok && !json.error && !json.errors) {
    throw new Error(`store returned ${res.status}`);
  }
  return json;
}
function split(text) {
  const out = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
    } else if (c === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (c === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        try {
          out.push(JSON.parse(text.slice(start, i + 1)));
        } catch {
          return out;
        }
        start = -1;
      }
    }
  }
  return out;
}
function stitch(text) {
  var _a2;
  const parts = split(text);
  const root = (_a2 = parts.find((p) => p.data || p.errors || p.error)) != null ? _a2 : null;
  if (!(root == null ? void 0 : root.data)) return root;
  for (const part of parts) {
    if (part === root || !part.data || !Array.isArray(part.path)) continue;
    let node = root.data;
    for (const step of part.path) node = node == null ? void 0 : node[step];
    if (node && typeof node === "object") Object.assign(node, part.data);
  }
  return root;
}
var day = (secs) => new Date(secs * 1e3).toISOString().slice(0, 10);
function parseHistory(json) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  if ((_a2 = json == null ? void 0 : json.errors) == null ? void 0 : _a2.length) throw new Error(json.errors[0].message);
  if (json == null ? void 0 : json.error) throw new Error((_b2 = json.error.message) != null ? _b2 : "request rejected");
  const nodes = (_e = (_d = (_c = json == null ? void 0 : json.data) == null ? void 0 : _c.node) == null ? void 0 : _d.primary_binaries) == null ? void 0 : _e.nodes;
  if (!nodes) throw new Error("no build history in the reply");
  const builds = nodes.map((b) => {
    var _a3, _b3, _c2, _d2, _e2;
    return {
      id: b.id,
      version: (_a3 = b.version) != null ? _a3 : "\u2014",
      versionCode: b.version_code,
      releasedAt: b.created_date ? day(b.created_date) : null,
      createdAt: (_b3 = b.created_date) != null ? _b3 : 0,
      fileName: (_c2 = b.file_name) != null ? _c2 : "",
      channels: ((_e2 = (_d2 = b.binary_release_channels) == null ? void 0 : _d2.nodes) != null ? _e2 : []).map((c) => c.channel_name).filter(Boolean)
    };
  }).sort((a, b) => b.createdAt - a.createdAt);
  const channelIds = /* @__PURE__ */ new Map();
  for (const node of nodes) {
    for (const c of (_g = (_f = node.binary_release_channels) == null ? void 0 : _f.nodes) != null ? _g : []) {
      if ((c == null ? void 0 : c.channel_name) && c.id) channelIds.set(c.channel_name, String(c.id));
    }
  }
  const byChannel = /* @__PURE__ */ new Map();
  for (const b of builds) {
    for (const name of b.channels) {
      if (byChannel.has(name)) continue;
      byChannel.set(name, {
        name,
        id: (_h = channelIds.get(name)) != null ? _h : null,
        group: name === "LIVE" ? "PRIMARY" : "CUSTOM",
        version: b.version,
        versionCode: b.versionCode,
        releasedAt: b.releasedAt
      });
    }
  }
  const channels = [...byChannel.values()];
  const live = (_j = (_i = channels.find((c) => c.name === "LIVE")) != null ? _i : channels[0]) != null ? _j : null;
  const revisions = ((_n = (_m = (_l = (_k = json == null ? void 0 : json.data) == null ? void 0 : _k.node) == null ? void 0 : _l.revisions) == null ? void 0 : _m.nodes) != null ? _n : []).map((r) => {
    var _a3, _b3, _c2;
    return {
      id: (_a3 = r.id) != null ? _a3 : null,
      status: r.administration_status ? words(r.administration_status) : null,
      created: r.created_date ? day(r.created_date) : null,
      submissions: (_c2 = (_b3 = r.submission_events) == null ? void 0 : _b3.count) != null ? _c2 : 0
    };
  });
  return { builds, channels, live, newest: (_o = builds[0]) != null ? _o : null, revisions };
}
async function fetchHistory(id) {
  return parseHistory(await storeQuery(HISTORY_DOC_ID, { applicationID: String(id) }));
}
async function checkApp(app) {
  const { builds, channels, live, newest, revisions } = await fetchHistory(app.id);
  if (!live && !newest) throw new Error("no published binary");
  const head = live != null ? live : newest;
  return {
    version: head.version,
    versionCode: head.versionCode,
    releasedAt: head.releasedAt,
    channel: live ? live.name : "unreleased",
    channels,
    newest,
    builds,
    total: builds.length,
    revisions
  };
}
async function ocmsHeaders() {
  const res = await fetch(new URL(`../data/ocms-headers.json${new URL(import.meta.url).search}`, import.meta.url));
  if (!res.ok) throw new Error(`ocms-headers.json answered ${res.status}`);
  return res.json();
}
function parseRepo(input) {
  var _a2;
  const s = String(input != null ? input : "").trim();
  const m = (_a2 = s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#].*)?$/i)) != null ? _a2 : s.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}
var GITHUB_PAGES = 10;
async function githubReleases(repo) {
  var _a2, _b2, _c;
  const all = [];
  let url = `https://api.github.com/repos/${repo}/releases?per_page=100`;
  for (let page = 0; url && page < GITHUB_PAGES; page++) {
    let res;
    try {
      res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    } catch {
      throw new Error("could not reach GitHub");
    }
    if (res.status === 404) throw new Error(`there is no public repo called ${repo}`);
    if (res.status === 403 && res.headers.get("x-ratelimit-remaining") === "0") {
      if (all.length) break;
      throw new Error("GitHub's limit of 60 requests an hour is used up \u2014 try again in a while");
    }
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    all.push(...await res.json());
    url = (_c = (_b2 = ((_a2 = res.headers.get("link")) != null ? _a2 : "").match(/<([^>]+)>;\s*rel="next"/)) == null ? void 0 : _b2[1]) != null ? _c : null;
  }
  return all.filter((r) => !r.draft).map((r) => {
    var _a3, _b3;
    return {
      tag: r.tag_name,
      name: r.name || r.tag_name,
      published: ((_a3 = r.published_at) != null ? _a3 : "").slice(0, 10),
      prerelease: Boolean(r.prerelease),
      url: r.html_url,
      assets: ((_b3 = r.assets) != null ? _b3 : []).filter((a) => /\.apk$/i.test(a.name)).map((a) => ({ id: String(a.id), name: a.name, size: a.size, url: a.browser_download_url }))
    };
  }).filter((r) => r.assets.length);
}
async function storeNames(ids) {
  var _a2;
  const list = [...new Set(ids.map(String))].filter(Boolean);
  if (!list.length) return /* @__PURE__ */ new Map();
  const { token } = loadSettings();
  const json = await getJSON(
    `${NODE}/?` + new URLSearchParams({ ids: list.join(","), fields: "display_name", access_token: token })
  );
  if (json.error) throw new Error((_a2 = json.error.message) != null ? _a2 : "request rejected");
  const out = /* @__PURE__ */ new Map();
  for (const [id, node] of Object.entries(json)) {
    if (node == null ? void 0 : node.display_name) out.set(String(id), node.display_name);
  }
  return out;
}
async function lookupApp(id) {
  var _a2, _b2;
  const { token } = loadSettings();
  const meta = await getJSON(
    `${NODE}/${encodeURIComponent(id)}/?` + new URLSearchParams({ access_token: token, fields: "display_name,platform" })
  );
  if (meta.error) throw new Error((_a2 = meta.error.message) != null ? _a2 : "app not found");
  const latest = await checkApp({ id });
  return {
    id: String(id),
    name: meta.display_name,
    platform: meta.platform,
    channels: (_b2 = latest.channels) != null ? _b2 : []
  };
}
var SEARCH_DOC_ID = "3928907833885295";
var HMD_TYPES = [
  ["EUREKA", "Quest 3"],
  ["PANTHER", "Quest 3S"],
  ["SEACLIFF", "Quest Pro"],
  ["HOLLYWOOD", "Quest 2"],
  ["MONTEREY", "Quest"],
  ["PACIFIC", "Go"],
  ["RIFT", "Rift"],
  ["LOMA", "VR Glasses"]
];
var HMD_PLATFORM = {
  PACIFIC: "ANDROID_3DOF",
  RIFT: "PC"
};
function extractApps(json, fallbackPlatform = null) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const categories = (_c = (_b2 = (_a2 = json == null ? void 0 : json.data) == null ? void 0 : _a2.viewer) == null ? void 0 : _b2.contextual_search) == null ? void 0 : _c.all_category_results;
  if (!Array.isArray(categories)) return [];
  const out = /* @__PURE__ */ new Map();
  for (const category of categories) {
    for (const node of (_e = (_d = category == null ? void 0 : category.search_results) == null ? void 0 : _d.nodes) != null ? _e : []) {
      const app = node == null ? void 0 : node.target_object;
      if (!(app == null ? void 0 : app.id) || out.has(app.id)) continue;
      out.set(app.id, {
        id: String(app.id),
        name: app.display_name || app.canonicalName || app.id,
        slug: (_f = app.canonicalName) != null ? _f : null,
        category: (_h = (_g = category.display_name) != null ? _g : category.name) != null ? _h : null,
        /* The slug usually ends in the platform, e.g. "…-android6d0f". Older
           mobile listings — the Go and Gear VR ones — often carry no marker at
           all, so the store that was searched stands in rather than leaving the
           Device column empty. */
        platform: /android6d0f/i.test((_i = app.canonicalName) != null ? _i : "") ? "ANDROID_6DOF" : /android3dof|gearvr|gear-vr/i.test((_j = app.canonicalName) != null ? _j : "") ? "ANDROID_3DOF" : fallbackPlatform,
        /* Free apps report "$0.00"; pre-orders and coming-soon carry no price. */
        price: (_m = (_l = (_k = app.current_offer) == null ? void 0 : _k.price) == null ? void 0 : _l.formatted) != null ? _m : null,
        /* What a claim is made against, and whether there is anything to pay.
           `offset_amount` is minor units as a string, so "0" is the only free
           one; a coming-soon offer has no price at all and is not free. */
        offerId: ((_n = app.current_offer) == null ? void 0 : _n.id) ? String(app.current_offer.id) : null,
        free: ((_p = (_o = app.current_offer) == null ? void 0 : _o.price) == null ? void 0 : _p.offset_amount) === "0",
        releasedAt: app.release_date ? new Date(app.release_date * 1e3).toISOString().slice(0, 10) : null,
        image: (_r = (_q = app.cover_square_image) == null ? void 0 : _q.uri) != null ? _r : null,
        media: nodeMedia(app)
      });
    }
  }
  return [...out.values()];
}
var DETAILS_DOC_ID = "38375779192687022983111059848";
var PATCH_ALGORITHMS = [
  "RDIFF",
  "PUFFIN",
  "PUFFIN_LZ4",
  "SUPERPACK_V1",
  "SUPERPACK_V1_NOSOURCE"
];
async function appDetails(id) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const json = await storeQuery(DETAILS_DOC_ID, {
    params: {
      app_params: [
        {
          app_id: String(id),
          installed_version_code: "0",
          has_source_stamp: false,
          supported_patch_algorithms: PATCH_ALGORITHMS,
          for_pre_download: false,
          installed_apk_cert_signature: ""
        }
      ]
    },
    fetch_all_assets: false,
    includeLatestAvailableBinary: true,
    fetch_fallback_uris: false,
    compatibilityFilter: "DEFAULT_PSDK",
    gpu_hash: ""
  }, { client: true });
  refuse(json, "The build manifest");
  const update = (_c = (_b2 = (_a2 = json == null ? void 0 : json.data) == null ? void 0 : _a2.app_binary_updates) == null ? void 0 : _b2.updates) == null ? void 0 : _c[0];
  const binary = update == null ? void 0 : update.new_binary;
  if (!binary) throw new Error("no binary manifest in the reply");
  const deps = (_g = (_f = (_e = (_d = update.application) == null ? void 0 : _d.latest_available_binary) == null ? void 0 : _e.dependency_configs) == null ? void 0 : _f.edges) != null ? _g : [];
  const depNodes = deps.map((e) => e.node);
  const requiredOs = (_h = depNodes.find(
    (n) => {
      var _a3;
      return /required_os_version/i.test((_a3 = n == null ? void 0 : n.identifier) != null ? _a3 : "");
    }
  )) == null ? void 0 : _h.version;
  const requiredPsdk = (_i = depNodes.find(
    (n) => {
      var _a3;
      return /required_psdk_version/i.test((_a3 = n == null ? void 0 : n.identifier) != null ? _a3 : "");
    }
  )) == null ? void 0 : _i.version;
  return {
    ...binaryFields(binary),
    requiredOs: requiredOs != null ? requiredOs : null,
    requiredPsdk: requiredPsdk != null ? requiredPsdk : null,
    updateRequired: (_l = (_k = (_j = update.application) == null ? void 0 : _j.latest_available_binary) == null ? void 0 : _k.is_update_required) != null ? _l : null
  };
}
function binaryFields(binary) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  return {
    packageName: (_a2 = binary.package_name) != null ? _a2 : null,
    version: (_b2 = binary.version) != null ? _b2 : null,
    versionCode: (_c = binary.version_code) != null ? _c : null,
    size: Number(binary.size) || null,
    requiredSpace: Number(binary.required_space) || null,
    fileName: (_d = binary.file_name) != null ? _d : null,
    targetSdk: (_e = binary.target_android_sdk_version) != null ? _e : null,
    headTracking: (_f = binary.head_tracking) != null ? _f : null,
    externalStorage: (_g = binary.can_use_external_storage) != null ? _g : null,
    releasedAt: binary.release_date ? day(binary.release_date) : null,
    sha256: (_h = binary.sha256) != null ? _h : null,
    checksum: (_i = binary.checksum_hash) != null ? _i : null,
    certSignature: (_j = binary.apk_cert_signature) != null ? _j : null,
    permissions: (_k = binary.permissions) != null ? _k : []
  };
}
var BINARY_DOC_ID = "23514803210732035698740817391";
async function binaryDetails(appId, versionCode) {
  var _a2, _b2, _c, _d, _e, _f;
  const json = await storeQuery(BINARY_DOC_ID, {
    params: { app_params: [{ app_id: String(appId), version_code: String(versionCode) }] },
    fetch_fallback_uris: false
  }, { client: true });
  refuse(json, "Build details");
  const binary = (_d = (_c = (_b2 = (_a2 = json == null ? void 0 : json.data) == null ? void 0 : _a2.app_binary_info) == null ? void 0 : _b2.info) == null ? void 0 : _c[0]) == null ? void 0 : _d.binary;
  if (!binary) throw new Error("the store has no details for this build");
  return {
    ...binaryFields(binary),
    obbSize: Number((_e = binary.obb_binary) == null ? void 0 : _e.size) || null,
    obbId: ((_f = binary.obb_binary) == null ? void 0 : _f.id) ? String(binary.obb_binary.id) : null
  };
}
var STORE_DOC_ID = "26038741162490780";
var words = (s) => String(s).toLowerCase().replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
var PLAYER_MODES = {
  SITTING: "Sitting",
  STANDING: "Standing",
  ROOM_SCALE: "Roomscale"
};
var gb = (bytes) => Number(bytes) ? `${(Number(bytes) / 1024 ** 3).toFixed(2)} GB` : null;
async function storeListing(id, hmdType = loadSettings().hmd) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  const json = await storeQuery(STORE_DOC_ID, {
    hmdType,
    itemId: String(id),
    /* The page turns these on to get the metadata line and off to skip
       the AI review summary. Both are required. */
    __relay_internal__pv__MDCAppStorFortheMetadataLineEnablerelayprovider: true,
    __relay_internal__pv__MDCAppStoreGenAIReviewSummaryEnabledrelayprovider: false
  });
  refuse(json, "The store listing");
  const app = (_a2 = json == null ? void 0 : json.data) == null ? void 0 : _a2.app_store_item;
  if (!app) throw new Error("no listing in the reply");
  if (app.genre_names === void 0 && app.category_name === void 0) {
    throw new Error(
      "the store sent the description but not the details \u2014 that half needs a logged-in access token, set on the Settings page"
    );
  }
  const binary = (_b2 = app.latest_supported_binary) != null ? _b2 : {};
  const count = app.quality_rating_i18n_count_string;
  return {
    name: (_c = app.display_name) != null ? _c : null,
    genres: (_d = app.genre_names) != null ? _d : [],
    category: (_e = app.category_name) != null ? _e : null,
    modes: (_f = app.user_interaction_mode_names) != null ? _f : [],
    playerModes: ((_g = app.supported_player_modes) != null ? _g : []).map((m) => {
      var _a3;
      return (_a3 = PLAYER_MODES[m]) != null ? _a3 : words(m);
    }),
    controllers: (_h = app.supported_input_device_names) != null ? _h : [],
    platforms: (_i = app.supported_platforms_i18n) != null ? _i : [],
    publisher: (_j = app.publisher_name) != null ? _j : null,
    developer: (_k = app.developer_name) != null ? _k : null,
    orgId: (_m = (_l = app.organization) == null ? void 0 : _l.id) != null ? _m : null,
    comfort: app.comfort_rating ? words(app.comfort_rating) : null,
    internet: (_n = app.internet_connection_name) != null ? _n : null,
    languages: ((_o = app.supported_in_app_languages) != null ? _o : []).map((l) => l.name),
    installSize: gb(binary.total_installed_space),
    released: (_q = (_p = app.release_info) == null ? void 0 : _p.display_date) != null ? _q : null,
    rating: (_r = app.quality_rating_i18n_score_string) != null ? _r : null,
    ratingCount: count && count !== "0" ? count : null,
    website: (_s = app.website_url) != null ? _s : null,
    hasAds: (_t = app.has_in_app_ads) != null ? _t : null
  };
}
var OFFER_DOC_ID = "27653348084360166";
var mediaSize = (uri) => {
  var _a2, _b2;
  return Number((_b2 = (_a2 = /_s(\d+)x/.exec(uri)) == null ? void 0 : _a2[1]) != null ? _b2 : 0);
};
function mediaKey(uri) {
  const [path, query = ""] = uri.split("?");
  const entry = new URLSearchParams(query).get("ab_entry");
  return entry ? `${path}?${entry}` : path;
}
function mediaSet() {
  const found = /* @__PURE__ */ new Map();
  return {
    add(label, uri, extra = {}) {
      if (!uri) return;
      const key = mediaKey(uri);
      const seen = found.get(key);
      if (!seen) found.set(key, { label, uri, kind: "image", ...extra });
      else if (mediaSize(uri) > mediaSize(seen.uri)) seen.uri = uri;
    },
    list() {
      return [...found.values()].map((m) => {
        var _a2;
        return {
          ...m,
          width: (_a2 = m.width) != null ? _a2 : mediaSize(m.uri) || null
        };
      });
    }
  };
}
function mergeMedia(...lists) {
  const set = mediaSet();
  for (const list of lists) {
    for (const m of list != null ? list : []) set.add(m.label, m.uri, m);
  }
  return set.list();
}
var IMAGE_FIELDS = {
  cover_square_image: "Cover",
  square_image: "Cover",
  cover_landscape_image: "Landscape",
  landscape_image: "Landscape",
  medium_landscape_image: "Landscape (medium)",
  small_landscape_image: "Landscape (small)",
  hero_image: "Hero",
  thumbnail: "Thumbnail",
  icon_image: "Icon",
  vr_icon_image: "Icon (VR)",
  icon_foreground_image: "Icon foreground",
  icon_background_image: "Icon background",
  logo_image: "Logo"
};
function nodeMedia(node) {
  var _a2;
  if (!node || typeof node !== "object") return [];
  const set = mediaSet();
  for (const [field, label] of Object.entries(IMAGE_FIELDS)) {
    set.add(label, (_a2 = node[field]) == null ? void 0 : _a2.uri);
  }
  for (const [field, value] of Object.entries(node)) {
    if (field in IMAGE_FIELDS) continue;
    if (!/image|thumbnail|photo|poster|cover/i.test(field)) continue;
    if (typeof (value == null ? void 0 : value.uri) === "string") set.add(words(field), value.uri);
  }
  return set.list();
}
var SPATIAL_FILE = new URL(
  `../data/spatial-icons.json${new URL(import.meta.url).search}`,
  import.meta.url
);
var spatialTable = null;
async function spatialAssets() {
  if (!spatialTable) {
    spatialTable = fetch(SPATIAL_FILE).then((r) => r.ok ? r.json() : null).catch(() => null);
  }
  return spatialTable;
}
var SPATIAL_THEMES = {
  both: ["Tile background", "Tile foreground"],
  rlds: ["Tile background (RLDS)", "Tile foreground (RLDS)"],
  aura: ["Tile background (Aura)", "Tile foreground (Aura)"]
};
async function spatialIcons(packageName) {
  var _a2;
  if (!packageName) return [];
  const table = await spatialAssets();
  const themes = (_a2 = table == null ? void 0 : table.apps) == null ? void 0 : _a2[packageName];
  if (!themes) return [];
  const set = mediaSet();
  for (const [theme, entries] of Object.entries(themes)) {
    const labels = SPATIAL_THEMES[theme];
    if (!labels) continue;
    entries.forEach((entry, i) => {
      if (entry) set.add(labels[i], `${table.base}${entry}`, { natural: true });
    });
  }
  return set.list();
}
function pageMedia(app) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
  const set = mediaSet();
  set.add("Hero", (_a2 = app.hero_image) == null ? void 0 : _a2.uri);
  ((_b2 = app.screenshots) != null ? _b2 : []).forEach(
    (shot, i) => set.add(`Screenshot ${i + 1}`, shot == null ? void 0 : shot.uri)
  );
  set.add("Poster", (_d = (_c = app.mobilePoster) == null ? void 0 : _c.thumbnail) == null ? void 0 : _d.uri);
  set.add("Trailer still", (_f = (_e = app.trailer) == null ? void 0 : _e.thumbnail) == null ? void 0 : _f.uri);
  set.add("Trailer", (_g = app.trailer) == null ? void 0 : _g.uri, {
    kind: "video",
    poster: (_j = (_i = (_h = app.trailer) == null ? void 0 : _h.thumbnail) == null ? void 0 : _i.uri) != null ? _j : null
  });
  return set.list();
}
async function appPage(id, hmdType = loadSettings().hmd) {
  var _a2, _b2;
  const json = await storeQuery(OFFER_DOC_ID, { itemId: String(id), hmdType });
  refuse(json, "The app page");
  const app = (_a2 = json == null ? void 0 : json.data) == null ? void 0 : _a2.app_store_item;
  if (!app) throw new Error("no app in the reply");
  const offer = app.current_offer;
  return {
    offer: (offer == null ? void 0 : offer.id) ? {
      offerId: String(offer.id),
      free: ((_b2 = offer.price) == null ? void 0 : _b2.offset_amount) === "0"
    } : null,
    media: pageMedia(app)
  };
}
async function searchStore(query, { limit = 5, hmdType = "EUREKA" } = {}) {
  var _a2;
  const json = await storeQuery(SEARCH_DOC_ID, {
    query,
    hmdType,
    firstSearchResultItems: limit
  });
  refuse(json, "Store search");
  return extractApps(json, (_a2 = HMD_PLATFORM[hmdType]) != null ? _a2 : "ANDROID_6DOF").slice(0, limit);
}
var DEFAULT_APPS_DOC_ID = "401634805713809711258408144";
var DEFAULT_APPS_STORE_ID = "215871315640047";
var DEFAULT_APP_TRIGGERS = [
  ["AUTO_UPDATER", "AUTO_UPDATER"],
  ["NUX_BLOCKING", "NUX_BLOCKING"],
  ["NUX_NON_BLOCKING", "NUX_NON_BLOCKING"]
];
var DEFAULT_APPS_VARS = {
  iconImageSize: "360x360",
  landscapeImageSize: "720x405",
  coverSquareImageSize: "360x360"
};
async function defaultApps(hmdType = "HOLLYWOOD", trigger = "AUTO_UPDATER") {
  var _a2, _b2, _c;
  const json = await storeQuery(DEFAULT_APPS_DOC_ID, {
    hmd: hmdType,
    node_id: DEFAULT_APPS_STORE_ID,
    install_trigger: trigger,
    ...DEFAULT_APPS_VARS
  }, { client: true });
  refuse(json, "Default apps");
  const nodes = (_c = (_b2 = (_a2 = json.data) == null ? void 0 : _a2.fetch__AppStore) == null ? void 0 : _b2.default_applications) != null ? _c : [];
  return nodes.map(defaultAppRow);
}
function defaultAppRow(n) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i;
  const b = n.latest_supported_binary;
  return {
    id: String(n.id),
    name: n.display_name || n.package_name || String(n.id),
    packageName: (_a2 = n.package_name) != null ? _a2 : null,
    platform: (_b2 = n.platform) != null ? _b2 : null,
    image: (_f = (_e = (_c = n.cover_square_image) == null ? void 0 : _c.uri) != null ? _e : (_d = n.icon_image) == null ? void 0 : _d.uri) != null ? _f : null,
    /* This query asks for icon, landscape and square art by size, so a default
       app arrives with more than the one picture the row shows. */
    media: nodeMedia(n),
    category: (_g = n.category) != null ? _g : null,
    price: null,
    offerId: null,
    free: false,
    channels: [],
    latest: b ? {
      version: (_h = b.version) != null ? _h : null,
      versionCode: (_i = b.version_code) != null ? _i : null,
      releasedAt: null,
      id: b.id ? String(b.id) : null,
      size: Number(b.size) || null,
      channels: []
    } : null
  };
}
var PACKAGE_DOC_ID = "130289649615311830816220616253";
function extractPackageIds(json, wanted) {
  const want = new Set(wanted);
  const found = /* @__PURE__ */ new Map();
  const isId = (v) => typeof v === "string" && /^\d{8,}$/.test(v);
  (function walk(node) {
    var _a2;
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const values = Object.values(node);
    const pkg = values.find((v) => typeof v === "string" && want.has(v));
    const id = [node.id, node.appId, node.application_id, ...values].find(isId);
    if (pkg && id && !found.has(pkg)) {
      const display = node.display_name || node.displayName || node.name || node.appName;
      found.set(pkg, {
        id: String(id),
        name: display && display !== pkg ? display : null,
        platform: (_a2 = node.platform) != null ? _a2 : "ANDROID_6DOF"
      });
    }
    values.forEach(walk);
  })(json);
  return found;
}
async function lookupPackages(packageNames) {
  const json = await storeQuery(PACKAGE_DOC_ID, { package_names: packageNames }, { client: true });
  refuse(json, "Package lookup");
  const found = extractPackageIds(json, packageNames);
  if (!found.size) {
    throw new Error(
      "the reply carried no recognisable app IDs \u2014 the response shape may have changed"
    );
  }
  return found;
}
async function lookupByPackage(packageName) {
  var _a2;
  const hit = (await lookupPackages([packageName])).get(packageName);
  if (!hit) throw new Error("no app matched that package name");
  const out = { id: hit.id, packageName, platform: hit.platform };
  if (hit.name) out.name = hit.name;
  try {
    out.channels = (_a2 = (await checkApp({ id: out.id })).channels) != null ? _a2 : [];
  } catch {
    out.channels = [];
  }
  return out;
}
var ENTITLEMENTS_DOC_IDS = {
  quest: "412097616712440770934752951129",
  pc: "2890869346616033607941569925",
  /* ExpiredEntitlements: what the account used to own — ended trials, lapsed
     subscriptions. Same variables and the same reply shape as the Quest
     library, filed under `app_entitlements` instead. */
  expired: "92428577213436624608621763230"
};
var ENTITLEMENTS_VARIABLES = {
  smallLandscapeImageSize: "180x100",
  skipFetchingRequiredUpdates: true,
  coverSquareImageSize: "225x225",
  iconImageSize: "64x64",
  landscapeImageSize: "405x720",
  fetch_fallback_uris: true,
  machine_id: "1",
  imageScale: 1,
  cursorID: null,
  count: 1e3,
  allFields: true,
  onlyDefaultApps: false,
  excludePackages: null,
  fetchAchievementBasedTrialInfo: false,
  compatibilityFilter: "DEFAULT"
};
var ENTITLEMENT_PAGES = 10;
function entitlementApp(node, platform, owned = true) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const app = node == null ? void 0 : node.item;
  if (!(app == null ? void 0 : app.id)) return null;
  const binary = (_a2 = app.latest_supported_binary) != null ? _a2 : null;
  return {
    id: String(app.id),
    name: app.display_name || app.package_name || String(app.id),
    packageName: (_b2 = app.package_name) != null ? _b2 : null,
    /* Each library is one store's worth, so the query answers this rather than
       the row — unless the reply says otherwise for itself. */
    platform: (_c = app.platform) != null ? _c : platform,
    /* Marks the row as coming from a library rather than the store, which says
       nothing about channels either way. An expired entitlement is not owned. */
    owned,
    /* PAID_OFFER, NUX, DEVELOPER, OCULUS_KEYS … how it was come by. */
    grant: (_d = node.grant_reason) != null ? _d : null,
    /* PERMANENT, or a lease with an expiry — a trial or a subscription. */
    state: (_e = node.active_state) != null ? _e : null,
    /* The query asks for artwork — the sizes are in its variables — but the
       capture this was built from came back without any. Whichever of these
       the store does fill in is used; with none, the row simply has no art. */
    image: (_k = (_j = (_h = (_f = app.cover_square_image) == null ? void 0 : _f.uri) != null ? _h : (_g = app.icon_image) == null ? void 0 : _g.uri) != null ? _j : (_i = app.cover_landscape_image) == null ? void 0 : _i.uri) != null ? _k : null,
    /* The rest of what the library sent — the launcher icon and its two layers,
       the landscape art, the square cover. Small: the sizes the query asks for
       are the ones a headset draws its own library with. */
    media: nodeMedia(app),
    lastUsed: node.last_used || null,
    latest: binary ? {
      version: (_l = binary.version) != null ? _l : null,
      versionCode: (_m = binary.version_code) != null ? _m : null,
      id: (_n = binary.id) != null ? _n : null,
      releasedAt: null
    } : null
  };
}
function entitlementConnection(json) {
  var _a2, _b2;
  const root = (_a2 = json == null ? void 0 : json.data) == null ? void 0 : _a2.entitlements;
  if (!root || typeof root !== "object") return null;
  return (_b2 = Object.values(root).find((v) => v && Array.isArray(v.edges))) != null ? _b2 : null;
}
async function myEntitlements(kind = "quest") {
  var _a2, _b2, _c;
  const clientDocId = ENTITLEMENTS_DOC_IDS[kind];
  if (!clientDocId) throw new Error(`no entitlements query for "${kind}"`);
  const platform = kind === "pc" ? "PC" : "ANDROID_6DOF";
  const out = /* @__PURE__ */ new Map();
  let cursor = null;
  for (let page = 0; page < ENTITLEMENT_PAGES; page++) {
    const json = await storeQuery(clientDocId, {
      ...ENTITLEMENTS_VARIABLES,
      cursorID: cursor
    }, { client: true });
    refuse(json, "Your entitlements");
    const list = entitlementConnection(json);
    if (!list) {
      throw new Error(
        "the store returned no entitlements list \u2014 this one needs an access token belonging to a logged-in account, set on the Settings page"
      );
    }
    for (const edge of (_a2 = list.edges) != null ? _a2 : []) {
      const app = entitlementApp(edge == null ? void 0 : edge.node, platform, kind !== "expired");
      if (app && !out.has(app.id)) out.set(app.id, app);
    }
    if (!((_b2 = list.page_info) == null ? void 0 : _b2.has_next_page)) break;
    cursor = (_c = list.page_info.end_cursor) != null ? _c : null;
    if (!cursor) break;
  }
  return [...out.values()];
}
function accountError(json, what) {
  var _a2, _b2, _c;
  if ((_a2 = json.errors) == null ? void 0 : _a2.length) {
    const msg = (_b2 = json.errors[0].message) != null ? _b2 : "query refused";
    return new Error(
      /logged out|unauthorized/i.test(msg) ? `${msg} ${what} needs your own access token, set on the Settings page.` : msg
    );
  }
  if (json.error) return new Error((_c = json.error.message) != null ? _c : "request rejected");
  return null;
}
function refuse(json, what) {
  const err2 = accountError(json, what);
  if (err2) throw err2;
}
async function storeQuery(id, variables, { client = false } = {}) {
  const { token } = loadSettings();
  return getJSON(
    `${ENDPOINT}?` + new URLSearchParams({
      access_token: token,
      [client ? "client_doc_id" : "doc_id"]: id,
      variables: JSON.stringify(variables)
    })
  );
}
async function accountQuery(clientDocId, variables, what) {
  var _a2;
  const json = await storeQuery(clientDocId, variables, { client: true });
  refuse(json, what);
  return (_a2 = json.data) != null ? _a2 : {};
}
var RELEASE_CHANNELS_DOC_ID = "18030355666629348722465830248";
async function myReleaseChannels(appId) {
  var _a2, _b2, _c;
  if (loadSettings().token === DEFAULT_TOKEN) return null;
  const data = await accountQuery(
    RELEASE_CHANNELS_DOC_ID,
    { app_id: String(appId) },
    "Your release channel"
  );
  const app = data.fetch__Application;
  if (!app) return null;
  return {
    current: ((_a2 = app.viewer_release_channel) == null ? void 0 : _a2.id) ? String(app.viewer_release_channel.id) : null,
    channels: ((_c = (_b2 = app.release_channels) == null ? void 0 : _b2.edges) != null ? _c : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
      var _a3, _b3, _c2, _d, _e;
      return {
        id: String(n.id),
        name: (_a3 = n.channel_name) != null ? _a3 : String(n.id),
        live: Boolean(n.is_live),
        public: Boolean(n.is_public),
        version: (_c2 = (_b3 = n.latest_supported_binary) == null ? void 0 : _b3.version) != null ? _c2 : null,
        versionCode: (_e = (_d = n.latest_supported_binary) == null ? void 0 : _d.version_code) != null ? _e : null
      };
    })
  };
}
var PLAYTIME_DOC_ID = "73337722012186324592102292727";
async function headsetPlaytime(serial) {
  var _a2;
  const data = await accountQuery(
    PLAYTIME_DOC_ID,
    { input: { device_serial: serial } },
    "Playtime"
  );
  return ((_a2 = data.xoc_user_installed_app_time_spent) != null ? _a2 : []).filter((r) => {
    var _a3;
    return (_a3 = r == null ? void 0 : r.platform_app) == null ? void 0 : _a3.id;
  }).map((r) => {
    var _a3;
    return {
      appId: String(r.platform_app.id),
      packageName: (_a3 = r.platform_app.package_name) != null ? _a3 : null,
      seconds: Number(r.immersive_time_spent_sec_28d) || 0
    };
  });
}
var CLOUD_BACKUPS_DOC_ID = "212972260414518954213137032242";
async function cloudBackups(serials) {
  var _a2, _b2;
  const data = await accountQuery(
    CLOUD_BACKUPS_DOC_ID,
    { input: { device_serials: serials, application_ids: [] } },
    "Cloud backups"
  );
  return ((_b2 = (_a2 = data.xoc_oculus_cloud_backups) == null ? void 0 : _a2.edges) != null ? _b2 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a3, _b3, _c, _d, _e;
    return {
      id: String(n.id),
      appId: ((_a3 = n.application) == null ? void 0 : _a3.id) ? String(n.application.id) : null,
      packageName: (_c = (_b3 = n.application) == null ? void 0 : _b3.package_name) != null ? _c : null,
      serial: (_d = n.device_serial) != null ? _d : null,
      size: Number(n.file_size) || 0,
      /* Seconds since the epoch. */
      backedUpAt: Number(n.backup_time) || null,
      /* FULL, or KEY_VALUE for the small settings-style backup. */
      type: (_e = n.backup_type) != null ? _e : null
    };
  });
}
var SAVED_WORLDS_DOC_ID = "27679804063342994800600718755";
async function savedWorlds() {
  var _a2, _b2;
  const data = await accountQuery(
    SAVED_WORLDS_DOC_ID,
    { coverSquareImageSize: 225 },
    "Saved worlds"
  );
  const saved = (_a2 = data.me) == null ? void 0 : _a2.horizon_saved_worlds;
  const worlds = ((_b2 = saved == null ? void 0 : saved.edges) != null ? _b2 : []).map((e) => {
    var _a3;
    return (_a3 = e == null ? void 0 : e.node) == null ? void 0 : _a3.horizon_world;
  }).filter((w) => w == null ? void 0 : w.id).map((w) => {
    var _a3, _b3, _c, _d, _e;
    return {
      id: String(w.id),
      name: w.name || String(w.id),
      image: (_d = (_c = (_a3 = w.square_image) == null ? void 0 : _a3.image_uri) != null ? _c : (_b3 = w.image) == null ? void 0 : _b3.image_uri) != null ? _d : null,
      /* The world's place in the VR shell, which the details query is keyed by. */
      destinationId: ((_e = w.oc_destination) == null ? void 0 : _e.id) ? String(w.oc_destination.id) : null
    };
  });
  return { count: Number(saved == null ? void 0 : saved.count) || worlds.length, worlds };
}
var WORLD_DESTINATION_DOC_ID = "20471214089623756944511508210";
var WORLD_DOC_ID = "55217164010924076863732658967";
async function lookupWorld(id) {
  var _a2, _b2, _c, _d, _e;
  const data = await accountQuery(WORLD_DOC_ID, { id: String(id), coverSquareImageSize: 225 }, "World lookup");
  const w = data.fetch__XFBHorizonWorld;
  if (!(w == null ? void 0 : w.id)) throw new Error("no Horizon world has that ID");
  return {
    id: String(w.id),
    name: w.name || String(w.id),
    image: (_d = (_c = (_a2 = w.square_image) == null ? void 0 : _a2.image_uri) != null ? _c : (_b2 = w.image) == null ? void 0 : _b2.image_uri) != null ? _d : null,
    destinationId: ((_e = w.oc_destination) == null ? void 0 : _e.id) ? String(w.oc_destination.id) : null
  };
}
function parseWorldId(input) {
  var _a2;
  const text = String(input).trim();
  if (/^\d{5,}$/.test(text)) return text;
  const m = (_a2 = text.match(/world\/(?:[^/?#]*\/)?(\d{5,})/i)) != null ? _a2 : text.match(/(\d{8,})/);
  return m ? m[1] : null;
}
function worldImages(w) {
  var _a2, _b2, _c, _d, _e;
  return [
    ["Cover", (_a2 = w == null ? void 0 : w.image) == null ? void 0 : _a2.image_uri],
    ["Square", (_b2 = w == null ? void 0 : w.square_image) == null ? void 0 : _b2.image_uri],
    ["Travel preview", (_c = w == null ? void 0 : w.travel_preview_img) == null ? void 0 : _c.image_uri],
    ["Portal", (_d = w == null ? void 0 : w.portal_img) == null ? void 0 : _d.image_uri],
    ["Portal fallback", (_e = w == null ? void 0 : w.portal_fallback_img) == null ? void 0 : _e.image_uri]
  ].filter(([, uri]) => uri).map(([label, uri]) => ({ label, uri }));
}
async function worldDestination(destinationId) {
  var _a2, _b2, _c, _d;
  const data = await accountQuery(
    WORLD_DESTINATION_DOC_ID,
    { id: destinationId, coverSquareImageSize: 225 },
    "World details"
  );
  const d = data.fetch__ApplicationPresenceStatusDefinition;
  if (!d) throw new Error("the store has no details for this world");
  return {
    world: (_a2 = d.horizon_world) != null ? _a2 : null,
    details: {
      destinationId: (_b2 = d.destination_id) != null ? _b2 : destinationId,
      /* Seconds since the epoch, when the account has been there at all. */
      lastVisit: Number(d.last_visit_time) || null,
      launchLink: (_c = d.launch_deeplink) != null ? _c : null,
      apps: ((_d = d.vr_apps_for_deeplink_target) != null ? _d : []).map((a) => a == null ? void 0 : a.package_name).filter(Boolean),
      images: worldImages(d.horizon_world)
    }
  };
}
async function worldDetails(world) {
  if (world.destinationId) return (await worldDestination(world.destinationId)).details;
  const data = await accountQuery(WORLD_DOC_ID, { id: world.id, coverSquareImageSize: 225 }, "World details");
  return {
    destinationId: null,
    lastVisit: null,
    launchLink: null,
    apps: [],
    images: worldImages(data.fetch__XFBHorizonWorld)
  };
}
var WORLD_CONTENT_DOC_ID = "21452207710938225055198250166";
var WORLD_STREAMING_DOC_ID = "1322008781734439435276996443";
var WORLD_DOOR_DOC_ID = "30578118995168669";
var WORLD_XSCREEN_DOC_ID = "25515318978074838";
var WORLD_DOORS_DOC_ID = "24918885697713173";
var WORLD_PORTAL_INFO_DOC_ID = "24888047720798282";
var HORIZON_APP_ID = "2057013231240274";
var bool = (v) => typeof v === "boolean" ? v : null;
async function worldFlags(id) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
  const [content, streaming, door, xscreen, portal, info] = await Promise.allSettled([
    accountQuery(WORLD_CONTENT_DOC_ID, { world_id: String(id) }, "World details"),
    accountQuery(WORLD_STREAMING_DOC_ID, { worldId: String(id) }, "World details"),
    relayQuery(WORLD_DOOR_DOC_ID, { world_id: String(id) }, "World details"),
    relayQuery(
      WORLD_XSCREEN_DOC_ID,
      { application_id: HORIZON_APP_ID, world_id: String(id), large_image_size: 512 },
      "World details"
    ),
    relayQuery(WORLD_DOORS_DOC_ID, { ids: [String(id)] }, "World details"),
    relayQuery(WORLD_PORTAL_INFO_DOC_ID, { id: String(id) }, "World details")
  ]);
  const i = (_a2 = info.value) == null ? void 0 : _a2.world;
  const p = (_d = (_c = (_b2 = portal.value) == null ? void 0 : _b2.multifetch__XFBHorizonWorld) == null ? void 0 : _c[0]) == null ? void 0 : _d.node;
  const capacity = Number(p == null ? void 0 : p.capacity);
  const d = (_e = door.value) == null ? void 0 : _e.fetch__XFBHorizonWorld;
  const x = (_f = xscreen.value) == null ? void 0 : _f.fetch__XFBHorizonWorld;
  const players = Number(x == null ? void 0 : x.population_for_best_instance);
  return {
    beta: bool((_h = (_g = content.value) == null ? void 0 : _g.xoc_horizon_worlds_content) == null ? void 0 : _h.is_beta),
    streamable: bool((_j = (_i = streaming.value) == null ? void 0 : _i.fetch__XFBHorizonWorld) == null ? void 0 : _j.is_mhe_native_experience_enabled),
    creator: (_l = (_k = d == null ? void 0 : d.owner_together_app_user) == null ? void 0 : _k.owner_name) != null ? _l : null,
    creatorImage: (_n = (_m = d == null ? void 0 : d.owner_together_app_user) == null ? void 0 : _m.image_source_uri) != null ? _n : null,
    comfort: (_o = d == null ? void 0 : d.comfort_level) != null ? _o : null,
    description: (_q = (_p = d == null ? void 0 : d.localized_description) != null ? _p : x == null ? void 0 : x.localized_description) != null ? _q : null,
    xscreen: bool((_r = d == null ? void 0 : d.is_world_xscreen_visitable) != null ? _r : x == null ? void 0 : x.is_world_xscreen_visitable),
    mixedReality: bool((_s = d == null ? void 0 : d.is_world_mr_visitable) != null ? _s : x == null ? void 0 : x.is_world_mr_visitable),
    playersNow: Number.isFinite(players) && (x == null ? void 0 : x.population_for_best_instance) != null ? players : null,
    screenshot: (_w = (_v = (_t = x == null ? void 0 : x.large_primary_screenshot) == null ? void 0 : _t.image_uri) != null ? _v : (_u = i == null ? void 0 : i.primary_screenshot) == null ? void 0 : _u.image_large_uri) != null ? _w : null,
    capacity: Number.isFinite(capacity) && capacity > 0 ? capacity : null,
    maturity: (_x = p == null ? void 0 : p.maturity_rating) != null ? _x : null,
    membersOnly: bool(p == null ? void 0 : p.is_members_only),
    privacy: (_y = p == null ? void 0 : p.published_privacy) != null ? _y : null,
    searchable: bool(p == null ? void 0 : p.searchable_when_public),
    youth: (_z = i == null ? void 0 : i.youth_content_gating_status) != null ? _z : null,
    runtime: (_A = i == null ? void 0 : i.runtime_env) != null ? _A : null
  };
}
async function relayQuery(docId, variables, what) {
  const json = await storeQuery(docId, variables);
  if (!json.data) {
    const err2 = accountError(json, what);
    throw err2 != null ? err2 : new Error(`the store returned nothing for ${what}`);
  }
  return json.data;
}
var HZW_FLAGS = { __relay_internal__pv__showSocialContextInHzwFeedsrelayprovider: false };
function worldTile(edge) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i;
  const t = (_a2 = edge == null ? void 0 : edge.node) == null ? void 0 : _a2.target_object;
  if (!/World/.test((_b2 = t == null ? void 0 : t.__typename) != null ? _b2 : "")) return null;
  const dest = t.vr_destination;
  const id = (_d = (_c = dest == null ? void 0 : dest.horizon_world) == null ? void 0 : _c.id) != null ? _d : t.id;
  if (!id) return null;
  return {
    id: String(id),
    name: t.name || String(id),
    image: (_f = (_e = edge.node.image) == null ? void 0 : _e.uri) != null ? _f : null,
    destinationId: (dest == null ? void 0 : dest.id) ? String(dest.id) : null,
    visits: Number((_g = dest == null ? void 0 : dest.horizon_world) == null ? void 0 : _g.lifetime_visit_count) || null,
    online: (_h = dest == null ? void 0 : dest.concurrent_user_count) != null ? _h : null,
    likes: (_i = dest == null ? void 0 : dest.reactor_count) != null ? _i : null
  };
}
function worldPage(conn) {
  var _a2, _b2;
  return {
    worlds: ((_a2 = conn == null ? void 0 : conn.edges) != null ? _a2 : []).map(worldTile).filter(Boolean),
    cursor: ((_b2 = conn == null ? void 0 : conn.page_info) == null ? void 0 : _b2.has_next_page) ? conn.page_info.end_cursor : null
  };
}
var WORLD_SHELF_DOC_ID = "26668802406145854";
var WORLD_SHELVES = [
  ["HORIZON_TWILIGHT_CURATED_TOP_WORLDS", "Top worlds"],
  ["HORIZON_TWILIGHT_TRENDING_WORLDS", "Trending"],
  ["HORIZON_TWILIGHT_TRENDING_NEW_WORLDS", "New and trending"],
  ["HORIZON_TWILIGHT_HIGH_CONCURRENCY_WORLDS", "Most played now"],
  ["HORIZON_TWILIGHT_TOP_MOBILE_WORLDS", "Top on mobile"],
  ["HORIZON_TWILIGHT_HIDDEN_GEMS_MOBILE_WORLDS", "Hidden gems"],
  ["HORIZON_TWILIGHT_ACTION_WORLDS", "Action"],
  ["HORIZON_TWILIGHT_ADVENTURE_WORLDS", "Adventure"],
  ["HORIZON_TWILIGHT_BATTLE_ROYALE_WORLDS", "Battle royale"],
  ["HORIZON_TWILIGHT_CARD_GAMES_WORLDS", "Card games"],
  ["HORIZON_TWILIGHT_CREATIVITY_WORLDS", "Creativity"],
  ["HORIZON_TWILIGHT_EXPLORATION_WORLDS", "Exploration"],
  ["HORIZON_TWILIGHT_HANGOUT_WORLDS", "Hangout"],
  ["HORIZON_TWILIGHT_PARTY_WORLDS", "Party"],
  ["HORIZON_TWILIGHT_PUZZLE_WORLDS", "Puzzle"],
  ["HORIZON_TWILIGHT_RACING_WORLDS", "Racing"],
  ["HORIZON_TWILIGHT_SIMULATION_WORLDS", "Simulation"],
  ["HORIZON_TWILIGHT_SPORTS_WORLDS", "Sports"],
  ["HORIZON_TWILIGHT_STORY_WORLDS", "Story"]
];
async function worldShelf(feedSource, cursor = null) {
  var _a2, _b2;
  const data = await relayQuery(
    WORLD_SHELF_DOC_ID,
    { count: 30, cursor, feedSource, ...HZW_FLAGS },
    "Top worlds"
  );
  return worldPage((_b2 = (_a2 = data.viewer) == null ? void 0 : _a2.pipelines) == null ? void 0 : _b2.popular);
}
var PEOPLE_SEARCH_DOC_ID = "26529290379993220";
async function searchPeople(text) {
  var _a2, _b2, _c;
  const data = await relayQuery(
    PEOPLE_SEARCH_DOC_ID,
    {
      count: 10,
      cursor: null,
      query_string: String(text),
      __relay_internal__pv__IsInternUserIndicatorEnabledrelayprovider: false
    },
    "People search"
  );
  return ((_c = (_b2 = (_a2 = data.user_search) == null ? void 0 : _a2.results) == null ? void 0 : _b2.edges) != null ? _c : []).map((e) => {
    var _a3;
    return (_a3 = e == null ? void 0 : e.node) == null ? void 0 : _a3.user;
  }).filter((u) => u == null ? void 0 : u.id).map((u) => {
    var _a3, _b3;
    return { id: String(u.id), alias: (_a3 = u.alias) != null ? _a3 : null, name: (_b3 = u.display_name) != null ? _b3 : null };
  });
}
var PUBLISHED_WORLDS_DOC_ID = "26869339619355285";
async function publishedWorlds(userId, cursor = null) {
  var _a2, _b2;
  const data = await relayQuery(
    PUBLISHED_WORLDS_DOC_ID,
    { count: 30, cursor, userID: String(userId), ...HZW_FLAGS },
    "Published worlds"
  );
  return worldPage((_b2 = (_a2 = data.user) == null ? void 0 : _a2.world_data) == null ? void 0 : _b2.published_worlds_list);
}
var REVIEWS_SUMMARY_DOC_ID = "29127926413476795";
var REVIEWS_LIST_DOC_ID = "27358267370522650";
var REVIEW_SORTS = [
  ["top", "Most relevant"],
  ["most_recent", "Most recent"]
];
async function appReviewSummary(appId) {
  var _a2, _b2, _c;
  const data = await relayQuery(
    REVIEWS_SUMMARY_DOC_ID,
    { itemID: String(appId), ratingScores: null, sortOrder: null },
    "App reviews"
  );
  const it = data.item;
  if (!it) throw new Error("the store has no page for this app");
  const histogram = ((_a2 = it.quality_rating_histogram_aggregate_all) != null ? _a2 : []).map((h) => ({ star: Number(h == null ? void 0 : h.star_rating), count: Number(h == null ? void 0 : h.count) || 0 })).filter((h) => h.star >= 1 && h.star <= 5).sort((a, b) => b.star - a.star);
  const ratingCount = Number(it.quality_rating_count);
  return {
    score: typeof it.quality_rating_score === "number" ? it.quality_rating_score : null,
    scoreText: (_b2 = it.quality_rating_i18n_score_string) != null ? _b2 : null,
    ratingCount: Number.isFinite(ratingCount) ? ratingCount : null,
    ratingCountText: (_c = it.quality_rating_i18n_count_string) != null ? _c : null,
    reviewCount: Number(it.quality_review_count) || 0,
    histogram,
    canReview: Boolean(it.can_viewer_review)
  };
}
async function appReviews(appId, { count = 15, cursor = null, sort = "top" } = {}) {
  var _a2, _b2, _c;
  const data = await relayQuery(
    REVIEWS_LIST_DOC_ID,
    { count, cursor, id: String(appId), itemID: String(appId), rating_scores: null, sort_order: sort },
    "App reviews"
  );
  const conn = (_a2 = data.node) == null ? void 0 : _a2.user_reviews2;
  const reviews = ((_b2 = conn == null ? void 0 : conn.edges) != null ? _b2 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a3, _b3, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
    const dr = n.developer_response;
    return {
      id: String(n.id),
      title: (_b3 = (_a3 = n.translated_review_title) != null ? _a3 : n.review_title) != null ? _b3 : null,
      body: (_d = (_c2 = n.translated_review_description) != null ? _c2 : n.review_description) != null ? _d : null,
      score: Number(n.score) || null,
      helpful: Number(n.review_helpful_count) || 0,
      /* Seconds since the epoch. */
      date: Number(n.date) || null,
      earlyAccess: Boolean(n.is_early_access_review),
      author: {
        name: (_h = (_g = (_e = n.author) == null ? void 0 : _e.display_name) != null ? _g : (_f = n.author) == null ? void 0 : _f.alias) != null ? _h : "Anonymous",
        alias: (_j = (_i = n.author) == null ? void 0 : _i.alias) != null ? _j : null,
        image: (_m = (_l = (_k = n.author) == null ? void 0 : _k.profile_photo) == null ? void 0 : _l.uri) != null ? _m : null
      },
      /* Rare, and its body comes back under one of a couple of names. */
      devResponse: dr ? (_p = (_o = (_n = n.translated_developer_response_body) != null ? _n : dr.body) != null ? _o : dr.review_description) != null ? _p : null : null
    };
  });
  return {
    reviews,
    cursor: ((_c = conn == null ? void 0 : conn.page_info) == null ? void 0 : _c.has_next_page) ? conn.page_info.end_cursor : null
  };
}
var RELEASE_NOTES_DOC_ID = "9533163156782107";
async function releaseNotes(appId) {
  var _a2, _b2, _c, _d, _e, _f;
  const data = await relayQuery(RELEASE_NOTES_DOC_ID, { id: String(appId) }, "Release notes");
  const edges = (_c = (_b2 = (_a2 = data.node) == null ? void 0 : _a2.supportedBinaries) == null ? void 0 : _b2.edges) != null ? _c : [];
  const map = /* @__PURE__ */ new Map();
  for (const e of edges) {
    const n = e == null ? void 0 : e.node;
    if (!(n == null ? void 0 : n.versionCode)) continue;
    const notes = ((_d = n.changeLog) != null ? _d : "").trim() || ((_e = n.richChangeLog) != null ? _e : "").trim();
    if (notes) map.set(String(n.versionCode), { version: (_f = n.version) != null ? _f : null, notes });
  }
  return map;
}
var VIEWER_DOC_ID = "9593089467434564";
var _viewerId = null;
async function viewerId() {
  var _a2, _b2;
  if (_viewerId) return _viewerId;
  const data = await relayQuery(VIEWER_DOC_ID, {}, "Account");
  const id = (_b2 = (_a2 = data.viewer) == null ? void 0 : _a2.user) == null ? void 0 : _b2.id;
  if (!id) throw new Error("the store would not say who this token belongs to");
  _viewerId = String(id);
  return _viewerId;
}
var ADDONS_DOC_ID = "10041200072603920";
var ADDONS_PAGE = 24;
async function appAddons(appId, { count = ADDONS_PAGE, cursor = null, loaded = 0 } = {}) {
  var _a2, _b2, _c, _d, _e;
  const data = await relayQuery(
    ADDONS_DOC_ID,
    { id: String(appId), first: count, forward: true, after: cursor, before: null, last: null },
    "Add-ons"
  );
  const conn = (_b2 = (_a2 = data.node) == null ? void 0 : _a2.latest_supported_binary) == null ? void 0 : _b2.firstIapItems;
  const edges = (_c = conn == null ? void 0 : conn.edges) != null ? _c : [];
  const items = edges.map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a3, _b3, _c2, _d2, _e2, _f, _g, _h, _i, _j;
    return {
      id: String(n.id),
      name: (_a3 = n.display_name) != null ? _a3 : String(n.id),
      description: (_b3 = n.display_short_description) != null ? _b3 : null,
      owned: Boolean(n.is_viewer_entitled),
      price: (_e2 = (_d2 = (_c2 = n.current_offer) == null ? void 0 : _c2.price) == null ? void 0 : _d2.formatted) != null ? _e2 : null,
      strikethrough: (_h = (_g = (_f = n.current_offer) == null ? void 0 : _f.strikethrough_price) == null ? void 0 : _g.formatted) != null ? _h : null,
      offerType: (_j = (_i = n.current_offer) == null ? void 0 : _i.offer_type) != null ? _j : null
    };
  });
  const total = Number(conn == null ? void 0 : conn.count) || 0;
  const nextLoaded = loaded + items.length;
  return {
    items,
    total,
    /* No has_next_page on this connection — more remains while we're short of
       the reported total and the store still handed back a page. */
    cursor: items.length && nextLoaded < total ? (_e = (_d = conn == null ? void 0 : conn.page_info) == null ? void 0 : _d.end_cursor) != null ? _e : null : null
  };
}
var ACHIEVEMENTS_DOC_ID = "9661547673890799";
async function appAchievements(appId) {
  var _a2, _b2, _c;
  const uid = await viewerId();
  const data = await relayQuery(ACHIEVEMENTS_DOC_ID, { appId: String(appId), userId: uid }, "Achievements");
  const ps = (_a2 = data.node) == null ? void 0 : _a2.platform_services;
  if (!ps) throw new Error("the store has no achievements for this app");
  const achievements = ((_c = (_b2 = ps.achievement_definitions) == null ? void 0 : _b2.edges) != null ? _c : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a3, _b3, _c2, _d, _e, _f, _g, _h, _i;
    const unlocked = Boolean((_a3 = n.progress_for_user) == null ? void 0 : _a3.is_unlocked);
    return {
      id: String(n.id),
      title: (_b3 = n.title) != null ? _b3 : null,
      description: unlocked && n.unlocked_description_override || n.description || null,
      type: (_c2 = n.achievement_type) != null ? _c2 : null,
      target: Number(n.target) || 0,
      secret: Boolean(n.is_secret),
      unlocked,
      countProgress: Number((_d = n.progress_for_user) == null ? void 0 : _d.count_progress) || 0,
      image: (_i = (_h = unlocked ? (_e = n.unlocked_image) == null ? void 0 : _e.uri : (_f = n.locked_image) == null ? void 0 : _f.uri) != null ? _h : (_g = n.locked_image) == null ? void 0 : _g.uri) != null ? _i : null
    };
  });
  return {
    achievements,
    earned: achievements.filter((a) => a.unlocked).length,
    total: achievements.length,
    secretRemaining: Number(ps.unearned_secret_achievement_count) || 0
  };
}
var PURCHASES_DOC_ID = "28070162192637804";
var PURCHASES_PAGE_DOC_ID = "27988212250838578";
function parsePurchases(conn, accountId) {
  var _a2, _b2;
  const orders = ((_a2 = conn == null ? void 0 : conn.edges) != null ? _a2 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
    const a = (_a3 = n.app_store_item) != null ? _a3 : {};
    const pm = n.payment_method;
    const payment = pm ? `${(_c = (_b3 = pm.card_type) != null ? _b3 : pm.display_name) != null ? _c : "Card"}${pm.last4 ? ` \u2022\u2022${pm.last4}` : ""}` : n.is_platform_currency ? "Meta credit" : (_d = n.funding_source) != null ? _d : null;
    return {
      id: String(n.id),
      name: (_g = (_e = a.display_name) != null ? _e : a.display_unit_title) != null ? _g : String((_f = a.id) != null ? _f : n.id),
      image: (_q = (_p = (_m = (_j = (_h = a.icon_image) == null ? void 0 : _h.uri) != null ? _j : (_i = a.cover_square_image) == null ? void 0 : _i.uri) != null ? _m : (_l = (_k = a.parent_application) == null ? void 0 : _k.icon_image) == null ? void 0 : _l.uri) != null ? _p : (_o = (_n = a.parent_application) == null ? void 0 : _n.cover_square_image) == null ? void 0 : _o.uri) != null ? _q : null,
      amount: (_t = (_s = (_r = n.purchase) == null ? void 0 : _r.total) == null ? void 0 : _s.formatted) != null ? _t : null,
      /* Seconds since the epoch. */
      date: Number((_u = n.purchase) == null ? void 0 : _u.purchase_time) || Number((_v = n.purchase) == null ? void 0 : _v.creation_time) || null,
      status: (_w = n.order_status) != null ? _w : null,
      refundStatus: (_x = n.refund_status) != null ? _x : null,
      refundable: Boolean((_y = n.item_entitlement) == null ? void 0 : _y.is_refundable),
      payment,
      /* Empty for a whole app; set for DLC / in-app purchases. */
      iapType: (_z = a.iap_type) != null ? _z : null,
      /* The app this order is for, so a row can open it. A DLC/IAP order's
         own item ID isn't an app, so prefer the parent application when there
         is one; a whole-app order has no parent and uses its own ID. */
      appId: ((_A = a.parent_application) == null ? void 0 : _A.id) ? String(a.parent_application.id) : a.id ? String(a.id) : null
    };
  });
  return {
    accountId: accountId ? String(accountId) : null,
    orders,
    cursor: ((_b2 = conn == null ? void 0 : conn.page_info) == null ? void 0 : _b2.has_next_page) ? conn.page_info.end_cursor : null
  };
}
async function purchaseHistory() {
  var _a2;
  const data = await relayQuery(PURCHASES_DOC_ID, {}, "Purchases");
  const user = (_a2 = data.viewer) == null ? void 0 : _a2.user;
  const acct = user == null ? void 0 : user.payment_account;
  if (!acct) throw new Error("the store returned no purchase history for this account");
  return parsePurchases(acct.digital_orders, user.id);
}
var PURCHASES_PAGE = 20;
async function morePurchases(accountId, cursor) {
  var _a2, _b2;
  const data = await relayQuery(
    PURCHASES_PAGE_DOC_ID,
    { count: PURCHASES_PAGE, cursor, encode: "PNG", id: String(accountId) },
    "Purchases"
  );
  return parsePurchases((_b2 = (_a2 = data.node) == null ? void 0 : _a2.payment_account) == null ? void 0 : _b2.digital_orders, accountId);
}
var HORIZON_PLUS_DOC_ID = "98891515114376018422795109374";
async function horizonPlus() {
  var _a2, _b2, _c;
  const data = await accountQuery(HORIZON_PLUS_DOC_ID, {}, "Horizon+");
  const item = (_c = (_b2 = (_a2 = data.viewer) == null ? void 0 : _a2.user) == null ? void 0 : _b2.platform_subscription_details) == null ? void 0 : _c.item;
  if (!item) throw new Error("the store returned no Horizon+ catalog for this account");
  const row = (n, plus) => {
    var _a3, _b3, _c2, _d, _e;
    return {
      id: String(n.id),
      name: n.display_name || n.package_name || String(n.id),
      packageName: (_a3 = n.package_name) != null ? _a3 : null,
      platform: "ANDROID_6DOF",
      image: (_e = (_d = (_b3 = n.cover_square_image) == null ? void 0 : _b3.uri) != null ? _d : (_c2 = n.vr_icon_image) == null ? void 0 : _c2.uri) != null ? _e : null,
      price: null,
      offerId: null,
      free: false,
      channels: [],
      plus,
      /* The account holds an entitlement for it — claimed, or bought outright. */
      claimed: Boolean(n.entitlement)
    };
  };
  const nodes = (conn) => {
    var _a3;
    return ((_a3 = conn == null ? void 0 : conn.edges) != null ? _a3 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id);
  };
  const out = /* @__PURE__ */ new Map();
  for (const n of nodes(item.platform_subscription_items)) out.set(String(n.id), row(n, "monthly"));
  for (const n of nodes(item.platform_subscription_catalog_items)) {
    if (!out.has(String(n.id))) out.set(String(n.id), row(n, "catalog"));
  }
  return [...out.values()];
}
var PRESENCE_DOC_ID = "30449252678782676021745973837";
var ROSTER_DOC_ID = "9609976019080474";
async function recentPresence() {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const [data, roster] = await Promise.all([
    accountQuery(PRESENCE_DOC_ID, {}, "Last active"),
    relayQuery(ROSTER_DOC_ID, {}, "Last active").catch(() => null)
  ]);
  const p = (_b2 = (_a2 = data.viewer) == null ? void 0 : _a2.user) == null ? void 0 : _b2.most_recent_presence;
  if (!p) return null;
  const r = (_c = roster == null ? void 0 : roster.viewer) == null ? void 0 : _c.user;
  const party = Number((_d = r == null ? void 0 : r.lobby_roster) == null ? void 0 : _d.count);
  return {
    lobby: r ? Boolean((_e = r.most_recent_presence) == null ? void 0 : _e.lobby_session_id) : null,
    match: r ? Boolean((_f = r.most_recent_presence) == null ? void 0 : _f.match_session_id) : null,
    party: Number.isFinite(party) && party > 0 ? party : null,
    /* Seconds since the epoch. */
    lastActive: Number(p.vr_last_active_time) || null,
    current: Boolean(p.is_current),
    app: (_j = (_i = (_g = p.application) == null ? void 0 : _g.display_name) != null ? _i : (_h = p.application) == null ? void 0 : _h.name) != null ? _j : null,
    destination: (_k = p.destination_api_name) != null ? _k : null
  };
}
var AVATAR_STYLE_DOC_ID = "8293863540666138";
var AVATAR_GATING_DOC_ID = "28812331135048217";
var AVATAR_CONFIG_DOC_ID = "23879280514998626";
function avatarValue(raw) {
  const [head, kind, ...rest] = String(raw != null ? raw : "").split(":");
  const value = rest.join(":");
  if (kind === "float") return { kind: "slider", value: Number(value) };
  if (kind === "bool") return { kind: "switch", value: value === "true" };
  if (kind === "id") return { kind: "item", value, asset: head };
  return { kind: "other", value: String(raw != null ? raw : "") };
}
async function avatarInfo() {
  var _a2, _b2, _c, _d, _e, _f, _g;
  const [style, gating, config] = await Promise.allSettled([
    relayQuery(AVATAR_STYLE_DOC_ID, {}, "Avatar"),
    relayQuery(AVATAR_GATING_DOC_ID, { data: {} }, "Avatar"),
    relayQuery(AVATAR_CONFIG_DOC_ID, { data: {} }, "Avatar")
  ]);
  if (style.status === "rejected" && gating.status === "rejected" && config.status === "rejected") {
    throw style.reason;
  }
  const s = (_a2 = style.value) == null ? void 0 : _a2.avatar_vr_convergence_2;
  const gates = Object.entries((_c = (_b2 = gating.value) == null ? void 0 : _b2.avatar_horizon_gating_values) != null ? _c : {}).filter(
    ([, v]) => typeof v === "boolean"
  );
  const entries = (_f = (_e = (_d = config.value) == null ? void 0 : _d.dyn_editor_info) == null ? void 0 : _e.config_entries) != null ? _f : [];
  return {
    style: (_g = s == null ? void 0 : s.avatar_style_id) != null ? _g : null,
    hasAvatar: bool(s == null ? void 0 : s.has_existing_avatar),
    eligible: bool(s == null ? void 0 : s.is_style_2_eligible),
    migrate: bool(s == null ? void 0 : s.should_user_migrate),
    blockedForOs: bool(s == null ? void 0 : s.should_block_user_for_os_update),
    gates,
    settings: entries.filter((e) => e == null ? void 0 : e.entry_key).map((e) => ({ key: String(e.entry_key), ...avatarValue(e.serialized_entry_value) }))
  };
}
var OWNED_IAPS_DOC_ID = "28180342483188919025162781957";
function listOf(v) {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v == null ? void 0 : v.nodes)) return v.nodes;
  if (Array.isArray(v == null ? void 0 : v.edges)) return v.edges.map((e) => e == null ? void 0 : e.node);
  return [];
}
async function ownedIaps() {
  var _a2, _b2, _c, _d;
  const out = /* @__PURE__ */ new Map();
  let cursor = null;
  for (let page = 0; page < ENTITLEMENT_PAGES; page++) {
    const json = await storeQuery(OWNED_IAPS_DOC_ID, { ...ENTITLEMENTS_VARIABLES, cursorID: cursor }, { client: true });
    refuse(json, "DLC you own");
    const list = entitlementConnection(json);
    if (!list) throw new Error("the store returned no library to read DLC from");
    for (const edge of (_a2 = list.edges) != null ? _a2 : []) {
      const app = (_b2 = edge == null ? void 0 : edge.node) == null ? void 0 : _b2.item;
      if (!(app == null ? void 0 : app.id)) continue;
      const iaps = listOf(app.iap_entitlements).filter((e) => e == null ? void 0 : e.item).map((e) => {
        var _a3, _b3, _c2, _d2;
        return {
          id: String((_a3 = e.id) != null ? _a3 : e.item.id),
          name: e.item.display_name || e.item.sku || String(e.item.id),
          sku: (_b3 = e.item.sku) != null ? _b3 : null,
          /* DURABLE, CONSUMABLE, SUBSCRIPTION … */
          type: (_c2 = e.item.iap_type) != null ? _c2 : null,
          /* Seconds since the epoch; an expiry of 0 means it never lapses. */
          grantedAt: Number(e.grant_time) || null,
          expiresAt: Number(e.expiration_time) || null,
          state: (_d2 = e.active_state) != null ? _d2 : null
        };
      });
      if (iaps.length) out.set(String(app.id), iaps);
    }
    if (!((_c = list.page_info) == null ? void 0 : _c.has_next_page)) break;
    cursor = (_d = list.page_info.end_cursor) != null ? _d : null;
    if (!cursor) break;
  }
  return out;
}
var CLAIM_DOC_ID = "24220194524234992";
async function claimOffer(offerId, hmdType = loadSettings().hmd) {
  var _a2, _b2;
  const json = await storeQuery(CLAIM_DOC_ID, {
    input: {
      offer_id: String(offerId),
      hmd_type: hmdType,
      include_entitlement: true,
      client_mutation_id: "1"
    }
  });
  refuse(json, "Claiming");
  return (_b2 = Object.values((_a2 = json.data) != null ? _a2 : {})[0]) != null ? _b2 : {};
}
var DEVICE_PTC_DOC_ID = "4595761627188741";
var PTC_ACTOR_ID = 49;
async function setDevicePTC(serial, enabled) {
  var _a2, _b2;
  const json = await storeQuery(DEVICE_PTC_DOC_ID, {
    setStatusData: {
      device_serial: String(serial),
      is_enabled: Boolean(enabled),
      actor_id: PTC_ACTOR_ID,
      client_mutation_id: PTC_ACTOR_ID
    }
  });
  refuse(json, "Changing a headset's test channel");
  return (_b2 = Object.values((_a2 = json.data) != null ? _a2 : {})[0]) != null ? _b2 : {};
}
var DEVICE_PTC_STATUS_DOC_ID = "7735473863144745";
async function devicePTCStatus(serial) {
  var _a2;
  const json = await storeQuery(DEVICE_PTC_STATUS_DOC_ID, { device_serial: String(serial) });
  refuse(json, "Test channel status");
  const s = (_a2 = json.data) == null ? void 0 : _a2.public_test_channel_status;
  if (!s) throw new Error("the store gave no test channel status");
  return { allowed: Boolean(s.is_allowed), enabled: Boolean(s.is_enabled) };
}
var CHANNEL_DOC_ID = "3973666182694273";
async function channelObbs(releaseChannelID) {
  var _a2, _b2, _c, _d, _e, _f;
  const json = await storeQuery(CHANNEL_DOC_ID, { releaseChannelID: String(releaseChannelID) });
  refuse(json, "The OBB lookup");
  const node = (_a2 = json.data) == null ? void 0 : _a2.node;
  if (!node) throw new Error("the store returned no such release channel");
  const pairs = /* @__PURE__ */ new Map();
  const take = (binary) => {
    var _a3;
    if ((binary == null ? void 0 : binary.id) && ((_a3 = binary.obb_binary) == null ? void 0 : _a3.id)) {
      pairs.set(String(binary.id), String(binary.obb_binary.id));
    }
  };
  for (const edge of (_d = (_c = (_b2 = node.application) == null ? void 0 : _b2.primary_binaries) == null ? void 0 : _c.edges) != null ? _d : []) take(edge == null ? void 0 : edge.node);
  for (const edge of (_f = (_e = node.binaries) == null ? void 0 : _e.edges) != null ? _f : []) take(edge == null ? void 0 : edge.node);
  take(node.latest_supported_binary);
  return pairs;
}
var ORG_APPS_DOC_ID = "27915674441422265";
async function orgApps(orgID) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const out = /* @__PURE__ */ new Map();
  let after = null;
  for (let page = 0; page < 40; page += 1) {
    const json = await storeQuery(ORG_APPS_DOC_ID, {
      after,
      display_name: null,
      exclude_hyperscapes: true,
      exclude_platforms: ["HORIZON_WORLD", "HORIZON_UNITY_WORLD"],
      first: 20,
      orderby: "DISPLAY_NAME",
      platform: null,
      id: String(orgID)
    });
    refuse(json, "An organization's apps");
    const conn = (_f = (_e = (_b2 = (_a2 = json.data) == null ? void 0 : _a2.node) == null ? void 0 : _b2.applications) != null ? _e : (_d = (_c = json.data) == null ? void 0 : _c.organization) == null ? void 0 : _d.applications) != null ? _f : {};
    for (const edge of (_g = conn.edges) != null ? _g : []) {
      const n = edge == null ? void 0 : edge.node;
      if (!(n == null ? void 0 : n.id) || out.has(String(n.id))) continue;
      out.set(String(n.id), {
        id: String(n.id),
        name: n.display_name || String(n.id),
        slug: null,
        category: null,
        platform: (_h = n.platform) != null ? _h : null,
        price: null,
        offerId: null,
        free: false,
        releasedAt: null,
        image: (_j = (_i = n.cover_landscape_image) == null ? void 0 : _i.uri) != null ? _j : null,
        media: nodeMedia(n)
      });
    }
    const pi = (_k = conn.page_info) != null ? _k : {};
    if (!pi.has_next_page || !pi.end_cursor) break;
    after = pi.end_cursor;
  }
  return [...out.values()];
}
var DEVICES_DOC_ID = "26205914622391442";
async function accountDevices() {
  var _a2, _b2, _c, _d, _e;
  const json = await storeQuery(DEVICES_DOC_ID, {});
  refuse(json, "Headsets");
  const root = (_b2 = (_a2 = json.data) == null ? void 0 : _a2.xoc_oc_user_from_frl) != null ? _b2 : {};
  const owned = (_d = (_c = root.owned_devices) == null ? void 0 : _c.nodes) != null ? _d : [];
  const shared = (_e = root.all_usable_devices) != null ? _e : [];
  const out = /* @__PURE__ */ new Map();
  const add = (n, ownership) => {
    var _a3, _b3, _c2, _d2, _e2;
    if (!(n == null ? void 0 : n.serial) || out.has(n.serial)) return;
    out.set(n.serial, {
      id: (_a3 = n.id) != null ? _a3 : null,
      serial: n.serial,
      model: (_b3 = n.hwm_mapped_device_type) != null ? _b3 : null,
      // e.g. "Meta Quest 3"
      deviceType: (_c2 = n.hwm_device_type) != null ? _c2 : null,
      // e.g. "OCULUS_EUREKA"
      wipeStatus: (_e2 = (_d2 = n.hwm_ent_persisted_config) == null ? void 0 : _d2.remote_wipe_status) != null ? _e2 : null,
      ownership
      // "owned" | "shared"
    });
  };
  owned.forEach((n) => add(n, "owned"));
  shared.forEach((n) => add(n, "shared"));
  return [...out.values()];
}
function downloadURL(binaryId) {
  const { acToken } = loadSettings();
  return route(
    `https://securecdn.oculus.com/binaries/download/?${new URLSearchParams({
      id: String(binaryId),
      access_token: acToken
    })}`
  );
}
async function riftMetadata(binaryId) {
  const json = await storeQuery(RIFT_META_DOC_ID, { binary_id: String(binaryId) });
  refuse(json, "A Rift download");
  let manifest_uri, segments_base_uri, platform;
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    if (n.manifest_uri) manifest_uri = n.manifest_uri;
    if (n.segments_base_uri) segments_base_uri = n.segments_base_uri;
    if (n.platform && platform == null) platform = n.platform;
    for (const k in n) walk(n[k]);
  })(json);
  return { manifestUri: manifest_uri, segmentsBaseUri: segments_base_uri, platform };
}
function withAcToken(url) {
  const { acToken } = loadSettings();
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}access_token=${encodeURIComponent(acToken)}`;
}
async function riftManifestBytes(manifestUri) {
  const res = await fetch(route(withAcToken(manifestUri)));
  if (res.status >= 400 && res.status < 500) {
    throw new Error("not entitled to download this build");
  }
  if (!res.ok) throw new Error(`the manifest returned ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}
async function riftSegmentBytes(segmentsBaseUri, sha256) {
  const res = await fetch(
    route(`${withAcToken(segmentsBaseUri)}&segment_sha256=${encodeURIComponent(sha256)}`)
  );
  if (!res.ok) throw new Error(`a segment returned ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}
var canDownload = () => Boolean(loadSettings().acToken);
function parseAppId(input) {
  const text = String(input).trim();
  if (/^\d{5,}$/.test(text)) return text;
  const m = text.match(/(\d{8,})/);
  return m ? m[1] : null;
}

// js/app.js
var DEVICE = { ANDROID_6DOF: "Quest", ANDROID_3DOF: "Go", ANDROID: "Go", PC: "Rift" };
var IN_APP = typeof window.MetaDBApp === "object" && window.MetaDBApp !== null;
var APP_CAPS = (() => {
  var _a2, _b2, _c;
  if (!IN_APP) return { features: [] };
  try {
    return JSON.parse((_c = (_b2 = (_a2 = window.MetaDBApp).capabilities) == null ? void 0 : _b2.call(_a2)) != null ? _c : '{"features":[]}');
  } catch {
    return { features: [] };
  }
})();
var appHas = (feature) => Array.isArray(APP_CAPS.features) && APP_CAPS.features.includes(feature);
if (IN_APP) document.documentElement.classList.add("in-app");
var keyOf = (app) => {
  var _a2;
  return (_a2 = app.id) != null ? _a2 : app.packageName;
};
var COLUMNS = [
  ["c-dev", "Device"],
  ["c-chan", "Channel"],
  ["c-price", "Price"],
  ["c-ver", "Version"],
  ["c-build", "Build"],
  ["c-date", "Date"],
  /* Only Your entitlements has these three — the library is the only thing
     that reports them — but they switch off the same way as the rest. */
  ["c-used", "Last played"],
  ["c-state", "State"],
  ["c-grant", "Source"],
  ["c-devb", "Dev build"]
];
var THEMES = [
  ["", "System"],
  ["light", "Light"],
  ["paper", "Paper"],
  ["dark", "Dark"],
  ["midnight", "Midnight Blue"],
  ["ember", "Ember"],
  ["forest", "Forest"],
  ["forest-deep", "Forest (deep)"],
  ["terminal", "Terminal"],
  ["contrast", "High contrast"]
];
var FONT_MIN = 11;
var FONT_MAX = 24;
var FONT_DEFAULT = 16;
var UPDATE_FIRST = 45e3;
var UPDATE_EVERY = 15 * 6e4;
var BUILD_SORTS = {
  newest: (a, b) => b.createdAt - a.createdAt,
  oldest: (a, b) => a.createdAt - b.createdAt,
  buildDown: (a, b) => Number(b.versionCode) - Number(a.versionCode),
  buildUp: (a, b) => Number(a.versionCode) - Number(b.versionCode),
  released: (a, b) => Number(Boolean(b.channels.length)) - Number(Boolean(a.channels.length)) || b.createdAt - a.createdAt
};
var BUILD_SORT_LABELS = [
  ["released", "Released first"],
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["buildDown", "Build high to low"],
  ["buildUp", "Build low to high"]
];
var dateOf = (app) => {
  var _a2, _b2, _c, _d, _e, _f;
  return (_f = (_e = (_d = (_b2 = (_a2 = results.get(keyOf(app))) == null ? void 0 : _a2.latest) == null ? void 0 : _b2.releasedAt) != null ? _d : (_c = primaryOf(app)) == null ? void 0 : _c.releasedAt) != null ? _e : app.releasedAt) != null ? _f : "";
};
function priceOf(app) {
  if (!app.price) return null;
  const n = Number(String(app.price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}
function nullsLast(read, dir, compare) {
  return (a, b) => {
    const x = read(a);
    const y = read(b);
    if (x == null && y == null) return a.name.localeCompare(b.name);
    if (x == null) return 1;
    if (y == null) return -1;
    return dir * compare(x, y) || a.name.localeCompare(b.name);
  };
}
var blankToNull = (read) => (app) => read(app) || null;
var alphabetical = (name, read) => ({
  [`${name}Az`]: nullsLast(read, 1, (x, y) => x.localeCompare(y)),
  [`${name}Za`]: nullsLast(read, -1, (x, y) => x.localeCompare(y))
});
var SORTS = {
  /* The order the store returned — its own relevance ranking. A comparator that
     never reorders keeps it, since Array.prototype.sort is stable. */
  relevance: () => 0,
  az: (a, b) => a.name.localeCompare(b.name),
  za: (a, b) => b.name.localeCompare(a.name),
  newest: nullsLast(blankToNull(dateOf), 1, (x, y) => y.localeCompare(x)),
  oldest: nullsLast(blankToNull(dateOf), -1, (x, y) => y.localeCompare(x)),
  priceUp: nullsLast(priceOf, 1, (x, y) => x - y),
  priceDown: nullsLast(priceOf, -1, (x, y) => x - y),
  /* Entitlements only: what the library reports and the store does not. Each
     sorts on the words the column shows, and ties fall back to the name. */
  used: nullsLast((app) => {
    var _a2;
    return (_a2 = app.lastUsed) != null ? _a2 : null;
  }, 1, (x, y) => y - x),
  unused: nullsLast((app) => {
    var _a2;
    return (_a2 = app.lastUsed) != null ? _a2 : null;
  }, -1, (x, y) => y - x),
  ...alphabetical("state", (app) => app.state ? words2(app.state) : null),
  ...alphabetical("source", (app) => app.owned ? grantLabel(app.grant) : null),
  ...alphabetical(
    "device",
    (app) => {
      var _a2;
      return app.platform ? (_a2 = DEVICE[app.platform]) != null ? _a2 : app.platform : null;
    }
  )
};
var sorted = (list, mode) => {
  var _a2;
  return [...list].sort((_a2 = SORTS[mode]) != null ? _a2 : SORTS.az);
};
var el = {
  rows: document.getElementById("rows"),
  empty: document.getElementById("empty"),
  count: document.getElementById("count"),
  q: document.getElementById("q"),
  hmd: document.getElementById("hmd"),
  sort: document.getElementById("sort"),
  searchGo: document.getElementById("searchGo"),
  checkAll: document.getElementById("checkAll"),
  binId: document.getElementById("binId"),
  binGo: document.getElementById("binGo"),
  binNote: document.getElementById("binNote"),
  binRow: document.getElementById("binRow"),
  binDownload: document.getElementById("binDownload"),
  tourAgain: document.getElementById("tourAgain"),
  limit: document.getElementById("limit"),
  limitbar: document.querySelector(".limitbar"),
  viewApps: document.getElementById("view-apps"),
  viewOrgs: document.getElementById("view-orgs"),
  viewDefault: document.getElementById("view-default"),
  viewDevices: document.getElementById("view-devices"),
  viewSettings: document.getElementById("view-settings"),
  viewGetapp: document.getElementById("view-getapp"),
  devicesLoad: document.getElementById("devicesLoad"),
  serialToggle: document.getElementById("serialToggle"),
  devicesQ: document.getElementById("devicesQ"),
  devicesSort: document.getElementById("devicesSort"),
  devicesRows: document.getElementById("devicesRows"),
  devicesCount: document.getElementById("devicesCount"),
  devicesEmpty: document.getElementById("devicesEmpty"),
  devicesPresence: document.getElementById("devicesPresence"),
  ptcOut: document.getElementById("ptcOut"),
  sharedSection: document.getElementById("sharedSection"),
  sharedRows: document.getElementById("sharedRows"),
  sharedCount: document.getElementById("sharedCount"),
  orgId: document.getElementById("orgId"),
  orgQ: document.getElementById("orgQ"),
  orgPlatform: document.getElementById("orgPlatform"),
  orgSort: document.getElementById("orgSort"),
  orgGo: document.getElementById("orgGo"),
  orgPick: document.getElementById("orgPick"),
  checkOrg: document.getElementById("checkOrg"),
  orgRows: document.getElementById("orgRows"),
  orgCount: document.getElementById("orgCount"),
  orgEmpty: document.getElementById("orgEmpty"),
  defaultHmd: document.getElementById("defaultHmd"),
  defaultTrigger: document.getElementById("defaultTrigger"),
  defaultGo: document.getElementById("defaultGo"),
  checkDefault: document.getElementById("checkDefault"),
  defaultQ: document.getElementById("defaultQ"),
  defaultSort: document.getElementById("defaultSort"),
  defaultRows: document.getElementById("defaultRows"),
  defaultCount: document.getElementById("defaultCount"),
  defaultEmpty: document.getElementById("defaultEmpty"),
  viewPlus: document.getElementById("view-plus"),
  plusGo: document.getElementById("plusGo"),
  checkPlus: document.getElementById("checkPlus"),
  plusQ: document.getElementById("plusQ"),
  plusPick: document.getElementById("plusPick"),
  plusSort: document.getElementById("plusSort"),
  plusRows: document.getElementById("plusRows"),
  plusCount: document.getElementById("plusCount"),
  plusEmpty: document.getElementById("plusEmpty"),
  viewHeadset: document.getElementById("view-adb"),
  viewCompanion: document.getElementById("view-companion"),
  adbUsb: document.getElementById("adbUsb"),
  adbAddr: document.getElementById("adbAddr"),
  adbPairAddr: document.getElementById("adbPairAddr"),
  adbPairCode: document.getElementById("adbPairCode"),
  adbPair: document.getElementById("adbPair"),
  adbTcpip: document.getElementById("adbTcpip"),
  adbWireless: document.getElementById("adbWireless"),
  adbDisconnect: document.getElementById("adbDisconnect"),
  adbState: document.getElementById("adbState"),
  adbCount: document.getElementById("adbCount"),
  adbQ: document.getElementById("adbQ"),
  adbSort: document.getElementById("adbSort"),
  adbRows: document.getElementById("adbRows"),
  adbEmpty: document.getElementById("adbEmpty"),
  dgQ: document.getElementById("dgQ"),
  dgRefresh: document.getElementById("dgRefresh"),
  dgSite: document.getElementById("dgSite"),
  dgSignIn: document.getElementById("dgSignIn"),
  dgSignInBtn: document.getElementById("dgSignInBtn"),
  dgBody: document.getElementById("dgBody"),
  dgCount: document.getElementById("dgCount"),
  dgApps: document.getElementById("dgApps"),
  dgShowAll: document.getElementById("dgShowAll"),
  dgMore: document.getElementById("dgMore"),
  dgMoreH: document.getElementById("dgMoreH"),
  dgSide: document.getElementById("dgSide"),
  dgAddRepo: document.getElementById("dgAddRepo"),
  dgDetail: document.getElementById("dgDetail"),
  dgSignOut: document.getElementById("dgSignOut"),
  dgAppUpdate: document.getElementById("dgAppUpdate"),
  dgTabs: document.querySelectorAll("[data-dg-tab]"),
  dgBackups: document.getElementById("dgBackups"),
  dgBackupsCount: document.getElementById("dgBackupsCount"),
  dgBackupApps: document.getElementById("dgBackupApps"),
  dgBackupDetail: document.getElementById("dgBackupDetail"),
  dgAddApk: document.getElementById("dgAddApk"),
  dgBackupsEmpty: document.getElementById("dgBackupsEmpty"),
  dgHistory: document.getElementById("dgHistory"),
  dgHistoryRows: document.getElementById("dgHistoryRows"),
  dgHistoryEmpty: document.getElementById("dgHistoryEmpty"),
  dgHistoryClear: document.getElementById("dgHistoryClear"),
  adbOut: document.getElementById("adbOut"),
  settingsForm: document.getElementById("settingsForm"),
  token: document.getElementById("token"),
  acToken: document.getElementById("acToken"),
  saveTokens: document.getElementById("saveTokens"),
  tokensOut: document.getElementById("tokensOut"),
  relay: document.getElementById("relay"),
  testBtn: document.getElementById("testBtn"),
  clearBtn: document.getElementById("clearBtn"),
  settingsOut: document.getElementById("settingsOut"),
  images: document.getElementById("images"),
  details: document.getElementById("details"),
  devDownloads: document.getElementById("devDownloads"),
  obb: document.getElementById("obb"),
  autoOwned: document.getElementById("autoOwned"),
  autoDlc: document.getElementById("autoDlc"),
  autoPlaytime: document.getElementById("autoPlaytime"),
  autoBackups: document.getElementById("autoBackups"),
  wide: document.getElementById("wide"),
  motion: document.getElementById("motion"),
  motionSpeed: document.getElementById("motionSpeed"),
  fontSize: document.getElementById("fontSize"),
  store: document.getElementById("store"),
  log: document.getElementById("log"),
  logField: document.getElementById("logField"),
  logBox: document.getElementById("logBox"),
  logClear: document.getElementById("logClear"),
  cols: document.getElementById("cols"),
  defHmd: document.getElementById("defHmd"),
  defSort: document.getElementById("defSort"),
  defMineSort: document.getElementById("defMineSort"),
  defBuildSort: document.getElementById("defBuildSort"),
  defTrigger: document.getElementById("defTrigger"),
  useLocal: document.getElementById("useLocal"),
  relayNote: document.getElementById("relayNote"),
  viewMine: document.getElementById("view-mine"),
  mineRows: document.getElementById("mineRows"),
  mineCount: document.getElementById("mineCount"),
  viewPurchases: document.getElementById("view-purchases"),
  viewAvatar: document.getElementById("view-avatar"),
  avatarLoad: document.getElementById("avatarLoad"),
  avatarQ: document.getElementById("avatarQ"),
  avatarFacts: document.getElementById("avatarFacts"),
  avatarCount: document.getElementById("avatarCount"),
  avatarRows: document.getElementById("avatarRows"),
  avatarEmpty: document.getElementById("avatarEmpty"),
  purchasesLoad: document.getElementById("purchasesLoad"),
  purchasesMore: document.getElementById("purchasesMore"),
  purchasesMoreBar: document.getElementById("purchasesMoreBar"),
  purchasesShowPay: document.getElementById("purchasesShowPay"),
  purchasesQ: document.getElementById("purchasesQ"),
  purchasesRows: document.getElementById("purchasesRows"),
  purchasesCount: document.getElementById("purchasesCount"),
  purchasesEmpty: document.getElementById("purchasesEmpty"),
  mineEmpty: document.getElementById("mineEmpty"),
  mineQ: document.getElementById("mineQ"),
  mineSort: document.getElementById("mineSort"),
  viewWorlds: document.getElementById("view-worlds"),
  worldQ: document.getElementById("worldQ"),
  worldLookup: document.getElementById("worldLookup"),
  worldLookupGo: document.getElementById("worldLookupGo"),
  worldLookupNote: document.getElementById("worldLookupNote"),
  worldSort: document.getElementById("worldSort"),
  worldLoad: document.getElementById("worldLoad"),
  worldMore: document.getElementById("worldMore"),
  worldMoreBar: document.getElementById("worldMoreBar"),
  worldTabs: document.getElementById("worldTabs"),
  worldShelf: document.getElementById("worldShelf"),
  worldShelfGo: document.getElementById("worldShelfGo"),
  creatorQ: document.getElementById("creatorQ"),
  creatorFind: document.getElementById("creatorFind"),
  creatorPick: document.getElementById("creatorPick"),
  creatorGo: document.getElementById("creatorGo"),
  creatorNote: document.getElementById("creatorNote"),
  worldCount: document.getElementById("worldCount"),
  worldRows: document.getElementById("worldRows"),
  worldEmpty: document.getElementById("worldEmpty"),
  theme: document.getElementById("theme"),
  dgTheme: document.getElementById("dgTheme"),
  navLinks: document.querySelectorAll(".nav a[data-view]"),
  navGroups: document.querySelectorAll(".navgroup"),
  libButtons: document.querySelectorAll("#view-mine [data-lib]")
};
var results = /* @__PURE__ */ new Map();
var listings = /* @__PURE__ */ new Map();
var media = /* @__PURE__ */ new Map();
var obbs = /* @__PURE__ */ new Map();
var reviewCache = /* @__PURE__ */ new Map();
var addonsCache = /* @__PURE__ */ new Map();
var achCache = /* @__PURE__ */ new Map();
var relNotesCache = /* @__PURE__ */ new Map();
var obbChecked = /* @__PURE__ */ new Set();
var obbNote = "";
var open = /* @__PURE__ */ new Set();
var mineList = [];
var mineNote = "";
var mineAsked = false;
var mineLoading = false;
var deviceList = [];
var devicesLoading = false;
var devicesAsked = false;
var devicesNote = "";
var devicesPromise = null;
var purchasesState = { orders: [], accountId: null, cursor: null, asked: false, loading: false, note: "" };
var avatarState = { data: null, asked: false, loading: false, note: "" };
var avatarOpen = /* @__PURE__ */ new Set();
var showPayment = false;
var showSerials = false;
var ptcStatus = /* @__PURE__ */ new Map();
var defaultList = [];
var defaultLoading = false;
var defaultAsked = false;
var defaultNote = "";
var plusState = { rows: [], asked: false, loading: false, note: "" };
var presenceState = { data: null, note: "" };
var adb = null;
var adbInstalled = [];
var adbApps = [];
var adbSide = [];
var headsetAsked = false;
var APP_APK = new URL("downloads/MetaDB.apk", document.baseURI).href;
var APP_INFO = new URL("downloads/MetaDB.json", document.baseURI).href;
var appInfoAsked = false;
var appUpdate = null;
var appUpdateNoticed = false;
var STORE_ART_KEY = "metadb.storeArt";
var storeArt = (() => {
  var _a2;
  try {
    return new Map(Object.entries((_a2 = JSON.parse(localStorage.getItem(STORE_ART_KEY))) != null ? _a2 : {}));
  } catch {
    return /* @__PURE__ */ new Map();
  }
})();
var storeArtAsking = false;
var restoringRoute = false;
var PANEL_TABS = ["store", "builds", "reviews", "addons", "achievements", "mine"];
var VIEWS = [
  "apps",
  "search",
  "mine",
  "purchases",
  "avatar",
  "devices",
  "worlds",
  "orgs",
  "default",
  "plus",
  "adb",
  "companion",
  "settings",
  "getapp",
  "downgrade"
];
var routeSearch = "";
var routeView = () => {
  var _a2;
  const v = (_a2 = routeParts()[0]) != null ? _a2 : "";
  return v === "search" ? "apps" : v;
};
(() => {
  const [view, query] = location.hash.replace(/^#/, "").split("?");
  if (!VIEWS.includes(view)) return;
  const p = new URLSearchParams(query != null ? query : "");
  const path = pathFor({
    view,
    q: p.get("q"),
    app: p.get("app"),
    tab: p.get("tab"),
    world: p.get("world"),
    org: p.get("org")
  });
  history.replaceState(history.state, "", path + location.search);
})();
var storeArtTried = /* @__PURE__ */ new Set();
var dgState = { tab: "apps", loaded: false, loading: false, note: "", selected: null, builds: /* @__PURE__ */ new Map(), backups: [], backupSel: null, more: [], releases: /* @__PURE__ */ new Map() };
var adbBusy = false;
var ownedKeys = /* @__PURE__ */ new Set();
var mineKind = "quest";
var myChannels = /* @__PURE__ */ new Map();
var playState = { rows: [], asked: false, loading: false, note: "", promise: null };
var backupState = { rows: [], asked: false, loading: false, note: "", promise: null };
var iapState = { rows: [], byApp: /* @__PURE__ */ new Map(), asked: false, loading: false, note: "", promise: null };
var ROW_SPAN = { mine: 12 };
var layoutState = {
  names: null,
  panelTabs: /* @__PURE__ */ new Map(),
  /* App IDs whose release channels the Entitlement tab has asked for, and why
     the store refused, when it did. */
  channelAsked: /* @__PURE__ */ new Set(),
  channelErrors: /* @__PURE__ */ new Map()
};
var buildInfo = /* @__PURE__ */ new Map();
var worldOpen = /* @__PURE__ */ new Set();
var worldInfo = /* @__PURE__ */ new Map();
var worldLookups = [];
var worldFlagInfo = /* @__PURE__ */ new Map();
var worldState = { rows: [], count: 0, asked: false, loading: false, note: "" };
var shelfState = { rows: [], cursor: null, label: "", fetchPage: null, asked: false, loading: false, note: "" };
var creatorState = { rows: [], cursor: null, label: "", fetchPage: null, asked: false, loading: false, note: "" };
var worldTab = "top";
var libraryNames = null;
var stagedApp = null;
var stagedScope = null;
var listing = [];
var listingNote = "";
var searching = false;
var tour = null;
initTheme();
initFontSize();
initMotion();
initStage();
initNav();
initSearchBar();
initViews();
initSettings();
initOrgs();
initDevices();
initPurchases();
initAvatar();
initAccountTabs();
initDefault();
initPlus();
initHeadset();
initDowngrade();
initGetApp();
initDirectDownload();
initTour();
initColumns();
fillHmdPicker();
initDefaults();
initUpdates();
function loadedBuild() {
  var _a2, _b2;
  const link = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
  return (_b2 = (_a2 = link == null ? void 0 : link.getAttribute("href").match(/[?&]v=(\d+)/)) == null ? void 0 : _a2[1]) != null ? _b2 : null;
}
async function publishedBuild() {
  var _a2, _b2;
  const res = await fetch(document.baseURI, { cache: "no-store" });
  if (!res.ok) return null;
  return (_b2 = (_a2 = (await res.text()).match(/style\.css\?v=(\d+)/)) == null ? void 0 : _a2[1]) != null ? _b2 : null;
}
function safeToReload() {
  var _a2;
  if (appInstalls.size) return false;
  if (document.hidden) return true;
  if (stagedApp) return false;
  const tag = (_a2 = document.activeElement) == null ? void 0 : _a2.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return false;
  return true;
}
var lastUpdateCheck = 0;
async function checkForUpdate() {
  const now = Date.now();
  if (now - lastUpdateCheck < 6e4) return;
  lastUpdateCheck = now;
  if (IN_APP) checkAppUpdate();
  const mine = loadedBuild();
  if (!mine) return;
  let live = null;
  try {
    live = await publishedBuild();
  } catch {
    return;
  }
  if (!live || live === mine) return;
  let already = null;
  try {
    already = sessionStorage.getItem("metadb.reloadedFor");
  } catch {
  }
  if (already !== live && safeToReload()) {
    try {
      sessionStorage.setItem("metadb.reloadedFor", live);
    } catch {
    }
    location.reload();
    return;
  }
  showUpdateNotice();
}
var updateAsked = false;
function showUpdateNotice() {
  if (document.documentElement.classList.contains("layout-dg")) {
    if (updateAsked || appInstalls.size || !document.getElementById("uiDialog").hidden) return;
    updateAsked = true;
    uiConfirm({
      title: "MetaDB has been updated",
      text: "Reload to use the new version. Your sign-in, settings and backups stay as they are.",
      yes: "Reload",
      no: "Later"
    }).then((go2) => go2 && location.reload());
    return;
  }
  if (document.getElementById("updateNote")) return;
  const note2 = document.createElement("p");
  note2.id = "updateNote";
  note2.className = "notice notice--update";
  note2.innerHTML = 'A newer version of this page has been published. <button type="button" class="linkbtn">Reload to get it</button>';
  note2.querySelector("button").addEventListener("click", () => location.reload());
  document.querySelector(".wrap").prepend(note2);
}
function initUpdates() {
  setTimeout(checkForUpdate, UPDATE_FIRST);
  setInterval(checkForUpdate, UPDATE_EVERY);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkForUpdate();
  });
}
function systemTheme() {
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const reports = dark || window.matchMedia("(prefers-color-scheme: light)").matches;
  return dark || !reports ? "dark" : "light";
}
function applyFontSize(px) {
  const size = Math.round(
    Math.min(FONT_MAX, Math.max(FONT_MIN, Number(px) || FONT_DEFAULT)) * 100
  ) / 100;
  document.documentElement.style.setProperty("--font", `${size}px`);
  return size;
}
function initFontSize() {
  const size = applyFontSize(loadSettings().fontSize);
  el.fontSize.value = size;
  el.fontSize.addEventListener("input", () => {
    const typed = Number(el.fontSize.value);
    if (!el.fontSize.value.trim() || Number.isNaN(typed)) return;
    if (typed < FONT_MIN || typed > FONT_MAX) return;
    saveSettings({ fontSize: String(applyFontSize(typed)) });
  });
  el.fontSize.addEventListener("change", () => {
    const applied = applyFontSize(el.fontSize.value);
    el.fontSize.value = applied;
    saveSettings({ fontSize: String(applied) });
  });
}
function initTheme() {
  var _a2;
  const pickers = [el.theme, el.dgTheme].filter(Boolean);
  for (const p of pickers) fillOptions(p, THEMES);
  let saved = "";
  try {
    saved = (_a2 = localStorage.getItem("theme")) != null ? _a2 : "";
  } catch {
  }
  el.theme.value = THEMES.some(([value]) => value === saved) ? saved : "";
  for (const p of pickers) p.value = el.theme.value;
  applyTheme();
  for (const picker of pickers) {
    picker.addEventListener("change", () => {
      for (const p of pickers) p.value = picker.value;
      try {
        if (picker.value) localStorage.setItem("theme", picker.value);
        else localStorage.removeItem("theme");
      } catch {
      }
      applyTheme();
    });
  }
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!el.theme.value) applyTheme();
  });
}
function applyTheme() {
  document.documentElement.dataset.theme = el.theme.value || systemTheme();
}
function animates() {
  return loadSettings().motion && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function speed() {
  return Number(loadSettings().motionSpeed) || 180;
}
function initMotion() {
  applySpeed();
  el.motionSpeed.value = loadSettings().motionSpeed;
  el.motionSpeed.addEventListener("change", () => {
    saveSettings({ motionSpeed: el.motionSpeed.value });
    applySpeed();
  });
}
function applySpeed() {
  document.documentElement.style.setProperty("--speed", `${speed()}ms`);
}
function play(node, className, { keep = false } = {}) {
  if (!node || !animates()) return;
  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
  if (!keep) {
    node.addEventListener(
      "animationend",
      () => node.classList.remove(className),
      { once: true }
    );
  }
}
var isStaged = (app) => Boolean(stagedApp) && keyOf(stagedApp) === keyOf(app);
var stageEl = () => document.querySelector(".stage");
function openStage(app, scope = null) {
  closeStage({ animate: false });
  stagedApp = app;
  stagedScope = scope;
  document.documentElement.classList.add("staged");
  const stage = document.createElement("div");
  stage.className = "stage";
  stage.append(appPanel(app, { staged: true, scope }));
  document.body.append(stage);
  play(stage, "stage-in");
}
function closeStage({ animate = true } = {}) {
  if (!stagedApp) return;
  closeGallery({ animate });
  stagedApp = null;
  stagedScope = null;
  const stage = stageEl();
  const done = () => {
    stage == null ? void 0 : stage.remove();
    document.documentElement.classList.remove("staged");
  };
  if (!stage || !animate || !animates()) return done();
  play(stage, "stage-out", { keep: true });
  setTimeout(done, speed());
}
function refreshStage() {
  const stage = stageEl();
  if (!stagedApp || !stage) return;
  const at = stage.scrollTop;
  const inner = saveScrolls(stage);
  stage.replaceChildren(appPanel(stagedApp, { staged: true, scope: stagedScope }));
  restoreScrolls(stage, inner);
  stage.scrollTop = at;
}
var galleryEl = () => document.querySelector(".gallery");
function shotFigure(shot) {
  const cap = shot.natural ? ` style="width:auto"` : shot.width ? ` style="max-width:${shot.width}px"` : "";
  return `<figure class="shot">
    ${shot.kind === "video" ? `<video controls preload="none" playsinline${cap}
             src="${esc(shot.uri)}"
             ${shot.poster ? `poster="${esc(shot.poster)}"` : ""}></video>` : `<a href="${esc(shot.uri)}" target="_blank" rel="noopener">
             <img src="${esc(shot.uri)}" alt="${esc(shot.label)}"
                  loading="lazy"${cap}>
           </a>`}
    <figcaption>${esc(shot.label)}</figcaption>
  </figure>`;
}
function watchShots(node) {
  node.addEventListener(
    "error",
    (e) => {
      var _a2, _b2;
      const img = (_b2 = (_a2 = e.target).closest) == null ? void 0 : _b2.call(_a2, ".shot img");
      if (!img) return;
      const gone = document.createElement("div");
      gone.className = "shot-gone";
      gone.textContent = "didn\u2019t load";
      img.replaceWith(gone);
    },
    true
  );
}
function openGallery(app, shots, heading = `${app.name} \u2014 images`) {
  closeGallery({ animate: false });
  const gallery = document.createElement("div");
  gallery.className = "gallery";
  gallery.innerHTML = `
    <button type="button" class="stage-btn" data-close>Close</button>
    <h3 class="stage-title">${esc(heading)}</h3>
    <div class="shots">${shots.map(shotFigure).join("")}</div>`;
  gallery.querySelector("[data-close]").addEventListener("click", () => closeGallery());
  watchShots(gallery);
  document.documentElement.classList.add("staged");
  document.body.append(gallery);
  play(gallery, "stage-in");
}
function closeGallery({ animate = true } = {}) {
  const gallery = galleryEl();
  if (!gallery) return;
  const done = () => {
    gallery.remove();
    if (!stagedApp) document.documentElement.classList.remove("staged");
  };
  if (!animate || !animates()) return done();
  play(gallery, "stage-out", { keep: true });
  setTimeout(done, speed());
}
async function showImages(app, button, out) {
  var _a2;
  const show = (page, tiles2) => {
    const shots = mergeMedia(page, app.media, tiles2);
    if (shots.length) openGallery(app, shots);
    else out.innerHTML = `<p>The store has no artwork for this app.</p>`;
  };
  button.disabled = true;
  button.textContent = "Loading images\u2026";
  out.innerHTML = "";
  const tiles = await spatialIcons(app.packageName).catch(() => []);
  if (media.has(app.id)) {
    show(media.get(app.id), tiles);
  } else {
    try {
      const page = await appPage(app.id, el.hmd.value);
      media.set(app.id, page.media);
      show(page.media, tiles);
    } catch (err2) {
      out.innerHTML = `<p class="warn">No store page: ${esc(err2.message)}</p>`;
      if (((_a2 = app.media) == null ? void 0 : _a2.length) || tiles.length) show([], tiles);
    }
  }
  button.disabled = false;
  button.textContent = "Show more images";
}
function toggleStage(app, scope = null) {
  if (isStaged(app)) closeStage();
  else openStage(app, scope);
}
function initStage() {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll";
  document.body.append(probe);
  document.documentElement.style.setProperty(
    "--sbw",
    `${probe.offsetWidth - probe.clientWidth}px`
  );
  probe.remove();
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (galleryEl()) closeGallery();
    else closeStage();
  });
}
function initNav() {
  const close = (g) => {
    g.querySelector(".navmenu").hidden = true;
    g.querySelector(".navtop").setAttribute("aria-expanded", "false");
  };
  const closeAll = () => {
    for (const g of el.navGroups) close(g);
  };
  for (const g of el.navGroups) {
    const top = g.querySelector(".navtop");
    const menu = g.querySelector(".navmenu");
    top.addEventListener("click", () => {
      const open2 = menu.hidden;
      closeAll();
      if (open2) {
        menu.hidden = false;
        top.setAttribute("aria-expanded", "true");
      }
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeAll();
    });
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navgroup")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}
function initViews() {
  window.addEventListener("popstate", () => {
    applyView();
    restoreRoute();
  });
  document.addEventListener("click", (e) => {
    var _a2;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || a.target || a.hasAttribute("download")) return;
    const href = a.getAttribute("href");
    const screen = (_a2 = href.match(/^[#/]([a-z]+)$/)) == null ? void 0 : _a2[1];
    if (screen && VIEWS.includes(screen)) {
      e.preventDefault();
      go(`/${screen}`);
    } else if (href.length > 1 && href.startsWith("#")) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView();
      }
    }
  });
  applyView();
}
function go(path) {
  if (path !== location.pathname) history.pushState(null, "", path);
  applyView();
}
function routeParts() {
  const parts = location.pathname.split("/").filter(Boolean).map((p) => {
    try {
      return decodeURIComponent(p);
    } catch {
      return p;
    }
  });
  if (parts[0] === "index.html") parts.shift();
  return parts;
}
function routeState() {
  const [view = "", a = null, b = null] = routeParts();
  if (view === "search") return { view: "apps", q: a };
  if (view === "apps" || view === "") {
    return { view: "apps", app: /^\d{5,}$/.test(a != null ? a : "") ? a : null, tab: PANEL_TABS.includes(b) ? b : null };
  }
  if (view === "worlds") return { view, world: a };
  if (view === "orgs") return { view, org: a };
  return { view };
}
function pathFor(s) {
  var _a2;
  const e = encodeURIComponent;
  if (s.view === "apps") {
    if (/^\d{5,}$/.test((_a2 = s.app) != null ? _a2 : "")) {
      return `/apps/${e(s.app)}${PANEL_TABS.includes(s.tab) && s.tab !== "store" ? `/${e(s.tab)}` : ""}`;
    }
    return s.q ? `/search/${e(s.q)}` : "/apps";
  }
  if (s.view === "worlds" && s.world) return `/worlds/${e(s.world)}`;
  if (s.view === "orgs" && s.org) return `/orgs/${e(s.org)}`;
  return `/${s.view}`;
}
function setRoute(changes) {
  var _a2;
  if ("q" in changes) routeSearch = (_a2 = changes.q) != null ? _a2 : "";
  const s = { ...routeState(), ...changes };
  if (s.view === "apps" && !s.app && !s.q) s.q = routeSearch;
  const next = pathFor(s);
  if (next === "/apps" && !routeParts().length) return;
  if (next !== location.pathname) history.replaceState(history.state, "", next + location.search);
}
async function restoreRoute() {
  var _a2, _b2, _c, _d;
  const s = routeState();
  if (s.view === "apps") {
    const q = ((_a2 = s.q) != null ? _a2 : "").trim() || s.app;
    if (!q) return;
    if (s.q) routeSearch = s.q;
    if (el.q.value.trim() !== q || !listing.length) {
      restoringRoute = true;
      el.q.value = q;
      try {
        await runSearch();
      } finally {
        restoringRoute = false;
      }
    }
    const hit = s.app && listing.find((a) => String(a.id) === s.app);
    if (!hit) return;
    if (s.tab) layoutState.panelTabs.set(openKey("main", hit), s.tab);
    open.add(openKey("main", hit));
    renderAll();
    const row = el.rows.querySelector(`tr[data-id="${CSS.escape(String(keyOf(hit)))}"]`);
    if (row) {
      const bar = (_c = (_b2 = document.querySelector(".topbar")) == null ? void 0 : _b2.getBoundingClientRect().height) != null ? _c : 0;
      window.scrollTo({ top: row.getBoundingClientRect().top + scrollY - bar - 12 });
    }
  } else if (s.view === "worlds" && s.world) {
    el.worldLookup.value = s.world;
    lookUpWorld();
  } else if (s.view === "orgs" && /^\d+$/.test((_d = s.org) != null ? _d : "")) {
    el.orgId.value = s.org;
    runOrgApps();
  }
}
function applyView() {
  closeStage({ animate: false });
  const hash = routeView();
  if (IN_APP) {
    const dg = hash === "downgrade" || !hash && loadSettings().layout !== "site";
    document.documentElement.classList.toggle("layout-dg", dg);
    const want = dg ? "downgrade" : "site";
    if (loadSettings().layout !== want) saveSettings({ layout: want });
    if (dg) {
      setTimeout(openDowngrade, 0);
      return;
    }
  }
  const views = ["mine", "purchases", "avatar", "devices", "worlds", "orgs", "default", "plus", "adb", "companion", "settings", "getapp"];
  const view = views.includes(hash) && !(IN_APP && (hash === "adb" || hash === "companion")) ? hash : "apps";
  el.viewApps.hidden = view !== "apps";
  el.viewMine.hidden = view !== "mine";
  el.viewPurchases.hidden = view !== "purchases";
  el.viewAvatar.hidden = view !== "avatar";
  el.viewDevices.hidden = view !== "devices";
  el.viewWorlds.hidden = view !== "worlds";
  el.viewOrgs.hidden = view !== "orgs";
  el.viewDefault.hidden = view !== "default";
  el.viewPlus.hidden = view !== "plus";
  el.viewHeadset.hidden = view !== "adb";
  el.viewCompanion.hidden = view !== "companion";
  el.viewSettings.hidden = view !== "settings";
  el.viewGetapp.hidden = view !== "getapp";
  if (view === "getapp") showAppInfo();
  if (view === "companion") {
    import("./companion.js?v=247").then((m) => m.initCompanion(el.viewCompanion)).catch((e) => console.error("companion init failed", e));
  }
  el.limitbar.hidden = view !== "apps";
  for (const a of el.navLinks) a.classList.toggle("on", a.dataset.view === view);
  for (const g of el.navGroups) {
    g.querySelector(".navtop").classList.toggle("on", !!g.querySelector("a.on"));
  }
  window.scrollTo(0, 0);
  play(
    [el.viewApps, el.viewMine, el.viewPurchases, el.viewAvatar, el.viewDevices, el.viewWorlds, el.viewOrgs, el.viewDefault, el.viewPlus, el.viewHeadset, el.viewCompanion, el.viewSettings].find(
      (s) => !s.hidden
    ),
    "view-in"
  );
  if (view === "apps") maybeTour();
  else endTour();
}
var orgList = [];
var orgLoading = false;
var orgAsked = false;
var orgNote = "";
function orgVisible() {
  const p = el.orgPlatform.value;
  const q = el.orgQ.value.trim().toLowerCase();
  let list = orgList;
  if (p === "ANDROID") {
    list = list.filter((a) => a.platform === "ANDROID" || a.platform === "ANDROID_3DOF");
  } else if (p) {
    list = list.filter((a) => a.platform === p);
  }
  list = list.filter((a) => matches(a, q));
  return sorted(list, el.orgSort.value);
}
async function runOrgApps() {
  const id = el.orgId.value.trim();
  if (!/^\d+$/.test(id)) {
    orgList = [];
    orgAsked = true;
    orgNote = "Enter a numeric organization ID.";
    renderAll();
    return;
  }
  if (orgLoading) return;
  orgAsked = true;
  orgLoading = true;
  orgNote = "";
  el.orgGo.disabled = true;
  el.orgGo.textContent = "Loading\u2026";
  renderAll();
  try {
    orgList = await orgApps(id);
    setRoute({ org: id });
  } catch (err2) {
    orgList = [];
    orgNote = err2.message || "Could not load the organization's apps.";
  } finally {
    orgLoading = false;
    el.orgGo.disabled = false;
    el.orgGo.textContent = "List apps";
    renderAll();
  }
}
function initOrgs() {
  el.orgGo.addEventListener("click", runOrgApps);
  el.orgId.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runOrgApps();
    }
  });
  el.orgPick.addEventListener("change", () => {
    if (!el.orgPick.value) return;
    el.orgId.value = el.orgPick.value;
    el.orgPick.value = "";
    runOrgApps();
  });
  el.orgPlatform.addEventListener("change", renderAll);
  el.orgQ.addEventListener("input", renderAll);
  el.orgSort.addEventListener("change", renderAll);
  el.checkOrg.addEventListener(
    "click",
    () => checkList(orgList, el.checkOrg, "Check shown")
  );
}
function defaultVisible() {
  const q = el.defaultQ.value.trim().toLowerCase();
  return sorted(defaultList.filter((a) => matches(a, q)), el.defaultSort.value);
}
function initDefault() {
  for (const [value, label] of HMD_TYPES) {
    if (value === "RIFT") continue;
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = `${label} (${value})`;
    el.defaultHmd.append(opt);
  }
  if (loadSettings().hmd !== "RIFT") el.defaultHmd.value = loadSettings().hmd;
  for (const [value, label] of DEFAULT_APP_TRIGGERS) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    el.defaultTrigger.append(opt);
  }
  el.defaultTrigger.value = loadSettings().defaultTrigger;
  el.defaultGo.addEventListener("click", runDefaultApps);
  el.defaultQ.addEventListener("input", renderAll);
  el.defaultSort.addEventListener("change", renderAll);
  el.checkDefault.addEventListener(
    "click",
    () => checkList(defaultList, el.checkDefault, "Check shown")
  );
}
async function runDefaultApps() {
  if (defaultLoading) return;
  defaultAsked = true;
  defaultLoading = true;
  defaultNote = "";
  el.defaultGo.disabled = true;
  el.defaultGo.textContent = "Loading\u2026";
  renderAll();
  try {
    defaultList = await defaultApps(el.defaultHmd.value, el.defaultTrigger.value);
  } catch (err2) {
    defaultList = [];
    defaultNote = err2.message || "Could not load the default apps.";
  } finally {
    defaultLoading = false;
    el.defaultGo.disabled = false;
    el.defaultGo.textContent = "Get default apps";
    renderAll();
  }
}
function plusVisible() {
  const q = el.plusQ.value.trim().toLowerCase();
  const pick = el.plusPick.value;
  return sorted(
    plusState.rows.filter((a) => (!pick || a.plus === pick) && matches(a, q)),
    el.plusSort.value
  );
}
function initPlus() {
  el.plusGo.addEventListener("click", runHorizonPlus);
  el.plusQ.addEventListener("input", renderAll);
  el.plusPick.addEventListener("change", renderAll);
  el.plusSort.addEventListener("change", renderAll);
  el.checkPlus.addEventListener(
    "click",
    () => checkList(plusVisible(), el.checkPlus, "Check shown")
  );
}
async function runHorizonPlus() {
  if (plusState.loading) return;
  Object.assign(plusState, { asked: true, loading: true, note: "" });
  el.plusGo.disabled = true;
  el.plusGo.textContent = "Loading\u2026";
  renderAll();
  try {
    plusState.rows = await horizonPlus();
  } catch (err2) {
    plusState.rows = [];
    plusState.note = err2.message || "Could not load the Horizon+ games.";
  } finally {
    plusState.loading = false;
    el.plusGo.disabled = false;
    el.plusGo.textContent = "Get Horizon+ games";
    renderAll();
    syncRelayNote();
  }
}
var BRIDGE_URL = null;
function initHeadset() {
  el.adbUsb.addEventListener("click", () => connectHeadset("usb"));
  el.adbWireless.addEventListener("click", () => connectHeadset("wireless"));
  el.adbAddr.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      connectHeadset("wireless");
    }
  });
  el.adbDisconnect.addEventListener("click", disconnectHeadset);
  el.adbPair.addEventListener("click", pairHeadset);
  el.adbTcpip.addEventListener("click", switchHeadsetToWireless);
  el.adbPairCode.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pairHeadset();
    }
  });
  el.adbQ.addEventListener("input", renderAll);
  el.adbSort.addEventListener("change", renderAll);
  renderHeadset();
}
function adbSay(text, bad = false) {
  el.adbState.textContent = text;
  el.adbState.classList.toggle("bad", bad);
}
async function switchHeadsetToWireless() {
  if (!adb) {
    adbSay("Plug the headset in and press Find headsets first.", true);
    return;
  }
  el.adbTcpip.disabled = true;
  adbSay("Switching the headset to wireless\u2026");
  try {
    const { switchToWireless, connectWireless, deviceInfo } = await import("./adb.js?v=149");
    const address = await switchToWireless(adb);
    if (!address) {
      adbSay(
        "Switched to wireless, but its address could not be read \u2014 find it under Settings \u2192 Wi-Fi on the headset, then use Connect wirelessly."
      );
      el.adbTcpip.disabled = false;
      return;
    }
    el.adbAddr.value = address;
    adbSay(`Connecting to ${address}\u2026`);
    adb = await connectWireless(null, address);
    const info = await deviceInfo(adb);
    adbSay(
      `Connected to ${info.model} over wireless at ${address}. You can unplug the cable now.`
    );
    await loadHeadsetApps();
  } catch (err2) {
    adbSay(err2.message || "Could not switch to wireless.", true);
  }
  el.adbTcpip.disabled = false;
}
async function pairHeadset() {
  if (adbBusy) return;
  adbBusy = true;
  el.adbPair.disabled = true;
  try {
    const { pairDevice } = await import("./adb.js?v=149");
    const message = await pairDevice(
      el.adbPairAddr.value,
      el.adbPairCode.value,
      { onStage: adbSay }
    );
    adbSay(
      `${message} Now connect with the address under \u201CIP address & Port\u201D.`
    );
    el.adbPairCode.value = "";
    el.adbAddr.focus();
  } catch (err2) {
    adbSay(err2.message || "Could not pair.", true);
  } finally {
    adbBusy = false;
    el.adbPair.disabled = false;
  }
}
async function connectHeadset(how) {
  var _a2;
  if (adbBusy || adb) return;
  adbBusy = true;
  el.adbUsb.disabled = true;
  el.adbWireless.disabled = true;
  adbSay(how === "usb" ? "Waiting for a headset to be chosen\u2026" : "Reaching the bridge\u2026");
  try {
    const { connectUsb, connectWireless, deviceInfo } = await import("./adb.js?v=149");
    const onStage = (text) => adbSay(text);
    adb = how === "usb" ? await connectUsb({ onStage }) : await connectWireless(BRIDGE_URL, el.adbAddr.value, { onStage });
    const info = await deviceInfo(adb);
    adbSay(
      `Connected to ${info.model}${info.release ? ` \u2014 Android ${info.release}` : ""}.`
    );
    el.adbDisconnect.hidden = false;
    await loadHeadsetApps();
  } catch (err2) {
    adb = null;
    const message = /no headset chosen|No device selected/i.test((_a2 = err2.message) != null ? _a2 : "") ? "No headset chosen." : err2.message || "Could not connect.";
    adbSay(message, !/No headset chosen/.test(message));
  } finally {
    adbBusy = false;
    el.adbUsb.disabled = false;
    el.adbWireless.disabled = false;
    renderHeadset();
  }
}
async function disconnectHeadset() {
  try {
    await (adb == null ? void 0 : adb.close());
  } catch {
  }
  adb = null;
  adbInstalled = [];
  adbApps = [];
  el.adbDisconnect.hidden = true;
  el.adbOut.replaceChildren();
  adbSay("Not connected.");
  renderHeadset();
}
async function loadHeadsetApps() {
  if (!adb && !IN_APP) return;
  headsetAsked = true;
  el.adbCount.textContent = "Asking the headset what it has installed\u2026";
  try {
    if (IN_APP) {
      adbInstalled = JSON.parse(window.MetaDBApp.installedApps());
    } else {
      const { installedApps } = await import("./adb.js?v=149");
      adbInstalled = await installedApps(adb);
    }
    const missing = adbInstalled.filter((a) => !ownedByPackage().has(a.packageName) && !a.resolved).map((a) => a.packageName);
    if (missing.length) {
      el.adbCount.textContent = `Naming ${missing.length} packages\u2026`;
      try {
        const known = await lookupPackages(missing);
        for (const entry of adbInstalled) {
          const match = known.get(entry.packageName);
          if (match) entry.resolved = match;
        }
      } catch {
      }
    }
    if (IN_APP) {
      const known = new Map(adbInstalled.filter((a) => a.resolved).map((a) => [a.packageName, a.resolved]));
      await fillStoreArt([...known.keys()], known);
    }
  } catch (err2) {
    adbInstalled = [];
    adbSay(`Could not list the installed apps: ${err2.message}`, true);
  }
  resolveHeadsetApps();
  renderHeadset();
}
function ownedByPackage() {
  return new Map(
    mineList.filter((a) => a.packageName).map((a) => [a.packageName, a])
  );
}
function resolveHeadsetApps() {
  const owned = ownedByPackage();
  adbApps = adbInstalled.map((a) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i;
    const mine = owned.get(a.packageName);
    const match = a.resolved;
    const id = (_b2 = (_a2 = mine == null ? void 0 : mine.id) != null ? _a2 : match == null ? void 0 : match.id) != null ? _b2 : null;
    if (!id) return null;
    return {
      id,
      packageName: a.packageName,
      name: (mine == null ? void 0 : mine.name) || (match == null ? void 0 : match.name) || ((_c = storeArt.get(a.packageName)) == null ? void 0 : _c.name) || a.label || a.packageName,
      platform: (_e = (_d = mine == null ? void 0 : mine.platform) != null ? _d : match == null ? void 0 : match.platform) != null ? _e : null,
      image: (_h = (_g = mine == null ? void 0 : mine.image) != null ? _g : (_f = storeArt.get(a.packageName)) == null ? void 0 : _f.image) != null ? _h : null,
      channels: [],
      /* An entitlement already knows the build the account may install, so
         the Latest columns are filled before any check runs; a check then
         replaces it with the live answer. */
      latest: (_i = mine == null ? void 0 : mine.latest) != null ? _i : null,
      /* In the account's library — what the green edge means everywhere. */
      inLibrary: Boolean(mine),
      onHeadset: true,
      installedVersion: a.version,
      installedVersionCode: a.versionCode
    };
  }).filter(Boolean);
  const listed = new Set(adbApps.map((a) => a.packageName));
  adbSide = IN_APP ? adbInstalled.filter((a) => !listed.has(a.packageName)).map((a) => ({ ...a, name: a.label || a.packageName })).sort((a, b) => a.name.localeCompare(b.name)) : [];
}
function adbRow(app) {
  var _a2, _b2, _c, _d, _e, _f, _g;
  const key = openKey("adb", app);
  const latest = (_c = (_b2 = (_a2 = results.get(keyOf(app))) == null ? void 0 : _a2.latest) != null ? _b2 : app.latest) != null ? _c : null;
  const showArt = loadSettings().images;
  const tr = document.createElement("tr");
  tr.className = "app";
  tr.dataset.id = keyOf(app);
  tr.tabIndex = 0;
  tr.setAttribute("aria-expanded", String(open.has(key)));
  tr.innerHTML = `
    <td class="name">${showArt && app.image ? `<img class="art" src="${esc(app.image)}" alt="" loading="lazy">` : ""}${esc(app.name)}</td>
    <td class="num">${esc((_d = app.installedVersion) != null ? _d : "\u2014")}</td>
    <td class="num">${(_e = app.installedVersionCode) != null ? _e : "\u2014"}</td>
    <td class="num">${esc((_f = latest == null ? void 0 : latest.version) != null ? _f : "\u2014")}</td>
    <td class="num">${(_g = latest == null ? void 0 : latest.versionCode) != null ? _g : "\u2014"}</td>`;
  const toggle = (e) => {
    open.has(key) ? open.delete(key) : open.add(key);
    focusId = keyOf(app);
    focusScope = e.currentTarget.closest("tbody");
    renderAll();
  };
  tr.addEventListener("click", toggle);
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(e);
    }
  });
  return tr;
}
function adbBehind(app) {
  var _a2, _b2, _c;
  const latest = (_c = (_b2 = (_a2 = results.get(keyOf(app))) == null ? void 0 : _a2.latest) != null ? _b2 : app.latest) != null ? _c : null;
  return Boolean(
    app.installedVersionCode && (latest == null ? void 0 : latest.versionCode) && app.installedVersionCode < latest.versionCode
  );
}
function adbVisible() {
  const q = el.adbQ.value.trim().toLowerCase();
  const list = adbApps.filter(
    (a) => !q || a.name.toLowerCase().includes(q) || a.packageName.toLowerCase().includes(q)
  );
  const byName = (a, b) => a.name.localeCompare(b.name);
  switch (el.adbSort.value) {
    case "za":
      return [...list].sort((a, b) => -byName(a, b));
    case "behind":
      return [...list].sort(
        (a, b) => Number(adbBehind(b)) - Number(adbBehind(a)) || byName(a, b)
      );
    case "installed":
      return [...list].sort(
        (a, b) => {
          var _a2, _b2;
          return ((_a2 = b.installedVersionCode) != null ? _a2 : 0) - ((_b2 = a.installedVersionCode) != null ? _b2 : 0);
        }
      );
    default:
      return [...list].sort(byName);
  }
}
function buildAdbRows() {
  const shown = adbVisible();
  const out = [];
  for (const app of shown) {
    out.push(adbRow(app));
    if (open.has(openKey("adb", app))) out.push(detailRow(app, 5));
  }
  el.adbRows.replaceChildren(...out);
  el.adbEmpty.hidden = shown.length > 0;
  el.adbEmpty.textContent = !adb ? "Connect a headset to list what it has installed." : adbApps.length ? "Nothing matches." : adbInstalled.length ? "None of the installed apps are in the store \u2014 nothing here to put an older build on." : "Nothing installed that the headset will list.";
  const hidden = adbInstalled.length - adbApps.length;
  el.adbCount.textContent = adbApps.length ? `${shown.length === adbApps.length ? adbApps.length : `${shown.length} of ${adbApps.length}`} app${adbApps.length === 1 ? "" : "s"} from the store` + (hidden > 0 ? `, ${hidden} without one hidden` : "") + `. Open one to see every build, and install an older one.` : "";
}
function renderHeadset() {
  buildAdbRows();
}
function restoreBuildScroll(app, top) {
  var _a2;
  if (!top) return;
  const row = el.adbRows.querySelector(`tr.app[data-id="${keyOf(app)}"]`);
  const panels = [row == null ? void 0 : row.nextElementSibling, stageEl()].filter(Boolean);
  for (const panel of panels) {
    const scroller = (_a2 = panel.querySelector) == null ? void 0 : _a2.call(panel, ".versions-out .vscroll");
    if (scroller) scroller.scrollTop = top;
  }
}
async function installBuild(app, { installBuild: binaryId, version, code }, button) {
  var _a2, _b2, _c;
  if (IN_APP) {
    appInstall(app, binaryId, version, button);
    return;
  }
  if (!adb) {
    adbSay("Connect a headset first.", true);
    return;
  }
  if (!canDownload()) {
    adbSay("Downloads need your oc_ac_at account token, set on the Settings page.", true);
    return;
  }
  const older = app.installedVersionCode && Number(code) < app.installedVersionCode;
  if (older) {
    const sure = window.confirm(
      `Put ${app.name} back to ${version}?

${app.packageName} will be uninstalled first, which deletes its saved data on the headset. This cannot be undone.`
    );
    if (!sure) return;
  }
  const scrolledTo = (_c = (_b2 = (_a2 = button.closest(".versions-out")) == null ? void 0 : _a2.querySelector(".vscroll")) == null ? void 0 : _b2.scrollTop) != null ? _c : 0;
  const label = button.textContent;
  button.disabled = true;
  const say2 = (text) => {
    button.textContent = text;
    adbSay(`${app.name}: ${text}`);
  };
  try {
    say2("Downloading\u2026");
    const res = await fetch(downloadURL(binaryId));
    if (!res.ok) throw new Error(`the store returned ${res.status}`);
    const blob = await res.blob();
    const { installApk, uninstall, pushObb } = await import("./adb.js?v=149");
    if (older) {
      say2("Uninstalling\u2026");
      await uninstall(adb, app.packageName);
    }
    await installApk(adb, blob, { onProgress: say2 });
    const obb = obbs.get(String(binaryId));
    if (obb) {
      say2("Downloading the expansion file\u2026");
      const obbRes = await fetch(downloadURL(obb));
      if (!obbRes.ok) {
        throw new Error(
          `installed, but the expansion file returned ${obbRes.status}`
        );
      }
      await pushObb(adb, app.packageName, code, await obbRes.blob(), {
        onProgress: say2
      });
    }
    adbSay(
      `${app.name} is now on ${version}${obb ? ", expansion file and all" : ""}.`
    );
    await loadHeadsetApps();
    restoreBuildScroll(app, scrolledTo);
  } catch (err2) {
    adbSay(`${app.name}: ${err2.message}`, true);
    button.textContent = label;
    button.disabled = false;
    syncRelayNote();
    return;
  }
  button.textContent = label;
  button.disabled = false;
  syncRelayNote();
}
var appInstalls = /* @__PURE__ */ new Map();
function uiConfirm({ title, text, list = [], yes = "OK", no = "Cancel", danger = false }) {
  const box = document.getElementById("uiDialog");
  const yesBtn = document.getElementById("uiDialogYes");
  const noBtn = document.getElementById("uiDialogNo");
  const ul = document.getElementById("uiDialogList");
  document.getElementById("uiDialogTitle").textContent = title;
  document.getElementById("uiDialogText").textContent = text;
  ul.replaceChildren(...list.map((t) => Object.assign(document.createElement("li"), { textContent: t })));
  ul.hidden = !list.length;
  yesBtn.textContent = yes;
  noBtn.textContent = no;
  yesBtn.classList.toggle("ui-danger", danger);
  const before = document.activeElement;
  box.hidden = false;
  (danger ? noBtn : yesBtn).focus();
  return new Promise((resolve) => {
    const finish = (answer) => {
      var _a2;
      box.hidden = true;
      yesBtn.onclick = noBtn.onclick = null;
      box.onkeydown = box.onclick = null;
      (_a2 = before == null ? void 0 : before.focus) == null ? void 0 : _a2.call(before);
      resolve(answer);
    };
    yesBtn.onclick = () => finish(true);
    noBtn.onclick = () => finish(false);
    box.onclick = (e) => e.target === box && finish(false);
    box.onkeydown = (e) => e.key === "Escape" && finish(false);
  });
}
function uiNotice(text, kind = "ok") {
  const host = document.getElementById("uiNotices");
  if (!host) return;
  const n = document.createElement("div");
  n.className = `ui-notice ${kind === "ok" ? "" : kind}`.trim();
  n.setAttribute("role", kind === "bad" ? "alert" : "status");
  n.textContent = text;
  host.append(n);
  setTimeout(() => n.remove(), kind === "bad" ? 9e3 : 5e3);
}
try {
  const left = sessionStorage.getItem("metadb.notice");
  if (left) {
    sessionStorage.removeItem("metadb.notice");
    setTimeout(() => uiNotice(left), 300);
  }
} catch {
}
var HISTORY_KEY = "metadb.history";
var HISTORY_MAX = 300;
function readHistory() {
  var _a2;
  try {
    const list = JSON.parse((_a2 = localStorage.getItem(HISTORY_KEY)) != null ? _a2 : "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
function addHistory(entry) {
  try {
    const list = [{ at: Date.now(), ...entry }, ...readHistory()].slice(0, HISTORY_MAX);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
  }
}
function jobPressed(key) {
  const job = appInstalls.get(key);
  if (!job) return false;
  if (job.queued) window.MetaDBApp.dequeue(key);
  return true;
}
function appJob(key, { app = null, button = null, label = null, from = null } = {}) {
  var _a2;
  appInstalls.set(key, {
    app,
    from,
    buttons: button ? [button] : [],
    label: (_a2 = label != null ? label : button == null ? void 0 : button.textContent) != null ? _a2 : ""
  });
  if (button) {
    button.dataset.job = key;
    button.disabled = true;
    button.textContent = "Starting\u2026";
  }
}
async function appInstall(app, binaryId, version, button, { save = false } = {}) {
  var _a2, _b2;
  if (!canDownload()) {
    uiNotice("Sign in first: Settings \u2192 Sign in with Meta.", "bad");
    return;
  }
  const key = `${save ? "save" : "install"}:${binaryId}`;
  if (jobPressed(key)) return;
  appJob(key, {
    app,
    button,
    from: app.installedVersionCode != null ? { version: app.installedVersion, code: app.installedVersionCode } : null
  });
  let obb = (_a2 = obbs.get(String(binaryId))) != null ? _a2 : null;
  const code = button == null ? void 0 : button.dataset.code;
  if (!obb && code) {
    try {
      const info = await binaryDetails(app.id, code);
      if (info.obbId) {
        obb = info.obbId;
        obbs.set(String(binaryId), obb);
      }
    } catch {
    }
  }
  const job = JSON.stringify({
    id: key,
    apk: downloadURL(binaryId),
    obb: obb ? downloadURL(obb) : null,
    binaryId: String(binaryId),
    appId: String((_b2 = app.id) != null ? _b2 : ""),
    name: app.name,
    version
  });
  if (save) window.MetaDBApp.save(job);
  else window.MetaDBApp.install(job);
}
var JOB_WORDS = {
  uninstalled: "Uninstalled",
  imported: "Added APK",
  installed: "Installed",
  updated: "Updated",
  downgraded: "Downgraded",
  restored: "Restored",
  saved: "Saved",
  "backed-up": "Backed up"
};
window.metadbInstall = async (e) => {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  if (e.state === "ask") {
    const yes = await uiConfirm({ title: e.title, text: e.text, yes: e.yes, danger: true });
    window.MetaDBApp.answer(e.askId, yes);
    return;
  }
  const key = String(e.id);
  const job = appInstalls.get(key);
  const buttons = /* @__PURE__ */ new Set([...(_a2 = job == null ? void 0 : job.buttons) != null ? _a2 : [], ...document.querySelectorAll(`[data-job="${CSS.escape(key)}"]`)]);
  if (e.state === "queued") {
    const first = job && !job.queued;
    if (job) job.queued = true;
    const place = e.position > 1 ? `Queued (${e.position}${(_b2 = ["", "st", "nd", "rd"][e.position]) != null ? _b2 : "th"})` : "Queued (next)";
    for (const b of buttons) {
      b.disabled = false;
      b.textContent = place;
      b.title = "Waiting for the install before it \u2014 press again to take it out of the queue";
    }
    if (first) uiNotice(`${(_d = (_c = job.app) == null ? void 0 : _c.name) != null ? _d : "That"} is queued \u2014 it starts when the one before it finishes.`, "plain");
    return;
  }
  if (e.state === "progress") {
    if (job) job.queued = false;
    for (const b of buttons) {
      b.disabled = true;
      b.textContent = e.text;
    }
    return;
  }
  appInstalls.delete(key);
  for (const b of buttons) {
    if (!b.isConnected) continue;
    b.disabled = false;
    b.textContent = (job == null ? void 0 : job.label) || b.textContent;
    delete b.dataset.job;
  }
  if (e.state === "done") {
    if (((_e = job == null ? void 0 : job.app) == null ? void 0 : _e.repoOnly) && e.packageName) ghLearned(job.app, e.packageName);
    if ((job == null ? void 0 : job.app) && e.packageName) {
      job.app.packageName = e.packageName;
      if (e.action === "uninstalled") {
        job.app.installedVersionCode = null;
        job.app.installedVersion = null;
      } else if (e.action !== "saved" && e.action !== "backed-up") {
        job.app.installedVersionCode = (_f = e.versionCode) != null ? _f : null;
        job.app.installedVersion = (_g = e.version) != null ? _g : null;
      }
    }
    if (e.action !== "same") {
      addHistory({
        action: e.action,
        name: e.name,
        packageName: e.packageName,
        from: e.prevCode != null ? { version: (_h = e.prevVersion) != null ? _h : null, code: e.prevCode } : null,
        to: e.action === "uninstalled" ? null : { version: e.version, code: e.versionCode },
        backup: (_i = e.backup) != null ? _i : null
      });
    }
    uiNotice(e.text, e.action === "same" ? "plain" : "ok");
    if (e.action === "imported") {
      dgState.tab = "backups";
      dgState.backupSel = e.packageName;
    }
    if (job == null ? void 0 : job.app) refreshRow(job.app);
    dgAfterJob();
    return;
  }
  if (e.state === "busy") {
    uiNotice(e.text, "plain");
    return;
  }
  addHistory({
    action: e.state === "cancelled" ? "cancelled" : "failed",
    name: (_k = (_j = job == null ? void 0 : job.app) == null ? void 0 : _j.name) != null ? _k : null,
    packageName: (_m = (_l = job == null ? void 0 : job.app) == null ? void 0 : _l.packageName) != null ? _m : null,
    from: (_n = job == null ? void 0 : job.from) != null ? _n : null,
    to: null,
    text: e.text
  });
  uiNotice(`${((_o = job == null ? void 0 : job.app) == null ? void 0 : _o.name) ? `${job.app.name}: ` : ""}${e.text}`, e.state === "cancelled" ? "plain" : "bad");
  dgAfterJob();
};
function initDowngrade() {
  if (!IN_APP) return;
  if (appHas("relayHeaders")) {
    ocmsHeaders().then((h) => window.MetaDBApp.setRelayHeaders(JSON.stringify(h))).catch(() => {
    });
  }
  el.dgSite.addEventListener("click", () => {
    saveSettings({ layout: "site" });
    go("/apps");
  });
  el.dgRefresh.addEventListener("click", () => dgLoad(true));
  el.dgQ.addEventListener("input", dgRender);
  el.dgSignInBtn.addEventListener("click", () => window.MetaDBApp.signIn("downgrade"));
  el.dgSignOut.addEventListener("click", signOut);
  for (const t of el.dgTabs) {
    t.addEventListener("click", () => {
      dgState.tab = t.dataset.dgTab;
      if (dgState.tab === "backups") dgReadBackups();
      dgRender();
    });
  }
  el.dgApps.closest(".dg-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-dg-app]");
    if (b) dgSelect(b.dataset.dgApp);
  });
  el.dgShowAll.checked = loadSettings().dgAll;
  el.dgShowAll.addEventListener("change", () => {
    saveSettings({ dgAll: el.dgShowAll.checked });
    dgRender();
  });
  el.dgAddRepo.addEventListener("click", () => {
    var _a2;
    dgState.selected = "gh:new";
    dgRender();
    (_a2 = el.dgDetail.querySelector("[data-gh-form] input")) == null ? void 0 : _a2.focus();
  });
  el.dgDetail.addEventListener("submit", (e) => {
    const form = e.target.closest("[data-gh-form]");
    if (!form) return;
    e.preventDefault();
    const app = dgApp(dgState.selected);
    if (!app) return;
    const repo = parseRepo(form.elements.repo.value);
    if (!repo) {
      const note2 = el.dgDetail.querySelector("[data-gh-note]");
      if (note2) note2.textContent = "That is not a GitHub repo \u2014 give it as owner/repo, or paste its github.com link.";
      return;
    }
    const repos = readRepos();
    const key = app.adding ? `gh:${repo}` : app.packageName;
    repos[key] = { repo, name: app.adding ? repo.split("/")[1] : app.name };
    saveRepos(repos);
    if (app.adding) dgState.selected = key;
    ghLoad(repo);
  });
  el.dgDetail.addEventListener("click", (e) => {
    const app = dgApp(dgState.selected);
    if (!app) return;
    const ghIn = e.target.closest("[data-gh-install]");
    if (ghIn) return ghInstall(app, ghIn.dataset.ghInstall, ghIn);
    const ghSave = e.target.closest("[data-gh-save]");
    if (ghSave) return ghInstall(app, ghSave.dataset.ghSave, ghSave, { save: true });
    if (e.target.closest("[data-gh-refresh]")) return ghLoad(repoOf(app), true);
    if (e.target.closest("[data-gh-unlink]")) {
      const repos = readRepos();
      delete repos[app.repoOnly ? app.key : app.packageName];
      saveRepos(repos);
      if (app.repoOnly) dgState.selected = null;
      return dgRender();
    }
    if (e.target.closest("[data-restore], [data-delete-backup]")) return dgBackupClick(e);
    const un = e.target.closest("[data-uninstall]");
    if (un) return dgUninstall(app, un);
    const install = e.target.closest("[data-install-build]");
    if (install) return installBuild(app, install.dataset, install);
    const save = e.target.closest("[data-save-build]");
    if (save) return appInstall(app, save.dataset.saveBuild, save.dataset.version, save, { save: true });
    const backup = e.target.closest("[data-backup-installed]");
    if (backup) {
      const key = `backup:${app.packageName}`;
      if (jobPressed(key)) return;
      appJob(key, { app, button: backup });
      window.MetaDBApp.backup(key, app.packageName, app.name);
    }
  });
  el.dgAddApk.addEventListener("click", () => window.MetaDBApp.addApks());
  el.dgBackupApps.addEventListener("click", (e) => {
    const b = e.target.closest("[data-backup-app]");
    if (!b) return;
    dgState.backupSel = b.dataset.backupApp;
    dgRender();
  });
  el.dgBackupDetail.addEventListener("click", dgBackupClick);
  el.dgHistoryClear.addEventListener("click", async () => {
    if (!readHistory().length) return;
    const sure = await uiConfirm({
      title: "Clear the history?",
      text: "The list of what was installed, saved and backed up is removed. Nothing on the headset changes, and your backups stay.",
      yes: "Clear history"
    });
    if (!sure) return;
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
    }
    dgRender();
  });
}
async function dgUninstall(app, button) {
  var _a2;
  const key = `uninstall:${app.packageName}`;
  if (jobPressed(key)) return;
  const kept = dgState.backups.filter((b) => b.packageName === app.packageName).length;
  const sure = await uiConfirm({
    title: `Uninstall ${app.name}?`,
    text: `${app.name} ${(_a2 = app.installedVersion) != null ? _a2 : ""} is removed from this headset, and its saved data with it. This cannot be undone. ` + (kept ? `Your ${plural(kept, "backup")} of it stay${kept === 1 ? "s" : ""} in Backups.` : "There is no backup of it \u2014 Back up first if you may want this version again."),
    yes: "Uninstall",
    danger: true
  });
  if (!sure) return;
  appJob(key, {
    app,
    button,
    from: app.installedVersionCode != null ? { version: app.installedVersion, code: app.installedVersionCode } : null
  });
  window.MetaDBApp.uninstall(key, app.packageName, app.name);
}
async function dgBackupClick(e) {
  var _a2;
  const restore = e.target.closest("[data-restore]");
  const del = e.target.closest("[data-delete-backup]");
  const id = (_a2 = restore == null ? void 0 : restore.dataset.restore) != null ? _a2 : del == null ? void 0 : del.dataset.deleteBackup;
  const b = id ? dgState.backups.find((x) => x.id === id) : null;
  if (!b) return;
  if (restore) {
    const key = `restore:${b.id}`;
    if (jobPressed(key)) return;
    const have = installedCode(b.packageName);
    appJob(key, {
      app: { name: b.name, packageName: b.packageName },
      button: restore,
      from: have >= 0 ? { version: installedName(b.packageName), code: have } : null
    });
    window.MetaDBApp.restore(key, b.id);
    return;
  }
  const sure = await uiConfirm({
    title: `Delete this backup of ${b.name}?`,
    text: `${b.version} (build ${b.versionCode}), ${dgSize(b.size)}. The copy kept on this headset is removed; the app itself is not touched.`,
    yes: "Delete backup",
    danger: true
  });
  if (!sure) return;
  if (window.MetaDBApp.deleteBackup(b.id)) {
    addHistory({ action: "deleted", name: b.name, packageName: b.packageName, from: null, to: { version: b.version, code: b.versionCode } });
    uiNotice(`Deleted the backup of ${b.name} ${b.version}.`, "plain");
  } else {
    uiNotice("That backup could not be deleted.", "bad");
  }
  dgReadBackups();
  dgRender();
}
function dgSignedIn() {
  const { token, acToken } = loadSettings();
  return Boolean(token && token !== DEFAULT_TOKEN && acToken);
}
async function signOut() {
  const sure = await uiConfirm(
    IN_APP ? {
      title: "Sign out of Meta?",
      text: "Your tokens are removed from this headset and Meta's login in this app is cleared. Your backups and history stay.",
      yes: "Sign out"
    } : {
      title: "Sign out of MetaDB?",
      text: "Both tokens are removed from this browser, and MetaDB goes back to the built-in token. You stay logged in to Meta itself, so Sign in with Meta can fill them in again.",
      yes: "Sign out"
    }
  );
  if (!sure) return;
  if (IN_APP) window.MetaDBApp.signOut();
  saveSettings({ token: "", acToken: "" });
  el.token.value = "";
  el.acToken.value = "";
  mineList = [];
  adbApps = [];
  dgState.loaded = false;
  dgState.selected = null;
  dgState.builds.clear();
  syncAppSignIn();
  syncExtSignIn();
  renderAll();
  dgRender();
  uiNotice("Signed out.", "plain");
}
function syncAppSignIn() {
  if (!IN_APP) return;
  const signed = dgSignedIn();
  document.getElementById("appSignIn").hidden = signed;
  document.getElementById("appSignOut").hidden = !signed;
}
function installedCode(pkg) {
  return Number(window.MetaDBApp.installedVersion(pkg));
}
function installedName(pkg) {
  var _a2;
  const a = adbInstalled.find((x) => x.packageName === pkg);
  return (_a2 = a == null ? void 0 : a.version) != null ? _a2 : null;
}
function dgApp(pkg) {
  var _a2, _b2;
  return (_b2 = (_a2 = adbApps.find((a) => a.packageName === pkg)) != null ? _a2 : dgState.more.find((a) => a.packageName === pkg)) != null ? _b2 : dgSideApp(pkg);
}
function dgSideApp(pkg) {
  if (pkg === "gh:new") return { side: true, adding: true, name: "Versions from GitHub", packageName: null };
  const a = adbSide.find((x) => x.packageName === pkg);
  if (a) {
    return { side: true, packageName: a.packageName, name: a.name, installedVersion: a.version, installedVersionCode: a.versionCode };
  }
  const r = readRepos()[pkg];
  return r ? {
    side: true,
    repoOnly: true,
    key: pkg,
    repo: r.repo,
    name: r.name || r.repo,
    packageName: pkg.startsWith("gh:") ? null : pkg,
    installedVersion: null,
    installedVersionCode: null
  } : null;
}
var REPOS_KEY = "metadb.githubRepos";
function readRepos() {
  var _a2;
  try {
    return (_a2 = JSON.parse(localStorage.getItem(REPOS_KEY))) != null ? _a2 : {};
  } catch {
    return {};
  }
}
function saveRepos(repos) {
  try {
    localStorage.setItem(REPOS_KEY, JSON.stringify(repos));
  } catch {
  }
}
var repoOf = (app) => {
  var _a2, _b2;
  return app.repoOnly ? app.repo : app.packageName ? (_b2 = (_a2 = readRepos()[app.packageName]) == null ? void 0 : _a2.repo) != null ? _b2 : null : null;
};
async function ghLoad(repo, again = false) {
  const had = dgState.releases.get(repo);
  if ((had == null ? void 0 : had.loading) || (had == null ? void 0 : had.items) && !again) return;
  dgState.releases.set(repo, { loading: true });
  dgRender();
  try {
    dgState.releases.set(repo, { items: await githubReleases(repo) });
  } catch (err2) {
    dgState.releases.set(repo, { error: err2.message });
  }
  dgRender();
}
function ghLearned(app, pkg) {
  const repos = readRepos();
  const entry = repos[app.key];
  if (!entry || app.key === pkg) return;
  delete repos[app.key];
  repos[pkg] = entry;
  saveRepos(repos);
  if (dgState.selected === app.key) dgState.selected = pkg;
}
function verCmp(a, b) {
  var _a2, _b2, _c, _d;
  const nums = (v) => String(v != null ? v : "").split(/[^0-9]+/).filter(Boolean).map(Number);
  const x = nums(a), y = nums(b);
  if (!x.length || !y.length) return null;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (((_a2 = x[i]) != null ? _a2 : 0) !== ((_b2 = y[i]) != null ? _b2 : 0)) return ((_c = x[i]) != null ? _c : 0) - ((_d = y[i]) != null ? _d : 0);
  }
  return 0;
}
var sameVersion = (tag, installed) => installed != null && String(tag).replace(/^v/i, "").toLowerCase() === String(installed).replace(/^v/i, "").toLowerCase();
function ghInstall(app, assetId, button, { save = false } = {}) {
  var _a2, _b2;
  const repo = repoOf(app);
  const found = ((_b2 = (_a2 = dgState.releases.get(repo)) == null ? void 0 : _a2.items) != null ? _b2 : []).flatMap((r) => r.assets.map((a) => ({ r, a }))).find(({ a }) => a.id === assetId);
  if (!found) return;
  const key = `${save ? "save" : "install"}:gh:${assetId}`;
  if (jobPressed(key)) return;
  appJob(key, {
    app,
    button,
    from: app.installedVersionCode != null ? { version: app.installedVersion, code: app.installedVersionCode } : null
  });
  const job = {
    id: key,
    apk: found.a.url,
    obb: null,
    binaryId: `gh:${assetId}`,
    appId: "",
    name: app.repoOnly && !app.packageName ? repo.split("/")[1] : app.name,
    version: found.r.tag,
    source: "github",
    repo
  };
  if (app.packageName) job.packageName = app.packageName;
  if (save) window.MetaDBApp.save(JSON.stringify(job));
  else window.MetaDBApp.install(JSON.stringify(job));
}
function dgGithubSection(app) {
  const repo = repoOf(app);
  if (!repo) {
    return `<h3 class="dg-group">Versions from GitHub</h3>
      <form class="dg-gh-form" data-gh-form>
        <input type="text" name="repo" placeholder="owner/repo, or a github.com link" aria-label="GitHub repo" autocomplete="off" spellcheck="false">
        <button type="submit">Get versions</button>
      </form>
      <p class="hint" data-gh-note>Lists every release of the app's GitHub repo that has an APK, to install, update or go back to any of them.</p>`;
  }
  const st = dgState.releases.get(repo);
  const head = `<h3 class="dg-group">Versions from GitHub</h3>
    <div class="dg-gh-head"><a href="https://github.com/${esc(repo)}/releases" target="_blank" rel="noopener">${esc(repo)}</a>
      <button type="button" class="ptc-btn" data-gh-refresh>Refresh</button>
      <button type="button" class="ptc-btn" data-gh-unlink>Unlink</button></div>`;
  if (!st || st.loading) return `${head}<p class="dg-empty">Asking GitHub for its releases\u2026</p>`;
  if (st.error) return `${head}<p class="dg-empty warn">${esc(st.error)}</p>`;
  if (!st.items.length) return `${head}<p class="dg-empty">No release of ${esc(repo)} has an APK attached.</p>`;
  const have = app.installedVersionCode;
  const rows = st.items.flatMap((r) => r.assets.map((a) => ({ r, a }))).map(({ r, a }) => {
    const current = have != null && sameVersion(r.tag, app.installedVersion);
    const cmp = verCmp(r.tag, app.installedVersion);
    const job = (k) => appInstalls.has(k) ? ` data-job="${esc(k)}"` : "";
    const kept = dgState.backups.find(
      (b) => b.binaryId === `gh:${a.id}` || app.packageName && b.packageName === app.packageName && sameVersion(r.tag, b.version)
    );
    const keep = kept ? `<span class="dg-saved" title="Kept on this headset \u2014 installs with no download">Saved</span>` : `<button type="button" class="dl dl-obb" data-gh-save="${esc(a.id)}"${job(`save:gh:${a.id}`)}
            title="Download ${esc(r.tag)} and keep it here, without installing it">Save</button>`;
    const label = have == null ? "Install" : cmp == null ? "Install" : cmp > 0 ? "Update" : "Downgrade";
    const action = current ? `<span class="on-headset">On headset</span>` : `<button type="button" class="dl" data-gh-install="${esc(a.id)}"${job(`install:gh:${a.id}`)}
            title="${esc(label === "Downgrade" ? `Go back to ${r.tag} \u2014 uninstalls first, deleting this app's saved data` : `Install ${r.tag}`)}">${label}</button>`;
    return `<tr${current ? ` class="dg-current"` : ""}>
          <td class="num">${esc(r.tag)}${r.prerelease ? `<span class="dg-obb">pre-release</span>` : ""}</td>
          <td class="num">${esc(r.published || "\u2014")}</td>
          <td class="dg-file" title="${esc(a.name)}">${esc(a.name)}</td>
          <td class="num">${dgSize(a.size)}</td>
          <td class="dg-act">${keep}${action}</td>
        </tr>`;
  }).join("");
  return `${head}
    <table>
      <thead><tr><th scope="col">Version</th><th scope="col">Released</th><th scope="col">File</th><th scope="col">Size</th><th scope="col" aria-label="Actions"></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}
function dgNotInstalled() {
  const here = new Set(adbInstalled.map((a) => a.packageName));
  return mineList.filter((a) => a.id && a.packageName && !here.has(a.packageName) && a.owned !== false).map((a) => {
    var _a2;
    return {
      id: a.id,
      packageName: a.packageName,
      name: a.name,
      image: a.image,
      platform: a.platform,
      latest: (_a2 = a.latest) != null ? _a2 : null,
      channels: [],
      notInstalled: true,
      installedVersion: null,
      installedVersionCode: null
    };
  });
}
function dgReadBackups() {
  try {
    dgState.backups = JSON.parse(window.MetaDBApp.backups());
  } catch {
    dgState.backups = [];
  }
}
function dgSize(bytes) {
  const n = Number(bytes) || 0;
  return n >= 1e9 ? `${(n / 1e9).toFixed(2)} GB` : `${Math.max(1, Math.round(n / 1e6))} MB`;
}
function openDowngrade() {
  dgReadBackups();
  if (!dgState.loaded && !dgState.loading) dgLoad();
  else dgRender();
}
function dgAfterJob() {
  if (!IN_APP) return;
  dgReadBackups();
  if (headsetAsked) loadHeadsetApps().then(dgRender);
  else dgRender();
}
async function dgLoad(force = false) {
  if (!dgSignedIn()) {
    dgRender();
    return;
  }
  dgState.loading = true;
  dgState.note = "";
  el.dgRefresh.disabled = true;
  el.dgRefresh.textContent = "Refreshing\u2026";
  dgRender();
  try {
    while (mineLoading) await new Promise((r) => setTimeout(r, 200));
    if (force || mineKind !== "quest" || !mineList.length) await loadEntitlements("quest");
    if (mineNote) dgState.note = mineNote;
    await loadHeadsetApps();
    dgReadBackups();
    dgState.loaded = true;
  } catch (err2) {
    dgState.note = err2.message;
  }
  dgState.loading = false;
  el.dgRefresh.disabled = false;
  el.dgRefresh.textContent = "Refresh";
  dgRender();
  if (force && dgState.selected) dgSelect(dgState.selected, { again: true });
}
async function dgSelect(pkg, { again = false } = {}) {
  const app = dgApp(pkg);
  if (!app) return;
  dgState.selected = pkg;
  dgReadBackups();
  if (app.side) {
    const repo = repoOf(app);
    if (repo) ghLoad(repo);
    dgRender();
    return;
  }
  const had = dgState.builds.get(app.id);
  if ((had == null ? void 0 : had.loading) || (had == null ? void 0 : had.builds) && !again) {
    dgRender();
    return;
  }
  dgState.builds.set(app.id, { loading: true });
  dgRender();
  try {
    const latest = await checkApp(app);
    results.set(keyOf(app), { state: "info", latest });
    versionCache.set(app.id, latest.builds);
    if (loadSettings().obb) await findObbs(latest.channels);
    dgState.builds.set(app.id, { builds: latest.builds });
  } catch (err2) {
    dgState.builds.set(app.id, { error: err2.message });
  }
  if (dgState.selected === pkg) dgRender();
}
function dgArt(a) {
  const image = (a == null ? void 0 : a.image) || ((a == null ? void 0 : a.packageName) && a.installedVersionCode != null ? dgHeadsetIcon(a.packageName) : null);
  return image ? `<img class="dg-art" src="${esc(image)}" alt="" loading="lazy">` : `<span class="dg-art"></span>`;
}
var dgIcons = /* @__PURE__ */ new Map();
function dgHeadsetIcon(pkg, backupId = null) {
  const key = backupId ? `b:${backupId}` : `p:${pkg}`;
  if (!dgIcons.has(key)) {
    let uri = null;
    try {
      uri = backupId ? window.MetaDBApp.backupIcon(backupId) : window.MetaDBApp.appIcon(pkg);
    } catch {
    }
    dgIcons.set(key, uri);
  }
  return dgIcons.get(key);
}
async function fillStoreArt(pkgs, known = null) {
  var _a2, _b2, _c, _d;
  const owned = ownedByPackage();
  const want = [...new Set(pkgs)].filter(
    (p) => {
      var _a3;
      return p && !((_a3 = owned.get(p)) == null ? void 0 : _a3.image) && (!storeArt.has(p) || storeArt.get(p) && !storeArt.get(p).image && !storeArtTried.has(p));
    }
  );
  if (!want.length || storeArtAsking || !dgSignedIn()) return false;
  storeArtAsking = true;
  try {
    if (!known) {
      try {
        known = await lookupPackages(want);
      } catch (err2) {
        if (!/no recognisable app IDs/.test(err2.message)) return false;
        known = /* @__PURE__ */ new Map();
      }
    }
    const hits = want.filter((p) => {
      var _a3;
      return (_a3 = known.get(p)) == null ? void 0 : _a3.id;
    });
    const unnamed = hits.filter((p) => !known.get(p).name).map((p) => known.get(p).id);
    const names = unnamed.length ? await storeNames(unnamed).catch(() => /* @__PURE__ */ new Map()) : /* @__PURE__ */ new Map();
    for (const p of want) {
      storeArtTried.add(p);
      const hit = known.get(p);
      if (!(hit == null ? void 0 : hit.id)) {
        if (!known.has(p)) storeArt.set(p, null);
        continue;
      }
      const name = hit.name || names.get(String(hit.id)) || null;
      let image = null;
      if (name) {
        try {
          image = (_b2 = (_a2 = (await searchStore(name, { limit: 10 })).find((r) => r.id === String(hit.id))) == null ? void 0 : _a2.image) != null ? _b2 : null;
        } catch {
        }
      }
      if (!image) {
        try {
          const media2 = (await appPage(hit.id)).media;
          const pick = (labels) => {
            var _a3;
            return (_a3 = media2.find((m) => labels.includes(m.label))) == null ? void 0 : _a3.uri;
          };
          image = (_d = (_c = pick(["Cover", "Icon", "Icon (VR)"])) != null ? _c : pick(["Hero", "Landscape"])) != null ? _d : null;
        } catch {
        }
      }
      storeArt.set(p, { id: String(hit.id), name, image });
    }
    try {
      localStorage.setItem(STORE_ART_KEY, JSON.stringify(Object.fromEntries(storeArt)));
    } catch {
    }
    return true;
  } finally {
    storeArtAsking = false;
  }
}
function dgArtFor(pkg, backupId = null) {
  var _a2, _b2;
  const known = (_a2 = dgApp(pkg)) != null ? _a2 : mineList.find((a) => a.packageName === pkg);
  if (known == null ? void 0 : known.image) return known;
  if ((_b2 = storeArt.get(pkg)) == null ? void 0 : _b2.image) return storeArt.get(pkg);
  const image = backupId && dgHeadsetIcon(pkg, backupId) || (installedCode(pkg) >= 0 ? dgHeadsetIcon(pkg) : null);
  return image ? { image } : null;
}
function dgRender() {
  if (!IN_APP) return;
  const signed = dgSignedIn();
  const tab = dgState.tab;
  for (const t of el.dgTabs) {
    const on = t.dataset.dgTab === tab;
    t.classList.toggle("on", on);
    t.setAttribute("aria-selected", String(on));
  }
  el.dgSignOut.hidden = !signed;
  el.dgRefresh.hidden = tab !== "apps" || !signed;
  el.dgQ.hidden = tab === "apps" && !signed;
  el.dgSignIn.hidden = tab !== "apps" || signed;
  el.dgBody.hidden = tab !== "apps" || !signed;
  el.dgBackups.hidden = tab !== "backups";
  el.dgHistory.hidden = tab !== "history";
  syncAppSignIn();
  const q = el.dgQ.value.trim().toLowerCase();
  const hit = (a) => {
    var _a2, _b2;
    return !q || ((_a2 = a.name) != null ? _a2 : "").toLowerCase().includes(q) || ((_b2 = a.packageName) != null ? _b2 : "").toLowerCase().includes(q);
  };
  if (tab === "backups") return dgRenderBackups(hit);
  if (tab === "history") return dgRenderHistory(hit);
  if (!signed) return;
  const apps = adbApps.filter(hit).sort((a, b) => a.name.localeCompare(b.name));
  const side = adbSide.filter(hit);
  dgState.more = el.dgShowAll.checked ? dgNotInstalled().sort((a, b) => a.name.localeCompare(b.name)) : [];
  const more = dgState.more.filter(hit);
  el.dgCount.textContent = dgState.loading ? "Looking at this headset\u2026" : dgState.note ? dgState.note : adbApps.length || dgState.more.length ? (() => {
    const all = adbApps.length + dgState.more.length;
    const listed = apps.length + more.length;
    return `${listed === all ? plural(all, "app") : `${listed} of ${plural(all, "app")}`} from the store`;
  })() : dgState.loaded ? "No store apps are installed." : "";
  el.dgCount.classList.toggle("warn", Boolean(dgState.note) && !dgState.loading);
  el.dgApps.innerHTML = apps.map(
    (a) => {
      var _a2, _b2;
      return `<li><button type="button" class="dg-app" data-dg-app="${esc(a.packageName)}"
          aria-current="${a.packageName === dgState.selected}">${dgArt(a)}
          <span class="dg-text"><span class="dg-name">${esc(a.name)}</span>
          <span class="dg-ver">${esc((_a2 = a.installedVersion) != null ? _a2 : "\u2014")} \xB7 ${(_b2 = a.installedVersionCode) != null ? _b2 : "\u2014"}</span></span>${adbBehind(a) ? `<span class="dg-new">Update</span>` : ""}</button></li>`;
    }
  ).join("");
  el.dgMoreH.hidden = !more.length;
  el.dgMore.innerHTML = more.map(
    (a) => {
      var _a2, _b2, _c, _d;
      return `<li><button type="button" class="dg-app" data-dg-app="${esc(a.packageName)}"
          aria-current="${a.packageName === dgState.selected}">${dgArt(a)}
          <span class="dg-text"><span class="dg-name">${esc(a.name)}</span>
          <span class="dg-ver">${esc((_b2 = (_a2 = a.latest) == null ? void 0 : _a2.version) != null ? _b2 : "\u2014")} \xB7 ${(_d = (_c = a.latest) == null ? void 0 : _c.versionCode) != null ? _d : "\u2014"}</span></span></button></li>`;
    }
  ).join("");
  const repoOnly = Object.entries(readRepos()).filter(([key]) => !adbSide.some((x) => x.packageName === key)).map(([key, r]) => ({ key, name: r.name || r.repo, repo: r.repo, packageName: key.startsWith("gh:") ? "" : key })).filter(hit).sort((a, b) => a.name.localeCompare(b.name));
  el.dgSide.innerHTML = side.map((a) => {
    var _a2, _b2;
    const kept = dgState.backups.filter((k) => k.packageName === a.packageName).length;
    return `<li><button type="button" class="dg-app" data-dg-app="${esc(a.packageName)}"
          aria-current="${a.packageName === dgState.selected}">${dgArt({ image: dgHeadsetIcon(a.packageName) })}
          <span class="dg-text"><span class="dg-name">${esc(a.name)}</span>
          <span class="dg-ver">${esc((_a2 = a.version) != null ? _a2 : "\u2014")} \xB7 ${(_b2 = a.versionCode) != null ? _b2 : "\u2014"}</span></span>${kept ? `<span class="dg-new dg-off">${plural(kept, "backup")}</span>` : ""}</button></li>`;
  }).concat(
    repoOnly.map(
      (a) => `<li><button type="button" class="dg-app" data-dg-app="${esc(a.key)}"
          aria-current="${a.key === dgState.selected}">${dgArt(null)}
          <span class="dg-text"><span class="dg-name">${esc(a.name)}</span>
          <span class="dg-ver">${esc(a.repo)} \xB7 not installed</span></span></button></li>`
    )
  ).join("");
  dgRenderDetail();
}
function dgKept(pkg, code, binaryId) {
  var _a2;
  return (_a2 = dgState.backups.find(
    (k) => binaryId && k.binaryId === String(binaryId) || k.packageName === pkg && k.versionCode === code
  )) != null ? _a2 : null;
}
function dgRenderDetail() {
  var _a2;
  const app = dgApp(dgState.selected);
  if (!app) {
    el.dgDetail.innerHTML = adbApps.length ? `<p class="dg-empty">Pick an app to see every build it has had.</p>` : "";
    return;
  }
  if (app.side) return dgRenderSideDetail(app);
  const st = dgState.builds.get(app.id);
  let body;
  if (!st || st.loading) {
    body = `<p class="dg-empty">Asking the store for its builds\u2026</p>`;
  } else if (st.error) {
    body = `<p class="dg-empty warn">${esc(st.error)}</p>`;
  } else {
    const rows = st.builds.filter((b) => b.channels.length && b.id).map((b) => {
      var _a3, _b2, _c;
      const current = b.versionCode === app.installedVersionCode;
      const older = app.installedVersionCode && b.versionCode < app.installedVersionCode;
      const kept = dgKept(app.packageName, b.versionCode, b.id);
      const job = (k) => appInstalls.has(k) ? ` data-job="${esc(k)}"` : "";
      const keep = kept ? `<span class="dg-saved" title="Kept on this headset \u2014 installs with no download">Saved</span>` : current ? `<button type="button" class="dl dl-obb" data-backup-installed${job(`backup:${app.packageName}`)}
                title="Keep a copy of the version on this headset, expansion file and all">Back up</button>` : `<button type="button" class="dl dl-obb" data-save-build="${esc(b.id)}" data-version="${esc(b.version)}"${job(`save:${b.id}`)}
                title="Download ${esc(b.version)} and keep it here, without installing it">Save</button>`;
      const action = current ? `<span class="on-headset">On headset</span>` : `<button type="button" class="dl" data-install-build="${esc(b.id)}"${job(`install:${b.id}`)}
              data-version="${esc(b.version)}" data-code="${(_a3 = b.versionCode) != null ? _a3 : ""}"
              title="${esc(older ? `Go back to ${b.version} \u2014 uninstalls first, deleting this app's saved data` : `Install ${b.version}`)}">${older ? "Downgrade" : app.installedVersionCode == null ? "Install" : "Update"}</button>`;
      return `<tr${current ? ` class="dg-current"` : ""}>
            <td class="num">${esc(b.version)}${obbs.has(String(b.id)) ? `<span class="dg-obb">+ OBB</span>` : ""}</td>
            <td class="num">${(_b2 = b.versionCode) != null ? _b2 : "\u2014"}</td>
            <td class="num">${(_c = b.releasedAt) != null ? _c : "\u2014"}</td>
            <td>${esc(b.channels.join(", "))}</td>
            <td class="dg-act">${keep}${action}</td>
          </tr>`;
    }).join("");
    body = rows ? `<p class="dg-warn">Going back to an older build uninstalls the app first, which deletes its saved data on this headset. Updating keeps it. Back up the version you are on first if you may want it again.</p>
         <table>
           <thead><tr><th scope="col">Version</th><th scope="col">Build</th><th scope="col">Released</th><th scope="col">Channel</th><th scope="col" aria-label="Actions"></th></tr></thead>
           <tbody>${rows}</tbody>
         </table>` : `<p class="dg-empty">The store lists no released builds for this app.</p>`;
  }
  el.dgDetail.innerHTML = `<div class="dg-head">${dgArt(app)}
      <div><h2>${esc(app.name)}</h2><div class="dg-pkg">${esc(app.packageName)}</div>
      <p class="dg-now">${app.installedVersionCode == null ? "Not installed on this headset" : `On this headset: ${esc((_a2 = app.installedVersion) != null ? _a2 : "\u2014")} (build ${app.installedVersionCode})`}</p></div>${app.installedVersionCode == null ? "" : dgHeadActions(app)}
    </div>${body}`;
}
function dgHeadActions(app) {
  const key = `backup:${app.packageName}`;
  const job = appInstalls.has(key) ? ` data-job="${esc(key)}"` : "";
  return `<div class="dg-head-acts"><button type="button" data-backup-installed${job}
      title="Keep a copy of the version on this headset, expansion file and all">Back up</button>${dgUninstallButton(app)}</div>`;
}
function dgUninstallButton(app) {
  const key = `uninstall:${app.packageName}`;
  const job = appInstalls.has(key) ? ` data-job="${esc(key)}"` : "";
  return `<button type="button" class="dg-uninstall" data-uninstall${job} title="Remove ${esc(app.name)} from this headset, and its saved data">Uninstall</button>`;
}
function dgRenderSideDetail(app) {
  var _a2, _b2, _c;
  if (app.adding) {
    el.dgDetail.innerHTML = `<div class="dg-head">${dgArt(null)}
        <div><h2>Versions from GitHub</h2>
        <p class="dg-now">For an app that publishes its APKs as GitHub releases.</p></div>
      </div>
      <p class="dg-warn">Name its repo and every release with an APK is listed, to install or keep. Once one is installed, it shows under Unknown sources like any other app, with its versions beside it.</p>
      ${dgGithubSection(app)}`;
    return;
  }
  if (app.repoOnly) {
    el.dgDetail.innerHTML = `<div class="dg-head">${dgArt(null)}
        <div><h2>${esc(app.name)}</h2><div class="dg-pkg">${esc((_a2 = app.packageName) != null ? _a2 : app.repo)}</div>
        <p class="dg-now">Not installed on this headset</p></div>
      </div>
      ${dgGithubSection(app)}`;
    return;
  }
  const kept = dgState.backups.filter((b) => b.packageName === app.packageName).sort((x, y) => y.versionCode - x.versionCode);
  el.dgDetail.innerHTML = `<div class="dg-head">${dgArt({ image: dgHeadsetIcon(app.packageName) })}
      <div><h2>${esc(app.name)}</h2><div class="dg-pkg">${esc(app.packageName)}</div>
      <p class="dg-now">On this headset: ${esc((_b2 = app.installedVersion) != null ? _b2 : "\u2014")} (build ${(_c = app.installedVersionCode) != null ? _c : "\u2014"})</p></div>${dgHeadActions(app)}
    </div>
    <p class="dg-warn">Not in the store. If it publishes its APKs on GitHub, its versions can be listed below; either way a copy of it can be kept, and put back later. Going back to an older version uninstalls the app first, which deletes its saved data on this headset.</p>
    ${dgGithubSection(app)}
    <h3 class="dg-group">Kept on this headset</h3>
    ${kept.length ? dgBackupTable(kept, app.installedVersionCode) : `<p class="dg-empty">No copies of it yet. Back up keeps one.</p>`}`;
}
function dgBackupGroups() {
  var _a2, _b2;
  const groups = /* @__PURE__ */ new Map();
  for (const b of dgState.backups) {
    if (!groups.has(b.packageName)) {
      groups.set(b.packageName, { packageName: b.packageName, name: b.name, items: [], size: 0 });
    }
    const g = groups.get(b.packageName);
    g.items.push(b);
    g.size += Number(b.size) || 0;
    if (b.source !== "file") g.name = b.name;
  }
  const owned = ownedByPackage();
  for (const g of groups.values()) {
    g.items.sort((x, y) => y.versionCode - x.versionCode);
    if (g.items.every((b) => b.source === "file")) {
      g.name = ((_a2 = owned.get(g.packageName)) == null ? void 0 : _a2.name) || ((_b2 = storeArt.get(g.packageName)) == null ? void 0 : _b2.name) || g.name;
    }
  }
  return [...groups.values()].sort((x, y) => x.name.localeCompare(y.name));
}
function dgRenderBackups(hit) {
  var _a2;
  const groups = dgBackupGroups();
  const own = groups.filter((g) => g.items.every((b) => b.source === "file")).map((g) => g.packageName);
  fillStoreArt(own).then((changed) => changed && dgState.tab === "backups" && dgRender());
  const shown = groups.filter(hit);
  const total = groups.reduce((n, g) => n + g.size, 0);
  if (dgState.backupSel && !groups.some((g) => g.packageName === dgState.backupSel)) dgState.backupSel = null;
  el.dgBackupsCount.textContent = groups.length ? `${shown.length === groups.length ? plural(groups.length, "app") : `${shown.length} of ${plural(groups.length, "app")}`}, ${dgSize(total)}` : "";
  el.dgBackupApps.innerHTML = shown.map((g) => {
    const art = dgArtFor(g.packageName, g.items[0].id);
    const have = installedCode(g.packageName);
    return `<li><button type="button" class="dg-app" data-backup-app="${esc(g.packageName)}"
          aria-current="${g.packageName === dgState.backupSel}">${dgArt(art)}
          <span class="dg-text"><span class="dg-name">${esc(g.name)}</span>
          <span class="dg-ver">${plural(g.items.length, "version")} \xB7 ${dgSize(g.size)}</span></span>${have < 0 ? `<span class="dg-new dg-off">Not installed</span>` : ""}</button></li>`;
  }).join("");
  el.dgBackupsEmpty.hidden = shown.length > 0;
  el.dgBackupsEmpty.textContent = groups.length ? "Nothing matches." : "No backups yet. Builds you install or save from Apps are kept here, Back up keeps the version you are on, and + Add APK brings in your own.";
  dgRenderBackupDetail((_a2 = groups.find((g) => g.packageName === dgState.backupSel)) != null ? _a2 : null);
}
function dgRenderBackupDetail(g) {
  var _a2;
  if (!g) {
    el.dgBackupDetail.innerHTML = dgState.backups.length ? `<p class="dg-empty">Pick an app to see the versions kept of it.</p>` : "";
    return;
  }
  const have = installedCode(g.packageName);
  el.dgBackupDetail.innerHTML = `<div class="dg-head">${dgArt(dgArtFor(g.packageName, g.items[0].id))}
      <div><h2>${esc(g.name)}</h2><div class="dg-pkg">${esc(g.packageName)}</div>
      <p class="dg-now">${have >= 0 ? `On this headset: ${esc((_a2 = installedName(g.packageName)) != null ? _a2 : "\u2014")} (build ${have})` : "Not installed on this headset"}</p></div>
    </div>
    <p class="dg-warn">Installing from a backup needs no download, and works signed out. Going back to an older build uninstalls the app first, which deletes its saved data on this headset.</p>
    ${dgBackupTable(g.items, have)}`;
}
function dgBackupTable(items, have) {
  have = have != null ? have : -1;
  const rows = items.map((b) => {
    var _a2, _b2;
    const current = have === b.versionCode;
    const key = `restore:${b.id}`;
    const queued = appInstalls.get(key);
    const job = queued ? ` data-job="${esc(key)}"` : "";
    const action = current ? `<span class="on-headset">On headset</span>` : `<button type="button" class="dl" data-restore="${esc(b.id)}"${job}
            title="${esc(have > b.versionCode ? `Go back to ${b.version} \u2014 uninstalls first, deleting this app's saved data` : `Install ${b.version} from this backup \u2014 no download`)}">${have < 0 ? "Install" : have > b.versionCode ? "Downgrade" : "Update"}</button>`;
    const from = b.source === "headset" ? "This headset" : b.source === "file" ? "Your APK" : "Download";
    return `<tr${current ? ` class="dg-current"` : ""}>
          <td class="num">${esc(b.version)}${((_a2 = b.obbs) == null ? void 0 : _a2.length) ? `<span class="dg-obb">+ OBB</span>` : ""}</td>
          <td class="num">${b.versionCode}</td>
          <td class="num">${new Date(b.savedAt).toISOString().slice(0, 10)}</td>
          <td title="${esc((_b2 = b.fileName) != null ? _b2 : "")}">${from}</td>
          <td class="num">${dgSize(b.size)}</td>
          <td class="dg-act"><button type="button" class="ptc-btn" data-delete-backup="${esc(b.id)}">Delete</button> ${action}</td>
        </tr>`;
  }).join("");
  return `<table>
      <thead><tr><th scope="col">Version</th><th scope="col">Build</th><th scope="col">Kept</th><th scope="col">From</th><th scope="col">Size</th><th scope="col" aria-label="Actions"></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}
var HISTORY_WORDS = {
  ...JOB_WORDS,
  deleted: "Deleted backup",
  cancelled: "Cancelled",
  failed: "Failed"
};
function dgRenderHistory(hit) {
  const all = readHistory();
  const shown = all.filter(hit);
  const ver = (v) => {
    var _a2, _b2;
    return v ? `${esc((_a2 = v.version) != null ? _a2 : "\u2014")} <span class="dg-obb">${(_b2 = v.code) != null ? _b2 : ""}</span>` : "\u2014";
  };
  el.dgHistoryRows.innerHTML = shown.map(
    (h) => {
      var _a2, _b2, _c, _d, _e;
      return `<tr>
          <td class="num">${new Date(h.at).toISOString().slice(0, 16).replace("T", " ")}</td>
          <td class="name"><span class="dg-cell">${dgArt(dgArtFor(h.packageName, (_a2 = h.backup) != null ? _a2 : null))}${esc((_c = (_b2 = h.name) != null ? _b2 : h.packageName) != null ? _c : "\u2014")}</span></td>
          <td${h.action === "failed" ? ` class="warn"` : ""} title="${esc((_d = h.text) != null ? _d : "")}">${esc((_e = HISTORY_WORDS[h.action]) != null ? _e : h.action)}${h.text && (h.action === "failed" || h.action === "cancelled") ? `: ${esc(h.text)}` : ""}</td>
          <td class="num">${ver(h.from)}</td>
          <td class="num">${ver(h.to)}</td>
        </tr>`;
    }
  ).join("");
  el.dgHistoryClear.disabled = !all.length;
  el.dgHistoryEmpty.hidden = shown.length > 0;
  el.dgHistoryEmpty.textContent = all.length ? "Nothing matches." : "Nothing yet. Installs, updates, downgrades, saves and backups made here are listed as they happen.";
}
function initGetApp() {
  var _a2;
  (_a2 = document.getElementById("getappAdb")) == null ? void 0 : _a2.addEventListener("click", installAppOverAdb);
  if (!IN_APP) return;
  el.dgAppUpdate.addEventListener("click", () => offerAppUpdate(el.dgAppUpdate));
  document.getElementById("appCheck").addEventListener("click", () => checkAppUpdate({ quiet: false }));
  setTimeout(() => checkAppUpdate(), 1500);
}
function appOwnVersion() {
  var _a2, _b2, _c;
  try {
    return JSON.parse((_c = (_b2 = (_a2 = window.MetaDBApp).appVersion) == null ? void 0 : _b2.call(_a2)) != null ? _c : "{}");
  } catch {
    return {};
  }
}
async function checkAppUpdate({ quiet = true } = {}) {
  var _a2, _b2, _c;
  if (!IN_APP) return;
  const mine = appOwnVersion();
  const out = document.getElementById("appVersionOut");
  const button = document.getElementById("appCheck");
  if (!quiet) {
    button.disabled = true;
    button.textContent = "Checking\u2026";
  }
  let info = null;
  try {
    const res = await fetch(APP_INFO, { cache: "no-store" });
    if (res.ok && /json/.test((_a2 = res.headers.get("content-type")) != null ? _a2 : "")) info = await res.json();
  } catch {
  }
  appUpdate = info && mine.versionCode && Number(info.versionCode) > Number(mine.versionCode) ? info : null;
  el.dgAppUpdate.hidden = !appUpdate;
  if (appUpdate) el.dgAppUpdate.textContent = `Update MetaDB to ${appUpdate.version}`;
  document.getElementById("appVersionText").textContent = `MetaDB ${(_b2 = mine.versionName) != null ? _b2 : "?"} (build ${(_c = mine.versionCode) != null ? _c : "?"})` + (info ? ` \xB7 newest published: ${info.version} (build ${info.versionCode})` : "");
  if (!quiet) {
    button.disabled = false;
    button.textContent = "Check for updates";
    out.classList.toggle("bad", !info);
    out.textContent = appUpdate ? `MetaDB ${appUpdate.version} is out. Press Update MetaDB at the top of Downgrade, or here.` : info ? "MetaDB is up to date." : "Could not read the published version \u2014 try again in a moment.";
    if (appUpdate) startAppUpdateOffer(out);
  } else if (appUpdate && !appUpdateNoticed) {
    appUpdateNoticed = true;
    uiNotice(`MetaDB ${appUpdate.version} is out \u2014 press Update MetaDB at the top to install it.`, "plain");
  }
}
function startAppUpdateOffer(out) {
  if (out.querySelector("button")) return;
  const b = document.createElement("button");
  b.type = "button";
  b.className = "linkbtn";
  b.textContent = "Update now";
  b.addEventListener("click", () => offerAppUpdate(b));
  out.append(" ", b);
}
async function offerAppUpdate(button) {
  const changes = Array.isArray(appUpdate == null ? void 0 : appUpdate.changes) ? appUpdate.changes : [];
  if (changes.length) {
    const go2 = await uiConfirm({
      title: `What's new in MetaDB ${appUpdate.version}`,
      text: "MetaDB closes while Android replaces it; your sign-in and backups stay.",
      list: changes,
      yes: "Update",
      no: "Not now"
    });
    if (!go2) return;
  }
  startAppUpdate(button);
}
function startAppUpdate(button) {
  const key = "selfupdate";
  if (jobPressed(key)) return;
  appJob(key, { app: { name: "MetaDB", packageName: "dev.toastconcern.metadb" }, button });
  window.MetaDBApp.updateApp(key, APP_APK);
}
async function showAppInfo() {
  if (appInfoAsked) return;
  appInfoAsked = true;
  const out = document.getElementById("getappInfo");
  try {
    const res = await fetch(APP_INFO, { cache: "no-store" });
    if (!res.ok) throw new Error();
    const info = await res.json();
    out.textContent = `Version ${info.version} \xB7 ${Math.max(1, Math.round(info.size / 1024))} KB \xB7 built ${info.built}`;
  } catch {
    out.textContent = "";
  }
}
async function installAppOverAdb() {
  const button = document.getElementById("getappAdb");
  const say2 = (text, bad = false) => {
    const out = document.getElementById("getappOut");
    out.textContent = text;
    out.classList.toggle("bad", bad);
  };
  if (!adb) {
    say2("Connect the headset on the ADB screen first, then come back and press this again.", true);
    return;
  }
  const label = button.textContent;
  button.disabled = true;
  try {
    button.textContent = "Downloading\u2026";
    const res = await fetch(APP_APK, { cache: "no-store" });
    if (!res.ok) throw new Error(`the APK returned ${res.status}`);
    const blob = await res.blob();
    const { installApk } = await import("./adb.js?v=149");
    await installApk(adb, blob, { onProgress: (t) => button.textContent = t });
    say2("MetaDB is on the headset \u2014 it is in the library, under Unknown sources.");
  } catch (err2) {
    say2(`Could not install it: ${err2.message}`, true);
  } finally {
    button.textContent = label;
    button.disabled = false;
  }
}
function initDevices() {
  el.devicesLoad.addEventListener("click", () => {
    loadDevices().then(loadPTCStatuses);
    loadPresence();
  });
  el.serialToggle.addEventListener("click", () => {
    showSerials = !showSerials;
    el.serialToggle.textContent = showSerials ? "Hide serials" : "Show serials";
    renderDevices();
  });
  el.devicesRows.addEventListener("click", onDevicePTCClick);
  el.devicesQ.addEventListener("input", renderDevices);
  el.devicesSort.addEventListener("change", renderDevices);
  renderDevices();
}
function loadDevices() {
  if (devicesLoading) return devicesPromise;
  devicesPromise = fetchDevices();
  return devicesPromise;
}
async function fetchDevices() {
  devicesAsked = true;
  devicesLoading = true;
  devicesNote = "";
  el.devicesLoad.disabled = true;
  el.devicesLoad.textContent = "Loading\u2026";
  renderDevices();
  try {
    deviceList = await accountDevices();
  } catch (err2) {
    deviceList = [];
    devicesNote = err2.message || "Could not load your devices.";
  } finally {
    devicesLoading = false;
    el.devicesLoad.disabled = false;
    el.devicesLoad.textContent = "Get devices";
    renderDevices();
  }
}
function initPurchases() {
  el.purchasesLoad.addEventListener("click", fetchPurchases);
  el.purchasesMore.addEventListener("click", loadMorePurchases);
  el.purchasesShowPay.addEventListener("click", () => {
    showPayment = !showPayment;
    el.purchasesShowPay.textContent = showPayment ? "Hide payment" : "Show payment";
    renderPurchases();
  });
  el.purchasesQ.addEventListener("input", renderPurchases);
  el.purchasesRows.addEventListener("click", (e) => {
    const row = e.target.closest("[data-open-app]");
    if (row) openAppById(row.dataset.openApp);
  });
  renderPurchases();
}
async function fetchPurchases() {
  purchasesState.asked = true;
  purchasesState.loading = true;
  purchasesState.note = "";
  el.purchasesLoad.disabled = true;
  el.purchasesLoad.textContent = "Loading\u2026";
  renderPurchases();
  try {
    const page = await purchaseHistory();
    purchasesState.orders = page.orders;
    purchasesState.accountId = page.accountId;
    purchasesState.cursor = page.orders.length >= PURCHASES_PAGE ? page.cursor : null;
  } catch (err2) {
    purchasesState.orders = [];
    purchasesState.cursor = null;
    purchasesState.note = err2.message || "Could not load your purchases.";
  } finally {
    purchasesState.loading = false;
    el.purchasesLoad.disabled = false;
    el.purchasesLoad.textContent = "Get purchases";
    renderPurchases();
  }
}
async function loadMorePurchases() {
  if (!purchasesState.cursor || !purchasesState.accountId) return;
  el.purchasesMore.disabled = true;
  el.purchasesMore.textContent = "Loading\u2026";
  try {
    const page = await morePurchases(purchasesState.accountId, purchasesState.cursor);
    const seen = new Set(purchasesState.orders.map((o) => o.id));
    const fresh = page.orders.filter((o) => !seen.has(o.id));
    purchasesState.orders.push(...fresh);
    const full = page.orders.length >= PURCHASES_PAGE;
    purchasesState.cursor = full && fresh.length ? page.cursor : null;
  } catch (err2) {
    purchasesState.note = err2.message || "Could not load more purchases.";
  } finally {
    el.purchasesMore.disabled = false;
    el.purchasesMore.textContent = "Load more";
    renderPurchases();
  }
}
function renderPurchases() {
  const { orders, asked, loading, note: note2, cursor } = purchasesState;
  const q = el.purchasesQ.value.trim().toLowerCase();
  const shown = q ? orders.filter((o) => o.name.toLowerCase().includes(q)) : orders;
  const showArt = loadSettings().images;
  el.purchasesRows.innerHTML = shown.map((o) => {
    var _a2;
    const refund = o.refundStatus && !/^(none|not_refunded|no_refund)/i.test(o.refundStatus) ? ` <span class="pill">${esc(prettyStatus(o.refundStatus))}</span>` : "";
    const art = showArt && o.image ? `<img class="art" src="${esc(o.image)}" alt="" loading="lazy">` : "";
    const kind = o.iapType ? ` <span class="purchase-kind">${esc(prettyStatus(o.iapType))}</span>` : "";
    const pay = o.payment == null ? "\u2014" : showPayment ? esc(o.payment) : "\u2022\u2022\u2022\u2022";
    const nameCell = o.appId ? `<button type="button" class="linkbtn" data-open-app="${esc(o.appId)}" title="Open ${esc(
      o.name
    )}">${esc(o.name)}</button>` : esc(o.name);
    return `<tr>
          <td class="name">${art}${nameCell}${kind}</td>
          <td class="num">${esc((_a2 = o.amount) != null ? _a2 : "\u2014")}</td>
          <td class="num">${o.date ? isoDay(o.date) : "\u2014"}</td>
          <td>${esc(prettyStatus(o.status) || "\u2014")}${refund}</td>
          <td class="purchase-pay">${pay}</td>
        </tr>`;
  }).join("");
  el.purchasesCount.textContent = asked && !loading ? note2 ? "" : `${bigNumber(shown.length)}${q && shown.length !== orders.length ? ` of ${bigNumber(orders.length)}` : ""} ${orders.length === 1 && !q ? "purchase" : "purchases"}` : "";
  el.purchasesMoreBar.hidden = !(cursor && !q);
  const empty = !asked ? "Press Get purchases to list this account's orders." : loading ? "" : note2 ? note2 : orders.length === 0 ? "This account has no purchases on record." : shown.length === 0 ? "Nothing matches that filter." : "";
  el.purchasesEmpty.hidden = !empty;
  el.purchasesEmpty.textContent = empty;
  el.purchasesEmpty.classList.toggle("warn", Boolean(note2));
}
function initAvatar() {
  el.avatarLoad.addEventListener("click", fetchAvatar);
  el.avatarQ.addEventListener("input", renderAvatar);
  el.avatarRows.addEventListener("click", (e) => {
    if (e.target.closest("tr.detail")) return;
    const row = e.target.closest("tr[data-part]");
    if (row) toggleAvatarPart(row.dataset.part);
  });
  el.avatarRows.addEventListener("keydown", (e) => {
    var _a2, _b2;
    const row = (_b2 = (_a2 = e.target).closest) == null ? void 0 : _b2.call(_a2, "tr[data-part]");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      toggleAvatarPart(row.dataset.part);
    }
  });
  renderAvatar();
}
function toggleAvatarPart(part) {
  var _a2;
  if (avatarOpen.has(part)) avatarOpen.delete(part);
  else avatarOpen.add(part);
  renderAvatar();
  (_a2 = el.avatarRows.querySelector(`tr[data-part="${CSS.escape(part)}"]`)) == null ? void 0 : _a2.focus();
}
async function fetchAvatar() {
  avatarState.asked = true;
  avatarState.loading = true;
  avatarState.note = "";
  el.avatarLoad.disabled = true;
  el.avatarLoad.textContent = "Loading\u2026";
  renderAvatar();
  try {
    avatarState.data = await avatarInfo();
  } catch (err2) {
    avatarState.data = null;
    avatarState.note = err2.message || "Could not read this account's avatar.";
  } finally {
    avatarState.loading = false;
    el.avatarLoad.disabled = false;
    el.avatarLoad.textContent = "Get avatar";
    renderAvatar();
  }
}
var AVATAR_NAMES = {
  facehair: "Facial hair",
  lash: "Lashes",
  lashLower: "Lower lashes",
  outfitMode: "Outfit",
  mmMode: "Mix and match",
  bot: "Bottom",
  hairFlip: "Flipped",
  parameter: "Shade",
  parameters: "Fine shape",
  editor_ui: "Editor"
};
function avatarName(step) {
  const s = step.replace(/_(input|geo|base)$/i, "");
  if (AVATAR_NAMES[s]) return AVATAR_NAMES[s];
  return words2(
    s.replace(/PColor$/, " color").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ")
  );
}
function avatarKey(key) {
  const steps = key.replace(/^root\/?/, "").split("/").filter(Boolean);
  if (!steps.length) return ["Avatar", "Base"];
  if (steps[0] === "editor_ui_enabled") return ["Editor", "Sliders"];
  if (steps[0] === "editor_ui" && steps.length === 2) {
    const [group, ...rest] = steps[1].split("_");
    if (rest.length) return [avatarName(group), avatarName(rest.join("_"))];
  }
  return [avatarName(steps[0]), steps.length > 1 ? steps.slice(1).map(avatarName).join(" \u203A ") : "Item"];
}
function avatarSetting(s) {
  if (s.kind === "slider") {
    if (!Number.isFinite(s.value)) return "\u2014";
    const pct = Math.round(Math.min(1, Math.max(0, s.value)) * 100);
    return `<span class="av-slider"><span class="rev-hist-track"><span class="rev-hist-fill" style="width:${pct}%"></span></span><span class="av-val">${esc(
      s.value.toFixed(2)
    )}</span></span>`;
  }
  if (s.kind === "switch") return s.value ? "On" : "Off";
  if (s.kind === "item") {
    return `<span class="av-val"${s.asset ? ` title="${esc(`From asset ${s.asset}`)}"` : ""}>${esc(s.value)}</span>`;
  }
  return esc(s.value || "\u2014");
}
function renderAvatar() {
  var _a2, _b2, _c, _d, _e, _f;
  const { data, asked, loading, note: note2 } = avatarState;
  const a = data != null ? data : {};
  el.avatarFacts.innerHTML = data ? factGroups([
    [
      "Avatar",
      [
        ["Style", a.style ? words2(a.style) : null],
        ["Has an avatar", yesNo(a.hasAvatar)],
        ["Can use style 2", yesNo(a.eligible)],
        ["Has to move styles", yesNo(a.migrate)],
        ["Held back for an OS update", yesNo(a.blockedForOs)]
      ]
    ],
    ["Horizon gates", ((_a2 = a.gates) != null ? _a2 : []).map(([k, v]) => [esc(words2(k.replace(/^enable_/, ""))), v ? "On" : "Off"])]
  ]) : "";
  const settings = (_b2 = a.settings) != null ? _b2 : [];
  const q = el.avatarQ.value.trim().toLowerCase();
  const shown = settings.map((s) => ({ s, k: avatarKey(s.key) })).filter(({ s, k }) => !q || `${k.join(" ")} ${s.key}`.toLowerCase().includes(q));
  const parts = /* @__PURE__ */ new Map();
  for (const r of shown) {
    if (!parts.has(r.k[0])) parts.set(r.k[0], []);
    parts.get(r.k[0]).push(r);
  }
  const detail = (rows2) => `<tr class="detail"><td colspan="2"><div class="vscroll short">
      <table class="vtable plain av-table">
        <thead><tr><th>Setting</th><th>Value</th></tr></thead>
        <tbody>${rows2.map(({ s, k }) => `<tr><td title="${esc(s.key)}">${esc(k[1])}</td><td>${avatarSetting(s)}</td></tr>`).join("")}</tbody>
      </table></div></td></tr>`;
  const focused = (_e = (_d = (_c = document.activeElement) == null ? void 0 : _c.closest) == null ? void 0 : _d.call(_c, "#avatarRows tr[data-part]")) == null ? void 0 : _e.dataset.part;
  el.avatarRows.innerHTML = [...parts].map(([part, rows2]) => {
    const open2 = q ? true : avatarOpen.has(part);
    return `<tr class="app" tabindex="0" data-part="${esc(part)}" aria-expanded="${open2}">
        <td class="name">${esc(part)}</td>
        <td>${esc(plural(rows2.length, "setting"))}</td>
      </tr>${open2 ? detail(rows2) : ""}`;
  }).join("");
  if (focused) (_f = el.avatarRows.querySelector(`tr[data-part="${CSS.escape(focused)}"]`)) == null ? void 0 : _f.focus();
  const rows = shown;
  el.avatarCount.textContent = settings.length ? q ? `${rows.length} of ${plural(settings.length, "setting")}` : `${plural(settings.length, "setting")} across ${plural(new Set(settings.map((s) => avatarKey(s.key)[0])).size, "part")}` : "";
  const empty = !asked ? "Press Get avatar to read this account's avatar." : loading ? "" : note2 ? note2 : !settings.length ? data ? "The store returned no saved avatar settings." : "" : !rows.length ? "Nothing matches that filter." : "";
  el.avatarEmpty.hidden = !empty;
  el.avatarEmpty.textContent = empty;
  el.avatarEmpty.classList.toggle("warn", Boolean(note2));
}
function prettyStatus(s) {
  if (!s) return "";
  return String(s).toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
async function loadPTCStatuses() {
  const serials = deviceList.filter((d) => d.ownership !== "shared" && d.serial).map((d) => d.serial);
  await Promise.all(serials.map((s) => loadPTCStatus(s)));
}
async function loadPTCStatus(serial) {
  ptcStatus.set(serial, "loading");
  renderDevices();
  try {
    ptcStatus.set(serial, await devicePTCStatus(serial));
  } catch (err2) {
    ptcStatus.set(serial, { error: err2.message || "unknown" });
  }
  renderDevices();
}
async function loadPresence() {
  try {
    presenceState.data = await recentPresence();
    presenceState.note = "";
  } catch (err2) {
    presenceState.data = null;
    presenceState.note = err2.message || "Could not read when this account was last active.";
  }
  renderDevices();
}
function presenceLine() {
  var _a2;
  if (presenceState.note) return `Last active: ${presenceState.note}`;
  const p = presenceState.data;
  if (!(p == null ? void 0 : p.lastActive)) return "";
  const when = new Date(p.lastActive * 1e3).toISOString().slice(0, 16).replace("T", " ");
  const where = (_a2 = p.app) != null ? _a2 : p.destination ? words2(p.destination) : null;
  const session = p.match ? ", in a match" : p.lobby ? ", in a lobby" : "";
  const party = p.party ? ` (${p.party} in the lobby)` : "";
  return `${p.current ? "Active now" : "Last active"} \u2014 ${when} UTC${where ? `, in ${where}` : ""}${session}${party}.`;
}
function maskSerial(serial) {
  const s = String(serial != null ? serial : "");
  return s.length > 1 ? "\u2022".repeat(s.length - 1) + s.slice(-1) : s;
}
function deviceStatus(d) {
  if (!d.wipeStatus || d.wipeStatus === "NONE") return "\u2014";
  if (d.wipeStatus === "PENDING") return "Remote wipe pending";
  return words2(d.wipeStatus);
}
function sortDevices(list, mode) {
  const byModel = (a, b) => {
    var _a2, _b2;
    return ((_a2 = a.model) != null ? _a2 : "").localeCompare((_b2 = b.model) != null ? _b2 : "") || a.serial.localeCompare(b.serial);
  };
  return [...list].sort(mode === "modelZa" ? (a, b) => -byModel(a, b) : byModel);
}
var DEVICE_IMAGES = {
  OCULUS_MONTEREY: "img/Quest1.png",
  OCULUS_HOLLYWOOD: "img/Quest2.png",
  OCULUS_SEACLIFF: "img/QuestPro.png",
  OCULUS_EUREKA: "img/Quest3.webp",
  OCULUS_PANTHER: "img/Quest3S.png"
};
function deviceImage(d) {
  var _a2, _b2;
  const type = ((_a2 = d.deviceType) != null ? _a2 : "").toUpperCase();
  const model = ((_b2 = d.model) != null ? _b2 : "").toLowerCase();
  const xbox = /xbox/.test(model);
  if (DEVICE_IMAGES[type]) {
    return type === "OCULUS_PANTHER" && xbox ? "img/Quest3SXbox.png" : DEVICE_IMAGES[type];
  }
  if (xbox) return "img/Quest3SXbox.png";
  if (/quest\s*3s/.test(model)) return "img/Quest3S.png";
  if (/quest\s*3/.test(model)) return "img/Quest3.webp";
  if (/quest\s*pro/.test(model)) return "img/QuestPro.png";
  if (/quest\s*2/.test(model)) return "img/Quest2.png";
  if (/^(meta |oculus )?quest$/.test(model.trim())) return "img/Quest1.png";
  return null;
}
function deviceRowsHtml(list, { testChannel = true } = {}) {
  const art = loadSettings().images;
  return list.map(
    (d) => {
      var _a2;
      return `<tr>
      <td class="name">${art && deviceImage(d) ? `<img class="art" src="${esc(deviceImage(d))}" alt="" loading="lazy">` : ""}${esc((_a2 = d.model) != null ? _a2 : "Unknown device")}</td>
      <td class="num">${esc(showSerials ? d.serial : maskSerial(d.serial))}</td>
      <td>${esc(deviceStatus(d))}</td>${testChannel ? `
      <td class="ptc-cell">${ptcButtons(d.serial)}</td>` : ""}
    </tr>`;
    }
  ).join("");
}
function ptcButtons(serial) {
  const button = (on, disabled = false) => `<button type="button" class="ptc-btn ${on ? "ptc-on" : "ptc-off"}" data-ptc-serial="${esc(serial)}"
       data-ptc-on="${on ? 1 : 0}"${disabled ? " disabled" : ""}>${on ? "Enable" : "Disable"}</button>`;
  const s = ptcStatus.get(serial);
  if (!s || s === "loading") return "";
  if (s.error) return button(true) + button(false);
  if (!s.allowed) return button(true, true);
  return s.enabled ? button(false) : button(true);
}
function setPtcOut(text, bad = false) {
  el.ptcOut.textContent = text;
  el.ptcOut.classList.toggle("bad", bad);
  el.ptcOut.hidden = !text;
}
function onDevicePTCClick(e) {
  const button = e.target.closest("[data-ptc-serial]");
  if (!button) return;
  setDevicePTCOne(button.dataset.ptcSerial, button.dataset.ptcOn === "1", button);
}
async function setDevicePTCOne(serial, enabled, button) {
  const buttons = [...button.closest("tr").querySelectorAll(".ptc-btn")];
  buttons.forEach((b) => b.disabled = true);
  setPtcOut(`${enabled ? "Enabling" : "Disabling"} the test channel on ${serial}\u2026`);
  try {
    await setDevicePTC(serial, enabled);
    loadPTCStatus(serial);
    setPtcOut(
      `Test channel ${enabled ? "on" : "off"} for ${serial}. The headset picks
       the change up when it next looks for an update.`
    );
  } catch (err2) {
    setPtcOut(`Not changed: ${err2.message}`, true);
  }
  buttons.forEach((b) => b.disabled = false);
  syncRelayNote();
}
function renderDevices() {
  const q = el.devicesQ.value.trim().toLowerCase();
  const match = (d) => {
    var _a2;
    return !q || d.serial.toLowerCase().includes(q) || ((_a2 = d.model) != null ? _a2 : "").toLowerCase().includes(q);
  };
  const mode = el.devicesSort.value;
  const ownedAll = deviceList.filter((d) => d.ownership !== "shared");
  const sharedAll = deviceList.filter((d) => d.ownership === "shared");
  const owned = sortDevices(ownedAll.filter(match), mode);
  const shared = sortDevices(sharedAll.filter(match), mode);
  el.devicesRows.innerHTML = deviceRowsHtml(owned);
  el.devicesEmpty.hidden = owned.length > 0 || devicesLoading;
  el.devicesEmpty.textContent = devicesLoading ? "" : devicesNote ? devicesNote : !devicesAsked ? "Press Get devices to list the headsets on this account." : ownedAll.length ? "Nothing matches." : "No devices found on this account.";
  el.devicesCount.textContent = devicesLoading ? "Asking the store\u2026" : !devicesAsked || devicesNote ? "" : owned.length === ownedAll.length ? `${ownedAll.length} device${ownedAll.length === 1 ? "" : "s"}.` : `${owned.length} of ${ownedAll.length} devices.`;
  const presence = devicesLoading ? "" : presenceLine();
  el.devicesPresence.textContent = presence;
  el.devicesPresence.hidden = !presence;
  el.sharedSection.hidden = !devicesAsked || devicesLoading || sharedAll.length === 0;
  el.sharedRows.innerHTML = deviceRowsHtml(shared, { testChannel: false });
  el.sharedCount.textContent = shared.length === sharedAll.length ? `${sharedAll.length} shared device${sharedAll.length === 1 ? "" : "s"}.` : `${shared.length} of ${sharedAll.length} shared devices.`;
}
var LOG_MAX = 300;
function appendLog(d) {
  const line = document.createElement("div");
  const bad = Boolean(d.error) || d.status >= 400;
  line.className = bad ? "logline bad" : "logline";
  const time = (/* @__PURE__ */ new Date()).toLocaleTimeString();
  const head = d.error ? `\u2717 ${d.error}` : `${d.status} \xB7 ${d.ms}ms`;
  line.textContent = `${time}  ${head}  ${d.url}`;
  el.logBox.append(line);
  while (el.logBox.children.length > LOG_MAX) el.logBox.firstChild.remove();
  el.logBox.scrollTop = el.logBox.scrollHeight;
}
function initExtSignIn() {
  const button = document.getElementById("extSignIn");
  const refresh = document.getElementById("extRefresh");
  const out = document.getElementById("extSignInOut");
  let found = false;
  let busy = null;
  const reset = () => {
    busy = null;
    button.disabled = refresh.disabled = false;
    syncExtSignIn();
  };
  const status = (text) => {
    out.textContent = text;
    out.hidden = false;
    document.getElementById("extSignedIn").hidden = true;
  };
  window.addEventListener("message", (e) => {
    var _a2, _b2;
    if (e.source !== window || e.origin !== location.origin || !((_a2 = e.data) == null ? void 0 : _a2.metadbExt)) return;
    const m = e.data;
    if (m.type === "here") {
      found = true;
      button.dataset.found = "1";
      out.textContent = "The MetaDB Sign-in extension is installed. Sign in with Meta fills in both tokens below from your Meta login.";
      syncExtSignIn();
      if ((_b2 = m.update) == null ? void 0 : _b2.version) {
        const note2 = document.getElementById("extUpdate");
        const a = document.createElement("a");
        a.href = "downloads/MetaDB-extension.zip";
        a.download = "MetaDB-extension.zip";
        a.textContent = "download it";
        note2.replaceChildren(
          `Version ${m.update.version} of the extension is out (you have ${m.version}) \u2014 `,
          a,
          ", unzip it over the extension's folder, and press Reload in the extension's menu."
        );
        note2.hidden = false;
      }
    } else if (m.type === "login") {
      if (busy) busy.textContent = "Waiting for Meta's login\u2026";
      status("Log in to Meta in the tab that opened. This fills in by itself once you are done.");
    } else if (m.type === "tokens" && m.token && m.acToken) {
      const was = busy;
      const same = el.token.value.trim() === m.token && el.acToken.value.trim() === m.acToken;
      el.token.value = m.token;
      el.acToken.value = m.acToken;
      el.settingsForm.requestSubmit();
      reset();
      uiNotice(
        was !== refresh ? "Signed in with Meta." : same ? "Tokens are already up to date." : "Tokens refreshed from your Meta login."
      );
    } else if (m.type === "cancelled" || m.type === "error") {
      reset();
      status(
        m.type === "cancelled" ? "Meta's login was closed before it finished. Press the button again to try again." : `The extension could not answer: ${m.message}`
      );
    }
  });
  window.postMessage({ metadbPage: true, type: "hello" }, location.origin);
  const ask = (which, label) => {
    busy = which;
    button.disabled = refresh.disabled = true;
    which.textContent = label;
    window.postMessage({ metadbPage: true, type: "sign-in" }, location.origin);
  };
  button.addEventListener("click", () => {
    if (dgSignedIn()) {
      signOut();
      return;
    }
    if (!found) {
      go("/getapp");
      requestAnimationFrame(() => {
        var _a2;
        return (_a2 = document.getElementById("getext")) == null ? void 0 : _a2.scrollIntoView();
      });
      return;
    }
    ask(button, "Signing in\u2026");
  });
  refresh.addEventListener("click", () => ask(refresh, "Refreshing\u2026"));
  syncExtSignIn();
}
function syncExtSignIn() {
  if (IN_APP) return;
  const button = document.getElementById("extSignIn");
  if (button.disabled) return;
  const signed = dgSignedIn();
  const refresh = document.getElementById("extRefresh");
  button.textContent = signed ? "Sign out" : "Sign in with Meta";
  refresh.textContent = "Refresh tokens";
  refresh.hidden = !signed || !button.dataset.found;
  document.getElementById("extSignInOut").hidden = signed;
  document.getElementById("extSignedIn").hidden = !signed;
}
function initSettings() {
  var _a2;
  if (IN_APP) {
    document.getElementById("appSignInField").hidden = false;
    document.getElementById("appSignIn").addEventListener("click", () => window.MetaDBApp.signIn("settings"));
    document.getElementById("appSignOut").addEventListener("click", signOut);
    syncAppSignIn();
  } else {
    initExtSignIn();
  }
  const saved = loadSettings();
  el.token.value = (_a2 = localStorage.getItem("metadb.token")) != null ? _a2 : "";
  el.acToken.value = saved.acToken;
  el.relay.value = saved.relay;
  syncRelayNote();
  el.settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      saveSettings({
        token: el.token.value.trim(),
        acToken: el.acToken.value.trim(),
        relay: el.relay.value.trim()
      });
      syncRelayNote();
      syncExtSignIn();
      say("Saved.", "ok");
    } catch (err2) {
      say(err2.message, "bad");
    }
  });
  el.saveTokens.addEventListener("click", () => {
    const token = el.token.value.trim();
    const acToken = el.acToken.value.trim();
    try {
      saveSettings({ token, acToken });
      syncExtSignIn();
      renderAll();
      tell(
        [
          token ? "Access token saved." : "Access token cleared \u2014 using the built-in one.",
          acToken ? "Account token saved." : "No account token, so downloads stay off."
        ].join(" "),
        "ok"
      );
    } catch (err2) {
      tell(err2.message, "bad");
    }
  });
  for (const [node, key] of [
    [el.images, "images"],
    [el.details, "details"],
    [el.devDownloads, "devDownloads"],
    [el.binDownload, "binDownload"],
    [el.obb, "obb"],
    [el.wide, "wide"],
    [el.motion, "motion"]
  ]) {
    node.checked = saved[key];
    node.addEventListener("change", () => {
      saveSettings({ [key]: node.checked });
      if (key === "wide" && !node.checked) closeStage();
      if (key === "binDownload") syncBinRow();
      renderAll();
    });
  }
  syncBinRow();
  el.store.checked = saved.store;
  el.store.addEventListener("change", () => {
    saveSettings({ store: el.store.checked ? "1" : "0" });
    renderAll();
  });
  el.autoOwned.checked = saved.autoOwned;
  el.autoOwned.addEventListener("change", () => {
    saveSettings({ autoOwned: el.autoOwned.checked });
    if (el.autoOwned.checked && !mineAsked) loadEntitlements("quest");
    else renderAll();
  });
  for (const [node, key, load, state] of [
    [el.autoDlc, "autoDlc", () => loadIaps(), iapState],
    [el.autoPlaytime, "autoPlaytime", () => loadPlaytime(), playState],
    [el.autoBackups, "autoBackups", () => loadBackups(), backupState]
  ]) {
    node.checked = saved[key];
    node.addEventListener("change", () => {
      saveSettings({ [key]: node.checked });
      if (node.checked && !state.asked) load();
    });
  }
  el.log.checked = saved.log;
  el.logField.hidden = !saved.log;
  el.log.addEventListener("change", () => {
    saveSettings({ log: el.log.checked });
    el.logField.hidden = !el.log.checked;
  });
  el.logClear.addEventListener("click", () => {
    el.logBox.replaceChildren();
  });
  window.addEventListener("metadb:log", (e) => appendLog(e.detail));
  el.clearBtn.addEventListener("click", () => {
    clearSettings();
    if (IN_APP) {
      window.MetaDBApp.signOut();
      saveSettings({ relay: window.MetaDBApp.relay() });
    }
    el.token.value = "";
    el.acToken.value = "";
    tell("", "");
    el.relay.value = IN_APP ? window.MetaDBApp.relay() : "";
    el.images.checked = false;
    el.details.checked = false;
    el.devDownloads.checked = false;
    el.autoOwned.checked = false;
    el.autoDlc.checked = false;
    el.autoPlaytime.checked = false;
    el.autoBackups.checked = false;
    el.binDownload.checked = false;
    syncBinRow();
    el.log.checked = false;
    el.logField.hidden = true;
    el.logBox.replaceChildren();
    el.store.checked = true;
    for (const box of el.cols.querySelectorAll("input")) box.checked = true;
    applyColumns();
    const fresh = loadSettings();
    el.defHmd.value = el.hmd.value = fresh.hmd;
    el.defSort.value = el.sort.value = fresh.searchSort;
    el.defBuildSort.value = fresh.buildSort;
    syncRelayNote();
    syncExtSignIn();
    say(IN_APP ? "Cleared, and signed out of Meta." : "Cleared. Back to the built-in token and no relay.", "ok");
  });
  el.useLocal.addEventListener("click", () => {
    el.relay.value = "http://127.0.0.1:8788/?url={url}";
    saveSettings({ relay: el.relay.value });
    syncRelayNote();
    say("Set to the local relay. Start it with: node tools/relay.mjs", "ok");
  });
  el.testBtn.addEventListener("click", async () => {
    saveSettings({
      token: el.token.value.trim(),
      acToken: el.acToken.value.trim(),
      relay: el.relay.value.trim()
    });
    el.testBtn.disabled = true;
    say("Testing\u2026", "");
    try {
      const probe = listing.find((a) => a.id);
      if (!probe) throw new Error("no app to test with \u2014 search for one first");
      const latest = await checkApp(probe);
      syncRelayNote();
      say(`Works \u2014 ${probe.name} reports ${latest.version} on ${latest.channel}.`, "ok");
    } catch (err2) {
      say(`Failed: ${err2.message}`, "bad");
    }
    el.testBtn.disabled = false;
  });
}
function initDefaults() {
  const saved = loadSettings();
  fillOptions(el.defHmd, HMD_TYPES.map(([v, label]) => [v, `${label} (${v})`]));
  fillOptions(el.defSort, [...el.sort.options].map((o) => [o.value, o.textContent]));
  fillOptions(
    el.defMineSort,
    [...el.mineSort.options].map((o) => [o.value, o.textContent])
  );
  fillOptions(el.defBuildSort, BUILD_SORT_LABELS);
  fillOptions(el.defTrigger, DEFAULT_APP_TRIGGERS);
  const pairs = [
    [el.defHmd, "hmd", saved.hmd, el.hmd],
    [el.defSort, "searchSort", saved.searchSort, el.sort],
    [el.defMineSort, "mineSort", saved.mineSort, el.mineSort],
    [el.defBuildSort, "buildSort", saved.buildSort, null],
    [el.defTrigger, "defaultTrigger", saved.defaultTrigger, el.defaultTrigger]
  ];
  for (const [picker, key, value, live] of pairs) {
    picker.value = value;
    if (live) live.value = value;
    picker.addEventListener("change", () => {
      saveSettings({ [key]: picker.value });
      if (live) {
        live.value = picker.value;
        live.dispatchEvent(new Event("change"));
      }
    });
  }
}
function fillOptions(select, entries) {
  select.replaceChildren(
    ...entries.map(([value, label]) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      return opt;
    })
  );
}
function initColumns() {
  const hidden = new Set(loadSettings().hidden);
  for (const [cls, label] of COLUMNS) {
    const wrap = document.createElement("label");
    wrap.className = "check";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = !hidden.has(cls);
    box.addEventListener("change", () => {
      box.checked ? hidden.delete(cls) : hidden.add(cls);
      saveSettings({ hidden: [...hidden] });
      applyColumns();
    });
    wrap.append(box, document.createTextNode(` ${label}`));
    el.cols.append(wrap);
  }
  applyColumns();
}
function applyColumns() {
  const hidden = new Set(loadSettings().hidden);
  for (const [cls] of COLUMNS) {
    document.body.classList.toggle(`hide-${cls}`, hidden.has(cls));
  }
}
function syncRelayNote() {
  el.relayNote.hidden = !needsRelay();
}
function say(text, kind) {
  report(el.settingsOut, text, kind);
}
function tell(text, kind) {
  report(el.tokensOut, text, kind);
}
function report(node, text, kind) {
  node.textContent = text;
  node.className = `settings-out ${kind}`;
}
var channelsOf = (app) => {
  var _a2;
  return (_a2 = app.channels) != null ? _a2 : [];
};
function primaryOf(app) {
  var _a2, _b2, _c;
  const list = channelsOf(app);
  return (_c = (_b2 = (_a2 = list.find((c) => c.group === "PRIMARY")) != null ? _a2 : list.find((c) => c.name === "LIVE")) != null ? _b2 : list[0]) != null ? _c : null;
}
async function boot() {
  el.searchGo.addEventListener("click", runSearch);
  el.q.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
  el.q.addEventListener("input", () => {
    if (!el.q.value.trim()) runSearch();
  });
  el.hmd.addEventListener("change", () => {
    if (el.q.value.trim()) runSearch();
  });
  el.sort.addEventListener("change", renderAll);
  const savedLimit = loadSettings().limit;
  if (savedLimit && [...el.limit.options].some((o) => o.value === savedLimit)) {
    el.limit.value = savedLimit;
  }
  el.limit.addEventListener("change", () => {
    saveSettings({ limit: el.limit.value });
    if (el.q.value.trim()) runSearch();
  });
  if (!IN_APP || !document.documentElement.classList.contains("layout-dg")) restoreRoute();
  el.checkAll.addEventListener(
    "click",
    () => checkList(visible(), el.checkAll, "Check shown")
  );
  el.mineQ.addEventListener("input", renderAll);
  el.mineSort.addEventListener("change", renderAll);
  for (const b of el.libButtons) {
    b.addEventListener("click", () => loadEntitlements(b.dataset.lib));
  }
  runSearch();
  if (loadSettings().autoOwned) loadEntitlements("quest");
  const auto = loadSettings();
  if (auto.autoDlc) loadIaps();
  if (auto.autoPlaytime) loadPlaytime();
  if (auto.autoBackups) loadBackups();
}
function fillHmdPicker() {
  for (const [value, label] of HMD_TYPES) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = `${label} (${value})`;
    el.hmd.append(opt);
  }
}
function mineApps() {
  const q = el.mineQ.value.trim().toLowerCase();
  return sorted(
    mineList.filter((a) => matches(a, q)),
    el.mineSort.value
  );
}
var LIBRARIES = {
  quest: {
    label: "Quest",
    asking: "Asking the store what this account owns on Quest\u2026",
    none: "This account owns nothing on Quest that the store will list.",
    noun: "Quest entitlement"
  },
  pc: {
    label: "PC",
    asking: "Asking the store what this account owns on PC\u2026",
    none: "This account owns nothing on PC that the store will list.",
    noun: "PC entitlement"
  },
  expired: {
    label: "expired",
    asking: "Asking the store what this account used to own\u2026",
    none: "Nothing on this account has expired.",
    noun: "expired entitlement"
  }
};
async function loadEntitlements(kind) {
  if (mineLoading) return;
  mineAsked = true;
  mineKind = kind;
  mineLoading = true;
  mineNote = "";
  const labels = new Map([...el.libButtons].map((b) => [b, b.textContent]));
  for (const b of el.libButtons) {
    b.disabled = true;
    if (b.dataset.lib === kind) b.textContent = "Asking\u2026";
  }
  renderAll();
  try {
    mineList = await myEntitlements(kind);
    if (adbInstalled.length) resolveHeadsetApps();
  } catch (err2) {
    mineList = [];
    mineNote = err2.message;
  } finally {
    mineLoading = false;
    for (const [b, label] of labels) {
      b.disabled = false;
      b.textContent = label;
    }
    syncRelayNote();
    renderAll();
  }
}
function pageSize() {
  return el.limit.value === "all" ? Infinity : Number(el.limit.value);
}
function matches(app, q) {
  var _a2, _b2;
  if (!q) return true;
  return app.name.toLowerCase().includes(q) || ((_a2 = app.id) != null ? _a2 : "").includes(q) || ((_b2 = app.packageName) != null ? _b2 : "").toLowerCase().includes(q);
}
var visible = () => sorted(listing, el.sort.value);
var PACKAGE_RE = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+){2,}$/i;
async function runSearch() {
  const raw = el.q.value.trim();
  if (!restoringRoute && (routeView() || "apps") === "apps") setRoute({ q: raw, app: null, tab: null });
  if (!raw) {
    listing = [];
    listingNote = "";
    renderAll();
    return;
  }
  searching = true;
  el.searchGo.disabled = true;
  el.searchGo.textContent = "Searching\u2026";
  listingNote = "";
  renderAll();
  try {
    const id = parseAppId(raw);
    if (id) {
      listing = [await lookupApp(id)];
      listingNote = "fetched by ID";
    } else if (PACKAGE_RE.test(raw)) {
      listing = [await lookupByPackage(raw)];
      listingNote = "resolved from package name";
    } else {
      listing = await searchStore(raw, {
        limit: pageSize(),
        hmdType: el.hmd.value
      });
      listingNote = `store search on ${el.hmd.value}`;
    }
  } catch (err2) {
    listing = [];
    listingNote = `search failed: ${err2.message}`;
  }
  searching = false;
  el.searchGo.disabled = false;
  el.searchGo.textContent = "Search";
  renderAll();
}
var focusId = null;
var focusScope = null;
var openKey = (scope, app) => `${scope}:${keyOf(app)}`;
function buildRows(tbody, list, scope) {
  var _a2, _b2;
  const scrolled = /* @__PURE__ */ new Map();
  for (const d of tbody.querySelectorAll(":scope > tr.detail")) {
    const id = (_a2 = d.previousElementSibling) == null ? void 0 : _a2.dataset.id;
    if (id) scrolled.set(id, saveScrolls(d));
  }
  const out = [];
  for (const app of list) {
    out.push(appRow(app, scope));
    if (open.has(openKey(scope, app))) out.push(detailRow(app, void 0, scope));
  }
  tbody.replaceChildren(...out);
  for (const d of tbody.querySelectorAll(":scope > tr.detail")) {
    const saved = scrolled.get((_b2 = d.previousElementSibling) == null ? void 0 : _b2.dataset.id);
    if (saved) restoreScrolls(d, saved);
  }
}
function scrollKeys(root) {
  const seen = /* @__PURE__ */ new Map();
  return [...root.querySelectorAll(".vscroll")].map((v) => {
    var _a2, _b2, _c, _d;
    let h = v.previousElementSibling;
    while (h && h.tagName !== "H3") h = h.previousElementSibling;
    const base = `${(_b2 = (_a2 = v.closest("[data-pane]")) == null ? void 0 : _a2.dataset.pane) != null ? _b2 : ""}|${(_c = h == null ? void 0 : h.textContent) != null ? _c : ""}`;
    const n = (_d = seen.get(base)) != null ? _d : 0;
    seen.set(base, n + 1);
    return [`${base}|${n}`, v];
  });
}
function saveScrolls(root) {
  const out = /* @__PURE__ */ new Map();
  for (const [key, v] of scrollKeys(root)) if (v.scrollTop) out.set(key, v.scrollTop);
  return out;
}
function restoreScrolls(root, saved) {
  for (const [key, v] of scrollKeys(root)) if (saved.has(key)) v.scrollTop = saved.get(key);
}
function renderAll() {
  var _a2;
  ownedKeys = loadSettings().autoOwned && mineKind !== "expired" ? new Set(mineList.map(keyOf)) : /* @__PURE__ */ new Set();
  const list = visible();
  const idle = !searching && !el.q.value.trim() && !listingNote;
  buildRows(el.rows, list, "main");
  el.empty.hidden = list.length > 0 || searching;
  el.empty.textContent = idle ? "Search the store to begin." : searching ? "" : "No apps matched.";
  el.count.textContent = searching ? "Asking the store\u2026" : idle ? "" : `${list.length} app${list.length === 1 ? "" : "s"}` + (listingNote ? ` \u2014 ${listingNote}` : "");
  const mine = mineApps();
  buildRows(el.mineRows, mine, "mine");
  el.mineCount.textContent = mineStatus(mine.length);
  el.mineEmpty.hidden = mine.length > 0 || mineLoading;
  el.mineEmpty.textContent = mineNote ? mineNote : !mineAsked ? "Press Get Quest, Get PC or Get expired entitlements to list what this account owns." : mineList.length ? "Nothing matches." : LIBRARIES[mineKind].none;
  el.mineEmpty.classList.toggle("warn", Boolean(mineNote));
  const orgShown = orgVisible();
  buildRows(el.orgRows, orgShown, "orgs");
  el.orgEmpty.hidden = orgShown.length > 0 || orgLoading;
  el.orgEmpty.textContent = orgLoading ? "" : orgNote ? orgNote : !orgAsked ? "Enter an organization ID and press List apps." : orgList.length ? "Nothing matches." : "No apps for that organization.";
  el.orgCount.textContent = orgLoading ? "Asking the store\u2026" : !orgAsked || orgNote ? "" : orgShown.length === orgList.length ? `${orgList.length} app${orgList.length === 1 ? "" : "s"}.` : `${orgShown.length} of ${orgList.length} apps.`;
  const defaultShown = defaultVisible();
  buildRows(el.defaultRows, defaultShown, "default");
  el.defaultEmpty.hidden = defaultShown.length > 0 || defaultLoading;
  el.defaultEmpty.textContent = defaultLoading ? "" : defaultNote ? defaultNote : !defaultAsked ? "Pick a headset and trigger, then press Get default apps." : defaultList.length ? "Nothing matches." : "No default apps for that headset and trigger.";
  el.defaultCount.textContent = defaultLoading ? "Asking the store\u2026" : !defaultAsked || defaultNote ? "" : defaultShown.length === defaultList.length ? `${defaultList.length} app${defaultList.length === 1 ? "" : "s"}.` : `${defaultShown.length} of ${defaultList.length} apps.`;
  const plusShown = plusVisible();
  const plusAll = plusState.rows;
  buildRows(el.plusRows, plusShown, "plus");
  el.plusEmpty.hidden = plusShown.length > 0 || plusState.loading;
  el.plusEmpty.textContent = plusState.note ? plusState.note : !plusState.asked ? "Press Get Horizon+ games to list what the subscription offers right now." : plusAll.length ? "Nothing matches." : "The store lists no Horizon+ games for this account.";
  const monthly = plusAll.filter((a) => a.plus === "monthly").length;
  const claimed = plusAll.filter((a) => a.claimed).length;
  el.plusCount.textContent = plusState.loading ? "Asking the store\u2026" : !plusAll.length ? "" : `${plusShown.length === plusAll.length ? plural(plusAll.length, "game") : `${plusShown.length} of ${plusAll.length} games`} \u2014 ${monthly} this month, ${plusAll.length - monthly} in the catalog; ${claimed} on this account.`;
  buildAdbRows();
  if (focusId) {
    (_a2 = (focusScope != null ? focusScope : el.rows).querySelector(`tr.app[data-id="${focusId}"]`)) == null ? void 0 : _a2.focus();
    focusId = null;
    focusScope = null;
  }
}
function mineStatus(shown) {
  if (mineLoading) {
    return LIBRARIES[mineKind].asking;
  }
  if (mineNote || !mineAsked) return "";
  const total = mineList.length;
  const word = `${LIBRARIES[mineKind].noun}${total === 1 ? "" : "s"}`;
  return shown === total ? `${total} ${word}.` : `${shown} of ${total} ${word}.`;
}
function appRow(app, scope) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const key = openKey(scope, app);
  const found = (_a2 = results.get(keyOf(app))) == null ? void 0 : _a2.latest;
  const channels = ((_b2 = found == null ? void 0 : found.channels) == null ? void 0 : _b2.length) ? found.channels : channelsOf(app);
  const primary = (_d = (_c = found != null ? found : primaryOf(app)) != null ? _c : app.latest) != null ? _d : null;
  const extra = Math.max(0, channels.length - 1);
  const showArt = loadSettings().images;
  const isOwned = scope !== "mine" && ownedKeys.has(keyOf(app));
  const tr = document.createElement("tr");
  tr.className = isOwned ? "app owned" : "app";
  tr.dataset.id = keyOf(app);
  tr.tabIndex = 0;
  tr.setAttribute("aria-expanded", String(open.has(key)));
  tr.innerHTML = `
    <td class="name">${showArt && app.image ? `<img class="art" src="${esc(app.image)}" alt="" loading="lazy">` : ""}${esc(app.name)}</td>
    <td class="c-dev">${app.platform ? (_e = DEVICE[app.platform]) != null ? _e : app.platform : "\u2014"}</td>
    <td class="chan c-chan">${esc(
    /* Nothing known until a check runs — the same dash every other unknown
       cell gets, rather than a label that reads as "never released" on apps
       that are live. A check that finds no channel says "unreleased". */
    (_g = (_f = primary == null ? void 0 : primary.name) != null ? _f : primary == null ? void 0 : primary.channel) != null ? _g : "\u2014"
  )}${extra ? ` <span class="more-chan">+${extra}</span>` : ""}</td>
    <td class="num c-price">${app.price ? esc(app.price) : "\u2014"}</td>
    <td class="num c-ver"><span class="clip" title="${esc((_h = primary == null ? void 0 : primary.version) != null ? _h : "")}">${esc(
    (_i = primary == null ? void 0 : primary.version) != null ? _i : "\u2014"
  )}</span></td>
    <td class="num c-build">${(_j = primary == null ? void 0 : primary.versionCode) != null ? _j : "\u2014"}</td>
    <td class="num c-date">${(_l = (_k = primary == null ? void 0 : primary.releasedAt) != null ? _k : app.releasedAt) != null ? _l : "\u2014"}</td>
    ${app.owned ? ownedCells(app) : ""}
    ${devCell(app)}`;
  const toggle = (e) => {
    const row = e.currentTarget;
    const next = row.nextElementSibling;
    const panel = (next == null ? void 0 : next.classList.contains("detail")) ? next : null;
    if (open.has(key)) {
      open.delete(key);
      panel == null ? void 0 : panel.remove();
    } else {
      open.add(key);
      if (!panel) row.after(detailRow(app, void 0, scope));
    }
    row.setAttribute("aria-expanded", String(open.has(key)));
    if (scope === "main" && app.id) {
      const tab = layoutState.panelTabs.get(key);
      setRoute(open.has(key) ? { app: app.id, tab: tab === "store" ? null : tab } : { app: null, tab: null });
    }
  };
  tr.addEventListener("click", toggle);
  tr.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(e);
    }
  });
  return tr;
}
var words2 = (s) => String(s).toLowerCase().replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
var grantLabel = (grant) => !grant || grant === "UNKNOWN" ? "Store" : words2(grant);
function ownedCells(app) {
  const played = app.lastUsed ? new Date(app.lastUsed * 1e3).toISOString().slice(0, 10) : "\u2014";
  return `
    <td class="num c-used">${played}</td>
    <td class="c-state">${esc(app.state ? words2(app.state) : "\u2014")}</td>
    <td class="c-grant">${esc(grantLabel(app.grant))}</td>
    <td class="num c-dlc">${esc(dlcCount(app))}</td>`;
}
function dlcCount(app) {
  var _a2;
  if (mineKind !== "quest" || app.platform === "PC") return "\u2014";
  if (!iapState.asked) return "";
  if (iapState.loading) return "\u2026";
  return String(((_a2 = iapState.byApp.get(app.id)) == null ? void 0 : _a2.length) || "\u2014");
}
function devCell(app) {
  var _a2, _b2, _c;
  const latest = (_a2 = results.get(keyOf(app))) == null ? void 0 : _a2.latest;
  if (!(latest == null ? void 0 : latest.newest)) return `<td class="num c-devb muted-cell">\u2014</td>`;
  const channelTop = Math.max(
    Number(latest.versionCode) || 0,
    ...((_b2 = latest.channels) != null ? _b2 : []).map((c) => Number(c.versionCode) || 0)
  );
  const dev = Number(latest.newest.versionCode) > channelTop ? latest.newest : null;
  if (!dev) return `<td class="num c-devb muted-cell">no</td>`;
  const label = String(dev.version) === String(latest.version) ? `build ${dev.versionCode}` : dev.version;
  const title = `${dev.version} (build ${dev.versionCode}), uploaded ${(_c = dev.releasedAt) != null ? _c : "?"}, on no channel`;
  return `<td class="num c-devb"><span class="clip dev-ahead" title="${esc(
    title
  )}">${esc(label)}</span></td>`;
}
function appPanel(app, { staged = false, scope = null } = {}) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  const found = results.get(keyOf(app));
  const list = ((_b2 = (_a2 = found == null ? void 0 : found.latest) == null ? void 0 : _a2.channels) == null ? void 0 : _b2.length) ? found.latest.channels : channelsOf(app);
  const listed = app.id && listings.get(app.id) || null;
  const store = (_c = listed == null ? void 0 : listed.data) != null ? _c : null;
  const L = found == null ? void 0 : found.latest;
  const newest = (L == null ? void 0 : L.newest) ? [
    ["Newest build", `${L.newest.version} (build ${L.newest.versionCode})`],
    [
      "Uploaded",
      `${L.newest.releasedAt} \u2014 ${L.newest.channels.length ? L.newest.channels.join(", ") : "no channel"}`
    ]
  ] : [];
  const groups = [
    [
      "App",
      [
        ["App ID", app.id],
        /* The organization comes back with the store listing, so it fills in
           once the app has been checked. */
        ["Organization", store == null ? void 0 : store.orgId],
        ["Package", app.packageName],
        ["Device", app.platform ? (_d = DEVICE[app.platform]) != null ? _d : app.platform : null],
        ["Price", app.price]
      ]
    ],
    [
      "Builds",
      L ? [
        ["Latest release", `${L.version} (build ${L.versionCode})`],
        ["Released", `${L.releasedAt} on ${L.channel}`],
        ...newest,
        ["On record", L.total]
      ] : []
    ],
    [
      "Listing",
      store ? [
        ["Category", store.category],
        ["Genres", commas(store.genres)],
        ["Game modes", commas(store.modes)],
        [
          "Rating",
          store.ratingCount ? `${store.rating} \u2014 ${store.ratingCount} ratings` : store.rating
        ],
        ["On the store", store.released],
        ["In-app ads", store.hasAds ? "yes" : null]
      ] : []
    ],
    [
      "Supports",
      store ? [
        ["Player modes", commas(store.playerModes)],
        ["Controllers", commas(store.controllers)],
        ["Platforms", commas(store.platforms)],
        ["Languages", commas(store.languages)],
        ["Internet", store.internet],
        ["Comfort", store.comfort]
      ] : []
    ],
    [
      "Published by",
      store ? [
        ["Publisher", store.publisher],
        /* Only its own line when it is not just the publisher again. */
        ["Developer", store.developer === store.publisher ? null : store.developer],
        ["Installs at", store.installSize]
      ] : []
    ]
  ];
  const opts = loadSettings();
  const storeLink = app.id && opts.store ? `<a href="https://www.meta.com/experiences/${app.id}/" target="_blank"
           rel="noopener">Open in store</a>` : "";
  const actions = app.id ? `<button type="button" data-check="1">Check this app</button>${/* Binary info reads Android builds only; a Rift app has nothing to show. */
  opts.details && app.platform !== "PC" ? `<button type="button" data-info="1">Latest Binary Info</button>` : ""}${/* Shown on every free app that carries an offer. The store refuses a
     claim on anything priced, so the button only appears where it can
     actually succeed — and not on the Entitlements screen, where every
     app is one the account already has. */
  app.free && app.offerId && scope !== "mine" ? `<button type="button" data-claim="1">Get entitlement</button>` : ""}${storeLink}` : `<button type="button" data-resolve="1">Find store ID</button>`;
  const mineCh = app.id ? myChannels.get(app.id) : null;
  const onChannel = (mineCh == null ? void 0 : mineCh.current) ? (_f = (_e = mineCh.channels.find((c) => c.id === mineCh.current)) == null ? void 0 : _e.name) != null ? _f : null : null;
  const onLine = onChannel ? `<p class="hint">This account is on <strong>${esc(onChannel)}</strong>.</p>` : "";
  const channelTable = list.length ? `<h3>Channels</h3>${onLine}
       <div class="vscroll short">
         <table class="vtable plain">
           <thead>
             <tr><th>Channel</th><th>Version</th><th>Build</th><th>Date</th></tr>
           </thead>
           <tbody>
             ${list.map(
    (c) => {
      var _a3, _b3, _c2;
      return `<tr>
                   <td>${esc(c.name)}</td>
                   <td>${esc((_a3 = c.version) != null ? _a3 : "\u2014")}</td>
                   <td>${(_b3 = c.versionCode) != null ? _b3 : "\u2014"}</td>
                   <td>${(_c2 = c.releasedAt) != null ? _c2 : "\u2014"}</td>
                 </tr>`;
    }
  ).join("")}
           </tbody>
         </table>
       </div>` : `<p>${!app.id ? "No store ID to check against." : found ? "No published channel." : "Not checked yet \u2014 press Check this app for its channels and builds."}</p>`;
  const revs = staged ? (_g = L == null ? void 0 : L.revisions) != null ? _g : [] : [];
  const revisionTable = revs.length ? `<div class="revisions">
         <h3>Revisions</h3>
         <div class="vscroll short">
           <table class="vtable plain">
             <thead>
               <tr><th>Status</th><th>Created</th><th>Submissions</th><th>ID</th></tr>
             </thead>
             <tbody>
               ${revs.map(
    (r) => {
      var _a3, _b3, _c2;
      return `<tr>
                     <td>${esc((_a3 = r.status) != null ? _a3 : "\u2014")}</td>
                     <td>${esc((_b3 = r.created) != null ? _b3 : "\u2014")}</td>
                     <td>${r.submissions}</td>
                     <td class="bid">${esc((_c2 = r.id) != null ? _c2 : "\u2014")}</td>
                   </tr>`;
    }
  ).join("")}
             </tbody>
           </table>
         </div>
       </div>` : "";
  const panel = document.createElement("div");
  panel.className = "panel";
  const tabKey = `${staged ? "stage" : scope}:${keyOf(app)}`;
  const tab = (_h = layoutState.panelTabs.get(tabKey)) != null ? _h : "store";
  if (tab === "mine") setTimeout(() => wantYourCopy());
  const storeFacts = `${factGroups(groups)}${(listed == null ? void 0 : listed.error) ? `<p class="warn">No store listing: ${esc(listed.error)}</p>` : ""}`;
  const channelBlock = revisionTable ? `<div class="chan-rev"><div class="chans-col">${channelTable}</div>${revisionTable}</div>` : channelTable;
  const pane = (name) => `data-pane="${name}"${tab === name ? "" : " hidden"}`;
  const tabButton = (name, label) => `<button type="button" class="companion-tab${tab === name ? " on" : ""}" data-panel-tab="${name}"
       role="tab" aria-selected="${tab === name}">${label}</button>`;
  const actionsHidden = ["mine", "reviews", "addons", "achievements"].includes(tab);
  const sharedActions = `<div data-app-actions${actionsHidden ? " hidden" : ""}>
         ${actions ? `<div class="actions">${actions}</div>` : ""}
         <div class="claim-out"></div>
         <div class="resolve-out"></div>
         <div class="info-out"></div>
       </div>`;
  const main = `<div class="companion-tabs panel-tabs" role="tablist" aria-label="${esc(app.name)}">
         ${tabButton("store", "Store")}${tabButton("builds", "Builds")}${tabButton("reviews", "Reviews")}${tabButton("addons", "Add-ons")}${tabButton("achievements", "Achievements")}${tabButton("mine", "Entitlement")}
       </div>
       ${sharedActions}
       <div ${pane("store")}>${storeFacts || "<p>Not checked yet \u2014 the listing arrives with Check this app.</p>"}</div>
       <div ${pane("builds")}>${channelBlock}${app.id && app.platform !== "PC" ? `<div class="relnotes"><div class="controls"><button type="button" data-relnotes-get>Release notes</button></div><div class="relnotes-out"></div></div>` : ""}<div class="versions-out"></div></div>
       <div ${pane("reviews")} class="reviews-pane">${reviewsPaneHtml(app)}</div>
       <div ${pane("addons")} class="addons-pane">${addonsPaneHtml(app)}</div>
       <div ${pane("achievements")} class="ach-pane">${achPaneHtml(app)}</div>
       <div ${pane("mine")}>${yourCopy(app)}</div>`;
  panel.dataset.tab = tab;
  panel.innerHTML = `
    ${opts.wide ? `<button type="button" class="stage-btn" data-stage>${staged ? "Close" : "Expand"}</button>` : ""}
    ${staged ? `<h3 class="stage-title">${esc(app.name)}</h3>` : ""}
    <div class="panel__side">
      ${/* Cover art is cover art wherever it appears: with app art turned off,
     no image is fetched from Meta's CDN here either — and the rest of the
     store's pictures are not offered, since fetching them is the whole
     point of the button. */
  staged && opts.images && (app.image || app.id) ? `<div class="artbox">
               ${app.image ? `<img class="panel__art" src="${esc(app.image)}" alt="">` : ""}
               ${app.id ? `<button type="button" data-images="1">Show more images</button>
                      <div class="images-out"></div>` : ""}
             </div>` : ""}
      ${note(found)}
    </div>
    <div class="panel__main">
      ${main}
    </div>`;
  for (const b of panel.querySelectorAll("[data-panel-tab]")) {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      const name = b.dataset.panelTab;
      layoutState.panelTabs.set(tabKey, name);
      if (scope === "main" && app.id) setRoute({ app: app.id, tab: name === "store" ? null : name });
      for (const x of panel.querySelectorAll("[data-panel-tab]")) {
        const on = x === b;
        x.classList.toggle("on", on);
        x.setAttribute("aria-selected", String(on));
      }
      for (const p of panel.querySelectorAll("[data-pane]")) p.hidden = p.dataset.pane !== name;
      panel.dataset.tab = name;
      const shared = panel.querySelector("[data-app-actions]");
      if (shared) shared.hidden = ["mine", "reviews", "addons", "achievements"].includes(name);
      if (name === "mine") wantYourCopy();
    });
  }
  for (const b of panel.querySelectorAll("[data-load]")) {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      b.disabled = true;
      b.textContent = "Loading\u2026";
      loadForApp(app, b.dataset.load);
    });
  }
  (_i = panel.querySelector("[data-stage]")) == null ? void 0 : _i.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleStage(app, scope);
  });
  (_j = panel.querySelector("[data-check]")) == null ? void 0 : _j.addEventListener("click", (e) => {
    e.stopPropagation();
    checkOne(app, { channel: true });
  });
  (_k = panel.querySelector("[data-images]")) == null ? void 0 : _k.addEventListener("click", (e) => {
    e.stopPropagation();
    showImages(app, e.currentTarget, panel.querySelector(".images-out"));
  });
  (_l = panel.querySelector("[data-claim]")) == null ? void 0 : _l.addEventListener("click", (e) => {
    e.stopPropagation();
    claimOne(app, panel.querySelector(".claim-out"), e.currentTarget);
  });
  (_m = panel.querySelector("[data-resolve]")) == null ? void 0 : _m.addEventListener("click", (e) => {
    e.stopPropagation();
    resolveId(app, panel.querySelector(".resolve-out"), e.currentTarget);
  });
  const infoBtn = panel.querySelector("[data-info]");
  if (infoBtn) {
    const infoOut = panel.querySelector(".info-out");
    syncInfoButton(infoBtn, app);
    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleAppInfo(app, infoOut, infoBtn);
    });
    if (infoOpen.has(app.id) && infoCache.has(app.id)) {
      drawAppInfo(infoOut, infoCache.get(app.id));
    }
  }
  if (app.onHeadset || IN_APP && !isRift(app)) {
    (_n = panel.querySelector(".versions-out")) == null ? void 0 : _n.addEventListener("click", (e) => {
      const button = e.target.closest("[data-install-build]");
      if (!button) return;
      e.stopPropagation();
      installBuild(app, button.dataset, button);
    });
  }
  if (isRift(app)) {
    (_o = panel.querySelector(".versions-out")) == null ? void 0 : _o.addEventListener("click", (e) => {
      const button = e.target.closest("[data-rift-build]");
      if (!button) return;
      e.stopPropagation();
      downloadRiftBuild(app, button.dataset, button);
    });
  }
  if (versionCache.has(app.id)) {
    drawVersions(
      panel.querySelector(".versions-out"),
      versionCache.get(app.id),
      VERSION_PAGE,
      void 0,
      false,
      app
    );
  }
  const reviewsPane = panel.querySelector('[data-pane="reviews"]');
  if (reviewsPane) wireReviews(app, reviewsPane);
  const addonsPane = panel.querySelector('[data-pane="addons"]');
  if (addonsPane) wireAddons(app, addonsPane);
  const achPane = panel.querySelector('[data-pane="achievements"]');
  if (achPane) wireAch(app, achPane);
  const relnotesOut = panel.querySelector(".relnotes-out");
  if (relnotesOut) {
    (_p = panel.querySelector("[data-relnotes-get]")) == null ? void 0 : _p.addEventListener("click", (e) => {
      e.stopPropagation();
      loadRelNotes(app, relnotesOut, e.currentTarget);
    });
    if (relNotesCache.has(app.id)) {
      drawRelNotes(relnotesOut, relNotesCache.get(app.id));
      const b = panel.querySelector("[data-relnotes-get]");
      if (b) b.hidden = true;
    }
  }
  return panel;
}
async function loadRelNotes(app, out, button) {
  button.disabled = true;
  button.textContent = "Loading\u2026";
  try {
    const map = await releaseNotes(app.id);
    relNotesCache.set(app.id, map);
    drawRelNotes(out, map);
    button.hidden = true;
  } catch (err2) {
    button.disabled = false;
    button.textContent = "Release notes";
    paneError(out, "relnotes-error", `Could not load release notes: ${err2.message}`);
  }
}
function drawRelNotes(out, map) {
  if (!map.size) {
    out.innerHTML = `<p class="hint">The store has no release notes for this app.</p>`;
    return;
  }
  const rows = [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0])).map(
    ([code, { version, notes }]) => `<div class="relnote">
        <div class="relnote-ver">${esc(version != null ? version : code)} <span class="relnote-code">build ${esc(code)}</span></div>
        <div class="relnote-body">${esc(notes)}</div>
      </div>`
  ).join("");
  out.innerHTML = `<h3>Release notes</h3><div class="relnote-list">${rows}</div>`;
}
function detailRow(app, span, scope = null) {
  var _a2;
  const tr = document.createElement("tr");
  tr.className = "detail";
  const td2 = document.createElement("td");
  td2.colSpan = (_a2 = span != null ? span : ROW_SPAN[scope]) != null ? _a2 : app.owned ? 11 : 8;
  td2.append(appPanel(app, { scope }));
  tr.append(td2);
  return tr;
}
var REVIEW_PAGE = 15;
function reviewStars(score) {
  const n = Math.round(Number(score) || 0);
  let out = "";
  for (let i = 1; i <= 5; i++) {
    out += `<span class="${i <= n ? "" : "off"}">\u2605</span>`;
  }
  return `<span class="rev-stars" role="img" aria-label="${n} out of 5 stars">${out}</span>`;
}
function reviewsPaneHtml(app) {
  if (!app.id) return `<p>No store ID to read reviews against.</p>`;
  const c = reviewCache.get(app.id);
  if (c) return renderReviews(c);
  return `<div class="controls"><button type="button" data-reviews-get>Get reviews</button></div>
       <p class="hint">The store's star ratings and written reviews for this app.</p>`;
}
function renderReviews(c) {
  var _a2, _b2;
  const s = c.summary;
  const max2 = Math.max(1, ...s.histogram.map((h) => h.count));
  const hist = s.histogram.length ? `<div class="rev-hist">${s.histogram.map(
    (h) => `<div class="rev-hist-row">
              <span class="rev-hist-star">${h.star}\u2605</span>
              <div class="rev-hist-track"><div class="rev-hist-fill" style="width:${Math.round(h.count / max2 * 100)}%"></div></div>
              <span class="rev-hist-count">${bigNumber(h.count)}</span>
            </div>`
  ).join("")}</div>` : "";
  const counts = [
    s.ratingCount != null ? `${(_a2 = s.ratingCountText) != null ? _a2 : bigNumber(s.ratingCount)} ratings` : null,
    s.reviewCount ? `${bigNumber(s.reviewCount)} written` : null
  ].filter(Boolean).join(" \xB7 ");
  const summary = s.score != null || s.histogram.length ? `<div class="rev-summary">
           <div class="rev-score-box">
             <div class="rev-score">${esc((_b2 = s.scoreText) != null ? _b2 : s.score != null ? s.score.toFixed(1) : "\u2014")}</div>
             ${reviewStars(s.score)}
             ${counts ? `<div class="rev-score-sub">${esc(counts)}</div>` : ""}
           </div>
           ${hist}
         </div>` : `<p>No ratings yet.</p>`;
  const sorts = c.reviews.length || c.cursor ? `<div class="rev-sorts">${REVIEW_SORTS.map(
    ([value, label]) => `<button type="button" class="ptc-btn${value === c.sort ? " on" : ""}"
               data-review-sort="${value}"${value === c.sort ? ' aria-pressed="true"' : ""}>${label}</button>`
  ).join("")}</div>` : "";
  const list = c.reviews.length ? c.reviews.map(reviewCard).join("") : s.reviewCount ? `<p>No written reviews on this page.</p>` : "";
  const more = c.cursor ? `<div class="controls"><button type="button" data-reviews-more>Load more</button></div>` : "";
  return `${summary}${sorts}<div class="reviews-list">${list}</div>${more}`;
}
function reviewCard(r) {
  const avatar = r.author.image ? `<img class="review-avatar" src="${esc(r.author.image)}" alt="" loading="lazy">` : `<span class="review-avatar"></span>`;
  const meta = [r.score != null ? reviewStars(r.score) : "", r.date ? isoDay(r.date) : ""].filter(Boolean).join(" ");
  return `<div class="review">
      <div class="review-head">
        ${avatar}
        <span class="review-who">${esc(r.author.name)}${r.earlyAccess ? `<span class="rev-ea">Early access</span>` : ""}</span>
        <span class="review-meta">${meta}</span>
      </div>
      ${r.title ? `<div class="review-title">${esc(r.title)}</div>` : ""}
      ${r.body ? `<div class="review-body">${esc(r.body)}</div>` : ""}
      ${r.helpful ? `<div class="review-helpful">${bigNumber(r.helpful)} found this helpful</div>` : ""}
      ${r.devResponse ? `<div class="review-dev"><div class="review-dev-label">Developer response</div>${esc(
    r.devResponse
  )}</div>` : ""}
    </div>`;
}
function wireReviews(app, pane) {
  var _a2, _b2;
  if (!app.id) return;
  (_a2 = pane.querySelector("[data-reviews-get]")) == null ? void 0 : _a2.addEventListener("click", (e) => {
    e.stopPropagation();
    loadReviews(app, pane, { sort: "top", button: e.currentTarget });
  });
  for (const b of pane.querySelectorAll("[data-review-sort]")) {
    b.addEventListener("click", (e) => {
      var _a3;
      e.stopPropagation();
      const sort = b.dataset.reviewSort;
      if (((_a3 = reviewCache.get(app.id)) == null ? void 0 : _a3.sort) === sort) return;
      loadReviews(app, pane, { sort, button: b });
    });
  }
  (_b2 = pane.querySelector("[data-reviews-more]")) == null ? void 0 : _b2.addEventListener("click", (e) => {
    e.stopPropagation();
    loadReviews(app, pane, { more: true, button: e.currentTarget });
  });
}
async function loadReviews(app, pane, { sort, more = false, button } = {}) {
  var _a2;
  const prev = reviewCache.get(app.id);
  const label = button == null ? void 0 : button.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = more ? "Loading\u2026" : "Loading reviews\u2026";
  }
  try {
    if (more) {
      if (!(prev == null ? void 0 : prev.cursor)) return;
      const page = await appReviews(app.id, { count: REVIEW_PAGE, cursor: prev.cursor, sort: prev.sort });
      prev.reviews = [...prev.reviews, ...page.reviews];
      prev.cursor = page.cursor;
    } else {
      const summary = (_a2 = prev == null ? void 0 : prev.summary) != null ? _a2 : await appReviewSummary(app.id);
      const page = await appReviews(app.id, { count: REVIEW_PAGE, sort });
      reviewCache.set(app.id, { summary, reviews: page.reviews, cursor: page.cursor, sort });
    }
    pane.innerHTML = renderReviews(reviewCache.get(app.id));
    wireReviews(app, pane);
  } catch (err2) {
    if (button) {
      button.disabled = false;
      button.textContent = label;
    }
    let note2 = pane.querySelector(".reviews-error");
    if (!note2) {
      note2 = document.createElement("p");
      note2.className = "warn reviews-error";
      pane.append(note2);
    }
    note2.textContent = `Could not load reviews: ${err2.message}`;
  }
}
function openAppById(id) {
  el.q.value = String(id);
  if (routeView() !== "apps") go("/apps");
  runSearch();
  window.scrollTo({ top: 0 });
}
function addonsPaneHtml(app) {
  if (!app.id) return `<p>No store ID to read add-ons for.</p>`;
  const c = addonsCache.get(app.id);
  if (c) return renderAddons(c);
  return `<div class="controls"><button type="button" data-addons-get>Get add-ons</button></div>
       <p class="hint">The DLC and in-app purchases this app sells, and which you own.</p>`;
}
function renderAddons(c) {
  if (!c.items.length) return `<p>This app has no add-ons.</p>`;
  const rows = c.items.map((a) => {
    var _a2, _b2;
    const price = a.owned ? `<span class="addon-owned">Owned</span>` : a.strikethrough && a.strikethrough !== a.price ? `<span class="addon-was">${esc(a.strikethrough)}</span> <span class="addon-price">${esc((_a2 = a.price) != null ? _a2 : "\u2014")}</span>` : `<span class="addon-price">${esc((_b2 = a.price) != null ? _b2 : "\u2014")}</span>`;
    return `<tr${a.owned ? ' class="owned"' : ""}>
          <td>${esc(a.name)}${a.description ? `<div class="addon-desc">${esc(a.description)}</div>` : ""}</td>
          <td class="addon-pricecell">${price}</td>
        </tr>`;
  }).join("");
  const more = c.cursor ? `<div class="controls" style="justify-content:center;margin-top:1rem"><button type="button" data-addons-more>Load more</button></div>` : "";
  return `<p class="count">${bigNumber(c.total)} add-on${c.total === 1 ? "" : "s"}</p>
     <table><thead><tr><th>Item</th><th>Price</th></tr></thead><tbody>${rows}</tbody></table>${more}`;
}
function wireAddons(app, pane) {
  var _a2, _b2;
  if (!app.id) return;
  (_a2 = pane.querySelector("[data-addons-get]")) == null ? void 0 : _a2.addEventListener("click", (e) => {
    e.stopPropagation();
    loadAddons(app, pane, { button: e.currentTarget });
  });
  (_b2 = pane.querySelector("[data-addons-more]")) == null ? void 0 : _b2.addEventListener("click", (e) => {
    e.stopPropagation();
    loadAddons(app, pane, { more: true, button: e.currentTarget });
  });
}
async function loadAddons(app, pane, { more = false, button } = {}) {
  const prev = addonsCache.get(app.id);
  if (button) {
    button.disabled = true;
    button.textContent = more ? "Loading\u2026" : "Loading add-ons\u2026";
  }
  try {
    if (more) {
      if (!(prev == null ? void 0 : prev.cursor)) return;
      const page = await appAddons(app.id, { cursor: prev.cursor, loaded: prev.items.length });
      const seen = new Set(prev.items.map((i) => i.id));
      prev.items.push(...page.items.filter((i) => !seen.has(i.id)));
      prev.cursor = page.cursor;
      prev.total = page.total || prev.total;
    } else {
      const page = await appAddons(app.id, {});
      addonsCache.set(app.id, { items: page.items, total: page.total, cursor: page.cursor });
    }
    pane.innerHTML = renderAddons(addonsCache.get(app.id));
    wireAddons(app, pane);
  } catch (err2) {
    if (button) {
      button.disabled = false;
      button.textContent = more ? "Load more" : "Get add-ons";
    }
    paneError(pane, "addons-error", `Could not load add-ons: ${err2.message}`);
  }
}
function achPaneHtml(app) {
  if (!app.id) return `<p>No store ID to read achievements for.</p>`;
  const c = achCache.get(app.id);
  if (c) return renderAch(c);
  return `<div class="controls"><button type="button" data-ach-get>Get achievements</button></div>
       <p class="hint">This app's achievements and how far you've got in each. Needs your own access token.</p>`;
}
function renderAch(c) {
  if (!c.achievements.length) return `<p>This app has no achievements.</p>`;
  const cards = c.achievements.map((a) => {
    var _a2, _b2;
    const hidden = a.secret && !a.unlocked;
    const art = a.image ? `<img class="ach-art" src="${esc(a.image)}" alt="" loading="lazy">` : `<span class="ach-art"></span>`;
    const title = hidden ? "Secret achievement" : esc((_a2 = a.title) != null ? _a2 : "\u2014");
    const desc = hidden ? "Hidden until unlocked." : esc((_b2 = a.description) != null ? _b2 : "");
    const prog = !a.unlocked && a.type === "COUNT" && a.target > 0 ? `<div class="ach-prog">${bigNumber(a.countProgress)} / ${bigNumber(a.target)}</div>` : "";
    return `<div class="ach${a.unlocked ? " on" : ""}">
          ${art}
          <div class="ach-body">
            <div class="ach-title">${title}${a.unlocked ? ` <span class="ach-tick">\u2713</span>` : ""}</div>
            ${desc ? `<div class="ach-desc">${desc}</div>` : ""}
            ${prog}
          </div>
        </div>`;
  }).join("");
  const secret = c.secretRemaining ? ` \xB7 ${bigNumber(c.secretRemaining)} secret` : "";
  return `<p class="count">${bigNumber(c.earned)} of ${bigNumber(c.total)} earned${secret}</p>
     <div class="ach-grid">${cards}</div>`;
}
function wireAch(app, pane) {
  var _a2;
  if (!app.id) return;
  (_a2 = pane.querySelector("[data-ach-get]")) == null ? void 0 : _a2.addEventListener("click", (e) => {
    e.stopPropagation();
    loadAch(app, pane, e.currentTarget);
  });
}
async function loadAch(app, pane, button) {
  if (button) {
    button.disabled = true;
    button.textContent = "Loading achievements\u2026";
  }
  try {
    const data = await appAchievements(app.id);
    achCache.set(app.id, data);
    pane.innerHTML = renderAch(data);
  } catch (err2) {
    if (button) {
      button.disabled = false;
      button.textContent = "Get achievements";
    }
    paneError(pane, "ach-error", `Could not load achievements: ${err2.message}`);
  }
}
function paneError(pane, cls, text) {
  let note2 = pane.querySelector("." + cls);
  if (!note2) {
    note2 = document.createElement("p");
    note2.className = "warn " + cls;
    pane.append(note2);
  }
  note2.textContent = text;
}
var infoCache = /* @__PURE__ */ new Map();
var infoOpen = /* @__PURE__ */ new Set();
function syncInfoButton(button, app) {
  button.textContent = infoOpen.has(app.id) ? "Hide Binary Info" : "Latest Binary Info";
}
async function toggleAppInfo(app, out, button) {
  if (infoOpen.has(app.id)) {
    infoOpen.delete(app.id);
    out.innerHTML = "";
    syncInfoButton(button, app);
    return;
  }
  infoOpen.add(app.id);
  syncInfoButton(button, app);
  if (infoCache.has(app.id)) {
    drawAppInfo(out, infoCache.get(app.id));
    return;
  }
  button.disabled = true;
  out.innerHTML = `<p>Fetching the binary manifest\u2026</p>`;
  try {
    const info = await appDetails(app.id);
    infoCache.set(app.id, info);
    drawAppInfo(out, info);
  } catch (err2) {
    out.innerHTML = `<p class="warn">Could not fetch: ${esc(err2.message)}</p>`;
  }
  button.disabled = false;
}
function mb(bytes) {
  if (!bytes) return null;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function factList(pairs) {
  return `<dl>${pairs.filter(([, v]) => v).map(([k, v]) => `<dt>${k}</dt><dd>${esc(String(v))}</dd>`).join("")}</dl>`;
}
var commas = (items) => items.map((s) => String(s).replace(/ /g, "\xA0")).join(", ");
function factGroups(groups) {
  const filled = groups.map(([title, pairs]) => [title, pairs.filter(([, v]) => v)]).filter(([, pairs]) => pairs.length);
  if (!filled.length) return "";
  return `<div class="facts">${filled.map(
    ([title, pairs]) => `<section><h4>${title}</h4>${factList(pairs)}</section>`
  ).join("")}</div>`;
}
function drawAppInfo(out, info, title = "Binary manifest") {
  out.innerHTML = `
    <h3>${esc(title)}</h3>
    ${factGroups([
    [
      "Binary",
      [
        ["Package", info.packageName],
        ["Version", info.version && `${info.version} (build ${info.versionCode})`],
        ["File", info.fileName],
        ["Uploaded", info.releasedAt]
      ]
    ],
    [
      "Size",
      [
        ["Download", mb(info.size)],
        ["Space needed", mb(info.requiredSpace)],
        ["OBB", mb(info.obbSize)]
      ]
    ],
    [
      "Needs",
      [
        ["Built for", info.targetSdk && `Android SDK ${info.targetSdk}`],
        ["OS", info.requiredOs],
        ["PSDK", info.requiredPsdk],
        ["Tracking", info.headTracking],
        [
          "External storage",
          info.externalStorage == null ? null : info.externalStorage ? "yes" : "no"
        ]
      ]
    ]
  ])}
    ${/* Hashes are 64 characters of hex — they get their own full-width block
     rather than squeezing a column to fit them. */
  info.sha256 || info.checksum || info.certSignature ? `<h4>Hashes</h4>${factList([
    ["SHA-256", info.sha256],
    ["MD5", info.checksum],
    ["Cert signature", info.certSignature]
  ])}` : ""}
    ${info.permissions.length ? `<h4>Permissions (${info.permissions.length})</h4>
           <ul class="perms">${info.permissions.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}`;
}
var versionCache = /* @__PURE__ */ new Map();
var VERSION_PAGE = 100;
var CHANNEL_LOOKUPS = 4;
function buildId(v) {
  var _a2;
  if (v.id == null) return (_a2 = v.versionCode) != null ? _a2 : "\u2014";
  if (v.versionCode == null) return v.id;
  return `${v.id} (${v.versionCode})`;
}
function initDirectDownload() {
  el.binGo.addEventListener("click", directDownload);
  el.binId.addEventListener("keydown", (e) => {
    if (e.key === "Enter") directDownload();
  });
  el.binId.addEventListener("input", () => setBinNote(""));
}
function setBinNote(text, bad = false) {
  el.binNote.textContent = text;
  el.binNote.classList.toggle("bad", bad);
  el.binNote.hidden = !text;
}
function directDownload() {
  const id = el.binId.value.trim();
  if (!id) {
    setBinNote("Paste a binary ID first.", true);
    return;
  }
  if (!/^\d{8,}$/.test(id)) {
    setBinNote(
      "That is not a binary ID \u2014 copy the long number from a build's ID (build) column, not the version code in brackets.",
      true
    );
    return;
  }
  if (!canDownload()) {
    setBinNote(
      "Downloads sign with the account token \u2014 add your oc_ac_at on the Settings page first.",
      true
    );
    return;
  }
  window.open(downloadURL(id), "_blank", "noopener");
  setBinNote(
    `Asked the store for binary ${id}. It refuses anything the account is not entitled to.`
  );
}
function isRift(app) {
  return (app == null ? void 0 : app.platform) === "PC" || (app == null ? void 0 : app.platform) === "RIFT";
}
var _fflate;
async function loadFflate() {
  if (!_fflate) _fflate = await Promise.resolve().then(() => (init_fflate_module(), fflate_module_exports));
  return _fflate;
}
async function downloadRiftBuild(app, { riftBuild: binaryId, version }, button) {
  var _a2;
  if (!canDownload()) {
    go("/settings");
    return;
  }
  const label = button.textContent;
  button.disabled = true;
  const say2 = (t) => {
    button.textContent = t;
    button.title = `${app.name}: ${t}`;
  };
  try {
    say2("Finding build\u2026");
    const { manifestUri, segmentsBaseUri, platform } = await riftMetadata(binaryId);
    if (platform === "ANDROID") {
      throw new Error("this is a Quest build, not a Rift one");
    }
    if (!manifestUri || !segmentsBaseUri) {
      throw new Error("no PC manifest for this build");
    }
    const f = await loadFflate();
    say2("Fetching manifest\u2026");
    const manifestZip = await riftManifestBytes(manifestUri);
    let manifestText;
    try {
      const entries = f.unzipSync(manifestZip, {
        filter: (e) => e.name === "manifest.json" || e.name.endsWith("/manifest.json")
      });
      const key = Object.keys(entries)[0];
      if (!key) throw new Error("no manifest.json in the archive");
      manifestText = new TextDecoder().decode(entries[key]);
    } catch {
      try {
        manifestText = new TextDecoder().decode(f.gunzipSync(manifestZip));
      } catch {
        manifestText = new TextDecoder().decode(manifestZip);
      }
    }
    const manifest = JSON.parse(manifestText);
    const files = manifest.files || {};
    const names = Object.keys(files);
    if (!names.length) throw new Error("the manifest listed no files");
    const totalBytes = names.reduce((sum, n) => sum + (files[n].size || 0), 0) || 1;
    const chunks = [];
    const zip2 = new f.Zip((err2, data) => {
      if (data) chunks.push(data);
    });
    const inflate2 = (raw) => {
      try {
        return f.unzlibSync(raw);
      } catch {
        try {
          return f.gunzipSync(raw);
        } catch {
          return f.inflateSync(raw);
        }
      }
    };
    let doneBytes = 0;
    for (const name of names) {
      const file = files[name];
      const buf = new Uint8Array(file.size);
      let offset = 0;
      for (const seg of file.segments) {
        const sha = Array.isArray(seg) ? seg[1] : (_a2 = seg.sha256) != null ? _a2 : seg;
        const raw = await riftSegmentBytes(segmentsBaseUri, sha);
        buf.set(inflate2(raw), offset);
        offset += file.segmentSize;
      }
      const entry = new f.ZipPassThrough(name);
      zip2.add(entry);
      entry.push(buf, true);
      doneBytes += file.size;
      say2(`Assembling\u2026 ${Math.round(doneBytes / totalBytes * 100)}%`);
    }
    zip2.end();
    say2("Packaging\u2026");
    const blob = new Blob(chunks, { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safe = (app.name || "rift-build").replace(/[^\w.-]+/g, "_");
    a.download = `${safe}_${version || binaryId}.zip`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3e4);
    button.textContent = "Downloaded";
    button.title = `${app.name}: saved ${names.length} files as ${a.download}`;
  } catch (err2) {
    button.textContent = "Failed";
    button.title = `${app.name}: ${err2.message}`;
  } finally {
    button.disabled = false;
    setTimeout(() => {
      if (button.isConnected && (button.textContent === "Downloaded" || button.textContent === "Failed")) {
        button.textContent = label;
      }
    }, 6e3);
  }
}
function downloadCell(v, offerDev, app = null) {
  var _a2;
  if (!v.id) return "";
  const dev = !v.channels.length;
  if (dev && !offerDev) return "";
  if (IN_APP && isRift(app)) return "";
  if ((app == null ? void 0 : app.onHeadset) || IN_APP) {
    if (IN_APP && (app == null ? void 0 : app.packageName) && app.installedVersionCode == null) {
      const have = Number(window.MetaDBApp.installedVersion(app.packageName));
      if (have >= 0) app.installedVersionCode = have;
    }
    if (!canDownload()) {
      return `<a class="dl dl-off" href="/settings"
                title="Add your oc_ac_at account token in Settings">Install</a>`;
    }
    if (app.installedVersionCode && v.versionCode === app.installedVersionCode) {
      return `<span class="on-headset" title="This is what the headset is on">On headset</span>`;
    }
    const older = app.installedVersionCode && v.versionCode < app.installedVersionCode;
    return `<button type="button" class="dl${dev ? " dl-dev" : ""}"
              data-install-build="${esc(v.id)}"
              data-version="${esc(v.version)}"
              data-code="${(_a2 = v.versionCode) != null ? _a2 : ""}"
              title="${esc(
      older ? `Go back to ${v.version} \u2014 uninstalls first, losing this app's data` : `Install ${v.version}`
    )}">Install</button>`;
  }
  if (isRift(app)) {
    if (!canDownload()) {
      return `<a class="dl dl-off" href="/settings"
                title="Add your oc_ac_at account token in Settings">Download</a>`;
    }
    return `<button type="button" class="dl${dev ? " dl-dev" : ""}"
              data-rift-build="${esc(v.id)}"
              data-version="${esc(v.version)}"
              title="${esc(
      dev ? `${v.version} \u2014 never released to a channel; assembled from PC segments as a .zip` : `Download ${v.version} \u2014 assembled from PC segments into a .zip`
    )}">Download</button>`;
  }
  if (!canDownload()) {
    return `<a class="dl dl-off" href="/settings"
              title="Add your oc_ac_at account token in Settings">Download</a>`;
  }
  const obb = obbs.get(String(v.id));
  return `${obb ? `<a class="dl dl-obb" href="${esc(downloadURL(obb))}" target="_blank"
            rel="noopener" title="${esc(
    `Expansion file for ${v.version} \u2014 binary ${obb}`
  )}">OBB</a>` : ""}<a class="dl${dev ? " dl-dev" : ""}" href="${esc(downloadURL(v.id))}"
            target="_blank" rel="noopener" title="${esc(
    dev ? `${v.fileName || "download"} \u2014 never released to a channel` : v.fileName || "download"
  )}">Download</a>`;
}
function drawVersions(out, list, limit, mode = loadSettings().buildSort, keepScroll = false, app = null) {
  var _a2, _b2, _c, _d, _e, _f;
  if (!list.length) {
    out.innerHTML = `<p>No builds returned.</p>`;
    return;
  }
  const wasAt = keepScroll ? (_b2 = (_a2 = out.querySelector(".vscroll")) == null ? void 0 : _a2.scrollTop) != null ? _b2 : 0 : 0;
  const ordered = [...list].sort((_c = BUILD_SORTS[mode]) != null ? _c : BUILD_SORTS.released);
  const page = ordered.slice(0, limit);
  const released = list.filter((v) => v.channels.length).length;
  const offerDev = loadSettings().devDownloads;
  out.innerHTML = `
    <h3>Build history</h3>
    <p class="hint">
      ${list.length} build${list.length === 1 ? "" : "s"}, ${released} of them attached to a
      channel. Showing ${page.length}. Builds that reached a channel can be pulled from
      the store${canDownload() ? " if your account is entitled to them" : ", once an oc_ac_at account token is set in Settings"}.
    </p>
    ${obbNote ? `<p class="warn">${esc(obbNote)}</p>` : ""}
    <div class="build-bar">
      <select class="build-sort" aria-label="Order builds">
        ${BUILD_SORT_LABELS.map(
    ([value, label]) => `<option value="${value}"${value === mode ? " selected" : ""}>${label}</option>`
  ).join("")}
      </select>
    </div>
    <div class="vscroll">
      <table class="vtable">
        <thead>
          <tr><th>Version</th><th>ID (build)</th><th>Date</th><th>Channel</th><th></th></tr>
        </thead>
        <tbody>
          ${page.map(
    (v) => {
      var _a3;
      return `<tr class="${[
        v.channels.length ? "on-channel" : "",
        (app == null ? void 0 : app.onHeadset) && v.versionCode === app.installedVersionCode ? "installed" : ""
      ].filter(Boolean).join(" ")}">
                <td>${esc(v.version)}</td>
                <td class="bid">${buildId(v)}</td>
                <td>${(_a3 = v.releasedAt) != null ? _a3 : "\u2014"}</td>
                <td>${v.channels.length ? esc(v.channels.join(", ")) : "\u2014"}</td>
                <td>${(app == null ? void 0 : app.id) && app.platform !== "PC" && v.versionCode != null ? `<button type="button" class="build-btn" data-build="${esc(v.versionCode)}"
                         data-build-version="${esc(v.version)}" aria-expanded="false">Details</button>` : ""}${downloadCell(v, offerDev, app)}</td>
              </tr>`;
    }
  ).join("")}
        </tbody>
      </table>
    </div>
    ${list.length > page.length ? `<button type="button" class="more-versions">Show ${Math.min(
    VERSION_PAGE,
    list.length - page.length
  )} more</button>` : ""}`;
  const scroller = out.querySelector(".vscroll");
  if (scroller && wasAt) scroller.scrollTop = wasAt;
  (_d = out.querySelector("tbody")) == null ? void 0 : _d.addEventListener("click", (e) => {
    const button = e.target.closest("[data-build]");
    if (!button || !(app == null ? void 0 : app.id)) return;
    e.stopPropagation();
    toggleBuildDetails(app, button);
  });
  (_e = out.querySelector(".more-versions")) == null ? void 0 : _e.addEventListener("click", (e) => {
    e.stopPropagation();
    drawVersions(out, list, limit + VERSION_PAGE, mode, true, app);
  });
  (_f = out.querySelector(".build-sort")) == null ? void 0 : _f.addEventListener("change", (e) => {
    e.stopPropagation();
    drawVersions(out, list, VERSION_PAGE, e.target.value, false, app);
  });
}
async function toggleBuildDetails(app, button) {
  var _a2;
  const row = button.closest("tr");
  const open2 = (_a2 = row.nextElementSibling) == null ? void 0 : _a2.classList.contains("build-detail");
  if (open2) {
    row.nextElementSibling.remove();
    button.setAttribute("aria-expanded", "false");
    return;
  }
  const code = button.dataset.build;
  const key = `${app.id}:${code}`;
  const detail = document.createElement("tr");
  detail.className = "build-detail";
  detail.innerHTML = `<td colspan="${row.children.length}"><div class="panel build-out"></div></td>`;
  row.after(detail);
  button.setAttribute("aria-expanded", "true");
  const out = detail.querySelector(".build-out");
  const title = `Build ${button.dataset.buildVersion} (${code})`;
  if (buildInfo.has(key)) {
    drawAppInfo(out, buildInfo.get(key), title);
    return;
  }
  out.innerHTML = "<p>Asking the store about this build\u2026</p>";
  button.disabled = true;
  button.textContent = "Loading\u2026";
  try {
    const info = await binaryDetails(app.id, code);
    buildInfo.set(key, info);
    drawAppInfo(out, info, title);
  } catch (err2) {
    out.innerHTML = `<p class="warn">Could not load this build: ${esc(err2.message)}</p>`;
  } finally {
    button.disabled = false;
    button.textContent = "Details";
    syncRelayNote();
  }
}
async function claimOne(app, out, button) {
  button.disabled = true;
  out.innerHTML = `<p>Asking the store for ${esc(app.name)}\u2026</p>`;
  try {
    await claimOffer(app.offerId, el.hmd.value);
    out.innerHTML = `<p class="ok">${esc(app.name)} is on your account. It will
      show up under Your entitlements the next time you fetch them.</p>`;
  } catch (err2) {
    out.innerHTML = `<p class="warn">Not claimed: ${esc(err2.message)}</p>`;
  }
  button.disabled = false;
  syncRelayNote();
}
async function resolveId(app, out, button) {
  button.disabled = true;
  out.innerHTML = `<p>Asking the store for ${esc(app.packageName)}\u2026</p>`;
  try {
    const found = await lookupByPackage(app.packageName);
    Object.assign(app, found);
    out.innerHTML = `
      <p>Found <strong>${esc(found.id)}</strong>. Add it to
      <code>data/meta-apps.json</code> so it sticks:</p>
      <pre>${esc(JSON.stringify(app, null, 2))}</pre>`;
    renderAll();
  } catch (err2) {
    out.innerHTML = `<p class="warn">Could not resolve: ${esc(err2.message)}</p>`;
    button.disabled = false;
  }
}
function note(found) {
  if ((found == null ? void 0 : found.state) === "checking") return `<p>Asking the store\u2026</p>`;
  if ((found == null ? void 0 : found.state) === "error") return `<p class="warn">Check failed: ${esc(found.error)}</p>`;
  if ((found == null ? void 0 : found.state) === "outdated" && found.was) {
    return `<p class="warn">Moved on since the stored record, which said ${esc(found.was)}.</p>`;
  }
  return "";
}
function refreshRow(app) {
  for (const tr of document.querySelectorAll(`tr.app[data-id="${keyOf(app)}"]`)) {
    const tbody = tr.closest("tbody");
    const scope = tbody === el.adbRows ? "adb" : tbody === el.mineRows ? "mine" : tbody === el.orgRows ? "orgs" : tbody === el.defaultRows ? "default" : tbody === el.plusRows ? "plus" : "main";
    const next = tr.nextElementSibling;
    tr.replaceWith(scope === "adb" ? adbRow(app) : appRow(app, scope));
    if (next == null ? void 0 : next.classList.contains("detail")) {
      next.replaceWith(detailRow(app, scope === "adb" ? 5 : void 0, scope));
    }
  }
  if (isStaged(app)) refreshStage();
}
async function checkOne(app, { listing: wantListing = true, channel = false } = {}) {
  const key = keyOf(app);
  if (!app.id) {
    results.set(key, { state: "noid" });
    refreshRow(app);
    return;
  }
  results.set(key, { state: "checking" });
  refreshRow(app);
  const wantOffer = wantListing && !app.offerId;
  const [history2, store, page, mine] = await Promise.allSettled([
    checkApp(app),
    wantListing ? storeListing(app.id, el.hmd.value) : Promise.resolve(null),
    wantOffer ? appPage(app.id, el.hmd.value) : Promise.resolve(null),
    /* Which channel this account is on. Only Check this app asks — Check
       shown runs this same function, and one more request per app in a sweep
       is not worth a line of text. */
    channel ? myReleaseChannels(app.id) : Promise.resolve(null)
  ]);
  if (mine.status === "fulfilled" && mine.value) myChannels.set(app.id, mine.value);
  if (page.status === "fulfilled" && page.value) {
    if (page.value.offer) {
      app.offerId = page.value.offer.offerId;
      app.free = page.value.offer.free;
    }
    media.set(app.id, page.value.media);
  }
  if (wantListing) {
    listings.set(
      app.id,
      store.status === "fulfilled" ? { data: store.value } : { error: store.reason.message }
    );
  }
  if (history2.status === "rejected") {
    results.set(key, { state: "error", error: history2.reason.message });
  } else {
    const latest = history2.value;
    if (latest.builds) versionCache.set(app.id, latest.builds);
    const primary = primaryOf(app);
    const state = !primary ? "info" : String(latest.version) !== String(primary.version) || Number(latest.versionCode) !== Number(primary.versionCode) ? "outdated" : "current";
    results.set(key, {
      state,
      latest,
      was: primary ? `${primary.version} (build ${primary.versionCode})` : null
    });
    if (loadSettings().obb) await findObbs(latest.channels);
  }
  refreshRow(app);
  syncRelayNote();
}
async function findObbs(channels = []) {
  obbNote = "";
  const all = [...new Set(channels.map((c) => c.id).filter(Boolean))];
  const ids = all.filter((id) => !obbChecked.has(id)).slice(0, CHANNEL_LOOKUPS);
  if (!ids.length) {
    if (channels.length && !all.length) {
      obbNote = "No OBB lookup: the build history reported no channel IDs.";
    }
    return;
  }
  const replies = await Promise.allSettled(ids.map((id) => channelObbs(id)));
  ids.forEach((id, i) => {
    if (replies[i].status === "fulfilled") obbChecked.add(id);
  });
  for (const reply of replies) {
    if (reply.status !== "fulfilled") continue;
    for (const [binary, obb] of reply.value) obbs.set(binary, obb);
  }
  if (replies.every((r) => r.status === "rejected")) {
    obbNote = `No OBB lookup: ${replies[0].reason.message}`;
  }
}
async function checkList(list, button, label) {
  if (!list.length) return;
  el.checkAll.disabled = true;
  el.checkOrg.disabled = true;
  const checkable = [];
  for (const app of list) {
    if (app.id) checkable.push(app);
    else await checkOne(app);
  }
  const CONCURRENCY = 6;
  let cursor = 0;
  let done = 0;
  async function worker() {
    while (cursor < checkable.length) {
      const app = checkable[cursor++];
      await checkOne(app);
      done += 1;
      button.textContent = `Checking ${done} of ${checkable.length}\u2026`;
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, checkable.length) }, worker)
  );
  button.textContent = label;
  el.checkAll.disabled = false;
  el.checkOrg.disabled = false;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
boot();
function syncBinRow() {
  const on = loadSettings().binDownload;
  el.binRow.hidden = !on;
  if (!on) el.binNote.hidden = true;
}
function tourTarget(selector) {
  var _a2;
  return (_a2 = [...document.querySelectorAll(selector)].find((e) => e.getClientRects().length)) != null ? _a2 : null;
}
function tourSteps() {
  return [
    {
      target: ".topbar h1",
      title: "What this is",
      body: "MetaDB reads the Meta Quest store live: every release channel and every build an app has had, including the ones that never shipped. Nothing is stored \u2014 each list is fetched when you ask for it. Not affiliated with Meta."
    },
    {
      target: '.nav a[data-view="settings"]',
      title: "Start with a token",
      body: "Search and most lists need your own access token: sign in at secure.oculus.com and copy the oc_www_at cookie into Settings. Downloads also want oc_ac_at. Without one, a built-in token reads public LIVE builds and nothing else."
    },
    {
      target: "#q",
      title: "Search the store",
      body: "Type an app name, or paste an app ID, a meta.com store link or an Android package name. It works out which one it is."
    },
    {
      target: "#view-apps table",
      title: "Open an app",
      body: "Click a result, then press Check this app. It pulls the release channels and the full build history in one go, and builds that reached a channel get a Download button."
    },
    {
      target: ".nav",
      title: "The other screens",
      body: "Apps also holds the default apps, Horizon+, Horizon worlds and an organization's apps. User has your headsets and what you own. Device has ADB and CompanionServer."
    }
  ];
}
function initTour() {
  el.tourAgain.addEventListener("click", () => {
    if (routeView() && routeView() !== "apps") {
      go("/apps");
      setTimeout(startTour, speed() + 50);
    } else {
      startTour();
    }
  });
}
function maybeTour() {
  if (tour || loadSettings().tourDone) return;
  setTimeout(() => {
    if (!tour && !loadSettings().tourDone && !el.viewApps.hidden) startTour();
  }, speed() + 50);
}
function startTour() {
  if (tour) return;
  const ring = document.createElement("div");
  ring.className = "tour-ring";
  ring.setAttribute("aria-hidden", "true");
  const card = document.createElement("div");
  card.className = "tour-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-labelledby", "tourTitle");
  card.setAttribute("aria-describedby", "tourBody");
  card.innerHTML = `
    <p class="tour-count"></p>
    <h3 id="tourTitle" class="tour-title"></h3>
    <p id="tourBody" class="tour-body"></p>
    <div class="tour-actions">
      <button type="button" data-tour="skip">Skip</button>
      <span class="tour-gap"></span>
      <button type="button" data-tour="back">Back</button>
      <button type="button" data-tour="next">Next</button>
    </div>`;
  document.body.append(ring, card);
  const onMove = () => placeTour();
  const onKey = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      endTour();
    }
  };
  tour = {
    steps: tourSteps(),
    index: 0,
    ring,
    card,
    onMove,
    onKey,
    returnFocus: document.activeElement
  };
  card.addEventListener("click", (e) => {
    var _a2;
    const action = (_a2 = e.target.closest("[data-tour]")) == null ? void 0 : _a2.dataset.tour;
    if (action === "skip") endTour();
    else if (action === "back") showStep(tour.index - 1);
    else if (action === "next") {
      if (tour.index === tour.steps.length - 1) endTour();
      else showStep(tour.index + 1);
    }
  });
  window.addEventListener("resize", onMove);
  window.addEventListener("scroll", onMove, { passive: true });
  document.addEventListener("keydown", onKey, true);
  showStep(0);
  if (animates()) requestAnimationFrame(() => tour == null ? void 0 : tour.ring.classList.add("tour-move"));
}
function showStep(index) {
  const { steps, card } = tour;
  tour.index = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[tour.index];
  const last = tour.index === steps.length - 1;
  card.querySelector(".tour-count").textContent = `${tour.index + 1} of ${steps.length}`;
  card.querySelector(".tour-title").textContent = step.title;
  card.querySelector(".tour-body").textContent = step.body;
  card.querySelector('[data-tour="back"]').disabled = tour.index === 0;
  card.querySelector('[data-tour="next"]').textContent = last ? "Done" : "Next";
  card.querySelector('[data-tour="skip"]').hidden = last;
  const target = tourTarget(step.target);
  if (target && target.getClientRects().length) {
    target.scrollIntoView({ block: "center", behavior: animates() ? "smooth" : "auto" });
  }
  placeTour();
  card.querySelector('[data-tour="next"]').focus({ preventScroll: true });
}
function placeTour() {
  if (!tour) return;
  const { ring, card, steps, index } = tour;
  const target = tourTarget(steps[index].target);
  const gutter = 16;
  const gap = 12;
  const pad = 6;
  const cardW = card.offsetWidth;
  const cardH = card.offsetHeight;
  if (!target || !target.getClientRects().length) {
    ring.classList.add("tour-ring--none");
    card.style.left = `${Math.max(gutter, (innerWidth - cardW) / 2)}px`;
    card.style.top = `${Math.max(gutter, (innerHeight - cardH) / 2)}px`;
    return;
  }
  ring.classList.remove("tour-ring--none");
  const r = target.getBoundingClientRect();
  ring.style.top = `${r.top - pad}px`;
  ring.style.left = `${r.left - pad}px`;
  ring.style.width = `${r.width + pad * 2}px`;
  ring.style.height = `${r.height + pad * 2}px`;
  let top = r.bottom + pad + gap;
  if (top + cardH > innerHeight - gutter) top = r.top - pad - gap - cardH;
  top = Math.max(gutter, Math.min(top, innerHeight - gutter - cardH));
  const left = Math.max(gutter, Math.min(r.left, innerWidth - gutter - cardW));
  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
}
function endTour() {
  if (!tour) return;
  const { ring, card, onMove, onKey, returnFocus } = tour;
  tour = null;
  window.removeEventListener("resize", onMove);
  window.removeEventListener("scroll", onMove);
  document.removeEventListener("keydown", onKey, true);
  ring.remove();
  card.remove();
  try {
    saveSettings({ tourDone: true });
  } catch {
  }
  if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
}
function initAccountTabs() {
  el.worldLoad.addEventListener("click", loadWorlds);
  for (const [value, label] of WORLD_SHELVES) el.worldShelf.append(new Option(label, value));
  el.worldShelfGo.addEventListener("click", loadShelf);
  el.worldMore.addEventListener("click", () => browseMore(pagedWorlds()));
  el.worldTabs.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-world-tab]");
    if (tab) setWorldTab(tab.dataset.worldTab);
  });
  el.creatorFind.addEventListener("click", findCreator);
  el.creatorQ.addEventListener("keydown", (e) => {
    if (e.key === "Enter") findCreator();
  });
  el.creatorQ.addEventListener("input", () => setCreatorNote(""));
  el.creatorGo.addEventListener("click", loadCreatorWorlds);
  el.worldQ.addEventListener("input", renderWorlds);
  el.worldSort.addEventListener("change", renderWorlds);
  el.worldLookupGo.addEventListener("click", lookUpWorld);
  el.worldLookup.addEventListener("keydown", (e) => {
    if (e.key === "Enter") lookUpWorld();
  });
  el.worldLookup.addEventListener("input", () => setWorldNote(""));
  el.worldRows.addEventListener("click", (e) => {
    const get = e.target.closest("button[data-world-load]");
    if (get) return getWorldDetails(get.dataset.worldLoad);
    if (e.target.closest("tr.detail")) return;
    const row = e.target.closest("tr[data-world]");
    if (row) toggleWorld(row.dataset.world);
  });
  el.worldRows.addEventListener("keydown", (e) => {
    var _a2, _b2;
    const row = (_b2 = (_a2 = e.target).closest) == null ? void 0 : _b2.call(_a2, "tr[data-world]");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      toggleWorld(row.dataset.world);
    }
  });
  renderWorlds();
}
async function ownedHeadsets() {
  if (!devicesAsked || devicesNote || devicesLoading) await loadDevices();
  if (devicesNote) throw new Error(devicesNote);
  return deviceList.filter((d) => d.ownership !== "shared" && d.serial);
}
function appNames() {
  var _a2;
  if (libraryNames) return Promise.resolve(libraryNames);
  (_a2 = layoutState.names) != null ? _a2 : layoutState.names = (async () => {
    let list = mineKind === "quest" && mineList.length ? mineList : null;
    if (!list) {
      try {
        list = await myEntitlements("quest");
      } catch {
        list = [];
      }
    }
    libraryNames = new Map(list.map((a) => [a.id, a]));
    layoutState.names = null;
    return libraryNames;
  })();
  return layoutState.names;
}
function headsetLabel(serial) {
  var _a2;
  const d = deviceList.find((x) => x.serial === serial);
  const model = (_a2 = d == null ? void 0 : d.model) != null ? _a2 : "Unknown headset";
  return `${model} (${showSerials ? serial : maskSerial(serial)})`;
}
function textMatch(q, ...fields) {
  return !q || fields.some((f) => String(f != null ? f : "").toLowerCase().includes(q));
}
function playLength(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 1) return seconds > 0 ? "under a minute" : "none";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
}
function isoDay(seconds) {
  return seconds ? new Date(seconds * 1e3).toISOString().slice(0, 10) : "\u2014";
}
function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
function loadPlaytime() {
  var _a2;
  (_a2 = playState.promise) != null ? _a2 : playState.promise = fetchPlaytime().finally(() => playState.promise = null);
  return playState.promise;
}
function loadBackups() {
  var _a2;
  (_a2 = backupState.promise) != null ? _a2 : backupState.promise = fetchBackups().finally(() => backupState.promise = null);
  return backupState.promise;
}
function renderAccountTabs() {
  renderAll();
  refreshStage();
}
async function fetchPlaytime() {
  Object.assign(playState, { asked: true, loading: true, note: "" });
  renderAccountTabs();
  const rows = [];
  let failed = 0;
  let serials = [];
  try {
    serials = (await ownedHeadsets()).map((d) => d.serial);
    await appNames();
    for (const serial of serials) {
      try {
        for (const r of await headsetPlaytime(serial)) rows.push({ ...r, serial });
      } catch (err2) {
        failed++;
        if (failed === serials.length) throw err2;
      }
    }
    if (failed) playState.note = `${plural(failed, "headset")} could not be read.`;
  } catch (err2) {
    playState.note = err2.message || "Could not load playtime.";
  } finally {
    playState.rows = rows;
    playState.loading = false;
    renderAccountTabs();
    syncRelayNote();
  }
}
async function fetchBackups() {
  Object.assign(backupState, { asked: true, loading: true, note: "" });
  renderAccountTabs();
  let rows = [];
  try {
    const serials = (await ownedHeadsets()).map((d) => d.serial);
    await appNames();
    rows = serials.length ? await cloudBackups(serials) : [];
  } catch (err2) {
    backupState.note = err2.message || "Could not load cloud backups.";
  } finally {
    backupState.rows = rows;
    backupState.loading = false;
    renderAccountTabs();
    syncRelayNote();
  }
}
function recordKey(r) {
  var _a2, _b2;
  return (_b2 = (_a2 = r.appId) != null ? _a2 : r.packageName) != null ? _b2 : "?";
}
function accountTable({ title, state, what, none, rows, summary, head, cells, load }) {
  let body;
  if (load && !state.asked) body = `<button type="button" data-load="${load.key}">${load.label}</button>`;
  else if (load && state.loading) body = `<button type="button" disabled>Loading\u2026</button>`;
  else if (state.loading || !state.asked) body = `<p>Asking the store for ${what}\u2026</p>`;
  else if (state.note && !state.rows.length) body = `<p class="warn">${esc(state.note)}</p>`;
  else if (!rows.length) body = `<p>${none != null ? none : `No ${what} for this app.`}</p>`;
  else
    body = `<p class="hint">${summary}</p>
      <div class="vscroll short">
        <table class="vtable plain">
          <thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((r) => `<tr>${cells(r)}</tr>`).join("")}</tbody>
        </table>
      </div>`;
  return `${title ? `<h3>${title}</h3>` : ""}${body}`;
}
function accountSections(app, scope, { load = false } = {}) {
  var _a2, _b2;
  const key = keyOf(app);
  if (scope === "backup") {
    const backs = backupState.rows.filter((r) => recordKey(r) === key).sort((a, b) => {
      var _a3, _b3;
      return ((_a3 = b.backedUpAt) != null ? _a3 : 0) - ((_b3 = a.backedUpAt) != null ? _b3 : 0);
    });
    const size = backs.reduce((sum, r) => sum + r.size, 0);
    return accountTable({
      title: "Cloud backups",
      state: backupState,
      what: "cloud backups",
      rows: backs,
      load: load ? { key: "backup", label: "Get cloud backups" } : null,
      summary: `${plural(backs.length, "backup")}, ${esc((_a2 = mb(size)) != null ? _a2 : "0 MB")} in all, the latest ${esc(
        isoDay((_b2 = backs[0]) == null ? void 0 : _b2.backedUpAt)
      )}.`,
      head: ["Headset", "Type", "Size", "Backed up"],
      cells: (r) => {
        var _a3;
        return `<td>${esc(r.serial ? headsetLabel(r.serial) : "\u2014")}</td><td>${esc(r.type ? words2(r.type) : "\u2014")}</td><td>${esc((_a3 = mb(r.size)) != null ? _a3 : "\u2014")}</td><td>${esc(isoDay(r.backedUpAt))}</td>`;
      }
    });
  }
  const plays = playState.rows.filter((r) => recordKey(r) === key).sort((a, b) => b.seconds - a.seconds);
  const played = plays.reduce((sum, r) => sum + r.seconds, 0);
  return accountTable({
    title: "Playtime by headset",
    state: playState,
    what: "playtime in the last 28 days",
    rows: plays,
    load: load ? { key: "play", label: "Get playtime" } : null,
    summary: played ? `${esc(playLength(played))} in the last 28 days, on ${plural(plays.length, "headset")}.` : `On ${plural(plays.length, "headset")}, but not played in the last 28 days.`,
    head: ["Headset", "Played, 28 days"],
    cells: (r) => `<td>${esc(headsetLabel(r.serial))}</td><td>${esc(playLength(r.seconds))}</td>`
  });
}
function loadIaps() {
  var _a2;
  (_a2 = iapState.promise) != null ? _a2 : iapState.promise = fetchIaps().finally(() => iapState.promise = null);
  return iapState.promise;
}
async function fetchIaps() {
  Object.assign(iapState, { asked: true, loading: true, note: "" });
  try {
    iapState.byApp = await ownedIaps();
    iapState.rows = [...iapState.byApp.values()].flat();
  } catch (err2) {
    iapState.byApp = /* @__PURE__ */ new Map();
    iapState.rows = [];
    iapState.note = err2.message || "Could not load DLC.";
  } finally {
    iapState.loading = false;
    renderAll();
    refreshStage();
    syncRelayNote();
  }
}
function dlcTable(app) {
  var _a2;
  const items = [...(_a2 = iapState.byApp.get(app.id)) != null ? _a2 : []].sort(
    (a, b) => {
      var _a3, _b2;
      return ((_a3 = b.grantedAt) != null ? _a3 : 0) - ((_b2 = a.grantedAt) != null ? _b2 : 0);
    }
  );
  return accountTable({
    title: "DLC you own",
    state: iapState,
    what: "DLC you own",
    rows: items,
    /* Fetched only when asked, like playtime and backups: one request covers
       every app, so a press here fills the DLC in everywhere. */
    load: { key: "dlc", label: "Get DLC" },
    summary: `${plural(items.length, "item")} on this account.`,
    head: ["Item", "Type", "Granted", "Expires", "State"],
    cells: (r) => `<td>${esc(r.name)}</td><td>${esc(r.type ? words2(r.type) : "\u2014")}</td><td>${esc(isoDay(r.grantedAt))}</td><td>${esc(r.expiresAt ? isoDay(r.expiresAt) : "Never")}</td><td>${esc(r.state ? words2(r.state) : "\u2014")}</td>`
  });
}
async function loadWorlds() {
  if (worldState.loading) return;
  Object.assign(worldState, { asked: true, loading: true, note: "" });
  el.worldLoad.disabled = true;
  el.worldLoad.textContent = "Loading\u2026";
  renderWorlds();
  try {
    const { count, worlds } = await savedWorlds();
    worldState.rows = worlds;
    worldState.count = count;
  } catch (err2) {
    worldState.rows = [];
    worldState.count = 0;
    worldState.note = err2.message || "Could not load saved worlds.";
  } finally {
    worldState.loading = false;
    el.worldLoad.disabled = false;
    el.worldLoad.textContent = "Get saved worlds";
    renderWorlds();
    syncRelayNote();
  }
}
function setWorldTab(tab) {
  worldTab = tab;
  for (const b of el.worldTabs.querySelectorAll("[data-world-tab]")) {
    const on = b.dataset.worldTab === tab;
    b.classList.toggle("on", on);
    b.setAttribute("aria-selected", String(on));
  }
  for (const p of el.viewWorlds.querySelectorAll("[data-world-pane]")) {
    p.hidden = p.dataset.worldPane !== tab;
  }
  renderWorlds();
}
function pagedWorlds() {
  return worldTab === "top" ? shelfState : worldTab === "creator" ? creatorState : null;
}
async function browseWorlds(state, label, fetchPage, button) {
  if (state.loading) return;
  Object.assign(state, { rows: [], cursor: null, label, fetchPage, asked: true, note: "" });
  await browseMore(state, button);
}
async function browseMore(state, button = el.worldMore) {
  if (!state || state.loading || !state.fetchPage) return;
  const label = button.textContent;
  state.loading = true;
  button.disabled = true;
  button.textContent = "Loading\u2026";
  renderWorlds();
  try {
    const page = await state.fetchPage(state.cursor);
    const have = new Set(state.rows.map((w) => w.id));
    state.rows.push(...page.worlds.filter((w) => !have.has(w.id)));
    state.cursor = page.cursor;
  } catch (err2) {
    state.note = err2.message || "Could not load these worlds.";
  } finally {
    state.loading = false;
    button.disabled = false;
    button.textContent = label;
    renderWorlds();
    syncRelayNote();
  }
}
function loadShelf() {
  var _a2;
  const [source, name] = (_a2 = WORLD_SHELVES.find(([s]) => s === el.worldShelf.value)) != null ? _a2 : WORLD_SHELVES[0];
  browseWorlds(shelfState, name, (cursor) => worldShelf(source, cursor), el.worldShelfGo);
}
function setCreatorNote(text, bad = false) {
  el.creatorNote.textContent = text;
  el.creatorNote.classList.toggle("bad", bad);
  el.creatorNote.hidden = !text;
}
async function findCreator() {
  const text = el.creatorQ.value.trim();
  if (!text) {
    setCreatorNote("Type a username or name first.", true);
    return;
  }
  el.creatorFind.disabled = true;
  el.creatorFind.textContent = "Searching\u2026";
  setCreatorNote("");
  try {
    const people = await searchPeople(text);
    el.creatorPick.replaceChildren(
      ...people.map(
        (p) => new Option(
          p.alias ? `@${p.alias}${p.name && p.name !== p.alias ? ` \u2014 ${p.name}` : ""}` : p.name || p.id,
          p.id
        )
      )
    );
    el.creatorPick.hidden = el.creatorGo.hidden = !people.length;
    if (!people.length) setCreatorNote(`No one matches "${text}".`, true);
  } catch (err2) {
    setCreatorNote(err2.message || "Could not search people.", true);
  } finally {
    el.creatorFind.disabled = false;
    el.creatorFind.textContent = "Find creator";
    syncRelayNote();
  }
}
function loadCreatorWorlds() {
  const opt = el.creatorPick.selectedOptions[0];
  if (!opt) return;
  const who = opt.textContent.split(" \u2014 ")[0];
  browseWorlds(creatorState, `By ${who}`, (cursor) => publishedWorlds(opt.value, cursor), el.creatorGo);
}
function worldSorter(mode) {
  const most = (key) => (a, b) => {
    var _a2, _b2;
    return ((_a2 = b[key]) != null ? _a2 : -1) - ((_b2 = a[key]) != null ? _b2 : -1);
  };
  if (mode === "visits" || mode === "online" || mode === "likes") return most(mode);
  if (mode === "az") return (a, b) => a.name.localeCompare(b.name);
  if (mode === "za") return (a, b) => b.name.localeCompare(a.name);
  return null;
}
function bigNumber(n) {
  return n == null ? "\u2014" : Number(n).toLocaleString();
}
function anyWorld(id) {
  return [...worldLookups, ...shelfState.rows, ...creatorState.rows, ...worldState.rows].find((w) => w.id === id);
}
function renderWorlds() {
  var _a2, _b2, _c, _d, _e;
  const q = el.worldQ.value.trim().toLowerCase();
  const sort = worldSorter(el.worldSort.value);
  const paged = pagedWorlds();
  const all = worldTab === "lookup" ? worldLookups : worldTab === "saved" ? worldState.rows : paged.rows;
  const shown = all.filter((w) => textMatch(q, w.name, w.id));
  const rows = sort ? shown.sort(sort) : shown;
  const art = loadSettings().images;
  const focused = (_c = (_b2 = (_a2 = document.activeElement) == null ? void 0 : _a2.closest) == null ? void 0 : _b2.call(_a2, "#worldRows tr[data-world]")) == null ? void 0 : _c.dataset.world;
  el.worldRows.innerHTML = rows.map(
    (w) => `<tr class="app" tabindex="0" data-world="${esc(w.id)}" aria-expanded="${worldOpen.has(w.id)}">
      <td class="name">${art && w.image ? `<img class="art" src="${esc(w.image)}" alt="" loading="lazy">` : ""}${esc(w.name)}</td>
      <td class="num">${esc(w.id)}</td>
      <td class="num">${bigNumber(w.visits)}</td>
      <td class="num">${bigNumber(w.online)}</td>
      <td class="num">${bigNumber(w.likes)}</td>
    </tr>${worldOpen.has(w.id) ? worldDetail(w) : ""}`
  ).join("");
  if (focused) (_d = el.worldRows.querySelector(`tr[data-world="${CSS.escape(focused)}"]`)) == null ? void 0 : _d.focus();
  const state = worldTab === "saved" ? worldState : paged;
  const loading = (_e = state == null ? void 0 : state.loading) != null ? _e : false;
  const asked = worldTab === "lookup" ? worldLookups.length > 0 : state.asked;
  const prompt = {
    top: "Pick a list and press Get worlds.",
    creator: "Find a creator by username or name, pick them, then press Get their worlds.",
    lookup: "Paste a world ID or a horizon.meta.com world link and press Look up world.",
    saved: "Press Get saved worlds to list the worlds this account has saved."
  }[worldTab];
  el.worldEmpty.hidden = rows.length > 0 || loading;
  el.worldEmpty.textContent = !asked ? prompt : all.length ? "Nothing matches." : (state == null ? void 0 : state.note) || (worldTab === "saved" ? "This account has no saved worlds." : "No worlds here.");
  let line = "";
  if (all.length) {
    const noun = worldTab === "saved" ? "saved world" : "world";
    const counted = rows.length === all.length ? plural(all.length, noun) : `${rows.length} of ${plural(all.length, noun)}`;
    line = `${paged ? `${paged.label}: ` : ""}${counted}${(paged == null ? void 0 : paged.cursor) ? ", more to load" : ""}.`;
    if (worldTab === "saved" && worldState.count > all.length) line += ` The store reports ${worldState.count}.`;
    if ((state == null ? void 0 : state.note) && paged) line += ` ${state.note}`;
  }
  el.worldCount.textContent = loading ? "Asking the store\u2026" : line;
  el.worldMoreBar.hidden = !(paged == null ? void 0 : paged.cursor) || paged.loading;
}
function initSearchBar() {
  el.q.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !["", "apps"].includes(routeView())) go("/apps");
  });
}
function yourCopy(app) {
  if (!app.id) return "<p>No store ID, so nothing on the account can be matched to it.</p>";
  const own = libraryNames == null ? void 0 : libraryNames.get(app.id);
  const ownLine = !libraryNames ? "<p>Asking the store what this account owns\u2026</p>" : own ? `<p class="hint">In your Quest library \u2014 ${esc(own.state ? words2(own.state) : "owned")}, from ${esc(
    grantLabel(own.grant)
  )}${own.lastUsed ? `, last played ${esc(isoDay(own.lastUsed))}` : ""}.</p>` : `<p class="hint">Not in your Quest library.</p>`;
  return `<h3>Ownership</h3>${ownLine}${channelSection(app)}${app.platform === "PC" ? "" : dlcTable(app)}${accountSections(app, "play", { load: true })}${accountSections(app, "backup", { load: true })}`;
}
function channelSection(app) {
  const mine = myChannels.get(app.id);
  const failed = layoutState.channelErrors.get(app.id);
  let body;
  if (failed) body = `<p class="warn">${esc(failed)}</p>`;
  else if (!mine && layoutState.channelAsked.has(app.id)) body = `<button type="button" disabled>Loading\u2026</button>`;
  else if (!mine) body = `<button type="button" data-load="channels">Get release channels</button>`;
  else if (mine.none) body = "<p>Needs your own access token, set in Settings.</p>";
  else if (!mine.channels.length) body = "<p>The store lists no release channels for this account.</p>";
  else {
    const on = mine.channels.find((c) => c.id === mine.current);
    body = `<p class="hint">${on ? `This account is on <strong>${esc(on.name)}</strong>.` : "This account is on none of them."} ${plural(mine.channels.length, "channel")} it can see.</p>
      <div class="vscroll short">
        <table class="vtable plain">
          <thead><tr><th>Channel</th><th>Version</th><th>Build</th><th>Open to</th><th></th></tr></thead>
          <tbody>${mine.channels.map(
      (c) => {
        var _a2, _b2;
        return `<tr>
                <td>${esc(c.name)}</td>
                <td>${esc((_a2 = c.version) != null ? _a2 : "\u2014")}</td>
                <td>${(_b2 = c.versionCode) != null ? _b2 : "\u2014"}</td>
                <td>${c.public ? "Everyone" : "Invited"}</td>
                <td>${c.id === mine.current ? "You're on this" : ""}</td>
              </tr>`;
      }
    ).join("")}</tbody>
        </table>
      </div>`;
  }
  return `<h3>Release channels</h3>${body}`;
}
function wantYourCopy() {
  if (!libraryNames) appNames().then(() => renderAccountTabs());
}
function loadForApp(app, what) {
  if (what === "dlc") return loadIaps();
  if (what === "play") return loadPlaytime();
  if (what === "backup") return loadBackups();
  if (what === "channels" && (app == null ? void 0 : app.id) && !layoutState.channelAsked.has(app.id)) {
    layoutState.channelAsked.add(app.id);
    layoutState.channelErrors.delete(app.id);
    renderAccountTabs();
    myReleaseChannels(app.id).then((found) => myChannels.set(app.id, found != null ? found : { none: true, current: null, channels: [] })).catch((err2) => layoutState.channelErrors.set(app.id, err2.message || "Could not load release channels.")).finally(() => renderAccountTabs());
  }
}
function toggleWorld(id) {
  var _a2;
  if (worldOpen.has(id)) worldOpen.delete(id);
  else {
    worldOpen.add(id);
  }
  renderWorlds();
  (_a2 = el.worldRows.querySelector(`tr[data-world="${CSS.escape(id)}"]`)) == null ? void 0 : _a2.focus();
}
function getWorldDetails(id) {
  if (!worldInfo.has(id)) loadWorld(id);
  loadWorldFlags(id);
}
async function loadWorld(id) {
  const world = anyWorld(id);
  if (!world) return;
  worldInfo.set(id, { loading: true, data: null, note: "" });
  try {
    worldInfo.set(id, { loading: false, data: await worldDetails(world), note: "" });
  } catch (err2) {
    worldInfo.set(id, { loading: false, data: null, note: err2.message || "Could not load this world." });
  } finally {
    renderWorlds();
    syncRelayNote();
  }
}
async function loadWorldFlags(id) {
  if (worldFlagInfo.has(id)) return;
  worldFlagInfo.set(id, "loading");
  try {
    worldFlagInfo.set(id, await worldFlags(id));
  } catch {
    worldFlagInfo.set(id, {});
  }
  renderWorlds();
}
var yesNo = (v) => v == null ? null : v ? "Yes" : "No";
function worldDetail(w) {
  const info = worldInfo.get(w.id);
  const flags = worldFlagInfo.get(w.id);
  let body;
  if (!info) body = `<button type="button" data-world-load="${esc(w.id)}">Get details</button>`;
  else if (info.loading) body = `<button type="button" disabled>Loading\u2026</button>`;
  else if (info.note) body = `<p class="warn">${esc(info.note)}</p>`;
  else {
    const d = info.data;
    const asking = flags === "loading";
    const f = asking ? {} : flags != null ? flags : {};
    const images = f.screenshot && !d.images.some((i) => i.uri === f.screenshot) ? [...d.images, { label: "Screenshot", uri: f.screenshot }] : d.images;
    const pictures = loadSettings().images ? images.length ? `<h3>Pictures</h3><div class="world-pics">${images.map(
      (i) => `<figure><img src="${esc(i.uri)}" alt="${esc(`${w.name}: ${i.label}`)}" loading="lazy">
                 <figcaption>${esc(i.label)}</figcaption></figure>`
    ).join("")}</div>` : "" : images.length ? `<p class="hint">${plural(images.length, "picture")} \u2014 switch on Show app art in search results, in Settings, to see them.</p>` : "";
    const ask = (v) => asking ? "Asking\u2026" : v;
    const comfort = f.comfort ? f.comfort.charAt(0) + f.comfort.slice(1).toLowerCase().replace(/_/g, " ") : null;
    body = `${factGroups([
      [
        "World",
        [
          ["World ID", w.id],
          ["Creator", ask(f.creator)],
          ["Destination ID", d.destinationId],
          ["Last visited", d.lastVisit ? isoDay(d.lastVisit) : d.destinationId ? "Not recorded" : null],
          ["Opens in", d.apps.join(", ")],
          ["Players now", ask(f.playersNow == null ? null : String(f.playersNow))],
          ["Capacity", ask(f.capacity == null ? null : `${f.capacity} per instance`)],
          ["Comfort", ask(comfort)],
          ["Maturity", ask(f.maturity ? words2(f.maturity) : null)],
          ["Under-18s", ask(f.youth ? words2(f.youth) : null)],
          ["Published", ask(f.privacy ? words2(f.privacy) : null)],
          ["Members only", ask(yesNo(f.membersOnly))],
          ["In search", ask(yesNo(f.searchable))],
          ["Phone & desktop", ask(yesNo(f.xscreen))],
          ["Mixed reality", ask(yesNo(f.mixedReality))],
          ["Beta", ask(yesNo(f.beta))],
          ["Cloud streaming", ask(yesNo(f.streamable))],
          ["Runtime", ask(f.runtime)]
        ]
      ]
    ])}${f.description ? `<h3>Description</h3><p>${esc(f.description).replace(/\n/g, "<br>")}</p>` : ""}${d.launchLink ? `<h3>Launch link</h3><p class="world-link">${esc(d.launchLink)}</p>` : ""}${pictures}`;
  }
  return `<tr class="detail"><td colspan="5"><div class="panel">${body}</div></td></tr>`;
}
function setWorldNote(text, bad = false) {
  el.worldLookupNote.textContent = text;
  el.worldLookupNote.classList.toggle("bad", bad);
  el.worldLookupNote.hidden = !text;
}
async function lookUpWorld() {
  var _a2;
  const id = parseWorldId(el.worldLookup.value);
  if (!id) {
    setWorldNote("That is not a world ID \u2014 paste the long number, or a horizon.meta.com world link.", true);
    return;
  }
  setWorldNote("");
  const known = anyWorld(id);
  if (known) worldLookups = [known, ...worldLookups.filter((w) => w.id !== id)];
  else {
    el.worldLookupGo.disabled = true;
    el.worldLookupGo.textContent = "Looking up\u2026";
    try {
      const world = await lookupWorld(id);
      worldLookups = [world, ...worldLookups.filter((w) => w.id !== world.id)];
    } catch (err2) {
      setWorldNote(`Not found: ${err2.message}`, true);
      return;
    } finally {
      el.worldLookupGo.disabled = false;
      el.worldLookupGo.textContent = "Look up world";
      syncRelayNote();
    }
  }
  worldOpen.add(id);
  setRoute({ world: id });
  renderWorlds();
  (_a2 = el.worldRows.querySelector(`tr[data-world="${CSS.escape(id)}"]`)) == null ? void 0 : _a2.scrollIntoView({ block: "nearest" });
}
window.__metadbStarted = true;
