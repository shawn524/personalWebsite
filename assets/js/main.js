$(document).ready(function() {
  // Fade in div elements on page load
  $('.divfade').each(function(i) {
    $(this).fadeOut(0).delay(1000*i).fadeIn(1850);
  });

  const canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d");

  function rgb(v) {
    return `rgb(${Math.round(v.x * 0xFF)},${Math.round(v.y * 0xFF)},${Math.round(v.z * 0xFF)})`;
  }

  function add(v, k) {
    v.x += k;
    v.y += k;
    v.z += k;
    v.w += k;
    return v;
  }

  function interpolate(a, b, p) {
    return a + (b - a) * p;
  }

  function interpolate4(a, b, p, r = {
    x: 0,
    y: 0,
    z: 0,
    w: 0
  }) {
    r.x = interpolate(a.x, b.x, p);
    r.y = interpolate(a.y, b.y, p);
    r.z = interpolate(a.z, b.z, p);
    r.w = interpolate(a.w, b.w, p);
    return r;
  }

  function gradient(colors, p) {

    for (let index = 1; index < colors.length; index++) {

      const prev = colors[index - 1],
        curr = colors[index];

      if (prev.w <= p && curr.w >= p) {
        const gp = (p - prev.w) / (curr.w - prev.w);
        return interpolate4(prev, curr, gp);
      }

    }

    return {
      x: 0,
      y: 0,
      z: 0,
      w: 0
    };
  }

  function lcg(value, multiplier = 1103515245, increment = 12345, modulus = Math.pow(2, 31)) {
    return ((value * multiplier) + increment) % modulus;
  }

  const ARMS = 3,
    STOPS = 2500,
    REVOLUTIONS = 2.61,
    ARM_THETA = Math.PI * 2 / ARMS,
    MODULUS = Math.pow(2, 31),
    RADIUS = 400,
    INNER_RADIUS = 6,
    SPARSE = 0.5,
    DISPERSION = 0.4; // 0 - more dispersion, 1 - less dispersion

  function render(now) {

    const centerX = canvas.width * 0.5,
      centerY = canvas.height * 0.5;

    const grd = context.createRadialGradient(centerX, centerY, INNER_RADIUS, centerX, centerY, RADIUS);
    grd.addColorStop(1.0, "rgba(0,0,0,0)");
    grd.addColorStop(0.5, "rgba(25,128,255,0.15)");
    grd.addColorStop(0.2, "rgba(255,192,25,0.25)");
    grd.addColorStop(0.0, "rgba(255,255,255,1.0)");

    const grd2 = context.createRadialGradient(centerX, centerY, 16, centerX, centerY, RADIUS);
    grd.addColorStop(1.0, "rgba(0,64,128,0.1)");
    grd.addColorStop(0.7, "rgba(25,128,255,0.1)");
    grd.addColorStop(0.6, "rgba(0,192,255,0.125)");
    grd.addColorStop(0.0, "rgba(255,255,255,1.0)");

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.fillStyle = grd;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();

    let v = 0;
    const t = (now / -60000);
    context.save();
    for (let arm = 0; arm < ARMS; arm++) {

      for (let stop = 0; stop < STOPS; stop++) {

        v = lcg(v);
        const progress = (stop / STOPS),
          iprogress = 1.0 - progress,
          c = 1.0 + (iprogress - DISPERSION),
          r = (v / MODULUS),
          cr = ((r - 0.5) * 2),
          a = (progress * Math.PI * 2 * REVOLUTIONS) + (ARM_THETA * arm),
          b = t + a + Math.PI * SPARSE * c * cr,
          d = (Math.sqrt(progress)) * RADIUS,
          x = centerX + (Math.cos(b) * d),
          y = centerY + (Math.sin(b) * d),
          s = ((r - 0.5) * 2) + Math.pow(1.125, iprogress * 8);

        context.save();
        context.globalAlpha = (Math.sin((r + progress + t) * Math.PI * 2) + 1) * 0.5;
        context.translate(x, y);
        context.fillStyle = rgb(add(gradient([{
          x: 0.0,
          y: 0.25,
          z: 0.75,
          w: 0.0
        }, {
          x: 0.1,
          y: 0.5,
          z: 1.0,
          w: 0.5
        }, {
          x: 1.0,
          y: 0.75,
          z: 0.1,
          w: 0.8
        }, {
          x: 1.0,
          y: 1.0,
          z: 1.0,
          w: 1.0
        }], iprogress), r * 0.15));
        context.fillRect(-s * 0.5, -s * 0.5, s, s);
        context.restore();

      }

    }
    context.restore();

    context.save();
    context.globalCompositeOperation = "lighter";
    context.fillStyle = grd2;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();

    window.requestAnimationFrame(render);

  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);

  resize();
  render();
})
