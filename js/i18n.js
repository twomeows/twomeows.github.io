/* TwoMeows — перемикач мов (UA / SK / EN) */
(function () {
  "use strict";

  const STORAGE_KEY = "twomeows_lang";
  const DEFAULT_LANG = "ua";
  const HTML_LANG = { ua: "uk", sk: "sk", en: "en" };
  const cache = {};

  async function loadLang(lang) {
    if (cache[lang]) return cache[lang];
    const res = await fetch("lang/" + lang + ".json");
    if (!res.ok) throw new Error("Не вдалося завантажити мову: " + lang);
    cache[lang] = await res.json();
    return cache[lang];
  }

  function apply(dict) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    if (dict["meta.title"]) document.title = dict["meta.title"];
  }

  async function setLang(lang) {
    try {
      const dict = await loadLang(lang);
      apply(dict);
      document.documentElement.lang = HTML_LANG[lang] || lang;
      localStorage.setItem(STORAGE_KEY, lang);
      document.querySelectorAll(".lang-switch button").forEach((b) => {
        b.classList.toggle("active", b.dataset.lang === lang);
      });
    } catch (err) {
      console.error(err);
    }
  }

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  const saved = localStorage.getItem(STORAGE_KEY);
  // українська вже в HTML за замовчуванням — довантажуємо лише іншу мову
  if (saved && saved !== DEFAULT_LANG) setLang(saved);
})();
