const formatMoney = (cents) => {
  const fmt = (window.theme && window.theme.moneyFormat) || "${{amount}}";
  const amount = (cents / 100).toFixed(2);
  return fmt
    .replace(/\{\{\s*amount\s*\}\}/, amount)
    .replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100))
    .replace(
      /\{\{\s*amount_with_comma_separator\s*\}\}/,
      amount.replace(".", ",")
    )
    .replace(
      /\{\{\s*amount_no_decimals_with_comma_separator\s*\}\}/,
      String(Math.round(cents / 100)).replace(".", ",")
    );
};

const updateCardPrice = (wrapper, variant) => {
  const priceEl = wrapper.querySelector(".price");
  if (!priceEl) return;
  const onSale =
    variant.compare_at_price && variant.compare_at_price > variant.price;
  priceEl.classList.toggle("price--sold-out", !variant.available);
  priceEl.classList.toggle("price--on-sale", !!onSale);
  const regularItem = priceEl.querySelector(
    ".price__regular .price-item--regular"
  );
  const saleItem = priceEl.querySelector(".price__sale .price-item--sale");
  const compareItem = priceEl.querySelector(
    ".price__sale .price-item--regular"
  );
  const formattedPrice = formatMoney(variant.price);
  if (regularItem) regularItem.textContent = formattedPrice;
  if (saleItem) saleItem.textContent = formattedPrice;
  if (compareItem)
    compareItem.textContent = onSale
      ? formatMoney(variant.compare_at_price)
      : "";
};

const updateCardBadge = (wrapper, variant) => {
  const soldOutBadge = wrapper.querySelector(".card__badge .badge--soldout");
  if (soldOutBadge) {
    soldOutBadge.classList.toggle("hidden", variant.available);
  }
  const saleBadge = wrapper.querySelector(".card__badge .badge--sale");
  if (saleBadge) {
    const onSale =
      variant.compare_at_price && variant.compare_at_price > variant.price;
    saleBadge.classList.toggle("hidden", !onSale || !variant.available);
  }
};

const generateSrcset = (image, widths = []) => {
  const imageUrl = new URL(image["src"]);
  return widths
    .filter((width) => width <= image["width"])
    .map((width) => {
      imageUrl.searchParams.set("width", width.toString());
      return `${imageUrl.href} ${width}w`;
    })
    .join(", ");
};

const createImageElement = (image, classes, sizes, productTitle) => {
  const previewImage = image["preview_image"];
  const newImage = new Image(previewImage["width"], previewImage["height"]);
  newImage.className = classes;
  newImage.alt = image["alt"] || productTitle;
  newImage.sizes = sizes;
  newImage.src = previewImage["src"];
  newImage.srcset = generateSrcset(
    previewImage,
    [165, 360, 533, 720, 940, 1066]
  );
  newImage.loading = "lazy";
  return newImage;
};

const updateCardImage = (
  wrapper,
  primaryImage,
  secondaryImage,
  variant,
  productTitle
) => {
  if (!variant?.featured_media) return;
  const newPrimaryImage = createImageElement(
    variant["featured_media"],
    primaryImage.className,
    primaryImage.sizes,
    productTitle
  );

  const newSrc = new URL(newPrimaryImage.src).pathname;
  const oldSrc = new URL(primaryImage.src).pathname;
  if (newSrc === oldSrc) return;

  if (secondaryImage) {
    const secondarySrc = new URL(secondaryImage.src).pathname;
    if (secondarySrc === newSrc) {
      primaryImage.remove();
      secondaryImage.classList.remove("media--second");
      secondaryImage.classList.add("media--first");
      return;
    }
  }

  primaryImage.animate(
    { opacity: [1, 0] },
    { duration: 200, easing: "ease-in", fill: "forwards" }
  );
  setTimeout(function () {
    primaryImage.replaceWith(newPrimaryImage);
    newPrimaryImage.animate(
      { opacity: [0, 1] },
      { duration: 200, easing: "ease-in" }
    );
    if (secondaryImage) secondaryImage.remove();
  }, 200);
};

const checkSwatches = () => {
  document.querySelectorAll(".js-color-swatches-wrapper").forEach((wrapper) => {
    // checkSwatches() runs on load and again whenever cards are injected
    // dynamically (product recommendations, predictive search, filtered
    // grids). Skip wrappers that were already initialised so those repeat
    // passes don't stack duplicate click listeners on the same swatches.
    if (wrapper.dataset.swatchesBound === "true") return;
    wrapper.dataset.swatchesBound = "true";
    wrapper.querySelectorAll(".js-color-swatches input").forEach((input) => {
      input.addEventListener("click", (event) => {
        const primaryImage = wrapper.querySelector(".media--first");
        const secondaryImage = wrapper.querySelector(".media--second");
        const handleProduct = wrapper.dataset.product;

        if (!event.currentTarget.checked || !primaryImage) return;

        // Update the card link URL using the variant ID when available
        const variantId = event.currentTarget.dataset.variantId;
        const cardLink = wrapper.querySelector(".js-color-swatches-link");
        if (cardLink && variantId) {
          try {
            const linkUrl = new URL(
              cardLink.getAttribute("href"),
              window.location.origin
            );
            linkUrl.searchParams.set("variant", variantId);
            cardLink.setAttribute("href", linkUrl.pathname + linkUrl.search);
          } catch (_) {}
        }

        // Update quick-add cart form
        if (wrapper.querySelector('.card__add-to-cart button[name="add"]')) {
          wrapper
            .querySelector('.card__add-to-cart button[name="add"]')
            .setAttribute("aria-disabled", false);
          if (
            wrapper.querySelector(
              '.card__add-to-cart button[name="add"] > span'
            )
          ) {
            wrapper
              .querySelector('.card__add-to-cart button[name="add"] > span')
              .classList.remove("hidden");
            wrapper
              .querySelector(
                '.card__add-to-cart button[name="add"] .sold-out-message'
              )
              .classList.add("hidden");
          }
          if (variantId) {
            wrapper.querySelector('.card__add-to-cart input[name="id"]').value =
              variantId;
          }
        }

        const currentColor = event.currentTarget.value;

        // Combined-listing / linked-product swatches point to a different
        // product, so the selected variant (and its image) live in that
        // product's data — not this card's. Fetch the linked product when the
        // swatch provides its URL, mirroring how the main product variant
        // picker resolves combined listings; otherwise use this card's product.
        const linkedProductUrl = event.currentTarget.dataset.productUrl;
        const productJsonUrl = linkedProductUrl
          ? new URL(linkedProductUrl, window.location.origin).pathname.replace(
              /\/+$/,
              ""
            ) + ".js"
          : window.Shopify.routes.root + `products/${handleProduct}.js`;

        jQuery.getJSON(productJsonUrl, function (product) {
            let variant = null;
            let exactVariant = null;

            if (variantId) {
              // Use exact variant ID first — most reliable, avoids cross-option false matches.
              exactVariant = product.variants.find(
                (item) => item.id === parseInt(variantId)
              );
              if (exactVariant) {
                if (exactVariant.featured_media != null) {
                  variant = exactVariant;
                } else {
                  // Exact variant has no media: find the first variant for the same color
                  // option position that does have media.
                  const colorIndex = exactVariant.options.indexOf(currentColor);
                  variant = product.variants.find(
                    (item) =>
                      item.featured_media != null &&
                      (colorIndex !== -1
                        ? item.options[colorIndex] === currentColor
                        : item.options.includes(currentColor))
                  );
                }
              }
            }

            // Fallback when no variant ID is available (older card markup).
            if (!variant) {
              variant = product.variants.find(
                (item) =>
                  item.featured_media != null &&
                  item.options.includes(currentColor)
              );
            }

            // Price and badge always use the exact variant (most accurate availability/price),
            // falling back to the media variant if the exact one wasn't found.
            const priceVariant = exactVariant || variant;
            if (priceVariant) {
              updateCardPrice(wrapper, priceVariant);
              updateCardBadge(wrapper, priceVariant);
            }

            if (variant) {
              updateCardImage(
                wrapper,
                primaryImage,
                secondaryImage,
                variant,
                product.title
              );
            }
          }
        );
      });
    });
  });
};

function colorSwatches() {
  checkSwatches();

  document.addEventListener("shopify:section:load", function () {
    checkSwatches();
  });
}

(function () {
  colorSwatches();
})();
