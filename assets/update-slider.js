(function () {
  function swiperInit() {
    subSliderInit(true);
    sliderInit(true);

    // With centeredSlides:true + slidesPerView:3, Swiper's snap grid maps
    // both slide 0 and slide 1 to translate=0, so initialization can land
    // at activeIndex=1. Reset both sliders to 0 synchronously so the user
    // never sees the stale position.
    document.querySelectorAll(".js-media-sublist").forEach(function (subEl) {
      if (subEl.swiper) subEl.swiper.slideTo(0, 0, false);
    });
    document.querySelectorAll(".js-media-list").forEach(function (mainEl) {
      if (mainEl.swiper) {
        mainEl.swiper.slideTo(0, 0, false);
        if (typeof mainEl.swiper.thumbs?.update === "function") {
          mainEl.swiper.thumbs.update();
        }
      }
    });
  }

  document.addEventListener("shopify:section:load", function (e) {
    swiperInit();
  });

  //window.addEventListener("resize", function () {
  //	$(".product-section .js-media-list").each(function () {
  //		this.swiper.destroy();
  //	});
  //	$(".product-section .js-media-sublist").each(function () {
  //		this.swiper.destroy();
  //	});

  //	swiperInit();
  //});

  swiperInit();
})();
