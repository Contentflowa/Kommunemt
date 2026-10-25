/* KommuNemt – samtykke til Google Analytics.
   Analytics indlæses KUN efter accept. Valget gemmes i localStorage (nøgle "kn-consent"). */
(function () {
  var GA_ID = "G-VHBZ69RS8T";
  var KEY = "kn-consent";
  var T = {
    da: { t: "Vi bruger Google Analytics til at se, hvilke sider der bliver besøgt. Det sætter cookies og sender data til Google (USA). Det sker kun, hvis du accepterer.", a: "Accepter", d: "Afvis", p: "Privatlivspolitik" },
    en: { t: "We use Google Analytics to see which pages are visited. This sets cookies and sends data to Google (USA). It only happens if you accept.", a: "Accept", d: "Decline", p: "Privacy policy" },
    uk: { t: "Ми використовуємо Google Analytics, щоб бачити, які сторінки відвідують. Це встановлює cookie та надсилає дані до Google (США). Це відбувається лише за вашої згоди.", a: "Прийняти", d: "Відхилити", p: "Політика конфіденційності" },
    de: { t: "Wir nutzen Google Analytics, um zu sehen, welche Seiten besucht werden. Dabei werden Cookies gesetzt und Daten an Google (USA) gesendet. Das geschieht nur, wenn Sie zustimmen.", a: "Akzeptieren", d: "Ablehnen", p: "Datenschutz" },
    tr: { t: "Hangi sayfaların ziyaret edildiğini görmek için Google Analytics kullanıyoruz. Bu, çerez bırakır ve verileri Google’a (ABD) gönderir. Yalnızca kabul ederseniz gerçekleşir.", a: "Kabul et", d: "Reddet", p: "Gizlilik" }
  };

  function lang() {
    var l = "";
    try { l = localStorage.getItem("kn-lang") || ""; } catch (e) {}
    if (!l) l = (document.documentElement.lang || "da").slice(0, 2).toLowerCase();
    return T[l] ? l : "da";
  }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (window.__knGA) return;
    window.__knGA = true;
    window["ga-disable-" + GA_ID] = false;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }
  function stopGA() {
    window["ga-disable-" + GA_ID] = true;
    var names = document.cookie.split(";").map(function (c) { return c.split("=")[0].trim(); });
    names.forEach(function (n) {
      if (n === "_ga" || n.indexOf("_ga_") === 0 || n === "_gid") {
        document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=." + location.hostname;
      }
    });
  }

  function close() { var b = document.getElementById("kn-consent"); if (b) b.remove(); }

  function show() {
    close();
    var t = T[lang()];
    var box = document.createElement("div");
    box.id = "kn-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Cookies");
    box.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:560px;margin:0 auto;background:#fff;color:#1e293b;border:1px solid #cbd5e1;border-radius:14px;padding:16px 18px;box-shadow:0 8px 30px rgba(0,0,0,.18);font:14px/1.5 Inter,-apple-system,BlinkMacSystemFont,sans-serif";
    var p = document.createElement("p");
    p.style.cssText = "margin:0 0 12px";
    p.textContent = t.t + " ";
    var a = document.createElement("a");
    a.href = "/privacy/";
    a.textContent = t.p;
    a.style.cssText = "color:#2563eb";
    p.appendChild(a);
    var row = document.createElement("div");
    row.style.cssText = "display:flex;gap:10px";
    var btn = "flex:1;padding:10px 14px;border-radius:10px;border:1.5px solid #1e293b;background:#fff;color:#1e293b;font:600 14px Inter,sans-serif;cursor:pointer";
    var no = document.createElement("button");
    no.type = "button"; no.textContent = t.d; no.style.cssText = btn;
    no.onclick = function () { set("no"); stopGA(); close(); };
    var yes = document.createElement("button");
    yes.type = "button"; yes.textContent = t.a; yes.style.cssText = btn;
    yes.onclick = function () { set("yes"); loadGA(); close(); };
    row.appendChild(no); row.appendChild(yes);
    box.appendChild(p); box.appendChild(row);
    document.body.appendChild(box);
  }

  window.knConsentOpen = show; /* til et "Cookie-indstillinger"-link i sidefoden */

  function init() {
    var v = get();
    if (v === "yes") loadGA();
    else if (v !== "no") show();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
