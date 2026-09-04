(function () {
  const initCollapsibleContent = () => {
    $(".collapsible-content-summery")
      .unbind("click")
      .on("click", function () {
        const $currentSummary = $(this);
        const $parentItem = $currentSummary.closest(
          ".collapsible-content-item"
        );
        const $section = $currentSummary.closest(".collapsible-content-box");

        const isCurrentlyActive = $parentItem.hasClass("active");

        $section
          .find(".collapsible-content-item.active")
          .removeClass("active")
          .find(".collapsible-content-block__description")
          .stop()
          .slideUp(300);

        if (!isCurrentlyActive) {
          $parentItem.addClass("active");
          $currentSummary
            .next(".collapsible-content-block__description")
            .stop()
            .slideDown(300);
        }
      });
  };

  document.addEventListener("shopify:section:load", function () {
    initCollapsibleContent();
  });

  document.addEventListener("DOMContentLoaded", function () {
    initCollapsibleContent();
  });
})();
