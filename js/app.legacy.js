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
    var _a3 = dutf8(dat), s = _a3.s, r = _a3.r;
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
    var _a3 = r[fn], file = _a3[0], p = _a3[1];
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
    var _a3 = r[fn], file = _a3[0], p = _a3[1];
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
      var _a3 = zh(data, o, z), c_1 = _a3[0], sc = _a3[1], su = _a3[2], fn = _a3[3], no = _a3[4], off = _a3[5], b = slzh(data, off);
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
    var _a3 = zh(data, o, z), c_2 = _a3[0], sc = _a3[1], su = _a3[2], fn = _a3[3], no = _a3[4], off = _a3[5], b = slzh(data, off);
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
      var _a3 = hTree(lf, 15), dlt = _a3.t, mlb = _a3.l;
      var _b3 = hTree(df, 15), ddt = _b3.t, mdb = _b3.l;
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
        var _a3 = dutf8(dat), s = _a3.s, r = _a3.r;
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
      var _a3 = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a3[0], su = _a3[1], off = _a3[2];
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
        for (var _i = 0, _a3 = this.u; _i < _a3.length; _i++) {
          var f = _a3[_i];
          tl += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0);
        }
        var out = new u8(tl + 22);
        for (var _b3 = 0, _c = this.u; _b3 < _c.length; _b3++) {
          var f = _c[_b3];
          wzh(out, bt, f, f.f, f.u, -f.c - 2, l, f.o);
          bt += 46 + f.f.length + exfl(f.extra) + (f.o ? f.o.length : 0), l += f.b;
        }
        wzf(out, bt, this.u.length, tl, l);
        this.ondata(null, out, true);
        this.d = 2;
      };
      Zip2.prototype.terminate = function() {
        for (var _i = 0, _a3 = this.u; _i < _a3.length; _i++) {
          var f = _a3[_i];
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
            var _a3;
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
                  _a3 = dd ? [-2] : z64e(buf, i), sc_1 = _a3[0], su_1 = _a3[1];
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
  var _a3, _b3, _c, _d;
  try {
    return {
      token: localStorage.getItem("metadb.token") || DEFAULT_TOKEN,
      acToken: localStorage.getItem("metadb.acToken") || "",
      /* The FRL (Meta-account) token, upleveled from the signed-in token on the
         Settings page. Empty until the reader fetches it. For requests that need
         the FRL-scoped bearer rather than oc_www_at. */
      frlToken: localStorage.getItem("metadb.frlToken") || "",
      /* The OS-updater app token (authenticate_application, app 1556285957737177),
         saved when first minted for an OTA check so later checks reuse it. */
      upToken: localStorage.getItem("metadb.upToken") || "",
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
      /* Which screen opens when the site is loaded on the bare home page. */
      defaultView: localStorage.getItem("metadb.defaultView") || "apps",
      /* Inside the headset app: "downgrade" (its home layout) or "site". */
      layout: localStorage.getItem("metadb.layout") || "downgrade",
      /* Downgrade's "Show apps not installed". */
      dgAll: localStorage.getItem("metadb.dgAll") === "1",
      /* On unless explicitly turned off, so it keeps its old behaviour. */
      store: localStorage.getItem("metadb.store") !== "0",
      /* Check the watchlist automatically when the site opens. On by default. */
      watchAuto: localStorage.getItem("metadb.watchAuto") !== "0",
      /* Show a watch/unwatch control at the left of each app row. On by default. */
      watchButtons: localStorage.getItem("metadb.watchButtons") !== "0",
      /* Pop up a notification when a watched app's build changes during a check.
         On by default; the nav badge and the list still update when it is off. */
      watchNotify: localStorage.getItem("metadb.watchNotify") !== "0",
      /* How long a pop-up stays before it fades, in ms. "0" means it waits for
         a dismiss and never times out. */
      notifyLinger: localStorage.getItem("metadb.notifyLinger") || "9000",
      /* Shortest gap between automatic watchlist checks, in ms — an auto-check
         that lands inside this window of the last one is skipped. "0" checks on
         every open. Default: 15 minutes. (Check now always runs regardless.) */
      watchThrottle: localStorage.getItem("metadb.watchThrottle") || "900000",
      /* Row spacing across the lists: "comfortable" (default) or "compact". */
      density: localStorage.getItem("metadb.density") || "comfortable",
      /* Developer: log every request to the console. Off by default. */
      log: localStorage.getItem("metadb.log") === "1",
      /* Column classes the user has switched off. */
      hidden: ((_a3 = localStorage.getItem("metadb.hidden")) != null ? _a3 : "").split(",").filter(Boolean),
      /* Set once the setup guide has been completed (or skipped). */
      setupDone: localStorage.getItem("metadb.setupDone") === "1",
      /* Top-level screens the reader turned off in the setup guide: each is
         hidden from the nav and never fetched until switched back on. */
      sectionsOff: ((_b3 = localStorage.getItem("metadb.sectionsOff")) != null ? _b3 : "").split(",").filter(Boolean),
      /* Per-app panel tabs turned off the same way (reviews, posts, add-ons,
         achievements). */
      panelsOff: ((_c = localStorage.getItem("metadb.panelsOff")) != null ? _c : "").split(",").filter(Boolean),
      /* Extra lookups turned off in the setup guide (EXTRAS in app.js): each is a
         request MetaDB otherwise sends alongside something else. */
      extrasOff: ((_d = localStorage.getItem("metadb.extrasOff")) != null ? _d : "").split(",").filter(Boolean)
    };
  } catch {
    return {
      token: DEFAULT_TOKEN,
      acToken: "",
      frlToken: "",
      upToken: "",
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
      defaultView: "apps",
      store: true,
      watchAuto: true,
      watchButtons: true,
      watchNotify: true,
      notifyLinger: "9000",
      watchThrottle: "900000",
      density: "comfortable",
      hidden: [],
      setupDone: false,
      sectionsOff: [],
      panelsOff: [],
      extrasOff: []
    };
  }
}
function extraOn(name) {
  return !loadSettings().extrasOff.includes(name);
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
    for (const key of ["token", "acToken", "frlToken", "upToken", "relay", "images", "details", "devDownloads", "binDownload", "tourDone", "obb", "autoOwned", "autoDlc", "autoPlaytime", "autoBackups", "wide", "motion", "motionSpeed", "fontSize", "hidden", "limit", "store", "watchAuto", "hmd", "searchSort", "mineSort", "buildSort", "defaultTrigger", "log", "layout", "dgAll", "watchButtons", "setupDone", "sectionsOff", "panelsOff", "extrasOff", "updaterOpts"]) {
      localStorage.removeItem(`metadb.${key}`);
    }
  } catch {
  }
  clearSecrets();
}
var BUILT_IN_RELAY = "/api?url={url}";
var BUILT_IN_DOWNLOADS = "/dl?url={url}";
var DOWNLOAD_HOST = /^https:\/\/securecdn(-[a-z0-9-]+)?\.oculus\.com\//;
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
  const relay = loadSettings().relay || (DOWNLOAD_HOST.test(url) ? BUILT_IN_DOWNLOADS : BUILT_IN_RELAY);
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
var REQUEST_TIMEOUT_MS = 9e4;
var EXT_HOSTS = /^https:\/\/(graph|realitylabs-graph)\.oculus\.com\//;
var extRelay = false;
var extSeq = 0;
var extWaiting = /* @__PURE__ */ new Map();
function useExtensionRelay(on) {
  extRelay = Boolean(on);
}
var extensionRelayOn = () => extRelay;
try {
  window.addEventListener("message", (e) => {
    var _a3;
    if (e.source !== window || e.origin !== location.origin || ((_a3 = e.data) == null ? void 0 : _a3.metadbExt) !== true || e.data.type !== "relay-reply") return;
    const done = extWaiting.get(e.data.id);
    if (done) {
      extWaiting.delete(e.data.id);
      done(e.data);
    }
  });
} catch {
}
async function viaExtension(url, init) {
  var _a3;
  const headers = { ...await ocmsHeaders().catch(() => ({})), ...init.headers };
  const id = ++extSeq;
  const reply = await new Promise((resolve) => {
    var _a4;
    extWaiting.set(id, resolve);
    window.postMessage({ metadbPage: true, type: "relay", id, url, method: init.method || "GET", body: (_a4 = init.body) != null ? _a4 : null, headers }, location.origin);
    setTimeout(() => {
      if (extWaiting.delete(id)) resolve({ error: "the extension did not answer in time" });
    }, REQUEST_TIMEOUT_MS);
  });
  if (reply.error || typeof reply.status !== "number") throw new Error(reply.error || "no answer from the extension");
  return new Response((_a3 = reply.text) != null ? _a3 : "", {
    status: reply.status,
    headers: { "Content-Type": reply.contentType || "application/json", "X-MetaDB-Relay": "extension" }
  });
}
async function getJSON(url) {
  const { relay, log } = loadSettings();
  const started = log ? performance.now() : 0;
  const q = url.indexOf("?");
  const base = q === -1 ? url : url.slice(0, q);
  const query = q === -1 ? "" : url.slice(q + 1);
  const post = base === ENDPOINT || base === "https://meta.graph.meta.com/graphql";
  const target = post ? route(base) : route(url);
  const init = post ? {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: query
  } : { headers: { Accept: "application/json" } };
  if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
    init.signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  }
  const logUrl = post ? `${base}?${withoutToken(query)}` : forLog(url);
  let res = null;
  if (extRelay && !relay && EXT_HOSTS.test(post ? base : url)) {
    try {
      res = await viaExtension(post ? ENDPOINT : url, init);
    } catch {
      extRelay = false;
    }
  }
  if (!res) try {
    res = await fetch(target, init);
  } catch (err2) {
    if ((err2 == null ? void 0 : err2.name) === "TimeoutError") {
      if (log) emitLog({ url: logUrl, error: "no reply in time" });
      throw new Error("the request timed out \u2014 the store or the relay did not answer");
    }
    if (log) emitLog({ url: logUrl, error: "no reply \u2014 relay unreachable or blocked" });
    throw new Error(
      relay ? "could not reach the relay \u2014 check the URL on the Settings page" : "the browser blocked this request; set a relay URL on the Settings page"
    );
  }
  if (log) {
    const via = res.headers.get("X-MetaDB-Relay") === "extension" ? " (via extension)" : "";
    emitLog({ url: logUrl + via, status: res.status, ms: Math.round(performance.now() - started) });
  }
  if (!relay && res.status === 404 && !res.headers.has("X-MetaDB-Relay")) {
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
    const looksHtml = /^\s*<(?:!doctype|html)[\s>]/i.test(text) || (res.headers.get("content-type") || "").includes("text/html");
    if (!relay && looksHtml) {
      builtInMissing = true;
      throw new Error(
        "this site has no built-in relay \u2014 set a relay URL on the Settings page"
      );
    }
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
  var _a3;
  const parts = split(text);
  const root = (_a3 = parts.find((p) => p.data || p.errors || p.error)) != null ? _a3 : null;
  if (!(root == null ? void 0 : root.data)) return root;
  for (const part of parts) {
    if (part === root || !Array.isArray(part.path)) continue;
    if (Array.isArray(part.items)) {
      let list = root.data;
      for (const step of part.path.slice(0, -1)) list = list == null ? void 0 : list[step];
      const at = part.path[part.path.length - 1];
      if (Array.isArray(list) && Number.isInteger(at)) list.splice(at, part.items.length, ...part.items);
      continue;
    }
    if (!part.data) continue;
    let node = root.data;
    for (const step of part.path) node = node == null ? void 0 : node[step];
    if (node && typeof node === "object") Object.assign(node, part.data);
  }
  return root;
}
var day = (secs) => new Date(secs * 1e3).toISOString().slice(0, 10);
function parseHistory(json) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  if ((_a3 = json == null ? void 0 : json.errors) == null ? void 0 : _a3.length) throw new Error(json.errors[0].message);
  if (json == null ? void 0 : json.error) throw new Error((_b3 = json.error.message) != null ? _b3 : "request rejected");
  const nodes = (_e = (_d = (_c = json == null ? void 0 : json.data) == null ? void 0 : _c.node) == null ? void 0 : _d.primary_binaries) == null ? void 0 : _e.nodes;
  if (!nodes) throw new Error("no build history in the reply");
  const builds = nodes.map((b) => {
    var _a4, _b4, _c2, _d2, _e2;
    return {
      id: b.id,
      version: (_a4 = b.version) != null ? _a4 : "\u2014",
      versionCode: b.version_code,
      releasedAt: b.created_date ? day(b.created_date) : null,
      createdAt: (_b4 = b.created_date) != null ? _b4 : 0,
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
    var _a4, _b4, _c2;
    return {
      id: (_a4 = r.id) != null ? _a4 : null,
      status: r.administration_status ? words(r.administration_status) : null,
      created: r.created_date ? day(r.created_date) : null,
      submissions: (_c2 = (_b4 = r.submission_events) == null ? void 0 : _b4.count) != null ? _c2 : 0
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
var SUBMISSION_DOC_ID = "28182136738069293";
async function submissionDetail(submissionID) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const json = await storeQuery(SUBMISSION_DOC_ID, { submissionID: String(submissionID) });
  refuse(json, "Viewing a submission");
  const sub = (_a3 = json.data) == null ? void 0 : _a3.fetch__ApplicationSubmission;
  if (!sub) throw new Error("no submission in the reply");
  const p = (_b3 = sub.pdp_metadata_with_fallback) != null ? _b3 : {};
  const b = (_d = (_c = sub.binary_with_fallback) != null ? _c : sub.binary) != null ? _d : null;
  const bool2 = (v) => typeof v === "boolean" ? v : null;
  return {
    id: sub.id ? String(sub.id) : String(submissionID),
    status: sub.status ? words(sub.status) : null,
    reviewStatus: sub.review_status ? words(sub.review_status) : null,
    releaseType: sub.release_type ? words(sub.release_type) : null,
    releaseStatus: sub.release_status ? words(sub.release_status) : null,
    publishDate: sub.publish_date ? day(sub.publish_date) : null,
    autoApproved: bool2(sub.was_auto_approved),
    isInitial: bool2(sub.is_initial_release),
    previousId: ((_e = sub.previous_revision) == null ? void 0 : _e.id) ? String(sub.previous_revision.id) : null,
    binary: b ? {
      id: b.id ? String(b.id) : null,
      version: (_f = b.version) != null ? _f : null,
      appMode: b.app_mode ? words(b.app_mode) : null,
      releaseStatus: b.release_status ? words(b.release_status) : null
    } : null,
    listing: {
      publisher: (_g = p.publisher_name) != null ? _g : null,
      website: (_h = p.website_url) != null ? _h : null,
      category: p.category ? words(p.category) : null,
      comfort: p.comfort_rating ? words(p.comfort_rating) : null,
      internet: p.internet_connection ? words(p.internet_connection) : null,
      playArea: p.play_area ? words(p.play_area) : null,
      subscription: p.subscription_type ? words(p.subscription_type) : null,
      earlyAccess: p.early_access_status ? words(p.early_access_status) : null,
      genres: ((_i = p.genres) != null ? _i : []).filter(Boolean).map(String),
      languages: ((_j = p.supported_in_app_languages) != null ? _j : []).filter(Boolean).map(String),
      iarc: (_l = (_k = p.iarc_cert) == null ? void 0 : _k.external_id) != null ? _l : null
    }
  };
}
var headerFiles = /* @__PURE__ */ new Map();
function headersFile(name) {
  if (!headerFiles.has(name)) {
    const p = fetch(new URL(`../data/${name}${new URL(import.meta.url).search}`, import.meta.url)).then((res) => {
      if (!res.ok) throw new Error(`${name} answered ${res.status}`);
      return res.json();
    });
    p.catch(() => headerFiles.delete(name));
    headerFiles.set(name, p);
  }
  return headerFiles.get(name);
}
function ocmsNewer(b, a) {
  const v = (h) => {
    var _a3, _b3, _c;
    return ((_c = (_b3 = (_a3 = h == null ? void 0 : h["User-Agent"]) == null ? void 0 : _a3.match(/FBAV\/([\d.]+)/)) == null ? void 0 : _b3[1]) != null ? _c : "").split(".").map((n) => Number(n) || 0);
  };
  const x = v(b);
  const y = v(a);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  }
  try {
    return BigInt(b["X-Build-Version-Incremental"] || 0) > BigInt(a["X-Build-Version-Incremental"] || 0);
  } catch {
    return false;
  }
}
async function ocmsHeaders() {
  const fixed = await headersFile("ocms-headers.json");
  const token = (loadSettings().token || "").trim();
  if (!token || token.includes("|")) return fixed;
  const latest = await headersFile("ocms-headers-latest.json").catch(() => null);
  return latest && ocmsNewer(latest, fixed) ? latest : fixed;
}
function parseRepo(input) {
  var _a3;
  const s = String(input != null ? input : "").trim();
  const m = (_a3 = s.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#].*)?$/i)) != null ? _a3 : s.match(/^([\w.-]+)\/([\w.-]+?)(?:\.git)?$/);
  return m ? `${m[1]}/${m[2]}` : null;
}
var GITHUB_PAGES = 10;
async function githubReleases(repo) {
  var _a3, _b3, _c;
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
    url = (_c = (_b3 = ((_a3 = res.headers.get("link")) != null ? _a3 : "").match(/<([^>]+)>;\s*rel="next"/)) == null ? void 0 : _b3[1]) != null ? _c : null;
  }
  return all.filter((r) => !r.draft).map((r) => {
    var _a4, _b4;
    return {
      tag: r.tag_name,
      name: r.name || r.tag_name,
      published: ((_a4 = r.published_at) != null ? _a4 : "").slice(0, 10),
      prerelease: Boolean(r.prerelease),
      url: r.html_url,
      assets: ((_b4 = r.assets) != null ? _b4 : []).filter((a) => /\.apk$/i.test(a.name)).map((a) => ({ id: String(a.id), name: a.name, size: a.size, url: a.browser_download_url }))
    };
  }).filter((r) => r.assets.length);
}
async function storeNames(ids) {
  var _a3;
  const list = [...new Set(ids.map(String))].filter(Boolean);
  if (!list.length) return /* @__PURE__ */ new Map();
  const { token } = loadSettings();
  const json = await getJSON(
    `${NODE}/?` + new URLSearchParams({ ids: list.join(","), fields: "display_name", access_token: token })
  );
  if (json.error) throw new Error((_a3 = json.error.message) != null ? _a3 : "request rejected");
  const out = /* @__PURE__ */ new Map();
  for (const [id, node] of Object.entries(json)) {
    if (node == null ? void 0 : node.display_name) out.set(String(id), node.display_name);
  }
  return out;
}
async function lookupApp(id) {
  var _a3, _b3, _c, _d, _e;
  const { token } = loadSettings();
  const meta = await getJSON(
    `${NODE}/${encodeURIComponent(id)}/?` + new URLSearchParams({ access_token: token, fields: "display_name,platform" })
  );
  if (meta.error) throw new Error((_a3 = meta.error.message) != null ? _a3 : "app not found");
  const latest = await checkApp({ id });
  const hmd = meta.platform === "PC" ? "RIFT" : "EUREKA";
  let image = await appIcon(id, hmd);
  if (!image) {
    try {
      const page = await appPage(id, hmd);
      const byLabel = (label) => {
        var _a4, _b4, _c2;
        return (_c2 = (_b4 = (_a4 = page.media) == null ? void 0 : _a4.find((m) => m.label === label && m.uri)) == null ? void 0 : _b4.uri) != null ? _c2 : null;
      };
      image = (_d = (_c = (_b3 = byLabel("Poster")) != null ? _b3 : byLabel("Hero")) != null ? _c : byLabel("Trailer still")) != null ? _d : null;
    } catch {
    }
  }
  return {
    id: String(id),
    name: meta.display_name,
    platform: meta.platform,
    image,
    channels: (_e = latest.channels) != null ? _e : []
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
  ["LAGUNA", "Rift S"],
  ["LOMA", "VR Glasses"]
];
var HMD_PLATFORM = {
  PACIFIC: "ANDROID_3DOF",
  RIFT: "PC",
  LAGUNA: "PC"
};
function extractApps(json, fallbackPlatform = null) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
  const categories = (_c = (_b3 = (_a3 = json == null ? void 0 : json.data) == null ? void 0 : _a3.viewer) == null ? void 0 : _b3.contextual_search) == null ? void 0 : _c.all_category_results;
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
        /* Square cover first, then the launcher/VR icon, then the portrait poster
           or the hero — some apps publish only one of these, so without the chain
           their row is blank. Whatever the search node actually carries is used. */
        image: (_A = (_z = (_x = (_u = (_s = (_q = app.cover_square_image) == null ? void 0 : _q.uri) != null ? _s : (_r = app.icon_image) == null ? void 0 : _r.uri) != null ? _u : (_t = app.vr_icon_image) == null ? void 0 : _t.uri) != null ? _x : (_w = (_v = app.mobilePoster) == null ? void 0 : _v.thumbnail) == null ? void 0 : _w.uri) != null ? _z : (_y = app.hero_image) == null ? void 0 : _y.uri) != null ? _A : null,
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
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
  const update = (_c = (_b3 = (_a3 = json == null ? void 0 : json.data) == null ? void 0 : _a3.app_binary_updates) == null ? void 0 : _b3.updates) == null ? void 0 : _c[0];
  const binary = update == null ? void 0 : update.new_binary;
  if (!binary) throw new Error("no binary manifest in the reply");
  const deps = (_g = (_f = (_e = (_d = update.application) == null ? void 0 : _d.latest_available_binary) == null ? void 0 : _e.dependency_configs) == null ? void 0 : _f.edges) != null ? _g : [];
  const depNodes = deps.map((e) => e.node);
  const requiredOs = (_h = depNodes.find(
    (n) => {
      var _a4;
      return /required_os_version/i.test((_a4 = n == null ? void 0 : n.identifier) != null ? _a4 : "");
    }
  )) == null ? void 0 : _h.version;
  const requiredPsdk = (_i = depNodes.find(
    (n) => {
      var _a4;
      return /required_psdk_version/i.test((_a4 = n == null ? void 0 : n.identifier) != null ? _a4 : "");
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  return {
    packageName: (_a3 = binary.package_name) != null ? _a3 : null,
    version: (_b3 = binary.version) != null ? _b3 : null,
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
  var _a3, _b3, _c, _d, _e, _f;
  const json = await storeQuery(BINARY_DOC_ID, {
    params: { app_params: [{ app_id: String(appId), version_code: String(versionCode) }] },
    fetch_fallback_uris: false
  }, { client: true });
  refuse(json, "Build details");
  const binary = (_d = (_c = (_b3 = (_a3 = json == null ? void 0 : json.data) == null ? void 0 : _a3.app_binary_info) == null ? void 0 : _b3.info) == null ? void 0 : _c[0]) == null ? void 0 : _d.binary;
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
  const json = await storeQuery(STORE_DOC_ID, {
    hmdType,
    itemId: String(id),
    /* The page turns these on to get the metadata line and off to skip
       the AI review summary. Both are required. */
    __relay_internal__pv__MDCAppStorFortheMetadataLineEnablerelayprovider: true,
    __relay_internal__pv__MDCAppStoreGenAIReviewSummaryEnabledrelayprovider: false
  });
  refuse(json, "The store listing");
  const app = (_a3 = json == null ? void 0 : json.data) == null ? void 0 : _a3.app_store_item;
  if (!app) throw new Error("no listing in the reply");
  if (app.genre_names === void 0 && app.category_name === void 0) {
    throw new Error(
      "the store sent the description but not the details \u2014 that half needs a logged-in access token, set on the Settings page"
    );
  }
  const binary = (_b3 = app.latest_supported_binary) != null ? _b3 : {};
  const count = app.quality_rating_i18n_count_string;
  return {
    name: (_c = app.display_name) != null ? _c : null,
    genres: (_d = app.genre_names) != null ? _d : [],
    category: (_e = app.category_name) != null ? _e : null,
    modes: (_f = app.user_interaction_mode_names) != null ? _f : [],
    playerModes: ((_g = app.supported_player_modes) != null ? _g : []).map((m) => {
      var _a4;
      return (_a4 = PLAYER_MODES[m]) != null ? _a4 : words(m);
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
  var _a3, _b3;
  return Number((_b3 = (_a3 = /_s(\d+)x/.exec(uri)) == null ? void 0 : _a3[1]) != null ? _b3 : 0);
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
        var _a3;
        return {
          ...m,
          width: (_a3 = m.width) != null ? _a3 : mediaSize(m.uri) || null
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
  var _a3;
  if (!node || typeof node !== "object") return [];
  const set = mediaSet();
  for (const [field, label] of Object.entries(IMAGE_FIELDS)) {
    set.add(label, (_a3 = node[field]) == null ? void 0 : _a3.uri);
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
  var _a3;
  if (!packageName) return [];
  const table = await spatialAssets();
  const themes = (_a3 = table == null ? void 0 : table.apps) == null ? void 0 : _a3[packageName];
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j;
  const set = mediaSet();
  set.add("Hero", (_a3 = app.hero_image) == null ? void 0 : _a3.uri);
  ((_b3 = app.screenshots) != null ? _b3 : []).forEach(
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
  var _a3, _b3;
  const json = await storeQuery(OFFER_DOC_ID, { itemId: String(id), hmdType });
  refuse(json, "The app page");
  const app = (_a3 = json == null ? void 0 : json.data) == null ? void 0 : _a3.app_store_item;
  if (!app) throw new Error("no app in the reply");
  const offer = app.current_offer;
  return {
    offer: (offer == null ? void 0 : offer.id) ? {
      offerId: String(offer.id),
      free: ((_b3 = offer.price) == null ? void 0 : _b3.offset_amount) === "0"
    } : null,
    media: pageMedia(app)
  };
}
var PDP_DOC_ID = "28952468254442061";
var pdpVariables = (appID, hmdType) => ({
  appID: String(appID),
  hmdType,
  encode: "JPEG",
  LIBRARY_INFO_LAST_ACTIVE_WINDOW: -1,
  SELECTED_DEVICE_SERIAL: null,
  metaStoreCatalogID: "517700695939066",
  shouldShowNewPostPurchaseCTAs: false,
  shouldRenderRelatedItemsSubsection: false,
  shouldShowUninstallAction: false,
  __relay_internal__pv__loggingPriceTyperelayprovider: false,
  __relay_internal__pv__showPremiumBundlerelayprovider: false,
  __relay_internal__pv__showPreOrderBundlerelayprovider: false,
  __relay_internal__pv__showExclusiveIapForBundlesrelayprovider: false,
  __relay_internal__pv__horizonPlusBadgerelayprovider: false,
  __relay_internal__pv__shouldEnableMetaCreditrelayprovider: false
});
async function appIcon(id, hmdType = "EUREKA") {
  var _a3, _b3, _c, _d, _e;
  try {
    const json = await storeQuery(PDP_DOC_ID, pdpVariables(id, hmdType));
    const it = (_a3 = json == null ? void 0 : json.data) == null ? void 0 : _a3.item;
    return (_e = (_d = (_b3 = it == null ? void 0 : it.coverSquare) == null ? void 0 : _b3.uri) != null ? _d : (_c = it == null ? void 0 : it.coverLandscape) == null ? void 0 : _c.uri) != null ? _e : null;
  } catch {
    return null;
  }
}
async function searchStore(query, { limit = 5, hmdType = "EUREKA" } = {}) {
  var _a3;
  const json = await storeQuery(SEARCH_DOC_ID, {
    query,
    hmdType,
    firstSearchResultItems: limit
  });
  refuse(json, "Store search");
  return extractApps(json, (_a3 = HMD_PLATFORM[hmdType]) != null ? _a3 : "ANDROID_6DOF").slice(0, limit);
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
  var _a3, _b3, _c;
  const json = await storeQuery(DEFAULT_APPS_DOC_ID, {
    hmd: hmdType,
    node_id: DEFAULT_APPS_STORE_ID,
    install_trigger: trigger,
    ...DEFAULT_APPS_VARS
  }, { client: true });
  refuse(json, "Default apps");
  const nodes = (_c = (_b3 = (_a3 = json.data) == null ? void 0 : _a3.fetch__AppStore) == null ? void 0 : _b3.default_applications) != null ? _c : [];
  return nodes.map(defaultAppRow);
}
function defaultAppRow(n) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i;
  const b = n.latest_supported_binary;
  return {
    id: String(n.id),
    name: n.display_name || n.package_name || String(n.id),
    packageName: (_a3 = n.package_name) != null ? _a3 : null,
    platform: (_b3 = n.platform) != null ? _b3 : null,
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
    var _a3;
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
        platform: (_a3 = node.platform) != null ? _a3 : "ANDROID_6DOF"
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
  var _a3;
  const hit = (await lookupPackages([packageName])).get(packageName);
  if (!hit) throw new Error("no app matched that package name");
  const out = { id: hit.id, packageName, platform: hit.platform };
  if (hit.name) out.name = hit.name;
  try {
    out.channels = (_a3 = (await checkApp({ id: out.id })).channels) != null ? _a3 : [];
  } catch {
    out.channels = [];
  }
  out.image = await appIcon(out.id, hit.platform === "PC" ? "RIFT" : "EUREKA");
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const app = node == null ? void 0 : node.item;
  if (!(app == null ? void 0 : app.id)) return null;
  const binary = (_a3 = app.latest_supported_binary) != null ? _a3 : null;
  return {
    id: String(app.id),
    name: app.display_name || app.package_name || String(app.id),
    packageName: (_b3 = app.package_name) != null ? _b3 : null,
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
  var _a3, _b3;
  const root = (_a3 = json == null ? void 0 : json.data) == null ? void 0 : _a3.entitlements;
  if (!root || typeof root !== "object") return null;
  return (_b3 = Object.values(root).find((v) => v && Array.isArray(v.edges))) != null ? _b3 : null;
}
async function myEntitlements(kind = "quest") {
  var _a3, _b3, _c;
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
    for (const edge of (_a3 = list.edges) != null ? _a3 : []) {
      const app = entitlementApp(edge == null ? void 0 : edge.node, platform, kind !== "expired");
      if (app && !out.has(app.id)) out.set(app.id, app);
    }
    if (!((_b3 = list.page_info) == null ? void 0 : _b3.has_next_page)) break;
    cursor = (_c = list.page_info.end_cursor) != null ? _c : null;
    if (!cursor) break;
  }
  return [...out.values()];
}
function accountError(json, what) {
  var _a3, _b3, _c;
  if ((_a3 = json.errors) == null ? void 0 : _a3.length) {
    const msg = (_b3 = json.errors[0].message) != null ? _b3 : "query refused";
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
  var _a3;
  const json = await storeQuery(clientDocId, variables, { client: true });
  refuse(json, what);
  return (_a3 = json.data) != null ? _a3 : {};
}
var RELEASE_CHANNELS_DOC_ID = "18030355666629348722465830248";
async function myReleaseChannels(appId) {
  var _a3, _b3, _c;
  if (loadSettings().token === DEFAULT_TOKEN) return null;
  const data = await accountQuery(
    RELEASE_CHANNELS_DOC_ID,
    { app_id: String(appId) },
    "Your release channel"
  );
  const app = data.fetch__Application;
  if (!app) return null;
  return {
    current: ((_a3 = app.viewer_release_channel) == null ? void 0 : _a3.id) ? String(app.viewer_release_channel.id) : null,
    channels: ((_c = (_b3 = app.release_channels) == null ? void 0 : _b3.edges) != null ? _c : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
      var _a4, _b4, _c2, _d, _e;
      return {
        id: String(n.id),
        name: (_a4 = n.channel_name) != null ? _a4 : String(n.id),
        live: Boolean(n.is_live),
        public: Boolean(n.is_public),
        version: (_c2 = (_b4 = n.latest_supported_binary) == null ? void 0 : _b4.version) != null ? _c2 : null,
        versionCode: (_e = (_d = n.latest_supported_binary) == null ? void 0 : _d.version_code) != null ? _e : null
      };
    })
  };
}
var PLAYTIME_DOC_ID = "73337722012186324592102292727";
async function headsetPlaytime(serial) {
  var _a3;
  const data = await accountQuery(
    PLAYTIME_DOC_ID,
    { input: { device_serial: serial } },
    "Playtime"
  );
  return ((_a3 = data.xoc_user_installed_app_time_spent) != null ? _a3 : []).filter((r) => {
    var _a4;
    return (_a4 = r == null ? void 0 : r.platform_app) == null ? void 0 : _a4.id;
  }).map((r) => {
    var _a4;
    return {
      appId: String(r.platform_app.id),
      packageName: (_a4 = r.platform_app.package_name) != null ? _a4 : null,
      seconds: Number(r.immersive_time_spent_sec_28d) || 0
    };
  });
}
var CLOUD_BACKUPS_DOC_ID = "212972260414518954213137032242";
async function cloudBackups(serials) {
  var _a3, _b3;
  const data = await accountQuery(
    CLOUD_BACKUPS_DOC_ID,
    { input: { device_serials: serials, application_ids: [] } },
    "Cloud backups"
  );
  return ((_b3 = (_a3 = data.xoc_oculus_cloud_backups) == null ? void 0 : _a3.edges) != null ? _b3 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a4, _b4, _c, _d, _e;
    return {
      id: String(n.id),
      appId: ((_a4 = n.application) == null ? void 0 : _a4.id) ? String(n.application.id) : null,
      packageName: (_c = (_b4 = n.application) == null ? void 0 : _b4.package_name) != null ? _c : null,
      serial: (_d = n.device_serial) != null ? _d : null,
      size: Number(n.file_size) || 0,
      /* Seconds since the epoch. */
      backedUpAt: Number(n.backup_time) || null,
      /* FULL, or KEY_VALUE for the small settings-style backup. */
      type: (_e = n.backup_type) != null ? _e : null
    };
  });
}
var BACKUP_RULES_DOC_ID = "24749575598037757";
var FETCH_BACKUP_DOC_ID = "27955676008592068447410816227";
async function fetchCloudBackup(backupId) {
  var _a3, _b3, _c, _d;
  const json = await storeQuery(FETCH_BACKUP_DOC_ID, { id: String(backupId) }, { client: true });
  refuse(json, "Backup details");
  let size, checksum, type, time, segments, fallbacks;
  const links = [];
  const fields = /* @__PURE__ */ new Set();
  (function walk(n, path) {
    if (!n || typeof n !== "object") return;
    for (const [k, v] of Object.entries(n)) {
      const p = path ? `${path}.${k}` : k;
      if (!/^\d+$/.test(k)) fields.add(k);
      if (typeof v === "string") {
        if (/^https?:\/\//i.test(v) && !/image|icon|photo|thumbnail|cover|logo|avatar/i.test(p)) {
          links.push({ path: p, key: k, url: v });
        } else if (/(checksum|sha256)/i.test(k) && !checksum) checksum = v;
        else if (/backup_type/i.test(k) && !type) type = v;
      } else if (typeof v === "number") {
        if (/(file|total)_size/i.test(k) && !size) size = v;
        else if (/backup_time/i.test(k) && time == null) time = v;
      } else if (Array.isArray(v)) {
        if (/fallback/i.test(k) && !fallbacks) fallbacks = v.filter((x) => typeof x === "string");
        else if (/segment/i.test(k) && segments == null) segments = v.length;
      }
      walk(v, p);
    }
  })(json.data, "");
  const inSegment = (l) => /segment/i.test(l.path);
  const segmentUris = links.filter(inSegment).map((l) => l.url);
  const whole = links.filter((l) => !inSegment(l) && !/fallback/i.test(l.path));
  const downloadUri = (_d = (_c = (_a3 = whole.find((l) => /download/i.test(l.key))) == null ? void 0 : _a3.url) != null ? _c : (_b3 = whole.find((l) => /ur[il]$/i.test(l.key))) == null ? void 0 : _b3.url) != null ? _d : whole.length === 1 ? whole[0].url : null;
  if (!downloadUri && !segmentUris.length && size == null) throw new Error("the store returned no details for this backup");
  return {
    downloadUri: downloadUri != null ? downloadUri : null,
    segmentUris,
    fallbackUris: fallbacks != null ? fallbacks : [],
    size: Number(size) || null,
    checksum: checksum != null ? checksum : null,
    type: type != null ? type : null,
    backedUpAt: Number(time) || null,
    segments: segments != null ? segments : segmentUris.length || null,
    /* Only what the reply was made of — names, never values — for when no address
       turns up. */
    fields: [...fields].sort(),
    encrypted: true
  };
}
async function backupRules(appId) {
  var _a3, _b3, _c;
  const json = await storeQuery(BACKUP_RULES_DOC_ID, { applicationID: String(appId) });
  refuse(json, "Backup settings");
  const node = (_a3 = json.data) == null ? void 0 : _a3.node;
  if (!node) throw new Error("the store did not say how this app is backed up");
  return {
    enabled: typeof node.cloud_backup_enabled === "boolean" ? node.cloud_backup_enabled : null,
    excluded: ((_c = (_b3 = node.cloud_backup_rules) == null ? void 0 : _b3.excluded_file_paths) != null ? _c : []).filter((p) => typeof p === "string" && p)
  };
}
var SAVED_WORLDS_DOC_ID = "27679804063342994800600718755";
async function savedWorlds() {
  var _a3, _b3;
  const data = await accountQuery(
    SAVED_WORLDS_DOC_ID,
    { coverSquareImageSize: 225 },
    "Saved worlds"
  );
  const saved = (_a3 = data.me) == null ? void 0 : _a3.horizon_saved_worlds;
  const worlds = ((_b3 = saved == null ? void 0 : saved.edges) != null ? _b3 : []).map((e) => {
    var _a4;
    return (_a4 = e == null ? void 0 : e.node) == null ? void 0 : _a4.horizon_world;
  }).filter((w) => w == null ? void 0 : w.id).map((w) => {
    var _a4, _b4, _c, _d, _e;
    return {
      id: String(w.id),
      name: w.name || String(w.id),
      image: (_d = (_c = (_a4 = w.square_image) == null ? void 0 : _a4.image_uri) != null ? _c : (_b4 = w.image) == null ? void 0 : _b4.image_uri) != null ? _d : null,
      /* The world's place in the VR shell, which the details query is keyed by. */
      destinationId: ((_e = w.oc_destination) == null ? void 0 : _e.id) ? String(w.oc_destination.id) : null
    };
  });
  return { count: Number(saved == null ? void 0 : saved.count) || worlds.length, worlds };
}
var WORLD_DESTINATION_DOC_ID = "20471214089623756944511508210";
var WORLD_DOC_ID = "55217164010924076863732658967";
async function lookupWorld(id) {
  var _a3, _b3, _c, _d, _e;
  const data = await accountQuery(WORLD_DOC_ID, { id: String(id), coverSquareImageSize: 225 }, "World lookup");
  const w = data.fetch__XFBHorizonWorld;
  if (!(w == null ? void 0 : w.id)) throw new Error("no Horizon world has that ID");
  return {
    id: String(w.id),
    name: w.name || String(w.id),
    image: (_d = (_c = (_a3 = w.square_image) == null ? void 0 : _a3.image_uri) != null ? _c : (_b3 = w.image) == null ? void 0 : _b3.image_uri) != null ? _d : null,
    destinationId: ((_e = w.oc_destination) == null ? void 0 : _e.id) ? String(w.oc_destination.id) : null
  };
}
function parseWorldId(input) {
  var _a3;
  const text = String(input).trim();
  if (/^\d{5,}$/.test(text)) return text;
  const m = (_a3 = text.match(/world\/(?:[^/?#]*\/)?(\d{5,})/i)) != null ? _a3 : text.match(/(\d{8,})/);
  return m ? m[1] : null;
}
function worldImages(w) {
  var _a3, _b3, _c, _d, _e;
  return [
    ["Cover", (_a3 = w == null ? void 0 : w.image) == null ? void 0 : _a3.image_uri],
    ["Square", (_b3 = w == null ? void 0 : w.square_image) == null ? void 0 : _b3.image_uri],
    ["Travel preview", (_c = w == null ? void 0 : w.travel_preview_img) == null ? void 0 : _c.image_uri],
    ["Portal", (_d = w == null ? void 0 : w.portal_img) == null ? void 0 : _d.image_uri],
    ["Portal fallback", (_e = w == null ? void 0 : w.portal_fallback_img) == null ? void 0 : _e.image_uri]
  ].filter(([, uri]) => uri).map(([label, uri]) => ({ label, uri }));
}
async function worldDestination(destinationId) {
  var _a3, _b3, _c, _d;
  const data = await accountQuery(
    WORLD_DESTINATION_DOC_ID,
    { id: destinationId, coverSquareImageSize: 225 },
    "World details"
  );
  const d = data.fetch__ApplicationPresenceStatusDefinition;
  if (!d) throw new Error("the store has no details for this world");
  return {
    world: (_a3 = d.horizon_world) != null ? _a3 : null,
    details: {
      destinationId: (_b3 = d.destination_id) != null ? _b3 : destinationId,
      /* The store's id for the destination, which its similar-worlds list is keyed by. */
      storeDestinationId: d.app_store_destination_id ? String(d.app_store_destination_id) : null,
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
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
  const i = (_a3 = info.value) == null ? void 0 : _a3.world;
  const p = (_d = (_c = (_b3 = portal.value) == null ? void 0 : _b3.multifetch__XFBHorizonWorld) == null ? void 0 : _c[0]) == null ? void 0 : _d.node;
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i;
  const t = (_a3 = edge == null ? void 0 : edge.node) == null ? void 0 : _a3.target_object;
  if (!/World/.test((_b3 = t == null ? void 0 : t.__typename) != null ? _b3 : "")) return null;
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
  var _a3, _b3;
  return {
    worlds: ((_a3 = conn == null ? void 0 : conn.edges) != null ? _a3 : []).map(worldTile).filter(Boolean),
    cursor: ((_b3 = conn == null ? void 0 : conn.page_info) == null ? void 0 : _b3.has_next_page) ? conn.page_info.end_cursor : null
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
  ["HORIZON_TWILIGHT_STORY_WORLDS", "Story"],
  /* Not a shelf: the headset's own Worlds feed (HorizonWorldsFeedQuery), one page. */
  ["HEADSET_FEED", "Your headset's feed"]
];
var WORLD_FEED_DOC_ID = "18313389642418814290992361446";
async function worldFeed() {
  var _a3, _b3, _c;
  const d = await accountRead(WORLD_FEED_DOC_ID);
  const worlds = ((_c = (_b3 = (_a3 = d.viewer) == null ? void 0 : _a3.hubble) == null ? void 0 : _b3.edges) != null ? _c : []).map((e) => e == null ? void 0 : e.node).filter((n) => {
    var _a4;
    return ((_a4 = n == null ? void 0 : n.target_object) == null ? void 0 : _a4.id) || (n == null ? void 0 : n.target_object_id);
  }).map((n) => {
    var _a4, _b4, _c2, _d, _e, _f, _g, _h, _i, _j, _k;
    const dest = String((_b4 = (_a4 = n.target_object) == null ? void 0 : _a4.id) != null ? _b4 : n.target_object_id);
    let link = (_d = (_c2 = n.cta_info) == null ? void 0 : _c2.oculus_deeplink) != null ? _d : "";
    try {
      link = (_g = (_f = (_e = JSON.parse(link)) == null ? void 0 : _e.ovr_social_launch) == null ? void 0 : _f.deeplink_message) != null ? _g : link;
    } catch {
    }
    const worldId = (_i = (_h = String(link).match(/world_id=(\d+)/)) == null ? void 0 : _h[1]) != null ? _i : null;
    return {
      id: worldId != null ? worldId : dest,
      name: n.title || worldId || dest,
      image: (_k = (_j = n.thumbnail_image) == null ? void 0 : _j.uri) != null ? _k : null,
      destinationId: dest,
      visits: null,
      online: null,
      likes: null
    };
  });
  return { worlds, cursor: null };
}
async function worldShelf(feedSource, cursor = null) {
  var _a3, _b3;
  if (feedSource === "HEADSET_FEED") return worldFeed();
  const data = await relayQuery(
    WORLD_SHELF_DOC_ID,
    { count: 30, cursor, feedSource, ...HZW_FLAGS },
    "Top worlds"
  );
  return worldPage((_b3 = (_a3 = data.viewer) == null ? void 0 : _a3.pipelines) == null ? void 0 : _b3.popular);
}
var PEOPLE_SEARCH_DOC_ID = "26529290379993220";
async function searchPeople(text) {
  var _a3, _b3, _c;
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
  return ((_c = (_b3 = (_a3 = data.user_search) == null ? void 0 : _a3.results) == null ? void 0 : _b3.edges) != null ? _c : []).map((e) => {
    var _a4;
    return (_a4 = e == null ? void 0 : e.node) == null ? void 0 : _a4.user;
  }).filter((u) => u == null ? void 0 : u.id).map((u) => {
    var _a4, _b4;
    return { id: String(u.id), alias: (_a4 = u.alias) != null ? _a4 : null, name: (_b4 = u.display_name) != null ? _b4 : null };
  });
}
var PUBLISHED_WORLDS_DOC_ID = "26869339619355285";
async function publishedWorlds(userId, cursor = null) {
  var _a3, _b3;
  const data = await relayQuery(
    PUBLISHED_WORLDS_DOC_ID,
    { count: 30, cursor, userID: String(userId), ...HZW_FLAGS },
    "Published worlds"
  );
  return worldPage((_b3 = (_a3 = data.user) == null ? void 0 : _a3.world_data) == null ? void 0 : _b3.published_worlds_list);
}
var REVIEWS_SUMMARY_DOC_ID = "29127926413476795";
var REVIEWS_LIST_DOC_ID = "27358267370522650";
var REVIEW_SORTS = [
  ["top", "Most relevant"],
  ["most_recent", "Most recent"]
];
async function appReviewSummary(appId) {
  var _a3, _b3, _c;
  const data = await relayQuery(
    REVIEWS_SUMMARY_DOC_ID,
    { itemID: String(appId), ratingScores: null, sortOrder: null },
    "App reviews"
  );
  const it = data.item;
  if (!it) throw new Error("the store has no page for this app");
  const histogram = ((_a3 = it.quality_rating_histogram_aggregate_all) != null ? _a3 : []).map((h) => ({ star: Number(h == null ? void 0 : h.star_rating), count: Number(h == null ? void 0 : h.count) || 0 })).filter((h) => h.star >= 1 && h.star <= 5).sort((a, b) => b.star - a.star);
  const ratingCount = Number(it.quality_rating_count);
  return {
    score: typeof it.quality_rating_score === "number" ? it.quality_rating_score : null,
    scoreText: (_b3 = it.quality_rating_i18n_score_string) != null ? _b3 : null,
    ratingCount: Number.isFinite(ratingCount) ? ratingCount : null,
    ratingCountText: (_c = it.quality_rating_i18n_count_string) != null ? _c : null,
    reviewCount: Number(it.quality_review_count) || 0,
    histogram,
    canReview: Boolean(it.can_viewer_review)
  };
}
async function appReviews(appId, { count = 15, cursor = null, sort = "top" } = {}) {
  var _a3, _b3, _c;
  const data = await relayQuery(
    REVIEWS_LIST_DOC_ID,
    { count, cursor, id: String(appId), itemID: String(appId), rating_scores: null, sort_order: sort },
    "App reviews"
  );
  const conn = (_a3 = data.node) == null ? void 0 : _a3.user_reviews2;
  const reviews = ((_b3 = conn == null ? void 0 : conn.edges) != null ? _b3 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a4, _b4, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
    const dr = n.developer_response;
    return {
      id: String(n.id),
      title: (_b4 = (_a4 = n.translated_review_title) != null ? _a4 : n.review_title) != null ? _b4 : null,
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
  var _a3, _b3, _c, _d, _e, _f;
  const data = await relayQuery(RELEASE_NOTES_DOC_ID, { id: String(appId) }, "Release notes");
  const edges = (_c = (_b3 = (_a3 = data.node) == null ? void 0 : _a3.supportedBinaries) == null ? void 0 : _b3.edges) != null ? _c : [];
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
var viewer = { token: null, id: null };
function viewerId() {
  const { token } = loadSettings();
  if (viewer.token !== token) {
    const entry = { token, id: null };
    entry.id = relayQuery(VIEWER_DOC_ID, {}, "Account").then((data) => {
      var _a3, _b3;
      const id = (_b3 = (_a3 = data.viewer) == null ? void 0 : _a3.user) == null ? void 0 : _b3.id;
      if (!id) throw new Error("the store would not say who this token belongs to");
      return String(id);
    });
    entry.id.catch(() => {
      if (viewer === entry) viewer = { token: null, id: null };
    });
    viewer = entry;
  }
  return viewer.id;
}
var ACCOUNT_DOC = {
  /* HorizonMyUserProfileQuery: id, email, name, alias, profile photo. */
  profile: "15781071945474818381929742825",
  /* IsSalsaQuery: is_salsa, and the account's age (frlm_age). */
  salsa: "11463303871393809524197000268",
  /* UserAccountQuery: whether the account is a developer account. */
  account: "31772769717381786053600513641",
  /* LivestreamCheckFbAccountLinkedQuery: whether a Facebook account is linked. */
  facebook: "13622734023337182406839690626",
  /* IntegrityProfileCCVEStatusQuery: policy violations on the profile. */
  standing: "113253097215972460514425058861",
  /* PrivateProfile: the account's privacy settings — asked only when the audience
     query below is refused. */
  privacy: "413585144715035790835233513414",
  /* UserStatusQuery: the active-status setting — likewise only a fallback. */
  status: "281760966115686460002451747815",
  /* AudienceAndVisibilityQuery: every audience setting with the choice it is set to,
     in the words the headset's Settings shows. Supersedes privacy + status when it answers. */
  audience: "61321609115891111603464934425",
  /* OCVoiceChannelQuery: who can talk to you by default, and whether a parent set it. */
  voice: "296047381212925687328552986458",
  /* XMFCFetaSupervisionNotificationSettingsQuery: supervision notifications — asked
     only for a supervised (Salsa) account, where it means something. */
  supervision: "8021600106917781191779105",
  /* OCCommunityCreationEligibility: which kinds of community you may create. */
  communities: "39795877206476994265164377408",
  /* HorizonPlusSubscriptionStatusQuery: whether this account has Horizon+ now. */
  horizonPlus: "159912708818125870982669045338",
  /* ProfileBackgroundQuery: the picture behind your profile — only with images on. */
  background: "8892860606036005149334457836"
};
var accountTokenOk = null;
async function accountRead(docId, variables = {}, { plain = false, endpoint = ENDPOINT } = {}) {
  var _a3, _b3, _c, _d, _e, _f;
  const { token, frlToken } = loadSettings();
  const tokens = [.../* @__PURE__ */ new Set([(frlToken || "").trim(), (token || "").trim()])].filter(
    (t) => t && !t.includes("|")
  );
  if (accountTokenOk && tokens.includes(accountTokenOk)) tokens.sort((a, b) => (b === accountTokenOk) - (a === accountTokenOk));
  let last = "no signed-in token saved";
  for (const t of tokens) {
    try {
      const json = await getJSON(
        `${endpoint}?` + new URLSearchParams({ access_token: t, [plain ? "doc_id" : "client_doc_id"]: docId, variables: JSON.stringify(variables) })
      );
      const fatal = ((_a3 = json == null ? void 0 : json.errors) != null ? _a3 : []).some((e) => (e == null ? void 0 : e.severity) !== "WARNING");
      if ((json == null ? void 0 : json.data) && (!fatal || Object.values(json.data).some((v) => v != null))) {
        accountTokenOk = t;
        return json.data;
      }
      last = (_f = (_e = (_c = (_b3 = json == null ? void 0 : json.errors) == null ? void 0 : _b3[0]) == null ? void 0 : _c.message) != null ? _e : (_d = json == null ? void 0 : json.error) == null ? void 0 : _d.message) != null ? _f : "the store refused";
    } catch (err2) {
      last = err2.message;
    }
  }
  throw new Error(last);
}
var PEOPLE_DOC = {
  /* PeopleFollowCountsQuery: followers, following, follow requests, recently met. */
  counts: "1517111573189500436995675608",
  /* PeopleTabFollowsQuery: followers and following together, with presence. */
  list: "209115519317059146500281110007",
  /* PeopleTabFollowRequestsQuery: who has asked to follow you. */
  requests: "6867526546653215924743625714",
  /* PeopleTabRecentlyMetQuery: people you were in a world or app with, and where. */
  met: "35520022493517897887369417634",
  /* RecentlyMetRosterQuery: the same people, with when you last met them. */
  metRoster: "75720102512560747509655454325",
  /* PeopleTabNearbyQuery: who is in the same lobby as you right now. */
  nearby: "24887553057711262502737685",
  /* PeopleTabGroupsQuery: your chats, with their last message. */
  chats: "51633306317420163998488732751",
  /* PeopleTabPYMKQuery: people you may know. { initial_load, first } */
  suggested: "33314788255216183693165770553",
  /* OculusFollowersQuery / OculusFollowsQuery: every follower and everyone you follow,
     paged — complete where the blended list above stops short, but with no photos.
     { node_id, first, after, profile_picture_size_string } */
  followers: "12787062841172923645609902350",
  follows: "252407844718047616381546991557",
  /* MiniProfileUserQDSQuery: one person, as the headset's mini profile shows them. { user_id } */
  person: "307214475610106213041554219891",
  /* OculusFollowCountsQuery: anyone's follower and following counts, and the
     Instagram accounts they show. { node_id } */
  personCounts: "3653406633392707327058615055"
};
function personOf(u) {
  var _a3, _b3, _c, _d, _e, _f, _g;
  return {
    id: String(u.id),
    name: u.profile_name || u.display_name || u.alias || String(u.id),
    alias: (_a3 = u.alias) != null ? _a3 : null,
    photo: (_d = (_c = (_b3 = u.profile_picture) != null ? _b3 : u.profile_photo) == null ? void 0 : _c.uri) != null ? _d : null,
    online: u.presence_status === "ONLINE",
    presence: ((_e = u.rich_presence) != null ? _e : []).map((r) => {
      var _a4;
      return (_a4 = r == null ? void 0 : r.content) == null ? void 0 : _a4.text;
    }).filter(Boolean).join(" \xB7 ") || (typeof u.presence === "string" && !/^(online|offline)$/i.test(u.presence) ? u.presence : null),
    follow: (_f = u.follow_status) != null ? _f : null,
    canMessage: Boolean(u.can_viewer_message),
    salsa: Boolean(u.is_salsa),
    suspended: Boolean(u.is_social_suspended),
    blocked: Boolean(u.is_blocked_by_viewer),
    /* Why the store shows them ("Followed by …"), when it says. */
    context: [u.mutual_context_string, ...((_g = u.profile_contexts) != null ? _g : []).map((c) => {
      var _a4;
      return (_a4 = c == null ? void 0 : c.content) == null ? void 0 : _a4.text;
    })].filter(Boolean).join(" \xB7 ") || null
  };
}
async function peopleCounts() {
  var _a3, _b3, _c;
  const d = await accountRead(PEOPLE_DOC.counts);
  const u = (_b3 = (_a3 = d.viewer) == null ? void 0 : _a3.user) != null ? _b3 : {};
  const n = (c) => Number.isFinite(Number(c == null ? void 0 : c.count)) ? Number(c.count) : null;
  return {
    followers: n(u.followers),
    following: n(u.follows),
    requests: n(u.follower_requests_received),
    recentlyMet: n((_c = d.viewer) == null ? void 0 : _c.recently_met),
    contacts: n(u.approved_contacts)
  };
}
async function peopleList() {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const me = extraOn("fullFollows") ? await accountRead(ACCOUNT_DOC.profile).then((d) => {
    var _a4, _b4;
    return ((_b4 = (_a4 = d.viewer) == null ? void 0 : _a4.user) == null ? void 0 : _b4.id) ? String(d.viewer.user.id) : null;
  }, () => null) : null;
  const [blended, followers, follows] = await Promise.all([
    accountRead(PEOPLE_DOC.list).catch((e) => ({ error: e })),
    me && extraOn("fullFollows") ? everyPage(PEOPLE_DOC.followers, me, "followers").catch(() => null) : null,
    me && extraOn("fullFollows") ? everyPage(PEOPLE_DOC.follows, me, "follows").catch(() => null) : null
  ]);
  const conn = blended.error ? null : (_b3 = (_a3 = blended.viewer) == null ? void 0 : _a3.user) == null ? void 0 : _b3.blended_followers_and_following;
  if (!conn && !followers && !follows) throw (_c = blended.error) != null ? _c : new Error("the store gave no people");
  const byId = /* @__PURE__ */ new Map();
  for (const u of ((_d = conn == null ? void 0 : conn.edges) != null ? _d : []).map((e) => e == null ? void 0 : e.node)) if ((u == null ? void 0 : u.id) && !u.is_viewer) byId.set(String(u.id), personOf(u));
  const inFollowers = new Set(((_e = followers == null ? void 0 : followers.nodes) != null ? _e : []).map((u) => String(u == null ? void 0 : u.id)));
  const inFollows = new Set(((_f = follows == null ? void 0 : follows.nodes) != null ? _f : []).map((u) => String(u == null ? void 0 : u.id)));
  for (const u of [...(_g = followers == null ? void 0 : followers.nodes) != null ? _g : [], ...(_h = follows == null ? void 0 : follows.nodes) != null ? _h : []]) {
    if (!(u == null ? void 0 : u.id) || u.is_viewer) continue;
    const id = String(u.id);
    const had = byId.get(id);
    const p = personOf(u);
    (_i = p.follow) != null ? _i : p.follow = inFollowers.has(id) && inFollows.has(id) ? "FOLLOWS_EACH_OTHER" : inFollowers.has(id) ? "PROFILE_FOLLOWS_VIEWER" : "VIEWER_FOLLOWS_PROFILE";
    byId.set(id, had ? { ...p, ...Object.fromEntries(Object.entries(had).filter(([, v]) => v != null && v !== "")) } : p);
  }
  const people = await fillPhotos([...byId.values()]);
  return {
    people,
    total: people.length,
    more: false,
    followers: (_j = followers == null ? void 0 : followers.count) != null ? _j : null,
    following: (_k = follows == null ? void 0 : follows.count) != null ? _k : null
  };
}
async function everyPage(docId, nodeId, key) {
  var _a3, _b3, _c;
  const nodes = [];
  let after = null;
  let count = null;
  for (let i = 0; i < 20; i++) {
    const d = await accountRead(docId, { node_id: String(nodeId), first: 100, after, profile_picture_size_string: "96" });
    const c = (_a3 = d.node) == null ? void 0 : _a3[key];
    count != null ? count : count = Number(c == null ? void 0 : c.count) || null;
    nodes.push(...((_b3 = c == null ? void 0 : c.edges) != null ? _b3 : []).map((e) => e == null ? void 0 : e.node).filter(Boolean));
    if (!((_c = c == null ? void 0 : c.page_info) == null ? void 0 : _c.has_next_page) || !c.page_info.end_cursor) break;
    after = c.page_info.end_cursor;
  }
  return { count, nodes };
}
async function peopleSuggested() {
  var _a3, _b3, _c;
  const d = await accountRead(PEOPLE_DOC.suggested, { initial_load: true, first: 50 });
  const conn = (_a3 = d.viewer) == null ? void 0 : _a3.people_you_may_know;
  const people = ((_b3 = conn == null ? void 0 : conn.edges) != null ? _b3 : []).map((e) => e == null ? void 0 : e.node).filter((u) => (u == null ? void 0 : u.id) && !u.is_viewer).map(personOf);
  return { people, total: people.length, more: Boolean((_c = conn == null ? void 0 : conn.page_info) == null ? void 0 : _c.has_next_page) };
}
async function personDetails(userId) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i;
  const [d, c] = await Promise.all([
    accountRead(PEOPLE_DOC.person, { user_id: String(userId) }),
    extraOn("personCounts") ? accountRead(PEOPLE_DOC.personCounts, { node_id: String(userId) }).catch(() => null) : null
  ]);
  const u = d.node;
  const cn = (_a3 = c == null ? void 0 : c.node) != null ? _a3 : {};
  const num = (x) => Number.isFinite(Number(x == null ? void 0 : x.count)) ? Number(x.count) : null;
  if (!(u == null ? void 0 : u.id)) throw new Error("the store has no profile for this person");
  return {
    name: (_b3 = u.profile_name) != null ? _b3 : null,
    alias: (_c = u.profile_username) != null ? _c : null,
    bio: u.biography || null,
    photo: (_e = (_d = u.profile_picture) == null ? void 0 : _d.uri) != null ? _e : null,
    privateProfile: u.profile_status ? u.profile_status === "PRIVATE_PROFILE" : null,
    facebookName: u.facebook_name || null,
    canCall: (_f = u.can_viewer_vr_call) != null ? _f : null,
    unread: typeof u.has_unread_message === "boolean" ? u.has_unread_message : null,
    presence: ((_g = u.rich_presence) != null ? _g : []).map((r) => {
      var _a4;
      return (_a4 = r == null ? void 0 : r.content) == null ? void 0 : _a4.text;
    }).filter(Boolean).join(" \xB7 ") || u.presence || null,
    follow: (_h = u.follow_status) != null ? _h : null,
    joinable: Boolean(u.is_presence_deeplink_joinable),
    followers: num(cn.followers),
    following: num(cn.follows),
    instagram: ((_i = cn.instagram_usernames) != null ? _i : []).filter((x) => typeof x === "string" && x)
  };
}
async function peopleRequests() {
  var _a3, _b3, _c, _d, _e, _f;
  const d = await accountRead(PEOPLE_DOC.requests);
  const conn = (_d = (_a3 = d.me) == null ? void 0 : _a3.follower_requests_received) != null ? _d : (_c = (_b3 = d.viewer) == null ? void 0 : _b3.user) == null ? void 0 : _c.follower_requests_received;
  const people = ((_e = conn == null ? void 0 : conn.edges) != null ? _e : []).map((e) => e == null ? void 0 : e.node).filter((u) => (u == null ? void 0 : u.id) && !u.is_viewer).map(personOf);
  return { people, total: Number(conn == null ? void 0 : conn.count) || people.length, more: Boolean((_f = conn == null ? void 0 : conn.page_info) == null ? void 0 : _f.has_next_page) };
}
async function peopleRecentlyMet() {
  var _a3, _b3, _c, _d, _e, _f;
  const [list, roster] = await Promise.all([
    accountRead(PEOPLE_DOC.met),
    extraOn("metTimes") ? accountRead(PEOPLE_DOC.metRoster).catch(() => null) : null
  ]);
  const when = new Map(
    ((_c = (_b3 = (_a3 = roster == null ? void 0 : roster.viewer) == null ? void 0 : _a3.recently_met) == null ? void 0 : _b3.edges) != null ? _c : []).map((e) => e == null ? void 0 : e.node).filter((n) => {
      var _a4;
      return (_a4 = n == null ? void 0 : n.peer) == null ? void 0 : _a4.id;
    }).map((n) => [String(n.peer.id), Number(n.last_encounter_time) || null])
  );
  const conn = (_d = list.viewer) == null ? void 0 : _d.recently_met;
  const people = ((_e = conn == null ? void 0 : conn.edges) != null ? _e : []).map((e) => e == null ? void 0 : e.node).filter((n) => {
    var _a4;
    return (_a4 = n == null ? void 0 : n.peer) == null ? void 0 : _a4.id;
  }).map((n) => {
    var _a4, _b4;
    return { ...personOf(n.peer), met: (_a4 = n.detailed_context_string) != null ? _a4 : null, metAt: (_b4 = when.get(String(n.peer.id))) != null ? _b4 : null };
  });
  return { people, total: Number(conn == null ? void 0 : conn.count) || people.length, more: Boolean((_f = conn == null ? void 0 : conn.page_info) == null ? void 0 : _f.has_next_page) };
}
async function peopleNearby() {
  var _a3, _b3, _c, _d;
  const d = await accountRead(PEOPLE_DOC.nearby);
  const conn = (_b3 = (_a3 = d.viewer) == null ? void 0 : _a3.user) == null ? void 0 : _b3.lobby_roster;
  const people = ((_c = conn == null ? void 0 : conn.edges) != null ? _c : []).map((e) => {
    var _a4, _b4, _c2, _d2;
    return (_d2 = (_c2 = (_a4 = e == null ? void 0 : e.node) == null ? void 0 : _a4.user) != null ? _c2 : (_b4 = e == null ? void 0 : e.node) == null ? void 0 : _b4.peer) != null ? _d2 : e == null ? void 0 : e.node;
  }).filter((u) => (u == null ? void 0 : u.id) && !u.is_viewer).map(personOf);
  return { people, total: Number(conn == null ? void 0 : conn.count) || people.length, more: Boolean((_d = conn == null ? void 0 : conn.page_info) == null ? void 0 : _d.has_next_page) };
}
async function peopleChats() {
  var _a3, _b3, _c, _d;
  const d = await accountRead(PEOPLE_DOC.chats);
  const chats = ((_b3 = (_a3 = d.vr_group_list) == null ? void 0 : _a3.vr_group) != null ? _b3 : []).filter((c) => c == null ? void 0 : c.id).map((c) => {
    var _a4, _b4, _c2, _d2, _e, _f, _g, _h, _i, _j, _k;
    const members = ((_c2 = (_b4 = (_a4 = c.group) == null ? void 0 : _a4.users) == null ? void 0 : _b4.edges) != null ? _c2 : []).map((e) => e == null ? void 0 : e.node).filter((u) => (u == null ? void 0 : u.id) && !u.is_viewer).map(personOf);
    return {
      id: String(c.id),
      name: ((_d2 = c.group) == null ? void 0 : _d2.name) || members.map((m) => m.name).join(", ") || "Chat",
      members,
      photo: (_i = (_h = (_f = (_e = c.group) == null ? void 0 : _e.group_thread_image) == null ? void 0 : _f.uri) != null ? _h : (_g = members[0]) == null ? void 0 : _g.photo) != null ? _i : null,
      snippet: (_j = c.last_message_snippet) != null ? _j : null,
      unread: Boolean(c.is_unread),
      active: Boolean(c.has_active_member),
      oneToOne: Boolean((_k = c.group) == null ? void 0 : _k.is_one_to_one)
    };
  });
  return { chats, party: Boolean((_d = (_c = d.viewer) == null ? void 0 : _c.user) == null ? void 0 : _d.current_party) };
}
var GLOBAL_SEARCH_DOC_ID = "30670291099668386557224565653";
var GLOBAL_SUGGEST_DOC_ID = "2985838347370243137379424618";
async function globalSearch(text) {
  var _a3;
  const d = String(text).trim() ? await accountRead(GLOBAL_SEARCH_DOC_ID, {
    query: String(text),
    include_movies: true,
    include_tvseries: true,
    include_sports_events: true,
    include_xbox: true
  }) : await accountRead(GLOBAL_SUGGEST_DOC_ID);
  const pe = (_a3 = d.partitioned_entities) != null ? _a3 : {};
  const list = (k) => {
    var _a4, _b3;
    return ((_b3 = (_a4 = pe[k]) == null ? void 0 : _a4.edges) != null ? _b3 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id);
  };
  const base = (n) => {
    var _a4, _b3;
    return { id: String(n.id), title: n.title || n.display_name || String(n.id), image: (_b3 = (_a4 = n.icon) == null ? void 0 : _a4.uri) != null ? _b3 : null };
  };
  const people = await fillPhotos(
    list("people").map((n) => {
      var _a4, _b3, _c;
      return {
        ...base(n),
        alias: (_a4 = n.alias) != null ? _a4 : null,
        presence: (_b3 = n.presence_string) != null ? _b3 : null,
        follow: (_c = n.viewer_follow_status) != null ? _c : null
      };
    }),
    "image"
  );
  return {
    apps: list("apps").map((n) => {
      var _a4;
      return {
        ...base(n),
        packageName: (_a4 = n.package_name) != null ? _a4 : null,
        lastOpened: Number(n.last_considered_time) || null
      };
    }),
    movies: list("movie").map((n) => {
      var _a4, _b3;
      return {
        ...base(n),
        year: (_a4 = n.release_year) != null ? _a4 : null,
        genre: (_b3 = n.genre) != null ? _b3 : null,
        runtime: Number(n.run_time_in_seconds) || null
      };
    }),
    series: list("series").map((n) => {
      var _a4, _b3, _c;
      return { ...base(n), year: (_a4 = n.release_year) != null ? _a4 : null, genre: (_b3 = n.genre) != null ? _b3 : null, seasons: (_c = n.season_count) != null ? _c : null };
    }),
    sports: list("sports_events").map((n) => {
      var _a4;
      return {
        ...base(n),
        start: Number(n.start_time) || null,
        end: Number(n.end_time) || null,
        live: Boolean(n.is_live),
        app: (_a4 = n.app_name) != null ? _a4 : null
      };
    }),
    xbox: list("xbox").map((n) => {
      var _a4;
      return { ...base(n), link: /^https:\/\//.test((_a4 = n.launch_deeplink) != null ? _a4 : "") ? n.launch_deeplink : null };
    }),
    people,
    events: list("events").map((n) => ({ ...base(n), start: Number(n.start_time) || null })),
    websites: list("browser").map((n) => {
      var _a4, _b3, _c, _d;
      return {
        ...base(n),
        image: (_c = (_b3 = n.icon_url) != null ? _b3 : (_a4 = n.icon) == null ? void 0 : _a4.uri) != null ? _c : null,
        link: /^https?:\/\//.test((_d = n.website_url) != null ? _d : "") ? n.website_url : null
      };
    })
  };
}
var AVATAR_STICKERS_DOC_ID = "28923220153412598514073512516";
async function avatarStickers() {
  var _a3, _b3, _c, _d, _e, _f;
  const d = await accountRead(AVATAR_STICKERS_DOC_ID);
  return ((_f = (_e = (_d = (_c = (_b3 = (_a3 = d.viewer) == null ? void 0 : _a3.user) == null ? void 0 : _b3.avatar_v3) == null ? void 0 : _c.messaging) == null ? void 0 : _d.stickers) == null ? void 0 : _e.edges) != null ? _f : []).map((e) => e == null ? void 0 : e.node).filter((n) => {
    var _a4;
    return (_a4 = n == null ? void 0 : n.preview_url) == null ? void 0 : _a4.url;
  }).map((n) => {
    var _a4;
    return { id: String((_a4 = n.stable_id) != null ? _a4 : n.storage_key), url: n.preview_url.url };
  });
}
var GALLERY_MEDIA_DOC_ID = "37605900805721531";
async function headsetPhotos(cursor = null) {
  var _a3, _b3, _c, _d, _e;
  const d = await accountRead(
    GALLERY_MEDIA_DOC_ID,
    {
      first: 48,
      after: cursor,
      filter_options: null,
      server_updated_after: null,
      mediaHeight: 1080,
      mediaWidth: 1920,
      thumbnailHeight: 320,
      thumbnailWidth: 320
    },
    { plain: true, endpoint: "https://meta.graph.meta.com/graphql" }
  );
  const conn = (_c = (_b3 = (_a3 = d.viewer) == null ? void 0 : _a3.account) == null ? void 0 : _b3.photos_hub) == null ? void 0 : _c.filtered_media_items;
  const items = ((_d = conn == null ? void 0 : conn.edges) != null ? _d : []).map((e) => e == null ? void 0 : e.node).filter((n) => (n == null ? void 0 : n.id) && (n.thumbnail_url || n.screen_size_media_url)).map((n) => {
    var _a4, _b4;
    return {
      id: String(n.id),
      video: /video/i.test(`${n.__typename} ${n.oculus_media_type}`) || Number(n.duration_in_ms) > 0,
      thumb: (_a4 = n.thumbnail_url) != null ? _a4 : n.screen_size_media_url,
      url: (_b4 = n.screen_size_media_url) != null ? _b4 : n.thumbnail_url,
      app: n.oculus_app_display_name || null,
      world: n.horizon_world_name || null,
      taken: Number(n.datetime_taken) || null,
      size: Number(n.server_file_size) || null,
      width: Number(n.width) || null,
      height: Number(n.height) || null,
      duration: Number(n.duration_in_ms) || null,
      favorite: Boolean(n.is_favorited),
      stereo: n.stereoscopic_mode && n.stereoscopic_mode !== "MONO" ? n.stereoscopic_mode : null
    };
  });
  return { items, cursor: ((_e = conn == null ? void 0 : conn.page_info) == null ? void 0 : _e.has_next_page) ? conn.page_info.end_cursor : null };
}
var STORE_DOC = {
  credit: "25329845226649988",
  // useStoreCreditBalanceQuery
  settings: "27957534520541894",
  // StoreAccountSettingsContainerQuery
  subscriptions: "27994220820231578",
  // StoreSubscriptionsMgmtContainerQuery
  creditHistory: "38930029713262720",
  // StoreWalletCreditHistoryQuery
  related: "28316143671418456",
  // StoreDiscoPDPRelatedItemsViewQuery { appID, imageScale, isControllerConnected }
  includedIn: "28175204638768052",
  // StoreDiscoPDPIncludedInViewPaginationQuery { id, count, cursor, … }
  referrals: "28323344543939008",
  // StoreAppReferralHubContainerQuery
  worldPage: "35508296145483891",
  // StoreWorldPDPRootQuery { itemID, imageScale }
  similarWorlds: "38384761897836065",
  // StoreWorldPDPSimilarWorldsViewQuery { worldID: store destination id, … }
  avatars: "25033180872976625",
  // AvatarEditorMaxSwitcherSideSheetQuery (Avatar Editor bundle)
  users: "24033352489605925",
  // relayFetchUsersQuery { userIDs } — many people in one request
  media: "28354221460895045"
  // StoreMiniMediaPDPRootQuery { itemID, enableTVODContent, imageScale }
};
async function mediaDetails(itemId) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const d = await accountRead(STORE_DOC.media, { enableTVODContent: true, imageScale: 1, itemID: String(itemId) }, { plain: true });
  const m = d.item;
  if (!m) throw new Error("the store has no page for this title");
  return {
    kind: /Series/.test((_a3 = m.__typename) != null ? _a3 : "") ? "series" : "movie",
    title: (_b3 = m.title) != null ? _b3 : null,
    description: (_c = m.description) != null ? _c : null,
    art: (_h = (_g = (_f = (_e = (_d = m.images) == null ? void 0 : _d.art) == null ? void 0 : _e.nodes) == null ? void 0 : _f[0]) == null ? void 0 : _g.uri) != null ? _h : null,
    rating: (_i = m.media_age_rating) != null ? _i : null,
    genres: Array.isArray(m.media_genres) ? m.media_genres.filter(Boolean) : [],
    year: (_j = m.release_year) != null ? _j : null,
    runtime: Number(m.run_time_in_seconds) || null,
    seasons: Number((_k = m.seasons) == null ? void 0 : _k.count) || null,
    watch: ((_m = (_l = m.watch_options) == null ? void 0 : _l.nodes) != null ? _m : []).filter((w) => w == null ? void 0 : w.provider_name).map((w) => {
      var _a4, _b4, _c2;
      return {
        provider: w.provider_name,
        url: /^https:\/\//.test((_b4 = (_a4 = w.deeplink) == null ? void 0 : _a4.data) != null ? _b4 : "") ? w.deeplink.data : null,
        appId: ((_c2 = w.provider_app) == null ? void 0 : _c2.id) ? String(w.provider_app.id) : null
      };
    })
  };
}
async function userPhotos(ids) {
  var _a3, _b3, _c, _d;
  const out = /* @__PURE__ */ new Map();
  const list = [...new Set(ids.map(String))];
  for (let i = 0; i < list.length; i += 50) {
    const d = await accountRead(STORE_DOC.users, { userIDs: list.slice(i, i + 50) }, { plain: true }).catch(() => null);
    for (const u of (_a3 = d == null ? void 0 : d.user_or_blocked_users) != null ? _a3 : []) {
      const id = String((_c = (_b3 = u == null ? void 0 : u.id) != null ? _b3 : u == null ? void 0 : u.possibly_blocked_real_user_id) != null ? _c : "");
      if (id && ((_d = u == null ? void 0 : u.profile_photo) == null ? void 0 : _d.uri)) out.set(id, u.profile_photo.uri);
    }
  }
  return out;
}
async function fillPhotos(people, key = "photo") {
  if (!extraOn("personPhotos")) return people;
  const missing = people.filter((p) => !p[key]).map((p) => p.id);
  if (!missing.length) return people;
  const photos = await userPhotos(missing).catch(() => /* @__PURE__ */ new Map());
  for (const p of people) if (!p[key] && photos.has(p.id)) p[key] = photos.get(p.id);
  return people;
}
async function appBundles(appId) {
  var _a3, _b3, _c, _d;
  const d = await accountRead(
    STORE_DOC.includedIn,
    { id: String(appId), count: 20, cursor: null, imageScale: 1, isControllerConnected: true },
    { plain: true }
  );
  const n = (_a3 = d.node) != null ? _a3 : {};
  return [...(_b3 = n.premium_bundles) != null ? _b3 : [], ...((_d = (_c = n.included_bundles_connection) == null ? void 0 : _c.edges) != null ? _d : []).map((e) => e == null ? void 0 : e.node)].filter((b) => b == null ? void 0 : b.id).map((b) => {
    var _a4, _b4;
    return {
      id: String(b.id),
      name: b.display_unit_title || b.display_name || String(b.id),
      price: (_b4 = (_a4 = b.surfaced_price_display) == null ? void 0 : _a4.text) != null ? _b4 : null
    };
  });
}
async function storeReferrals() {
  var _a3, _b3, _c, _d, _e;
  const d = await accountRead(STORE_DOC.referrals, {}, { plain: true });
  const s = (_c = (_b3 = (_a3 = d.viewer) == null ? void 0 : _a3.user) == null ? void 0 : _b3.app_referral_program) == null ? void 0 : _c.program_stats;
  if (!s) return null;
  return {
    accepted: Number(s.num_sent_app_referrals_accepted) || 0,
    redeemed: Number(s.num_sent_app_referrals_reward_redeemed) || 0,
    earned: (_d = s.yearly_credit_earned_formatted) != null ? _d : null,
    limit: (_e = s.yearly_credit_limit_formatted) != null ? _e : null
  };
}
async function worldStoreExtras(worldId, storeDestinationId) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const [page, similar] = await Promise.all([
    accountRead(STORE_DOC.worldPage, { itemID: String(worldId), imageScale: 1 }, { plain: true }).catch(() => null),
    storeDestinationId ? accountRead(
      STORE_DOC.similarWorlds,
      { worldID: String(storeDestinationId), imageScale: 1, isControllerConnected: true },
      { plain: true }
    ).catch(() => null) : null
  ]);
  const w = (_f = (_e = (_d = (_c = (_b3 = (_a3 = page == null ? void 0 : page.item) == null ? void 0 : _a3.oc_destination) == null ? void 0 : _b3.vr_destination) == null ? void 0 : _c.app_store_destination) == null ? void 0 : _d.destination) == null ? void 0 : _e.horizon_world) != null ? _f : {};
  return {
    genres: Array.isArray(w.world_genre_names) ? w.world_genre_names.filter(Boolean) : [],
    rating: (_h = (_g = w.horizon_content_rating) == null ? void 0 : _g.content_rating_text) != null ? _h : null,
    visited: typeof w.viewer_has_visited === "boolean" ? w.viewer_has_visited : null,
    creator: (_j = (_i = w.owner) == null ? void 0 : _i.owner_name) != null ? _j : null,
    population: Number.isFinite(Number(w.total_population)) ? Number(w.total_population) : null,
    likes: Number((_k = w.oc_destination) == null ? void 0 : _k.reactor_count) || null,
    similar: ((_m = (_l = similar == null ? void 0 : similar.node) == null ? void 0 : _l.related_items_v1) != null ? _m : []).map((r) => r == null ? void 0 : r.item).filter((i) => i == null ? void 0 : i.id).map((i) => {
      var _a4, _b4;
      return { name: i.display_unit_title || String(i.id), price: (_b4 = (_a4 = i.surfaced_price_display) == null ? void 0 : _a4.text) != null ? _b4 : null };
    })
  };
}
async function accountAvatars() {
  var _a3, _b3;
  const d = await accountRead(STORE_DOC.avatars, {}, { plain: true });
  return ((_b3 = (_a3 = d.xfb_avatar_max_get_avatars) == null ? void 0 : _a3.all_avatars) != null ? _b3 : []).filter((a) => (a == null ? void 0 : a.avatar_id) || (a == null ? void 0 : a.id)).map((a) => {
    var _a4, _b4, _c, _d, _e;
    return {
      id: String((_a4 = a.avatar_id) != null ? _a4 : a.id),
      kind: (_b4 = a.avatar_class) != null ? _b4 : null,
      body: (_c = a.full_body_preview_uri) != null ? _c : null,
      face: (_d = a.face_tile_preview_uri) != null ? _d : null,
      profiles: ((_e = a.assigned_identities) != null ? _e : []).map((i) => {
        var _a5;
        const where = (_a5 = { FRL: "Meta", FB: "Facebook", FACEBOOK: "Facebook", IG: "Instagram", INSTAGRAM: "Instagram" }[i == null ? void 0 : i.profile_platform]) != null ? _a5 : i == null ? void 0 : i.profile_platform;
        return [i == null ? void 0 : i.name, where].filter(Boolean).join(" on ");
      }).filter(Boolean)
    };
  });
}
async function storeAccount() {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const read = (doc) => accountRead(doc, {}, { plain: true }).catch(() => null);
  const [credit, settings, subs] = await Promise.all([read(STORE_DOC.credit), read(STORE_DOC.settings), read(STORE_DOC.subscriptions)]);
  const su = (_a3 = settings == null ? void 0 : settings.viewer) == null ? void 0 : _a3.user;
  return {
    credit: (_g = (_f = (_e = (_d = (_c = (_b3 = credit == null ? void 0 : credit.viewer) == null ? void 0 : _b3.user) == null ? void 0 : _c.payment_account) == null ? void 0 : _d.credit) == null ? void 0 : _e.balance) == null ? void 0 : _f.formatted_amount) != null ? _g : null,
    pinSet: typeof (su == null ? void 0 : su.is_pin_set) === "boolean" ? su.is_pin_set : null,
    contentFilter: (_h = su == null ? void 0 : su.store_content_filter_preference) != null ? _h : null,
    subscriptions: subs ? ((_l = (_k = (_j = (_i = subs.viewer) == null ? void 0 : _i.user) == null ? void 0 : _j.digital_subscriptions) == null ? void 0 : _k.nodes) != null ? _l : []).filter((n) => n == null ? void 0 : n.item).map((n) => {
      var _a4, _b4, _c2, _d2, _e2;
      return {
        name: (_a4 = n.item.display_name) != null ? _a4 : null,
        app: (_c2 = (_b4 = n.item.parent_application) == null ? void 0 : _b4.display_name) != null ? _c2 : null,
        appId: ((_d2 = n.item.parent_application) == null ? void 0 : _d2.id) ? String(n.item.parent_application.id) : null,
        active: Boolean(n.is_active),
        next: (_e2 = n.term_expiration_details) != null ? _e2 : null
      };
    }) : null
  };
}
async function storeCreditHistory() {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i;
  const d = await accountRead(STORE_DOC.creditHistory, {}, { plain: true });
  const c = (_c = (_b3 = (_a3 = d.viewer) == null ? void 0 : _a3.user) == null ? void 0 : _b3.payment_account) == null ? void 0 : _c.credit;
  return {
    balance: (_e = (_d = c == null ? void 0 : c.balance) == null ? void 0 : _d.formatted_amount) != null ? _e : null,
    entries: ((_g = (_f = c == null ? void 0 : c.transactions) == null ? void 0 : _f.edges) != null ? _g : []).map((e) => e == null ? void 0 : e.node).filter(Boolean).map((n) => {
      var _a4, _b4, _c2, _d2, _e2, _f2, _g2;
      return {
        type: (_a4 = n.type) != null ? _a4 : null,
        time: Number(n.time) || null,
        title: (_b4 = n.title) != null ? _b4 : null,
        detail: (_c2 = n.subtitle) != null ? _c2 : null,
        amount: (_e2 = (_d2 = n.value) == null ? void 0 : _d2.formatted_amount) != null ? _e2 : null,
        icon: (_g2 = (_f2 = n.icon) == null ? void 0 : _f2.uri) != null ? _g2 : null
      };
    }),
    more: Boolean((_i = (_h = c == null ? void 0 : c.transactions) == null ? void 0 : _h.page_info) == null ? void 0 : _i.has_next_page)
  };
}
async function relatedApps(appId) {
  var _a3, _b3, _c;
  const d = await accountRead(STORE_DOC.related, { appID: String(appId), imageScale: 1, isControllerConnected: true }, { plain: true });
  return ((_c = (_b3 = (_a3 = d.node) == null ? void 0 : _a3.related_items_with_ranking_trace) == null ? void 0 : _b3.edges) != null ? _c : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a4, _b4, _c2, _d, _e, _f, _g, _h;
    return {
      id: String(n.id),
      name: n.display_unit_title || String(n.id),
      price: (_b4 = (_a4 = n.surfaced_price_display) == null ? void 0 : _a4.text) != null ? _b4 : null,
      image: (_h = (_g = (_d = (_c2 = n.assets) == null ? void 0 : _c2.square_image_180) == null ? void 0 : _d.uri) != null ? _g : (_f = (_e = n.assets) == null ? void 0 : _e.icon_image_80) == null ? void 0 : _f.uri) != null ? _h : null,
      owned: Boolean(n.is_viewer_entitled)
    };
  });
}
var APP_DESTINATIONS_DOC_ID = "416618167111068373708718042057";
async function appDestinations(appId) {
  var _a3, _b3, _c, _d;
  const d = await accountRead(APP_DESTINATIONS_DOC_ID, { app_id: String(appId) });
  return ((_d = (_c = (_b3 = (_a3 = d.node) == null ? void 0 : _a3.grouping) == null ? void 0 : _b3.destinations) == null ? void 0 : _c.edges) != null ? _d : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a4, _b4;
    return {
      id: String(n.id),
      name: n.display_name || String(n.id),
      capacity: Number(n.max_group_launch_capacity) || null,
      image: typeof n.image === "string" ? n.image : (_b4 = (_a4 = n.image) == null ? void 0 : _a4.uri) != null ? _b4 : null
    };
  });
}
var APP_TAXONOMY_DOC_ID = "196995623014805601402940604810";
var taxonomyCache = /* @__PURE__ */ new Map();
function appTraits(appId) {
  const id = String(appId);
  if (!taxonomyCache.has(id)) {
    const p = accountRead(APP_TAXONOMY_DOC_ID, { appIds: [id] }).then(
      (d) => {
        var _a3, _b3, _c, _d;
        return ((_d = (_c = (_b3 = ((_a3 = d.multifetch__Application) != null ? _a3 : []).find((a) => {
          var _a4;
          return String((_a4 = a == null ? void 0 : a.node) == null ? void 0 : _a4.id) === id;
        })) == null ? void 0 : _b3.node) == null ? void 0 : _c.ordered_dimensions) != null ? _d : []).filter((x) => (x == null ? void 0 : x.dimension_key) && (x == null ? void 0 : x.untranslated_display_name)).map((x) => ({ key: x.dimension_key, name: x.untranslated_display_name }));
      }
    );
    p.catch(() => taxonomyCache.delete(id));
    taxonomyCache.set(id, p);
  }
  return taxonomyCache.get(id);
}
var profileCache = { token: null, p: null };
function accountProfile() {
  const { token, frlToken, images, extrasOff } = loadSettings();
  const key = `${token}
${frlToken}
${images}
${extrasOff.join(",")}`;
  if (profileCache.token === key && profileCache.p) return profileCache.p;
  const p = (async () => {
    var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa;
    const read = (doc) => accountRead(doc).then((d) => ({ d }), (e) => ({ e: e.message }));
    const none = { d: null };
    const salsaP = read(ACCOUNT_DOC.salsa);
    const audienceP = read(ACCOUNT_DOC.audience);
    const [profile, salsa, account, facebook, standing, audience, voice, communities, hplus, background, [privacy, status], supervision] = await Promise.all([
      read(ACCOUNT_DOC.profile),
      salsaP,
      read(ACCOUNT_DOC.account),
      read(ACCOUNT_DOC.facebook),
      read(ACCOUNT_DOC.standing),
      audienceP,
      extraOn("homeSettings") ? read(ACCOUNT_DOC.voice) : none,
      extraOn("homeSettings") ? read(ACCOUNT_DOC.communities) : none,
      extraOn("homeHplus") ? read(ACCOUNT_DOC.horizonPlus) : none,
      images && extraOn("homeBackground") ? read(ACCOUNT_DOC.background) : none,
      audienceP.then(
        (a) => {
          var _a4, _b4, _c2, _d2, _e2;
          return ((_e2 = (_d2 = (_c2 = (_b4 = (_a4 = a.d) == null ? void 0 : _a4.viewer) == null ? void 0 : _b4.user) == null ? void 0 : _c2.privacy_settings_list) == null ? void 0 : _d2.edges) == null ? void 0 : _e2.length) ? [none, none] : Promise.all([read(ACCOUNT_DOC.privacy), read(ACCOUNT_DOC.status)]);
        }
      ),
      salsaP.then((r) => {
        var _a4, _b4, _c2;
        return ((_c2 = (_b4 = (_a4 = r.d) == null ? void 0 : _a4.viewer) == null ? void 0 : _b4.user) == null ? void 0 : _c2.is_salsa) ? read(ACCOUNT_DOC.supervision) : none;
      })
    ]);
    const u = (_c = (_b3 = (_a3 = profile.d) == null ? void 0 : _a3.viewer) == null ? void 0 : _b3.user) != null ? _c : {};
    const out = {
      id: u.id ? String(u.id) : null,
      name: (_d = u.name) != null ? _d : null,
      alias: (_f = (_e = u.alias) != null ? _e : u.profile_name) != null ? _f : null,
      email: (_g = u.email) != null ? _g : null,
      photo: (_i = (_h = u.profile_photo) == null ? void 0 : _h.uri) != null ? _i : null,
      background: null,
      details: {},
      detailsError: null
    };
    if (!out.id) {
      try {
        const v = (_k = (_j = (await relayQuery(VIEWER_DOC_ID, {}, "Account")).viewer) == null ? void 0 : _j.user) != null ? _k : {};
        out.id = v.id ? String(v.id) : null;
        (_n = out.name) != null ? _n : out.name = (_m = (_l = v.display_name) != null ? _l : v.name) != null ? _m : null;
        (_p = out.alias) != null ? _p : out.alias = (_o = v.alias) != null ? _o : null;
        (_t = out.photo) != null ? _t : out.photo = (_s = (_r = (_q = v.profile_photo) != null ? _q : v.profilePhoto) == null ? void 0 : _r.uri) != null ? _s : null;
      } catch {
      }
    }
    const su = (_w = (_v = (_u = salsa.d) == null ? void 0 : _u.viewer) == null ? void 0 : _v.user) != null ? _w : {};
    const age = Number(su.frlm_age);
    const cc = (_z = (_y = (_x = standing.d) == null ? void 0 : _x.viewer) == null ? void 0 : _y.user) == null ? void 0 : _z.profile_ccve_status;
    const violations = cc ? (Array.isArray(cc.violations) ? cc.violations.length : 0) + (Array.isArray(cc.active_profile_violations_l7) ? cc.active_profile_violations_l7.length : 0) : null;
    const audienceList = ((_E = (_D = (_C = (_B = (_A = audience.d) == null ? void 0 : _A.viewer) == null ? void 0 : _B.user) == null ? void 0 : _C.privacy_settings_list) == null ? void 0 : _D.edges) != null ? _E : []).map((e) => e == null ? void 0 : e.node).filter((n) => (n == null ? void 0 : n.key) || (n == null ? void 0 : n.description)).map((n) => {
      var _a4, _b4, _c2, _d2, _e2;
      return {
        key: (_a4 = n.key) != null ? _a4 : null,
        name: String(n.description || n.key),
        value: (_b4 = n.selected_value) != null ? _b4 : null,
        valueName: (_e2 = (_d2 = ((_c2 = n.options) != null ? _c2 : []).find((o) => (o == null ? void 0 : o.key) === n.selected_value)) == null ? void 0 : _d2.name) != null ? _e2 : null
      };
    });
    const privacyList = audienceList.length ? audienceList : ((_J = (_I = (_H = (_G = (_F = privacy.d) == null ? void 0 : _F.viewer) == null ? void 0 : _G.user) == null ? void 0 : _H.privacy_settings_list) == null ? void 0 : _I.edges) != null ? _J : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.name).map((n) => {
      var _a4;
      return { key: null, name: String(n.name), value: (_a4 = n.selected_value) != null ? _a4 : null, valueName: null };
    });
    const linked = (_L = (_K = facebook.d) == null ? void 0 : _K.viewer) == null ? void 0 : _L.is_fb_linked_with_sso_enabled;
    const active = audienceList.some((a) => a.key === "ACTIVE_STATUS") ? null : (_T = (_S = (_R = (_Q = (_P = (_O = (_N = (_M = status.d) == null ? void 0 : _M.viewer) == null ? void 0 : _N.user) == null ? void 0 : _O.activeStatus) == null ? void 0 : _P.edges) == null ? void 0 : _Q[0]) == null ? void 0 : _R.node) == null ? void 0 : _S.selected_value) != null ? _T : null;
    const vu = (_W = (_V = (_U = voice.d) == null ? void 0 : _U.viewer) == null ? void 0 : _V.user) == null ? void 0 : _W.together_app_user;
    const sup = (_Z = (_Y = (_X = supervision.d) == null ? void 0 : _X.xfb_youth_platform) == null ? void 0 : _Y.feta_supervision) == null ? void 0 : _Z.notification_settings;
    const cv = (__ = communities.d) == null ? void 0 : __.viewer;
    const bg = (_ba = (_aa = (_$ = background.d) == null ? void 0 : _$.viewer) == null ? void 0 : _aa.user) == null ? void 0 : _ba.profile_background;
    const bool2 = (v) => typeof v === "boolean" ? v : null;
    out.background = (bg == null ? void 0 : bg.uri) ? { uri: bg.uri, color: (_ca = bg.contextual_color) != null ? _ca : null, type: (_da = bg.background_type) != null ? _da : null } : null;
    out.details = {
      voiceChannel: (_ea = vu == null ? void 0 : vu.oc_voice_channel) != null ? _ea : null,
      voiceParental: bool2(vu == null ? void 0 : vu.oc_parental_controls_enabled_for_voice_channel),
      supervisionNotifications: bool2(sup == null ? void 0 : sup.is_supervision_notification_enabled),
      communities: cv ? { adult: bool2(cv.can_create_adult_only_communities), minor: bool2(cv.can_create_minor_eligible_communities) } : null,
      horizonPlus: typeof ((_ja = (_ia = (_ha = (_ga = (_fa = hplus.d) == null ? void 0 : _fa.viewer) == null ? void 0 : _ga.user) == null ? void 0 : _ha.platform_subscription_details) == null ? void 0 : _ia.item) == null ? void 0 : _ja.is_viewer_entitled) === "boolean" ? hplus.d.viewer.user.platform_subscription_details.item.is_viewer_entitled : null,
      activeStatus: active,
      age: Number.isFinite(age) && age > 0 ? age : null,
      salsa: typeof su.is_salsa === "boolean" ? su.is_salsa : null,
      developer: typeof ((_ma = (_la = (_ka = account.d) == null ? void 0 : _ka.viewer) == null ? void 0 : _la.user) == null ? void 0 : _ma.is_developer) === "boolean" ? account.d.viewer.user.is_developer : null,
      facebookLinked: typeof linked === "boolean" ? linked : null,
      violations,
      privacy: privacyList
    };
    const anyDetail = Object.values(out.details).some((v) => Array.isArray(v) ? v.length : v != null);
    if (!anyDetail) out.detailsError = (_pa = (_oa = (_na = salsa.e) != null ? _na : profile.e) != null ? _oa : account.e) != null ? _pa : "the store refused";
    if (!out.id && !anyDetail && profileCache.p === p) profileCache = { token: null, p: null };
    return out;
  })();
  profileCache = { token: key, p };
  return p;
}
var LEADERBOARDS_DOC_ID = "9565763956824872";
var LEADERBOARD_DOC_ID = "9537594396277058";
var LEADERBOARD_VIEWS = [
  ["GLOBAL", "Everyone"],
  ["FRIENDS", "Friends"],
  ["SELF", "Around you"]
];
async function appLeaderboards(appId) {
  var _a3, _b3, _c, _d, _e, _f;
  const data = await relayQuery(LEADERBOARDS_DOC_ID, { applicationId: String(appId) }, "Leaderboards");
  const app = (_b3 = (_a3 = data.application) != null ? _a3 : data.node) != null ? _b3 : {};
  const conn = (_e = (_c = app.platform_services) == null ? void 0 : _c.viewerLeaderboards) != null ? _e : (_d = app.platform_services) == null ? void 0 : _d.viewer_leaderboards;
  return ((_f = conn == null ? void 0 : conn.nodes) != null ? _f : []).filter((n) => n == null ? void 0 : n.id).map((n) => ({ id: String(n.id), title: n.title || String(n.id) }));
}
async function leaderboardEntries(leaderboardId, view = "GLOBAL") {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j;
  const data = await relayQuery(
    LEADERBOARD_DOC_ID,
    { leaderboardId: String(leaderboardId), selectedType: view },
    "Leaderboards"
  );
  const lb = (_a3 = data.leaderboard) != null ? _a3 : data.node;
  if (!lb) throw new Error("the store returned no leaderboard");
  const photo = (u) => {
    var _a4, _b4, _c2;
    return (_c2 = (_b4 = (_a4 = u == null ? void 0 : u.profilePhoto) != null ? _a4 : u == null ? void 0 : u.profile_photo) == null ? void 0 : _b4.uri) != null ? _c2 : null;
  };
  return {
    id: String((_b3 = lb.id) != null ? _b3 : leaderboardId),
    title: (_c = lb.title) != null ? _c : null,
    myRank: (_f = (_e = (_d = lb.myEntry) != null ? _d : lb.my_top_entry) == null ? void 0 : _e.rank) != null ? _f : null,
    friends: (_i = (_h = (_g = lb.friendsWithEntries) != null ? _g : lb.friends_with_entries) == null ? void 0 : _h.count) != null ? _i : null,
    entries: ((_j = lb.entries) != null ? _j : []).map((e) => {
      var _a4, _b4, _c2, _d2, _e2, _f2, _g2;
      return {
        rank: (_a4 = e == null ? void 0 : e.rank) != null ? _a4 : null,
        score: (_c2 = (_b4 = e == null ? void 0 : e.entry) == null ? void 0 : _b4.score) != null ? _c2 : null,
        name: (_f2 = (_e2 = (_d2 = e == null ? void 0 : e.entry) == null ? void 0 : _d2.user) == null ? void 0 : _e2.alias) != null ? _f2 : null,
        photo: photo((_g2 = e == null ? void 0 : e.entry) == null ? void 0 : _g2.user)
      };
    })
  };
}
var ADDONS_DOC_ID = "10041200072603920";
var ADDONS_PAGE = 24;
async function appAddons(appId, { count = ADDONS_PAGE, cursor = null, loaded = 0 } = {}) {
  var _a3, _b3, _c, _d, _e;
  const data = await relayQuery(
    ADDONS_DOC_ID,
    { id: String(appId), first: count, forward: true, after: cursor, before: null, last: null },
    "Add-ons"
  );
  const conn = (_b3 = (_a3 = data.node) == null ? void 0 : _a3.latest_supported_binary) == null ? void 0 : _b3.firstIapItems;
  const edges = (_c = conn == null ? void 0 : conn.edges) != null ? _c : [];
  const items = edges.map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a4, _b4, _c2, _d2, _e2, _f, _g, _h, _i, _j;
    return {
      id: String(n.id),
      name: (_a4 = n.display_name) != null ? _a4 : String(n.id),
      description: (_b4 = n.display_short_description) != null ? _b4 : null,
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
  var _a3, _b3, _c;
  const uid = await viewerId();
  const data = await relayQuery(ACHIEVEMENTS_DOC_ID, { appId: String(appId), userId: uid }, "Achievements");
  const ps = (_a3 = data.node) == null ? void 0 : _a3.platform_services;
  if (!ps) throw new Error("the store has no achievements for this app");
  const achievements = ((_c = (_b3 = ps.achievement_definitions) == null ? void 0 : _b3.edges) != null ? _c : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a4, _b4, _c2, _d, _e, _f, _g, _h, _i;
    const unlocked = Boolean((_a4 = n.progress_for_user) == null ? void 0 : _a4.is_unlocked);
    return {
      id: String(n.id),
      title: (_b4 = n.title) != null ? _b4 : null,
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
  var _a3, _b3;
  const orders = ((_a3 = conn == null ? void 0 : conn.edges) != null ? _a3 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id).map((n) => {
    var _a4, _b4, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A;
    const a = (_a4 = n.app_store_item) != null ? _a4 : {};
    const pm = n.payment_method;
    const payment = pm ? `${(_c = (_b4 = pm.card_type) != null ? _b4 : pm.display_name) != null ? _c : "Card"}${pm.last4 ? ` \u2022\u2022${pm.last4}` : ""}` : n.is_platform_currency ? "Meta credit" : (_d = n.funding_source) != null ? _d : null;
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
    cursor: ((_b3 = conn == null ? void 0 : conn.page_info) == null ? void 0 : _b3.has_next_page) ? conn.page_info.end_cursor : null
  };
}
async function purchaseHistory() {
  var _a3;
  const data = await relayQuery(PURCHASES_DOC_ID, {}, "Purchases");
  const user = (_a3 = data.viewer) == null ? void 0 : _a3.user;
  const acct = user == null ? void 0 : user.payment_account;
  if (!acct) throw new Error("the store returned no purchase history for this account");
  return parsePurchases(acct.digital_orders, user.id);
}
var PURCHASES_PAGE = 20;
async function morePurchases(accountId, cursor) {
  var _a3, _b3;
  const data = await relayQuery(
    PURCHASES_PAGE_DOC_ID,
    { count: PURCHASES_PAGE, cursor, encode: "PNG", id: String(accountId) },
    "Purchases"
  );
  return parsePurchases((_b3 = (_a3 = data.node) == null ? void 0 : _a3.payment_account) == null ? void 0 : _b3.digital_orders, accountId);
}
var HORIZON_PLUS_DOC_ID = "98891515114376018422795109374";
async function horizonPlus() {
  var _a3, _b3, _c;
  const data = await accountQuery(HORIZON_PLUS_DOC_ID, {}, "Horizon+");
  const item = (_c = (_b3 = (_a3 = data.viewer) == null ? void 0 : _a3.user) == null ? void 0 : _b3.platform_subscription_details) == null ? void 0 : _c.item;
  if (!item) throw new Error("the store returned no Horizon+ catalog for this account");
  const row = (n, plus) => {
    var _a4, _b4, _c2, _d, _e, _f, _g;
    return {
      id: String(n.id),
      name: n.display_name || n.package_name || String(n.id),
      packageName: (_a4 = n.package_name) != null ? _a4 : null,
      platform: "ANDROID_6DOF",
      /* Square cover, then the launcher icon, then the VR icon — never blank when
         the store sent any of them. */
      image: (_g = (_f = (_d = (_b4 = n.cover_square_image) == null ? void 0 : _b4.uri) != null ? _d : (_c2 = n.icon_image) == null ? void 0 : _c2.uri) != null ? _f : (_e = n.vr_icon_image) == null ? void 0 : _e.uri) != null ? _g : null,
      media: nodeMedia(n),
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
    var _a4;
    return ((_a4 = conn == null ? void 0 : conn.edges) != null ? _a4 : []).map((e) => e == null ? void 0 : e.node).filter((n) => n == null ? void 0 : n.id);
  };
  const out = /* @__PURE__ */ new Map();
  for (const n of nodes(item.platform_subscription_items)) out.set(String(n.id), row(n, "monthly"));
  for (const n of nodes(item.platform_subscription_catalog_items)) {
    if (!out.has(String(n.id))) out.set(String(n.id), row(n, "catalog"));
  }
  return [...out.values()];
}
var STORE_HOME_DOC_ID = "28677966775147985";
var STORE_SECTION_UNITS_DOC_ID = "38780697354876824";
async function horizonPlusSections() {
  var _a3, _b3, _c, _d, _e, _f;
  const d = await accountRead(
    STORE_HOME_DOC_ID,
    {
      count: 50,
      cursor: null,
      hmdType: "EUREKA",
      imageScale: 1,
      isControllerConnected: true,
      isOsDefaultApp: false,
      seedID: null,
      shouldOnlyReturnFirstView: false,
      storeIDOverride: null,
      storeViewFilter: null,
      storeViewTypes: ["STORE_VIEWS_WITH_CATEGORY_CONTEXT"],
      useTestStore: false
    },
    { plain: true }
  );
  const out = /* @__PURE__ */ new Map();
  for (const v of (_c = (_b3 = (_a3 = d.viewer) == null ? void 0 : _a3.appStore) == null ? void 0 : _b3.store_views) != null ? _c : []) {
    if (!/^\s*(quest|horizon)\s*\+/i.test((_d = v == null ? void 0 : v.untranslated_display_name) != null ? _d : "")) continue;
    for (const s of ((_f = (_e = v.subsections) == null ? void 0 : _e.edges) != null ? _f : []).map((e) => e == null ? void 0 : e.node)) {
      if ((s == null ? void 0 : s.id) && s.section_name && !out.has(String(s.id))) out.set(String(s.id), { id: String(s.id), name: s.section_name });
    }
  }
  return [...out.values()];
}
async function horizonPlusSection(sectionId) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  const apps = [];
  const others = [];
  let cursor = null;
  for (let page = 0; page < 20; page++) {
    const d = await accountRead(
      STORE_SECTION_UNITS_DOC_ID,
      {
        id: String(sectionId),
        count: 50,
        cursor,
        imageScale: 1,
        initialCount: 50,
        isControllerConnected: true,
        seedID: null,
        storeViewFilter: null,
        ageRatingAnyFilter: null,
        contentTopics: null,
        interactionMode: null,
        languageAnyFilter: null,
        priceRange: null,
        ratingAbove: null,
        saleTypeAnyFilter: null,
        sortOrder: null,
        supportedControllers: null,
        supportedPlayerModes: null,
        surface: null,
        unifiedTaxonomyDimensionIds: null
      },
      { plain: true }
    );
    const units = (_a3 = d.node) == null ? void 0 : _a3.units;
    for (const u of ((_b3 = units == null ? void 0 : units.edges) != null ? _b3 : []).map((e) => e == null ? void 0 : e.node)) {
      if (!(u == null ? void 0 : u.id)) continue;
      const a = (_c = u.assets) != null ? _c : {};
      const image = (_i = (_h = (_f = (_d = a.square_image_180) == null ? void 0 : _d.uri) != null ? _f : (_e = a.icon_image_80) == null ? void 0 : _e.uri) != null ? _h : (_g = a.square_image_360) == null ? void 0 : _g.uri) != null ? _i : null;
      const title = u.display_unit_title || u.title || u.display_name || String(u.id);
      if (u.__typename === "Application") {
        apps.push({
          id: String(u.id),
          name: title,
          packageName: null,
          platform: "ANDROID_6DOF",
          image,
          media: [],
          price: null,
          offerId: null,
          free: false,
          channels: [],
          claimed: Boolean(u.is_viewer_entitled)
        });
      } else {
        const t = `${u.__typename} ${(_j = u.destination_content_type) != null ? _j : ""}`;
        others.push({
          id: String(u.id),
          title,
          kind: /XBOX/i.test(t) ? "Xbox cloud game" : /Series/i.test(t) ? "TV series" : /Movie|Media/i.test(t) ? "Movie" : "Other",
          media: /Movie|Series|Media/i.test(t),
          image,
          genres: (_m = (_l = (_k = u.third_party_game) == null ? void 0 : _k.genre_names_ranked) != null ? _l : u.media_genres) != null ? _m : [],
          note: (_o = (_n = u.surfaced_price_display) == null ? void 0 : _n.text) != null ? _o : null
        });
      }
    }
    cursor = ((_p = units == null ? void 0 : units.page_info) == null ? void 0 : _p.has_next_page) ? units.page_info.end_cursor : null;
    if (!cursor) break;
  }
  return { apps, others };
}
var STORE_FRONT_DOC_ID = "27955155650852217";
var STORE_SECTION_DOC_ID = "28264408599874874";
var LAYOUTS = {
  Default: "Shelf",
  List: "List",
  Spotlight: "Spotlight",
  MerchEditorial: "Editorial",
  MerchLaunch: "New release",
  MerchTimebound: "Limited time",
  CategoryStrip: "Categories"
};
var layoutName = (type) => {
  var _a3, _b3;
  const key = (_a3 = /RenderingStrategy(\w+)$/.exec(type != null ? type : "")) == null ? void 0 : _a3[1];
  return key ? (_b3 = LAYOUTS[key]) != null ? _b3 : key : null;
};
async function storeFront(hmdType = loadSettings().hmd, viewId = null) {
  var _a3, _b3, _c, _d, _e, _f, _g;
  const quest = ((_a3 = HMD_PLATFORM[hmdType]) != null ? _a3 : "ANDROID_6DOF") === "ANDROID_6DOF";
  const data = await relayQuery(
    STORE_FRONT_DOC_ID,
    {
      appStoreID: null,
      hmdType,
      useTestStore: false,
      storeViewTypes: [quest ? "STORE_VIEWS_WITH_CATEGORY_CONTEXT" : "IN_2D"],
      storeViewID: viewId,
      seedID: null,
      shouldShowBalance: false,
      __relay_internal__pv__storeInitialShelvesCountrelayprovider: 60,
      __relay_internal__pv__topChartsCardrelayprovider: false,
      __relay_internal__pv__horizonPlusBadgerelayprovider: false,
      __relay_internal__pv__hasTWNewMerchUnitsLaunchEnabledrelayprovider: false
    },
    "The store front"
  );
  const store = (_b3 = data.viewer) == null ? void 0 : _b3.app_store;
  if (!store) throw new Error("the store returned no store front for this headset");
  const view = (_d = (_c = store.store_views) == null ? void 0 : _c[0]) != null ? _d : null;
  const sections = ((_f = (_e = view == null ? void 0 : view.streamed_subsections) == null ? void 0 : _e.edges) != null ? _f : []).map((e) => e == null ? void 0 : e.node).filter((n) => (n == null ? void 0 : n.id) && n.section_name).map((n) => {
    var _a4;
    return {
      id: String(n.id),
      name: n.section_name,
      layout: layoutName((_a4 = n.rendering_strategy) == null ? void 0 : _a4.__typename),
      ordered: Boolean(n.is_ordered_list)
    };
  });
  return {
    views: ((_g = store.all_store_views) != null ? _g : []).filter((v) => v == null ? void 0 : v.id).map((v) => ({ id: String(v.id), name: v.translated_display_name || String(v.id) })),
    viewId: (view == null ? void 0 : view.id) ? String(view.id) : null,
    sections
  };
}
var FOR_YOU_SECTION = { id: "HEADSET_FOR_YOU", name: "Apps you might like (for your account)" };
var STORE_NULL_STATE_DOC_ID = "28810240491893654";
async function headsetForYou(hmdType) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
  const d = await accountRead(
    STORE_NULL_STATE_DOC_ID,
    { imageScale: 1, isControllerConnected: true, shelfCount: 10, shelfCursor: null },
    { plain: true }
  );
  const platform = (_a3 = HMD_PLATFORM[hmdType]) != null ? _a3 : "ANDROID_6DOF";
  const apps = [];
  for (const s of ((_f = (_e = (_d = (_c = (_b3 = d.viewer) == null ? void 0 : _b3.vr_search) == null ? void 0 : _c.null_state) == null ? void 0 : _d.shelves) == null ? void 0 : _e.edges) != null ? _f : []).map((e) => e == null ? void 0 : e.node)) {
    for (const u of ((_j = (_i = (_h = (_g = s == null ? void 0 : s.rendering_strategy) == null ? void 0 : _g.section) == null ? void 0 : _h.units) == null ? void 0 : _i.edges) != null ? _j : []).map((e) => e == null ? void 0 : e.node)) {
      if ((u == null ? void 0 : u.__typename) !== "Application" || !u.id || apps.some((a2) => a2.id === String(u.id))) continue;
      const a = (_k = u.assets) != null ? _k : {};
      apps.push({
        id: String(u.id),
        name: u.display_unit_title || String(u.id),
        packageName: null,
        platform,
        image: (_q = (_p = (_n = (_l = a.square_image_180) == null ? void 0 : _l.uri) != null ? _n : (_m = a.icon_image_80) == null ? void 0 : _m.uri) != null ? _p : (_o = a.square_image_360) == null ? void 0 : _o.uri) != null ? _q : null,
        media: [],
        price: (_s = (_r = u.surfaced_price_display) == null ? void 0 : _r.text) != null ? _s : null,
        offerId: null,
        free: /^free$/i.test((_u = (_t = u.surfaced_price_display) == null ? void 0 : _t.text) != null ? _u : ""),
        channels: [],
        rank: apps.length + 1
      });
    }
  }
  return { apps, cursor: null };
}
async function storeSection(sectionId, hmdType = loadSettings().hmd, cursor = null, start = 0) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
  if (sectionId === FOR_YOU_SECTION.id) return headsetForYou(hmdType);
  const data = await relayQuery(
    STORE_SECTION_DOC_ID,
    {
      id: String(sectionId),
      count: 50,
      cursor,
      encode: "JPEG",
      __relay_internal__pv__horizonPlusBadgerelayprovider: false
    },
    "The store section"
  );
  const units = (_a3 = data.node) == null ? void 0 : _a3.units;
  const platform = (_b3 = HMD_PLATFORM[hmdType]) != null ? _b3 : "ANDROID_6DOF";
  const apps = [];
  for (const edge of (_c = units == null ? void 0 : units.edges) != null ? _c : []) {
    const n = edge == null ? void 0 : edge.node;
    if ((n == null ? void 0 : n.__typename) !== "Application" || !n.id) continue;
    const offer = n.current_offer;
    const a = (_d = n.assets) != null ? _d : {};
    apps.push({
      id: String(n.id),
      name: n.display_name || n.display_unit_title || String(n.id),
      packageName: (_e = n.package_name) != null ? _e : null,
      platform,
      /* The icon before the landscape: a row shows a small square, and a wide
         banner cropped into it is the wrong picture. */
      image: (_s = (_r = (_p = (_n = (_l = (_j = (_h = (_f = a.cover_square_image) == null ? void 0 : _f.uri) != null ? _h : (_g = a.icon_image) == null ? void 0 : _g.uri) != null ? _j : (_i = n.cover_square_image) == null ? void 0 : _i.uri) != null ? _l : (_k = n.icon_image) == null ? void 0 : _k.uri) != null ? _n : (_m = a.vr_icon_image) == null ? void 0 : _m.uri) != null ? _p : (_o = n.vr_icon_image) == null ? void 0 : _o.uri) != null ? _r : (_q = n.cover_landscape_image) == null ? void 0 : _q.uri) != null ? _s : null,
      media: [...nodeMedia(a), ...nodeMedia(n)],
      /* The store words the price itself ("Free", "$19.99", "Coming soon"),
         so that is shown as it is. */
      price: ((_t = n.price_or_status_display) == null ? void 0 : _t.text) || ((_u = offer == null ? void 0 : offer.price) == null ? void 0 : _u.formatted) || null,
      offerId: (offer == null ? void 0 : offer.id) ? String(offer.id) : null,
      free: ((_v = offer == null ? void 0 : offer.price) == null ? void 0 : _v.offset_amount) === "0",
      channels: [],
      rank: start + apps.length + 1
    });
  }
  return {
    apps,
    cursor: ((_w = units == null ? void 0 : units.page_info) == null ? void 0 : _w.has_next_page) ? units.page_info.end_cursor : null
  };
}
var TOP_CHARTS_DOC_ID = "26156053534020750";
var TOP_CHARTS_SECTION_ID = "1359505205516508";
async function topCharts(hmdType = loadSettings().hmd) {
  var _a3, _b3, _c;
  const data = await relayQuery(
    TOP_CHARTS_DOC_ID,
    { hmdType, sectionID: TOP_CHARTS_SECTION_ID },
    "The top charts"
  );
  return ((_c = (_b3 = (_a3 = data.section) == null ? void 0 : _a3.units) == null ? void 0 : _b3.edges) != null ? _c : []).map((e) => e == null ? void 0 : e.node).filter((n) => {
    var _a4;
    return ((_a4 = n == null ? void 0 : n.banner_target) == null ? void 0 : _a4.id) && n.display_unit_title;
  }).map((n) => ({
    id: String(n.banner_target.id),
    name: n.display_unit_title,
    layout: "Top chart",
    ordered: true
  }));
}
var WISHLIST_SECTION_ID = "1694291617673045";
function wishlist(hmdType = loadSettings().hmd, cursor = null, start = 0) {
  return storeSection(WISHLIST_SECTION_ID, hmdType, cursor, start);
}
var DEV_POSTS_DOC_ID = "28585215657832212";
var DEV_POST_FLAGS = Object.fromEntries(
  [
    "showSocialContextInHzwFeeds",
    "shouldEnableMetaCredit",
    "showSocialContextInHzwFeedsThreeTiles",
    "EnableStoryDebugInfo",
    "IsEnhancedUserTile",
    "IsCoinflipUserTile",
    "ArePostLikesEnabled",
    "AreHorizonWorldsPostShown"
  ].map((n) => [`__relay_internal__pv__${n}relayprovider`, false])
);
async function appDevPosts(appId, hmdType = loadSettings().hmd) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const data = await relayQuery(
    DEV_POSTS_DOC_ID,
    {
      itemID: String(appId),
      hmdType,
      platform: (_a3 = HMD_PLATFORM[hmdType]) != null ? _a3 : "ANDROID_6DOF",
      LIBRARY_INFO_LAST_ACTIVE_WINDOW: -1,
      ...DEV_POST_FLAGS
    },
    "Developer posts"
  );
  const app = data.app;
  if (!app) throw new Error("the store has no page for this app");
  const seen = /* @__PURE__ */ new Set();
  const posts = [];
  for (const post of (_b3 = app.posts) != null ? _b3 : []) {
    for (const s of (_d = (_c = post == null ? void 0 : post.target_object) == null ? void 0 : _c.story_previews) != null ? _d : []) {
      const r = s == null ? void 0 : s.tw_tile_rendering_strategy;
      if ((r == null ? void 0 : r.__typename) !== "XOCTwilightDevPostStoryRenderingStrategy" || !r.story) continue;
      const st = r.story;
      const id = String((_g = (_f = (_e = st.target_object) == null ? void 0 : _e.id) != null ? _f : st.id) != null ? _g : "");
      if (!id || seen.has(id)) continue;
      seen.add(id);
      posts.push({
        id,
        title: st.title || null,
        body: st.description_plain_text || null,
        time: st.display_time || null,
        image: (_k = (_j = (_h = st.largeImageForSingleStoryTile) == null ? void 0 : _h.uri) != null ? _j : (_i = st.image) == null ? void 0 : _i.uri) != null ? _k : null,
        author: (_m = (_l = st.source) == null ? void 0 : _l.name) != null ? _m : null
      });
    }
  }
  return posts;
}
var PRESENCE_DOC_ID = "30449252678782676021745973837";
var ROSTER_DOC_ID = "9609976019080474";
async function recentPresence() {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
  const [data, roster] = await Promise.all([
    accountQuery(PRESENCE_DOC_ID, {}, "Last active"),
    relayQuery(ROSTER_DOC_ID, {}, "Last active").catch(() => null)
  ]);
  const p = (_b3 = (_a3 = data.viewer) == null ? void 0 : _a3.user) == null ? void 0 : _b3.most_recent_presence;
  if (!p) return null;
  const r = (_c = roster == null ? void 0 : roster.viewer) == null ? void 0 : _c.user;
  const party = Number((_d = r == null ? void 0 : r.lobby_roster) == null ? void 0 : _d.count);
  const rp = (_e = r == null ? void 0 : r.most_recent_presence) != null ? _e : {};
  const facts = {};
  const READ = /* @__PURE__ */ new Set([
    "vr_last_active_time",
    "is_current",
    "destination_api_name",
    "lobby_session_id",
    "match_session_id",
    "application_display_name",
    "application_name",
    "destination_display_name",
    "destination_name",
    "lobby_roster_count"
  ]);
  const collect = (o, prefix, depth) => {
    for (const [k, v] of Object.entries(o || {})) {
      if (k.startsWith("__") || k === "most_recent_presence") continue;
      if (/^(alias|name|display_name|profile_name|unique_name|email)$/.test(k)) continue;
      if (/(^|_)id$|Id$|ur[il]$|image|photo|token|session|cursor|hash/i.test(k)) continue;
      const key = prefix ? `${prefix}_${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) {
        if (depth < 2) collect(v, key, depth + 1);
        continue;
      }
      if (v == null || Array.isArray(v) || READ.has(key) || key in facts) continue;
      if (typeof v === "string" && (/^https?:/i.test(v) || v.length > 80 || !v.trim())) continue;
      facts[key] = v;
    }
  };
  collect(p, "", 0);
  collect(rp, "", 0);
  if (r) collect(r, "", 0);
  return {
    lobby: r ? Boolean(rp.lobby_session_id) : null,
    match: r ? Boolean(rp.match_session_id) : null,
    party: Number.isFinite(party) && party > 0 ? party : null,
    /* Seconds since the epoch. */
    lastActive: Number(p.vr_last_active_time) || null,
    current: Boolean(p.is_current),
    app: (_k = (_j = (_h = (_f = p.application) == null ? void 0 : _f.display_name) != null ? _h : (_g = p.application) == null ? void 0 : _g.name) != null ? _j : (_i = rp.application) == null ? void 0 : _i.display_name) != null ? _k : null,
    destination: (_m = (_l = p.destination_api_name) != null ? _l : rp.destination_api_name) != null ? _m : null,
    destinationName: (_s = (_r = (_p = (_n = p.destination) == null ? void 0 : _n.display_name) != null ? _p : (_o = p.destination) == null ? void 0 : _o.name) != null ? _r : (_q = rp.destination) == null ? void 0 : _q.display_name) != null ? _s : null,
    facts
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
  var _a3, _b3, _c, _d, _e, _f, _g;
  const [style, gating, config] = await Promise.allSettled([
    relayQuery(AVATAR_STYLE_DOC_ID, {}, "Avatar"),
    relayQuery(AVATAR_GATING_DOC_ID, { data: {} }, "Avatar"),
    relayQuery(AVATAR_CONFIG_DOC_ID, { data: {} }, "Avatar")
  ]);
  if (style.status === "rejected" && gating.status === "rejected" && config.status === "rejected") {
    throw style.reason;
  }
  const s = (_a3 = style.value) == null ? void 0 : _a3.avatar_vr_convergence_2;
  const gates = Object.entries((_c = (_b3 = gating.value) == null ? void 0 : _b3.avatar_horizon_gating_values) != null ? _c : {}).filter(
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
  var _a3, _b3, _c, _d;
  const out = /* @__PURE__ */ new Map();
  let cursor = null;
  for (let page = 0; page < ENTITLEMENT_PAGES; page++) {
    const json = await storeQuery(OWNED_IAPS_DOC_ID, { ...ENTITLEMENTS_VARIABLES, cursorID: cursor }, { client: true });
    refuse(json, "DLC you own");
    const list = entitlementConnection(json);
    if (!list) throw new Error("the store returned no library to read DLC from");
    for (const edge of (_a3 = list.edges) != null ? _a3 : []) {
      const app = (_b3 = edge == null ? void 0 : edge.node) == null ? void 0 : _b3.item;
      if (!(app == null ? void 0 : app.id)) continue;
      const iaps = listOf(app.iap_entitlements).filter((e) => e == null ? void 0 : e.item).map((e) => {
        var _a4, _b4, _c2, _d2;
        return {
          id: String((_a4 = e.id) != null ? _a4 : e.item.id),
          name: e.item.display_name || e.item.sku || String(e.item.id),
          sku: (_b4 = e.item.sku) != null ? _b4 : null,
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
  var _a3, _b3;
  const json = await storeQuery(CLAIM_DOC_ID, {
    input: {
      offer_id: String(offerId),
      hmd_type: hmdType,
      include_entitlement: true,
      client_mutation_id: "1"
    }
  });
  refuse(json, "Claiming");
  return (_b3 = Object.values((_a3 = json.data) != null ? _a3 : {})[0]) != null ? _b3 : {};
}
var DEVICE_PTC_DOC_ID = "4595761627188741";
var PTC_ACTOR_ID = 49;
async function setDevicePTC(serial, enabled) {
  var _a3, _b3;
  const json = await storeQuery(DEVICE_PTC_DOC_ID, {
    setStatusData: {
      device_serial: String(serial),
      is_enabled: Boolean(enabled),
      actor_id: PTC_ACTOR_ID,
      client_mutation_id: PTC_ACTOR_ID
    }
  });
  refuse(json, "Changing a headset's test channel");
  return (_b3 = Object.values((_a3 = json.data) != null ? _a3 : {})[0]) != null ? _b3 : {};
}
var DEVICE_PTC_STATUS_DOC_ID = "7735473863144745";
async function devicePTCStatus(serial) {
  var _a3;
  const json = await storeQuery(DEVICE_PTC_STATUS_DOC_ID, { device_serial: String(serial) });
  refuse(json, "Test channel status");
  const s = (_a3 = json.data) == null ? void 0 : _a3.public_test_channel_status;
  if (!s) throw new Error("the store gave no test channel status");
  return { allowed: Boolean(s.is_allowed), enabled: Boolean(s.is_enabled) };
}
var CHANNEL_DOC_ID = "3973666182694273";
async function channelObbs(releaseChannelID) {
  var _a3, _b3, _c, _d, _e, _f;
  const json = await storeQuery(CHANNEL_DOC_ID, { releaseChannelID: String(releaseChannelID) });
  refuse(json, "The OBB lookup");
  const node = (_a3 = json.data) == null ? void 0 : _a3.node;
  if (!node) throw new Error("the store returned no such release channel");
  const pairs = /* @__PURE__ */ new Map();
  const take = (binary) => {
    var _a4;
    if ((binary == null ? void 0 : binary.id) && ((_a4 = binary.obb_binary) == null ? void 0 : _a4.id)) {
      pairs.set(String(binary.id), String(binary.obb_binary.id));
    }
  };
  for (const edge of (_d = (_c = (_b3 = node.application) == null ? void 0 : _b3.primary_binaries) == null ? void 0 : _c.edges) != null ? _d : []) take(edge == null ? void 0 : edge.node);
  for (const edge of (_f = (_e = node.binaries) == null ? void 0 : _e.edges) != null ? _f : []) take(edge == null ? void 0 : edge.node);
  take(node.latest_supported_binary);
  return pairs;
}
var ORG_APPS_DOC_ID = "27915674441422265";
var ORG_PAGE_KEY = "metadb.orgPageSize";
async function orgApps(orgID, { onPage = null } = {}) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  const out = /* @__PURE__ */ new Map();
  let after = null;
  const SIZES = [500, 100, 20];
  let si = Math.max(0, SIZES.indexOf(Number(localStorage.getItem(ORG_PAGE_KEY))));
  let size = SIZES[si];
  for (let page = 0; page < 200; page += 1) {
    const ask = () => storeQuery(ORG_APPS_DOC_ID, {
      after,
      display_name: null,
      exclude_hyperscapes: true,
      exclude_platforms: ["HORIZON_WORLD", "HORIZON_UNITY_WORLD"],
      first: size,
      orderby: "DISPLAY_NAME",
      platform: null,
      id: String(orgID)
    });
    let json = await ask();
    for (; ; ) {
      try {
        refuse(json, "An organization's apps");
        break;
      } catch (err2) {
        if (page !== 0 || si >= SIZES.length - 1) throw err2;
        size = SIZES[++si];
        json = await ask();
      }
    }
    if (page === 0) {
      try {
        localStorage.setItem(ORG_PAGE_KEY, String(size));
      } catch {
      }
    }
    const conn = (_f = (_e = (_b3 = (_a3 = json.data) == null ? void 0 : _a3.node) == null ? void 0 : _b3.applications) != null ? _e : (_d = (_c = json.data) == null ? void 0 : _c.organization) == null ? void 0 : _d.applications) != null ? _f : {};
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
        /* Square cover or icon first; the landscape only when it is all there is. */
        image: (_p = (_o = (_m = (_k = (_i = n.cover_square_image) == null ? void 0 : _i.uri) != null ? _k : (_j = n.icon_image) == null ? void 0 : _j.uri) != null ? _m : (_l = n.vr_icon_image) == null ? void 0 : _l.uri) != null ? _o : (_n = n.cover_landscape_image) == null ? void 0 : _n.uri) != null ? _p : null,
        media: nodeMedia(n)
      });
    }
    const pi = (_q = conn.page_info) != null ? _q : {};
    const more = Boolean(pi.has_next_page && pi.end_cursor);
    if (onPage) onPage([...out.values()], more);
    if (!more) break;
    after = pi.end_cursor;
  }
  return [...out.values()];
}
var DEVICES_DOC_ID = "26205914622391442";
async function accountDevices() {
  var _a3, _b3, _c, _d, _e;
  const json = await storeQuery(DEVICES_DOC_ID, {});
  refuse(json, "Headsets");
  const root = (_b3 = (_a3 = json.data) == null ? void 0 : _a3.xoc_oc_user_from_frl) != null ? _b3 : {};
  const owned = (_d = (_c = root.owned_devices) == null ? void 0 : _c.nodes) != null ? _d : [];
  const shared = (_e = root.all_usable_devices) != null ? _e : [];
  const out = /* @__PURE__ */ new Map();
  const add = (n, ownership) => {
    var _a4, _b4, _c2, _d2, _e2;
    if (!(n == null ? void 0 : n.serial) || out.has(n.serial)) return;
    out.set(n.serial, {
      id: (_a4 = n.id) != null ? _a4 : null,
      serial: n.serial,
      model: (_b4 = n.hwm_mapped_device_type) != null ? _b4 : null,
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
function routePc(url) {
  const r = route(url);
  return `${r}${r.includes("?") ? "&" : "?"}pc=1`;
}
async function cdnRefusal(what, url, res) {
  var _a3;
  const text = (await res.text().catch(() => "")).replace(/\s+/g, " ").trim();
  const msg = ((_a3 = text.match(/"message"\s*:\s*"([^"]+)"/)) == null ? void 0 : _a3[1]) || text.slice(0, 160);
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
  }
  return new Error(`${what} was refused (HTTP ${res.status}${host ? ` from ${host}` : ""})${msg ? `: ${msg}` : ""}`);
}
function urlShape(url) {
  try {
    const u = new URL(url);
    const names = [.../* @__PURE__ */ new Set([...u.searchParams.keys()])];
    return `${u.hostname}${u.pathname}${names.length ? `?${names.join("&")}` : ""}`;
  } catch {
    return "";
  }
}
var RIFT_WAYS = [
  { token: "acToken", pc: true, label: "account token" },
  { token: "token", pc: true, label: "access token" },
  { token: "frlToken", pc: true, label: "FRL token" },
  { token: null, pc: true, label: "no token" }
];
var riftWay = RIFT_WAYS[0];
function riftFetchUrl(url, way) {
  const value = way.token ? (loadSettings()[way.token] || "").trim() : "";
  const u = value ? `${url}${url.includes("?") ? "&" : "?"}access_token=${encodeURIComponent(value)}` : url;
  return way.pc ? routePc(u) : route(u);
}
function riftPlainManifestUrl(manifestUri) {
  try {
    const u = new URL(manifestUri);
    const id = u.searchParams.get("id");
    if (!id) return null;
    const plain = `https://${u.hostname}/binaries/download/?id=${encodeURIComponent(id)}&get_manifest=1`;
    return plain === manifestUri ? null : plain;
  } catch {
    return null;
  }
}
async function riftManifestBytes(manifestUri) {
  const addresses = [["as given", manifestUri]];
  const plain = riftPlainManifestUrl(manifestUri);
  if (plain) addresses.push(["plain", plain]);
  const tried = [];
  let last = null;
  for (const [name, address] of addresses) {
    const results2 = [];
    for (const way of RIFT_WAYS) {
      if (way.token && !(loadSettings()[way.token] || "").trim()) continue;
      const res = await fetch(riftFetchUrl(address, way)).catch(() => null);
      if (res == null ? void 0 : res.ok) {
        riftWay = way;
        return new Uint8Array(await res.arrayBuffer());
      }
      results2.push(`${way.label} ${res ? res.status : "unreachable"}`);
      if (res) last = res;
    }
    tried.push(`${name} (${urlShape(address)}): ${results2.join(", ")}`);
  }
  if (!last) throw new Error("could not reach the manifest through the relay");
  const err2 = await cdnRefusal("the build's manifest", manifestUri, last);
  err2.message += ` \u2014 tried ${tried.join("; ")}`;
  throw err2;
}
function riftSegmentDirectUrl(segmentsBaseUri, sha256) {
  const sep = segmentsBaseUri.includes("?") ? "&" : "?";
  const url = `${segmentsBaseUri}${sep}segment_sha256=${encodeURIComponent(sha256)}`;
  const value = riftWay.token ? (loadSettings()[riftWay.token] || "").trim() : "";
  return value ? `${url}&access_token=${encodeURIComponent(value)}` : url;
}
function riftSegmentUrl(segmentsBaseUri, sha256) {
  const sep = segmentsBaseUri.includes("?") ? "&" : "?";
  return new URL(riftFetchUrl(`${segmentsBaseUri}${sep}segment_sha256=${encodeURIComponent(sha256)}`, riftWay), document.baseURI).href;
}
var canDownload = () => Boolean(loadSettings().acToken);
var UPDATER_APP_ID = "1556285957737177";
async function updaterToken(frl) {
  const token = (frl || loadSettings().frlToken || "").trim();
  if (!token) throw new Error("no FRL token \u2014 press Sign in with Meta in Settings first");
  const res = await fetch(route("https://graph.oculus.com/authenticate_application"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ access_token: token, app_id: UPDATER_APP_ID }).toString()
  }).catch(() => null);
  const json = res ? await res.json().catch(() => null) : null;
  if (!json) throw new Error("could not reach graph.oculus.com through the relay");
  if (json.error) throw new Error(json.error.message || "the updater-token request was refused");
  if (!json.access_token) throw new Error("no updater token came back");
  return json.access_token;
}
var OTA_DEVICE_TYPES = [
  { hmd: "MONTEREY", hwm: ["SANTA_CRUZ"], label: "Oculus Quest", type: "ota.vr.monterey.user" },
  { hmd: "HOLLYWOOD", label: "Quest 2", type: "ota.hollywood.user" },
  { hmd: "SEACLIFF", label: "Quest Pro", type: "ota.seacliff.user" },
  { hmd: "EUREKA", label: "Quest 3", type: "ota.eureka.user" },
  { hmd: "PANTHER", label: "Quest 3S", type: "ota.panther.user" },
  { hmd: "XSE_PANTHER", label: "Quest 3S Xbox Edition", type: "ota.xse.panther.user" },
  { hmd: "LOMA", label: "VR glasses", type: "ota.loma.user" },
  { hmd: "PACIFIC", label: "Oculus Go", type: "ota.pacific.user" },
  { hmd: "GEARVR", label: "Gear VR", type: "ota.gearvr.user" },
  { hmd: "RIFT", label: "Oculus Rift (PC)", type: "ota.rift.user" },
  { hmd: "LAGUNA", label: "Laguna (unreleased)", type: "ota.laguna.user" },
  { hmd: "GEMINI", label: "Gemini (unreleased)", type: "ota.gemini.user" }
];
var OTA_SELECTION = "{download_uri,target_version,base_version,extra_install_options,file_checksum,release_channel_id,release_channel_name,creation_time,release_tag,formatted_build_number,build_number_display_name,controller_fw_version,semantic_version}";
var OTA_PUBLIC_TOKEN = "OC|3733290306686872|";
function otaFields(opts = {}) {
  let ota = "ota";
  if (opts.sdkVersion) ota += `.sdk_version(${opts.sdkVersion}).security_patch_time(${opts.securityPatch || "undefined"})`;
  ota += `.show_all_paths(${opts.showAllPaths ? "true" : "false"})`;
  if (opts.requestedVersion) ota += `.requested_version(${opts.requestedVersion})`;
  if (Number(opts.delayInDays) > 0) ota += `.delay_in_days(${opts.delayInDays})`;
  if (opts.minorReleaseOnly) ota += ".minor_release_only(true)";
  return `update_interval,${ota}${opts.selection || OTA_SELECTION}${opts.extraFields ? `,${opts.extraFields}` : ""}`;
}
async function otaRequest({ host = "graph.oculus.com", path = "/firmware_ota_update", params = {}, token = "" } = {}) {
  const h = String(host).trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!/^[a-z0-9.-]+\.oculus\.com$/i.test(h)) throw new Error("the relay only forwards oculus.com hosts");
  const p = `/${String(path || "/firmware_ota_update").trim().replace(/^\/+/, "")}`;
  const t = String(token).trim();
  const frl = t === "frl" ? (loadSettings().frlToken || "").trim() : "";
  if (t === "frl" && !frl) throw new Error("no FRL token saved \u2014 press Sign in with Meta in Settings first");
  const access = t === "public" ? OTA_PUBLIC_TOKEN : frl || t || await otaToken({});
  const qs = new URLSearchParams({ access_token: access, ...params });
  const res = await fetch(route(`https://${h}${p}?${qs}`), { headers: { Accept: "application/json" } }).catch(() => null);
  if ((res == null ? void 0 : res.status) === 403 && !(res.headers.get("content-type") || "").includes("json")) {
    throw new Error(`the relay would not forward ${h}`);
  }
  const text = res ? await res.text().catch(() => "") : "";
  let json = null;
  try {
    json = JSON.parse(text.replace(/"(target_version|base_version)":\s*(-?\d{16,})/g, '"$1":"$2"'));
  } catch {
  }
  if (!json) throw Object.assign(new Error(`could not reach ${h} through the relay`), { status: res == null ? void 0 : res.status });
  if (json.error) throw Object.assign(new Error(json.error.message || "Meta refused the request"), { code: json.error.code, status: res == null ? void 0 : res.status });
  return json;
}
function otaParams(opts) {
  var _a3, _b3;
  return {
    fields: otaFields(opts),
    device_type: opts.deviceType || "",
    device_serial: opts.serial || "",
    version: String((_a3 = opts.version) != null ? _a3 : -1),
    device_managed_mode: String((_b3 = opts.managedMode) != null ? _b3 : 0),
    full_update_only: opts.fullUpdateOnly ? "true" : "false"
  };
}
async function otaToken(opts) {
  if (opts.publicToken) return OTA_PUBLIC_TOKEN;
  let token = (opts.token || loadSettings().upToken || "").trim();
  if (!token) {
    token = await updaterToken();
    saveSettings({ upToken: token });
  }
  return token;
}
function parseAppId(input) {
  const text = String(input).trim();
  if (/^\d{5,}$/.test(text)) return text;
  const m = text.match(/(\d{8,})/);
  return m ? m[1] : null;
}

// js/app.js
var DEVICE = { ANDROID_6DOF: "Quest", ANDROID_3DOF: "Go", ANDROID: "Go", PC: "Rift" };
function deviceName(platform) {
  var _a3;
  if (!platform) return null;
  return (_a3 = DEVICE[platform]) != null ? _a3 : String(platform).toLowerCase().replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}
var IN_APP = typeof window.MetaDBApp === "object" && window.MetaDBApp !== null;
var APP_CAPS = (() => {
  var _a3, _b3, _c;
  if (!IN_APP) return { features: [] };
  try {
    return JSON.parse((_c = (_b3 = (_a3 = window.MetaDBApp).capabilities) == null ? void 0 : _b3.call(_a3)) != null ? _c : '{"features":[]}');
  } catch {
    return { features: [] };
  }
})();
var appHas = (feature) => Array.isArray(APP_CAPS.features) && APP_CAPS.features.includes(feature);
if (IN_APP) document.documentElement.classList.add("in-app");
var keyOf = (app) => {
  var _a3;
  return (_a3 = app.id) != null ? _a3 : app.packageName;
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
  var _a3, _b3, _c, _d, _e, _f;
  return (_f = (_e = (_d = (_b3 = (_a3 = results.get(keyOf(app))) == null ? void 0 : _a3.latest) == null ? void 0 : _b3.releasedAt) != null ? _d : (_c = primaryOf(app)) == null ? void 0 : _c.releasedAt) != null ? _e : app.releasedAt) != null ? _f : "";
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
    var _a3;
    return (_a3 = app.lastUsed) != null ? _a3 : null;
  }, 1, (x, y) => y - x),
  unused: nullsLast((app) => {
    var _a3;
    return (_a3 = app.lastUsed) != null ? _a3 : null;
  }, -1, (x, y) => y - x),
  ...alphabetical("state", (app) => app.state ? words2(app.state) : null),
  ...alphabetical("source", (app) => app.owned ? grantLabel(app.grant) : null),
  ...alphabetical(
    "device",
    (app) => deviceName(app.platform)
  )
};
var sorted = (list, mode) => {
  var _a3;
  return [...list].sort((_a3 = SORTS[mode]) != null ? _a3 : SORTS.az);
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
  viewWatchlist: document.getElementById("view-watchlist"),
  watchRows: document.getElementById("watchRows"),
  watchEmpty: document.getElementById("watchEmpty"),
  watchCount: document.getElementById("watchCount"),
  watchCheck: document.getElementById("watchCheck"),
  watchMarkAll: document.getElementById("watchMarkAll"),
  watchAuto: document.getElementById("watchAuto"),
  watchButtons: document.getElementById("watchButtons"),
  watchNotify: document.getElementById("watchNotify"),
  notifyLinger: document.getElementById("notifyLinger"),
  notifyTest: document.getElementById("notifyTest"),
  watchThrottle: document.getElementById("watchThrottle"),
  density: document.getElementById("density"),
  watchBadge: document.getElementById("watchBadge"),
  toasts: document.getElementById("toasts"),
  setupOverlay: document.getElementById("setupOverlay"),
  setupSections: document.getElementById("setupSections"),
  setupPanels: document.getElementById("setupPanels"),
  setupData: document.getElementById("setupData"),
  setupExtras: document.getElementById("setupExtras"),
  avatarsGo: document.getElementById("avatarsGo"),
  avatarsCount: document.getElementById("avatarsCount"),
  avatarsGrid: document.getElementById("avatarsGrid"),
  setupSave: document.getElementById("setupSave"),
  setupAll: document.getElementById("setupAll"),
  openSetup: document.getElementById("openSetup"),
  viewOrgs: document.getElementById("view-orgs"),
  viewDefault: document.getElementById("view-default"),
  viewDevices: document.getElementById("view-devices"),
  viewUpdater: document.getElementById("view-updater"),
  viewNotfound: document.getElementById("view-notfound"),
  notfoundPath: document.getElementById("notfoundPath"),
  viewHome: document.getElementById("view-home"),
  homeBody: document.getElementById("homeBody"),
  viewPeople: document.getElementById("view-people"),
  peopleGo: document.getElementById("peopleGo"),
  peopleQ: document.getElementById("peopleQ"),
  peopleShow: document.getElementById("peopleShow"),
  peopleKind: document.getElementById("peopleKind"),
  peopleHead: document.getElementById("peopleHead"),
  viewExplore: document.getElementById("view-explore"),
  exploreQ: document.getElementById("exploreQ"),
  exploreGo: document.getElementById("exploreGo"),
  exploreShow: document.getElementById("exploreShow"),
  exploreCount: document.getElementById("exploreCount"),
  exploreRows: document.getElementById("exploreRows"),
  exploreEmpty: document.getElementById("exploreEmpty"),
  stickerGo: document.getElementById("stickerGo"),
  viewPhotos: document.getElementById("view-photos"),
  photoGo: document.getElementById("photoGo"),
  photoShow: document.getElementById("photoShow"),
  photoFrom: document.getElementById("photoFrom"),
  photoTo: document.getElementById("photoTo"),
  photoCount: document.getElementById("photoCount"),
  photoGrid: document.getElementById("photoGrid"),
  photoEmpty: document.getElementById("photoEmpty"),
  photoMoreBar: document.getElementById("photoMoreBar"),
  photoMore: document.getElementById("photoMore"),
  creditGo: document.getElementById("creditGo"),
  creditCount: document.getElementById("creditCount"),
  creditRows: document.getElementById("creditRows"),
  creditTable: document.getElementById("creditTable"),
  creditEmpty: document.getElementById("creditEmpty"),
  stickerCount: document.getElementById("stickerCount"),
  stickerGrid: document.getElementById("stickerGrid"),
  peopleCount: document.getElementById("peopleCount"),
  peopleRows: document.getElementById("peopleRows"),
  peopleEmpty: document.getElementById("peopleEmpty"),
  updaterLoad: document.getElementById("updaterLoad"),
  updaterSerials: document.getElementById("updaterSerials"),
  updaterMode: document.getElementById("updaterMode"),
  updaterView: document.getElementById("view-updater"),
  updaterCount: document.getElementById("updaterCount"),
  updaterBody: document.getElementById("updaterBody"),
  updTypes: document.getElementById("updTypes"),
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
  plusOthers: document.getElementById("plusOthers"),
  plusOtherRows: document.getElementById("plusOtherRows"),
  plusSort: document.getElementById("plusSort"),
  plusRows: document.getElementById("plusRows"),
  plusCount: document.getElementById("plusCount"),
  plusEmpty: document.getElementById("plusEmpty"),
  viewWishlist: document.getElementById("view-wishlist"),
  wishGo: document.getElementById("wishGo"),
  wishQ: document.getElementById("wishQ"),
  wishSort: document.getElementById("wishSort"),
  checkWish: document.getElementById("checkWish"),
  wishRows: document.getElementById("wishRows"),
  wishCount: document.getElementById("wishCount"),
  wishEmpty: document.getElementById("wishEmpty"),
  wishMoreBar: document.getElementById("wishMoreBar"),
  wishMore: document.getElementById("wishMore"),
  viewStore: document.getElementById("view-store"),
  storeHmd: document.getElementById("storeHmd"),
  storeView: document.getElementById("storeView"),
  storeGo: document.getElementById("storeGo"),
  storeSection: document.getElementById("storeSection"),
  storeQ: document.getElementById("storeQ"),
  storeSort: document.getElementById("storeSort"),
  checkStore: document.getElementById("checkStore"),
  storeRows: document.getElementById("storeRows"),
  storeCount: document.getElementById("storeCount"),
  storeEmpty: document.getElementById("storeEmpty"),
  storeMoreBar: document.getElementById("storeMoreBar"),
  storeMore: document.getElementById("storeMore"),
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
  frlToken: document.getElementById("frlToken"),
  frlSnippet: document.getElementById("frlSnippet"),
  copyFrlSnippet: document.getElementById("copyFrlSnippet"),
  frlSnippetOut: document.getElementById("frlSnippetOut"),
  updToken: document.getElementById("updToken"),
  getUpdToken: document.getElementById("getUpdToken"),
  updTokenOut: document.getElementById("updTokenOut"),
  saveTokens: document.getElementById("saveTokens"),
  tokensOut: document.getElementById("tokensOut"),
  relay: document.getElementById("relay"),
  testBtn: document.getElementById("testBtn"),
  clearBtn: document.getElementById("clearBtn"),
  exportTokens: document.getElementById("exportTokens"),
  importTokens: document.getElementById("importTokens"),
  importTokensFile: document.getElementById("importTokensFile"),
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
  defView: document.getElementById("defView"),
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
  viewCredit: document.getElementById("view-credit"),
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
var WATCH_KEY = "metadb.watchlist";
var WATCH_LAST_KEY = "metadb.watchLast";
var RECENT_KEY = "metadb.recentApps";
var RECENT_MAX = 12;
var REPOS_KEY = "metadb.githubRepos";
var iconTried = /* @__PURE__ */ new Set();
var iconCache = /* @__PURE__ */ new Map();
var homeAccount = { token: null, loading: false };
var homeShown = /* @__PURE__ */ new Set();
var WATCH_THROTTLE = 15 * 60 * 1e3;
var results = /* @__PURE__ */ new Map();
var listings = /* @__PURE__ */ new Map();
var media = /* @__PURE__ */ new Map();
var obbs = /* @__PURE__ */ new Map();
var reviewCache = /* @__PURE__ */ new Map();
var addonsCache = /* @__PURE__ */ new Map();
var achCache = /* @__PURE__ */ new Map();
var lbCache = /* @__PURE__ */ new Map();
var postsCache = /* @__PURE__ */ new Map();
var relNotesCache = /* @__PURE__ */ new Map();
var obbChecked = /* @__PURE__ */ new Set();
var obbNote = "";
var open = /* @__PURE__ */ new Set();
var peopleState = { lists: {}, counts: null, loading: false };
var peopleOpen = /* @__PURE__ */ new Set();
var personInfo = /* @__PURE__ */ new Map();
var exploreState = { query: "", result: null, loading: false, note: "" };
var mediaOpen = /* @__PURE__ */ new Set();
var mediaInfo = /* @__PURE__ */ new Map();
var revOpen = /* @__PURE__ */ new Set();
var revInfo = /* @__PURE__ */ new Map();
var EXPLORE_KINDS = [
  ["apps", "App"],
  ["movies", "Movie"],
  ["series", "TV series"],
  ["sports", "Sports event"],
  ["xbox", "Xbox cloud game"],
  ["people", "Person"],
  ["events", "Event"],
  ["websites", "Website"]
];
var photoState = { items: [], cursor: null, loading: false, asked: false, note: "" };
var traitInfo = /* @__PURE__ */ new Map();
var PEOPLE_KINDS = {
  follows: { load: () => peopleList(), what: "who you follow and who follows you", none: "You don't follow anyone yet, and nobody follows you." },
  requests: { load: () => peopleRequests(), what: "who has asked to follow you", none: "No one has asked to follow you." },
  met: { load: () => peopleRecentlyMet(), what: "the people you recently met in a world or app", none: "You haven't met anyone recently." },
  suggested: { load: () => peopleSuggested(), what: "people you may know", none: "The store has no suggestions for you right now." },
  nearby: {
    load: () => peopleNearby(),
    what: "who is in your lobby now",
    none: "No one else is in your lobby. This list fills while you are in a lobby on the headset."
  },
  chats: { load: () => peopleChats(), what: "your chats", none: "You have no chats." }
};
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
var devicesOpen = /* @__PURE__ */ new Set();
var devicesPanelTab = /* @__PURE__ */ new Map();
var updResults = /* @__PURE__ */ new Map();
var updFind = {
  running: false,
  stop: false,
  error: "",
  note: "",
  lastError: "",
  tried: 0,
  total: 0,
  skipped: 0,
  errors: 0,
  found: [],
  done: /* @__PURE__ */ new Set(),
  current: ""
};
var defaultList = [];
var defaultLoading = false;
var defaultAsked = false;
var defaultNote = "";
var plusState = { rows: [], others: [], sections: [], asked: false, loading: false, note: "" };
var storeState = {
  front: null,
  charts: [],
  hmd: null,
  section: null,
  rows: [],
  cursor: null,
  asked: false,
  loading: false,
  note: ""
};
var wishState = { rows: [], cursor: null, asked: false, loading: false, note: "" };
var presenceState = { data: null, note: "" };
var adb = null;
var adbInstalled = [];
var adbApps = [];
var adbSide = [];
var headsetAsked = false;
var packageAnswers = /* @__PURE__ */ new Map();
var staleTables = /* @__PURE__ */ new Set();
var renderTimer = 0;
var searchSeq = 0;
var dialogPending = null;
var dialogReturnFocus = null;
var APP_APK = new URL("downloads/MetaDB.apk", document.baseURI).href;
var APP_INFO = new URL("downloads/MetaDB.json", document.baseURI).href;
var appInfoAsked = false;
var appUpdate = null;
var appUpdateNoticed = false;
var STORE_ART_KEY = "metadb.storeArt";
var storeArt = (() => {
  var _a3;
  try {
    return new Map(Object.entries((_a3 = JSON.parse(localStorage.getItem(STORE_ART_KEY))) != null ? _a3 : {}));
  } catch {
    return /* @__PURE__ */ new Map();
  }
})();
var storeArtAsking = false;
var restoringRoute = false;
var PANEL_TABS = ["store", "builds", "reviews", "posts", "addons", "achievements", "leaderboards", "cloud", "mine"];
var VIEWS = [
  "home",
  "apps",
  "search",
  "mine",
  "purchases",
  "credit",
  "wishlist",
  "people",
  "photos",
  "explore",
  "watchlist",
  "avatar",
  "devices",
  "updater",
  "worlds",
  "orgs",
  "default",
  "plus",
  "store",
  "adb",
  "companion",
  "settings",
  "getapp",
  "downgrade"
];
var WIP_VIEWS = ["companion"];
var SCREEN_GROUPS = [
  { name: "Store", views: [["store", "Store front"], ["plus", "Horizon+"]] },
  { name: "Headsets", views: [["devices", "Your headsets"], ["updater", "Updater"]] },
  { name: "Library", views: [["mine", "Entitlements"], ["purchases", "Purchases"], ["credit", "Store credit"], ["wishlist", "Wishlist"]] }
];
var routeSearch = "";
var routeView = () => {
  var _a3;
  const v = (_a3 = routeParts()[0]) != null ? _a3 : "";
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
var ownedAcross = /* @__PURE__ */ new Map();
var ownedLoading = /* @__PURE__ */ new Set();
var mineKind = "quest";
var myChannels = /* @__PURE__ */ new Map();
var playState = { rows: [], asked: false, loading: false, note: "", promise: null };
var backupState = { rows: [], asked: false, loading: false, note: "", promise: null };
var backupRulesCache = /* @__PURE__ */ new Map();
var backupDetailCache = /* @__PURE__ */ new Map();
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
var libraryToken = null;
var libraryError = "";
var stagedApp = null;
var stagedScope = null;
var listing = [];
var listingNote = "";
var listingError = "";
var searching = false;
var tour = null;
initTheme();
initFontSize();
initMotion();
applyDensity();
initStage();
initNav();
initSearchBar();
initViews();
initSettings();
initOrgs();
var _a2, _b2;
(_b2 = (_a2 = el.viewApps) == null ? void 0 : _a2.querySelector(".controls")) == null ? void 0 : _b2.append(el.limitbar);
initPeople();
initExplore();
initBackupReader();
initPhotos();
initCredit();
initRevisions();
initDevices();
initUpdater();
initPurchases();
initAvatar();
initAccountTabs();
initDefault();
initPlus();
initStore();
initWishlist();
initWatch();
initSetup();
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
  var _a3, _b3;
  const link = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
  return (_b3 = (_a3 = link == null ? void 0 : link.getAttribute("href").match(/[?&]v=(\d+)/)) == null ? void 0 : _a3[1]) != null ? _b3 : null;
}
async function publishedBuild() {
  var _a3, _b3;
  const res = await fetch(document.baseURI, { cache: "no-store" });
  if (!res.ok) return null;
  return (_b3 = (_a3 = (await res.text()).match(/style\.css\?v=(\d+)/)) == null ? void 0 : _a3[1]) != null ? _b3 : null;
}
function safeToReload() {
  var _a3;
  if (appInstalls.size) return false;
  if (document.hidden) return true;
  if (stagedApp) return false;
  const tag = (_a3 = document.activeElement) == null ? void 0 : _a3.tagName;
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
  var _a3;
  const pickers = [el.theme, el.dgTheme].filter(Boolean);
  for (const p of pickers) fillOptions(p, THEMES);
  let saved = "";
  try {
    saved = (_a3 = localStorage.getItem("theme")) != null ? _a3 : "";
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
function applyDensity() {
  document.documentElement.classList.toggle("density-compact", loadSettings().density === "compact");
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
var stageEl = () => document.querySelector(".stage:not(.leaving)");
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
  stage == null ? void 0 : stage.classList.add("leaving");
  const done = () => {
    stage == null ? void 0 : stage.remove();
    releaseScrollLock();
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
var galleryEl = () => document.querySelector(".gallery:not(.leaving)");
function releaseScrollLock() {
  if (!stagedApp && !stageEl() && !galleryEl()) document.documentElement.classList.remove("staged");
}
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
      var _a3, _b3;
      const img = (_b3 = (_a3 = e.target).closest) == null ? void 0 : _b3.call(_a3, ".shot img");
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
  gallery.classList.add("leaving");
  const done = () => {
    gallery.remove();
    releaseScrollLock();
  };
  if (!animate || !animates()) return done();
  play(gallery, "stage-out", { keep: true });
  setTimeout(done, speed());
}
async function showImages(app, button, out) {
  var _a3;
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
      if (((_a3 = app.media) == null ? void 0 : _a3.length) || tiles.length) show([], tiles);
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
    var _a3;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || a.target || a.hasAttribute("download")) return;
    const href = a.getAttribute("href");
    const screen = (_a3 = href.match(/^[#/]([a-z]+)$/)) == null ? void 0 : _a3[1];
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
  const def = loadSettings().defaultView;
  if (!IN_APP && routeParts().length === 0 && def && def !== "apps" && VIEWS.includes(def) && !WIP_VIEWS.includes(def)) {
    history.replaceState(null, "", "/" + def);
  }
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
function routeKnown() {
  const [view = "", a = null, b = null, ...more] = routeParts();
  if (more.length) return false;
  if (view === "") return true;
  if (WIP_VIEWS.includes(view)) return false;
  if (view === "search") return b === null;
  if (view === "apps") return (a === null || /^\d{5,}$/.test(a)) && (b === null || PANEL_TABS.includes(b));
  if (view === "worlds" || view === "orgs") return b === null;
  return VIEWS.includes(view) && a === null;
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
  var _a3;
  const e = encodeURIComponent;
  if (s.view === "apps") {
    if (/^\d{5,}$/.test((_a3 = s.app) != null ? _a3 : "")) {
      return `/apps/${e(s.app)}${PANEL_TABS.includes(s.tab) && s.tab !== "store" ? `/${e(s.tab)}` : ""}`;
    }
    return s.q ? `/search/${e(s.q)}` : "/apps";
  }
  if (s.view === "worlds" && s.world) return `/worlds/${e(s.world)}`;
  if (s.view === "orgs" && s.org) return `/orgs/${e(s.org)}`;
  return `/${s.view}`;
}
function setRoute(changes) {
  var _a3;
  if ("q" in changes) routeSearch = (_a3 = changes.q) != null ? _a3 : "";
  const s = { ...routeState(), ...changes };
  if (s.view === "apps" && !s.app && !s.q) s.q = routeSearch;
  const next = pathFor(s);
  if (next === "/apps" && !routeParts().length) return;
  if (next !== location.pathname) history.replaceState(history.state, "", next + location.search);
}
async function restoreRoute() {
  var _a3, _b3, _c, _d;
  const s = routeState();
  if (s.view === "apps") {
    const q = ((_a3 = s.q) != null ? _a3 : "").trim() || s.app;
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
      const bar = (_c = (_b3 = document.querySelector(".topbar")) == null ? void 0 : _b3.getBoundingClientRect().height) != null ? _c : 0;
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
function firstEnabledSection(off) {
  var _a3;
  const order = ["apps", "store", "plus", "default", "worlds", "orgs", "explore", "watchlist", "devices", "updater", "mine", "purchases", "credit", "wishlist", "people", "photos", "avatar", "adb"];
  return (_a3 = order.find((v) => !off.includes(v))) != null ? _a3 : "settings";
}
function navLabel(a) {
  const copy = a.cloneNode(true);
  for (const badge of copy.querySelectorAll(".navbadge")) badge.remove();
  return copy.textContent.replace(/\s+/g, " ").trim();
}
function navViews(a) {
  return (a.dataset.views || a.dataset.view).split(" ");
}
function screenList() {
  const out = [];
  for (const a of el.navLinks) {
    const v = a.dataset.view;
    if (v === "settings" || v === "getapp") continue;
    const group = a.dataset.views && SCREEN_GROUPS.find((g) => g.views.some(([x]) => x === v));
    if (group) out.push(...group.views.map(([x, label]) => [x, `${group.name} \u2014 ${label}`]));
    else out.push([v, navLabel(a)]);
  }
  return out;
}
function syncScreenTabs(off) {
  var _a3;
  for (const g of SCREEN_GROUPS) {
    const on = g.views.filter(([v]) => !off.has(v));
    for (const [v] of g.views) {
      const section = document.getElementById(`view-${v}`);
      if (!section) continue;
      let strip = section.querySelector(":scope > .screen-tabs");
      if (!strip) {
        strip = document.createElement("nav");
        strip.className = "companion-tabs panel-tabs screen-tabs";
        strip.setAttribute("aria-label", g.name);
        (_a3 = section.querySelector(":scope > h2")) == null ? void 0 : _a3.after(strip);
      }
      strip.innerHTML = on.map(
        ([x, label]) => `<a class="companion-tab${x === v ? " on" : ""}" href="/${x}"${x === v ? ` aria-current="page"` : ""}>${esc(label)}</a>`
      ).join("");
      strip.hidden = on.length < 2;
    }
  }
}
function applyFeatureVisibility() {
  const off = new Set(loadSettings().sectionsOff);
  for (const a of el.navLinks) {
    const v = a.dataset.view;
    if (v === "settings" || v === "getapp") continue;
    const first = navViews(a).find((x) => !off.has(x));
    a.hidden = !first;
    if (a.dataset.views && first) a.setAttribute("href", `/${first}`);
  }
  syncScreenTabs(off);
  for (const g of el.navGroups) {
    const links = [...g.querySelectorAll("a[data-view]")];
    g.hidden = links.length > 0 && links.every((a) => a.hidden);
  }
}
function applyView() {
  var _a3;
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
  const views = ["home", "mine", "purchases", "credit", "wishlist", "people", "photos", "explore", "watchlist", "avatar", "devices", "updater", "worlds", "orgs", "default", "plus", "store", "adb", "companion", "settings", "getapp"];
  let view = views.includes(hash) && !(IN_APP && (hash === "adb" || hash === "companion")) ? hash : "apps";
  if (!routeKnown()) view = "notfound";
  const sectionsOff = loadSettings().sectionsOff;
  if (view !== "settings" && view !== "getapp" && view !== "notfound" && sectionsOff.includes(view)) {
    view = firstEnabledSection(sectionsOff);
  }
  el.viewApps.hidden = view !== "apps";
  el.viewMine.hidden = view !== "mine";
  el.viewPurchases.hidden = view !== "purchases";
  el.viewCredit.hidden = view !== "credit";
  el.viewWishlist.hidden = view !== "wishlist";
  el.viewPeople.hidden = view !== "people";
  if (view === "people") renderPeople();
  el.viewExplore.hidden = view !== "explore";
  el.viewPhotos.hidden = view !== "photos";
  if (view === "photos") renderPhotos();
  if (view === "explore") renderExplore();
  el.viewWatchlist.hidden = view !== "watchlist";
  el.viewAvatar.hidden = view !== "avatar";
  el.viewDevices.hidden = view !== "devices";
  el.viewUpdater.hidden = view !== "updater";
  el.viewNotfound.hidden = view !== "notfound";
  if (view === "notfound") el.notfoundPath.textContent = `/${routeParts().join("/")}`;
  el.viewHome.hidden = view !== "home";
  if (view === "home") renderHome();
  if (view === "updater") setTimeout(renderUpdater, 0);
  el.viewWorlds.hidden = view !== "worlds";
  el.viewOrgs.hidden = view !== "orgs";
  el.viewDefault.hidden = view !== "default";
  el.viewPlus.hidden = view !== "plus";
  el.viewStore.hidden = view !== "store";
  el.viewHeadset.hidden = view !== "adb";
  el.viewCompanion.hidden = view !== "companion";
  el.viewSettings.hidden = view !== "settings";
  el.viewGetapp.hidden = view !== "getapp";
  if (view === "getapp") showAppInfo();
  if (view === "watchlist") renderWatch();
  if (view === "companion") {
    import("./companion.js?v=268").then((m) => m.initCompanion(el.viewCompanion)).catch((e) => {
      var _a4;
      console.error("companion init failed", e);
      if (!navigator.bluetooth) (_a4 = el.viewCompanion.querySelector("#companionUnsupported")) == null ? void 0 : _a4.removeAttribute("hidden");
    });
  }
  el.limitbar.hidden = view !== "apps";
  if ([...staleTables].some((t) => !onHiddenScreen(t))) renderAll();
  applyFeatureVisibility();
  for (const a of el.navLinks) a.classList.toggle("on", navViews(a).includes(view));
  for (const g of el.navGroups) {
    g.querySelector(".navtop").classList.toggle("on", !!g.querySelector("a.on"));
  }
  window.scrollTo(0, 0);
  const tabStrip = (_a3 = document.getElementById(`view-${view}`)) == null ? void 0 : _a3.querySelector(":scope > .screen-tabs");
  const openTab = tabStrip == null ? void 0 : tabStrip.querySelector(".on");
  if (openTab && tabStrip.scrollWidth > tabStrip.clientWidth) {
    tabStrip.scrollLeft = 0;
    const over = openTab.getBoundingClientRect().right - tabStrip.getBoundingClientRect().right + 48;
    if (over > 0) tabStrip.scrollLeft = over;
  }
  play(
    [el.viewHome, el.viewApps, el.viewMine, el.viewPurchases, el.viewCredit, el.viewWishlist, el.viewPeople, el.viewPhotos, el.viewExplore, el.viewWatchlist, el.viewAvatar, el.viewDevices, el.viewUpdater, el.viewNotfound, el.viewWorlds, el.viewOrgs, el.viewDefault, el.viewPlus, el.viewStore, el.viewHeadset, el.viewCompanion, el.viewSettings].find(
      (s) => !s.hidden
    ),
    "view-in"
  );
  if (view === "apps") maybeTour();
  else endTour();
}
var orgList = [];
var orgCache = /* @__PURE__ */ new Map();
var ORG_CACHE_MS = 10 * 60 * 1e3;
var orgDrawn = -1;
var orgSkipRebuildOnce = false;
var orgRenderTimer = 0;
var orgQueue = [];
var orgGen = 0;
var orgPumping = false;
var orgAfterDrain = null;
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
  const hit = orgCache.get(id);
  if (hit && Date.now() - hit.at < ORG_CACHE_MS) {
    orgAsked = true;
    orgNote = "";
    orgList = hit.list;
    setRoute({ org: id });
    renderAll();
    return;
  }
  orgAsked = true;
  orgLoading = true;
  orgNote = "";
  orgList = [];
  el.orgGo.disabled = true;
  el.orgGo.textContent = "Loading\u2026";
  renderAll();
  const appendable = () => orgDrawn >= 0 && !el.orgQ.value.trim() && !el.orgPlatform.value && el.orgSort.value === "az" && !onHiddenScreen(el.orgRows);
  try {
    orgList = await orgApps(id, {
      onPage: (list, more) => {
        orgList = list;
        if (more) el.orgGo.textContent = `Loading\u2026 ${list.length}`;
        if (appendable() && orgDrawn <= list.length) {
          orgQueue.push(...list.slice(orgDrawn));
          orgDrawn = list.length;
          el.orgEmpty.hidden = list.length > 0;
          if (more) el.orgCount.textContent = `${list.length} apps so far \u2014 asking for more\u2026`;
          pumpOrgRows();
        } else if (!orgRenderTimer) {
          orgRenderTimer = setTimeout(() => {
            orgRenderTimer = 0;
            renderOrgSection();
          }, 250);
        }
      }
    });
    orgCache.set(id, { list: orgList, at: Date.now() });
    setRoute({ org: id });
  } catch (err2) {
    orgList = [];
    orgNote = err2.message || "Could not load the organization's apps.";
  } finally {
    clearTimeout(orgRenderTimer);
    orgRenderTimer = 0;
    orgLoading = false;
    el.orgGo.disabled = false;
    el.orgGo.textContent = "List apps";
    const finish = () => {
      const want = orgVisible().map(keyOf).join("\n");
      const have = [...el.orgRows.querySelectorAll(":scope > tr")].map((tr) => tr.dataset.id).join("\n");
      orgSkipRebuildOnce = orgDrawn >= 0 && want === have;
      renderAll();
    };
    if (orgPumping || orgQueue.length) orgAfterDrain = finish;
    else finish();
  }
}
function initPeople() {
  var _a3, _b3, _c, _d, _e, _f;
  (_a3 = el.peopleGo) == null ? void 0 : _a3.addEventListener("click", loadPeople);
  (_b3 = el.peopleQ) == null ? void 0 : _b3.addEventListener("input", renderPeople);
  (_c = el.peopleShow) == null ? void 0 : _c.addEventListener("change", renderPeople);
  (_d = el.peopleKind) == null ? void 0 : _d.addEventListener("change", renderPeople);
  (_e = el.peopleRows) == null ? void 0 : _e.addEventListener("click", (e) => {
    const get = e.target.closest("button[data-person-load]");
    if (get) return loadPerson(get.dataset.personLoad);
    if (e.target.closest("tr.detail")) return;
    const row = e.target.closest("tr[data-person]");
    if (row) togglePerson(row.dataset.person);
  });
  (_f = el.peopleRows) == null ? void 0 : _f.addEventListener("keydown", (e) => {
    var _a4, _b4;
    const row = (_b4 = (_a4 = e.target).closest) == null ? void 0 : _b4.call(_a4, "tr[data-person]");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      togglePerson(row.dataset.person);
    }
  });
}
function togglePerson(id) {
  var _a3;
  if (peopleOpen.has(id)) peopleOpen.delete(id);
  else peopleOpen.add(id);
  renderPeople();
  (_a3 = el.peopleRows.querySelector(`tr[data-person="${CSS.escape(id)}"]`)) == null ? void 0 : _a3.focus();
}
async function loadPerson(id) {
  var _a3;
  if ((_a3 = personInfo.get(id)) == null ? void 0 : _a3.loading) return;
  personInfo.set(id, { loading: true });
  renderPeople();
  try {
    personInfo.set(id, { data: await personDetails(id) });
  } catch (err2) {
    personInfo.set(id, { note: err2.message || "Could not load this profile." });
  }
  renderPeople();
}
function personDetail(p) {
  var _a3;
  const info = personInfo.get(p.id);
  let body;
  if (!info) body = `<button type="button" data-person-load="${esc(p.id)}">Get profile</button>`;
  else if (info.loading) body = `<button type="button" disabled>Loading\u2026</button>`;
  else if (info.note) body = `<p class="warn">${esc(info.note)}</p>`;
  else {
    const d = info.data;
    const yn = (v) => v == null ? null : v ? "Yes" : "No";
    body = `${factGroups([
      [
        "Profile",
        [
          ["Account ID", p.id],
          ["Username", d.alias ? `@${d.alias}` : null],
          ["Followers", d.followers == null ? null : bigNumber(d.followers)],
          ["Following", d.following == null ? null : bigNumber(d.following)],
          ["Instagram", ((_a3 = d.instagram) == null ? void 0 : _a3.length) ? d.instagram.map((x) => `@${x}`).join(", ") : null],
          ["Profile", d.privateProfile == null ? null : d.privateProfile ? "Private" : "Public"],
          ["Facebook name", d.facebookName],
          ["Doing now", d.presence],
          ["Can call in VR", d.canCall ? words2(d.canCall) : null],
          ["Joinable now", yn(d.joinable)],
          ["Unread messages", yn(d.unread)]
        ]
      ]
    ])}${d.bio ? `<h3>Bio</h3><p>${esc(d.bio).replace(/\n/g, "<br>")}</p>` : ""}`;
  }
  return `<tr class="detail"><td colspan="4"><div class="panel">${body}</div></td></tr>`;
}
async function loadPeople() {
  var _a3, _b3, _c, _d;
  if (peopleState.loading) return;
  const kind = ((_a3 = el.peopleKind) == null ? void 0 : _a3.value) || "follows";
  peopleState.loading = true;
  el.peopleGo.disabled = el.peopleKind.disabled = true;
  el.peopleGo.textContent = "Loading\u2026";
  renderPeople();
  const [list, counts] = await Promise.allSettled([
    PEOPLE_KINDS[kind].load(),
    peopleState.counts ? Promise.resolve(peopleState.counts) : peopleCounts()
  ]);
  peopleState.lists[kind] = list.status === "fulfilled" ? { rows: (_c = (_b3 = list.value.people) != null ? _b3 : list.value.chats) != null ? _c : [], more: Boolean(list.value.more), note: "" } : { rows: [], more: false, note: ((_d = list.reason) == null ? void 0 : _d.message) || `Could not load ${PEOPLE_KINDS[kind].what}.` };
  if (counts.status === "fulfilled") peopleState.counts = counts.value;
  peopleState.loading = false;
  el.peopleGo.disabled = el.peopleKind.disabled = false;
  el.peopleGo.textContent = "Get people";
  renderPeople();
}
function renderPeople() {
  var _a3, _b3;
  if (!el.peopleRows) return;
  const kind = ((_a3 = el.peopleKind) == null ? void 0 : _a3.value) || "follows";
  const isChats = kind === "chats";
  const relation = (f) => f === "FOLLOWS_EACH_OTHER" ? "mutual" : f === "PROFILE_REQUESTED_FOLLOW" ? "requested" : f === "PROFILE_FOLLOWS_VIEWER" || /FOLLOWED_BY|FOLLOWER$/.test(f || "") ? "followers" : f === "VIEWER_FOLLOWS_PROFILE" || /FOLLOWING|FOLLOWS$/.test(f || "") ? "following" : f === "NO_FOLLOW" ? "none" : "";
  const relationText = (f) => ({
    mutual: "Each other",
    followers: "Follows you",
    following: kind === "follows" ? "Doesn't follow you back" : "You follow them",
    requested: "Wants to follow you",
    none: "Neither follows"
  })[relation(f)] || (f ? String(f).toLowerCase().replace(/_/g, " ").replace(/^./, (c2) => c2.toUpperCase()) : "\u2014");
  el.peopleHead.innerHTML = (isChats ? ["Chat", "Status", "Last message", "Kind"] : ["Person", "Status", "Follow", "Can message"]).map((h) => `<th scope="col">${h}</th>`).join("");
  for (const o of el.peopleShow.options) o.hidden = isChats && (o.value === "mutual" || o.value === "following");
  if (isChats && ["mutual", "following"].includes(el.peopleShow.value)) el.peopleShow.value = "all";
  const state = peopleState.lists[kind];
  const all = (_b3 = state == null ? void 0 : state.rows) != null ? _b3 : [];
  const q = el.peopleQ.value.trim().toLowerCase();
  const show = el.peopleShow.value;
  const named = (p) => p.name.toLowerCase().includes(q) || (p.alias || "").toLowerCase().includes(q);
  const live = (p) => isChats ? p.active || p.members.some((m) => m.online) : p.online;
  const shown = all.filter((p) => {
    var _a4;
    return !q || named(p) || ((_a4 = p.members) != null ? _a4 : []).some(named);
  }).filter((p) => {
    if (show === "online") return live(p);
    if (isChats) return true;
    const r = relation(p.follow);
    if (show === "mutual") return r === "mutual";
    if (show === "following") return r === "following";
    return true;
  });
  if (kind !== "met" && kind !== "suggested" && !isChats)
    shown.sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name));
  const showArt = loadSettings().images;
  const pic = (photo) => showArt && photo ? `<img class="art" src="${esc(photo)}" alt="" loading="lazy">` : showArt ? `<span class="art art-fill" aria-hidden="true"></span>` : "";
  el.peopleRows.innerHTML = shown.map((p) => {
    if (isChats) {
      const on = p.members.filter((m) => m.online).length;
      const now = p.active ? "Someone's in it now" : on ? `${on} online` : "";
      return `<tr>
          <td class="name">${pic(p.photo)}<strong>${esc(p.name)}</strong>${p.oneToOne ? "" : ` <span class="ppl-alias">${p.members.length ? `${p.members.length + 1} people` : "just you"}</span>`}</td>
          <td>${p.unread ? `<span class="ppl-on">Unread</span>` : `<span class="ppl-off">Read</span>`}${now ? `<div class="ppl-pres">${esc(now)}</div>` : ""}</td>
          <td>${p.snippet ? esc(p.snippet) : "\u2014"}</td>
          <td>${p.oneToOne ? "One to one" : "Group"}</td>
        </tr>`;
    }
    const met = [p.met, p.metAt ? `Last met ${agoText(p.metAt)}` : null].filter(Boolean).join(" \xB7 ");
    const lines = [p.presence && !/^online( now)?$/i.test(p.presence) ? p.presence : null, met || null, p.context].filter(Boolean).map((t) => `<div class="ppl-pres">${esc(t)}</div>`).join("");
    const open2 = peopleOpen.has(p.id);
    return `<tr class="app" tabindex="0" data-person="${esc(p.id)}" aria-expanded="${open2}">
        <td class="name">${pic(p.photo)}<strong>${esc(p.name)}</strong>${p.alias && p.alias !== p.name ? ` <span class="ppl-alias">@${esc(p.alias)}</span>` : ""}</td>
        <td>${p.online ? `<span class="ppl-on">Online</span>` : `<span class="ppl-off">Offline</span>`}${lines}</td>
        <td>${esc(relationText(p.follow))}</td>
        <td>${p.canMessage ? "Yes" : "No"}</td>
      </tr>${open2 ? personDetail(p) : ""}`;
  }).join("");
  const c = peopleState.counts;
  const plural2 = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const totals = c && kind === "follows" ? [
    c.followers != null ? plural2(c.followers, "follower") : null,
    c.following != null ? `${c.following} following` : null,
    c.requests ? plural2(c.requests, "follow request") : null,
    c.recentlyMet ? `${c.recentlyMet} recently met` : null
  ].filter(Boolean).join(" \xB7 ") : isChats ? plural2(all.length, "chat") : `${all.length} ${all.length === 1 ? "person" : "people"}`;
  const tally = isChats ? `${all.filter((p) => p.unread).length} unread` : `${all.filter(live).length} online`;
  el.peopleCount.textContent = peopleState.loading ? "Asking the store\u2026" : !state || state.note || !all.length && kind !== "follows" ? "" : `${totals}${state.more && kind !== "follows" ? ", more on the headset" : ""} \u2014 ${tally}${shown.length !== all.length ? `, showing ${shown.length} of ${all.length}` : ""}.`;
  el.peopleEmpty.hidden = shown.length > 0 || peopleState.loading;
  el.peopleEmpty.textContent = (state == null ? void 0 : state.note) ? state.note : !state ? `Press Get people to list ${PEOPLE_KINDS[kind].what}.` : all.length ? "Nobody matches." : PEOPLE_KINDS[kind].none;
  el.peopleEmpty.classList.toggle("warn", Boolean(state == null ? void 0 : state.note));
}
function initExplore() {
  var _a3, _b3, _c, _d, _e;
  (_a3 = el.exploreGo) == null ? void 0 : _a3.addEventListener("click", runExplore);
  (_b3 = el.exploreQ) == null ? void 0 : _b3.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runExplore();
    }
  });
  (_c = el.exploreShow) == null ? void 0 : _c.addEventListener("change", renderExplore);
  const open2 = (row) => {
    if (row.dataset.app) openAppById(row.dataset.app);
    else if (row.dataset.link) window.open(row.dataset.link, "_blank", "noopener");
  };
  (_d = el.exploreRows) == null ? void 0 : _d.addEventListener("click", (e) => {
    if (e.target.closest("tr.detail")) return;
    const media2 = e.target.closest("tr[data-media]");
    if (media2) return toggleMedia(media2.dataset.media);
    const row = e.target.closest("tr[data-app], tr[data-link]");
    if (row) open2(row);
  });
  (_e = el.exploreRows) == null ? void 0 : _e.addEventListener("keydown", (e) => {
    var _a4, _b4;
    const row = (_b4 = (_a4 = e.target).closest) == null ? void 0 : _b4.call(_a4, "tr[data-app], tr[data-link], tr[data-media]");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      if (row.dataset.media) toggleMedia(row.dataset.media);
      else open2(row);
    }
  });
}
async function runExplore() {
  const text = el.exploreQ.value.trim();
  if (exploreState.loading) return;
  Object.assign(exploreState, { query: text, loading: true, note: "" });
  el.exploreGo.disabled = true;
  el.exploreGo.textContent = "Searching\u2026";
  renderExplore();
  try {
    exploreState.result = await globalSearch(text);
  } catch (err2) {
    exploreState.result = null;
    exploreState.note = err2.message || "The search failed.";
  }
  exploreState.loading = false;
  el.exploreGo.disabled = false;
  el.exploreGo.textContent = "Search";
  renderExplore();
}
function renderExplore() {
  if (!el.exploreRows) return;
  const r = exploreState.result;
  const show = el.exploreShow.value;
  const art = loadSettings().images;
  const when = (sec) => new Date(sec * 1e3).toLocaleString(void 0, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const details = (kind, x) => {
    switch (kind) {
      case "apps":
        return [x.packageName, x.lastOpened ? `opened ${agoText(x.lastOpened)}` : null].filter(Boolean).join(" \xB7 ");
      case "movies":
        return [x.year, x.genre, x.runtime ? `${Math.round(x.runtime / 60)} min` : null].filter(Boolean).join(" \xB7 ");
      case "series":
        return [x.year, x.genre, x.seasons ? `${x.seasons} season${x.seasons === 1 ? "" : "s"}` : null].filter(Boolean).join(" \xB7 ");
      case "sports":
        return [x.live ? "Live now" : x.start ? when(x.start) : null, x.app ? `on ${x.app}` : null].filter(Boolean).join(" \xB7 ");
      case "xbox":
        return x.link ? "Play in the browser \u2192" : null;
      case "people":
        return [x.alias ? `@${x.alias}` : null, x.presence].filter(Boolean).join(" \xB7 ");
      case "events":
        return x.start ? when(x.start) : null;
      case "websites":
        return x.link ? x.link.replace(/^https?:\/\//, "").replace(/\/$/, "") : null;
    }
    return null;
  };
  const rows = r ? EXPLORE_KINDS.filter(([k]) => show === "all" || show === k).flatMap(([k, label]) => r[k].map((x) => ({ k, label, x }))) : [];
  el.exploreRows.innerHTML = rows.map(({ k, label, x }) => {
    const isMedia = k === "movies" || k === "series";
    const act = k === "apps" ? ` data-app="${esc(x.id)}"` : isMedia ? ` data-media="${esc(x.id)}" aria-expanded="${mediaOpen.has(x.id)}"` : (k === "xbox" || k === "websites") && x.link ? ` data-link="${esc(x.link)}"` : "";
    const pic = art ? x.image ? `<img class="art" src="${esc(x.image)}" alt="" loading="lazy">` : `<span class="art art-fill" aria-hidden="true"></span>` : "";
    return `<tr${act ? ` class="app" tabindex="0"${act}` : ""}>
        <td class="name">${pic}<span class="ex-title">${esc(x.title)}<span class="ex-kind">${esc(label)}</span></span></td>
        <td class="ex-detail">${esc(details(k, x) || "\u2014")}</td>
      </tr>${isMedia && mediaOpen.has(x.id) ? mediaDetailRow(x.id) : ""}`;
  }).join("");
  const total = r ? EXPLORE_KINDS.reduce((n, [k]) => n + r[k].length, 0) : 0;
  const parts = r ? EXPLORE_KINDS.filter(([k]) => r[k].length).map(([k]) => {
    const n = r[k].length;
    const [one, many] = {
      apps: ["app", "apps"],
      movies: ["movie", "movies"],
      series: ["TV series", "TV series"],
      sports: ["sports event", "sports events"],
      xbox: ["Xbox cloud game", "Xbox cloud games"],
      people: ["person", "people"],
      events: ["event", "events"],
      websites: ["website", "websites"]
    }[k];
    return `${n} ${n === 1 ? one : many}`;
  }) : [];
  el.exploreCount.textContent = exploreState.loading ? "Asking the store\u2026" : r && total ? `${exploreState.query ? `"${exploreState.query}"` : "Suggested before you type"}: ${parts.join(" \xB7 ")}.` : "";
  el.exploreEmpty.hidden = rows.length > 0 || exploreState.loading;
  el.exploreEmpty.textContent = exploreState.note ? exploreState.note : !r ? "Type something and press Search \u2014 or press Search with the box empty for the headset's suggestions." : total ? "Nothing of that kind matched." : `Nothing matched "${exploreState.query}".`;
  el.exploreEmpty.classList.toggle("warn", Boolean(exploreState.note));
}
function initPhotos() {
  var _a3, _b3, _c, _d, _e;
  (_a3 = el.photoGo) == null ? void 0 : _a3.addEventListener("click", () => loadPhotos(true));
  (_b3 = el.photoMore) == null ? void 0 : _b3.addEventListener("click", () => loadPhotos(false));
  (_c = el.photoShow) == null ? void 0 : _c.addEventListener("change", renderPhotos);
  (_d = el.photoFrom) == null ? void 0 : _d.addEventListener("change", renderPhotos);
  (_e = el.photoTo) == null ? void 0 : _e.addEventListener("change", renderPhotos);
}
async function loadPhotos(fresh) {
  if (photoState.loading) return;
  if (fresh) Object.assign(photoState, { items: [], cursor: null });
  Object.assign(photoState, { loading: true, asked: true, note: "" });
  const button = fresh ? el.photoGo : el.photoMore;
  const label = button.textContent;
  button.disabled = true;
  try {
    for (let guard = 0; guard < 200; guard++) {
      button.textContent = photoState.items.length ? `Loading\u2026 ${photoState.items.length}` : "Loading\u2026";
      renderPhotos();
      const page = await headsetPhotos(photoState.cursor);
      const have = new Set(photoState.items.map((x) => x.id));
      photoState.items.push(...page.items.filter((x) => !have.has(x.id)));
      photoState.cursor = page.cursor;
      if (!page.cursor) break;
    }
  } catch (err2) {
    photoState.note = err2.message || "Could not load your photos.";
  }
  photoState.loading = false;
  button.disabled = false;
  button.textContent = label;
  renderPhotos();
}
function renderPhotos() {
  if (!el.photoGrid) return;
  const show = el.photoShow.value;
  const all = photoState.items;
  const secs = (v, end) => v ? Math.floor((/* @__PURE__ */ new Date(`${v}T${end ? "23:59:59" : "00:00:00"}`)).getTime() / 1e3) : null;
  const from = secs(el.photoFrom.value, false);
  const to = secs(el.photoTo.value, true);
  const shown = all.filter(
    (x) => (show === "photos" ? !x.video : show === "videos" ? x.video : show === "favorites" ? x.favorite : true) && (from == null || x.taken && x.taken >= from) && (to == null || x.taken && x.taken <= to)
  );
  const day2 = (sec) => new Date(sec * 1e3).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
  const len = (ms) => {
    const s = Math.round(ms / 1e3);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  el.photoGrid.innerHTML = shown.map((x) => {
    const where = x.world || x.app || "Headset";
    const label = `${x.video ? "Video" : "Photo"} from ${where}${x.taken ? `, ${day2(x.taken)}` : ""}`;
    return `<a class="photo" href="${esc(x.url)}" target="_blank" rel="noopener" aria-label="${esc(label)}">
        <img src="${esc(x.thumb)}" alt="" loading="lazy">
        ${x.video ? `<span class="photo-badge">${x.duration ? esc(len(x.duration)) : "Video"}</span>` : ""}
        <span class="photo-cap"><span class="photo-where">${esc(where)}</span>${x.taken ? `<span class="photo-when">${esc(day2(x.taken))}${x.favorite ? " \xB7 Favourite" : ""}</span>` : ""}</span>
      </a>`;
  }).join("");
  const videos = all.filter((x) => x.video).length;
  el.photoCount.textContent = photoState.loading && !all.length ? "Asking the store\u2026" : all.length ? `${all.length - videos} photo${all.length - videos === 1 ? "" : "s"} and ${videos} video${videos === 1 ? "" : "s"}${photoState.loading ? " so far" : photoState.cursor ? " \u2014 stopped part-way; Load more carries on" : ""}${shown.length !== all.length ? `, showing ${shown.length}` : ""}.` : "";
  el.photoEmpty.hidden = shown.length > 0 || photoState.loading && !all.length;
  el.photoEmpty.textContent = photoState.note ? photoState.note : !photoState.asked ? "Press Get photos to list what your headsets have uploaded." : all.length ? photoState.cursor ? "Nothing of that kind so far \u2014 Load more carries on from where it stopped." : "Nothing matches that kind and those dates." : "Your headsets haven't uploaded any photos or videos.";
  el.photoEmpty.classList.toggle("warn", Boolean(photoState.note));
  el.photoMoreBar.hidden = !photoState.cursor || photoState.loading;
}
function initCredit() {
  var _a3;
  (_a3 = el.creditGo) == null ? void 0 : _a3.addEventListener("click", loadCredit);
}
async function loadCredit() {
  var _a3, _b3;
  el.creditGo.disabled = true;
  el.creditGo.textContent = "Loading\u2026";
  el.creditCount.textContent = "Asking the store\u2026";
  try {
    const [h, refs] = await Promise.all([storeCreditHistory(), storeReferrals().catch(() => null)]);
    const day2 = (sec) => new Date(sec * 1e3).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
    el.creditRows.innerHTML = h.entries.map(
      (e) => `<tr>
          <td>${esc(e.title || words2(e.type || "") || "\u2014")}${e.detail ? `<div class="ppl-pres">${esc(e.detail)}</div>` : ""}</td>
          <td>${e.time ? esc(day2(e.time)) : "\u2014"}</td>
          <td class="num">${esc(e.amount || "\u2014")}</td>
        </tr>`
    ).join("");
    el.creditCount.textContent = `Balance ${(_a3 = h.balance) != null ? _a3 : "unknown"} \u2014 ${h.entries.length} entr${h.entries.length === 1 ? "y" : "ies"}${h.more ? ", the most recent ones" : ""}.${refs ? ` App referrals: ${refs.accepted} accepted, ${(_b3 = refs.earned) != null ? _b3 : "$0"} earned this year${refs.limit ? ` of ${refs.limit}` : ""}.` : ""}`;
    el.creditTable.hidden = !h.entries.length;
    el.creditEmpty.hidden = Boolean(h.entries.length);
    el.creditEmpty.classList.remove("warn");
    el.creditEmpty.textContent = "Nothing has added to or been paid from your store credit.";
  } catch (err2) {
    el.creditRows.innerHTML = "";
    el.creditTable.hidden = true;
    el.creditCount.textContent = "";
    el.creditEmpty.hidden = false;
    el.creditEmpty.classList.add("warn");
    el.creditEmpty.textContent = err2.message || "Could not load your credit history.";
  }
  el.creditGo.disabled = false;
  el.creditGo.textContent = "Get credit history";
}
function toggleMedia(id) {
  var _a3;
  if (mediaOpen.has(id)) mediaOpen.delete(id);
  else {
    mediaOpen.add(id);
    if (!mediaInfo.has(id)) loadMedia(id);
  }
  renderExplore();
  (_a3 = el.exploreRows.querySelector(`tr[data-media="${CSS.escape(id)}"]`)) == null ? void 0 : _a3.focus();
}
async function loadMedia(id) {
  mediaInfo.set(id, { loading: true });
  try {
    mediaInfo.set(id, { data: await mediaDetails(id) });
  } catch (err2) {
    mediaInfo.set(id, { note: err2.message || "Could not load this title." });
  }
  renderExplore();
}
function mediaDetailRow(id) {
  const info = mediaInfo.get(id);
  let body;
  if (!info || info.loading) body = `<p class="muted">Loading\u2026</p>`;
  else if (info.note) body = `<p class="warn">${esc(info.note)}</p>`;
  else {
    const m = info.data;
    const len = m.runtime ? `${Math.floor(m.runtime / 3600) ? `${Math.floor(m.runtime / 3600)} h ` : ""}${Math.round(m.runtime % 3600 / 60)} min` : null;
    const watch = m.watch.length ? `<h3>Where to watch</h3><ul class="watch-list">${m.watch.map(
      (w) => w.url ? `<li><a class="linkbtn" href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.provider)}</a></li>` : `<li>${esc(w.provider)}</li>`
    ).join("")}</ul>` : `<p class="hint">The store lists nowhere to watch it right now.</p>`;
    body = `<div class="media-detail">${loadSettings().images && m.art ? `<img class="media-art" src="${esc(m.art)}" alt="" loading="lazy">` : ""}<div class="media-text">${factGroups([
      [
        m.kind === "series" ? "TV series" : "Movie",
        [
          ["Genres", m.genres.join(", ")],
          ["Year", m.year ? String(m.year) : null],
          [m.kind === "series" ? "Seasons" : "Length", m.kind === "series" ? m.seasons ? String(m.seasons) : null : len],
          ["Age rating", m.rating]
        ]
      ]
    ])}${m.description ? `<p>${esc(m.description)}</p>` : ""}${watch}</div></div>`;
  }
  return `<tr class="detail"><td colspan="2"><div class="panel">${body}</div></td></tr>`;
}
function initRevisions() {
  const toggle = (row) => {
    var _a3;
    const id = row.dataset.rev;
    if (revOpen.has(id)) {
      revOpen.delete(id);
      ((_a3 = row.nextElementSibling) == null ? void 0 : _a3.matches(".rev-detail")) && row.nextElementSibling.remove();
    } else {
      revOpen.add(id);
      if (!revInfo.has(id) || revInfo.get(id).note) loadRevision(id);
      row.insertAdjacentHTML("afterend", revDetailRow(id));
    }
    row.setAttribute("aria-expanded", String(revOpen.has(id)));
  };
  document.addEventListener("click", (e) => {
    var _a3, _b3;
    const row = (_b3 = (_a3 = e.target).closest) == null ? void 0 : _b3.call(_a3, ".revisions tr.rev-row");
    if (row) toggle(row);
  });
  document.addEventListener("keydown", (e) => {
    var _a3, _b3;
    const row = (_b3 = (_a3 = e.target).closest) == null ? void 0 : _b3.call(_a3, ".revisions tr.rev-row");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      toggle(row);
    }
  });
}
async function loadRevision(id) {
  revInfo.set(id, { loading: true });
  try {
    const data = await submissionDetail(id);
    const prev = data.previousId ? await submissionDetail(data.previousId).catch(() => null) : null;
    revInfo.set(id, { data, prev });
  } catch (err2) {
    revInfo.set(id, { note: err2.message || "Could not load this revision." });
  }
  for (const cell of document.querySelectorAll(`tr.rev-detail[data-rev-detail="${CSS.escape(id)}"]`)) {
    cell.outerHTML = revDetailRow(id);
  }
}
function revisionFields(d) {
  var _a3, _b3, _c, _d;
  const yn = (v) => v == null ? null : v ? "Yes" : "No";
  const L = d.listing;
  return [
    ["Submission", "Status", d.status],
    ["Submission", "Review", d.reviewStatus],
    ["Submission", "Release type", d.releaseType],
    ["Submission", "Release status", d.releaseStatus],
    ["Submission", "Published", d.publishDate],
    ["Submission", "Approved automatically", yn(d.autoApproved)],
    ["Submission", "First release", yn(d.isInitial)],
    ["Submission", "Previous revision", d.previousId],
    ["Build", "Version", (_a3 = d.binary) == null ? void 0 : _a3.version],
    ["Build", "Mode", (_b3 = d.binary) == null ? void 0 : _b3.appMode],
    ["Build", "Release status", (_c = d.binary) == null ? void 0 : _c.releaseStatus],
    ["Build", "Binary ID", (_d = d.binary) == null ? void 0 : _d.id],
    ["Store listing", "Publisher", L.publisher],
    ["Store listing", "Website", L.website],
    ["Store listing", "Category", L.category],
    ["Store listing", "Genres", L.genres.join(", ")],
    ["Store listing", "Comfort", L.comfort],
    ["Store listing", "Play area", L.playArea],
    ["Store listing", "Internet", L.internet],
    ["Store listing", "Subscription", L.subscription],
    ["Store listing", "Early access", L.earlyAccess],
    ["Store listing", "Languages", L.languages.join(", ")],
    ["Store listing", "Age rating certificate", L.iarc]
  ];
}
function revDetailRow(id) {
  const info = revInfo.get(id);
  let body;
  if (!info || info.loading) body = `<p class="muted">Loading\u2026</p>`;
  else if (info.note) body = `<p class="warn">${esc(info.note)}</p>`;
  else {
    const now = revisionFields(info.data);
    const groups = [];
    for (const [g, label, value] of now) {
      let grp = groups.find(([t]) => t === g);
      if (!grp) groups.push(grp = [g, []]);
      grp[1].push([label, value]);
    }
    let changes = "";
    if (info.prev) {
      const before = new Map(revisionFields(info.prev).map(([g, l, v]) => [`${g}|${l}`, v]));
      const diff = now.filter(
        ([g, l, v]) => g !== "Submission" && l !== "Binary ID" && (v || null) !== (before.get(`${g}|${l}`) || null)
      );
      changes = diff.length ? `<h4>Changed since the revision before</h4><ul class="rev-changes">${diff.map(
        ([g, l, v]) => `<li><span class="rev-field">${esc(g === "Build" ? `Build ${l.toLowerCase()}` : l)}</span> ${esc(before.get(`${g}|${l}`) || "\u2014")} \u2192 ${esc(v || "\u2014")}</li>`
      ).join("")}</ul>` : `<p class="hint">Nothing in its build or listing changed since the revision before.</p>`;
    } else if (info.data.previousId) {
      changes = `<p class="hint">The revision before it could not be read, so what changed is not shown.</p>`;
    }
    body = `${factGroups(groups)}${changes}`;
  }
  return `<tr class="detail rev-detail" data-rev-detail="${esc(id)}"><td colspan="4"><div class="rev-body">${body}</div></td></tr>`;
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
  el.orgQ.addEventListener("input", renderSoon);
  el.orgSort.addEventListener("change", renderAll);
  el.checkOrg.addEventListener(
    "click",
    () => checkList(orgVisible(), el.checkOrg, "Check shown")
  );
}
function defaultVisible() {
  const q = el.defaultQ.value.trim().toLowerCase();
  return sorted(defaultList.filter((a) => matches(a, q)), el.defaultSort.value);
}
function initDefault() {
  const pc = (value) => value === "RIFT" || value === "LAGUNA";
  for (const [value, label] of HMD_TYPES) {
    if (pc(value)) continue;
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = `${label} (${value})`;
    el.defaultHmd.append(opt);
  }
  if (!pc(loadSettings().hmd)) el.defaultHmd.value = loadSettings().hmd;
  for (const [value, label] of DEFAULT_APP_TRIGGERS) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    el.defaultTrigger.append(opt);
  }
  el.defaultTrigger.value = loadSettings().defaultTrigger;
  el.defaultGo.addEventListener("click", runDefaultApps);
  el.defaultQ.addEventListener("input", renderSoon);
  el.defaultSort.addEventListener("change", renderAll);
  el.checkDefault.addEventListener(
    "click",
    () => checkList(defaultVisible(), el.checkDefault, "Check shown")
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
    plusState.rows.filter((a) => {
      var _a3;
      return (!pick || ((_a3 = a.plusSections) == null ? void 0 : _a3.includes(pick))) && matches(a, q);
    }),
    el.plusSort.value
  );
}
function initPlus() {
  el.plusGo.addEventListener("click", runHorizonPlus);
  el.plusQ.addEventListener("input", renderSoon);
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
    const [sections, own] = await Promise.all([
      horizonPlusSections().catch(() => []),
      horizonPlus().catch(() => [])
    ]);
    const claimedIds = new Set(own.filter((a) => a.claimed).map((a) => a.id));
    const byId = /* @__PURE__ */ new Map();
    const others = [];
    const parts = await mapLimit(sections, 3, (s) => horizonPlusSection(s.id).catch(() => ({ apps: [], others: [] })));
    sections.forEach((s, i) => {
      var _a3;
      for (const app of parts[i].apps) {
        const row = (_a3 = byId.get(app.id)) != null ? _a3 : { ...app, plusSections: [], plusNames: [] };
        row.plusSections.push(s.id);
        row.plusNames.push(s.name);
        row.claimed = row.claimed || app.claimed || claimedIds.has(app.id);
        byId.set(app.id, row);
      }
      for (const o of parts[i].others) others.push({ ...o, section: s.name, sectionId: s.id });
    });
    if (!sections.length) {
      for (const a of own) byId.set(a.id, { ...a, plusSections: [a.plus], plusNames: [a.plus === "monthly" ? "This month's games" : "Games catalog"] });
    }
    plusState.sections = sections.length ? sections : [{ id: "monthly", name: "This month's games" }, { id: "catalog", name: "Games catalog" }];
    plusState.rows = [...byId.values()];
    plusState.others = others;
    el.plusPick.replaceChildren(new Option("Every section", ""), ...plusState.sections.map((s) => new Option(s.name, s.id)));
    if (!plusState.rows.length && !others.length) throw new Error("the store returned no Horizon+ catalog for this account");
  } catch (err2) {
    plusState.rows = [];
    plusState.others = [];
    plusState.note = err2.message || "Could not load the Horizon+ games.";
  } finally {
    plusState.loading = false;
    el.plusGo.disabled = false;
    el.plusGo.textContent = "Get Horizon+ games";
    renderAll();
    syncRelayNote();
  }
}
function renderPlusOthers() {
  if (!el.plusOtherRows) return;
  const q = el.plusQ.value.trim().toLowerCase();
  const pick = el.plusPick.value;
  const shown = plusState.others.filter((o) => (!pick || o.sectionId === pick) && (!q || o.title.toLowerCase().includes(q)));
  const art = loadSettings().images;
  el.plusOtherRows.innerHTML = shown.map(
    (o) => `<tr>
        <td class="name">${art ? o.image ? `<img class="art" src="${esc(o.image)}" alt="" loading="lazy">` : `<span class="art art-fill" aria-hidden="true"></span>` : ""}<span class="ex-title">${esc(o.title)}<span class="ex-kind">${esc(o.kind)}</span></span></td>
        <td>${esc(o.section)}</td>
        <td class="ex-detail">${esc([o.genres.slice(0, 3).join(", "), o.note].filter(Boolean).join(" \xB7 ") || "\u2014")}</td>
      </tr>`
  ).join("");
  el.plusOthers.hidden = !shown.length;
}
function storeVisible() {
  const q = el.storeQ.value.trim().toLowerCase();
  return sorted(storeState.rows.filter((a) => matches(a, q)), el.storeSort.value);
}
function initStore() {
  for (const [value, label] of HMD_TYPES) {
    el.storeHmd.append(new Option(`${label} (${value})`, value));
  }
  el.storeHmd.value = loadSettings().hmd;
  el.storeGo.addEventListener("click", () => runStoreFront(null));
  el.storeView.addEventListener("change", () => runStoreFront(el.storeView.value || null));
  el.storeSection.addEventListener("change", () => loadStoreSection(el.storeSection.value));
  el.storeMore.addEventListener("click", moreStoreSection);
  el.storeQ.addEventListener("input", renderSoon);
  el.storeSort.addEventListener("change", renderAll);
  el.checkStore.addEventListener(
    "click",
    () => checkList(storeVisible(), el.checkStore, "Check shown")
  );
}
async function runStoreFront(viewId) {
  var _a3, _b3;
  if (storeState.loading) return;
  const hmd = viewId ? storeState.hmd : el.storeHmd.value;
  Object.assign(storeState, {
    asked: true,
    loading: true,
    note: "",
    rows: [],
    cursor: null,
    section: null
  });
  el.storeGo.disabled = true;
  el.storeGo.textContent = "Loading\u2026";
  el.storeView.disabled = true;
  el.storeSection.disabled = true;
  renderAll();
  try {
    const [front, charts] = await Promise.all([
      storeFront(hmd, viewId),
      viewId ? storeState.charts : topCharts(hmd).catch(() => [])
    ]);
    Object.assign(storeState, { front, charts, hmd });
    el.storeView.replaceChildren(...front.views.map((v) => new Option(v.name, v.id)));
    el.storeView.hidden = front.views.length < 2;
    if (front.viewId) el.storeView.value = front.viewId;
    const options = (list) => list.map((s) => new Option(s.layout ? `${s.name} \u2014 ${s.layout}` : s.name, s.id));
    const group = (label, list) => {
      const g = document.createElement("optgroup");
      g.label = label;
      g.append(...options(list));
      return g;
    };
    const { frlToken } = loadSettings();
    const forYou = (frlToken || "").trim() ? [FOR_YOU_SECTION] : [];
    el.storeSection.replaceChildren(
      ...charts.length || forYou.length ? [group("Sections", front.sections), ...forYou.length ? [group("For you", forYou)] : [], ...charts.length ? [group("Top charts", charts)] : []] : options(front.sections)
    );
    if (!front.sections.length) storeState.note = "The store lists no sections for this headset.";
  } catch (err2) {
    storeState.front = null;
    storeState.charts = [];
    storeState.note = err2.message || "Could not load the store front.";
  } finally {
    storeState.loading = false;
    el.storeGo.disabled = false;
    el.storeGo.textContent = "Get store";
    el.storeView.disabled = false;
    el.storeSection.disabled = !((_a3 = storeState.front) == null ? void 0 : _a3.sections.length);
    renderAll();
    syncRelayNote();
  }
  const first = (_b3 = storeState.front) == null ? void 0 : _b3.sections[0];
  if (first) loadStoreSection(first.id);
}
function loadStoreSection(id) {
  var _a3, _b3;
  const section = [...(_b3 = (_a3 = storeState.front) == null ? void 0 : _a3.sections) != null ? _b3 : [], ...storeState.charts, FOR_YOU_SECTION].find((s) => s.id === id);
  if (!section) return;
  Object.assign(storeState, { section, rows: [], cursor: null, note: "" });
  el.storeSection.value = id;
  fetchStorePage(el.storeSection);
}
function moreStoreSection() {
  if (storeState.cursor) fetchStorePage(el.storeMore);
}
async function fetchStorePage(button) {
  if (storeState.loading || !storeState.section) return;
  const { section, hmd, cursor } = storeState;
  const label = button.tagName === "BUTTON" ? button.textContent : null;
  storeState.loading = true;
  const controls = [button, el.storeGo, el.storeView, el.storeSection];
  const wasDisabled = controls.map((c) => c.disabled);
  for (const c of controls) c.disabled = true;
  if (label) button.textContent = "Loading\u2026";
  renderAll();
  try {
    const page = await storeSection(section.id, hmd, cursor, storeState.rows.length);
    if (storeState.section !== section) return;
    const have = new Set(storeState.rows.map((a) => a.id));
    storeState.rows.push(...page.apps.filter((a) => !have.has(a.id)));
    storeState.cursor = page.cursor;
  } catch (err2) {
    storeState.note = err2.message || "Could not load this section.";
  } finally {
    storeState.loading = false;
    controls.forEach((c, i) => c.disabled = c === button ? false : wasDisabled[i]);
    if (label) button.textContent = label;
    renderAll();
    syncRelayNote();
  }
}
function wishVisible() {
  const q = el.wishQ.value.trim().toLowerCase();
  return sorted(wishState.rows.filter((a) => matches(a, q)), el.wishSort.value);
}
function initWishlist() {
  el.wishGo.addEventListener("click", () => fetchWishPage(el.wishGo, true));
  el.wishMore.addEventListener("click", () => wishState.cursor && fetchWishPage(el.wishMore, false));
  el.wishQ.addEventListener("input", renderSoon);
  el.wishSort.addEventListener("change", renderAll);
  el.checkWish.addEventListener(
    "click",
    () => checkList(wishVisible(), el.checkWish, "Check shown")
  );
}
async function fetchWishPage(button, fresh) {
  if (wishState.loading) return;
  if (fresh) Object.assign(wishState, { rows: [], cursor: null });
  const label = button.textContent;
  Object.assign(wishState, { asked: true, loading: true, note: "" });
  button.disabled = true;
  button.textContent = "Loading\u2026";
  renderAll();
  try {
    const page = await wishlist(void 0, wishState.cursor, wishState.rows.length);
    const have = new Set(wishState.rows.map((a) => a.id));
    wishState.rows.push(...page.apps.filter((a) => !have.has(a.id)));
    wishState.cursor = page.cursor;
  } catch (err2) {
    wishState.note = err2.message || "Could not load your wishlist.";
  } finally {
    wishState.loading = false;
    button.disabled = false;
    button.textContent = label;
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
  el.adbQ.addEventListener("input", renderSoon);
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
  var _a3;
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
    const message = /no headset chosen|No device selected/i.test((_a3 = err2.message) != null ? _a3 : "") ? "No headset chosen." : err2.message || "Could not connect.";
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
  var _a3;
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
    const owned = ownedByPackage();
    const missing = adbInstalled.filter((a) => !owned.has(a.packageName) && !packageAnswers.has(a.packageName)).map((a) => a.packageName);
    if (missing.length) {
      el.adbCount.textContent = `Naming ${missing.length} packages\u2026`;
      try {
        const known = await lookupPackages(missing);
        for (const pkg of missing) packageAnswers.set(pkg, (_a3 = known.get(pkg)) != null ? _a3 : null);
      } catch {
      }
    }
    for (const entry of adbInstalled) {
      const match = packageAnswers.get(entry.packageName);
      if (match) entry.resolved = match;
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
    [...ownedAcross.values()].filter((a) => a.packageName).map((a) => [a.packageName, a])
  );
}
function resolveHeadsetApps() {
  const owned = ownedByPackage();
  adbApps = adbInstalled.map((a) => {
    var _a3, _b3, _c, _d, _e, _f, _g, _h, _i;
    const mine = owned.get(a.packageName);
    const match = a.resolved;
    const id = (_b3 = (_a3 = mine == null ? void 0 : mine.id) != null ? _a3 : match == null ? void 0 : match.id) != null ? _b3 : null;
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
  var _a3, _b3, _c, _d, _e, _f, _g;
  const key = openKey("adb", app);
  const latest = (_c = (_b3 = (_a3 = results.get(keyOf(app))) == null ? void 0 : _a3.latest) != null ? _b3 : app.latest) != null ? _c : null;
  const showArt = loadSettings().images;
  const tr = document.createElement("tr");
  tr.className = "app";
  tr.dataset.id = keyOf(app);
  tr.tabIndex = 0;
  tr.setAttribute("aria-expanded", String(open.has(key)));
  tr.innerHTML = `
    <td class="name">${/* The store's icon, else the one the headset itself has installed. */
  showArt && (appArt(app) || dgHeadsetIcon(app.packageName)) ? `<img class="art" src="${esc(appArt(app) || dgHeadsetIcon(app.packageName))}" alt="" loading="lazy">` : rowArt(app, showArt)}${esc(app.name)}</td>
    <td class="num">${esc((_d = app.installedVersion) != null ? _d : "\u2014")}</td>
    <td class="num c-build">${(_e = app.installedVersionCode) != null ? _e : "\u2014"}</td>
    <td class="num">${esc((_f = latest == null ? void 0 : latest.version) != null ? _f : "\u2014")}</td>
    <td class="num c-build">${(_g = latest == null ? void 0 : latest.versionCode) != null ? _g : "\u2014"}</td>`;
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
  var _a3, _b3, _c;
  const latest = (_c = (_b3 = (_a3 = results.get(keyOf(app))) == null ? void 0 : _a3.latest) != null ? _b3 : app.latest) != null ? _c : null;
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
          var _a3, _b3;
          return ((_a3 = b.installedVersionCode) != null ? _a3 : 0) - ((_b3 = a.installedVersionCode) != null ? _b3 : 0);
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
  var _a3;
  if (!top) return;
  const row = el.adbRows.querySelector(`tr.app[data-id="${keyOf(app)}"]`);
  const panels = [row == null ? void 0 : row.nextElementSibling, stageEl()].filter(Boolean);
  for (const panel of panels) {
    const scroller = (_a3 = panel.querySelector) == null ? void 0 : _a3.call(panel, ".versions-out .vscroll");
    if (scroller) scroller.scrollTop = top;
  }
}
async function installBuild(app, { installBuild: binaryId, version, code }, button) {
  var _a3, _b3, _c;
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
  const scrolledTo = (_c = (_b3 = (_a3 = button.closest(".versions-out")) == null ? void 0 : _a3.querySelector(".vscroll")) == null ? void 0 : _b3.scrollTop) != null ? _c : 0;
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
  const superseding = Boolean(dialogPending);
  dialogPending == null ? void 0 : dialogPending(false);
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
  if (!superseding) dialogReturnFocus = document.activeElement;
  const before = dialogReturnFocus;
  box.hidden = false;
  (danger ? noBtn : yesBtn).focus();
  return new Promise((resolve) => {
    const finish = (answer) => {
      var _a3;
      dialogPending = null;
      box.hidden = true;
      yesBtn.onclick = noBtn.onclick = null;
      box.onkeydown = box.onclick = null;
      (_a3 = before == null ? void 0 : before.focus) == null ? void 0 : _a3.call(before);
      resolve(answer);
    };
    dialogPending = (answer) => {
      dialogPending = null;
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
  var _a3;
  try {
    const list = JSON.parse((_a3 = localStorage.getItem(HISTORY_KEY)) != null ? _a3 : "[]");
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
function readRecent() {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function pushRecent(app) {
  var _a3, _b3, _c, _d, _e;
  if (!(app == null ? void 0 : app.id) || !app.name) return;
  try {
    const id = String(app.id);
    const cur = readRecent();
    if (((_a3 = cur[0]) == null ? void 0 : _a3.id) === id) return;
    const rest = cur.filter((r) => r.id !== id);
    const entry = { id, name: app.name, image: (_c = (_b3 = squareArt(app)) != null ? _b3 : app.image) != null ? _c : null, slug: (_d = app.slug) != null ? _d : null, platform: (_e = app.platform) != null ? _e : null, at: Date.now() };
    localStorage.setItem(RECENT_KEY, JSON.stringify([entry, ...rest].slice(0, RECENT_MAX)));
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
  var _a3;
  appInstalls.set(key, {
    app,
    from,
    buttons: button ? [button] : [],
    label: (_a3 = label != null ? label : button == null ? void 0 : button.textContent) != null ? _a3 : ""
  });
  if (button) {
    button.dataset.job = key;
    button.disabled = true;
    button.textContent = "Starting\u2026";
  }
}
async function appInstall(app, binaryId, version, button, { save = false } = {}) {
  var _a3, _b3;
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
  let obb = (_a3 = obbs.get(String(binaryId))) != null ? _a3 : null;
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
    appId: String((_b3 = app.id) != null ? _b3 : ""),
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  if (e.state === "ask") {
    const yes = await uiConfirm({ title: e.title, text: e.text, yes: e.yes, danger: true });
    window.MetaDBApp.answer(e.askId, yes);
    return;
  }
  const key = String(e.id);
  const job = appInstalls.get(key);
  const buttons = /* @__PURE__ */ new Set([...(_a3 = job == null ? void 0 : job.buttons) != null ? _a3 : [], ...document.querySelectorAll(`[data-job="${CSS.escape(key)}"]`)]);
  if (e.state === "queued") {
    const first = job && !job.queued;
    if (job) job.queued = true;
    const place = e.position > 1 ? `Queued (${e.position}${(_b3 = ["", "st", "nd", "rd"][e.position]) != null ? _b3 : "th"})` : "Queued (next)";
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
    var _a3;
    dgState.selected = "gh:new";
    dgRender();
    (_a3 = el.dgDetail.querySelector("[data-gh-form] input")) == null ? void 0 : _a3.focus();
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
  var _a3;
  const key = `uninstall:${app.packageName}`;
  if (jobPressed(key)) return;
  const kept = dgState.backups.filter((b) => b.packageName === app.packageName).length;
  const sure = await uiConfirm({
    title: `Uninstall ${app.name}?`,
    text: `${app.name} ${(_a3 = app.installedVersion) != null ? _a3 : ""} is removed from this headset, and its saved data with it. This cannot be undone. ` + (kept ? `Your ${plural(kept, "backup")} of it stay${kept === 1 ? "s" : ""} in Backups.` : "There is no backup of it \u2014 Back up first if you may want this version again."),
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
  var _a3;
  const restore = e.target.closest("[data-restore]");
  const del = e.target.closest("[data-delete-backup]");
  const id = (_a3 = restore == null ? void 0 : restore.dataset.restore) != null ? _a3 : del == null ? void 0 : del.dataset.deleteBackup;
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
      text: "Your tokens are removed from this browser, and MetaDB goes back to the built-in token. You stay logged in to Meta itself, so Sign in with Meta can fill them in again.",
      yes: "Sign out"
    }
  );
  if (!sure) return;
  if (IN_APP) window.MetaDBApp.signOut();
  saveSettings({ token: "", acToken: "", frlToken: "", upToken: "" });
  el.token.value = "";
  el.acToken.value = "";
  if (el.frlToken) el.frlToken.value = "";
  if (el.updToken) el.updToken.value = "";
  mineList = [];
  ownedAcross = /* @__PURE__ */ new Map();
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
  var _a3;
  const a = adbInstalled.find((x) => x.packageName === pkg);
  return (_a3 = a == null ? void 0 : a.version) != null ? _a3 : null;
}
function dgApp(pkg) {
  var _a3, _b3;
  return (_b3 = (_a3 = adbApps.find((a) => a.packageName === pkg)) != null ? _a3 : dgState.more.find((a) => a.packageName === pkg)) != null ? _b3 : dgSideApp(pkg);
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
function readRepos() {
  var _a3;
  try {
    return (_a3 = JSON.parse(localStorage.getItem(REPOS_KEY))) != null ? _a3 : {};
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
  var _a3, _b3;
  return app.repoOnly ? app.repo : app.packageName ? (_b3 = (_a3 = readRepos()[app.packageName]) == null ? void 0 : _a3.repo) != null ? _b3 : null : null;
};
var TOAST_LIMIT = 4;
function toast({ title, body, actionLabel, onAction } = {}) {
  if (!el.toasts) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.setAttribute("role", "group");
  node.innerHTML = `<button type="button" class="toast__close" aria-label="Dismiss">\xD7</button><div class="toast__title">${esc(title != null ? title : "")}</div>` + (body ? `<div class="toast__body">${esc(body)}</div>` : "") + (actionLabel ? `<div class="toast__actions"><button type="button" class="linkbtn toast__action">${esc(actionLabel)}</button></div>` : "");
  const close = () => dismissToast(node);
  node.querySelector(".toast__close").addEventListener("click", close);
  if (actionLabel) {
    node.querySelector(".toast__action").addEventListener("click", () => {
      try {
        onAction == null ? void 0 : onAction();
      } finally {
        close();
      }
    });
  }
  const linger = Number(loadSettings().notifyLinger) || 0;
  let timer = linger ? setTimeout(close, linger) : null;
  node.addEventListener("mouseenter", () => {
    if (timer) clearTimeout(timer);
  });
  node.addEventListener("mouseleave", () => {
    if (linger) timer = setTimeout(close, linger);
  });
  el.toasts.appendChild(node);
  requestAnimationFrame(() => node.classList.add("is-shown"));
  const all = el.toasts.querySelectorAll(".toast");
  for (let i = 0; i < all.length - TOAST_LIMIT; i++) dismissToast(all[i]);
}
function dismissToast(node) {
  if (!node || node.dataset.going) return;
  node.dataset.going = "1";
  node.classList.remove("is-shown");
  node.classList.add("is-going");
  const motion = loadSettings().motion && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!motion) {
    node.remove();
    return;
  }
  let done = false;
  const end = () => {
    if (done) return;
    done = true;
    node.remove();
  };
  node.addEventListener("transitionend", end, { once: true });
  setTimeout(end, 500);
}
function notifyWatchUpdate(w, prevLatest) {
  const from = prevLatest != null ? prevLatest : w.seen;
  const jump = from != null && w.latest != null ? `build ${from} \u2192 ${w.latest}` : `build ${w.latest}`;
  toast({
    title: `${w.name} \u2014 new build`,
    body: jump,
    actionLabel: "View watchlist",
    onAction: () => go("/watchlist")
  });
}
function readWatch() {
  try {
    const v = JSON.parse(localStorage.getItem(WATCH_KEY));
    if (!Array.isArray(v)) return [];
    return v.map(
      (w) => w && !("seenVer" in w) ? { ...w, seen: null, latest: null, seenVer: null, latestVer: null } : w
    );
  } catch {
    return [];
  }
}
function saveWatch(list) {
  try {
    localStorage.setItem(WATCH_KEY, JSON.stringify(list));
  } catch {
  }
}
function appFromWatch(w) {
  var _a3, _b3, _c, _d;
  return {
    id: w.id,
    name: w.name,
    image: (_a3 = w.image) != null ? _a3 : null,
    platform: (_b3 = w.platform) != null ? _b3 : null,
    slug: (_c = w.slug) != null ? _c : null,
    packageName: (_d = w.packageName) != null ? _d : null
  };
}
function isWatched(app) {
  return Boolean(app == null ? void 0 : app.id) && readWatch().some((w) => w.id === String(app.id));
}
function watchUpdated(w) {
  return w.latest != null && w.seen != null && w.latest !== w.seen;
}
function watchToggle(app) {
  const on = isWatched(app);
  return `<button type="button" class="watch-toggle${on ? " is-on" : ""}" data-watch-toggle="${esc(keyOf(app))}" aria-pressed="${on}" title="${on ? "Remove from" : "Add to"} your watchlist" aria-label="${on ? "Remove" : "Add"} ${esc(app.name)} ${on ? "from" : "to"} your watchlist"></button>`;
}
function squareLabels() {
  return ["Cover", "Icon", "Icon (VR)"];
}
function squareArt(app) {
  var _a3, _b3;
  for (const label of squareLabels()) {
    const m = ((_a3 = app == null ? void 0 : app.media) != null ? _a3 : []).find((x) => (x == null ? void 0 : x.label) === label && x.uri);
    if (m) return m.uri;
  }
  return (_b3 = app == null ? void 0 : app.image) != null ? _b3 : null;
}
function appArt(app) {
  return (app == null ? void 0 : app.id) != null && iconCache.get(String(app.id)) || squareArt(app) || null;
}
function hmdFor(app) {
  return (app == null ? void 0 : app.platform) === "PC" ? "RIFT" : (app == null ? void 0 : app.platform) === "ANDROID_3DOF" || (app == null ? void 0 : app.platform) === "ANDROID" ? "PACIFIC" : "EUREKA";
}
function rowArt(app, showArt) {
  if (!showArt) return "";
  const art = appArt(app);
  if (art) return `<img class="art" src="${esc(art)}" alt="" loading="lazy">`;
  return (app == null ? void 0 : app.id) ? `<span class="art art-fill" data-iconid="${esc(String(app.id))}" data-hmd="${hmdFor(app)}" aria-hidden="true"></span>` : "";
}
async function fillRowIcons(root) {
  if (!root || !loadSettings().images) return;
  const ids = /* @__PURE__ */ new Map();
  for (const ph of root.querySelectorAll(".art-fill[data-iconid]")) {
    const id = ph.dataset.iconid;
    if (!iconTried.has(id) && !ids.has(id)) ids.set(id, ph.dataset.hmd || "EUREKA");
  }
  if (!ids.size) return;
  for (const id of ids.keys()) iconTried.add(id);
  await mapLimit([...ids], 4, async ([id, hmd]) => {
    const url = await appIcon(id, hmd);
    if (!url) return;
    iconCache.set(id, url);
    saveAppImage(id, url);
    for (const ph of document.querySelectorAll(`.art-fill[data-iconid="${CSS.escape(id)}"]`)) {
      const img = document.createElement("img");
      img.className = "art";
      img.alt = "";
      img.loading = "lazy";
      img.src = url;
      ph.replaceWith(img);
    }
  });
}
function hasSquareArt(app) {
  var _a3;
  return ((_a3 = app == null ? void 0 : app.media) != null ? _a3 : []).some((x) => squareLabels().includes(x == null ? void 0 : x.label) && x.uri);
}
function refreshWatchArt(apps) {
  const list = readWatch();
  if (!list.length) return;
  const byId = new Map(list.map((w) => [w.id, w]));
  let changed = false;
  for (const app of apps) {
    const w = (app == null ? void 0 : app.id) != null ? byId.get(String(app.id)) : null;
    if (!w) continue;
    const art = squareArt(app);
    if (art && art !== w.image && (hasSquareArt(app) || !w.image)) {
      w.image = art;
      changed = true;
    }
  }
  if (changed) {
    saveWatch(list);
    if (el.viewWatchlist && !el.viewWatchlist.hidden) renderWatch();
  }
}
function addWatch(app) {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j;
  if (!(app == null ? void 0 : app.id)) return;
  const list = readWatch();
  if (list.some((w) => w.id === String(app.id))) return;
  const head = (_a3 = results.get(keyOf(app))) == null ? void 0 : _a3.latest;
  list.push({
    id: String(app.id),
    name: (_b3 = app.name) != null ? _b3 : String(app.id),
    slug: (_c = app.slug) != null ? _c : null,
    platform: (_d = app.platform) != null ? _d : null,
    image: squareArt(app),
    seen: (_e = head == null ? void 0 : head.versionCode) != null ? _e : null,
    seenVer: (_f = head == null ? void 0 : head.version) != null ? _f : null,
    seenAt: (_g = head == null ? void 0 : head.releasedAt) != null ? _g : null,
    latest: (_h = head == null ? void 0 : head.versionCode) != null ? _h : null,
    latestVer: (_i = head == null ? void 0 : head.version) != null ? _i : null,
    latestAt: (_j = head == null ? void 0 : head.releasedAt) != null ? _j : null,
    checkedAt: head ? Date.now() : 0,
    error: null
  });
  saveWatch(list);
}
function removeWatch(id) {
  saveWatch(readWatch().filter((w) => w.id !== String(id)));
}
function toggleWatch(app) {
  if (isWatched(app)) removeWatch(app.id);
  else addWatch(app);
}
function markWatchSeen(id) {
  const list = readWatch();
  const w = list.find((x) => x.id === String(id));
  if (!w) return;
  w.seen = w.latest;
  w.seenVer = w.latestVer;
  w.seenAt = w.latestAt;
  saveWatch(list);
}
function watchUpdateCount() {
  return readWatch().filter(watchUpdated).length;
}
function updateWatchBadge() {
  if (!el.watchBadge) return;
  if (loadSettings().sectionsOff.includes("watchlist")) {
    el.watchBadge.textContent = "";
    el.watchBadge.hidden = true;
    return;
  }
  const n = watchUpdateCount();
  el.watchBadge.textContent = n ? String(n) : "";
  el.watchBadge.hidden = n === 0;
}
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(Math.max(1, limit), items.length) }, worker));
  return out;
}
async function sweepWatch({ force = false } = {}) {
  const list = readWatch();
  if (!list.length || sweepWatch.busy) return;
  if (loadSettings().sectionsOff.includes("watchlist")) return;
  const last = Number(localStorage.getItem(WATCH_LAST_KEY) || 0);
  const throttle = Number(loadSettings().watchThrottle);
  const gap = Number.isFinite(throttle) ? throttle : WATCH_THROTTLE;
  if (!force && Date.now() - last < gap) return;
  sweepWatch.busy = true;
  if (!el.viewWatchlist.hidden) renderWatch();
  try {
    await mapLimit(list, 6, async (entry) => {
      var _a3, _b3, _c, _d;
      try {
        const head = await checkApp({ id: entry.id, name: entry.name });
        const cur = readWatch();
        const w = cur.find((x) => x.id === entry.id);
        if (!w) return;
        const prevLatest = w.latest;
        w.latest = (_a3 = head == null ? void 0 : head.versionCode) != null ? _a3 : null;
        w.latestVer = (_b3 = head == null ? void 0 : head.version) != null ? _b3 : null;
        w.latestAt = (_c = head == null ? void 0 : head.releasedAt) != null ? _c : null;
        w.checkedAt = Date.now();
        w.error = null;
        if (head) {
          results.set(keyOf({ id: entry.id }), { state: "info", latest: head });
          if (head.builds) versionCache.set(entry.id, head.builds);
        }
        if (w.seen == null) {
          w.seen = w.latest;
          w.seenVer = w.latestVer;
          w.seenAt = w.latestAt;
        }
        saveWatch(cur);
        if (loadSettings().watchNotify && prevLatest !== w.latest && watchUpdated(w)) {
          notifyWatchUpdate(w, prevLatest);
        }
      } catch (err2) {
        const cur = readWatch();
        const w = cur.find((x) => x.id === entry.id);
        if (w) {
          w.error = String((_d = err2 == null ? void 0 : err2.message) != null ? _d : err2);
          w.checkedAt = Date.now();
          saveWatch(cur);
        }
      }
      updateWatchBadge();
      if (!el.viewWatchlist.hidden) renderWatch();
    });
    localStorage.setItem(WATCH_LAST_KEY, String(Date.now()));
  } finally {
    sweepWatch.busy = false;
    updateWatchBadge();
    if (!el.viewWatchlist.hidden) renderWatch();
  }
}
sweepWatch.busy = false;
async function loadHomeAccount(token) {
  homeAccount = { token, loading: true };
  const ok = (r) => r.status === "fulfilled" ? r.value : null;
  const profileP = accountProfile();
  const storeP = extraOn("homeStore") ? storeAccount() : Promise.resolve(null);
  const worldsP = extraOn("homeWorlds") ? profileP.then((p) => (p == null ? void 0 : p.id) ? publishedWorlds(p.id) : null) : Promise.resolve(null);
  const presenceP = extraOn("homePresence") ? recentPresence() : Promise.resolve(null);
  const [profile, presence, worlds, store] = await Promise.allSettled([profileP, presenceP, worldsP, storeP]);
  if (homeAccount.token !== token) return;
  homeAccount = {
    token,
    profile: ok(profile),
    presence: ok(presence),
    worlds: ok(worlds),
    store: ok(store),
    loading: false
  };
  refreshHome();
}
function refreshHome() {
  if (el.viewHome && !el.viewHome.hidden) renderHome();
}
function agoText(sec) {
  const s = Math.max(0, Date.now() / 1e3 - Number(sec));
  if (s < 90) return "just now";
  const m = s / 60;
  if (m < 60) return `${Math.round(m)} min ago`;
  const h = m / 60;
  if (h < 24) return `${Math.round(h)} h ago`;
  const d = h / 24;
  if (d < 30) return `${Math.round(d)} day${Math.round(d) === 1 ? "" : "s"} ago`;
  return new Date(Number(sec) * 1e3).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
}
function homeAppIcon(name, image) {
  const letter = esc((name || "?").trim().charAt(0).toUpperCase());
  return image ? `<img class="home-ic" src="${esc(image)}" alt="" loading="lazy" data-letter="${letter}">` : `<span class="home-ic home-ic--ph" aria-hidden="true">${letter}</span>`;
}
function renderHome() {
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  if (!el.homeBody) return;
  const s = loadSettings();
  const t = (s.token || "").trim();
  const signed = Boolean(t) && !t.includes("|");
  const acToken = (s.acToken || "").trim();
  const watch = readWatch();
  const updatedCount = watch.filter(watchUpdated).length;
  const wl = [...watch].sort((a, b) => (watchUpdated(b) ? 1 : 0) - (watchUpdated(a) ? 1 : 0));
  const appLine = (id, name, image, right) => `<a class="home-appline" href="/apps/${esc(String(id))}" data-appid="${esc(String(id))}">${homeAppIcon(name, iconCache.get(String(id)) || image)}<span class="home-appnm">${esc(name)}</span>${right || ""}</a>`;
  const wlRows = wl.slice(0, 6).map((w) => {
    const right = watchUpdated(w) ? `<span class="home-tag is-new">New${w.latestVer ? ` \xB7 v${esc(w.latestVer)}` : ""}</span>` : w.error ? `<span class="home-tag is-bad">check failed</span>` : w.latest == null ? `<span class="home-tag">not checked</span>` : `<span class="home-tag">up to date</span>`;
    return appLine(w.id, w.name, w.image, right);
  }).join("");
  const watchedIds = new Set(watch.map((w) => String(w.id)));
  const recent = readRecent().filter((r) => !watchedIds.has(String(r.id)));
  const recentRows = recent.slice(0, 6).map((r) => appLine(r.id, r.name, r.image, "")).join("");
  const acctKey = [t, (s.frlToken || "").trim(), s.images, s.extrasOff.join(",")].join("\n");
  if (signed && homeAccount.token !== acctKey && !homeAccount.loading) loadHomeAccount(acctKey);
  const acct = signed && homeAccount.token === acctKey ? homeAccount : null;
  const prof = acct == null ? void 0 : acct.profile;
  const relayHow = extensionRelayOn() ? "Browser extension" : (s.relay || "").trim() ? "Your own relay" : "Built-in relay";
  const repoCount = Object.keys(readRepos()).length;
  const link = (path, view, text) => `<a href="${path}" data-view="${view}">${esc(text)}</a>`;
  const owned = [...ownedAcross.values()];
  const pcOwned = owned.filter((a) => a.platform === "PC").length;
  const library2 = owned.length ? `${owned.length - pcOwned} Quest${pcOwned ? ` \xB7 ${pcOwned} PC` : ""}${ownedLoading.has("pc") ? '<span class="home-stat-note">PC library still loading\u2026</span>' : ""}` : ownedLoading.size || s.autoOwned && !mineAsked ? "Loading\u2026" : mineNote ? link("/mine", "mine", "Couldn't load \u2014 try again") : mineAsked ? "Nothing owned" : link("/mine", "mine", "Load your library");
  const worldCount = (_c = (_b3 = (_a3 = acct == null ? void 0 : acct.worlds) == null ? void 0 : _a3.worlds) == null ? void 0 : _b3.length) != null ? _c : 0;
  const worldsText = worldCount ? `${worldCount}${acct.worlds.cursor ? "+" : ""} published` : null;
  const pres = acct == null ? void 0 : acct.presence;
  const lastActive = (acct == null ? void 0 : acct.loading) ? "\u2026" : !pres ? "\u2014" : pres.current ? "In VR now" : pres.lastActive ? agoText(pres.lastActive) : "\u2014";
  const saved = [
    ["Access", signed],
    ["Account", Boolean(acToken)],
    ["Meta", Boolean((s.frlToken || "").trim())],
    ["Updater", Boolean((s.upToken || "").trim())]
  ].filter(([, on]) => on).map(([k]) => k);
  const tokens = `${saved.join(" \xB7 ") || "None"}${signed && !acToken ? '<span class="home-stat-note">No downloads without the account token</span>' : ""}`;
  const det = (_d = prof == null ? void 0 : prof.details) != null ? _d : {};
  const fmtDate = (v) => {
    const n = Number(v);
    const d = Number.isFinite(n) && n > 0 ? new Date(n * 1e3) : new Date(String(v));
    return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
  };
  const shout = (v) => String(v).toLowerCase().replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  const yesNo2 = (v) => v ? "Yes" : "No";
  const privacyRow = (st) => {
    var _a4;
    if (st.key === "BIDIRECTIONAL_FOLLOWER_JOINABILITY")
      return ["Who can join you uninvited", st.value === "ON" ? "Followers you follow back" : st.value === "OFF" ? "Any follower" : "\u2014"];
    const label = (_a4 = { OC_VR_PRIVATE_PROFILE: "Private profile", ACTIVE_STATUS: "Active status" }[st.key]) != null ? _a4 : st.name;
    return [label, esc(st.valueName || (st.value ? shout(st.value) : "\u2014"))];
  };
  const factLabel = (k) => {
    const s2 = k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").trim().toLowerCase().replace(/^(is|has|viewer) /, "");
    return s2.charAt(0).toUpperCase() + s2.slice(1);
  };
  const factValue = (k, v) => typeof v === "boolean" ? v ? "Yes" : "No" : typeof v === "number" && v > 1e9 && v < 4e9 && /time|date|since|created|joined|_at$|At$/.test(k) ? fmtDate(v) : /^[A-Z][A-Z0-9_]+$/.test(String(v)) ? shout(v) : String(v);
  const details = signed ? [
    det.age != null ? ["Age on account", `${det.age}`] : null,
    det.salsa != null ? ["Salsa", yesNo2(det.salsa)] : null,
    det.developer != null ? ["Developer account", yesNo2(det.developer)] : null,
    det.facebookLinked != null ? ["Facebook linked", yesNo2(det.facebookLinked)] : null,
    det.violations != null ? ["Profile standing", det.violations ? `${det.violations} violation${det.violations === 1 ? "" : "s"}` : "No violations"] : null,
    ...((_e = det.privacy) != null ? _e : []).map(privacyRow),
    det.activeStatus ? ["Active status", esc(shout(det.activeStatus))] : null,
    det.horizonPlus != null ? ["Horizon+", det.horizonPlus ? "Subscribed" : "Not subscribed"] : null,
    ((_f = acct == null ? void 0 : acct.store) == null ? void 0 : _f.credit) ? ["Store credit", esc(acct.store.credit)] : null,
    ((_g = acct == null ? void 0 : acct.store) == null ? void 0 : _g.subscriptions) ? [
      "Subscriptions",
      acct.store.subscriptions.length ? acct.store.subscriptions.map(
        (x) => `${esc([x.app, x.name].filter(Boolean).join(" \u2014 "))}${x.active ? "" : " (ended)"}${x.next ? `<span class="home-stat-note">${esc(x.next)}</span>` : ""}`
      ).join("") : "None"
    ] : null,
    ((_h = acct == null ? void 0 : acct.store) == null ? void 0 : _h.pinSet) != null ? ["Store PIN", acct.store.pinSet ? "Set" : "Not set"] : null,
    ((_i = acct == null ? void 0 : acct.store) == null ? void 0 : _i.contentFilter) ? ["Store content filter", esc(shout(acct.store.contentFilter))] : null,
    det.voiceChannel ? [
      "Who can talk to you",
      esc(shout(String(det.voiceChannel).replace(/^VOICE_CHANNEL_/, ""))) + (det.voiceParental ? '<span class="home-stat-note">Set by a parent</span>' : "")
    ] : null,
    det.communities && (det.communities.adult != null || det.communities.minor != null) ? [
      "Can create communities",
      esc(
        [det.communities.adult ? "Adults only" : null, det.communities.minor ? "Open to teens" : null].filter(Boolean).join(" \xB7 ") || "No"
      )
    ] : null,
    /* Only for a supervised (Salsa) account: on any other it is a default that means nothing. */
    det.salsa && det.supervisionNotifications != null ? ["Supervision notifications", yesNo2(det.supervisionNotifications)] : null
  ].filter(Boolean) : [];
  const humanize = (v) => String(v).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
  const presenceRows = pres ? [
    pres.app ? [pres.current ? "Playing" : "Last in", esc(pres.app)] : null,
    pres.destinationName || pres.destination ? ["Destination", esc(pres.destinationName || humanize(pres.destination))] : null,
    pres.lobby || pres.match ? ["Session", [pres.lobby ? "In a lobby" : null, pres.match ? "In a match" : null].filter(Boolean).join(" \xB7 ")] : null,
    pres.party ? ["Party", `${pres.party} ${pres.party === 1 ? "person" : "people"}`] : null,
    ...Object.entries((_j = pres.facts) != null ? _j : {}).map(([k, v]) => [factLabel(k), esc(factValue(k, v))])
  ].filter(Boolean) : [];
  const activity = signed ? [
    extraOn("homePresence") ? ["Last active", lastActive] : null,
    ...presenceRows,
    ["Library", library2],
    worldsText ? ["Worlds you made", worldsText] : null
  ].filter(Boolean) : [];
  const browser = [
    signed ? ["Saved tokens", tokens] : null,
    ["Requests via", esc(relayHow)],
    repoCount ? ["GitHub sources", `${repoCount} linked`] : null
  ].filter(Boolean);
  const group = (title, rows) => rows.length ? `<div class="home-group"><h4>${esc(title)}</h4><dl class="home-stats">${rows.map(([k, v]) => `<div class="home-stat"><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join("")}</dl></div>` : "";
  const detailsBlock = details.length ? group("Account details", details) : signed && !(acct == null ? void 0 : acct.loading) && (prof == null ? void 0 : prof.detailsError) ? `<div class="home-group"><h4>Account details</h4><p class="home-empty">The store wouldn't give your account details: ${esc(prof.detailsError)}${(s.frlToken || "").trim() ? "" : " \u2014 saving your Meta token (Settings \u2192 Sign in with Meta) may help."}</p></div>` : "";
  const groups = detailsBlock + group("Activity", activity) + group("This browser", browser);
  const meName = (prof == null ? void 0 : prof.name) || (prof == null ? void 0 : prof.alias) || ((acct == null ? void 0 : acct.loading) ? "Loading your account\u2026" : "Signed in");
  const meInitial = esc(((prof == null ? void 0 : prof.name) || (prof == null ? void 0 : prof.alias) || "?").trim().charAt(0).toUpperCase());
  const reveal = (key, value, label, cls = "") => value ? homeShown.has(key) ? `<span class="${cls}">${esc(value)}</span>` : `<button type="button" class="home-reveal" data-home-reveal="${key}">${esc(label)}</button>` : null;
  const meSub = [
    (prof == null ? void 0 : prof.alias) && prof.alias !== prof.name ? `<span>@${esc(prof.alias)}</span>` : null,
    reveal("email", prof == null ? void 0 : prof.email, "Show email"),
    reveal("id", prof == null ? void 0 : prof.id, "Show account ID", "mono")
  ].filter(Boolean).join("");
  const mePic = (prof == null ? void 0 : prof.photo) ? `<img class="home-me-pic" src="${esc(prof.photo)}" alt="" data-letter="${meInitial}">` : `<span class="home-me-pic home-me-pic--ph" aria-hidden="true">${meInitial}</span>`;
  const bgUri = ((_k = prof == null ? void 0 : prof.background) == null ? void 0 : _k.uri) && s.images ? prof.background.uri : null;
  const me = signed ? `<div class="home-me${bgUri ? " home-me--bg" : ""}">
        ${bgUri ? `<div class="home-me-media"><img class="home-me-bg" src="${esc(bgUri)}" alt="Your profile background" loading="lazy">${mePic}</div>` : mePic}
        <div class="home-me-text">
          <div class="home-me-name">${esc(meName)}</div>
          ${meSub ? `<div class="home-me-alias">${meSub}</div>` : ""}
        </div>
      </div>` : `<div class="home-me">
        <span class="home-me-pic home-me-pic--ph" aria-hidden="true">?</span>
        <div class="home-me-text">
          <div class="home-me-name">Not signed in</div>
          <div class="home-me-alias">Sign in to see your account details and library.</div>
        </div>
      </div>`;
  el.homeBody.innerHTML = `
    <div class="home-dash">
      <section class="home-panel">
        <div class="home-ph"><h3>Watchlist</h3>${watch.length ? `<a class="home-more" href="/watchlist" data-view="watchlist">${watch.length} watched${updatedCount ? ` \xB7 ${updatedCount} new` : ""}</a>` : ""}</div>
        ${watch.length ? `<div class="home-list">${wlRows}</div>${wl.length > 6 ? `<a class="home-more home-more--foot" href="/watchlist" data-view="watchlist">and ${wl.length - 6} more</a>` : ""}` : `<p class="home-empty">No apps watched yet. Open an app and press Watch to track its builds here.</p>`}
      </section>

      <section class="home-panel">
        <div class="home-ph"><h3>Recently viewed</h3></div>
        ${recent.length ? `<div class="home-list">${recentRows}</div>` : `<p class="home-empty">${watch.length ? "Apps you open that aren't on your watchlist show up here." : "Apps you open show up here, so you can jump back to them."}</p>`}
      </section>
    </div>

    <section class="home-acct" aria-label="Your account">
      <div class="home-ph">
        <h3>Your account</h3>
        ${signed ? `<a class="home-more" href="/settings" data-view="settings">Settings</a>` : `<a class="home-btn home-btn--sm" href="/settings" data-view="settings">Sign in</a>`}
      </div>
      ${me}
      ${groups}
    </section>`;
  (_l = el.homeBody.querySelector(".home-me-bg")) == null ? void 0 : _l.addEventListener("error", (e) => {
    var _a4;
    (_a4 = e.target.closest(".home-me")) == null ? void 0 : _a4.classList.remove("home-me--bg");
    e.target.remove();
  });
  for (const b of el.homeBody.querySelectorAll("[data-home-reveal]")) {
    b.addEventListener("click", () => {
      homeShown.add(b.dataset.homeReveal);
      renderHome();
    });
  }
  const pic = el.homeBody.querySelector("img.home-me-pic");
  if (pic) {
    pic.addEventListener("error", () => {
      const ph = document.createElement("span");
      ph.className = "home-me-pic home-me-pic--ph";
      ph.setAttribute("aria-hidden", "true");
      ph.textContent = pic.dataset.letter || "?";
      pic.replaceWith(ph);
    }, { once: true });
  }
  for (const img of el.homeBody.querySelectorAll("img.home-ic")) {
    const fallBack = () => {
      const ph = document.createElement("span");
      ph.className = "home-ic home-ic--ph";
      ph.setAttribute("aria-hidden", "true");
      ph.textContent = img.dataset.letter || "?";
      img.replaceWith(ph);
    };
    if (img.complete && !img.naturalWidth) fallBack();
    else img.addEventListener("error", fallBack, { once: true });
  }
  fillMissingIcons([...el.homeBody.querySelectorAll(".home-appline")].map((a) => {
    var _a4;
    return {
      id: a.dataset.appid,
      name: ((_a4 = a.querySelector(".home-appnm")) == null ? void 0 : _a4.textContent) || "",
      ph: a.querySelector(".home-ic--ph")
    };
  }));
}
function saveAppImage(id, image) {
  try {
    const sid = String(id);
    const w = readWatch();
    let changed = false;
    for (const e of w) if (e.id === sid && !e.image) {
      e.image = image;
      changed = true;
    }
    if (changed) saveWatch(w);
    const r = readRecent();
    let changed2 = false;
    for (const e of r) if (e.id === sid && !e.image) {
      e.image = image;
      changed2 = true;
    }
    if (changed2) localStorage.setItem(RECENT_KEY, JSON.stringify(r));
  } catch {
  }
}
async function fetchAppIcon(id, name) {
  var _a3, _b3;
  const byId = await appIcon(id);
  if (byId) return byId;
  try {
    const hits = await searchStore(String(name), { limit: 20 });
    return (_b3 = (_a3 = hits.find((r) => String(r.id) === String(id))) == null ? void 0 : _a3.image) != null ? _b3 : null;
  } catch {
    return null;
  }
}
async function fillMissingIcons(items) {
  const need = (items || []).filter((x) => x && x.id && x.name && x.ph && x.ph.isConnected && !iconTried.has(x.id));
  if (!need.length) return;
  for (const x of need) iconTried.add(x.id);
  await mapLimit(need, 4, async (x) => {
    const image = await fetchAppIcon(x.id, x.name);
    if (!image) return;
    iconCache.set(String(x.id), image);
    saveAppImage(x.id, image);
    if (!x.ph.isConnected) return;
    const base = [...x.ph.classList].filter((c) => !c.endsWith("--ph")).join(" ") || "home-ic";
    const img = document.createElement("img");
    img.className = base;
    img.loading = "lazy";
    img.alt = "";
    img.dataset.letter = x.ph.textContent || "?";
    img.src = image;
    img.addEventListener("error", () => {
      if (img.isConnected) img.replaceWith(x.ph);
    }, { once: true });
    x.ph.replaceWith(img);
  });
}
function renderWatch() {
  var _a3, _b3;
  if (!el.watchRows) return;
  const list = readWatch();
  const busy = sweepWatch.busy;
  const livePanels = /* @__PURE__ */ new Map();
  for (const d of el.watchRows.querySelectorAll(":scope > tr.detail")) {
    const id = (_a3 = d.previousElementSibling) == null ? void 0 : _a3.dataset.id;
    if (id) livePanels.set(id, d);
  }
  const letter = (w) => esc((w.name || "?").trim().charAt(0).toUpperCase());
  const icon = (w) => iconCache.get(w.id) || w.image ? `<img class="wl-ic" src="${esc(iconCache.get(w.id) || w.image)}" alt="" loading="lazy" data-letter="${letter(w)}">` : `<span class="wl-ic wl-ic--ph" aria-hidden="true">${letter(w)}</span>`;
  const buildCell = (ver, date, cls = "") => ver == null && date == null ? `<span class="wl-dash">\u2014</span>` : `<span class="wl-b ${cls}"><span class="wl-bv mono">${ver ? `v${esc(ver)}` : "\u2014"}</span><span class="wl-bd">${date ? esc(date) : ""}</span></span>`;
  const ordered = [...list].sort(
    (a, b) => (watchUpdated(b) ? 1 : 0) - (watchUpdated(a) ? 1 : 0)
  );
  el.watchRows.innerHTML = ordered.map((w) => {
    const up = watchUpdated(w);
    const newCell = up ? buildCell(w.latestVer, w.latestAt, "wl-new") : w.error ? `<span class="wl-fail">Couldn't check</span>` : w.latest == null ? `<span class="wl-dash">Not checked yet</span>` : `<span class="wl-stale">Not updated${w.seenAt ? ` since <span class="wl-ver">${esc(w.seenAt)}</span>` : ""}</span>`;
    return `<tr class="watch-row${up ? " is-updated" : ""}" data-id="${esc(w.id)}" tabindex="0" aria-expanded="false">
        <td class="wl-app"><span class="wl-appwrap">${icon(w)}<span class="wl-nm">${esc(w.name)}</span></span></td>
        <td>${buildCell(w.seenVer, w.seenAt)}</td>
        <td>${newCell}</td>
        <td class="wl-act">
          ${up ? `<button type="button" class="linkbtn" data-watch-seen="${esc(w.id)}">Mark seen</button>` : ""}
          <button type="button" class="wl-rm" data-watch-remove="${esc(w.id)}" title="Remove ${esc(w.name)} from your watchlist" aria-label="Remove ${esc(w.name)} from your watchlist">\xD7</button>
        </td>
      </tr>`;
  }).join("");
  for (const img of el.watchRows.querySelectorAll("img.wl-ic")) {
    const fallBack = () => {
      const ph = document.createElement("span");
      ph.className = "wl-ic wl-ic--ph";
      ph.setAttribute("aria-hidden", "true");
      ph.textContent = img.dataset.letter || "?";
      img.replaceWith(ph);
    };
    if (img.complete && !img.naturalWidth) fallBack();
    else img.addEventListener("error", fallBack, { once: true });
  }
  fillMissingIcons([...el.watchRows.querySelectorAll("tr.watch-row")].map((tr) => {
    var _a4;
    return {
      id: tr.dataset.id,
      name: ((_a4 = tr.querySelector(".wl-nm")) == null ? void 0 : _a4.textContent) || "",
      ph: tr.querySelector(".wl-ic--ph")
    };
  }));
  for (const tr of el.watchRows.querySelectorAll("tr.watch-row")) {
    const w = list.find((x) => x.id === tr.dataset.id);
    if (w && open.has("watchlist:" + w.id)) {
      tr.after((_b3 = livePanels.get(w.id)) != null ? _b3 : detailRow(appFromWatch(w), 4, "watchlist"));
      tr.setAttribute("aria-expanded", "true");
    }
  }
  el.watchEmpty.hidden = list.length > 0;
  el.watchEmpty.textContent = "Nothing on your watchlist yet. Open any app and press Watch to track its builds.";
  const updates = watchUpdateCount();
  el.watchCount.textContent = busy ? "Checking your watchlist\u2026" : !list.length ? "" : `${list.length} app${list.length === 1 ? "" : "s"} watched` + (updates ? ` \u2014 ${updates} with a new build` : "");
  el.watchCount.classList.toggle("has-updates", !busy && updates > 0);
  el.watchCheck.disabled = busy || !list.length;
  el.watchMarkAll.disabled = busy || updates === 0;
}
function toggleWatchDetail(row) {
  const w = readWatch().find((x) => x.id === row.dataset.id);
  if (!w) return;
  const key = "watchlist:" + w.id;
  const next = row.nextElementSibling;
  if (next == null ? void 0 : next.classList.contains("detail")) {
    open.delete(key);
    next.remove();
    row.setAttribute("aria-expanded", "false");
  } else {
    open.add(key);
    row.after(detailRow(appFromWatch(w), 4, "watchlist"));
    row.setAttribute("aria-expanded", "true");
  }
}
function initWatch() {
  var _a3, _b3, _c, _d;
  (_a3 = el.watchCheck) == null ? void 0 : _a3.addEventListener("click", () => sweepWatch({ force: true }));
  (_b3 = el.watchMarkAll) == null ? void 0 : _b3.addEventListener("click", () => {
    for (const w of readWatch()) markWatchSeen(w.id);
    updateWatchBadge();
    renderWatch();
  });
  (_c = el.watchRows) == null ? void 0 : _c.addEventListener("click", (e) => {
    const seen = e.target.closest("[data-watch-seen]");
    if (seen) {
      markWatchSeen(seen.dataset.watchSeen);
      updateWatchBadge();
      renderWatch();
      return;
    }
    const rm = e.target.closest("[data-watch-remove]");
    if (rm) {
      removeWatch(rm.dataset.watchRemove);
      updateWatchBadge();
      renderWatch();
      return;
    }
    const row = e.target.closest("tr.watch-row");
    if (row) toggleWatchDetail(row);
  });
  (_d = el.watchRows) == null ? void 0 : _d.addEventListener("keydown", (e) => {
    var _a4, _b4;
    const row = (_b4 = (_a4 = e.target).closest) == null ? void 0 : _b4.call(_a4, "tr.watch-row");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      toggleWatchDetail(row);
    }
  });
  updateWatchBadge();
  setTimeout(() => {
    if (!el.viewWatchlist.hidden) renderWatch();
  }, 0);
  if (loadSettings().watchAuto) {
    setTimeout(() => sweepWatch(), 0);
  }
}
var SETUP_PANELS = [
  ["reviews", "Reviews"],
  ["posts", "Posts"],
  ["addons", "Add-ons"],
  ["achievements", "Achievements"],
  ["leaderboards", "Leaderboards"],
  ["cloud", "Cloud"]
];
var SETUP_EXTRAS = [
  ["homeSettings", "Dashboard: voice and community settings"],
  ["homeHplus", "Dashboard: Horizon+ status"],
  ["homeStore", "Dashboard: store credit, subscriptions and store PIN"],
  ["homePresence", "Dashboard: last active and what you are doing"],
  ["homeWorlds", "Dashboard: worlds you made"],
  ["homeBackground", "Dashboard: your profile's background picture"],
  ["fullFollows", "People: complete follower lists (two more requests)"],
  ["metTimes", "People: when you last met someone"],
  ["personCounts", "People: follower counts on a profile"],
  ["personPhotos", "People: photos for everyone the list has none for (one more request)"],
  ["traits", "Apps: store traits (gameplay, art style\u2026)"],
  ["destinations", "Apps: destinations inside the app"],
  ["related", "Apps: more like this"],
  ["bundles", "Apps: bundles it is included in"],
  ["worldExtras", "Worlds: genres, rating and similar worlds"],
  ["submissions", "Apps: open a revision for its build, listing and what changed"]
];
var SETUP_DATA = [
  ["images", "App art in search results"],
  ["store", "\u201COpen in store\u201D links"],
  ["details", "\u201CLatest Binary Info\u201D button"],
  ["devDownloads", "Developer (non-channel) builds"],
  ["obb", "Fetch OBB files for builds that need them"],
  ["autoOwned", "Fetch your Quest and PC libraries on load to mark owned apps"],
  ["autoDlc", "Fetch your DLC automatically"],
  ["autoPlaytime", "Fetch your playtime automatically"],
  ["autoBackups", "Fetch your cloud backups automatically"]
];
var setupCheckbox = (kind, name, label, checked) => `<label class="check"><input type="checkbox" data-kind="${kind}" data-feat="${esc(name)}"${checked ? " checked" : ""}> ${esc(label)}</label>`;
function buildSetup() {
  const opts = loadSettings();
  const secOff = new Set(opts.sectionsOff);
  const panOff = new Set(opts.panelsOff);
  el.setupSections.innerHTML = screenList().map(([v, label]) => setupCheckbox("section", v, label, !secOff.has(v))).join("");
  el.setupPanels.innerHTML = SETUP_PANELS.map(([name, label]) => setupCheckbox("panel", name, label, !panOff.has(name))).join("");
  el.setupData.innerHTML = SETUP_DATA.map(([name, label]) => setupCheckbox("data", name, label, Boolean(opts[name]))).join("");
  const extOff = new Set(opts.extrasOff);
  if (el.setupExtras)
    el.setupExtras.innerHTML = SETUP_EXTRAS.map(([name, label]) => setupCheckbox("extra", name, label, !extOff.has(name))).join("");
}
function openSetup() {
  var _a3;
  buildSetup();
  el.setupOverlay.hidden = false;
  document.documentElement.classList.add("setup-open");
  (_a3 = el.setupSave) == null ? void 0 : _a3.focus();
}
function closeSetup() {
  el.setupOverlay.hidden = true;
  document.documentElement.classList.remove("setup-open");
}
function saveSetup() {
  const sectionsOff = [];
  const panelsOff = [];
  const extrasOff = [];
  const dataPatch = {};
  for (const input of el.setupOverlay.querySelectorAll("input[data-feat]")) {
    const { kind, feat } = input.dataset;
    if (kind === "section") {
      if (!input.checked) sectionsOff.push(feat);
    } else if (kind === "panel") {
      if (!input.checked) panelsOff.push(feat);
    } else if (kind === "extra") {
      if (!input.checked) extrasOff.push(feat);
    } else if (kind === "data") {
      dataPatch[feat] = input.checked;
    }
  }
  saveSettings({ ...dataPatch, sectionsOff, panelsOff, extrasOff, setupDone: true });
  for (const [name] of SETUP_DATA) {
    const node = document.getElementById(name);
    if (node) node.checked = dataPatch[name];
  }
  closeSetup();
  applyFeatureVisibility();
  applyColumns();
  updateWatchBadge();
  renderAll();
  applyView();
}
function initSetup() {
  var _a3, _b3, _c;
  (_a3 = el.openSetup) == null ? void 0 : _a3.addEventListener("click", openSetup);
  (_b3 = el.setupSave) == null ? void 0 : _b3.addEventListener("click", saveSetup);
  (_c = el.setupAll) == null ? void 0 : _c.addEventListener("click", () => {
    for (const input of el.setupOverlay.querySelectorAll("input[data-feat]")) input.checked = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.setupOverlay && !el.setupOverlay.hidden) {
      e.preventDefault();
      saveSetup();
    }
  });
  if (!loadSettings().setupDone) setTimeout(openSetup, 0);
}
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
  var _a3, _b3, _c, _d;
  const nums = (v) => String(v != null ? v : "").split(/[^0-9]+/).filter(Boolean).map(Number);
  const x = nums(a), y = nums(b);
  if (!x.length || !y.length) return null;
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (((_a3 = x[i]) != null ? _a3 : 0) !== ((_b3 = y[i]) != null ? _b3 : 0)) return ((_c = x[i]) != null ? _c : 0) - ((_d = y[i]) != null ? _d : 0);
  }
  return 0;
}
var sameVersion = (tag, installed) => installed != null && String(tag).replace(/^v/i, "").toLowerCase() === String(installed).replace(/^v/i, "").toLowerCase();
function ghInstall(app, assetId, button, { save = false } = {}) {
  var _a3, _b3;
  const repo = repoOf(app);
  const found = ((_b3 = (_a3 = dgState.releases.get(repo)) == null ? void 0 : _a3.items) != null ? _b3 : []).flatMap((r) => r.assets.map((a) => ({ r, a }))).find(({ a }) => a.id === assetId);
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
    var _a3;
    return {
      id: a.id,
      packageName: a.packageName,
      name: a.name,
      image: a.image,
      platform: a.platform,
      latest: (_a3 = a.latest) != null ? _a3 : null,
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
  var _a3, _b3, _c, _d;
  const owned = ownedByPackage();
  const want = [...new Set(pkgs)].filter(
    (p) => {
      var _a4;
      return p && !((_a4 = owned.get(p)) == null ? void 0 : _a4.image) && (!storeArt.has(p) || storeArt.get(p) && !storeArt.get(p).image && !storeArtTried.has(p));
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
      var _a4;
      return (_a4 = known.get(p)) == null ? void 0 : _a4.id;
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
          image = (_b3 = (_a3 = (await searchStore(name, { limit: 10 })).find((r) => r.id === String(hit.id))) == null ? void 0 : _a3.image) != null ? _b3 : null;
        } catch {
        }
      }
      if (!image) {
        try {
          const media2 = (await appPage(hit.id)).media;
          const pick = (labels) => {
            var _a4;
            return (_a4 = media2.find((m) => labels.includes(m.label))) == null ? void 0 : _a4.uri;
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
  var _a3, _b3;
  const known = (_a3 = dgApp(pkg)) != null ? _a3 : mineList.find((a) => a.packageName === pkg);
  if (known == null ? void 0 : known.image) return known;
  if ((_b3 = storeArt.get(pkg)) == null ? void 0 : _b3.image) return storeArt.get(pkg);
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
    var _a3, _b3;
    return !q || ((_a3 = a.name) != null ? _a3 : "").toLowerCase().includes(q) || ((_b3 = a.packageName) != null ? _b3 : "").toLowerCase().includes(q);
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
      var _a3, _b3;
      return `<li><button type="button" class="dg-app" data-dg-app="${esc(a.packageName)}"
          aria-current="${a.packageName === dgState.selected}">${dgArt(a)}
          <span class="dg-text"><span class="dg-name">${esc(a.name)}</span>
          <span class="dg-ver">${esc((_a3 = a.installedVersion) != null ? _a3 : "\u2014")} \xB7 ${(_b3 = a.installedVersionCode) != null ? _b3 : "\u2014"}</span></span>${adbBehind(a) ? `<span class="dg-new">Update</span>` : ""}</button></li>`;
    }
  ).join("");
  el.dgMoreH.hidden = !more.length;
  el.dgMore.innerHTML = more.map(
    (a) => {
      var _a3, _b3, _c, _d;
      return `<li><button type="button" class="dg-app" data-dg-app="${esc(a.packageName)}"
          aria-current="${a.packageName === dgState.selected}">${dgArt(a)}
          <span class="dg-text"><span class="dg-name">${esc(a.name)}</span>
          <span class="dg-ver">${esc((_b3 = (_a3 = a.latest) == null ? void 0 : _a3.version) != null ? _b3 : "\u2014")} \xB7 ${(_d = (_c = a.latest) == null ? void 0 : _c.versionCode) != null ? _d : "\u2014"}</span></span></button></li>`;
    }
  ).join("");
  const repoOnly = Object.entries(readRepos()).filter(([key]) => !adbSide.some((x) => x.packageName === key)).map(([key, r]) => ({ key, name: r.name || r.repo, repo: r.repo, packageName: key.startsWith("gh:") ? "" : key })).filter(hit).sort((a, b) => a.name.localeCompare(b.name));
  el.dgSide.innerHTML = side.map((a) => {
    var _a3, _b3;
    const kept = dgState.backups.filter((k) => k.packageName === a.packageName).length;
    return `<li><button type="button" class="dg-app" data-dg-app="${esc(a.packageName)}"
          aria-current="${a.packageName === dgState.selected}">${dgArt({ image: dgHeadsetIcon(a.packageName) })}
          <span class="dg-text"><span class="dg-name">${esc(a.name)}</span>
          <span class="dg-ver">${esc((_a3 = a.version) != null ? _a3 : "\u2014")} \xB7 ${(_b3 = a.versionCode) != null ? _b3 : "\u2014"}</span></span>${kept ? `<span class="dg-new dg-off">${plural(kept, "backup")}</span>` : ""}</button></li>`;
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
  var _a3;
  return (_a3 = dgState.backups.find(
    (k) => binaryId && k.binaryId === String(binaryId) || k.packageName === pkg && k.versionCode === code
  )) != null ? _a3 : null;
}
function dgRenderDetail() {
  var _a3;
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
      var _a4, _b3, _c;
      const current = b.versionCode === app.installedVersionCode;
      const older = app.installedVersionCode && b.versionCode < app.installedVersionCode;
      const kept = dgKept(app.packageName, b.versionCode, b.id);
      const job = (k) => appInstalls.has(k) ? ` data-job="${esc(k)}"` : "";
      const keep = kept ? `<span class="dg-saved" title="Kept on this headset \u2014 installs with no download">Saved</span>` : current ? `<button type="button" class="dl dl-obb" data-backup-installed${job(`backup:${app.packageName}`)}
                title="Keep a copy of the version on this headset, expansion file and all">Back up</button>` : `<button type="button" class="dl dl-obb" data-save-build="${esc(b.id)}" data-version="${esc(b.version)}"${job(`save:${b.id}`)}
                title="Download ${esc(b.version)} and keep it here, without installing it">Save</button>`;
      const action = current ? `<span class="on-headset">On headset</span>` : `<button type="button" class="dl" data-install-build="${esc(b.id)}"${job(`install:${b.id}`)}
              data-version="${esc(b.version)}" data-code="${(_a4 = b.versionCode) != null ? _a4 : ""}"
              title="${esc(older ? `Go back to ${b.version} \u2014 uninstalls first, deleting this app's saved data` : `Install ${b.version}`)}">${older ? "Downgrade" : app.installedVersionCode == null ? "Install" : "Update"}</button>`;
      return `<tr${current ? ` class="dg-current"` : ""}>
            <td class="num">${esc(b.version)}${obbs.has(String(b.id)) ? `<span class="dg-obb">+ OBB</span>` : ""}</td>
            <td class="num">${(_b3 = b.versionCode) != null ? _b3 : "\u2014"}</td>
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
      <p class="dg-now">${app.installedVersionCode == null ? "Not installed on this headset" : `On this headset: ${esc((_a3 = app.installedVersion) != null ? _a3 : "\u2014")} (build ${app.installedVersionCode})`}</p></div>${app.installedVersionCode == null ? "" : dgHeadActions(app)}
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
  var _a3, _b3, _c;
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
        <div><h2>${esc(app.name)}</h2><div class="dg-pkg">${esc((_a3 = app.packageName) != null ? _a3 : app.repo)}</div>
        <p class="dg-now">Not installed on this headset</p></div>
      </div>
      ${dgGithubSection(app)}`;
    return;
  }
  const kept = dgState.backups.filter((b) => b.packageName === app.packageName).sort((x, y) => y.versionCode - x.versionCode);
  el.dgDetail.innerHTML = `<div class="dg-head">${dgArt({ image: dgHeadsetIcon(app.packageName) })}
      <div><h2>${esc(app.name)}</h2><div class="dg-pkg">${esc(app.packageName)}</div>
      <p class="dg-now">On this headset: ${esc((_b3 = app.installedVersion) != null ? _b3 : "\u2014")} (build ${(_c = app.installedVersionCode) != null ? _c : "\u2014"})</p></div>${dgHeadActions(app)}
    </div>
    <p class="dg-warn">Not in the store. If it publishes its APKs on GitHub, its versions can be listed below; either way a copy of it can be kept, and put back later. Going back to an older version uninstalls the app first, which deletes its saved data on this headset.</p>
    ${dgGithubSection(app)}
    <h3 class="dg-group">Kept on this headset</h3>
    ${kept.length ? dgBackupTable(kept, app.installedVersionCode) : `<p class="dg-empty">No copies of it yet. Back up keeps one.</p>`}`;
}
function dgBackupGroups() {
  var _a3, _b3;
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
      g.name = ((_a3 = owned.get(g.packageName)) == null ? void 0 : _a3.name) || ((_b3 = storeArt.get(g.packageName)) == null ? void 0 : _b3.name) || g.name;
    }
  }
  return [...groups.values()].sort((x, y) => x.name.localeCompare(y.name));
}
function dgRenderBackups(hit) {
  var _a3;
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
  dgRenderBackupDetail((_a3 = groups.find((g) => g.packageName === dgState.backupSel)) != null ? _a3 : null);
}
function dgRenderBackupDetail(g) {
  var _a3;
  if (!g) {
    el.dgBackupDetail.innerHTML = dgState.backups.length ? `<p class="dg-empty">Pick an app to see the versions kept of it.</p>` : "";
    return;
  }
  const have = installedCode(g.packageName);
  el.dgBackupDetail.innerHTML = `<div class="dg-head">${dgArt(dgArtFor(g.packageName, g.items[0].id))}
      <div><h2>${esc(g.name)}</h2><div class="dg-pkg">${esc(g.packageName)}</div>
      <p class="dg-now">${have >= 0 ? `On this headset: ${esc((_a3 = installedName(g.packageName)) != null ? _a3 : "\u2014")} (build ${have})` : "Not installed on this headset"}</p></div>
    </div>
    <p class="dg-warn">Installing from a backup needs no download, and works signed out. Going back to an older build uninstalls the app first, which deletes its saved data on this headset.</p>
    ${dgBackupTable(g.items, have)}`;
}
function dgBackupTable(items, have) {
  have = have != null ? have : -1;
  const rows = items.map((b) => {
    var _a3, _b3;
    const current = have === b.versionCode;
    const key = `restore:${b.id}`;
    const queued = appInstalls.get(key);
    const job = queued ? ` data-job="${esc(key)}"` : "";
    const action = current ? `<span class="on-headset">On headset</span>` : `<button type="button" class="dl" data-restore="${esc(b.id)}"${job}
            title="${esc(have > b.versionCode ? `Go back to ${b.version} \u2014 uninstalls first, deleting this app's saved data` : `Install ${b.version} from this backup \u2014 no download`)}">${have < 0 ? "Install" : have > b.versionCode ? "Downgrade" : "Update"}</button>`;
    const from = b.source === "headset" ? "This headset" : b.source === "file" ? "Your APK" : "Download";
    return `<tr${current ? ` class="dg-current"` : ""}>
          <td class="num">${esc(b.version)}${((_a3 = b.obbs) == null ? void 0 : _a3.length) ? `<span class="dg-obb">+ OBB</span>` : ""}</td>
          <td class="num">${b.versionCode}</td>
          <td class="num">${new Date(b.savedAt).toISOString().slice(0, 10)}</td>
          <td title="${esc((_b3 = b.fileName) != null ? _b3 : "")}">${from}</td>
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
    var _a3, _b3;
    return v ? `${esc((_a3 = v.version) != null ? _a3 : "\u2014")} <span class="dg-obb">${esc((_b3 = v.code) != null ? _b3 : "")}</span>` : "\u2014";
  };
  const art = /* @__PURE__ */ new Map();
  const artFor = (pkg, backup) => {
    const key = `${pkg}|${backup != null ? backup : ""}`;
    if (!art.has(key)) art.set(key, dgArt(dgArtFor(pkg, backup)));
    return art.get(key);
  };
  el.dgHistoryRows.innerHTML = shown.map(
    (h) => {
      var _a3, _b3, _c, _d, _e;
      return `<tr>
          <td class="num">${new Date(h.at).toISOString().slice(0, 16).replace("T", " ")}</td>
          <td class="name"><span class="dg-cell">${artFor(h.packageName, (_a3 = h.backup) != null ? _a3 : null)}${esc((_c = (_b3 = h.name) != null ? _b3 : h.packageName) != null ? _c : "\u2014")}</span></td>
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
  var _a3;
  (_a3 = document.getElementById("getappAdb")) == null ? void 0 : _a3.addEventListener("click", installAppOverAdb);
  if (!IN_APP) return;
  el.dgAppUpdate.addEventListener("click", () => offerAppUpdate(el.dgAppUpdate));
  document.getElementById("appCheck").addEventListener("click", () => checkAppUpdate({ quiet: false }));
  setTimeout(() => checkAppUpdate(), 1500);
}
function appOwnVersion() {
  var _a3, _b3, _c;
  try {
    return JSON.parse((_c = (_b3 = (_a3 = window.MetaDBApp).appVersion) == null ? void 0 : _b3.call(_a3)) != null ? _c : "{}");
  } catch {
    return {};
  }
}
async function checkAppUpdate({ quiet = true } = {}) {
  var _a3, _b3, _c;
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
    if (res.ok && /json/.test((_a3 = res.headers.get("content-type")) != null ? _a3 : "")) info = await res.json();
  } catch {
  }
  appUpdate = info && mine.versionCode && Number(info.versionCode) > Number(mine.versionCode) ? info : null;
  el.dgAppUpdate.hidden = !appUpdate;
  if (appUpdate) el.dgAppUpdate.textContent = `Update MetaDB to ${appUpdate.version}`;
  document.getElementById("appVersionText").textContent = `MetaDB ${(_b3 = mine.versionName) != null ? _b3 : "?"} (build ${(_c = mine.versionCode) != null ? _c : "?"})` + (info ? ` \xB7 newest published: ${info.version} (build ${info.versionCode})` : "");
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
var UPD_KEY = "metadb.updaterOpts";
var updBox = (key, label, group, extra = {}) => ({ key, label, group, ...extra });
var UPD_HOST = "graph.oculus.com";
var UPD_PATH = "/firmware_ota_update";
var UPD_GROUPS = [
  ["where", "Token"],
  ["device", "The headset"],
  ["fields", "Inside fields"],
  ["sent", "Sent as written"]
];
var UPD_WHERE = [
  updBox("token", "access_token", "where", { secret: true, placeholder: "your updater token", hint: "Empty sends your saved updater token (made from your FRL token if there is none). frl sends your FRL token itself; public sends the updater app's own token." })
];
var UPD_DEVICE = [
  updBox("device_serial", "device_serial", "device", { param: true, area: true, hint: "One a line, or comma-separated, to check several." }),
  updBox("device_type", "device_type", "device", { param: true, list: "updTypes", placeholder: "ota.eureka.user" })
];
var UPD_TAIL = [
  updBox("also", "Other fields", "fields", { fill: "update_interval", placeholder: "update_interval", hint: "Put in front of the rest of fields, comma-separated." }),
  updBox("fields", "fields", "sent", { param: true, area: true, fields: true, hint: "Built from Inside fields until you type in it." }),
  updBox("extra", "Extra parameters", "sent", { area: true, placeholder: "name=value, one a line", hint: "Sent as they are, and win over a box of the same name." })
];
var UPD_ADV = {
  os: {
    root: "ota",
    boxes: [
      ...UPD_WHERE,
      ...UPD_DEVICE,
      updBox("version", "version", "device", { param: true, fill: "1", hint: "The build the headset is on. 1 is any build." }),
      updBox("device_managed_mode", "device_managed_mode", "device", { param: true, fill: "-1", hint: "-1 an ordinary headset, 3 paired to a local update source, 4 postponed by policy." }),
      updBox("full_update_only", "full_update_only", "device", { param: true, fill: "false", hint: "true asks for a whole OS image." }),
      updBox("sdk_version", "sdk_version", "fields", { part: true, hint: "34 on Android 14." }),
      updBox("security_patch_time", "security_patch_time", "fields", { part: true, placeholder: "YYYY-MM-DD" }),
      updBox("show_all_paths", "show_all_paths", "fields", { part: true, fill: "true", hint: "false returns only the next step from version." }),
      updBox("minor_release_only", "minor_release_only", "fields", { part: true, hint: "In the app, never sent by the headset." }),
      updBox("selection", "Selection", "fields", { area: true, fill: OTA_SELECTION, placeholder: "{download_uri,target_version,\u2026}", hint: "What Meta returns for each build." }),
      ...UPD_TAIL
    ]
  },
  build: {
    root: "ota",
    boxes: [
      ...UPD_WHERE,
      ...UPD_DEVICE.map((b) => b.key === "device_serial" ? { ...b, area: false, hint: "One serial." } : b),
      updBox("version", "version", "device", { param: true, fill: "1", hint: "The build the headset is on. Empty sends 1 \u2014 Meta refuses this check without it." }),
      updBox("device_managed_mode", "device_managed_mode", "device", { param: true, fill: "-1", hint: "-1 an ordinary headset, 4 postponed by policy." }),
      updBox("full_update_only", "full_update_only", "device", { param: true, fill: "false" })
    ]
  }
};
var UPD_SECTIONS = [
  ["os", "OS build", "Which OS builds Meta's updater would hand the headset, each with its download."],
  ["build", "Specific build", "Ask for a build by its number, or count up from a build incremental to find the builds Meta has."]
];
function updDefaults() {
  const adv = {};
  for (const [sec, { boxes }] of Object.entries(UPD_ADV)) {
    adv[sec] = Object.fromEntries(boxes.filter((b) => !b.secret).map((b) => [b.key, ""]));
  }
  return {
    mode: "easy",
    easy: { serials: [] },
    find: { build: "", sweepBuild: "", prefix: "", from: "", to: "", suffix: "", rate: "2", workers: "2" },
    adv,
    edited: { os: false, build: false }
  };
}
function loadUpd() {
  const d = updDefaults();
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(UPD_KEY) || "{}") || {};
  } catch {
  }
  const pick = (o) => o && typeof o === "object" && !Array.isArray(o) ? o : {};
  return {
    mode: saved.mode === "advanced" ? "advanced" : "easy",
    easy: { ...d.easy, ...pick(saved.easy) },
    find: { ...d.find, ...pick(saved.find) },
    adv: Object.fromEntries(Object.keys(d.adv).map((s) => [s, { ...d.adv[s], ...pick(pick(saved.adv)[s]) }])),
    edited: { ...d.edited, ...pick(saved.edited) }
  };
}
function saveUpd(opts) {
  try {
    localStorage.setItem(UPD_KEY, JSON.stringify(opts));
  } catch {
  }
}
function editUpd(change) {
  const now = loadUpd();
  change(now);
  saveUpd(now);
  return now;
}
var updTokens = {};
function otaTypeFor(device) {
  const code = String(device.deviceType || "").replace(/^OCULUS_/, "");
  const hit = otaCatalogFor(device);
  return hit ? hit.type : code ? `ota.${code.toLowerCase()}.user` : "";
}
function otaCatalogFor(device) {
  const code = String(device.deviceType || "").replace(/^OCULUS_/, "");
  if (code === "PANTHER" && /xbox/i.test(device.model || "")) return OTA_DEVICE_TYPES.find((t) => t.hmd === "XSE_PANTHER");
  return OTA_DEVICE_TYPES.find((t) => {
    var _a3;
    return t.hmd === code || ((_a3 = t.hwm) == null ? void 0 : _a3.includes(code));
  });
}
function updBuildFields(sec, v) {
  var _a3, _b3;
  const { root, boxes } = UPD_ADV[sec];
  const mods = boxes.filter((b) => {
    var _a4;
    return b.part && String((_a4 = v[b.key]) != null ? _a4 : "").trim() !== "";
  }).map((b) => `.${b.key}(${String(v[b.key]).trim()})`).join("");
  const sel = String((_a3 = v.selection) != null ? _a3 : "").trim();
  const main = mods || sel ? `${root}${mods}${sel}` : "";
  return [String((_b3 = v.also) != null ? _b3 : "").trim(), main].filter(Boolean).join(",");
}
var updSerials = (text) => String(text || "").split(/[\s,]+/).filter(Boolean);
function updAdvRequests(sec, opts) {
  var _a3, _b3;
  const v = opts.adv[sec];
  const fields = opts.edited[sec] ? String((_a3 = v.fields) != null ? _a3 : "").trim() : updBuildFields(sec, v);
  const base = {};
  for (const b of UPD_ADV[sec].boxes) {
    if (!b.param || b.key === "device_serial") continue;
    const val = b.fields ? fields : String((_b3 = v[b.key]) != null ? _b3 : "").trim();
    if (val !== "") base[b.key] = val;
  }
  for (const line of String(v.extra || "").split("\n")) {
    const m = line.match(/^\s*([^=\s][^=]*?)\s*=\s*(.*?)\s*$/);
    if (m) base[m[1]] = m[2];
  }
  const serials = updSerials(v.device_serial);
  const one = (serial) => ({
    label: serial,
    host: UPD_HOST,
    path: UPD_PATH,
    params: serial ? { device_serial: serial, ...base } : base,
    token: updTokens[sec] || ""
  });
  return serials.length ? serials.map(one) : [one("")];
}
function updRequestText(req) {
  const tok = req.token.trim();
  const shown = { ...req.params };
  if (shown.device_serial && !showSerials) shown.device_serial = maskSerial(shown.device_serial);
  shown.access_token = tok === "public" ? OTA_PUBLIC_TOKEN : tok === "frl" ? "(your FRL token)" : tok ? "(the token typed above)" : "(your updater token)";
  return `GET https://${req.host}${req.path}
${Object.entries(shown).map(([k, val]) => `  ${k}=${val}`).join("\n")}`;
}
function updHeadsets() {
  return sortDevices(deviceList.filter((d) => d.serial), "release").sort((a, b) => (a.ownership === "shared") - (b.ownership === "shared"));
}
var updSerialText = (serial) => showSerials ? serial : maskSerial(serial);
function updHeadsetLabel(d) {
  return `${d.model || "Headset"} \xB7 ${updSerialText(d.serial)}`;
}
function updEasyOs(opts, device) {
  return {
    label: device.serial,
    host: "graph.oculus.com",
    path: "/firmware_ota_update",
    params: otaParams({ serial: device.serial, deviceType: otaTypeFor(device), version: 1, managedMode: 0, showAllPaths: true }),
    token: ""
  };
}
async function updRun(sec, requests) {
  var _a3, _b3;
  updResults.set(sec, {
    busy: requests.length > 1 ? `Checking 0 of ${requests.length}\u2026` : "Checking\u2026",
    runs: (_b3 = (_a3 = updResults.get(sec)) == null ? void 0 : _a3.runs) != null ? _b3 : []
  });
  renderUpdater();
  let done = 0;
  const runs = await mapLimit(requests, 4, async (req) => {
    let run;
    try {
      run = { label: req.label, json: await otaRequest(req) };
    } catch (e) {
      run = { label: req.label, error: e.message };
    }
    done++;
    const r = updResults.get(sec);
    if (requests.length > 1 && r) {
      r.busy = `Checking ${done} of ${requests.length}\u2026`;
      renderUpdater();
    }
    return run;
  });
  updResults.set(sec, { busy: null, runs });
  renderUpdater();
  return runs;
}
async function updCheckEasy() {
  const opts = loadUpd();
  const picked = updHeadsets().filter((d) => opts.easy.serials.includes(d.serial));
  if (!picked.length) return updNote("os", "Pick at least one headset.");
  await updRun("os", picked.map((d) => updEasyOs(opts, d)));
}
function updNote(sec, message) {
  updResults.set(sec, { busy: null, runs: [{ label: "", error: message }] });
  renderUpdater();
}
function initUpdater() {
  for (const t of OTA_DEVICE_TYPES) el.updTypes.appendChild(new Option(t.label, t.type));
  el.updaterLoad.addEventListener("click", async () => {
    el.updaterLoad.disabled = true;
    el.updaterLoad.textContent = "Loading\u2026";
    try {
      await loadDevices();
    } finally {
      el.updaterLoad.disabled = false;
      el.updaterLoad.textContent = "Get headsets";
      renderUpdater();
    }
  });
  el.updaterMode.addEventListener("click", () => {
    editUpd((now) => now.mode = now.mode === "advanced" ? "easy" : "advanced");
    renderUpdater();
  });
  el.updaterSerials.addEventListener("click", () => {
    showSerials = !showSerials;
    renderUpdater();
    renderDevices();
  });
}
function renderUpdater() {
  if (!el.updaterBody) return;
  el.updaterSerials.textContent = showSerials ? "Hide serials" : "Show serials";
  el.updaterCount.textContent = devicesLoading ? "Loading headsets\u2026" : devicesNote ? devicesNote : devicesAsked ? `${deviceList.length} headset${deviceList.length === 1 ? "" : "s"} on this account` : "";
  const opts = loadUpd();
  const adv = opts.mode === "advanced";
  el.updaterMode.textContent = adv ? "Switch to Easy" : "Switch to Advanced";
  el.updaterMode.setAttribute("aria-pressed", String(adv));
  el.updaterView.dataset.mode = opts.mode;
  el.updaterBody.replaceChildren(
    ...UPD_SECTIONS.filter(([sec]) => adv || sec === "os").map(([sec, title, lead]) => updSectionEl(sec, title, lead, opts))
  );
}
function updSectionEl(sec, title, lead, opts) {
  const box = document.createElement("section");
  box.className = "upd-section";
  box.dataset.updSection = sec;
  const head = document.createElement("header");
  head.className = "upd-sec-head";
  const words3 = document.createElement("div");
  const h = document.createElement("h3");
  h.className = "upd-title";
  h.textContent = title;
  words3.append(h, elp("upd-lead", lead));
  head.appendChild(words3);
  box.appendChild(head);
  const body = document.createElement("div");
  body.className = "upd-body";
  if (opts.mode === "advanced") updAdvanced(sec, opts, body);
  else updEasy(opts, body);
  box.append(body);
  if (sec !== "build") box.appendChild(updResultsEl(sec));
  return box;
}
function updCheckButton(sec, idle, onClick) {
  var _a3;
  const busy = (_a3 = updResults.get(sec)) == null ? void 0 : _a3.busy;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = busy || idle;
  btn.disabled = !!busy;
  btn.addEventListener("click", onClick);
  return btn;
}
function updActions(button, note2) {
  const row = document.createElement("div");
  row.className = "upd-actions";
  row.appendChild(button);
  if (note2) row.appendChild(elp("upd-action-note", note2));
  return row;
}
function updNeedHeadsets() {
  if (devicesAsked && !devicesNote && deviceList.length) return null;
  return elp(
    "upd-empty",
    devicesLoading ? "Loading this account's headsets\u2026" : devicesNote ? `Could not list your headsets: ${devicesNote}` : devicesAsked ? "This account has no headsets. Advanced takes any serial." : "Press Get headsets above to choose from this account's headsets."
  );
}
function updGroup(title, ...children) {
  const g = document.createElement("div");
  g.className = "upd-choice";
  const h = document.createElement("p");
  h.className = "upd-choice-h";
  h.textContent = title;
  g.append(h, ...children);
  return g;
}
function updTiles(heads, kind, isOn, onPick) {
  const wrap = document.createElement("div");
  wrap.className = "upd-tiles";
  const name = `upd-${kind}-${Math.random().toString(36).slice(2, 8)}`;
  for (const d of heads) {
    const tile = document.createElement("label");
    tile.className = "upd-tile";
    const input = document.createElement("input");
    input.type = kind;
    input.name = name;
    input.checked = isOn(d);
    input.addEventListener("change", () => {
      onPick(d, input.checked);
      if (kind === "radio") for (const t of wrap.querySelectorAll(".upd-tile")) t.classList.toggle("on", t.contains(input));
      else tile.classList.toggle("on", input.checked);
    });
    tile.classList.toggle("on", input.checked);
    const text = document.createElement("span");
    text.className = "upd-tile-text";
    text.innerHTML = `<span class="upd-tile-model">${esc(d.model || "Headset")}</span><span class="upd-tile-serial">${esc(updSerialText(d.serial))}</span>`;
    tile.append(input, text);
    wrap.appendChild(tile);
  }
  return wrap;
}
function updEasy(opts, body) {
  const heads = updHeadsets();
  const missing = updNeedHeadsets();
  if (missing) {
    body.appendChild(missing);
    return;
  }
  const picked = () => loadUpd().easy.serials.filter((s) => heads.some((d) => d.serial === s)).length;
  const note2 = (n) => n ? `${n} headset${n === 1 ? "" : "s"} picked` : "Pick a headset to check";
  const actions = updActions(updCheckButton("os", "Check for updates", updCheckEasy), note2(picked()));
  const onPick = (d, on) => {
    editUpd((now) => {
      const s = new Set(now.easy.serials);
      on ? s.add(d.serial) : s.delete(d.serial);
      now.easy.serials = heads.map((h) => h.serial).filter((x) => s.has(x));
    });
    actions.querySelector(".upd-action-note").textContent = note2(picked());
  };
  const own = heads.filter((d) => d.ownership !== "shared");
  const shared = heads.filter((d) => d.ownership === "shared");
  const isOn = (d) => opts.easy.serials.includes(d.serial);
  if (own.length) body.appendChild(updGroup(shared.length ? "Your headsets" : "Headsets", updTiles(own, "checkbox", isOn, onPick)));
  if (shared.length) body.appendChild(updGroup("Shared with you", updTiles(shared, "checkbox", isOn, onPick)));
  body.appendChild(actions);
}
var UPD_FIND_MAX = 1e4;
var FIND_SELECTION = "{download_uri,extra_install_options,base_version,release_channel_name,creation_time,release_tag,formatted_build_number,build_number_display_name,semantic_version}";
var UPD_RATE_CODES = [368, 613];
var updSleep = (ms) => new Promise((r) => setTimeout(r, ms));
function updBuildBase(opts) {
  var _a3, _b3, _c;
  const v = opts.adv.build;
  const params = {};
  for (const b of UPD_ADV.build.boxes) {
    if (!b.param) continue;
    const val = b.key === "device_serial" ? (_a3 = updSerials(v[b.key])[0]) != null ? _a3 : "" : String((_b3 = v[b.key]) != null ? _b3 : "").trim();
    if (val !== "") params[b.key] = val;
  }
  (_c = params.version) != null ? _c : params.version = "1";
  return { label: params.device_serial || "", host: UPD_HOST, path: UPD_PATH, token: updTokens.build || "", params };
}
function updBuildRequest(base, number) {
  const fields = `ota.requested_version(${number}).show_all_paths(true)${FIND_SELECTION}`;
  return { ...base, params: { ...base.params, fields } };
}
function updOtaList(json) {
  const ota = json == null ? void 0 : json.ota;
  if (Array.isArray(ota)) return ota.filter((b) => b && b.download_uri);
  return ota && typeof ota === "object" && ota.download_uri ? [ota] : [];
}
function updCandidates(find) {
  const prefix = String(find.prefix || "").trim();
  const suffix = String(find.suffix || "").trim();
  const from = String(find.from || "").trim() || "0";
  const to = String(find.to || "").trim() || "9999";
  if (!/^\d+$/.test(prefix)) throw new Error("Type the prefix \u2014 the digits before the part that counts up.");
  if (!/^\d*$/.test(suffix)) throw new Error("The suffix is digits.");
  if (!/^\d+$/.test(from) || !/^\d+$/.test(to)) throw new Error("From and to are whole numbers.");
  if (Number(to) < Number(from)) throw new Error("To is lower than from.");
  const count = Number(to) - Number(from) + 1;
  if (count > UPD_FIND_MAX) throw new Error(`That is ${count} numbers; one run takes up to ${UPD_FIND_MAX}.`);
  const width = Math.max(4, to.length);
  const out = [];
  for (let m = Number(from); m <= Number(to); m++) out.push(`${prefix}${String(m).padStart(width, "0")}${suffix}`);
  return out;
}
function updAddFound(list, n) {
  var _a3;
  let added = 0;
  for (const b of list) {
    const key = `${n}>${b.download_uri}`;
    if (updFind.found.some((x) => `${x.foundAt}>${x.download_uri}` === key)) continue;
    updFind.found.push({ ...b, target_version: (_a3 = b.target_version) != null ? _a3 : n, foundAt: n });
    added++;
  }
  return added;
}
async function updAskBuild() {
  const opts = loadUpd();
  const n = String(opts.find.build || "").trim();
  const say2 = (note2, bad = false) => updResults.set("build", { busy: null, runs: [], note: note2, bad });
  if (!/^\d+$/.test(n)) {
    say2("Type the build incremental to ask for.", true);
    return renderUpdater();
  }
  updResults.set("build", { busy: "Asking\u2026", runs: [] });
  renderUpdater();
  try {
    const list = updOtaList(await otaRequest(updBuildRequest(updBuildBase(opts), n)));
    const added = updAddFound(list, n);
    say2(!list.length ? `Nothing came back for ${n}.` : added ? `Added to Builds found below.` : `Already in Builds found below.`);
  } catch (e) {
    say2(e.message, true);
  }
  renderUpdater();
}
var updIsRate = (e) => UPD_RATE_CODES.includes(Number(e == null ? void 0 : e.code)) || (e == null ? void 0 : e.status) === 429 || /too fast|temporarily blocked/i.test((e == null ? void 0 : e.message) || "");
async function updFindRun() {
  if (updFind.running) {
    updFind.stop = true;
    updFind.note = "Stopping after the requests in flight\u2026";
    updDrawFind();
    return;
  }
  const opts = loadUpd();
  const find = opts.find;
  let queue;
  try {
    queue = updCandidates(find);
  } catch (e) {
    Object.assign(updFind, { error: e.message, note: "" });
    renderUpdater();
    return;
  }
  const base = updBuildBase(opts);
  const done = updFind.done;
  const before = queue.length;
  queue = queue.filter((n) => !done.has(n));
  const rate = Math.min(12, Math.max(0.2, Number(find.rate) || 2));
  const workers = Math.min(8, Math.max(1, Math.round(Number(find.workers) || 2)));
  Object.assign(updFind, {
    running: true,
    stop: false,
    error: "",
    note: "",
    tried: 0,
    total: queue.length,
    skipped: before - queue.length,
    errors: 0,
    current: ""
  });
  renderUpdater();
  if (!queue.length) {
    updFind.running = false;
    updFind.note = "Every one of those numbers has been tried already. Clear to try them again.";
    renderUpdater();
    return;
  }
  const gate = { next: 0, until: 0, blocks: 0 };
  const gap = 1e3 / rate;
  const slot = async () => {
    const now = Date.now();
    const at = Math.max(now, gate.next, gate.until);
    gate.next = at + gap;
    if (at > now) await updSleep(at - now);
  };
  let failsInRow = 0;
  const probe = async (n) => {
    let rateTries = 0;
    for (; ; ) {
      if (updFind.stop) return false;
      await slot();
      if (updFind.stop) return false;
      updFind.current = n;
      try {
        const json = await otaRequest(updBuildRequest(base, n));
        failsInRow = 0;
        updAddFound(updOtaList(json), n);
        done.add(n);
        return true;
      } catch (e) {
        if (updIsRate(e)) {
          if (++rateTries <= 3) {
            updFind.note = `Meta says slow down \u2014 asking for ${n} again in 4 s.`;
            updDrawFind();
            await updSleep(4e3);
            continue;
          }
          const now = Date.now();
          if (now >= gate.until) {
            gate.blocks++;
            if (gate.blocks >= 5) {
              updFind.error = "Blocked five times for going too fast. Stop here and wait a few hours before trying again \u2014 carrying on only makes the block longer.";
              updFind.stop = true;
              return false;
            }
            const cool = 3e4 * 2 ** (gate.blocks - 1);
            gate.until = now + cool;
            gate.next = gate.until;
            updFind.note = `Blocked for going too fast \u2014 waiting ${cool / 1e3} s, then carrying on (block ${gate.blocks} of 5).`;
            updDrawFind();
          }
          rateTries = 0;
          continue;
        }
        updFind.errors++;
        updFind.lastError = e.message;
        if (++failsInRow >= 10) {
          updFind.error = `Stopped after ten refusals in a row: ${e.message}`;
          updFind.stop = true;
        }
        return false;
      }
    }
  };
  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (queue.length && !updFind.stop) {
        const n = queue.shift();
        await probe(n);
        updFind.tried++;
        if (updFind.note.startsWith("Meta says")) updFind.note = "";
        updDrawFind();
      }
    })
  );
  updFind.running = false;
  updFind.current = "";
  if (updFind.note.startsWith("Stopping")) updFind.note = "Stopped. Find builds again carries on from where it left off.";
  renderUpdater();
}
function updFindCsv() {
  const cols = [
    "requested_incremental",
    "base_version",
    "semantic_version",
    "formatted_build_number",
    "build_number_display_name",
    "release_channel_name",
    "creation_time",
    "release_tag",
    "size",
    "download_uri"
  ];
  const cell = (v) => {
    const s = String(v != null ? v : "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = updFind.found.map((b) => cols.map((c) => cell(c === "requested_incremental" ? b.foundAt : c === "size" ? updBytes(b.extra_install_options) || "" : b[c])).join(","));
  const blob = new Blob([[cols.join(","), ...rows].join("\n") + "\n"], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quest_ota_results.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1e3);
}
function updDrawFind() {
  const box = el.updaterBody.querySelector("[data-upd-find]");
  if (!box) return;
  box.replaceChildren(...updFindOut());
  const list = el.updaterBody.querySelector("[data-upd-found]");
  if (list) list.replaceWith(updBuildsFound());
  const btn = el.updaterBody.querySelector("[data-upd-find-btn]");
  if (btn) btn.textContent = updFind.running ? "Stop" : "Find builds";
}
function updFindOut() {
  const out = [];
  if (updFind.error) out.push(elp("settings-out bad", updFind.error));
  if (updFind.note) out.push(elp("upd-find-note", updFind.note));
  const found = updFind.found.length;
  if (updFind.total || found) {
    const bits2 = [
      updFind.running && updFind.current ? `Trying ${updFind.current}` : "",
      updFind.total ? `${updFind.tried} of ${updFind.total} tried` : "",
      updFind.skipped ? `${updFind.skipped} skipped (tried before)` : "",
      updFind.errors ? `${updFind.errors} refused` : "",
      `${found} build${found === 1 ? "" : "s"} found`
    ].filter(Boolean);
    out.push(elp("upd-find-progress", bits2.join(" \xB7 ")));
    if (updFind.total) {
      const bar = document.createElement("div");
      bar.className = "upd-find-bar";
      bar.style.setProperty("--done", String(updFind.tried / updFind.total));
      out.push(bar);
    }
  }
  if (updFind.errors && updFind.lastError && !updFind.error) out.push(elp("upd-hint", `Last refusal: ${updFind.lastError}`));
  if (!updFind.running && updFind.total && !updFind.error && !found) out.push(elp("upd-empty", "Nothing came back for those numbers."));
  return out;
}
function updBuildsFound() {
  const box = document.createElement("div");
  box.className = "upd-found";
  box.dataset.updFound = "";
  const found = updFind.found;
  const head = document.createElement("div");
  head.className = "upd-found-head";
  const h = document.createElement("h4");
  h.className = "upd-found-title";
  h.textContent = "Builds found";
  const count = document.createElement("span");
  count.className = "upd-found-count";
  count.textContent = found.length ? String(found.length) : "";
  h.appendChild(count);
  const csv = document.createElement("button");
  csv.type = "button";
  csv.className = "ptc-btn";
  csv.textContent = "Save as CSV";
  csv.disabled = !found.length;
  csv.addEventListener("click", updFindCsv);
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "ptc-btn";
  clear.textContent = "Clear results";
  clear.disabled = updFind.running || !found.length && !updFind.done.size && !updFind.total;
  clear.addEventListener("click", () => {
    Object.assign(updFind, { error: "", note: "", tried: 0, total: 0, skipped: 0, errors: 0, found: [], lastError: "" });
    updFind.done.clear();
    updResults.delete("build");
    renderUpdater();
  });
  const tools = document.createElement("div");
  tools.className = "upd-found-tools";
  tools.append(csv, clear);
  head.append(h, tools);
  box.appendChild(head);
  if (!found.length) {
    box.appendChild(elp("upd-empty", "Builds you ask for or sweep up appear here."));
    return box;
  }
  const big = (b) => BigInt(/^\d+$/.test(String(b.foundAt)) ? b.foundAt : 0);
  const sorted2 = [...found].sort((a, b) => big(b) > big(a) ? 1 : big(b) < big(a) ? -1 : 0);
  const result = document.createElement("div");
  result.className = "updater-result";
  renderUpdaterResult({ ota: sorted2 }, result);
  box.appendChild(result);
  return box;
}
function updSplitBuild(n) {
  var _a3;
  const s = (_a3 = String(n || "").match(/\d{10,}/)) == null ? void 0 : _a3[0];
  if (!s) return null;
  return { prefix: s.slice(0, -9), from: s.slice(-9, -5), suffix: s.slice(-5) };
}
function updFindPlan(opts) {
  const v = opts.adv.build;
  const missing = ["device_serial", "device_type"].filter((k) => {
    var _a3;
    return !String((_a3 = v[k]) != null ? _a3 : "").trim();
  });
  if (missing.length) return { warn: true, text: `Type ${missing.join(" and ")} above first \u2014 Fill in from a headset puts both in.` };
  let list;
  try {
    list = updCandidates(opts.find);
  } catch (e) {
    return { warn: false, text: e.message };
  }
  const left = list.filter((n) => !updFind.done.has(n)).length;
  if (!left) return { warn: false, text: "Every number in this sweep has been tried. Clear results to try them again." };
  const rate = Math.min(12, Math.max(0.2, Number(opts.find.rate) || 2));
  const secs = Math.ceil(left / rate);
  const time = secs < 90 ? `${secs} s` : secs < 5400 ? `${Math.round(secs / 60)} min` : `${Math.floor(secs / 3600)} h ${Math.round(secs % 3600 / 60)} min`;
  const tried = list.length - left;
  return {
    warn: false,
    text: `${left.toLocaleString()} number${left === 1 ? "" : "s"} to try${tried ? ` (${tried.toLocaleString()} tried already)` : ""} \u2014 about ${time} at ${rate} a second.`
  };
}
function updBuildControls(opts, body) {
  var _a3;
  const f = opts.find;
  const field = (key, label, extra = {}) => {
    var _a4;
    const id = `upd-find-${key}`;
    const wrap = document.createElement("div");
    wrap.className = `upd-field${extra.wide ? " upd-field--wide" : ""}`;
    const l = document.createElement("label");
    l.htmlFor = id;
    l.textContent = label;
    const i = document.createElement(extra.area ? "textarea" : "input");
    if (!extra.area) {
      i.type = "text";
      i.inputMode = extra.text ? "text" : "numeric";
    } else i.rows = 4;
    i.id = id;
    i.autocomplete = "off";
    i.spellcheck = false;
    i.value = (_a4 = f[key]) != null ? _a4 : "";
    if (extra.placeholder) i.placeholder = extra.placeholder;
    i.addEventListener("input", () => editUpd((now) => now.find[key] = extra.area ? i.value : i.value.trim()));
    if (extra.enter) i.addEventListener("keydown", (e) => e.key === "Enter" && extra.enter());
    wrap.append(l, i);
    if (extra.hint) wrap.appendChild(elp("upd-hint", extra.hint));
    return wrap;
  };
  const select = (key, label, options, extra = {}) => {
    const id = `upd-find-${key}`;
    const wrap = document.createElement("div");
    wrap.className = "upd-field";
    const l = document.createElement("label");
    l.htmlFor = id;
    l.textContent = label;
    const s = document.createElement("select");
    s.id = id;
    for (const [v, text] of options) s.add(new Option(text, v));
    s.value = options.some(([v]) => v === f[key]) ? f[key] : options[0][0];
    s.addEventListener("change", () => {
      editUpd((now) => now.find[key] = s.value);
      if (extra.redraw) renderUpdater();
    });
    wrap.append(l, s);
    if (extra.hint) wrap.appendChild(elp("upd-hint", extra.hint));
    return wrap;
  };
  const grid = (...kids) => {
    const g = document.createElement("div");
    g.className = "upd-find-grid";
    g.append(...kids);
    return g;
  };
  const parts = document.createElement("div");
  parts.className = "upd-build-parts";
  const ask = document.createElement("div");
  ask.className = "upd-part";
  ask.append(
    elp("upd-choice-h", "Ask for a build"),
    field("build", "Build incremental", { placeholder: "e.g. 51154110129000520", enter: updAskBuild, hint: "Sent as requested_version, every path shown." }),
    updActions(updCheckButton("build", "Ask for it", updAskBuild), "")
  );
  const asked = updResults.get("build");
  if (asked == null ? void 0 : asked.note) ask.appendChild(elp(asked.bad ? "settings-out bad" : "upd-find-note", asked.note));
  const find = document.createElement("div");
  find.className = "upd-part";
  const startId = "upd-find-start-from";
  const start = document.createElement("div");
  start.className = "upd-field upd-start";
  const startLabel = document.createElement("label");
  startLabel.htmlFor = startId;
  startLabel.textContent = "Sweep a build";
  const startBox = document.createElement("input");
  startBox.type = "text";
  startBox.id = startId;
  startBox.autocomplete = "off";
  startBox.spellcheck = false;
  startBox.placeholder = "Paste an incremental, e.g. 52641960034500520";
  startBox.value = (_a3 = f.sweepBuild) != null ? _a3 : "";
  const startHintText = "Keeps its prefix and suffix and sweeps the 4 digits between them from 0000 to 9999.";
  const startHint = elp("upd-hint", startHintText);
  startHint.id = `${startId}-hint`;
  startBox.setAttribute("aria-describedby", startHint.id);
  startBox.addEventListener("input", () => {
    const text = startBox.value;
    const parts2 = updSplitBuild(text);
    editUpd((now) => {
      now.find.sweepBuild = text;
      if (parts2) Object.assign(now.find, { prefix: parts2.prefix, suffix: parts2.suffix, from: "", to: "" });
    });
    if (parts2) {
      for (const [k, v] of Object.entries({ prefix: parts2.prefix, suffix: parts2.suffix, from: "", to: "" })) {
        const box = find.querySelector(`#upd-find-${k}`);
        if (box) box.value = v;
      }
    }
    startHint.textContent = parts2 || !text.trim() ? startHintText : "That needs a build incremental in it \u2014 a number of 10 digits or more.";
  });
  startBox.addEventListener("keydown", (e) => e.key === "Enter" && updFindRun());
  start.append(startLabel, startBox, startHint);
  const sweep = grid(
    field("prefix", "Prefix", { placeholder: "e.g. 52641960", enter: updFindRun }),
    field("from", "From", { placeholder: "0000", enter: updFindRun }),
    field("to", "To", { placeholder: "9999", enter: updFindRun }),
    field("suffix", "Suffix", { placeholder: "e.g. 00520", enter: updFindRun })
  );
  const sweepHint = elp("upd-hint upd-sweep-hint", "Each number tried is the prefix, then the middle counting up from From to To as 4 digits, then the suffix \u2014 52641960 + 0345 + 00520 is 52641960034500520. Leave From and To empty to try 0000 to 9999.");
  const how = grid(
    field("rate", "Requests a second", { placeholder: "2", hint: "Up to 12. Meta blocks a run that goes too fast." }),
    field("workers", "At once", { placeholder: "2", hint: "Up to 8. Does not raise the rate." })
  );
  const btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.updFindBtn = "";
  btn.textContent = updFind.running ? "Stop" : "Find builds";
  btn.addEventListener("click", updFindRun);
  const actions = updActions(btn, "");
  const plan = elp("upd-find-plan", "");
  const showPlan = () => {
    const p = updFindPlan(loadUpd());
    plan.textContent = updFind.running ? "" : p.text;
    plan.classList.toggle("upd-find-plan--warn", p.warn);
  };
  showPlan();
  body.addEventListener("input", showPlan);
  const out = document.createElement("div");
  out.className = "upd-find-out";
  out.dataset.updFind = "";
  out.setAttribute("aria-live", "polite");
  out.append(...updFindOut());
  find.append(elp("upd-choice-h", "Sweep for builds"), start, sweep, sweepHint, how, actions, plan, out);
  parts.append(ask, find);
  body.append(parts, updBuildsFound());
}
function updAdvanced(sec, opts, body) {
  var _a3, _b3, _c;
  const v = opts.adv[sec];
  const heads = updHeadsets();
  const tools = document.createElement("div");
  tools.className = "upd-tools";
  if (heads.length) {
    const fill = document.createElement("select");
    fill.setAttribute("aria-label", "Fill in from a headset");
    fill.add(new Option("Fill in from a headset\u2026", ""));
    for (const [label, list] of [["Your headsets", heads.filter((d) => d.ownership !== "shared")], ["Shared with you", heads.filter((d) => d.ownership === "shared")]]) {
      if (!list.length) continue;
      const group = document.createElement("optgroup");
      group.label = label;
      for (const d of list) group.appendChild(new Option(updHeadsetLabel(d), d.serial));
      fill.appendChild(group);
    }
    fill.addEventListener("change", () => {
      const d = heads.find((x) => x.serial === fill.value);
      if (!d) return;
      editUpd((now) => {
        now.adv[sec].device_serial = d.serial;
        now.adv[sec].device_type = otaTypeFor(d);
      });
      renderUpdater();
    });
    tools.appendChild(fill);
  }
  const fillDefaults = document.createElement("button");
  fillDefaults.type = "button";
  fillDefaults.className = "ptc-btn";
  fillDefaults.textContent = "Fill in what the headset sends";
  fillDefaults.addEventListener("click", () => {
    editUpd((now) => {
      var _a4;
      for (const b of UPD_ADV[sec].boxes) if (b.fill != null && !String((_a4 = now.adv[sec][b.key]) != null ? _a4 : "").trim()) now.adv[sec][b.key] = b.fill;
      now.edited[sec] = false;
    });
    renderUpdater();
  });
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "ptc-btn";
  clear.textContent = "Clear all";
  clear.addEventListener("click", () => {
    editUpd((now) => {
      now.adv[sec] = updDefaults().adv[sec];
      now.edited[sec] = false;
    });
    delete updTokens[sec];
    renderUpdater();
  });
  tools.append(fillDefaults, clear);
  body.appendChild(tools);
  const req = document.createElement("pre");
  req.className = "upd-req";
  const reqCount = document.createElement("span");
  reqCount.className = "upd-send-count";
  let fieldsBox = null;
  let rebuild = null;
  const refresh = () => {
    const now = loadUpd();
    if (fieldsBox && !now.edited[sec]) fieldsBox.value = updBuildFields(sec, now.adv[sec]);
    const reqs = updAdvRequests(sec, now);
    req.textContent = reqs.map(updRequestText).join("\n\n");
    reqCount.textContent = reqs.length > 1 ? `${reqs.length} requests, one a serial` : "";
  };
  const groups = document.createElement("div");
  groups.className = "upd-groups";
  for (const [group, legendText] of UPD_GROUPS) {
    if (!UPD_ADV[sec].boxes.some((x) => x.group === group)) continue;
    const set = document.createElement("fieldset");
    set.className = `upd-group upd-group--${group}`;
    const legend = document.createElement("legend");
    legend.textContent = legendText;
    const grid = document.createElement("div");
    grid.className = "upd-grid";
    for (const b of UPD_ADV[sec].boxes.filter((x) => x.group === group)) {
      const id = `upd-${sec}-${b.key}`;
      const field = document.createElement("div");
      field.className = `upd-field${b.area ? " upd-field--wide" : ""}`;
      const input = document.createElement(b.area ? "textarea" : "input");
      if (!b.area) input.type = b.secret ? "password" : "text";
      else input.rows = b.fields || b.key === "selection" ? 3 : 2;
      input.id = id;
      input.spellcheck = false;
      input.autocomplete = "off";
      input.placeholder = (_a3 = b.placeholder) != null ? _a3 : "not sent";
      input.value = b.secret ? updTokens[sec] || "" : b.fields ? opts.edited[sec] ? (_b3 = v.fields) != null ? _b3 : "" : updBuildFields(sec, v) : (_c = v[b.key]) != null ? _c : "";
      if (b.list) input.setAttribute("list", b.list);
      if (b.fields) fieldsBox = input;
      input.addEventListener("input", () => {
        if (b.secret) {
          updTokens[sec] = input.value;
        } else {
          editUpd((now) => {
            now.adv[sec][b.key] = input.value;
            if (b.fields) now.edited[sec] = true;
          });
          if (b.fields && rebuild) rebuild.hidden = false;
        }
        refresh();
      });
      const label = document.createElement("label");
      label.htmlFor = id;
      label.textContent = b.label;
      field.append(label, input);
      if (b.hint) {
        const hint = elp("upd-hint", b.hint);
        hint.id = `${id}-hint`;
        input.setAttribute("aria-describedby", hint.id);
        field.appendChild(hint);
      }
      grid.appendChild(field);
    }
    set.append(legend, grid);
    groups.appendChild(set);
  }
  body.appendChild(groups);
  if (sec === "build") {
    updBuildControls(opts, body);
    return;
  }
  const send = document.createElement("div");
  send.className = "upd-send";
  const sendHead = document.createElement("div");
  sendHead.className = "upd-send-head";
  sendHead.append(elp("upd-send-label", "Sends"), reqCount);
  rebuild = document.createElement("button");
  rebuild.type = "button";
  rebuild.className = "ptc-btn";
  rebuild.textContent = "Rebuild fields from the boxes";
  rebuild.hidden = !opts.edited[sec];
  rebuild.addEventListener("click", () => {
    editUpd((now) => now.edited[sec] = false);
    rebuild.hidden = true;
    refresh();
  });
  const actions = updActions(updCheckButton(sec, "Send", () => updRun(sec, updAdvRequests(sec, loadUpd()))), "");
  actions.appendChild(rebuild);
  send.append(sendHead, req, actions);
  body.appendChild(send);
  refresh();
}
function updRunCount(run) {
  if (run.error || !run.json) return "";
  const n = !run.json.ota ? 0 : Array.isArray(run.json.ota) ? run.json.ota.length : 1;
  return `${n || "No"} build${n === 1 ? "" : "s"}`;
}
function updResultsEl(sec) {
  var _a3, _b3;
  const wrap = document.createElement("div");
  wrap.className = "upd-results";
  const runs = (_b3 = (_a3 = updResults.get(sec)) == null ? void 0 : _a3.runs) != null ? _b3 : [];
  if (runs.length) wrap.setAttribute("aria-live", "polite");
  for (const run of runs) {
    const block = document.createElement("div");
    block.className = "upd-run";
    if (run.label) {
      const d = deviceList.find((x) => x.serial === run.label);
      const h = document.createElement("div");
      h.className = "upd-run-head";
      h.innerHTML = `<h4 class="upd-run-model">${esc((d == null ? void 0 : d.model) || "Serial")}</h4><span class="upd-run-serial">${esc(updSerialText(run.label))}</span><span class="upd-run-count">${esc(updRunCount(run))}</span>`;
      block.appendChild(h);
    }
    if (run.error) {
      block.appendChild(elp("settings-out bad", run.error));
    } else {
      const result = document.createElement("div");
      result.className = "updater-result";
      renderUpdaterResult(run.json || {}, result);
      block.append(result, updRaw(run.json));
    }
    wrap.appendChild(block);
  }
  return wrap;
}
function elp(cls, text) {
  const p = document.createElement("p");
  p.className = cls;
  p.textContent = text;
  return p;
}
function updRaw(json) {
  const d = document.createElement("details");
  d.className = "hint upd-raw";
  const s = document.createElement("summary");
  s.textContent = "Raw reply";
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(json, null, 2);
  d.append(s, pre);
  return d;
}
function updDownload(href, label) {
  const a = document.createElement("a");
  a.className = "dl";
  a.href = href;
  a.textContent = label;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}
function updDate(t) {
  if (t == null || t === "") return "";
  const n = Number(t);
  const d = Number.isFinite(n) && n > 0 ? new Date(n * 1e3) : new Date(String(t));
  if (Number.isNaN(d.getTime())) return String(t);
  return d.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function updBytes(opts) {
  let v = opts;
  if (typeof v === "string") {
    try {
      v = JSON.parse(v);
    } catch {
      return 0;
    }
  }
  const list = !v ? [] : Array.isArray(v) ? v : [v];
  let best = 0;
  for (const o of list) {
    if (!o || typeof o !== "object") continue;
    let n = Number(o.size);
    if (!(Number.isFinite(n) && n > 0)) {
      const h = Array.isArray(o.headers) ? o.headers.find((x) => typeof x === "string" && x.startsWith("FILE_SIZE=")) : null;
      n = h ? Number(h.slice(10)) : 0;
    }
    if (Number.isFinite(n) && n > best) best = n;
  }
  return best > 0 ? best : 0;
}
function updSize(opts) {
  const n = updBytes(opts);
  if (n <= 0) return "";
  return n >= 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(2)} GB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
}
function updVersion(b) {
  var _a3;
  const sem = String((_a3 = b.semantic_version) != null ? _a3 : "").trim();
  if (sem) return /^\d/.test(sem) ? `v${sem}` : sem;
  return String(b.build_number_display_name || b.formatted_build_number || "").trim();
}
function renderUpdaterResult(json, result) {
  result.replaceChildren();
  const otas = !json.ota ? [] : Array.isArray(json.ota) ? json.ota : [json.ota];
  if (!otas.length) {
    result.appendChild(elp("empty", "No OS build offered. Meta has nothing newer for this headset with these options."));
    return;
  }
  for (const b of otas) {
    const card = document.createElement("article");
    card.className = "updater-build";
    const facts = [
      ["Release Tag", b.release_tag],
      ["Version", updVersion(b)],
      ["Incremental", b.target_version],
      ["Build Number", b.formatted_build_number],
      ["Release Channel", b.release_channel_name],
      ["Released", updDate(b.creation_time)],
      ["Size", updSize(b.extra_install_options)]
    ].filter(([, v]) => v != null && v !== "");
    const dl = document.createElement("dl");
    dl.className = "upd-facts";
    for (const [k, v] of facts) {
      const row = document.createElement("div");
      row.className = `upd-fact${k === "Incremental" || k === "Build Number" ? " upd-fact--num" : ""}`;
      const dt = document.createElement("dt");
      dt.textContent = k;
      const dd = document.createElement("dd");
      dd.textContent = String(v);
      row.append(dt, dd);
      dl.appendChild(row);
    }
    card.appendChild(dl);
    const extra = [
      ["Display name", b.build_number_display_name],
      ["Checksum", b.file_checksum],
      ["Channel id", b.release_channel_id],
      ["Controller firmware", b.controller_fw_version && typeof b.controller_fw_version === "object" ? Object.entries(b.controller_fw_version).map(([k, v]) => `${k} ${v}`).join(", ") : b.controller_fw_version],
      ["Install options", b.extra_install_options && typeof b.extra_install_options === "object" ? JSON.stringify(b.extra_install_options) : b.extra_install_options]
    ].filter(([, v]) => v != null && v !== "");
    if (extra.length) {
      const d = document.createElement("details");
      d.className = "hint";
      const s = document.createElement("summary");
      s.textContent = "Details";
      const more = document.createElement("dl");
      more.className = "upd-dl";
      for (const [k, v] of extra) {
        const dt = document.createElement("dt");
        dt.textContent = k;
        const dd = document.createElement("dd");
        dd.textContent = String(v);
        more.append(dt, dd);
      }
      d.append(s, more);
      card.appendChild(d);
    }
    if (b.download_uri) {
      const act = document.createElement("div");
      act.className = "upd-build-act";
      act.appendChild(updDownload(b.download_uri, "Download OTA"));
      card.appendChild(act);
    }
    result.appendChild(card);
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
  el.devicesRows.addEventListener("click", onDeviceRowClick);
  el.devicesRows.addEventListener("keydown", onDeviceRowKey);
  el.sharedRows.addEventListener("click", onDeviceRowClick);
  el.sharedRows.addEventListener("keydown", onDeviceRowKey);
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
    var _a3;
    const refund = o.refundStatus && !/^(none|not_refunded|no_refund)/i.test(o.refundStatus) ? ` <span class="pill">${esc(prettyStatus(o.refundStatus))}</span>` : "";
    const art = showArt && o.image ? `<img class="art" src="${esc(o.image)}" alt="" loading="lazy">` : "";
    const kind = o.iapType ? ` <span class="purchase-kind">${esc(prettyStatus(o.iapType))}</span>` : "";
    const pay = o.payment == null ? "\u2014" : showPayment ? esc(o.payment) : "\u2022\u2022\u2022\u2022";
    const nameCell = o.appId ? `<button type="button" class="linkbtn" data-open-app="${esc(o.appId)}" title="Open ${esc(
      o.name
    )}">${esc(o.name)}</button>` : esc(o.name);
    return `<tr>
          <td class="name">${art}${nameCell}${kind}</td>
          <td class="num">${esc((_a3 = o.amount) != null ? _a3 : "\u2014")}</td>
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
async function loadStickers() {
  el.stickerGo.disabled = true;
  el.stickerGo.textContent = "Loading\u2026";
  el.stickerCount.textContent = "Asking the store\u2026";
  try {
    const list = await avatarStickers();
    el.stickerGrid.innerHTML = list.map((x) => `<img src="${esc(x.url)}" alt="Avatar sticker ${esc(x.id)}" loading="lazy">`).join("");
    el.stickerCount.textContent = list.length ? `${list.length} sticker${list.length === 1 ? "" : "s"}.` : "The store has no stickers for this avatar.";
  } catch (err2) {
    el.stickerGrid.innerHTML = "";
    el.stickerCount.textContent = err2.message || "Could not load the stickers.";
  }
  el.stickerGo.disabled = false;
  el.stickerGo.textContent = "Get stickers";
}
async function loadAvatars() {
  el.avatarsGo.disabled = true;
  el.avatarsGo.textContent = "Loading\u2026";
  el.avatarsCount.textContent = "Asking the store\u2026";
  try {
    const list = await accountAvatars();
    el.avatarsGrid.innerHTML = list.map(
      (a) => `<figure class="avatar-card">
          ${a.body ? `<img src="${esc(a.body)}" alt="Avatar, full body" loading="lazy">` : a.face ? `<img src="${esc(a.face)}" alt="Avatar" loading="lazy">` : ""}
          <figcaption><strong>${esc(a.kind ? words2(a.kind) : "Avatar")}</strong>${a.profiles.length ? `<span>${esc(a.profiles.join(", "))}</span>` : `<span>Not assigned</span>`}</figcaption>
        </figure>`
    ).join("");
    el.avatarsCount.textContent = `${list.length} avatar${list.length === 1 ? "" : "s"}.`;
  } catch (err2) {
    el.avatarsGrid.innerHTML = "";
    el.avatarsCount.textContent = err2.message || "Could not load your avatars.";
  }
  el.avatarsGo.disabled = false;
  el.avatarsGo.textContent = "Get avatars";
}
function initAvatar() {
  var _a3, _b3;
  (_a3 = el.stickerGo) == null ? void 0 : _a3.addEventListener("click", loadStickers);
  (_b3 = el.avatarsGo) == null ? void 0 : _b3.addEventListener("click", loadAvatars);
  el.avatarLoad.addEventListener("click", fetchAvatar);
  el.avatarQ.addEventListener("input", renderAvatar);
  el.avatarRows.addEventListener("click", (e) => {
    if (e.target.closest("tr.detail")) return;
    const row = e.target.closest("tr[data-part]");
    if (row) toggleAvatarPart(row.dataset.part);
  });
  el.avatarRows.addEventListener("keydown", (e) => {
    var _a4, _b4;
    const row = (_b4 = (_a4 = e.target).closest) == null ? void 0 : _b4.call(_a4, "tr[data-part]");
    if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      toggleAvatarPart(row.dataset.part);
    }
  });
  renderAvatar();
}
function toggleAvatarPart(part) {
  var _a3;
  if (avatarOpen.has(part)) avatarOpen.delete(part);
  else avatarOpen.add(part);
  renderAvatar();
  (_a3 = el.avatarRows.querySelector(`tr[data-part="${CSS.escape(part)}"]`)) == null ? void 0 : _a3.focus();
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
  var _a3, _b3, _c, _d, _e, _f;
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
    ["Horizon gates", ((_a3 = a.gates) != null ? _a3 : []).map(([k, v]) => [esc(words2(k.replace(/^enable_/, ""))), v ? "On" : "Off"])]
  ]) : "";
  const settings = (_b3 = a.settings) != null ? _b3 : [];
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
  var _a3;
  if (presenceState.note) return `Last active: ${presenceState.note}`;
  const p = presenceState.data;
  if (!(p == null ? void 0 : p.lastActive)) return "";
  const when = new Date(p.lastActive * 1e3).toISOString().slice(0, 16).replace("T", " ");
  const where = (_a3 = p.app) != null ? _a3 : p.destination ? words2(p.destination) : null;
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
function deviceRank(d) {
  const i = OTA_DEVICE_TYPES.indexOf(otaCatalogFor(d));
  return i < 0 ? OTA_DEVICE_TYPES.length : i;
}
function sortDevices(list, mode) {
  const byModel = (a, b) => {
    var _a3, _b3;
    return ((_a3 = a.model) != null ? _a3 : "").localeCompare((_b3 = b.model) != null ? _b3 : "") || a.serial.localeCompare(b.serial);
  };
  if (mode === "release") return [...list].sort((a, b) => deviceRank(a) - deviceRank(b) || byModel(a, b));
  return [...list].sort(mode === "modelZa" ? (a, b) => -byModel(a, b) : byModel);
}
var DEVICE_IMAGES = {
  OCULUS_MONTEREY: "img/Quest1.png",
  OCULUS_SANTA_CRUZ: "img/Quest1.png",
  OCULUS_HOLLYWOOD: "img/Quest2.png",
  OCULUS_SEACLIFF: "img/QuestPro.png",
  OCULUS_EUREKA: "img/Quest3.webp",
  OCULUS_PANTHER: "img/Quest3S.png"
};
function deviceImage(d) {
  var _a3, _b3;
  const type = ((_a3 = d.deviceType) != null ? _a3 : "").toUpperCase();
  const model = ((_b3 = d.model) != null ? _b3 : "").toLowerCase();
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
function deviceRowsHtml(list) {
  const art = loadSettings().images;
  return list.map((d) => {
    var _a3;
    const open2 = devicesOpen.has(d.serial);
    const pic = art && deviceImage(d) ? `<img class="art" src="${esc(deviceImage(d))}" alt="" loading="lazy">` : "";
    const otaType = otaTypeFor(d);
    return `<tr class="device-row${open2 ? " open" : ""}" data-headset="${esc(d.serial)}" tabindex="0" role="button" aria-expanded="${open2}">
      <td class="name">${pic}<span class="device-name">${esc((_a3 = d.model) != null ? _a3 : "Unknown device")}</span><span class="row-caret" aria-hidden="true"></span></td>
      <td class="num device-ota">${otaType ? esc(otaType) : '<span class="dash">\u2014</span>'}</td>
      <td class="num">${esc(showSerials ? d.serial : maskSerial(d.serial))}</td>
      <td>${esc(deviceStatus(d))}</td>
    </tr>`;
  }).join("");
}
function onDeviceRowClick(e) {
  const row = e.target.closest("tr.device-row");
  if (row) toggleHeadset(row.dataset.headset);
}
function onDeviceRowKey(e) {
  var _a3, _b3;
  const row = (_b3 = (_a3 = e.target).closest) == null ? void 0 : _b3.call(_a3, "tr.device-row");
  if (row && e.target === row && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    toggleHeadset(row.dataset.headset);
  }
}
function toggleHeadset(serial) {
  var _a3;
  if (!serial) return;
  if (devicesOpen.has(serial)) devicesOpen.delete(serial);
  else devicesOpen.add(serial);
  renderDevices();
  const sel = `tr.device-row[data-headset="${CSS.escape(serial)}"]`;
  (_a3 = el.devicesRows.querySelector(sel) || el.sharedRows.querySelector(sel)) == null ? void 0 : _a3.focus();
}
function insertHeadsetPanels(tbody, list) {
  for (const d of list) {
    if (!devicesOpen.has(d.serial)) continue;
    const row = tbody.querySelector(`tr.device-row[data-headset="${CSS.escape(d.serial)}"]`);
    if (!row) continue;
    const detail = document.createElement("tr");
    detail.className = "detail headset-detail";
    const td2 = document.createElement("td");
    td2.colSpan = row.children.length;
    td2.appendChild(headsetPanel(d));
    detail.appendChild(td2);
    row.after(detail);
  }
}
function headsetPanel(device) {
  var _a3;
  const serial = device.serial;
  const shared = device.ownership === "shared";
  const otaType = otaTypeFor(device);
  const catalog = otaCatalogFor(device);
  const tabs = [["overview", "Overview"]];
  if (!shared) tabs.push(["ptc", "Test channel"]);
  let tab = (_a3 = devicesPanelTab.get(serial)) != null ? _a3 : "overview";
  if (!tabs.some(([n]) => n === tab)) tab = "overview";
  const panel = document.createElement("div");
  panel.className = "panel headset-panel";
  panel.dataset.tab = tab;
  const wipe = deviceStatus(device);
  const overview = factGroups([
    [
      "Headset",
      [
        ["Model", device.model],
        ["Serial", showSerials ? serial : maskSerial(serial)],
        ["Device type", device.deviceType],
        ["Update type", catalog ? catalog.type : otaType || null],
        ["Ownership", shared ? "Shared with you" : "Owned"]
      ]
    ],
    ["State", [["Remote wipe", wipe && wipe !== "\u2014" ? wipe : null]]]
  ]) || `<p>No details for this headset.</p>`;
  const tabBar = tabs.map(
    ([n, label]) => `<button type="button" class="companion-tab${n === tab ? " on" : ""}" data-headset-tab="${n}" role="tab" aria-selected="${n === tab}">${label}</button>`
  ).join("");
  const pane = (n) => `data-headset-pane="${n}"${n === tab ? "" : " hidden"}`;
  panel.innerHTML = `
    <div class="companion-tabs panel-tabs" role="tablist" aria-label="${esc(device.model || "Headset")}">${tabBar}</div>
    <div ${pane("overview")}>${overview}<div class="controls headset-upd"><button type="button" data-headset-updates>Check for updates</button></div></div>
    ${shared ? "" : `<div ${pane("ptc")} class="ptc-pane"></div>`}`;
  panel.querySelector("[data-headset-updates]").addEventListener("click", () => {
    const now = loadUpd();
    now.mode = "easy";
    now.easy.serials = [serial];
    saveUpd(now);
    go("/updater");
  });
  if (!shared) fillPtcPane(panel.querySelector(".ptc-pane"), device);
  for (const b of panel.querySelectorAll("[data-headset-tab]")) {
    b.addEventListener("click", () => {
      const name = b.dataset.headsetTab;
      devicesPanelTab.set(serial, name);
      panel.dataset.tab = name;
      for (const x of panel.querySelectorAll("[data-headset-tab]")) {
        const on = x === b;
        x.classList.toggle("on", on);
        x.setAttribute("aria-selected", String(on));
      }
      for (const p of panel.querySelectorAll("[data-headset-pane]")) p.hidden = p.dataset.headsetPane !== name;
    });
  }
  return panel;
}
function fillPtcPane(pane, device) {
  if (!pane) return;
  const serial = device.serial;
  const s = ptcStatus.get(serial);
  const intro = `<p class="hint">The public test channel (PTC) puts pre-release Quest system software on this headset. It picks the change up the next time it looks for an update.</p>`;
  if (!s || s === "loading") {
    pane.innerHTML = intro + `<p class="settings-out">Reading the test channel\u2026</p>`;
    return;
  }
  const state = s.error ? "unknown" : !s.allowed ? "not available" : s.enabled ? "on" : "off";
  pane.innerHTML = intro + `<p class="ptc-state">Test channel: <strong>${esc(state)}</strong></p><div class="controls" data-ptc-actions></div><p class="settings-out" data-ptc-out hidden></p>`;
  const actions = pane.querySelector("[data-ptc-actions]");
  const out = pane.querySelector("[data-ptc-out]");
  const mkBtn = (on, disabled = false) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ptc-btn " + (on ? "ptc-on" : "ptc-off");
    b.textContent = on ? "Enable" : "Disable";
    if (disabled) b.disabled = true;
    else b.addEventListener("click", () => setHeadsetPtc(device, on, pane));
    return b;
  };
  if (s.error) actions.append(mkBtn(true), mkBtn(false));
  else if (!s.allowed) {
    actions.append(mkBtn(true, true));
    out.hidden = false;
    out.textContent = "This headset can't join the test channel.";
  } else actions.append(s.enabled ? mkBtn(false) : mkBtn(true));
}
async function setHeadsetPtc(device, enable, pane) {
  const serial = device.serial;
  const out = pane.querySelector("[data-ptc-out]");
  pane.querySelectorAll(".ptc-btn").forEach((b) => b.disabled = true);
  if (out) {
    out.hidden = false;
    out.classList.remove("bad");
    out.textContent = `${enable ? "Enabling" : "Disabling"} the test channel on ${headsetLabel(serial)}\u2026`;
  }
  try {
    await setDevicePTC(serial, enable);
    await loadPTCStatus(serial);
    syncRelayNote();
  } catch (err2) {
    if (out) {
      out.textContent = `Not changed: ${err2.message}`;
      out.classList.add("bad");
    }
    pane.querySelectorAll(".ptc-btn").forEach((b) => b.disabled = false);
  }
}
function renderDevices() {
  const q = el.devicesQ.value.trim().toLowerCase();
  const match = (d) => {
    var _a3;
    return !q || d.serial.toLowerCase().includes(q) || ((_a3 = d.model) != null ? _a3 : "").toLowerCase().includes(q);
  };
  const mode = el.devicesSort.value;
  const ownedAll = deviceList.filter((d) => d.ownership !== "shared");
  const sharedAll = deviceList.filter((d) => d.ownership === "shared");
  const owned = sortDevices(ownedAll.filter(match), mode);
  const shared = sortDevices(sharedAll.filter(match), mode);
  el.devicesRows.innerHTML = deviceRowsHtml(owned);
  insertHeadsetPanels(el.devicesRows, owned);
  el.devicesEmpty.hidden = owned.length > 0 || devicesLoading;
  el.devicesEmpty.textContent = devicesLoading ? "" : devicesNote ? devicesNote : !devicesAsked ? "Press Get devices to list the headsets on this account." : ownedAll.length ? "Nothing matches." : "No devices found on this account.";
  el.devicesCount.textContent = devicesLoading ? "Asking the store\u2026" : !devicesAsked || devicesNote ? "" : owned.length === ownedAll.length ? `${ownedAll.length} device${ownedAll.length === 1 ? "" : "s"}.` : `${owned.length} of ${ownedAll.length} devices.`;
  const presence = devicesLoading ? "" : presenceLine();
  el.devicesPresence.textContent = presence;
  el.devicesPresence.hidden = !presence;
  el.sharedSection.hidden = !devicesAsked || devicesLoading || sharedAll.length === 0;
  el.sharedRows.innerHTML = deviceRowsHtml(shared);
  insertHeadsetPanels(el.sharedRows, shared);
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
    var _a3, _b3;
    if (e.source !== window || e.origin !== location.origin || !((_a3 = e.data) == null ? void 0 : _a3.metadbExt)) return;
    const m = e.data;
    if (m.type === "here") {
      found = true;
      button.dataset.found = "1";
      useExtensionRelay(m.relay === true);
      out.textContent = "The MetaDB Sign-in extension is installed. Sign in with Meta fills in both tokens below from your Meta login." + (m.relay === true ? " Store requests go through the extension, not the relay." : "");
      syncExtSignIn();
      if ((_b3 = m.update) == null ? void 0 : _b3.version) {
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
      if (m.frlToken) {
        el.frlToken.value = m.frlToken;
        saveSettings({ frlToken: m.frlToken });
        if (el.tokensOut) {
          el.tokensOut.textContent = "";
          el.tokensOut.className = "settings-out";
        }
      } else if (m.frlError && el.tokensOut) {
        el.tokensOut.textContent = "FRL token not fetched \u2014 " + m.frlError;
        el.tokensOut.className = "settings-out bad";
        console.log("[MetaDB] FRL token error:", m.frlError);
      }
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
        var _a3;
        return (_a3 = document.getElementById("getext")) == null ? void 0 : _a3.scrollIntoView();
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
  var _a3, _b3, _c, _d, _e;
  if (IN_APP) {
    document.getElementById("appSignInField").hidden = false;
    document.getElementById("appSignIn").addEventListener("click", () => window.MetaDBApp.signIn("settings"));
    document.getElementById("appSignOut").addEventListener("click", signOut);
    syncAppSignIn();
  } else {
    initExtSignIn();
  }
  const saved = loadSettings();
  el.token.value = (_a3 = localStorage.getItem("metadb.token")) != null ? _a3 : "";
  el.acToken.value = saved.acToken;
  el.frlToken.value = saved.frlToken || "";
  el.updToken.value = saved.upToken || "";
  el.relay.value = saved.relay;
  syncRelayNote();
  el.getUpdToken.addEventListener("click", async () => {
    const label = el.getUpdToken.textContent;
    el.getUpdToken.disabled = true;
    el.getUpdToken.textContent = "Getting\u2026";
    report(el.updTokenOut, "Minting the updater token from your FRL token\u2026", "");
    try {
      const t = await updaterToken();
      el.updToken.value = t;
      saveSettings({ upToken: t });
      report(el.updTokenOut, "Updater token saved.", "ok");
    } catch (e) {
      report(el.updTokenOut, e.message, "bad");
    } finally {
      el.getUpdToken.disabled = false;
      el.getUpdToken.textContent = label;
    }
  });
  el.updToken.addEventListener("change", () => saveSettings({ upToken: el.updToken.value.trim() }));
  el.settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      saveSettings({
        token: el.token.value.trim(),
        acToken: el.acToken.value.trim(),
        frlToken: el.frlToken.value.trim(),
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
    const frlToken = el.frlToken.value.trim();
    try {
      saveSettings({ token, acToken, frlToken });
      syncExtSignIn();
      renderAll();
      tell(
        [
          token ? "Access token saved." : "Access token cleared \u2014 using the built-in one.",
          acToken ? "Account token saved." : "No account token, so downloads stay off.",
          frlToken ? "FRL token saved." : ""
        ].filter(Boolean).join(" "),
        "ok"
      );
    } catch (err2) {
      tell(err2.message, "bad");
    }
  });
  if (el.frlSnippet) {
    const relayTemplate = (loadSettings().relay || "").trim() || location.origin + "/api?url={url}";
    const snippet = `(async () => {
  const R = ${JSON.stringify(relayTemplate)};
  const relay = u => R.includes("{url}") ? R.replace("{url}", encodeURIComponent(u)) : R + encodeURIComponent(u);
  const CLIENT = "FRL|512466987071624|01d4a1f7fd0682aea7ee8ae987704d63", NATIVE = "512466987071624";
  const form = o => new URLSearchParams(o);
  const graph = (url, body) => fetch(relay(url), { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: form(body) }).then(r => r.json());
  if (!location.host.endsWith("auth.meta.com")) { alert("Run this on https://auth.meta.com while signed in to Meta."); return; }
  try {
    let j = await graph("https://meta.graph.meta.com/webview_tokens_query", { access_token: CLIENT });
    const etoken = j.native_sso_etoken, reqtoken = j.native_sso_token;
    const confirmUrl = "https://auth.meta.com/native_sso/confirm?" + form({ native_app_id: NATIVE, native_sso_etoken: etoken, utm_source: "skyline_splash" });
    const html = await (await fetch(confirmUrl, { credentials: "include" })).text();
    const scrape = t => { const i = html.indexOf('"' + t + '"'); if (i < 0) return null; const m = html.slice(i, i + 400).match(/"token":"([^"]+)"/); return m && m[1]; };
    const dtsg = scrape("DTSGInitialData"), lsd = scrape("LSD");
    if (!dtsg || !lsd) { alert("Not signed in to meta.com in this browser \u2014 sign in at meta.com first, then run this again."); return; }
    const jazoest = "2" + [...dtsg].reduce((s, c) => s + c.charCodeAt(0), 0);
    const bt = await (await fetch("https://auth.meta.com/api/native_sso/approved/", { method: "POST", credentials: "include", headers: { "Content-Type": "application/x-www-form-urlencoded", "x-fb-lsd": lsd }, body: form({ __a: "1", fb_dtsg: dtsg, jazoest, lsd, native_app_id: NATIVE, native_sso_etoken: etoken }) })).text();
    const blob = new URL(JSON.parse(bt.replace("for (;;);", "")).payload.uri).searchParams.get("blob");
    j = await graph("https://meta.graph.meta.com/webview_blobs_decrypt", { access_token: CLIENT, blob, request_token: reqtoken });
    j = await graph("https://meta.graph.meta.com/graphql", { doc_id: "5787825127910775", variables: JSON.stringify({ app_id: 826037204154824 }), access_token: j.access_token });
    const tkn = j.data.xfr_create_profile_token.profile_tokens[0].access_token;
    await navigator.clipboard.writeText(tkn).catch(() => {});
    console.log("FRL token (copied to clipboard):", tkn);
    alert("FRL token copied to the clipboard. Paste it into MetaDB Settings.");
  } catch (e) {
    const m = (e && e.message) || String(e);
    if (/session has been invalidated|validating access token|190/i.test(m)) alert("Your meta.com login has been invalidated (a password change, or Meta security). Sign out of meta.com and sign back in, then run this again.");
    else alert("Could not get the token: " + m);
  }
})();`;
    el.frlSnippet.textContent = snippet;
    if (el.copyFrlSnippet) {
      el.copyFrlSnippet.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(snippet);
          report(el.frlSnippetOut, "Snippet copied. Paste it into the console on auth.meta.com.", "ok");
        } catch {
          report(el.frlSnippetOut, "Couldn't copy automatically \u2014 select the snippet text and copy it by hand.", "bad");
        }
      });
    }
  }
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
  el.watchAuto.checked = saved.watchAuto;
  el.watchAuto.addEventListener("change", () => {
    saveSettings({ watchAuto: el.watchAuto.checked ? "1" : "0" });
  });
  if (el.watchThrottle) {
    el.watchThrottle.value = saved.watchThrottle;
    el.watchThrottle.addEventListener("change", () => {
      saveSettings({ watchThrottle: el.watchThrottle.value });
    });
  }
  if (el.watchNotify) {
    el.watchNotify.checked = saved.watchNotify;
    el.watchNotify.addEventListener("change", () => {
      saveSettings({ watchNotify: el.watchNotify.checked ? "1" : "0" });
    });
  }
  if (el.notifyLinger) {
    el.notifyLinger.value = saved.notifyLinger;
    el.notifyLinger.addEventListener("change", () => {
      saveSettings({ notifyLinger: el.notifyLinger.value });
    });
  }
  (_b3 = el.notifyTest) == null ? void 0 : _b3.addEventListener("click", () => {
    toast({
      title: "Beat Saber \u2014 new build",
      body: "build 51 \u2192 54",
      actionLabel: "View watchlist",
      onAction: () => go("/watchlist")
    });
  });
  if (el.density) {
    el.density.value = saved.density;
    el.density.addEventListener("change", () => {
      saveSettings({ density: el.density.value });
      applyDensity();
    });
  }
  el.watchButtons.checked = saved.watchButtons;
  el.watchButtons.addEventListener("change", () => {
    saveSettings({ watchButtons: el.watchButtons.checked ? "1" : "0" });
    applyColumns();
    renderAll();
  });
  el.autoOwned.checked = saved.autoOwned;
  el.autoOwned.addEventListener("change", () => {
    saveSettings({ autoOwned: el.autoOwned.checked });
    if (el.autoOwned.checked && !mineAsked) autoLoadOwned();
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
  (_c = el.exportTokens) == null ? void 0 : _c.addEventListener("click", () => {
    const s = loadSettings();
    const tokens = {
      oc_www_at: el.token.value.trim() || localStorage.getItem("metadb.token") || "",
      oc_ac_at: el.acToken.value.trim() || s.acToken || "",
      frl_token: el.frlToken && el.frlToken.value.trim() || s.frlToken || "",
      updater_token: el.updToken && el.updToken.value.trim() || s.upToken || "",
      exported: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!tokens.oc_www_at && !tokens.oc_ac_at && !tokens.frl_token && !tokens.updater_token) {
      tell("No tokens to export \u2014 sign in or paste a token first.", "bad");
      return;
    }
    try {
      const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "metadb-tokens.json";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 0);
      tell("Saved metadb-tokens.json. It holds the tokens that sign in as you \u2014 keep it private, and delete it when you are done.", "ok");
    } catch (err2) {
      tell(`Could not export: ${err2.message}`, "bad");
    }
  });
  (_d = el.importTokens) == null ? void 0 : _d.addEventListener("click", () => {
    var _a4;
    return (_a4 = el.importTokensFile) == null ? void 0 : _a4.click();
  });
  (_e = el.importTokensFile) == null ? void 0 : _e.addEventListener("change", async () => {
    var _a4;
    const file = (_a4 = el.importTokensFile.files) == null ? void 0 : _a4[0];
    el.importTokensFile.value = "";
    if (!file) return;
    let data;
    try {
      data = JSON.parse(await file.text());
    } catch {
      tell("That is not a readable tokens file \u2014 expected the JSON that Export tokens saves.", "bad");
      return;
    }
    if (!data || typeof data !== "object") {
      tell("That file has no tokens in it.", "bad");
      return;
    }
    const pick = (...names) => {
      for (const n2 of names) {
        const v = data[n2];
        if (typeof v === "string" && v.trim()) return v.trim();
      }
      return null;
    };
    const found = {
      token: pick("oc_www_at", "token"),
      acToken: pick("oc_ac_at", "acToken"),
      frlToken: pick("frl_token", "frlToken"),
      upToken: pick("updater_token", "upToken")
    };
    const patch = Object.fromEntries(Object.entries(found).filter(([, v]) => v));
    if (!Object.keys(patch).length) {
      tell("No tokens in that file \u2014 expected oc_www_at, oc_ac_at, frl_token or updater_token.", "bad");
      return;
    }
    saveSettings(patch);
    if (patch.token != null) el.token.value = patch.token;
    if (patch.acToken != null) el.acToken.value = patch.acToken;
    if (el.frlToken && patch.frlToken != null) el.frlToken.value = patch.frlToken;
    if (el.updToken && patch.upToken != null) el.updToken.value = patch.upToken;
    syncAppSignIn();
    syncExtSignIn();
    renderAll();
    const labels = { token: "access", acToken: "account", frlToken: "Meta", upToken: "updater" };
    const which = Object.keys(patch).map((k) => labels[k]).join(", ");
    const n = Object.keys(patch).length;
    tell(`Imported and saved the ${which} token${n === 1 ? "" : "s"} \u2014 you are signed in on this browser now.`, "ok");
  });
  el.clearBtn.addEventListener("click", () => {
    clearSettings();
    if (IN_APP) {
      window.MetaDBApp.signOut();
      saveSettings({ relay: window.MetaDBApp.relay() });
    }
    el.token.value = "";
    el.acToken.value = "";
    if (el.frlToken) el.frlToken.value = "";
    if (el.updToken) el.updToken.value = "";
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
    if (el.defView) el.defView.value = fresh.defaultView;
    if (el.watchThrottle) el.watchThrottle.value = fresh.watchThrottle;
    if (el.watchNotify) el.watchNotify.checked = fresh.watchNotify;
    if (el.notifyLinger) el.notifyLinger.value = fresh.notifyLinger;
    if (el.density) {
      el.density.value = fresh.density;
      applyDensity();
    }
    syncRelayNote();
    syncExtSignIn();
    say(IN_APP ? "Cleared, and signed out of Meta." : "Cleared. Back to the built-in token and no relay.", "ok");
  });
  el.useLocal.addEventListener("click", () => {
    el.relay.value = "http://127.0.0.1:8788/?url={url}";
    saveSettings({ relay: el.relay.value });
    syncRelayNote();
    say("Set to the local relay. Start it with: node tools/serve.mjs", "ok");
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
  fillOptions(el.defView, [
    ...screenList(),
    ...[...el.navLinks].filter((a) => a.dataset.view === "settings").map((a) => [a.dataset.view, navLabel(a)])
  ]);
  fillOptions(el.defHmd, HMD_TYPES.map(([v, label]) => [v, `${label} (${v})`]));
  fillOptions(el.defSort, [...el.sort.options].map((o) => [o.value, o.textContent]));
  fillOptions(
    el.defMineSort,
    [...el.mineSort.options].map((o) => [o.value, o.textContent])
  );
  fillOptions(el.defBuildSort, BUILD_SORT_LABELS);
  fillOptions(el.defTrigger, DEFAULT_APP_TRIGGERS);
  const pairs = [
    [el.defView, "defaultView", saved.defaultView, null],
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
  const s = loadSettings();
  document.body.classList.toggle(
    "watch-on",
    s.watchButtons && !s.sectionsOff.includes("watchlist")
  );
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
  var _a3;
  return (_a3 = app.channels) != null ? _a3 : [];
};
function primaryOf(app) {
  var _a3, _b3, _c;
  const list = channelsOf(app);
  return (_c = (_b3 = (_a3 = list.find((c) => c.group === "PRIMARY")) != null ? _a3 : list.find((c) => c.name === "LIVE")) != null ? _b3 : list[0]) != null ? _c : null;
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
  el.mineQ.addEventListener("input", renderSoon);
  el.mineSort.addEventListener("change", renderAll);
  for (const b of el.libButtons) {
    b.addEventListener("click", () => loadEntitlements(b.dataset.lib));
  }
  if (!searchSeq) runSearch();
  if (loadSettings().autoOwned) autoLoadOwned();
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
  ownedLoading.add(kind);
  const labels = new Map([...el.libButtons].map((b) => [b, b.textContent]));
  for (const b of el.libButtons) {
    b.disabled = true;
    if (b.dataset.lib === kind) b.textContent = "Asking\u2026";
  }
  renderAll();
  try {
    mineList = await myEntitlements(kind);
    if (kind !== "expired") for (const a of mineList) ownedAcross.set(keyOf(a), a);
    if (adbInstalled.length) resolveHeadsetApps();
  } catch (err2) {
    mineList = [];
    mineNote = err2.message;
  } finally {
    mineLoading = false;
    ownedLoading.delete(kind);
    for (const [b, label] of labels) {
      b.disabled = false;
      b.textContent = label;
    }
    syncRelayNote();
    renderAll();
    refreshHome();
  }
}
async function addOwnedLib(kind) {
  ownedLoading.add(kind);
  refreshHome();
  try {
    const list = await myEntitlements(kind);
    for (const a of list) ownedAcross.set(keyOf(a), a);
    renderAll();
  } catch {
  } finally {
    ownedLoading.delete(kind);
    refreshHome();
  }
}
async function autoLoadOwned() {
  await loadEntitlements("quest");
  await addOwnedLib("pc");
}
function pageSize() {
  return el.limit.value === "all" ? Infinity : Number(el.limit.value);
}
function matches(app, q) {
  var _a3, _b3;
  if (!q) return true;
  return app.name.toLowerCase().includes(q) || ((_a3 = app.id) != null ? _a3 : "").includes(q) || ((_b3 = app.packageName) != null ? _b3 : "").toLowerCase().includes(q);
}
var visible = () => sorted(listing, el.sort.value);
var PACKAGE_RE = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+){2,}$/i;
async function runSearch() {
  const raw = el.q.value.trim();
  const seq = ++searchSeq;
  if (!restoringRoute && (routeView() || "apps") === "apps") setRoute({ q: raw, app: null, tab: null });
  if (!raw) {
    listing = [];
    listingNote = "";
    listingError = "";
    searching = false;
    el.searchGo.disabled = false;
    el.searchGo.textContent = "Search";
    renderAll();
    return;
  }
  searching = true;
  el.searchGo.disabled = true;
  el.searchGo.textContent = "Searching\u2026";
  listingNote = "";
  listingError = "";
  renderAll();
  let found;
  let note2;
  let error = "";
  try {
    const id = parseAppId(raw);
    const hmdType = el.hmd.value;
    if (id) {
      found = [await lookupApp(id)];
      note2 = "fetched by ID";
    } else if (PACKAGE_RE.test(raw)) {
      found = [await lookupByPackage(raw)];
      note2 = "resolved from package name";
    } else {
      found = await searchStore(raw, { limit: pageSize(), hmdType });
      note2 = `store search on ${hmdType}`;
    }
  } catch (err2) {
    found = [];
    note2 = `search failed: ${err2.message}`;
    error = hiddenIdMessage(err2.message);
  }
  if (seq !== searchSeq) return;
  listing = found;
  listingNote = note2;
  listingError = error;
  searching = false;
  el.searchGo.disabled = false;
  el.searchGo.textContent = "Search";
  renderAll();
}
function hiddenIdMessage(message) {
  if (!/does not exist, cannot be loaded due to missing permissions/i.test(message != null ? message : "")) return "";
  const own = !(loadSettings().token || "").includes("|");
  return own ? "The store won't show this ID to your account. It may be an app that isn't released to you (in development, or on a release channel you're not on), one that was taken down, or an ID that isn't an app at all (an add-on, a world or a person)." : "The store won't show this ID to the built-in public token, which only sees released apps. It may be unreleased or on a private channel, taken down, or not an app ID. Sign in on the Settings page: your own account may be able to see it.";
}
var focusId = null;
var focusScope = null;
var openKey = (scope, app) => `${scope}:${keyOf(app)}`;
function onHiddenScreen(node) {
  var _a3;
  return Boolean((_a3 = node.closest('section[id^="view-"]')) == null ? void 0 : _a3.hidden);
}
function buildRows(tbody, list, scope) {
  var _a3, _b3;
  if (onHiddenScreen(tbody)) {
    staleTables.add(tbody);
    return;
  }
  staleTables.delete(tbody);
  const scrolled = /* @__PURE__ */ new Map();
  for (const d of tbody.querySelectorAll(":scope > tr.detail")) {
    const id = (_a3 = d.previousElementSibling) == null ? void 0 : _a3.dataset.id;
    if (id) scrolled.set(id, saveScrolls(d));
  }
  const out = [];
  for (const app of list) {
    out.push(appRow(app, scope));
    if (open.has(openKey(scope, app))) out.push(detailRow(app, void 0, scope));
  }
  tbody.replaceChildren(...out);
  for (const d of tbody.querySelectorAll(":scope > tr.detail")) {
    const saved = scrolled.get((_b3 = d.previousElementSibling) == null ? void 0 : _b3.dataset.id);
    if (saved) restoreScrolls(d, saved);
  }
  fillRowIcons(tbody);
}
function scrollKeys(root) {
  const seen = /* @__PURE__ */ new Map();
  return [...root.querySelectorAll(".vscroll")].map((v) => {
    var _a3, _b3, _c, _d;
    let h = v.previousElementSibling;
    while (h && h.tagName !== "H3") h = h.previousElementSibling;
    const base = `${(_b3 = (_a3 = v.closest("[data-pane]")) == null ? void 0 : _a3.dataset.pane) != null ? _b3 : ""}|${(_c = h == null ? void 0 : h.textContent) != null ? _c : ""}`;
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
function renderSoon() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(renderAll, 120);
}
function pumpOrgRows() {
  if (orgPumping) return;
  orgPumping = true;
  const gen = orgGen;
  const step = () => {
    if (gen !== orgGen) return;
    const frag = document.createDocumentFragment();
    for (const app of orgQueue.splice(0, 100)) frag.append(appRow(app, "orgs"));
    el.orgRows.append(frag);
    if (orgQueue.length) {
      requestAnimationFrame(step);
      return;
    }
    orgPumping = false;
    fillRowIcons(el.orgRows);
    const after = orgAfterDrain;
    orgAfterDrain = null;
    if (after) after();
  };
  step();
}
function renderOrgSection() {
  const orgShown = orgVisible();
  const visibleTable = !onHiddenScreen(el.orgRows);
  if (orgSkipRebuildOnce) {
    orgSkipRebuildOnce = false;
  } else if (orgShown.length > 150 && visibleTable && ![...open].some((k) => k.startsWith("orgs:"))) {
    orgGen++;
    orgPumping = false;
    staleTables.delete(el.orgRows);
    el.orgRows.replaceChildren();
    orgQueue = [...orgShown];
    pumpOrgRows();
  } else {
    orgGen++;
    orgPumping = false;
    orgQueue = [];
    orgAfterDrain = null;
    buildRows(el.orgRows, orgShown, "orgs");
  }
  orgDrawn = onHiddenScreen(el.orgRows) ? -1 : orgShown.length;
  el.orgEmpty.hidden = orgShown.length > 0 || orgLoading;
  el.orgEmpty.textContent = orgLoading ? "" : orgNote ? orgNote : !orgAsked ? "Enter an organization ID and press List apps." : orgList.length ? "Nothing matches." : "No apps for that organization.";
  el.orgCount.textContent = orgLoading ? orgList.length ? `${orgList.length} apps so far \u2014 asking for more\u2026` : "Asking the store\u2026" : !orgAsked || orgNote ? "" : orgShown.length === orgList.length ? `${orgList.length} app${orgList.length === 1 ? "" : "s"}.` : `${orgShown.length} of ${orgList.length} apps.`;
}
function renderAll() {
  var _a3;
  clearTimeout(renderTimer);
  refreshWatchArt([...listing, ...mineList, ...orgList]);
  ownedKeys = loadSettings().autoOwned ? new Set(ownedAcross.keys()) : /* @__PURE__ */ new Set();
  const list = visible();
  const idle = !searching && !el.q.value.trim() && !listingNote;
  buildRows(el.rows, list, "main");
  el.empty.hidden = list.length > 0 || searching;
  el.empty.textContent = idle ? "Search the store to begin." : searching ? "" : listingError || "No apps matched.";
  el.empty.classList.toggle("warn", Boolean(listingError) && !searching);
  el.count.textContent = searching ? "Asking the store\u2026" : idle ? "" : `${list.length} app${list.length === 1 ? "" : "s"}` + (listingNote ? ` \u2014 ${listingNote}` : "");
  const mine = mineApps();
  buildRows(el.mineRows, mine, "mine");
  el.mineCount.textContent = mineStatus(mine.length);
  el.mineEmpty.hidden = mine.length > 0 || mineLoading;
  el.mineEmpty.textContent = mineNote ? mineNote : !mineAsked ? "Press Get Quest, Get PC or Get expired entitlements to list what this account owns." : mineList.length ? "Nothing matches." : LIBRARIES[mineKind].none;
  el.mineEmpty.classList.toggle("warn", Boolean(mineNote));
  renderOrgSection();
  const defaultShown = defaultVisible();
  buildRows(el.defaultRows, defaultShown, "default");
  el.defaultEmpty.hidden = defaultShown.length > 0 || defaultLoading;
  el.defaultEmpty.textContent = defaultLoading ? "" : defaultNote ? defaultNote : !defaultAsked ? "Pick a headset and trigger, then press Get default apps." : defaultList.length ? "Nothing matches." : "No default apps for that headset and trigger.";
  el.defaultCount.textContent = defaultLoading ? "Asking the store\u2026" : !defaultAsked || defaultNote ? "" : defaultShown.length === defaultList.length ? `${defaultList.length} app${defaultList.length === 1 ? "" : "s"}.` : `${defaultShown.length} of ${defaultList.length} apps.`;
  const plusShown = plusVisible();
  const plusAll = plusState.rows;
  buildRows(el.plusRows, plusShown, "plus");
  el.plusEmpty.hidden = plusShown.length > 0 || plusState.loading;
  const pickOthers = el.plusPick.value && plusState.others.some((o) => o.sectionId === el.plusPick.value);
  el.plusEmpty.textContent = plusState.note ? plusState.note : !plusState.asked ? "Press Get Horizon+ games to list what the subscription offers right now." : pickOthers && !plusShown.length ? "This section has no Quest apps \u2014 its titles are listed below." : plusAll.length ? "Nothing matches." : "The store lists no Horizon+ games for this account.";
  const claimed = plusAll.filter((a) => a.claimed).length;
  const perSection = plusState.sections.map((s) => [s.name, plusAll.filter((a) => {
    var _a4;
    return (_a4 = a.plusSections) == null ? void 0 : _a4.includes(s.id);
  }).length + plusState.others.filter((o) => o.sectionId === s.id).length]).filter(([, n]) => n).map(([name, n]) => `${name} ${n}`).join(" \xB7 ");
  el.plusCount.textContent = plusState.loading ? "Asking the store\u2026" : !plusAll.length && !plusState.others.length ? "" : `${plusShown.length === plusAll.length ? plural(plusAll.length, "game") : `${plusShown.length} of ${plusAll.length} games`}${plusState.others.length ? ` and ${plural(plusState.others.length, "other title")}` : ""} \u2014 ${perSection}; ${claimed} on this account.`;
  renderPlusOthers();
  const storeShown = storeVisible();
  const storeAll = storeState.rows;
  buildRows(el.storeRows, storeShown, "store");
  el.storeEmpty.hidden = storeShown.length > 0 || storeState.loading;
  el.storeEmpty.textContent = storeState.note ? storeState.note : !storeState.asked ? "Pick a headset and press Get store to list the sections its store shows." : storeAll.length ? "Nothing matches." : "This section has no apps in it \u2014 it may hold banners, worlds or videos only.";
  el.storeEmpty.classList.toggle("warn", Boolean(storeState.note));
  el.storeMoreBar.hidden = !storeState.cursor || !storeAll.length;
  const section = storeState.section;
  el.storeCount.textContent = storeState.loading ? "Asking the store\u2026" : !section || !storeAll.length ? storeState.front && !storeState.note ? `${plural(storeState.front.sections.length, "section")}${storeState.charts.length ? ` and ${plural(storeState.charts.length, "top chart")}` : ""} on this store.` : "" : `${section.name}: ${storeShown.length === storeAll.length ? plural(storeAll.length, "app") : `${storeShown.length} of ${storeAll.length} apps`}${storeState.cursor ? " so far" : ""}${section.layout ? ` \u2014 shown in the store as ${section.layout.toLowerCase()}` : ""}${section.ordered ? ", ranked" : ""}.`;
  const wishShown = wishVisible();
  const wishAll = wishState.rows;
  buildRows(el.wishRows, wishShown, "wishlist");
  el.wishEmpty.hidden = wishShown.length > 0 || wishState.loading;
  el.wishEmpty.textContent = wishState.note ? wishState.note : !wishState.asked ? "Press Get wishlist to list what is on your wishlist." : wishAll.length ? "Nothing matches." : "Your wishlist is empty.";
  el.wishEmpty.classList.toggle("warn", Boolean(wishState.note));
  el.wishMoreBar.hidden = !wishState.cursor || !wishAll.length;
  el.wishCount.textContent = wishState.loading ? "Asking the store\u2026" : !wishAll.length ? "" : `${wishShown.length === wishAll.length ? plural(wishAll.length, "app") : `${wishShown.length} of ${wishAll.length} apps`}${wishState.cursor ? " so far" : ""} on your wishlist.`;
  buildAdbRows();
  if (focusId) {
    (_a3 = (focusScope != null ? focusScope : el.rows).querySelector(`tr.app[data-id="${focusId}"]`)) == null ? void 0 : _a3.focus();
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const key = openKey(scope, app);
  const found = (_a3 = results.get(keyOf(app))) == null ? void 0 : _a3.latest;
  const channels = ((_b3 = found == null ? void 0 : found.channels) == null ? void 0 : _b3.length) ? found.channels : channelsOf(app);
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
    <td class="name">${watchToggle(app)}${rowArt(app, showArt)}${esc(app.name)}</td>
    <td class="c-dev">${esc((_e = deviceName(app.platform)) != null ? _e : "\u2014")}</td>
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
  const wbtn = tr.querySelector("[data-watch-toggle]");
  if (wbtn) {
    wbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWatch(app);
      const on = isWatched(app);
      wbtn.classList.toggle("is-on", on);
      wbtn.setAttribute("aria-pressed", String(on));
      wbtn.title = `${on ? "Remove from" : "Add to"} your watchlist`;
      updateWatchBadge();
      if (!el.viewWatchlist.hidden) renderWatch();
    });
  }
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
  var _a3;
  if (mineKind !== "quest" || app.platform === "PC") return "\u2014";
  if (!iapState.asked) return "";
  if (iapState.loading) return "\u2026";
  return String(((_a3 = iapState.byApp.get(app.id)) == null ? void 0 : _a3.length) || "\u2014");
}
function devCell(app) {
  var _a3, _b3, _c;
  const latest = (_a3 = results.get(keyOf(app))) == null ? void 0 : _a3.latest;
  if (!(latest == null ? void 0 : latest.newest)) return `<td class="num c-devb muted-cell">\u2014</td>`;
  const channelTop = Math.max(
    Number(latest.versionCode) || 0,
    ...((_b3 = latest.channels) != null ? _b3 : []).map((c) => Number(c.versionCode) || 0)
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
  var _a3, _b3, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  if (!staged) pushRecent(app);
  const found = results.get(keyOf(app));
  const list = ((_b3 = (_a3 = found == null ? void 0 : found.latest) == null ? void 0 : _a3.channels) == null ? void 0 : _b3.length) ? found.latest.channels : channelsOf(app);
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
        ["Device", deviceName(app.platform)],
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
      "Traits",
      traitRows(app)
    ],
    [
      "Destinations",
      ((_e = (_d = traitInfo.get(app.id)) == null ? void 0 : _d.dest) != null ? _e : []).map((d) => [esc(d.name), d.capacity ? `Up to ${d.capacity} in a group` : "\u2014"])
    ],
    [
      "Included in",
      ((_g = (_f = traitInfo.get(app.id)) == null ? void 0 : _f.bundles) != null ? _g : []).map((b) => [esc(b.name), b.price || "\u2014"])
    ],
    [
      "More like this",
      ((_i = (_h = traitInfo.get(app.id)) == null ? void 0 : _h.related) != null ? _i : []).map((r) => [esc(r.name), [r.price, r.owned ? "owned" : null].filter(Boolean).join(" \xB7 ") || "\u2014"])
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
  const storePath = app.platform === "PC" ? "pcvr/" : /3DOF|^ANDROID$/.test((_j = app.platform) != null ? _j : "") ? "go/" : "";
  const storeLink = app.id && opts.store ? `<a href="https://www.meta.com/experiences/${storePath}${app.id}/" target="_blank"
           rel="noopener">Open in store</a>` : "";
  const actions = app.id ? `<button type="button" data-check="1">Check this app</button>${/* Binary info reads Android builds only; a Rift app has nothing to show. */
  opts.details && app.platform !== "PC" ? `<button type="button" data-info="1">Latest Binary Info</button>` : ""}${/* Shown on every free app that carries an offer. The store refuses a
     claim on anything priced, so the button only appears where it can
     actually succeed — and not on the Entitlements screen, where every
     app is one the account already has. */
  app.free && app.offerId && scope !== "mine" ? `<button type="button" data-claim="1">Get entitlement</button>` : ""}${storeLink}` : `<button type="button" data-resolve="1">Find store ID</button>`;
  const mineCh = app.id ? myChannels.get(app.id) : null;
  const onChannel = (mineCh == null ? void 0 : mineCh.current) ? (_l = (_k = mineCh.channels.find((c) => c.id === mineCh.current)) == null ? void 0 : _k.name) != null ? _l : null : null;
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
      var _a4, _b4, _c2;
      return `<tr>
                   <td>${esc(c.name)}</td>
                   <td>${esc((_a4 = c.version) != null ? _a4 : "\u2014")}</td>
                   <td>${(_b4 = c.versionCode) != null ? _b4 : "\u2014"}</td>
                   <td>${(_c2 = c.releasedAt) != null ? _c2 : "\u2014"}</td>
                 </tr>`;
    }
  ).join("")}
           </tbody>
         </table>
       </div>` : `<p>${!app.id ? "No store ID to check against." : found ? "No published channel." : "Not checked yet \u2014 press Check this app for its channels and builds."}</p>`;
  const revs = staged ? (_m = L == null ? void 0 : L.revisions) != null ? _m : [] : [];
  const revisionTable = revs.length ? `<div class="revisions">
         <h3>Revisions</h3>
         <div class="vscroll short">
           <table class="vtable plain">
             <thead>
               <tr><th>Status</th><th>Created</th><th class="rev-subs">Submissions</th><th>ID</th></tr>
             </thead>
             <tbody>
               ${revs.map((r) => {
    var _a4, _b4, _c2;
    const can = r.id && extraOn("submissions");
    return `<tr${can ? ` class="rev-row" data-rev="${esc(r.id)}" tabindex="0" aria-expanded="${revOpen.has(r.id)}"` : ""}>
                     <td>${esc((_a4 = r.status) != null ? _a4 : "\u2014")}</td>
                     <td>${esc((_b4 = r.created) != null ? _b4 : "\u2014")}</td>
                     <td class="rev-subs">${r.submissions}</td>
                     <td class="bid">${esc((_c2 = r.id) != null ? _c2 : "\u2014")}</td>
                   </tr>${can && revOpen.has(r.id) ? revDetailRow(r.id) : ""}`;
  }).join("")}
             </tbody>
           </table>
         </div>
       </div>` : "";
  const panel = document.createElement("div");
  panel.className = "panel";
  const tabKey = `${staged ? "stage" : scope}:${keyOf(app)}`;
  const panelsOff = loadSettings().panelsOff;
  const panelOn = (n) => !panelsOff.includes(n);
  let tab = (_n = layoutState.panelTabs.get(tabKey)) != null ? _n : "store";
  if (!panelOn(tab)) tab = "store";
  if (tab === "mine") setTimeout(() => wantYourCopy());
  const storeFacts = `${factGroups(groups)}${(listed == null ? void 0 : listed.error) ? `<p class="warn">No store listing: ${esc(listed.error)}</p>` : ""}`;
  const channelBlock = revisionTable ? `<div class="chan-rev"><div class="chans-col">${channelTable}</div>${revisionTable}</div>` : channelTable;
  const pane = (name) => `data-pane="${name}"${tab === name ? "" : " hidden"}`;
  const tabButton = (name, label) => `<button type="button" class="companion-tab${tab === name ? " on" : ""}" data-panel-tab="${name}"
       role="tab" aria-selected="${tab === name}">${label}</button>`;
  const actionsHidden = ["mine", "reviews", "posts", "addons", "achievements", "leaderboards", "cloud"].includes(tab);
  const sharedActions = `<div data-app-actions${actionsHidden ? " hidden" : ""}>
         ${actions ? `<div class="actions">${actions}</div>` : ""}
         <div class="claim-out"></div>
         <div class="resolve-out"></div>
         <div class="info-out"></div>
       </div>`;
  const main = `<div class="companion-tabs panel-tabs" role="tablist" aria-label="${esc(app.name)}">
         ${tabButton("store", "Store")}${tabButton("builds", "Builds")}${panelOn("reviews") ? tabButton("reviews", "Reviews") : ""}${panelOn("posts") ? tabButton("posts", "Posts") : ""}${panelOn("addons") ? tabButton("addons", "Add-ons") : ""}${panelOn("achievements") ? tabButton("achievements", "Achievements") : ""}${panelOn("leaderboards") ? tabButton("leaderboards", "Leaderboards") : ""}${panelOn("cloud") ? tabButton("cloud", "Cloud") : ""}${tabButton("mine", "Entitlement")}
       </div>
       ${sharedActions}
       <div ${pane("store")}>${storeFacts || "<p>Not checked yet \u2014 the listing arrives with Check this app.</p>"}</div>
       <div ${pane("builds")}>${channelBlock}${app.id && app.platform !== "PC" ? `<div class="relnotes"><div class="controls"><button type="button" data-relnotes-get>Release notes</button></div><div class="relnotes-out"></div></div>` : ""}<div class="versions-out"></div></div>
       ${panelOn("reviews") ? `<div ${pane("reviews")} class="reviews-pane">${reviewsPaneHtml(app)}</div>` : ""}
       ${panelOn("posts") ? `<div ${pane("posts")} class="posts-pane">${postsPaneHtml(app)}</div>` : ""}
       ${panelOn("addons") ? `<div ${pane("addons")} class="addons-pane">${addonsPaneHtml(app)}</div>` : ""}
       ${panelOn("achievements") ? `<div ${pane("achievements")} class="ach-pane">${achPaneHtml(app)}</div>` : ""}
       ${panelOn("leaderboards") ? `<div ${pane("leaderboards")} class="lb-pane">${lbPaneHtml(app)}</div>` : ""}
       ${panelOn("cloud") ? `<div ${pane("cloud")} class="cloud-pane">${cloudPaneHtml(app)}</div>` : ""}
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
  staged && opts.images && (appArt(app) || app.id) ? `<div class="artbox">
               ${appArt(app) ? `<img class="panel__art" src="${esc(appArt(app))}" alt="">` : ""}
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
      if (shared) shared.hidden = ["mine", "reviews", "posts", "addons", "achievements", "leaderboards", "cloud"].includes(name);
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
  (_o = panel.querySelector("[data-stage]")) == null ? void 0 : _o.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleStage(app, scope);
  });
  (_p = panel.querySelector("[data-check]")) == null ? void 0 : _p.addEventListener("click", (e) => {
    e.stopPropagation();
    checkOne(app, { channel: true });
  });
  (_q = panel.querySelector("[data-images]")) == null ? void 0 : _q.addEventListener("click", (e) => {
    e.stopPropagation();
    showImages(app, e.currentTarget, panel.querySelector(".images-out"));
  });
  (_r = panel.querySelector("[data-claim]")) == null ? void 0 : _r.addEventListener("click", (e) => {
    e.stopPropagation();
    claimOne(app, panel.querySelector(".claim-out"), e.currentTarget);
  });
  (_s = panel.querySelector("[data-resolve]")) == null ? void 0 : _s.addEventListener("click", (e) => {
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
    (_t = panel.querySelector(".versions-out")) == null ? void 0 : _t.addEventListener("click", (e) => {
      const button = e.target.closest("[data-install-build]");
      if (!button) return;
      e.stopPropagation();
      installBuild(app, button.dataset, button);
    });
  }
  if (isRift(app)) {
    (_u = panel.querySelector(".versions-out")) == null ? void 0 : _u.addEventListener("click", (e) => {
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
  for (const b of panel.querySelectorAll("[data-backup-detail]")) {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleBackupDetail(b.dataset.backupDetail);
    });
  }
  const lbPane = panel.querySelector('[data-pane="leaderboards"]');
  if (lbPane) wireLb(app, lbPane);
  const postsPane = panel.querySelector('[data-pane="posts"]');
  if (postsPane) wirePosts(app, postsPane);
  const relnotesOut = panel.querySelector(".relnotes-out");
  if (relnotesOut) {
    (_v = panel.querySelector("[data-relnotes-get]")) == null ? void 0 : _v.addEventListener("click", (e) => {
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
    if (redrawnMeanwhile(app, out)) return;
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
  var _a3;
  const tr = document.createElement("tr");
  tr.className = "detail";
  const td2 = document.createElement("td");
  td2.colSpan = (_a3 = span != null ? span : ROW_SPAN[scope]) != null ? _a3 : app.owned ? 11 : 8;
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
  var _a3, _b3;
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
    s.ratingCount != null ? `${(_a3 = s.ratingCountText) != null ? _a3 : bigNumber(s.ratingCount)} ratings` : null,
    s.reviewCount ? `${bigNumber(s.reviewCount)} written` : null
  ].filter(Boolean).join(" \xB7 ");
  const summary = s.score != null || s.histogram.length ? `<div class="rev-summary">
           <div class="rev-score-box">
             <div class="rev-score">${esc((_b3 = s.scoreText) != null ? _b3 : s.score != null ? s.score.toFixed(1) : "\u2014")}</div>
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
  var _a3, _b3;
  if (!app.id) return;
  (_a3 = pane.querySelector("[data-reviews-get]")) == null ? void 0 : _a3.addEventListener("click", (e) => {
    e.stopPropagation();
    loadReviews(app, pane, { sort: "top", button: e.currentTarget });
  });
  for (const b of pane.querySelectorAll("[data-review-sort]")) {
    b.addEventListener("click", (e) => {
      var _a4;
      e.stopPropagation();
      const sort = b.dataset.reviewSort;
      if (((_a4 = reviewCache.get(app.id)) == null ? void 0 : _a4.sort) === sort) return;
      loadReviews(app, pane, { sort, button: b });
    });
  }
  (_b3 = pane.querySelector("[data-reviews-more]")) == null ? void 0 : _b3.addEventListener("click", (e) => {
    e.stopPropagation();
    loadReviews(app, pane, { more: true, button: e.currentTarget });
  });
}
async function loadReviews(app, pane, { sort, more = false, button } = {}) {
  var _a3;
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
      const summary = (_a3 = prev == null ? void 0 : prev.summary) != null ? _a3 : await appReviewSummary(app.id);
      const page = await appReviews(app.id, { count: REVIEW_PAGE, sort });
      reviewCache.set(app.id, { summary, reviews: page.reviews, cursor: page.cursor, sort });
    }
    if (redrawnMeanwhile(app, pane)) return;
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
    var _a3, _b3;
    const price = a.owned ? `<span class="addon-owned">Owned</span>` : a.strikethrough && a.strikethrough !== a.price ? `<span class="addon-was">${esc(a.strikethrough)}</span> <span class="addon-price">${esc((_a3 = a.price) != null ? _a3 : "\u2014")}</span>` : `<span class="addon-price">${esc((_b3 = a.price) != null ? _b3 : "\u2014")}</span>`;
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
  var _a3, _b3;
  if (!app.id) return;
  (_a3 = pane.querySelector("[data-addons-get]")) == null ? void 0 : _a3.addEventListener("click", (e) => {
    e.stopPropagation();
    loadAddons(app, pane, { button: e.currentTarget });
  });
  (_b3 = pane.querySelector("[data-addons-more]")) == null ? void 0 : _b3.addEventListener("click", (e) => {
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
    if (redrawnMeanwhile(app, pane)) return;
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
    var _a3, _b3;
    const hidden = a.secret && !a.unlocked;
    const art = a.image ? `<img class="ach-art" src="${esc(a.image)}" alt="" loading="lazy">` : `<span class="ach-art"></span>`;
    const title = hidden ? "Secret achievement" : esc((_a3 = a.title) != null ? _a3 : "\u2014");
    const desc = hidden ? "Hidden until unlocked." : esc((_b3 = a.description) != null ? _b3 : "");
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
  var _a3;
  if (!app.id) return;
  (_a3 = pane.querySelector("[data-ach-get]")) == null ? void 0 : _a3.addEventListener("click", (e) => {
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
    if (redrawnMeanwhile(app, pane)) return;
    pane.innerHTML = renderAch(data);
  } catch (err2) {
    if (button) {
      button.disabled = false;
      button.textContent = "Get achievements";
    }
    paneError(pane, "ach-error", `Could not load achievements: ${err2.message}`);
  }
}
function lbPaneHtml(app) {
  if (!app.id) return `<p>No store ID to read leaderboards for.</p>`;
  const c = lbCache.get(app.id);
  if (c) return renderLb(c);
  return `<div class="controls"><button type="button" data-lb-get>Get leaderboards</button></div>
       <p class="hint">This app's leaderboards: the top scores, your friends', and where you stand. Needs your own access token.</p>`;
}
function renderLb(c) {
  if (!c.boards.length) return `<p>This app has no leaderboards.</p>`;
  const boardPick = `<select data-lb-board aria-label="Leaderboard">${c.boards.map((b) => `<option value="${esc(b.id)}"${b.id === c.board ? " selected" : ""}>${esc(b.title)}</option>`).join("")}</select>`;
  const viewPick = `<select data-lb-view aria-label="Whose scores">${LEADERBOARD_VIEWS.map(
    ([value, label]) => `<option value="${value}"${value === c.view ? " selected" : ""}>${label}</option>`
  ).join("")}</select>`;
  const s = c.shown;
  let body = "";
  if (s) {
    const facts = [
      s.myRank != null ? `your best rank: ${bigNumber(s.myRank)}` : null,
      s.friends != null ? `${bigNumber(s.friends)} friend${s.friends === 1 ? "" : "s"} on it` : null
    ].filter(Boolean);
    const score = (v) => v != null && /^-?\d+$/.test(String(v)) ? bigNumber(v) : esc(v != null ? v : "\u2014");
    const rows = s.entries.map(
      (e) => {
        var _a3;
        return `<tr>
          <td class="lb-rank">${e.rank != null ? bigNumber(e.rank) : "\u2014"}</td>
          <td><span class="lb-player">${e.photo ? `<img src="${esc(e.photo)}" alt="" loading="lazy">` : ""}${esc((_a3 = e.name) != null ? _a3 : "\u2014")}</span></td>
          <td class="lb-score">${score(e.score)}</td>
        </tr>`;
      }
    ).join("");
    const none = c.view === "FRIENDS" ? " from your friends" : c.view === "SELF" ? " around you \u2014 you may not have a score on this one" : "";
    body = `<p class="count">${bigNumber(s.entries.length)} entr${s.entries.length === 1 ? "y" : "ies"}${facts.length ? ` \xB7 ${facts.join(" \xB7 ")}` : ""}</p>
      ${s.entries.length ? `<table><thead><tr><th>Rank</th><th>Player</th><th>Score</th></tr></thead><tbody>${rows}</tbody></table>` : `<p class="empty">No entries${none}.</p>`}`;
  }
  return `<div class="controls">${boardPick}${viewPick}</div>${body}`;
}
function wireLb(app, pane) {
  var _a3;
  if (!app.id) return;
  (_a3 = pane.querySelector("[data-lb-get]")) == null ? void 0 : _a3.addEventListener("click", (e) => {
    e.stopPropagation();
    loadLb(app, pane, e.currentTarget);
  });
  for (const pick of pane.querySelectorAll("[data-lb-board], [data-lb-view]")) {
    pick.addEventListener("click", (e) => e.stopPropagation());
    pick.addEventListener("change", () => {
      const c = lbCache.get(app.id);
      if (!c) return;
      c.board = pane.querySelector("[data-lb-board]").value;
      c.view = pane.querySelector("[data-lb-view]").value;
      showLb(app, pane, c);
    });
  }
}
async function loadLb(app, pane, button) {
  var _a3, _b3;
  if (button) {
    button.disabled = true;
    button.textContent = "Loading leaderboards\u2026";
  }
  try {
    const boards = await appLeaderboards(app.id);
    const c = { boards, board: (_b3 = (_a3 = boards[0]) == null ? void 0 : _a3.id) != null ? _b3 : null, view: "GLOBAL", shown: null };
    lbCache.set(app.id, c);
    if (redrawnMeanwhile(app, pane)) return;
    if (!c.board) {
      pane.innerHTML = renderLb(c);
      return;
    }
    await showLb(app, pane, c);
  } catch (err2) {
    if (button) {
      button.disabled = false;
      button.textContent = "Get leaderboards";
    }
    paneError(pane, "lb-error", `Could not load leaderboards: ${err2.message}`);
  }
}
async function showLb(app, pane, c) {
  for (const p of pane.querySelectorAll("[data-lb-board], [data-lb-view]")) p.disabled = true;
  const status = pane.querySelector(".count");
  if (status) status.textContent = "Loading\u2026";
  try {
    c.shown = await leaderboardEntries(c.board, c.view);
    if (redrawnMeanwhile(app, pane)) return;
    pane.innerHTML = renderLb(c);
    wireLb(app, pane);
  } catch (err2) {
    c.shown = null;
    if (redrawnMeanwhile(app, pane)) return;
    pane.innerHTML = renderLb(c);
    wireLb(app, pane);
    paneError(pane, "lb-error", `Could not load this leaderboard: ${err2.message}`);
  }
}
function postsPaneHtml(app) {
  if (!app.id) return `<p>No store ID to read posts for.</p>`;
  const c = postsCache.get(app.id);
  if (c) return renderPosts(c);
  return `<div class="controls"><button type="button" data-posts-get>Get posts</button></div>
       <p class="hint">The developer's news and update posts on this app's store page. Needs your own access token.</p>`;
}
function renderPosts(posts) {
  if (!posts.length) return `<p>The developer has no posts on this app's store page.</p>`;
  const cards = posts.map((p) => {
    var _a3;
    const art = p.image ? `<img class="post-art" src="${esc(p.image)}" alt="" loading="lazy">` : "";
    const meta = [p.author, p.time].filter(Boolean).map(esc).join(" \xB7 ");
    return `<article class="post">
          ${art}
          <div class="post-body">
            <div class="post-title">${esc((_a3 = p.title) != null ? _a3 : "Untitled post")}</div>
            ${meta ? `<div class="post-meta">${meta}</div>` : ""}
            ${p.body ? `<div class="post-text">${esc(p.body)}</div>` : ""}
          </div>
        </article>`;
  }).join("");
  return `<p class="count">${plural(posts.length, "post")}</p>
     <div class="post-list">${cards}</div>`;
}
function wirePosts(app, pane) {
  var _a3;
  if (!app.id) return;
  (_a3 = pane.querySelector("[data-posts-get]")) == null ? void 0 : _a3.addEventListener("click", (e) => {
    e.stopPropagation();
    loadPosts(app, pane, e.currentTarget);
  });
}
async function loadPosts(app, pane, button) {
  button.disabled = true;
  button.textContent = "Loading posts\u2026";
  try {
    const posts = await appDevPosts(app.id, app.platform === "PC" ? "RIFT" : void 0);
    postsCache.set(app.id, posts);
    if (redrawnMeanwhile(app, pane)) return;
    pane.innerHTML = renderPosts(posts);
  } catch (err2) {
    button.disabled = false;
    button.textContent = "Get posts";
    paneError(pane, "posts-error", `Could not load posts: ${err2.message}`);
  }
}
function redrawnMeanwhile(app, pane) {
  if (pane.isConnected) return false;
  refreshRow(app);
  return true;
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
    if (redrawnMeanwhile(app, out)) return;
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
  var _a3;
  if (v.id == null) return (_a3 = v.versionCode) != null ? _a3 : "\u2014";
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
var RIFT_PARALLEL = 8;
function siteVersion() {
  var _a3;
  const v = (((_a3 = document.querySelector('link[href*="style.css"]')) == null ? void 0 : _a3.getAttribute("href").match(/v=(\d+)/)) || [])[1];
  return v ? `?v=${v}` : "";
}
async function riftZipTarget(fileName) {
  if (typeof window.showSaveFilePicker === "function") {
    const handle = await window.showSaveFilePicker({
      id: "metadb-rift",
      suggestedName: fileName,
      types: [{ description: "Zip archive", accept: { "application/zip": [".zip"] } }]
    });
    return { kind: "file", handle, where: "file", cleanup() {
    } };
  }
  if (!navigator.serviceWorker) throw new Error("this browser cannot save a large download as it arrives \u2014 use Chrome, Edge or Firefox");
  const reg = await navigator.serviceWorker.register(new URL(`js/download-sw.js${siteVersion()}`, document.baseURI), {
    scope: new URL("js/dl/", document.baseURI).pathname
  });
  const sw = await new Promise((resolve) => {
    const w = reg.active || reg.waiting || reg.installing;
    if (w.state === "activated") return resolve(w);
    w.addEventListener("statechange", () => w.state === "activated" && resolve(w));
  });
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const ch3 = new MessageChannel();
  await new Promise((resolve) => {
    ch3.port1.onmessage = ({ data }) => data === "ready" && resolve();
    sw.postMessage({ type: "download", id, name: fileName }, [ch3.port2]);
  });
  ch3.port1.onmessage = null;
  const frame = document.createElement("iframe");
  frame.hidden = true;
  frame.src = new URL(`js/dl/${id}/${encodeURIComponent(fileName)}`, document.baseURI).href;
  document.body.appendChild(frame);
  const ping = setInterval(() => sw.postMessage({ type: "ping" }), 1e4);
  return {
    kind: "port",
    port: ch3.port1,
    where: "download",
    cleanup() {
      clearInterval(ping);
      setTimeout(() => frame.remove(), 6e4);
    }
  };
}
async function downloadRiftBuild(app, data, button) {
  const { riftBuild: binaryId, version } = data;
  if (!canDownload()) {
    go("/settings");
    return;
  }
  const safe = (app.name || "rift-build").replace(/[^\w.-]+/g, "_");
  const zipName = `${safe}_${version || binaryId}`.replace(/[^\w.-]+/g, "_") + ".zip";
  let target;
  try {
    target = await riftZipTarget(zipName);
  } catch (err2) {
    if ((err2 == null ? void 0 : err2.name) !== "AbortError") toast({ title: `${app.name || "Rift build"}: could not start the download`, body: (err2 == null ? void 0 : err2.message) || String(err2) });
    return;
  }
  const label = button.textContent;
  button.disabled = true;
  const say2 = (t) => {
    button.textContent = t;
    button.title = `${app.name}: ${t}`;
  };
  let worker = null;
  try {
    say2("Finding build\u2026");
    const { manifestUri, segmentsBaseUri, platform } = await riftMetadata(binaryId);
    if (platform === "ANDROID") throw new Error("this is a Quest build, not a Rift one");
    if (!manifestUri || !segmentsBaseUri) throw new Error("no PC manifest for this build");
    say2("Fetching manifest\u2026");
    const manifest = JSON.parse(riftManifestText(await loadFflate(), await riftManifestBytes(manifestUri)));
    const entries = Object.entries(manifest.files || {});
    if (!entries.length) throw new Error("the manifest listed no files");
    const segHash = (seg) => {
      var _a3;
      return String(Array.isArray(seg) ? seg[1] : (_a3 = seg.sha256) != null ? _a3 : seg);
    };
    const files = entries.map(([name, file], i) => {
      const hashes = (file.segments || []).map(segHash);
      return {
        path: String(name).split(/[\\/]+/).filter((p) => p && p !== "." && p !== "..").join("/") || `file${i}`,
        size: file.size || 0,
        hashes,
        urls: hashes.map((h) => riftSegmentUrl(segmentsBaseUri, h)),
        directs: hashes.map((h) => riftSegmentDirectUrl(segmentsBaseUri, h))
      };
    });
    say2("Downloading 0%");
    let how = null;
    worker = new Worker(new URL(`js/rift-worker.js${siteVersion()}`, document.baseURI), { type: "module" });
    await new Promise((resolve, reject) => {
      worker.onmessage = ({ data: m }) => {
        if (m.type === "progress") say2(`Downloading ${Math.min(99, Math.floor(m.done / m.total * 100))}% \xB7 ${m.file} of ${m.files} files`);
        else if (m.type === "done") resolve(how = m);
        else if (m.type === "error") reject(new Error(m.message));
      };
      worker.onerror = (e) => reject(new Error(e.message || "the download worker could not start"));
      worker.postMessage(
        {
          type: "start",
          files,
          parallel: RIFT_PARALLEL,
          fflateUrl: new URL("js/vendor/fflate.module.js?v=149", document.baseURI).href,
          target: target.kind === "file" ? { kind: "file", handle: target.handle } : { kind: "port", port: target.port }
        },
        target.kind === "port" ? [target.port] : []
      );
    });
    button.textContent = "Downloaded";
    const came = (how == null ? void 0 : how.way) === "direct" ? "straight from Meta" : "through the relay";
    const checked = (how == null ? void 0 : how.verified) && how.verified !== "off" ? "every segment's SHA-256 checked" : "segments not hash-checked";
    button.title = `${target.where === "file" ? `${app.name}: saved ${files.length} files as ${zipName}` : `${app.name}: ${zipName} is in your downloads`} (${came}; ${checked})`;
  } catch (err2) {
    if (!worker && target.kind === "port") target.port.postMessage({ abort: true });
    button.textContent = "Failed";
    button.title = `${app.name}: ${err2.message}`;
    toast({ title: `${app.name || "Rift build"}: download failed`, body: err2.message });
  } finally {
    worker == null ? void 0 : worker.terminate();
    target.cleanup();
    button.disabled = false;
    setTimeout(() => {
      if (button.isConnected && (button.textContent === "Downloaded" || button.textContent === "Failed")) button.textContent = label;
    }, 6e3);
  }
}
function riftManifestText(f, bytes) {
  try {
    const entries = f.unzipSync(bytes, {
      filter: (e) => e.name === "manifest.json" || e.name.endsWith("/manifest.json")
    });
    const key = Object.keys(entries)[0];
    if (!key) throw new Error("no manifest.json in the archive");
    return new TextDecoder().decode(entries[key]);
  } catch {
    try {
      return new TextDecoder().decode(f.gunzipSync(bytes));
    } catch {
      return new TextDecoder().decode(bytes);
    }
  }
}
function downloadCell(v, offerDev, app = null) {
  var _a3;
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
              data-code="${(_a3 = v.versionCode) != null ? _a3 : ""}"
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
      dev ? `${v.version} \u2014 never released to a channel; saved as a .zip as it downloads` : `Download ${v.version} \u2014 saved as a .zip as it downloads`
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
  var _a3, _b3, _c, _d, _e, _f;
  if (!list.length) {
    out.innerHTML = `<p>No builds returned.</p>`;
    return;
  }
  const wasAt = keepScroll ? (_b3 = (_a3 = out.querySelector(".vscroll")) == null ? void 0 : _a3.scrollTop) != null ? _b3 : 0 : 0;
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
      var _a4;
      return `<tr class="${[
        v.channels.length ? "on-channel" : "",
        (app == null ? void 0 : app.onHeadset) && v.versionCode === app.installedVersionCode ? "installed" : ""
      ].filter(Boolean).join(" ")}">
                <td>${esc(v.version)}</td>
                <td class="bid">${buildId(v)}</td>
                <td>${(_a4 = v.releasedAt) != null ? _a4 : "\u2014"}</td>
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
  var _a3;
  const row = button.closest("tr");
  const open2 = (_a3 = row.nextElementSibling) == null ? void 0 : _a3.classList.contains("build-detail");
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
    const before = [...open].filter((k) => k.endsWith(`:${keyOf(app)}`));
    const tabs = before.map((k) => layoutState.panelTabs.get(k));
    Object.assign(app, found);
    before.forEach((k, i) => {
      const moved = `${k.slice(0, k.lastIndexOf(":"))}:${keyOf(app)}`;
      open.delete(k);
      open.add(moved);
      if (tabs[i]) layoutState.panelTabs.set(moved, tabs[i]);
    });
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
var TRAIT_LABELS = {
  CORE_GAMEPLAY: "Gameplay",
  ACTION_TYPE: "Action",
  GAME_THEME: "Theme",
  ART_STYLE: "Art style",
  LEVEL_OF_IMMERSION: "Immersion",
  PLAY_AREA: "Play area",
  PRICING: "Pricing"
};
function traitRows(app) {
  var _a3;
  if (!app.id || !(listings.get(app.id) || results.get(keyOf(app)))) return [];
  const t = traitInfo.get(app.id);
  if (!t && !["traits", "destinations", "related", "bundles"].some(extraOn)) return [];
  if (!t) {
    const { token, frlToken } = loadSettings();
    if ([token, frlToken].some((x) => (x || "").trim() && !x.includes("|"))) loadTraits(app);
    return [];
  }
  if (!t.list) return [];
  const by = /* @__PURE__ */ new Map();
  for (const { key, name } of t.list) if (TRAIT_LABELS[key]) by.set(key, [...(_a3 = by.get(key)) != null ? _a3 : [], name]);
  return Object.keys(TRAIT_LABELS).filter((k) => by.has(k)).map((k) => [TRAIT_LABELS[k], by.get(k).join(", ")]);
}
async function loadTraits(app) {
  var _a3, _b3, _c;
  traitInfo.set(app.id, { loading: true });
  const ask = (name, fn) => extraOn(name) ? fn(app.id) : Promise.resolve(null);
  const [list, dest, related, bundles] = await Promise.allSettled([
    ask("traits", appTraits),
    ask("destinations", appDestinations),
    ask("related", relatedApps),
    ask("bundles", appBundles)
  ]);
  const val = (r) => r.status === "fulfilled" ? r.value : null;
  traitInfo.set(app.id, { list: val(list), dest: (_a3 = val(dest)) != null ? _a3 : [], related: (_b3 = val(related)) != null ? _b3 : [], bundles: (_c = val(bundles)) != null ? _c : [] });
  refreshRow(app);
}
function refreshRow(app) {
  var _a3;
  for (const tr of document.querySelectorAll(`tr.app[data-id="${keyOf(app)}"]`)) {
    const tbody = tr.closest("tbody");
    const scope = tbody === el.adbRows ? "adb" : tbody === el.mineRows ? "mine" : tbody === el.orgRows ? "orgs" : tbody === el.defaultRows ? "default" : tbody === el.plusRows ? "plus" : tbody === el.storeRows ? "store" : tbody === el.wishRows ? "wishlist" : "main";
    const next = tr.nextElementSibling;
    tr.replaceWith(scope === "adb" ? adbRow(app) : appRow(app, scope));
    if (next == null ? void 0 : next.classList.contains("detail")) {
      next.replaceWith(detailRow(app, scope === "adb" ? 5 : void 0, scope));
    }
  }
  if (isStaged(app)) refreshStage();
  const wrow = (_a3 = el.watchRows) == null ? void 0 : _a3.querySelector(`tr.watch-row[data-id="${keyOf(app)}"]`);
  const wnext = wrow == null ? void 0 : wrow.nextElementSibling;
  if (wnext == null ? void 0 : wnext.classList.contains("detail")) {
    const w = readWatch().find((x) => x.id === String(keyOf(app)));
    if (w) wnext.replaceWith(detailRow(appFromWatch(w), 4, "watchlist"));
  }
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
  if (!list.length || button.disabled) return;
  button.disabled = true;
  el.checkAll.disabled = true;
  el.checkOrg.disabled = true;
  try {
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
  } finally {
    button.textContent = label;
    button.disabled = false;
    el.checkAll.disabled = false;
    el.checkOrg.disabled = false;
  }
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
  var _a3;
  return (_a3 = [...document.querySelectorAll(selector)].find((e) => e.getClientRects().length)) != null ? _a3 : null;
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
      body: "Apps also holds the Store (its front page and Horizon+), the default apps, Horizon worlds, an organization's apps and the watchlist. User has your headsets and their OS updates, your Library (what you own, bought and wished for), people, photos and your avatar. Device has ADB."
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
    var _a3;
    const action = (_a3 = e.target.closest("[data-tour]")) == null ? void 0 : _a3.dataset.tour;
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
    var _a3, _b3;
    const row = (_b3 = (_a3 = e.target).closest) == null ? void 0 : _b3.call(_a3, "tr[data-world]");
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
function library() {
  return libraryToken === loadSettings().token ? libraryNames : null;
}
function appNames() {
  var _a3;
  if (library()) return Promise.resolve(libraryNames);
  (_a3 = layoutState.names) != null ? _a3 : layoutState.names = (async () => {
    const { token } = loadSettings();
    let list = mineKind === "quest" && mineList.length ? mineList : null;
    let error = "";
    if (!list) {
      try {
        list = await myEntitlements("quest");
      } catch (err2) {
        list = [];
        error = err2.message;
      }
    }
    libraryNames = new Map(list.map((a) => [a.id, a]));
    libraryToken = token;
    libraryError = error;
    layoutState.names = null;
    return libraryNames;
  })();
  return layoutState.names;
}
function headsetLabel(serial) {
  var _a3;
  const d = deviceList.find((x) => x.serial === serial);
  const model = (_a3 = d == null ? void 0 : d.model) != null ? _a3 : "Unknown headset";
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
  var _a3;
  (_a3 = playState.promise) != null ? _a3 : playState.promise = fetchPlaytime().finally(() => playState.promise = null);
  return playState.promise;
}
function loadBackups() {
  var _a3;
  (_a3 = backupState.promise) != null ? _a3 : backupState.promise = fetchBackups().finally(() => backupState.promise = null);
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
  var _a3, _b3;
  return (_b3 = (_a3 = r.appId) != null ? _a3 : r.packageName) != null ? _b3 : "?";
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
  var _a3, _b3;
  const key = keyOf(app);
  if (scope === "backup") {
    const backs = backupState.rows.filter((r) => recordKey(r) === key).sort((a, b) => {
      var _a4, _b4;
      return ((_a4 = b.backedUpAt) != null ? _a4 : 0) - ((_b4 = a.backedUpAt) != null ? _b4 : 0);
    });
    const size = backs.reduce((sum, r) => sum + r.size, 0);
    return accountTable({
      title: "Cloud backups",
      state: backupState,
      what: "cloud backups",
      rows: backs,
      load: load ? { key: "backup", label: "Get cloud backups" } : null,
      summary: `${plural(backs.length, "backup")}, ${esc((_a3 = mb(size)) != null ? _a3 : "0 MB")} in all, the latest ${esc(
        isoDay((_b3 = backs[0]) == null ? void 0 : _b3.backedUpAt)
      )}.`,
      head: ["Headset", "Type", "Size", "Backed up"],
      cells: (r) => {
        var _a4;
        return `<td>${esc(r.serial ? headsetLabel(r.serial) : "\u2014")}</td><td>${esc(r.type ? words2(r.type) : "\u2014")}</td><td>${esc((_a4 = mb(r.size)) != null ? _a4 : "\u2014")}</td><td>${esc(isoDay(r.backedUpAt))}</td>`;
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
  var _a3;
  (_a3 = iapState.promise) != null ? _a3 : iapState.promise = fetchIaps().finally(() => iapState.promise = null);
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
  var _a3;
  const items = [...(_a3 = iapState.byApp.get(app.id)) != null ? _a3 : []].sort(
    (a, b) => {
      var _a4, _b3;
      return ((_a4 = b.grantedAt) != null ? _a4 : 0) - ((_b3 = a.grantedAt) != null ? _b3 : 0);
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
  state.note = "";
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
  var _a3;
  const [source, name] = (_a3 = WORLD_SHELVES.find(([s]) => s === el.worldShelf.value)) != null ? _a3 : WORLD_SHELVES[0];
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
    var _a3, _b3;
    return ((_a3 = b[key]) != null ? _a3 : -1) - ((_b3 = a[key]) != null ? _b3 : -1);
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
  var _a3, _b3, _c, _d, _e;
  const q = el.worldQ.value.trim().toLowerCase();
  const sort = worldSorter(el.worldSort.value);
  const paged = pagedWorlds();
  const all = worldTab === "lookup" ? worldLookups : worldTab === "saved" ? worldState.rows : paged.rows;
  const shown = all.filter((w) => textMatch(q, w.name, w.id));
  const rows = sort ? shown.sort(sort) : shown;
  const art = loadSettings().images;
  const focused = (_c = (_b3 = (_a3 = document.activeElement) == null ? void 0 : _a3.closest) == null ? void 0 : _b3.call(_a3, "#worldRows tr[data-world]")) == null ? void 0 : _c.dataset.world;
  el.worldRows.innerHTML = rows.map(
    (w) => `<tr class="app" tabindex="0" data-world="${esc(w.id)}" aria-expanded="${worldOpen.has(w.id)}">
      <td class="name">${art && w.image ? `<img class="art" src="${esc(w.image)}" alt="" loading="lazy">` : ""}${esc(w.name)}</td>
      <td class="num c-wid">${esc(w.id)}</td>
      <td class="num">${bigNumber(w.visits)}</td>
      <td class="num">${bigNumber(w.online)}</td>
      <td class="num">${bigNumber(w.likes)}</td>
    </tr>${worldOpen.has(w.id) ? worldDetail(w) : ""}`
  ).join("");
  if (focused) (_d = el.worldRows.querySelector(`tr[data-world="${CSS.escape(focused)}"]`)) == null ? void 0 : _d.focus();
  for (const img of el.worldRows.querySelectorAll(".world-pics img"))
    img.addEventListener("error", () => {
      var _a4;
      return (_a4 = img.closest("figure")) == null ? void 0 : _a4.remove();
    }, { once: true });
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
  const names = library();
  const own = names == null ? void 0 : names.get(app.id);
  const ownLine = !names ? "<p>Asking the store what this account owns\u2026</p>" : libraryError ? `<p class="warn">Could not read your Quest library: ${esc(libraryError)}</p>` : own ? `<p class="hint">In your Quest library \u2014 ${esc(own.state ? words2(own.state) : "owned")}, from ${esc(
    grantLabel(own.grant)
  )}${own.lastUsed ? `, last played ${esc(isoDay(own.lastUsed))}` : ""}.</p>` : `<p class="hint">Not in your Quest library.</p>`;
  return `<h3>Ownership</h3>${ownLine}${channelSection(app)}${app.platform === "PC" ? "" : dlcTable(app)}${accountSections(app, "play", { load: true })}`;
}
function cloudPaneHtml(app) {
  if (!app.id) return `<p>No store ID to read cloud backups for.</p>`;
  let list;
  if (!backupState.asked) {
    list = `<div class="controls"><button type="button" data-load="cloudbackups">Get cloud backups</button></div>
       <p class="hint">The app-data backups Meta holds for this app across your headsets \u2014 a game's saves, progress and settings. Needs your own access token.</p>`;
  } else if (backupState.loading) {
    list = `<div class="controls"><button type="button" disabled>Loading\u2026</button></div>`;
  } else if (backupState.note && !backupState.rows.length) {
    list = `<p class="warn">${esc(backupState.note)}</p>`;
  } else {
    const backs = backupState.rows.filter((r) => recordKey(r) === keyOf(app)).sort((a, b) => {
      var _a3, _b3;
      return ((_a3 = b.backedUpAt) != null ? _a3 : 0) - ((_b3 = a.backedUpAt) != null ? _b3 : 0);
    });
    list = backs.length ? backupsTable(backs) : `<p>No cloud backups for this app.</p>`;
  }
  return `${list}${app.platform !== "PC" ? backupRulesSection(app) : ""}`;
}
function backupsTable(backs) {
  var _a3, _b3;
  const size = backs.reduce((sum, r) => sum + r.size, 0);
  const rows = backs.map((r) => {
    var _a4;
    const open2 = Boolean(backupDetailCache.get(r.id));
    return `<tr>
          <td>${esc(r.serial ? headsetLabel(r.serial) : "\u2014")}</td>
          <td>${esc(r.type ? words2(r.type) : "\u2014")}</td>
          <td>${esc((_a4 = mb(r.size)) != null ? _a4 : "\u2014")}</td>
          <td>${esc(isoDay(r.backedUpAt))}</td>
          <td class="backup-act"><button type="button" class="build-btn" data-backup-detail="${esc(r.id)}" aria-expanded="${open2}">${open2 ? "Hide" : "Details"}</button></td>
        </tr>${backupDetailRow(r)}`;
  }).join("");
  return `<p class="hint">${plural(backs.length, "backup")}, ${esc((_a3 = mb(size)) != null ? _a3 : "0 MB")} in all, the latest ${esc(
    isoDay((_b3 = backs[0]) == null ? void 0 : _b3.backedUpAt)
  )}.</p>
    <div class="vscroll short">
      <table class="vtable plain">
        <thead><tr><th>Headset</th><th>Type</th><th>Size</th><th>Backed up</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
function backupDetailRow(r) {
  var _a3, _b3;
  const c = backupDetailCache.get(r.id);
  if (!c) return "";
  let inner;
  if (c.loading) inner = `<span class="muted">Loading backup details\u2026</span>`;
  else if (c.error) inner = `<span class="warn">${esc(c.error)}</span>`;
  else {
    const d = c.detail;
    const facts = [
      d.segments != null ? `${bigNumber(d.segments)} segment${d.segments === 1 ? "" : "s"}` : null,
      d.checksum ? `checksum ${esc(d.checksum.slice(0, 20))}${d.checksum.length > 20 ? "\u2026" : ""}` : null
    ].filter(Boolean).join(" \xB7 ");
    const dlBtn = (url, label) => `<a class="backup-dl" href="${esc(url)}" target="_blank" rel="noopener" download>${esc(label)}</a>`;
    const where = d.downloadUri ? `<div class="backup-dl-row">${dlBtn(d.downloadUri, "Download backup")}</div>` : ((_a3 = d.segmentUris) == null ? void 0 : _a3.length) ? `<div class="backup-dl-row">${d.segmentUris.map((u, i) => dlBtn(u, `Segment ${i + 1} of ${d.segmentUris.length}`)).join("")}</div>` : `<span class="muted">No download address returned.</span>${((_b3 = d.fields) == null ? void 0 : _b3.length) ? `<div class="backup-fields">The store's reply carried only: <span class="mono">${esc(d.fields.join(", "))}</span></div>` : ""}`;
    inner = `${where}
        ${facts ? `<div class="backup-facts">${facts}</div>` : ""}
        <p class="hint backup-note">End-to-end encrypted with a key kept in the headset that made it (and your PIN, if you set one), so only a headset can restore it. Download it, then read the downloaded file here to see how it is put together \u2014 it is read in this browser and sent nowhere.</p>
        <div class="backup-dl-row"><button type="button" class="backup-dl" data-backup-pick="${esc(r.id)}">${c.reading ? "Reading\u2026" : "Read a downloaded copy"}</button><input type="file" hidden data-backup-file="${esc(r.id)}"></div>
        ${backupReadHtml(c)}`;
  }
  return `<tr class="backup-detail"><td colspan="5">${inner}</td></tr>`;
}
async function readBackupBlob(file, expectedChecksum) {
  const buf = new Uint8Array(await file.arrayBuffer());
  if (buf.length < 76) throw new Error("This file is too short to be a cloud backup.");
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const version = [dv.getUint32(0), dv.getUint32(4), dv.getUint32(8)];
  const key = new TextDecoder().decode(buf.subarray(12, 76));
  if (!/^[0-9a-f]{64}$/.test(key)) throw new Error("This file doesn't start like a Quest cloud backup.");
  const head = buf.subarray(0, 76);
  const starts = [];
  for (let i = 0; i <= buf.length - 76; i++) {
    if (buf[i] !== head[0] || buf[i + 12] !== head[12] || buf[i + 75] !== head[75]) continue;
    let same = true;
    for (let j = 1; j < 76 && same; j++) same = buf[i + j] === head[j];
    if (same) {
      starts.push(i);
      i += 75;
    }
  }
  const sizes = starts.map((at, k) => {
    var _a3;
    return ((_a3 = starts[k + 1]) != null ? _a3 : buf.length) - at - 76;
  });
  const counts = new Array(256).fill(0);
  let seen = 0;
  for (const [k, at] of starts.entries()) {
    if (starts.length > 200 && k % Math.ceil(starts.length / 200)) continue;
    for (let i = at + 76, end = at + 76 + Math.min(sizes[k], 4096); i < end; i++) counts[buf[i]]++;
    seen += Math.min(sizes[k], 4096);
  }
  const entropy = seen ? -counts.reduce((h, n) => n ? h + n / seen * Math.log2(n / seen) : h, 0) : null;
  const sha = [...new Uint8Array(await crypto.subtle.digest("SHA-256", buf))].map((x) => x.toString(16).padStart(2, "0")).join("");
  const want = String(expectedChecksum || "").toLowerCase().replace(/[^0-9a-f]/g, "");
  return {
    name: file.name,
    size: buf.length,
    version: version.join("."),
    key,
    records: starts.length,
    smallest: Math.min(...sizes),
    largest: Math.max(...sizes),
    entropy,
    sha,
    checksum: want.length === 64 ? want === sha : null
  };
}
function backupReadHtml(c) {
  if (c.readError) return `<p class="warn">${esc(c.readError)}</p>`;
  const r = c.read;
  if (!r) return "";
  const kb = (n) => n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${(n / 1024).toFixed(1)} KB`;
  return factGroups([
    [
      `What ${esc(r.name)} is`,
      [
        ["Format", `Quest cloud backup, version ${r.version}`],
        ["Size", `${kb(r.size)} (${bigNumber(r.size)} bytes)`],
        [
          "Records",
          `${bigNumber(r.records)} encrypted record${r.records === 1 ? "" : "s"}${r.records > 1 ? `, ${kb(r.smallest)} to ${kb(r.largest)} each` : ""}`
        ],
        ["Locked with key", `${r.key.slice(0, 12)}\u2026${r.key.slice(-12)} \u2014 held by the headset that made it`],
        [
          "Inside",
          r.entropy != null && r.entropy > 7.9 ? `Ciphertext throughout (${r.entropy.toFixed(2)} bits per byte); no file names or sizes are stored in the clear` : r.entropy != null ? `${r.entropy.toFixed(2)} bits per byte \u2014 less random than ciphertext usually is` : null
        ],
        [
          "Checksum",
          r.checksum === true ? "Matches the store's \u2014 this is the backup listed above" : r.checksum === false ? "Doesn't match the store's \u2014 this may be a different backup" : `SHA-256 ${r.sha.slice(0, 16)}\u2026`
        ]
      ]
    ]
  ]);
}
function initBackupReader() {
  document.addEventListener("click", (e) => {
    var _a3, _b3, _c;
    const b = (_b3 = (_a3 = e.target).closest) == null ? void 0 : _b3.call(_a3, "[data-backup-pick]");
    if (!b) return;
    e.stopPropagation();
    (_c = b.parentElement.querySelector("[data-backup-file]")) == null ? void 0 : _c.click();
  });
  document.addEventListener("change", async (e) => {
    var _a3, _b3, _c;
    const input = (_b3 = (_a3 = e.target).closest) == null ? void 0 : _b3.call(_a3, "[data-backup-file]");
    const file = (_c = input == null ? void 0 : input.files) == null ? void 0 : _c[0];
    if (!file) return;
    const id = input.dataset.backupFile;
    const c = backupDetailCache.get(id);
    if (!(c == null ? void 0 : c.detail)) return;
    Object.assign(c, { reading: true, read: null, readError: null });
    renderAccountTabs();
    try {
      c.read = await readBackupBlob(file, c.detail.checksum);
    } catch (err2) {
      c.readError = err2.message || "Could not read this file.";
    }
    c.reading = false;
    renderAccountTabs();
  });
}
function toggleBackupDetail(id) {
  const cur = backupDetailCache.get(id);
  if (cur == null ? void 0 : cur.loading) return;
  if (cur) {
    backupDetailCache.delete(id);
    renderAccountTabs();
    return;
  }
  backupDetailCache.set(id, { loading: true });
  renderAccountTabs();
  fetchCloudBackup(id).then((detail) => backupDetailCache.set(id, { detail })).catch((err2) => backupDetailCache.set(id, { error: `Could not load backup details: ${err2.message}` })).finally(() => renderAccountTabs());
}
function backupRulesSection(app) {
  const c = backupRulesCache.get(app.id);
  let body;
  if (!c) body = `<button type="button" data-load="backuprules">Get backup settings</button>`;
  else if (c.loading) body = `<button type="button" disabled>Loading\u2026</button>`;
  else if (c.error) body = `<p class="warn">${esc(c.error)}</p>`;
  else if (c.rules.enabled === false) body = `<p class="hint">This app is not backed up to the cloud: its developer has cloud backup switched off.</p>`;
  else {
    const on = c.rules.enabled ? "This app's data is backed up to the cloud" : "The store did not say whether this app is backed up";
    body = c.rules.excluded.length ? `<p class="hint">${on}, except ${plural(c.rules.excluded.length, "path")} its developer left out:</p>
         <ul class="backup-excluded">${c.rules.excluded.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : `<p class="hint">${on}, all of it: its developer left nothing out.</p>`;
  }
  return `<h3>What gets backed up</h3>${body}`;
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
        var _a3, _b3;
        return `<tr>
                <td>${esc(c.name)}</td>
                <td>${esc((_a3 = c.version) != null ? _a3 : "\u2014")}</td>
                <td>${(_b3 = c.versionCode) != null ? _b3 : "\u2014"}</td>
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
  if (!library()) appNames().then(() => renderAccountTabs());
}
function loadForApp(app, what) {
  var _a3;
  if (what === "dlc") return loadIaps();
  if (what === "play") return loadPlaytime();
  if (what === "backup" || what === "cloudbackups") return loadBackups();
  if (what === "backuprules" && (app == null ? void 0 : app.id) && !((_a3 = backupRulesCache.get(app.id)) == null ? void 0 : _a3.loading)) {
    backupRulesCache.set(app.id, { loading: true });
    renderAccountTabs();
    backupRules(app.id).then((rules) => backupRulesCache.set(app.id, { rules })).catch((err2) => backupRulesCache.set(app.id, { error: `Could not load backup settings: ${err2.message}` })).finally(() => renderAccountTabs());
    return;
  }
  if (what === "channels" && (app == null ? void 0 : app.id) && !layoutState.channelAsked.has(app.id)) {
    layoutState.channelAsked.add(app.id);
    layoutState.channelErrors.delete(app.id);
    renderAccountTabs();
    myReleaseChannels(app.id).then((found) => myChannels.set(app.id, found != null ? found : { none: true, current: null, channels: [] })).catch((err2) => layoutState.channelErrors.set(app.id, err2.message || "Could not load release channels.")).finally(() => renderAccountTabs());
  }
}
function toggleWorld(id) {
  var _a3;
  if (worldOpen.has(id)) worldOpen.delete(id);
  else {
    worldOpen.add(id);
  }
  renderWorlds();
  (_a3 = el.worldRows.querySelector(`tr[data-world="${CSS.escape(id)}"]`)) == null ? void 0 : _a3.focus();
}
function getWorldDetails(id) {
  if (!worldInfo.has(id)) loadWorld(id);
  loadWorldFlags(id);
}
async function loadWorld(id) {
  const world = anyWorld(id);
  if (!world) return;
  worldInfo.set(id, { loading: true, data: null, note: "" });
  renderWorlds();
  try {
    const data = await worldDetails(world);
    if (extraOn("worldExtras")) data.store = await worldStoreExtras(world.id, data.storeDestinationId).catch(() => null);
    worldInfo.set(id, { loading: false, data, note: "" });
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
  renderWorlds();
  try {
    worldFlagInfo.set(id, await worldFlags(id));
  } catch {
    worldFlagInfo.set(id, {});
  }
  renderWorlds();
}
var yesNo = (v) => v == null ? null : v ? "Yes" : "No";
function worldDetail(w) {
  var _a3, _b3, _c, _d, _e, _f;
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
          ["Runtime", ask(f.runtime)],
          ["Genres", ((_b3 = (_a3 = d.store) == null ? void 0 : _a3.genres) == null ? void 0 : _b3.length) ? d.store.genres.join(", ") : null],
          ["Content rating", (_c = d.store) == null ? void 0 : _c.rating],
          ["Visited by you", ((_d = d.store) == null ? void 0 : _d.visited) == null ? null : d.store.visited ? "Yes" : "No"]
        ]
      ],
      ["Similar worlds", ((_f = (_e = d.store) == null ? void 0 : _e.similar) != null ? _f : []).map((x) => [esc(x.name), x.price || "\u2014"])]
    ])}${f.description ? `<h3>Description</h3><p>${esc(f.description).replace(/\n/g, "<br>")}</p>` : ""}${d.launchLink ? `<h3>Launch link</h3><p class="world-link">${esc(launchTarget(d.launchLink))}</p>` : ""}${pictures}`;
  }
  return `<tr class="detail"><td colspan="5"><div class="panel">${body}</div></td></tr>`;
}
function launchTarget(raw) {
  var _a3;
  try {
    const j = JSON.parse(raw);
    return ((_a3 = j == null ? void 0 : j.ovr_social_launch) == null ? void 0 : _a3.deeplink_message) || raw;
  } catch {
    return raw;
  }
}
function setWorldNote(text, bad = false) {
  el.worldLookupNote.textContent = text;
  el.worldLookupNote.classList.toggle("bad", bad);
  el.worldLookupNote.hidden = !text;
}
async function lookUpWorld() {
  var _a3;
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
  (_a3 = el.worldRows.querySelector(`tr[data-world="${CSS.escape(id)}"]`)) == null ? void 0 : _a3.scrollIntoView({ block: "nearest" });
}
window.__metadbStarted = true;
