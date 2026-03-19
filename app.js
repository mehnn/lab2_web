


// ============================================================
// 1. HELPERS
// ============================================================

const $ = (sel) => document.querySelector(sel);

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ============================================================
// 2. MODELS
// ============================================================

// ------------------------------------------------------------
// UserModel — реєстрація, вхід, сесія
// ------------------------------------------------------------
class UserModel {
  register({ name, email, gender, dob, password }) {
    const users = load("users", []);
    if (!name || !email || !password) throw new Error("Заповни ім'я, email та пароль");
    if (users.some(u => u.email === email)) throw new Error("Користувач з таким email вже існує");
    users.push({ name, email, gender, dob, password });
    save("users", users);
  }

  login({ email, password }) {
    const users = load("users", []);
    const u = users.find(x => x.email === email && x.password === password);
    if (!u) throw new Error("Невірний email або пароль");
    save("session", { email: u.email });
  }

  logout() {
    localStorage.removeItem("session");
    location.href = "index.html";
  }

  currentUser() {
    const sess = load("session", null);
    if (!sess) return null;
    const users = load("users", []);
    return users.find(u => u.email === sess.email) ?? null;
  }
}

// ------------------------------------------------------------
// WordModel — словниковий каталог
// ------------------------------------------------------------
class WordModel {
  constructor() {
    this.catalog = {
      A1: {
        Everyday: [
          { en: "book", ua: "книга" }, { en: "sun", ua: "сонце" }, { en: "water", ua: "вода" },
          { en: "house", ua: "будинок" }, { en: "friend", ua: "друг" }, { en: "school", ua: "школа" },
          { en: "phone", ua: "телефон" }, { en: "time", ua: "час" }, { en: "day", ua: "день" },
          { en: "night", ua: "ніч" }, { en: "family", ua: "родина" }, { en: "city", ua: "місто" },
          { en: "street", ua: "вулиця" }, { en: "door", ua: "двері" }, { en: "window", ua: "вікно" },
          { en: "table", ua: "стіл" }, { en: "chair", ua: "стілець" }, { en: "pen", ua: "ручка" },
          { en: "bag", ua: "сумка" }, { en: "key", ua: "ключ" }, { en: "name", ua: "ім'я" },
          { en: "number", ua: "номер" }, { en: "music", ua: "музика" }, { en: "picture", ua: "картинка" }
        ],
        Food: [
          { en: "apple", ua: "яблуко" }, { en: "banana", ua: "банан" }, { en: "bread", ua: "хліб" },
          { en: "milk", ua: "молоко" }, { en: "cheese", ua: "сир" }, { en: "tea", ua: "чай" },
          { en: "coffee", ua: "кава" }, { en: "salt", ua: "сіль" }, { en: "sugar", ua: "цукор" },
          { en: "orange", ua: "апельсин" }, { en: "egg", ua: "яйце" }, { en: "meat", ua: "м'ясо" },
          { en: "fish", ua: "риба" }, { en: "rice", ua: "рис" }, { en: "soup", ua: "суп" },
          { en: "cake", ua: "торт" }, { en: "chocolate", ua: "шоколад" }, { en: "carrot", ua: "морква" }
        ],
        Travel: [
          { en: "ticket", ua: "квиток" }, { en: "train", ua: "поїзд" }, { en: "bus", ua: "автобус" },
          { en: "map", ua: "карта" }, { en: "hotel", ua: "готель" }, { en: "airport", ua: "аеропорт" },
          { en: "station", ua: "станція" }, { en: "passport", ua: "паспорт" }, { en: "luggage", ua: "багаж" },
          { en: "left", ua: "ліворуч" }, { en: "right", ua: "праворуч" }, { en: "near", ua: "поруч" },
          { en: "far", ua: "далеко" }, { en: "road", ua: "дорога" }, { en: "stop", ua: "зупинка" }
        ],
        Work: [
          { en: "job", ua: "робота" }, { en: "task", ua: "завдання" }, { en: "team", ua: "команда" },
          { en: "boss", ua: "керівник" }, { en: "office", ua: "офіс" }, { en: "meeting", ua: "зустріч" },
          { en: "plan", ua: "план" }, { en: "email", ua: "електронний лист" }, { en: "call", ua: "дзвінок" },
          { en: "break", ua: "перерва" }, { en: "today", ua: "сьогодні" }, { en: "tomorrow", ua: "завтра" }
        ]
      },
      A2: {
        Everyday: [
          { en: "weather", ua: "погода" }, { en: "message", ua: "повідомлення" }, { en: "weekend", ua: "вихідні" },
          { en: "decision", ua: "рішення" }, { en: "problem", ua: "проблема" }, { en: "idea", ua: "ідея" },
          { en: "choice", ua: "вибір" }, { en: "reason", ua: "причина" }, { en: "history", ua: "історія" },
          { en: "important", ua: "важливий" }, { en: "usually", ua: "зазвичай" }, { en: "sometimes", ua: "іноді" },
          { en: "quickly", ua: "швидко" }, { en: "comfortable", ua: "зручний" }, { en: "successful", ua: "успішний" }
        ],
        Food: [
          { en: "recipe", ua: "рецепт" }, { en: "breakfast", ua: "сніданок" }, { en: "delicious", ua: "смачний" },
          { en: "healthy", ua: "корисний" }, { en: "ingredients", ua: "інгредієнти" }, { en: "dessert", ua: "десерт" },
          { en: "spicy", ua: "гострий" }, { en: "sweet", ua: "солодкий" }, { en: "hungry", ua: "голодний" },
          { en: "thirsty", ua: "спраглий" }, { en: "menu", ua: "меню" }, { en: "order", ua: "замовляти" }
        ],
        Travel: [
          { en: "direction", ua: "напрямок" }, { en: "journey", ua: "подорож" }, { en: "reservation", ua: "бронювання" },
          { en: "tourist", ua: "турист" }, { en: "guide", ua: "гід" }, { en: "museum", ua: "музей" },
          { en: "bridge", ua: "міст" }, { en: "square", ua: "площа" }, { en: "crowded", ua: "людний" },
          { en: "safe", ua: "безпечний" }, { en: "dangerous", ua: "небезпечний" }
        ],
        Work: [
          { en: "project", ua: "проєкт" }, { en: "deadline", ua: "дедлайн" }, { en: "report", ua: "звіт" },
          { en: "result", ua: "результат" }, { en: "improve", ua: "покращувати" }, { en: "discuss", ua: "обговорювати" },
          { en: "agree", ua: "погоджуватися" }, { en: "explain", ua: "пояснювати" }, { en: "schedule", ua: "розклад" },
          { en: "experience", ua: "досвід" }, { en: "priority", ua: "пріоритет" }
        ]
      },
      B1: {
        Everyday: [
          { en: "relationship", ua: "стосунки" }, { en: "opportunity", ua: "можливість" }, { en: "confidence", ua: "впевненість" },
          { en: "challenge", ua: "виклик" }, { en: "achievement", ua: "досягнення" }, { en: "responsibility", ua: "відповідальність" },
          { en: "environment", ua: "середовище" }, { en: "influence", ua: "вплив" }, { en: "recommend", ua: "рекомендувати" },
          { en: "consider", ua: "розглядати" }, { en: "manage", ua: "керувати" }, { en: "nevertheless", ua: "проте" }
        ],
        Food: [
          { en: "nutrition", ua: "харчування" }, { en: "portion", ua: "порція" }, { en: "allergy", ua: "алергія" },
          { en: "balance", ua: "баланс" }, { en: "organic", ua: "органічний" }, { en: "freshness", ua: "свіжість" },
          { en: "texture", ua: "текстура" }, { en: "consume", ua: "споживати" }, { en: "preserve", ua: "зберігати" }
        ],
        Travel: [
          { en: "accommodation", ua: "житло" }, { en: "itinerary", ua: "маршрут" }, { en: "sightseeing", ua: "огляд визначних місць" },
          { en: "destination", ua: "пункт призначення" }, { en: "transportation", ua: "транспорт" }, { en: "unexpected", ua: "неочікуваний" },
          { en: "postpone", ua: "відкласти" }, { en: "cancel", ua: "скасувати" }, { en: "explore", ua: "досліджувати" }
        ],
        Work: [
          { en: "performance", ua: "ефективність" }, { en: "prioritize", ua: "розставляти пріоритети" }, { en: "collaboration", ua: "співпраця" },
          { en: "feedback", ua: "зворотний зв'язок" }, { en: "negotiate", ua: "домовлятися" }, { en: "estimate", ua: "оцінювати" },
          { en: "requirement", ua: "вимога" }, { en: "stakeholder", ua: "зацікавлена сторона" }, { en: "progress", ua: "прогрес" }
        ]
      }
    };
  }

  getLevels() {
    return Object.keys(this.catalog);
  }

  getTopics(level) {
    return Object.keys(this.catalog[level] ?? {});
  }

  getWords(level, topic) {
    return (this.catalog[level]?.[topic] ?? []).map(w => ({
      ...w,
      id: `${level}|${topic}|${w.en.toLowerCase()}`
    }));
  }

  allWordsCount() {
    let total = 0;
    for (const level of this.getLevels())
      for (const topic of this.getTopics(level))
        total += this.catalog[level][topic].length;
    return total;
  }
}

// ------------------------------------------------------------
// ProgressModel — прогрес користувача (known + quiz)
// ------------------------------------------------------------
class ProgressModel {
  _key(email) { return `progress::${email}`; }

  get(email) {
    return load(this._key(email), { known: {}, quiz: { correct: 0, total: 0 } });
  }

  set(email, progress) {
    save(this._key(email), progress);
  }

  reset(email) {
    this.set(email, { known: {}, quiz: { correct: 0, total: 0 } });
  }

  markKnown(email, wordId, isKnown) {
    const p = this.get(email);
    if (isKnown) p.known[wordId] = true;
    else delete p.known[wordId];
    this.set(email, p);
  }

  recordQuizAnswer(email, isCorrect) {
    const p = this.get(email);
    p.quiz.total += 1;
    if (isCorrect) p.quiz.correct += 1;
    this.set(email, p);
  }
}


// ============================================================
// 3. VIEWS
// ============================================================

// ------------------------------------------------------------
// AuthView — форми входу та реєстрації (index.html)
// ------------------------------------------------------------
class AuthView {
  constructor() {
    this.loginBox      = $("#loginBox");
    this.registerBox   = $("#registerBox");
    this.showLoginBtn  = $("#showLoginBtn");
    this.showRegBtn    = $("#showRegisterBtn");
    this.loginForm     = $("#loginForm");
    this.regForm       = $("#regForm");
  }

  setMode(mode) {
    const isLogin = mode === "login";
    this.loginBox.classList.toggle("d-none", !isLogin);
    this.registerBox.classList.toggle("d-none", isLogin);
    this.showLoginBtn.classList.toggle("btn-brand", isLogin);
    this.showLoginBtn.classList.toggle("btn-soft",  !isLogin);
    this.showRegBtn.classList.toggle("btn-brand",   !isLogin);
    this.showRegBtn.classList.toggle("btn-soft",    isLogin);
  }

  getLoginData() {
    return {
      email:    $("#loginEmail").value.trim().toLowerCase(),
      password: $("#loginPass").value
    };
  }

  getRegisterData() {
    return {
      name:     $("#regName").value.trim(),
      email:    $("#regEmail").value.trim().toLowerCase(),
      gender:   $("input[name=gender]:checked")?.value ?? "",
      dob:      $("#regDob").value,
      password: $("#regPass").value
    };
  }

  showError(msg) { alert("❌ " + msg); }
}

// ------------------------------------------------------------
// StudyView — картка слова + таблиця + статистика (app.html)
// ------------------------------------------------------------
class StudyView {
  constructor() {
    this.levelSel       = $("#levelSelect");
    this.topicSel       = $("#topicSelect");
    this.statsBadge     = $("#statsBadge");
    this.progressBar    = $("#progressBar");
    this.progressText   = $("#progressText");
    this.cardIndexText  = $("#cardIndexText");
    this.cardTopicBadge = $("#cardTopicBadge");
    this.cardEn         = $("#cardEn");
    this.cardUa         = $("#cardUa");
    this.cardUaWrap     = $("#cardUaWrap");
    this.flipBtn        = $("#flipBtn");
    this.prevCardBtn    = $("#prevCardBtn");
    this.nextCardBtn    = $("#nextCardBtn");
    this.knowBtn        = $("#knowBtn");
    this.dontKnowBtn    = $("#dontKnowBtn");
    this.wordsListTbody = $("#wordsListTbody");
    this.listCountBadge = $("#listCountBadge");
    this.tabStudy       = $("#tabStudy");
    this.tabQuiz        = $("#tabQuiz");
    this.studySection   = $("#studySection");
    this.quizSection    = $("#quizSection");
  }

  fillLevels(levels, current) {
    this.levelSel.innerHTML = "";
    levels.forEach(l => {
      const opt = document.createElement("option");
      opt.value = l; opt.textContent = l;
      this.levelSel.appendChild(opt);
    });
    this.levelSel.value = current;
  }

  fillTopics(topics, current) {
    this.topicSel.innerHTML = "";
    topics.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t; opt.textContent = t;
      this.topicSel.appendChild(opt);
    });
    this.topicSel.value = current;
  }

  renderStats(knownCount, total) {
    const pct = total ? Math.round((knownCount / total) * 100) : 0;
    this.statsBadge.textContent  = `${knownCount}/${total} вивчено`;
    this.progressBar.style.width = `${pct}%`;
    this.progressText.textContent = `Прогрес: ${pct}%`;
  }

  renderList(words, knownMap) {
    this.listCountBadge.textContent = `${words.length} слів`;
    this.wordsListTbody.innerHTML = "";
    words.forEach(w => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="fw-semibold">${escapeHtml(w.en)}</td>
        <td>${escapeHtml(w.ua)}</td>
        <td>${knownMap[w.id] ? "✅ Вивчено" : "—"}</td>
      `;
      this.wordsListTbody.appendChild(tr);
    });
  }

  renderCard(word, index, total, level, topic, isKnown) {
    this.cardIndexText.textContent  = `${index + 1}/${total}`;
    this.cardTopicBadge.textContent = `${level} • ${topic}`;
    this.cardEn.textContent = word.en;
    this.cardUa.textContent = word.ua;
    this.cardUaWrap.classList.add("d-none");
    this.flipBtn.textContent   = "Показати переклад";
    this.prevCardBtn.disabled  = index === 0;
    this.nextCardBtn.disabled  = index === total - 1;
  }

  toggleTranslation() {
    const hidden = this.cardUaWrap.classList.contains("d-none");
    this.cardUaWrap.classList.toggle("d-none", !hidden);
    this.flipBtn.textContent = hidden ? "Сховати переклад" : "Показати переклад";
  }

  setMode(mode) {
    const isStudy = mode === "study";
    this.tabStudy.classList.toggle("active", isStudy);
    this.tabQuiz.classList.toggle("active", !isStudy);
    this.studySection.classList.toggle("d-none", !isStudy);
    this.quizSection.classList.toggle("d-none", isStudy);
  }
}

// ------------------------------------------------------------
// QuizView — вікторина (app.html)
// ------------------------------------------------------------
class QuizView {
  constructor() {
    this.quizWord         = $("#quizWord");
    this.quizOptions      = $("#quizOptions");
    this.quizScore        = $("#quizScore");
    this.quizTotal        = $("#quizTotal");
    this.quizFeedback     = $("#quizFeedback");
    this.nextQuestionBtn  = $("#nextQuestionBtn");
    this.startQuizBtn     = $("#startQuizBtn");
    this.onlyUnknownBtn   = $("#quizOnlyUnknownBtn");
  }

  renderHUD(score, total) {
    this.quizScore.textContent = String(score);
    this.quizTotal.textContent = String(total);
  }

  renderQuestion(question, onChoose) {
    this.quizFeedback.textContent  = "Натисни варіант відповіді.";
    this.nextQuestionBtn.disabled  = true;
    this.quizWord.textContent      = question.word.en;
    this.quizOptions.innerHTML     = "";

    question.options.forEach(opt => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6";
      col.innerHTML = `
        <button type="button" class="btn btn-soft w-100 py-3 text-start quiz-opt">
          ${escapeHtml(opt)}
        </button>
      `;
      col.querySelector("button").addEventListener("click", () => onChoose(opt));
      this.quizOptions.appendChild(col);
    });
  }

  renderFinished(score, total) {
    this.quizWord.textContent  = "Готово!";
    this.quizOptions.innerHTML = `
      <div class="col-12">
        <div class="alert alert-success mb-0">
          ✅ Вікторина завершена. Рахунок: <b>${score}</b> / <b>${total}</b>
        </div>
      </div>
    `;
  }

  highlightAnswer(correct, chosen) {
    this.quizOptions.querySelectorAll("button.quiz-opt").forEach(btn => {
      const txt = btn.textContent.trim();
      if (txt === correct) btn.className = "btn btn-accent w-100 py-3 text-start quiz-opt";
      if (txt === chosen && chosen !== correct) btn.className = "btn btn-danger w-100 py-3 text-start quiz-opt";
      btn.disabled = true;
    });
  }

  showFeedback(isCorrect, correct) {
    this.quizFeedback.textContent = isCorrect
      ? "✅ Правильно!"
      : `❌ Ні. Правильно: ${correct}`;
    this.nextQuestionBtn.disabled = isCorrect;
  }

  setOnlyUnknownLabel(isUnknown) {
    this.onlyUnknownBtn.textContent = isUnknown ? "Тільки невивчені ✅" : "Тільки невивчені";
  }
}

// ------------------------------------------------------------
// ProfileView — сторінка профілю (profile.html)
// ------------------------------------------------------------
class ProfileView {
  render(user, known, total, quizCorrect, quizTotal) {
    const pct = total ? Math.round((known / total) * 100) : 0;
    const acc = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0;

    if ($("#pName"))   $("#pName").textContent   = user.name   || "-";
    if ($("#pEmail"))  $("#pEmail").textContent  = user.email  || "-";
    if ($("#pGender")) $("#pGender").textContent = user.gender || "-";
    if ($("#pDob"))    $("#pDob").textContent    = user.dob    || "-";

    if ($("#kKnown"))  $("#kKnown").textContent  = String(known);
    if ($("#kTotal"))  $("#kTotal").textContent  = String(total);
    if ($("#kPct"))    $("#kPct").textContent    = String(pct);
    if ($("#kAcc"))    $("#kAcc").textContent    = String(acc);
    if ($("#kQuiz"))   $("#kQuiz").textContent   = `${quizCorrect}/${quizTotal}`;

    const bar = $("#progressBarAll");
    if (bar) bar.style.width = `${pct}%`;
  }
}


// ============================================================
// 4. CONTROLLERS
// ============================================================

// ------------------------------------------------------------
// AuthController — index.html: вхід / реєстрація
// ------------------------------------------------------------
class AuthController {
  constructor(userModel, view) {
    this.model = userModel;
    this.view  = view;
  }

  init() {
    if (this.model.currentUser()) {
      location.href = "app.html";
      return;
    }
    this.view.setMode("login");
    this.view.showLoginBtn.addEventListener("click",  () => this.view.setMode("login"));
    this.view.showRegBtn.addEventListener("click",    () => this.view.setMode("register"));
    this.view.loginForm?.addEventListener("submit",   (e) => this._onLogin(e));
    this.view.regForm?.addEventListener("submit",     (e) => this._onRegister(e));
  }

  _onLogin(e) {
    e.preventDefault();
    try {
      this.model.login(this.view.getLoginData());
      location.href = "app.html";
    } catch (err) {
      this.view.showError(err.message);
    }
  }

  _onRegister(e) {
    e.preventDefault();
    try {
      const data = this.view.getRegisterData();
      this.model.register(data);
      this.model.login({ email: data.email, password: data.password });
      location.href = "app.html";
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}

// ------------------------------------------------------------
// StudyController — app.html: картки + таблиця
// ------------------------------------------------------------
class StudyController {
  constructor(userModel, wordModel, progressModel, studyView, quizController) {
    this.userModel      = userModel;
    this.wordModel      = wordModel;
    this.progressModel  = progressModel;
    this.view           = studyView;
    this.quizCtrl       = quizController;
    this.user           = null;

    this.state = {
      level: null,
      topic: null,
      index: 0,
    };
  }

  init() {
    this.user = this.userModel.currentUser();
    if (!this.user) { alert("Спочатку увійди"); location.href = "index.html"; return; }

    $("#logoutBtn")?.addEventListener("click", () => this.userModel.logout());

    const levels = this.wordModel.getLevels();
    this.state.level = levels[0];
    this.state.topic = this.wordModel.getTopics(this.state.level)[0];

    this.view.fillLevels(levels, this.state.level);
    this.view.fillTopics(this.wordModel.getTopics(this.state.level), this.state.topic);

    this._bindEvents();
    this._renderAll();
    this.view.setMode("study");
  }

  _bindEvents() {
    this.view.levelSel.addEventListener("change", () => {
      this.state.level = this.view.levelSel.value;
      const topics = this.wordModel.getTopics(this.state.level);
      this.state.topic = topics[0];
      this.view.fillTopics(topics, this.state.topic);
      this.state.index = 0;
      this._renderAll();
      this.quizCtrl.reset();
    });

    this.view.topicSel.addEventListener("change", () => {
      this.state.topic = this.view.topicSel.value;
      this.state.index = 0;
      this._renderAll();
      this.quizCtrl.reset();
    });

    this.view.flipBtn.addEventListener("click",  () => this.view.toggleTranslation());
    this.view.prevCardBtn.addEventListener("click", () => { this.state.index--; this._renderCard(); });
    this.view.nextCardBtn.addEventListener("click", () => { this.state.index++; this._renderCard(); });

    this.view.knowBtn.addEventListener("click", () => {
      const words = this._currentWords();
      this.progressModel.markKnown(this.user.email, words[this.state.index].id, true);
      if (this.state.index < words.length - 1) this.state.index++;
      this._renderAll();
    });

    this.view.dontKnowBtn.addEventListener("click", () => {
      const words = this._currentWords();
      this.progressModel.markKnown(this.user.email, words[this.state.index].id, false);
      this._renderAll();
    });

    $("#resetProgressBtn")?.addEventListener("click", () => {
      if (!confirm("Скинути прогрес для цього користувача?")) return;
      this.progressModel.reset(this.user.email);
      this.state.index = 0;
      this._renderAll();
      this.quizCtrl.reset();
    });

    this.view.tabStudy.addEventListener("click", () => this.view.setMode("study"));
    this.view.tabQuiz.addEventListener("click",  () => this.view.setMode("quiz"));
  }

  _currentWords() {
    return this.wordModel.getWords(this.state.level, this.state.topic);
  }

  _renderCard() {
    const words = this._currentWords();
    if (!words.length) return;
    this.state.index = Math.max(0, Math.min(this.state.index, words.length - 1));
    const prog = this.progressModel.get(this.user.email);
    this.view.renderCard(
      words[this.state.index],
      this.state.index,
      words.length,
      this.state.level,
      this.state.topic,
      !!prog.known[words[this.state.index].id]
    );
  }

  _renderAll() {
    const words = this._currentWords();
    const prog  = this.progressModel.get(this.user.email);
    const knownCount = words.filter(w => prog.known[w.id]).length;

    this.view.renderStats(knownCount, words.length);
    this.view.renderList(words, prog.known);
    this._renderCard();
  }

  // Публічні методи для QuizController
  getCurrentWords()   { return this._currentWords(); }
  getState()          { return this.state; }
  getUser()           { return this.user; }
}

// ------------------------------------------------------------
// QuizController — app.html: вікторина
// ------------------------------------------------------------
class QuizController {
  constructor(wordModel, progressModel, view) {
    this.wordModel      = wordModel;
    this.progressModel  = progressModel;
    this.view           = view;
    this.studyCtrl      = null; // встановлюється після ініціалізації StudyController

    this._PAD = ["місяць", "вікно", "міст", "ручка", "сумка", "дерево", "вогонь", "небо", "камінь"];

    this.state = {
      poolMode:  "all",
      questions: [],
      qi:        0,
      locked:    false,
      score:     0,
      total:     0,
    };
  }

  setStudyController(ctrl) { this.studyCtrl = ctrl; }

  init() {
    this.view.startQuizBtn.addEventListener("click",       () => this.reset());
    this.view.nextQuestionBtn.addEventListener("click",    () => this._nextQuestion());
    this.view.onlyUnknownBtn.addEventListener("click",     () => {
      this.state.poolMode = this.state.poolMode === "unknown" ? "all" : "unknown";
      this.view.setOnlyUnknownLabel(this.state.poolMode === "unknown");
      this.reset();
    });
    this.reset();
  }

  reset() {
    this.state.locked = false;
    this.state.score  = 0;
    this.state.qi     = 0;
    this.state.questions = this._buildQuestions();
    this.state.total     = this.state.questions.length;
    this.view.renderHUD(0, this.state.total);
    this._renderQuestion();
  }

  _buildQuestions() {
    const user  = this.studyCtrl.getUser();
    const words = this.studyCtrl.getCurrentWords();
    const prog  = this.progressModel.get(user.email);

    const pool = this.state.poolMode === "unknown"
      ? words.filter(w => !prog.known[w.id])
      : words;

    const src = pool.length ? pool : words;

    return shuffle(src).map(w => ({
      word:    w,
      correct: w.ua,
      options: this._makeOptions(w, words),
    }));
  }

  _makeOptions(target, words) {
    const wrongs = shuffle(words.filter(x => x.en !== target.en).map(x => x.ua)).slice(0, 3);
    const opts   = shuffle([target.ua, ...wrongs]);
    while (opts.length < 4) opts.push(this._PAD[opts.length % this._PAD.length]);
    return opts.slice(0, 4);
  }

  _renderQuestion() {
    this.state.locked = false;
    if (!this.state.questions.length) return;

    if (this.state.qi >= this.state.questions.length) {
      this.view.renderFinished(this.state.score, this.state.total);
      return;
    }
    this.view.renderQuestion(this.state.questions[this.state.qi], (opt) => this._onChoose(opt));
  }

  _onChoose(opt) {
    if (this.state.locked) return;
    this.state.locked = true;

    const q         = this.state.questions[this.state.qi];
    const isCorrect = opt === q.correct;
    const user      = this.studyCtrl.getUser();

    this.progressModel.recordQuizAnswer(user.email, isCorrect);
    this.view.highlightAnswer(q.correct, opt);
    this.view.showFeedback(isCorrect, q.correct);

    if (isCorrect) {
      this.state.score += 1;
      this.view.renderHUD(this.state.score, this.state.total);
      setTimeout(() => {
        this.state.qi++;
        this.state.locked = false;
        this._renderQuestion();
      }, 1300);
    } else {
      this.view.renderHUD(this.state.score, this.state.total);
    }
  }

  _nextQuestion() {
    this.state.qi++;
    this._renderQuestion();
  }
}

// ------------------------------------------------------------
// ProfileController — profile.html
// ------------------------------------------------------------
class ProfileController {
  constructor(userModel, wordModel, progressModel, view) {
    this.userModel     = userModel;
    this.wordModel     = wordModel;
    this.progressModel = progressModel;
    this.view          = view;
  }

  init() {
    const user = this.userModel.currentUser();
    if (!user) { alert("Спочатку увійди"); location.href = "index.html"; return; }

    $("#logoutBtn")?.addEventListener("click", () => this.userModel.logout());

    const prog       = this.progressModel.get(user.email);
    const known      = Object.keys(prog.known || {}).length;
    const total      = this.wordModel.allWordsCount();
    const qCorrect   = prog.quiz?.correct ?? 0;
    const qTotal     = prog.quiz?.total   ?? 0;

    this.view.render(user, known, total, qCorrect, qTotal);
  }
}


// ============================================================
// 5. BOOTSTRAP — точка входу
// ============================================================

(function bootstrap() {
  // Спільні моделі (singleton на сторінку)
  const userModel     = new UserModel();
  const wordModel     = new WordModel();
  const progressModel = new ProgressModel();

  // --- index.html: авторизація ---
  if ($("#showLoginBtn")) {
    const authView = new AuthView();
    const authCtrl = new AuthController(userModel, authView);
    authCtrl.init();
    return;
  }

  // --- app.html: навчання + вікторина ---
  if ($("#levelSelect")) {
    const studyView = new StudyView();
    const quizView  = new QuizView();

    const quizCtrl  = new QuizController(wordModel, progressModel, quizView);
    const studyCtrl = new StudyController(userModel, wordModel, progressModel, studyView, quizCtrl);

    // Взаємна залежність: QuizController потребує StudyController
    quizCtrl.setStudyController(studyCtrl);

    studyCtrl.init();
    quizCtrl.init();
    return;
  }

  // --- profile.html: профіль ---
  if ($("#kKnown")) {
    const profileView = new ProfileView();
    const profileCtrl = new ProfileController(userModel, wordModel, progressModel, profileView);
    profileCtrl.init();
    return;
  }
})();