function wrapConstructor(OriginalConstructor, modifier) {
  return class extends OriginalConstructor {
    constructor(...args) {
      super(...args);
      modifier(this);
    }
  };
}
const ZeroArray = wrapConstructor(Array, (a) => a.fill(0));
let EPSILON = 1e-6;
function getAPIImpl$5(Ctor) {
  function create(x = 0, y = 0) {
    const newDst = new Ctor(2);
    if (x !== void 0) {
      newDst[0] = x;
      if (y !== void 0) {
        newDst[1] = y;
      }
    }
    return newDst;
  }
  const fromValues = create;
  function set(x, y, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = x;
    newDst[1] = y;
    return newDst;
  }
  function ceil(v, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = Math.ceil(v[0]);
    newDst[1] = Math.ceil(v[1]);
    return newDst;
  }
  function floor(v, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = Math.floor(v[0]);
    newDst[1] = Math.floor(v[1]);
    return newDst;
  }
  function round(v, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = Math.round(v[0]);
    newDst[1] = Math.round(v[1]);
    return newDst;
  }
  function clamp2(v, min2 = 0, max2 = 1, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = Math.min(max2, Math.max(min2, v[0]));
    newDst[1] = Math.min(max2, Math.max(min2, v[1]));
    return newDst;
  }
  function add(a, b, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = a[0] + b[0];
    newDst[1] = a[1] + b[1];
    return newDst;
  }
  function addScaled(a, b, scale2, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = a[0] + b[0] * scale2;
    newDst[1] = a[1] + b[1] * scale2;
    return newDst;
  }
  function angle(a, b) {
    const ax = a[0];
    const ay = a[1];
    const bx = b[0];
    const by = b[1];
    const mag1 = Math.sqrt(ax * ax + ay * ay);
    const mag2 = Math.sqrt(bx * bx + by * by);
    const mag = mag1 * mag2;
    const cosine = mag && dot(a, b) / mag;
    return Math.acos(cosine);
  }
  function subtract(a, b, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = a[0] - b[0];
    newDst[1] = a[1] - b[1];
    return newDst;
  }
  const sub = subtract;
  function equalsApproximately(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
  }
  function equals(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }
  function lerp2(a, b, t, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = a[0] + t * (b[0] - a[0]);
    newDst[1] = a[1] + t * (b[1] - a[1]);
    return newDst;
  }
  function lerpV(a, b, t, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = a[0] + t[0] * (b[0] - a[0]);
    newDst[1] = a[1] + t[1] * (b[1] - a[1]);
    return newDst;
  }
  function max(a, b, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = Math.max(a[0], b[0]);
    newDst[1] = Math.max(a[1], b[1]);
    return newDst;
  }
  function min(a, b, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = Math.min(a[0], b[0]);
    newDst[1] = Math.min(a[1], b[1]);
    return newDst;
  }
  function mulScalar(v, k, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = v[0] * k;
    newDst[1] = v[1] * k;
    return newDst;
  }
  const scale = mulScalar;
  function divScalar(v, k, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = v[0] / k;
    newDst[1] = v[1] / k;
    return newDst;
  }
  function inverse(v, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = 1 / v[0];
    newDst[1] = 1 / v[1];
    return newDst;
  }
  const invert = inverse;
  function cross(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    const z = a[0] * b[1] - a[1] * b[0];
    newDst[0] = 0;
    newDst[1] = 0;
    newDst[2] = z;
    return newDst;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function length(v) {
    const v0 = v[0];
    const v1 = v[1];
    return Math.sqrt(v0 * v0 + v1 * v1);
  }
  const len = length;
  function lengthSq(v) {
    const v0 = v[0];
    const v1 = v[1];
    return v0 * v0 + v1 * v1;
  }
  const lenSq = lengthSq;
  function distance(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
  }
  const dist = distance;
  function distanceSq(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return dx * dx + dy * dy;
  }
  const distSq = distanceSq;
  function normalize(v, dst) {
    const newDst = dst ?? new Ctor(2);
    const v0 = v[0];
    const v1 = v[1];
    const len2 = Math.sqrt(v0 * v0 + v1 * v1);
    if (len2 > 1e-5) {
      newDst[0] = v0 / len2;
      newDst[1] = v1 / len2;
    } else {
      newDst[0] = 0;
      newDst[1] = 0;
    }
    return newDst;
  }
  function negate(v, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = -v[0];
    newDst[1] = -v[1];
    return newDst;
  }
  function copy(v, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = v[0];
    newDst[1] = v[1];
    return newDst;
  }
  const clone = copy;
  function multiply(a, b, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = a[0] * b[0];
    newDst[1] = a[1] * b[1];
    return newDst;
  }
  const mul = multiply;
  function divide(a, b, dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = a[0] / b[0];
    newDst[1] = a[1] / b[1];
    return newDst;
  }
  const div = divide;
  function random(scale2 = 1, dst) {
    const newDst = dst ?? new Ctor(2);
    const angle2 = Math.random() * 2 * Math.PI;
    newDst[0] = Math.cos(angle2) * scale2;
    newDst[1] = Math.sin(angle2) * scale2;
    return newDst;
  }
  function zero(dst) {
    const newDst = dst ?? new Ctor(2);
    newDst[0] = 0;
    newDst[1] = 0;
    return newDst;
  }
  function transformMat4(v, m, dst) {
    const newDst = dst ?? new Ctor(2);
    const x = v[0];
    const y = v[1];
    newDst[0] = x * m[0] + y * m[4] + m[12];
    newDst[1] = x * m[1] + y * m[5] + m[13];
    return newDst;
  }
  function transformMat3(v, m, dst) {
    const newDst = dst ?? new Ctor(2);
    const x = v[0];
    const y = v[1];
    newDst[0] = m[0] * x + m[4] * y + m[8];
    newDst[1] = m[1] * x + m[5] * y + m[9];
    return newDst;
  }
  function rotate2(a, b, rad, dst) {
    const newDst = dst ?? new Ctor(2);
    const p0 = a[0] - b[0];
    const p1 = a[1] - b[1];
    const sinC = Math.sin(rad);
    const cosC = Math.cos(rad);
    newDst[0] = p0 * cosC - p1 * sinC + b[0];
    newDst[1] = p0 * sinC + p1 * cosC + b[1];
    return newDst;
  }
  function setLength(a, len2, dst) {
    const newDst = dst ?? new Ctor(2);
    normalize(a, newDst);
    return mulScalar(newDst, len2, newDst);
  }
  function truncate(a, maxLen, dst) {
    const newDst = dst ?? new Ctor(2);
    if (length(a) > maxLen) {
      return setLength(a, maxLen, newDst);
    }
    return copy(a, newDst);
  }
  function midpoint(a, b, dst) {
    const newDst = dst ?? new Ctor(2);
    return lerp2(a, b, 0.5, newDst);
  }
  return {
    create,
    fromValues,
    set,
    ceil,
    floor,
    round,
    clamp: clamp2,
    add,
    addScaled,
    angle,
    subtract,
    sub,
    equalsApproximately,
    equals,
    lerp: lerp2,
    lerpV,
    max,
    min,
    mulScalar,
    scale,
    divScalar,
    inverse,
    invert,
    cross,
    dot,
    length,
    len,
    lengthSq,
    lenSq,
    distance,
    dist,
    distanceSq,
    distSq,
    normalize,
    negate,
    copy,
    clone,
    multiply,
    mul,
    divide,
    div,
    random,
    zero,
    transformMat4,
    transformMat3,
    rotate: rotate2,
    setLength,
    truncate,
    midpoint
  };
}
const cache$5 = /* @__PURE__ */ new Map();
function getAPI$5(Ctor) {
  let api = cache$5.get(Ctor);
  if (!api) {
    api = getAPIImpl$5(Ctor);
    cache$5.set(Ctor, api);
  }
  return api;
}
function getAPIImpl$4(Ctor) {
  function create(x, y, z) {
    const newDst = new Ctor(3);
    if (x !== void 0) {
      newDst[0] = x;
      if (y !== void 0) {
        newDst[1] = y;
        if (z !== void 0) {
          newDst[2] = z;
        }
      }
    }
    return newDst;
  }
  const fromValues = create;
  function set(x, y, z, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = x;
    newDst[1] = y;
    newDst[2] = z;
    return newDst;
  }
  function ceil(v, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = Math.ceil(v[0]);
    newDst[1] = Math.ceil(v[1]);
    newDst[2] = Math.ceil(v[2]);
    return newDst;
  }
  function floor(v, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = Math.floor(v[0]);
    newDst[1] = Math.floor(v[1]);
    newDst[2] = Math.floor(v[2]);
    return newDst;
  }
  function round(v, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = Math.round(v[0]);
    newDst[1] = Math.round(v[1]);
    newDst[2] = Math.round(v[2]);
    return newDst;
  }
  function clamp2(v, min2 = 0, max2 = 1, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = Math.min(max2, Math.max(min2, v[0]));
    newDst[1] = Math.min(max2, Math.max(min2, v[1]));
    newDst[2] = Math.min(max2, Math.max(min2, v[2]));
    return newDst;
  }
  function add(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = a[0] + b[0];
    newDst[1] = a[1] + b[1];
    newDst[2] = a[2] + b[2];
    return newDst;
  }
  function addScaled(a, b, scale2, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = a[0] + b[0] * scale2;
    newDst[1] = a[1] + b[1] * scale2;
    newDst[2] = a[2] + b[2] * scale2;
    return newDst;
  }
  function angle(a, b) {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const mag1 = Math.sqrt(ax * ax + ay * ay + az * az);
    const mag2 = Math.sqrt(bx * bx + by * by + bz * bz);
    const mag = mag1 * mag2;
    const cosine = mag && dot(a, b) / mag;
    return Math.acos(cosine);
  }
  function subtract(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = a[0] - b[0];
    newDst[1] = a[1] - b[1];
    newDst[2] = a[2] - b[2];
    return newDst;
  }
  const sub = subtract;
  function equalsApproximately(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON;
  }
  function equals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  function lerp2(a, b, t, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = a[0] + t * (b[0] - a[0]);
    newDst[1] = a[1] + t * (b[1] - a[1]);
    newDst[2] = a[2] + t * (b[2] - a[2]);
    return newDst;
  }
  function lerpV(a, b, t, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = a[0] + t[0] * (b[0] - a[0]);
    newDst[1] = a[1] + t[1] * (b[1] - a[1]);
    newDst[2] = a[2] + t[2] * (b[2] - a[2]);
    return newDst;
  }
  function max(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = Math.max(a[0], b[0]);
    newDst[1] = Math.max(a[1], b[1]);
    newDst[2] = Math.max(a[2], b[2]);
    return newDst;
  }
  function min(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = Math.min(a[0], b[0]);
    newDst[1] = Math.min(a[1], b[1]);
    newDst[2] = Math.min(a[2], b[2]);
    return newDst;
  }
  function mulScalar(v, k, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = v[0] * k;
    newDst[1] = v[1] * k;
    newDst[2] = v[2] * k;
    return newDst;
  }
  const scale = mulScalar;
  function divScalar(v, k, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = v[0] / k;
    newDst[1] = v[1] / k;
    newDst[2] = v[2] / k;
    return newDst;
  }
  function inverse(v, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = 1 / v[0];
    newDst[1] = 1 / v[1];
    newDst[2] = 1 / v[2];
    return newDst;
  }
  const invert = inverse;
  function cross(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    const t1 = a[2] * b[0] - a[0] * b[2];
    const t2 = a[0] * b[1] - a[1] * b[0];
    newDst[0] = a[1] * b[2] - a[2] * b[1];
    newDst[1] = t1;
    newDst[2] = t2;
    return newDst;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function length(v) {
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);
  }
  const len = length;
  function lengthSq(v) {
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    return v0 * v0 + v1 * v1 + v2 * v2;
  }
  const lenSq = lengthSq;
  function distance(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  const dist = distance;
  function distanceSq(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
  }
  const distSq = distanceSq;
  function normalize(v, dst) {
    const newDst = dst ?? new Ctor(3);
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const len2 = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);
    if (len2 > 1e-5) {
      newDst[0] = v0 / len2;
      newDst[1] = v1 / len2;
      newDst[2] = v2 / len2;
    } else {
      newDst[0] = 0;
      newDst[1] = 0;
      newDst[2] = 0;
    }
    return newDst;
  }
  function negate(v, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = -v[0];
    newDst[1] = -v[1];
    newDst[2] = -v[2];
    return newDst;
  }
  function copy(v, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = v[0];
    newDst[1] = v[1];
    newDst[2] = v[2];
    return newDst;
  }
  const clone = copy;
  function multiply(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = a[0] * b[0];
    newDst[1] = a[1] * b[1];
    newDst[2] = a[2] * b[2];
    return newDst;
  }
  const mul = multiply;
  function divide(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = a[0] / b[0];
    newDst[1] = a[1] / b[1];
    newDst[2] = a[2] / b[2];
    return newDst;
  }
  const div = divide;
  function random(scale2 = 1, dst) {
    const newDst = dst ?? new Ctor(3);
    const angle2 = Math.random() * 2 * Math.PI;
    const z = Math.random() * 2 - 1;
    const zScale = Math.sqrt(1 - z * z) * scale2;
    newDst[0] = Math.cos(angle2) * zScale;
    newDst[1] = Math.sin(angle2) * zScale;
    newDst[2] = z * scale2;
    return newDst;
  }
  function zero(dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = 0;
    newDst[1] = 0;
    newDst[2] = 0;
    return newDst;
  }
  function transformMat4(v, m, dst) {
    const newDst = dst ?? new Ctor(3);
    const x = v[0];
    const y = v[1];
    const z = v[2];
    const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
    newDst[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    newDst[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    newDst[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return newDst;
  }
  function transformMat4Upper3x3(v, m, dst) {
    const newDst = dst ?? new Ctor(3);
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    newDst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0];
    newDst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1];
    newDst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2];
    return newDst;
  }
  function transformMat3(v, m, dst) {
    const newDst = dst ?? new Ctor(3);
    const x = v[0];
    const y = v[1];
    const z = v[2];
    newDst[0] = x * m[0] + y * m[4] + z * m[8];
    newDst[1] = x * m[1] + y * m[5] + z * m[9];
    newDst[2] = x * m[2] + y * m[6] + z * m[10];
    return newDst;
  }
  function transformQuat(v, q, dst) {
    const newDst = dst ?? new Ctor(3);
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const w2 = q[3] * 2;
    const x = v[0];
    const y = v[1];
    const z = v[2];
    const uvX = qy * z - qz * y;
    const uvY = qz * x - qx * z;
    const uvZ = qx * y - qy * x;
    newDst[0] = x + uvX * w2 + (qy * uvZ - qz * uvY) * 2;
    newDst[1] = y + uvY * w2 + (qz * uvX - qx * uvZ) * 2;
    newDst[2] = z + uvZ * w2 + (qx * uvY - qy * uvX) * 2;
    return newDst;
  }
  function getTranslation(m, dst) {
    const newDst = dst ?? new Ctor(3);
    newDst[0] = m[12];
    newDst[1] = m[13];
    newDst[2] = m[14];
    return newDst;
  }
  function getAxis(m, axis, dst) {
    const newDst = dst ?? new Ctor(3);
    const off = axis * 4;
    newDst[0] = m[off + 0];
    newDst[1] = m[off + 1];
    newDst[2] = m[off + 2];
    return newDst;
  }
  function getScaling(m, dst) {
    const newDst = dst ?? new Ctor(3);
    const xx = m[0];
    const xy = m[1];
    const xz = m[2];
    const yx = m[4];
    const yy = m[5];
    const yz = m[6];
    const zx = m[8];
    const zy = m[9];
    const zz = m[10];
    newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
    newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
    newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
    return newDst;
  }
  function rotateX(a, b, rad, dst) {
    const newDst = dst ?? new Ctor(3);
    const p = [];
    const r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0];
    r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
    r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
    newDst[0] = r[0] + b[0];
    newDst[1] = r[1] + b[1];
    newDst[2] = r[2] + b[2];
    return newDst;
  }
  function rotateY(a, b, rad, dst) {
    const newDst = dst ?? new Ctor(3);
    const p = [];
    const r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
    newDst[0] = r[0] + b[0];
    newDst[1] = r[1] + b[1];
    newDst[2] = r[2] + b[2];
    return newDst;
  }
  function rotateZ(a, b, rad, dst) {
    const newDst = dst ?? new Ctor(3);
    const p = [];
    const r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
    r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
    r[2] = p[2];
    newDst[0] = r[0] + b[0];
    newDst[1] = r[1] + b[1];
    newDst[2] = r[2] + b[2];
    return newDst;
  }
  function setLength(a, len2, dst) {
    const newDst = dst ?? new Ctor(3);
    normalize(a, newDst);
    return mulScalar(newDst, len2, newDst);
  }
  function truncate(a, maxLen, dst) {
    const newDst = dst ?? new Ctor(3);
    if (length(a) > maxLen) {
      return setLength(a, maxLen, newDst);
    }
    return copy(a, newDst);
  }
  function midpoint(a, b, dst) {
    const newDst = dst ?? new Ctor(3);
    return lerp2(a, b, 0.5, newDst);
  }
  return {
    create,
    fromValues,
    set,
    ceil,
    floor,
    round,
    clamp: clamp2,
    add,
    addScaled,
    angle,
    subtract,
    sub,
    equalsApproximately,
    equals,
    lerp: lerp2,
    lerpV,
    max,
    min,
    mulScalar,
    scale,
    divScalar,
    inverse,
    invert,
    cross,
    dot,
    length,
    len,
    lengthSq,
    lenSq,
    distance,
    dist,
    distanceSq,
    distSq,
    normalize,
    negate,
    copy,
    clone,
    multiply,
    mul,
    divide,
    div,
    random,
    zero,
    transformMat4,
    transformMat4Upper3x3,
    transformMat3,
    transformQuat,
    getTranslation,
    getAxis,
    getScaling,
    rotateX,
    rotateY,
    rotateZ,
    setLength,
    truncate,
    midpoint
  };
}
const cache$4 = /* @__PURE__ */ new Map();
function getAPI$4(Ctor) {
  let api = cache$4.get(Ctor);
  if (!api) {
    api = getAPIImpl$4(Ctor);
    cache$4.set(Ctor, api);
  }
  return api;
}
function getAPIImpl$3(Ctor) {
  const vec2 = getAPI$5(Ctor);
  const vec32 = getAPI$4(Ctor);
  function create(v0, v1, v2, v3, v4, v5, v6, v7, v8) {
    const newDst = new Ctor(12);
    newDst[3] = 0;
    newDst[7] = 0;
    newDst[11] = 0;
    if (v0 !== void 0) {
      newDst[0] = v0;
      if (v1 !== void 0) {
        newDst[1] = v1;
        if (v2 !== void 0) {
          newDst[2] = v2;
          if (v3 !== void 0) {
            newDst[4] = v3;
            if (v4 !== void 0) {
              newDst[5] = v4;
              if (v5 !== void 0) {
                newDst[6] = v5;
                if (v6 !== void 0) {
                  newDst[8] = v6;
                  if (v7 !== void 0) {
                    newDst[9] = v7;
                    if (v8 !== void 0) {
                      newDst[10] = v8;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return newDst;
  }
  function set(v0, v1, v2, v3, v4, v5, v6, v7, v8, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = v0;
    newDst[1] = v1;
    newDst[2] = v2;
    newDst[3] = 0;
    newDst[4] = v3;
    newDst[5] = v4;
    newDst[6] = v5;
    newDst[7] = 0;
    newDst[8] = v6;
    newDst[9] = v7;
    newDst[10] = v8;
    newDst[11] = 0;
    return newDst;
  }
  function fromMat4(m4, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = m4[0];
    newDst[1] = m4[1];
    newDst[2] = m4[2];
    newDst[3] = 0;
    newDst[4] = m4[4];
    newDst[5] = m4[5];
    newDst[6] = m4[6];
    newDst[7] = 0;
    newDst[8] = m4[8];
    newDst[9] = m4[9];
    newDst[10] = m4[10];
    newDst[11] = 0;
    return newDst;
  }
  function fromQuat(q, dst) {
    const newDst = dst ?? new Ctor(12);
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    newDst[0] = 1 - yy - zz;
    newDst[1] = yx + wz;
    newDst[2] = zx - wy;
    newDst[3] = 0;
    newDst[4] = yx - wz;
    newDst[5] = 1 - xx - zz;
    newDst[6] = zy + wx;
    newDst[7] = 0;
    newDst[8] = zx + wy;
    newDst[9] = zy - wx;
    newDst[10] = 1 - xx - yy;
    newDst[11] = 0;
    return newDst;
  }
  function negate(m, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = -m[0];
    newDst[1] = -m[1];
    newDst[2] = -m[2];
    newDst[4] = -m[4];
    newDst[5] = -m[5];
    newDst[6] = -m[6];
    newDst[8] = -m[8];
    newDst[9] = -m[9];
    newDst[10] = -m[10];
    return newDst;
  }
  function multiplyScalar(m, s, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = m[0] * s;
    newDst[1] = m[1] * s;
    newDst[2] = m[2] * s;
    newDst[4] = m[4] * s;
    newDst[5] = m[5] * s;
    newDst[6] = m[6] * s;
    newDst[8] = m[8] * s;
    newDst[9] = m[9] * s;
    newDst[10] = m[10] * s;
    return newDst;
  }
  const mulScalar = multiplyScalar;
  function add(a, b, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = a[0] + b[0];
    newDst[1] = a[1] + b[1];
    newDst[2] = a[2] + b[2];
    newDst[4] = a[4] + b[4];
    newDst[5] = a[5] + b[5];
    newDst[6] = a[6] + b[6];
    newDst[8] = a[8] + b[8];
    newDst[9] = a[9] + b[9];
    newDst[10] = a[10] + b[10];
    return newDst;
  }
  function copy(m, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = m[0];
    newDst[1] = m[1];
    newDst[2] = m[2];
    newDst[4] = m[4];
    newDst[5] = m[5];
    newDst[6] = m[6];
    newDst[8] = m[8];
    newDst[9] = m[9];
    newDst[10] = m[10];
    return newDst;
  }
  const clone = copy;
  function equalsApproximately(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON && Math.abs(a[4] - b[4]) < EPSILON && Math.abs(a[5] - b[5]) < EPSILON && Math.abs(a[6] - b[6]) < EPSILON && Math.abs(a[8] - b[8]) < EPSILON && Math.abs(a[9] - b[9]) < EPSILON && Math.abs(a[10] - b[10]) < EPSILON;
  }
  function equals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10];
  }
  function identity(dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = 1;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[4] = 0;
    newDst[5] = 1;
    newDst[6] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = 1;
    return newDst;
  }
  function transpose(m, dst) {
    const newDst = dst ?? new Ctor(12);
    if (newDst === m) {
      let t;
      t = m[1];
      m[1] = m[4];
      m[4] = t;
      t = m[2];
      m[2] = m[8];
      m[8] = t;
      t = m[6];
      m[6] = m[9];
      m[9] = t;
      return newDst;
    }
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    newDst[0] = m00;
    newDst[1] = m10;
    newDst[2] = m20;
    newDst[4] = m01;
    newDst[5] = m11;
    newDst[6] = m21;
    newDst[8] = m02;
    newDst[9] = m12;
    newDst[10] = m22;
    return newDst;
  }
  function inverse(m, dst) {
    const newDst = dst ?? new Ctor(12);
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const b01 = m22 * m11 - m12 * m21;
    const b11 = -m22 * m10 + m12 * m20;
    const b21 = m21 * m10 - m11 * m20;
    const invDet = 1 / (m00 * b01 + m01 * b11 + m02 * b21);
    newDst[0] = b01 * invDet;
    newDst[1] = (-m22 * m01 + m02 * m21) * invDet;
    newDst[2] = (m12 * m01 - m02 * m11) * invDet;
    newDst[4] = b11 * invDet;
    newDst[5] = (m22 * m00 - m02 * m20) * invDet;
    newDst[6] = (-m12 * m00 + m02 * m10) * invDet;
    newDst[8] = b21 * invDet;
    newDst[9] = (-m21 * m00 + m01 * m20) * invDet;
    newDst[10] = (m11 * m00 - m01 * m10) * invDet;
    return newDst;
  }
  function determinant(m) {
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    return m00 * (m11 * m22 - m21 * m12) - m10 * (m01 * m22 - m21 * m02) + m20 * (m01 * m12 - m11 * m02);
  }
  const invert = inverse;
  function multiply(a, b, dst) {
    const newDst = dst ?? new Ctor(12);
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a10 = a[4 + 0];
    const a11 = a[4 + 1];
    const a12 = a[4 + 2];
    const a20 = a[8 + 0];
    const a21 = a[8 + 1];
    const a22 = a[8 + 2];
    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];
    const b10 = b[4 + 0];
    const b11 = b[4 + 1];
    const b12 = b[4 + 2];
    const b20 = b[8 + 0];
    const b21 = b[8 + 1];
    const b22 = b[8 + 2];
    newDst[0] = a00 * b00 + a10 * b01 + a20 * b02;
    newDst[1] = a01 * b00 + a11 * b01 + a21 * b02;
    newDst[2] = a02 * b00 + a12 * b01 + a22 * b02;
    newDst[4] = a00 * b10 + a10 * b11 + a20 * b12;
    newDst[5] = a01 * b10 + a11 * b11 + a21 * b12;
    newDst[6] = a02 * b10 + a12 * b11 + a22 * b12;
    newDst[8] = a00 * b20 + a10 * b21 + a20 * b22;
    newDst[9] = a01 * b20 + a11 * b21 + a21 * b22;
    newDst[10] = a02 * b20 + a12 * b21 + a22 * b22;
    return newDst;
  }
  const mul = multiply;
  function setTranslation(a, v, dst) {
    const newDst = dst ?? identity();
    if (a !== newDst) {
      newDst[0] = a[0];
      newDst[1] = a[1];
      newDst[2] = a[2];
      newDst[4] = a[4];
      newDst[5] = a[5];
      newDst[6] = a[6];
    }
    newDst[8] = v[0];
    newDst[9] = v[1];
    newDst[10] = 1;
    return newDst;
  }
  function getTranslation(m, dst) {
    const newDst = dst ?? vec2.create();
    newDst[0] = m[8];
    newDst[1] = m[9];
    return newDst;
  }
  function getAxis(m, axis, dst) {
    const newDst = dst ?? vec2.create();
    const off = axis * 4;
    newDst[0] = m[off + 0];
    newDst[1] = m[off + 1];
    return newDst;
  }
  function setAxis(m, v, axis, dst) {
    const newDst = dst === m ? m : copy(m, dst);
    const off = axis * 4;
    newDst[off + 0] = v[0];
    newDst[off + 1] = v[1];
    return newDst;
  }
  function getScaling(m, dst) {
    const newDst = dst ?? vec2.create();
    const xx = m[0];
    const xy = m[1];
    const yx = m[4];
    const yy = m[5];
    newDst[0] = Math.sqrt(xx * xx + xy * xy);
    newDst[1] = Math.sqrt(yx * yx + yy * yy);
    return newDst;
  }
  function get3DScaling(m, dst) {
    const newDst = dst ?? vec32.create();
    const xx = m[0];
    const xy = m[1];
    const xz = m[2];
    const yx = m[4];
    const yy = m[5];
    const yz = m[6];
    const zx = m[8];
    const zy = m[9];
    const zz = m[10];
    newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
    newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
    newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
    return newDst;
  }
  function translation(v, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = 1;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[4] = 0;
    newDst[5] = 1;
    newDst[6] = 0;
    newDst[8] = v[0];
    newDst[9] = v[1];
    newDst[10] = 1;
    return newDst;
  }
  function translate(m, v, dst) {
    const newDst = dst ?? new Ctor(12);
    const v0 = v[0];
    const v1 = v[1];
    const m00 = m[0];
    const m01 = m[1];
    const m02 = m[2];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    if (m !== newDst) {
      newDst[0] = m00;
      newDst[1] = m01;
      newDst[2] = m02;
      newDst[4] = m10;
      newDst[5] = m11;
      newDst[6] = m12;
    }
    newDst[8] = m00 * v0 + m10 * v1 + m20;
    newDst[9] = m01 * v0 + m11 * v1 + m21;
    newDst[10] = m02 * v0 + m12 * v1 + m22;
    return newDst;
  }
  function rotation(angleInRadians, dst) {
    const newDst = dst ?? new Ctor(12);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = c;
    newDst[1] = s;
    newDst[2] = 0;
    newDst[4] = -s;
    newDst[5] = c;
    newDst[6] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = 1;
    return newDst;
  }
  function rotate2(m, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(12);
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = c * m00 + s * m10;
    newDst[1] = c * m01 + s * m11;
    newDst[2] = c * m02 + s * m12;
    newDst[4] = c * m10 - s * m00;
    newDst[5] = c * m11 - s * m01;
    newDst[6] = c * m12 - s * m02;
    if (m !== newDst) {
      newDst[8] = m[8];
      newDst[9] = m[9];
      newDst[10] = m[10];
    }
    return newDst;
  }
  function rotationX(angleInRadians, dst) {
    const newDst = dst ?? new Ctor(12);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = 1;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[4] = 0;
    newDst[5] = c;
    newDst[6] = s;
    newDst[8] = 0;
    newDst[9] = -s;
    newDst[10] = c;
    return newDst;
  }
  function rotateX(m, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(12);
    const m10 = m[4];
    const m11 = m[5];
    const m12 = m[6];
    const m20 = m[8];
    const m21 = m[9];
    const m22 = m[10];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[4] = c * m10 + s * m20;
    newDst[5] = c * m11 + s * m21;
    newDst[6] = c * m12 + s * m22;
    newDst[8] = c * m20 - s * m10;
    newDst[9] = c * m21 - s * m11;
    newDst[10] = c * m22 - s * m12;
    if (m !== newDst) {
      newDst[0] = m[0];
      newDst[1] = m[1];
      newDst[2] = m[2];
    }
    return newDst;
  }
  function rotationY(angleInRadians, dst) {
    const newDst = dst ?? new Ctor(12);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = c;
    newDst[1] = 0;
    newDst[2] = -s;
    newDst[4] = 0;
    newDst[5] = 1;
    newDst[6] = 0;
    newDst[8] = s;
    newDst[9] = 0;
    newDst[10] = c;
    return newDst;
  }
  function rotateY(m, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(12);
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = c * m00 - s * m20;
    newDst[1] = c * m01 - s * m21;
    newDst[2] = c * m02 - s * m22;
    newDst[8] = c * m20 + s * m00;
    newDst[9] = c * m21 + s * m01;
    newDst[10] = c * m22 + s * m02;
    if (m !== newDst) {
      newDst[4] = m[4];
      newDst[5] = m[5];
      newDst[6] = m[6];
    }
    return newDst;
  }
  const rotationZ = rotation;
  const rotateZ = rotate2;
  function scaling(v, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = v[0];
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[4] = 0;
    newDst[5] = v[1];
    newDst[6] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = 1;
    return newDst;
  }
  function scale(m, v, dst) {
    const newDst = dst ?? new Ctor(12);
    const v0 = v[0];
    const v1 = v[1];
    newDst[0] = v0 * m[0 * 4 + 0];
    newDst[1] = v0 * m[0 * 4 + 1];
    newDst[2] = v0 * m[0 * 4 + 2];
    newDst[4] = v1 * m[1 * 4 + 0];
    newDst[5] = v1 * m[1 * 4 + 1];
    newDst[6] = v1 * m[1 * 4 + 2];
    if (m !== newDst) {
      newDst[8] = m[8];
      newDst[9] = m[9];
      newDst[10] = m[10];
    }
    return newDst;
  }
  function scaling3D(v, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = v[0];
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[4] = 0;
    newDst[5] = v[1];
    newDst[6] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = v[2];
    return newDst;
  }
  function scale3D(m, v, dst) {
    const newDst = dst ?? new Ctor(12);
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    newDst[0] = v0 * m[0 * 4 + 0];
    newDst[1] = v0 * m[0 * 4 + 1];
    newDst[2] = v0 * m[0 * 4 + 2];
    newDst[4] = v1 * m[1 * 4 + 0];
    newDst[5] = v1 * m[1 * 4 + 1];
    newDst[6] = v1 * m[1 * 4 + 2];
    newDst[8] = v2 * m[2 * 4 + 0];
    newDst[9] = v2 * m[2 * 4 + 1];
    newDst[10] = v2 * m[2 * 4 + 2];
    return newDst;
  }
  function uniformScaling(s, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = s;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[4] = 0;
    newDst[5] = s;
    newDst[6] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = 1;
    return newDst;
  }
  function uniformScale(m, s, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = s * m[0 * 4 + 0];
    newDst[1] = s * m[0 * 4 + 1];
    newDst[2] = s * m[0 * 4 + 2];
    newDst[4] = s * m[1 * 4 + 0];
    newDst[5] = s * m[1 * 4 + 1];
    newDst[6] = s * m[1 * 4 + 2];
    if (m !== newDst) {
      newDst[8] = m[8];
      newDst[9] = m[9];
      newDst[10] = m[10];
    }
    return newDst;
  }
  function uniformScaling3D(s, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = s;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[4] = 0;
    newDst[5] = s;
    newDst[6] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = s;
    return newDst;
  }
  function uniformScale3D(m, s, dst) {
    const newDst = dst ?? new Ctor(12);
    newDst[0] = s * m[0 * 4 + 0];
    newDst[1] = s * m[0 * 4 + 1];
    newDst[2] = s * m[0 * 4 + 2];
    newDst[4] = s * m[1 * 4 + 0];
    newDst[5] = s * m[1 * 4 + 1];
    newDst[6] = s * m[1 * 4 + 2];
    newDst[8] = s * m[2 * 4 + 0];
    newDst[9] = s * m[2 * 4 + 1];
    newDst[10] = s * m[2 * 4 + 2];
    return newDst;
  }
  return {
    add,
    clone,
    copy,
    create,
    determinant,
    equals,
    equalsApproximately,
    fromMat4,
    fromQuat,
    get3DScaling,
    getAxis,
    getScaling,
    getTranslation,
    identity,
    inverse,
    invert,
    mul,
    mulScalar,
    multiply,
    multiplyScalar,
    negate,
    rotate: rotate2,
    rotateX,
    rotateY,
    rotateZ,
    rotation,
    rotationX,
    rotationY,
    rotationZ,
    scale,
    scale3D,
    scaling,
    scaling3D,
    set,
    setAxis,
    setTranslation,
    translate,
    translation,
    transpose,
    uniformScale,
    uniformScale3D,
    uniformScaling,
    uniformScaling3D
  };
}
const cache$3 = /* @__PURE__ */ new Map();
function getAPI$3(Ctor) {
  let api = cache$3.get(Ctor);
  if (!api) {
    api = getAPIImpl$3(Ctor);
    cache$3.set(Ctor, api);
  }
  return api;
}
function getAPIImpl$2(Ctor) {
  const vec32 = getAPI$4(Ctor);
  function create(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15) {
    const newDst = new Ctor(16);
    if (v0 !== void 0) {
      newDst[0] = v0;
      if (v1 !== void 0) {
        newDst[1] = v1;
        if (v2 !== void 0) {
          newDst[2] = v2;
          if (v3 !== void 0) {
            newDst[3] = v3;
            if (v4 !== void 0) {
              newDst[4] = v4;
              if (v5 !== void 0) {
                newDst[5] = v5;
                if (v6 !== void 0) {
                  newDst[6] = v6;
                  if (v7 !== void 0) {
                    newDst[7] = v7;
                    if (v8 !== void 0) {
                      newDst[8] = v8;
                      if (v9 !== void 0) {
                        newDst[9] = v9;
                        if (v10 !== void 0) {
                          newDst[10] = v10;
                          if (v11 !== void 0) {
                            newDst[11] = v11;
                            if (v12 !== void 0) {
                              newDst[12] = v12;
                              if (v13 !== void 0) {
                                newDst[13] = v13;
                                if (v14 !== void 0) {
                                  newDst[14] = v14;
                                  if (v15 !== void 0) {
                                    newDst[15] = v15;
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return newDst;
  }
  function set(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = v0;
    newDst[1] = v1;
    newDst[2] = v2;
    newDst[3] = v3;
    newDst[4] = v4;
    newDst[5] = v5;
    newDst[6] = v6;
    newDst[7] = v7;
    newDst[8] = v8;
    newDst[9] = v9;
    newDst[10] = v10;
    newDst[11] = v11;
    newDst[12] = v12;
    newDst[13] = v13;
    newDst[14] = v14;
    newDst[15] = v15;
    return newDst;
  }
  function fromMat3(m3, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = m3[0];
    newDst[1] = m3[1];
    newDst[2] = m3[2];
    newDst[3] = 0;
    newDst[4] = m3[4];
    newDst[5] = m3[5];
    newDst[6] = m3[6];
    newDst[7] = 0;
    newDst[8] = m3[8];
    newDst[9] = m3[9];
    newDst[10] = m3[10];
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  function fromQuat(q, dst) {
    const newDst = dst ?? new Ctor(16);
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const yx = y * x2;
    const yy = y * y2;
    const zx = z * x2;
    const zy = z * y2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    newDst[0] = 1 - yy - zz;
    newDst[1] = yx + wz;
    newDst[2] = zx - wy;
    newDst[3] = 0;
    newDst[4] = yx - wz;
    newDst[5] = 1 - xx - zz;
    newDst[6] = zy + wx;
    newDst[7] = 0;
    newDst[8] = zx + wy;
    newDst[9] = zy - wx;
    newDst[10] = 1 - xx - yy;
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  function negate(m, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = -m[0];
    newDst[1] = -m[1];
    newDst[2] = -m[2];
    newDst[3] = -m[3];
    newDst[4] = -m[4];
    newDst[5] = -m[5];
    newDst[6] = -m[6];
    newDst[7] = -m[7];
    newDst[8] = -m[8];
    newDst[9] = -m[9];
    newDst[10] = -m[10];
    newDst[11] = -m[11];
    newDst[12] = -m[12];
    newDst[13] = -m[13];
    newDst[14] = -m[14];
    newDst[15] = -m[15];
    return newDst;
  }
  function add(a, b, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = a[0] + b[0];
    newDst[1] = a[1] + b[1];
    newDst[2] = a[2] + b[2];
    newDst[3] = a[3] + b[3];
    newDst[4] = a[4] + b[4];
    newDst[5] = a[5] + b[5];
    newDst[6] = a[6] + b[6];
    newDst[7] = a[7] + b[7];
    newDst[8] = a[8] + b[8];
    newDst[9] = a[9] + b[9];
    newDst[10] = a[10] + b[10];
    newDst[11] = a[11] + b[11];
    newDst[12] = a[12] + b[12];
    newDst[13] = a[13] + b[13];
    newDst[14] = a[14] + b[14];
    newDst[15] = a[15] + b[15];
    return newDst;
  }
  function multiplyScalar(m, s, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = m[0] * s;
    newDst[1] = m[1] * s;
    newDst[2] = m[2] * s;
    newDst[3] = m[3] * s;
    newDst[4] = m[4] * s;
    newDst[5] = m[5] * s;
    newDst[6] = m[6] * s;
    newDst[7] = m[7] * s;
    newDst[8] = m[8] * s;
    newDst[9] = m[9] * s;
    newDst[10] = m[10] * s;
    newDst[11] = m[11] * s;
    newDst[12] = m[12] * s;
    newDst[13] = m[13] * s;
    newDst[14] = m[14] * s;
    newDst[15] = m[15] * s;
    return newDst;
  }
  const mulScalar = multiplyScalar;
  function copy(m, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = m[0];
    newDst[1] = m[1];
    newDst[2] = m[2];
    newDst[3] = m[3];
    newDst[4] = m[4];
    newDst[5] = m[5];
    newDst[6] = m[6];
    newDst[7] = m[7];
    newDst[8] = m[8];
    newDst[9] = m[9];
    newDst[10] = m[10];
    newDst[11] = m[11];
    newDst[12] = m[12];
    newDst[13] = m[13];
    newDst[14] = m[14];
    newDst[15] = m[15];
    return newDst;
  }
  const clone = copy;
  function equalsApproximately(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON && Math.abs(a[3] - b[3]) < EPSILON && Math.abs(a[4] - b[4]) < EPSILON && Math.abs(a[5] - b[5]) < EPSILON && Math.abs(a[6] - b[6]) < EPSILON && Math.abs(a[7] - b[7]) < EPSILON && Math.abs(a[8] - b[8]) < EPSILON && Math.abs(a[9] - b[9]) < EPSILON && Math.abs(a[10] - b[10]) < EPSILON && Math.abs(a[11] - b[11]) < EPSILON && Math.abs(a[12] - b[12]) < EPSILON && Math.abs(a[13] - b[13]) < EPSILON && Math.abs(a[14] - b[14]) < EPSILON && Math.abs(a[15] - b[15]) < EPSILON;
  }
  function equals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  function identity(dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = 1;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = 1;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = 1;
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  function transpose(m, dst) {
    const newDst = dst ?? new Ctor(16);
    if (newDst === m) {
      let t;
      t = m[1];
      m[1] = m[4];
      m[4] = t;
      t = m[2];
      m[2] = m[8];
      m[8] = t;
      t = m[3];
      m[3] = m[12];
      m[12] = t;
      t = m[6];
      m[6] = m[9];
      m[9] = t;
      t = m[7];
      m[7] = m[13];
      m[13] = t;
      t = m[11];
      m[11] = m[14];
      m[14] = t;
      return newDst;
    }
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];
    newDst[0] = m00;
    newDst[1] = m10;
    newDst[2] = m20;
    newDst[3] = m30;
    newDst[4] = m01;
    newDst[5] = m11;
    newDst[6] = m21;
    newDst[7] = m31;
    newDst[8] = m02;
    newDst[9] = m12;
    newDst[10] = m22;
    newDst[11] = m32;
    newDst[12] = m03;
    newDst[13] = m13;
    newDst[14] = m23;
    newDst[15] = m33;
    return newDst;
  }
  function inverse(m, dst) {
    const newDst = dst ?? new Ctor(16);
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];
    const tmp0 = m22 * m33;
    const tmp1 = m32 * m23;
    const tmp2 = m12 * m33;
    const tmp3 = m32 * m13;
    const tmp4 = m12 * m23;
    const tmp5 = m22 * m13;
    const tmp6 = m02 * m33;
    const tmp7 = m32 * m03;
    const tmp8 = m02 * m23;
    const tmp9 = m22 * m03;
    const tmp10 = m02 * m13;
    const tmp11 = m12 * m03;
    const tmp12 = m20 * m31;
    const tmp13 = m30 * m21;
    const tmp14 = m10 * m31;
    const tmp15 = m30 * m11;
    const tmp16 = m10 * m21;
    const tmp17 = m20 * m11;
    const tmp18 = m00 * m31;
    const tmp19 = m30 * m01;
    const tmp20 = m00 * m21;
    const tmp21 = m20 * m01;
    const tmp22 = m00 * m11;
    const tmp23 = m10 * m01;
    const t0 = tmp0 * m11 + tmp3 * m21 + tmp4 * m31 - (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
    const t1 = tmp1 * m01 + tmp6 * m21 + tmp9 * m31 - (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
    const t2 = tmp2 * m01 + tmp7 * m11 + tmp10 * m31 - (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
    const t3 = tmp5 * m01 + tmp8 * m11 + tmp11 * m21 - (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
    const d = 1 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
    newDst[0] = d * t0;
    newDst[1] = d * t1;
    newDst[2] = d * t2;
    newDst[3] = d * t3;
    newDst[4] = d * (tmp1 * m10 + tmp2 * m20 + tmp5 * m30 - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30));
    newDst[5] = d * (tmp0 * m00 + tmp7 * m20 + tmp8 * m30 - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30));
    newDst[6] = d * (tmp3 * m00 + tmp6 * m10 + tmp11 * m30 - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30));
    newDst[7] = d * (tmp4 * m00 + tmp9 * m10 + tmp10 * m20 - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20));
    newDst[8] = d * (tmp12 * m13 + tmp15 * m23 + tmp16 * m33 - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33));
    newDst[9] = d * (tmp13 * m03 + tmp18 * m23 + tmp21 * m33 - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33));
    newDst[10] = d * (tmp14 * m03 + tmp19 * m13 + tmp22 * m33 - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33));
    newDst[11] = d * (tmp17 * m03 + tmp20 * m13 + tmp23 * m23 - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23));
    newDst[12] = d * (tmp14 * m22 + tmp17 * m32 + tmp13 * m12 - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22));
    newDst[13] = d * (tmp20 * m32 + tmp12 * m02 + tmp19 * m22 - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02));
    newDst[14] = d * (tmp18 * m12 + tmp23 * m32 + tmp15 * m02 - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12));
    newDst[15] = d * (tmp22 * m22 + tmp16 * m02 + tmp21 * m12 - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02));
    return newDst;
  }
  function determinant(m) {
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];
    const tmp0 = m22 * m33;
    const tmp1 = m32 * m23;
    const tmp2 = m12 * m33;
    const tmp3 = m32 * m13;
    const tmp4 = m12 * m23;
    const tmp5 = m22 * m13;
    const tmp6 = m02 * m33;
    const tmp7 = m32 * m03;
    const tmp8 = m02 * m23;
    const tmp9 = m22 * m03;
    const tmp10 = m02 * m13;
    const tmp11 = m12 * m03;
    const t0 = tmp0 * m11 + tmp3 * m21 + tmp4 * m31 - (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
    const t1 = tmp1 * m01 + tmp6 * m21 + tmp9 * m31 - (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
    const t2 = tmp2 * m01 + tmp7 * m11 + tmp10 * m31 - (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
    const t3 = tmp5 * m01 + tmp8 * m11 + tmp11 * m21 - (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
    return m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3;
  }
  const invert = inverse;
  function multiply(a, b, dst) {
    const newDst = dst ?? new Ctor(16);
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4 + 0];
    const a11 = a[4 + 1];
    const a12 = a[4 + 2];
    const a13 = a[4 + 3];
    const a20 = a[8 + 0];
    const a21 = a[8 + 1];
    const a22 = a[8 + 2];
    const a23 = a[8 + 3];
    const a30 = a[12 + 0];
    const a31 = a[12 + 1];
    const a32 = a[12 + 2];
    const a33 = a[12 + 3];
    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];
    const b03 = b[3];
    const b10 = b[4 + 0];
    const b11 = b[4 + 1];
    const b12 = b[4 + 2];
    const b13 = b[4 + 3];
    const b20 = b[8 + 0];
    const b21 = b[8 + 1];
    const b22 = b[8 + 2];
    const b23 = b[8 + 3];
    const b30 = b[12 + 0];
    const b31 = b[12 + 1];
    const b32 = b[12 + 2];
    const b33 = b[12 + 3];
    newDst[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
    newDst[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
    newDst[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
    newDst[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
    newDst[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
    newDst[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
    newDst[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
    newDst[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
    newDst[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
    newDst[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
    newDst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
    newDst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
    newDst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
    newDst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
    newDst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
    newDst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
    return newDst;
  }
  const mul = multiply;
  function setTranslation(a, v, dst) {
    const newDst = dst ?? identity();
    if (a !== newDst) {
      newDst[0] = a[0];
      newDst[1] = a[1];
      newDst[2] = a[2];
      newDst[3] = a[3];
      newDst[4] = a[4];
      newDst[5] = a[5];
      newDst[6] = a[6];
      newDst[7] = a[7];
      newDst[8] = a[8];
      newDst[9] = a[9];
      newDst[10] = a[10];
      newDst[11] = a[11];
    }
    newDst[12] = v[0];
    newDst[13] = v[1];
    newDst[14] = v[2];
    newDst[15] = 1;
    return newDst;
  }
  function getTranslation(m, dst) {
    const newDst = dst ?? vec32.create();
    newDst[0] = m[12];
    newDst[1] = m[13];
    newDst[2] = m[14];
    return newDst;
  }
  function getAxis(m, axis, dst) {
    const newDst = dst ?? vec32.create();
    const off = axis * 4;
    newDst[0] = m[off + 0];
    newDst[1] = m[off + 1];
    newDst[2] = m[off + 2];
    return newDst;
  }
  function setAxis(m, v, axis, dst) {
    const newDst = dst === m ? dst : copy(m, dst);
    const off = axis * 4;
    newDst[off + 0] = v[0];
    newDst[off + 1] = v[1];
    newDst[off + 2] = v[2];
    return newDst;
  }
  function getScaling(m, dst) {
    const newDst = dst ?? vec32.create();
    const xx = m[0];
    const xy = m[1];
    const xz = m[2];
    const yx = m[4];
    const yy = m[5];
    const yz = m[6];
    const zx = m[8];
    const zy = m[9];
    const zz = m[10];
    newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
    newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
    newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
    return newDst;
  }
  function perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
    const newDst = dst ?? new Ctor(16);
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
    newDst[0] = f / aspect;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = f;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[11] = -1;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[15] = 0;
    if (Number.isFinite(zFar)) {
      const rangeInv = 1 / (zNear - zFar);
      newDst[10] = zFar * rangeInv;
      newDst[14] = zFar * zNear * rangeInv;
    } else {
      newDst[10] = -1;
      newDst[14] = -zNear;
    }
    return newDst;
  }
  function perspectiveReverseZ(fieldOfViewYInRadians, aspect, zNear, zFar = Infinity, dst) {
    const newDst = dst ?? new Ctor(16);
    const f = 1 / Math.tan(fieldOfViewYInRadians * 0.5);
    newDst[0] = f / aspect;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = f;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[11] = -1;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[15] = 0;
    if (zFar === Infinity) {
      newDst[10] = 0;
      newDst[14] = zNear;
    } else {
      const rangeInv = 1 / (zFar - zNear);
      newDst[10] = zNear * rangeInv;
      newDst[14] = zFar * zNear * rangeInv;
    }
    return newDst;
  }
  function ortho(left, right, bottom, top, near, far, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = 2 / (right - left);
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = 2 / (top - bottom);
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = 1 / (near - far);
    newDst[11] = 0;
    newDst[12] = (right + left) / (left - right);
    newDst[13] = (top + bottom) / (bottom - top);
    newDst[14] = near / (near - far);
    newDst[15] = 1;
    return newDst;
  }
  function frustum(left, right, bottom, top, near, far, dst) {
    const newDst = dst ?? new Ctor(16);
    const dx = right - left;
    const dy = top - bottom;
    const dz = near - far;
    newDst[0] = 2 * near / dx;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = 2 * near / dy;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = (left + right) / dx;
    newDst[9] = (top + bottom) / dy;
    newDst[10] = far / dz;
    newDst[11] = -1;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = near * far / dz;
    newDst[15] = 0;
    return newDst;
  }
  function frustumReverseZ(left, right, bottom, top, near, far = Infinity, dst) {
    const newDst = dst ?? new Ctor(16);
    const dx = right - left;
    const dy = top - bottom;
    newDst[0] = 2 * near / dx;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = 2 * near / dy;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = (left + right) / dx;
    newDst[9] = (top + bottom) / dy;
    newDst[11] = -1;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[15] = 0;
    if (far === Infinity) {
      newDst[10] = 0;
      newDst[14] = near;
    } else {
      const rangeInv = 1 / (far - near);
      newDst[10] = near * rangeInv;
      newDst[14] = far * near * rangeInv;
    }
    return newDst;
  }
  const xAxis = vec32.create();
  const yAxis = vec32.create();
  const zAxis = vec32.create();
  function aim(position, target, up, dst) {
    const newDst = dst ?? new Ctor(16);
    vec32.normalize(vec32.subtract(target, position, zAxis), zAxis);
    vec32.normalize(vec32.cross(up, zAxis, xAxis), xAxis);
    vec32.normalize(vec32.cross(zAxis, xAxis, yAxis), yAxis);
    newDst[0] = xAxis[0];
    newDst[1] = xAxis[1];
    newDst[2] = xAxis[2];
    newDst[3] = 0;
    newDst[4] = yAxis[0];
    newDst[5] = yAxis[1];
    newDst[6] = yAxis[2];
    newDst[7] = 0;
    newDst[8] = zAxis[0];
    newDst[9] = zAxis[1];
    newDst[10] = zAxis[2];
    newDst[11] = 0;
    newDst[12] = position[0];
    newDst[13] = position[1];
    newDst[14] = position[2];
    newDst[15] = 1;
    return newDst;
  }
  function cameraAim(eye, target, up, dst) {
    const newDst = dst ?? new Ctor(16);
    vec32.normalize(vec32.subtract(eye, target, zAxis), zAxis);
    vec32.normalize(vec32.cross(up, zAxis, xAxis), xAxis);
    vec32.normalize(vec32.cross(zAxis, xAxis, yAxis), yAxis);
    newDst[0] = xAxis[0];
    newDst[1] = xAxis[1];
    newDst[2] = xAxis[2];
    newDst[3] = 0;
    newDst[4] = yAxis[0];
    newDst[5] = yAxis[1];
    newDst[6] = yAxis[2];
    newDst[7] = 0;
    newDst[8] = zAxis[0];
    newDst[9] = zAxis[1];
    newDst[10] = zAxis[2];
    newDst[11] = 0;
    newDst[12] = eye[0];
    newDst[13] = eye[1];
    newDst[14] = eye[2];
    newDst[15] = 1;
    return newDst;
  }
  function lookAt(eye, target, up, dst) {
    const newDst = dst ?? new Ctor(16);
    vec32.normalize(vec32.subtract(eye, target, zAxis), zAxis);
    vec32.normalize(vec32.cross(up, zAxis, xAxis), xAxis);
    vec32.normalize(vec32.cross(zAxis, xAxis, yAxis), yAxis);
    newDst[0] = xAxis[0];
    newDst[1] = yAxis[0];
    newDst[2] = zAxis[0];
    newDst[3] = 0;
    newDst[4] = xAxis[1];
    newDst[5] = yAxis[1];
    newDst[6] = zAxis[1];
    newDst[7] = 0;
    newDst[8] = xAxis[2];
    newDst[9] = yAxis[2];
    newDst[10] = zAxis[2];
    newDst[11] = 0;
    newDst[12] = -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]);
    newDst[13] = -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]);
    newDst[14] = -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]);
    newDst[15] = 1;
    return newDst;
  }
  function translation(v, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = 1;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = 1;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = 1;
    newDst[11] = 0;
    newDst[12] = v[0];
    newDst[13] = v[1];
    newDst[14] = v[2];
    newDst[15] = 1;
    return newDst;
  }
  function translate(m, v, dst) {
    const newDst = dst ?? new Ctor(16);
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const m00 = m[0];
    const m01 = m[1];
    const m02 = m[2];
    const m03 = m[3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];
    if (m !== newDst) {
      newDst[0] = m00;
      newDst[1] = m01;
      newDst[2] = m02;
      newDst[3] = m03;
      newDst[4] = m10;
      newDst[5] = m11;
      newDst[6] = m12;
      newDst[7] = m13;
      newDst[8] = m20;
      newDst[9] = m21;
      newDst[10] = m22;
      newDst[11] = m23;
    }
    newDst[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
    newDst[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
    newDst[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
    newDst[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;
    return newDst;
  }
  function rotationX(angleInRadians, dst) {
    const newDst = dst ?? new Ctor(16);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = 1;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = c;
    newDst[6] = s;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = -s;
    newDst[10] = c;
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  function rotateX(m, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(16);
    const m10 = m[4];
    const m11 = m[5];
    const m12 = m[6];
    const m13 = m[7];
    const m20 = m[8];
    const m21 = m[9];
    const m22 = m[10];
    const m23 = m[11];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[4] = c * m10 + s * m20;
    newDst[5] = c * m11 + s * m21;
    newDst[6] = c * m12 + s * m22;
    newDst[7] = c * m13 + s * m23;
    newDst[8] = c * m20 - s * m10;
    newDst[9] = c * m21 - s * m11;
    newDst[10] = c * m22 - s * m12;
    newDst[11] = c * m23 - s * m13;
    if (m !== newDst) {
      newDst[0] = m[0];
      newDst[1] = m[1];
      newDst[2] = m[2];
      newDst[3] = m[3];
      newDst[12] = m[12];
      newDst[13] = m[13];
      newDst[14] = m[14];
      newDst[15] = m[15];
    }
    return newDst;
  }
  function rotationY(angleInRadians, dst) {
    const newDst = dst ?? new Ctor(16);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = c;
    newDst[1] = 0;
    newDst[2] = -s;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = 1;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = s;
    newDst[9] = 0;
    newDst[10] = c;
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  function rotateY(m, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(16);
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = c * m00 - s * m20;
    newDst[1] = c * m01 - s * m21;
    newDst[2] = c * m02 - s * m22;
    newDst[3] = c * m03 - s * m23;
    newDst[8] = c * m20 + s * m00;
    newDst[9] = c * m21 + s * m01;
    newDst[10] = c * m22 + s * m02;
    newDst[11] = c * m23 + s * m03;
    if (m !== newDst) {
      newDst[4] = m[4];
      newDst[5] = m[5];
      newDst[6] = m[6];
      newDst[7] = m[7];
      newDst[12] = m[12];
      newDst[13] = m[13];
      newDst[14] = m[14];
      newDst[15] = m[15];
    }
    return newDst;
  }
  function rotationZ(angleInRadians, dst) {
    const newDst = dst ?? new Ctor(16);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = c;
    newDst[1] = s;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = -s;
    newDst[5] = c;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = 1;
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  function rotateZ(m, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(16);
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    newDst[0] = c * m00 + s * m10;
    newDst[1] = c * m01 + s * m11;
    newDst[2] = c * m02 + s * m12;
    newDst[3] = c * m03 + s * m13;
    newDst[4] = c * m10 - s * m00;
    newDst[5] = c * m11 - s * m01;
    newDst[6] = c * m12 - s * m02;
    newDst[7] = c * m13 - s * m03;
    if (m !== newDst) {
      newDst[8] = m[8];
      newDst[9] = m[9];
      newDst[10] = m[10];
      newDst[11] = m[11];
      newDst[12] = m[12];
      newDst[13] = m[13];
      newDst[14] = m[14];
      newDst[15] = m[15];
    }
    return newDst;
  }
  function axisRotation(axis, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(16);
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    const n = Math.sqrt(x * x + y * y + z * z);
    x /= n;
    y /= n;
    z /= n;
    const xx = x * x;
    const yy = y * y;
    const zz = z * z;
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const oneMinusCosine = 1 - c;
    newDst[0] = xx + (1 - xx) * c;
    newDst[1] = x * y * oneMinusCosine + z * s;
    newDst[2] = x * z * oneMinusCosine - y * s;
    newDst[3] = 0;
    newDst[4] = x * y * oneMinusCosine - z * s;
    newDst[5] = yy + (1 - yy) * c;
    newDst[6] = y * z * oneMinusCosine + x * s;
    newDst[7] = 0;
    newDst[8] = x * z * oneMinusCosine + y * s;
    newDst[9] = y * z * oneMinusCosine - x * s;
    newDst[10] = zz + (1 - zz) * c;
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  const rotation = axisRotation;
  function axisRotate(m, axis, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(16);
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    const n = Math.sqrt(x * x + y * y + z * z);
    x /= n;
    y /= n;
    z /= n;
    const xx = x * x;
    const yy = y * y;
    const zz = z * z;
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const oneMinusCosine = 1 - c;
    const r00 = xx + (1 - xx) * c;
    const r01 = x * y * oneMinusCosine + z * s;
    const r02 = x * z * oneMinusCosine - y * s;
    const r10 = x * y * oneMinusCosine - z * s;
    const r11 = yy + (1 - yy) * c;
    const r12 = y * z * oneMinusCosine + x * s;
    const r20 = x * z * oneMinusCosine + y * s;
    const r21 = y * z * oneMinusCosine - x * s;
    const r22 = zz + (1 - zz) * c;
    const m00 = m[0];
    const m01 = m[1];
    const m02 = m[2];
    const m03 = m[3];
    const m10 = m[4];
    const m11 = m[5];
    const m12 = m[6];
    const m13 = m[7];
    const m20 = m[8];
    const m21 = m[9];
    const m22 = m[10];
    const m23 = m[11];
    newDst[0] = r00 * m00 + r01 * m10 + r02 * m20;
    newDst[1] = r00 * m01 + r01 * m11 + r02 * m21;
    newDst[2] = r00 * m02 + r01 * m12 + r02 * m22;
    newDst[3] = r00 * m03 + r01 * m13 + r02 * m23;
    newDst[4] = r10 * m00 + r11 * m10 + r12 * m20;
    newDst[5] = r10 * m01 + r11 * m11 + r12 * m21;
    newDst[6] = r10 * m02 + r11 * m12 + r12 * m22;
    newDst[7] = r10 * m03 + r11 * m13 + r12 * m23;
    newDst[8] = r20 * m00 + r21 * m10 + r22 * m20;
    newDst[9] = r20 * m01 + r21 * m11 + r22 * m21;
    newDst[10] = r20 * m02 + r21 * m12 + r22 * m22;
    newDst[11] = r20 * m03 + r21 * m13 + r22 * m23;
    if (m !== newDst) {
      newDst[12] = m[12];
      newDst[13] = m[13];
      newDst[14] = m[14];
      newDst[15] = m[15];
    }
    return newDst;
  }
  const rotate2 = axisRotate;
  function scaling(v, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = v[0];
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = v[1];
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = v[2];
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  function scale(m, v, dst) {
    const newDst = dst ?? new Ctor(16);
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    newDst[0] = v0 * m[0 * 4 + 0];
    newDst[1] = v0 * m[0 * 4 + 1];
    newDst[2] = v0 * m[0 * 4 + 2];
    newDst[3] = v0 * m[0 * 4 + 3];
    newDst[4] = v1 * m[1 * 4 + 0];
    newDst[5] = v1 * m[1 * 4 + 1];
    newDst[6] = v1 * m[1 * 4 + 2];
    newDst[7] = v1 * m[1 * 4 + 3];
    newDst[8] = v2 * m[2 * 4 + 0];
    newDst[9] = v2 * m[2 * 4 + 1];
    newDst[10] = v2 * m[2 * 4 + 2];
    newDst[11] = v2 * m[2 * 4 + 3];
    if (m !== newDst) {
      newDst[12] = m[12];
      newDst[13] = m[13];
      newDst[14] = m[14];
      newDst[15] = m[15];
    }
    return newDst;
  }
  function uniformScaling(s, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = s;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    newDst[4] = 0;
    newDst[5] = s;
    newDst[6] = 0;
    newDst[7] = 0;
    newDst[8] = 0;
    newDst[9] = 0;
    newDst[10] = s;
    newDst[11] = 0;
    newDst[12] = 0;
    newDst[13] = 0;
    newDst[14] = 0;
    newDst[15] = 1;
    return newDst;
  }
  function uniformScale(m, s, dst) {
    const newDst = dst ?? new Ctor(16);
    newDst[0] = s * m[0 * 4 + 0];
    newDst[1] = s * m[0 * 4 + 1];
    newDst[2] = s * m[0 * 4 + 2];
    newDst[3] = s * m[0 * 4 + 3];
    newDst[4] = s * m[1 * 4 + 0];
    newDst[5] = s * m[1 * 4 + 1];
    newDst[6] = s * m[1 * 4 + 2];
    newDst[7] = s * m[1 * 4 + 3];
    newDst[8] = s * m[2 * 4 + 0];
    newDst[9] = s * m[2 * 4 + 1];
    newDst[10] = s * m[2 * 4 + 2];
    newDst[11] = s * m[2 * 4 + 3];
    if (m !== newDst) {
      newDst[12] = m[12];
      newDst[13] = m[13];
      newDst[14] = m[14];
      newDst[15] = m[15];
    }
    return newDst;
  }
  return {
    add,
    aim,
    axisRotate,
    axisRotation,
    cameraAim,
    clone,
    copy,
    create,
    determinant,
    equals,
    equalsApproximately,
    fromMat3,
    fromQuat,
    frustum,
    frustumReverseZ,
    getAxis,
    getScaling,
    getTranslation,
    identity,
    inverse,
    invert,
    lookAt,
    mul,
    mulScalar,
    multiply,
    multiplyScalar,
    negate,
    ortho,
    perspective,
    perspectiveReverseZ,
    rotate: rotate2,
    rotateX,
    rotateY,
    rotateZ,
    rotation,
    rotationX,
    rotationY,
    rotationZ,
    scale,
    scaling,
    set,
    setAxis,
    setTranslation,
    translate,
    translation,
    transpose,
    uniformScale,
    uniformScaling
  };
}
const cache$2 = /* @__PURE__ */ new Map();
function getAPI$2(Ctor) {
  let api = cache$2.get(Ctor);
  if (!api) {
    api = getAPIImpl$2(Ctor);
    cache$2.set(Ctor, api);
  }
  return api;
}
function getAPIImpl$1(Ctor) {
  const vec32 = getAPI$4(Ctor);
  function create(x, y, z, w) {
    const newDst = new Ctor(4);
    if (x !== void 0) {
      newDst[0] = x;
      if (y !== void 0) {
        newDst[1] = y;
        if (z !== void 0) {
          newDst[2] = z;
          if (w !== void 0) {
            newDst[3] = w;
          }
        }
      }
    }
    return newDst;
  }
  const fromValues = create;
  function set(x, y, z, w, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = x;
    newDst[1] = y;
    newDst[2] = z;
    newDst[3] = w;
    return newDst;
  }
  function fromAxisAngle(axis, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(4);
    const halfAngle = angleInRadians * 0.5;
    const s = Math.sin(halfAngle);
    newDst[0] = s * axis[0];
    newDst[1] = s * axis[1];
    newDst[2] = s * axis[2];
    newDst[3] = Math.cos(halfAngle);
    return newDst;
  }
  function toAxisAngle(q, dst) {
    const newDst = dst ?? vec32.create(3);
    const angle2 = Math.acos(q[3]) * 2;
    const s = Math.sin(angle2 * 0.5);
    if (s > EPSILON) {
      newDst[0] = q[0] / s;
      newDst[1] = q[1] / s;
      newDst[2] = q[2] / s;
    } else {
      newDst[0] = 1;
      newDst[1] = 0;
      newDst[2] = 0;
    }
    return { angle: angle2, axis: newDst };
  }
  function angle(a, b) {
    const d = dot(a, b);
    return Math.acos(2 * d * d - 1);
  }
  function multiply(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const aw = a[3];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const bw = b[3];
    newDst[0] = ax * bw + aw * bx + ay * bz - az * by;
    newDst[1] = ay * bw + aw * by + az * bx - ax * bz;
    newDst[2] = az * bw + aw * bz + ax * by - ay * bx;
    newDst[3] = aw * bw - ax * bx - ay * by - az * bz;
    return newDst;
  }
  const mul = multiply;
  function rotateX(q, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(4);
    const halfAngle = angleInRadians * 0.5;
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];
    const bx = Math.sin(halfAngle);
    const bw = Math.cos(halfAngle);
    newDst[0] = qx * bw + qw * bx;
    newDst[1] = qy * bw + qz * bx;
    newDst[2] = qz * bw - qy * bx;
    newDst[3] = qw * bw - qx * bx;
    return newDst;
  }
  function rotateY(q, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(4);
    const halfAngle = angleInRadians * 0.5;
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];
    const by = Math.sin(halfAngle);
    const bw = Math.cos(halfAngle);
    newDst[0] = qx * bw - qz * by;
    newDst[1] = qy * bw + qw * by;
    newDst[2] = qz * bw + qx * by;
    newDst[3] = qw * bw - qy * by;
    return newDst;
  }
  function rotateZ(q, angleInRadians, dst) {
    const newDst = dst ?? new Ctor(4);
    const halfAngle = angleInRadians * 0.5;
    const qx = q[0];
    const qy = q[1];
    const qz = q[2];
    const qw = q[3];
    const bz = Math.sin(halfAngle);
    const bw = Math.cos(halfAngle);
    newDst[0] = qx * bw + qy * bz;
    newDst[1] = qy * bw - qx * bz;
    newDst[2] = qz * bw + qw * bz;
    newDst[3] = qw * bw - qz * bz;
    return newDst;
  }
  function slerp(a, b, t, dst) {
    const newDst = dst ?? new Ctor(4);
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const aw = a[3];
    let bx = b[0];
    let by = b[1];
    let bz = b[2];
    let bw = b[3];
    let cosOmega = ax * bx + ay * by + az * bz + aw * bw;
    if (cosOmega < 0) {
      cosOmega = -cosOmega;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    let scale0;
    let scale1;
    if (1 - cosOmega > EPSILON) {
      const omega = Math.acos(cosOmega);
      const sinOmega = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinOmega;
      scale1 = Math.sin(t * omega) / sinOmega;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    newDst[0] = scale0 * ax + scale1 * bx;
    newDst[1] = scale0 * ay + scale1 * by;
    newDst[2] = scale0 * az + scale1 * bz;
    newDst[3] = scale0 * aw + scale1 * bw;
    return newDst;
  }
  function inverse(q, dst) {
    const newDst = dst ?? new Ctor(4);
    const a0 = q[0];
    const a1 = q[1];
    const a2 = q[2];
    const a3 = q[3];
    const dot2 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    const invDot = dot2 ? 1 / dot2 : 0;
    newDst[0] = -a0 * invDot;
    newDst[1] = -a1 * invDot;
    newDst[2] = -a2 * invDot;
    newDst[3] = a3 * invDot;
    return newDst;
  }
  function conjugate(q, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = -q[0];
    newDst[1] = -q[1];
    newDst[2] = -q[2];
    newDst[3] = q[3];
    return newDst;
  }
  function fromMat(m, dst) {
    const newDst = dst ?? new Ctor(4);
    const trace = m[0] + m[5] + m[10];
    if (trace > 0) {
      const root = Math.sqrt(trace + 1);
      newDst[3] = 0.5 * root;
      const invRoot = 0.5 / root;
      newDst[0] = (m[6] - m[9]) * invRoot;
      newDst[1] = (m[8] - m[2]) * invRoot;
      newDst[2] = (m[1] - m[4]) * invRoot;
    } else {
      let i = 0;
      if (m[5] > m[0]) {
        i = 1;
      }
      if (m[10] > m[i * 4 + i]) {
        i = 2;
      }
      const j = (i + 1) % 3;
      const k = (i + 2) % 3;
      const root = Math.sqrt(m[i * 4 + i] - m[j * 4 + j] - m[k * 4 + k] + 1);
      newDst[i] = 0.5 * root;
      const invRoot = 0.5 / root;
      newDst[3] = (m[j * 4 + k] - m[k * 4 + j]) * invRoot;
      newDst[j] = (m[j * 4 + i] + m[i * 4 + j]) * invRoot;
      newDst[k] = (m[k * 4 + i] + m[i * 4 + k]) * invRoot;
    }
    return newDst;
  }
  function fromEuler(xAngleInRadians, yAngleInRadians, zAngleInRadians, order, dst) {
    const newDst = dst ?? new Ctor(4);
    const xHalfAngle = xAngleInRadians * 0.5;
    const yHalfAngle = yAngleInRadians * 0.5;
    const zHalfAngle = zAngleInRadians * 0.5;
    const sx = Math.sin(xHalfAngle);
    const cx = Math.cos(xHalfAngle);
    const sy = Math.sin(yHalfAngle);
    const cy = Math.cos(yHalfAngle);
    const sz = Math.sin(zHalfAngle);
    const cz = Math.cos(zHalfAngle);
    switch (order) {
      case "xyz":
        newDst[0] = sx * cy * cz + cx * sy * sz;
        newDst[1] = cx * sy * cz - sx * cy * sz;
        newDst[2] = cx * cy * sz + sx * sy * cz;
        newDst[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "xzy":
        newDst[0] = sx * cy * cz - cx * sy * sz;
        newDst[1] = cx * sy * cz - sx * cy * sz;
        newDst[2] = cx * cy * sz + sx * sy * cz;
        newDst[3] = cx * cy * cz + sx * sy * sz;
        break;
      case "yxz":
        newDst[0] = sx * cy * cz + cx * sy * sz;
        newDst[1] = cx * sy * cz - sx * cy * sz;
        newDst[2] = cx * cy * sz - sx * sy * cz;
        newDst[3] = cx * cy * cz + sx * sy * sz;
        break;
      case "yzx":
        newDst[0] = sx * cy * cz + cx * sy * sz;
        newDst[1] = cx * sy * cz + sx * cy * sz;
        newDst[2] = cx * cy * sz - sx * sy * cz;
        newDst[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "zxy":
        newDst[0] = sx * cy * cz - cx * sy * sz;
        newDst[1] = cx * sy * cz + sx * cy * sz;
        newDst[2] = cx * cy * sz + sx * sy * cz;
        newDst[3] = cx * cy * cz - sx * sy * sz;
        break;
      case "zyx":
        newDst[0] = sx * cy * cz - cx * sy * sz;
        newDst[1] = cx * sy * cz + sx * cy * sz;
        newDst[2] = cx * cy * sz - sx * sy * cz;
        newDst[3] = cx * cy * cz + sx * sy * sz;
        break;
      default:
        throw new Error(`Unknown rotation order: ${order}`);
    }
    return newDst;
  }
  function copy(q, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = q[0];
    newDst[1] = q[1];
    newDst[2] = q[2];
    newDst[3] = q[3];
    return newDst;
  }
  const clone = copy;
  function add(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] + b[0];
    newDst[1] = a[1] + b[1];
    newDst[2] = a[2] + b[2];
    newDst[3] = a[3] + b[3];
    return newDst;
  }
  function subtract(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] - b[0];
    newDst[1] = a[1] - b[1];
    newDst[2] = a[2] - b[2];
    newDst[3] = a[3] - b[3];
    return newDst;
  }
  const sub = subtract;
  function mulScalar(v, k, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = v[0] * k;
    newDst[1] = v[1] * k;
    newDst[2] = v[2] * k;
    newDst[3] = v[3] * k;
    return newDst;
  }
  const scale = mulScalar;
  function divScalar(v, k, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = v[0] / k;
    newDst[1] = v[1] / k;
    newDst[2] = v[2] / k;
    newDst[3] = v[3] / k;
    return newDst;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  function lerp2(a, b, t, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] + t * (b[0] - a[0]);
    newDst[1] = a[1] + t * (b[1] - a[1]);
    newDst[2] = a[2] + t * (b[2] - a[2]);
    newDst[3] = a[3] + t * (b[3] - a[3]);
    return newDst;
  }
  function length(v) {
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const v3 = v[3];
    return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
  }
  const len = length;
  function lengthSq(v) {
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const v3 = v[3];
    return v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3;
  }
  const lenSq = lengthSq;
  function normalize(v, dst) {
    const newDst = dst ?? new Ctor(4);
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const v3 = v[3];
    const len2 = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
    if (len2 > 1e-5) {
      newDst[0] = v0 / len2;
      newDst[1] = v1 / len2;
      newDst[2] = v2 / len2;
      newDst[3] = v3 / len2;
    } else {
      newDst[0] = 0;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 1;
    }
    return newDst;
  }
  function equalsApproximately(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON && Math.abs(a[3] - b[3]) < EPSILON;
  }
  function equals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
  function identity(dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = 0;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 1;
    return newDst;
  }
  const tempVec3 = vec32.create();
  const xUnitVec3 = vec32.create();
  const yUnitVec3 = vec32.create();
  function rotationTo(aUnit, bUnit, dst) {
    const newDst = dst ?? new Ctor(4);
    const dot2 = vec32.dot(aUnit, bUnit);
    if (dot2 < -0.999999) {
      vec32.cross(xUnitVec3, aUnit, tempVec3);
      if (vec32.len(tempVec3) < 1e-6) {
        vec32.cross(yUnitVec3, aUnit, tempVec3);
      }
      vec32.normalize(tempVec3, tempVec3);
      fromAxisAngle(tempVec3, Math.PI, newDst);
      return newDst;
    } else if (dot2 > 0.999999) {
      newDst[0] = 0;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 1;
      return newDst;
    } else {
      vec32.cross(aUnit, bUnit, tempVec3);
      newDst[0] = tempVec3[0];
      newDst[1] = tempVec3[1];
      newDst[2] = tempVec3[2];
      newDst[3] = 1 + dot2;
      return normalize(newDst, newDst);
    }
  }
  const tempQuat1 = new Ctor(4);
  const tempQuat2 = new Ctor(4);
  function sqlerp(a, b, c, d, t, dst) {
    const newDst = dst ?? new Ctor(4);
    slerp(a, d, t, tempQuat1);
    slerp(b, c, t, tempQuat2);
    slerp(tempQuat1, tempQuat2, 2 * t * (1 - t), newDst);
    return newDst;
  }
  return {
    create,
    fromValues,
    set,
    fromAxisAngle,
    toAxisAngle,
    angle,
    multiply,
    mul,
    rotateX,
    rotateY,
    rotateZ,
    slerp,
    inverse,
    conjugate,
    fromMat,
    fromEuler,
    copy,
    clone,
    add,
    subtract,
    sub,
    mulScalar,
    scale,
    divScalar,
    dot,
    lerp: lerp2,
    length,
    len,
    lengthSq,
    lenSq,
    normalize,
    equalsApproximately,
    equals,
    identity,
    rotationTo,
    sqlerp
  };
}
const cache$1 = /* @__PURE__ */ new Map();
function getAPI$1(Ctor) {
  let api = cache$1.get(Ctor);
  if (!api) {
    api = getAPIImpl$1(Ctor);
    cache$1.set(Ctor, api);
  }
  return api;
}
function getAPIImpl(Ctor) {
  function create(x, y, z, w) {
    const newDst = new Ctor(4);
    if (x !== void 0) {
      newDst[0] = x;
      if (y !== void 0) {
        newDst[1] = y;
        if (z !== void 0) {
          newDst[2] = z;
          if (w !== void 0) {
            newDst[3] = w;
          }
        }
      }
    }
    return newDst;
  }
  const fromValues = create;
  function set(x, y, z, w, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = x;
    newDst[1] = y;
    newDst[2] = z;
    newDst[3] = w;
    return newDst;
  }
  function ceil(v, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = Math.ceil(v[0]);
    newDst[1] = Math.ceil(v[1]);
    newDst[2] = Math.ceil(v[2]);
    newDst[3] = Math.ceil(v[3]);
    return newDst;
  }
  function floor(v, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = Math.floor(v[0]);
    newDst[1] = Math.floor(v[1]);
    newDst[2] = Math.floor(v[2]);
    newDst[3] = Math.floor(v[3]);
    return newDst;
  }
  function round(v, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = Math.round(v[0]);
    newDst[1] = Math.round(v[1]);
    newDst[2] = Math.round(v[2]);
    newDst[3] = Math.round(v[3]);
    return newDst;
  }
  function clamp2(v, min2 = 0, max2 = 1, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = Math.min(max2, Math.max(min2, v[0]));
    newDst[1] = Math.min(max2, Math.max(min2, v[1]));
    newDst[2] = Math.min(max2, Math.max(min2, v[2]));
    newDst[3] = Math.min(max2, Math.max(min2, v[3]));
    return newDst;
  }
  function add(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] + b[0];
    newDst[1] = a[1] + b[1];
    newDst[2] = a[2] + b[2];
    newDst[3] = a[3] + b[3];
    return newDst;
  }
  function addScaled(a, b, scale2, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] + b[0] * scale2;
    newDst[1] = a[1] + b[1] * scale2;
    newDst[2] = a[2] + b[2] * scale2;
    newDst[3] = a[3] + b[3] * scale2;
    return newDst;
  }
  function subtract(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] - b[0];
    newDst[1] = a[1] - b[1];
    newDst[2] = a[2] - b[2];
    newDst[3] = a[3] - b[3];
    return newDst;
  }
  const sub = subtract;
  function equalsApproximately(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON && Math.abs(a[3] - b[3]) < EPSILON;
  }
  function equals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
  function lerp2(a, b, t, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] + t * (b[0] - a[0]);
    newDst[1] = a[1] + t * (b[1] - a[1]);
    newDst[2] = a[2] + t * (b[2] - a[2]);
    newDst[3] = a[3] + t * (b[3] - a[3]);
    return newDst;
  }
  function lerpV(a, b, t, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] + t[0] * (b[0] - a[0]);
    newDst[1] = a[1] + t[1] * (b[1] - a[1]);
    newDst[2] = a[2] + t[2] * (b[2] - a[2]);
    newDst[3] = a[3] + t[3] * (b[3] - a[3]);
    return newDst;
  }
  function max(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = Math.max(a[0], b[0]);
    newDst[1] = Math.max(a[1], b[1]);
    newDst[2] = Math.max(a[2], b[2]);
    newDst[3] = Math.max(a[3], b[3]);
    return newDst;
  }
  function min(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = Math.min(a[0], b[0]);
    newDst[1] = Math.min(a[1], b[1]);
    newDst[2] = Math.min(a[2], b[2]);
    newDst[3] = Math.min(a[3], b[3]);
    return newDst;
  }
  function mulScalar(v, k, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = v[0] * k;
    newDst[1] = v[1] * k;
    newDst[2] = v[2] * k;
    newDst[3] = v[3] * k;
    return newDst;
  }
  const scale = mulScalar;
  function divScalar(v, k, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = v[0] / k;
    newDst[1] = v[1] / k;
    newDst[2] = v[2] / k;
    newDst[3] = v[3] / k;
    return newDst;
  }
  function inverse(v, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = 1 / v[0];
    newDst[1] = 1 / v[1];
    newDst[2] = 1 / v[2];
    newDst[3] = 1 / v[3];
    return newDst;
  }
  const invert = inverse;
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  function length(v) {
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const v3 = v[3];
    return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
  }
  const len = length;
  function lengthSq(v) {
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const v3 = v[3];
    return v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3;
  }
  const lenSq = lengthSq;
  function distance(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    const dw = a[3] - b[3];
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
  }
  const dist = distance;
  function distanceSq(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    const dw = a[3] - b[3];
    return dx * dx + dy * dy + dz * dz + dw * dw;
  }
  const distSq = distanceSq;
  function normalize(v, dst) {
    const newDst = dst ?? new Ctor(4);
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];
    const v3 = v[3];
    const len2 = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
    if (len2 > 1e-5) {
      newDst[0] = v0 / len2;
      newDst[1] = v1 / len2;
      newDst[2] = v2 / len2;
      newDst[3] = v3 / len2;
    } else {
      newDst[0] = 0;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
    }
    return newDst;
  }
  function negate(v, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = -v[0];
    newDst[1] = -v[1];
    newDst[2] = -v[2];
    newDst[3] = -v[3];
    return newDst;
  }
  function copy(v, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = v[0];
    newDst[1] = v[1];
    newDst[2] = v[2];
    newDst[3] = v[3];
    return newDst;
  }
  const clone = copy;
  function multiply(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] * b[0];
    newDst[1] = a[1] * b[1];
    newDst[2] = a[2] * b[2];
    newDst[3] = a[3] * b[3];
    return newDst;
  }
  const mul = multiply;
  function divide(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = a[0] / b[0];
    newDst[1] = a[1] / b[1];
    newDst[2] = a[2] / b[2];
    newDst[3] = a[3] / b[3];
    return newDst;
  }
  const div = divide;
  function zero(dst) {
    const newDst = dst ?? new Ctor(4);
    newDst[0] = 0;
    newDst[1] = 0;
    newDst[2] = 0;
    newDst[3] = 0;
    return newDst;
  }
  function transformMat4(v, m, dst) {
    const newDst = dst ?? new Ctor(4);
    const x = v[0];
    const y = v[1];
    const z = v[2];
    const w = v[3];
    newDst[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    newDst[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    newDst[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    newDst[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return newDst;
  }
  function setLength(a, len2, dst) {
    const newDst = dst ?? new Ctor(4);
    normalize(a, newDst);
    return mulScalar(newDst, len2, newDst);
  }
  function truncate(a, maxLen, dst) {
    const newDst = dst ?? new Ctor(4);
    if (length(a) > maxLen) {
      return setLength(a, maxLen, newDst);
    }
    return copy(a, newDst);
  }
  function midpoint(a, b, dst) {
    const newDst = dst ?? new Ctor(4);
    return lerp2(a, b, 0.5, newDst);
  }
  return {
    create,
    fromValues,
    set,
    ceil,
    floor,
    round,
    clamp: clamp2,
    add,
    addScaled,
    subtract,
    sub,
    equalsApproximately,
    equals,
    lerp: lerp2,
    lerpV,
    max,
    min,
    mulScalar,
    scale,
    divScalar,
    inverse,
    invert,
    dot,
    length,
    len,
    lengthSq,
    lenSq,
    distance,
    dist,
    distanceSq,
    distSq,
    normalize,
    negate,
    copy,
    clone,
    multiply,
    mul,
    divide,
    div,
    zero,
    transformMat4,
    setLength,
    truncate,
    midpoint
  };
}
const cache = /* @__PURE__ */ new Map();
function getAPI(Ctor) {
  let api = cache.get(Ctor);
  if (!api) {
    api = getAPIImpl(Ctor);
    cache.set(Ctor, api);
  }
  return api;
}
function wgpuMatrixAPI(Mat3Ctor, Mat4Ctor, QuatCtor, Vec2Ctor, Vec3Ctor, Vec4Ctor) {
  return {
    /** @namespace mat3 */
    mat3: getAPI$3(Mat3Ctor),
    /** @namespace mat4 */
    mat4: getAPI$2(Mat4Ctor),
    /** @namespace quat */
    quat: getAPI$1(QuatCtor),
    /** @namespace vec2 */
    vec2: getAPI$5(Vec2Ctor),
    /** @namespace vec3 */
    vec3: getAPI$4(Vec3Ctor),
    /** @namespace vec4 */
    vec4: getAPI(Vec4Ctor)
  };
}
const {
  /**
   * 4x4 Matrix functions that default to returning `Float32Array`
   * @namespace
   */
  mat4,
  /**
   * Vec3 functions that default to returning `Float32Array`
   * @namespace
   */
  vec3
} = wgpuMatrixAPI(Float32Array, Float32Array, Float32Array, Float32Array, Float32Array, Float32Array);
wgpuMatrixAPI(Float64Array, Float64Array, Float64Array, Float64Array, Float64Array, Float64Array);
wgpuMatrixAPI(ZeroArray, Array, Array, Array, Array, Array);
const cubeVertexSize = 4 * 10;
const cubePositionOffset = 0;
const cubeUVOffset = 4 * 8;
const cubeVertexCount = 36;
const cubeVertexArray = new Float32Array([
  // float4 position, float4 color, float2 uv,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  0,
  1,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  1,
  1,
  1,
  -1,
  -1,
  -1,
  1,
  0,
  0,
  0,
  1,
  1,
  0,
  1,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  0,
  0,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  0,
  1,
  -1,
  -1,
  -1,
  1,
  0,
  0,
  0,
  1,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  1,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  1,
  0,
  1,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  1,
  1,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  1,
  0,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  0,
  -1,
  1,
  -1,
  1,
  0,
  1,
  0,
  1,
  0,
  0,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  1,
  0,
  1,
  1,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  0,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  1,
  0,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  -1,
  1,
  -1,
  1,
  0,
  1,
  0,
  1,
  1,
  0,
  -1,
  -1,
  -1,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  1,
  0,
  1,
  -1,
  1,
  -1,
  1,
  0,
  1,
  0,
  1,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  1,
  1,
  0,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  1,
  1,
  0,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  1,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  1,
  1,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  0,
  1,
  -1,
  -1,
  -1,
  1,
  0,
  0,
  0,
  1,
  1,
  1,
  -1,
  1,
  -1,
  1,
  0,
  1,
  0,
  1,
  1,
  0,
  1,
  1,
  -1,
  1,
  1,
  1,
  0,
  1,
  0,
  0,
  1,
  -1,
  -1,
  1,
  1,
  0,
  0,
  1,
  0,
  1,
  -1,
  1,
  -1,
  1,
  0,
  1,
  0,
  1,
  1,
  0
]);
const kVertexSize = 8;
function createPlaneVertices({
  width = 1,
  depth = 1,
  subdivisionsWidth = 1,
  subdivisionsDepth = 1
} = {}) {
  const numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
  const vertices = new Float32Array(numVertices * kVertexSize);
  let cursor = 0;
  for (let z = 0; z <= subdivisionsDepth; z++) {
    for (let x = 0; x <= subdivisionsWidth; x++) {
      const u = x / subdivisionsWidth;
      const v = z / subdivisionsDepth;
      vertices.set([
        width * u - width * 0.5,
        0,
        depth * v - depth * 0.5,
        // position
        0,
        1,
        0,
        // normal
        u,
        v
        // texcoord
      ], cursor);
      cursor += kVertexSize;
    }
  }
  const numVertsAcross = subdivisionsWidth + 1;
  const indices = new Uint16Array(
    3 * subdivisionsWidth * subdivisionsDepth * 2
  );
  cursor = 0;
  for (let z = 0; z < subdivisionsDepth; z++) {
    for (let x = 0; x < subdivisionsWidth; x++) {
      indices[cursor++] = (z + 0) * numVertsAcross + x;
      indices[cursor++] = (z + 1) * numVertsAcross + x;
      indices[cursor++] = (z + 0) * numVertsAcross + x + 1;
      indices[cursor++] = (z + 1) * numVertsAcross + x;
      indices[cursor++] = (z + 1) * numVertsAcross + x + 1;
      indices[cursor++] = (z + 0) * numVertsAcross + x + 1;
    }
  }
  return { vertices, indices };
}
function createSphereVertices({
  radius = 1,
  subdivisionsAxis = 24,
  subdivisionsHeight = 12,
  startLatitudeInRadians = 0,
  endLatitudeInRadians = Math.PI,
  startLongitudeInRadians = 0,
  endLongitudeInRadians = Math.PI * 2
} = {}) {
  if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
    throw new Error("subdivisionAxis and subdivisionHeight must be > 0");
  }
  const latRange = endLatitudeInRadians - startLatitudeInRadians;
  const longRange = endLongitudeInRadians - startLongitudeInRadians;
  const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
  const vertices = new Float32Array(numVertices * kVertexSize);
  let cursor = 0;
  for (let y = 0; y <= subdivisionsHeight; y++) {
    for (let x = 0; x <= subdivisionsAxis; x++) {
      const u = x / subdivisionsAxis;
      const v = y / subdivisionsHeight;
      const theta = longRange * u + startLongitudeInRadians;
      const phi = latRange * v + startLatitudeInRadians;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const ux = cosTheta * sinPhi;
      const uy = cosPhi;
      const uz = sinTheta * sinPhi;
      vertices.set(
        [
          radius * ux,
          radius * uy,
          radius * uz,
          // position
          ux,
          uy,
          uz,
          // normal
          1 - u,
          v
          // texcoord
        ],
        cursor
      );
      cursor += kVertexSize;
    }
  }
  const numVertsAround = subdivisionsAxis + 1;
  const indices = new Uint16Array(
    3 * subdivisionsAxis * subdivisionsHeight * 2
  );
  cursor = 0;
  for (let x = 0; x < subdivisionsAxis; x++) {
    for (let y = 0; y < subdivisionsHeight; y++) {
      indices[cursor++] = (y + 0) * numVertsAround + x;
      indices[cursor++] = (y + 0) * numVertsAround + x + 1;
      indices[cursor++] = (y + 1) * numVertsAround + x;
      indices[cursor++] = (y + 1) * numVertsAround + x;
      indices[cursor++] = (y + 0) * numVertsAround + x + 1;
      indices[cursor++] = (y + 1) * numVertsAround + x + 1;
    }
  }
  return { vertices, indices };
}
function deindex(src) {
  const numElements = src.indices.length;
  const vertices = new Float32Array(numElements * kVertexSize);
  const indices = new Uint16Array(numElements);
  for (let i = 0; i < numElements; ++i) {
    const off = src.indices[i] * kVertexSize;
    vertices.set(
      src.vertices.subarray(off, off + kVertexSize),
      i * kVertexSize
    );
    indices[i] = i;
  }
  return {
    vertices,
    indices
  };
}
const CUBE_STRIDE = 10;
function packPos3Norm3Uv2_to_Pos4Color4Uv2(vertices8) {
  const inStride = 8;
  const count = vertices8.length / inStride;
  const out = new Float32Array(count * CUBE_STRIDE);
  let si = 0, di = 0;
  for (let i = 0; i < count; i++) {
    const x = vertices8[si++], y = vertices8[si++], z = vertices8[si++];
    si += 3;
    const u = vertices8[si++], v = vertices8[si++];
    out[di++] = x;
    out[di++] = y;
    out[di++] = z;
    out[di++] = 1;
    out[di++] = 1;
    out[di++] = 1;
    out[di++] = 1;
    out[di++] = 1;
    out[di++] = u;
    out[di++] = v;
  }
  return out;
}
function buildPlanePacked(opts) {
  const de = deindex(createPlaneVertices(opts ?? {}));
  const packed = packPos3Norm3Uv2_to_Pos4Color4Uv2(de.vertices);
  return { array: packed, vertexCount: packed.length / CUBE_STRIDE };
}
function buildSpherePacked(opts) {
  const de = deindex(createSphereVertices(opts ?? {}));
  const packed = packPos3Norm3Uv2_to_Pos4Color4Uv2(de.vertices);
  return { array: packed, vertexCount: packed.length / CUBE_STRIDE };
}
class CameraBase {
  // The camera matrix
  matrix_ = new Float32Array([
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ]);
  // The calculated view matrix
  view_ = mat4.create();
  // Aliases to column vectors of the matrix
  right_ = new Float32Array(this.matrix_.buffer, 4 * 0, 4);
  up_ = new Float32Array(this.matrix_.buffer, 4 * 4, 4);
  back_ = new Float32Array(this.matrix_.buffer, 4 * 8, 4);
  position_ = new Float32Array(this.matrix_.buffer, 4 * 12, 4);
  // Returns the camera matrix
  get matrix() {
    return this.matrix_;
  }
  // Assigns `mat` to the camera matrix
  set matrix(mat) {
    mat4.copy(mat, this.matrix_);
  }
  // Returns the camera view matrix
  get view() {
    return this.view_;
  }
  // Assigns `mat` to the camera view
  set view(mat) {
    mat4.copy(mat, this.view_);
  }
  // Returns column vector 0 of the camera matrix
  get right() {
    return this.right_;
  }
  // Assigns `vec` to the first 3 elements of column vector 0 of the camera matrix
  set right(vec) {
    vec3.copy(vec, this.right_);
  }
  // Returns column vector 1 of the camera matrix
  get up() {
    return this.up_;
  }
  // Assigns `vec` to the first 3 elements of column vector 1 of the camera matrix
  set up(vec) {
    vec3.copy(vec, this.up_);
  }
  // Returns column vector 2 of the camera matrix
  get back() {
    return this.back_;
  }
  // Assigns `vec` to the first 3 elements of column vector 2 of the camera matrix
  set back(vec) {
    vec3.copy(vec, this.back_);
  }
  // Returns column vector 3 of the camera matrix
  get position() {
    return this.position_;
  }
  // Assigns `vec` to the first 3 elements of column vector 3 of the camera matrix
  set position(vec) {
    vec3.copy(vec, this.position_);
  }
}
class WASDCamera extends CameraBase {
  // The camera absolute pitch angle
  pitch = 0;
  // The camera absolute yaw angle
  yaw = 0;
  // The movement veloicty
  velocity_ = vec3.create();
  // Speed multiplier for camera movement
  movementSpeed = 10;
  // Speed multiplier for camera rotation
  rotationSpeed = 1;
  // Movement velocity drag coeffient [0 .. 1]
  // 0: Continues forever
  // 1: Instantly stops moving
  frictionCoefficient = 0.99;
  // Returns velocity vector
  get velocity() {
    return this.velocity_;
  }
  // Assigns `vec` to the velocity vector
  set velocity(vec) {
    vec3.copy(vec, this.velocity_);
  }
  // Construtor
  constructor(options) {
    super();
    if (options && (options.position || options.target)) {
      const position = options.position ?? vec3.create(0, 0, -5);
      const target = options.target ?? vec3.create(0, 0, 0);
      const back = vec3.normalize(vec3.sub(position, target));
      this.recalculateAngles(back);
      this.position = position;
    }
  }
  // Returns the camera matrix
  get matrix() {
    return super.matrix;
  }
  // Assigns `mat` to the camera matrix, and recalcuates the camera angles
  set matrix(mat) {
    super.matrix = mat;
    this.recalculateAngles(this.back);
  }
  update(deltaTime, input) {
    const sign = (positive, negative) => (positive ? 1 : 0) - (negative ? 1 : 0);
    this.yaw -= input.analog.x * deltaTime * this.rotationSpeed;
    this.pitch -= input.analog.y * deltaTime * this.rotationSpeed;
    this.yaw = mod(this.yaw, Math.PI * 2);
    this.pitch = clamp(this.pitch, -Math.PI / 2, Math.PI / 2);
    const position = vec3.copy(this.position);
    super.matrix = mat4.rotateX(mat4.rotationY(this.yaw), this.pitch);
    const digital = input.digital;
    const deltaRight = sign(digital.right, digital.left);
    const deltaUp = sign(digital.up, digital.down);
    const targetVelocity = vec3.create();
    const deltaBack = sign(digital.backward, digital.forward);
    vec3.addScaled(targetVelocity, this.right, deltaRight, targetVelocity);
    vec3.addScaled(targetVelocity, this.up, deltaUp, targetVelocity);
    vec3.addScaled(targetVelocity, this.back, deltaBack, targetVelocity);
    vec3.normalize(targetVelocity, targetVelocity);
    vec3.mulScalar(targetVelocity, this.movementSpeed, targetVelocity);
    this.velocity = lerp(
      targetVelocity,
      this.velocity,
      Math.pow(1 - this.frictionCoefficient, deltaTime)
    );
    this.position = vec3.addScaled(position, this.velocity, deltaTime);
    this.view = mat4.invert(this.matrix);
    return this.view;
  }
  // Recalculates the yaw and pitch values from a directional vector
  recalculateAngles(dir) {
    this.yaw = Math.atan2(dir[0], dir[2]);
    this.pitch = -Math.asin(dir[1]);
  }
}
class ArcballCamera extends CameraBase {
  // The camera distance from the target
  distance = 0;
  // The current angular velocity
  angularVelocity = 0;
  // The current rotation axis
  axis_ = vec3.create();
  // Returns the rotation axis
  get axis() {
    return this.axis_;
  }
  // Assigns `vec` to the rotation axis
  set axis(vec) {
    vec3.copy(vec, this.axis_);
  }
  // Speed multiplier for camera rotation
  rotationSpeed = 1;
  // Speed multiplier for camera zoom
  zoomSpeed = 0.1;
  // Rotation velocity drag coeffient [0 .. 1]
  // 0: Spins forever
  // 1: Instantly stops spinning
  frictionCoefficient = 0.999;
  // Construtor
  constructor(options) {
    super();
    if (options && options.position) {
      this.position = options.position;
      this.distance = vec3.len(this.position);
      this.back = vec3.normalize(this.position);
      this.recalcuateRight();
      this.recalcuateUp();
    }
  }
  // Returns the camera matrix
  get matrix() {
    return super.matrix;
  }
  // Assigns `mat` to the camera matrix, and recalcuates the distance
  set matrix(mat) {
    super.matrix = mat;
    this.distance = vec3.len(this.position);
  }
  update(deltaTime, input) {
    const epsilon = 1e-7;
    if (input.analog.touching) {
      this.angularVelocity = 0;
    } else {
      this.angularVelocity *= Math.pow(1 - this.frictionCoefficient, deltaTime);
    }
    const movement = vec3.create();
    vec3.addScaled(movement, this.right, input.analog.x, movement);
    vec3.addScaled(movement, this.up, -input.analog.y, movement);
    const crossProduct = vec3.cross(movement, this.back);
    const magnitude = vec3.len(crossProduct);
    if (magnitude > epsilon) {
      this.axis = vec3.scale(crossProduct, 1 / magnitude);
      this.angularVelocity = magnitude * this.rotationSpeed;
    }
    const rotationAngle = this.angularVelocity * deltaTime;
    if (rotationAngle > epsilon) {
      this.back = vec3.normalize(rotate(this.back, this.axis, rotationAngle));
      this.recalcuateRight();
      this.recalcuateUp();
    }
    if (input.analog.zoom !== 0) {
      this.distance *= 1 + input.analog.zoom * this.zoomSpeed;
    }
    this.position = vec3.scale(this.back, this.distance);
    this.view = mat4.invert(this.matrix);
    return this.view;
  }
  // Assigns `this.right` with the cross product of `this.up` and `this.back`
  recalcuateRight() {
    this.right = vec3.normalize(vec3.cross(this.up, this.back));
  }
  // Assigns `this.up` with the cross product of `this.back` and `this.right`
  recalcuateUp() {
    this.up = vec3.normalize(vec3.cross(this.back, this.right));
  }
}
function clamp(x, min, max) {
  return Math.min(Math.max(x, min), max);
}
function mod(x, div) {
  return x - Math.floor(Math.abs(x) / div) * div * Math.sign(x);
}
function rotate(vec, axis, angle) {
  return vec3.transformMat4Upper3x3(vec, mat4.rotation(axis, angle));
}
function lerp(a, b, s) {
  return vec3.addScaled(a, vec3.sub(b, a), s);
}
function createInputHandler(window2, canvas) {
  const digital = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
  };
  const analog = { x: 0, y: 0, zoom: 0 };
  let mouseDown = false;
  canvas.tabIndex = 0;
  canvas.addEventListener("pointerdown", () => canvas.focus());
  const isEditable = (t) => {
    const el2 = t;
    if (!el2) return false;
    return !!el2.closest?.('input, textarea, [contenteditable=""], [contenteditable="true"]');
  };
  const setDigital = (e, value) => {
    if (isEditable(e.target)) return;
    switch (e.code) {
      case "KeyW":
        digital.forward = value;
        e.preventDefault();
        e.stopPropagation();
        break;
      case "KeyS":
        digital.backward = value;
        e.preventDefault();
        e.stopPropagation();
        break;
      case "KeyA":
        digital.left = value;
        e.preventDefault();
        e.stopPropagation();
        break;
      case "KeyD":
        digital.right = value;
        e.preventDefault();
        e.stopPropagation();
        break;
      case "Space":
        digital.up = value;
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ShiftLeft":
      case "ControlLeft":
      case "KeyC":
        digital.down = value;
        e.preventDefault();
        e.stopPropagation();
        break;
    }
  };
  window2.addEventListener("keydown", (e) => setDigital(e, true));
  window2.addEventListener("keyup", (e) => setDigital(e, false));
  canvas.style.touchAction = "pinch-zoom";
  canvas.addEventListener("pointerdown", () => {
    mouseDown = true;
  });
  canvas.addEventListener("pointerup", () => {
    mouseDown = false;
  });
  canvas.addEventListener("pointermove", (e) => {
    mouseDown = e.pointerType == "mouse" ? (e.buttons & 1) !== 0 : true;
    if (mouseDown) {
      analog.x += e.movementX;
      analog.y += e.movementY;
    }
  });
  canvas.addEventListener("wheel", (e) => {
    mouseDown = (e.buttons & 1) !== 0;
    if (mouseDown) {
      analog.zoom += Math.sign(e.deltaY);
      e.preventDefault();
      e.stopPropagation();
    }
  }, { passive: false });
  return () => {
    const out = { digital, analog: { x: analog.x, y: analog.y, zoom: analog.zoom, touching: mouseDown } };
    analog.x = 0;
    analog.y = 0;
    analog.zoom = 0;
    return out;
  };
}
(function loadBasicSceneCSS() {
  const href = "/static/css/basicScene.css";
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
})();
function el(tag, cls, txt) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
}
async function loadWGSL(path) {
  const res = await fetch(`/static/shaders/${path}`);
  if (!res.ok) throw new Error(`Failed to load shader ${path} (${res.status})`);
  return res.text();
}
function createBasicScene(imageUrl = "/static/img/love.jpeg") {
  const root = el("div", "basic-scene");
  const title = el("h1", "", "WebGPU: Basic Scene (w/ Camera + Background)");
  const toolbar = el("div", "scene-toolbar");
  const camGroup = el("div", "toolbar-group");
  const arcBtn = el("button", "cam-btn", "Orbit");
  const wasdBtn = el("button", "cam-btn", "Fly");
  camGroup.append(arcBtn, wasdBtn);
  const shapeGroup = el("div", "toolbar-group");
  const cubeBtn = el("button", "shape-btn", "Cube");
  const planeBtn = el("button", "shape-btn", "Plane");
  const sphereBtn = el("button", "shape-btn", "Sphere");
  shapeGroup.append(cubeBtn, planeBtn, sphereBtn);
  const optsGroup = el("div", "toolbar-group");
  const doubleBtn = el("button", "shape-btn", "Double-sided");
  optsGroup.append(doubleBtn);
  toolbar.append(camGroup, shapeGroup, optsGroup);
  const canvas = document.createElement("canvas");
  canvas.className = "scene-canvas";
  root.append(title, toolbar, canvas);
  const initialPos = vec3.create(3, 2, 5);
  const cameras = {
    arcball: new ArcballCamera({ position: initialPos }),
    WASD: new WASDCamera({ position: initialPos })
  };
  let activeCam = "arcball";
  const input = createInputHandler(window, canvas);
  const setCamMode = (next) => {
    cameras[next].matrix = cameras[activeCam].matrix;
    activeCam = next;
    arcBtn.classList.toggle("active", activeCam === "arcball");
    wasdBtn.classList.toggle("active", activeCam === "WASD");
  };
  arcBtn.onclick = () => setCamMode("arcball");
  wasdBtn.onclick = () => setCamMode("WASD");
  setCamMode("arcball");
  queueMicrotask(async () => {
    try {
      let writeSolid = function(tex, r = 64, g = 64, b = 64, a = 255) {
        const px = new Uint8Array([r, g, b, a]);
        device.queue.writeTexture({ texture: tex }, px, { bytesPerRow: 4 }, { width: 1, height: 1 });
      }, setGeometry = function(kind) {
        activeShape = kind;
        vbuf?.destroy();
        mat4.identity(model);
        if (kind === "cube") {
          vbuf = device.createBuffer({
            size: cubeVertexArray.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true
          });
          new Float32Array(vbuf.getMappedRange()).set(cubeVertexArray);
          vbuf.unmap();
          drawCount = cubeVertexCount;
          return;
        }
        if (kind === "plane") {
          const built2 = buildPlanePacked({ width: 2, depth: 2, subdivisionsWidth: 1, subdivisionsDepth: 1 });
          vbuf = device.createBuffer({
            size: built2.array.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true
          });
          new Float32Array(vbuf.getMappedRange()).set(built2.array);
          vbuf.unmap();
          drawCount = built2.vertexCount;
          mat4.rotateX(model, Math.PI / 2, model);
          return;
        }
        const built = buildSpherePacked({ radius: 1, subdivisionsAxis: 24, subdivisionsHeight: 12 });
        vbuf = device.createBuffer({
          size: built.array.byteLength,
          usage: GPUBufferUsage.VERTEX,
          mappedAtCreation: true
        });
        new Float32Array(vbuf.getMappedRange()).set(built.array);
        vbuf.unmap();
        drawCount = built.vertexCount;
      }, ensureSurface = function() {
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const cssW = canvas.clientWidth || 600;
        const cssH = canvas.clientHeight || 600;
        const pxW = Math.max(1, Math.floor(cssW * dpr));
        const pxH = Math.max(1, Math.floor(cssH * dpr));
        if (canvas.width !== pxW || canvas.height !== pxH) {
          canvas.width = pxW;
          canvas.height = pxH;
          ctx.configure({ device, format, alphaMode: "premultiplied", usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST });
        }
        if (!depthTex || dw !== pxW || dh !== pxH) {
          depthTex?.destroy();
          depthTex = device.createTexture({
            size: [pxW, pxH],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
          });
          dw = pxW;
          dh = pxH;
          renderPassDescriptor.depthStencilAttachment.view = depthTex.createView();
        }
      };
      if (!("gpu" in navigator)) {
        title.textContent = "WebGPU not supported";
        return;
      }
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        title.textContent = "No WebGPU adapter";
        return;
      }
      const device = await adapter.requestDevice();
      const ctx = canvas.getContext("webgpu");
      const format = navigator.gpu.getPreferredCanvasFormat();
      ctx.configure({
        device,
        format,
        alphaMode: "premultiplied",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST
        // <-- add this
      });
      const cubeWGSL = await loadWGSL("cameras/cube.wgsl");
      const shaderModule = device.createShaderModule({ code: cubeWGSL });
      const bgWGSL = await loadWGSL("cameras/bg_fullscreen.wgsl");
      const bgModule = device.createShaderModule({ code: bgWGSL });
      const sceneBGL = device.createBindGroupLayout({
        entries: [
          { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } },
          { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: "filtering" } },
          { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } }
        ]
      });
      const scenePL = device.createPipelineLayout({ bindGroupLayouts: [sceneBGL] });
      const pipelineBack = device.createRenderPipeline({
        layout: scenePL,
        vertex: {
          module: shaderModule,
          buffers: [{
            arrayStride: cubeVertexSize,
            attributes: [
              { shaderLocation: 0, offset: cubePositionOffset, format: "float32x4" },
              { shaderLocation: 1, offset: cubeUVOffset, format: "float32x2" }
            ]
          }]
        },
        fragment: { module: shaderModule, targets: [{ format }] },
        primitive: { topology: "triangle-list", cullMode: "back" },
        depthStencil: { depthWriteEnabled: true, depthCompare: "less", format: "depth24plus" }
      });
      const pipelineDouble = device.createRenderPipeline({
        layout: scenePL,
        vertex: {
          module: shaderModule,
          buffers: [{
            arrayStride: cubeVertexSize,
            attributes: [
              { shaderLocation: 0, offset: cubePositionOffset, format: "float32x4" },
              { shaderLocation: 1, offset: cubeUVOffset, format: "float32x2" }
            ]
          }]
        },
        fragment: { module: shaderModule, targets: [{ format }] },
        primitive: { topology: "triangle-list", cullMode: "none" },
        // render both sides
        depthStencil: { depthWriteEnabled: true, depthCompare: "less", format: "depth24plus" }
      });
      const pipelineBG = device.createRenderPipeline({
        layout: scenePL,
        vertex: { module: bgModule },
        fragment: { module: bgModule, targets: [{ format }] },
        primitive: { topology: "triangle-list" },
        depthStencil: { format: "depth24plus", depthWriteEnabled: false, depthCompare: "always" }
        // <-- add this
      });
      const colorAttachments = [{
        view: void 0,
        clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
        loadOp: "clear",
        storeOp: "store"
      }];
      const renderPassDescriptor = {
        colorAttachments,
        depthStencilAttachment: {
          view: void 0,
          depthClearValue: 1,
          depthLoadOp: "clear",
          depthStoreOp: "store"
        }
      };
      const uniformBuffer = device.createBuffer({
        size: 4 * 16,
        // 1 mat4 for MVP
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });
      let shapeTexture = device.createTexture({
        size: [1, 1, 1],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      });
      let shapeW = 1, shapeH = 1;
      let bgTexture = device.createTexture({
        size: [1, 1, 1],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      });
      let bgW = 1, bgH = 1;
      let shapeBindGroup = device.createBindGroup({
        layout: sceneBGL,
        entries: [
          { binding: 0, resource: { buffer: uniformBuffer } },
          { binding: 1, resource: sampler },
          { binding: 2, resource: shapeTexture.createView() }
        ]
      });
      let bgBindGroup = device.createBindGroup({
        layout: sceneBGL,
        entries: [
          { binding: 0, resource: { buffer: uniformBuffer } },
          // unused by bg shader
          { binding: 1, resource: sampler },
          { binding: 2, resource: bgTexture.createView() }
        ]
      });
      try {
        const img = new Image();
        img.decoding = "async";
        img.src = imageUrl;
        await img.decode();
        shapeW = img.naturalWidth;
        shapeH = img.naturalHeight;
        shapeTexture.destroy();
        shapeTexture = device.createTexture({
          size: [shapeW, shapeH, 1],
          format: "rgba8unorm",
          usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });
        device.queue.copyExternalImageToTexture(
          { source: img },
          { texture: shapeTexture },
          [shapeW, shapeH]
        );
        shapeBindGroup = device.createBindGroup({
          layout: sceneBGL,
          entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: sampler },
            { binding: 2, resource: shapeTexture.createView() }
          ]
        });
      } catch {
        writeSolid(shapeTexture, 255, 255, 255, 255);
      }
      writeSolid(bgTexture, 64, 64, 64, 255);
      async function setTextureFromAny(target, source) {
        let bmp = null;
        let w = 0, h = 0;
        if (typeof source === "string") {
          const img = new Image();
          img.decoding = "async";
          img.src = source;
          await img.decode();
          w = img.naturalWidth;
          h = img.naturalHeight;
          bmp = await createImageBitmap(img);
        } else if (source instanceof Blob) {
          const url = URL.createObjectURL(source);
          try {
            const img = new Image();
            img.decoding = "async";
            img.src = url;
            await img.decode();
            w = img.naturalWidth;
            h = img.naturalHeight;
            bmp = await createImageBitmap(img);
          } finally {
            URL.revokeObjectURL(url);
          }
        } else if ("close" in source && typeof source.close === "function") {
          bmp = source;
          w = bmp.width;
          h = bmp.height;
        } else {
          const img = source;
          if (!img.complete) await img.decode();
          w = img.naturalWidth;
          h = img.naturalHeight;
          bmp = await createImageBitmap(img);
        }
        try {
          if (target === "shape") {
            if (w !== shapeW || h !== shapeH) {
              shapeTexture.destroy();
              shapeTexture = device.createTexture({
                size: [w, h, 1],
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
              });
              shapeW = w;
              shapeH = h;
              shapeBindGroup = device.createBindGroup({
                layout: sceneBGL,
                entries: [
                  { binding: 0, resource: { buffer: uniformBuffer } },
                  { binding: 1, resource: sampler },
                  { binding: 2, resource: shapeTexture.createView() }
                ]
              });
            }
            device.queue.copyExternalImageToTexture({ source: bmp }, { texture: shapeTexture }, [w, h]);
          } else {
            if (w !== bgW || h !== bgH) {
              bgTexture.destroy();
              bgTexture = device.createTexture({
                size: [w, h, 1],
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
              });
              bgW = w;
              bgH = h;
              bgBindGroup = device.createBindGroup({
                layout: sceneBGL,
                entries: [
                  { binding: 0, resource: { buffer: uniformBuffer } },
                  { binding: 1, resource: sampler },
                  { binding: 2, resource: bgTexture.createView() }
                ]
              });
            }
            device.queue.copyExternalImageToTexture({ source: bmp }, { texture: bgTexture }, [w, h]);
          }
        } finally {
          if (bmp && bmp.close) bmp.close();
        }
      }
      async function setSceneImage(src) {
        return setTextureFromAny("shape", src);
      }
      async function setBackgroundImage(src) {
        return setTextureFromAny("bg", src);
      }
      root.setTexture = (src) => setSceneImage(src);
      root.setBackground = (src) => setBackgroundImage(src);
      root.addEventListener("basicScene:setTexture", (e) => {
        const src = e?.detail?.src;
        if (src) setSceneImage(src);
      });
      root.addEventListener("basicScene:setBackground", (e) => {
        const src = e?.detail?.src;
        if (src) setBackgroundImage(src);
      });
      let vbuf = null;
      let drawCount = 0;
      let activeShape = "cube";
      const proj = mat4.create();
      const mvp = mat4.create();
      const vp = mat4.create();
      const model = mat4.create();
      const setActiveShapeBtn = (k) => {
        cubeBtn.classList.toggle("active", k === "cube");
        planeBtn.classList.toggle("active", k === "plane");
        sphereBtn.classList.toggle("active", k === "sphere");
      };
      cubeBtn.onclick = () => {
        setGeometry("cube");
        setActiveShapeBtn("cube");
      };
      planeBtn.onclick = () => {
        setGeometry("plane");
        setActiveShapeBtn("plane");
      };
      sphereBtn.onclick = () => {
        setGeometry("sphere");
        setActiveShapeBtn("sphere");
      };
      let doubleSided = true;
      doubleBtn.classList.toggle("active", doubleSided);
      doubleBtn.onclick = () => {
        doubleSided = !doubleSided;
        doubleBtn.classList.toggle("active", doubleSided);
      };
      setGeometry("cube");
      setActiveShapeBtn("cube");
      let depthTex = null;
      let dw = 0, dh = 0;
      window.addEventListener("resize", ensureSurface, { passive: true });
      let lastMS = performance.now();
      const frame = () => {
        ensureSurface();
        const now = performance.now();
        const dt = (now - lastMS) / 1e3;
        lastMS = now;
        const aspect = Math.max(1, canvas.width) / Math.max(1, canvas.height);
        mat4.perspective(2 * Math.PI / 5, aspect, 0.1, 100, proj);
        const view = cameras[activeCam].update(dt, input());
        mat4.multiply(proj, view, vp);
        mat4.multiply(vp, model, mvp);
        device.queue.writeBuffer(
          uniformBuffer,
          0,
          mvp.buffer,
          mvp.byteOffset,
          mvp.byteLength
        );
        colorAttachments[0].view = ctx.getCurrentTexture().createView();
        const enc = device.createCommandEncoder();
        const pass = enc.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(pipelineBG);
        pass.setBindGroup(0, bgBindGroup);
        pass.draw(3);
        const pipelineToUse = activeShape === "plane" && doubleSided ? pipelineDouble : pipelineBack;
        pass.setPipeline(pipelineToUse);
        pass.setBindGroup(0, shapeBindGroup);
        pass.setVertexBuffer(0, vbuf);
        pass.draw(drawCount);
        pass.end();
        device.queue.submit([enc.finish()]);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    } catch (e) {
      title.textContent = e?.message ?? String(e);
      console.error(e);
    }
  });
  return root;
}
export {
  createBasicScene
};
//# sourceMappingURL=basicScene.js.map
