(function () {
  const sectionTabs = () => {
    $(".tabs-section").each(function () {
      if ($(this).hasClass("slider_started")) {
        return "";
      }
      $(this).addClass("slider_started");

      const tabs = $(this).find("[data-tab-target]");
      const firstTab = $(this).find("[data-tab-target]:first-child");
      const tabContents = $(this).find("[data-tab-content]");
      const tabContentsText = $(this).find(
        "[data-tab-content]:not(.tab__item-img)"
      );
      const tabContentsImage = $(this).find("[data-tab-content].tab__item-img");

      let maxContent = [];

      tabContentsText.each(function () {
        let isHide = false;
        if ($(this).css("display") === "none") {
          $(this).show(0);
          isHide = true;
        }
        maxContent.push($(this).find(".tab__item-info-block").height());
        if (isHide) {
          $(this).hide(0);
        }
      });
      //console.log(maxContent);
      const maxContentValue = Math.max(...maxContent) + 58;
      tabContentsText
        .find(".tab__item-info-block")
        .css("min-height", maxContentValue + "px");

      const isAutoplay = $(this).data("autoplay");
      const autoplaySpeed = +$(this).data("autoplay-speed");

      let progressInterval;
      let progressTimeOut;

      if (isAutoplay) {
        nextTab(firstTab);
      }

      tabs
        .click(function () {
          nextTab($(this));
        })
        .on("mouseenter", function () {
          if (isAutoplay) pauseAutoplay();
        })
        .on("mouseleave", function () {
          if (isAutoplay) resumeAutoplay();
        });

      function getCurrentTab($this) {
        const id = $this.data("tab-target");
        return {
          textContents: tabContentsText.filter(function () {
            return $(this).data("tab-content") === id;
          }),
          imageContents: tabContentsImage.filter(function () {
            return $(this).data("tab-content") === id;
          }),
        };
      }

      function nextTab(currentTab) {
        if (currentTab.length < 1) return;
        const currents = getCurrentTab(currentTab);
        tabs.removeClass("active");
        currentTab.addClass("active");

        tabContentsText.stop(false, false).fadeOut(0, function () {
          currents.textContents.stop(false, false).fadeIn(0);
        });

        tabContentsImage.removeClass("active");
        currents.imageContents.addClass("active");

        if (isAutoplay) {
          startProgress(currentTab);
        }
      }

      function pauseAutoplay() {
        clearInterval(progressInterval);
        clearTimeout(progressTimeOut);
      }

      function resumeAutoplay() {
        const currentTab = tabs.filter(".active");
        if (currentTab.length && isAutoplay) {
          startProgress(currentTab);
        }
      }

      function startProgress(currentTab) {
        let index = 0;
        clearInterval(progressInterval);
        clearTimeout(progressTimeOut);
        tabs.each(function () {
          $(this)[0].style.setProperty("--progress", "0%");
        });

        progressInterval = setInterval(() => {
          currentTab[0].style.setProperty("--progress", ++index + "%");
        }, autoplaySpeed / 100);

        progressTimeOut = setTimeout(() => {
          currentTab[0].style.setProperty("--progress", "0%");
          clearInterval(progressInterval);
          let toTab = currentTab.next("[data-tab-target]");
          if (toTab.length < 1) {
            toTab = firstTab;
          }
          nextTab(toTab);
        }, autoplaySpeed);
      }
    });
  };
  document.addEventListener("DOMContentLoaded", function () {
    sectionTabs();
    document.addEventListener("shopify:section:load", function () {
      sectionTabs();
    });
  });
})();
