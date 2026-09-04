if (!customElements.get("quick-add-modal")) {
  customElements.define(
    "quick-add-modal",
    class QuickAddModal extends ModalDialog {
      constructor() {
        super();
        this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');
      }

      hide(preventFocus = false) {
        const cartDrawer = document.querySelector("cart-drawer");
        if (cartDrawer) cartDrawer.setActiveElement(this.openedBy);
        this.modalContent.innerHTML = "";

        $(".js-media-list").each(function () {
          this.swiper.destroy();
        });
        $(".js-media-sublist").each(function () {
          this.swiper.destroy();
        });

        subSliderInit(true);
        sliderInit(true);
        updatethumbnail();

        if (preventFocus) this.openedBy = null;
        super.hide();
      }

      show(opener) {
        opener.setAttribute("aria-disabled", true);
        opener.classList.add("loading");

        this.addEventListener(
          "transitionend",
          () => {
            const containerToTrapFocusOn = document.getElementById(
              opener.getAttribute("data-modal-open")
            );
            const focusElement = this.querySelector(".modal-close-button");
            trapFocus(containerToTrapFocusOn, focusElement);
          },
          { once: true }
        );

        if (opener.querySelector(".loading-overlay__spinner")) {
          opener
            .querySelector(".loading-overlay__spinner")
            .classList.remove("hidden");
        }

        fetch(opener.getAttribute("data-product-url"))
          .then((response) => response.text())
          .then((responseText) => {
            const responseHTML = new DOMParser().parseFromString(
              responseText,
              "text/html"
            );
            this.productElement = responseHTML.querySelector(
              'section[id^="MainProduct-"]'
            );
            this.preventDuplicatedIDs();
            this.removeDOMElements();
            this.setInnerHTML(
              this.modalContent,
              this.productElement.innerHTML,
              opener
            );

            if (window.Shopify && Shopify.PaymentButton) {
              Shopify.PaymentButton.init();
            }

            if (window.ProductModel) window.ProductModel.loadShopifyXR();

            this.removeGalleryListSemantic();
            this.updateImageSizes();
            this.preventVariantURLSwitching();
            super.show(opener);
          })
          .finally(() => {
            opener.removeAttribute("aria-disabled");
            opener.classList.remove("loading");

            if (opener.querySelector(".loading-overlay__spinner")) {
              opener
                .querySelector(".loading-overlay__spinner")
                .classList.add("hidden");
            }

            document.querySelector("cart-drawer").classList.remove("active");

            subSliderInit();
            sliderInit();
            updatethumbnail();
            // Re-run after CSS transition so offsetHeight is accurate
            setTimeout(() => updatethumbnail(), 400);
          });
      }

      setInnerHTML(element, html, opener) {
        element.innerHTML = html;

        // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
        element.querySelectorAll("script").forEach((oldScriptTag) => {
          const newScriptTag = document.createElement("script");
          Array.from(oldScriptTag.attributes).forEach((attribute) => {
            newScriptTag.setAttribute(attribute.name, attribute.value);
          });
          newScriptTag.appendChild(
            document.createTextNode(oldScriptTag.innerHTML)
          );
          oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
        });

        // Read more button
        //const moreBtn = document.createElement("div");
        //moreBtn.setAttribute("class", "button-view-full");
        //moreBtn.innerHTML += `
        //	<a href="${opener.getAttribute(
        //		"data-product-url"
        //	)}" class="button button--simple">
        //		<span class="button-label">
        //			${theme.quickviewMore}
        //		</span>
        //		<span class="button-icon">
        //		<svg
        //			width="15"
        //			height="15"
        //			viewBox="0 0 15 15"
        //			fill="none"
        //			xmlns="http://www.w3.org/2000/svg"
        //			class="icon icon-button-arrow"
        //		>
        //			<path d="M8.22917 3.75L11.875 7.5M11.875 7.5L8.22917 11.25M11.875 7.5L3.125 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
        //		</svg>
        //		</span>
        //	</a>
        //	`;

        //element.querySelector(".product").appendChild(moreBtn);
      }

      removeDOMElements(element = null) {
        const root = element || this.productElement;

        const stackedSingleMediaContainer = root.querySelector(
          ".stacked-single-media-container"
        );
        if (stackedSingleMediaContainer) stackedSingleMediaContainer.remove();

        // The sticky Add to Cart bar is a fixed-position, full-page element and
        // must never be rendered inside the quick-add modal.
        const stickyAddBar = root.querySelector(".product-sticky-add-bar");
        if (stickyAddBar) stickyAddBar.remove();

        if (!element) {
          const pickupAvailability = this.productElement.querySelector(
            "pickup-availability"
          );
          if (pickupAvailability) pickupAvailability.remove();

          const linkedProducts =
            this.productElement.querySelector(".linked-products");
          if (linkedProducts) linkedProducts.remove();

          const productModal =
            this.productElement.querySelector("product-modal");
          if (productModal) productModal.remove();

          const gift = this.productElement.querySelector(".customer");
          if (gift) gift.remove();

          const complementaryProducts = this.productElement.querySelector(
            "product-recommendations--single"
          );
          if (complementaryProducts) complementaryProducts.remove();
        }
      }

      initSlider() {
        subSliderInit();
        sliderInit();
        updatethumbnail();
        // Re-run after CSS transition completes so offsetHeight is accurate
        setTimeout(() => updatethumbnail(), 400);
      }

      preventDuplicatedIDs() {
        const sectionId = this.productElement.dataset.section;
        this.productElement.innerHTML =
          this.productElement.innerHTML.replaceAll(
            sectionId,
            `quickadd-${sectionId}`
          );
        this.productElement
          .querySelectorAll("variant-selects, variant-radios")
          .forEach((variantSelect) => {
            variantSelect.dataset.originalSection = sectionId;
          });
      }

      preventVariantURLSwitching() {
        if (this.modalContent.querySelector("variant-radios,variant-selects")) {
          this.modalContent
            .querySelector("variant-radios,variant-selects")
            .setAttribute("data-update-url", "false");
        }
      }

      removeGalleryListSemantic() {
        const galleryList = this.modalContent.querySelector(
          '[id^="Slider-Gallery"]'
        );
        if (!galleryList) return;

        galleryList.setAttribute("role", "presentation");
        galleryList
          .querySelectorAll('[id^="Slide-"]')
          .forEach((li) => li.setAttribute("role", "presentation"));
      }

      updateImageSizes() {
        const product = this.modalContent.querySelector(".product");
        const desktopColumns = product.classList.contains("product--columns");
        if (!desktopColumns) return;

        const mediaImages = product.querySelectorAll(".product__media img");
        if (!mediaImages.length) return;

        let mediaImageSizes =
          "(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";

        if (product.classList.contains("product--medium")) {
          mediaImageSizes = mediaImageSizes.replace("715px", "605px");
        } else if (product.classList.contains("product--small")) {
          mediaImageSizes = mediaImageSizes.replace("715px", "495px");
        }

        mediaImages.forEach((img) =>
          img.setAttribute("sizes", mediaImageSizes)
        );
      }
    }
  );
}
