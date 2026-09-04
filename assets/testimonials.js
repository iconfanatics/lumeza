(function () {
  const sectionTabs = () => {
    const tabsSections = document.querySelectorAll(".testimonials");
    tabsSections.forEach((tabSection) => {
      const tabs = tabSection.querySelectorAll("[data-tab-target]");
      const tabContents = tabSection.querySelectorAll("[data-tab-content]");

      let maxContentHeight = 0;

      tabContents.forEach((tabContent) => {
        const originalDisplay = tabContent.style.display;
        tabContent.style.display = "block";
        let tabItemInfoBlock = tabContent.querySelector(
          ".testimonials__item-block"
        );

        if (tabItemInfoBlock.clientHeight > maxContentHeight) {
          maxContentHeight = tabItemInfoBlock.clientHeight;
        }

        tabContent.style.display = originalDisplay;
      });

      tabContents.forEach(function (tabContent) {
        let tabItemInfoBlock = tabContent.querySelector(
          ".testimonials__item-block"
        );
        tabItemInfoBlock.style.minHeight = maxContentHeight + "px";
      });

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const targets = tabSection.querySelectorAll(
            `[data-tab-content="${tab.dataset.tabTarget}"]`
          );
          tabContents.forEach((tabContent) => {
            tabContent.classList.remove("active");
          });
          tabs.forEach((tab) => {
            tab.classList.remove("active");
          });
          tab.classList.add("active");
          targets.forEach((target) => {
            target.classList.add("active");
          });
        });
      });
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    sectionTabs();
    document.addEventListener("shopify:section:load", function () {
      sectionTabs();
    });
  });
})();
