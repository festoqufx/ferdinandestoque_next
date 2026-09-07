(function () {
  "use strict";

  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    const target = select(el, all);
    if (!target) return;
    if (all) target.forEach((item) => item.addEventListener(type, listener));
    else target.addEventListener(type, listener);
  };

  const onscroll = (el, listener) => el.addEventListener("scroll", listener);

  const navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  const scrollto = (el) => {
    const header = select("#header");
    const offset = header ? header.offsetHeight : 0;
    const elementPos = select(el).offsetTop;
    window.scrollTo({ top: elementPos - offset, behavior: "smooth" });
  };

  const selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) selectHeader.classList.add("header-scrolled");
      else selectHeader.classList.remove("header-scrolled");
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  const backToTop = select(".back-to-top");
  if (backToTop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) backToTop.classList.add("active");
      else backToTop.classList.remove("active");
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  on("click", ".mobile-nav-toggle", function () {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  on("click", ".navbar .dropdown > a", function (e) {
    if (select("#navbar").classList.contains("navbar-mobile")) {
      e.preventDefault();
      this.nextElementSibling.classList.toggle("dropdown-active");
    }
  }, true);

  const heroIndicators = select("#hero-carousel-indicators");
  if (heroIndicators && heroIndicators.children.length === 0) {
    select("#heroCarousel .carousel-item", true).forEach((item, index) => {
      heroIndicators.innerHTML += index === 0
        ? "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "' class='active'></li>"
        : "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "'></li>";
    });
  }

  on("click", ".scrollto", function (e) {
    if (select(this.hash)) {
      e.preventDefault();
      const navbar = select("#navbar");
      if (navbar && navbar.classList.contains("navbar-mobile")) {
        navbar.classList.remove("navbar-mobile");
        const toggle = select(".mobile-nav-toggle");
        if (toggle) {
          toggle.classList.toggle("bi-list");
          toggle.classList.toggle("bi-x");
        }
      }
      scrollto(this.hash);
    }
  }, true);

  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  const zigzag = select('.footer-zigzag[data-zigzag="interactive"]');
  if (zigzag) {
    const cores = [...zigzag.querySelectorAll(".zigzag__core")];
    const pulse = (item) => {
      if (!item) return;
      item.classList.remove("is-active");
      item.offsetWidth;
      item.classList.add("is-active");
      window.setTimeout(() => item.classList.remove("is-active"), 360);
    };
    zigzag.addEventListener("mouseenter", () => zigzag.classList.add("is-paused"));
    zigzag.addEventListener("mouseleave", () => zigzag.classList.remove("is-paused"));
    zigzag.addEventListener("focusin", () => zigzag.classList.add("is-paused"));
    zigzag.addEventListener("focusout", (e) => {
      if (!zigzag.contains(e.relatedTarget)) zigzag.classList.remove("is-paused");
    });
    cores.forEach((core, index) => {
      core.addEventListener("mouseenter", () => pulse(core.closest(".zigzag__item")));
      core.addEventListener("focus", () => pulse(core.closest(".zigzag__item")));
      core.addEventListener("click", () => pulse(core.closest(".zigzag__item")));
      core.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          cores[(index + 1) % cores.length].focus();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          cores[(index - 1 + cores.length) % cores.length].focus();
        } else if (e.key === "Enter" || e.key === " ") {
          pulse(core.closest(".zigzag__item"));
        }
      });
    });
  }

  const initScrollFade = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const selector = [
      "#hero .carousel-content > h2",
      "#hero .carousel-content > .main_logo",
      "#hero .carousel-content > .middle",
      "#hero .carousel-content > .hero-aka",
      "#hero .carousel-content > p",
      "#hero #cube-container",
      "#hero .wrap_text",
      "#hero .center",
      ".pc-lottie-container",
      "h2.h2_half",
      ".container_title",
      ".container_title_2",
      "#About .row > [class*='col-']",
      ".intro_text",
      ".circle_r",
      ".scene",
      ".timeline",
      ".testim_v15",
      "#testim_v15",
      ".skill-col_v3",
      ".container_cloud",
      ".Words-text",
      ".alert-simple_v1",
      "#portfolio-flters",
      ".portfolio-item > img",
      ".portfolio-item > .portfolio-info",
      ".button-icon_v2_v2",
      ".container_pictureSlider",
      ".marquee",
      ".wrapper.slicebox",
      ".tipsy_box_v1",
      "#ravenom .text-container",
      ".cards_v5",
      ".card_v5",
      ".iframe-container",
      ".figure_box",
      ".snip1229",
      ".team_testimonials > [class*='col-']",
      ".contact-cards-row_v1 > [class*='col-']",
      ".contact-content-row_v1 > [class*='col-']",
      "#footer .footer-top .row > [class*='col-']",
      "#footer .copyright",
      "#footer .credits",
      ".footer-zigzag",
      "#github"
    ].join(",");

    const nodes = [...document.querySelectorAll(selector)];
    const unique = [];
    const seen = new Set();
    nodes.forEach((el) => {
      if (!el || seen.has(el)) return;
      seen.add(el);
      unique.push(el);
    });

    const hasContent = (el) => {
      const text = (el.textContent || "").replace(/\u00a0/g, " ").trim();
      return !!(text || el.querySelector("img, svg, iframe, video, input, textarea, .poster"));
    };

    const parentSet = new Set(unique);
    const targets = unique.filter((el) => {
      if (el.closest("#header, #navbar, #canvas, .back-to-top")) return false;
      if (!hasContent(el)) return false;
      let parent = el.parentElement;
      while (parent) {
        if (parentSet.has(parent)) return false;
        parent = parent.parentElement;
      }
      return true;
    });

    const usesOwnTransform = (el) => el.matches(
      "h2.h2_half, #cube-container, .center, .tipsy_box_v1, #tipsy_box, .testim_v15, #testim_v15, .wrap_v15, .pc-lottie-container, .figure_box"
    );

    const finish = (el) => {
      el.classList.remove("animate__animated", "animate__fadeInDown", "js-scroll-fade", "js-scroll-inplace");
      el.classList.add("js-scroll-shown");
    };

    const reveal = (el) => {
      if (!el || el.classList.contains("js-scroll-shown")) return;
      if (reduceMotion) {
        finish(el);
        return;
      }
      el.classList.add("animate__animated");
      if (usesOwnTransform(el)) el.classList.add("js-scroll-inplace");
      else el.classList.add("animate__fadeInDown");
      let done = false;
      const onDone = (e) => {
        if (done) return;
        if (e && e.target !== el) return;
        if (e && e.animationName && e.animationName !== "fadeInDown" && e.animationName !== "fadeInDownInplace") return;
        done = true;
        finish(el);
      };
      el.addEventListener("animationend", onDone);
      window.setTimeout(() => onDone(), 1400);
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(reveal);
      return;
    }

    const onIntersect = (observer) => (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target);
      });
    };

    const io = new IntersectionObserver(function (entries) {
      onIntersect(io)(entries);
    }, { threshold: 0, rootMargin: "0px 0px -4% 0px" });

    const ioFooter = new IntersectionObserver(function (entries) {
      onIntersect(ioFooter)(entries);
    }, { threshold: 0, rootMargin: "0px" });

    targets.forEach((el) => {
      el.classList.add("js-scroll-fade");
      if (el.closest("#footer")) ioFooter.observe(el);
      else io.observe(el);
    });

    const revealIfInViewport = () => {
      const remaining = select(".js-scroll-fade", true);
      if (!remaining.length) return;
      const vh = window.innerHeight || document.documentElement.clientHeight || 0;
      remaining.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= vh) return;
        io.unobserve(el);
        ioFooter.unobserve(el);
        reveal(el);
      });
    };

    const watchScroll = (node) => {
      if (!node || typeof node.addEventListener !== "function") return;
      node.addEventListener("scroll", revealIfInViewport, { passive: true });
    };
    watchScroll(window);
    watchScroll(document);
    watchScroll(document.documentElement);
    watchScroll(document.body);
    window.addEventListener("resize", revealIfInViewport, { passive: true });
    window.addEventListener("orientationchange", revealIfInViewport);
    window.addEventListener("hashchange", revealIfInViewport);
    window.addEventListener("load", revealIfInViewport);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("scroll", revealIfInViewport, { passive: true });
      window.visualViewport.addEventListener("resize", revealIfInViewport, { passive: true });
    }
    requestAnimationFrame(revealIfInViewport);
    window.setTimeout(revealIfInViewport, 120);
    window.setTimeout(revealIfInViewport, 700);
    window.setTimeout(revealIfInViewport, 1800);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(revealIfInViewport).catch(() => {});
    }

    const heroCarousel = select("#heroCarousel");
    if (heroCarousel) {
      heroCarousel.addEventListener("slid.bs.carousel", () => {
        select("#hero .carousel-item.active .js-scroll-fade", true).forEach((el) => {
          io.unobserve(el);
          reveal(el);
        });
      });
    }
  };

  const bootScrollFade = () => {
    if (window.__scrollFadeReady) return;
    window.__scrollFadeReady = true;
    initScrollFade();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootScrollFade);
  } else {
    bootScrollFade();
  }

  const initSectionSfx = () => {
    const toggleBtn = select("#sfx-toggle");
    const storageKey = "sectionSfxEnabled";
    const setToggleUi = (enabled) => {
      if (!toggleBtn) return;
      toggleBtn.classList.toggle("is-off", !enabled);
      toggleBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
      toggleBtn.setAttribute("aria-label", enabled ? "Turn sound effects off" : "Turn sound effects on");
      toggleBtn.title = enabled ? "Sound effects on" : "Sound effects off";
      toggleBtn.dataset.state = enabled ? "on" : "off";
      const icon = toggleBtn.querySelector("i");
      const stateLabel = toggleBtn.querySelector(".sfx-toggle__state");
      if (icon) {
        icon.classList.remove("bi-volume-up-fill", "bi-volume-mute-fill");
        icon.classList.add(enabled ? "bi-volume-up-fill" : "bi-volume-mute-fill");
      }
      if (stateLabel) {
        stateLabel.textContent = enabled ? "ON" : "OFF";
      }
    };

    let sfxEnabled = true;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "0" || stored === "false") sfxEnabled = false;
    } catch (_) {}
    setToggleUi(sfxEnabled);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const interactiveSelector = [
      "button",
      "a[href]",
      "[role='button']",
      "[data-bs-toggle]",
      "[data-bs-target]",
      ".btn",
      ".nav-link",
      ".nav-item",
      ".mobile-nav-toggle",
      ".back-to-top",
      ".portfolio-item",
      ".card_v5",
      ".cp-card_v1",
      ".cp-cta_v1",
      ".timeline-content",
      ".dot_v15",
      ".arrow_v15",
      ".gh-cal__handle",
      ".poster-item",
      ".nav-dots span",
      ".nav-options span",
      "li[data-filter]",
      "input[type='submit']",
      "input[type='button']",
      "input[type='reset']",
      "summary",
      "label"
    ].join(", ");

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.38;
    master.connect(ctx.destination);
    let unlocked = false;
    const presets = {
      soft: {
        hover: [420, "sine", 0.05, 0.045, -10, 6],
        clickA: [248, "triangle", 0.075, 0.085, -20, -4],
        clickB: [378, "sine", 0.055, 0.05, 8, 24],
        clickDelay: 22
      },
      ultra: {
        hover: [376, "sine", 0.045, 0.03, -8, 4],
        clickA: [230, "triangle", 0.062, 0.055, -16, -2],
        clickB: [334, "sine", 0.045, 0.03, 4, 14],
        clickDelay: 18
      },
      bright: {
        hover: [520, "triangle", 0.06, 0.05, -2, 14],
        clickA: [316, "triangle", 0.08, 0.09, -10, 8],
        clickB: [634, "sine", 0.05, 0.06, 8, 32],
        clickDelay: 20
      }
    };
    let presetName = "soft";
    let currentPreset = presets[presetName];
    let lastHoverRoot = null;
    let lastHoverStamp = 0;

    const setPreset = (name) => {
      if (!name || !presets[name]) return false;
      presetName = name;
      currentPreset = presets[presetName];
      return true;
    };

    try {
      const bodyPreset = document.body && document.body.getAttribute("data-section-sfx");
      const urlPreset = new URLSearchParams(window.location.search).get("sfx");
      setPreset(urlPreset || bodyPreset || "soft");
    } catch (_) {}

    window.setSectionSfxPreset = setPreset;
    window.getSectionSfxPreset = () => presetName;

    const setSfxEnabled = (value) => {
      sfxEnabled = !!value;
      try {
        window.localStorage.setItem(storageKey, sfxEnabled ? "1" : "0");
      } catch (_) {}
      setToggleUi(sfxEnabled);
      if (!sfxEnabled && ctx.state === "running") {
        ctx.suspend().catch(() => {});
      }
      if (sfxEnabled && unlocked && ctx.state !== "running") {
        ctx.resume().catch(() => {});
      }
      return sfxEnabled;
    };

    window.setSectionSfxEnabled = setSfxEnabled;
    window.getSectionSfxEnabled = () => sfxEnabled;

    const unlock = (force = false) => {
      if (unlocked || (!sfxEnabled && !force)) return;
      ctx.resume().then(() => {
        unlocked = true;
      }).catch(() => {});
    };

    const playWithUnlock = (playFn) => {
      if (!sfxEnabled) return;
      if (unlocked && ctx.state === "running") {
        playFn();
        return;
      }
      ctx.resume().then(() => {
        unlocked = true;
        playFn();
      }).catch(() => {});
    };

    const pulse = (frequency, type, duration, gain, detuneStart, detuneEnd) => {
      if (!sfxEnabled || !unlocked || ctx.state !== "running") return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(Math.min(1400, frequency * 4), now);
      filter.Q.setValueAtTime(0.65, now);
      if (typeof detuneStart === "number") {
        osc.detune.setValueAtTime(detuneStart, now);
        osc.detune.linearRampToValueAtTime(typeof detuneEnd === "number" ? detuneEnd : detuneStart, now + duration);
      }
      amp.gain.setValueAtTime(0.0001, now);
      amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
      amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(filter);
      filter.connect(amp);
      amp.connect(master);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    };

    const resolveInteractiveRoot = (target) => {
      if (!target || !target.closest) return null;
      const root = target.closest(interactiveSelector);
      if (!root || root.closest("#sfx-toggle")) return null;
      if (root.matches("button, input, select, textarea") && root.disabled) return null;
      return root;
    };

    const onHover = (e) => {
      if (reduceMotion || isCoarsePointer) return;
      const root = resolveInteractiveRoot(e.target);
      if (!root) return;
      const now = performance.now();
      if (root === lastHoverRoot && now - lastHoverStamp < 120) return;
      lastHoverRoot = root;
      lastHoverStamp = now;
      playWithUnlock(() => pulse.apply(null, currentPreset.hover));
    };

    const onClick = (e) => {
      const root = resolveInteractiveRoot(e.target);
      if (!root) return;
      playWithUnlock(() => {
        pulse.apply(null, currentPreset.clickA);
        window.setTimeout(() => pulse.apply(null, currentPreset.clickB), currentPreset.clickDelay);
      });
    };

    const playToggleCue = (enabled) => {
      if (!enabled) return;
      playWithUnlock(() => {
        pulse(440, "sine", 0.05, 0.035, -4, 4);
        window.setTimeout(() => pulse(660, "triangle", 0.045, 0.025, 6, 12), 18);
      });
    };

    if (toggleBtn) {
      toggleBtn.addEventListener("pointerdown", () => {
        unlock(true);
      }, { passive: true });
      toggleBtn.addEventListener("click", () => {
        const nextState = !sfxEnabled;
        setSfxEnabled(nextState);
        if (nextState) {
          playToggleCue(true);
        }
      });
    }

    document.addEventListener("pointerover", onHover, true);
    document.addEventListener("pointerdown", onClick, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (!resolveInteractiveRoot(e.target)) return;
      onClick(e);
    }, true);

    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true, passive: true });
  };

  const bootSectionSfx = () => {
    if (window.__sectionSfxReady) return;
    window.__sectionSfxReady = true;
    initSectionSfx();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootSectionSfx);
  } else {
    bootSectionSfx();
  }

  const initAskAnythingChat = () => {
    const widget = document.getElementById("ask-anything-widget");
    if (!widget) return;

    const launcher = document.getElementById("ask-anything-launcher");
    const badge = document.getElementById("ask-anything-badge");
    const panel = document.getElementById("ask-anything-panel");
    const minimizeBtn = document.getElementById("ask-anything-minimize");
    const clearBtn = document.getElementById("ask-anything-clear");
    const closeBtn = document.getElementById("ask-anything-close");
    const form = document.getElementById("ask-anything-form");
    const input = document.getElementById("ask-anything-input");
    const charCount = document.getElementById("ask-anything-char-count");
    const scrollBtn = document.getElementById("ask-anything-scroll-btn");
    const messages = document.getElementById("ask-anything-messages");
    const typing = document.getElementById("ask-anything-typing");
    const promptButtons = [...widget.querySelectorAll(".ask-anything-prompt")];

    if (!launcher || !badge || !panel || !minimizeBtn || !clearBtn || !closeBtn || !form || !input || !messages || !typing) return;

    const historyKey = "askAnythingHistoryV2";
    const prefsKey = "askAnythingPrefsV2";
    const maxHistoryItems = 40;
    const defaultPrompts = [
      { label: "Certificates", prompt: "What certificates do you have?" },
      { label: "Hobbies & Interests", prompt: "What are your hobbies and interests?" },
      { label: "Websites & Projects", prompt: "What websites and projects have you worked on?" },
      { label: "Services & Expertise", prompt: "What services do you offer?" },
      { label: "Skills", prompt: "What are your skills?" },
      { label: "Contact", prompt: "How can I contact you?" }
    ];

    const state = {
      open: false,
      minimized: false,
      unread: 0,
      awaitingResponse: false,
      topic: "general",
      messages: [],
      responseToken: 0   // incremented on clear/close to cancel in-flight replies
    };

    const siteFacts = {
      name: "Ferdinand Estoque",
      alias: "Black Raven",
      title: "Web Developer, UI/UX Designer, Digital Creator",
      location: "Imus, Cavite, Philippines",
      experienceYears: "16+ years",
      education: "Bachelor of Science in Information Technology",
      contact: {
        email: "ferdinand.estoque@yahoo.com",
        phone: "+63 995 814 3127"
      },
      certificates: [
        "**AI Foundations** by OpenAI — https://academy.openai.com/home/certificate/u77flalmmn",
        "**Anthropic Claude 101** by Anthropic — https://verify.skilljar.com/c/tadt9xixkhts",
        "**Azure Fundamentals** by Microsoft — https://simpli-web.app.link/e/4k1LYawGU5b",
        "**ITIL V4** by SimpliLearn — https://simpli-web.app.link/e/nIHO6LMkU5b",
        "**Cybersecurity Awareness** by HP — https://www.life-global.org/certificate/78f4c7bc-0144-428d-b48e-da9d56424494",
        "**AI for Business Professionals** by HP — https://www.life-global.org/certificate/a9de57e0-d363-4326-911a-d41b40a0311d"
      ],
      hobbies: [
        "**Coding**: Building side projects, testing new frameworks (Next.js, Vue, Angular), and experimenting with AI agents.",
        "**Gym/Fitness**: Daily workouts, strength training, and physical discipline.",
        "**Games**: Strategy games, retro classics, and studying interactive game mechanics.",
        "**Movies**: Sci-fi films, cinematic storytelling, and animation.",
        "**Painting**: Traditional and digital art, illustrations, and visual composition."
      ],
      interests: [
        "**Music**: Audiophile sound, creating music apps (like Echoes Music Player).",
        "**Martial Arts**: Martial discipline, mental agility, and focus.",
        "**Photography**: Capturing street, landscape, and travel moments.",
        "**Reading**: Software architecture, AI advancements, UI/UX design, and personal development.",
        "**Travel**: Exploring diverse cultures and solo travel adventures, like my recent solo trip across Japan! (Tokyo, Narita, Ichiran Ramen, and Disneyland)"
      ],
      skills: [
        "React",
        "Svelte",
        "Node.js",
        "JavaScript",
        "HTML5",
        "CSS",
        "Bootstrap",
        "Laravel",
        "MySQL",
        "PostgreSQL",
        "Figma",
        "AEM",
        "JIRA",
        "SharePoint",
        "GitHub Copilot",
        "Claude Code",
        "Cursor",
        "Cline"
      ],
      aiTools: ["Claude Code", "GitHub Copilot", "OpenAI Codex", "Cursor", "Cline", "AntiGravity"],
      services: [
        "Web Design",
        "Web Development",
        "Print Design",
        "Marketing",
        "Graphic Design",
        "CMS Integration",
        "Web Maintenance"
      ],
      experience: [
        "2025 - Visa / Teleperformance: Implementation Analyst / Digital Content Manager",
        "2016 - Quinn Data Facilities, Inc.: Back-End Web Developer",
        "2015 - Smart Communication, Inc.: IT Consultant / Front-End Web Developer",
        "2014 - Nasdaq: Web Designer Developer",
        "2013 - Crosspower Phils, Inc.: Multimedia Web Designer",
        "2008 - SPI Global: Senior Web Content Editor / Analyst"
      ],
      projects: [
        "Sudoku Solver",
        "MyOnlineSite",
        "WorldsTime",
        "Space Snake",
        "Memory Matrix",
        "NEXT IDE",
        "Digital Signature Pro",
        "Whats for Dinner Wheel",
        "Echoes music player"
      ]
    };

    const skillGroups = {
      frontEnd: ["React", "Svelte", "JavaScript", "HTML5", "CSS", "Bootstrap"],
      backEnd: ["Node.js", "Laravel", "MySQL", "PostgreSQL"],
      design: ["Figma", "AEM", "SharePoint", "JIRA"],
      ai: ["GitHub Copilot", "Claude Code", "Cursor", "Cline", "OpenAI Codex", "AntiGravity"]
    };

    const safeParse = (value, fallback) => {
      try {
        return JSON.parse(value) ?? fallback;
      } catch (_) {
        return fallback;
      }
    };

    const nowLabel = (date = new Date()) => date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const formatList = (items) => items.map((item) => `- ${item}`).join("\n");

    // Escapes HTML entities then applies safe inline formatting (bold, URLs) for bot messages.
    const renderBotHtml = (rawText) => {
      const safe = rawText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return safe
        .replace(/\*\*([^*\n]{1,120})\*\*/g, "<strong>$1</strong>")
        .replace(/(https?:\/\/[^\s<&]{4,})/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    };

    const readPrefs = () => {
      try {
        return safeParse(window.localStorage.getItem(prefsKey), {}) || {};
      } catch (_) {
        return {};
      }
    };

    const savePrefs = () => {
      try {
        window.localStorage.setItem(prefsKey, JSON.stringify({ minimized: state.minimized }));
      } catch (_) {}
    };

    const readHistory = () => {
      try {
        const saved = safeParse(window.localStorage.getItem(historyKey), []);
        return Array.isArray(saved) ? saved : [];
      } catch (_) {
        return [];
      }
    };

    const saveHistory = () => {
      try {
        window.localStorage.setItem(historyKey, JSON.stringify(state.messages.slice(-maxHistoryItems)));
      } catch (_) {}
    };

    const setBadge = (count) => {
      state.unread = Math.max(0, count | 0);
      badge.hidden = state.unread === 0;
      badge.textContent = state.unread > 9 ? "9+" : String(state.unread || 1);
    };

    const updatePromptButtons = (suggestions) => {
      const items = suggestions && suggestions.length ? suggestions : defaultPrompts;
      promptButtons.forEach((button, index) => {
        const suggestion = items[index];
        if (!suggestion) {
          button.hidden = true;
          return;
        }
        button.hidden = false;
        button.textContent = suggestion.label;
        button.dataset.prompt = suggestion.prompt;
      });
    };

    const renderMessage = (entry, isNew = false) => {
      const item = document.createElement("article");
      item.className = `ask-anything-message ask-anything-message--${entry.role}`;
      if (isNew) item.classList.add("is-new");

      const bubble = document.createElement("div");
      bubble.className = "ask-anything-message__bubble";
      if (entry.role === "bot") {
        bubble.innerHTML = renderBotHtml(entry.text);
      } else {
        bubble.textContent = entry.text;
      }

      const meta = document.createElement("span");
      meta.className = "ask-anything-message__meta";
      meta.textContent = entry.role === "user" ? `You • ${entry.time}` : `Assistant • ${entry.time}`;

      item.appendChild(bubble);
      item.appendChild(meta);

      if (entry.role === "bot") {
        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "ask-anything-message__copy";
        copyBtn.setAttribute("aria-label", "Copy message");
        copyBtn.innerHTML = '<i class="bi bi-clipboard" aria-hidden="true"></i> Copy';
        copyBtn.addEventListener("click", () => {
          const markCopied = () => {
            copyBtn.innerHTML = '<i class="bi bi-check-lg" aria-hidden="true"></i> Copied';
            window.setTimeout(() => {
              copyBtn.innerHTML = '<i class="bi bi-clipboard" aria-hidden="true"></i> Copy';
            }, 1600);
          };
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(entry.text).then(markCopied).catch(markCopied);
          } else {
            markCopied();
          }
        });
        item.appendChild(copyBtn);
      }

      return item;
    };

    const renderHistory = () => {
      messages.textContent = "";
      const fragment = document.createDocumentFragment();
      state.messages.forEach((message) => {
        fragment.appendChild(renderMessage(message));
      });
      messages.appendChild(fragment);
      messages.scrollTop = messages.scrollHeight;
    };

    const pushMessage = (role, text, extra = {}) => {
      const entry = {
        role,
        text,
        time: nowLabel(),
        topic: extra.topic || state.topic,
        followUps: extra.followUps || null
      };
      state.messages.push(entry);
      if (state.messages.length > maxHistoryItems) {
        state.messages.splice(0, state.messages.length - maxHistoryItems);
      }
      messages.appendChild(renderMessage(entry, true));
      messages.scrollTop = messages.scrollHeight;
      saveHistory();
      return entry;
    };

    const setTyping = (active) => {
      typing.hidden = !active;
      typing.setAttribute("aria-hidden", active ? "false" : "true");
      messages.scrollTop = messages.scrollHeight;
    };

    const setBusy = (busy) => {
      form.setAttribute("aria-busy", busy ? "true" : "false");
      input.disabled = busy;
      const sendBtn = form.querySelector("button[type='submit']");
      if (sendBtn) sendBtn.disabled = busy;
    };

    const setMinimized = (minimized) => {
      state.minimized = !!minimized;
      panel.classList.toggle("is-minimized", state.minimized);
      launcher.setAttribute("aria-expanded", state.open ? "true" : "false");
      savePrefs();
      if (!state.minimized && state.open) {
        window.setTimeout(() => input.focus(), 20);
      }
    };

    const setOpen = (open) => {
      state.open = !!open;
      panel.hidden = !state.open;
      widget.classList.toggle("is-open", state.open);
      launcher.setAttribute("aria-expanded", state.open ? "true" : "false");
      if (state.open) {
        setBadge(0);
        if (state.minimized) setMinimized(false);
        window.setTimeout(() => input.focus(), 50);
        messages.scrollTop = messages.scrollHeight;
      } else {
        state.minimized = false;
        panel.classList.remove("is-minimized");
        savePrefs();
        launcher.focus();
      }
    };

    const notifyUnread = () => {
      if (state.open && !state.minimized) return;
      setBadge(state.unread + 1);
    };

    const answerFromRules = (query) => {
      const raw = query.trim();
      const q = raw.toLowerCase();

      if (!q) {
        return {
          text: `I can answer questions about Ferdinand's certificates, hobbies, interests, skills, experience, projects, services, education, and contact details.`,
          topic: "general",
          followUps: defaultPrompts
        };
      }

      const has = (pattern) => pattern.test(q);

      // Conversational & utility intents
      if (has(/\b(clear|reset|start over|restart|new chat)\b/)) {
        return {
          text: `You can clear the conversation with the Clear button in the chat header.`,
          topic: "utility",
          followUps: defaultPrompts
        };
      }

      if (has(/\b(help|how to use|what can i ask|commands|options|navigate|navigation)\b/)) {
        return {
          text: `Here is what you can ask me:\n- **Certificates** — verified credentials and certifications\n- **Hobbies & Interests** — personal pastimes, passions, and travel\n- **Skills** — front-end, back-end, design, or AI tools\n- **Experience** — career timeline and companies\n- **Projects** — portfolio items with live demo links\n- **Services** — what Ferdinand offers and custom quotes\n- **Contact** — email, phone, and social links\n- **Education** — academic background\n- **Surprise me** — a random fun fact`,
          topic: "help",
          followUps: defaultPrompts
        };
      }

      if (has(/^(hi|hello|hey|good (morning|afternoon|evening)|howdy|greetings)[!.]?$/) || (has(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/) && q.split(/\s+/).length <= 4)) {
        return {
          text: `Hello! I'm the website assistant for Ferdinand Estoque. Ask me anything about Ferdinand's certificates, hobbies, interests, skills, experience, projects, or contact details!`,
          topic: "greeting",
          followUps: defaultPrompts
        };
      }

      if (has(/\b(thank|thanks|thank you|appreciate|cheers)\b/)) {
        return {
          text: `You're welcome! Feel free to ask anything else about Ferdinand's certificates, hobbies, skills, or projects.`,
          topic: "greeting",
          followUps: defaultPrompts
        };
      }

      if (has(/\b(bye|goodbye|see you|later|ciao|take care)\b/)) {
        return {
          text: `Goodbye! Feel free to come back anytime or reach Ferdinand directly at ${siteFacts.contact.email}.`,
          topic: "greeting",
          followUps: [
            { label: "Contact", prompt: "How can I contact you?" },
            { label: "Projects", prompt: "Show me your projects." }
          ]
        };
      }

      if (has(/\b(surprise me|random|fun fact|tell me something|did you know|interesting)\b/)) {
        const funFacts = [
          `Ferdinand has verified certificates in **AI Foundations** (OpenAI) and **Claude 101** (Anthropic)!`,
          `Ferdinand has been building for the web since **2008** — over 16 years of digital experience.`,
          `The alias **"Black Raven"** comes from Ferdinand's longtime online handle, ravenom_007.`,
          `Ferdinand took an unforgettable solo journey across **Japan**, exploring Tokyo and enjoying authentic Ichiran Ramen!`,
          `Ferdinand's project **Echoes** is a fully featured music player built with Angular.`,
          `Ferdinand has worked with companies like **Visa**, **Nasdaq**, and **Smart Communications** throughout his career.`
        ];
        return {
          text: funFacts[Math.floor(Math.random() * funFacts.length)],
          topic: "fun",
          followUps: [
            { label: "Another one", prompt: "Surprise me!" },
            { label: "Certificates", prompt: "What certificates do you have?" },
            { label: "Japan Trip", prompt: "Tell me about your travel to Japan" }
          ]
        };
      }

      // Key topic recognition
      const wantsCertificates = has(/\b(cert|certs|certificate|certificates|certification|certifications|credential|credentials|diploma|diplomas|licensed|license|licenses|accredited|accreditation|accreditations|certified|qualification|qualifications)\b/);
      const wantsHobbies = has(/\b(hobb(y|ies)|pastime|pastimes|leisure|free time|spare time|for fun|outside of work|gym|workout|workouts|fitness|gaming|games|gamer|video games|painting|drawing|art)\b/);
      const wantsInterests = has(/\b(interest|interests|passion|passions|interested in|music|sound|audiophile|martial art|martial arts|karate|photography|photos|reading|books|travel|traveling|travels|trip|trips|japan|tokyo|narita|ichiran|disneyland|vacation|exploring)\b/);
      const wantsSkills = has(/\b(skill|skills|tech stack|stack|technolog(y|ies)|front[- ]?end|back[- ]?end|full[- ]?stack|languages?|frameworks?|react|vue|angular|svelte|nextjs|node|php|python|laravel|typescript|javascript|database|databases)\b/);
      const wantsExperience = has(/\b(experience|timeline|work history|career|employment|jobs?|companies|company|worked for|background|roles?|resume|cv)\b/);
      const wantsProjects = has(/\b(project|projects|portfolio|portfolio items|apps?|applications?|demos?|works?|what (have you|has he) built|sudoku|myonlinesite|worldstime|space snake|memory matrix|next ide|digital signature|dinner wheel|echoes)\b/);
      const wantsServices = has(/\b(service|services|offer|offers|offering|offerings|what can you do|what services|hire|hiring|freelance|rate|rates|pricing|price|cost|quote)\b/);
      const wantsContact = has(/\b(contact|email|phone|call|reach|message|touch|location|address|where (are you|is he) (based|located|living)|social|socials|github|linkedin|instagram)\b/);
      const wantsEducation = has(/\b(education|degree|college|university|graduated|graduate|bsit|bachelor|school|academic)\b/);
      const wantsAI = has(/\b(ai|artificial intelligence|ai tools|copilot|claude|cursor|cline|codex|antigravity|devin|unsloth)\b/);
      const wantsAbout = has(/\b(who (is|are) (ferdinand|he|black raven|you)|tell me about (him|ferdinand|black raven|yourself)|bio|biography|profile|overview)\b/);

      // Specific sub-topic queries
      const hasOpenAICert = has(/\b(openai|ai foundations)\b/);
      const hasAnthropicCert = has(/\b(anthropic|claude 101)\b/);
      const hasAzureCert = has(/\b(azure|microsoft)\b/);
      const hasItilCert = has(/\b(itil|itil 4|it service)\b/);
      const hasHpCert = has(/\b(hp|cybersecurity awareness|ai for business)\b/);
      const hasJapanTravel = has(/\b(japan|tokyo|narita|ichiran|disneyland|travel|trip)\b/);
      const hasMusicInterest = has(/\b(music|sound|audiophile|echoes)\b/);
      const hasGymHobby = has(/\b(gym|workout|fitness|strength training)\b/);
      const hasGamesHobby = has(/\b(game|games|gaming|gamer)\b/);
      const hasPaintingHobby = has(/\b(painting|draw|drawing|art|visual art)\b/);

      // Specific project matching
      const projectMap = {
        sudoku: { name: "Sudoku Solver", stack: "React", url: "https://sudoku-solver-raven.vercel.app/" },
        myonlinesite: { name: "MyOnlineSite", stack: "Angular", url: "https://festoque-v1-blkred.vercel.app/" },
        worldstime: { name: "WorldsTime", stack: "Next.js", url: "https://next-world-time-raven-v1.vercel.app/" },
        snake: { name: "Space Snake", stack: "Vue", url: "https://vue-space-snake-raven.vercel.app/" },
        memory: { name: "Memory Matrix", stack: "Angular", url: "https://angular-memory-card-game-raven.vercel.app/" },
        ide: { name: "NEXT IDE", stack: "Next.js", url: "https://next-web-based-ide-raven.vercel.app/" },
        signature: { name: "Digital Signature Pro", stack: "Vue", url: "https://digital-signature-raven-pro.vercel.app/" },
        dinner: { name: "Whats for Dinner Wheel", stack: "Vue", url: "https://vue-whats-for-dinner-wheel-raven.vercel.app/" },
        echoes: { name: "Echoes Music Player", stack: "Angular", url: "https://festoqufx-github-io-echoes-music-pl.vercel.app/#/search/videos" }
      };
      const matchedProjectKey = Object.keys(projectMap).find((key) => q.includes(key));

      // Count matched categories to handle compound multi-topic queries
      const matchedCategories = [];
      if (wantsCertificates) matchedCategories.push("certificates");
      if (wantsHobbies) matchedCategories.push("hobbies");
      if (wantsInterests) matchedCategories.push("interests");
      if (wantsSkills) matchedCategories.push("skills");
      if (wantsExperience) matchedCategories.push("experience");
      if (wantsProjects && !matchedProjectKey) matchedCategories.push("projects");
      if (wantsServices) matchedCategories.push("services");
      if (wantsContact) matchedCategories.push("contact");
      if (wantsEducation) matchedCategories.push("education");

      // Multi-topic compound queries (e.g. "What are his certificates, hobbies, or interests?")
      if (matchedCategories.length > 1) {
        const sections = [];
        const followUps = [];

        if (wantsCertificates) {
          sections.push(`**Certificates**:\n${formatList(siteFacts.certificates)}`);
          followUps.push({ label: "Certificates", prompt: "Tell me more about certificates" });
        }
        if (wantsHobbies) {
          sections.push(`**Hobbies**:\n${formatList(siteFacts.hobbies)}`);
          followUps.push({ label: "Hobbies", prompt: "What are his hobbies?" });
        }
        if (wantsInterests) {
          sections.push(`**Interests**:\n${formatList(siteFacts.interests)}`);
          followUps.push({ label: "Interests", prompt: "Tell me about his interests" });
        }
        if (wantsSkills) {
          sections.push(`**Skills & Tech Stack**:\n${formatList(siteFacts.skills.slice(0, 10))} and more.`);
          followUps.push({ label: "Skills", prompt: "What are your skills?" });
        }
        if (wantsExperience) {
          sections.push(`**Experience**:\n${formatList(siteFacts.experience)}`);
          followUps.push({ label: "Experience", prompt: "Tell me about your experience" });
        }
        if (wantsProjects && !matchedProjectKey) {
          sections.push(`**Featured Projects**:\n${formatList(siteFacts.projects.slice(0, 5))}`);
          followUps.push({ label: "Projects", prompt: "Show me your projects" });
        }
        if (wantsServices) {
          sections.push(`**Services Offered**:\n${formatList(siteFacts.services)}`);
          followUps.push({ label: "Services", prompt: "What services do you offer?" });
        }
        if (wantsContact) {
          sections.push(`**Contact Information**:\n- Email: ${siteFacts.contact.email}\n- Phone: ${siteFacts.contact.phone}\n- Location: ${siteFacts.location}`);
          followUps.push({ label: "Contact", prompt: "How can I contact you?" });
        }
        if (wantsEducation) {
          sections.push(`**Education**:\n- ${siteFacts.education}`);
        }

        return {
          text: `Here is the relevant information from Ferdinand Estoque's website:\n\n${sections.join("\n\n")}`,
          topic: "compound",
          followUps: followUps.slice(0, 4)
        };
      }

      // Specific Project query
      if (matchedProjectKey) {
        const p = projectMap[matchedProjectKey];
        return {
          text: `**${p.name}** is a project built with **${p.stack}**.\nLive demo: ${p.url}\nSource code is also available on GitHub at https://github.com/festoqufx`,
          topic: "projects",
          followUps: [
            { label: "All projects", prompt: "Show me your projects." },
            { label: "Skills", prompt: "What are your skills?" },
            { label: "Contact", prompt: "How can I contact you?" }
          ]
        };
      }

      // Specific Certificate queries
      if (wantsCertificates) {
        if (hasOpenAICert) {
          return {
            text: `Ferdinand holds the **AI Foundations** certificate by **OpenAI**.\nIt validates foundational AI knowledge and practical understanding of AI concepts.\nURL: https://academy.openai.com/home/certificate/u77flalmmn`,
            topic: "certificates",
            followUps: [
              { label: "Anthropic Cert", prompt: "Anthropic certificate" },
              { label: "All Certificates", prompt: "What certificates do you have?" },
              { label: "Skills", prompt: "What are your skills?" }
            ]
          };
        }
        if (hasAnthropicCert) {
          return {
            text: `Ferdinand holds the **Anthropic Claude 101** certificate by **Anthropic**.\nIt validates foundational knowledge of Claude and its practical use in AI-assisted work.\nURL: https://verify.skilljar.com/c/tadt9xixkhts`,
            topic: "certificates",
            followUps: [
              { label: "OpenAI Cert", prompt: "OpenAI certificate" },
              { label: "All Certificates", prompt: "What certificates do you have?" },
              { label: "AI Tools", prompt: "What AI tools do you use?" }
            ]
          };
        }
        if (hasAzureCert) {
          return {
            text: `Ferdinand holds the **Azure Fundamentals** certificate by **Microsoft** (via SimpliLearn).\nIt validates foundational knowledge of Azure cloud services and core cloud computing concepts.\nURL: https://simpli-web.app.link/e/4k1LYawGU5b`,
            topic: "certificates",
            followUps: [
              { label: "ITIL Cert", prompt: "Tell me about the ITIL certificate." },
              { label: "All Certificates", prompt: "What certificates do you have?" }
            ]
          };
        }
        if (hasItilCert) {
          return {
            text: `Ferdinand holds the **ITIL V4 certificate** by **SimpliLearn**.\nIt validates knowledge of ITIL 4 practices for effective IT service management and delivery.\nURL: https://simpli-web.app.link/e/nIHO6LMkU5b`,
            topic: "certificates",
            followUps: [
              { label: "Azure Cert", prompt: "Tell me about the Azure certificate." },
              { label: "All Certificates", prompt: "What certificates do you have?" }
            ]
          };
        }
        if (hasHpCert) {
          return {
            text: `Ferdinand holds two certifications from **HP (LIFE Global)**:\n- **Cybersecurity Awareness**: https://www.life-global.org/certificate/78f4c7bc-0144-428d-b48e-da9d56424494\n- **AI for Business Professionals**: https://www.life-global.org/certificate/a9de57e0-d363-4326-911a-d41b40a0311d`,
            topic: "certificates",
            followUps: [
              { label: "OpenAI Cert", prompt: "OpenAI certificate" },
              { label: "Anthropic Cert", prompt: "Anthropic certificate" },
              { label: "All Certificates", prompt: "What certificates do you have?" }
            ]
          };
        }
        return {
          text: `Ferdinand holds several professional certificates validating his expertise in AI, Cloud, and IT Service Management:\n\n${formatList(siteFacts.certificates)}\n\nYou can view the badges and credentials directly in the Certificates section!`,
          topic: "certificates",
          followUps: [
            { label: "Anthropic Cert", prompt: "Tell me about the Anthropic certificate." },
            { label: "OpenAI Cert", prompt: "Tell me about the OpenAI certificate." },
            { label: "Skills", prompt: "What are your technical skills?" }
          ]
        };
      }

      // Hobbies queries
      if (wantsHobbies && !wantsInterests) {
        if (hasGymHobby) {
          return {
            text: `Ferdinand's fitness hobby includes daily workouts, strength training, and physical discipline to stay energized and focused.`,
            topic: "hobbies",
            followUps: [{ label: "Other Hobbies", prompt: "What other hobbies do you have?" }, { label: "Interests", prompt: "What are your interests?" }]
          };
        }
        if (hasGamesHobby) {
          return {
            text: `Ferdinand enjoys strategy games and retro classics, as well as studying interactive game mechanics.`,
            topic: "hobbies",
            followUps: [{ label: "Other Hobbies", prompt: "What other hobbies do you have?" }, { label: "Projects", prompt: "Show me your projects." }]
          };
        }
        if (hasPaintingHobby) {
          return {
            text: `Ferdinand practices traditional and digital painting, visual composition, and artistic illustration.`,
            topic: "hobbies",
            followUps: [{ label: "Other Hobbies", prompt: "What other hobbies do you have?" }, { label: "Design Skills", prompt: "What design tools do you use?" }]
          };
        }
        return {
          text: `Here is what Ferdinand enjoys doing in his free time:\n\n${formatList(siteFacts.hobbies)}`,
          topic: "hobbies",
          followUps: [
            { label: "Interests", prompt: "What are your interests?" },
            { label: "Certificates", prompt: "What certificates do you hold?" },
            { label: "Projects", prompt: "Show me your projects." }
          ]
        };
      }

      // Interests queries
      if (wantsInterests && !wantsHobbies) {
        if (hasJapanTravel) {
          return {
            text: `One of Ferdinand's most memorable travel experiences was an incredible solo trip to **Japan**!\nHe explored Tokyo at his own pace, visited Narita, stayed near Tokyo Disneyland, and enjoyed quiet moments savoring authentic Japanese ramen at Ichiran. It was a perfect blend of culture, food, and solo adventure.`,
            topic: "interests",
            followUps: [
              { label: "Other Interests", prompt: "What other interests do you have?" },
              { label: "Hobbies", prompt: "What are your hobbies?" },
              { label: "Experience", prompt: "Tell me about your experience." }
            ]
          };
        }
        if (hasMusicInterest) {
          return {
            text: `Ferdinand is an audiophile passionate about high-fidelity sound and created **Echoes Music Player**, an interactive web app built with Angular!\nLive demo: https://festoqufx-github-io-echoes-music-pl.vercel.app/#/search/videos`,
            topic: "interests",
            followUps: [
              { label: "Other Interests", prompt: "What other interests do you have?" },
              { label: "Hobbies", prompt: "What are your hobbies?" },
              { label: "Projects", prompt: "Show me your projects." }
            ]
          };
        }
        return {
          text: `Ferdinand is passionate about several diverse topics:\n\n${formatList(siteFacts.interests)}`,
          topic: "interests",
          followUps: [
            { label: "Hobbies", prompt: "What are your hobbies?" },
            { label: "Japan Trip", prompt: "Tell me about your trip to Japan!" },
            { label: "Contact", prompt: "How can I contact you?" }
          ]
        };
      }

      // Skills & Stack
      if (wantsSkills) {
        if (has(/\b(front[- ]?end|front end|ui|ui\/ux|design)\b/)) {
          return {
            text: `For front-end and design work, the site highlights:\n${formatList(skillGroups.frontEnd)}\n\nDesign and workflow tools:\n${formatList(skillGroups.design)}`,
            topic: "skills",
            followUps: [
              { label: "Back-end skills", prompt: "What back-end skills do you use?" },
              { label: "AI tools", prompt: "What AI tools do you use?" },
              { label: "Projects", prompt: "Show me your projects." }
            ]
          };
        }
        if (has(/\b(back[- ]?end|backend|server|api|database)\b/)) {
          return {
            text: `Back-end and data-focused skills shown on the site include:\n${formatList(skillGroups.backEnd)}`,
            topic: "skills",
            followUps: [
              { label: "Front-end skills", prompt: "What front-end skills do you use?" },
              { label: "Experience", prompt: "Tell me about your experience." },
              { label: "Services", prompt: "What services do you offer?" }
            ]
          };
        }
        return {
          text: `Here is a quick snapshot of the main skills and tools on the site:\n${formatList(siteFacts.skills)}\n\nIf you want, I can also group them by front-end, back-end, design, or AI tools.`,
          topic: "skills",
          followUps: [
            { label: "Front-end", prompt: "What front-end skills do you use?" },
            { label: "Back-end", prompt: "What back-end skills do you use?" },
            { label: "AI tools", prompt: "What AI tools do you use?" }
          ]
        };
      }

      // Experience
      if (wantsExperience) {
        return {
          text: `Here is the experience timeline on the page:\n\n${formatList(siteFacts.experience)}\n\nHe has over 16 years of professional experience across development and content management.`,
          topic: "experience",
          followUps: [
            { label: "Projects", prompt: "Show me your projects." },
            { label: "Services", prompt: "What services do you offer?" },
            { label: "Education", prompt: "What is your education?" }
          ]
        };
      }

      // Projects
      if (wantsProjects) {
        return {
          text: `Some featured projects from the portfolio are:\n\n${formatList(siteFacts.projects)}\n\nYou can also use the Projects section to open live demos and source links.`,
          topic: "projects",
          followUps: [
            { label: "Skills", prompt: "What are your skills?" },
            { label: "Contact", prompt: "How can I contact you?" },
            { label: "Experience", prompt: "Tell me about your experience." }
          ]
        };
      }

      // Contact & Socials
      if (wantsContact) {
        return {
          text: `You can reach Ferdinand here:\n- Email: ${siteFacts.contact.email}\n- Phone: ${siteFacts.contact.phone}\n- Location: ${siteFacts.location}\n- GitHub: https://github.com/festoqufx\n- LinkedIn: https://www.linkedin.com/in/ferdinand-estoque-46797876\n- Instagram: https://www.instagram.com/ravenom_007`,
          topic: "contact",
          followUps: [
            { label: "Services", prompt: "What services do you offer?" },
            { label: "Projects", prompt: "Show me your projects." },
            { label: "Certificates", prompt: "What certificates do you have?" }
          ]
        };
      }

      // Services
      if (wantsServices) {
        return {
          text: `The site highlights these services:\n${formatList(siteFacts.services)}\n\nRates are flexible and project-based. Reach out at ${siteFacts.contact.email} for inquiries!`,
          topic: "services",
          followUps: [
            { label: "Contact", prompt: "How can I contact you?" },
            { label: "Projects", prompt: "Show me your projects." },
            { label: "Skills", prompt: "What are your skills?" }
          ]
        };
      }

      // Education
      if (wantsEducation) {
        return {
          text: `Education on the site: **${siteFacts.education}**.`,
          topic: "education",
          followUps: [
            { label: "Experience", prompt: "Tell me about your experience." },
            { label: "Skills", prompt: "What are your skills?" },
            { label: "Certificates", prompt: "What certificates do you have?" }
          ]
        };
      }

      // AI tools
      if (wantsAI) {
        return {
          text: `Ferdinand uses modern AI-assisted development tools such as ${siteFacts.aiTools.join(", ")}. These help with drafting, prototyping, and accelerating development while keeping quality high.`,
          topic: "ai",
          followUps: [
            { label: "OpenAI Cert", prompt: "Tell me about the OpenAI certificate" },
            { label: "Anthropic Cert", prompt: "Tell me about the Anthropic certificate" },
            { label: "Skills", prompt: "What are your skills?" }
          ]
        };
      }

      // About
      if (wantsAbout) {
        return {
          text: `${siteFacts.name}, also known as **${siteFacts.alias}**, is a ${siteFacts.title} based in ${siteFacts.location}. He has ${siteFacts.experienceYears} of experience building modern digital experiences across design, development, and AI-assisted workflows.`,
          topic: "about",
          followUps: [
            { label: "Certificates", prompt: "What certificates do you have?" },
            { label: "Hobbies & Interests", prompt: "What are your hobbies and interests?" },
            { label: "Skills", prompt: "What are your skills?" }
          ]
        };
      }

      // Website
      if (has(/\b(website|site|page|sections|this site|your site)\b/)) {
        return {
          text: `This website is Ferdinand Estoque's portfolio, showcasing his About, Experience, Tech Stack, Projects, Certificates, Hobbies & Interests, Services, Testimonials, and Contact sections.`,
          topic: "website",
          followUps: defaultPrompts
        };
      }

      // Fallback: When information is NOT available on the website
      return {
        text: `I could not find that information on Ferdinand Estoque's website. I can only provide details based on the website's published content, such as his certificates, hobbies, interests, skills, experience, projects, services, education, and contact details.`,
        topic: "unknown",
        followUps: defaultPrompts
      };
    };

    const applyReply = (reply) => {
      state.topic = reply.topic || "general";
      updatePromptButtons(reply.followUps || defaultPrompts);
      pushMessage("bot", reply.text, { topic: state.topic, followUps: reply.followUps || defaultPrompts });
      if (!state.open || state.minimized) notifyUnread();
    };

    const renderInitialConversation = () => {
      messages.textContent = "";
      state.messages = [];
      state.topic = "general";
      updatePromptButtons(defaultPrompts);
      pushMessage("bot", `Hi. I can answer questions about Ferdinand's skills, experience, projects, services, contact details, education, AI tools, and the website itself.`, { topic: "general", followUps: defaultPrompts });
      state.unread = 0;
      setBadge(0);
      saveHistory();
    };

    const sendMessage = (rawText) => {
      const text = rawText.trim();
      if (!text || state.awaitingResponse) return;

      pushMessage("user", text);
      input.value = "";
      if (charCount) { charCount.textContent = "280"; charCount.classList.remove("is-near-limit"); }
      state.awaitingResponse = true;
      state.responseToken += 1;
      const token = state.responseToken;
      setBusy(true);
      setTyping(true);

      const delay = Math.min(1100, 380 + Math.sqrt(text.length) * 60);
      window.setTimeout(() => {
        if (token !== state.responseToken) return; // cancelled by clear/close
        const reply = answerFromRules(text);
        setTyping(false);
        applyReply(reply);
        setBusy(false);
        state.awaitingResponse = false;
        input.focus();
      }, delay);
    };

    launcher.addEventListener("click", () => {
      if (panel.hidden) {
        setOpen(true);
        return;
      }
      if (state.minimized) {
        setMinimized(false);
        return;
      }
      setMinimized(true);
    });

    closeBtn.addEventListener("click", () => {
      setOpen(false);
    });

    minimizeBtn.addEventListener("click", () => {
      if (panel.hidden) {
        setOpen(true);
        setMinimized(true);
        return;
      }
      setMinimized(!state.minimized);
    });

    clearBtn.addEventListener("click", () => {
      state.responseToken += 1; // cancel any in-flight reply
      renderInitialConversation();
      input.value = "";
      if (charCount) { charCount.textContent = "280"; charCount.classList.remove("is-near-limit"); }
      setTyping(false);
      setBusy(false);
      state.awaitingResponse = false;
      setOpen(true);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(input.value);
    });

    if (charCount) {
      input.addEventListener("input", () => {
        const remaining = (input.maxLength || 280) - input.value.length;
        charCount.textContent = remaining;
        charCount.classList.toggle("is-near-limit", remaining <= 30);
      });
    }

    if (scrollBtn) {
      const updateScrollBtn = () => {
        const atBottom = messages.scrollHeight - messages.scrollTop - messages.clientHeight < 48;
        scrollBtn.classList.toggle("is-visible", !atBottom);
      };
      messages.addEventListener("scroll", updateScrollBtn, { passive: true });
      scrollBtn.addEventListener("click", () => {
        messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
      });
    }

    promptButtons.forEach((button) => {
      button.addEventListener("click", () => {
        sendMessage(button.dataset.prompt || button.textContent || "");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        setOpen(false);
        return;
      }
      // Press / (when not already typing) to open and focus the chat
      if (event.key === "/" && !event.ctrlKey && !event.altKey && !event.metaKey) {
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        const isEditable = tag === "input" || tag === "textarea" || tag === "select" || document.activeElement?.isContentEditable;
        if (!isEditable) {
          event.preventDefault();
          if (panel.hidden) {
            setOpen(true);
          } else if (state.minimized) {
            setMinimized(false);
          }
          window.setTimeout(() => input.focus(), 60);
        }
      }
    });

    const savedMessages = readHistory();
    const prefs = readPrefs();
    state.messages = Array.isArray(savedMessages) ? savedMessages.slice(-maxHistoryItems) : [];
    state.messages = state.messages.map((message) => ({
      role: message.role === "user" ? "user" : "bot",
      text: String(message.text || ""),
      time: message.time || nowLabel(),
      topic: message.topic || "general",
      followUps: Array.isArray(message.followUps) ? message.followUps : null
    })).filter((message) => message.text);

    if (state.messages.length) {
      renderHistory();
      const lastBotMessage = [...state.messages].reverse().find((message) => message.role === "bot");
      updatePromptButtons(lastBotMessage?.followUps || defaultPrompts);
      state.topic = lastBotMessage?.topic || "general";
    } else {
      renderInitialConversation();
    }

    setBadge(0);
    setTyping(false);
    setBusy(false);
    panel.hidden = true;
    widget.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    if (prefs.minimized && state.messages.length) {
      setMinimized(true);
    }
  };

  const bootAskAnythingChat = () => {
    if (window.__askAnythingReady) return;
    window.__askAnythingReady = true;
    initAskAnythingChat();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAskAnythingChat);
  } else {
    bootAskAnythingChat();
  }
})();
