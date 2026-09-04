document.addEventListener("DOMContentLoaded", function () {
  const slideInItems = document.querySelectorAll(".slide-up-animated");
  if (!slideInItems) return;
  slideInItems.forEach((item) => {
    item.classList.add("animation-start");
  });
});
function getSliderSettings() {
  return {
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };
}

function getSubSliderProductSettings() {
  return {
    slidesPerView: "auto",
    direction: "vertical",
    navigation: false,
  };
}

function updatethumbnail() {
  if (document.querySelector(".quick-add-modal .product__media-list")) {
    let productList = document.querySelector(
      ".quick-add-modal .product__media-list"
    );
    let mediaHeight = productList && productList.offsetHeight;
    let mediaThumbHeight = document.querySelector(
      ".quick-add-modal .product__media-sublist"
    );
    if (mediaThumbHeight) {
      if (window.innerWidth > 576) {
        mediaThumbHeight.style.height = mediaHeight + "px";
      }
      if (window.innerWidth < 576) {
        mediaThumbHeight.style.height = 100 + "%";
      }
    }
  } else {
    let productList = document.querySelector(
      ".product-section .product__media-list"
    );
    let mediaHeight = productList && productList.offsetHeight;
    let mediaThumbHeight = document.querySelector(
      ".product-section .product__media-sublist"
    );
    if (mediaThumbHeight) {
      if (window.innerWidth > 576) {
        mediaThumbHeight.style.height = mediaHeight + "px";
      }
      if (window.innerWidth < 576) {
        mediaThumbHeight.style.height = 100 + "%";
      }
    }
  }
}

const sliderInit = (isUpdate) => {
  if (
    document.querySelectorAll(".js-media-list") &&
    document.querySelectorAll(".js-media-list").length > 0
  ) {
    document.querySelectorAll(".js-media-list").forEach((elem, index) => {
      if (elem.swiper) {
        if (isUpdate) {
          setTimeout(() => {
            elem.swiper.update();
            updatethumbnail();
          }, 300);
        }
        return;
      }
      const sublistEl = document.querySelectorAll(".js-media-sublist")[index];
      let slider = new Swiper(elem, {
        slidesPerView: 1,
        //autoHeight: true,
        spaceBetween: 24,
        navigation: {
          nextEl: ".swiper-btn--next",
          prevEl: ".swiper-btn--prev",
        },
        thumbs: sublistEl ? { swiper: sublistEl.swiper } : {},
        on: {
          slideChangeTransitionStart: function () {
            const subEl = document.querySelectorAll(".js-media-sublist")[index];
            if (subEl?.swiper) {
              subEl.swiper.slideTo(
                document.querySelectorAll(".js-media-list")[index].swiper
                  .activeIndex
              );
            }
          },
          slideChange: function () {
            window.pauseAllMedia();
            this.params.noSwiping = false;
          },
          slideChangeTransitionEnd: function () {
            if (this.slides[this.activeIndex].querySelector("model-viewer")) {
              this.slides[this.activeIndex]
                .querySelector(".shopify-model-viewer-ui__button--poster")
                .removeAttribute("hidden");
            }
          },
          touchStart: function () {
            if (this.slides[this.activeIndex].querySelector("model-viewer")) {
              if (
                !this.slides[this.activeIndex]
                  .querySelector("model-viewer")
                  .classList.contains("shopify-model-viewer-ui__disabled")
              ) {
                this.params.noSwiping = true;
                this.params.noSwipingClass = "swiper-slide";
              } else {
                this.params.noSwiping = false;
              }
            }
          },
        },
      });

      if (isUpdate) {
        setTimeout(function () {
          slider.update();
          updatethumbnail();
        }, 300);
      }
    });
  }
};

const subSliderInit = (isUpdate) => {
  if (
    document.querySelectorAll(".js-media-sublist") &&
    document.querySelectorAll(".js-media-sublist").length > 0
  ) {
    document.querySelectorAll(".js-media-sublist").forEach((elem, index) => {
      if (elem.swiper) {
        if (isUpdate) {
          setTimeout(() => {
            elem.swiper.update();
          }, 800);
        }
        return;
      }
      let subSlider = new Swiper(elem, {
        centeredSlides: true,
        centeredSlidesBounds: true,
        slideToClickedSlide: true,
        watchSlidesProgress: true,
        updateOnWindowResize: true,
        slidesPerView: 3,
        direction: "horizontal",
        navigation: false,
        freeMode: false,
        on: {
          touchEnd: function (s, e) {
            let range = 5;
            let diff = (s.touches.diff = s.isHorizontal()
              ? s.touches.currentX - s.touches.startX
              : s.touches.currentY - s.touches.startY);
            if (diff < range || diff > -range) s.allowClick = true;
          },
          transitionStart: function () {
            if (!this.swipeDirection) return;
            const mainEl = document.querySelectorAll(".js-media-list")[index];
            if (mainEl?.swiper) {
              mainEl.swiper.slideTo(this.activeIndex);
            }
          },
        },
        breakpoints: {
          576: {
            direction: "vertical",
          },
        },
      });

      subSlider.on("toEdge", function () {
        if (subSlider.slides.length <= 3) {
          subSlider.params.centeredSlides = false;
          subSlider.update();
        }
      });

      if (isUpdate) {
        setTimeout(function () {
          subSlider.update();
        }, 800);
      }
    });
  }
};

let allSections = document.querySelectorAll("section");

window.addEventListener("resize", () => {
  allSections.forEach((prodSection) => {
    if (prodSection.classList.contains("product-section")) {
      setTimeout(() => {
        updatethumbnail();
      }, 50);
    }
  });
});

document.addEventListener("visibilitychange", function () {
  allSections.forEach((prodSection) => {
    if (prodSection.classList.contains("product-section")) {
      setTimeout(() => {
        updatethumbnail();
      }, 50);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  allSections.forEach((prodSection) => {
    if (prodSection.classList.contains("product-section")) {
      setTimeout(() => {
        updatethumbnail();
      }, 50);
    }
  });
});

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button");
  summary.setAttribute("aria-expanded", "false");

  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id);
  }

  summary.addEventListener("click", (event) => {
    event.currentTarget.setAttribute(
      "aria-expanded",
      !event.currentTarget.closest("details").hasAttribute("open")
    );
  });

  if (summary.closest("header-drawer")) return;
  summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

function onKeyUpEscape(event) {
  if (event.code?.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => video.pause());
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );

    this.input.addEventListener("change", this.onInputChange.bind(this));

    const eventList = ["paste", "input"];

    for (const evt of eventList) {
      this.input.addEventListener(evt, (e) => {
        const numberRegex = /^0*?[1-9]\d*$/;

        if (
          numberRegex.test(e.currentTarget.value) ||
          e.currentTarget.value === ""
        ) {
          e.currentTarget.value;
        } else {
          e.currentTarget.value = this.minValue;
        }
      });
    }

    this.input.addEventListener("focusout", (e) => {
      if (e.currentTarget.value === "") {
        e.currentTarget.value = this.minValue;
      }
    });
  }

  quantityUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.validateQtyRules();
    if (typeof subscribe === "function") {
      this.quantityUpdateUnsubscriber = subscribe(
        PUB_SUB_EVENTS.quantityUpdate,
        this.validateQtyRules.bind(this)
      );
    }
  }

  disconnectedCallback() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
    clearTimeout(this._messageTimeout);
  }

  get minValue() {
    const min = parseInt(this.input.min, 10);
    return isNaN(min) ? 1 : min;
  }

  get maxValue() {
    const max = parseInt(this.input.max, 10);
    return this.input.max !== "" && !isNaN(max) ? max : null;
  }

  onInputChange() {
    this.enforceBounds();
    this.validateQtyRules();
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;
    const current = parseInt(this.input.value, 10) || 0;
    const min = this.minValue;
    const max = this.maxValue;

    if (event.target.name === "plus") {
      if (max !== null && current >= max) {
        this.showRuleMessage("max", max);
      } else {
        this.input.stepUp();
      }
    } else {
      if (current <= min) {
        this.showRuleMessage("min", min);
      } else {
        this.input.stepDown();
      }
    }

    if (previousValue !== this.input.value) {
      this.input.dispatchEvent(this.changeEvent);
    }

    this.validateQtyRules();
  }

  // Clamp a manually typed value into the [min, max] range and notify the user.
  enforceBounds() {
    const value = parseInt(this.input.value, 10);
    if (isNaN(value)) return;

    const min = this.minValue;
    const max = this.maxValue;

    if (value < min) {
      this.input.value = min;
      this.showRuleMessage("min", min);
    } else if (max !== null && value > max) {
      this.input.value = max;
      this.showRuleMessage("max", max);
    }
  }

  // Disable the + button at the maximum and the - button at the minimum.
  validateQtyRules() {
    const value = parseInt(this.input.value, 10);
    const buttonMinus = this.querySelector('.quantity__button[name="minus"]');
    const buttonPlus = this.querySelector('.quantity__button[name="plus"]');

    if (buttonMinus && this.input.min !== "") {
      buttonMinus.toggleAttribute("disabled", value <= this.minValue);
    }

    if (buttonPlus && this.maxValue !== null) {
      buttonPlus.toggleAttribute("disabled", value >= this.maxValue);
    }
  }

  get messageElement() {
    if (this._messageElement && this._messageElement.isConnected) {
      return this._messageElement;
    }

    let el = this.parentElement?.querySelector(
      ":scope > .quantity__rules-message"
    );
    if (!el) {
      el = document.createElement("div");
      el.className = "quantity__rules-message";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.hidden = true;
      this.insertAdjacentElement("afterend", el);
    }
    this._messageElement = el;
    return el;
  }

  showRuleMessage(type, quantity) {
    const strings = window.quantityStrings || {};
    const template =
      type === "max"
        ? strings.maxError || "Quantity must be [quantity] or less"
        : strings.minError || "Quantity must be [quantity] or more";
    const el = this.messageElement;

    el.textContent = template.replace("[quantity]", quantity);
    el.hidden = false;

    clearTimeout(this._messageTimeout);
    this._messageTimeout = setTimeout(() => {
      el.hidden = true;
    }, 3000);
  }
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector("details");
    const summaryElements = this.querySelectorAll("summary");
    this.addAccessibilityAttributes(summaryElements);

    if (navigator.platform === "iPhone")
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${window.innerHeight}px`
      );

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    document
      .getElementById("MenuDrawer-Overlay")
      .addEventListener("click", this.closeMenuDrawerOverlay);
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    );
    this.querySelectorAll("button").forEach((button) => {
      if (this.querySelector(".header__localization-button") === button) return;
      if (this.querySelector(".header__localization-lang-button") === button)
        return;
      button.addEventListener("click", this.onCloseButtonClick.bind(this));
    });
  }

  addAccessibilityAttributes(summaryElements) {
    summaryElements.forEach((element) => {
      element.setAttribute("role", "button");
      element.setAttribute("aria-expanded", false);
      element.setAttribute("aria-controls", element.nextElementSibling.id);
    });
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector("summary"))
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute("open");

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen
        ? this.closeMenuDrawer(summaryElement)
        : this.openMenuDrawer(summaryElement);
    } else {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button")
      );

      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
      });
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove("menu-opening");
      this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open");
        details.classList.remove("menu-opening");
      });
      this.mainDetailsToggle
        .querySelector("summary")
        .setAttribute("aria-expanded", false);
      document.body.classList.remove(
        `overflow-hidden-${this.dataset.breakpoint}`
      );
      removeTrapFocus(elementToFocus);
      this.closeAnimation(this.mainDetailsToggle);
    }
  }

  closeMenuDrawerOverlay() {
    document
      .querySelector(".menu-drawer-container")
      .classList.remove("menu-opening");

    document.querySelector(".menu-drawer-container").removeAttribute("open");
    document
      .querySelector(".header__icon--menu")
      .setAttribute("aria-expanded", false);
    document.body.classList.remove(
      `overflow-hidden-${this.dataset.breakpoint}`
    );
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest("details");
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove("menu-opening");
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary")
          );
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header =
      this.header || document.querySelector(".shopify-section-header");
    this.borderOffset =
      this.borderOffset ||
      this.closest(".header-wrapper").classList.contains(
        "header-wrapper--border-bottom"
      )
        ? 1
        : 0;
    document.documentElement.style.setProperty(
      "--header-bottom-position",
      `${parseInt(
        this.header.getBoundingClientRect().bottom - this.borderOffset
      )}px`
    );

    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });

    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
}

customElements.define("header-drawer", HeaderDrawer);

class BurgerDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener(
      "keyup",
      (evt) => evt.code === "Escape" && this.close()
    );
    this.querySelector("#BurgerDrawer-Overlay").addEventListener(
      "click",
      this.close.bind(this)
    );

    this.querySelector("#burger-drawer-close").addEventListener(
      "click",
      this.close.bind(this)
    );
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector("#burger-icon-bubble");
    cartLink.setAttribute("role", "button");
    cartLink.setAttribute("aria-haspopup", "dialog");
    cartLink.addEventListener("click", (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener("keydown", (event) => {
      if (event.code.toUpperCase() === "SPACE") {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    setTimeout(() => {
      this.classList.add("animate", "active");
    });

    this.addEventListener(
      "transitionend",
      () => {
        const containerToTrapFocusOn = document.getElementById("BurgerDrawer");
        const focusElement =
          this.querySelector(".drawer__inner") ||
          this.querySelector(".burger__close");
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add("overflow-hidden");
  }

  close() {
    this.classList.remove("active");
    removeTrapFocus(this.activeElement);
    document.body.classList.remove("overflow-hidden");
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define("burger-drawer", BurgerDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this, false)
    );
    this.querySelector('[id^="ModalBackTo-"]') &&
      this.querySelector('[id^="ModalBackTo-"]').addEventListener(
        "click",
        this.hide.bind(this, false)
      );
    this.addEventListener("keyup", (event) => {
      if (event.code.toUpperCase() === "ESCAPE") this.hide();
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide();
      });
    } else {
      this.addEventListener("click", (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (opener.dataset.id) {
      this.classList.add(opener.dataset.id);
    }
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    let isOpen = false;

    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();

    document.querySelectorAll("body > quick-add-modal").forEach((el) => {
      if (el.hasAttribute("open")) {
        isOpen = true;
      }
    });

    if (!isOpen) {
      document.body.classList.remove("overflow-hidden");
      document.body.dispatchEvent(new CustomEvent("modalClosed"));
    }

    if (this) {
      for (const className of Array.from(this.classList)) {
        if (className.startsWith("variant-")) {
          this.classList.remove(className);
        }
      }
    }
  }
}

customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button) return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal) modal.show(button);
    });
  }
}

customElements.define("modal-opener", ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener(
      "click",
      this.loadContent.bind(this)
    );
    if (this.getAttribute("data-autoplay")) {
      this.loadContent();
    }
  }

  loadContent() {
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(true)
      );
      this.setAttribute("loaded", true);
      window.pauseAllMedia();
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (this.getAttribute("data-autoplay")) {
              let playPromise = entry.target.play();
              if (playPromise !== undefined) {
                playPromise.then((_) => {}).catch((error) => {});
              }
            }
          } else {
            entry.target.pause();
          }
        });
      });
      const deferredElement = this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      );

      if (deferredElement.nodeName === "VIDEO") {
        // enforce infinite loop
        deferredElement.loop = true;
        deferredElement.setAttribute("loop", "");
      }

      if (
        deferredElement.nodeName == "VIDEO" ||
        deferredElement.nodeName == "IFRAME"
      ) {
        // force autoplay for safari

        if (this.classList.contains("video-section__media")) {
          let playPromise = deferredElement.play();
          if (playPromise !== undefined) {
            playPromise.then((_) => {}).catch((error) => {});
          }
          videoObserver.observe(deferredElement);
        } else {
          deferredElement.play();
        }
      }
      if (
        this.closest(".swiper")?.swiper.slides[
          this.closest(".swiper").swiper.activeIndex
        ].querySelector("model-viewer")
      ) {
        if (
          !this.closest(".swiper")
            .swiper.slides[
              this.closest(".swiper").swiper.activeIndex
            ].querySelector("model-viewer")
            .classList.contains("shopify-model-viewer-ui__disabled")
        ) {
          this.closest(".swiper").swiper.params.noSwiping = true;
          this.closest(".swiper").swiper.params.noSwipingClass = "swiper-slide";
        }
      }
    }
  }
}

customElements.define("deferred-media", DeferredMedia);

class CardDeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.loadContent();
    // Resume playback when a modal (e.g. Quick View) closes. pauseAllMedia()
    // pauses every video on the page, but the IntersectionObserver only
    // restarts playback on an intersection change, which never fires while the
    // card stays in the viewport — leaving the card video frozen after close.
    document.body.addEventListener(
      "modalClosed",
      this.resumePlayback.bind(this)
    );
  }

  resumePlayback() {
    const media = this.deferredElement;
    if (!media) return;

    // Mirror the IntersectionObserver: only cards visible in the viewport
    // should be playing, so leave off-screen cards paused.
    const rect = this.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inViewport) return;

    if (media.nodeName === "VIDEO") {
      const playPromise = media.play();
      if (playPromise !== undefined) {
        playPromise.then((_) => {}).catch((error) => {});
      }
    } else if (media.nodeName === "IFRAME") {
      if (media.classList.contains("js-youtube")) {
        media.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*"
        );
      } else if (media.classList.contains("js-vimeo")) {
        media.contentWindow?.postMessage('{"method":"play"}', "*");
      }
    }
  }

  loadContent() {
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(true)
      );

      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (this.getAttribute("data-autoplay")) {
              let playPromise = entry.target.play();
              if (playPromise !== undefined) {
                playPromise.then((_) => {}).catch((error) => {});
              }
            }
            entry.target.play();
          } else {
            entry.target.pause();
          }
        });
      });

      const deferredElement = this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      );
      this.deferredElement = deferredElement;

      if (
        deferredElement.nodeName == "VIDEO" ||
        deferredElement.nodeName == "IFRAME"
      ) {
        deferredElement.autoplay = true;
        deferredElement.muted = true;
        deferredElement.play();

        let playPromise = deferredElement.play();
        if (playPromise !== undefined) {
          playPromise.then((_) => {}).catch((error) => {});
        }
        videoObserver.observe(deferredElement);
      }
    }
  }
}

customElements.define("card-deferred-media", CardDeferredMedia);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector(".slider");
    this.sliderItems = this.querySelectorAll(".slider__slide");
    this.pageCount = this.querySelector(".slider-counter--current");
    this.pageTotal = this.querySelector(".slider-counter--total");
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener("scroll", this.update.bind(this));
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this));
  }

  initPages() {
    if (!this.sliderItems.length === 0) return;
    this.slidesPerPage = Math.floor(
      this.slider.clientWidth / this.sliderItems[0].clientWidth
    );
    this.totalPages = this.sliderItems.length - this.slidesPerPage + 1;
    this.update();
  }

  update() {
    if (!this.pageCount || !this.pageTotal) return;
    this.currentPage =
      Math.round(this.slider.scrollLeft / this.sliderItems[0].clientWidth) + 1;

    if (this.currentPage === 1) {
      this.prevButton.setAttribute("disabled", true);
    } else {
      this.prevButton.removeAttribute("disabled");
    }

    if (this.currentPage === this.totalPages) {
      this.nextButton.setAttribute("disabled", true);
    } else {
      this.nextButton.removeAttribute("disabled");
    }

    this.pageCount.textContent = this.currentPage;
    this.pageTotal.textContent = this.totalPages;
  }

  onButtonClick(event) {
    event.preventDefault();
    const slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollLeft + this.sliderItems[0].clientWidth
        : this.slider.scrollLeft - this.sliderItems[0].clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }
}

customElements.define("slider-component", SliderComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);

    this.isHighVariantNeedUpdate = false;
    this.isCombinedListingsNeedUpdate = false;
  }

  onVariantChange(event) {
    if (!this.contains(event.target)) return;

    const combinedProductURL = event.target.dataset?.productUrl;
    const combinedVariantId = event.target.dataset?.variantId;

    this.updateOptions();
    // updateMasterId method updates currentVariant from liquid <script data-all-variations-no-high>
    this.updateMasterId();
    this.toggleAddButton(true, "");

    this.isHighVariantNeedUpdate = false;
    this.isCombinedListingsNeedUpdate = false;
    this._combinedProductURL = null;
    // -----
    // checking for high-variant and combined products
    // if variant not found in liquid <script data-all-variants-no-high> and product is high-variant
    if (
      (!this.currentVariant && this.dataset.isHighVariantProduct === "true") ||
      (!this.currentVariant && combinedProductURL)
    ) {
      // For combined listings use the variant ID from the clicked option directly
      // so the URL points at the correct variant in the linked product.
      // Passing option-value IDs from the current product would not match the linked product.
      const useCombinedVariant = combinedProductURL && combinedVariantId;
      this.highVariantRequestUrl = this.createRequestUrl({
        currentVariantId: useCombinedVariant ? combinedVariantId : "",
        selectedValuesIds: useCombinedVariant
          ? []
          : this.getSelectedValuesIds(),
        combinedProductURL: combinedProductURL,
      });
      if (this.highVariantRequestUrl) {
        this.isHighVariantNeedUpdate = true;
        if (combinedProductURL) {
          this.isCombinedListingsNeedUpdate = true;
          // Stored so updateElementsAfterFetch can update data-url after the switch,
          // enabling subsequent non-combined variant changes to use the correct product URL.
          this._combinedProductURL = combinedProductURL;
        }
      }
    }
    // -----

    if (this.isHighVariantNeedUpdate === false) {
      this.updatePickupAvailability();
      this.updateVariantStatuses();
    }
    this.syncStickyBar();
    this.resetErrorMessage();

    if (!this.currentVariant) {
      // -----
      // for high-variant products
      if (this.isHighVariantNeedUpdate) {
        this.classList.add("high-variant-loading");
        this.renderProductInfo(this.highVariantRequestUrl);
        return;
      }
      // -----

      this.toggleAddButton(true, "");
      this.setUnavailable();
    } else {
      if (
        this.currentVariant?.featured_media &&
        this.dataset?.variantMediaDisplay === "show_all"
      ) {
        // If variant display != "show_all", the media gallery element is fully replaced inside updateElementsAfterFetch
        const mediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
        this.updateMedia(mediaId);
      }
      this.updateURL();
      this.updateVariantInput();
      const requestUrl = this.createRequestUrl({
        currentVariantId: this.currentVariant.id,
      });
      this.renderProductInfo(requestUrl);
    }
  }

  updateOptions() {
    const fieldsets = Array.from(
      this.querySelectorAll(".product-form__controls--dropdown")
    );

    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    ).concat(
      fieldsets.map((fieldset) => {
        return Array.from(fieldset.querySelectorAll("input")).find(
          (radio) => radio.checked
        ).value;
      })
    );
  }

  updateMasterId() {
    if (this.variantData || this.querySelector("[data-all-variants-no-high]")) {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options
          .map((option, index) => {
            return this.options[index] === option;
          })
          .includes(false);
      });
    }
  }

  isHidden(elem) {
    const styles = window.getComputedStyle(elem);
    return styles.display === "none" || styles.visibility === "hidden";
  }

  updateMedia(mediaId) {
    if (!mediaId) return;

    const mediaEl = document.querySelector(
      `[data-section="product-media-${this.dataset.section}"]`
    );
    if (!mediaEl) return;

    // for slider and slider_previews layout
    const sliderEl = mediaEl.querySelector(".js-media-list");
    if (sliderEl && sliderEl.swiper) {
      const slides = Array.from(sliderEl.swiper.slides);
      const slideIndex = slides.findIndex((slideEl) => {
        return slideEl.dataset?.mediaId === mediaId;
      });

      if (slideIndex !== -1) {
        sliderEl.swiper.slideTo(slideIndex, 800);
        if (typeof sliderEl.swiper.thumbs?.update === "function") {
          sliderEl.swiper.thumbs.update();
        }
      } else {
        const fallbackIndex = Array.from(
          sliderEl.querySelectorAll(".swiper-slide")
        ).findIndex((slide) => slide.dataset?.mediaId === mediaId);
        if (fallbackIndex !== -1) {
          sliderEl.swiper.slideTo(fallbackIndex, 800);
          if (typeof sliderEl.swiper.thumbs?.update === "function") {
            sliderEl.swiper.thumbs.update();
          }
        }
      }
    }

    // for stacked / stacked_gallery_single layout
    const stackedEl =
      mediaEl.querySelector(
        ".product__media-list[data-desktop-type='stacked_previews']"
      ) ||
      mediaEl.querySelector(
        ".product__media-list[data-desktop-type='stacked']"
      ) ||
      mediaEl.querySelector(".stacked-single-media-container") ||
      mediaEl.querySelector(
        ".product__media-list__container--large:not(.no-js)"
      );
    const isInModal = !!this.closest(
      "quick-add-modal, quick-view-modal, modal-dialog"
    );
    if (stackedEl && !this.isHidden(stackedEl) && !isInModal) {
      const targetMedia = Array.from(
        stackedEl.querySelectorAll("[data-media-id]")
      ).find((mediaItem) => mediaItem.dataset?.mediaId === mediaId);
      if (targetMedia) {
        const offset = targetMedia.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: offset - 100, behavior: "smooth" });
      }
    }
  }

  updateURL() {
    if (this.dataset.updateUrl === "false") return;
    const newUrl = this.currentVariant
      ? `${this.dataset.url}?variant=${this.currentVariant.id}`
      : this.dataset.url;

    window.history.replaceState({}, "", newUrl);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}, #sticky-bar-product-form-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    publish(PUB_SUB_EVENTS.variantChange, {
      data: {
        sectionId: this.dataset.section,
        variant: this.currentVariant,
      },
    });
  }

  updateVariantStatuses() {
    const selectedOptionOneVariants = this.variantData.filter(
      (variant) => this.querySelector(":checked").value === variant.options[0]
    );
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];
    inputWrappers.forEach((option, index) => {
      if (index === 0) return;
      const optionInputs = [
        ...option.querySelectorAll('input[type="radio"], option'),
      ];
      const previousOptionSelected =
        inputWrappers[index - 1].querySelector(":checked").value;
      const availableOptionInputsValue = selectedOptionOneVariants
        .filter(
          (variant) =>
            variant.available &&
            variant.options[index - 1] === previousOptionSelected
        )
        .map((variantOption) => variantOption.options[index]);
      this.setInputAvailability(optionInputs, availableOptionInputsValue);
    });
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        if (input.tagName === "OPTION") {
          input.innerText = input.getAttribute("value");
        } else if (input.tagName === "INPUT") {
          input.classList.remove("disabled");
        }
      } else {
        if (input.tagName === "OPTION") {
          input.innerText =
            window.variantStrings.unavailable_with_option.replace(
              "[value]",
              input.getAttribute("value")
            );
        } else if (input.tagName === "INPUT") {
          input.classList.add("disabled");
        }
      }
    });
  }

  setCheckedInputsBySelectedValues(selectedValues) {
    const inputWrappers = [...this.querySelectorAll(".product-form__controls")];

    inputWrappers.forEach((groupEl, index) => {
      const selectedValue = selectedValues[index];
      if (!selectedValue) return;

      const inputs = [...groupEl.querySelectorAll('input[type="radio"]')];

      inputs.forEach((input) => {
        const shouldBeChecked = input.value === selectedValue;
        input.checked = shouldBeChecked;
        if (shouldBeChecked) {
          input.setAttribute("checked", "");
        } else {
          input.removeAttribute("checked");
        }
      });
    });
  }

  getSelectedValues() {
    const controls = [...this.querySelectorAll(".product-form__controls")];

    controls.sort((a, b) => {
      return (
        Number(a.dataset.optionPosition) - Number(b.dataset.optionPosition)
      );
    });

    const selectedValues = controls.map((control) => {
      const checkedInput = control.querySelector('input[type="radio"]:checked');
      return checkedInput ? checkedInput.value : null;
    });

    return selectedValues;
  }

  getOtherPickerForSync() {
    let pickerForUpdate = null;

    const isThisStickyBar = this.id.includes("sticky_add_to_cart_bar");
    if (isThisStickyBar) {
      const mainPickerId = this.id.replace("-sticky_add_to_cart_bar", "");
      pickerForUpdate = document.getElementById(mainPickerId);
    } else {
      const stickyPickerId = `${this.id}-sticky_add_to_cart_bar`;
      pickerForUpdate = document.getElementById(stickyPickerId);
    }

    if (
      !pickerForUpdate ||
      (pickerForUpdate.tagName !== "VARIANT-RADIOS" &&
        pickerForUpdate.tagName !== "VARIANT-SELECTS")
    ) {
      return null;
    }

    return pickerForUpdate;
  }

  syncStickyBar() {
    try {
      if (!this.dataset.updateUrl === "false") return;

      const stickyBarEl = document.querySelector(".product-sticky-add-bar");
      if (!stickyBarEl) return;

      const pickerForUpdate = this.getOtherPickerForSync();
      if (!pickerForUpdate) return;

      const selectedValues = this.getSelectedValues();
      pickerForUpdate.setCheckedInputsBySelectedValues(selectedValues);
      pickerForUpdate.updateVariantStatuses();
      if (pickerForUpdate.tagName === "VARIANT-SELECTS") {
        pickerForUpdate
          .querySelectorAll("variant-dropdown-select")
          .forEach((dropdown) => {
            if (typeof dropdown.updateCurrentOption === "function") {
              dropdown.updateCurrentOption(selectedValues);
            }
          });
      }
    } catch (error) {}
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  renderProductInfo(requestUrl) {
    this.abortController?.abort();
    this.abortController = new AbortController();

    // Capture DOM ancestors before the fetch resolves. updatePickerInnerHtml
    // replaces the picker's innerHTML, which detaches `this` from the DOM so
    // this.closest() returns null inside updateElementsAfterFetch. Saving
    // references here guarantees they remain valid after the detach.
    this._renderModalContext = this.closest(
      "quick-add-modal, quick-view-modal"
    );
    this._renderProductContainer = this.closest(".product");
    if (!this._renderProductContainer) {
      const sectionWrapper = document.getElementById(
        `shopify-section-${this.dataset.section}`
      );
      this._renderProductContainer =
        sectionWrapper?.querySelector(".product") || null;
    }

    fetch(requestUrl, { signal: this.abortController.signal })
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");

        try {
          this.setCurrentVariantAfterFetch(html);
        } catch (err) {}

        // -----
        // for high-variant products
        // and if variant not found in liquid <script data-all-variants-no-high>
        // but it was found after a request with the option_values parameter
        if (this.isHighVariantNeedUpdate) {
          try {
            // Update dataset.url to the linked product's URL BEFORE updateURL()
            // so the browser history entry reflects the linked product —
            // enabling state persistence on page reload (combined listings).
            if (this.isCombinedListingsNeedUpdate && this._combinedProductURL) {
              this.dataset.url = this._combinedProductURL;
              this._combinedProductURL = null;
            }
            this.updateURL();
            this.updatePickupAvailability();
            this.updatePickerInnerHtml(html);
            if (this.isCombinedListingsNeedUpdate) {
              // Clear cached variant data so the next onVariantChange reads
              // the newly-rendered linked product's variants, not the original product's.
              this.variantData = null;
            }
            if (this.currentVariant) {
              this.updateVariantInput();
              if (
                this.currentVariant.featured_media &&
                this.dataset?.variantMediaDisplay === "show_all" &&
                !this.isCombinedListingsNeedUpdate
              ) {
                // If variant display != "show_all", the media gallery element is fully replaced inside updateElementsAfterFetch
                // Skip for combined listings — the entire media gallery is replaced, so slideTo would act on stale DOM
                const mediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
                this.updateMedia(mediaId);
              }
            }
          } catch (err) {}
        }
        // -----

        this.updateElementsAfterFetch(html);

        if (!this.currentVariant) {
          this.toggleAddButton(true, "");
          this.setUnavailable();
        } else {
          this.toggleAddButton(
            !this.currentVariant.available,
            window.variantStrings.soldOut
          );
        }

        // Post-fetch media sync for show_all products.
        // The pre-fetch updateMedia() call in onVariantChange uses local variant JSON
        // which may not include featured_media. Re-calling here with the definitive
        // server-rendered variant data guarantees the correct slide/scroll position.
        if (
          !this.isHighVariantNeedUpdate &&
          this.currentVariant?.featured_media &&
          this.dataset?.variantMediaDisplay === "show_all"
        ) {
          const mediaId = `${this.dataset.section}-${this.currentVariant.featured_media.id}`;
          this.updateMedia(mediaId);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.info("Fetch aborted by user");
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        this.classList.remove("high-variant-loading");
      });
  }

  toggleAddButton(disable = true, text) {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}, #sticky-bar-product-form-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const addButton = productForm.querySelector('[name="add"]');
      if (!addButton) return;

      const addButtonText =
        addButton.querySelector(".button__label") ||
        addButton.querySelector("span");

      if (disable) {
        addButton.setAttribute("disabled", true);
        addButton.setAttribute("aria-disabled", true);
        if (text) {
          addButtonText.textContent = text;

          if (text === window.variantStrings.unavailable) {
            addButton.dataset.status = "unavailable";
          } else {
            addButton.dataset.status = "sold-out";
          }
        }
      } else {
        addButton.removeAttribute("disabled");
        addButton.removeAttribute("aria-disabled");
        addButtonText.textContent = window.variantStrings.addToCart;
        addButton.dataset.status = "available";
      }
    });
  }

  resetErrorMessage() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}, #sticky-bar-product-form-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const parentEl = productForm.closest("product-form");
      if (parentEl) {
        const errorWrapperEl = parentEl.querySelector(
          ".product-form__error-message-wrapper"
        );
        const errorTextEl = errorWrapperEl?.querySelector(
          ".product-form__error-message"
        );
        if (!errorWrapperEl || !errorTextEl) return;
        errorWrapperEl.setAttribute("hidden", true);
        errorTextEl.textContent = "";
      }
    });
  }

  setUnavailable() {
    const price = document.getElementById(`price-${this.dataset.section}`);
    const priceSticky = document.getElementById(
      `price-sticky-${this.dataset.section}`
    );
    const inventory = document.getElementById(
      `Inventory-${this.dataset.section}`
    );
    const pickerInventory = document.getElementById(
      `PickerInventory-${this.dataset.section}`
    );
    const sku = document.getElementById(`Sku-${this.dataset.section}`);

    this.toggleAddButton(true, window.variantStrings.unavailable);
    if (price) price.classList.add("visibility-hidden");
    if (priceSticky) priceSticky.classList.add("visibility-hidden");
    if (inventory) inventory.classList.add("visibility-hidden");
    if (pickerInventory) pickerInventory.classList.add("visibility-hidden");
    if (sku) sku.classList.add("visibility-hidden");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector("[data-all-variants-no-high]").textContent);
    return this.variantData;
  }

  updateElementsAfterFetch(html) {
    // attr data-original-section use for Quick view modal
    const currentSectionId = this.dataset.section;
    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    // price
    const priceDestination = document.getElementById(
      `price-${currentSectionId}`
    );
    const priceStickyDestination = document.getElementById(
      `price-sticky-${currentSectionId}`
    );
    const priceSource = html.getElementById(`price-${sourceSectionId}`);
    if (priceSource && priceDestination) {
      priceDestination.innerHTML = priceSource.innerHTML;
      priceDestination.classList.remove("visibility-hidden");
    }
    if (priceSource && priceStickyDestination) {
      priceStickyDestination.innerHTML = priceSource.innerHTML;
      const priceText = priceStickyDestination.querySelector(".price-text");
      if (priceText) priceText.className = "price-text";
    }

    // inventory
    const inventorySource = html.getElementById(`Inventory-${sourceSectionId}`);
    const inventoryDestination = document.getElementById(
      `Inventory-${currentSectionId}`
    );
    if (inventorySource && inventoryDestination) {
      inventoryDestination.innerHTML = inventorySource.innerHTML;
      inventoryDestination.classList.toggle(
        "visibility-hidden",
        inventorySource.innerText === ""
      );
    }

    const pickerInventorySource = html.getElementById(
      `PickerInventory-${sourceSectionId}`
    );
    const pickerInventoryDestination = document.getElementById(
      `PickerInventory-${currentSectionId}`
    );
    if (pickerInventorySource && pickerInventoryDestination) {
      pickerInventoryDestination.innerHTML = pickerInventorySource.innerHTML;
      pickerInventoryDestination.classList.toggle(
        "visibility-hidden",
        pickerInventorySource.innerText === ""
      );
    }

    // sku
    const skuSource = html.getElementById(`Sku-${sourceSectionId}`);
    const skuDestination = document.getElementById(`Sku-${currentSectionId}`);
    if (skuSource && skuDestination) {
      skuDestination.innerHTML = skuSource.innerHTML;
      skuDestination.classList.toggle(
        "visibility-hidden",
        skuSource.classList.contains("visibility-hidden")
      );
    } else if (!skuSource && skuDestination) {
      // variant has no SKU — clear stale value from previous variant
      skuDestination.innerHTML = "";
      skuDestination.classList.add("visibility-hidden");
    }

    // B2B quantity pricing: volume price breaks table + quantity rules note
    const b2bSource = html.getElementById(`ProductB2bElements-${sourceSectionId}`);
    const b2bDestination = document.getElementById(
      `ProductB2bElements-${currentSectionId}`
    );
    if (b2bSource && b2bDestination) {
      b2bDestination.innerHTML = b2bSource.innerHTML;
    }

    // Reflect whether the current variant has quantity pricing on the form.
    const b2bFormSource = html.querySelector(
      `product-form[data-source="${sourceSectionId}"]`
    );
    const b2bFormDestination = document.querySelector(
      `product-form[data-source="${currentSectionId}"]`
    );
    if (b2bFormSource && b2bFormDestination) {
      b2bFormDestination.setAttribute(
        "data-has-quantity-pricing",
        b2bFormSource.getAttribute("data-has-quantity-pricing") || "false"
      );
    }

    // Sync quantity rule attributes (min/max/step) on the quantity input and
    // clamp the current value so it stays within the new variant's rules.
    const qtySource = html.getElementById(`Quantity-${sourceSectionId}`);
    const qtyDestination = document.getElementById(
      `Quantity-${currentSectionId}`
    );
    if (qtySource && qtyDestination) {
      const previousStep = qtyDestination.getAttribute("step");
      const previousMin = qtyDestination.getAttribute("min");

      ["min", "max", "step", "data-min"].forEach((attr) => {
        const value = qtySource.getAttribute(attr);
        if (value === null) {
          qtyDestination.removeAttribute(attr);
        } else {
          qtyDestination.setAttribute(attr, value);
        }
      });

      const min = parseInt(qtyDestination.getAttribute("min") || "1", 10);
      const maxAttr = qtyDestination.getAttribute("max");
      const rulesChanged =
        qtyDestination.getAttribute("step") !== previousStep ||
        qtyDestination.getAttribute("min") !== previousMin;

      let current;
      if (rulesChanged) {
        // Quantity rules changed for the new variant — reset to the minimum.
        current = min;
      } else {
        // Rules unchanged — preserve the shopper's quantity, clamped to bounds.
        current = parseInt(qtyDestination.value, 10);
        if (isNaN(current) || current < min) current = min;
      }
      if (maxAttr !== null && current > parseInt(maxAttr, 10)) {
        current = parseInt(maxAttr, 10);
      }
      qtyDestination.value = current;

      // Re-run rule validation so the +/- buttons reflect the new variant.
      const qtyInputEl = qtyDestination.closest("quantity-input");
      if (qtyInputEl && typeof qtyInputEl.validateQtyRules === "function") {
        qtyInputEl.validateQtyRules();
      }
    }

    // combined listings: title + description + complementary products
    if (this.isCombinedListingsNeedUpdate) {
      // Use the saved container reference — `this` may be detached from the DOM
      // after updatePickerInnerHtml replaced the picker's innerHTML.
      const productContainer = this._renderProductContainer;

      const titleDestination =
        productContainer?.querySelector(".product__title");
      const titleSource = html.querySelector(".product__title");
      if (titleSource && titleDestination) {
        titleDestination.innerHTML = titleSource.innerHTML;
      }

      // description — scope source to ProductInfo wrapper for QV so we don't
      // accidentally pick up description from a different section on the page.
      const descSourceRoot = this._renderModalContext
        ? html.getElementById(`ProductInfo-${sourceSectionId}`) || html
        : html;
      const descSource = descSourceRoot.querySelector(
        ".main-product-description"
      );
      const descDestination = productContainer?.querySelector(
        ".main-product-description"
      );
      if (descDestination) {
        descDestination.innerHTML = descSource?.innerHTML || "";
        descDestination.classList.toggle(
          "hidden",
          !descSource?.innerHTML?.trim()
        );
      }

      // Gift card recipient form: keep in sync when CL switches products.
      // The product-form block is not replaced, so we must manually handle the
      // form ourselves.
      const recipientDestination = productContainer?.querySelector(".customer");
      const recipientSource = html.querySelector(".customer");
      if (recipientDestination && !recipientSource) {
        // Switched to a non-gift-card product → remove the form.
        recipientDestination.remove();
      } else if (!recipientDestination && recipientSource) {
        // Switched to a gift-card product → inject the form before the buttons.
        const buyButtons = productContainer?.querySelector(
          `#product-form-${currentSectionId} .product-form__buttons`
        );
        if (buyButtons) {
          const clone = recipientSource.cloneNode(true);
          // Remap section-scoped IDs so the new element works stand-alone.
          clone.innerHTML = clone.innerHTML.replaceAll(
            sourceSectionId,
            currentSectionId
          );
          buyButtons.before(clone);
        }
      }

      // dataset.url is updated before updateURL() in renderProductInfo to ensure
      // browser history reflects the linked product. No duplication needed here.

      // product tags — refresh or clear when CL switches to a different product
      const tagsDestination = productContainer?.querySelector(".product-tags");
      if (tagsDestination) {
        const tagsSource = html.querySelector(".product-tags");
        tagsDestination.innerHTML = tagsSource?.innerHTML || "";
      }

      // popup opener section: refresh color swatches + other option labels
      const openerSource = html.querySelector(
        `.variant-radios-${sourceSectionId}`
      );
      const openerDest = document.querySelector(
        `.variant-radios-${currentSectionId}`
      );
      if (openerSource && openerDest) {
        const modalRef =
          openerDest.querySelector("modal-opener")?.dataset.modal;
        openerDest.innerHTML = openerSource.innerHTML;
        // update popup modal title (option names can change between CL products)
        if (modalRef) {
          const popupModal = document.querySelector(modalRef);
          const titleSrc = html.querySelector(".product-popup-modal__title");
          const titleDst = popupModal?.querySelector(
            ".product-popup-modal__title"
          );
          if (titleSrc && titleDst) titleDst.innerHTML = titleSrc.innerHTML;
        }
      }

      // Complementary products use IntersectionObserver that fires only once, so
      // re-fetch manually when the linked product changes via combined listings.
      // Always update innerHTML — an empty response must clear stale content.
      const recEl = document.querySelector("product-recommendations--single");
      if (recEl) {
        const recSource = html.querySelector("product-recommendations--single");
        if (!recSource) {
          // New product's section has no complementary block at all → clear it
          recEl.innerHTML = "";
        } else {
          const newUrl = recSource.dataset.url;
          if (newUrl && newUrl !== recEl.dataset.url) {
            recEl.dataset.url = newUrl;
            fetch(newUrl)
              .then((r) => r.text())
              .then((text) => {
                const div = document.createElement("div");
                div.innerHTML = text;
                const recs = div.querySelector(
                  "product-recommendations--single"
                );
                // Set innerHTML unconditionally — empty string when no recommendations
                recEl.innerHTML = recs ? recs.innerHTML : "";
              })
              .catch((e) => console.error(e));
          } else if (!newUrl) {
            recEl.innerHTML = "";
          }
        }
      }
    }

    // color swatches label
    const colorNameSources = html.querySelectorAll(
      `[id^="ColorName-${sourceSectionId}"]`
    );
    const colorNameDestinations = document.querySelectorAll(
      `[id^="ColorName-${currentSectionId}"]`
    );
    if (colorNameSources?.length === colorNameDestinations?.length) {
      colorNameDestinations.forEach((colorNameDestination, index) => {
        colorNameDestination.classList.remove("visibility-hidden");
        colorNameDestination.innerHTML = colorNameSources[index].innerHTML;
      });
    }

    // variant image swatches — only for non-high-variant paths.
    // For high-variant / combined listings, updatePickerInnerHtml already replaced the
    // entire picker (including swatches), so a second replacement here is redundant
    // and causes a visible flutter by writing the same node twice.
    if (!this.isHighVariantNeedUpdate) {
      const variantSwatchesSource = html.querySelector(
        `#variant-picker-${sourceSectionId} [data-is-variant-image-swatch="true"]`
      );
      const variantSwatchesDestination = document.querySelector(
        `#variant-picker-${currentSectionId} [data-is-variant-image-swatch="true"]`
      );
      if (variantSwatchesSource && variantSwatchesDestination) {
        const savedModal = this._renderModalContext;
        if (savedModal?.tagName?.toLowerCase() === "quick-view-modal") {
          variantSwatchesDestination.innerHTML =
            variantSwatchesSource.innerHTML.replaceAll(
              sourceSectionId,
              `quickview-${sourceSectionId}`
            );
        } else if (savedModal?.tagName?.toLowerCase() === "quick-add-modal") {
          variantSwatchesDestination.innerHTML =
            variantSwatchesSource.innerHTML.replaceAll(
              sourceSectionId,
              `quickadd-${sourceSectionId}`
            );
        } else {
          variantSwatchesDestination.innerHTML =
            variantSwatchesSource.innerHTML;
        }
      }
    }

    // product media
    if (
      this.dataset?.variantMediaDisplay !== "show_all" ||
      this.isCombinedListingsNeedUpdate
    ) {
      const mediaSource = html.querySelector(
        `[data-section="product-media-${sourceSectionId}"]`
      );
      const mediaDestination = document.querySelector(
        `[data-section="product-media-${currentSectionId}"]`
      );
      // When switching to a product with no media (mediaSource is null because
      // the template only renders the wrapper when media.size > 0), clear the
      // existing gallery so stale images from the previous product don't persist.
      if (!mediaSource && this.isCombinedListingsNeedUpdate) {
        if (mediaDestination) {
          const oldMainSlider =
            mediaDestination.querySelector(".js-media-list");
          if (oldMainSlider?.swiper) oldMainSlider.swiper.destroy(true, true);
          const oldSubSlider =
            mediaDestination.querySelector(".js-media-sublist");
          if (oldSubSlider?.swiper) oldSubSlider.swiper.destroy(true, true);
          mediaDestination.innerHTML = "";
          mediaDestination.hidden = true;
        }
        const productContainer = this._renderProductContainer;
        if (productContainer) {
          productContainer.classList.remove("row");
          productContainer.classList.add("product--no-media");
        }
      }

      if (mediaSource && mediaDestination) {
        // Restore layout classes if we were previously showing a no-media product.
        if (this.isCombinedListingsNeedUpdate) {
          mediaDestination.hidden = false;
          const productContainer = this._renderProductContainer;
          if (productContainer) {
            productContainer.classList.add("row");
            productContainer.classList.remove("product--no-media");
          }
        }

        // Briefly hide the container to eliminate the flash between innerHTML
        // replacement and Swiper re-initialization.
        mediaDestination.style.opacity = "0";

        // Destroy existing Swiper instances before replacing HTML so their
        // CSS transforms are removed cleanly, preventing a visual flash while
        // the new HTML is rendered before the new Swiper is initialized.
        const oldMainSlider = mediaDestination.querySelector(".js-media-list");
        if (oldMainSlider?.swiper) oldMainSlider.swiper.destroy(true, true);
        const oldSubSlider =
          mediaDestination.querySelector(".js-media-sublist");
        if (oldSubSlider?.swiper) oldSubSlider.swiper.destroy(true, true);

        // When inside a QV/QA modal, section IDs in the fetched HTML (sourceSectionId)
        // differ from the modal's prefixed IDs (currentSectionId). Remap them so
        // data-media-id and other scoped attributes stay in sync with updateMedia().
        mediaDestination.innerHTML =
          sourceSectionId !== currentSectionId
            ? mediaSource.innerHTML.replaceAll(
                sourceSectionId,
                currentSectionId
              )
            : mediaSource.innerHTML;

        // For combined listings, replace the product-modal zoom content so the
        // zoom overlay shows the new product's images, not the original product's.
        // The product-modal element is outside [data-section="product-media-*"] and
        // is never updated by the gallery replacement above.
        if (this.isCombinedListingsNeedUpdate) {
          const modalContentSource = html.querySelector(
            `#ProductModal-${sourceSectionId} .product-media-modal__content`
          );
          const modalContentDestination = document.querySelector(
            `#ProductModal-${currentSectionId} .product-media-modal__content`
          );
          if (modalContentSource && modalContentDestination) {
            modalContentDestination.innerHTML = modalContentSource.innerHTML;
          }
        }

        // Use saved references — `this` may be detached from the DOM after
        // updatePickerInnerHtml replaced the picker's innerHTML.
        const parentQuickView = this._renderModalContext;
        const parentFeaturedProduct =
          this._renderProductContainer?.closest(".featured-product");
        if (parentQuickView) {
          if (typeof parentQuickView.removeDOMElements === "function") {
            parentQuickView.removeDOMElements(mediaDestination);
          }
          if (typeof parentQuickView.initSlider === "function") {
            parentQuickView.initSlider();
            const qvSubEl = mediaDestination.querySelector(".js-media-sublist");
            const qvMainEl = mediaDestination.querySelector(".js-media-list");
            if (qvSubEl?.swiper) qvSubEl.swiper.slideTo(0, 0, false);
            if (qvMainEl?.swiper) qvMainEl.swiper.slideTo(0, 0, false);
            if (typeof qvMainEl?.swiper?.thumbs?.update === "function") {
              qvMainEl.swiper.thumbs.update();
            }
          }
        } else if (parentFeaturedProduct) {
          const section = document.getElementById(
            `shopify-section-${currentSectionId}`
          );

          if (section && typeof window.initFeaturedProduct === "function") {
            window.initFeaturedProduct(section);
          } else {
            subSliderInit();
            sliderInit();
            const newSubEl =
              mediaDestination.querySelector(".js-media-sublist");
            const newMainEl = mediaDestination.querySelector(".js-media-list");
            if (newSubEl?.swiper) newSubEl.swiper.slideTo(0, 0, false);
            if (newMainEl?.swiper) newMainEl.swiper.slideTo(0, 0, false);
            if (typeof newMainEl?.swiper?.thumbs?.update === "function") {
              newMainEl.swiper.thumbs.update();
            }
            setTimeout(() => updatethumbnail(), 100);
          }
        } else {
          const section = document.getElementById(
            `shopify-section-${currentSectionId}`
          );

          if (section && typeof initProductPage === "function") {
            initProductPage(section);
          } else {
            subSliderInit();
            sliderInit();

            // The centeredSlides + thumbs-module interaction can leave the
            // sub-slider at index 1 after initialization. Reset both sliders
            // to index 0 (silently, no callbacks) while the gallery is still
            // hidden (opacity:0) so the user never sees the stale position.
            const newSubEl =
              mediaDestination.querySelector(".js-media-sublist");
            const newMainEl = mediaDestination.querySelector(".js-media-list");
            if (newSubEl?.swiper) newSubEl.swiper.slideTo(0, 0, false);
            if (newMainEl?.swiper) newMainEl.swiper.slideTo(0, 0, false);
            if (typeof newMainEl?.swiper?.thumbs?.update === "function") {
              newMainEl.swiper.thumbs.update();
            }

            setTimeout(() => updatethumbnail(), 100);
          }
        }

        // Restore visibility after two animation frames so the browser paints
        // the new content before the container reappears.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            mediaDestination.style.opacity = "";
          });
        });
      }
    }

    // Popup picker opener buttons show the selected option value as static text
    // rendered server-side. Keep them in sync after every variant/CL update.
    this.updatePopupOpenerLabels();
  }

  updatePopupOpenerLabels() {
    try {
      const sectionId = this.dataset.section;
      const openerEl = document.querySelector(`.variant-radios-${sectionId}`);
      if (!openerEl) return;
      const labelEls = openerEl.querySelectorAll(".selected_option_name");
      if (!labelEls.length) return;
      // Read current selections from the picker (which may be inside a popup modal)
      const pickerEl = document.getElementById(`variant-picker-${sectionId}`);
      if (!pickerEl) return;
      const fieldsets = pickerEl.querySelectorAll(".product-form__controls");
      fieldsets.forEach((fieldset, i) => {
        if (!labelEls[i]) return;
        const checked = fieldset.querySelector('input[type="radio"]:checked');
        const dropdown =
          fieldset.querySelector(
            'input[type="hidden"][data-dropdown-current-value]'
          ) ??
          fieldset.querySelector(
            ".dropdown-select__current [data-dropdown-current-value]"
          );
        const value = checked?.value ?? dropdown?.value;
        if (value != null) labelEls[i].textContent = value;
      });
    } catch (_) {}
  }

  // methods for high variant products
  getSelectedValuesIds() {
    const controls = [...this.querySelectorAll(".product-form__controls")];

    controls.sort((a, b) => {
      return (
        Number(a.dataset.optionPosition) - Number(b.dataset.optionPosition)
      );
    });

    return controls.map((control) => {
      const checkedInput = control.querySelector('input[type="radio"]:checked');
      return checkedInput?.dataset?.optionValueId
        ? checkedInput.dataset.optionValueId
        : null;
    });
  }

  createRequestUrl({
    currentVariantId = "",
    selectedValuesIds = [],
    combinedProductURL = "",
  }) {
    const productUrl = combinedProductURL || `${this.dataset.url}`;
    const sectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    if (currentVariantId) {
      return `${productUrl}?variant=${currentVariantId}&section_id=${sectionId}`;
    }

    // -----
    // for high-variant products
    // and if variant not found in liquid <script data-all-variants-no-high>
    if (selectedValuesIds.length) {
      const params = [];
      params.push(`section_id=${sectionId}`);
      params.push(`option_values=${selectedValuesIds.join(",")}`);
      return `${productUrl}?${params.join("&")}`;
    }
    // -----
  }

  setCurrentVariantAfterFetch(html) {
    // attr data-original-section use for Quick view modal
    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    const variantPickerSource = html.getElementById(
      `variant-picker-${sourceSectionId}`
    );
    const variantPickerDestionation = document.getElementById(
      `variant-picker-${this.dataset.section}`
    );
    if (!variantPickerSource) return;

    const newVariantDataEl = variantPickerSource.querySelector(
      "[data-selected-variant]"
    );
    if (!newVariantDataEl) return;

    const newVariantData = variantPickerSource.querySelector(
      "[data-selected-variant]"
    ).innerHTML;

    const selectedVariant = !!newVariantData
      ? JSON.parse(newVariantData)
      : null;

    this.currentVariant = selectedVariant;

    const oldEl = variantPickerDestionation.querySelector(
      "[data-selected-variant]"
    );
    if (oldEl) {
      oldEl.innerHTML = newVariantData;
    }
  }

  updatePickerInnerHtml(html) {
    // attr data-original-section use for Quick view modal
    const currentSectionId = this.dataset.section;
    const sourceSectionId = this.dataset.originalSection
      ? this.dataset.originalSection
      : this.dataset.section;

    const variantPickerSource = html.getElementById(
      `variant-picker-${sourceSectionId}`
    );
    const variantPickerDestination = document.getElementById(
      `variant-picker-${currentSectionId}`
    );

    if (variantPickerSource && variantPickerDestination) {
      const savedModal = this._renderModalContext;
      if (savedModal?.tagName?.toLowerCase() === "quick-view-modal") {
        variantPickerDestination.innerHTML =
          variantPickerSource.innerHTML.replaceAll(
            sourceSectionId,
            `quickview-${sourceSectionId}`
          );
      } else if (savedModal?.tagName?.toLowerCase() === "quick-add-modal") {
        // quick-add-modal uses the same quickadd- prefix applied by preventDuplicatedIDs
        variantPickerDestination.innerHTML =
          variantPickerSource.innerHTML.replaceAll(
            sourceSectionId,
            `quickadd-${sourceSectionId}`
          );
      } else {
        variantPickerDestination.innerHTML = variantPickerSource.innerHTML;
      }
    }
  }
}

if (!customElements.get("variant-selects")) {
  customElements.define("variant-selects", VariantSelects);
}

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
        input.classList.remove("disabled");
        input.disabled = false;
      } else {
        input.classList.add("disabled");
        //input.disabled = true;
      }
    });
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }
}

if (!customElements.get("variant-radios")) {
  customElements.define("variant-radios", VariantRadios);
}

class VariantDropdownSelect extends HTMLElement {
  constructor() {
    super();

    this.currentEl = this.querySelector(".dropdown-select__current");
    this.optionsWrapperEl = this.querySelector(".dropdown-select__options");
    this.hiddenInput = this.querySelector("input[type='hidden']");
    if (!this.currentEl || !this.optionsWrapperEl || !this.hiddenInput) return;

    this.optionsEls = Array.from(this.optionsWrapperEl.querySelectorAll("li"));
    this.inputs = Array.from(this.optionsWrapperEl.querySelectorAll("input"));
    this.hasColorSwatch = this.currentEl?.classList?.contains(
      "dropdown-select__current--with-color"
    );
    this.isActive = false;

    this.optionPosition = this.getOptionPosition();
    this._onCurrentClick = this.onCurrentClick.bind(this);
    this._onKeyUp = this.onKeyUp.bind(this);
    this._onOptionsClick = this.onClickOption.bind(this);
    this._onKeyUpOptions = this.onKeyUpOptions.bind(this);
    this._onOutsideClick = this.onOutsideClick.bind(this);
  }

  connectedCallback() {
    this.currentEl.addEventListener("click", this._onCurrentClick);
    this.currentEl.addEventListener("keyup", this._onKeyUp);
    this.currentEl.addEventListener("dblclick", this.preventDoubleClick);
    this.optionsWrapperEl.addEventListener("click", this._onOptionsClick);
    this.optionsWrapperEl.addEventListener("keyup", this._onKeyUpOptions);
    document.addEventListener("click", this._onOutsideClick);
  }

  disconnectedCallback() {
    this.currentEl.removeEventListener("click", this._onCurrentClick);
    this.currentEl.removeEventListener("keyup", this._onKeyUp);
    this.currentEl.removeEventListener("dblclick", this.preventDoubleClick);
    this.optionsWrapperEl.removeEventListener("click", this._onOptionsClick);
    this.optionsWrapperEl.removeEventListener("keyup", this._onKeyUpOptions);
    document.removeEventListener("click", this._onOutsideClick);
  }

  onCurrentClick(event) {
    event.stopPropagation();
    if (this.isActive) {
      this.onClose();
    } else {
      this.onOpen();
    }
  }

  onKeyUp(event) {
    if (event.code?.toUpperCase() === "ENTER") {
      event.preventDefault();
      event.stopPropagation();
      if (this.isActive) {
        this.onClose();
      } else {
        this.onOpen();
      }
    }
  }

  preventDoubleClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onClickOption(event) {
    const optionEl = event.target.closest("li");
    const currentValueEl = this.currentEl.querySelector(
      "[data-dropdown-current-value]"
    );

    if (
      !optionEl ||
      !currentValueEl ||
      !this.optionsWrapperEl.contains(optionEl)
    ) {
      event.preventDefault();
      return;
    }

    const newValue = optionEl.dataset.value;

    currentValueEl.textContent = newValue;
    this.hiddenInput.value = newValue;

    if (this.hasColorSwatch) {
      const newColor = optionEl.dataset.color;
      this.hiddenInput.dataset.colorSwatch = newColor;
      this.currentEl.style.setProperty("--swatch-color", newColor);
    }

    // Ensure the radio inside the selected li is checked (handles clicks on li/span/icon)
    const radioInOption = optionEl.querySelector('input[type="radio"]');
    if (radioInOption) {
      this.inputs.forEach((el) => {
        el.checked = false;
        el.removeAttribute("checked");
      });
      radioInOption.checked = true;
      radioInOption.setAttribute("checked", "true");

      // Propagate combined listings attributes so onVariantChange can read them
      // from event.target (which is the hidden input, not the radio)
      const productUrl = radioInOption.dataset.productUrl;
      const variantId = radioInOption.dataset.variantId;
      if (productUrl) {
        this.hiddenInput.dataset.productUrl = productUrl;
      } else {
        delete this.hiddenInput.dataset.productUrl;
      }
      if (variantId) {
        this.hiddenInput.dataset.variantId = variantId;
      } else {
        delete this.hiddenInput.dataset.variantId;
      }
    }

    this.hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));

    this.onClose();
    this.currentEl.focus();
  }

  onKeyUpOptions(event) {
    if (event.code === "Escape" && this.isActive) {
      event.preventDefault();
      this.onClose();
      this.currentEl.focus();
    }
  }

  onOpen() {
    document.querySelectorAll("variant-dropdown-select").forEach((dropdown) => {
      if (dropdown !== this && typeof dropdown.onClose === "function") {
        dropdown.onClose();
      }
    });

    this.optionsWrapperEl.classList.add("active");
    this.currentEl.setAttribute("aria-expanded", "true");
    this.isActive = true;

    const currentIndex = this.inputs.findIndex((inp) =>
      inp.hasAttribute("checked")
    );
    this.inputs[currentIndex >= 0 ? currentIndex : 0]?.focus();
  }

  onClose() {
    this.optionsWrapperEl.classList.remove("active");
    this.currentEl.setAttribute("aria-expanded", "false");
    this.isActive = false;
  }

  onOutsideClick(event) {
    if (!this.isActive || this.contains(event.target)) return;
    this.onClose();
  }

  getOptionPosition() {
    const parentFieldset = this.closest(".product-form__controls");
    return Number(parentFieldset?.dataset?.optionPosition || -1);
  }

  updateCurrentOption(selectedValues = []) {
    // Method is used to synchronize after changes options in sticky bar.
    if (this.optionPosition === -1) return;
    const currentValueEl = this.currentEl.querySelector(
      "[data-dropdown-current-value]"
    );

    if (!currentValueEl || !selectedValues || !selectedValues.length) return;

    const newValue = selectedValues[this.optionPosition - 1];

    currentValueEl.textContent = newValue;
    this.hiddenInput.value = newValue;

    this.optionsEls.forEach((optionEl) => {
      const liDataValue = optionEl.dataset.value;
      if (newValue === liDataValue && this.hasColorSwatch) {
        const newColor = optionEl.dataset.color;
        this.hiddenInput.dataset.colorSwatch = newColor;
        this.currentEl.style.setProperty("--swatch-color", newColor);
      }
    });
  }
}

if (!customElements.get("variant-dropdown-select")) {
  customElements.define("variant-dropdown-select", VariantDropdownSelect);
}

class ProductModel extends DeferredMedia {
  constructor() {
    super();
  }

  loadContent() {
    super.loadContent();

    Shopify.loadFeatures([
      {
        name: "model-viewer-ui",
        version: "1.0",
        onLoad: this.setupModelViewerUI.bind(this),
      },
    ]);
  }

  setupModelViewerUI(errors) {
    if (errors) return;

    this.modelViewerUI = new Shopify.ModelViewerUI(
      this.querySelector("model-viewer")
    );

    const $this = this;

    this.querySelector(".shopify-model-viewer-ui__button").addEventListener(
      "click",
      function () {
        if (
          $this
            .closest(".swiper")
            .swiper.slides[
              $this.closest(".swiper").swiper.activeIndex
            ].querySelector("model-viewer")
        ) {
          if (
            !$this
              .closest(".swiper")
              .swiper.slides[
                $this.closest(".swiper").swiper.activeIndex
              ].querySelector("model-viewer")
              .classList.contains("shopify-model-viewer-ui__disabled")
          ) {
            if (
              $this
                .querySelector(".shopify-model-viewer-ui__button")
                .hasAttribute("hidden")
            ) {
              $this.closest(".swiper").swiper.params.noSwiping = true;
              $this.closest(".swiper").swiper.params.noSwipingClass =
                "swiper-slide";
            }
          }
        }
      }
    );

    this.querySelector(
      ".shopify-model-viewer-ui__controls-overlay"
    ).addEventListener("click", function () {
      if (
        !$this
          .querySelector(".shopify-model-viewer-ui__button")
          .hasAttribute("hidden")
      ) {
        $this.closest(".swiper").swiper.params.noSwiping = false;
      }
    });
  }
}
customElements.define("product-model", ProductModel);

// Product slider

(function () {
  const productSlider = () => {
    const productSliders = Array.from(
      document.querySelectorAll(".products-slider")
    );
    if (productSliders.length === 0) return;
    productSliders.forEach((slider) => {
      const sectionId = slider.dataset.id;
      const perRow = slider.dataset.perRow;
      const speed = slider.dataset.speed * 1000;
      const delay = slider.dataset.delay * 1000;
      const autoplay = toBoolean(slider.dataset.autoplay);
      const stopAutoplay = toBoolean(slider.dataset.stopAutoplay);
      const showArrows = toBoolean(slider.dataset.showArrows);
      let autoplayParm = {};
      let arrowsParm = {};
      if (autoplay) {
        autoplayParm = {
          autoplay: {
            delay: delay,
            pauseOnMouseEnter: stopAutoplay,
            disableOnInteraction: false,
          },
        };
      }
      if (showArrows) {
        arrowsParm = {
          navigation: {
            nextEl: `#${sectionId} .swiper-button-next`,
            prevEl: `#${sectionId} .swiper-button-prev`,
          },
          pagination: {
            el: `#${sectionId} .swiper-pagination`,
            clickable: true,
          },
        };
      }
      let swiperParms = {
        speed: speed,
        keyboard: true,
        slidesPerView: 1,
        spaceBetween: 16,
        breakpoints: {
          576: {
            slidesPerView: 2,
          },
          1100: {
            spaceBetween: 24,
            slidesPerView: perRow,
          },
        },
        ...arrowsParm,
        ...autoplayParm,
      };

      const swiper = new Swiper(`#${sectionId} .swiper`, swiperParms);
    });
  };

  function toBoolean(string) {
    return string === "true" ? true : false;
  }
  if (document.querySelector("product-recommendations") !== null) {
    const initslider = setInterval(() => {
      if (
        document
          .querySelector("product-recommendations")
          .querySelector(".swiper") !== null
      ) {
        if (
          document
            .querySelector("product-recommendations")
            .querySelector(".swiper")
            .classList.contains("swiper-initialized")
        ) {
          clearInterval(initslider);
        }
        productSlider();
      }
    }, 100);
  }
  document.addEventListener("DOMContentLoaded", function () {
    productSlider();
    document.addEventListener("shopify:section:load", function () {
      productSlider();
    });
  });
})();

(function () {
  const initDrawerAccordion = () => {
    $(".drawer__accordion-title").click(function () {
      if (!$(this).hasClass("active")) {
        $(".drawer__accordion-title.active").removeClass("active");
        $(this).addClass("active");
        $(".drawer__accordion-content").stop().slideUp(300);
        $(this)
          .siblings(".drawer__accordion-content")
          .eq($(this).index())
          .stop()
          .slideDown(300);
      } else {
        $(this).removeClass("active");
        $(this).siblings(".drawer__accordion-content").stop().slideUp(300);
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    initDrawerAccordion();
    document.addEventListener("shopify:section:load", function () {
      initDrawerAccordion();
    });
  });
})();

(function () {
  let image = document.querySelectorAll(".data-alt img");
  image &&
    image.forEach((img, index) => {
      img.alt = "Video background";
    });
})();

// dispatch cart:refresh

document.documentElement.addEventListener("cart:refresh", () => {
  const sectionsToUpdate = [
    { id: "cart-count-bubble", selector: "#cart-icon-bubble" },
    { id: "cart-drawer", selector: "#CartDrawer" },
    { id: "main-cart-items", selector: ".cart-items-wrapper" },
    { id: "main-cart-footer", selector: ".cart__footer" },
    { id: "main-cart-shipping", selector: ".cart-shipping" },
  ];

  sectionsToUpdate.forEach((section) => {
    fetch(`${routes.cart_url}?section_id=${section.id}`)
      .then((response) => response.text())
      .then((html) => {
        const parsedHTML = new DOMParser().parseFromString(html, "text/html");
        const sourceSection = parsedHTML.querySelector(section.selector);
        const destinationSection = document.querySelector(section.selector);
        if (sourceSection && destinationSection) {
          destinationSection.innerHTML = sourceSection.innerHTML;
        }
      })
      .catch((e) => console.error(`Error updating ${section.id}:`, e));
  });
});

// dispatch cart:refresh

// Linked products navigation
document.addEventListener("change", (event) => {
  const target = event.target;
  if (
    !target.matches(
      '.linked-products input[type="radio"][data-linked-product-url]'
    )
  )
    return;
  window.location.href = target.dataset.linkedProductUrl;
});
