/**
 * Sticky Add to Cart bar controller.
 *
 * The variant / price / add-button state of the sticky bar is already kept in
 * sync with the main product form by the VariantSelects logic in global.js
 * (updateVariantInput / toggleAddButton / setUnavailable / updateElementsAfterFetch
 * all target the sticky ids, and syncStickyBar mirrors the two pickers).
 *
 * This controller adds the two things global.js does not handle:
 *   1. Showing / hiding the bar based on the main form's visibility.
 *   2. Two-way quantity synchronisation (value + rules) between the main
 *      quantity input and the sticky quantity input.
 */
(function () {
  "use strict";

  var STICKY_SUFFIX = "-sticky_add_to_cart_bar";

  function initStickyBar(bar) {
    if (!bar || bar.dataset.stickyInit === "true") return;
    bar.dataset.stickyInit = "true";

    var sectionId = bar.dataset.sectionId;
    if (!sectionId) return;

    primeVariantData(sectionId);
    setupQuantitySync(bar, sectionId);
    setupVisibilityObserver(bar, sectionId);
  }

  /**
   * syncStickyBar() in global.js calls updateVariantStatuses() on the *opposite*
   * picker, which reads its `variantData` property directly. That property is
   * only populated once a picker has processed its own change event, so on the
   * very first cross-picker sync it would throw (and be swallowed), skipping the
   * dropdown display update. Populate it eagerly on both pickers up front.
   */
  function primeVariantData(sectionId) {
    var ids = [
      "variant-picker-" + sectionId,
      "variant-picker-" + sectionId + STICKY_SUFFIX,
    ];
    for (var i = 0; i < ids.length; i++) {
      var picker = document.getElementById(ids[i]);
      if (picker && typeof picker.getVariantData === "function") {
        try {
          picker.getVariantData();
        } catch (e) {
          /* no-op: picker may have no variant JSON (single-variant product) */
        }
      }
    }
  }

  /**
   * Keep the main and sticky quantity inputs in sync in both directions,
   * including min / max / step rules and +/- button state.
   */
  function setupQuantitySync(bar, sectionId) {
    var mainQty = document.getElementById("Quantity-" + sectionId);
    var stickyQty = document.getElementById(
      "Quantity-" + sectionId + STICKY_SUFFIX
    );
    if (!mainQty || !stickyQty) return;

    var syncing = false;

    // Mirror the numeric value from `from` to `to`. When `dispatch` is true a
    // change event is fired on the target so its own validation / quantity
    // pricing listeners run. A re-entrancy guard prevents an infinite loop.
    function mirrorValue(from, to, dispatch) {
      if (syncing) return;
      syncing = true;
      try {
        if (to.value !== from.value) {
          to.value = from.value;
          if (dispatch) {
            to.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }
        validate(to);
      } finally {
        syncing = false;
      }
    }

    function validate(input) {
      var host = input.closest("quantity-input");
      if (host && typeof host.validateQtyRules === "function") {
        host.validateQtyRules();
      }
    }

    // Main -> sticky: mirror the value only (global.js already validated main).
    mainQty.addEventListener("change", function () {
      mirrorValue(mainQty, stickyQty, false);
    });
    mainQty.addEventListener("input", function () {
      mirrorValue(mainQty, stickyQty, false);
    });

    // Sticky -> main: on a committed change, push to main AND dispatch so the
    // main quantity-input clamps/validates and quantity-pricing refreshes.
    stickyQty.addEventListener("change", function () {
      mirrorValue(stickyQty, mainQty, true);
    });
    // On raw input, mirror the value without dispatching to avoid event spam.
    stickyQty.addEventListener("input", function () {
      mirrorValue(stickyQty, mainQty, false);
    });

    // global.js rewrites the main quantity rules (min/max/step/data-min) on
    // every variant change. Watch those attributes and copy them to the sticky
    // input, then clamp its value and refresh the +/- button state.
    function mirrorRules() {
      var attrs = ["min", "max", "step", "data-min"];
      for (var i = 0; i < attrs.length; i++) {
        var value = mainQty.getAttribute(attrs[i]);
        if (value === null) {
          stickyQty.removeAttribute(attrs[i]);
        } else {
          stickyQty.setAttribute(attrs[i], value);
        }
      }

      var min = parseInt(stickyQty.getAttribute("min") || "1", 10);
      var maxAttr = stickyQty.getAttribute("max");
      var current = parseInt(stickyQty.value, 10);
      if (isNaN(current) || current < min) current = min;
      if (maxAttr !== null && current > parseInt(maxAttr, 10)) {
        current = parseInt(maxAttr, 10);
      }
      stickyQty.value = current;
      validate(stickyQty);
    }

    if (typeof MutationObserver === "function") {
      var observer = new MutationObserver(mirrorRules);
      observer.observe(mainQty, {
        attributes: true,
        attributeFilter: ["min", "max", "step", "data-min"],
      });
    }

    // Ensure initial parity (value + button state) on load.
    mirrorValue(mainQty, stickyQty, false);
  }

  /**
   * Show the bar once the main Add to Cart button has scrolled out of the
   * viewport (upwards), hide it again when the main button is back in view.
   */
  function setupVisibilityObserver(bar, sectionId) {
    var trigger =
      document.getElementById("ProductSubmitButton-" + sectionId) ||
      document.querySelector(
        "#MainProduct-" + sectionId + " .product-form__buttons"
      );

    if (!trigger || typeof IntersectionObserver !== "function") {
      return;
    }

    function setVisible(visible) {
      bar.classList.toggle("is-visible", visible);
      bar.setAttribute("aria-hidden", visible ? "false" : "true");
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Only show the bar when the trigger has scrolled ABOVE the viewport,
          // not when it is still below the fold on initial load.
          var scrolledPast =
            !entry.isIntersecting && entry.boundingClientRect.top < 0;
          setVisible(scrolledPast);
        });
      },
      { threshold: 0 }
    );

    observer.observe(trigger);
  }

  function initAll() {
    var bars = document.querySelectorAll(".product-sticky-add-bar");
    for (var i = 0; i < bars.length; i++) {
      initStickyBar(bars[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Re-initialise when the section is re-rendered in the theme editor.
  document.addEventListener("shopify:section:load", initAll);
})();
