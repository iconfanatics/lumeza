(function () {
  const productMarkers = () =>
    $(document).ready(function () {
      $(".js-product-markers__item").click(function () {
        $(".product-markers__img-box").css({
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
        });

        $(".product-markers-for-mobile .js-product-markers__item-inner").each(
          function (index) {
            $(this).css({ display: "none" });
          }
        );

        $(
          `.product-markers-for-mobile .js-product-markers__item-inner[data-index='${$(
            this
          ).data("index")}']`
        ).css({ display: "block" });
      });
      $(".product-markers-section").each(function () {
        $(this)
          .find(".product-markers__marker")
          .hover(() => {
            $(this).find(".product-markers__marker").removeClass("active");
          });
      });
    });

  document.addEventListener("DOMContentLoaded", function () {
    productMarkers();
    document.addEventListener("shopify:section:load", function () {
      productMarkers();
    });
  });
})();
