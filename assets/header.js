(function () {
  const initMegaSubmenu = (header) => {
    const megaSubmenuLinks = header.querySelectorAll(".list-menu-has-child");
    if (!megaSubmenuLinks || !megaSubmenuLinks.length) return;
    megaSubmenuLinks.forEach((link) => {
      const tabs = link.querySelectorAll(".mega-submenu__tab");

      if (!tabs?.[0]?.classList.contains("active")) {
        tabs.forEach((tabItem) => {
          tabItem.classList.add("active");
        });
      }
      const submenus = link.querySelectorAll(".mega-submenu__submenu");
      const onToggle = (event) => {
        const tab = event.target;
        if (!tab || !tab.classList.contains("mega-submenu__tab")) return;
        const tabId = tab.dataset.tabId;
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });
        tab.classList.add("active");
        submenus.forEach((submenu) => {
          submenu.classList.remove("active");
          if (submenu.dataset.tabId === tabId) {
            submenu.classList.add("active");
          }
        });
      };
      tabs.forEach((tab) => {
        tab.addEventListener("click", onToggle);
        tab.addEventListener("mouseenter", onToggle);
      });
    });
  };
  const header = () => {
    const body = document.querySelector("body");
    const header = document.querySelector(".shopify-section-header");
    const headerDetails = document.querySelector(".menu-drawer-container");
    const headerIsAlwaysSticky =
      header
        .querySelector(".header-wrapper")
        .getAttribute("data-sticky-type") === "always";
    const announcementHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--announcement-height"
        )
      ) || 0;

    headerDetails.addEventListener("toggle", function (e) {
      const colorScheme =
        this.querySelector("#menu-drawer").dataset.colorScheme;
      header.classList.toggle(colorScheme);
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        header.classList.remove("shopify-section-header-sticky", "animate");
        body.classList.remove("overflow-hidden");
      }
    });

    document.addEventListener("scroll", () => {
      let scrollTop = window.scrollY;
      if (scrollTop > header.offsetHeight && headerIsAlwaysSticky) {
        header.classList.add("fixed", "animate");
      } else if (scrollTop <= header.offsetHeight && headerIsAlwaysSticky) {
        header.classList.remove("fixed", "animate");
      }
      if (scrollTop > announcementHeight && headerIsAlwaysSticky) {
        if (header.classList.contains("header-overlay")) {
          header.style.position = "fixed";
          header.style.top = `0px`;
        }
      } else if (scrollTop <= announcementHeight && headerIsAlwaysSticky) {
        if (header.classList.contains("header-overlay")) {
          header.style.position = "absolute";
          header.style.top = `${announcementHeight}px`;
        }
      }
    });

    const addBackground = () => {
      if (
        header.classList.contains("color-inverse") &&
        !header.classList.contains("shopify-section-header-sticky")
      ) {
        header.classList.remove("color-inverse");
      }
    };

    const removeBackground = () => {
      if (document.body.classList.contains("overflow-hidden-tablet")) {
        return;
      }

      if (
        header.classList.contains("header-overlay") &&
        !header.classList.contains("shopify-section-header-sticky")
      ) {
        header.classList.add("color-inverse");
      }
    };

    header.addEventListener("mouseenter", addBackground);

    header.addEventListener("focus", addBackground);

    header.addEventListener("focusin", addBackground);

    header.addEventListener("mouseleave", removeBackground);

    header.addEventListener("focusout", removeBackground);

    initMegaSubmenu(header);
  };

  header();

  document.addEventListener("shopify:section:load", header);
  document.addEventListener("shopify:section:unload", header);
  document.addEventListener("shopify:section:reorder", header);
})();
