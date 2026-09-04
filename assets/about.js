(function () {
  if (window.__aboutAccordionInit) return;
  window.__aboutAccordionInit = true;

  const initProductAccordion = () => {
    $(".product-about__accordion-title")
      .off("click.productAbout")
      .on("click.productAbout", function () {
        if (!$(this).hasClass("active")) {
          $(".product-about__accordion-title.active").removeClass("active");
          $(this).addClass("active");
          $(".product-about__accordion-content").stop().slideUp(200);
          $(this)
            .siblings(".product-about__accordion-content")
            .eq($(this).index())
            .stop()
            .slideDown(200);
        } else {
          $(this).removeClass("active");
          $(this)
            .siblings(".product-about__accordion-content")
            .stop()
            .slideUp(200);
        }
      });
  };

  document.addEventListener("shopify:section:load", initProductAccordion);
  initProductAccordion();
})();
