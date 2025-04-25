var qu = Object.defineProperty;
var Gu = (e, t, n) => t in e ? qu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Se = (e, t, n) => Gu(e, typeof t != "symbol" ? t + "" : t, n);
/**
* @vue/shared v3.5.12
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Go(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const Ae = {}, Hn = [], Ht = () => {
}, Yu = () => !1, kr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Yo = (e) => e.startsWith("onUpdate:"), Fe = Object.assign, Qo = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Qu = Object.prototype.hasOwnProperty, ye = (e, t) => Qu.call(e, t), Z = Array.isArray, zn = (e) => Ms(e) === "[object Map]", xr = (e) => Ms(e) === "[object Set]", Pi = (e) => Ms(e) === "[object Date]", re = (e) => typeof e == "function", De = (e) => typeof e == "string", zt = (e) => typeof e == "symbol", Re = (e) => e !== null && typeof e == "object", El = (e) => (Re(e) || re(e)) && re(e.then) && re(e.catch), Al = Object.prototype.toString, Ms = (e) => Al.call(e), Xu = (e) => Ms(e).slice(8, -1), Cl = (e) => Ms(e) === "[object Object]", Xo = (e) => De(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ds = /* @__PURE__ */ Go(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Er = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Ju = /-(\w)/g, St = Er(
  (e) => e.replace(Ju, (t, n) => n ? n.toUpperCase() : "")
), Zu = /\B([A-Z])/g, hn = Er(
  (e) => e.replace(Zu, "-$1").toLowerCase()
), Ar = Er((e) => e.charAt(0).toUpperCase() + e.slice(1)), Kr = Er(
  (e) => e ? `on${Ar(e)}` : ""
), fn = (e, t) => !Object.is(e, t), Gs = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Tl = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, po = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, ef = (e) => {
  const t = De(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Di;
const Cr = () => Di || (Di = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ln(e) {
  if (Z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], r = De(s) ? rf(s) : Ln(s);
      if (r)
        for (const o in r)
          t[o] = r[o];
    }
    return t;
  } else if (De(e) || Re(e))
    return e;
}
const tf = /;(?![^(]*\))/g, nf = /:([^]+)/, sf = /\/\*[^]*?\*\//g;
function rf(e) {
  const t = {};
  return e.replace(sf, "").split(tf).forEach((n) => {
    if (n) {
      const s = n.split(nf);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function je(e) {
  let t = "";
  if (De(e))
    t = e;
  else if (Z(e))
    for (let n = 0; n < e.length; n++) {
      const s = je(e[n]);
      s && (t += s + " ");
    }
  else if (Re(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const of = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", af = /* @__PURE__ */ Go(of);
function Sl(e) {
  return !!e || e === "";
}
function lf(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = Tr(e[s], t[s]);
  return n;
}
function Tr(e, t) {
  if (e === t) return !0;
  let n = Pi(e), s = Pi(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = zt(e), s = zt(t), n || s)
    return e === t;
  if (n = Z(e), s = Z(t), n || s)
    return n && s ? lf(e, t) : !1;
  if (n = Re(e), s = Re(t), n || s) {
    if (!n || !s)
      return !1;
    const r = Object.keys(e).length, o = Object.keys(t).length;
    if (r !== o)
      return !1;
    for (const i in e) {
      const a = e.hasOwnProperty(i), l = t.hasOwnProperty(i);
      if (a && !l || !a && l || !Tr(e[i], t[i]))
        return !1;
    }
  }
  return String(e) === String(t);
}
function Rl(e, t) {
  return e.findIndex((n) => Tr(n, t));
}
const Ll = (e) => !!(e && e.__v_isRef === !0), ee = (e) => De(e) ? e : e == null ? "" : Z(e) || Re(e) && (e.toString === Al || !re(e.toString)) ? Ll(e) ? ee(e.value) : JSON.stringify(e, Il, 2) : String(e), Il = (e, t) => Ll(t) ? Il(e, t.value) : zn(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, r], o) => (n[qr(s, o) + " =>"] = r, n),
    {}
  )
} : xr(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => qr(n))
} : zt(t) ? qr(t) : Re(t) && !Z(t) && !Cl(t) ? String(t) : t, qr = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    zt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.12
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let gt;
class Ml {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = gt, !t && gt && (this.index = (gt.scopes || (gt.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = gt;
      try {
        return gt = this, t();
      } finally {
        gt = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    gt = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    gt = this.parent;
  }
  stop(t) {
    if (this._active) {
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.scopes)
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0, this._active = !1;
    }
  }
}
function cf(e) {
  return new Ml(e);
}
function uf() {
  return gt;
}
let Le;
const Gr = /* @__PURE__ */ new WeakSet();
class Ol {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, gt && gt.active && gt.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Gr.has(this) && (Gr.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || $l(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Fi(this), Pl(this);
    const t = Le, n = It;
    Le = this, It = !0;
    try {
      return this.fn();
    } finally {
      Dl(this), Le = t, It = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        ei(t);
      this.deps = this.depsTail = void 0, Fi(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Gr.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    mo(this) && this.run();
  }
  get dirty() {
    return mo(this);
  }
}
let Nl = 0, hs, ps;
function $l(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = ps, ps = e;
    return;
  }
  e.next = hs, hs = e;
}
function Jo() {
  Nl++;
}
function Zo() {
  if (--Nl > 0)
    return;
  if (ps) {
    let t = ps;
    for (ps = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; hs; ) {
    let t = hs;
    for (hs = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function Pl(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Dl(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === n && (n = r), ei(s), ff(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = n;
}
function mo(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Fl(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Fl(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ks))
    return;
  e.globalVersion = ks;
  const t = e.dep;
  if (e.flags |= 2, t.version > 0 && !e.isSSR && e.deps && !mo(e)) {
    e.flags &= -3;
    return;
  }
  const n = Le, s = It;
  Le = e, It = !0;
  try {
    Pl(e);
    const r = e.fn(e._value);
    (t.version === 0 || fn(r, e._value)) && (e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    Le = n, It = s, Dl(e), e.flags &= -3;
  }
}
function ei(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: r } = e;
  if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let o = n.computed.deps; o; o = o.nextDep)
      ei(o, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function ff(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let It = !0;
const Bl = [];
function pn() {
  Bl.push(It), It = !1;
}
function mn() {
  const e = Bl.pop();
  It = e === void 0 ? !0 : e;
}
function Fi(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = Le;
    Le = void 0;
    try {
      t();
    } finally {
      Le = n;
    }
  }
}
let ks = 0;
class df {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class ti {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0;
  }
  track(t) {
    if (!Le || !It || Le === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== Le)
      n = this.activeLink = new df(Le, this), Le.deps ? (n.prevDep = Le.depsTail, Le.depsTail.nextDep = n, Le.depsTail = n) : Le.deps = Le.depsTail = n, Ul(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = Le.depsTail, n.nextDep = void 0, Le.depsTail.nextDep = n, Le.depsTail = n, Le.deps === n && (Le.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, ks++, this.notify(t);
  }
  notify(t) {
    Jo();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Zo();
    }
  }
}
function Ul(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Ul(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const go = /* @__PURE__ */ new WeakMap(), Sn = Symbol(
  ""
), _o = Symbol(
  ""
), xs = Symbol(
  ""
);
function Ge(e, t, n) {
  if (It && Le) {
    let s = go.get(e);
    s || go.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(n);
    r || (s.set(n, r = new ti()), r.map = s, r.key = n), r.track();
  }
}
function Gt(e, t, n, s, r, o) {
  const i = go.get(e);
  if (!i) {
    ks++;
    return;
  }
  const a = (l) => {
    l && l.trigger();
  };
  if (Jo(), t === "clear")
    i.forEach(a);
  else {
    const l = Z(e), u = l && Xo(n);
    if (l && n === "length") {
      const c = Number(s);
      i.forEach((f, h) => {
        (h === "length" || h === xs || !zt(h) && h >= c) && a(f);
      });
    } else
      switch ((n !== void 0 || i.has(void 0)) && a(i.get(n)), u && a(i.get(xs)), t) {
        case "add":
          l ? u && a(i.get("length")) : (a(i.get(Sn)), zn(e) && a(i.get(_o)));
          break;
        case "delete":
          l || (a(i.get(Sn)), zn(e) && a(i.get(_o)));
          break;
        case "set":
          zn(e) && a(i.get(Sn));
          break;
      }
  }
  Zo();
}
function Fn(e) {
  const t = me(e);
  return t === e ? t : (Ge(t, "iterate", xs), Tt(e) ? t : t.map(Ye));
}
function Sr(e) {
  return Ge(e = me(e), "iterate", xs), e;
}
const hf = {
  __proto__: null,
  [Symbol.iterator]() {
    return Yr(this, Symbol.iterator, Ye);
  },
  concat(...e) {
    return Fn(this).concat(
      ...e.map((t) => Z(t) ? Fn(t) : t)
    );
  },
  entries() {
    return Yr(this, "entries", (e) => (e[1] = Ye(e[1]), e));
  },
  every(e, t) {
    return Vt(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Vt(this, "filter", e, t, (n) => n.map(Ye), arguments);
  },
  find(e, t) {
    return Vt(this, "find", e, t, Ye, arguments);
  },
  findIndex(e, t) {
    return Vt(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Vt(this, "findLast", e, t, Ye, arguments);
  },
  findLastIndex(e, t) {
    return Vt(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Vt(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Qr(this, "includes", e);
  },
  indexOf(...e) {
    return Qr(this, "indexOf", e);
  },
  join(e) {
    return Fn(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return Qr(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Vt(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return rs(this, "pop");
  },
  push(...e) {
    return rs(this, "push", e);
  },
  reduce(e, ...t) {
    return Bi(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Bi(this, "reduceRight", e, t);
  },
  shift() {
    return rs(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Vt(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return rs(this, "splice", e);
  },
  toReversed() {
    return Fn(this).toReversed();
  },
  toSorted(e) {
    return Fn(this).toSorted(e);
  },
  toSpliced(...e) {
    return Fn(this).toSpliced(...e);
  },
  unshift(...e) {
    return rs(this, "unshift", e);
  },
  values() {
    return Yr(this, "values", Ye);
  }
};
function Yr(e, t, n) {
  const s = Sr(e), r = s[t]();
  return s !== e && !Tt(e) && (r._next = r.next, r.next = () => {
    const o = r._next();
    return o.value && (o.value = n(o.value)), o;
  }), r;
}
const pf = Array.prototype;
function Vt(e, t, n, s, r, o) {
  const i = Sr(e), a = i !== e && !Tt(e), l = i[t];
  if (l !== pf[t]) {
    const f = l.apply(e, o);
    return a ? Ye(f) : f;
  }
  let u = n;
  i !== e && (a ? u = function(f, h) {
    return n.call(this, Ye(f), h, e);
  } : n.length > 2 && (u = function(f, h) {
    return n.call(this, f, h, e);
  }));
  const c = l.call(i, u, s);
  return a && r ? r(c) : c;
}
function Bi(e, t, n, s) {
  const r = Sr(e);
  let o = n;
  return r !== e && (Tt(e) ? n.length > 3 && (o = function(i, a, l) {
    return n.call(this, i, a, l, e);
  }) : o = function(i, a, l) {
    return n.call(this, i, Ye(a), l, e);
  }), r[t](o, ...s);
}
function Qr(e, t, n) {
  const s = me(e);
  Ge(s, "iterate", xs);
  const r = s[t](...n);
  return (r === -1 || r === !1) && oi(n[0]) ? (n[0] = me(n[0]), s[t](...n)) : r;
}
function rs(e, t, n = []) {
  pn(), Jo();
  const s = me(e)[t].apply(e, n);
  return Zo(), mn(), s;
}
const mf = /* @__PURE__ */ Go("__proto__,__v_isRef,__isVue"), Hl = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(zt)
);
function gf(e) {
  zt(e) || (e = String(e));
  const t = me(this);
  return Ge(t, "has", e), t.hasOwnProperty(e);
}
class zl {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    const r = this._isReadonly, o = this._isShallow;
    if (n === "__v_isReactive")
      return !r;
    if (n === "__v_isReadonly")
      return r;
    if (n === "__v_isShallow")
      return o;
    if (n === "__v_raw")
      return s === (r ? o ? Cf : Kl : o ? Wl : Vl).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const i = Z(t);
    if (!r) {
      let l;
      if (i && (l = hf[n]))
        return l;
      if (n === "hasOwnProperty")
        return gf;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      qe(t) ? t : s
    );
    return (zt(n) ? Hl.has(n) : mf(n)) || (r || Ge(t, "get", n), o) ? a : qe(a) ? i && Xo(n) ? a : a.value : Re(a) ? r ? ql(a) : si(a) : a;
  }
}
class jl extends zl {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let o = t[n];
    if (!this._isShallow) {
      const l = In(o);
      if (!Tt(s) && !In(s) && (o = me(o), s = me(s)), !Z(t) && qe(o) && !qe(s))
        return l ? !1 : (o.value = s, !0);
    }
    const i = Z(t) && Xo(n) ? Number(n) < t.length : ye(t, n), a = Reflect.set(
      t,
      n,
      s,
      qe(t) ? t : r
    );
    return t === me(r) && (i ? fn(s, o) && Gt(t, "set", n, s) : Gt(t, "add", n, s)), a;
  }
  deleteProperty(t, n) {
    const s = ye(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && Gt(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!zt(n) || !Hl.has(n)) && Ge(t, "has", n), s;
  }
  ownKeys(t) {
    return Ge(
      t,
      "iterate",
      Z(t) ? "length" : Sn
    ), Reflect.ownKeys(t);
  }
}
class _f extends zl {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const bf = /* @__PURE__ */ new jl(), vf = /* @__PURE__ */ new _f(), yf = /* @__PURE__ */ new jl(!0);
const bo = (e) => e, Hs = (e) => Reflect.getPrototypeOf(e);
function wf(e, t, n) {
  return function(...s) {
    const r = this.__v_raw, o = me(r), i = zn(o), a = e === "entries" || e === Symbol.iterator && i, l = e === "keys" && i, u = r[e](...s), c = n ? bo : t ? vo : Ye;
    return !t && Ge(
      o,
      "iterate",
      l ? _o : Sn
    ), {
      // iterator protocol
      next() {
        const { value: f, done: h } = u.next();
        return h ? { value: f, done: h } : {
          value: a ? [c(f[0]), c(f[1])] : c(f),
          done: h
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function zs(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function kf(e, t) {
  const n = {
    get(r) {
      const o = this.__v_raw, i = me(o), a = me(r);
      e || (fn(r, a) && Ge(i, "get", r), Ge(i, "get", a));
      const { has: l } = Hs(i), u = t ? bo : e ? vo : Ye;
      if (l.call(i, r))
        return u(o.get(r));
      if (l.call(i, a))
        return u(o.get(a));
      o !== i && o.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && Ge(me(r), "iterate", Sn), Reflect.get(r, "size", r);
    },
    has(r) {
      const o = this.__v_raw, i = me(o), a = me(r);
      return e || (fn(r, a) && Ge(i, "has", r), Ge(i, "has", a)), r === a ? o.has(r) : o.has(r) || o.has(a);
    },
    forEach(r, o) {
      const i = this, a = i.__v_raw, l = me(a), u = t ? bo : e ? vo : Ye;
      return !e && Ge(l, "iterate", Sn), a.forEach((c, f) => r.call(o, u(c), u(f), i));
    }
  };
  return Fe(
    n,
    e ? {
      add: zs("add"),
      set: zs("set"),
      delete: zs("delete"),
      clear: zs("clear")
    } : {
      add(r) {
        !t && !Tt(r) && !In(r) && (r = me(r));
        const o = me(this);
        return Hs(o).has.call(o, r) || (o.add(r), Gt(o, "add", r, r)), this;
      },
      set(r, o) {
        !t && !Tt(o) && !In(o) && (o = me(o));
        const i = me(this), { has: a, get: l } = Hs(i);
        let u = a.call(i, r);
        u || (r = me(r), u = a.call(i, r));
        const c = l.call(i, r);
        return i.set(r, o), u ? fn(o, c) && Gt(i, "set", r, o) : Gt(i, "add", r, o), this;
      },
      delete(r) {
        const o = me(this), { has: i, get: a } = Hs(o);
        let l = i.call(o, r);
        l || (r = me(r), l = i.call(o, r)), a && a.call(o, r);
        const u = o.delete(r);
        return l && Gt(o, "delete", r, void 0), u;
      },
      clear() {
        const r = me(this), o = r.size !== 0, i = r.clear();
        return o && Gt(
          r,
          "clear",
          void 0,
          void 0
        ), i;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    n[r] = wf(r, e, t);
  }), n;
}
function ni(e, t) {
  const n = kf(e, t);
  return (s, r, o) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? s : Reflect.get(
    ye(n, r) && r in s ? n : s,
    r,
    o
  );
}
const xf = {
  get: /* @__PURE__ */ ni(!1, !1)
}, Ef = {
  get: /* @__PURE__ */ ni(!1, !0)
}, Af = {
  get: /* @__PURE__ */ ni(!0, !1)
};
const Vl = /* @__PURE__ */ new WeakMap(), Wl = /* @__PURE__ */ new WeakMap(), Kl = /* @__PURE__ */ new WeakMap(), Cf = /* @__PURE__ */ new WeakMap();
function Tf(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Sf(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Tf(Xu(e));
}
function si(e) {
  return In(e) ? e : ri(
    e,
    !1,
    bf,
    xf,
    Vl
  );
}
function Rf(e) {
  return ri(
    e,
    !1,
    yf,
    Ef,
    Wl
  );
}
function ql(e) {
  return ri(
    e,
    !0,
    vf,
    Af,
    Kl
  );
}
function ri(e, t, n, s, r) {
  if (!Re(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const o = r.get(e);
  if (o)
    return o;
  const i = Sf(e);
  if (i === 0)
    return e;
  const a = new Proxy(
    e,
    i === 2 ? s : n
  );
  return r.set(e, a), a;
}
function jn(e) {
  return In(e) ? jn(e.__v_raw) : !!(e && e.__v_isReactive);
}
function In(e) {
  return !!(e && e.__v_isReadonly);
}
function Tt(e) {
  return !!(e && e.__v_isShallow);
}
function oi(e) {
  return e ? !!e.__v_raw : !1;
}
function me(e) {
  const t = e && e.__v_raw;
  return t ? me(t) : e;
}
function Lf(e) {
  return !ye(e, "__v_skip") && Object.isExtensible(e) && Tl(e, "__v_skip", !0), e;
}
const Ye = (e) => Re(e) ? si(e) : e, vo = (e) => Re(e) ? ql(e) : e;
function qe(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function V(e) {
  return Yl(e, !1);
}
function Gl(e) {
  return Yl(e, !0);
}
function Yl(e, t) {
  return qe(e) ? e : new If(e, t);
}
class If {
  constructor(t, n) {
    this.dep = new ti(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : me(t), this._value = n ? t : Ye(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || Tt(t) || In(t);
    t = s ? t : me(t), fn(t, n) && (this._rawValue = t, this._value = s ? t : Ye(t), this.dep.trigger());
  }
}
function H(e) {
  return qe(e) ? e.value : e;
}
const Mf = {
  get: (e, t, n) => t === "__v_raw" ? e : H(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return qe(r) && !qe(n) ? (r.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Ql(e) {
  return jn(e) ? e : new Proxy(e, Mf);
}
class Of {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ti(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ks - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    Le !== this)
      return $l(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Fl(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function Nf(e, t, n = !1) {
  let s, r;
  return re(e) ? s = e : (s = e.get, r = e.set), new Of(s, r, n);
}
const js = {}, tr = /* @__PURE__ */ new WeakMap();
let kn;
function $f(e, t = !1, n = kn) {
  if (n) {
    let s = tr.get(n);
    s || tr.set(n, s = []), s.push(e);
  }
}
function Pf(e, t, n = Ae) {
  const { immediate: s, deep: r, once: o, scheduler: i, augmentJob: a, call: l } = n, u = (k) => r ? k : Tt(k) || r === !1 || r === 0 ? Yt(k, 1) : Yt(k);
  let c, f, h, b, _ = !1, w = !1;
  if (qe(e) ? (f = () => e.value, _ = Tt(e)) : jn(e) ? (f = () => u(e), _ = !0) : Z(e) ? (w = !0, _ = e.some((k) => jn(k) || Tt(k)), f = () => e.map((k) => {
    if (qe(k))
      return k.value;
    if (jn(k))
      return u(k);
    if (re(k))
      return l ? l(k, 2) : k();
  })) : re(e) ? t ? f = l ? () => l(e, 2) : e : f = () => {
    if (h) {
      pn();
      try {
        h();
      } finally {
        mn();
      }
    }
    const k = kn;
    kn = c;
    try {
      return l ? l(e, 3, [b]) : e(b);
    } finally {
      kn = k;
    }
  } : f = Ht, t && r) {
    const k = f, M = r === !0 ? 1 / 0 : r;
    f = () => Yt(k(), M);
  }
  const x = uf(), g = () => {
    c.stop(), x && Qo(x.effects, c);
  };
  if (o && t) {
    const k = t;
    t = (...M) => {
      k(...M), g();
    };
  }
  let A = w ? new Array(e.length).fill(js) : js;
  const T = (k) => {
    if (!(!(c.flags & 1) || !c.dirty && !k))
      if (t) {
        const M = c.run();
        if (r || _ || (w ? M.some((P, O) => fn(P, A[O])) : fn(M, A))) {
          h && h();
          const P = kn;
          kn = c;
          try {
            const O = [
              M,
              // pass undefined as the old value when it's changed for the first time
              A === js ? void 0 : w && A[0] === js ? [] : A,
              b
            ];
            l ? l(t, 3, O) : (
              // @ts-expect-error
              t(...O)
            ), A = M;
          } finally {
            kn = P;
          }
        }
      } else
        c.run();
  };
  return a && a(T), c = new Ol(f), c.scheduler = i ? () => i(T, !1) : T, b = (k) => $f(k, !1, c), h = c.onStop = () => {
    const k = tr.get(c);
    if (k) {
      if (l)
        l(k, 4);
      else
        for (const M of k) M();
      tr.delete(c);
    }
  }, t ? s ? T(!0) : A = c.run() : i ? i(T.bind(null, !0), !0) : c.run(), g.pause = c.pause.bind(c), g.resume = c.resume.bind(c), g.stop = g, g;
}
function Yt(e, t = 1 / 0, n) {
  if (t <= 0 || !Re(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Set(), n.has(e)))
    return e;
  if (n.add(e), t--, qe(e))
    Yt(e.value, t, n);
  else if (Z(e))
    for (let s = 0; s < e.length; s++)
      Yt(e[s], t, n);
  else if (xr(e) || zn(e))
    e.forEach((s) => {
      Yt(s, t, n);
    });
  else if (Cl(e)) {
    for (const s in e)
      Yt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Yt(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.12
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Os(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    Rr(r, t, n);
  }
}
function Mt(e, t, n, s) {
  if (re(e)) {
    const r = Os(e, t, n, s);
    return r && El(r) && r.catch((o) => {
      Rr(o, t, n);
    }), r;
  }
  if (Z(e)) {
    const r = [];
    for (let o = 0; o < e.length; o++)
      r.push(Mt(e[o], t, n, s));
    return r;
  }
}
function Rr(e, t, n, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: i } = t && t.appContext.config || Ae;
  if (t) {
    let a = t.parent;
    const l = t.proxy, u = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const c = a.ec;
      if (c) {
        for (let f = 0; f < c.length; f++)
          if (c[f](e, l, u) === !1)
            return;
      }
      a = a.parent;
    }
    if (o) {
      pn(), Os(o, null, 10, [
        e,
        l,
        u
      ]), mn();
      return;
    }
  }
  Df(e, n, r, s, i);
}
function Df(e, t, n, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const st = [];
let Dt = -1;
const Vn = [];
let an = null, Bn = 0;
const Xl = /* @__PURE__ */ Promise.resolve();
let nr = null;
function Mn(e) {
  const t = nr || Xl;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Ff(e) {
  let t = Dt + 1, n = st.length;
  for (; t < n; ) {
    const s = t + n >>> 1, r = st[s], o = Es(r);
    o < e || o === e && r.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function ii(e) {
  if (!(e.flags & 1)) {
    const t = Es(e), n = st[st.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Es(n) ? st.push(e) : st.splice(Ff(t), 0, e), e.flags |= 1, Jl();
  }
}
function Jl() {
  nr || (nr = Xl.then(ec));
}
function Bf(e) {
  Z(e) ? Vn.push(...e) : an && e.id === -1 ? an.splice(Bn + 1, 0, e) : e.flags & 1 || (Vn.push(e), e.flags |= 1), Jl();
}
function Ui(e, t, n = Dt + 1) {
  for (; n < st.length; n++) {
    const s = st[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      st.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Zl(e) {
  if (Vn.length) {
    const t = [...new Set(Vn)].sort(
      (n, s) => Es(n) - Es(s)
    );
    if (Vn.length = 0, an) {
      an.push(...t);
      return;
    }
    for (an = t, Bn = 0; Bn < an.length; Bn++) {
      const n = an[Bn];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    an = null, Bn = 0;
  }
}
const Es = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function ec(e) {
  try {
    for (Dt = 0; Dt < st.length; Dt++) {
      const t = st[Dt];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Os(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Dt < st.length; Dt++) {
      const t = st[Dt];
      t && (t.flags &= -2);
    }
    Dt = -1, st.length = 0, Zl(), nr = null, (st.length || Vn.length) && ec();
  }
}
let ut = null, tc = null;
function sr(e) {
  const t = ut;
  return ut = e, tc = e && e.type.__scopeId || null, t;
}
function An(e, t = ut, n) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && Qi(-1);
    const o = sr(t);
    let i;
    try {
      i = e(...r);
    } finally {
      sr(o), s._d && Qi(1);
    }
    return i;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function Bt(e, t) {
  if (ut === null)
    return e;
  const n = Nr(ut), s = e.dirs || (e.dirs = []);
  for (let r = 0; r < t.length; r++) {
    let [o, i, a, l = Ae] = t[r];
    o && (re(o) && (o = {
      mounted: o,
      updated: o
    }), o.deep && Yt(i), s.push({
      dir: o,
      instance: n,
      value: i,
      oldValue: void 0,
      arg: a,
      modifiers: l
    }));
  }
  return e;
}
function vn(e, t, n, s) {
  const r = e.dirs, o = t && t.dirs;
  for (let i = 0; i < r.length; i++) {
    const a = r[i];
    o && (a.oldValue = o[i].value);
    let l = a.dir[s];
    l && (pn(), Mt(l, n, 8, [
      e.el,
      a,
      e,
      t
    ]), mn());
  }
}
const Uf = Symbol("_vte"), nc = (e) => e.__isTeleport, ln = Symbol("_leaveCb"), Vs = Symbol("_enterCb");
function sc() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return gn(() => {
    e.isMounted = !0;
  }), li(() => {
    e.isUnmounting = !0;
  }), e;
}
const xt = [Function, Array], rc = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: xt,
  onEnter: xt,
  onAfterEnter: xt,
  onEnterCancelled: xt,
  // leave
  onBeforeLeave: xt,
  onLeave: xt,
  onAfterLeave: xt,
  onLeaveCancelled: xt,
  // appear
  onBeforeAppear: xt,
  onAppear: xt,
  onAfterAppear: xt,
  onAppearCancelled: xt
}, oc = (e) => {
  const t = e.subTree;
  return t.component ? oc(t.component) : t;
}, Hf = {
  name: "BaseTransition",
  props: rc,
  setup(e, { slots: t }) {
    const n = jt(), s = sc();
    return () => {
      const r = t.default && ai(t.default(), !0);
      if (!r || !r.length)
        return;
      const o = ic(r), i = me(e), { mode: a } = i;
      if (s.isLeaving)
        return Xr(o);
      const l = Hi(o);
      if (!l)
        return Xr(o);
      let u = As(
        l,
        i,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (h) => u = h
      );
      l.type !== ct && On(l, u);
      const c = n.subTree, f = c && Hi(c);
      if (f && f.type !== ct && !xn(l, f) && oc(n).type !== ct) {
        const h = As(
          f,
          i,
          s,
          n
        );
        if (On(f, h), a === "out-in" && l.type !== ct)
          return s.isLeaving = !0, h.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete h.afterLeave;
          }, Xr(o);
        a === "in-out" && l.type !== ct && (h.delayLeave = (b, _, w) => {
          const x = ac(
            s,
            f
          );
          x[String(f.key)] = f, b[ln] = () => {
            _(), b[ln] = void 0, delete u.delayedLeave;
          }, u.delayedLeave = w;
        });
      }
      return o;
    };
  }
};
function ic(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== ct) {
        t = n;
        break;
      }
  }
  return t;
}
const zf = Hf;
function ac(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function As(e, t, n, s, r) {
  const {
    appear: o,
    mode: i,
    persisted: a = !1,
    onBeforeEnter: l,
    onEnter: u,
    onAfterEnter: c,
    onEnterCancelled: f,
    onBeforeLeave: h,
    onLeave: b,
    onAfterLeave: _,
    onLeaveCancelled: w,
    onBeforeAppear: x,
    onAppear: g,
    onAfterAppear: A,
    onAppearCancelled: T
  } = t, k = String(e.key), M = ac(n, e), P = (W, J) => {
    W && Mt(
      W,
      s,
      9,
      J
    );
  }, O = (W, J) => {
    const G = J[1];
    P(W, J), Z(W) ? W.every((D) => D.length <= 1) && G() : W.length <= 1 && G();
  }, X = {
    mode: i,
    persisted: a,
    beforeEnter(W) {
      let J = l;
      if (!n.isMounted)
        if (o)
          J = x || l;
        else
          return;
      W[ln] && W[ln](
        !0
        /* cancelled */
      );
      const G = M[k];
      G && xn(e, G) && G.el[ln] && G.el[ln](), P(J, [W]);
    },
    enter(W) {
      let J = u, G = c, D = f;
      if (!n.isMounted)
        if (o)
          J = g || u, G = A || c, D = T || f;
        else
          return;
      let te = !1;
      const he = W[Vs] = (Ne) => {
        te || (te = !0, Ne ? P(D, [W]) : P(G, [W]), X.delayedLeave && X.delayedLeave(), W[Vs] = void 0);
      };
      J ? O(J, [W, he]) : he();
    },
    leave(W, J) {
      const G = String(e.key);
      if (W[Vs] && W[Vs](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return J();
      P(h, [W]);
      let D = !1;
      const te = W[ln] = (he) => {
        D || (D = !0, J(), he ? P(w, [W]) : P(_, [W]), W[ln] = void 0, M[G] === e && delete M[G]);
      };
      M[G] = e, b ? O(b, [W, te]) : te();
    },
    clone(W) {
      const J = As(
        W,
        t,
        n,
        s,
        r
      );
      return r && r(J), J;
    }
  };
  return X;
}
function Xr(e) {
  if (Ir(e))
    return e = dn(e), e.children = null, e;
}
function Hi(e) {
  if (!Ir(e))
    return nc(e.type) && e.children ? ic(e.children) : e;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && re(n.default))
      return n.default();
  }
}
function On(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, On(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function ai(e, t = !1, n) {
  let s = [], r = 0;
  for (let o = 0; o < e.length; o++) {
    let i = e[o];
    const a = n == null ? i.key : String(n) + String(i.key != null ? i.key : o);
    i.type === Oe ? (i.patchFlag & 128 && r++, s = s.concat(
      ai(i.children, t, a)
    )) : (t || i.type !== ct) && s.push(a != null ? dn(i, { key: a }) : i);
  }
  if (r > 1)
    for (let o = 0; o < s.length; o++)
      s[o].patchFlag = -2;
  return s;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Lr(e, t) {
  return re(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Fe({ name: e.name }, t, { setup: e })
  ) : e;
}
function lc(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Ut(e) {
  const t = jt(), n = Gl(null);
  if (t) {
    const r = t.refs === Ae ? t.refs = {} : t.refs;
    Object.defineProperty(r, e, {
      enumerable: !0,
      get: () => n.value,
      set: (o) => n.value = o
    });
  }
  return n;
}
function yo(e, t, n, s, r = !1) {
  if (Z(e)) {
    e.forEach(
      (_, w) => yo(
        _,
        t && (Z(t) ? t[w] : t),
        n,
        s,
        r
      )
    );
    return;
  }
  if (ms(s) && !r)
    return;
  const o = s.shapeFlag & 4 ? Nr(s.component) : s.el, i = r ? null : o, { i: a, r: l } = e, u = t && t.r, c = a.refs === Ae ? a.refs = {} : a.refs, f = a.setupState, h = me(f), b = f === Ae ? () => !1 : (_) => ye(h, _);
  if (u != null && u !== l && (De(u) ? (c[u] = null, b(u) && (f[u] = null)) : qe(u) && (u.value = null)), re(l))
    Os(l, a, 12, [i, c]);
  else {
    const _ = De(l), w = qe(l);
    if (_ || w) {
      const x = () => {
        if (e.f) {
          const g = _ ? b(l) ? f[l] : c[l] : l.value;
          r ? Z(g) && Qo(g, o) : Z(g) ? g.includes(o) || g.push(o) : _ ? (c[l] = [o], b(l) && (f[l] = c[l])) : (l.value = [o], e.k && (c[e.k] = l.value));
        } else _ ? (c[l] = i, b(l) && (f[l] = i)) : w && (l.value = i, e.k && (c[e.k] = i));
      };
      i ? (x.id = -1, mt(x, n)) : x();
    }
  }
}
Cr().requestIdleCallback;
Cr().cancelIdleCallback;
const ms = (e) => !!e.type.__asyncLoader, Ir = (e) => e.type.__isKeepAlive;
function jf(e, t) {
  cc(e, "a", t);
}
function Vf(e, t) {
  cc(e, "da", t);
}
function cc(e, t, n = Ke) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = n;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Mr(t, s, n), n) {
    let r = n.parent;
    for (; r && r.parent; )
      Ir(r.parent.vnode) && Wf(s, t, n, r), r = r.parent;
  }
}
function Wf(e, t, n, s) {
  const r = Mr(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Zn(() => {
    Qo(s[t], r);
  }, n);
}
function Mr(e, t, n = Ke, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []), o = t.__weh || (t.__weh = (...i) => {
      pn();
      const a = $s(n), l = Mt(t, n, e, i);
      return a(), mn(), l;
    });
    return s ? r.unshift(o) : r.push(o), o;
  }
}
const Zt = (e) => (t, n = Ke) => {
  (!Ts || e === "sp") && Mr(e, (...s) => t(...s), n);
}, uc = Zt("bm"), gn = Zt("m"), Kf = Zt(
  "bu"
), fc = Zt("u"), li = Zt(
  "bum"
), Zn = Zt("um"), qf = Zt(
  "sp"
), Gf = Zt("rtg"), Yf = Zt("rtc");
function Qf(e, t = Ke) {
  Mr("ec", e, t);
}
const Xf = "components", dc = Symbol.for("v-ndc");
function rr(e) {
  return De(e) ? Jf(Xf, e, !1) || e : e || dc;
}
function Jf(e, t, n = !0, s = !1) {
  const r = ut || Ke;
  if (r) {
    const o = r.type;
    {
      const a = Bd(
        o,
        !1
      );
      if (a && (a === t || a === St(t) || a === Ar(St(t))))
        return o;
    }
    const i = (
      // local registration
      // check instance[type] first which is resolved for options API
      zi(r[e] || o[e], t) || // global registration
      zi(r.appContext[e], t)
    );
    return !i && s ? o : i;
  }
}
function zi(e, t) {
  return e && (e[t] || e[St(t)] || e[Ar(St(t))]);
}
function Nn(e, t, n, s) {
  let r;
  const o = n, i = Z(e);
  if (i || De(e)) {
    const a = i && jn(e);
    let l = !1;
    a && (l = !Tt(e), e = Sr(e)), r = new Array(e.length);
    for (let u = 0, c = e.length; u < c; u++)
      r[u] = t(
        l ? Ye(e[u]) : e[u],
        u,
        void 0,
        o
      );
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let a = 0; a < e; a++)
      r[a] = t(a + 1, a, void 0, o);
  } else if (Re(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (a, l) => t(a, l, void 0, o)
      );
    else {
      const a = Object.keys(e);
      r = new Array(a.length);
      for (let l = 0, u = a.length; l < u; l++) {
        const c = a[l];
        r[l] = t(e[c], c, l, o);
      }
    }
  else
    r = [];
  return r;
}
const wo = (e) => e ? Mc(e) ? Nr(e) : wo(e.parent) : null, gs = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Fe(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => wo(e.parent),
    $root: (e) => wo(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => ci(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      ii(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Mn.bind(e.proxy)),
    $watch: (e) => yd.bind(e)
  })
), Jr = (e, t) => e !== Ae && !e.__isScriptSetup && ye(e, t), Zf = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: r, props: o, accessCache: i, type: a, appContext: l } = e;
    let u;
    if (t[0] !== "$") {
      const b = i[t];
      if (b !== void 0)
        switch (b) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return n[t];
          case 3:
            return o[t];
        }
      else {
        if (Jr(s, t))
          return i[t] = 1, s[t];
        if (r !== Ae && ye(r, t))
          return i[t] = 2, r[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (u = e.propsOptions[0]) && ye(u, t)
        )
          return i[t] = 3, o[t];
        if (n !== Ae && ye(n, t))
          return i[t] = 4, n[t];
        ko && (i[t] = 0);
      }
    }
    const c = gs[t];
    let f, h;
    if (c)
      return t === "$attrs" && Ge(e.attrs, "get", ""), c(e);
    if (
      // css module (injected by vue-loader)
      (f = a.__cssModules) && (f = f[t])
    )
      return f;
    if (n !== Ae && ye(n, t))
      return i[t] = 4, n[t];
    if (
      // global properties
      h = l.config.globalProperties, ye(h, t)
    )
      return h[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: r, ctx: o } = e;
    return Jr(r, t) ? (r[t] = n, !0) : s !== Ae && ye(s, t) ? (s[t] = n, !0) : ye(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (o[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: o }
  }, i) {
    let a;
    return !!n[i] || e !== Ae && ye(e, i) || Jr(t, i) || (a = o[0]) && ye(a, i) || ye(s, i) || ye(gs, i) || ye(r.config.globalProperties, i);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : ye(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function ji(e) {
  return Z(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let ko = !0;
function ed(e) {
  const t = ci(e), n = e.proxy, s = e.ctx;
  ko = !1, t.beforeCreate && Vi(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: o,
    methods: i,
    watch: a,
    provide: l,
    inject: u,
    // lifecycle
    created: c,
    beforeMount: f,
    mounted: h,
    beforeUpdate: b,
    updated: _,
    activated: w,
    deactivated: x,
    beforeDestroy: g,
    beforeUnmount: A,
    destroyed: T,
    unmounted: k,
    render: M,
    renderTracked: P,
    renderTriggered: O,
    errorCaptured: X,
    serverPrefetch: W,
    // public API
    expose: J,
    inheritAttrs: G,
    // assets
    components: D,
    directives: te,
    filters: he
  } = t;
  if (u && td(u, s, null), i)
    for (const le in i) {
      const ce = i[le];
      re(ce) && (s[le] = ce.bind(n));
    }
  if (r) {
    const le = r.call(n, n);
    Re(le) && (e.data = si(le));
  }
  if (ko = !0, o)
    for (const le in o) {
      const ce = o[le], ne = re(ce) ? ce.bind(n, n) : re(ce.get) ? ce.get.bind(n, n) : Ht, _e = !re(ce) && re(ce.set) ? ce.set.bind(n) : Ht, pe = ke({
        get: ne,
        set: _e
      });
      Object.defineProperty(s, le, {
        enumerable: !0,
        configurable: !0,
        get: () => pe.value,
        set: (Be) => pe.value = Be
      });
    }
  if (a)
    for (const le in a)
      hc(a[le], s, n, le);
  if (l) {
    const le = re(l) ? l.call(n) : l;
    Reflect.ownKeys(le).forEach((ce) => {
      mc(ce, le[ce]);
    });
  }
  c && Vi(c, e, "c");
  function ue(le, ce) {
    Z(ce) ? ce.forEach((ne) => le(ne.bind(n))) : ce && le(ce.bind(n));
  }
  if (ue(uc, f), ue(gn, h), ue(Kf, b), ue(fc, _), ue(jf, w), ue(Vf, x), ue(Qf, X), ue(Yf, P), ue(Gf, O), ue(li, A), ue(Zn, k), ue(qf, W), Z(J))
    if (J.length) {
      const le = e.exposed || (e.exposed = {});
      J.forEach((ce) => {
        Object.defineProperty(le, ce, {
          get: () => n[ce],
          set: (ne) => n[ce] = ne
        });
      });
    } else e.exposed || (e.exposed = {});
  M && e.render === Ht && (e.render = M), G != null && (e.inheritAttrs = G), D && (e.components = D), te && (e.directives = te), W && lc(e);
}
function td(e, t, n = Ht) {
  Z(e) && (e = xo(e));
  for (const s in e) {
    const r = e[s];
    let o;
    Re(r) ? "default" in r ? o = Qt(
      r.from || s,
      r.default,
      !0
    ) : o = Qt(r.from || s) : o = Qt(r), qe(o) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => o.value,
      set: (i) => o.value = i
    }) : t[s] = o;
  }
}
function Vi(e, t, n) {
  Mt(
    Z(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function hc(e, t, n, s) {
  let r = s.includes(".") ? Tc(n, s) : () => n[s];
  if (De(e)) {
    const o = t[e];
    re(o) && bt(r, o);
  } else if (re(e))
    bt(r, e.bind(n));
  else if (Re(e))
    if (Z(e))
      e.forEach((o) => hc(o, t, n, s));
    else {
      const o = re(e.handler) ? e.handler.bind(n) : t[e.handler];
      re(o) && bt(r, o, e);
    }
}
function ci(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: r,
    optionsCache: o,
    config: { optionMergeStrategies: i }
  } = e.appContext, a = o.get(t);
  let l;
  return a ? l = a : !r.length && !n && !s ? l = t : (l = {}, r.length && r.forEach(
    (u) => or(l, u, i, !0)
  ), or(l, t, i)), Re(t) && o.set(t, l), l;
}
function or(e, t, n, s = !1) {
  const { mixins: r, extends: o } = t;
  o && or(e, o, n, !0), r && r.forEach(
    (i) => or(e, i, n, !0)
  );
  for (const i in t)
    if (!(s && i === "expose")) {
      const a = nd[i] || n && n[i];
      e[i] = a ? a(e[i], t[i]) : t[i];
    }
  return e;
}
const nd = {
  data: Wi,
  props: Ki,
  emits: Ki,
  // objects
  methods: fs,
  computed: fs,
  // lifecycle
  beforeCreate: et,
  created: et,
  beforeMount: et,
  mounted: et,
  beforeUpdate: et,
  updated: et,
  beforeDestroy: et,
  beforeUnmount: et,
  destroyed: et,
  unmounted: et,
  activated: et,
  deactivated: et,
  errorCaptured: et,
  serverPrefetch: et,
  // assets
  components: fs,
  directives: fs,
  // watch
  watch: rd,
  // provide / inject
  provide: Wi,
  inject: sd
};
function Wi(e, t) {
  return t ? e ? function() {
    return Fe(
      re(e) ? e.call(this, this) : e,
      re(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function sd(e, t) {
  return fs(xo(e), xo(t));
}
function xo(e) {
  if (Z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function et(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function fs(e, t) {
  return e ? Fe(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Ki(e, t) {
  return e ? Z(e) && Z(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Fe(
    /* @__PURE__ */ Object.create(null),
    ji(e),
    ji(t ?? {})
  ) : t;
}
function rd(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Fe(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = et(e[s], t[s]);
  return n;
}
function pc() {
  return {
    app: null,
    config: {
      isNativeTag: Yu,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let od = 0;
function id(e, t) {
  return function(s, r = null) {
    re(s) || (s = Fe({}, s)), r != null && !Re(r) && (r = null);
    const o = pc(), i = /* @__PURE__ */ new WeakSet(), a = [];
    let l = !1;
    const u = o.app = {
      _uid: od++,
      _component: s,
      _props: r,
      _container: null,
      _context: o,
      _instance: null,
      version: Hd,
      get config() {
        return o.config;
      },
      set config(c) {
      },
      use(c, ...f) {
        return i.has(c) || (c && re(c.install) ? (i.add(c), c.install(u, ...f)) : re(c) && (i.add(c), c(u, ...f))), u;
      },
      mixin(c) {
        return o.mixins.includes(c) || o.mixins.push(c), u;
      },
      component(c, f) {
        return f ? (o.components[c] = f, u) : o.components[c];
      },
      directive(c, f) {
        return f ? (o.directives[c] = f, u) : o.directives[c];
      },
      mount(c, f, h) {
        if (!l) {
          const b = u._ceVNode || q(s, r);
          return b.appContext = o, h === !0 ? h = "svg" : h === !1 && (h = void 0), f && t ? t(b, c) : e(b, c, h), l = !0, u._container = c, c.__vue_app__ = u, Nr(b.component);
        }
      },
      onUnmount(c) {
        a.push(c);
      },
      unmount() {
        l && (Mt(
          a,
          u._instance,
          16
        ), e(null, u._container), delete u._container.__vue_app__);
      },
      provide(c, f) {
        return o.provides[c] = f, u;
      },
      runWithContext(c) {
        const f = Wn;
        Wn = u;
        try {
          return c();
        } finally {
          Wn = f;
        }
      }
    };
    return u;
  };
}
let Wn = null;
function mc(e, t) {
  if (Ke) {
    let n = Ke.provides;
    const s = Ke.parent && Ke.parent.provides;
    s === n && (n = Ke.provides = Object.create(s)), n[e] = t;
  }
}
function Qt(e, t, n = !1) {
  const s = Ke || ut;
  if (s || Wn) {
    const r = Wn ? Wn._context.provides : s ? s.parent == null ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return n && re(t) ? t.call(s && s.proxy) : t;
  }
}
const gc = {}, _c = () => Object.create(gc), bc = (e) => Object.getPrototypeOf(e) === gc;
function ad(e, t, n, s = !1) {
  const r = {}, o = _c();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), vc(e, t, r, o);
  for (const i in e.propsOptions[0])
    i in r || (r[i] = void 0);
  n ? e.props = s ? r : Rf(r) : e.type.props ? e.props = r : e.props = o, e.attrs = o;
}
function ld(e, t, n, s) {
  const {
    props: r,
    attrs: o,
    vnode: { patchFlag: i }
  } = e, a = me(r), [l] = e.propsOptions;
  let u = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || i > 0) && !(i & 16)
  ) {
    if (i & 8) {
      const c = e.vnode.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        let h = c[f];
        if (Or(e.emitsOptions, h))
          continue;
        const b = t[h];
        if (l)
          if (ye(o, h))
            b !== o[h] && (o[h] = b, u = !0);
          else {
            const _ = St(h);
            r[_] = Eo(
              l,
              a,
              _,
              b,
              e,
              !1
            );
          }
        else
          b !== o[h] && (o[h] = b, u = !0);
      }
    }
  } else {
    vc(e, t, r, o) && (u = !0);
    let c;
    for (const f in a)
      (!t || // for camelCase
      !ye(t, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = hn(f)) === f || !ye(t, c))) && (l ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[c] !== void 0) && (r[f] = Eo(
        l,
        a,
        f,
        void 0,
        e,
        !0
      )) : delete r[f]);
    if (o !== a)
      for (const f in o)
        (!t || !ye(t, f)) && (delete o[f], u = !0);
  }
  u && Gt(e.attrs, "set", "");
}
function vc(e, t, n, s) {
  const [r, o] = e.propsOptions;
  let i = !1, a;
  if (t)
    for (let l in t) {
      if (ds(l))
        continue;
      const u = t[l];
      let c;
      r && ye(r, c = St(l)) ? !o || !o.includes(c) ? n[c] = u : (a || (a = {}))[c] = u : Or(e.emitsOptions, l) || (!(l in s) || u !== s[l]) && (s[l] = u, i = !0);
    }
  if (o) {
    const l = me(n), u = a || Ae;
    for (let c = 0; c < o.length; c++) {
      const f = o[c];
      n[f] = Eo(
        r,
        l,
        f,
        u[f],
        e,
        !ye(u, f)
      );
    }
  }
  return i;
}
function Eo(e, t, n, s, r, o) {
  const i = e[n];
  if (i != null) {
    const a = ye(i, "default");
    if (a && s === void 0) {
      const l = i.default;
      if (i.type !== Function && !i.skipFactory && re(l)) {
        const { propsDefaults: u } = r;
        if (n in u)
          s = u[n];
        else {
          const c = $s(r);
          s = u[n] = l.call(
            null,
            t
          ), c();
        }
      } else
        s = l;
      r.ce && r.ce._setProp(n, s);
    }
    i[
      0
      /* shouldCast */
    ] && (o && !a ? s = !1 : i[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === hn(n)) && (s = !0));
  }
  return s;
}
const cd = /* @__PURE__ */ new WeakMap();
function yc(e, t, n = !1) {
  const s = n ? cd : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const o = e.props, i = {}, a = [];
  let l = !1;
  if (!re(e)) {
    const c = (f) => {
      l = !0;
      const [h, b] = yc(f, t, !0);
      Fe(i, h), b && a.push(...b);
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!o && !l)
    return Re(e) && s.set(e, Hn), Hn;
  if (Z(o))
    for (let c = 0; c < o.length; c++) {
      const f = St(o[c]);
      qi(f) && (i[f] = Ae);
    }
  else if (o)
    for (const c in o) {
      const f = St(c);
      if (qi(f)) {
        const h = o[c], b = i[f] = Z(h) || re(h) ? { type: h } : Fe({}, h), _ = b.type;
        let w = !1, x = !0;
        if (Z(_))
          for (let g = 0; g < _.length; ++g) {
            const A = _[g], T = re(A) && A.name;
            if (T === "Boolean") {
              w = !0;
              break;
            } else T === "String" && (x = !1);
          }
        else
          w = re(_) && _.name === "Boolean";
        b[
          0
          /* shouldCast */
        ] = w, b[
          1
          /* shouldCastTrue */
        ] = x, (w || ye(b, "default")) && a.push(f);
      }
    }
  const u = [i, a];
  return Re(e) && s.set(e, u), u;
}
function qi(e) {
  return e[0] !== "$" && !ds(e);
}
const wc = (e) => e[0] === "_" || e === "$stable", ui = (e) => Z(e) ? e.map(Ft) : [Ft(e)], ud = (e, t, n) => {
  if (t._n)
    return t;
  const s = An((...r) => ui(t(...r)), n);
  return s._c = !1, s;
}, kc = (e, t, n) => {
  const s = e._ctx;
  for (const r in e) {
    if (wc(r)) continue;
    const o = e[r];
    if (re(o))
      t[r] = ud(r, o, s);
    else if (o != null) {
      const i = ui(o);
      t[r] = () => i;
    }
  }
}, xc = (e, t) => {
  const n = ui(t);
  e.slots.default = () => n;
}, Ec = (e, t, n) => {
  for (const s in t)
    (n || s !== "_") && (e[s] = t[s]);
}, fd = (e, t, n) => {
  const s = e.slots = _c();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (Ec(s, t, n), n && Tl(s, "_", r, !0)) : kc(t, s);
  } else t && xc(e, t);
}, dd = (e, t, n) => {
  const { vnode: s, slots: r } = e;
  let o = !0, i = Ae;
  if (s.shapeFlag & 32) {
    const a = t._;
    a ? n && a === 1 ? o = !1 : Ec(r, t, n) : (o = !t.$stable, kc(t, r)), i = t;
  } else t && (xc(e, t), i = { default: 1 });
  if (o)
    for (const a in r)
      !wc(a) && i[a] == null && delete r[a];
}, mt = Td;
function hd(e) {
  return pd(e);
}
function pd(e, t) {
  const n = Cr();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: o,
    createElement: i,
    createText: a,
    createComment: l,
    setText: u,
    setElementText: c,
    parentNode: f,
    nextSibling: h,
    setScopeId: b = Ht,
    insertStaticContent: _
  } = e, w = (m, v, L, U = null, F = null, d = null, p = void 0, E = null, R = !!v.dynamicChildren) => {
    if (m === v)
      return;
    m && !xn(m, v) && (U = pt(m), Be(m, F, d, !0), m = null), v.patchFlag === -2 && (R = !1, v.dynamicChildren = null);
    const { type: $, ref: z, shapeFlag: y } = v;
    switch ($) {
      case Ns:
        x(m, v, L, U);
        break;
      case ct:
        g(m, v, L, U);
        break;
      case _s:
        m == null && A(v, L, U, p);
        break;
      case Oe:
        D(
          m,
          v,
          L,
          U,
          F,
          d,
          p,
          E,
          R
        );
        break;
      default:
        y & 1 ? M(
          m,
          v,
          L,
          U,
          F,
          d,
          p,
          E,
          R
        ) : y & 6 ? te(
          m,
          v,
          L,
          U,
          F,
          d,
          p,
          E,
          R
        ) : (y & 64 || y & 128) && $.process(
          m,
          v,
          L,
          U,
          F,
          d,
          p,
          E,
          R,
          kt
        );
    }
    z != null && F && yo(z, m && m.ref, d, v || m, !v);
  }, x = (m, v, L, U) => {
    if (m == null)
      s(
        v.el = a(v.children),
        L,
        U
      );
    else {
      const F = v.el = m.el;
      v.children !== m.children && u(F, v.children);
    }
  }, g = (m, v, L, U) => {
    m == null ? s(
      v.el = l(v.children || ""),
      L,
      U
    ) : v.el = m.el;
  }, A = (m, v, L, U) => {
    [m.el, m.anchor] = _(
      m.children,
      v,
      L,
      U,
      m.el,
      m.anchor
    );
  }, T = ({ el: m, anchor: v }, L, U) => {
    let F;
    for (; m && m !== v; )
      F = h(m), s(m, L, U), m = F;
    s(v, L, U);
  }, k = ({ el: m, anchor: v }) => {
    let L;
    for (; m && m !== v; )
      L = h(m), r(m), m = L;
    r(v);
  }, M = (m, v, L, U, F, d, p, E, R) => {
    v.type === "svg" ? p = "svg" : v.type === "math" && (p = "mathml"), m == null ? P(
      v,
      L,
      U,
      F,
      d,
      p,
      E,
      R
    ) : W(
      m,
      v,
      F,
      d,
      p,
      E,
      R
    );
  }, P = (m, v, L, U, F, d, p, E) => {
    let R, $;
    const { props: z, shapeFlag: y, transition: S, dirs: j } = m;
    if (R = m.el = i(
      m.type,
      d,
      z && z.is,
      z
    ), y & 8 ? c(R, m.children) : y & 16 && X(
      m.children,
      R,
      null,
      U,
      F,
      Zr(m, d),
      p,
      E
    ), j && vn(m, null, U, "created"), O(R, m, m.scopeId, p, U), z) {
      for (const fe in z)
        fe !== "value" && !ds(fe) && o(R, fe, null, z[fe], d, U);
      "value" in z && o(R, "value", null, z.value, d), ($ = z.onVnodeBeforeMount) && Nt($, U, m);
    }
    j && vn(m, null, U, "beforeMount");
    const Y = md(F, S);
    Y && S.beforeEnter(R), s(R, v, L), (($ = z && z.onVnodeMounted) || Y || j) && mt(() => {
      $ && Nt($, U, m), Y && S.enter(R), j && vn(m, null, U, "mounted");
    }, F);
  }, O = (m, v, L, U, F) => {
    if (L && b(m, L), U)
      for (let d = 0; d < U.length; d++)
        b(m, U[d]);
    if (F) {
      let d = F.subTree;
      if (v === d || Rc(d.type) && (d.ssContent === v || d.ssFallback === v)) {
        const p = F.vnode;
        O(
          m,
          p,
          p.scopeId,
          p.slotScopeIds,
          F.parent
        );
      }
    }
  }, X = (m, v, L, U, F, d, p, E, R = 0) => {
    for (let $ = R; $ < m.length; $++) {
      const z = m[$] = E ? cn(m[$]) : Ft(m[$]);
      w(
        null,
        z,
        v,
        L,
        U,
        F,
        d,
        p,
        E
      );
    }
  }, W = (m, v, L, U, F, d, p) => {
    const E = v.el = m.el;
    let { patchFlag: R, dynamicChildren: $, dirs: z } = v;
    R |= m.patchFlag & 16;
    const y = m.props || Ae, S = v.props || Ae;
    let j;
    if (L && yn(L, !1), (j = S.onVnodeBeforeUpdate) && Nt(j, L, v, m), z && vn(v, m, L, "beforeUpdate"), L && yn(L, !0), (y.innerHTML && S.innerHTML == null || y.textContent && S.textContent == null) && c(E, ""), $ ? J(
      m.dynamicChildren,
      $,
      E,
      L,
      U,
      Zr(v, F),
      d
    ) : p || ce(
      m,
      v,
      E,
      null,
      L,
      U,
      Zr(v, F),
      d,
      !1
    ), R > 0) {
      if (R & 16)
        G(E, y, S, L, F);
      else if (R & 2 && y.class !== S.class && o(E, "class", null, S.class, F), R & 4 && o(E, "style", y.style, S.style, F), R & 8) {
        const Y = v.dynamicProps;
        for (let fe = 0; fe < Y.length; fe++) {
          const de = Y[fe], $e = y[de], Ue = S[de];
          (Ue !== $e || de === "value") && o(E, de, $e, Ue, F, L);
        }
      }
      R & 1 && m.children !== v.children && c(E, v.children);
    } else !p && $ == null && G(E, y, S, L, F);
    ((j = S.onVnodeUpdated) || z) && mt(() => {
      j && Nt(j, L, v, m), z && vn(v, m, L, "updated");
    }, U);
  }, J = (m, v, L, U, F, d, p) => {
    for (let E = 0; E < v.length; E++) {
      const R = m[E], $ = v[E], z = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        R.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (R.type === Oe || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !xn(R, $) || // - In the case of a component, it could contain anything.
        R.shapeFlag & 70) ? f(R.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          L
        )
      );
      w(
        R,
        $,
        z,
        null,
        U,
        F,
        d,
        p,
        !0
      );
    }
  }, G = (m, v, L, U, F) => {
    if (v !== L) {
      if (v !== Ae)
        for (const d in v)
          !ds(d) && !(d in L) && o(
            m,
            d,
            v[d],
            null,
            F,
            U
          );
      for (const d in L) {
        if (ds(d)) continue;
        const p = L[d], E = v[d];
        p !== E && d !== "value" && o(m, d, E, p, F, U);
      }
      "value" in L && o(m, "value", v.value, L.value, F);
    }
  }, D = (m, v, L, U, F, d, p, E, R) => {
    const $ = v.el = m ? m.el : a(""), z = v.anchor = m ? m.anchor : a("");
    let { patchFlag: y, dynamicChildren: S, slotScopeIds: j } = v;
    j && (E = E ? E.concat(j) : j), m == null ? (s($, L, U), s(z, L, U), X(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      v.children || [],
      L,
      z,
      F,
      d,
      p,
      E,
      R
    )) : y > 0 && y & 64 && S && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    m.dynamicChildren ? (J(
      m.dynamicChildren,
      S,
      L,
      F,
      d,
      p,
      E
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (v.key != null || F && v === F.subTree) && Ac(
      m,
      v,
      !0
      /* shallow */
    )) : ce(
      m,
      v,
      L,
      z,
      F,
      d,
      p,
      E,
      R
    );
  }, te = (m, v, L, U, F, d, p, E, R) => {
    v.slotScopeIds = E, m == null ? v.shapeFlag & 512 ? F.ctx.activate(
      v,
      L,
      U,
      p,
      R
    ) : he(
      v,
      L,
      U,
      F,
      d,
      p,
      R
    ) : Ne(m, v, R);
  }, he = (m, v, L, U, F, d, p) => {
    const E = m.component = Nd(
      m,
      U,
      F
    );
    if (Ir(m) && (E.ctx.renderer = kt), $d(E, !1, p), E.asyncDep) {
      if (F && F.registerDep(E, ue, p), !m.el) {
        const R = E.subTree = q(ct);
        g(null, R, v, L);
      }
    } else
      ue(
        E,
        m,
        v,
        L,
        F,
        d,
        p
      );
  }, Ne = (m, v, L) => {
    const U = v.component = m.component;
    if (Ad(m, v, L))
      if (U.asyncDep && !U.asyncResolved) {
        le(U, v, L);
        return;
      } else
        U.next = v, U.update();
    else
      v.el = m.el, U.vnode = v;
  }, ue = (m, v, L, U, F, d, p) => {
    const E = () => {
      if (m.isMounted) {
        let { next: y, bu: S, u: j, parent: Y, vnode: fe } = m;
        {
          const ie = Cc(m);
          if (ie) {
            y && (y.el = fe.el, le(m, y, p)), ie.asyncDep.then(() => {
              m.isUnmounted || E();
            });
            return;
          }
        }
        let de = y, $e;
        yn(m, !1), y ? (y.el = fe.el, le(m, y, p)) : y = fe, S && Gs(S), ($e = y.props && y.props.onVnodeBeforeUpdate) && Nt($e, Y, y, fe), yn(m, !0);
        const Ue = eo(m), Q = m.subTree;
        m.subTree = Ue, w(
          Q,
          Ue,
          // parent may have changed if it's in a teleport
          f(Q.el),
          // anchor may have changed if it's in a fragment
          pt(Q),
          m,
          F,
          d
        ), y.el = Ue.el, de === null && Cd(m, Ue.el), j && mt(j, F), ($e = y.props && y.props.onVnodeUpdated) && mt(
          () => Nt($e, Y, y, fe),
          F
        );
      } else {
        let y;
        const { el: S, props: j } = v, { bm: Y, m: fe, parent: de, root: $e, type: Ue } = m, Q = ms(v);
        if (yn(m, !1), Y && Gs(Y), !Q && (y = j && j.onVnodeBeforeMount) && Nt(y, de, v), yn(m, !0), S && tn) {
          const ie = () => {
            m.subTree = eo(m), tn(
              S,
              m.subTree,
              m,
              F,
              null
            );
          };
          Q && Ue.__asyncHydrate ? Ue.__asyncHydrate(
            S,
            m,
            ie
          ) : ie();
        } else {
          $e.ce && $e.ce._injectChildStyle(Ue);
          const ie = m.subTree = eo(m);
          w(
            null,
            ie,
            L,
            U,
            m,
            F,
            d
          ), v.el = ie.el;
        }
        if (fe && mt(fe, F), !Q && (y = j && j.onVnodeMounted)) {
          const ie = v;
          mt(
            () => Nt(y, de, ie),
            F
          );
        }
        (v.shapeFlag & 256 || de && ms(de.vnode) && de.vnode.shapeFlag & 256) && m.a && mt(m.a, F), m.isMounted = !0, v = L = U = null;
      }
    };
    m.scope.on();
    const R = m.effect = new Ol(E);
    m.scope.off();
    const $ = m.update = R.run.bind(R), z = m.job = R.runIfDirty.bind(R);
    z.i = m, z.id = m.uid, R.scheduler = () => ii(z), yn(m, !0), $();
  }, le = (m, v, L) => {
    v.component = m;
    const U = m.vnode.props;
    m.vnode = v, m.next = null, ld(m, v.props, U, L), dd(m, v.children, L), pn(), Ui(m), mn();
  }, ce = (m, v, L, U, F, d, p, E, R = !1) => {
    const $ = m && m.children, z = m ? m.shapeFlag : 0, y = v.children, { patchFlag: S, shapeFlag: j } = v;
    if (S > 0) {
      if (S & 128) {
        _e(
          $,
          y,
          L,
          U,
          F,
          d,
          p,
          E,
          R
        );
        return;
      } else if (S & 256) {
        ne(
          $,
          y,
          L,
          U,
          F,
          d,
          p,
          E,
          R
        );
        return;
      }
    }
    j & 8 ? (z & 16 && Xe($, F, d), y !== $ && c(L, y)) : z & 16 ? j & 16 ? _e(
      $,
      y,
      L,
      U,
      F,
      d,
      p,
      E,
      R
    ) : Xe($, F, d, !0) : (z & 8 && c(L, ""), j & 16 && X(
      y,
      L,
      U,
      F,
      d,
      p,
      E,
      R
    ));
  }, ne = (m, v, L, U, F, d, p, E, R) => {
    m = m || Hn, v = v || Hn;
    const $ = m.length, z = v.length, y = Math.min($, z);
    let S;
    for (S = 0; S < y; S++) {
      const j = v[S] = R ? cn(v[S]) : Ft(v[S]);
      w(
        m[S],
        j,
        L,
        null,
        F,
        d,
        p,
        E,
        R
      );
    }
    $ > z ? Xe(
      m,
      F,
      d,
      !0,
      !1,
      y
    ) : X(
      v,
      L,
      U,
      F,
      d,
      p,
      E,
      R,
      y
    );
  }, _e = (m, v, L, U, F, d, p, E, R) => {
    let $ = 0;
    const z = v.length;
    let y = m.length - 1, S = z - 1;
    for (; $ <= y && $ <= S; ) {
      const j = m[$], Y = v[$] = R ? cn(v[$]) : Ft(v[$]);
      if (xn(j, Y))
        w(
          j,
          Y,
          L,
          null,
          F,
          d,
          p,
          E,
          R
        );
      else
        break;
      $++;
    }
    for (; $ <= y && $ <= S; ) {
      const j = m[y], Y = v[S] = R ? cn(v[S]) : Ft(v[S]);
      if (xn(j, Y))
        w(
          j,
          Y,
          L,
          null,
          F,
          d,
          p,
          E,
          R
        );
      else
        break;
      y--, S--;
    }
    if ($ > y) {
      if ($ <= S) {
        const j = S + 1, Y = j < z ? v[j].el : U;
        for (; $ <= S; )
          w(
            null,
            v[$] = R ? cn(v[$]) : Ft(v[$]),
            L,
            Y,
            F,
            d,
            p,
            E,
            R
          ), $++;
      }
    } else if ($ > S)
      for (; $ <= y; )
        Be(m[$], F, d, !0), $++;
    else {
      const j = $, Y = $, fe = /* @__PURE__ */ new Map();
      for ($ = Y; $ <= S; $++) {
        const We = v[$] = R ? cn(v[$]) : Ft(v[$]);
        We.key != null && fe.set(We.key, $);
      }
      let de, $e = 0;
      const Ue = S - Y + 1;
      let Q = !1, ie = 0;
      const Je = new Array(Ue);
      for ($ = 0; $ < Ue; $++) Je[$] = 0;
      for ($ = j; $ <= y; $++) {
        const We = m[$];
        if ($e >= Ue) {
          Be(We, F, d, !0);
          continue;
        }
        let Ze;
        if (We.key != null)
          Ze = fe.get(We.key);
        else
          for (de = Y; de <= S; de++)
            if (Je[de - Y] === 0 && xn(We, v[de])) {
              Ze = de;
              break;
            }
        Ze === void 0 ? Be(We, F, d, !0) : (Je[Ze - Y] = $ + 1, Ze >= ie ? ie = Ze : Q = !0, w(
          We,
          v[Ze],
          L,
          null,
          F,
          d,
          p,
          E,
          R
        ), $e++);
      }
      const Me = Q ? gd(Je) : Hn;
      for (de = Me.length - 1, $ = Ue - 1; $ >= 0; $--) {
        const We = Y + $, Ze = v[We], $i = We + 1 < z ? v[We + 1].el : U;
        Je[$] === 0 ? w(
          null,
          Ze,
          L,
          $i,
          F,
          d,
          p,
          E,
          R
        ) : Q && (de < 0 || $ !== Me[de] ? pe(Ze, L, $i, 2) : de--);
      }
    }
  }, pe = (m, v, L, U, F = null) => {
    const { el: d, type: p, transition: E, children: R, shapeFlag: $ } = m;
    if ($ & 6) {
      pe(m.component.subTree, v, L, U);
      return;
    }
    if ($ & 128) {
      m.suspense.move(v, L, U);
      return;
    }
    if ($ & 64) {
      p.move(m, v, L, kt);
      return;
    }
    if (p === Oe) {
      s(d, v, L);
      for (let y = 0; y < R.length; y++)
        pe(R[y], v, L, U);
      s(m.anchor, v, L);
      return;
    }
    if (p === _s) {
      T(m, v, L);
      return;
    }
    if (U !== 2 && $ & 1 && E)
      if (U === 0)
        E.beforeEnter(d), s(d, v, L), mt(() => E.enter(d), F);
      else {
        const { leave: y, delayLeave: S, afterLeave: j } = E, Y = () => s(d, v, L), fe = () => {
          y(d, () => {
            Y(), j && j();
          });
        };
        S ? S(d, Y, fe) : fe();
      }
    else
      s(d, v, L);
  }, Be = (m, v, L, U = !1, F = !1) => {
    const {
      type: d,
      props: p,
      ref: E,
      children: R,
      dynamicChildren: $,
      shapeFlag: z,
      patchFlag: y,
      dirs: S,
      cacheIndex: j
    } = m;
    if (y === -2 && (F = !1), E != null && yo(E, null, L, m, !0), j != null && (v.renderCache[j] = void 0), z & 256) {
      v.ctx.deactivate(m);
      return;
    }
    const Y = z & 1 && S, fe = !ms(m);
    let de;
    if (fe && (de = p && p.onVnodeBeforeUnmount) && Nt(de, v, m), z & 6)
      Te(m.component, L, U);
    else {
      if (z & 128) {
        m.suspense.unmount(L, U);
        return;
      }
      Y && vn(m, null, v, "beforeUnmount"), z & 64 ? m.type.remove(
        m,
        v,
        L,
        kt,
        U
      ) : $ && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !$.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (d !== Oe || y > 0 && y & 64) ? Xe(
        $,
        v,
        L,
        !1,
        !0
      ) : (d === Oe && y & 384 || !F && z & 16) && Xe(R, v, L), U && ve(m);
    }
    (fe && (de = p && p.onVnodeUnmounted) || Y) && mt(() => {
      de && Nt(de, v, m), Y && vn(m, null, v, "unmounted");
    }, L);
  }, ve = (m) => {
    const { type: v, el: L, anchor: U, transition: F } = m;
    if (v === Oe) {
      se(L, U);
      return;
    }
    if (v === _s) {
      k(m);
      return;
    }
    const d = () => {
      r(L), F && !F.persisted && F.afterLeave && F.afterLeave();
    };
    if (m.shapeFlag & 1 && F && !F.persisted) {
      const { leave: p, delayLeave: E } = F, R = () => p(L, d);
      E ? E(m.el, d, R) : R();
    } else
      d();
  }, se = (m, v) => {
    let L;
    for (; m !== v; )
      L = h(m), r(m), m = L;
    r(v);
  }, Te = (m, v, L) => {
    const { bum: U, scope: F, job: d, subTree: p, um: E, m: R, a: $ } = m;
    Gi(R), Gi($), U && Gs(U), F.stop(), d && (d.flags |= 8, Be(p, m, v, L)), E && mt(E, v), mt(() => {
      m.isUnmounted = !0;
    }, v), v && v.pendingBranch && !v.isUnmounted && m.asyncDep && !m.asyncResolved && m.suspenseId === v.pendingId && (v.deps--, v.deps === 0 && v.resolve());
  }, Xe = (m, v, L, U = !1, F = !1, d = 0) => {
    for (let p = d; p < m.length; p++)
      Be(m[p], v, L, U, F);
  }, pt = (m) => {
    if (m.shapeFlag & 6)
      return pt(m.component.subTree);
    if (m.shapeFlag & 128)
      return m.suspense.next();
    const v = h(m.anchor || m.el), L = v && v[Uf];
    return L ? h(L) : v;
  };
  let at = !1;
  const wt = (m, v, L) => {
    m == null ? v._vnode && Be(v._vnode, null, null, !0) : w(
      v._vnode || null,
      m,
      v,
      null,
      null,
      null,
      L
    ), v._vnode = m, at || (at = !0, Ui(), Zl(), at = !1);
  }, kt = {
    p: w,
    um: Be,
    m: pe,
    r: ve,
    mt: he,
    mc: X,
    pc: ce,
    pbc: J,
    n: pt,
    o: e
  };
  let en, tn;
  return {
    render: wt,
    hydrate: en,
    createApp: id(wt, en)
  };
}
function Zr({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function yn({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function md(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ac(e, t, n = !1) {
  const s = e.children, r = t.children;
  if (Z(s) && Z(r))
    for (let o = 0; o < s.length; o++) {
      const i = s[o];
      let a = r[o];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = r[o] = cn(r[o]), a.el = i.el), !n && a.patchFlag !== -2 && Ac(i, a)), a.type === Ns && (a.el = i.el);
    }
}
function gd(e) {
  const t = e.slice(), n = [0];
  let s, r, o, i, a;
  const l = e.length;
  for (s = 0; s < l; s++) {
    const u = e[s];
    if (u !== 0) {
      if (r = n[n.length - 1], e[r] < u) {
        t[s] = r, n.push(s);
        continue;
      }
      for (o = 0, i = n.length - 1; o < i; )
        a = o + i >> 1, e[n[a]] < u ? o = a + 1 : i = a;
      u < e[n[o]] && (o > 0 && (t[s] = n[o - 1]), n[o] = s);
    }
  }
  for (o = n.length, i = n[o - 1]; o-- > 0; )
    n[o] = i, i = t[i];
  return n;
}
function Cc(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Cc(t);
}
function Gi(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const _d = Symbol.for("v-scx"), bd = () => Qt(_d);
function vd(e, t) {
  return fi(
    e,
    null,
    { flush: "post" }
  );
}
function bt(e, t, n) {
  return fi(e, t, n);
}
function fi(e, t, n = Ae) {
  const { immediate: s, deep: r, flush: o, once: i } = n, a = Fe({}, n), l = t && s || !t && o !== "post";
  let u;
  if (Ts) {
    if (o === "sync") {
      const b = bd();
      u = b.__watcherHandles || (b.__watcherHandles = []);
    } else if (!l) {
      const b = () => {
      };
      return b.stop = Ht, b.resume = Ht, b.pause = Ht, b;
    }
  }
  const c = Ke;
  a.call = (b, _, w) => Mt(b, c, _, w);
  let f = !1;
  o === "post" ? a.scheduler = (b) => {
    mt(b, c && c.suspense);
  } : o !== "sync" && (f = !0, a.scheduler = (b, _) => {
    _ ? b() : ii(b);
  }), a.augmentJob = (b) => {
    t && (b.flags |= 4), f && (b.flags |= 2, c && (b.id = c.uid, b.i = c));
  };
  const h = Pf(e, t, a);
  return Ts && (u ? u.push(h) : l && h()), h;
}
function yd(e, t, n) {
  const s = this.proxy, r = De(e) ? e.includes(".") ? Tc(s, e) : () => s[e] : e.bind(s, s);
  let o;
  re(t) ? o = t : (o = t.handler, n = t);
  const i = $s(this), a = fi(r, o.bind(s), n);
  return i(), a;
}
function Tc(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++)
      s = s[n[r]];
    return s;
  };
}
const wd = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${St(t)}Modifiers`] || e[`${hn(t)}Modifiers`];
function kd(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || Ae;
  let r = n;
  const o = t.startsWith("update:"), i = o && wd(s, t.slice(7));
  i && (i.trim && (r = n.map((c) => De(c) ? c.trim() : c)), i.number && (r = n.map(po)));
  let a, l = s[a = Kr(t)] || // also try camelCase event handler (#2249)
  s[a = Kr(St(t))];
  !l && o && (l = s[a = Kr(hn(t))]), l && Mt(
    l,
    e,
    6,
    r
  );
  const u = s[a + "Once"];
  if (u) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[a])
      return;
    e.emitted[a] = !0, Mt(
      u,
      e,
      6,
      r
    );
  }
}
function Sc(e, t, n = !1) {
  const s = t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const o = e.emits;
  let i = {}, a = !1;
  if (!re(e)) {
    const l = (u) => {
      const c = Sc(u, t, !0);
      c && (a = !0, Fe(i, c));
    };
    !n && t.mixins.length && t.mixins.forEach(l), e.extends && l(e.extends), e.mixins && e.mixins.forEach(l);
  }
  return !o && !a ? (Re(e) && s.set(e, null), null) : (Z(o) ? o.forEach((l) => i[l] = null) : Fe(i, o), Re(e) && s.set(e, i), i);
}
function Or(e, t) {
  return !e || !kr(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), ye(e, t[0].toLowerCase() + t.slice(1)) || ye(e, hn(t)) || ye(e, t));
}
function eo(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    propsOptions: [o],
    slots: i,
    attrs: a,
    emit: l,
    render: u,
    renderCache: c,
    props: f,
    data: h,
    setupState: b,
    ctx: _,
    inheritAttrs: w
  } = e, x = sr(e);
  let g, A;
  try {
    if (n.shapeFlag & 4) {
      const k = r || s, M = k;
      g = Ft(
        u.call(
          M,
          k,
          c,
          f,
          b,
          h,
          _
        )
      ), A = a;
    } else {
      const k = t;
      g = Ft(
        k.length > 1 ? k(
          f,
          { attrs: a, slots: i, emit: l }
        ) : k(
          f,
          null
        )
      ), A = t.props ? a : xd(a);
    }
  } catch (k) {
    bs.length = 0, Rr(k, e, 1), g = q(ct);
  }
  let T = g;
  if (A && w !== !1) {
    const k = Object.keys(A), { shapeFlag: M } = T;
    k.length && M & 7 && (o && k.some(Yo) && (A = Ed(
      A,
      o
    )), T = dn(T, A, !1, !0));
  }
  return n.dirs && (T = dn(T, null, !1, !0), T.dirs = T.dirs ? T.dirs.concat(n.dirs) : n.dirs), n.transition && On(T, n.transition), g = T, sr(x), g;
}
const xd = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || kr(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Ed = (e, t) => {
  const n = {};
  for (const s in e)
    (!Yo(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function Ad(e, t, n) {
  const { props: s, children: r, component: o } = e, { props: i, children: a, patchFlag: l } = t, u = o.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && l >= 0) {
    if (l & 1024)
      return !0;
    if (l & 16)
      return s ? Yi(s, i, u) : !!i;
    if (l & 8) {
      const c = t.dynamicProps;
      for (let f = 0; f < c.length; f++) {
        const h = c[f];
        if (i[h] !== s[h] && !Or(u, h))
          return !0;
      }
    }
  } else
    return (r || a) && (!a || !a.$stable) ? !0 : s === i ? !1 : s ? i ? Yi(s, i, u) : !0 : !!i;
  return !1;
}
function Yi(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const o = s[r];
    if (t[o] !== e[o] && !Or(n, o))
      return !0;
  }
  return !1;
}
function Cd({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const Rc = (e) => e.__isSuspense;
function Td(e, t) {
  t && t.pendingBranch ? Z(e) ? t.effects.push(...e) : t.effects.push(e) : Bf(e);
}
const Oe = Symbol.for("v-fgt"), Ns = Symbol.for("v-txt"), ct = Symbol.for("v-cmt"), _s = Symbol.for("v-stc"), bs = [];
let _t = null;
function N(e = !1) {
  bs.push(_t = e ? null : []);
}
function Sd() {
  bs.pop(), _t = bs[bs.length - 1] || null;
}
let Cs = 1;
function Qi(e) {
  Cs += e, e < 0 && _t && (_t.hasOnce = !0);
}
function Lc(e) {
  return e.dynamicChildren = Cs > 0 ? _t || Hn : null, Sd(), Cs > 0 && _t && _t.push(e), e;
}
function B(e, t, n, s, r, o) {
  return Lc(
    C(
      e,
      t,
      n,
      s,
      r,
      o,
      !0
    )
  );
}
function rt(e, t, n, s, r) {
  return Lc(
    q(
      e,
      t,
      n,
      s,
      r,
      !0
    )
  );
}
function ir(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function xn(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Ic = ({ key: e }) => e ?? null, Ys = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? De(e) || qe(e) || re(e) ? { i: ut, r: e, k: t, f: !!n } : e : null);
function C(e, t = null, n = null, s = 0, r = null, o = e === Oe ? 0 : 1, i = !1, a = !1) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Ic(t),
    ref: t && Ys(t),
    scopeId: tc,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: o,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: ut
  };
  return a ? (di(l, n), o & 128 && e.normalize(l)) : n && (l.shapeFlag |= De(n) ? 8 : 16), Cs > 0 && // avoid a block node from tracking itself
  !i && // has current parent block
  _t && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (l.patchFlag > 0 || o & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  l.patchFlag !== 32 && _t.push(l), l;
}
const q = Rd;
function Rd(e, t = null, n = null, s = 0, r = null, o = !1) {
  if ((!e || e === dc) && (e = ct), ir(e)) {
    const a = dn(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && di(a, n), Cs > 0 && !o && _t && (a.shapeFlag & 6 ? _t[_t.indexOf(e)] = a : _t.push(a)), a.patchFlag = -2, a;
  }
  if (Ud(e) && (e = e.__vccOpts), t) {
    t = Ld(t);
    let { class: a, style: l } = t;
    a && !De(a) && (t.class = je(a)), Re(l) && (oi(l) && !Z(l) && (l = Fe({}, l)), t.style = Ln(l));
  }
  const i = De(e) ? 1 : Rc(e) ? 128 : nc(e) ? 64 : Re(e) ? 4 : re(e) ? 2 : 0;
  return C(
    e,
    t,
    n,
    s,
    r,
    i,
    o,
    !0
  );
}
function Ld(e) {
  return e ? oi(e) || bc(e) ? Fe({}, e) : e : null;
}
function dn(e, t, n = !1, s = !1) {
  const { props: r, ref: o, patchFlag: i, children: a, transition: l } = e, u = t ? Id(r || {}, t) : r, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: u,
    key: u && Ic(u),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && o ? Z(o) ? o.concat(Ys(t)) : [o, Ys(t)] : Ys(t)
    ) : o,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: a,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Oe ? i === -1 ? 16 : i | 16 : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: l,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && dn(e.ssContent),
    ssFallback: e.ssFallback && dn(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return l && s && On(
    c,
    l.clone(c)
  ), c;
}
function Lt(e = " ", t = 0) {
  return q(Ns, null, e, t);
}
function es(e, t) {
  const n = q(_s, null, e);
  return n.staticCount = t, n;
}
function we(e = "", t = !1) {
  return t ? (N(), rt(ct, null, e)) : q(ct, null, e);
}
function Ft(e) {
  return e == null || typeof e == "boolean" ? q(ct) : Z(e) ? q(
    Oe,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : ir(e) ? cn(e) : q(Ns, null, String(e));
}
function cn(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : dn(e);
}
function di(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (Z(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), di(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !bc(t) ? t._ctx = ut : r === 3 && ut && (ut.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else re(t) ? (t = { default: t, _ctx: ut }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [Lt(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Id(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = je([t.class, s.class]));
      else if (r === "style")
        t.style = Ln([t.style, s.style]);
      else if (kr(r)) {
        const o = t[r], i = s[r];
        i && o !== i && !(Z(o) && o.includes(i)) && (t[r] = o ? [].concat(o, i) : i);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function Nt(e, t, n, s = null) {
  Mt(e, t, 7, [
    n,
    s
  ]);
}
const Md = pc();
let Od = 0;
function Nd(e, t, n) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || Md, o = {
    uid: Od++,
    vnode: e,
    type: s,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new Ml(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: yc(s, r),
    emitsOptions: Sc(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: Ae,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: Ae,
    data: Ae,
    props: Ae,
    attrs: Ae,
    slots: Ae,
    refs: Ae,
    setupState: Ae,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return o.ctx = { _: o }, o.root = t ? t.root : o, o.emit = kd.bind(null, o), e.ce && e.ce(o), o;
}
let Ke = null;
const jt = () => Ke || ut;
let ar, Ao;
{
  const e = Cr(), t = (n, s) => {
    let r;
    return (r = e[n]) || (r = e[n] = []), r.push(s), (o) => {
      r.length > 1 ? r.forEach((i) => i(o)) : r[0](o);
    };
  };
  ar = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Ke = n
  ), Ao = t(
    "__VUE_SSR_SETTERS__",
    (n) => Ts = n
  );
}
const $s = (e) => {
  const t = Ke;
  return ar(e), e.scope.on(), () => {
    e.scope.off(), ar(t);
  };
}, Xi = () => {
  Ke && Ke.scope.off(), ar(null);
};
function Mc(e) {
  return e.vnode.shapeFlag & 4;
}
let Ts = !1;
function $d(e, t = !1, n = !1) {
  t && Ao(t);
  const { props: s, children: r } = e.vnode, o = Mc(e);
  ad(e, s, o, t), fd(e, r, n);
  const i = o ? Pd(e, t) : void 0;
  return t && Ao(!1), i;
}
function Pd(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Zf);
  const { setup: s } = n;
  if (s) {
    pn();
    const r = e.setupContext = s.length > 1 ? Fd(e) : null, o = $s(e), i = Os(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), a = El(i);
    if (mn(), o(), (a || e.sp) && !ms(e) && lc(e), a) {
      if (i.then(Xi, Xi), t)
        return i.then((l) => {
          Ji(e, l, t);
        }).catch((l) => {
          Rr(l, e, 0);
        });
      e.asyncDep = i;
    } else
      Ji(e, i, t);
  } else
    Oc(e, t);
}
function Ji(e, t, n) {
  re(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : Re(t) && (e.setupState = Ql(t)), Oc(e, n);
}
let Zi;
function Oc(e, t, n) {
  const s = e.type;
  if (!e.render) {
    if (!t && Zi && !s.render) {
      const r = s.template || ci(e).template;
      if (r) {
        const { isCustomElement: o, compilerOptions: i } = e.appContext.config, { delimiters: a, compilerOptions: l } = s, u = Fe(
          Fe(
            {
              isCustomElement: o,
              delimiters: a
            },
            i
          ),
          l
        );
        s.render = Zi(r, u);
      }
    }
    e.render = s.render || Ht;
  }
  {
    const r = $s(e);
    pn();
    try {
      ed(e);
    } finally {
      mn(), r();
    }
  }
}
const Dd = {
  get(e, t) {
    return Ge(e, "get", ""), e[t];
  }
};
function Fd(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Dd),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Nr(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Ql(Lf(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in gs)
        return gs[n](e);
    },
    has(t, n) {
      return n in t || n in gs;
    }
  })) : e.proxy;
}
function Bd(e, t = !0) {
  return re(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ud(e) {
  return re(e) && "__vccOpts" in e;
}
const ke = (e, t) => Nf(e, t, Ts);
function hi(e, t, n) {
  const s = arguments.length;
  return s === 2 ? Re(t) && !Z(t) ? ir(t) ? q(e, null, [t]) : q(e, t) : q(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && ir(n) && (n = [n]), q(e, t, n));
}
const Hd = "3.5.12";
/**
* @vue/runtime-dom v3.5.12
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Co;
const ea = typeof window < "u" && window.trustedTypes;
if (ea)
  try {
    Co = /* @__PURE__ */ ea.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Nc = Co ? (e) => Co.createHTML(e) : (e) => e, zd = "http://www.w3.org/2000/svg", jd = "http://www.w3.org/1998/Math/MathML", qt = typeof document < "u" ? document : null, ta = qt && /* @__PURE__ */ qt.createElement("template"), Vd = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const r = t === "svg" ? qt.createElementNS(zd, e) : t === "mathml" ? qt.createElementNS(jd, e) : n ? qt.createElement(e, { is: n }) : qt.createElement(e);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
  },
  createText: (e) => qt.createTextNode(e),
  createComment: (e) => qt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => qt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, r, o) {
    const i = n ? n.previousSibling : t.lastChild;
    if (r && (r === o || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), n), !(r === o || !(r = r.nextSibling)); )
        ;
    else {
      ta.innerHTML = Nc(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const a = ta.content;
      if (s === "svg" || s === "mathml") {
        const l = a.firstChild;
        for (; l.firstChild; )
          a.appendChild(l.firstChild);
        a.removeChild(l);
      }
      t.insertBefore(a, n);
    }
    return [
      // first
      i ? i.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, nn = "transition", os = "animation", qn = Symbol("_vtc"), $c = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
}, Pc = /* @__PURE__ */ Fe(
  {},
  rc,
  $c
), Wd = (e) => (e.displayName = "Transition", e.props = Pc, e), vs = /* @__PURE__ */ Wd(
  (e, { slots: t }) => hi(zf, Dc(e), t)
), wn = (e, t = []) => {
  Z(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, na = (e) => e ? Z(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Dc(e) {
  const t = {};
  for (const D in e)
    D in $c || (t[D] = e[D]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: s,
    duration: r,
    enterFromClass: o = `${n}-enter-from`,
    enterActiveClass: i = `${n}-enter-active`,
    enterToClass: a = `${n}-enter-to`,
    appearFromClass: l = o,
    appearActiveClass: u = i,
    appearToClass: c = a,
    leaveFromClass: f = `${n}-leave-from`,
    leaveActiveClass: h = `${n}-leave-active`,
    leaveToClass: b = `${n}-leave-to`
  } = e, _ = Kd(r), w = _ && _[0], x = _ && _[1], {
    onBeforeEnter: g,
    onEnter: A,
    onEnterCancelled: T,
    onLeave: k,
    onLeaveCancelled: M,
    onBeforeAppear: P = g,
    onAppear: O = A,
    onAppearCancelled: X = T
  } = t, W = (D, te, he) => {
    on(D, te ? c : a), on(D, te ? u : i), he && he();
  }, J = (D, te) => {
    D._isLeaving = !1, on(D, f), on(D, b), on(D, h), te && te();
  }, G = (D) => (te, he) => {
    const Ne = D ? O : A, ue = () => W(te, D, he);
    wn(Ne, [te, ue]), sa(() => {
      on(te, D ? l : o), Kt(te, D ? c : a), na(Ne) || ra(te, s, w, ue);
    });
  };
  return Fe(t, {
    onBeforeEnter(D) {
      wn(g, [D]), Kt(D, o), Kt(D, i);
    },
    onBeforeAppear(D) {
      wn(P, [D]), Kt(D, l), Kt(D, u);
    },
    onEnter: G(!1),
    onAppear: G(!0),
    onLeave(D, te) {
      D._isLeaving = !0;
      const he = () => J(D, te);
      Kt(D, f), Kt(D, h), Bc(), sa(() => {
        D._isLeaving && (on(D, f), Kt(D, b), na(k) || ra(D, s, x, he));
      }), wn(k, [D, he]);
    },
    onEnterCancelled(D) {
      W(D, !1), wn(T, [D]);
    },
    onAppearCancelled(D) {
      W(D, !0), wn(X, [D]);
    },
    onLeaveCancelled(D) {
      J(D), wn(M, [D]);
    }
  });
}
function Kd(e) {
  if (e == null)
    return null;
  if (Re(e))
    return [to(e.enter), to(e.leave)];
  {
    const t = to(e);
    return [t, t];
  }
}
function to(e) {
  return ef(e);
}
function Kt(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[qn] || (e[qn] = /* @__PURE__ */ new Set())).add(t);
}
function on(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[qn];
  n && (n.delete(t), n.size || (e[qn] = void 0));
}
function sa(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let qd = 0;
function ra(e, t, n, s) {
  const r = e._endId = ++qd, o = () => {
    r === e._endId && s();
  };
  if (n != null)
    return setTimeout(o, n);
  const { type: i, timeout: a, propCount: l } = Fc(e, t);
  if (!i)
    return s();
  const u = i + "end";
  let c = 0;
  const f = () => {
    e.removeEventListener(u, h), o();
  }, h = (b) => {
    b.target === e && ++c >= l && f();
  };
  setTimeout(() => {
    c < l && f();
  }, a + 1), e.addEventListener(u, h);
}
function Fc(e, t) {
  const n = window.getComputedStyle(e), s = (_) => (n[_] || "").split(", "), r = s(`${nn}Delay`), o = s(`${nn}Duration`), i = oa(r, o), a = s(`${os}Delay`), l = s(`${os}Duration`), u = oa(a, l);
  let c = null, f = 0, h = 0;
  t === nn ? i > 0 && (c = nn, f = i, h = o.length) : t === os ? u > 0 && (c = os, f = u, h = l.length) : (f = Math.max(i, u), c = f > 0 ? i > u ? nn : os : null, h = c ? c === nn ? o.length : l.length : 0);
  const b = c === nn && /\b(transform|all)(,|$)/.test(
    s(`${nn}Property`).toString()
  );
  return {
    type: c,
    timeout: f,
    propCount: h,
    hasTransform: b
  };
}
function oa(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => ia(n) + ia(e[s])));
}
function ia(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Bc() {
  return document.body.offsetHeight;
}
function Gd(e, t, n) {
  const s = e[qn];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const lr = Symbol("_vod"), Uc = Symbol("_vsh"), un = {
  beforeMount(e, { value: t }, { transition: n }) {
    e[lr] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : is(e, t);
  },
  mounted(e, { value: t }, { transition: n }) {
    n && t && n.enter(e);
  },
  updated(e, { value: t, oldValue: n }, { transition: s }) {
    !t != !n && (s ? t ? (s.beforeEnter(e), is(e, !0), s.enter(e)) : s.leave(e, () => {
      is(e, !1);
    }) : is(e, t));
  },
  beforeUnmount(e, { value: t }) {
    is(e, t);
  }
};
function is(e, t) {
  e.style.display = t ? e[lr] : "none", e[Uc] = !t;
}
const Hc = Symbol("");
function $r(e) {
  const t = jt();
  if (!t)
    return;
  const n = t.ut = (r = e(t.proxy)) => {
    Array.from(
      document.querySelectorAll(`[data-v-owner="${t.uid}"]`)
    ).forEach((o) => cr(o, r));
  }, s = () => {
    const r = e(t.proxy);
    t.ce ? cr(t.ce, r) : To(t.subTree, r), n(r);
  };
  uc(() => {
    vd(s);
  }), gn(() => {
    const r = new MutationObserver(s);
    r.observe(t.subTree.el.parentNode, { childList: !0 }), Zn(() => r.disconnect());
  });
}
function To(e, t) {
  if (e.shapeFlag & 128) {
    const n = e.suspense;
    e = n.activeBranch, n.pendingBranch && !n.isHydrating && n.effects.push(() => {
      To(n.activeBranch, t);
    });
  }
  for (; e.component; )
    e = e.component.subTree;
  if (e.shapeFlag & 1 && e.el)
    cr(e.el, t);
  else if (e.type === Oe)
    e.children.forEach((n) => To(n, t));
  else if (e.type === _s) {
    let { el: n, anchor: s } = e;
    for (; n && (cr(n, t), n !== s); )
      n = n.nextSibling;
  }
}
function cr(e, t) {
  if (e.nodeType === 1) {
    const n = e.style;
    let s = "";
    for (const r in t)
      n.setProperty(`--${r}`, t[r]), s += `--${r}: ${t[r]};`;
    n[Hc] = s;
  }
}
const Yd = /(^|;)\s*display\s*:/;
function Qd(e, t, n) {
  const s = e.style, r = De(n);
  let o = !1;
  if (n && !r) {
    if (t)
      if (De(t))
        for (const i of t.split(";")) {
          const a = i.slice(0, i.indexOf(":")).trim();
          n[a] == null && Qs(s, a, "");
        }
      else
        for (const i in t)
          n[i] == null && Qs(s, i, "");
    for (const i in n)
      i === "display" && (o = !0), Qs(s, i, n[i]);
  } else if (r) {
    if (t !== n) {
      const i = s[Hc];
      i && (n += ";" + i), s.cssText = n, o = Yd.test(n);
    }
  } else t && e.removeAttribute("style");
  lr in e && (e[lr] = o ? s.display : "", e[Uc] && (s.display = "none"));
}
const aa = /\s*!important$/;
function Qs(e, t, n) {
  if (Z(n))
    n.forEach((s) => Qs(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = Xd(e, t);
    aa.test(n) ? e.setProperty(
      hn(s),
      n.replace(aa, ""),
      "important"
    ) : e[s] = n;
  }
}
const la = ["Webkit", "Moz", "ms"], no = {};
function Xd(e, t) {
  const n = no[t];
  if (n)
    return n;
  let s = St(t);
  if (s !== "filter" && s in e)
    return no[t] = s;
  s = Ar(s);
  for (let r = 0; r < la.length; r++) {
    const o = la[r] + s;
    if (o in e)
      return no[t] = o;
  }
  return t;
}
const ca = "http://www.w3.org/1999/xlink";
function ua(e, t, n, s, r, o = af(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ca, t.slice(6, t.length)) : e.setAttributeNS(ca, t, n) : n == null || o && !Sl(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    o ? "" : zt(n) ? String(n) : n
  );
}
function fa(e, t, n, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Nc(n) : n);
    return;
  }
  const o = e.tagName;
  if (t === "value" && o !== "PROGRESS" && // custom elements may use _value internally
  !o.includes("-")) {
    const a = o === "OPTION" ? e.getAttribute("value") || "" : e.value, l = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (a !== l || !("_value" in e)) && (e.value = l), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let i = !1;
  if (n === "" || n == null) {
    const a = typeof e[t];
    a === "boolean" ? n = Sl(n) : n == null && a === "string" ? (n = "", i = !0) : a === "number" && (n = 0, i = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  i && e.removeAttribute(r || t);
}
function En(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Jd(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const da = Symbol("_vei");
function Zd(e, t, n, s, r = null) {
  const o = e[da] || (e[da] = {}), i = o[t];
  if (s && i)
    i.value = s;
  else {
    const [a, l] = e1(t);
    if (s) {
      const u = o[t] = s1(
        s,
        r
      );
      En(e, a, u, l);
    } else i && (Jd(e, a, i, l), o[t] = void 0);
  }
}
const ha = /(?:Once|Passive|Capture)$/;
function e1(e) {
  let t;
  if (ha.test(e)) {
    t = {};
    let s;
    for (; s = e.match(ha); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : hn(e.slice(2)), t];
}
let so = 0;
const t1 = /* @__PURE__ */ Promise.resolve(), n1 = () => so || (t1.then(() => so = 0), so = Date.now());
function s1(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    Mt(
      r1(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = n1(), n;
}
function r1(e, t) {
  if (Z(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (s) => (r) => !r._stopped && s && s(r)
    );
  } else
    return t;
}
const pa = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, o1 = (e, t, n, s, r, o) => {
  const i = r === "svg";
  t === "class" ? Gd(e, s, i) : t === "style" ? Qd(e, n, s) : kr(t) ? Yo(t) || Zd(e, t, n, s, o) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : i1(e, t, s, i)) ? (fa(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ua(e, t, s, i, o, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !De(s)) ? fa(e, St(t), s, o, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), ua(e, t, s, i));
};
function i1(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && pa(t) && re(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return pa(t) && De(n) ? !1 : t in e;
}
const zc = /* @__PURE__ */ new WeakMap(), jc = /* @__PURE__ */ new WeakMap(), ur = Symbol("_moveCb"), ma = Symbol("_enterCb"), a1 = (e) => (delete e.props.mode, e), l1 = /* @__PURE__ */ a1({
  name: "TransitionGroup",
  props: /* @__PURE__ */ Fe({}, Pc, {
    tag: String,
    moveClass: String
  }),
  setup(e, { slots: t }) {
    const n = jt(), s = sc();
    let r, o;
    return fc(() => {
      if (!r.length)
        return;
      const i = e.moveClass || `${e.name || "v"}-move`;
      if (!h1(
        r[0].el,
        n.vnode.el,
        i
      ))
        return;
      r.forEach(u1), r.forEach(f1);
      const a = r.filter(d1);
      Bc(), a.forEach((l) => {
        const u = l.el, c = u.style;
        Kt(u, i), c.transform = c.webkitTransform = c.transitionDuration = "";
        const f = u[ur] = (h) => {
          h && h.target !== u || (!h || /transform$/.test(h.propertyName)) && (u.removeEventListener("transitionend", f), u[ur] = null, on(u, i));
        };
        u.addEventListener("transitionend", f);
      });
    }), () => {
      const i = me(e), a = Dc(i);
      let l = i.tag || Oe;
      if (r = [], o)
        for (let u = 0; u < o.length; u++) {
          const c = o[u];
          c.el && c.el instanceof Element && (r.push(c), On(
            c,
            As(
              c,
              a,
              s,
              n
            )
          ), zc.set(
            c,
            c.el.getBoundingClientRect()
          ));
        }
      o = t.default ? ai(t.default()) : [];
      for (let u = 0; u < o.length; u++) {
        const c = o[u];
        c.key != null && On(
          c,
          As(c, a, s, n)
        );
      }
      return q(l, null, o);
    };
  }
}), c1 = l1;
function u1(e) {
  const t = e.el;
  t[ur] && t[ur](), t[ma] && t[ma]();
}
function f1(e) {
  jc.set(e, e.el.getBoundingClientRect());
}
function d1(e) {
  const t = zc.get(e), n = jc.get(e), s = t.left - n.left, r = t.top - n.top;
  if (s || r) {
    const o = e.el.style;
    return o.transform = o.webkitTransform = `translate(${s}px,${r}px)`, o.transitionDuration = "0s", e;
  }
}
function h1(e, t, n) {
  const s = e.cloneNode(), r = e[qn];
  r && r.forEach((a) => {
    a.split(/\s+/).forEach((l) => l && s.classList.remove(l));
  }), n.split(/\s+/).forEach((a) => a && s.classList.add(a)), s.style.display = "none";
  const o = t.nodeType === 1 ? t : t.parentNode;
  o.appendChild(s);
  const { hasTransform: i } = Fc(s);
  return o.removeChild(s), i;
}
const fr = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return Z(t) ? (n) => Gs(t, n) : t;
};
function p1(e) {
  e.target.composing = !0;
}
function ga(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Kn = Symbol("_assign"), m1 = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, r) {
    e[Kn] = fr(r);
    const o = s || r.props && r.props.type === "number";
    En(e, t ? "change" : "input", (i) => {
      if (i.target.composing) return;
      let a = e.value;
      n && (a = a.trim()), o && (a = po(a)), e[Kn](a);
    }), n && En(e, "change", () => {
      e.value = e.value.trim();
    }), t || (En(e, "compositionstart", p1), En(e, "compositionend", ga), En(e, "change", ga));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: r, number: o } }, i) {
    if (e[Kn] = fr(i), e.composing) return;
    const a = (o || e.type === "number") && !/^0\d/.test(e.value) ? po(e.value) : e.value, l = t ?? "";
    a !== l && (document.activeElement === e && e.type !== "range" && (s && t === n || r && e.value.trim() === l) || (e.value = l));
  }
}, g1 = {
  // #4096 array checkboxes need to be deep traversed
  deep: !0,
  created(e, t, n) {
    e[Kn] = fr(n), En(e, "change", () => {
      const s = e._modelValue, r = _1(e), o = e.checked, i = e[Kn];
      if (Z(s)) {
        const a = Rl(s, r), l = a !== -1;
        if (o && !l)
          i(s.concat(r));
        else if (!o && l) {
          const u = [...s];
          u.splice(a, 1), i(u);
        }
      } else if (xr(s)) {
        const a = new Set(s);
        o ? a.add(r) : a.delete(r), i(a);
      } else
        i(Vc(e, o));
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: _a,
  beforeUpdate(e, t, n) {
    e[Kn] = fr(n), _a(e, t, n);
  }
};
function _a(e, { value: t, oldValue: n }, s) {
  e._modelValue = t;
  let r;
  if (Z(t))
    r = Rl(t, s.props.value) > -1;
  else if (xr(t))
    r = t.has(s.props.value);
  else {
    if (t === n) return;
    r = Tr(t, Vc(e, !0));
  }
  e.checked !== r && (e.checked = r);
}
function _1(e) {
  return "_value" in e ? e._value : e.value;
}
function Vc(e, t) {
  const n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}
const b1 = ["ctrl", "shift", "alt", "meta"], v1 = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => b1.some((n) => e[`${n}Key`] && !t.includes(n))
}, tt = (e, t) => {
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = (r, ...o) => {
    for (let i = 0; i < t.length; i++) {
      const a = v1[t[i]];
      if (a && a(r, t)) return;
    }
    return e(r, ...o);
  });
}, y1 = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, lt = (e, t) => {
  const n = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return n[s] || (n[s] = (r) => {
    if (!("key" in r))
      return;
    const o = hn(r.key);
    if (t.some(
      (i) => i === o || y1[i] === o
    ))
      return e(r);
  });
}, w1 = /* @__PURE__ */ Fe({ patchProp: o1 }, Vd);
let ba;
function k1() {
  return ba || (ba = hd(w1));
}
const x1 = (...e) => {
  const t = k1().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const r = A1(s);
    if (!r) return;
    const o = t._component;
    !re(o) && !o.render && !o.template && (o.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const i = n(r, !1, E1(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), i;
  }, t;
};
function E1(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function A1(e) {
  return De(e) ? document.querySelector(e) : e;
}
/*!
  * shared v10.0.4
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */
const dr = typeof window < "u", _n = (e, t = !1) => t ? Symbol.for(e) : Symbol(e), C1 = (e, t, n) => T1({ l: e, k: t, s: n }), T1 = (e) => JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027"), ze = (e) => typeof e == "number" && isFinite(e), S1 = (e) => pi(e) === "[object Date]", Gn = (e) => pi(e) === "[object RegExp]", Pr = (e) => ae(e) && Object.keys(e).length === 0, Ve = Object.assign;
let va;
const Cn = () => va || (va = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ya(e) {
  return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const R1 = Object.prototype.hasOwnProperty;
function hr(e, t) {
  return R1.call(e, t);
}
const Pe = Array.isArray, Ie = (e) => typeof e == "function", K = (e) => typeof e == "string", ge = (e) => typeof e == "boolean", be = (e) => e !== null && typeof e == "object", L1 = (e) => be(e) && Ie(e.then) && Ie(e.catch), Wc = Object.prototype.toString, pi = (e) => Wc.call(e), ae = (e) => pi(e) === "[object Object]", I1 = (e) => e == null ? "" : Pe(e) || ae(e) && e.toString === Wc ? JSON.stringify(e, null, 2) : String(e);
function mi(e, t = "") {
  return e.reduce((n, s, r) => r === 0 ? n + s : n + t + s, "");
}
function M1(e, t) {
  typeof console < "u" && (console.warn("[intlify] " + e), t && console.warn(t.stack));
}
const Ws = (e) => !be(e) || Pe(e);
function Xs(e, t) {
  if (Ws(e) || Ws(t))
    throw new Error("Invalid value");
  const n = [{ src: e, des: t }];
  for (; n.length; ) {
    const { src: s, des: r } = n.pop();
    Object.keys(s).forEach((o) => {
      be(s[o]) && !be(r[o]) && (r[o] = Array.isArray(s[o]) ? [] : {}), Ws(r[o]) || Ws(s[o]) ? r[o] = s[o] : n.push({ src: s[o], des: r[o] });
    });
  }
}
/*!
  * message-compiler v10.0.4
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */
function O1(e, t, n) {
  return { line: e, column: t, offset: n };
}
function So(e, t, n) {
  return { start: e, end: t };
}
const xe = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,
  // generator error codes
  UNHANDLED_CODEGEN_NODE_TYPE: 15,
  // minifier error codes
  UNHANDLED_MINIFIER_NODE_TYPE: 16
}, N1 = 17;
function Dr(e, t, n = {}) {
  const { domain: s, messages: r, args: o } = n, i = e, a = new SyntaxError(String(i));
  return a.code = e, t && (a.location = t), a.domain = s, a;
}
function $1(e) {
  throw e;
}
const Wt = " ", P1 = "\r", nt = `
`, D1 = "\u2028", F1 = "\u2029";
function B1(e) {
  const t = e;
  let n = 0, s = 1, r = 1, o = 0;
  const i = (O) => t[O] === P1 && t[O + 1] === nt, a = (O) => t[O] === nt, l = (O) => t[O] === F1, u = (O) => t[O] === D1, c = (O) => i(O) || a(O) || l(O) || u(O), f = () => n, h = () => s, b = () => r, _ = () => o, w = (O) => i(O) || l(O) || u(O) ? nt : t[O], x = () => w(n), g = () => w(n + o);
  function A() {
    return o = 0, c(n) && (s++, r = 0), i(n) && n++, n++, r++, t[n];
  }
  function T() {
    return i(n + o) && o++, o++, t[n + o];
  }
  function k() {
    n = 0, s = 1, r = 1, o = 0;
  }
  function M(O = 0) {
    o = O;
  }
  function P() {
    const O = n + o;
    for (; O !== n; )
      A();
    o = 0;
  }
  return {
    index: f,
    line: h,
    column: b,
    peekOffset: _,
    charAt: w,
    currentChar: x,
    currentPeek: g,
    next: A,
    peek: T,
    reset: k,
    resetPeek: M,
    skipToPeek: P
  };
}
const sn = void 0, U1 = ".", wa = "'", H1 = "tokenizer";
function z1(e, t = {}) {
  const n = t.location !== !1, s = B1(e), r = () => s.index(), o = () => O1(s.line(), s.column(), s.index()), i = o(), a = r(), l = {
    currentType: 13,
    offset: a,
    startLoc: i,
    endLoc: i,
    lastType: 13,
    lastOffset: a,
    lastStartLoc: i,
    lastEndLoc: i,
    braceNest: 0,
    inLinked: !1,
    text: ""
  }, u = () => l, { onError: c } = t;
  function f(d, p, E, ...R) {
    const $ = u();
    if (p.column += E, p.offset += E, c) {
      const z = n ? So($.startLoc, p) : null, y = Dr(d, z, {
        domain: H1,
        args: R
      });
      c(y);
    }
  }
  function h(d, p, E) {
    d.endLoc = o(), d.currentType = p;
    const R = { type: p };
    return n && (R.loc = So(d.startLoc, d.endLoc)), E != null && (R.value = E), R;
  }
  const b = (d) => h(
    d,
    13
    /* TokenTypes.EOF */
  );
  function _(d, p) {
    return d.currentChar() === p ? (d.next(), p) : (f(xe.EXPECTED_TOKEN, o(), 0, p), "");
  }
  function w(d) {
    let p = "";
    for (; d.currentPeek() === Wt || d.currentPeek() === nt; )
      p += d.currentPeek(), d.peek();
    return p;
  }
  function x(d) {
    const p = w(d);
    return d.skipToPeek(), p;
  }
  function g(d) {
    if (d === sn)
      return !1;
    const p = d.charCodeAt(0);
    return p >= 97 && p <= 122 || // a-z
    p >= 65 && p <= 90 || // A-Z
    p === 95;
  }
  function A(d) {
    if (d === sn)
      return !1;
    const p = d.charCodeAt(0);
    return p >= 48 && p <= 57;
  }
  function T(d, p) {
    const { currentType: E } = p;
    if (E !== 2)
      return !1;
    w(d);
    const R = g(d.currentPeek());
    return d.resetPeek(), R;
  }
  function k(d, p) {
    const { currentType: E } = p;
    if (E !== 2)
      return !1;
    w(d);
    const R = d.currentPeek() === "-" ? d.peek() : d.currentPeek(), $ = A(R);
    return d.resetPeek(), $;
  }
  function M(d, p) {
    const { currentType: E } = p;
    if (E !== 2)
      return !1;
    w(d);
    const R = d.currentPeek() === wa;
    return d.resetPeek(), R;
  }
  function P(d, p) {
    const { currentType: E } = p;
    if (E !== 7)
      return !1;
    w(d);
    const R = d.currentPeek() === ".";
    return d.resetPeek(), R;
  }
  function O(d, p) {
    const { currentType: E } = p;
    if (E !== 8)
      return !1;
    w(d);
    const R = g(d.currentPeek());
    return d.resetPeek(), R;
  }
  function X(d, p) {
    const { currentType: E } = p;
    if (!(E === 7 || E === 11))
      return !1;
    w(d);
    const R = d.currentPeek() === ":";
    return d.resetPeek(), R;
  }
  function W(d, p) {
    const { currentType: E } = p;
    if (E !== 9)
      return !1;
    const R = () => {
      const z = d.currentPeek();
      return z === "{" ? g(d.peek()) : z === "@" || z === "|" || z === ":" || z === "." || z === Wt || !z ? !1 : z === nt ? (d.peek(), R()) : G(d, !1);
    }, $ = R();
    return d.resetPeek(), $;
  }
  function J(d) {
    w(d);
    const p = d.currentPeek() === "|";
    return d.resetPeek(), p;
  }
  function G(d, p = !0) {
    const E = ($ = !1, z = "") => {
      const y = d.currentPeek();
      return y === "{" || y === "@" || !y ? $ : y === "|" ? !(z === Wt || z === nt) : y === Wt ? (d.peek(), E(!0, Wt)) : y === nt ? (d.peek(), E(!0, nt)) : !0;
    }, R = E();
    return p && d.resetPeek(), R;
  }
  function D(d, p) {
    const E = d.currentChar();
    return E === sn ? sn : p(E) ? (d.next(), E) : null;
  }
  function te(d) {
    const p = d.charCodeAt(0);
    return p >= 97 && p <= 122 || // a-z
    p >= 65 && p <= 90 || // A-Z
    p >= 48 && p <= 57 || // 0-9
    p === 95 || // _
    p === 36;
  }
  function he(d) {
    return D(d, te);
  }
  function Ne(d) {
    const p = d.charCodeAt(0);
    return p >= 97 && p <= 122 || // a-z
    p >= 65 && p <= 90 || // A-Z
    p >= 48 && p <= 57 || // 0-9
    p === 95 || // _
    p === 36 || // $
    p === 45;
  }
  function ue(d) {
    return D(d, Ne);
  }
  function le(d) {
    const p = d.charCodeAt(0);
    return p >= 48 && p <= 57;
  }
  function ce(d) {
    return D(d, le);
  }
  function ne(d) {
    const p = d.charCodeAt(0);
    return p >= 48 && p <= 57 || // 0-9
    p >= 65 && p <= 70 || // A-F
    p >= 97 && p <= 102;
  }
  function _e(d) {
    return D(d, ne);
  }
  function pe(d) {
    let p = "", E = "";
    for (; p = ce(d); )
      E += p;
    return E;
  }
  function Be(d) {
    let p = "";
    for (; ; ) {
      const E = d.currentChar();
      if (E === "{" || E === "}" || E === "@" || E === "|" || !E)
        break;
      if (E === Wt || E === nt)
        if (G(d))
          p += E, d.next();
        else {
          if (J(d))
            break;
          p += E, d.next();
        }
      else
        p += E, d.next();
    }
    return p;
  }
  function ve(d) {
    x(d);
    let p = "", E = "";
    for (; p = ue(d); )
      E += p;
    return d.currentChar() === sn && f(xe.UNTERMINATED_CLOSING_BRACE, o(), 0), E;
  }
  function se(d) {
    x(d);
    let p = "";
    return d.currentChar() === "-" ? (d.next(), p += `-${pe(d)}`) : p += pe(d), d.currentChar() === sn && f(xe.UNTERMINATED_CLOSING_BRACE, o(), 0), p;
  }
  function Te(d) {
    return d !== wa && d !== nt;
  }
  function Xe(d) {
    x(d), _(d, "'");
    let p = "", E = "";
    for (; p = D(d, Te); )
      p === "\\" ? E += pt(d) : E += p;
    const R = d.currentChar();
    return R === nt || R === sn ? (f(xe.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, o(), 0), R === nt && (d.next(), _(d, "'")), E) : (_(d, "'"), E);
  }
  function pt(d) {
    const p = d.currentChar();
    switch (p) {
      case "\\":
      case "'":
        return d.next(), `\\${p}`;
      case "u":
        return at(d, p, 4);
      case "U":
        return at(d, p, 6);
      default:
        return f(xe.UNKNOWN_ESCAPE_SEQUENCE, o(), 0, p), "";
    }
  }
  function at(d, p, E) {
    _(d, p);
    let R = "";
    for (let $ = 0; $ < E; $++) {
      const z = _e(d);
      if (!z) {
        f(xe.INVALID_UNICODE_ESCAPE_SEQUENCE, o(), 0, `\\${p}${R}${d.currentChar()}`);
        break;
      }
      R += z;
    }
    return `\\${p}${R}`;
  }
  function wt(d) {
    return d !== "{" && d !== "}" && d !== Wt && d !== nt;
  }
  function kt(d) {
    x(d);
    let p = "", E = "";
    for (; p = D(d, wt); )
      E += p;
    return E;
  }
  function en(d) {
    let p = "", E = "";
    for (; p = he(d); )
      E += p;
    return E;
  }
  function tn(d) {
    const p = (E) => {
      const R = d.currentChar();
      return R === "{" || R === "@" || R === "|" || R === "(" || R === ")" || !R || R === Wt ? E : (E += R, d.next(), p(E));
    };
    return p("");
  }
  function m(d) {
    x(d);
    const p = _(
      d,
      "|"
      /* TokenChars.Pipe */
    );
    return x(d), p;
  }
  function v(d, p) {
    let E = null;
    switch (d.currentChar()) {
      case "{":
        return p.braceNest >= 1 && f(xe.NOT_ALLOW_NEST_PLACEHOLDER, o(), 0), d.next(), E = h(
          p,
          2,
          "{"
          /* TokenChars.BraceLeft */
        ), x(d), p.braceNest++, E;
      case "}":
        return p.braceNest > 0 && p.currentType === 2 && f(xe.EMPTY_PLACEHOLDER, o(), 0), d.next(), E = h(
          p,
          3,
          "}"
          /* TokenChars.BraceRight */
        ), p.braceNest--, p.braceNest > 0 && x(d), p.inLinked && p.braceNest === 0 && (p.inLinked = !1), E;
      case "@":
        return p.braceNest > 0 && f(xe.UNTERMINATED_CLOSING_BRACE, o(), 0), E = L(d, p) || b(p), p.braceNest = 0, E;
      default: {
        let $ = !0, z = !0, y = !0;
        if (J(d))
          return p.braceNest > 0 && f(xe.UNTERMINATED_CLOSING_BRACE, o(), 0), E = h(p, 1, m(d)), p.braceNest = 0, p.inLinked = !1, E;
        if (p.braceNest > 0 && (p.currentType === 4 || p.currentType === 5 || p.currentType === 6))
          return f(xe.UNTERMINATED_CLOSING_BRACE, o(), 0), p.braceNest = 0, U(d, p);
        if ($ = T(d, p))
          return E = h(p, 4, ve(d)), x(d), E;
        if (z = k(d, p))
          return E = h(p, 5, se(d)), x(d), E;
        if (y = M(d, p))
          return E = h(p, 6, Xe(d)), x(d), E;
        if (!$ && !z && !y)
          return E = h(p, 12, kt(d)), f(xe.INVALID_TOKEN_IN_PLACEHOLDER, o(), 0, E.value), x(d), E;
        break;
      }
    }
    return E;
  }
  function L(d, p) {
    const { currentType: E } = p;
    let R = null;
    const $ = d.currentChar();
    switch ((E === 7 || E === 8 || E === 11 || E === 9) && ($ === nt || $ === Wt) && f(xe.INVALID_LINKED_FORMAT, o(), 0), $) {
      case "@":
        return d.next(), R = h(
          p,
          7,
          "@"
          /* TokenChars.LinkedAlias */
        ), p.inLinked = !0, R;
      case ".":
        return x(d), d.next(), h(
          p,
          8,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        return x(d), d.next(), h(
          p,
          9,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        return J(d) ? (R = h(p, 1, m(d)), p.braceNest = 0, p.inLinked = !1, R) : P(d, p) || X(d, p) ? (x(d), L(d, p)) : O(d, p) ? (x(d), h(p, 11, en(d))) : W(d, p) ? (x(d), $ === "{" ? v(d, p) || R : h(p, 10, tn(d))) : (E === 7 && f(xe.INVALID_LINKED_FORMAT, o(), 0), p.braceNest = 0, p.inLinked = !1, U(d, p));
    }
  }
  function U(d, p) {
    let E = {
      type: 13
      /* TokenTypes.EOF */
    };
    if (p.braceNest > 0)
      return v(d, p) || b(p);
    if (p.inLinked)
      return L(d, p) || b(p);
    switch (d.currentChar()) {
      case "{":
        return v(d, p) || b(p);
      case "}":
        return f(xe.UNBALANCED_CLOSING_BRACE, o(), 0), d.next(), h(
          p,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return L(d, p) || b(p);
      default: {
        if (J(d))
          return E = h(p, 1, m(d)), p.braceNest = 0, p.inLinked = !1, E;
        if (G(d))
          return h(p, 0, Be(d));
        break;
      }
    }
    return E;
  }
  function F() {
    const { currentType: d, offset: p, startLoc: E, endLoc: R } = l;
    return l.lastType = d, l.lastOffset = p, l.lastStartLoc = E, l.lastEndLoc = R, l.offset = r(), l.startLoc = o(), s.currentChar() === sn ? h(
      l,
      13
      /* TokenTypes.EOF */
    ) : U(s, l);
  }
  return {
    nextToken: F,
    currentOffset: r,
    currentPosition: o,
    context: u
  };
}
const j1 = "parser", V1 = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function W1(e, t, n) {
  switch (e) {
    case "\\\\":
      return "\\";
    case "\\'":
      return "'";
    default: {
      const s = parseInt(t || n, 16);
      return s <= 55295 || s >= 57344 ? String.fromCodePoint(s) : "�";
    }
  }
}
function K1(e = {}) {
  const t = e.location !== !1, { onError: n } = e;
  function s(g, A, T, k, ...M) {
    const P = g.currentPosition();
    if (P.offset += k, P.column += k, n) {
      const O = t ? So(T, P) : null, X = Dr(A, O, {
        domain: j1,
        args: M
      });
      n(X);
    }
  }
  function r(g, A, T) {
    const k = { type: g };
    return t && (k.start = A, k.end = A, k.loc = { start: T, end: T }), k;
  }
  function o(g, A, T, k) {
    t && (g.end = A, g.loc && (g.loc.end = T));
  }
  function i(g, A) {
    const T = g.context(), k = r(3, T.offset, T.startLoc);
    return k.value = A, o(k, g.currentOffset(), g.currentPosition()), k;
  }
  function a(g, A) {
    const T = g.context(), { lastOffset: k, lastStartLoc: M } = T, P = r(5, k, M);
    return P.index = parseInt(A, 10), g.nextToken(), o(P, g.currentOffset(), g.currentPosition()), P;
  }
  function l(g, A) {
    const T = g.context(), { lastOffset: k, lastStartLoc: M } = T, P = r(4, k, M);
    return P.key = A, g.nextToken(), o(P, g.currentOffset(), g.currentPosition()), P;
  }
  function u(g, A) {
    const T = g.context(), { lastOffset: k, lastStartLoc: M } = T, P = r(9, k, M);
    return P.value = A.replace(V1, W1), g.nextToken(), o(P, g.currentOffset(), g.currentPosition()), P;
  }
  function c(g) {
    const A = g.nextToken(), T = g.context(), { lastOffset: k, lastStartLoc: M } = T, P = r(8, k, M);
    return A.type !== 11 ? (s(g, xe.UNEXPECTED_EMPTY_LINKED_MODIFIER, T.lastStartLoc, 0), P.value = "", o(P, k, M), {
      nextConsumeToken: A,
      node: P
    }) : (A.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, T.lastStartLoc, 0, $t(A)), P.value = A.value || "", o(P, g.currentOffset(), g.currentPosition()), {
      node: P
    });
  }
  function f(g, A) {
    const T = g.context(), k = r(7, T.offset, T.startLoc);
    return k.value = A, o(k, g.currentOffset(), g.currentPosition()), k;
  }
  function h(g) {
    const A = g.context(), T = r(6, A.offset, A.startLoc);
    let k = g.nextToken();
    if (k.type === 8) {
      const M = c(g);
      T.modifier = M.node, k = M.nextConsumeToken || g.nextToken();
    }
    switch (k.type !== 9 && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(k)), k = g.nextToken(), k.type === 2 && (k = g.nextToken()), k.type) {
      case 10:
        k.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(k)), T.key = f(g, k.value || "");
        break;
      case 4:
        k.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(k)), T.key = l(g, k.value || "");
        break;
      case 5:
        k.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(k)), T.key = a(g, k.value || "");
        break;
      case 6:
        k.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(k)), T.key = u(g, k.value || "");
        break;
      default: {
        s(g, xe.UNEXPECTED_EMPTY_LINKED_KEY, A.lastStartLoc, 0);
        const M = g.context(), P = r(7, M.offset, M.startLoc);
        return P.value = "", o(P, M.offset, M.startLoc), T.key = P, o(T, M.offset, M.startLoc), {
          nextConsumeToken: k,
          node: T
        };
      }
    }
    return o(T, g.currentOffset(), g.currentPosition()), {
      node: T
    };
  }
  function b(g) {
    const A = g.context(), T = A.currentType === 1 ? g.currentOffset() : A.offset, k = A.currentType === 1 ? A.endLoc : A.startLoc, M = r(2, T, k);
    M.items = [];
    let P = null;
    do {
      const W = P || g.nextToken();
      switch (P = null, W.type) {
        case 0:
          W.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(W)), M.items.push(i(g, W.value || ""));
          break;
        case 5:
          W.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(W)), M.items.push(a(g, W.value || ""));
          break;
        case 4:
          W.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(W)), M.items.push(l(g, W.value || ""));
          break;
        case 6:
          W.value == null && s(g, xe.UNEXPECTED_LEXICAL_ANALYSIS, A.lastStartLoc, 0, $t(W)), M.items.push(u(g, W.value || ""));
          break;
        case 7: {
          const J = h(g);
          M.items.push(J.node), P = J.nextConsumeToken || null;
          break;
        }
      }
    } while (A.currentType !== 13 && A.currentType !== 1);
    const O = A.currentType === 1 ? A.lastOffset : g.currentOffset(), X = A.currentType === 1 ? A.lastEndLoc : g.currentPosition();
    return o(M, O, X), M;
  }
  function _(g, A, T, k) {
    const M = g.context();
    let P = k.items.length === 0;
    const O = r(1, A, T);
    O.cases = [], O.cases.push(k);
    do {
      const X = b(g);
      P || (P = X.items.length === 0), O.cases.push(X);
    } while (M.currentType !== 13);
    return P && s(g, xe.MUST_HAVE_MESSAGES_IN_PLURAL, T, 0), o(O, g.currentOffset(), g.currentPosition()), O;
  }
  function w(g) {
    const A = g.context(), { offset: T, startLoc: k } = A, M = b(g);
    return A.currentType === 13 ? M : _(g, T, k, M);
  }
  function x(g) {
    const A = z1(g, Ve({}, e)), T = A.context(), k = r(0, T.offset, T.startLoc);
    return t && k.loc && (k.loc.source = g), k.body = w(A), e.onCacheKey && (k.cacheKey = e.onCacheKey(g)), T.currentType !== 13 && s(A, xe.UNEXPECTED_LEXICAL_ANALYSIS, T.lastStartLoc, 0, g[T.offset] || ""), o(k, A.currentOffset(), A.currentPosition()), k;
  }
  return { parse: x };
}
function $t(e) {
  if (e.type === 13)
    return "EOF";
  const t = (e.value || "").replace(/\r?\n/gu, "\\n");
  return t.length > 10 ? t.slice(0, 9) + "…" : t;
}
function q1(e, t = {}) {
  const n = {
    ast: e,
    helpers: /* @__PURE__ */ new Set()
  };
  return { context: () => n, helper: (o) => (n.helpers.add(o), o) };
}
function ka(e, t) {
  for (let n = 0; n < e.length; n++)
    gi(e[n], t);
}
function gi(e, t) {
  switch (e.type) {
    case 1:
      ka(e.cases, t), t.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      ka(e.items, t);
      break;
    case 6: {
      gi(e.key, t), t.helper(
        "linked"
        /* HelperNameMap.LINKED */
      ), t.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      t.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      ), t.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      t.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      ), t.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function G1(e, t = {}) {
  const n = q1(e);
  n.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  ), e.body && gi(e.body, n);
  const s = n.context();
  e.helpers = Array.from(s.helpers);
}
function Y1(e) {
  const t = e.body;
  return t.type === 2 ? xa(t) : t.cases.forEach((n) => xa(n)), e;
}
function xa(e) {
  if (e.items.length === 1) {
    const t = e.items[0];
    (t.type === 3 || t.type === 9) && (e.static = t.value, delete t.value);
  } else {
    const t = [];
    for (let n = 0; n < e.items.length; n++) {
      const s = e.items[n];
      if (!(s.type === 3 || s.type === 9) || s.value == null)
        break;
      t.push(s.value);
    }
    if (t.length === e.items.length) {
      e.static = mi(t);
      for (let n = 0; n < e.items.length; n++) {
        const s = e.items[n];
        (s.type === 3 || s.type === 9) && delete s.value;
      }
    }
  }
}
function Un(e) {
  switch (e.t = e.type, e.type) {
    case 0: {
      const t = e;
      Un(t.body), t.b = t.body, delete t.body;
      break;
    }
    case 1: {
      const t = e, n = t.cases;
      for (let s = 0; s < n.length; s++)
        Un(n[s]);
      t.c = n, delete t.cases;
      break;
    }
    case 2: {
      const t = e, n = t.items;
      for (let s = 0; s < n.length; s++)
        Un(n[s]);
      t.i = n, delete t.items, t.static && (t.s = t.static, delete t.static);
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const t = e;
      t.value && (t.v = t.value, delete t.value);
      break;
    }
    case 6: {
      const t = e;
      Un(t.key), t.k = t.key, delete t.key, t.modifier && (Un(t.modifier), t.m = t.modifier, delete t.modifier);
      break;
    }
    case 5: {
      const t = e;
      t.i = t.index, delete t.index;
      break;
    }
    case 4: {
      const t = e;
      t.k = t.key, delete t.key;
      break;
    }
  }
  delete e.type;
}
function Q1(e, t) {
  const { sourceMap: n, filename: s, breakLineCode: r, needIndent: o } = t, i = t.location !== !1, a = {
    filename: s,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode: r,
    needIndent: o,
    indentLevel: 0
  };
  i && e.loc && (a.source = e.loc.source);
  const l = () => a;
  function u(x, g) {
    a.code += x;
  }
  function c(x, g = !0) {
    const A = g ? r : "";
    u(o ? A + "  ".repeat(x) : A);
  }
  function f(x = !0) {
    const g = ++a.indentLevel;
    x && c(g);
  }
  function h(x = !0) {
    const g = --a.indentLevel;
    x && c(g);
  }
  function b() {
    c(a.indentLevel);
  }
  return {
    context: l,
    push: u,
    indent: f,
    deindent: h,
    newline: b,
    helper: (x) => `_${x}`,
    needIndent: () => a.needIndent
  };
}
function X1(e, t) {
  const { helper: n } = e;
  e.push(`${n(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`), Yn(e, t.key), t.modifier ? (e.push(", "), Yn(e, t.modifier), e.push(", _type")) : e.push(", undefined, _type"), e.push(")");
}
function J1(e, t) {
  const { helper: n, needIndent: s } = e;
  e.push(`${n(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`), e.indent(s());
  const r = t.items.length;
  for (let o = 0; o < r && (Yn(e, t.items[o]), o !== r - 1); o++)
    e.push(", ");
  e.deindent(s()), e.push("])");
}
function Z1(e, t) {
  const { helper: n, needIndent: s } = e;
  if (t.cases.length > 1) {
    e.push(`${n(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`), e.indent(s());
    const r = t.cases.length;
    for (let o = 0; o < r && (Yn(e, t.cases[o]), o !== r - 1); o++)
      e.push(", ");
    e.deindent(s()), e.push("])");
  }
}
function eh(e, t) {
  t.body ? Yn(e, t.body) : e.push("null");
}
function Yn(e, t) {
  const { helper: n } = e;
  switch (t.type) {
    case 0:
      eh(e, t);
      break;
    case 1:
      Z1(e, t);
      break;
    case 2:
      J1(e, t);
      break;
    case 6:
      X1(e, t);
      break;
    case 8:
      e.push(JSON.stringify(t.value), t);
      break;
    case 7:
      e.push(JSON.stringify(t.value), t);
      break;
    case 5:
      e.push(`${n(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${n(
        "list"
        /* HelperNameMap.LIST */
      )}(${t.index}))`, t);
      break;
    case 4:
      e.push(`${n(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${n(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(t.key)}))`, t);
      break;
    case 9:
      e.push(JSON.stringify(t.value), t);
      break;
    case 3:
      e.push(JSON.stringify(t.value), t);
      break;
  }
}
const th = (e, t = {}) => {
  const n = K(t.mode) ? t.mode : "normal", s = K(t.filename) ? t.filename : "message.intl", r = !!t.sourceMap, o = t.breakLineCode != null ? t.breakLineCode : n === "arrow" ? ";" : `
`, i = t.needIndent ? t.needIndent : n !== "arrow", a = e.helpers || [], l = Q1(e, {
    mode: n,
    filename: s,
    sourceMap: r,
    breakLineCode: o,
    needIndent: i
  });
  l.push(n === "normal" ? "function __msg__ (ctx) {" : "(ctx) => {"), l.indent(i), a.length > 0 && (l.push(`const { ${mi(a.map((f) => `${f}: _${f}`), ", ")} } = ctx`), l.newline()), l.push("return "), Yn(l, e), l.deindent(i), l.push("}"), delete e.helpers;
  const { code: u, map: c } = l.context();
  return {
    ast: e,
    code: u,
    map: c ? c.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function nh(e, t = {}) {
  const n = Ve({}, t), s = !!n.jit, r = !!n.minify, o = n.optimize == null ? !0 : n.optimize, a = K1(n).parse(e);
  return s ? (o && Y1(a), r && Un(a), { ast: a, code: "" }) : (G1(a, n), th(a, n));
}
/*!
  * core-base v10.0.4
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */
function sh() {
  typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Cn().__INTLIFY_PROD_DEVTOOLS__ = !1), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Cn().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1);
}
function ro(e) {
  return (n) => rh(n, e);
}
function rh(e, t) {
  const n = t.b || t.body;
  if ((n.t || n.type) === 1) {
    const s = n, r = s.c || s.cases;
    return e.plural(r.reduce((o, i) => [
      ...o,
      Ea(e, i)
    ], []));
  } else
    return Ea(e, n);
}
function Ea(e, t) {
  const n = t.s || t.static;
  if (n != null)
    return e.type === "text" ? n : e.normalize([n]);
  {
    const s = (t.i || t.items).reduce((r, o) => [...r, Ro(e, o)], []);
    return e.normalize(s);
  }
}
function Ro(e, t) {
  const n = t.t || t.type;
  switch (n) {
    case 3: {
      const s = t;
      return s.v || s.value;
    }
    case 9: {
      const s = t;
      return s.v || s.value;
    }
    case 4: {
      const s = t;
      return e.interpolate(e.named(s.k || s.key));
    }
    case 5: {
      const s = t;
      return e.interpolate(e.list(s.i != null ? s.i : s.index));
    }
    case 6: {
      const s = t, r = s.m || s.modifier;
      return e.linked(Ro(e, s.k || s.key), r ? Ro(e, r) : void 0, e.type);
    }
    case 7: {
      const s = t;
      return s.v || s.value;
    }
    case 8: {
      const s = t;
      return s.v || s.value;
    }
    default:
      throw new Error(`unhandled node type on format message part: ${n}`);
  }
}
const oh = (e) => e;
let Ks = /* @__PURE__ */ Object.create(null);
const Qn = (e) => be(e) && (e.t === 0 || e.type === 0) && ("b" in e || "body" in e);
function ih(e, t = {}) {
  let n = !1;
  const s = t.onError || $1;
  return t.onError = (r) => {
    n = !0, s(r);
  }, { ...nh(e, t), detectError: n };
}
// @__NO_SIDE_EFFECTS__
function ah(e, t) {
  if (!__INTLIFY_DROP_MESSAGE_COMPILER__ && K(e)) {
    ge(t.warnHtmlMessage) && t.warnHtmlMessage;
    const s = (t.onCacheKey || oh)(e), r = Ks[s];
    if (r)
      return r;
    const { ast: o, detectError: i } = ih(e, {
      ...t,
      location: !1,
      jit: !0
    }), a = ro(o);
    return i ? a : Ks[s] = a;
  } else {
    const n = e.cacheKey;
    if (n) {
      const s = Ks[n];
      return s || (Ks[n] = ro(e));
    } else
      return ro(e);
  }
}
let Ss = null;
function lh(e) {
  Ss = e;
}
function ch(e, t, n) {
  Ss && Ss.emit("i18n:init", {
    timestamp: Date.now(),
    i18n: e,
    version: t,
    meta: n
  });
}
const uh = /* @__PURE__ */ fh("function:translate");
function fh(e) {
  return (t) => Ss && Ss.emit(e, t);
}
const Xt = {
  INVALID_ARGUMENT: N1,
  // 17
  INVALID_DATE_ARGUMENT: 18,
  INVALID_ISO_DATE_ARGUMENT: 19,
  NOT_SUPPORT_NON_STRING_MESSAGE: 20,
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
  NOT_SUPPORT_LOCALE_TYPE: 23
}, dh = 24;
function Jt(e) {
  return Dr(e, null, void 0);
}
function _i(e, t) {
  return t.locale != null ? Aa(t.locale) : Aa(e.locale);
}
let oo;
function Aa(e) {
  if (K(e))
    return e;
  if (Ie(e)) {
    if (e.resolvedOnce && oo != null)
      return oo;
    if (e.constructor.name === "Function") {
      const t = e();
      if (L1(t))
        throw Jt(Xt.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
      return oo = t;
    } else
      throw Jt(Xt.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
  } else
    throw Jt(Xt.NOT_SUPPORT_LOCALE_TYPE);
}
function hh(e, t, n) {
  return [.../* @__PURE__ */ new Set([
    n,
    ...Pe(t) ? t : be(t) ? Object.keys(t) : K(t) ? [t] : [n]
  ])];
}
function Kc(e, t, n) {
  const s = K(n) ? n : Rs, r = e;
  r.__localeChainCache || (r.__localeChainCache = /* @__PURE__ */ new Map());
  let o = r.__localeChainCache.get(s);
  if (!o) {
    o = [];
    let i = [n];
    for (; Pe(i); )
      i = Ca(o, i, t);
    const a = Pe(t) || !ae(t) ? t : t.default ? t.default : null;
    i = K(a) ? [a] : a, Pe(i) && Ca(o, i, !1), r.__localeChainCache.set(s, o);
  }
  return o;
}
function Ca(e, t, n) {
  let s = !0;
  for (let r = 0; r < t.length && ge(s); r++) {
    const o = t[r];
    K(o) && (s = ph(e, t[r], n));
  }
  return s;
}
function ph(e, t, n) {
  let s;
  const r = t.split("-");
  do {
    const o = r.join("-");
    s = mh(e, o, n), r.splice(-1, 1);
  } while (r.length && s === !0);
  return s;
}
function mh(e, t, n) {
  let s = !1;
  if (!e.includes(t) && (s = !0, t)) {
    s = t[t.length - 1] !== "!";
    const r = t.replace(/!/g, "");
    e.push(r), (Pe(n) || ae(n)) && n[r] && (s = n[r]);
  }
  return s;
}
const bn = [];
bn[
  0
  /* States.BEFORE_PATH */
] = {
  w: [
    0
    /* States.BEFORE_PATH */
  ],
  i: [
    3,
    0
    /* Actions.APPEND */
  ],
  "[": [
    4
    /* States.IN_SUB_PATH */
  ],
  o: [
    7
    /* States.AFTER_PATH */
  ]
};
bn[
  1
  /* States.IN_PATH */
] = {
  w: [
    1
    /* States.IN_PATH */
  ],
  ".": [
    2
    /* States.BEFORE_IDENT */
  ],
  "[": [
    4
    /* States.IN_SUB_PATH */
  ],
  o: [
    7
    /* States.AFTER_PATH */
  ]
};
bn[
  2
  /* States.BEFORE_IDENT */
] = {
  w: [
    2
    /* States.BEFORE_IDENT */
  ],
  i: [
    3,
    0
    /* Actions.APPEND */
  ],
  0: [
    3,
    0
    /* Actions.APPEND */
  ]
};
bn[
  3
  /* States.IN_IDENT */
] = {
  i: [
    3,
    0
    /* Actions.APPEND */
  ],
  0: [
    3,
    0
    /* Actions.APPEND */
  ],
  w: [
    1,
    1
    /* Actions.PUSH */
  ],
  ".": [
    2,
    1
    /* Actions.PUSH */
  ],
  "[": [
    4,
    1
    /* Actions.PUSH */
  ],
  o: [
    7,
    1
    /* Actions.PUSH */
  ]
};
bn[
  4
  /* States.IN_SUB_PATH */
] = {
  "'": [
    5,
    0
    /* Actions.APPEND */
  ],
  '"': [
    6,
    0
    /* Actions.APPEND */
  ],
  "[": [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  "]": [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  o: 8,
  l: [
    4,
    0
    /* Actions.APPEND */
  ]
};
bn[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  "'": [
    4,
    0
    /* Actions.APPEND */
  ],
  o: 8,
  l: [
    5,
    0
    /* Actions.APPEND */
  ]
};
bn[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  '"': [
    4,
    0
    /* Actions.APPEND */
  ],
  o: 8,
  l: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const gh = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function _h(e) {
  return gh.test(e);
}
function bh(e) {
  const t = e.charCodeAt(0), n = e.charCodeAt(e.length - 1);
  return t === n && (t === 34 || t === 39) ? e.slice(1, -1) : e;
}
function vh(e) {
  if (e == null)
    return "o";
  switch (e.charCodeAt(0)) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return e;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function yh(e) {
  const t = e.trim();
  return e.charAt(0) === "0" && isNaN(parseInt(e)) ? !1 : _h(t) ? bh(t) : "*" + t;
}
function wh(e) {
  const t = [];
  let n = -1, s = 0, r = 0, o, i, a, l, u, c, f;
  const h = [];
  h[
    0
    /* Actions.APPEND */
  ] = () => {
    i === void 0 ? i = a : i += a;
  }, h[
    1
    /* Actions.PUSH */
  ] = () => {
    i !== void 0 && (t.push(i), i = void 0);
  }, h[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    h[
      0
      /* Actions.APPEND */
    ](), r++;
  }, h[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (r > 0)
      r--, s = 4, h[
        0
        /* Actions.APPEND */
      ]();
    else {
      if (r = 0, i === void 0 || (i = yh(i), i === !1))
        return !1;
      h[
        1
        /* Actions.PUSH */
      ]();
    }
  };
  function b() {
    const _ = e[n + 1];
    if (s === 5 && _ === "'" || s === 6 && _ === '"')
      return n++, a = "\\" + _, h[
        0
        /* Actions.APPEND */
      ](), !0;
  }
  for (; s !== null; )
    if (n++, o = e[n], !(o === "\\" && b())) {
      if (l = vh(o), f = bn[s], u = f[l] || f.l || 8, u === 8 || (s = u[0], u[1] !== void 0 && (c = h[u[1]], c && (a = o, c() === !1))))
        return;
      if (s === 7)
        return t;
    }
}
const Ta = /* @__PURE__ */ new Map();
function kh(e, t) {
  return be(e) ? e[t] : null;
}
function xh(e, t) {
  if (!be(e))
    return null;
  let n = Ta.get(t);
  if (n || (n = wh(t), n && Ta.set(t, n)), !n)
    return null;
  const s = n.length;
  let r = e, o = 0;
  for (; o < s; ) {
    const i = r[n[o]];
    if (i === void 0 || Ie(r))
      return null;
    r = i, o++;
  }
  return r;
}
const Eh = "10.0.4", Fr = -1, Rs = "en-US", Sa = "", Ra = (e) => `${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;
function Ah() {
  return {
    upper: (e, t) => t === "text" && K(e) ? e.toUpperCase() : t === "vnode" && be(e) && "__v_isVNode" in e ? e.children.toUpperCase() : e,
    lower: (e, t) => t === "text" && K(e) ? e.toLowerCase() : t === "vnode" && be(e) && "__v_isVNode" in e ? e.children.toLowerCase() : e,
    capitalize: (e, t) => t === "text" && K(e) ? Ra(e) : t === "vnode" && be(e) && "__v_isVNode" in e ? Ra(e.children) : e
  };
}
let qc;
function Ch(e) {
  qc = e;
}
let Gc;
function Th(e) {
  Gc = e;
}
let Yc;
function Sh(e) {
  Yc = e;
}
let Qc = null;
const Rh = /* @__NO_SIDE_EFFECTS__ */ (e) => {
  Qc = e;
}, Lh = /* @__NO_SIDE_EFFECTS__ */ () => Qc;
let Xc = null;
const La = (e) => {
  Xc = e;
}, Ih = () => Xc;
let Ia = 0;
function Mh(e = {}) {
  const t = Ie(e.onWarn) ? e.onWarn : M1, n = K(e.version) ? e.version : Eh, s = K(e.locale) || Ie(e.locale) ? e.locale : Rs, r = Ie(s) ? Rs : s, o = Pe(e.fallbackLocale) || ae(e.fallbackLocale) || K(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : r, i = ae(e.messages) ? e.messages : { [r]: {} }, a = ae(e.datetimeFormats) ? e.datetimeFormats : { [r]: {} }, l = ae(e.numberFormats) ? e.numberFormats : { [r]: {} }, u = Ve({}, e.modifiers || {}, Ah()), c = e.pluralRules || {}, f = Ie(e.missing) ? e.missing : null, h = ge(e.missingWarn) || Gn(e.missingWarn) ? e.missingWarn : !0, b = ge(e.fallbackWarn) || Gn(e.fallbackWarn) ? e.fallbackWarn : !0, _ = !!e.fallbackFormat, w = !!e.unresolving, x = Ie(e.postTranslation) ? e.postTranslation : null, g = ae(e.processor) ? e.processor : null, A = ge(e.warnHtmlMessage) ? e.warnHtmlMessage : !0, T = !!e.escapeParameter, k = Ie(e.messageCompiler) ? e.messageCompiler : qc, M = Ie(e.messageResolver) ? e.messageResolver : Gc || kh, P = Ie(e.localeFallbacker) ? e.localeFallbacker : Yc || hh, O = be(e.fallbackContext) ? e.fallbackContext : void 0, X = e, W = be(X.__datetimeFormatters) ? X.__datetimeFormatters : /* @__PURE__ */ new Map(), J = be(X.__numberFormatters) ? X.__numberFormatters : /* @__PURE__ */ new Map(), G = be(X.__meta) ? X.__meta : {};
  Ia++;
  const D = {
    version: n,
    cid: Ia,
    locale: s,
    fallbackLocale: o,
    messages: i,
    modifiers: u,
    pluralRules: c,
    missing: f,
    missingWarn: h,
    fallbackWarn: b,
    fallbackFormat: _,
    unresolving: w,
    postTranslation: x,
    processor: g,
    warnHtmlMessage: A,
    escapeParameter: T,
    messageCompiler: k,
    messageResolver: M,
    localeFallbacker: P,
    fallbackContext: O,
    onWarn: t,
    __meta: G
  };
  return D.datetimeFormats = a, D.numberFormats = l, D.__datetimeFormatters = W, D.__numberFormatters = J, __INTLIFY_PROD_DEVTOOLS__ && ch(D, n, G), D;
}
function bi(e, t, n, s, r) {
  const { missing: o, onWarn: i } = e;
  if (o !== null) {
    const a = o(e, n, t, r);
    return K(a) ? a : t;
  } else
    return t;
}
function as(e, t, n) {
  const s = e;
  s.__localeChainCache = /* @__PURE__ */ new Map(), e.localeFallbacker(e, n, t);
}
function Oh(e, t) {
  return e === t ? !1 : e.split("-")[0] === t.split("-")[0];
}
function Nh(e, t) {
  const n = t.indexOf(e);
  if (n === -1)
    return !1;
  for (let s = n + 1; s < t.length; s++)
    if (Oh(e, t[s]))
      return !0;
  return !1;
}
function Ma(e, ...t) {
  const { datetimeFormats: n, unresolving: s, fallbackLocale: r, onWarn: o, localeFallbacker: i } = e, { __datetimeFormatters: a } = e, [l, u, c, f] = Lo(...t), h = ge(c.missingWarn) ? c.missingWarn : e.missingWarn;
  ge(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn;
  const b = !!c.part, _ = _i(e, c), w = i(
    e,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    r,
    _
  );
  if (!K(l) || l === "")
    return new Intl.DateTimeFormat(_, f).format(u);
  let x = {}, g, A = null;
  const T = "datetime format";
  for (let P = 0; P < w.length && (g = w[P], x = n[g] || {}, A = x[l], !ae(A)); P++)
    bi(e, l, g, h, T);
  if (!ae(A) || !K(g))
    return s ? Fr : l;
  let k = `${g}__${l}`;
  Pr(f) || (k = `${k}__${JSON.stringify(f)}`);
  let M = a.get(k);
  return M || (M = new Intl.DateTimeFormat(g, Ve({}, A, f)), a.set(k, M)), b ? M.formatToParts(u) : M.format(u);
}
const Jc = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function Lo(...e) {
  const [t, n, s, r] = e, o = {};
  let i = {}, a;
  if (K(t)) {
    const l = t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!l)
      throw Jt(Xt.INVALID_ISO_DATE_ARGUMENT);
    const u = l[3] ? l[3].trim().startsWith("T") ? `${l[1].trim()}${l[3].trim()}` : `${l[1].trim()}T${l[3].trim()}` : l[1].trim();
    a = new Date(u);
    try {
      a.toISOString();
    } catch {
      throw Jt(Xt.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (S1(t)) {
    if (isNaN(t.getTime()))
      throw Jt(Xt.INVALID_DATE_ARGUMENT);
    a = t;
  } else if (ze(t))
    a = t;
  else
    throw Jt(Xt.INVALID_ARGUMENT);
  return K(n) ? o.key = n : ae(n) && Object.keys(n).forEach((l) => {
    Jc.includes(l) ? i[l] = n[l] : o[l] = n[l];
  }), K(s) ? o.locale = s : ae(s) && (i = s), ae(r) && (i = r), [o.key || "", a, o, i];
}
function Oa(e, t, n) {
  const s = e;
  for (const r in n) {
    const o = `${t}__${r}`;
    s.__datetimeFormatters.has(o) && s.__datetimeFormatters.delete(o);
  }
}
function Na(e, ...t) {
  const { numberFormats: n, unresolving: s, fallbackLocale: r, onWarn: o, localeFallbacker: i } = e, { __numberFormatters: a } = e, [l, u, c, f] = Io(...t), h = ge(c.missingWarn) ? c.missingWarn : e.missingWarn;
  ge(c.fallbackWarn) ? c.fallbackWarn : e.fallbackWarn;
  const b = !!c.part, _ = _i(e, c), w = i(
    e,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    r,
    _
  );
  if (!K(l) || l === "")
    return new Intl.NumberFormat(_, f).format(u);
  let x = {}, g, A = null;
  const T = "number format";
  for (let P = 0; P < w.length && (g = w[P], x = n[g] || {}, A = x[l], !ae(A)); P++)
    bi(e, l, g, h, T);
  if (!ae(A) || !K(g))
    return s ? Fr : l;
  let k = `${g}__${l}`;
  Pr(f) || (k = `${k}__${JSON.stringify(f)}`);
  let M = a.get(k);
  return M || (M = new Intl.NumberFormat(g, Ve({}, A, f)), a.set(k, M)), b ? M.formatToParts(u) : M.format(u);
}
const Zc = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function Io(...e) {
  const [t, n, s, r] = e, o = {};
  let i = {};
  if (!ze(t))
    throw Jt(Xt.INVALID_ARGUMENT);
  const a = t;
  return K(n) ? o.key = n : ae(n) && Object.keys(n).forEach((l) => {
    Zc.includes(l) ? i[l] = n[l] : o[l] = n[l];
  }), K(s) ? o.locale = s : ae(s) && (i = s), ae(r) && (i = r), [o.key || "", a, o, i];
}
function $a(e, t, n) {
  const s = e;
  for (const r in n) {
    const o = `${t}__${r}`;
    s.__numberFormatters.has(o) && s.__numberFormatters.delete(o);
  }
}
const $h = (e) => e, Ph = (e) => "", Dh = "text", Fh = (e) => e.length === 0 ? "" : mi(e), Bh = I1;
function Pa(e, t) {
  return e = Math.abs(e), t === 2 ? e ? e > 1 ? 1 : 0 : 1 : e ? Math.min(e, 2) : 0;
}
function Uh(e) {
  const t = ze(e.pluralIndex) ? e.pluralIndex : -1;
  return e.named && (ze(e.named.count) || ze(e.named.n)) ? ze(e.named.count) ? e.named.count : ze(e.named.n) ? e.named.n : t : t;
}
function Hh(e, t) {
  t.count || (t.count = e), t.n || (t.n = e);
}
function zh(e = {}) {
  const t = e.locale, n = Uh(e), s = be(e.pluralRules) && K(t) && Ie(e.pluralRules[t]) ? e.pluralRules[t] : Pa, r = be(e.pluralRules) && K(t) && Ie(e.pluralRules[t]) ? Pa : void 0, o = (g) => g[s(n, g.length, r)], i = e.list || [], a = (g) => i[g], l = e.named || {};
  ze(e.pluralIndex) && Hh(n, l);
  const u = (g) => l[g];
  function c(g, A) {
    const T = Ie(e.messages) ? e.messages(g, !!A) : be(e.messages) ? e.messages[g] : !1;
    return T || (e.parent ? e.parent.message(g) : Ph);
  }
  const f = (g) => e.modifiers ? e.modifiers[g] : $h, h = ae(e.processor) && Ie(e.processor.normalize) ? e.processor.normalize : Fh, b = ae(e.processor) && Ie(e.processor.interpolate) ? e.processor.interpolate : Bh, _ = ae(e.processor) && K(e.processor.type) ? e.processor.type : Dh, x = {
    list: a,
    named: u,
    plural: o,
    linked: (g, ...A) => {
      const [T, k] = A;
      let M = "text", P = "";
      A.length === 1 ? be(T) ? (P = T.modifier || P, M = T.type || M) : K(T) && (P = T || P) : A.length === 2 && (K(T) && (P = T || P), K(k) && (M = k || M));
      const O = c(g, !0)(x), X = (
        // The message in vnode resolved with linked are returned as an array by processor.nomalize
        M === "vnode" && Pe(O) && P ? O[0] : O
      );
      return P ? f(P)(X, M) : X;
    },
    message: c,
    type: _,
    interpolate: b,
    normalize: h,
    values: Ve({}, i, l)
  };
  return x;
}
const Da = () => "", Et = (e) => Ie(e);
function Fa(e, ...t) {
  const { fallbackFormat: n, postTranslation: s, unresolving: r, messageCompiler: o, fallbackLocale: i, messages: a } = e, [l, u] = Mo(...t), c = ge(u.missingWarn) ? u.missingWarn : e.missingWarn, f = ge(u.fallbackWarn) ? u.fallbackWarn : e.fallbackWarn, h = ge(u.escapeParameter) ? u.escapeParameter : e.escapeParameter, b = !!u.resolvedMessage, _ = K(u.default) || ge(u.default) ? ge(u.default) ? o ? l : () => l : u.default : n ? o ? l : () => l : null, w = n || _ != null && (K(_) || Ie(_)), x = _i(e, u);
  h && jh(u);
  let [g, A, T] = b ? [
    l,
    x,
    a[x] || {}
  ] : eu(e, l, x, i, f, c), k = g, M = l;
  if (!b && !(K(k) || Qn(k) || Et(k)) && w && (k = _, M = k), !b && (!(K(k) || Qn(k) || Et(k)) || !K(A)))
    return r ? Fr : l;
  let P = !1;
  const O = () => {
    P = !0;
  }, X = Et(k) ? k : tu(e, l, A, k, M, O);
  if (P)
    return k;
  const W = Kh(e, A, T, u), J = zh(W), G = Vh(e, X, J), D = s ? s(G, l) : G;
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const te = {
      timestamp: Date.now(),
      key: K(l) ? l : Et(k) ? k.key : "",
      locale: A || (Et(k) ? k.locale : ""),
      format: K(k) ? k : Et(k) ? k.source : "",
      message: D
    };
    te.meta = Ve({}, e.__meta, /* @__PURE__ */ Lh() || {}), uh(te);
  }
  return D;
}
function jh(e) {
  Pe(e.list) ? e.list = e.list.map((t) => K(t) ? ya(t) : t) : be(e.named) && Object.keys(e.named).forEach((t) => {
    K(e.named[t]) && (e.named[t] = ya(e.named[t]));
  });
}
function eu(e, t, n, s, r, o) {
  const { messages: i, onWarn: a, messageResolver: l, localeFallbacker: u } = e, c = u(e, s, n);
  let f = {}, h, b = null;
  const _ = "translate";
  for (let w = 0; w < c.length && (h = c[w], f = i[h] || {}, (b = l(f, t)) === null && (b = f[t]), !(K(b) || Qn(b) || Et(b))); w++)
    if (!Nh(h, c)) {
      const x = bi(
        e,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        t,
        h,
        o,
        _
      );
      x !== t && (b = x);
    }
  return [b, h, f];
}
function tu(e, t, n, s, r, o) {
  const { messageCompiler: i, warnHtmlMessage: a } = e;
  if (Et(s)) {
    const u = s;
    return u.locale = u.locale || n, u.key = u.key || t, u;
  }
  if (i == null) {
    const u = () => s;
    return u.locale = n, u.key = t, u;
  }
  const l = i(s, Wh(e, n, r, s, a, o));
  return l.locale = n, l.key = t, l.source = s, l;
}
function Vh(e, t, n) {
  return t(n);
}
function Mo(...e) {
  const [t, n, s] = e, r = {};
  if (!K(t) && !ze(t) && !Et(t) && !Qn(t))
    throw Jt(Xt.INVALID_ARGUMENT);
  const o = ze(t) ? String(t) : (Et(t), t);
  return ze(n) ? r.plural = n : K(n) ? r.default = n : ae(n) && !Pr(n) ? r.named = n : Pe(n) && (r.list = n), ze(s) ? r.plural = s : K(s) ? r.default = s : ae(s) && Ve(r, s), [o, r];
}
function Wh(e, t, n, s, r, o) {
  return {
    locale: t,
    key: n,
    warnHtmlMessage: r,
    onError: (i) => {
      throw o && o(i), i;
    },
    onCacheKey: (i) => C1(t, n, i)
  };
}
function Kh(e, t, n, s) {
  const { modifiers: r, pluralRules: o, messageResolver: i, fallbackLocale: a, fallbackWarn: l, missingWarn: u, fallbackContext: c } = e, h = {
    locale: t,
    modifiers: r,
    pluralRules: o,
    messages: (b, _) => {
      let w = i(n, b);
      if (w == null && (c || _)) {
        const [, , x] = eu(
          c || e,
          // NOTE: if has fallbackContext, fallback to root, else if use linked, fallback to local context
          b,
          t,
          a,
          l,
          u
        );
        w = i(x, b);
      }
      if (K(w) || Qn(w)) {
        let x = !1;
        const A = tu(e, b, t, w, b, () => {
          x = !0;
        });
        return x ? Da : A;
      } else return Et(w) ? w : Da;
    }
  };
  return e.processor && (h.processor = e.processor), s.list && (h.list = s.list), s.named && (h.named = s.named), ze(s.plural) && (h.pluralIndex = s.plural), h;
}
sh();
/*!
  * vue-i18n v10.0.4
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */
const qh = "10.0.4";
function Gh() {
  typeof __VUE_I18N_FULL_INSTALL__ != "boolean" && (Cn().__VUE_I18N_FULL_INSTALL__ = !0), typeof __VUE_I18N_LEGACY_API__ != "boolean" && (Cn().__VUE_I18N_LEGACY_API__ = !0), typeof __INTLIFY_DROP_MESSAGE_COMPILER__ != "boolean" && (Cn().__INTLIFY_DROP_MESSAGE_COMPILER__ = !1), typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Cn().__INTLIFY_PROD_DEVTOOLS__ = !1);
}
const it = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: dh,
  // 24
  // legacy module errors
  INVALID_ARGUMENT: 25,
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: 26,
  NOT_INSTALLED: 27,
  // directive module errors
  REQUIRED_VALUE: 28,
  INVALID_VALUE: 29,
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: 30,
  NOT_INSTALLED_WITH_PROVIDE: 31,
  // unexpected error
  UNEXPECTED_ERROR: 32,
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: 33,
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: 34
};
function ht(e, ...t) {
  return Dr(e, null, void 0);
}
const Oo = /* @__PURE__ */ _n("__translateVNode"), No = /* @__PURE__ */ _n("__datetimeParts"), $o = /* @__PURE__ */ _n("__numberParts"), nu = _n("__setPluralRules"), su = /* @__PURE__ */ _n("__injectWithOption"), Po = /* @__PURE__ */ _n("__dispose");
function Ls(e) {
  if (!be(e))
    return e;
  for (const t in e)
    if (hr(e, t))
      if (!t.includes("."))
        be(e[t]) && Ls(e[t]);
      else {
        const n = t.split("."), s = n.length - 1;
        let r = e, o = !1;
        for (let i = 0; i < s; i++) {
          if (n[i] in r || (r[n[i]] = {}), !be(r[n[i]])) {
            o = !0;
            break;
          }
          r = r[n[i]];
        }
        o || (r[n[s]] = e[t], delete e[t]), be(r[n[s]]) && Ls(r[n[s]]);
      }
  return e;
}
function vi(e, t) {
  const { messages: n, __i18n: s, messageResolver: r, flatJson: o } = t, i = ae(n) ? n : Pe(s) ? {} : { [e]: {} };
  if (Pe(s) && s.forEach((a) => {
    if ("locale" in a && "resource" in a) {
      const { locale: l, resource: u } = a;
      l ? (i[l] = i[l] || {}, Xs(u, i[l])) : Xs(u, i);
    } else
      K(a) && Xs(JSON.parse(a), i);
  }), r == null && o)
    for (const a in i)
      hr(i, a) && Ls(i[a]);
  return i;
}
function ru(e) {
  return e.type;
}
function ou(e, t, n) {
  let s = be(t.messages) ? t.messages : {};
  "__i18nGlobal" in n && (s = vi(e.locale.value, {
    messages: s,
    __i18n: n.__i18nGlobal
  }));
  const r = Object.keys(s);
  r.length && r.forEach((o) => {
    e.mergeLocaleMessage(o, s[o]);
  });
  {
    if (be(t.datetimeFormats)) {
      const o = Object.keys(t.datetimeFormats);
      o.length && o.forEach((i) => {
        e.mergeDateTimeFormat(i, t.datetimeFormats[i]);
      });
    }
    if (be(t.numberFormats)) {
      const o = Object.keys(t.numberFormats);
      o.length && o.forEach((i) => {
        e.mergeNumberFormat(i, t.numberFormats[i]);
      });
    }
  }
}
function Ba(e) {
  return q(Ns, null, e, 0);
}
const Ua = "__INTLIFY_META__", Ha = () => [], Yh = () => !1;
let za = 0;
function ja(e) {
  return (t, n, s, r) => e(n, s, jt() || void 0, r);
}
const Qh = /* @__NO_SIDE_EFFECTS__ */ () => {
  const e = jt();
  let t = null;
  return e && (t = ru(e)[Ua]) ? { [Ua]: t } : null;
};
function yi(e = {}) {
  const { __root: t, __injectWithOption: n } = e, s = t === void 0, r = e.flatJson, o = dr ? V : Gl;
  let i = ge(e.inheritLocale) ? e.inheritLocale : !0;
  const a = o(
    // prettier-ignore
    t && i ? t.locale.value : K(e.locale) ? e.locale : Rs
  ), l = o(
    // prettier-ignore
    t && i ? t.fallbackLocale.value : K(e.fallbackLocale) || Pe(e.fallbackLocale) || ae(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : a.value
  ), u = o(vi(a.value, e)), c = o(ae(e.datetimeFormats) ? e.datetimeFormats : { [a.value]: {} }), f = o(ae(e.numberFormats) ? e.numberFormats : { [a.value]: {} });
  let h = t ? t.missingWarn : ge(e.missingWarn) || Gn(e.missingWarn) ? e.missingWarn : !0, b = t ? t.fallbackWarn : ge(e.fallbackWarn) || Gn(e.fallbackWarn) ? e.fallbackWarn : !0, _ = t ? t.fallbackRoot : ge(e.fallbackRoot) ? e.fallbackRoot : !0, w = !!e.fallbackFormat, x = Ie(e.missing) ? e.missing : null, g = Ie(e.missing) ? ja(e.missing) : null, A = Ie(e.postTranslation) ? e.postTranslation : null, T = t ? t.warnHtmlMessage : ge(e.warnHtmlMessage) ? e.warnHtmlMessage : !0, k = !!e.escapeParameter;
  const M = t ? t.modifiers : ae(e.modifiers) ? e.modifiers : {};
  let P = e.pluralRules || t && t.pluralRules, O;
  O = (() => {
    s && La(null);
    const y = {
      version: qh,
      locale: a.value,
      fallbackLocale: l.value,
      messages: u.value,
      modifiers: M,
      pluralRules: P,
      missing: g === null ? void 0 : g,
      missingWarn: h,
      fallbackWarn: b,
      fallbackFormat: w,
      unresolving: !0,
      postTranslation: A === null ? void 0 : A,
      warnHtmlMessage: T,
      escapeParameter: k,
      messageResolver: e.messageResolver,
      messageCompiler: e.messageCompiler,
      __meta: { framework: "vue" }
    };
    y.datetimeFormats = c.value, y.numberFormats = f.value, y.__datetimeFormatters = ae(O) ? O.__datetimeFormatters : void 0, y.__numberFormatters = ae(O) ? O.__numberFormatters : void 0;
    const S = Mh(y);
    return s && La(S), S;
  })(), as(O, a.value, l.value);
  function W() {
    return [
      a.value,
      l.value,
      u.value,
      c.value,
      f.value
    ];
  }
  const J = ke({
    get: () => a.value,
    set: (y) => {
      a.value = y, O.locale = a.value;
    }
  }), G = ke({
    get: () => l.value,
    set: (y) => {
      l.value = y, O.fallbackLocale = l.value, as(O, a.value, y);
    }
  }), D = ke(() => u.value), te = /* @__PURE__ */ ke(() => c.value), he = /* @__PURE__ */ ke(() => f.value);
  function Ne() {
    return Ie(A) ? A : null;
  }
  function ue(y) {
    A = y, O.postTranslation = y;
  }
  function le() {
    return x;
  }
  function ce(y) {
    y !== null && (g = ja(y)), x = y, O.missing = g;
  }
  const ne = (y, S, j, Y, fe, de) => {
    W();
    let $e;
    try {
      __INTLIFY_PROD_DEVTOOLS__, s || (O.fallbackContext = t ? Ih() : void 0), $e = y(O);
    } finally {
      __INTLIFY_PROD_DEVTOOLS__, s || (O.fallbackContext = void 0);
    }
    if (j !== "translate exists" && // for not `te` (e.g `t`)
    ze($e) && $e === Fr || j === "translate exists" && !$e) {
      const [Ue, Q] = S();
      return t && _ ? Y(t) : fe(Ue);
    } else {
      if (de($e))
        return $e;
      throw ht(it.UNEXPECTED_RETURN_TYPE);
    }
  };
  function _e(...y) {
    return ne((S) => Reflect.apply(Fa, null, [S, ...y]), () => Mo(...y), "translate", (S) => Reflect.apply(S.t, S, [...y]), (S) => S, (S) => K(S));
  }
  function pe(...y) {
    const [S, j, Y] = y;
    if (Y && !be(Y))
      throw ht(it.INVALID_ARGUMENT);
    return _e(S, j, Ve({ resolvedMessage: !0 }, Y || {}));
  }
  function Be(...y) {
    return ne((S) => Reflect.apply(Ma, null, [S, ...y]), () => Lo(...y), "datetime format", (S) => Reflect.apply(S.d, S, [...y]), () => Sa, (S) => K(S));
  }
  function ve(...y) {
    return ne((S) => Reflect.apply(Na, null, [S, ...y]), () => Io(...y), "number format", (S) => Reflect.apply(S.n, S, [...y]), () => Sa, (S) => K(S));
  }
  function se(y) {
    return y.map((S) => K(S) || ze(S) || ge(S) ? Ba(String(S)) : S);
  }
  const Xe = {
    normalize: se,
    interpolate: (y) => y,
    type: "vnode"
  };
  function pt(...y) {
    return ne((S) => {
      let j;
      const Y = S;
      try {
        Y.processor = Xe, j = Reflect.apply(Fa, null, [Y, ...y]);
      } finally {
        Y.processor = null;
      }
      return j;
    }, () => Mo(...y), "translate", (S) => S[Oo](...y), (S) => [Ba(S)], (S) => Pe(S));
  }
  function at(...y) {
    return ne((S) => Reflect.apply(Na, null, [S, ...y]), () => Io(...y), "number format", (S) => S[$o](...y), Ha, (S) => K(S) || Pe(S));
  }
  function wt(...y) {
    return ne((S) => Reflect.apply(Ma, null, [S, ...y]), () => Lo(...y), "datetime format", (S) => S[No](...y), Ha, (S) => K(S) || Pe(S));
  }
  function kt(y) {
    P = y, O.pluralRules = P;
  }
  function en(y, S) {
    return ne(() => {
      if (!y)
        return !1;
      const j = K(S) ? S : a.value, Y = v(j), fe = O.messageResolver(Y, y);
      return Qn(fe) || Et(fe) || K(fe);
    }, () => [y], "translate exists", (j) => Reflect.apply(j.te, j, [y, S]), Yh, (j) => ge(j));
  }
  function tn(y) {
    let S = null;
    const j = Kc(O, l.value, a.value);
    for (let Y = 0; Y < j.length; Y++) {
      const fe = u.value[j[Y]] || {}, de = O.messageResolver(fe, y);
      if (de != null) {
        S = de;
        break;
      }
    }
    return S;
  }
  function m(y) {
    const S = tn(y);
    return S ?? (t ? t.tm(y) || {} : {});
  }
  function v(y) {
    return u.value[y] || {};
  }
  function L(y, S) {
    if (r) {
      const j = { [y]: S };
      for (const Y in j)
        hr(j, Y) && Ls(j[Y]);
      S = j[y];
    }
    u.value[y] = S, O.messages = u.value;
  }
  function U(y, S) {
    u.value[y] = u.value[y] || {};
    const j = { [y]: S };
    if (r)
      for (const Y in j)
        hr(j, Y) && Ls(j[Y]);
    S = j[y], Xs(S, u.value[y]), O.messages = u.value;
  }
  function F(y) {
    return c.value[y] || {};
  }
  function d(y, S) {
    c.value[y] = S, O.datetimeFormats = c.value, Oa(O, y, S);
  }
  function p(y, S) {
    c.value[y] = Ve(c.value[y] || {}, S), O.datetimeFormats = c.value, Oa(O, y, S);
  }
  function E(y) {
    return f.value[y] || {};
  }
  function R(y, S) {
    f.value[y] = S, O.numberFormats = f.value, $a(O, y, S);
  }
  function $(y, S) {
    f.value[y] = Ve(f.value[y] || {}, S), O.numberFormats = f.value, $a(O, y, S);
  }
  za++, t && dr && (bt(t.locale, (y) => {
    i && (a.value = y, O.locale = y, as(O, a.value, l.value));
  }), bt(t.fallbackLocale, (y) => {
    i && (l.value = y, O.fallbackLocale = y, as(O, a.value, l.value));
  }));
  const z = {
    id: za,
    locale: J,
    fallbackLocale: G,
    get inheritLocale() {
      return i;
    },
    set inheritLocale(y) {
      i = y, y && t && (a.value = t.locale.value, l.value = t.fallbackLocale.value, as(O, a.value, l.value));
    },
    get availableLocales() {
      return Object.keys(u.value).sort();
    },
    messages: D,
    get modifiers() {
      return M;
    },
    get pluralRules() {
      return P || {};
    },
    get isGlobal() {
      return s;
    },
    get missingWarn() {
      return h;
    },
    set missingWarn(y) {
      h = y, O.missingWarn = h;
    },
    get fallbackWarn() {
      return b;
    },
    set fallbackWarn(y) {
      b = y, O.fallbackWarn = b;
    },
    get fallbackRoot() {
      return _;
    },
    set fallbackRoot(y) {
      _ = y;
    },
    get fallbackFormat() {
      return w;
    },
    set fallbackFormat(y) {
      w = y, O.fallbackFormat = w;
    },
    get warnHtmlMessage() {
      return T;
    },
    set warnHtmlMessage(y) {
      T = y, O.warnHtmlMessage = y;
    },
    get escapeParameter() {
      return k;
    },
    set escapeParameter(y) {
      k = y, O.escapeParameter = y;
    },
    t: _e,
    getLocaleMessage: v,
    setLocaleMessage: L,
    mergeLocaleMessage: U,
    getPostTranslationHandler: Ne,
    setPostTranslationHandler: ue,
    getMissingHandler: le,
    setMissingHandler: ce,
    [nu]: kt
  };
  return z.datetimeFormats = te, z.numberFormats = he, z.rt = pe, z.te = en, z.tm = m, z.d = Be, z.n = ve, z.getDateTimeFormat = F, z.setDateTimeFormat = d, z.mergeDateTimeFormat = p, z.getNumberFormat = E, z.setNumberFormat = R, z.mergeNumberFormat = $, z[su] = n, z[Oo] = pt, z[No] = wt, z[$o] = at, z;
}
function Xh(e) {
  const t = K(e.locale) ? e.locale : Rs, n = K(e.fallbackLocale) || Pe(e.fallbackLocale) || ae(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : t, s = Ie(e.missing) ? e.missing : void 0, r = ge(e.silentTranslationWarn) || Gn(e.silentTranslationWarn) ? !e.silentTranslationWarn : !0, o = ge(e.silentFallbackWarn) || Gn(e.silentFallbackWarn) ? !e.silentFallbackWarn : !0, i = ge(e.fallbackRoot) ? e.fallbackRoot : !0, a = !!e.formatFallbackMessages, l = ae(e.modifiers) ? e.modifiers : {}, u = e.pluralizationRules, c = Ie(e.postTranslation) ? e.postTranslation : void 0, f = K(e.warnHtmlInMessage) ? e.warnHtmlInMessage !== "off" : !0, h = !!e.escapeParameterHtml, b = ge(e.sync) ? e.sync : !0;
  let _ = e.messages;
  if (ae(e.sharedMessages)) {
    const M = e.sharedMessages;
    _ = Object.keys(M).reduce((O, X) => {
      const W = O[X] || (O[X] = {});
      return Ve(W, M[X]), O;
    }, _ || {});
  }
  const { __i18n: w, __root: x, __injectWithOption: g } = e, A = e.datetimeFormats, T = e.numberFormats, k = e.flatJson;
  return {
    locale: t,
    fallbackLocale: n,
    messages: _,
    flatJson: k,
    datetimeFormats: A,
    numberFormats: T,
    missing: s,
    missingWarn: r,
    fallbackWarn: o,
    fallbackRoot: i,
    fallbackFormat: a,
    modifiers: l,
    pluralRules: u,
    postTranslation: c,
    warnHtmlMessage: f,
    escapeParameter: h,
    messageResolver: e.messageResolver,
    inheritLocale: b,
    __i18n: w,
    __root: x,
    __injectWithOption: g
  };
}
function Do(e = {}) {
  const t = yi(Xh(e)), { __extender: n } = e, s = {
    // id
    id: t.id,
    // locale
    get locale() {
      return t.locale.value;
    },
    set locale(r) {
      t.locale.value = r;
    },
    // fallbackLocale
    get fallbackLocale() {
      return t.fallbackLocale.value;
    },
    set fallbackLocale(r) {
      t.fallbackLocale.value = r;
    },
    // messages
    get messages() {
      return t.messages.value;
    },
    // datetimeFormats
    get datetimeFormats() {
      return t.datetimeFormats.value;
    },
    // numberFormats
    get numberFormats() {
      return t.numberFormats.value;
    },
    // availableLocales
    get availableLocales() {
      return t.availableLocales;
    },
    // missing
    get missing() {
      return t.getMissingHandler();
    },
    set missing(r) {
      t.setMissingHandler(r);
    },
    // silentTranslationWarn
    get silentTranslationWarn() {
      return ge(t.missingWarn) ? !t.missingWarn : t.missingWarn;
    },
    set silentTranslationWarn(r) {
      t.missingWarn = ge(r) ? !r : r;
    },
    // silentFallbackWarn
    get silentFallbackWarn() {
      return ge(t.fallbackWarn) ? !t.fallbackWarn : t.fallbackWarn;
    },
    set silentFallbackWarn(r) {
      t.fallbackWarn = ge(r) ? !r : r;
    },
    // modifiers
    get modifiers() {
      return t.modifiers;
    },
    // formatFallbackMessages
    get formatFallbackMessages() {
      return t.fallbackFormat;
    },
    set formatFallbackMessages(r) {
      t.fallbackFormat = r;
    },
    // postTranslation
    get postTranslation() {
      return t.getPostTranslationHandler();
    },
    set postTranslation(r) {
      t.setPostTranslationHandler(r);
    },
    // sync
    get sync() {
      return t.inheritLocale;
    },
    set sync(r) {
      t.inheritLocale = r;
    },
    // warnInHtmlMessage
    get warnHtmlInMessage() {
      return t.warnHtmlMessage ? "warn" : "off";
    },
    set warnHtmlInMessage(r) {
      t.warnHtmlMessage = r !== "off";
    },
    // escapeParameterHtml
    get escapeParameterHtml() {
      return t.escapeParameter;
    },
    set escapeParameterHtml(r) {
      t.escapeParameter = r;
    },
    // pluralizationRules
    get pluralizationRules() {
      return t.pluralRules || {};
    },
    // for internal
    __composer: t,
    // t
    t(...r) {
      return Reflect.apply(t.t, t, [...r]);
    },
    // rt
    rt(...r) {
      return Reflect.apply(t.rt, t, [...r]);
    },
    // tc
    tc(...r) {
      const [o, i, a] = r, l = { plural: 1 };
      let u = null, c = null;
      if (!K(o))
        throw ht(it.INVALID_ARGUMENT);
      const f = o;
      return K(i) ? l.locale = i : ze(i) ? l.plural = i : Pe(i) ? u = i : ae(i) && (c = i), K(a) ? l.locale = a : Pe(a) ? u = a : ae(a) && (c = a), Reflect.apply(t.t, t, [
        f,
        u || c || {},
        l
      ]);
    },
    // te
    te(r, o) {
      return t.te(r, o);
    },
    // tm
    tm(r) {
      return t.tm(r);
    },
    // getLocaleMessage
    getLocaleMessage(r) {
      return t.getLocaleMessage(r);
    },
    // setLocaleMessage
    setLocaleMessage(r, o) {
      t.setLocaleMessage(r, o);
    },
    // mergeLocaleMessage
    mergeLocaleMessage(r, o) {
      t.mergeLocaleMessage(r, o);
    },
    // d
    d(...r) {
      return Reflect.apply(t.d, t, [...r]);
    },
    // getDateTimeFormat
    getDateTimeFormat(r) {
      return t.getDateTimeFormat(r);
    },
    // setDateTimeFormat
    setDateTimeFormat(r, o) {
      t.setDateTimeFormat(r, o);
    },
    // mergeDateTimeFormat
    mergeDateTimeFormat(r, o) {
      t.mergeDateTimeFormat(r, o);
    },
    // n
    n(...r) {
      return Reflect.apply(t.n, t, [...r]);
    },
    // getNumberFormat
    getNumberFormat(r) {
      return t.getNumberFormat(r);
    },
    // setNumberFormat
    setNumberFormat(r, o) {
      t.setNumberFormat(r, o);
    },
    // mergeNumberFormat
    mergeNumberFormat(r, o) {
      t.mergeNumberFormat(r, o);
    }
  };
  return s.__extender = n, s;
}
function Jh(e, t, n) {
  return {
    beforeCreate() {
      const s = jt();
      if (!s)
        throw ht(it.UNEXPECTED_ERROR);
      const r = this.$options;
      if (r.i18n) {
        const o = r.i18n;
        if (r.__i18n && (o.__i18n = r.__i18n), o.__root = t, this === this.$root)
          this.$i18n = Va(e, o);
        else {
          o.__injectWithOption = !0, o.__extender = n.__vueI18nExtend, this.$i18n = Do(o);
          const i = this.$i18n;
          i.__extender && (i.__disposer = i.__extender(this.$i18n));
        }
      } else if (r.__i18n)
        if (this === this.$root)
          this.$i18n = Va(e, r);
        else {
          this.$i18n = Do({
            __i18n: r.__i18n,
            __injectWithOption: !0,
            __extender: n.__vueI18nExtend,
            __root: t
          });
          const o = this.$i18n;
          o.__extender && (o.__disposer = o.__extender(this.$i18n));
        }
      else
        this.$i18n = e;
      r.__i18nGlobal && ou(t, r, r), this.$t = (...o) => this.$i18n.t(...o), this.$rt = (...o) => this.$i18n.rt(...o), this.$tc = (...o) => this.$i18n.tc(...o), this.$te = (o, i) => this.$i18n.te(o, i), this.$d = (...o) => this.$i18n.d(...o), this.$n = (...o) => this.$i18n.n(...o), this.$tm = (o) => this.$i18n.tm(o), n.__setInstance(s, this.$i18n);
    },
    mounted() {
    },
    unmounted() {
      const s = jt();
      if (!s)
        throw ht(it.UNEXPECTED_ERROR);
      const r = this.$i18n;
      delete this.$t, delete this.$rt, delete this.$tc, delete this.$te, delete this.$d, delete this.$n, delete this.$tm, r.__disposer && (r.__disposer(), delete r.__disposer, delete r.__extender), n.__deleteInstance(s), delete this.$i18n;
    }
  };
}
function Va(e, t) {
  e.locale = t.locale || e.locale, e.fallbackLocale = t.fallbackLocale || e.fallbackLocale, e.missing = t.missing || e.missing, e.silentTranslationWarn = t.silentTranslationWarn || e.silentFallbackWarn, e.silentFallbackWarn = t.silentFallbackWarn || e.silentFallbackWarn, e.formatFallbackMessages = t.formatFallbackMessages || e.formatFallbackMessages, e.postTranslation = t.postTranslation || e.postTranslation, e.warnHtmlInMessage = t.warnHtmlInMessage || e.warnHtmlInMessage, e.escapeParameterHtml = t.escapeParameterHtml || e.escapeParameterHtml, e.sync = t.sync || e.sync, e.__composer[nu](t.pluralizationRules || e.pluralizationRules);
  const n = vi(e.locale, {
    messages: t.messages,
    __i18n: t.__i18n
  });
  return Object.keys(n).forEach((s) => e.mergeLocaleMessage(s, n[s])), t.datetimeFormats && Object.keys(t.datetimeFormats).forEach((s) => e.mergeDateTimeFormat(s, t.datetimeFormats[s])), t.numberFormats && Object.keys(t.numberFormats).forEach((s) => e.mergeNumberFormat(s, t.numberFormats[s])), e;
}
const wi = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (e) => e === "parent" || e === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function Zh({ slots: e }, t) {
  return t.length === 1 && t[0] === "default" ? (e.default ? e.default() : []).reduce((s, r) => [
    ...s,
    // prettier-ignore
    ...r.type === Oe ? r.children : [r]
  ], []) : t.reduce((n, s) => {
    const r = e[s];
    return r && (n[s] = r()), n;
  }, {});
}
function iu() {
  return Oe;
}
const ep = /* @__PURE__ */ Lr({
  /* eslint-disable */
  name: "i18n-t",
  props: Ve({
    keypath: {
      type: String,
      required: !0
    },
    plural: {
      type: [Number, String],
      validator: (e) => ze(e) || !isNaN(e)
    }
  }, wi),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(e, t) {
    const { slots: n, attrs: s } = t, r = e.i18n || yt({
      useScope: e.scope,
      __useComponent: !0
    });
    return () => {
      const o = Object.keys(n).filter((f) => f !== "_"), i = {};
      e.locale && (i.locale = e.locale), e.plural !== void 0 && (i.plural = K(e.plural) ? +e.plural : e.plural);
      const a = Zh(t, o), l = r[Oo](e.keypath, a, i), u = Ve({}, s), c = K(e.tag) || be(e.tag) ? e.tag : iu();
      return hi(c, u, l);
    };
  }
}), Wa = ep;
function tp(e) {
  return Pe(e) && !K(e[0]);
}
function au(e, t, n, s) {
  const { slots: r, attrs: o } = t;
  return () => {
    const i = { part: !0 };
    let a = {};
    e.locale && (i.locale = e.locale), K(e.format) ? i.key = e.format : be(e.format) && (K(e.format.key) && (i.key = e.format.key), a = Object.keys(e.format).reduce((h, b) => n.includes(b) ? Ve({}, h, { [b]: e.format[b] }) : h, {}));
    const l = s(e.value, i, a);
    let u = [i.key];
    Pe(l) ? u = l.map((h, b) => {
      const _ = r[h.type], w = _ ? _({ [h.type]: h.value, index: b, parts: l }) : [h.value];
      return tp(w) && (w[0].key = `${h.type}-${b}`), w;
    }) : K(l) && (u = [l]);
    const c = Ve({}, o), f = K(e.tag) || be(e.tag) ? e.tag : iu();
    return hi(f, c, u);
  };
}
const np = /* @__PURE__ */ Lr({
  /* eslint-disable */
  name: "i18n-n",
  props: Ve({
    value: {
      type: Number,
      required: !0
    },
    format: {
      type: [String, Object]
    }
  }, wi),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(e, t) {
    const n = e.i18n || yt({
      useScope: e.scope,
      __useComponent: !0
    });
    return au(e, t, Zc, (...s) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      n[$o](...s)
    ));
  }
}), Ka = np, sp = /* @__PURE__ */ Lr({
  /* eslint-disable */
  name: "i18n-d",
  props: Ve({
    value: {
      type: [Number, Date],
      required: !0
    },
    format: {
      type: [String, Object]
    }
  }, wi),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(e, t) {
    const n = e.i18n || yt({
      useScope: e.scope,
      __useComponent: !0
    });
    return au(e, t, Jc, (...s) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      n[No](...s)
    ));
  }
}), qa = sp;
function rp(e, t) {
  const n = e;
  if (e.mode === "composition")
    return n.__getInstance(t) || e.global;
  {
    const s = n.__getInstance(t);
    return s != null ? s.__composer : e.global.__composer;
  }
}
function op(e) {
  const t = (i) => {
    const { instance: a, value: l } = i;
    if (!a || !a.$)
      throw ht(it.UNEXPECTED_ERROR);
    const u = rp(e, a.$), c = Ga(l);
    return [
      Reflect.apply(u.t, u, [...Ya(c)]),
      u
    ];
  };
  return {
    created: (i, a) => {
      const [l, u] = t(a);
      dr && e.global === u && (i.__i18nWatcher = bt(u.locale, () => {
        a.instance && a.instance.$forceUpdate();
      })), i.__composer = u, i.textContent = l;
    },
    unmounted: (i) => {
      dr && i.__i18nWatcher && (i.__i18nWatcher(), i.__i18nWatcher = void 0, delete i.__i18nWatcher), i.__composer && (i.__composer = void 0, delete i.__composer);
    },
    beforeUpdate: (i, { value: a }) => {
      if (i.__composer) {
        const l = i.__composer, u = Ga(a);
        i.textContent = Reflect.apply(l.t, l, [
          ...Ya(u)
        ]);
      }
    },
    getSSRProps: (i) => {
      const [a] = t(i);
      return { textContent: a };
    }
  };
}
function Ga(e) {
  if (K(e))
    return { path: e };
  if (ae(e)) {
    if (!("path" in e))
      throw ht(it.REQUIRED_VALUE, "path");
    return e;
  } else
    throw ht(it.INVALID_VALUE);
}
function Ya(e) {
  const { path: t, locale: n, args: s, choice: r, plural: o } = e, i = {}, a = s || {};
  return K(n) && (i.locale = n), ze(r) && (i.plural = r), ze(o) && (i.plural = o), [t, a, i];
}
function ip(e, t, ...n) {
  const s = ae(n[0]) ? n[0] : {};
  (ge(s.globalInstall) ? s.globalInstall : !0) && ([Wa.name, "I18nT"].forEach((o) => e.component(o, Wa)), [Ka.name, "I18nN"].forEach((o) => e.component(o, Ka)), [qa.name, "I18nD"].forEach((o) => e.component(o, qa))), e.directive("t", op(t));
}
const ap = /* @__PURE__ */ _n("global-vue-i18n");
function lp(e = {}, t) {
  const n = __VUE_I18N_LEGACY_API__ && ge(e.legacy) ? e.legacy : __VUE_I18N_LEGACY_API__, s = ge(e.globalInjection) ? e.globalInjection : !0, r = /* @__PURE__ */ new Map(), [o, i] = cp(e, n), a = /* @__PURE__ */ _n("");
  function l(h) {
    return r.get(h) || null;
  }
  function u(h, b) {
    r.set(h, b);
  }
  function c(h) {
    r.delete(h);
  }
  const f = {
    // mode
    get mode() {
      return __VUE_I18N_LEGACY_API__ && n ? "legacy" : "composition";
    },
    // install plugin
    async install(h, ...b) {
      if (h.__VUE_I18N_SYMBOL__ = a, h.provide(h.__VUE_I18N_SYMBOL__, f), ae(b[0])) {
        const x = b[0];
        f.__composerExtend = x.__composerExtend, f.__vueI18nExtend = x.__vueI18nExtend;
      }
      let _ = null;
      !n && s && (_ = _p(h, f.global)), __VUE_I18N_FULL_INSTALL__ && ip(h, f, ...b), __VUE_I18N_LEGACY_API__ && n && h.mixin(Jh(i, i.__composer, f));
      const w = h.unmount;
      h.unmount = () => {
        _ && _(), f.dispose(), w();
      };
    },
    // global accessor
    get global() {
      return i;
    },
    dispose() {
      o.stop();
    },
    // @internal
    __instances: r,
    // @internal
    __getInstance: l,
    // @internal
    __setInstance: u,
    // @internal
    __deleteInstance: c
  };
  return f;
}
function yt(e = {}) {
  const t = jt();
  if (t == null)
    throw ht(it.MUST_BE_CALL_SETUP_TOP);
  if (!t.isCE && t.appContext.app != null && !t.appContext.app.__VUE_I18N_SYMBOL__)
    throw ht(it.NOT_INSTALLED);
  const n = up(t), s = dp(n), r = ru(t), o = fp(e, r);
  if (o === "global")
    return ou(s, e, r), s;
  if (o === "parent") {
    let l = hp(n, t, e.__useComponent);
    return l == null && (l = s), l;
  }
  const i = n;
  let a = i.__getInstance(t);
  if (a == null) {
    const l = Ve({}, e);
    "__i18n" in r && (l.__i18n = r.__i18n), s && (l.__root = s), a = yi(l), i.__composerExtend && (a[Po] = i.__composerExtend(a)), mp(i, t, a), i.__setInstance(t, a);
  }
  return a;
}
function cp(e, t, n) {
  const s = cf(), r = __VUE_I18N_LEGACY_API__ && t ? s.run(() => Do(e)) : s.run(() => yi(e));
  if (r == null)
    throw ht(it.UNEXPECTED_ERROR);
  return [s, r];
}
function up(e) {
  const t = Qt(e.isCE ? ap : e.appContext.app.__VUE_I18N_SYMBOL__);
  if (!t)
    throw ht(e.isCE ? it.NOT_INSTALLED_WITH_PROVIDE : it.UNEXPECTED_ERROR);
  return t;
}
function fp(e, t) {
  return Pr(e) ? "__i18n" in t ? "local" : "global" : e.useScope ? e.useScope : "local";
}
function dp(e) {
  return e.mode === "composition" ? e.global : e.global.__composer;
}
function hp(e, t, n = !1) {
  let s = null;
  const r = t.root;
  let o = pp(t, n);
  for (; o != null; ) {
    const i = e;
    if (e.mode === "composition")
      s = i.__getInstance(o);
    else if (__VUE_I18N_LEGACY_API__) {
      const a = i.__getInstance(o);
      a != null && (s = a.__composer, n && s && !s[su] && (s = null));
    }
    if (s != null || r === o)
      break;
    o = o.parent;
  }
  return s;
}
function pp(e, t = !1) {
  return e == null ? null : t && e.vnode.ctx || e.parent;
}
function mp(e, t, n) {
  gn(() => {
  }, t), Zn(() => {
    const s = n;
    e.__deleteInstance(t);
    const r = s[Po];
    r && (r(), delete s[Po]);
  }, t);
}
const gp = [
  "locale",
  "fallbackLocale",
  "availableLocales"
], Qa = ["t", "rt", "d", "n", "tm", "te"];
function _p(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  return gp.forEach((r) => {
    const o = Object.getOwnPropertyDescriptor(t, r);
    if (!o)
      throw ht(it.UNEXPECTED_ERROR);
    const i = qe(o.value) ? {
      get() {
        return o.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(a) {
        o.value.value = a;
      }
    } : {
      get() {
        return o.get && o.get();
      }
    };
    Object.defineProperty(n, r, i);
  }), e.config.globalProperties.$i18n = n, Qa.forEach((r) => {
    const o = Object.getOwnPropertyDescriptor(t, r);
    if (!o || !o.value)
      throw ht(it.UNEXPECTED_ERROR);
    Object.defineProperty(e.config.globalProperties, `$${r}`, o);
  }), () => {
    delete e.config.globalProperties.$i18n, Qa.forEach((r) => {
      delete e.config.globalProperties[`$${r}`];
    });
  };
}
Gh();
Ch(ah);
Th(xh);
Sh(Kc);
if (__INTLIFY_PROD_DEVTOOLS__) {
  const e = Cn();
  e.__INTLIFY__ = !0, lh(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
const bp = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAuuSURBVHgB7Z2nsxTbFoeb917VVfdiwAAKQ1AIChRUkRRUEQwYgkARPME8AwWaYDAkQSEImmAwJIMhGDCAQQF/AO9+/WrN3TQzPcOBA9O9vq9qaubM9Mwx67f32iv1nFevXn2pRJLyr0okMQpAUqMAJDUKQFKjACQ1CkBSowAkNQpAUqMAJDUKQFKjACQ1CkBSowAkNQpAUqMAJDUKQFKjACQ1CkBSowAkNQpAUqMAJDUKQFKjACQ1CkBSowAkNQpAUqMAJDUKQFKjACQ1CkBSowAkNQpAUqMAJDUKQFKjACQ1CkBSowAkNQpAUqMAJDUKQFKjACQ1CkBSowAkNQpAUqMAJDUKQFKjACQ1CkBSowAkNQpAUqMAJDUKQFKjAKSVz58/V2/fvq2f+8h/KpEhvHv3rjpy5Ej1+PHjwXsLFy6sDh06VO3YsaPqC3NevXr1pRIpuHv3bm38rPp//vlntWzZsloQPGDVqlXV+fPn68+6jgKQr8DIt27dWhv/8ePHqz179gw+u3nzZnXmzJn6GkRx5cqVzovAM4B8BQY+zPhh+/bttdHjCr148aK+tuu4A8hXrFy5spozZ0715MmTkddg/Nu2batf379/vxZEV3EHkAGfPn0a+P1t4P6wG8ClS5eqLqMAZMBff/1VGz8+/riwZ0SC4mDcVRRAUh49ejTUh2d1h4sXL7Z+P9weBSCdg9X94MGD1dmzZ79xYQ4fPlw/X758udW4SY5Bl/1/UADJ4AD7/PnzOqEFJ0+e/CrZRYyfB+eB3bt3jxQB4oGNGzdWXcYoUBIw/KNHj9bPTfD9b9269ZVbE8bfzP6WGWLcJb7XZRRAAsrkFtEbVm2MnowvjzD027dvDyJApQiA9/lOmQ0+depU510gBZCA9evX14aLfx+uT1AaOkZNoquE7O+NGzcGbhLXbNq06ZskWVdRAD2HaA/G2uaulDvE3r17q2PHjlVZ8BDcc8JlWbp06chrcGNwZ4CoUNeTW9+DApAazgXh/xMZevnyZZUBBdBzVq9eXT/fu3dvbHYXNykOtQcOHOh8kmsSFEDPwaAjrj+uehODJ0rE9XE47msnWKAAegAHXdwW4vMYOX+XRHYX356ozjCI9GD0ixYtqs6dO1cLh7/HlUR0HaNAHWZY22KAT080J1waMrexAxAKDVEARh6ZXXIBfIffZAcg9t9WGt11FEBHacbvydRGoworfSS3ooEFShFEqyPXRwn06dOnqw0bNgz+x5IlS+rnv22k6isKoKOw8uPOjEpucYglktPM8PIdVvwyyoOA2C2iEjR+gwQa36fppa8ogCkE48OPHzV9YRLjjGI2DJ2DbcT5A1Z9rokegCZtAusTHoKnjMjKUrg2KhYfpcjlit0Ew2ZyA2DIzWgORo+AmsbPdSdOnKi/E4VwfUYBTBkYXbQbjovFj2td5LfCpyfKMwrOBTyIJK1bt67uBYipD33HwVhTCBMZWP0jElP68ECoEiK51SYEokFcN0pIuEERAQqoB8L16cPcn3G4A0wpZSwef7ykTG5NGqdvM2b+F64O54SnT5/WB+IMxg8KYErBh4/BU9TsN7O4ZetiW91O5AiWL18+8v+wS/B7uF5ZDD9QAFMGLk3466z0cZBt9u+yA1DmzC7AWWFYMgzRxGG2jO/LP/z7b+X/t5KpYefOndW1a9fqlXnFihW18fL6wYMH9YNmlHnz5tXXrl27tnaRMH4MnddEiF6/fl0faHmPFf369ev1b8i3mAeYIlj5CX8SgYkzQEBoEnenmd2FMsNb0pe2xdlEAUwBMYgKI+d108ADIkKs9s3sbvwGn0WOgDJoBCDtKIDfDD48WV1cFAy77M4adi0zOTF2Dq7sEvJjeAj+zWD4UX/PCt7mq4+LDMn3owCmgNJPHxbNKWmLDMn3owCmgFjZo5yZCE4bUb0JXJuhdXG2MAz6i8HACVMyg790d8IVIgT67NmzQRh0FHzGmWDLli3VmjVrKpkZHoJ/EdF1VVZlDgt34tLEDsCuYCRndnEH+AVQy3PhwoXqjz/+qFdrVm+EwE6AwZerPc/sDpwFKGLbvHmzSaxZxB1gliFSw8o/LoHFQTjKoIHyBgQwLOYvPw8PwbNMTGEYltxasGDB4HXzIBuRoWhvlNlBAcwQDJOkVFvEhrbGSFo1jZ+Vn7IHVnbCms3OqzIyhDs0LjwqM8OGmBlCBIayA6I6GHE5ZqRJ6b40Ww7LnYHP+L04+PI+h2Te9zA8O7gDzBAiOHRuAb48/nqT6NwK9yZGmWD80XIYxo/hc4vS5o7CdRr/7KEAfgAOrbHyE+lp+vHRdI77QrQH48fQaTks78givw8F8IPguyOEUffUwtghMrYIZtj8/bh1UdsYc/n5KIAfIHx2jBzDxcC5+2IJBh9GzYofgijhe9GY3naWkJ+PApghZHYZIUIkiEf05Q6r5SHKEyFNZv7Q+IJ4eBAN4r3YHXSLfi0mwmZAJLci+sNBFReIEuWI+zcH0DZvOteEA3Vf7rvVJRTAdxL33BqW2YUyu8vK32xGRyB37twZCIHOLdwiV/7fgwL4TmJmZrN0oSRE0Lz/rkwfngG+k1i52+Zy4v5Mcrd1+f0ogDGwkpcGjFGXz6MI/39YZEimBwXQAiULuDOlAUdWtnkboiZl9naSLi/5PSiAEWDgMYenTFwxmAr4bBLXhrMC0aJIdMl0YTFcA4yacOaXL/+PDTQjPazsRHao/Rk2uTmIHYKDcNx3S6aPVDsAiSeMu21UOEaNu0L9Tnnf3JKyVj+SWCX8TakzkAXW+KeXVGHQCGGyio+6+UPZk4sACGMOo5nYouYfY4/htjz3/fZCfSDVDhDG2nbzZ5JSkZHFbx+1W0QiLHIB7CzlnB4yuxr/9NP7HYCmlblz59Z+ekxfY7Ue12PbNoezCb+LWHjQAzDJ78t00GsBxLTlUUbMTvDx48eBQErKOZxtLpN0m167QBF6bLoxRGhY4enAIqLDM3+XN5Ir53CyExjH7ye9ngvEjB1m8ezbt29Qkx/N6IiC9xYvXlyv9m/evBm0NVKgBjGvh4PzJNPapHukigKVLhGhzDJbW0Z/OAiXyS+ntfWXXgkg6nZGzddnDj+fc3f1YbF5XCZcIc4GCKDs3oo7tFjh2S96cQbAYInxE4YcleiKkCar9yjjJe4fRWzNOZ6ENaPCc9gECOkmnRdAOWokoj3DDDyqN8et3Kz6YejN+h1m9Ni51S86LYBwWXhuztlpEgNm2+6pG0QXF7tJ8zc0/n7RWQFwoI1ShEnm7MSMHsQybsxgiGVczb90n04KIEKZUW8zbM5OE4y6nNHTRhh+W9eX9IPOCSAmMgDRnnH1NqUbE83n7AIcmofBjkK0ByhpkH7TOQHs2LFjULbQ1pUVkSG6uaJAjV2Agyzf59BMWLT8jcgQO6MnD53MA+DDY6jQnL8D0YfLSj9sfAnv83mES0NQEfZsJsKkv3SyFAJjZjV/8OBBLQYqMMNfx7j3799f336IcObVq1erefPmffX9+fPnD2b2f/jwoXr//n1dMkGZA27Vrl27KslBpzPBZXaWVf7hw4eDBJaruExC50shom4fNyZcGJNVMimdF0BZtw/DxhGKjKLzpRBl3T4wd1NkUnpRDMdhlpUfCG/GcFqRcfSmI4yITxx6OQjHmHKRNnrVEllOdKDcYZLCN8lN73qCy7p9bjDtZGZpo5dN8ZQ7xOS2UTU/ItBLAURkiOzwqPZIEfAOMZIax6NLahSApEYBSGoUgKRGAUhqFICkRgFIahSApEYBSGoUgKRGAUhqFICkRgFIahSApEYBSGoUgKRGAUhqFICkRgFIahSApEYBSGoUgKRGAUhqFICkRgFIahSApEYBSGoUgKRGAUhqFICkRgFIahSApEYBSGoUgKRGAUhqFICkRgFIahSApEYBSGoUgKRGAUhqFICkRgFIahSApEYBSGoUgKRGAUhqFICkRgFIahSApEYBSGoUgKRGAUhq/gemt4zW84vGsgAAAABJRU5ErkJggg==", vp = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-x"
};
function yp(e, t) {
  return N(), B("svg", vp, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M18 6 6 18M6 6l12 12" }, null, -1)
  ]));
}
const Xa = { render: yp }, wp = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-send",
  viewBox: "0 0 24 24"
};
function kp(e, t) {
  return N(), B("svg", wp, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M10 14 21 3M21 3l-6.5 18a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1z" }, null, -1)
  ]));
}
const xp = { render: kp }, Ep = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-trash-x",
  viewBox: "0 0 24 24"
};
function Ap(e, t) {
  return N(), B("svg", Ep, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M4 7h16M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M10 12l4 4m0-4-4 4" }, null, -1)
  ]));
}
const lu = { render: Ap }, Cp = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "icon icon-tabler icons-tabler-filled icon-tabler-trash-x",
  viewBox: "0 0 24 24"
};
function Tp(e, t) {
  return N(), B("svg", Cp, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M20 6a1 1 0 0 1 .117 1.993L20 8h-.081L19 19a3 3 0 0 1-2.824 2.995L16 22H8c-1.598 0-2.904-1.249-2.992-2.75l-.005-.167L4.08 8H4a1 1 0 0 1-.117-1.993L4 6zm-9.489 5.14a1 1 0 0 0-1.218 1.567L10.585 14l-1.292 1.293-.083.094a1 1 0 0 0 1.497 1.32L12 15.415l1.293 1.292.094.083a1 1 0 0 0 1.32-1.497L13.415 14l1.292-1.293.083-.094a1 1 0 0 0-1.497-1.32L12 12.585l-1.293-1.292-.094-.083zM14 2a2 2 0 0 1 2 2 1 1 0 0 1-1.993.117L14 4h-4l-.007.117A1 1 0 0 1 8 4a2 2 0 0 1 1.85-1.995L10 2z" }, null, -1)
  ]));
}
const cu = { render: Tp }, Sp = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-message-circle",
  viewBox: "0 0 24 24"
};
function Rp(e, t) {
  return N(), B("svg", Sp, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "m3 20 1.3-3.9C1.976 12.663 2.874 8.228 6.4 5.726c3.526-2.501 8.59-2.296 11.845.48 3.255 2.777 3.695 7.266 1.029 10.501S11.659 20.922 7.7 19z" }, null, -1)
  ]));
}
const Lp = { render: Rp }, Ip = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 300 300"
};
function Mp(e, t) {
  return N(), B("svg", Ip, t[0] || (t[0] = [
    es('<circle cx="150" cy="150" r="150" fill="#EAEDF1"></circle><g clip-path="url(#a)"><path fill="#758CA3" fill-rule="evenodd" d="M150.064 92.136c-14.187 0-25.688 11.502-25.688 25.689s11.501 25.689 25.688 25.689 25.689-11.502 25.689-25.689-11.502-25.689-25.689-25.689m0-12.844c21.281 0 38.533 17.252 38.533 38.533s-17.252 38.533-38.533 38.533-38.533-17.252-38.533-38.533 17.252-38.533 38.533-38.533M98.687 214.793a6.422 6.422 0 1 1-12.844 0v-13.48c0-17.734 14.376-32.111 32.11-32.111h64.226c17.735 0 32.111 14.377 32.111 32.111v13.48a6.422 6.422 0 1 1-12.844 0v-13.48c0-10.641-8.626-19.267-19.267-19.267h-64.226c-10.64 0-19.266 8.626-19.266 19.267z" clip-rule="evenodd"></path></g><defs><clipPath id="a"><path fill="#fff" d="M85.843 79.292h128.443V220.58H85.843z"></path></clipPath></defs>', 3)
  ]));
}
const Op = { render: Mp }, Np = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-copy",
  viewBox: "0 0 24 24"
};
function $p(e, t) {
  return N(), B("svg", Np, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M7 9.667A2.667 2.667 0 0 1 9.667 7h8.666A2.667 2.667 0 0 1 21 9.667v8.666A2.667 2.667 0 0 1 18.333 21H9.667A2.667 2.667 0 0 1 7 18.333z" }, null, -1),
    C("path", { d: "M4.012 16.737A2 2 0 0 1 3 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1" }, null, -1)
  ]));
}
const uu = { render: $p }, Pp = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-player-play",
  viewBox: "0 0 24 24"
};
function Dp(e, t) {
  return N(), B("svg", Pp, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M7 4v16l13-8z" }, null, -1)
  ]));
}
const ki = { render: Dp }, Fp = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "icon icon-tabler icons-tabler-filled icon-tabler-player-play",
  viewBox: "0 0 24 24"
};
function Bp(e, t) {
  return N(), B("svg", Fp, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M6 4v16a1 1 0 0 0 1.524.852l13-8a1 1 0 0 0 0-1.704l-13-8A1 1 0 0 0 6 4" }, null, -1)
  ]));
}
const fu = { render: Bp }, Up = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-player-pause",
  viewBox: "0 0 24 24"
};
function Hp(e, t) {
  return N(), B("svg", Up, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M6 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM14 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" }, null, -1)
  ]));
}
const pr = { render: Hp }, zp = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "icon icon-tabler icons-tabler-filled icon-tabler-player-pause",
  viewBox: "0 0 24 24"
};
function jp(e, t) {
  return N(), B("svg", zp, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M9 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M17 4h-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2" }, null, -1)
  ]));
}
const mr = { render: jp }, Vp = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-volume",
  viewBox: "0 0 24 24"
};
function Wp(e, t) {
  return N(), B("svg", Vp, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M15 8a5 5 0 0 1 0 8M17.7 5a9 9 0 0 1 0 14M6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l3.5-4.5A.8.8 0 0 1 11 5v14a.8.8 0 0 1-1.5.5z" }, null, -1)
  ]));
}
const Kp = { render: Wp };
function Xn(e) {
  return e = Math.max(0, Math.min(100, e)), Math.round(e * 255 / 100).toString(16).padStart(2, "0");
}
function Jn(e) {
  let t, n, s, r;
  if (e.startsWith("rgba"))
    [t, n, s, r] = e.match(/[\d.]+/g).map(Number);
  else if (e.startsWith("rgb"))
    [t, n, s] = e.match(/\d+/g).map(Number), r = 1;
  else if (e.startsWith("#")) {
    const i = e.slice(1);
    t = parseInt(i.slice(0, 2), 16), n = parseInt(i.slice(2, 4), 16), s = parseInt(i.slice(4, 6), 16), r = i.length === 8 ? parseInt(i.slice(6, 8), 16) / 255 : 1;
  } else
    throw new Error("Unsupported color format");
  const o = (i) => Math.round(i * r + 255 * (1 - r));
  return t = o(t), n = o(n), s = o(s), `#${(1 << 24 | t << 16 | n << 8 | s).toString(16).slice(1)}`;
}
const Qe = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, r] of t)
    n[s] = r;
  return n;
}, qp = ["href"], Gp = { class: "source__name" }, Yp = { class: "source__type" }, Qp = {
  __name: "ChatMessageSource",
  props: {
    name: {
      type: String
    },
    sourceType: {
      type: String
    },
    sourceLink: {
      type: String,
      required: !1
    },
    index: {
      type: Number
    },
    primaryColor: {
      type: String
    }
  },
  setup(e) {
    $r((s) => ({
      "1397f542": n.value
    }));
    const t = e;
    ke(() => t.primaryColor), ke(() => Jn(t.primaryColor + Xn(20)));
    const n = ke(() => Jn(t.primaryColor + Xn(80)));
    return (s, r) => (N(), B("a", {
      href: t.sourceLink,
      target: "_blank",
      class: "source"
    }, [
      C("span", Gp, ee(e.index + 1) + ". " + ee(t.name), 1),
      C("span", Yp, ee(t.sourceType), 1)
    ], 8, qp));
  }
}, Xp = /* @__PURE__ */ Qe(Qp, [["__scopeId", "data-v-8e7e7df1"]]), Jp = {
  key: 0,
  class: "loader dot-flashing"
}, Zp = {
  __name: "ThreeDotLoadingIndicator",
  props: {
    isLoading: {
      type: Boolean
    }
  },
  setup(e) {
    const t = e;
    return (n, s) => t.isLoading ? (N(), B("div", Jp)) : we("", !0);
  }
}, e2 = /* @__PURE__ */ Qe(Zp, [["__scopeId", "data-v-a4dad92f"]]);
function du(e, t) {
  return function() {
    return e.apply(t, arguments);
  };
}
const { toString: t2 } = Object.prototype, { getPrototypeOf: xi } = Object, Br = /* @__PURE__ */ ((e) => (t) => {
  const n = t2.call(t);
  return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), Ot = (e) => (e = e.toLowerCase(), (t) => Br(t) === e), Ur = (e) => (t) => typeof t === e, { isArray: ts } = Array, Is = Ur("undefined");
function n2(e) {
  return e !== null && !Is(e) && e.constructor !== null && !Is(e.constructor) && vt(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const hu = Ot("ArrayBuffer");
function s2(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? t = ArrayBuffer.isView(e) : t = e && e.buffer && hu(e.buffer), t;
}
const r2 = Ur("string"), vt = Ur("function"), pu = Ur("number"), Hr = (e) => e !== null && typeof e == "object", o2 = (e) => e === !0 || e === !1, Js = (e) => {
  if (Br(e) !== "object")
    return !1;
  const t = xi(e);
  return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}, i2 = Ot("Date"), a2 = Ot("File"), l2 = Ot("Blob"), c2 = Ot("FileList"), u2 = (e) => Hr(e) && vt(e.pipe), f2 = (e) => {
  let t;
  return e && (typeof FormData == "function" && e instanceof FormData || vt(e.append) && ((t = Br(e)) === "formdata" || // detect form-data instance
  t === "object" && vt(e.toString) && e.toString() === "[object FormData]"));
}, d2 = Ot("URLSearchParams"), [h2, p2, m2, g2] = ["ReadableStream", "Request", "Response", "Headers"].map(Ot), _2 = (e) => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Ps(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u")
    return;
  let s, r;
  if (typeof e != "object" && (e = [e]), ts(e))
    for (s = 0, r = e.length; s < r; s++)
      t.call(null, e[s], s, e);
  else {
    const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e), i = o.length;
    let a;
    for (s = 0; s < i; s++)
      a = o[s], t.call(null, e[a], a, e);
  }
}
function mu(e, t) {
  t = t.toLowerCase();
  const n = Object.keys(e);
  let s = n.length, r;
  for (; s-- > 0; )
    if (r = n[s], t === r.toLowerCase())
      return r;
  return null;
}
const Tn = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, gu = (e) => !Is(e) && e !== Tn;
function Fo() {
  const { caseless: e } = gu(this) && this || {}, t = {}, n = (s, r) => {
    const o = e && mu(t, r) || r;
    Js(t[o]) && Js(s) ? t[o] = Fo(t[o], s) : Js(s) ? t[o] = Fo({}, s) : ts(s) ? t[o] = s.slice() : t[o] = s;
  };
  for (let s = 0, r = arguments.length; s < r; s++)
    arguments[s] && Ps(arguments[s], n);
  return t;
}
const b2 = (e, t, n, { allOwnKeys: s } = {}) => (Ps(t, (r, o) => {
  n && vt(r) ? e[o] = du(r, n) : e[o] = r;
}, { allOwnKeys: s }), e), v2 = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e), y2 = (e, t, n, s) => {
  e.prototype = Object.create(t.prototype, s), e.prototype.constructor = e, Object.defineProperty(e, "super", {
    value: t.prototype
  }), n && Object.assign(e.prototype, n);
}, w2 = (e, t, n, s) => {
  let r, o, i;
  const a = {};
  if (t = t || {}, e == null) return t;
  do {
    for (r = Object.getOwnPropertyNames(e), o = r.length; o-- > 0; )
      i = r[o], (!s || s(i, e, t)) && !a[i] && (t[i] = e[i], a[i] = !0);
    e = n !== !1 && xi(e);
  } while (e && (!n || n(e, t)) && e !== Object.prototype);
  return t;
}, k2 = (e, t, n) => {
  e = String(e), (n === void 0 || n > e.length) && (n = e.length), n -= t.length;
  const s = e.indexOf(t, n);
  return s !== -1 && s === n;
}, x2 = (e) => {
  if (!e) return null;
  if (ts(e)) return e;
  let t = e.length;
  if (!pu(t)) return null;
  const n = new Array(t);
  for (; t-- > 0; )
    n[t] = e[t];
  return n;
}, E2 = /* @__PURE__ */ ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && xi(Uint8Array)), A2 = (e, t) => {
  const s = (e && e[Symbol.iterator]).call(e);
  let r;
  for (; (r = s.next()) && !r.done; ) {
    const o = r.value;
    t.call(e, o[0], o[1]);
  }
}, C2 = (e, t) => {
  let n;
  const s = [];
  for (; (n = e.exec(t)) !== null; )
    s.push(n);
  return s;
}, T2 = Ot("HTMLFormElement"), S2 = (e) => e.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(n, s, r) {
    return s.toUpperCase() + r;
  }
), Ja = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype), R2 = Ot("RegExp"), _u = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), s = {};
  Ps(n, (r, o) => {
    let i;
    (i = t(r, o, e)) !== !1 && (s[o] = i || r);
  }), Object.defineProperties(e, s);
}, L2 = (e) => {
  _u(e, (t, n) => {
    if (vt(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
      return !1;
    const s = e[n];
    if (vt(s)) {
      if (t.enumerable = !1, "writable" in t) {
        t.writable = !1;
        return;
      }
      t.set || (t.set = () => {
        throw Error("Can not rewrite read-only method '" + n + "'");
      });
    }
  });
}, I2 = (e, t) => {
  const n = {}, s = (r) => {
    r.forEach((o) => {
      n[o] = !0;
    });
  };
  return ts(e) ? s(e) : s(String(e).split(t)), n;
}, M2 = () => {
}, O2 = (e, t) => e != null && Number.isFinite(e = +e) ? e : t, io = "abcdefghijklmnopqrstuvwxyz", Za = "0123456789", bu = {
  DIGIT: Za,
  ALPHA: io,
  ALPHA_DIGIT: io + io.toUpperCase() + Za
}, N2 = (e = 16, t = bu.ALPHA_DIGIT) => {
  let n = "";
  const { length: s } = t;
  for (; e--; )
    n += t[Math.random() * s | 0];
  return n;
};
function $2(e) {
  return !!(e && vt(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator]);
}
const P2 = (e) => {
  const t = new Array(10), n = (s, r) => {
    if (Hr(s)) {
      if (t.indexOf(s) >= 0)
        return;
      if (!("toJSON" in s)) {
        t[r] = s;
        const o = ts(s) ? [] : {};
        return Ps(s, (i, a) => {
          const l = n(i, r + 1);
          !Is(l) && (o[a] = l);
        }), t[r] = void 0, o;
      }
    }
    return s;
  };
  return n(e, 0);
}, D2 = Ot("AsyncFunction"), F2 = (e) => e && (Hr(e) || vt(e)) && vt(e.then) && vt(e.catch), vu = ((e, t) => e ? setImmediate : t ? ((n, s) => (Tn.addEventListener("message", ({ source: r, data: o }) => {
  r === Tn && o === n && s.length && s.shift()();
}, !1), (r) => {
  s.push(r), Tn.postMessage(n, "*");
}))(`axios@${Math.random()}`, []) : (n) => setTimeout(n))(
  typeof setImmediate == "function",
  vt(Tn.postMessage)
), B2 = typeof queueMicrotask < "u" ? queueMicrotask.bind(Tn) : typeof process < "u" && process.nextTick || vu, I = {
  isArray: ts,
  isArrayBuffer: hu,
  isBuffer: n2,
  isFormData: f2,
  isArrayBufferView: s2,
  isString: r2,
  isNumber: pu,
  isBoolean: o2,
  isObject: Hr,
  isPlainObject: Js,
  isReadableStream: h2,
  isRequest: p2,
  isResponse: m2,
  isHeaders: g2,
  isUndefined: Is,
  isDate: i2,
  isFile: a2,
  isBlob: l2,
  isRegExp: R2,
  isFunction: vt,
  isStream: u2,
  isURLSearchParams: d2,
  isTypedArray: E2,
  isFileList: c2,
  forEach: Ps,
  merge: Fo,
  extend: b2,
  trim: _2,
  stripBOM: v2,
  inherits: y2,
  toFlatObject: w2,
  kindOf: Br,
  kindOfTest: Ot,
  endsWith: k2,
  toArray: x2,
  forEachEntry: A2,
  matchAll: C2,
  isHTMLForm: T2,
  hasOwnProperty: Ja,
  hasOwnProp: Ja,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: _u,
  freezeMethods: L2,
  toObjectSet: I2,
  toCamelCase: S2,
  noop: M2,
  toFiniteNumber: O2,
  findKey: mu,
  global: Tn,
  isContextDefined: gu,
  ALPHABET: bu,
  generateString: N2,
  isSpecCompliantForm: $2,
  toJSONObject: P2,
  isAsyncFn: D2,
  isThenable: F2,
  setImmediate: vu,
  asap: B2
};
function oe(e, t, n, s, r) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = e, this.name = "AxiosError", t && (this.code = t), n && (this.config = n), s && (this.request = s), r && (this.response = r, this.status = r.status ? r.status : null);
}
I.inherits(oe, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: I.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const yu = oe.prototype, wu = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((e) => {
  wu[e] = { value: e };
});
Object.defineProperties(oe, wu);
Object.defineProperty(yu, "isAxiosError", { value: !0 });
oe.from = (e, t, n, s, r, o) => {
  const i = Object.create(yu);
  return I.toFlatObject(e, i, function(l) {
    return l !== Error.prototype;
  }, (a) => a !== "isAxiosError"), oe.call(i, e.message, t, n, s, r), i.cause = e, i.name = e.name, o && Object.assign(i, o), i;
};
const U2 = null;
function Bo(e) {
  return I.isPlainObject(e) || I.isArray(e);
}
function ku(e) {
  return I.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function el(e, t, n) {
  return e ? e.concat(t).map(function(r, o) {
    return r = ku(r), !n && o ? "[" + r + "]" : r;
  }).join(n ? "." : "") : t;
}
function H2(e) {
  return I.isArray(e) && !e.some(Bo);
}
const z2 = I.toFlatObject(I, {}, null, function(t) {
  return /^is[A-Z]/.test(t);
});
function zr(e, t, n) {
  if (!I.isObject(e))
    throw new TypeError("target must be an object");
  t = t || new FormData(), n = I.toFlatObject(n, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(w, x) {
    return !I.isUndefined(x[w]);
  });
  const s = n.metaTokens, r = n.visitor || c, o = n.dots, i = n.indexes, l = (n.Blob || typeof Blob < "u" && Blob) && I.isSpecCompliantForm(t);
  if (!I.isFunction(r))
    throw new TypeError("visitor must be a function");
  function u(_) {
    if (_ === null) return "";
    if (I.isDate(_))
      return _.toISOString();
    if (!l && I.isBlob(_))
      throw new oe("Blob is not supported. Use a Buffer instead.");
    return I.isArrayBuffer(_) || I.isTypedArray(_) ? l && typeof Blob == "function" ? new Blob([_]) : Buffer.from(_) : _;
  }
  function c(_, w, x) {
    let g = _;
    if (_ && !x && typeof _ == "object") {
      if (I.endsWith(w, "{}"))
        w = s ? w : w.slice(0, -2), _ = JSON.stringify(_);
      else if (I.isArray(_) && H2(_) || (I.isFileList(_) || I.endsWith(w, "[]")) && (g = I.toArray(_)))
        return w = ku(w), g.forEach(function(T, k) {
          !(I.isUndefined(T) || T === null) && t.append(
            // eslint-disable-next-line no-nested-ternary
            i === !0 ? el([w], k, o) : i === null ? w : w + "[]",
            u(T)
          );
        }), !1;
    }
    return Bo(_) ? !0 : (t.append(el(x, w, o), u(_)), !1);
  }
  const f = [], h = Object.assign(z2, {
    defaultVisitor: c,
    convertValue: u,
    isVisitable: Bo
  });
  function b(_, w) {
    if (!I.isUndefined(_)) {
      if (f.indexOf(_) !== -1)
        throw Error("Circular reference detected in " + w.join("."));
      f.push(_), I.forEach(_, function(g, A) {
        (!(I.isUndefined(g) || g === null) && r.call(
          t,
          g,
          I.isString(A) ? A.trim() : A,
          w,
          h
        )) === !0 && b(g, w ? w.concat(A) : [A]);
      }), f.pop();
    }
  }
  if (!I.isObject(e))
    throw new TypeError("data must be an object");
  return b(e), t;
}
function tl(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function(s) {
    return t[s];
  });
}
function Ei(e, t) {
  this._pairs = [], e && zr(e, this, t);
}
const xu = Ei.prototype;
xu.append = function(t, n) {
  this._pairs.push([t, n]);
};
xu.toString = function(t) {
  const n = t ? function(s) {
    return t.call(this, s, tl);
  } : tl;
  return this._pairs.map(function(r) {
    return n(r[0]) + "=" + n(r[1]);
  }, "").join("&");
};
function j2(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Eu(e, t, n) {
  if (!t)
    return e;
  const s = n && n.encode || j2, r = n && n.serialize;
  let o;
  if (r ? o = r(t, n) : o = I.isURLSearchParams(t) ? t.toString() : new Ei(t, n).toString(s), o) {
    const i = e.indexOf("#");
    i !== -1 && (e = e.slice(0, i)), e += (e.indexOf("?") === -1 ? "?" : "&") + o;
  }
  return e;
}
class nl {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(t, n, s) {
    return this.handlers.push({
      fulfilled: t,
      rejected: n,
      synchronous: s ? s.synchronous : !1,
      runWhen: s ? s.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(t) {
    I.forEach(this.handlers, function(s) {
      s !== null && t(s);
    });
  }
}
const Au = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, V2 = typeof URLSearchParams < "u" ? URLSearchParams : Ei, W2 = typeof FormData < "u" ? FormData : null, K2 = typeof Blob < "u" ? Blob : null, q2 = {
  isBrowser: !0,
  classes: {
    URLSearchParams: V2,
    FormData: W2,
    Blob: K2
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, Ai = typeof window < "u" && typeof document < "u", Uo = typeof navigator == "object" && navigator || void 0, G2 = Ai && (!Uo || ["ReactNative", "NativeScript", "NS"].indexOf(Uo.product) < 0), Y2 = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", Q2 = Ai && window.location.href || "http://localhost", X2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: Ai,
  hasStandardBrowserEnv: G2,
  hasStandardBrowserWebWorkerEnv: Y2,
  navigator: Uo,
  origin: Q2
}, Symbol.toStringTag, { value: "Module" })), ft = {
  ...X2,
  ...q2
};
function J2(e, t) {
  return zr(e, new ft.classes.URLSearchParams(), Object.assign({
    visitor: function(n, s, r, o) {
      return ft.isNode && I.isBuffer(n) ? (this.append(s, n.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
    }
  }, t));
}
function Z2(e) {
  return I.matchAll(/\w+|\[(\w*)]/g, e).map((t) => t[0] === "[]" ? "" : t[1] || t[0]);
}
function e0(e) {
  const t = {}, n = Object.keys(e);
  let s;
  const r = n.length;
  let o;
  for (s = 0; s < r; s++)
    o = n[s], t[o] = e[o];
  return t;
}
function Cu(e) {
  function t(n, s, r, o) {
    let i = n[o++];
    if (i === "__proto__") return !0;
    const a = Number.isFinite(+i), l = o >= n.length;
    return i = !i && I.isArray(r) ? r.length : i, l ? (I.hasOwnProp(r, i) ? r[i] = [r[i], s] : r[i] = s, !a) : ((!r[i] || !I.isObject(r[i])) && (r[i] = []), t(n, s, r[i], o) && I.isArray(r[i]) && (r[i] = e0(r[i])), !a);
  }
  if (I.isFormData(e) && I.isFunction(e.entries)) {
    const n = {};
    return I.forEachEntry(e, (s, r) => {
      t(Z2(s), r, n, 0);
    }), n;
  }
  return null;
}
function t0(e, t, n) {
  if (I.isString(e))
    try {
      return (t || JSON.parse)(e), I.trim(e);
    } catch (s) {
      if (s.name !== "SyntaxError")
        throw s;
    }
  return (0, JSON.stringify)(e);
}
const Ds = {
  transitional: Au,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(t, n) {
    const s = n.getContentType() || "", r = s.indexOf("application/json") > -1, o = I.isObject(t);
    if (o && I.isHTMLForm(t) && (t = new FormData(t)), I.isFormData(t))
      return r ? JSON.stringify(Cu(t)) : t;
    if (I.isArrayBuffer(t) || I.isBuffer(t) || I.isStream(t) || I.isFile(t) || I.isBlob(t) || I.isReadableStream(t))
      return t;
    if (I.isArrayBufferView(t))
      return t.buffer;
    if (I.isURLSearchParams(t))
      return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
    let a;
    if (o) {
      if (s.indexOf("application/x-www-form-urlencoded") > -1)
        return J2(t, this.formSerializer).toString();
      if ((a = I.isFileList(t)) || s.indexOf("multipart/form-data") > -1) {
        const l = this.env && this.env.FormData;
        return zr(
          a ? { "files[]": t } : t,
          l && new l(),
          this.formSerializer
        );
      }
    }
    return o || r ? (n.setContentType("application/json", !1), t0(t)) : t;
  }],
  transformResponse: [function(t) {
    const n = this.transitional || Ds.transitional, s = n && n.forcedJSONParsing, r = this.responseType === "json";
    if (I.isResponse(t) || I.isReadableStream(t))
      return t;
    if (t && I.isString(t) && (s && !this.responseType || r)) {
      const i = !(n && n.silentJSONParsing) && r;
      try {
        return JSON.parse(t);
      } catch (a) {
        if (i)
          throw a.name === "SyntaxError" ? oe.from(a, oe.ERR_BAD_RESPONSE, this, null, this.response) : a;
      }
    }
    return t;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: ft.classes.FormData,
    Blob: ft.classes.Blob
  },
  validateStatus: function(t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
I.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  Ds.headers[e] = {};
});
const n0 = I.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), s0 = (e) => {
  const t = {};
  let n, s, r;
  return e && e.split(`
`).forEach(function(i) {
    r = i.indexOf(":"), n = i.substring(0, r).trim().toLowerCase(), s = i.substring(r + 1).trim(), !(!n || t[n] && n0[n]) && (n === "set-cookie" ? t[n] ? t[n].push(s) : t[n] = [s] : t[n] = t[n] ? t[n] + ", " + s : s);
  }), t;
}, sl = Symbol("internals");
function ls(e) {
  return e && String(e).trim().toLowerCase();
}
function Zs(e) {
  return e === !1 || e == null ? e : I.isArray(e) ? e.map(Zs) : String(e);
}
function r0(e) {
  const t = /* @__PURE__ */ Object.create(null), n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let s;
  for (; s = n.exec(e); )
    t[s[1]] = s[2];
  return t;
}
const o0 = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function ao(e, t, n, s, r) {
  if (I.isFunction(s))
    return s.call(this, t, n);
  if (r && (t = n), !!I.isString(t)) {
    if (I.isString(s))
      return t.indexOf(s) !== -1;
    if (I.isRegExp(s))
      return s.test(t);
  }
}
function i0(e) {
  return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (t, n, s) => n.toUpperCase() + s);
}
function a0(e, t) {
  const n = I.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((s) => {
    Object.defineProperty(e, s + n, {
      value: function(r, o, i) {
        return this[s].call(this, t, r, o, i);
      },
      configurable: !0
    });
  });
}
class dt {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, s) {
    const r = this;
    function o(a, l, u) {
      const c = ls(l);
      if (!c)
        throw new Error("header name must be a non-empty string");
      const f = I.findKey(r, c);
      (!f || r[f] === void 0 || u === !0 || u === void 0 && r[f] !== !1) && (r[f || l] = Zs(a));
    }
    const i = (a, l) => I.forEach(a, (u, c) => o(u, c, l));
    if (I.isPlainObject(t) || t instanceof this.constructor)
      i(t, n);
    else if (I.isString(t) && (t = t.trim()) && !o0(t))
      i(s0(t), n);
    else if (I.isHeaders(t))
      for (const [a, l] of t.entries())
        o(l, a, s);
    else
      t != null && o(n, t, s);
    return this;
  }
  get(t, n) {
    if (t = ls(t), t) {
      const s = I.findKey(this, t);
      if (s) {
        const r = this[s];
        if (!n)
          return r;
        if (n === !0)
          return r0(r);
        if (I.isFunction(n))
          return n.call(this, r, s);
        if (I.isRegExp(n))
          return n.exec(r);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (t = ls(t), t) {
      const s = I.findKey(this, t);
      return !!(s && this[s] !== void 0 && (!n || ao(this, this[s], s, n)));
    }
    return !1;
  }
  delete(t, n) {
    const s = this;
    let r = !1;
    function o(i) {
      if (i = ls(i), i) {
        const a = I.findKey(s, i);
        a && (!n || ao(s, s[a], a, n)) && (delete s[a], r = !0);
      }
    }
    return I.isArray(t) ? t.forEach(o) : o(t), r;
  }
  clear(t) {
    const n = Object.keys(this);
    let s = n.length, r = !1;
    for (; s--; ) {
      const o = n[s];
      (!t || ao(this, this[o], o, t, !0)) && (delete this[o], r = !0);
    }
    return r;
  }
  normalize(t) {
    const n = this, s = {};
    return I.forEach(this, (r, o) => {
      const i = I.findKey(s, o);
      if (i) {
        n[i] = Zs(r), delete n[o];
        return;
      }
      const a = t ? i0(o) : String(o).trim();
      a !== o && delete n[o], n[a] = Zs(r), s[a] = !0;
    }), this;
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = /* @__PURE__ */ Object.create(null);
    return I.forEach(this, (s, r) => {
      s != null && s !== !1 && (n[r] = t && I.isArray(s) ? s.join(", ") : s);
    }), n;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const s = new this(t);
    return n.forEach((r) => s.set(r)), s;
  }
  static accessor(t) {
    const s = (this[sl] = this[sl] = {
      accessors: {}
    }).accessors, r = this.prototype;
    function o(i) {
      const a = ls(i);
      s[a] || (a0(r, i), s[a] = !0);
    }
    return I.isArray(t) ? t.forEach(o) : o(t), this;
  }
}
dt.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
I.reduceDescriptors(dt.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(s) {
      this[n] = s;
    }
  };
});
I.freezeMethods(dt);
function lo(e, t) {
  const n = this || Ds, s = t || n, r = dt.from(s.headers);
  let o = s.data;
  return I.forEach(e, function(a) {
    o = a.call(n, o, r.normalize(), t ? t.status : void 0);
  }), r.normalize(), o;
}
function Tu(e) {
  return !!(e && e.__CANCEL__);
}
function ns(e, t, n) {
  oe.call(this, e ?? "canceled", oe.ERR_CANCELED, t, n), this.name = "CanceledError";
}
I.inherits(ns, oe, {
  __CANCEL__: !0
});
function Su(e, t, n) {
  const s = n.config.validateStatus;
  !n.status || !s || s(n.status) ? e(n) : t(new oe(
    "Request failed with status code " + n.status,
    [oe.ERR_BAD_REQUEST, oe.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4],
    n.config,
    n.request,
    n
  ));
}
function l0(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return t && t[1] || "";
}
function c0(e, t) {
  e = e || 10;
  const n = new Array(e), s = new Array(e);
  let r = 0, o = 0, i;
  return t = t !== void 0 ? t : 1e3, function(l) {
    const u = Date.now(), c = s[o];
    i || (i = u), n[r] = l, s[r] = u;
    let f = o, h = 0;
    for (; f !== r; )
      h += n[f++], f = f % e;
    if (r = (r + 1) % e, r === o && (o = (o + 1) % e), u - i < t)
      return;
    const b = c && u - c;
    return b ? Math.round(h * 1e3 / b) : void 0;
  };
}
function u0(e, t) {
  let n = 0, s = 1e3 / t, r, o;
  const i = (u, c = Date.now()) => {
    n = c, r = null, o && (clearTimeout(o), o = null), e.apply(null, u);
  };
  return [(...u) => {
    const c = Date.now(), f = c - n;
    f >= s ? i(u, c) : (r = u, o || (o = setTimeout(() => {
      o = null, i(r);
    }, s - f)));
  }, () => r && i(r)];
}
const gr = (e, t, n = 3) => {
  let s = 0;
  const r = c0(50, 250);
  return u0((o) => {
    const i = o.loaded, a = o.lengthComputable ? o.total : void 0, l = i - s, u = r(l), c = i <= a;
    s = i;
    const f = {
      loaded: i,
      total: a,
      progress: a ? i / a : void 0,
      bytes: l,
      rate: u || void 0,
      estimated: u && a && c ? (a - i) / u : void 0,
      event: o,
      lengthComputable: a != null,
      [t ? "download" : "upload"]: !0
    };
    e(f);
  }, n);
}, rl = (e, t) => {
  const n = e != null;
  return [(s) => t[0]({
    lengthComputable: n,
    total: e,
    loaded: s
  }), t[1]];
}, ol = (e) => (...t) => I.asap(() => e(...t)), f0 = ft.hasStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function() {
    const t = ft.navigator && /(msie|trident)/i.test(ft.navigator.userAgent), n = document.createElement("a");
    let s;
    function r(o) {
      let i = o;
      return t && (n.setAttribute("href", i), i = n.href), n.setAttribute("href", i), {
        href: n.href,
        protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
        host: n.host,
        search: n.search ? n.search.replace(/^\?/, "") : "",
        hash: n.hash ? n.hash.replace(/^#/, "") : "",
        hostname: n.hostname,
        port: n.port,
        pathname: n.pathname.charAt(0) === "/" ? n.pathname : "/" + n.pathname
      };
    }
    return s = r(window.location.href), function(i) {
      const a = I.isString(i) ? r(i) : i;
      return a.protocol === s.protocol && a.host === s.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  /* @__PURE__ */ function() {
    return function() {
      return !0;
    };
  }()
), d0 = ft.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(e, t, n, s, r, o) {
      const i = [e + "=" + encodeURIComponent(t)];
      I.isNumber(n) && i.push("expires=" + new Date(n).toGMTString()), I.isString(s) && i.push("path=" + s), I.isString(r) && i.push("domain=" + r), o === !0 && i.push("secure"), document.cookie = i.join("; ");
    },
    read(e) {
      const t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
      return t ? decodeURIComponent(t[3]) : null;
    },
    remove(e) {
      this.write(e, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function h0(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function p0(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Ru(e, t) {
  return e && !h0(t) ? p0(e, t) : t;
}
const il = (e) => e instanceof dt ? { ...e } : e;
function $n(e, t) {
  t = t || {};
  const n = {};
  function s(u, c, f) {
    return I.isPlainObject(u) && I.isPlainObject(c) ? I.merge.call({ caseless: f }, u, c) : I.isPlainObject(c) ? I.merge({}, c) : I.isArray(c) ? c.slice() : c;
  }
  function r(u, c, f) {
    if (I.isUndefined(c)) {
      if (!I.isUndefined(u))
        return s(void 0, u, f);
    } else return s(u, c, f);
  }
  function o(u, c) {
    if (!I.isUndefined(c))
      return s(void 0, c);
  }
  function i(u, c) {
    if (I.isUndefined(c)) {
      if (!I.isUndefined(u))
        return s(void 0, u);
    } else return s(void 0, c);
  }
  function a(u, c, f) {
    if (f in t)
      return s(u, c);
    if (f in e)
      return s(void 0, u);
  }
  const l = {
    url: o,
    method: o,
    data: o,
    baseURL: i,
    transformRequest: i,
    transformResponse: i,
    paramsSerializer: i,
    timeout: i,
    timeoutMessage: i,
    withCredentials: i,
    withXSRFToken: i,
    adapter: i,
    responseType: i,
    xsrfCookieName: i,
    xsrfHeaderName: i,
    onUploadProgress: i,
    onDownloadProgress: i,
    decompress: i,
    maxContentLength: i,
    maxBodyLength: i,
    beforeRedirect: i,
    transport: i,
    httpAgent: i,
    httpsAgent: i,
    cancelToken: i,
    socketPath: i,
    responseEncoding: i,
    validateStatus: a,
    headers: (u, c) => r(il(u), il(c), !0)
  };
  return I.forEach(Object.keys(Object.assign({}, e, t)), function(c) {
    const f = l[c] || r, h = f(e[c], t[c], c);
    I.isUndefined(h) && f !== a || (n[c] = h);
  }), n;
}
const Lu = (e) => {
  const t = $n({}, e);
  let { data: n, withXSRFToken: s, xsrfHeaderName: r, xsrfCookieName: o, headers: i, auth: a } = t;
  t.headers = i = dt.from(i), t.url = Eu(Ru(t.baseURL, t.url), e.params, e.paramsSerializer), a && i.set(
    "Authorization",
    "Basic " + btoa((a.username || "") + ":" + (a.password ? unescape(encodeURIComponent(a.password)) : ""))
  );
  let l;
  if (I.isFormData(n)) {
    if (ft.hasStandardBrowserEnv || ft.hasStandardBrowserWebWorkerEnv)
      i.setContentType(void 0);
    else if ((l = i.getContentType()) !== !1) {
      const [u, ...c] = l ? l.split(";").map((f) => f.trim()).filter(Boolean) : [];
      i.setContentType([u || "multipart/form-data", ...c].join("; "));
    }
  }
  if (ft.hasStandardBrowserEnv && (s && I.isFunction(s) && (s = s(t)), s || s !== !1 && f0(t.url))) {
    const u = r && o && d0.read(o);
    u && i.set(r, u);
  }
  return t;
}, m0 = typeof XMLHttpRequest < "u", g0 = m0 && function(e) {
  return new Promise(function(n, s) {
    const r = Lu(e);
    let o = r.data;
    const i = dt.from(r.headers).normalize();
    let { responseType: a, onUploadProgress: l, onDownloadProgress: u } = r, c, f, h, b, _;
    function w() {
      b && b(), _ && _(), r.cancelToken && r.cancelToken.unsubscribe(c), r.signal && r.signal.removeEventListener("abort", c);
    }
    let x = new XMLHttpRequest();
    x.open(r.method.toUpperCase(), r.url, !0), x.timeout = r.timeout;
    function g() {
      if (!x)
        return;
      const T = dt.from(
        "getAllResponseHeaders" in x && x.getAllResponseHeaders()
      ), M = {
        data: !a || a === "text" || a === "json" ? x.responseText : x.response,
        status: x.status,
        statusText: x.statusText,
        headers: T,
        config: e,
        request: x
      };
      Su(function(O) {
        n(O), w();
      }, function(O) {
        s(O), w();
      }, M), x = null;
    }
    "onloadend" in x ? x.onloadend = g : x.onreadystatechange = function() {
      !x || x.readyState !== 4 || x.status === 0 && !(x.responseURL && x.responseURL.indexOf("file:") === 0) || setTimeout(g);
    }, x.onabort = function() {
      x && (s(new oe("Request aborted", oe.ECONNABORTED, e, x)), x = null);
    }, x.onerror = function() {
      s(new oe("Network Error", oe.ERR_NETWORK, e, x)), x = null;
    }, x.ontimeout = function() {
      let k = r.timeout ? "timeout of " + r.timeout + "ms exceeded" : "timeout exceeded";
      const M = r.transitional || Au;
      r.timeoutErrorMessage && (k = r.timeoutErrorMessage), s(new oe(
        k,
        M.clarifyTimeoutError ? oe.ETIMEDOUT : oe.ECONNABORTED,
        e,
        x
      )), x = null;
    }, o === void 0 && i.setContentType(null), "setRequestHeader" in x && I.forEach(i.toJSON(), function(k, M) {
      x.setRequestHeader(M, k);
    }), I.isUndefined(r.withCredentials) || (x.withCredentials = !!r.withCredentials), a && a !== "json" && (x.responseType = r.responseType), u && ([h, _] = gr(u, !0), x.addEventListener("progress", h)), l && x.upload && ([f, b] = gr(l), x.upload.addEventListener("progress", f), x.upload.addEventListener("loadend", b)), (r.cancelToken || r.signal) && (c = (T) => {
      x && (s(!T || T.type ? new ns(null, e, x) : T), x.abort(), x = null);
    }, r.cancelToken && r.cancelToken.subscribe(c), r.signal && (r.signal.aborted ? c() : r.signal.addEventListener("abort", c)));
    const A = l0(r.url);
    if (A && ft.protocols.indexOf(A) === -1) {
      s(new oe("Unsupported protocol " + A + ":", oe.ERR_BAD_REQUEST, e));
      return;
    }
    x.send(o || null);
  });
}, _0 = (e, t) => {
  const { length: n } = e = e ? e.filter(Boolean) : [];
  if (t || n) {
    let s = new AbortController(), r;
    const o = function(u) {
      if (!r) {
        r = !0, a();
        const c = u instanceof Error ? u : this.reason;
        s.abort(c instanceof oe ? c : new ns(c instanceof Error ? c.message : c));
      }
    };
    let i = t && setTimeout(() => {
      i = null, o(new oe(`timeout ${t} of ms exceeded`, oe.ETIMEDOUT));
    }, t);
    const a = () => {
      e && (i && clearTimeout(i), i = null, e.forEach((u) => {
        u.unsubscribe ? u.unsubscribe(o) : u.removeEventListener("abort", o);
      }), e = null);
    };
    e.forEach((u) => u.addEventListener("abort", o));
    const { signal: l } = s;
    return l.unsubscribe = () => I.asap(a), l;
  }
}, b0 = function* (e, t) {
  let n = e.byteLength;
  if (n < t) {
    yield e;
    return;
  }
  let s = 0, r;
  for (; s < n; )
    r = s + t, yield e.slice(s, r), s = r;
}, v0 = async function* (e, t) {
  for await (const n of y0(e))
    yield* b0(n, t);
}, y0 = async function* (e) {
  if (e[Symbol.asyncIterator]) {
    yield* e;
    return;
  }
  const t = e.getReader();
  try {
    for (; ; ) {
      const { done: n, value: s } = await t.read();
      if (n)
        break;
      yield s;
    }
  } finally {
    await t.cancel();
  }
}, al = (e, t, n, s) => {
  const r = v0(e, t);
  let o = 0, i, a = (l) => {
    i || (i = !0, s && s(l));
  };
  return new ReadableStream({
    async pull(l) {
      try {
        const { done: u, value: c } = await r.next();
        if (u) {
          a(), l.close();
          return;
        }
        let f = c.byteLength;
        if (n) {
          let h = o += f;
          n(h);
        }
        l.enqueue(new Uint8Array(c));
      } catch (u) {
        throw a(u), u;
      }
    },
    cancel(l) {
      return a(l), r.return();
    }
  }, {
    highWaterMark: 2
  });
}, jr = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Iu = jr && typeof ReadableStream == "function", w0 = jr && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((e) => (t) => e.encode(t))(new TextEncoder()) : async (e) => new Uint8Array(await new Response(e).arrayBuffer())), Mu = (e, ...t) => {
  try {
    return !!e(...t);
  } catch {
    return !1;
  }
}, k0 = Iu && Mu(() => {
  let e = !1;
  const t = new Request(ft.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return e = !0, "half";
    }
  }).headers.has("Content-Type");
  return e && !t;
}), ll = 64 * 1024, Ho = Iu && Mu(() => I.isReadableStream(new Response("").body)), _r = {
  stream: Ho && ((e) => e.body)
};
jr && ((e) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
    !_r[t] && (_r[t] = I.isFunction(e[t]) ? (n) => n[t]() : (n, s) => {
      throw new oe(`Response type '${t}' is not supported`, oe.ERR_NOT_SUPPORT, s);
    });
  });
})(new Response());
const x0 = async (e) => {
  if (e == null)
    return 0;
  if (I.isBlob(e))
    return e.size;
  if (I.isSpecCompliantForm(e))
    return (await new Request(ft.origin, {
      method: "POST",
      body: e
    }).arrayBuffer()).byteLength;
  if (I.isArrayBufferView(e) || I.isArrayBuffer(e))
    return e.byteLength;
  if (I.isURLSearchParams(e) && (e = e + ""), I.isString(e))
    return (await w0(e)).byteLength;
}, E0 = async (e, t) => {
  const n = I.toFiniteNumber(e.getContentLength());
  return n ?? x0(t);
}, A0 = jr && (async (e) => {
  let {
    url: t,
    method: n,
    data: s,
    signal: r,
    cancelToken: o,
    timeout: i,
    onDownloadProgress: a,
    onUploadProgress: l,
    responseType: u,
    headers: c,
    withCredentials: f = "same-origin",
    fetchOptions: h
  } = Lu(e);
  u = u ? (u + "").toLowerCase() : "text";
  let b = _0([r, o && o.toAbortSignal()], i), _;
  const w = b && b.unsubscribe && (() => {
    b.unsubscribe();
  });
  let x;
  try {
    if (l && k0 && n !== "get" && n !== "head" && (x = await E0(c, s)) !== 0) {
      let M = new Request(t, {
        method: "POST",
        body: s,
        duplex: "half"
      }), P;
      if (I.isFormData(s) && (P = M.headers.get("content-type")) && c.setContentType(P), M.body) {
        const [O, X] = rl(
          x,
          gr(ol(l))
        );
        s = al(M.body, ll, O, X);
      }
    }
    I.isString(f) || (f = f ? "include" : "omit");
    const g = "credentials" in Request.prototype;
    _ = new Request(t, {
      ...h,
      signal: b,
      method: n.toUpperCase(),
      headers: c.normalize().toJSON(),
      body: s,
      duplex: "half",
      credentials: g ? f : void 0
    });
    let A = await fetch(_);
    const T = Ho && (u === "stream" || u === "response");
    if (Ho && (a || T && w)) {
      const M = {};
      ["status", "statusText", "headers"].forEach((W) => {
        M[W] = A[W];
      });
      const P = I.toFiniteNumber(A.headers.get("content-length")), [O, X] = a && rl(
        P,
        gr(ol(a), !0)
      ) || [];
      A = new Response(
        al(A.body, ll, O, () => {
          X && X(), w && w();
        }),
        M
      );
    }
    u = u || "text";
    let k = await _r[I.findKey(_r, u) || "text"](A, e);
    return !T && w && w(), await new Promise((M, P) => {
      Su(M, P, {
        data: k,
        headers: dt.from(A.headers),
        status: A.status,
        statusText: A.statusText,
        config: e,
        request: _
      });
    });
  } catch (g) {
    throw w && w(), g && g.name === "TypeError" && /fetch/i.test(g.message) ? Object.assign(
      new oe("Network Error", oe.ERR_NETWORK, e, _),
      {
        cause: g.cause || g
      }
    ) : oe.from(g, g && g.code, e, _);
  }
}), zo = {
  http: U2,
  xhr: g0,
  fetch: A0
};
I.forEach(zo, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {
    }
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const cl = (e) => `- ${e}`, C0 = (e) => I.isFunction(e) || e === null || e === !1, Ou = {
  getAdapter: (e) => {
    e = I.isArray(e) ? e : [e];
    const { length: t } = e;
    let n, s;
    const r = {};
    for (let o = 0; o < t; o++) {
      n = e[o];
      let i;
      if (s = n, !C0(n) && (s = zo[(i = String(n)).toLowerCase()], s === void 0))
        throw new oe(`Unknown adapter '${i}'`);
      if (s)
        break;
      r[i || "#" + o] = s;
    }
    if (!s) {
      const o = Object.entries(r).map(
        ([a, l]) => `adapter ${a} ` + (l === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let i = t ? o.length > 1 ? `since :
` + o.map(cl).join(`
`) : " " + cl(o[0]) : "as no adapter specified";
      throw new oe(
        "There is no suitable adapter to dispatch the request " + i,
        "ERR_NOT_SUPPORT"
      );
    }
    return s;
  },
  adapters: zo
};
function co(e) {
  if (e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)
    throw new ns(null, e);
}
function ul(e) {
  return co(e), e.headers = dt.from(e.headers), e.data = lo.call(
    e,
    e.transformRequest
  ), ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1), Ou.getAdapter(e.adapter || Ds.adapter)(e).then(function(s) {
    return co(e), s.data = lo.call(
      e,
      e.transformResponse,
      s
    ), s.headers = dt.from(s.headers), s;
  }, function(s) {
    return Tu(s) || (co(e), s && s.response && (s.response.data = lo.call(
      e,
      e.transformResponse,
      s.response
    ), s.response.headers = dt.from(s.response.headers))), Promise.reject(s);
  });
}
const Nu = "1.7.7", Ci = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  Ci[e] = function(s) {
    return typeof s === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const fl = {};
Ci.transitional = function(t, n, s) {
  function r(o, i) {
    return "[Axios v" + Nu + "] Transitional option '" + o + "'" + i + (s ? ". " + s : "");
  }
  return (o, i, a) => {
    if (t === !1)
      throw new oe(
        r(i, " has been removed" + (n ? " in " + n : "")),
        oe.ERR_DEPRECATED
      );
    return n && !fl[i] && (fl[i] = !0, console.warn(
      r(
        i,
        " has been deprecated since v" + n + " and will be removed in the near future"
      )
    )), t ? t(o, i, a) : !0;
  };
};
function T0(e, t, n) {
  if (typeof e != "object")
    throw new oe("options must be an object", oe.ERR_BAD_OPTION_VALUE);
  const s = Object.keys(e);
  let r = s.length;
  for (; r-- > 0; ) {
    const o = s[r], i = t[o];
    if (i) {
      const a = e[o], l = a === void 0 || i(a, o, e);
      if (l !== !0)
        throw new oe("option " + o + " must be " + l, oe.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0)
      throw new oe("Unknown option " + o, oe.ERR_BAD_OPTION);
  }
}
const jo = {
  assertOptions: T0,
  validators: Ci
}, rn = jo.validators;
class Rn {
  constructor(t) {
    this.defaults = t, this.interceptors = {
      request: new nl(),
      response: new nl()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (s) {
      if (s instanceof Error) {
        let r;
        Error.captureStackTrace ? Error.captureStackTrace(r = {}) : r = new Error();
        const o = r.stack ? r.stack.replace(/^.+\n/, "") : "";
        try {
          s.stack ? o && !String(s.stack).endsWith(o.replace(/^.+\n.+\n/, "")) && (s.stack += `
` + o) : s.stack = o;
        } catch {
        }
      }
      throw s;
    }
  }
  _request(t, n) {
    typeof t == "string" ? (n = n || {}, n.url = t) : n = t || {}, n = $n(this.defaults, n);
    const { transitional: s, paramsSerializer: r, headers: o } = n;
    s !== void 0 && jo.assertOptions(s, {
      silentJSONParsing: rn.transitional(rn.boolean),
      forcedJSONParsing: rn.transitional(rn.boolean),
      clarifyTimeoutError: rn.transitional(rn.boolean)
    }, !1), r != null && (I.isFunction(r) ? n.paramsSerializer = {
      serialize: r
    } : jo.assertOptions(r, {
      encode: rn.function,
      serialize: rn.function
    }, !0)), n.method = (n.method || this.defaults.method || "get").toLowerCase();
    let i = o && I.merge(
      o.common,
      o[n.method]
    );
    o && I.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (_) => {
        delete o[_];
      }
    ), n.headers = dt.concat(i, o);
    const a = [];
    let l = !0;
    this.interceptors.request.forEach(function(w) {
      typeof w.runWhen == "function" && w.runWhen(n) === !1 || (l = l && w.synchronous, a.unshift(w.fulfilled, w.rejected));
    });
    const u = [];
    this.interceptors.response.forEach(function(w) {
      u.push(w.fulfilled, w.rejected);
    });
    let c, f = 0, h;
    if (!l) {
      const _ = [ul.bind(this), void 0];
      for (_.unshift.apply(_, a), _.push.apply(_, u), h = _.length, c = Promise.resolve(n); f < h; )
        c = c.then(_[f++], _[f++]);
      return c;
    }
    h = a.length;
    let b = n;
    for (f = 0; f < h; ) {
      const _ = a[f++], w = a[f++];
      try {
        b = _(b);
      } catch (x) {
        w.call(this, x);
        break;
      }
    }
    try {
      c = ul.call(this, b);
    } catch (_) {
      return Promise.reject(_);
    }
    for (f = 0, h = u.length; f < h; )
      c = c.then(u[f++], u[f++]);
    return c;
  }
  getUri(t) {
    t = $n(this.defaults, t);
    const n = Ru(t.baseURL, t.url);
    return Eu(n, t.params, t.paramsSerializer);
  }
}
I.forEach(["delete", "get", "head", "options"], function(t) {
  Rn.prototype[t] = function(n, s) {
    return this.request($n(s || {}, {
      method: t,
      url: n,
      data: (s || {}).data
    }));
  };
});
I.forEach(["post", "put", "patch"], function(t) {
  function n(s) {
    return function(o, i, a) {
      return this.request($n(a || {}, {
        method: t,
        headers: s ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: o,
        data: i
      }));
    };
  }
  Rn.prototype[t] = n(), Rn.prototype[t + "Form"] = n(!0);
});
class Ti {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function(o) {
      n = o;
    });
    const s = this;
    this.promise.then((r) => {
      if (!s._listeners) return;
      let o = s._listeners.length;
      for (; o-- > 0; )
        s._listeners[o](r);
      s._listeners = null;
    }), this.promise.then = (r) => {
      let o;
      const i = new Promise((a) => {
        s.subscribe(a), o = a;
      }).then(r);
      return i.cancel = function() {
        s.unsubscribe(o);
      }, i;
    }, t(function(o, i, a) {
      s.reason || (s.reason = new ns(o, i, a), n(s.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : this._listeners = [t];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(t) {
    if (!this._listeners)
      return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(), n = (s) => {
      t.abort(s);
    };
    return this.subscribe(n), t.signal.unsubscribe = () => this.unsubscribe(n), t.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let t;
    return {
      token: new Ti(function(r) {
        t = r;
      }),
      cancel: t
    };
  }
}
function S0(e) {
  return function(n) {
    return e.apply(null, n);
  };
}
function R0(e) {
  return I.isObject(e) && e.isAxiosError === !0;
}
const Vo = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(Vo).forEach(([e, t]) => {
  Vo[t] = e;
});
function $u(e) {
  const t = new Rn(e), n = du(Rn.prototype.request, t);
  return I.extend(n, Rn.prototype, t, { allOwnKeys: !0 }), I.extend(n, t, null, { allOwnKeys: !0 }), n.create = function(r) {
    return $u($n(e, r));
  }, n;
}
const He = $u(Ds);
He.Axios = Rn;
He.CanceledError = ns;
He.CancelToken = Ti;
He.isCancel = Tu;
He.VERSION = Nu;
He.toFormData = zr;
He.AxiosError = oe;
He.Cancel = He.CanceledError;
He.all = function(t) {
  return Promise.all(t);
};
He.spread = S0;
He.isAxiosError = R0;
He.mergeConfig = $n;
He.AxiosHeaders = dt;
He.formToJSON = (e) => Cu(I.isHTMLForm(e) ? new FormData(e) : e);
He.getAdapter = Ou.getAdapter;
He.HttpStatusCode = Vo;
He.default = He;
const uo = He.create({
  baseURL: void 0,
  timeout: 1e4,
  withCredentials: !0,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFTOKEN",
  withXSRFToken: !0,
  headers: {
    "Content-Type": "application/json"
  }
}), er = {
  /**
   *
   * @param {{
   *   text_input: ?String,
   *   audio_input: ?Blob,
   *   faq_id: ?Number
   * }} data
   * @param {Array} messages
   * @param {String} lang
   * @param updateHandler
   * @returns {Promise<void>}
   */
  async sendMessage(e, t, n, s) {
    let o = document.getElementById("hw-chatbot-widget").dataset.chatbotId;
    const i = "/chat/", a = new FormData();
    if (a.append("chatbot_id", o), "text_input" in e && a.append("text_input", e.text_input), "audio_input" in e && a.append("audio_input", e.audio_input), "faqId" in e && e.faqId && a.append("faq_id", parseInt(e.faqId)), t && t.length > 0)
      for (let h = 0; h < t.length; h++)
        a.append("messages[]", JSON.stringify(t[h]));
    const u = (await uo.post(i, a, {
      headers: {
        "Accept-Language": n,
        "Content-Type": "multipart/form-data"
      },
      responseType: "stream",
      adapter: "fetch"
    })).data.getReader(), c = new TextDecoder();
    let f = "";
    for (; ; ) {
      const { done: h, value: b } = await u.read();
      if (h) break;
      const _ = c.decode(b, { stream: !0 });
      f += _;
      const w = f.split(`
`).filter(Boolean);
      for (const x of w)
        try {
          const g = JSON.parse(x);
          s(g), f = "";
        } catch {
        }
    }
  },
  async tts(e, t) {
    const n = "/tts/";
    try {
      return await uo.post(
        n,
        {
          text: e,
          language: t
        },
        {
          responseType: "arraybuffer"
        }
      );
    } catch (s) {
      console.error(s);
    }
  },
  /**
   *
   * @returns {Promise<{borderRadius: string, contact: {name: string, email: string}, primaryColor: string, logo: string, avatar: string, textColor: string}>}
   */
  async loadConfig(e) {
    const t = `/chatbot-config/${e}/`;
    try {
      return (await uo.get(t)).data;
    } catch (n) {
      console.error(n);
    }
  }
}, L0 = {
  __name: "LoadingIndicator",
  props: {
    size: {
      type: String,
      default: "50px"
    }
  },
  setup(e) {
    const t = e;
    return (n, s) => (N(), B("div", {
      class: "loader",
      style: Ln({
        width: t.size,
        height: t.size
      })
    }, null, 4));
  }
}, Pu = /* @__PURE__ */ Qe(L0, [["__scopeId", "data-v-82874800"]]), I0 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 16 16"
};
function M0(e, t) {
  return N(), B("svg", I0, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h16v16H0Z"
    }, null, -1),
    C("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "1.5",
      d: "M2 11.334a.667.667 0 0 1 .667-.667h2a.667.667 0 0 1 .667.667v2a.667.667 0 0 1-.667.667h-2A.667.667 0 0 1 2 13.334ZM2.667 8V4A1.333 1.333 0 0 1 4 2.667h8A1.333 1.333 0 0 1 13.333 4v8A1.333 1.333 0 0 1 12 13.333H8"
    }, null, -1),
    C("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "1.5",
      d: "M8 5.333h2.667V8M10.666 5.333 7.333 8.666"
    }, null, -1)
  ]));
}
const O0 = { render: M0 }, N0 = { class: "chat-message-image" }, $0 = ["href", "title"], P0 = ["src", "alt", "aria-describedby"], D0 = ["src", "alt", "aria-describedby"], F0 = ["id"], B0 = { class: "chat-message-image__footer" }, U0 = { class: "chat-message-image__actions" }, H0 = ["href"], z0 = { class: "sr-only" }, j0 = {
  __name: "ChatMessageImage",
  props: {
    src: {
      type: String
    },
    altText: {
      type: String
    },
    description: {
      type: String
    },
    source: {
      type: String
    }
  },
  setup(e) {
    const { t } = yt(), n = e, s = jt(), r = V(s.uid);
    return (o, i) => (N(), B("div", N0, [
      e.source ? (N(), B("a", {
        key: 0,
        href: e.source,
        title: n.altText,
        target: "_blank"
      }, [
        C("img", {
          src: n.src,
          alt: n.altText,
          "aria-describedby": n.description ? r.value : ""
        }, null, 8, P0)
      ], 8, $0)) : (N(), B("img", {
        key: 1,
        src: n.src,
        alt: n.altText,
        "aria-describedby": n.description ? r.value : ""
      }, null, 8, D0)),
      n.description ? (N(), B("p", {
        key: 2,
        class: "sr-only",
        id: r.value
      }, ee(n.description), 9, F0)) : we("", !0),
      C("footer", B0, [
        C("div", null, [
          C("p", null, ee(n.altText), 1)
        ]),
        C("div", U0, [
          e.source ? (N(), B("a", {
            key: 0,
            href: e.source,
            class: "chat-message-image__source",
            target: "_blank"
          }, [
            q(H(O0), {
              height: "24",
              "aria-hidden": "true"
            }),
            C("span", z0, ee(H(t)("openImageInNewTab")), 1)
          ], 8, H0)) : we("", !0)
        ])
      ])
    ]));
  }
}, V0 = /* @__PURE__ */ Qe(j0, [["__scopeId", "data-v-adb502dd"]]), W0 = {
  __name: "IconHover",
  props: {
    icon: {
      type: Object
    },
    iconHover: {
      type: Object
    },
    isHovered: {
      type: Boolean
    },
    hoverColor: {
      type: String
    },
    defaultColor: {
      type: String,
      required: !1
    }
  },
  setup(e) {
    const t = e;
    return (n, s) => (N(), rt(vs, {
      name: "icon-hover",
      mode: "out-in"
    }, {
      default: An(() => [
        t.isHovered ? (N(), rt(rr(t.iconHover), {
          key: 0,
          color: t.hoverColor,
          "aria-hidden": "true"
        }, null, 8, ["color"])) : (N(), rt(rr(t.icon), {
          key: 1,
          color: t.defaultColor,
          "aria-hidden": "true"
        }, null, 8, ["color"]))
      ]),
      _: 1
    }));
  }
}, Rt = /* @__PURE__ */ Qe(W0, [["__scopeId", "data-v-32897788"]]);
async function K0(e) {
  const t = document.createElement("video"), n = new Promise((s, r) => {
    t.addEventListener("loadedmetadata", () => {
      t.duration === 1 / 0 ? (t.currentTime = Number.MAX_SAFE_INTEGER, t.ontimeupdate = () => {
        t.ontimeupdate = null, s(t.duration), t.currentTime = 0;
      }) : s(t.duration);
    }), t.onerror = (o) => r(o.target.error);
  });
  return t.src = typeof e == "string" || e instanceof String ? e : window.URL.createObjectURL(e), n;
}
function br(e) {
  const t = Math.floor(e / 60), n = Math.round(e % 60);
  return `${t}:${n.toString().padStart(2, "0")}`;
}
function dl(e) {
  return `${Math.floor(e / 1e3).toString().padStart(2, "0")}`;
}
const q0 = { class: "audio-player" }, G0 = { class: "sr-only" }, Y0 = { class: "sr-only" }, Q0 = {
  __name: "ChatMessageAudio",
  props: {
    audioUrl: {
      type: String
    },
    audioBlob: {
      type: Blob
    },
    primaryColor: {
      type: String
    }
  },
  setup(e) {
    const { t } = yt(), n = e, s = V(!1), r = V(0), o = V(0), i = V(!1), a = V(!1), l = V(new Audio(n.audioUrl));
    l.value.onloadedmetadata = async () => {
      l.value.duration === 1 / 0 ? o.value = await K0(n.audioBlob) : o.value = l.value.duration;
    }, l.value.ontimeupdate = () => {
      r.value = l.value.currentTime;
    }, l.value.onended = () => {
      s.value = !1, r.value = 0;
    };
    const u = () => {
      s.value = !0, l.value.play();
    }, c = () => {
      s.value = !1, l.value.pause();
    };
    return (f, h) => (N(), B("div", q0, [
      s.value ? we("", !0) : (N(), B("button", {
        key: 0,
        class: "default-action",
        type: "button",
        onClick: u,
        onMouseenter: h[0] || (h[0] = (b) => i.value = !0),
        onMouseleave: h[1] || (h[1] = (b) => i.value = !1)
      }, [
        q(Rt, {
          icon: H(ki),
          "default-color": e.primaryColor,
          "icon-hover": H(fu),
          "hover-color": e.primaryColor,
          "is-hovered": i.value,
          "aria-hidden": "true"
        }, null, 8, ["icon", "default-color", "icon-hover", "hover-color", "is-hovered"]),
        C("span", G0, ee(H(t)("screenReader.playAction")), 1)
      ], 32)),
      s.value ? (N(), B("button", {
        key: 1,
        class: "default-action",
        type: "button",
        onClick: c,
        onMouseenter: h[2] || (h[2] = (b) => a.value = !0),
        onMouseleave: h[3] || (h[3] = (b) => a.value = !1)
      }, [
        q(Rt, {
          icon: H(pr),
          "default-color": e.primaryColor,
          "icon-hover": H(mr),
          "hover-color": e.primaryColor,
          "is-hovered": a.value,
          "aria-hidden": "true"
        }, null, 8, ["icon", "default-color", "icon-hover", "hover-color", "is-hovered"]),
        C("span", Y0, ee(H(t)("screenReader.pauseAction")), 1)
      ], 32)) : we("", !0),
      C("span", {
        style: Ln({
          color: e.primaryColor
        }),
        class: "audio-player__time"
      }, ee(H(br)(r.value)) + " / " + ee(H(br)(o.value)) + "s", 5)
    ]));
  }
}, X0 = /* @__PURE__ */ Qe(Q0, [["__scopeId", "data-v-146c8366"]]);
function Si() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
let Dn = Si();
function Du(e) {
  Dn = e;
}
const ys = { exec: () => null };
function Ce(e, t = "") {
  let n = typeof e == "string" ? e : e.source;
  const s = {
    replace: (r, o) => {
      let i = typeof o == "string" ? o : o.source;
      return i = i.replace(ot.caret, "$1"), n = n.replace(r, i), s;
    },
    getRegex: () => new RegExp(n, t)
  };
  return s;
}
const ot = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`),
  htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i")
}, J0 = /^(?:[ \t]*(?:\n|$))+/, Z0 = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, em = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Fs = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, tm = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Fu = /(?:[*+-]|\d{1,9}[.)])/, Bu = Ce(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, Fu).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), Ri = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, nm = /^[^\n]+/, Li = /(?!\s*\])(?:\\.|[^\[\]\\])+/, sm = Ce(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Li).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), rm = Ce(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Fu).getRegex(), Vr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ii = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, om = Ce("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Ii).replace("tag", Vr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Uu = Ce(Ri).replace("hr", Fs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vr).getRegex(), im = Ce(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Uu).getRegex(), Mi = {
  blockquote: im,
  code: Z0,
  def: sm,
  fences: em,
  heading: tm,
  hr: Fs,
  html: om,
  lheading: Bu,
  list: rm,
  newline: J0,
  paragraph: Uu,
  table: ys,
  text: nm
}, hl = Ce("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Fs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vr).getRegex(), am = {
  ...Mi,
  table: hl,
  paragraph: Ce(Ri).replace("hr", Fs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", hl).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Vr).getRegex()
}, lm = {
  ...Mi,
  html: Ce(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Ii).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: ys,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: Ce(Ri).replace("hr", Fs).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Bu).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Hu = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, cm = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, zu = /^( {2,}|\\)\n(?!\s*$)/, um = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Bs = "\\p{P}\\p{S}", fm = Ce(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, Bs).getRegex(), dm = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, hm = Ce(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, Bs).getRegex(), pm = Ce("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, Bs).getRegex(), mm = Ce("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, Bs).getRegex(), gm = Ce(/\\([punct])/, "gu").replace(/punct/g, Bs).getRegex(), _m = Ce(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), bm = Ce(Ii).replace("(?:-->|$)", "-->").getRegex(), vm = Ce("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", bm).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), vr = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, ym = Ce(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", vr).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ju = Ce(/^!?\[(label)\]\[(ref)\]/).replace("label", vr).replace("ref", Li).getRegex(), Vu = Ce(/^!?\[(ref)\](?:\[\])?/).replace("ref", Li).getRegex(), wm = Ce("reflink|nolink(?!\\()", "g").replace("reflink", ju).replace("nolink", Vu).getRegex(), Oi = {
  _backpedal: ys,
  // only used for GFM url
  anyPunctuation: gm,
  autolink: _m,
  blockSkip: dm,
  br: zu,
  code: cm,
  del: ys,
  emStrongLDelim: hm,
  emStrongRDelimAst: pm,
  emStrongRDelimUnd: mm,
  escape: Hu,
  link: ym,
  nolink: Vu,
  punctuation: fm,
  reflink: ju,
  reflinkSearch: wm,
  tag: vm,
  text: um,
  url: ys
}, km = {
  ...Oi,
  link: Ce(/^!?\[(label)\]\((.*?)\)/).replace("label", vr).getRegex(),
  reflink: Ce(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", vr).getRegex()
}, Wo = {
  ...Oi,
  escape: Ce(Hu).replace("])", "~|])").getRegex(),
  url: Ce(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, xm = {
  ...Wo,
  br: Ce(zu).replace("{2,}", "*").getRegex(),
  text: Ce(Wo.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, qs = {
  normal: Mi,
  gfm: am,
  pedantic: lm
}, cs = {
  normal: Oi,
  gfm: Wo,
  breaks: xm,
  pedantic: km
}, Em = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, pl = (e) => Em[e];
function Pt(e, t) {
  if (t) {
    if (ot.escapeTest.test(e))
      return e.replace(ot.escapeReplace, pl);
  } else if (ot.escapeTestNoEncode.test(e))
    return e.replace(ot.escapeReplaceNoEncode, pl);
  return e;
}
function ml(e) {
  try {
    e = encodeURI(e).replace(ot.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function gl(e, t) {
  const n = e.replace(ot.findPipe, (o, i, a) => {
    let l = !1, u = i;
    for (; --u >= 0 && a[u] === "\\"; )
      l = !l;
    return l ? "|" : " |";
  }), s = n.split(ot.splitPipe);
  let r = 0;
  if (s[0].trim() || s.shift(), s.length > 0 && !s[s.length - 1].trim() && s.pop(), t)
    if (s.length > t)
      s.splice(t);
    else
      for (; s.length < t; )
        s.push("");
  for (; r < s.length; r++)
    s[r] = s[r].trim().replace(ot.slashPipe, "|");
  return s;
}
function us(e, t, n) {
  const s = e.length;
  if (s === 0)
    return "";
  let r = 0;
  for (; r < s; ) {
    const o = e.charAt(s - r - 1);
    if (o === t && !n)
      r++;
    else if (o !== t && n)
      r++;
    else
      break;
  }
  return e.slice(0, s - r);
}
function Am(e, t) {
  if (e.indexOf(t[1]) === -1)
    return -1;
  let n = 0;
  for (let s = 0; s < e.length; s++)
    if (e[s] === "\\")
      s++;
    else if (e[s] === t[0])
      n++;
    else if (e[s] === t[1] && (n--, n < 0))
      return s;
  return -1;
}
function _l(e, t, n, s, r) {
  const o = t.href, i = t.title || null, a = e[1].replace(r.other.outputLinkReplace, "$1");
  if (e[0].charAt(0) !== "!") {
    s.state.inLink = !0;
    const l = {
      type: "link",
      raw: n,
      href: o,
      title: i,
      text: a,
      tokens: s.inlineTokens(a)
    };
    return s.state.inLink = !1, l;
  }
  return {
    type: "image",
    raw: n,
    href: o,
    title: i,
    text: a
  };
}
function Cm(e, t, n) {
  const s = e.match(n.other.indentCodeCompensation);
  if (s === null)
    return t;
  const r = s[1];
  return t.split(`
`).map((o) => {
    const i = o.match(n.other.beginningSpace);
    if (i === null)
      return o;
    const [a] = i;
    return a.length >= r.length ? o.slice(r.length) : o;
  }).join(`
`);
}
class yr {
  // set by the lexer
  constructor(t) {
    Se(this, "options");
    Se(this, "rules");
    // set by the lexer
    Se(this, "lexer");
    this.options = t || Dn;
  }
  space(t) {
    const n = this.rules.block.newline.exec(t);
    if (n && n[0].length > 0)
      return {
        type: "space",
        raw: n[0]
      };
  }
  code(t) {
    const n = this.rules.block.code.exec(t);
    if (n) {
      const s = n[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: n[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? s : us(s, `
`)
      };
    }
  }
  fences(t) {
    const n = this.rules.block.fences.exec(t);
    if (n) {
      const s = n[0], r = Cm(s, n[3] || "", this.rules);
      return {
        type: "code",
        raw: s,
        lang: n[2] ? n[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : n[2],
        text: r
      };
    }
  }
  heading(t) {
    const n = this.rules.block.heading.exec(t);
    if (n) {
      let s = n[2].trim();
      if (this.rules.other.endingHash.test(s)) {
        const r = us(s, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (s = r.trim());
      }
      return {
        type: "heading",
        raw: n[0],
        depth: n[1].length,
        text: s,
        tokens: this.lexer.inline(s)
      };
    }
  }
  hr(t) {
    const n = this.rules.block.hr.exec(t);
    if (n)
      return {
        type: "hr",
        raw: us(n[0], `
`)
      };
  }
  blockquote(t) {
    const n = this.rules.block.blockquote.exec(t);
    if (n) {
      let s = us(n[0], `
`).split(`
`), r = "", o = "";
      const i = [];
      for (; s.length > 0; ) {
        let a = !1;
        const l = [];
        let u;
        for (u = 0; u < s.length; u++)
          if (this.rules.other.blockquoteStart.test(s[u]))
            l.push(s[u]), a = !0;
          else if (!a)
            l.push(s[u]);
          else
            break;
        s = s.slice(u);
        const c = l.join(`
`), f = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${c}` : c, o = o ? `${o}
${f}` : f;
        const h = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(f, i, !0), this.lexer.state.top = h, s.length === 0)
          break;
        const b = i[i.length - 1];
        if ((b == null ? void 0 : b.type) === "code")
          break;
        if ((b == null ? void 0 : b.type) === "blockquote") {
          const _ = b, w = _.raw + `
` + s.join(`
`), x = this.blockquote(w);
          i[i.length - 1] = x, r = r.substring(0, r.length - _.raw.length) + x.raw, o = o.substring(0, o.length - _.text.length) + x.text;
          break;
        } else if ((b == null ? void 0 : b.type) === "list") {
          const _ = b, w = _.raw + `
` + s.join(`
`), x = this.list(w);
          i[i.length - 1] = x, r = r.substring(0, r.length - b.raw.length) + x.raw, o = o.substring(0, o.length - _.raw.length) + x.raw, s = w.substring(i[i.length - 1].raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: r,
        tokens: i,
        text: o
      };
    }
  }
  list(t) {
    let n = this.rules.block.list.exec(t);
    if (n) {
      let s = n[1].trim();
      const r = s.length > 1, o = {
        type: "list",
        raw: "",
        ordered: r,
        start: r ? +s.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      s = r ? `\\d{1,9}\\${s.slice(-1)}` : `\\${s}`, this.options.pedantic && (s = r ? s : "[*+-]");
      const i = this.rules.other.listItemRegex(s);
      let a = !1;
      for (; t; ) {
        let l = !1, u = "", c = "";
        if (!(n = i.exec(t)) || this.rules.block.hr.test(t))
          break;
        u = n[0], t = t.substring(u.length);
        let f = n[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (g) => " ".repeat(3 * g.length)), h = t.split(`
`, 1)[0], b = !f.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, c = f.trimStart()) : b ? _ = n[1].length + 1 : (_ = n[2].search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, c = f.slice(_), _ += n[1].length), b && this.rules.other.blankLine.test(h) && (u += h + `
`, t = t.substring(h.length + 1), l = !0), !l) {
          const g = this.rules.other.nextBulletRegex(_), A = this.rules.other.hrRegex(_), T = this.rules.other.fencesBeginRegex(_), k = this.rules.other.headingBeginRegex(_), M = this.rules.other.htmlBeginRegex(_);
          for (; t; ) {
            const P = t.split(`
`, 1)[0];
            let O;
            if (h = P, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), O = h) : O = h.replace(this.rules.other.tabCharGlobal, "    "), T.test(h) || k.test(h) || M.test(h) || g.test(h) || A.test(h))
              break;
            if (O.search(this.rules.other.nonSpaceChar) >= _ || !h.trim())
              c += `
` + O.slice(_);
            else {
              if (b || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || T.test(f) || k.test(f) || A.test(f))
                break;
              c += `
` + h;
            }
            !b && !h.trim() && (b = !0), u += P + `
`, t = t.substring(P.length + 1), f = O.slice(_);
          }
        }
        o.loose || (a ? o.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (a = !0));
        let w = null, x;
        this.options.gfm && (w = this.rules.other.listIsTask.exec(c), w && (x = w[0] !== "[ ] ", c = c.replace(this.rules.other.listReplaceTask, ""))), o.items.push({
          type: "list_item",
          raw: u,
          task: !!w,
          checked: x,
          loose: !1,
          text: c,
          tokens: []
        }), o.raw += u;
      }
      o.items[o.items.length - 1].raw = o.items[o.items.length - 1].raw.trimEnd(), o.items[o.items.length - 1].text = o.items[o.items.length - 1].text.trimEnd(), o.raw = o.raw.trimEnd();
      for (let l = 0; l < o.items.length; l++)
        if (this.lexer.state.top = !1, o.items[l].tokens = this.lexer.blockTokens(o.items[l].text, []), !o.loose) {
          const u = o.items[l].tokens.filter((f) => f.type === "space"), c = u.length > 0 && u.some((f) => this.rules.other.anyLine.test(f.raw));
          o.loose = c;
        }
      if (o.loose)
        for (let l = 0; l < o.items.length; l++)
          o.items[l].loose = !0;
      return o;
    }
  }
  html(t) {
    const n = this.rules.block.html.exec(t);
    if (n)
      return {
        type: "html",
        block: !0,
        raw: n[0],
        pre: n[1] === "pre" || n[1] === "script" || n[1] === "style",
        text: n[0]
      };
  }
  def(t) {
    const n = this.rules.block.def.exec(t);
    if (n) {
      const s = n[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = n[2] ? n[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", o = n[3] ? n[3].substring(1, n[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : n[3];
      return {
        type: "def",
        tag: s,
        raw: n[0],
        href: r,
        title: o
      };
    }
  }
  table(t) {
    const n = this.rules.block.table.exec(t);
    if (!n || !this.rules.other.tableDelimiter.test(n[2]))
      return;
    const s = gl(n[1]), r = n[2].replace(this.rules.other.tableAlignChars, "").split("|"), o = n[3] && n[3].trim() ? n[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = {
      type: "table",
      raw: n[0],
      header: [],
      align: [],
      rows: []
    };
    if (s.length === r.length) {
      for (const a of r)
        this.rules.other.tableAlignRight.test(a) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? i.align.push("left") : i.align.push(null);
      for (let a = 0; a < s.length; a++)
        i.header.push({
          text: s[a],
          tokens: this.lexer.inline(s[a]),
          header: !0,
          align: i.align[a]
        });
      for (const a of o)
        i.rows.push(gl(a, i.header.length).map((l, u) => ({
          text: l,
          tokens: this.lexer.inline(l),
          header: !1,
          align: i.align[u]
        })));
      return i;
    }
  }
  lheading(t) {
    const n = this.rules.block.lheading.exec(t);
    if (n)
      return {
        type: "heading",
        raw: n[0],
        depth: n[2].charAt(0) === "=" ? 1 : 2,
        text: n[1],
        tokens: this.lexer.inline(n[1])
      };
  }
  paragraph(t) {
    const n = this.rules.block.paragraph.exec(t);
    if (n) {
      const s = n[1].charAt(n[1].length - 1) === `
` ? n[1].slice(0, -1) : n[1];
      return {
        type: "paragraph",
        raw: n[0],
        text: s,
        tokens: this.lexer.inline(s)
      };
    }
  }
  text(t) {
    const n = this.rules.block.text.exec(t);
    if (n)
      return {
        type: "text",
        raw: n[0],
        text: n[0],
        tokens: this.lexer.inline(n[0])
      };
  }
  escape(t) {
    const n = this.rules.inline.escape.exec(t);
    if (n)
      return {
        type: "escape",
        raw: n[0],
        text: n[1]
      };
  }
  tag(t) {
    const n = this.rules.inline.tag.exec(t);
    if (n)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(n[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(n[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(n[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(n[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: n[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: n[0]
      };
  }
  link(t) {
    const n = this.rules.inline.link.exec(t);
    if (n) {
      const s = n[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(s)) {
        if (!this.rules.other.endAngleBracket.test(s))
          return;
        const i = us(s.slice(0, -1), "\\");
        if ((s.length - i.length) % 2 === 0)
          return;
      } else {
        const i = Am(n[2], "()");
        if (i > -1) {
          const l = (n[0].indexOf("!") === 0 ? 5 : 4) + n[1].length + i;
          n[2] = n[2].substring(0, i), n[0] = n[0].substring(0, l).trim(), n[3] = "";
        }
      }
      let r = n[2], o = "";
      if (this.options.pedantic) {
        const i = this.rules.other.pedanticHrefTitle.exec(r);
        i && (r = i[1], o = i[3]);
      } else
        o = n[3] ? n[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(s) ? r = r.slice(1) : r = r.slice(1, -1)), _l(n, {
        href: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
        title: o && o.replace(this.rules.inline.anyPunctuation, "$1")
      }, n[0], this.lexer, this.rules);
    }
  }
  reflink(t, n) {
    let s;
    if ((s = this.rules.inline.reflink.exec(t)) || (s = this.rules.inline.nolink.exec(t))) {
      const r = (s[2] || s[1]).replace(this.rules.other.multipleSpaceGlobal, " "), o = n[r.toLowerCase()];
      if (!o) {
        const i = s[0].charAt(0);
        return {
          type: "text",
          raw: i,
          text: i
        };
      }
      return _l(s, o, s[0], this.lexer, this.rules);
    }
  }
  emStrong(t, n, s = "") {
    let r = this.rules.inline.emStrongLDelim.exec(t);
    if (!r || r[3] && s.match(this.rules.other.unicodeAlphaNumeric))
      return;
    if (!(r[1] || r[2] || "") || !s || this.rules.inline.punctuation.exec(s)) {
      const i = [...r[0]].length - 1;
      let a, l, u = i, c = 0;
      const f = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, n = n.slice(-1 * t.length + i); (r = f.exec(n)) != null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a)
          continue;
        if (l = [...a].length, r[3] || r[4]) {
          u += l;
          continue;
        } else if ((r[5] || r[6]) && i % 3 && !((i + l) % 3)) {
          c += l;
          continue;
        }
        if (u -= l, u > 0)
          continue;
        l = Math.min(l, l + u + c);
        const h = [...r[0]][0].length, b = t.slice(0, i + r.index + h + l);
        if (Math.min(i, l) % 2) {
          const w = b.slice(1, -1);
          return {
            type: "em",
            raw: b,
            text: w,
            tokens: this.lexer.inlineTokens(w)
          };
        }
        const _ = b.slice(2, -2);
        return {
          type: "strong",
          raw: b,
          text: _,
          tokens: this.lexer.inlineTokens(_)
        };
      }
    }
  }
  codespan(t) {
    const n = this.rules.inline.code.exec(t);
    if (n) {
      let s = n[2].replace(this.rules.other.newLineCharGlobal, " ");
      const r = this.rules.other.nonSpaceChar.test(s), o = this.rules.other.startingSpaceChar.test(s) && this.rules.other.endingSpaceChar.test(s);
      return r && o && (s = s.substring(1, s.length - 1)), {
        type: "codespan",
        raw: n[0],
        text: s
      };
    }
  }
  br(t) {
    const n = this.rules.inline.br.exec(t);
    if (n)
      return {
        type: "br",
        raw: n[0]
      };
  }
  del(t) {
    const n = this.rules.inline.del.exec(t);
    if (n)
      return {
        type: "del",
        raw: n[0],
        text: n[2],
        tokens: this.lexer.inlineTokens(n[2])
      };
  }
  autolink(t) {
    const n = this.rules.inline.autolink.exec(t);
    if (n) {
      let s, r;
      return n[2] === "@" ? (s = n[1], r = "mailto:" + s) : (s = n[1], r = s), {
        type: "link",
        raw: n[0],
        text: s,
        href: r,
        tokens: [
          {
            type: "text",
            raw: s,
            text: s
          }
        ]
      };
    }
  }
  url(t) {
    var s;
    let n;
    if (n = this.rules.inline.url.exec(t)) {
      let r, o;
      if (n[2] === "@")
        r = n[0], o = "mailto:" + r;
      else {
        let i;
        do
          i = n[0], n[0] = ((s = this.rules.inline._backpedal.exec(n[0])) == null ? void 0 : s[0]) ?? "";
        while (i !== n[0]);
        r = n[0], n[1] === "www." ? o = "http://" + n[0] : o = n[0];
      }
      return {
        type: "link",
        raw: n[0],
        text: r,
        href: o,
        tokens: [
          {
            type: "text",
            raw: r,
            text: r
          }
        ]
      };
    }
  }
  inlineText(t) {
    const n = this.rules.inline.text.exec(t);
    if (n) {
      const s = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: n[0],
        text: n[0],
        escaped: s
      };
    }
  }
}
class At {
  constructor(t) {
    Se(this, "tokens");
    Se(this, "options");
    Se(this, "state");
    Se(this, "tokenizer");
    Se(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || Dn, this.options.tokenizer = this.options.tokenizer || new yr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const n = {
      other: ot,
      block: qs.normal,
      inline: cs.normal
    };
    this.options.pedantic ? (n.block = qs.pedantic, n.inline = cs.pedantic) : this.options.gfm && (n.block = qs.gfm, this.options.breaks ? n.inline = cs.breaks : n.inline = cs.gfm), this.tokenizer.rules = n;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: qs,
      inline: cs
    };
  }
  /**
   * Static Lex Method
   */
  static lex(t, n) {
    return new At(n).lex(t);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(t, n) {
    return new At(n).inlineTokens(t);
  }
  /**
   * Preprocessing
   */
  lex(t) {
    t = t.replace(ot.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      const s = this.inlineQueue[n];
      this.inlineTokens(s.src, s.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, n = [], s = !1) {
    this.options.pedantic && (t = t.replace(ot.tabCharGlobal, "    ").replace(ot.spaceLine, ""));
    let r, o, i;
    for (; t; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((a) => (r = a.call({ lexer: this }, t, n)) ? (t = t.substring(r.raw.length), n.push(r), !0) : !1))) {
        if (r = this.tokenizer.space(t)) {
          t = t.substring(r.raw.length), r.raw.length === 1 && n.length > 0 ? n[n.length - 1].raw += `
` : n.push(r);
          continue;
        }
        if (r = this.tokenizer.code(t)) {
          t = t.substring(r.raw.length), o = n[n.length - 1], o && (o.type === "paragraph" || o.type === "text") ? (o.raw += `
` + r.raw, o.text += `
` + r.text, this.inlineQueue[this.inlineQueue.length - 1].src = o.text) : n.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.list(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.html(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.def(t)) {
          t = t.substring(r.raw.length), o = n[n.length - 1], o && (o.type === "paragraph" || o.type === "text") ? (o.raw += `
` + r.raw, o.text += `
` + r.raw, this.inlineQueue[this.inlineQueue.length - 1].src = o.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
            href: r.href,
            title: r.title
          });
          continue;
        }
        if (r = this.tokenizer.table(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(t)) {
          t = t.substring(r.raw.length), n.push(r);
          continue;
        }
        if (i = t, this.options.extensions && this.options.extensions.startBlock) {
          let a = 1 / 0;
          const l = t.slice(1);
          let u;
          this.options.extensions.startBlock.forEach((c) => {
            u = c.call({ lexer: this }, l), typeof u == "number" && u >= 0 && (a = Math.min(a, u));
          }), a < 1 / 0 && a >= 0 && (i = t.substring(0, a + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(i))) {
          o = n[n.length - 1], s && (o == null ? void 0 : o.type) === "paragraph" ? (o.raw += `
` + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = o.text) : n.push(r), s = i.length !== t.length, t = t.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(t)) {
          t = t.substring(r.raw.length), o = n[n.length - 1], o && o.type === "text" ? (o.raw += `
` + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = o.text) : n.push(r);
          continue;
        }
        if (t) {
          const a = "Infinite loop on byte: " + t.charCodeAt(0);
          if (this.options.silent) {
            console.error(a);
            break;
          } else
            throw new Error(a);
        }
      }
    return this.state.top = !0, n;
  }
  inline(t, n = []) {
    return this.inlineQueue.push({ src: t, tokens: n }), n;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(t, n = []) {
    let s, r, o, i = t, a, l, u;
    if (this.tokens.links) {
      const c = Object.keys(this.tokens.links);
      if (c.length > 0)
        for (; (a = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; )
          c.includes(a[0].slice(a[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, a.index) + "[" + "a".repeat(a[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (a = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; )
      i = i.slice(0, a.index) + "[" + "a".repeat(a[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (a = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; )
      i = i.slice(0, a.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; t; )
      if (l || (u = ""), l = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((c) => (s = c.call({ lexer: this }, t, n)) ? (t = t.substring(s.raw.length), n.push(s), !0) : !1))) {
        if (s = this.tokenizer.escape(t)) {
          t = t.substring(s.raw.length), n.push(s);
          continue;
        }
        if (s = this.tokenizer.tag(t)) {
          t = t.substring(s.raw.length), r = n[n.length - 1], n.push(s);
          continue;
        }
        if (s = this.tokenizer.link(t)) {
          t = t.substring(s.raw.length), n.push(s);
          continue;
        }
        if (s = this.tokenizer.reflink(t, this.tokens.links)) {
          t = t.substring(s.raw.length), r = n[n.length - 1], r && s.type === "text" && r.type === "text" ? (r.raw += s.raw, r.text += s.text) : n.push(s);
          continue;
        }
        if (s = this.tokenizer.emStrong(t, i, u)) {
          t = t.substring(s.raw.length), n.push(s);
          continue;
        }
        if (s = this.tokenizer.codespan(t)) {
          t = t.substring(s.raw.length), n.push(s);
          continue;
        }
        if (s = this.tokenizer.br(t)) {
          t = t.substring(s.raw.length), n.push(s);
          continue;
        }
        if (s = this.tokenizer.del(t)) {
          t = t.substring(s.raw.length), n.push(s);
          continue;
        }
        if (s = this.tokenizer.autolink(t)) {
          t = t.substring(s.raw.length), n.push(s);
          continue;
        }
        if (!this.state.inLink && (s = this.tokenizer.url(t))) {
          t = t.substring(s.raw.length), n.push(s);
          continue;
        }
        if (o = t, this.options.extensions && this.options.extensions.startInline) {
          let c = 1 / 0;
          const f = t.slice(1);
          let h;
          this.options.extensions.startInline.forEach((b) => {
            h = b.call({ lexer: this }, f), typeof h == "number" && h >= 0 && (c = Math.min(c, h));
          }), c < 1 / 0 && c >= 0 && (o = t.substring(0, c + 1));
        }
        if (s = this.tokenizer.inlineText(o)) {
          t = t.substring(s.raw.length), s.raw.slice(-1) !== "_" && (u = s.raw.slice(-1)), l = !0, r = n[n.length - 1], r && r.type === "text" ? (r.raw += s.raw, r.text += s.text) : n.push(s);
          continue;
        }
        if (t) {
          const c = "Infinite loop on byte: " + t.charCodeAt(0);
          if (this.options.silent) {
            console.error(c);
            break;
          } else
            throw new Error(c);
        }
      }
    return n;
  }
}
class wr {
  // set by the parser
  constructor(t) {
    Se(this, "options");
    Se(this, "parser");
    this.options = t || Dn;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: n, escaped: s }) {
    var i;
    const r = (i = (n || "").match(ot.notSpaceStart)) == null ? void 0 : i[0], o = t.replace(ot.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + Pt(r) + '">' + (s ? o : Pt(o, !0)) + `</code></pre>
` : "<pre><code>" + (s ? o : Pt(o, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  heading({ tokens: t, depth: n }) {
    return `<h${n}>${this.parser.parseInline(t)}</h${n}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    const n = t.ordered, s = t.start;
    let r = "";
    for (let a = 0; a < t.items.length; a++) {
      const l = t.items[a];
      r += this.listitem(l);
    }
    const o = n ? "ol" : "ul", i = n && s !== 1 ? ' start="' + s + '"' : "";
    return "<" + o + i + `>
` + r + "</" + o + `>
`;
  }
  listitem(t) {
    let n = "";
    if (t.task) {
      const s = this.checkbox({ checked: !!t.checked });
      t.loose ? t.tokens.length > 0 && t.tokens[0].type === "paragraph" ? (t.tokens[0].text = s + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = s + " " + Pt(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({
        type: "text",
        raw: s + " ",
        text: s + " ",
        escaped: !0
      }) : n += s + " ";
    }
    return n += this.parser.parse(t.tokens, !!t.loose), `<li>${n}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let n = "", s = "";
    for (let o = 0; o < t.header.length; o++)
      s += this.tablecell(t.header[o]);
    n += this.tablerow({ text: s });
    let r = "";
    for (let o = 0; o < t.rows.length; o++) {
      const i = t.rows[o];
      s = "";
      for (let a = 0; a < i.length; a++)
        s += this.tablecell(i[a]);
      r += this.tablerow({ text: s });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + n + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    const n = this.parser.parseInline(t.tokens), s = t.header ? "th" : "td";
    return (t.align ? `<${s} align="${t.align}">` : `<${s}>`) + n + `</${s}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${Pt(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: n, tokens: s }) {
    const r = this.parser.parseInline(s), o = ml(t);
    if (o === null)
      return r;
    t = o;
    let i = '<a href="' + t + '"';
    return n && (i += ' title="' + Pt(n) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: t, title: n, text: s }) {
    const r = ml(t);
    if (r === null)
      return Pt(s);
    t = r;
    let o = `<img src="${t}" alt="${s}"`;
    return n && (o += ` title="${Pt(n)}"`), o += ">", o;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Pt(t.text);
  }
}
class Ni {
  // no need for block level renderers
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
}
class Ct {
  constructor(t) {
    Se(this, "options");
    Se(this, "renderer");
    Se(this, "textRenderer");
    this.options = t || Dn, this.options.renderer = this.options.renderer || new wr(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Ni();
  }
  /**
   * Static Parse Method
   */
  static parse(t, n) {
    return new Ct(n).parse(t);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(t, n) {
    return new Ct(n).parseInline(t);
  }
  /**
   * Parse Loop
   */
  parse(t, n = !0) {
    let s = "";
    for (let r = 0; r < t.length; r++) {
      const o = t[r];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[o.type]) {
        const a = o, l = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (l !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(a.type)) {
          s += l || "";
          continue;
        }
      }
      const i = o;
      switch (i.type) {
        case "space": {
          s += this.renderer.space(i);
          continue;
        }
        case "hr": {
          s += this.renderer.hr(i);
          continue;
        }
        case "heading": {
          s += this.renderer.heading(i);
          continue;
        }
        case "code": {
          s += this.renderer.code(i);
          continue;
        }
        case "table": {
          s += this.renderer.table(i);
          continue;
        }
        case "blockquote": {
          s += this.renderer.blockquote(i);
          continue;
        }
        case "list": {
          s += this.renderer.list(i);
          continue;
        }
        case "html": {
          s += this.renderer.html(i);
          continue;
        }
        case "paragraph": {
          s += this.renderer.paragraph(i);
          continue;
        }
        case "text": {
          let a = i, l = this.renderer.text(a);
          for (; r + 1 < t.length && t[r + 1].type === "text"; )
            a = t[++r], l += `
` + this.renderer.text(a);
          n ? s += this.renderer.paragraph({
            type: "paragraph",
            raw: l,
            text: l,
            tokens: [{ type: "text", raw: l, text: l, escaped: !0 }]
          }) : s += l;
          continue;
        }
        default: {
          const a = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return s;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(t, n) {
    n = n || this.renderer;
    let s = "";
    for (let r = 0; r < t.length; r++) {
      const o = t[r];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[o.type]) {
        const a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          s += a || "";
          continue;
        }
      }
      const i = o;
      switch (i.type) {
        case "escape": {
          s += n.text(i);
          break;
        }
        case "html": {
          s += n.html(i);
          break;
        }
        case "link": {
          s += n.link(i);
          break;
        }
        case "image": {
          s += n.image(i);
          break;
        }
        case "strong": {
          s += n.strong(i);
          break;
        }
        case "em": {
          s += n.em(i);
          break;
        }
        case "codespan": {
          s += n.codespan(i);
          break;
        }
        case "br": {
          s += n.br(i);
          break;
        }
        case "del": {
          s += n.del(i);
          break;
        }
        case "text": {
          s += n.text(i);
          break;
        }
        default: {
          const a = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent)
            return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return s;
  }
}
class ws {
  constructor(t) {
    Se(this, "options");
    Se(this, "block");
    this.options = t || Dn;
  }
  /**
   * Process markdown before marked
   */
  preprocess(t) {
    return t;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(t) {
    return t;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(t) {
    return t;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? At.lex : At.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? Ct.parse : Ct.parseInline;
  }
}
Se(ws, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
]));
class Tm {
  constructor(...t) {
    Se(this, "defaults", Si());
    Se(this, "options", this.setOptions);
    Se(this, "parse", this.parseMarkdown(!0));
    Se(this, "parseInline", this.parseMarkdown(!1));
    Se(this, "Parser", Ct);
    Se(this, "Renderer", wr);
    Se(this, "TextRenderer", Ni);
    Se(this, "Lexer", At);
    Se(this, "Tokenizer", yr);
    Se(this, "Hooks", ws);
    this.use(...t);
  }
  /**
   * Run callback for every token
   */
  walkTokens(t, n) {
    var r, o;
    let s = [];
    for (const i of t)
      switch (s = s.concat(n.call(this, i)), i.type) {
        case "table": {
          const a = i;
          for (const l of a.header)
            s = s.concat(this.walkTokens(l.tokens, n));
          for (const l of a.rows)
            for (const u of l)
              s = s.concat(this.walkTokens(u.tokens, n));
          break;
        }
        case "list": {
          const a = i;
          s = s.concat(this.walkTokens(a.items, n));
          break;
        }
        default: {
          const a = i;
          (o = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && o[a.type] ? this.defaults.extensions.childTokens[a.type].forEach((l) => {
            const u = a[l].flat(1 / 0);
            s = s.concat(this.walkTokens(u, n));
          }) : a.tokens && (s = s.concat(this.walkTokens(a.tokens, n)));
        }
      }
    return s;
  }
  use(...t) {
    const n = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((s) => {
      const r = { ...s };
      if (r.async = this.defaults.async || r.async || !1, s.extensions && (s.extensions.forEach((o) => {
        if (!o.name)
          throw new Error("extension name required");
        if ("renderer" in o) {
          const i = n.renderers[o.name];
          i ? n.renderers[o.name] = function(...a) {
            let l = o.renderer.apply(this, a);
            return l === !1 && (l = i.apply(this, a)), l;
          } : n.renderers[o.name] = o.renderer;
        }
        if ("tokenizer" in o) {
          if (!o.level || o.level !== "block" && o.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const i = n[o.level];
          i ? i.unshift(o.tokenizer) : n[o.level] = [o.tokenizer], o.start && (o.level === "block" ? n.startBlock ? n.startBlock.push(o.start) : n.startBlock = [o.start] : o.level === "inline" && (n.startInline ? n.startInline.push(o.start) : n.startInline = [o.start]));
        }
        "childTokens" in o && o.childTokens && (n.childTokens[o.name] = o.childTokens);
      }), r.extensions = n), s.renderer) {
        const o = this.defaults.renderer || new wr(this.defaults);
        for (const i in s.renderer) {
          if (!(i in o))
            throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i))
            continue;
          const a = i, l = s.renderer[a], u = o[a];
          o[a] = (...c) => {
            let f = l.apply(o, c);
            return f === !1 && (f = u.apply(o, c)), f || "";
          };
        }
        r.renderer = o;
      }
      if (s.tokenizer) {
        const o = this.defaults.tokenizer || new yr(this.defaults);
        for (const i in s.tokenizer) {
          if (!(i in o))
            throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i))
            continue;
          const a = i, l = s.tokenizer[a], u = o[a];
          o[a] = (...c) => {
            let f = l.apply(o, c);
            return f === !1 && (f = u.apply(o, c)), f;
          };
        }
        r.tokenizer = o;
      }
      if (s.hooks) {
        const o = this.defaults.hooks || new ws();
        for (const i in s.hooks) {
          if (!(i in o))
            throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i))
            continue;
          const a = i, l = s.hooks[a], u = o[a];
          ws.passThroughHooks.has(i) ? o[a] = (c) => {
            if (this.defaults.async)
              return Promise.resolve(l.call(o, c)).then((h) => u.call(o, h));
            const f = l.call(o, c);
            return u.call(o, f);
          } : o[a] = (...c) => {
            let f = l.apply(o, c);
            return f === !1 && (f = u.apply(o, c)), f;
          };
        }
        r.hooks = o;
      }
      if (s.walkTokens) {
        const o = this.defaults.walkTokens, i = s.walkTokens;
        r.walkTokens = function(a) {
          let l = [];
          return l.push(i.call(this, a)), o && (l = l.concat(o.call(this, a))), l;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, n) {
    return At.lex(t, n ?? this.defaults);
  }
  parser(t, n) {
    return Ct.parse(t, n ?? this.defaults);
  }
  parseMarkdown(t) {
    return (s, r) => {
      const o = { ...r }, i = { ...this.defaults, ...o }, a = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && o.async === !1)
        return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof s > "u" || s === null)
        return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof s != "string")
        return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(s) + ", string expected"));
      i.hooks && (i.hooks.options = i, i.hooks.block = t);
      const l = i.hooks ? i.hooks.provideLexer() : t ? At.lex : At.lexInline, u = i.hooks ? i.hooks.provideParser() : t ? Ct.parse : Ct.parseInline;
      if (i.async)
        return Promise.resolve(i.hooks ? i.hooks.preprocess(s) : s).then((c) => l(c, i)).then((c) => i.hooks ? i.hooks.processAllTokens(c) : c).then((c) => i.walkTokens ? Promise.all(this.walkTokens(c, i.walkTokens)).then(() => c) : c).then((c) => u(c, i)).then((c) => i.hooks ? i.hooks.postprocess(c) : c).catch(a);
      try {
        i.hooks && (s = i.hooks.preprocess(s));
        let c = l(s, i);
        i.hooks && (c = i.hooks.processAllTokens(c)), i.walkTokens && this.walkTokens(c, i.walkTokens);
        let f = u(c, i);
        return i.hooks && (f = i.hooks.postprocess(f)), f;
      } catch (c) {
        return a(c);
      }
    };
  }
  onError(t, n) {
    return (s) => {
      if (s.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        const r = "<p>An error occurred:</p><pre>" + Pt(s.message + "", !0) + "</pre>";
        return n ? Promise.resolve(r) : r;
      }
      if (n)
        return Promise.reject(s);
      throw s;
    };
  }
}
const Pn = new Tm();
function Ee(e, t) {
  return Pn.parse(e, t);
}
Ee.options = Ee.setOptions = function(e) {
  return Pn.setOptions(e), Ee.defaults = Pn.defaults, Du(Ee.defaults), Ee;
};
Ee.getDefaults = Si;
Ee.defaults = Dn;
Ee.use = function(...e) {
  return Pn.use(...e), Ee.defaults = Pn.defaults, Du(Ee.defaults), Ee;
};
Ee.walkTokens = function(e, t) {
  return Pn.walkTokens(e, t);
};
Ee.parseInline = Pn.parseInline;
Ee.Parser = Ct;
Ee.parser = Ct.parse;
Ee.Renderer = wr;
Ee.TextRenderer = Ni;
Ee.Lexer = At;
Ee.lexer = At.lex;
Ee.Tokenizer = yr;
Ee.Hooks = ws;
Ee.parse = Ee;
Ee.options;
Ee.setOptions;
Ee.use;
Ee.walkTokens;
Ee.parseInline;
Ct.parse;
At.lex;
const Sm = {
  class: "markdown-typer",
  "aria-live": "polite"
}, Rm = ["innerHTML"], Lm = ["innerHTML"], Im = {
  __name: "ChatMessageRenderer",
  props: {
    markdown: {
      type: String,
      required: !0
    },
    typingSpeed: {
      type: Number,
      default: 50
    }
  },
  emits: ["typing-started", "typing-finished"],
  setup(e, { emit: t }) {
    const n = t, s = e, r = V(null), o = V(""), i = V(""), a = (u) => Ee(u), l = async (u) => {
      n("typing-started");
      const c = u.split(/(<[^>]+>|\s+)/).filter((h) => h.length > 0);
      let f = "";
      for (const h of c)
        f += h, i.value = f, /^<[^>]+>$/.test(h) || await new Promise((b) => setTimeout(b, s.typingSpeed * h.length));
      n("typing-finished");
    };
    return bt(
      () => s.markdown,
      (u) => {
        const c = a(u);
        o.value = c, l(c);
      },
      { immediate: !0 }
    ), gn(() => {
      if (s.markdown) {
        const u = a(s.markdown);
        o.value = u, l(u);
      }
    }), (u, c) => (N(), B("div", Sm, [
      C("div", {
        class: "sr-only",
        innerHTML: o.value
      }, null, 8, Rm),
      C("div", {
        "aria-hidden": "true",
        ref_key: "typingContainer",
        ref: r,
        innerHTML: i.value
      }, null, 8, Lm)
    ]));
  }
}, Mm = /* @__PURE__ */ Qe(Im, [["__scopeId", "data-v-f73fcddb"]]), Om = ["aria-hidden"], Nm = {
  key: 0,
  class: "chat-avatar"
}, $m = ["src"], Pm = { class: "chat-message__content" }, Dm = {
  key: 3,
  class: "chat-message__sources"
}, Fm = { class: "sources__title" }, Bm = { class: "source__list" }, Um = {
  key: 0,
  class: "chat-message__footer"
}, Hm = { class: "chat-message__assistant-name" }, zm = { class: "chat-message__actions" }, jm = ["disabled"], Vm = { key: 0 }, Wm = { class: "sr-only" }, Km = { key: 1 }, qm = { class: "sr-only" }, Gm = { class: "sr-only" }, Ym = {
  __name: "ChatMessage",
  props: {
    message: {
      type: Object
    },
    avatar: {
      type: String
    },
    isLoading: {
      type: Boolean
    },
    config: {
      type: Object
    },
    animate: {
      type: Boolean
    }
  },
  emits: ["getExtensiveAnswerClick", "updateMessage"],
  setup(e, { emit: t }) {
    $r((G) => ({
      "3946881c": x.value
    }));
    const n = t, s = e, { t: r, locale: o } = yt(), i = V(!1), a = V(""), l = V(!1), u = V(null), c = V(!1), f = V(!1), h = V(), b = V(!1), _ = ke(() => s.message.role === "system"), w = ke(() => s.config.primaryColor), x = ke(() => s.config.textColor), g = ke(() => {
      var he, Ne;
      if (!((he = s.message) != null && he.recordingBlobBase64))
        return null;
      const G = atob((Ne = s.message) == null ? void 0 : Ne.recordingBlobBase64.split(",")[1]), D = new Array(G.length);
      for (let ue = 0; ue < G.length; ue++)
        D[ue] = G.charCodeAt(ue);
      const te = new Uint8Array(D);
      return h.value = new Blob([te], { type: "audio/mpeg" }), URL.createObjectURL(h.value);
    }), A = ke(() => !b.value && s.message.image), T = ke(() => {
      var G, D;
      return !b.value && _.value && ((D = (G = s.message) == null ? void 0 : G.sources) == null ? void 0 : D.length) > 0;
    }), k = () => {
      navigator.clipboard.writeText(s.message.content);
    }, M = () => {
      u.value = new Audio(), u.value.addEventListener("ended", () => {
        l.value = !1;
      });
    }, P = () => {
      u.value || M(), a.value ? (u.value.src = a.value, u.value.play().then(() => {
        l.value = !0;
      }).catch((G) => console.error("Error playing audio:", G))) : X();
    }, O = () => {
      u.value.pause(), l.value = !1;
    }, X = async () => {
      if (!i.value)
        try {
          i.value = !0;
          const G = await er.tts(s.message.content, o.value), D = new Blob([G.data], { type: "audio/mpeg" });
          a.value = URL.createObjectURL(D), P();
        } catch (G) {
          console.error(G);
        } finally {
          i.value = !1;
        }
    }, W = () => {
      b.value = !0;
    }, J = () => {
      b.value = !1;
    };
    return bt(T, (G) => {
      G && n("updateMessage");
    }), bt(A, (G) => {
      G && n("updateMessage");
    }), (G, D) => s.message ? (N(), B("div", {
      key: 0,
      class: "chat-message-wrapper",
      "aria-hidden": s.message.srHidden
    }, [
      _.value ? (N(), B("div", Nm, [
        s.avatar ? (N(), B("img", {
          key: 0,
          src: s.avatar,
          alt: "Chatbot avatar"
        }, null, 8, $m)) : (N(), rt(H(Op), { key: 1 }))
      ])) : we("", !0),
      C("section", {
        class: je(["chat-message", `chat-message--${s.message.role}`])
      }, [
        C("div", Pm, [
          s.message.content ? (N(), B("p", {
            key: 0,
            class: je({ "sr-only": s.message.recordingBlobBase64 })
          }, [
            s.animate ? (N(), rt(Mm, {
              key: 0,
              markdown: s.message.content,
              "typing-speed": 20,
              onTypingStarted: W,
              onTypingFinished: J
            }, null, 8, ["markdown"])) : (N(), B(Oe, { key: 1 }, [
              Lt(ee(s.message.content), 1)
            ], 64))
          ], 2)) : we("", !0),
          A.value && !b.value ? (N(), rt(V0, {
            key: 1,
            src: s.message.image,
            "alt-text": s.message.image_alt,
            source: s.message.image_source
          }, null, 8, ["src", "alt-text", "source"])) : we("", !0),
          s.message.role === "user" && s.message.recordingBlobBase64 ? (N(), rt(X0, {
            key: 2,
            "audio-url": g.value,
            "audio-blob": h.value,
            "primary-color": w.value
          }, null, 8, ["audio-url", "audio-blob", "primary-color"])) : we("", !0),
          T.value ? (N(), B("div", Dm, [
            D[4] || (D[4] = C("hr", { class: "source__space" }, null, -1)),
            C("span", Fm, ee(H(r)("sources")), 1),
            C("ol", Bm, [
              (N(!0), B(Oe, null, Nn(s.message.sources, (te, he) => (N(), B("li", { key: he }, [
                q(Xp, {
                  name: te.name,
                  "source-link": te.link,
                  "source-type": te.type,
                  index: he,
                  "primary-color": w.value
                }, null, 8, ["name", "source-link", "source-type", "index", "primary-color"])
              ]))), 128))
            ])
          ])) : we("", !0),
          q(e2, {
            "is-loading": s.isLoading
          }, null, 8, ["is-loading"])
        ]),
        _.value ? (N(), B("footer", Um, [
          C("div", Hm, ee(e.config.assistantName), 1),
          C("div", zm, [
            l.value ? (N(), B("button", {
              key: 1,
              class: "action-btn hover-fill",
              onClick: O,
              onMouseenter: D[2] || (D[2] = (te) => f.value = !0),
              onMouseleave: D[3] || (D[3] = (te) => f.value = !1)
            }, [
              q(Rt, {
                icon: H(pr),
                "icon-hover": H(mr),
                "hover-color": w.value,
                "default-color": "#4b4b4b",
                "is-hovered": f.value
              }, null, 8, ["icon", "icon-hover", "hover-color", "is-hovered"]),
              C("span", qm, ee(H(r)("screenReader.pauseAction")), 1)
            ], 32)) : (N(), B("button", {
              key: 0,
              class: "action-btn hover-fill",
              onClick: P,
              disabled: i.value,
              onMouseenter: D[0] || (D[0] = (te) => c.value = !0),
              onMouseleave: D[1] || (D[1] = (te) => c.value = !1)
            }, [
              i.value ? (N(), B("span", Km, [
                q(Pu, { size: "20px" })
              ])) : (N(), B("span", Vm, [
                q(H(Kp)),
                C("span", Wm, ee(H(r)("screenReader.playAction")), 1)
              ]))
            ], 40, jm)),
            C("button", {
              class: "action-btn",
              onClick: k
            }, [
              q(H(uu), { "aria-hidden": "true" }),
              C("span", Gm, ee(H(r)("screenReader.copyAction")), 1)
            ])
          ])
        ])) : we("", !0)
      ], 2)
    ], 8, Om)) : we("", !0);
  }
}, Qm = /* @__PURE__ */ Qe(Ym, [["__scopeId", "data-v-a0e3b498"]]), Xm = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
};
function Jm(e, t) {
  return N(), B("svg", Xm, t[0] || (t[0] = [
    C("path", {
      fill: "#fc0",
      d: "M0 341.3h512V512H0z"
    }, null, -1),
    C("path", {
      fill: "#000001",
      d: "M0 0h512v170.7H0z"
    }, null, -1),
    C("path", {
      fill: "red",
      d: "M0 170.7h512v170.6H0z"
    }, null, -1)
  ]));
}
const Zm = { render: Jm }, eg = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
};
function tg(e, t) {
  return N(), B("svg", eg, t[0] || (t[0] = [
    es('<path fill="#012169" d="M0 0h512v512H0z"></path><path fill="#FFF" d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"></path><path fill="#C8102E" d="m184 324 11 34L42 512H0v-3zm124-12 54 8 150 147v45zM512 0 320 196l-4-44L466 0zM0 1l193 189-59-8L0 49z"></path><path fill="#FFF" d="M176 0v512h160V0zM0 176v160h512V176z"></path><path fill="#C8102E" d="M0 208v96h512v-96zM208 0v512h96V0z"></path>', 5)
  ]));
}
const ng = { render: tg }, sg = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
};
function rg(e, t) {
  return N(), B("svg", sg, t[0] || (t[0] = [
    C("path", {
      fill: "#fff",
      d: "M0 0h512v170.7H0z"
    }, null, -1),
    C("path", {
      fill: "#0039a6",
      d: "M0 170.7h512v170.6H0z"
    }, null, -1),
    C("path", {
      fill: "#d52b1e",
      d: "M0 341.3h512V512H0z"
    }, null, -1)
  ]));
}
const og = { render: rg }, ig = {
  xmlns: "http://www.w3.org/2000/svg",
  "xml:space": "preserve",
  version: "1.0",
  viewBox: "0 0 512 512"
};
function ag(e, t) {
  return N(), B("svg", ig, t[0] || (t[0] = [
    es('<path fill="#006233" d="M0 0v512h512V0Z" class="arab-fil0 arab-str0"></path><g fill="#fff" fill-rule="evenodd" stroke="#fff"><path stroke-width=".4" d="M1071.9 2779.7c-25.9 38.9-7.2 64.2 19.5 66 17.6 1.3 54.2-24.9 54.1-55.7l-10-5.6c5.6 15.8-.2 20.8-12.1 31.6-23.5 21.3-71.5 22.8-51.5-36.3z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path d="M1277.2 2881.7c145.8 4.1 192.2-137 102.2-257.8l-8.9 13.3c5.8 56.3 14.2 111.8 15 169.5-17.6 20.7-43.2 13-48.3-10 .3-31.2-9.9-57.6-22.8-82.8l-7.2 13.3c8.4 20.7 17.5 44 19.4 69.5-41.6 49.9-87.6 60-70.5-5.6-32.9 57.5 16.9 98 73.3 9.5 12.1 60.4 58.9 22.9 61.7 9.9 5.1-39.6 2.5-103.4-7.8-153.8 40.6 70.3 42 121 20.4 154.9-24 37.7-76.2 55.3-126.5 70.1z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path d="M1359.9 2722.2c-31.2 2.3-47.2-4.1-30.3-27.2 16.7-22.6 32.3-4.6 36.5 25.6 3.9 28.3-54.8 64.4-75.1 64.4-30.7 0-44.9-39.5-16.6-75-36.4 103.6 78.6 43.5 85.5 12.2zm-21.6-24c-3.8-.2-6.6 6.5-4.7 7.8 5.5 3.8 14.2 1.5 15.1-.4 1.9-4.2-5.1-7.2-10.4-7.4z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path d="M1190.5 2771.1c-30 59-.1 83.4 38.4 76.6 22.4-4.1 50.8-20 67.2-41.7.3-47.8-.4-95.2-4.6-141.5 15-17.9-1.3-17.8-7-37-2.6 11.2-8.9 23.3-2.8 32 4.3 46.7 6.7 94 6.6 142.2-30.2 24.3-52.9 33.3-69.1 33.1-33.5-.3-40.7-28.5-28.7-63.7z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path d="M1251.8 2786.7c-.5-44.5-1.2-95-5.2-126.1 15.6-17.3-.8-17.7-5.9-37.1-3 11-9.6 23-3.8 31.9 2.6 47.6 5.1 95.2 5.6 142.8 3.6-2.3 7.7-3.2 9.3-11.5z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path stroke-width=".4" d="M1135.4 2784.6c-3.8-4.8-6.5-10.2-9.6-14.9-.5-6.7 4-12.9 4.6-16.3 5.1 7.9 8.1 13.9 12.2 17.8m5.4 3.1c7.5 3 16.7 3 25.2 3.2 32.8.6 67.3-4.8 63.6 39.6a66.2 66.2 0 0 1-65.2 61.9c-41.7-.4-77.3-46.4-13-131.1 6.2-1 14.3.7 21 1.3 11.5.9 23.3-.2 36.8-11-1.6-27.9-1.6-54.3-5-79.5-5.8-8.9.8-20.8 3.8-31.9 5.1 19.4 21.4 19.8 5.9 37.2 3.7 28 4.1 56.5 4.1 73.5-7.8 11.9-13.9 24.5-36.7 29.3-23.3-3.4-33.8-36-58.1-25.2 6.7-29.4 68.4-36.1 74.6-12.9-4.1 24.2-61.7 14.5-77 92.7-4.7 24.1 20.7 46.3 46.8 44.5 25.5-1.7 52.7-19.4 55.4-49.2 2.1-24.9-33-22-47.7-21.7-21.4.5-34.9-2.8-43-7.5m21.9-53.9c3.8-3.6 17.1-6.1 21.9-.3-3.6 2.4-7.1 5-10 8.1-5-2.6-8.3-5.2-11.9-7.8z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path d="M1194 2650.9a49 49 0 0 1 5.3 21c-2.2 10.4-11.1 20.1-20.3 20.4-5.7.2-12.1-1.4-16.6-10.3-.5-1.1-2.9-3.7-5.2-2.5-10.1 16.6-17.6 23.6-26.7 23.5-18.2-.3-12.8-16.5-29.6-21.5-7-.2-18.5 6.9-24.4 20.8-22.4 63.5-42.8-.2-34.1-29.8 1.3 28.3 8.1 45.1 15.1 44.6 5.1-.5 9.6-12.3 16.1-24.7 5-9.5 17-26.6 29.7-26.6 11.6.3 4.3 21.6 27.5 21.3 11.2-.2 21.5-8.8 31.9-26 2.3-.4 2.9 3.7 3.4 5.1 1.6 5.9 11.8 22.1 25.6 7.3-.7-3.2-.4-8.5-3.9-9.6z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path stroke-width=".4" d="M1266.9 2598.3c-12.3 6.1-21.3.5-26.4-4.9 8.9-1.8 15.8-5 17.8-12-4-9-13.5-12.9-26.9-13-17.9.5-27.1 7.7-28.2 17.6 8.3.3 15.8-2 19 6-14.7 7.2-32 9.8-50.8 9.7-30.8 1.6-35.3-12.3-43.4-24.5-.6-.8-3.3-2.1-4.7-1.9-9.5 0-16.5 33.2-27.2 33.1-10.7-1.4-8.3-21.4-11.4-32.8-2.6 17.9 3.3 84.5 36.4 12.2 1-2.4 2.4-1.7 3.3.3 8.9 20.2 27 27.2 46.5 28.2 16.3.9 37.1-6.2 59.4-18.8 5.9 6.5 10.6 13.9 23 15.3 14.5.7 30-9.8 33.5-22.8 1.8-6.7 2.1-19.9-5-20.1-9.9-.3-17.1 23.7-14.8 45.3.2-.3 1.3-5.4 1.3-5.4m-43.8-28.8c6.5-3 12.8-4.4 17.8 2.2a27.4 27.4 0 0 0-8.4 4c-2.8-2.2-6.6-3.3-9.4-6.2zm47.8 14.9c1.6-7.1 2.5-12.8 8.3-16.5 1.2 7.5 1.4 11.7-8.3 16.5zm39 11c-1.9-6.1-3.8-11.4-4.4-18-1.4-13.4 10.1-21 20.5-19.9 10.7 1.1 17.8 5.1 28 8.6 8 2.7 18.8 4.8 29.1 7.7 5.8 2.6 0 9.4-1.5 10.3-25.8 10.1-44.1 26.1-60.5 26.8-9.8.5-18.5-5.9-26.4-19-.5-25.4-1.4-55.2-3.9-73.9 3.8-3.8 4.6-6.6 6.4-9.7 2 24.7 2.8 50.7 3.3 76.9 2.1 4.5 4.7 8.3 9.4 10.2zm16.5 2c-13.8 3.9-12.1-7.8-13.4-15-1.5-8.4-.5-17.9 10.2-15.5 13.9 3.7 26.6 8.6 38.9 13.8z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path stroke-width=".4" d="m1314.3 2621.3 1.9 9.3h1.5l-.6-8.7" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="m1094.2 2718.5 7-7.2 8.1 6.9-7.5 6.7zm17.8-2.4 7.1-7.2 8.1 6.9-7.5 6.7zm-49.5-74.6 7.1-7.2 8.1 6.9-7.5 6.7zm3.2 21.2 7.1-7.2 8 6.9-7.5 6.7zm128.5 35.5 6.5-5.3 6 6.5-6.8 4.8zm-85.8-135.7 4.6-4.7 5.3 4.5-4.9 4.4zm11.7-1.5 4.6-4.8 5.3 4.6-4.9 4.3zm245.6 53.7-4.4 3.7-4.2-4.3 4.6-3.4z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path stroke-width=".4" d="m1158.7 2747.4-.5 7.9 12.6 1.2 10.1-7.6z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path><path d="m1265.2 2599.8 3.7-.8-.4 10.3-2.3.9z" transform="matrix(.38779 0 0 .35285 -224 -715.6)"></path></g><path fill="#fff" d="M256 348c55 0 99.8-40.7 99.8-90.8a87.3 87.3 0 0 0-34.7-68.8 74.9 74.9 0 0 1 20.5 51.3c0 43.5-38.3 78.8-85.6 78.8s-85.6-35.3-85.6-78.8a74.8 74.8 0 0 1 20.6-51.3 87.3 87.3 0 0 0-34.8 68.8c0 50.1 44.8 90.9 99.8 90.9z" class="arab-fil2"></path><g fill="#fff" stroke="#000" stroke-width="8"><path d="M-54 1623c-88 44-198 32-291-28-4-2-6 1-2 12 10 29 18 52-12 95-13 19 2 22 24 20 112-11 222-36 275-57zm-2 52c-35 14-95 31-162 43-27 4-26 21 22 27 49 5 112-30 150-61z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M0 1579c12 0 34-5 56-8 41-7 11 56-56 56v21c68 0 139-74 124-107-21-48-79-7-124-7s-103-41-124 7c-15 33 56 107 124 107v-21c-67 0-97-63-56-56 22 3 44 8 56 8z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M54 1623c88 44 198 32 291-28 4-2 6 1 2 12-10 29-18 52 12 95 13 19-2 22-24 20-112-11-222-36-275-57zm2 52c35 14 94 31 162 43 27 4 26 21-22 27-49 5-112-30-150-61z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M3 1665c2 17 5 54 28 38 31-21 38-37 38-67 0-19-23-47-69-47s-69 28-69 47c0 30 7 46 38 67 23 16 25-21 28-38 1-6 6-4 6 0z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path></g><g fill="#fff" stroke="#000" stroke-width="8"><path d="M-29 384c-13-74-122-79-139-91-20-13-17 0-10 20 20 52 88 73 119 79 25 4 33 6 30-8z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M4 386c11-76-97-112-110-129-15-18-17-7-10 14 13 45 60 98 88 112 23 12 30 17 32 3z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M93 430c10-91-78-105-101-134-15-18-16-8-11 13 10 46 54 100 81 117 21 13 30 18 31 4z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M66 410c-91-59-155-26-181-29-25-3-33 13 10 37 53 29 127 25 156 14 30-12 21-18 15-22zm137 40c-28-98-93-82-112-94s-21-9-17 13c8 39 75 82 108 95 12 4 27 10 21-14z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M190 467c-78-63-139-16-163-23-18-5-10 7-3 12 50 35 112 54 160 32 19-8 20-10 6-21zm169 64c1-62-127-88-154-126-16-23-30-11-22 26 12 48 100 101 148 111 29 6 28-4 28-11z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M355 542c-81-73-149-49-174-56-25-6-35 9 4 39 48 36 122 43 153 36s23-14 17-19zm145 107c-23-106-96-128-114-148-17-20-35-14-20 34 18 57 77 107 108 119 30 13 28 3 26-5z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M499 663c-59-95-136-92-160-105-23-14-39-2-8 39 36 50 110 78 144 80s28-7 24-14z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M575 776c34-108-44-148-52-166-9-18-18-18-23 1-22 77 49 152 60 167 11 14 13 7 15-2z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M559 806c-27-121-98-114-114-131-17-17-19-5-16 17 8 59 79 99 111 119 10 6 22 13 19-5zm68 142c49-114-9-191-27-208-18-16-29-23-23 0 8 35-20 125 23 191 14 22 16 43 27 17z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M601 971c11-70-29-134-72-159-25-15-26-11-26 10 2 65 63 119 81 149 17 28 16 7 17 0z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M590 1153c-36-132 39-208 62-223 22-16 36-22 26 3-15 37 1 140-56 205-18 22-25 45-32 15z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M598 1124c30-115-35-180-55-193-19-13-31-18-22 3 12 32-1 122 49 178 16 19 22 38 28 12z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M561 1070c-54 58-55 143-31 193 15 29 17 27 31 6 38-61 15-149 17-188 1-37-11-17-17-11z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M650 1162c0 80-49 145-101 165-30 11-30 8-26-16 14-90 83-123 108-152 24-28 19-5 19 3z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M464 1400c88-80 41-136 45-188 2-28-9-21-19-11-56 55-59 153-47 191 5 17 13 15 21 8z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M582 1348c-29 88-106 142-171 145-38 2-37-1-24-27 49-94 136-105 175-129 36-22 23 2 20 11z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M343 1513c114-57 91-152 112-176 15-17-3-15-12-9-67 39-121 101-122 167 0 25 2 28 22 18z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M187 1619c144 23 211-86 253-96 22-5 6-14-5-15-96-11-218 34-255 84-15 20-15 24 7 27z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M333 1448c-29 95-137 173-218 179-38 3-38-1-24-26 65-118 178-138 218-168 34-26 27 6 24 15zM29 384c13-74 122-79 139-91 20-13 17 0 10 20-20 52-88 73-119 79-25 4-33 6-30-8z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-4 386c-11-76 97-112 110-129 15-18 17-7 10 14-13 45-60 98-88 112-23 12-30 17-32 3z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-93 430c-10-91 78-105 101-134 15-18 16-8 11 13-10 46-54 100-81 117-21 13-30 18-31 4z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-66 410c91-59 155-26 181-29 25-3 33 13-10 37-53 29-127 25-156 14-30-12-21-18-15-22zm-137 40c28-98 93-82 112-94s21-9 17 13c-8 39-75 82-108 95-12 4-27 10-21-14z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-190 467c78-63 139-16 163-23 18-5 10 7 3 12-50 35-112 54-160 32-19-8-20-10-6-21zm-169 64c-1-62 127-88 154-126 16-23 30-11 22 26-12 48-100 101-148 111-29 6-28-4-28-11z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-355 542c81-73 149-49 174-56 25-6 35 9-4 39-48 36-122 43-153 36s-23-14-17-19zm-145 107c23-106 96-128 114-148 17-20 35-14 20 34-18 57-77 107-108 119-30 13-28 3-26-5z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-499 663c59-95 136-92 160-105 23-14 39-2 8 39-36 50-110 78-144 80s-28-7-24-14z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-575 776c-34-108 44-148 52-166 9-18 18-18 23 1 22 77-49 152-60 167-11 14-13 7-15-2z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-559 806c27-121 98-114 114-131 17-17 19-5 16 17-8 59-79 99-111 119-10 6-22 13-19-5zm-68 142c-49-114 9-191 27-208 18-16 29-23 23 0-8 35 20 125-23 191-14 22-16 43-27 17z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-601 971c-11-70 29-134 72-159 25-15 26-11 26 10-2 65-63 119-81 149-17 28-16 7-17 0z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-590 1153c36-132-39-208-62-223-22-16-36-22-26 3 15 37-1 140 56 205 18 22 24 45 32 15z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-598 1124c-30-115 35-180 55-193 19-13 31-18 22 3-12 32 1 122-49 178-16 19-22 38-28 12z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-561 1070c54 58 55 143 31 193-15 29-17 27-31 6-38-61-15-149-17-188-1-37 11-17 17-11z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-650 1162c0 80 49 145 101 165 30 11 30 8 26-16-14-90-83-123-108-152-24-28-19-5-19 3z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-464 1400c-88-80-41-136-45-188-2-28 9-21 19-11 56 55 59 153 47 191-5 17-13 15-21 8z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-582 1348c29 88 106 142 171 145 38 2 37-1 24-27-49-94-136-105-175-129-36-22-23 2-20 11z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-343 1513c-114-57-91-152-112-176-15-17 3-15 12-9 67 39 121 101 122 167 0 25-2 28-22 18z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-187 1619c-144 23-211-86-253-96-22-5-6-14 5-15 96-11 218 34 255 84 15 20 15 24-7 27z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path><path d="M-333 1448c29 95 137 173 218 179 38 3 38-1 24-26-65-118-178-138-218-168-34-26-27 6-24 15z" class="arab-fil2 arab-str2" transform="matrix(.25022 0 0 .22768 256 29)"></path></g><path fill="#006233" d="M298.3 137.4c-4.8-3.1-22.3-1.3-25.5-3.4 6.2 4.8 20.2 1.4 25.5 3.4m42.3 8.2c-3.8-6.1-26-10.2-29.3-15.7 5.8 10.5 23 9.1 29.3 15.7m-3.3 7c-8.2-7.2-27.5-4.2-33.2-8.6 13.5 11.2 21 2.5 33.2 8.7zM289 120.4c5.3 2.5 11.8 5 15 10.9-3.7-4.6-10.5-6.4-16-10.2.3 0 .8-.5 1-.7m82.1 46.9c-3.3-6.9-14.8-14.4-15.8-16.9 3.3 8.9 12.8 11 15.8 16.9m3 12c-10-14.3-25.8-12.7-32-18.2 4.7 5.3 22.8 8.7 32 18.2m23.3 22.1c.7-15.2-11.8-21-12.3-29.6-.2 10.3 12.8 24.2 12.3 29.6m-6.3 8.2c-2.5-13.2-19.5-14.1-22.5-21.8 0 7.2 20 14.8 22.5 21.8m14-7.5c9 10 2.8 25.3 6.5 36.4-4.5-8.2-2.2-28.6-6.5-36.4m-14.7 42.8c13.5 13.2 8 28 13.5 34.4-6.8-9-5.8-26.2-13.5-34.4m28 1.8c-11.5 11.6-4.5 29.1-10.5 37.4 6.7-7.1 5.7-28.8 10.5-37.4m-14.5 0c-1.5-13.4-15.3-20.5-16.5-27.8-1.5 7.3 13.2 18.7 16.5 27.8m-7 32.1c2.2 9.4-6 29.4-3.5 35.5-5.5-10.7 4.7-31 3.5-35.5m17.7 21.4c-5.5 16.6-16.5 15.5-20 25.5 2.5-9.5 17-18.2 20-25.5m-35.7 7.8c-7.3 11.1-1.3 23.9-7.3 31.8 8.5-8 4-22.7 7.3-31.8m17.5 30.5c-8.8 14.8-26.8 13.4-34 24.1 7.2-13.4 29.5-15.7 34-24.1m-31.8-1.9c-15.5 9.8-10.8 20-22.5 31 14.7-11 13.5-23 22.5-31m-7.3 39.7c-15-.5-36.5 17.3-49.5 15.9 13 2.5 37-13.4 49.5-16zm-24.2-16c-1 13.9-40 22.8-44.3 32.1 4.7-12.3 39-21.4 44.3-32zm-88.4-256c-5-4-11-7.1-12.7-11 1.2 5 6.2 8.7 11.2 12 .5-.2 1-.9 1.5-1m-8.5 4c-7.7-3.4-16.7-3.2-20.7-8 2.5 4.8 11 6.7 18.2 9.2.8-.5 1.8-1 2.6-1.2zm-22.5 29.2c4.8-3.2 22.3-1.4 25.5-3.4-6.2 4.7-20.2 1.3-25.5 3.4m-42.3 8.2c3.8-6.2 26-10.3 29.3-15.7-5.8 10.4-23 9-29.3 15.7m3.3 7c8.2-7.3 27.5-4.3 33.3-8.6-13.5 11.1-21 2.5-33.3 8.6m33.3-21.4c4.7-9 18.2-10.2 21.7-15.7-5.2 8.2-16.7 9.6-21.7 15.7m38.5-8c13.8-5.9 27.3-.9 33.8-3.6-8 3.9-27 2-33.8 3.7zm-105.6 44c3.3-6.8 14.8-14.4 15.8-16.9-3.3 9-12.8 11-15.8 16.9m-3 12c10-14.3 25.8-12.7 32-18.2-4.7 5.3-22.7 8.7-32 18.3zm-23.3 22.1c-.7-15.2 11.8-21 12.3-29.6.2 10.3-12.8 24.2-12.3 29.6m6.3 8.2c2.5-13.2 19.5-14 22.5-21.8 0 7.3-20 14.8-22.5 21.8m-14-7.5c-9 10-2.8 25.3-6.5 36.4 4.5-8.1 2.2-28.6 6.5-36.4m14.7 42.8c-13.5 13.2-8 28-13.5 34.4 6.8-8.9 5.8-26.2 13.5-34.4m-28 1.9c11.5 11.6 4.5 29 10.5 37.3-6.7-7-5.7-28.7-10.5-37.3m14.5 0c1.5-13.5 15.3-20.5 16.5-27.8 1.5 7.3-13.2 18.7-16.5 27.8m7 32c-2.2 9.4 6 29.4 3.5 35.6 5.5-10.7-4.7-31-3.5-35.5zm-17.7 21.4c5.5 16.7 16.5 15.5 20 25.5-2.5-9.5-17-18.2-20-25.4zm35.8 7.8c7.2 11.2 1.2 23.9 7.2 31.9-8.5-8-4-22.8-7.2-31.9m-17.6 30.5c8.8 14.8 26.8 13.4 34 24.1-7.2-13.4-29.5-15.7-34-24.1m31.8-1.8c15.5 9.8 10.8 20 22.5 31-14.7-11-13.5-23-22.5-31m7.3 39.6c15-.5 36.5 17.3 49.5 16-13 2.4-37-13.5-49.5-16m24.3-16c1 14 40 22.8 44.2 32.2-4.7-12.3-39-21.4-44.3-32.1zm56.7-236.5c3-12.3 18-14.6 20-21.9-.7 7.8-18.5 16.4-20 22zM280 93.3c-2.2 9.3-18.5 14.6-20.7 21.6.7-9.5 17.5-15 20.7-21.6m-12.7 22c7.7-11.3 23.7-8.3 29.3-15-4 7.8-23.8 8-29.3 15" class="arab-fil0"></path><path fill="none" stroke="#f7c608" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M373.2 256c0 59.2-52.7 107.1-117.7 107.1s-117.6-47.9-117.6-107c0-59.2 52.6-107 117.6-107s117.7 47.8 117.7 107z"></path><path fill="#f7c608" d="m232.4 363.2-.4 1.3c-.3.9-1.2 1.3-2.2 1.3-2.5-.7-5.6-1.3-8.5-2l2.7-8.3a90 90 0 0 0 8.5 1.8c1 .2 1.5 1 1.2 2l-.4 1m-20.2-5.1.4-1.3c.3-1 1.2-1.4 2.2-1.1 2.3.8 5.1 1.8 8.3 2.7l-2.7 8.3c-3-.8-5.8-1.6-8.3-2.5-1-.5-1.2-2.2-.9-3"></path><path fill="#006233" d="m230.8 362.5-.3.9c-.2.6-1 1-1.8.9l-7-1.8 1.9-5.9a87 87 0 0 0 7 1.6c.9.2 1.3.8 1 1.5l-.2.7m-16.8-4.3.3-1c.2-.6 1-.9 1.8-.6l6.9 2.1-2 6a106 106 0 0 1-7-2c-.6-.4-.9-1.7-.7-2.3"></path><path fill="#f7c608" d="m200.2 352.8-.8 1.2c-.5.7-1.5 1-2.5.6-2.1-1.2-5-2.6-7.5-4.1l5.1-7.3a86 86 0 0 0 7.6 4c.9.5 1.1 1.4.6 2.2l-.7 1m-17.8-10.2.8-1.2c.5-.7 1.6-1 2.4-.5 2 1.5 4.4 3.1 7.1 4.7l-5.1 7.3a97 97 0 0 1-7.2-4.5c-.8-.7-.4-2.4 0-3.1"></path><path fill="#006233" d="m198.9 351.7-.6.8c-.4.6-1.2.7-2 .4l-6.2-3.5 3.7-5.2c2.2 1.4 4.6 2.5 6.3 3.4.7.4 1 1 .5 1.6l-.5.7m-14.8-8.5.6-.8c.4-.5 1.2-.6 2-.2a95 95 0 0 0 5.9 3.8l-3.7 5.2a68 68 0 0 1-6-3.7c-.6-.5-.5-1.8-.1-2.3"></path><path fill="#f7c608" d="m172.6 334.6-1.2.9c-.7.6-1.8.5-2.6 0l-6-5.9 7.3-5.6c2 2.2 4.4 4.3 6 5.7.7.7.6 1.6-.1 2.2l-1 .8m-14-14.3 1.2-1a1.8 1.8 0 0 1 2.5.2 78 78 0 0 0 5.3 6.4l-7.1 5.6a99 99 0 0 1-5.6-6.1c-.4-.9.4-2.5 1.1-3"></path><path fill="#006233" d="m171.6 333.2-.8.6c-.5.5-1.3.3-2-.1l-5-5 5.2-4a78 78 0 0 0 5 4.8c.6.6.6 1.3 0 1.8l-.6.5m-11.6-12 .8-.5c.6-.5 1.4-.4 2 .2a77 77 0 0 0 4.4 5.2l-5.1 4a68 68 0 0 1-4.6-5c-.5-.7 0-1.9.6-2.3"></path><path fill="#f7c608" d="m151.7 310-1.4.6c-.9.4-2 0-2.5-.7-1-2-2.7-4.7-4-7.1l8.7-3.6c1.4 2.7 3 5.3 4.1 7 .4.9 0 1.8-.8 2.1l-1.2.5m-9-17.3 1.4-.6c1-.3 2 0 2.3.8a75 75 0 0 0 3.2 7.5l-8.6 3.6c-1.3-2.5-2.5-5-3.4-7.4-.2-1 1-2.2 2-2.6"></path><path fill="#006233" d="m151.2 308.4-1 .4c-.6.3-1.4 0-1.9-.6l-3.2-6 6.2-2.6a72 72 0 0 0 3.4 6c.3.6 0 1.3-.6 1.6l-.8.4m-7.4-14.4 1-.4c.6-.3 1.4 0 1.7.7.7 1.8 1.6 4 2.7 6.2l-6.2 2.5a78 78 0 0 1-2.9-6c-.1-.8.7-1.8 1.4-2"></path><path fill="#f7c608" d="m139.2 281.1-1.5.2a2.1 2.1 0 0 1-2.2-1.3l-1.5-7.9 9.4-1.2a68 68 0 0 0 1.7 7.8c.2 1-.4 1.7-1.4 1.8l-1.3.2m-3.2-18.9 1.5-.2c1-.1 1.8.4 2 1.4 0 2.2.2 5 .7 8l-9.4 1.1c-.4-2.7-.9-5.3-1-7.9.1-1 1.7-1.8 2.7-2"></path><path fill="#006233" d="m139.2 279.5-1 .1c-.7.1-1.3-.4-1.6-1.1-.3-1.9-.9-4.3-1.2-6.6l6.7-.9a69 69 0 0 0 1.4 6.6c0 .7-.3 1.3-1 1.4l-1 .2m-2.6-15.8 1-.1c.8 0 1.4.4 1.5 1.2.1 1.8.3 4.1.7 6.5l-6.8 1c-.3-2.3-.7-4.6-.8-6.6 0-.8 1.2-1.5 2-1.6"></path><path fill="#f7c608" d="m136.2 250.2-1.5-.2c-1-.1-1.6-1-1.7-1.9l1-7.9 9.4 1.3a69 69 0 0 0-.7 7.9c-.2.9-1 1.5-2 1.3l-1.3-.1m2.8-19 1.5.2c1 .2 1.6 1 1.4 1.8a73 73 0 0 0-1.7 7.9l-9.4-1.3a85 85 0 0 1 1.5-7.8c.4-1 2.2-1.4 3.2-1.2"></path><path fill="#006233" d="m136.8 248.6-1.1-.2c-.7 0-1.2-.7-1.2-1.5l.9-6.5 6.7.8a69 69 0 0 0-.7 6.7c-.1.7-.7 1.2-1.4 1.1l-1-.1m2.4-15.8 1 .2c.8 0 1.2.7 1 1.4-.4 1.9-1 4.1-1.3 6.5l-6.7-.8q.45-3.45 1.2-6.6c.3-.7 1.6-1 2.3-1"></path><path fill="#f7c608" d="m142.9 219.7-1.3-.6c-1-.3-1.3-1.2-1.1-2.2 1-2 2.1-4.8 3.4-7.3l8.6 3.6a75 75 0 0 0-3.2 7.4c-.4.9-1.4 1.2-2.3.8l-1.1-.4m8.5-17.5 1.3.5c1 .4 1.3 1.3.9 2.1a77 77 0 0 0-4.1 7l-8.6-3.5a78 78 0 0 1 3.8-7.1c.7-.8 2.6-.8 3.5-.4"></path><path fill="#006233" d="m144 218.4-1-.5c-.7-.2-1-1-.7-1.7l2.8-6 6.2 2.5a71 71 0 0 0-2.7 6.1c-.3.7-1 1-1.7.8l-.9-.4m7.1-14.5 1 .4c.7.3.9 1 .6 1.7a76 76 0 0 0-3.4 5.9l-6.2-2.6a82 82 0 0 1 3.2-6c.5-.6 2-.6 2.6-.4"></path><path fill="#f7c608" d="m158.8 192.2-1.2-.9c-.7-.6-.8-1.6-.3-2.4 1.6-1.7 3.5-4.1 5.5-6.2l7.2 5.7a77 77 0 0 0-5.4 6.3 1.8 1.8 0 0 1-2.4.2l-1-.8m13.6-14.6 1.1 1c.8.5.9 1.5.2 2.2a84 84 0 0 0-6.1 5.7l-7.2-5.7 6-5.8c.8-.6 2.6 0 3.4.5"></path><path fill="#006233" d="m160.2 191.1-.8-.6c-.6-.4-.6-1.2-.2-1.9l4.7-5 5.1 4a76 76 0 0 0-4.5 5.2c-.5.6-1.3.7-1.9.3l-.7-.6m11.3-12.1.9.6c.5.5.5 1.2 0 1.8a85 85 0 0 0-5 4.8l-5.2-4a58 58 0 0 1 4.9-5c.6-.5 2-.1 2.5.3"></path><path fill="#f7c608" d="m182.5 169.9-.8-1.2c-.6-.8-.3-1.7.4-2.4l7.2-4.5 5.1 7.3a83 83 0 0 0-7 4.7 1.8 1.8 0 0 1-2.5-.5l-.7-1m17.6-10.5.8 1.2c.6.7.3 1.7-.5 2.2a84 84 0 0 0-7.7 3.9l-5.1-7.3c2.5-1.5 5-3 7.5-4.1 1-.3 2.6.7 3 1.4"></path><path fill="#006233" d="m184.2 169.2-.6-.8c-.4-.6-.2-1.3.4-1.8 1.8-1 4-2.5 6-3.8l3.7 5.2-5.9 3.9c-.7.4-1.5.3-1.9-.2l-.5-.7m14.6-8.8.6.9c.4.5.2 1.2-.5 1.6a89 89 0 0 0-6.4 3.3l-3.6-5.2a97 97 0 0 1 6.2-3.4c.8-.3 2 .4 2.4 1"></path><path fill="#f7c608" d="m212.2 154.5-.4-1.3c-.3-.9.2-1.7 1-2.2 2.5-.6 5.5-1.7 8.4-2.5l2.7 8.3a88 88 0 0 0-8.3 2.7c-1 .3-1.9-.2-2.1-1l-.4-1.1m20-5.7.5 1.3c.3 1-.2 1.8-1.2 2a95 95 0 0 0-8.5 1.8l-2.7-8.3c2.9-.7 5.8-1.5 8.5-2 1 0 2.2 1.3 2.5 2.2"></path><path fill="#006233" d="m214 154.3-.3-1c-.2-.6.2-1.2 1-1.5 2-.6 4.5-1.4 7-2l1.9 5.9a87 87 0 0 0-7 2.2c-.8.1-1.5-.1-1.7-.8l-.2-.7m16.7-4.7.3 1c.2.6-.3 1.2-1 1.4a98 98 0 0 0-7.2 1.6l-1.9-6a107 107 0 0 1 7-1.7c1 0 1.9.9 2 1.5"></path><path fill="#f7c608" d="M245.4 147.4v-1.3c0-1 .8-1.6 1.8-1.9l8.7-.2v8.7a90 90 0 0 0-8.7.4c-1 0-1.8-.7-1.8-1.6v-1.1m21-.3v1.4c0 1-.7 1.6-1.7 1.6a96 96 0 0 0-8.8-.4V144c3 0 6 0 8.8.2 1 .2 1.7 1.8 1.7 2.7"></path><path fill="#006233" d="M247.2 147.7v-1c0-.6.6-1.1 1.5-1.3l7.3-.1v6.1a92 92 0 0 0-7.3.4c-.9 0-1.5-.5-1.5-1.2v-.8m17.5-.2v1c0 .7-.6 1.2-1.5 1.2a88 88 0 0 0-7.2-.4v-6.1l7.2.1c.9.2 1.5 1.3 1.5 2"></path><path fill="#f7c608" d="m277.3 149 .4-1.4c.2-.8 1.2-1.3 2.2-1.3 2.4.6 5.6 1.2 8.5 2l-2.6 8.3a90 90 0 0 0-8.6-1.7c-1-.3-1.5-1.1-1.2-2l.4-1.1m20.3 5-.5 1.3c-.2.9-1.2 1.4-2.1 1.1a93 93 0 0 0-8.3-2.6l2.6-8.3a82 82 0 0 1 8.3 2.4c1 .4 1.2 2.2 1 3"></path><path fill="#006233" d="m279 149.7.2-1c.2-.6 1-1 1.8-.9 2 .6 4.6 1 7 1.7l-1.8 6a89 89 0 0 0-7.1-1.6c-.8-.2-1.3-.8-1-1.4l.2-.8m16.8 4.2-.3 1c-.2.6-1 .9-1.7.7a92 92 0 0 0-7-2.2l2-6 6.9 2c.8.4 1 1.7.8 2.3"></path><path fill="#f7c608" d="m309.5 159 .8-1c.6-.9 1.6-1 2.6-.8l7.5 4-5 7.4a86 86 0 0 0-7.7-3.8 1.6 1.6 0 0 1-.6-2.3l.7-1m18 10-.9 1.2a1.8 1.8 0 0 1-2.4.5 88 88 0 0 0-7.1-4.6l5-7.3c2.6 1.4 5.1 2.9 7.3 4.4.7.7.4 2.4-.1 3.2"></path><path fill="#006233" d="m310.9 160.2.6-.8c.4-.6 1.2-.7 2-.4 1.7 1 4.1 2.1 6.2 3.4l-3.6 5.2a85 85 0 0 0-6.4-3.3c-.7-.4-1-1-.5-1.6l.5-.7m14.8 8.3-.5.8c-.4.6-1.2.7-2 .3a87 87 0 0 0-6-3.8l3.7-5.2c2.1 1.2 4.3 2.4 6 3.6.7.6.6 1.8.2 2.4"></path><path fill="#f7c608" d="m337.4 177 1.1-.8c.8-.7 1.8-.6 2.7 0 1.6 1.7 4 3.7 6 5.8l-7.2 5.7a80 80 0 0 0-6.2-5.7c-.6-.7-.5-1.6.2-2.2l1-.8m14 14.2-1.1 1a1.8 1.8 0 0 1-2.5-.2c-1.4-1.9-3.3-4-5.4-6.3l7.2-5.7c2 2 3.9 4 5.5 6.1.5.8-.3 2.4-1 3"></path><path fill="#006233" d="m338.3 178.5.8-.7c.6-.4 1.4-.3 2 .1 1.4 1.5 3.4 3.2 5 5l-5 4a79 79 0 0 0-5.2-4.8c-.5-.5-.5-1.3 0-1.7l.7-.6m11.7 11.9-.8.6c-.6.4-1.4.3-2-.2a80 80 0 0 0-4.5-5.2l5.1-4c1.7 1.6 3.3 3.3 4.7 5 .4.6-.1 1.8-.6 2.3"></path><path fill="#f7c608" d="m358.5 201.5 1.4-.6c.9-.4 1.9 0 2.5.7 1 2 2.7 4.6 4 7l-8.7 3.7c-1.3-2.7-3-5.2-4.1-7-.4-.8 0-1.7.8-2.1l1.2-.5m9 17.2-1.3.6c-.9.4-1.9 0-2.3-.8a76 76 0 0 0-3.3-7.4l8.7-3.6a87 87 0 0 1 3.4 7.3c.2 1-1 2.2-2 2.6"></path><path fill="#006233" d="m359 203 1-.4c.6-.2 1.4 0 1.9.7.9 1.7 2.2 3.9 3.2 6l-6.1 2.5a79 79 0 0 0-3.4-5.8c-.4-.7-.2-1.4.5-1.7l.8-.4m7.6 14.4-1 .4c-.7.3-1.4 0-1.8-.7-.7-1.8-1.6-4-2.7-6.2l6.1-2.6a86 86 0 0 1 3 6c.1.9-.7 1.8-1.4 2.1"></path><path fill="#f7c608" d="m371.2 230.3 1.5-.2c1-.2 1.9.4 2.3 1.3l1.5 7.8-9.3 1.3a70 70 0 0 0-1.9-7.8c-.1-.9.5-1.7 1.5-1.8l1.2-.2m3.4 18.9-1.4.2c-1 .1-1.9-.4-2-1.3l-.8-8 9.3-1.3c.5 2.7 1 5.4 1.1 7.9 0 1-1.7 1.9-2.7 2"></path><path fill="#006233" d="m371.2 232 1-.2c.8-.1 1.4.4 1.7 1.1l1.3 6.5-6.7 1a69 69 0 0 0-1.5-6.6c-.1-.7.3-1.3 1-1.4l1-.2m2.7 15.7-1 .2c-.7.1-1.4-.4-1.5-1.2a72 72 0 0 0-.7-6.5l6.7-1c.4 2.3.8 4.5 1 6.6-.1.8-1.3 1.5-2 1.6"></path><path fill="#f7c608" d="m374.5 261.2 1.5.2c1 0 1.7.9 1.8 1.8-.4 2.3-.6 5.2-1 8l-9.4-1.2c.5-3 .7-6 .7-8 .1-.9 1-1.5 2-1.3l1.2.1m-2.5 19-1.5-.2c-1-.1-1.7-.9-1.5-1.8.5-2.2 1.2-4.9 1.6-7.8l9.5 1.1c-.4 2.7-.8 5.4-1.5 7.9-.3.9-2.2 1.3-3.2 1.2"></path><path fill="#006233" d="m374 262.8 1 .1c.8 0 1.2.7 1.3 1.5l-.8 6.6-6.8-.8c.4-2.5.6-5 .7-6.6 0-.8.7-1.3 1.4-1.2h.9m-2.2 15.9-1-.1c-.8-.1-1.2-.8-1-1.5.4-1.9.9-4 1.3-6.6l6.7.9a82 82 0 0 1-1.2 6.5c-.2.8-1.6 1.2-2.3 1"></path><path fill="#f7c608" d="m368.2 291.7 1.3.6c1 .3 1.3 1.2 1.1 2.2-1 2-2 4.8-3.3 7.3l-8.7-3.5a76 76 0 0 0 3.1-7.5c.4-.8 1.4-1.1 2.3-.8l1.2.5m-8.4 17.6-1.3-.6c-1-.4-1.3-1.3-1-2.1 1.3-2 2.8-4.4 4.1-7l8.7 3.4c-1.2 2.5-2.5 5-3.8 7.2-.6.8-2.5.7-3.5.3"></path><path fill="#006233" d="m367.1 293 1 .5c.7.3.9 1 .7 1.7l-2.8 6.1-6.2-2.5a71 71 0 0 0 2.6-6.2c.4-.6 1.1-1 1.8-.7l.8.3m-7 14.6-1-.4c-.6-.2-.8-1-.5-1.7a76 76 0 0 0 3.3-5.9l6.2 2.5a86 86 0 0 1-3.1 6c-.5.7-1.9.7-2.5.5"></path><path fill="#f7c608" d="m352.5 319.4 1.2.8c.8.6.8 1.6.4 2.4l-5.5 6.2-7.2-5.6c2-2.2 4-4.6 5.3-6.3.6-.7 1.6-.8 2.4-.2l1 .7m-13.5 14.7-1.1-.8c-.8-.6-.9-1.6-.2-2.3a77 77 0 0 0 6-5.8l7.3 5.6a94 94 0 0 1-5.9 6c-.8.5-2.6 0-3.4-.6"></path><path fill="#006233" d="m351.1 320.4.9.6c.5.5.5 1.2.1 1.9l-4.6 5.1-5.2-4c1.8-1.8 3.4-3.8 4.5-5.2.5-.6 1.3-.7 1.9-.3l.7.5m-11.2 12.3-.8-.7c-.6-.4-.6-1.1 0-1.7a82 82 0 0 0 5-4.9l5.1 4a77 77 0 0 1-4.8 5c-.7.5-2 .2-2.6-.3"></path><path fill="#f7c608" d="m329 341.9.8 1.1c.6.8.4 1.7-.3 2.4l-7.2 4.6-5.2-7.3a83 83 0 0 0 7-4.7 1.8 1.8 0 0 1 2.5.4l.6 1m-17.4 10.7-.8-1.2c-.6-.7-.4-1.7.5-2.2a90 90 0 0 0 7.6-4l5.2 7.3c-2.5 1.4-5 3-7.5 4.1-1 .4-2.5-.6-3-1.4"></path><path fill="#006233" d="m327.3 342.5.6.9c.4.5.2 1.2-.4 1.8l-6 3.7-3.7-5.1a85 85 0 0 0 5.9-4c.7-.4 1.5-.3 1.9.3l.5.7m-14.6 8.8-.5-.8c-.4-.6-.2-1.3.5-1.7a89 89 0 0 0 6.3-3.3l3.7 5.1c-2 1.3-4.2 2.5-6.2 3.5-.8.3-2-.3-2.4-.9"></path><path fill="#f7c608" d="m299.5 357.4.4 1.4c.3.8-.2 1.7-1 2.1l-8.4 2.6-2.7-8.3a80 80 0 0 0 8.2-2.7c1-.3 1.9.1 2.2 1l.3 1.1m-20 5.8-.4-1.3c-.3-.9.2-1.8 1.1-2 2.5-.4 5.5-1 8.6-1.9l2.7 8.3c-2.9.8-5.7 1.6-8.4 2-1 .1-2.3-1.2-2.6-2"></path><path fill="#006233" d="m297.7 357.7.3.9c.2.6-.2 1.2-1 1.6-2 .6-4.5 1.4-7 2l-1.9-5.8a88 88 0 0 0 6.9-2.3c.8-.2 1.5.1 1.8.7l.2.8m-16.7 4.8-.3-1c-.2-.6.3-1.2 1-1.4a88 88 0 0 0 7.1-1.6l2 5.9a106 106 0 0 1-7 1.7c-.9.1-1.8-.8-2-1.4"></path><path fill="#f7c608" d="M266.3 364.8v1.4c0 1-.7 1.6-1.7 1.8-2.5 0-5.7.3-8.8.3v-8.6a88 88 0 0 0 8.7-.5c1 0 1.8.6 1.8 1.5v1.2m-21 .4v-1.4c0-.9.7-1.6 1.7-1.6 2.5.2 5.5.4 8.7.4l.1 8.6a101 101 0 0 1-8.7-.1c-1-.2-1.8-1.8-1.8-2.7"></path><path fill="#006233" d="M264.5 364.6v1c0 .6-.6 1-1.4 1.3l-7.3.2v-6.2c2.6 0 5.3-.2 7.2-.4.9 0 1.5.5 1.5 1.1v.8m-17.5.4v-1c0-.7.6-1.2 1.4-1.2 2.1.2 4.6.3 7.3.3l.1 6.2-7.3-.1c-.8-.2-1.5-1.3-1.5-2"></path>', 51)
  ]));
}
const lg = { render: ag }, cg = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 512 512"
};
function ug(e, t) {
  return N(), B("svg", cg, t[0] || (t[0] = [
    es('<g fill-rule="evenodd"><path fill="#e30a17" d="M0 0h512v512H0z"></path><path fill="#fff" d="M348.8 264c0 70.6-58.3 127.9-130.1 127.9s-130.1-57.3-130.1-128 58.2-127.8 130-127.8S348.9 193.3 348.9 264z"></path><path fill="#e30a17" d="M355.3 264c0 56.5-46.6 102.3-104.1 102.3s-104-45.8-104-102.3 46.5-102.3 104-102.3 104 45.8 104 102.3z"></path><path fill="#fff" d="m374.1 204.2-1 47.3-44.2 12 43.5 15.5-1 43.3 28.3-33.8 42.9 14.8-24.8-36.3 30.2-36.1-46.4 12.8z"></path></g>', 1)
  ]));
}
const fg = { render: ug }, dg = { class: "lang-switch__label" }, hg = { class: "lang-locale" }, pg = { class: "lang-icon" }, mg = {
  __name: "LangItem",
  props: {
    label: {
      type: String,
      required: !0,
      default() {
        return "de";
      }
    },
    langFlagIcon: {
      type: String,
      required: !0,
      default() {
        return "langDEIcon";
      }
    }
  },
  setup(e) {
    const t = e;
    return (n, s) => (N(), B("div", dg, [
      C("span", hg, ee(t.label), 1),
      C("span", pg, [
        (N(), rt(rr(e.langFlagIcon), { "aria-hidden": "true" }))
      ])
    ]));
  }
}, Ko = /* @__PURE__ */ Qe(mg, [["__scopeId", "data-v-c1ab30ba"]]), gg = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "icon icon-tabler icons-tabler-filled icon-tabler-caret-down",
  viewBox: "0 0 24 24"
};
function _g(e, t) {
  return N(), B("svg", gg, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M18 9c.852 0 1.297.986.783 1.623l-.076.084-6 6a1 1 0 0 1-1.32.083l-.094-.083-6-6-.083-.094-.054-.077-.054-.096-.017-.036-.027-.067-.032-.108-.01-.053-.01-.06-.004-.057v-.118l.005-.058.009-.06.01-.052.032-.108.027-.067.07-.132.065-.09.073-.081.094-.083.077-.054.096-.054.036-.017.067-.027.108-.032.053-.01.06-.01.057-.004z" }, null, -1)
  ]));
}
const bg = { render: _g }, vg = ["tabindex"], yg = { class: "options__title" }, wg = ["onClick"], kg = {
  __name: "LangSelect",
  props: {
    options: {
      type: Array,
      required: !0
    },
    modelValue: {
      type: String,
      required: !0
    },
    tabindex: {
      type: Number,
      required: !1,
      default: 0
    },
    primaryColor: {
      type: String
    }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const { t: n } = yt(), s = e, r = V(!1), o = (l) => {
      a.value = l, r.value = !1;
    }, i = t, a = ke({
      get: () => s.options.find((l) => l.id === s.modelValue) || s.options[0],
      set: (l) => i("update:modelValue", l.id)
    });
    return gn(() => {
    }), (l, u) => (N(), B("div", {
      class: "custom-select",
      tabindex: s.tabindex,
      onBlur: u[1] || (u[1] = (c) => r.value = !1)
    }, [
      C("div", {
        class: je(["selected", { open: r.value }]),
        onClick: u[0] || (u[0] = (c) => r.value = !r.value)
      }, [
        q(Ko, {
          "lang-flag-icon": a.value.icon,
          label: a.value.id.toUpperCase()
        }, null, 8, ["lang-flag-icon", "label"]),
        q(H(bg), {
          class: "caret",
          width: "28px",
          height: "28px",
          color: "#787F89"
        })
      ], 2),
      C("div", {
        class: je(["items", { selectHide: !r.value }])
      }, [
        C("span", yg, ee(H(n)("langSwitch")), 1),
        (N(!0), B(Oe, null, Nn(s.options, (c, f) => (N(), B("div", {
          class: "lang-option",
          key: f,
          onClick: (h) => o(c)
        }, [
          q(Ko, {
            "lang-flag-icon": c.icon,
            label: c.label
          }, null, 8, ["lang-flag-icon", "label"])
        ], 8, wg))), 128))
      ], 2)
    ], 40, vg));
  }
}, xg = /* @__PURE__ */ Qe(kg, [["__scopeId", "data-v-0d3c3c76"]]), Eg = { class: "language-radio-select" }, Ag = {
  id: "lang-switch-title",
  class: "lang-switch__title"
}, Cg = ["aria-activedescendant"], Tg = ["aria-checked", "id", "onClick"], Sg = {
  __name: "LanguageSwitch",
  props: {
    config: {
      type: Object
    }
  },
  emits: ["language-changed"],
  setup(e, { emit: t }) {
    const { t: n, locale: s } = yt(), r = [
      { id: "de", label: "Deutsch", icon: Zm },
      { id: "en", label: "English", icon: ng },
      { id: "tr", label: "Türkçe", icon: fg },
      { id: "ar", label: "العربية", icon: lg },
      { id: "ru", label: "Русский", icon: og }
    ], o = e, i = V(s), a = t, l = async (_) => {
      i.value = _.id, a("language-changed", i.value);
    }, u = ke(() => r.filter((_) => _.id === i.value)[0]), c = () => {
      sessionStorage.setItem("selectedLanguage", u.value.id);
    }, f = () => {
      let _ = r.findIndex((w) => w.id === i.value);
      _++, _ >= r.length && (_ = 0), i.value = r[_].id;
    }, h = () => {
      let _ = r.findIndex((w) => w.id === i.value);
      _--, _ < 0 && (_ = r.length - 1), i.value = r[_].id;
    }, b = (_) => {
      let w = !1;
      switch (_.key) {
        case " ":
          w = !0;
          break;
        case "Up":
        case "ArrowUp":
        case "Left":
        case "ArrowLeft":
          w = !0, h();
          break;
        case "Down":
        case "ArrowDown":
        case "Right":
        case "ArrowRight":
          w = !0, f();
          break;
      }
      w && (_.stopPropagation(), _.preventDefault());
    };
    return bt(i, (_) => {
      s.value = _, c();
    }), (_, w) => (N(), B(Oe, null, [
      C("div", Eg, [
        C("span", Ag, ee(H(n)("langSwitch")), 1),
        C("ul", {
          class: "languages radiogroup-activedescendant",
          role: "radiogroup",
          tabindex: "0",
          "aria-activedescendant": r[0].id,
          onFocus: w[0] || (w[0] = (...x) => _.onGroupFocus && _.onGroupFocus(...x)),
          onKeydown: b,
          onBlur: w[1] || (w[1] = (...x) => _.onBlur && _.onBlur(...x))
        }, [
          (N(), B(Oe, null, Nn(r, (x) => C("li", {
            key: x.id,
            "aria-checked": i.value === x.id,
            role: "radio",
            id: x.id,
            onClick: (g) => l(x)
          }, [
            q(Ko, {
              class: "radio-input",
              "lang-flag-icon": x.icon,
              label: x.id.toUpperCase()
            }, null, 8, ["lang-flag-icon", "label"])
          ], 8, Tg)), 64))
        ], 40, Cg)
      ]),
      q(xg, {
        class: "language-dropdown-select",
        options: r,
        modelValue: i.value,
        "onUpdate:modelValue": w[2] || (w[2] = (x) => i.value = x),
        tabindex: 0,
        "primary-color": o.config.primaryColor
      }, null, 8, ["modelValue", "primary-color"])
    ], 64));
  }
}, Rg = /* @__PURE__ */ Qe(Sg, [["__scopeId", "data-v-29a6bd05"]]), Lg = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-microphone",
  viewBox: "0 0 24 24"
};
function Ig(e, t) {
  return N(), B("svg", Lg, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M9 5a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3z" }, null, -1),
    C("path", { d: "M5 10a7 7 0 0 0 14 0M8 21h8M12 17v4" }, null, -1)
  ]));
}
const Mg = { render: Ig }, Og = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "icon icon-tabler icons-tabler-filled icon-tabler-microphone",
  viewBox: "0 0 24 24"
};
function Ng(e, t) {
  return N(), B("svg", Og, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M19 9a1 1 0 0 1 1 1 8 8 0 0 1-6.999 7.938L13 20h3a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h3v-2.062A8 8 0 0 1 4 10a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1m-7-8a4 4 0 0 1 4 4v5a4 4 0 1 1-8 0V5a4 4 0 0 1 4-4" }, null, -1)
  ]));
}
const bl = { render: Ng }, $g = { class: "chat-window-recorder" }, Pg = {
  key: 0,
  class: "record-progress__info"
}, Dg = {
  key: 1,
  class: "record-progress__info"
}, Fg = {
  key: 2,
  class: "recording-time"
}, Bg = { class: "sr-only" }, Ug = {
  key: 3,
  class: "recorded-time"
}, Hg = { class: "sr-only" }, zg = { class: "sr-only" }, jg = ["disabled"], Vg = { class: "sr-only" }, Wg = ["disabled"], Kg = { class: "sr-only" }, fo = 3e4, qg = {
  __name: "ChatWindowRecorder",
  props: {
    primaryColor: {
      type: String
    },
    isLoading: {
      type: Boolean
    }
  },
  emits: ["audioAvailable", "startedRecording", "finishedRecording", "deleteMedia"],
  setup(e, { expose: t, emit: n }) {
    const { t: s } = yt(), r = n, o = e, i = V(!1), a = V(null), l = V(0), u = V(), c = V(null), f = V([]), h = V(null), b = V(new Audio()), _ = V(!1), w = V(0), x = V(0), g = V(!1), A = V(!1), T = V(!1), k = V(!1), M = V(!1), P = V(!1), O = Ut("stopRecordingButton"), X = Ut("playRecordingButton"), W = Ut("pauseRecordingPlaybackButton"), J = Ut("deleteRecordingButton"), G = Ut("startRecordingButton"), D = ke(() => !!h.value), te = ke(() => D.value && !_.value);
    Zn(() => {
    });
    const he = () => {
      i.value ? ue() : Ne();
    }, Ne = async () => {
      try {
        const ve = await navigator.mediaDevices.getUserMedia({ audio: !0 });
        u.value = ve, c.value = new MediaRecorder(ve), c.value.ondataavailable = (Te) => {
          f.value.push(Te.data);
        }, c.value.onstop = async () => {
          const Te = new Blob(f.value, { type: "audio/mpeg" });
          h.value = URL.createObjectURL(Te), i.value = !1, r("audioAvailable", Te), b.value.src = h.value, x.value = await Be(Te);
        }, c.value.start(), r("startedRecording"), i.value = !0, await Mn(() => {
          O.value.focus();
        });
        const se = (/* @__PURE__ */ new Date()).getTime();
        a.value = setInterval(() => {
          const Te = (/* @__PURE__ */ new Date()).getTime();
          l.value = Te - se, l.value >= fo - 1800 && pe(), l.value >= fo && ue();
        }, 1e3);
      } catch (ve) {
        console.error("Error accessing microphone:", ve);
      }
    }, ue = async () => {
      var ve;
      c.value && i.value && (c.value.stop(), r("finishedRecording"), (ve = u.value) == null || ve.getTracks().forEach((se) => se.stop()), f.value = []), le();
    }, le = () => {
      clearInterval(a.value), a.value = null, l.value = 0;
    }, ce = () => {
      h.value && (URL.revokeObjectURL(h.value), h.value = null, c.value = null, x.value = 0, w.value = 0), r("deleteMedia");
    }, ne = () => {
      _.value = !0, b.value.play();
    }, _e = () => {
      _.value = !1, b.value.pause();
    }, pe = () => {
      g.value = !0, setInterval(() => {
        g.value = !1;
      }, 1e3);
    };
    b.value.ontimeupdate = () => {
      w.value = b.value.currentTime;
    }, b.value.onended = () => {
      _.value = !1;
    };
    const Be = async (ve) => {
      const se = document.createElement("video"), Te = new Promise((Xe, pt) => {
        se.addEventListener("loadedmetadata", () => {
          se.duration === 1 / 0 ? (se.currentTime = Number.MAX_SAFE_INTEGER, se.ontimeupdate = () => {
            se.ontimeupdate = null, Xe(se.duration), se.currentTime = 0;
          }) : Xe(se.duration);
        }), se.onerror = (at) => pt(at.target.error);
      });
      return se.src = typeof ve == "string" || ve instanceof String ? ve : window.URL.createObjectURL(ve), Te;
    };
    return bt(te, () => {
      te.value && Mn().then(() => {
        X.value.focus();
      });
    }), t({ deleteCurrentAudioRecord: ce, stopRecording: ue }), (ve, se) => (N(), B("div", $g, [
      i.value || D.value ? (N(), B("div", {
        key: 0,
        class: je(["record-progress", { "record-progress--recording": i.value, "record-progress--player": D.value }])
      }, [
        q(H(bl), {
          style: { width: "40px", height: "40px", padding: "1px 6px" },
          color: i.value ? "#F13E6B" : D.value ? e.primaryColor : ""
        }, null, 8, ["color"]),
        i.value ? (N(), B("span", Pg, ee(H(s)("recordingInProgress")), 1)) : we("", !0),
        D.value ? (N(), B("span", Dg, ee(H(s)("recording")), 1)) : we("", !0),
        i.value ? (N(), B("span", Fg, [
          Lt(ee(H(dl)(l.value)) + " / ", 1),
          C("span", {
            class: je({ "blink-1": g.value })
          }, ee(H(dl)(fo)) + "s", 3)
        ])) : we("", !0),
        Bt(C("button", {
          ref_key: "stopRecordingButton",
          ref: O,
          class: "default-action",
          type: "button",
          onClick: ue,
          onMouseenter: se[0] || (se[0] = (Te) => T.value = !0),
          onMouseleave: se[1] || (se[1] = (Te) => T.value = !1)
        }, [
          q(Rt, {
            icon: H(pr),
            "default-color": "#F13E6B",
            "icon-hover": H(mr),
            "hover-color": "#F13E6B",
            "is-hovered": T.value,
            "aria-hidden": "true"
          }, null, 8, ["icon", "icon-hover", "is-hovered"]),
          C("span", Bg, ee(H(s)("screenReader.stopRecordingAction")), 1)
        ], 544), [
          [un, i.value]
        ]),
        D.value ? (N(), B("span", Ug, [
          C("span", null, ee(H(br)(w.value)) + " / " + ee(H(br)(x.value)), 1)
        ])) : we("", !0),
        Bt(C("button", {
          ref_key: "playRecordingButton",
          ref: X,
          class: "default-action",
          type: "button",
          onClick: ne,
          onMouseenter: se[2] || (se[2] = (Te) => M.value = !0),
          onMouseleave: se[3] || (se[3] = (Te) => M.value = !1)
        }, [
          q(Rt, {
            icon: H(ki),
            "default-color": e.primaryColor,
            "icon-hover": H(fu),
            "hover-color": e.primaryColor,
            "is-hovered": M.value,
            "aria-hidden": "true"
          }, null, 8, ["icon", "default-color", "icon-hover", "hover-color", "is-hovered"]),
          C("span", Hg, ee(H(s)("screenReader.stopRecordingAction")), 1)
        ], 544), [
          [un, te.value]
        ]),
        Bt(C("button", {
          ref_key: "pauseRecordingPlaybackButton",
          ref: W,
          class: "default-action",
          type: "button",
          onClick: _e,
          onMouseenter: se[4] || (se[4] = (Te) => P.value = !0),
          onMouseleave: se[5] || (se[5] = (Te) => P.value = !1)
        }, [
          q(Rt, {
            icon: H(pr),
            "default-color": e.primaryColor,
            "icon-hover": H(mr),
            "hover-color": e.primaryColor,
            "is-hovered": P.value,
            "aria-hidden": "true"
          }, null, 8, ["icon", "default-color", "icon-hover", "hover-color", "is-hovered"]),
          C("span", zg, ee(H(s)("screenReader.stopRecordingAction")), 1)
        ], 544), [
          [un, D.value && _.value]
        ]),
        Bt(C("button", {
          class: "default-action prompt-action",
          ref_key: "deleteRecordingButton",
          ref: J,
          onClick: ce,
          disabled: o.isLoading,
          type: "button",
          onMouseenter: se[6] || (se[6] = (Te) => k.value = !0),
          onMouseleave: se[7] || (se[7] = (Te) => k.value = !1)
        }, [
          q(Rt, {
            icon: H(lu),
            "default-color": e.primaryColor,
            "icon-hover": H(cu),
            "hover-color": e.primaryColor,
            "is-hovered": k.value,
            "aria-hidden": "true"
          }, null, 8, ["icon", "default-color", "icon-hover", "hover-color", "is-hovered"]),
          C("span", Vg, ee(H(s)("screenReader.deleteRecordingAction")), 1)
        ], 40, jg), [
          [un, !i.value && D.value]
        ])
      ], 2)) : we("", !0),
      Bt(C("button", {
        class: je(["default-action record-btn", { record: i.value }]),
        ref_key: "startRecordingButton",
        ref: G,
        type: "button",
        onClick: tt(he, ["prevent"]),
        onMouseenter: se[8] || (se[8] = (Te) => A.value = !0),
        onMouseleave: se[9] || (se[9] = (Te) => A.value = !1),
        disabled: o.isLoading
      }, [
        q(Rt, {
          icon: H(Mg),
          "default-color": o.primaryColor,
          "icon-hover": H(bl),
          "hover-color": o.primaryColor,
          "is-hovered": A.value,
          "aria-hidden": "true"
        }, null, 8, ["icon", "default-color", "icon-hover", "hover-color", "is-hovered"]),
        C("span", Kg, ee(H(s)("screenReader.startRecordingAction")), 1)
      ], 42, Wg), [
        [un, !i.value && !D.value]
      ])
    ]));
  }
}, Gg = /* @__PURE__ */ Qe(qg, [["__scopeId", "data-v-f4412524"]]), Yg = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-arrow-wave-right-up"
};
function Qg(e, t) {
  return N(), B("svg", Yg, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M17 10h4v4" }, null, -1),
    C("path", { d: "M3 12c.887-1.284 2.48-2.033 4-2 1.52-.033 3.113.716 4 2s2.48 2.033 4 2c1.52.033 3-1 4-2l2-2" }, null, -1)
  ]));
}
const vl = { render: Qg }, Xg = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-brain"
};
function Jg(e, t) {
  return N(), B("svg", Xg, t[0] || (t[0] = [
    es('<path stroke="none" d="M0 0h24v24H0z"></path><path d="M15.5 13a3.5 3.5 0 0 0-3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1-7 0v-1.8"></path><path d="M17.5 16a3.5 3.5 0 0 0 0-7H17"></path><path d="M19 9.3V6.5a3.5 3.5 0 0 0-7 0M6.5 16a3.5 3.5 0 0 1 0-7H7"></path><path d="M5 9.3V6.5a3.5 3.5 0 0 1 7 0v10"></path>', 5)
  ]));
}
const Zg = { render: Jg }, e3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24"
};
function t3(e, t) {
  return N(), B("svg", e3, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M5 12h2M17 12h2M11 12h2"
    }, null, -1)
  ]));
}
const yl = { render: t3 }, n3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24"
};
function s3(e, t) {
  return N(), B("svg", n3, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0Z"
    }, null, -1),
    C("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3ZM9.5 9h.01M14.5 9h.01"
    }, null, -1),
    C("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M9.5 13a3.5 3.5 0 0 0 5 0"
    }, null, -1)
  ]));
}
const r3 = { render: s3 }, o3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "transparent"
};
function i3(e, t) {
  return N(), B("svg", o3, t[0] || (t[0] = [
    C("path", {
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M4.517 17A9 9 0 1 1 19.483 7 9 9 0 0 1 4.517 17M12 17v.01"
    }, null, -1),
    C("path", {
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M12 13.5a1.5 1.5 0 0 1 1-1.5 2.6 2.6 0 1 0-3-4"
    }, null, -1)
  ]));
}
const qo = { render: i3 }, a3 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-message-plus",
  viewBox: "0 0 24 24"
};
function l3(e, t) {
  return N(), B("svg", a3, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M8 9h8M8 13h6M12.01 18.594 8 21v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v5.5M16 19h6M19 16v6" }, null, -1)
  ]));
}
const c3 = { render: l3 }, u3 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-chevron-down",
  viewBox: "0 0 24 24"
};
function f3(e, t) {
  return N(), B("svg", u3, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "m6 9 6 6 6-6" }, null, -1)
  ]));
}
const d3 = { render: f3 }, h3 = { class: "welcome-message" }, p3 = { class: "welcome-message__inner" }, m3 = { class: "welcome-message__header" }, g3 = ["innerHTML"], _3 = { class: "welcome-message__logo" }, b3 = ["src"], v3 = ["innerHTML"], y3 = {
  class: "icon-groups",
  "aria-hidden": "true"
}, w3 = { class: "icon-group" }, k3 = { class: "icon-group" }, x3 = ["innerHTML"], E3 = { key: 0 }, A3 = { key: 1 }, C3 = {
  __name: "ChatMessageWelcome",
  props: {
    config: {
      type: Object
    }
  },
  setup(e) {
    $r((u) => ({
      "44cd1507": a.value
    }));
    const { t, locale: n } = yt(), s = e, r = V(!1), o = ke(() => s.config.primaryColor), i = ke(() => Jn(s.config.primaryColor + Xn(50))), a = ke(() => Jn(s.config.primaryColor + Xn(10))), l = () => {
      r.value = !r.value;
    };
    return (u, c) => (N(), B("section", h3, [
      C("div", p3, [
        C("div", {
          class: je(["welcome-message__read-more", { expanded: r.value, collapsed: !r.value }])
        }, [
          C("header", m3, [
            C("div", {
              class: "welcome-message__title",
              innerHTML: e.config.welcome[H(n)].title
            }, null, 8, g3),
            C("div", _3, [
              C("img", {
                src: s.config.logo,
                alt: "Logo"
              }, null, 8, b3)
            ])
          ]),
          C("p", {
            innerHTML: e.config.welcome[H(n)].text
          }, null, 8, v3),
          C("div", y3, [
            C("div", w3, [
              q(H(qo), { color: o.value }, null, 8, ["color"]),
              q(H(vl), { color: i.value }, null, 8, ["color"]),
              q(H(Zg), { color: o.value }, null, 8, ["color"]),
              q(H(vl), { color: i.value }, null, 8, ["color"]),
              q(H(r3), { color: o.value }, null, 8, ["color"])
            ]),
            C("div", k3, [
              q(H(ki), { color: o.value }, null, 8, ["color"]),
              q(H(yl), { color: i.value }, null, 8, ["color"]),
              q(H(uu), { color: o.value }, null, 8, ["color"]),
              q(H(yl), { color: i.value }, null, 8, ["color"]),
              q(H(c3), { color: o.value }, null, 8, ["color"])
            ])
          ]),
          C("p", {
            innerHTML: e.config.welcome[H(n)].additionalText
          }, null, 8, x3)
        ], 2),
        C("button", {
          onClick: l,
          type: "button",
          class: je(["read-more-btn", { expanded: r.value }])
        }, [
          r.value ? (N(), B("span", E3, ee(H(t)("readLess")), 1)) : (N(), B("span", A3, ee(H(t)("readMore")), 1)),
          q(H(d3), {
            class: "chevron",
            width: "16px"
          })
        ], 2)
      ])
    ]));
  }
}, T3 = /* @__PURE__ */ Qe(C3, [["__scopeId", "data-v-504d1a63"]]), S3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "transparent",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"
};
function R3(e, t) {
  return N(), B("svg", S3, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1za4 4 0 0 0 4-4V6a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1-2 2h-7a3 3 0 0 1-3-3" }, null, -1)
  ]));
}
const L3 = { render: R3 }, I3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "currentColor",
  class: "icon icon-tabler icons-tabler-filled icon-tabler-thumb-up"
};
function M3(e, t) {
  return N(), B("svg", I3, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M13 3a3 3 0 0 1 2.995 2.824L16 6v4h2a3 3 0 0 1 2.98 2.65l.015.174L21 13l-.02.196-1.006 5.032c-.381 1.626-1.502 2.796-2.81 2.78L17 21H9a1 1 0 0 1-.993-.883L8 20l.001-9.536a1 1 0 0 1 .5-.865 3 3 0 0 0 1.492-2.397L10 7V6a3 3 0 0 1 3-3M5 10a1 1 0 0 1 .993.883L6 11v9a1 1 0 0 1-.883.993L5 21H4a2 2 0 0 1-1.995-1.85L2 19v-7a2 2 0 0 1 1.85-1.995L4 10z" }, null, -1)
  ]));
}
const wl = { render: M3 }, O3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "transparent",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-thumb-down"
};
function N3(e, t) {
  return N(), B("svg", O3, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M7 13V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1za4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2-2l-1-5a2 3 0 0 0-2-2h-7a3 3 0 0 0-3 3" }, null, -1)
  ]));
}
const $3 = { render: N3 }, P3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "currentColor",
  class: "icon icon-tabler icons-tabler-filled icon-tabler-thumb-down"
};
function D3(e, t) {
  return N(), B("svg", P3, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M13 21.008a3 3 0 0 0 2.995-2.823l.005-.177v-4h2a3 3 0 0 0 2.98-2.65l.015-.173.005-.177-.02-.196-1.006-5.032c-.381-1.625-1.502-2.796-2.81-2.78L17 3.008H9a1 1 0 0 0-.993.884L8 4.008l.001 9.536a1 1 0 0 0 .5.866 3 3 0 0 1 1.492 2.396l.007.202v1a3 3 0 0 0 3 3M5 14.008a1 1 0 0 0 .993-.883L6 13.008v-9a1 1 0 0 0-.883-.993L5 3.008H4A2 2 0 0 0 2.005 4.86L2 5.01v7a2 2 0 0 0 1.85 1.994l.15.005h1z" }, null, -1)
  ]));
}
const kl = { render: D3 }, F3 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-user",
  viewBox: "0 0 24 24"
};
function B3(e, t) {
  return N(), B("svg", F3, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" }, null, -1)
  ]));
}
const Wu = { render: B3 }, U3 = {
  key: 0,
  class: "more-actions"
}, H3 = { class: "more-actions__title" }, z3 = { class: "questions" }, j3 = ["onClick"], V3 = ["onClick"], W3 = { class: "rating-container" }, K3 = { class: "chat-rating" }, q3 = { class: "chat-rating__label" }, G3 = { class: "sr-only" }, Y3 = { class: "sr-only" }, Q3 = {
  key: 0,
  class: "chat-contact"
}, X3 = {
  __name: "ChatWindowMoreAction",
  props: {
    data: {
      type: Object
    },
    isLoading: {
      type: Boolean
    }
  },
  emits: [
    "related-question-clicked",
    "contact-support-clicked",
    "rate-positive",
    "rate-negative"
  ],
  setup(e, { expose: t, emit: n }) {
    const { t: s } = yt(), r = n, o = e, i = V(!1), a = V(!1), l = V(!1), u = V(!1), c = V(!1), f = ke(() => {
      var g;
      return !!((g = o.data) != null && g.related_questions);
    }), h = (g, A = null) => {
      r("related-question-clicked", {
        question: g,
        faqId: A
      });
    }, b = () => {
      i.value = !i.value, i.value && (a.value = !1, l.value = !1, r("rate-positive"));
    }, _ = () => {
      a.value = !a.value, l.value = !l.value, a.value && (i.value = !1, r("rate-negative"));
    }, w = () => {
      r("contact-support-clicked");
    };
    return t({ displayContactInfo: () => {
      l.value = !0;
    } }), (g, A) => f.value ? (N(), B("div", U3, [
      C("span", H3, ee(H(s)("moreActions")), 1),
      C("div", z3, [
        (N(!0), B(Oe, null, Nn(o.data.related_questions, (T) => (N(), B("button", {
          class: "question-btn",
          key: T,
          onClick: (k) => h(T)
        }, [
          Lt(ee(T) + " ", 1),
          q(H(qo), { "aria-hidden": "true" })
        ], 8, j3))), 128)),
        (N(!0), B(Oe, null, Nn(o.data.faq_questions, (T) => (N(), B("button", {
          class: "question-btn",
          key: T.id,
          onClick: (k) => h(T.text, T.id)
        }, [
          Lt(ee(T.text) + " ", 1),
          q(H(qo), { "aria-hidden": "true" })
        ], 8, V3))), 128))
      ]),
      C("div", W3, [
        C("div", K3, [
          C("span", q3, ee(H(s)("chatRating")), 1),
          C("button", {
            onClick: b,
            class: "chat-rating__action chat-rating__action--positive",
            onMouseenter: A[0] || (A[0] = (T) => u.value = !0),
            onMouseleave: A[1] || (A[1] = (T) => u.value = !1)
          }, [
            i.value ? (N(), rt(H(wl), {
              key: 1,
              "aria-hidden": "true",
              color: "#50ca88"
            })) : (N(), rt(Rt, {
              key: 0,
              icon: H(L3),
              "icon-hover": H(wl),
              "hover-color": "#50ca88",
              "default-color": "#50ca88",
              "is-hovered": u.value,
              "aria-hidden": "true"
            }, null, 8, ["icon", "icon-hover", "is-hovered"])),
            C("span", G3, ee(H(s)("screenReader.ratePositiveAction")), 1)
          ], 32),
          C("button", {
            onClick: _,
            class: je(["default-btn chat-rating__action chat-rating__action--negative", { active: a.value }]),
            onMouseenter: A[2] || (A[2] = (T) => c.value = !0),
            onMouseleave: A[3] || (A[3] = (T) => c.value = !1)
          }, [
            a.value ? (N(), rt(H(kl), {
              key: 1,
              "aria-hidden": "true",
              color: "#f13e6b"
            })) : (N(), rt(Rt, {
              key: 0,
              icon: H($3),
              "icon-hover": H(kl),
              "hover-color": "#f13e6b",
              "default-color": "#f13e6b",
              "is-hovered": c.value,
              "aria-hidden": "true"
            }, null, 8, ["icon", "icon-hover", "is-hovered"])),
            C("span", Y3, ee(H(s)("screenReader.rateNegativeAction")), 1)
          ], 34)
        ]),
        q(vs, null, {
          default: An(() => [
            l.value ? (N(), B("div", Q3, [
              C("button", {
                onClick: w,
                class: "contact__action"
              }, [
                Lt(ee(H(s)("contactSupport")) + " ", 1),
                q(H(Wu), {
                  class: "user-icon",
                  "aria-hidden": "true",
                  width: "24px"
                })
              ])
            ])) : we("", !0)
          ]),
          _: 1
        })
      ])
    ])) : we("", !0);
  }
}, J3 = /* @__PURE__ */ Qe(X3, [["__scopeId", "data-v-9cd83a5a"]]), Z3 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-dots-vertical"
};
function e_(e, t) {
  return N(), B("svg", Z3, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0M11 19a1 1 0 1 0 2 0 1 1 0 1 0-2 0M11 5a1 1 0 1 0 2 0 1 1 0 1 0-2 0" }, null, -1)
  ]));
}
const t_ = { render: e_ }, n_ = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
};
function s_(e, t) {
  return N(), B("svg", n_, t[0] || (t[0] = [
    es('<g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" clip-path="url(#a)"><path d="M4.067 13.041a8 8 0 1 0 9.925-8.788C10.093 3.253 6.057 5.26 4.567 9"></path><path d="M4 4v5h5"></path></g><defs><clipPath id="a"><path fill="#fff" d="M24 0H0v24h24z"></path></clipPath></defs>', 2)
  ]));
}
const r_ = { render: s_ }, o_ = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "icon icon-tabler icons-tabler-outline icon-tabler-text-size"
};
function i_(e, t) {
  return N(), B("svg", o_, t[0] || (t[0] = [
    C("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M3 7V5h13v2M10 5v14M12 19H8M15 13v-1h6v1M18 12v7M17 19h2" }, null, -1)
  ]));
}
const a_ = { render: i_ }, l_ = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "currentColor",
  class: "icon icon-tabler icons-tabler-filled icon-tabler-contrast"
};
function c_(e, t) {
  return N(), B("svg", l_, t[0] || (t[0] = [
    C("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    C("path", { d: "M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34M8 5.072A8 8 0 0 0 12.001 20L12 4a8 8 0 0 0-4 1.072" }, null, -1)
  ]));
}
const u_ = { render: c_ }, f_ = ["onKeydown", "aria-expanded"], d_ = { class: "sr-only" }, h_ = ["onKeydown"], p_ = ["onClick", "onKeydown"], m_ = {
  key: 1,
  role: "group",
  "data-option": "font-color",
  "aria-label": "Text Color",
  class: "text-size__options"
}, g_ = ["aria-checked"], __ = ["aria-checked"], b_ = ["aria-checked"], v_ = { key: 2 }, y_ = {
  key: 1,
  class: "menu-group-header"
}, w_ = {
  __name: "ChatWindowMenu",
  props: {
    buttonText: { type: String, default: "Menu" },
    chatbotConfig: {
      type: Object
    }
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const { t: n } = yt(), s = e, r = t, o = V(!1), i = `menu-${Math.random().toString(36).substr(2, 9)}`, a = V(null), l = V(null), u = V([]), c = V(16), f = V(!1), h = V(!1), b = () => {
      o.value = !o.value, o.value && Mn(() => g());
    }, _ = () => {
      o.value || (o.value = !0, Mn(() => g()));
    }, w = (ne = !0) => {
      o.value && (o.value = !1, ne && a.value.focus());
    }, x = (ne) => {
      var _e;
      (_e = u.value[ne]) == null || _e.focus();
    }, g = () => x(0), A = () => x(u.value.length - 1), T = () => {
      const _e = (u.value.findIndex((pe) => pe === document.activeElement) - 1 + u.value.length) % u.value.length;
      x(_e);
    }, k = () => {
      const _e = (u.value.findIndex((pe) => pe === document.activeElement) + 1) % u.value.length;
      x(_e);
    }, M = (ne) => {
      ne.setting.action && (ne.setting.action(), ne.setting.type && ne.setting.type !== "switch" && ne.setting.type !== "textsize" && w());
    }, P = (ne) => {
      l.value && !l.value.contains(ne.target) && !a.value.contains(ne.target) && w(!1);
    }, O = () => {
      w(), r("clickResetChat");
    }, X = () => {
      w();
      const ne = `Name: ${s.chatbotConfig.contact.name} 
Email: ${s.chatbotConfig.contact.email} `;
      alert(ne);
    }, W = () => {
      if (c.value === 22) {
        f.value = !1, c.value = 16;
        return;
      }
      f.value || (f.value = !0), c.value = parseInt(c.value) + 2;
    }, J = () => {
      if (c.value === 16) {
        c.value = 22, f.value = !0;
        return;
      }
      if (c.value === 18) {
        c.value = 16, f.value = !1;
        return;
      }
      f.value || (f.value = !0), c.value = parseInt(c.value) - 2;
    }, G = () => {
      h.value = !h.value;
    }, D = V([
      {
        label: n("chatReset"),
        icon: r_,
        setting: { action: O }
      },
      {
        label: n("contact"),
        icon: Wu,
        setting: { action: X }
      },
      {
        label: n("chatDisplay")
      },
      {
        label: n("textSize"),
        icon: a_,
        setting: {
          action: W,
          nextAction: W,
          prevAction: J,
          type: "textsize"
        }
      },
      {
        label: n("contrast"),
        icon: u_,
        setting: {
          action: G,
          type: "switch"
        }
      }
    ]), te = () => {
      c.value && sessionStorage.setItem("textSize", c.value);
    }, he = () => {
      const ne = sessionStorage.getItem("textSize");
      ne && (c.value = parseInt(ne) ?? 16);
    }, Ne = (ne) => {
      ne.setting.nextAction && ne.setting.nextAction();
    }, ue = (ne) => {
      ne.setting.nextAction && ne.setting.prevAction();
    }, le = () => {
      sessionStorage.setItem("isHighContrast", h.value);
    }, ce = () => {
      h.value = sessionStorage.getItem("isHighContrast") === "true";
    };
    return gn(() => {
      document.addEventListener("click", P), he(), ce();
    }), li(() => {
      document.removeEventListener("click", P);
    }), bt(c, () => {
      r("changeTextSize", c.value), te();
    }), bt(h, () => {
      r("changeHighContrast", h.value), le();
    }), (ne, _e) => (N(), B("div", null, [
      C("button", {
        onClick: b,
        onKeydown: [
          lt(tt(_, ["prevent"]), ["up"]),
          lt(tt(_, ["prevent"]), ["down"]),
          lt(tt(b, ["prevent"]), ["enter"]),
          lt(tt(b, ["prevent"]), ["space"])
        ],
        "aria-haspopup": "true",
        "aria-expanded": o.value,
        "aria-controls": i,
        ref_key: "triggerRef",
        ref: a,
        class: "menu-btn"
      }, [
        q(H(t_), { "aria-hidden": "true" }),
        C("span", d_, ee(H(n)("screenReader.menuAction")), 1)
      ], 40, f_),
      Bt(C("ul", {
        class: "chat-window__menu",
        id: i,
        role: "menu",
        onKeydown: [
          lt(w, ["esc"]),
          lt(tt(T, ["prevent"]), ["up"]),
          lt(tt(k, ["prevent"]), ["down"]),
          lt(tt(g, ["prevent"]), ["home"]),
          lt(tt(A, ["prevent"]), ["end"]),
          lt(tt(w, ["prevent"]), ["tab"])
        ],
        ref_key: "menuRef",
        ref: l
      }, [
        (N(!0), B(Oe, null, Nn(D.value, (pe, Be) => (N(), B(Oe, { key: Be }, [
          pe.setting ? (N(), B("li", {
            key: 0,
            role: "menuitem",
            tabindex: "-1",
            class: "menu__item",
            onClick: (ve) => M(pe),
            onKeydown: [
              lt(tt((ve) => M(pe), ["prevent"]), ["enter"]),
              lt(tt((ve) => M(pe), ["prevent"]), ["space"]),
              lt(tt((ve) => Ne(pe), ["prevent"]), ["right"]),
              lt(tt((ve) => ue(pe), ["prevent"]), ["left"])
            ],
            ref_for: !0,
            ref_key: "menuItemRefs",
            ref: u
          }, [
            pe.icon ? (N(), rt(rr(pe.icon), {
              key: 0,
              width: "24px",
              height: "24px",
              "aria-hidden": "false"
            })) : we("", !0),
            Lt(" " + ee(pe.label) + " ", 1),
            pe.setting.type && pe.setting.type === "textsize" ? (N(), B("ul", m_, [
              C("li", {
                class: je(["text-size18 text-size__step", { active: c.value == 18 }]),
                role: "menuitemradio",
                "aria-checked": c.value == 18
              }, _e[1] || (_e[1] = [
                C("span", { "aria-hidden": "true" }, null, -1),
                Lt("A ")
              ]), 10, g_),
              C("li", {
                class: je(["text-size20 text-size__step", { active: c.value == 20 }]),
                role: "menuitemradio",
                "aria-checked": c.value == 20
              }, _e[2] || (_e[2] = [
                C("span", { "aria-hidden": "true" }, null, -1),
                Lt("A ")
              ]), 10, __),
              C("li", {
                class: je(["text-size22 text-size__step", { active: c.value == 22 }]),
                role: "menuitemradio",
                "aria-checked": c.value == 22
              }, _e[3] || (_e[3] = [
                C("span", { "aria-hidden": "true" }, null, -1),
                Lt("A ")
              ]), 10, b_)
            ])) : we("", !0),
            pe.setting.type && pe.setting.type === "switch" ? (N(), B("span", v_, [
              Bt(C("input", {
                id: "contrast",
                class: "menu-item-btn sr-only",
                type: "checkbox",
                "onUpdate:modelValue": _e[0] || (_e[0] = (ve) => h.value = ve),
                role: "switch"
              }, null, 512), [
                [g1, h.value]
              ]),
              C("span", {
                class: je(["switch", { active: h.value }])
              }, _e[4] || (_e[4] = [
                C("span", { class: "switch-indicator" }, null, -1)
              ]), 2)
            ])) : we("", !0)
          ], 40, p_)) : (N(), B("li", y_, ee(pe.label), 1))
        ], 64))), 128))
      ], 40, h_), [
        [un, o.value]
      ])
    ]));
  }
}, k_ = /* @__PURE__ */ Qe(w_, [["__scopeId", "data-v-958654f3"]]), x_ = { class: "chat-window-wrapper" }, E_ = {
  key: 0,
  class: "toggle-btn-wrapper"
}, A_ = { class: "sr-only" }, C_ = {
  key: 0,
  class: "toggle-message"
}, T_ = { key: 0 }, S_ = { key: 1 }, R_ = { class: "sr-only" }, L_ = ["lang"], I_ = {
  key: 0,
  class: "loading-window"
}, M_ = {
  key: 1,
  class: "chat-window__inner"
}, O_ = { class: "chatbot-header" }, N_ = { class: "chatbot-header__logo" }, $_ = ["src"], P_ = { class: "chatbot-header__title" }, D_ = { class: "chatbot-header__actions" }, F_ = { class: "sr-only" }, B_ = ["aria-label"], U_ = { class: "chat-window__footer" }, H_ = {
  class: "input-wrapper",
  autocomplete: "off"
}, z_ = { class: "sr-only" }, j_ = ["placeholder", "disabled"], V_ = { class: "prompt-actions" }, W_ = ["disabled"], K_ = { class: "sr-only" }, ho = "hwChatbotMessages", xl = "hwToggleMessageClosed", q_ = {
  __name: "ChatWindow",
  setup(e) {
    $r((Q) => ({
      13391394: le.value,
      "294284b3": ce.value,
      "294284d2": ne.value,
      c1265d54: k.value,
      "036bd376": M.value,
      "4bad1328": P.value,
      dfbe1a2c: O.value,
      faa8d8fa: _e.value,
      14453168: pe.value
    }));
    const { t, locale: n } = yt(), s = V(!1), r = V([]), o = V(""), i = V(!1), a = V({
      primaryColor: "#000",
      textColor: "#000"
    }), l = V(!1), u = V(-1), c = V(!1), f = V(null), h = V(), b = V(!1), _ = V(!1), w = V(!1);
    w.value = Qt("isFullscreen");
    const x = V(null);
    x.value = Qt("chatbotId");
    const g = V(null);
    g.value = Qt("toggleTextDe");
    const A = V(null);
    A.value = Qt("toggleTextEn");
    const T = V(!1), k = V("#fff"), M = V("#000"), P = V("#000"), O = V("#fff"), X = V(16), W = Ut("promptInput"), J = Ut("chatContentContainer"), G = Ut("chatbotRecorder"), D = Ut("moreActionElement"), te = Ut("toggleBtn"), he = V(!1), Ne = ke(() => !!f.value), ue = ke(() => !l.value && (!!o.value || Ne.value) || c.value), le = ke(() => a.value.primaryColor), ce = ke(() => Jn(a.value.primaryColor + Xn(10))), ne = ke(() => Jn(a.value.primaryColor + Xn(20))), _e = ke(() => `${X.value}px`), pe = ke(() => n.value === "ar" ? "rtl" : "ltr"), Be = () => {
      s.value = !s.value, s.value === !0 && (j.value = null);
    }, ve = () => {
      se(
        {
          content: a.value.firstMessage[n.value]
        },
        "system",
        !1,
        !0
      );
    }, se = (Q, ie = "user", Je = !1, Me = !1) => {
      const We = (/* @__PURE__ */ new Date()).getTime(), Ze = {
        id: We.toString(),
        role: ie,
        timestamp: We,
        srHidden: Je,
        ...Q,
        animate: Me
      };
      r.value.push(Ze), wt();
    }, Te = async (Q) => {
      if (he.value = !1, c.value) {
        await G.value.stopRecording(), he.value = !0;
        return;
      }
      if (f.value) {
        await Xe();
        return;
      }
      if (l.value) return;
      l.value = !0;
      const ie = r.value.map((Me) => ({
        role: Me.role,
        content: Me.content
      })), Je = o.value;
      o.value = "", se({ content: Je }, "user", 0, !0);
      try {
        u.value = r.value.length, se({ content: "" }, "system", !1, !0);
        const Me = {
          text_input: Je,
          ...Q
        };
        await er.sendMessage(Me, ie, n.value, pt);
      } catch (Me) {
        console.error("error sendMessage", Me);
      } finally {
        l.value = !1, u.value = -1, m(), wt(), at();
      }
    }, Xe = async () => {
      if (l.value) return;
      he.value = !1;
      const Q = f.value, ie = r.value.map((Me) => ({
        role: Me.role,
        content: Me.content
      })), Je = {
        recording: Q,
        recordingBlobBase64: h.value
      };
      se(Je, "user", 0, !0), l.value = !0;
      try {
        u.value = r.value.length, r.value.push({
          id: (/* @__PURE__ */ new Date()).getTime().toString(),
          role: "system",
          timestamp: (/* @__PURE__ */ new Date()).getTime()
        }), G.value.deleteCurrentAudioRecord(), await er.sendMessage(
          {
            audio_input: Q
          },
          ie,
          n.value,
          pt
        );
      } catch (Me) {
        console.error("sendAudio error: ", { e: Me });
      } finally {
        l.value = !1, u.value = -1, f.value = null, m(), wt(), at();
      }
    }, pt = (Q) => {
      Q.answer_text && (r.value[u.value].content = Q.answer_text, r.value[u.value].id = (/* @__PURE__ */ new Date()).getTime().toString()), Q.sources && (r.value[u.value].sources = Q.sources), Q.image && (r.value[u.value].image = Q.image, r.value[u.value].image_alt = Q.image_alt, r.value[u.value].image_source = Q.image_source), Q.related_questions && (r.value[u.value].related_questions = Q.related_questions), Q.faq_questions && (r.value[u.value].faq_questions = Q.faq_questions), Q.transcribed_audio && (r.value[u.value - 1].content || (r.value[u.value - 1].content = Q.transcribed_audio)), Q.user_dissatisfaction_detected && D.value.displayContactInfo();
    }, at = () => {
      Mn(() => {
        W.value ? W.value.focus() : console.warn("input not found");
      });
    }, wt = () => {
      Mn(() => {
        J.value ? J.value.scrollTo({
          top: J.value.scrollHeight,
          behavior: "smooth"
        }) : console.warn("messageContainer not found");
      });
    }, kt = async () => {
      i.value = !0;
      try {
        s.value = !0, a.value = await er.loadConfig(x.value), mc("config", a.value), r.value.length <= 0 && ve();
      } catch (Q) {
        console.error("loadConfig error: ", Q.message);
      } finally {
        i.value = !1, wt(), at();
      }
    }, en = () => {
      const Q = `Name: ${a.value.contact.name} 
Email: ${a.value.contact.email} `;
      alert(Q);
    }, tn = () => {
      if (b.value) return;
      b.value = !0;
      const Q = sessionStorage.getItem(ho);
      if (!Q) {
        b.value = !1;
        return;
      }
      try {
        r.value = JSON.parse(Q);
      } catch {
        console.error("Error parsing json string from local storage (getStoredMessages)");
      } finally {
        b.value = !1;
      }
    }, m = () => {
      if (r.value.length === 0) {
        sessionStorage.setItem(ho, "");
        return;
      }
      for (let ie = 0; ie < r.value.length; ie++)
        r.value[ie].animate && (r.value[ie].animate = !1), r.value[ie].srHidden = !1;
      const Q = JSON.stringify(r.value);
      sessionStorage.setItem(ho, Q);
    }, v = (Q) => {
      o.value = Q.question, Te({ faqId: Q.faqId });
    }, L = (Q) => {
      f.value = Q;
      const ie = new FileReader();
      ie.onloadend = () => {
        h.value = ie.result, he.value && Xe();
      }, ie.readAsDataURL(f.value);
    }, U = () => {
      c.value = !0;
    }, F = () => {
      c.value = !1;
    }, d = () => {
      f.value = null;
    }, p = () => {
      wt();
    }, E = () => {
      console.info("onRatePositive");
    }, R = () => {
      console.info("onRateNegative");
    }, $ = () => {
      o.value = "";
    }, z = () => {
      r.value = [], m(), ve();
    }, y = (Q) => {
      X.value = Q;
    }, S = (Q) => {
      T.value = Q;
    }, j = V(null), Y = V(!0), fe = () => {
      j.value = !1, de(!0);
    }, de = (Q) => {
      sessionStorage.setItem(xl, Q);
    }, $e = () => {
      sessionStorage.getItem(xl) && (j.value = !1);
    }, Ue = () => {
      j.value !== !1 && setTimeout(() => {
        j.value = !0, setTimeout(() => {
          A.value && (Y.value = !1);
        }, 6250), setTimeout(() => {
          j.value = !1;
        }, 12500);
      }, 3e3);
    };
    return gn(() => {
      w.value && kt(), tn(), $e(), Ue();
    }), Zn(() => {
    }), (Q, ie) => (N(), B("div", x_, [
      s.value ? we("", !0) : (N(), B("div", E_, [
        C("button", {
          onClick: kt,
          class: je(["toggle-btn", { open: j.value }]),
          ref_key: "toggleBtn",
          ref: te
        }, [
          ie[3] || (ie[3] = Lt(" Chat Assistent ")),
          q(H(Lp), { width: "20px" }),
          C("span", A_, ee(H(t)("screenReader.openAction")), 1)
        ], 2),
        q(vs, { name: "scale-up-br" }, {
          default: An(() => [
            j.value ? (N(), B("div", C_, [
              q(vs, {
                name: "fade",
                mode: "out-in"
              }, {
                default: An(() => [
                  Y.value ? (N(), B("p", T_, ee(g.value), 1)) : (N(), B("p", S_, ee(A.value), 1))
                ]),
                _: 1
              }),
              C("button", {
                type: "button",
                class: "toggle-message__close-btn",
                onClick: fe
              }, [
                q(H(Xa), { "aria-hidden": "true" }),
                C("span", R_, ee(H(t)("screenReader.closeToggleMessageAction")), 1)
              ])
            ])) : we("", !0)
          ]),
          _: 1
        })
      ])),
      q(vs, { name: "scale-up-br" }, {
        default: An(() => {
          var Je;
          return [
            s.value ? (N(), B("div", {
              key: 0,
              class: je(["chat-window", { "chat-window--high-contrast": T.value }]),
              lang: H(n)
            }, [
              i.value ? (N(), B("div", I_, [
                q(Pu)
              ])) : we("", !0),
              i.value ? we("", !0) : (N(), B("div", M_, [
                C("header", O_, [
                  C("div", N_, [
                    C("img", {
                      src: (Je = a.value) == null ? void 0 : Je.logo,
                      alt: "Chatbot Logo"
                    }, null, 8, $_)
                  ]),
                  C("div", P_, ee(a.value.headerTitle), 1),
                  C("div", D_, [
                    q(Rg, { config: a.value }, null, 8, ["config"]),
                    q(k_, {
                      "chatbot-config": a.value,
                      onClickResetChat: z,
                      onChangeTextSize: y,
                      onChangeHighContrast: S
                    }, null, 8, ["chatbot-config"]),
                    w.value ? we("", !0) : (N(), B("button", {
                      key: 0,
                      role: "button",
                      class: "default-action chat-window__action close-btn",
                      onClick: Be
                    }, [
                      q(H(Xa), { "aria-hidden": "true" }),
                      C("span", F_, ee(H(t)("screenReader.closeAction")), 1)
                    ]))
                  ])
                ]),
                C("section", {
                  ref: "chatContentContainer",
                  class: "chat-content",
                  "aria-live": "polite",
                  tabindex: "0",
                  "aria-label": H(t)("screenReader.label.history")
                }, [
                  ie[4] || (ie[4] = C("div", { class: "sponsored-by" }, [
                    C("img", {
                      src: bp,
                      alt: "Sponsor Logo"
                    })
                  ], -1)),
                  q(c1, {
                    tag: "ul",
                    name: "list",
                    class: "chat-content__inner"
                  }, {
                    default: An(() => [
                      C("li", null, [
                        q(T3, { config: a.value }, null, 8, ["config"])
                      ]),
                      (N(!0), B(Oe, null, Nn(r.value, (Me, We) => {
                        var Ze;
                        return N(), B("li", {
                          key: Me.id
                        }, [
                          q(Qm, {
                            message: Me,
                            avatar: (Ze = a.value) == null ? void 0 : Ze.avatar,
                            "is-loading": We === u.value && l.value,
                            config: a.value,
                            animate: Me.animate,
                            onGetExtensiveAnswerClick: Q.onGetExtensiveAnswerClick,
                            onUpdateMessage: p
                          }, null, 8, ["message", "avatar", "is-loading", "config", "animate", "onGetExtensiveAnswerClick"])
                        ]);
                      }), 128)),
                      C("li", null, [
                        Bt(q(J3, {
                          ref_key: "moreActionElement",
                          ref: D,
                          data: r.value[r.value.length - 1],
                          onRelatedQuestionClicked: v,
                          onContactSupportClicked: en,
                          onRatePositive: E,
                          onRateNegative: R
                        }, null, 8, ["data"]), [
                          [un, r.value.length && !l.value]
                        ])
                      ])
                    ]),
                    _: 1
                  })
                ], 8, B_),
                C("footer", U_, [
                  C("form", H_, [
                    C("label", {
                      for: "promptInput",
                      style: Ln({
                        borderColor: Ne.value || c.value ? le.value : "#d5d5d5"
                      })
                    }, [
                      C("span", z_, ee(H(t)("screenReader.label.chatbotInput")), 1),
                      !Ne.value && !c.value ? Bt((N(), B("input", {
                        key: 0,
                        "onUpdate:modelValue": ie[0] || (ie[0] = (Me) => o.value = Me),
                        ref_key: "promptInput",
                        ref: W,
                        id: "promptInput",
                        class: "chatInput",
                        type: "text",
                        placeholder: H(t)("sendPlaceholder"),
                        disabled: c.value || l.value
                      }, null, 8, j_)), [
                        [m1, o.value]
                      ]) : we("", !0)
                    ], 4),
                    C("div", V_, [
                      Bt(q(Gg, {
                        ref_key: "chatbotRecorder",
                        ref: G,
                        "is-loading": l.value,
                        "primary-color": le.value,
                        onAudioAvailable: L,
                        onStartedRecording: U,
                        onFinishedRecording: F,
                        onDeleteMedia: d
                      }, null, 8, ["is-loading", "primary-color"]), [
                        [un, !o.value]
                      ]),
                      o.value ? (N(), B("button", {
                        key: 0,
                        onClick: $,
                        type: "button",
                        class: "default-action clear-btn",
                        onMouseenter: ie[1] || (ie[1] = (Me) => _.value = !0),
                        onMouseleave: ie[2] || (ie[2] = (Me) => _.value = !1)
                      }, [
                        q(Rt, {
                          icon: H(lu),
                          "default-color": le.value,
                          "icon-hover": H(cu),
                          "hover-color": le.value,
                          "is-hovered": _.value,
                          "aria-hidden": "true"
                        }, null, 8, ["icon", "default-color", "icon-hover", "hover-color", "is-hovered"])
                      ], 32)) : we("", !0),
                      C("button", {
                        type: "submit",
                        class: "default-action send-btn prompt-action",
                        onClick: tt(Te, ["prevent"]),
                        disabled: !ue.value,
                        style: Ln({ color: le.value })
                      }, [
                        C("span", K_, ee(H(t)("screenReader.sendAction")), 1),
                        q(H(xp), { "aria-hidden": "true" })
                      ], 12, W_)
                    ])
                  ])
                ])
              ]))
            ], 10, L_)) : we("", !0)
          ];
        }),
        _: 1
      })
    ]));
  }
}, G_ = /* @__PURE__ */ Qe(q_, [["__scopeId", "data-v-b8b779b2"]]), Y_ = /* @__PURE__ */ Lr({
  __name: "App",
  setup(e) {
    return (t, n) => (N(), rt(G_));
  }
}), Q_ = "Neue Nachricht", X_ = "Einen Mitarbeiter kontaktieren", J_ = "Weiterführende Informationen findest du hier:", Z_ = "weitere Fragen und Aktionen", eb = "Weiterführende Fragen", tb = "Sprache ändern", nb = "Den Chat bewerten:", sb = "Möchtest du einen Mitarbeiter kontaktieren?", rb = "Aufnahme", ob = "Aufnahme läuft...", ib = "Chat zurücksetzen", ab = "Mehr erfahren", lb = "Weniger anzeigen", cb = "Chatdarstellung", ub = "Hoher Kontrast", fb = "Schriftgröße", db = {
  sendAction: "Nachricht senden",
  openAction: "Chatbot laden",
  menuAction: "Menü öffnen",
  closeAction: "Chatbot schließen",
  closeToggleMessageAction: "Chatbotinformation schließen",
  copyAction: "Antwort kopieren",
  playAction: "Antwort abspielen",
  stopAction: "Antwort abspielen stoppen",
  pauseAction: "Antwort abspielen pausieren",
  startRecordingAction: "Aufnahme starten",
  stopRecordingAction: "Aufnahme stoppen",
  deleteRecordingAction: "Aufnahme verwerfen",
  ratePositiveAction: "Chat positiv bewerten",
  rateNegativeAction: "Chat negativ bewerten",
  openImageInNewTab: "Bild in neuem Tab öffnen",
  label: {
    history: "Chat Nachrichten",
    chatbotInput: "Chatbotnachricht"
  }
}, hb = {
  sendPlaceholder: Q_,
  contact: X_,
  sources: J_,
  moreActions: Z_,
  relatedQuestions: eb,
  langSwitch: tb,
  chatRating: nb,
  contactSupport: sb,
  recording: rb,
  recordingInProgress: ob,
  chatReset: ib,
  readMore: ab,
  readLess: lb,
  chatDisplay: cb,
  contrast: ub,
  textSize: fb,
  screenReader: db
}, pb = "New message", mb = "Contact an employee", gb = "You can find more information here:", _b = "more questions and actions", bb = "Related questions", vb = "Change language", yb = "Rate the chat:", wb = "Would you like to contact an employee?", kb = "Recording", xb = "Recording in progress...", Eb = "Reset chat", Ab = "Read more", Cb = "Show less", Tb = "Chat display", Sb = "High contrast", Rb = "Text size", Lb = {
  sendAction: "Send message",
  openAction: "Load chatbot",
  menuAction: "Open menu",
  closeAction: "Close chatbot",
  closeToggleMessageAction: "Close chatbot information",
  copyAction: "Copy response",
  playAction: "Play response",
  stopAction: "Stop playing response",
  pauseAction: "Pause playing response",
  startRecordingAction: "Start recording",
  stopRecordingAction: "Stop recording",
  deleteRecordingAction: "Discard recording",
  ratePositiveAction: "Rate chat positively",
  rateNegativeAction: "Rate chat negatively",
  openImageInNewTab: "Open image in new tab",
  label: {
    history: "Chat messages",
    chatbotInput: "Chatbot message"
  }
}, Ib = {
  sendPlaceholder: pb,
  contact: mb,
  sources: gb,
  moreActions: _b,
  relatedQuestions: bb,
  langSwitch: vb,
  chatRating: yb,
  contactSupport: wb,
  recording: kb,
  recordingInProgress: xb,
  chatReset: Eb,
  readMore: Ab,
  readLess: Cb,
  chatDisplay: Tb,
  contrast: Sb,
  textSize: Rb,
  screenReader: Lb
}, Mb = "Yeni mesaj", Ob = "Bir çalışanla iletişime geçin", Nb = "Daha fazla bilgiyi burada bulabilirsiniz:", $b = "daha fazla soru ve eylem", Pb = "İlgili sorular", Db = "Dil değiştir", Fb = "Sohbeti değerlendirin:", Bb = "Bir çalışanla iletişime geçmek ister misiniz?", Ub = "Kayıt", Hb = "Kayıt devam ediyor...", zb = "Sohbeti sıfırla", jb = "Daha fazla oku", Vb = "Daha az göster", Wb = "Sohbet görüntüleme", Kb = "Yüksek kontrast", qb = "Metin boyutu", Gb = {
  sendAction: "Mesaj gönder",
  openAction: "Chatbot'u yükle",
  menuAction: "Menüyü aç",
  closeAction: "Chatbot'u kapat",
  closeToggleMessageAction: "Chatbot bilgisini kapat",
  copyAction: "Yanıtı kopyala",
  playAction: "Yanıtı oynat",
  stopAction: "Yanıtı oynatmayı durdur",
  pauseAction: "Yanıtı oynatmayı duraklat",
  startRecordingAction: "Kayıt başlat",
  stopRecordingAction: "Kaydı durdur",
  deleteRecordingAction: "Kaydı sil",
  ratePositiveAction: "Sohbeti olumlu değerlendir",
  rateNegativeAction: "Sohbeti olumsuz değerlendir",
  openImageInNewTab: "Resmi yeni sekmede aç",
  label: {
    history: "Sohbet mesajları",
    chatbotInput: "Chatbot mesajı"
  }
}, Yb = {
  sendPlaceholder: Mb,
  contact: Ob,
  sources: Nb,
  moreActions: $b,
  relatedQuestions: Pb,
  langSwitch: Db,
  chatRating: Fb,
  contactSupport: Bb,
  recording: Ub,
  recordingInProgress: Hb,
  chatReset: zb,
  readMore: jb,
  readLess: Vb,
  chatDisplay: Wb,
  contrast: Kb,
  textSize: qb,
  screenReader: Gb
}, Qb = "رسالة جديدة", Xb = "الاتصال بموظف", Jb = "يمكنك العثور على مزيد من المعلومات هنا:", Zb = "المزيد من الأسئلة والإجراءات", e8 = "أسئلة ذات صلة", t8 = "تغيير اللغة", n8 = "تقييم المحادثة:", s8 = "هل ترغب في الاتصال بموظف؟", r8 = "تسجيل", o8 = "جاري التسجيل...", i8 = "إعادة تعيين المحادثة", a8 = "اقرأ المزيد", l8 = "عرض أقل", c8 = "عرض المحادثة", u8 = "تباين عالي", f8 = "حجم النص", d8 = {
  sendAction: "إرسال رسالة",
  openAction: "تحميل روبوت المحادثة",
  menuAction: "فتح القائمة",
  closeAction: "إغلاق روبوت المحادثة",
  closeToggleMessageAction: "إغلاق معلومات روبوت المحادثة",
  copyAction: "نسخ الرد",
  playAction: "تشغيل الرد",
  stopAction: "إيقاف تشغيل الرد",
  pauseAction: "إيقاف مؤقت لتشغيل الرد",
  startRecordingAction: "بدء التسجيل",
  stopRecordingAction: "إيقاف التسجيل",
  deleteRecordingAction: "حذف التسجيل",
  ratePositiveAction: "تقييم المحادثة بشكل إيجابي",
  rateNegativeAction: "تقييم المحادثة بشكل سلبي",
  openImageInNewTab: "فتح الصورة في علامة تبويب جديدة",
  label: {
    history: "رسائل المحادثة",
    chatbotInput: "رسالة روبوت المحادثة"
  }
}, h8 = {
  sendPlaceholder: Qb,
  contact: Xb,
  sources: Jb,
  moreActions: Zb,
  relatedQuestions: e8,
  langSwitch: t8,
  chatRating: n8,
  contactSupport: s8,
  recording: r8,
  recordingInProgress: o8,
  chatReset: i8,
  readMore: a8,
  readLess: l8,
  chatDisplay: c8,
  contrast: u8,
  textSize: f8,
  screenReader: d8
}, p8 = "Новое сообщение", m8 = "Связаться с сотрудником", g8 = "Дополнительную информацию вы найдете здесь:", _8 = "дополнительные вопросы и действия", b8 = "Связанные вопросы", v8 = "Изменить язык", y8 = "Оценить чат:", w8 = "Хотите связаться с сотрудником?", k8 = "Запись", x8 = "Идет запись...", E8 = "Сбросить чат", A8 = "Читать далее", C8 = "Показать меньше", T8 = "Отображение чата", S8 = "Высокий контраст", R8 = "Размер текста", L8 = {
  sendAction: "Отправить сообщение",
  openAction: "Загрузить чатбот",
  menuAction: "Открыть меню",
  closeAction: "Закрыть чатбот",
  closeToggleMessageAction: "Закрыть информацию чатбота",
  copyAction: "Копировать ответ",
  playAction: "Воспроизвести ответ",
  stopAction: "Остановить воспроизведение ответа",
  pauseAction: "Приостановить воспроизведение ответа",
  startRecordingAction: "Начать запись",
  stopRecordingAction: "Остановить запись",
  deleteRecordingAction: "Удалить запись",
  ratePositiveAction: "Положительно оценить чат",
  rateNegativeAction: "Отрицательно оценить чат",
  openImageInNewTab: "Открыть изображение в новой вкладке",
  label: {
    history: "Сообщения чата",
    chatbotInput: "Сообщение чатбота"
  }
}, I8 = {
  sendPlaceholder: p8,
  contact: m8,
  sources: g8,
  moreActions: _8,
  relatedQuestions: b8,
  langSwitch: v8,
  chatRating: y8,
  contactSupport: w8,
  recording: k8,
  recordingInProgress: x8,
  chatReset: E8,
  readMore: A8,
  readLess: C8,
  chatDisplay: T8,
  contrast: S8,
  textSize: R8,
  screenReader: L8
}, Wr = document.getElementById("hw-chatbot-widget");
let Ku = Wr.dataset.fullscreen, M8 = Wr.dataset.chatbotId, O8 = Wr.dataset.toggleTextDe, N8 = Wr.dataset.toggleTextEn;
const $8 = () => sessionStorage.getItem("selectedLanguage"), P8 = $8() ?? navigator.language.slice(0, 2), D8 = lp({
  locale: P8,
  fallbackLocale: "en",
  legacy: !1,
  messages: {
    de: hb,
    en: Ib,
    tr: Yb,
    ar: h8,
    ru: I8
  }
}), ss = x1(Y_);
ss.use(D8);
ss.provide("isFullscreen", Ku);
ss.provide("chatbotId", M8);
ss.provide("toggleTextDe", O8);
ss.provide("toggleTextEn", N8);
const Us = document.createElement("div");
Us.id = "hw-chatbot";
Us.classList.add("hw-chatbot");
Ku && Us.classList.add("hw-chatbot--fullscreen");
document.body.append(Us);
ss.mount(Us);
