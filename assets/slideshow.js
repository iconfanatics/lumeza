(function () {
  const slideshow = () => {
    $(".slideshow-section").each(function () {
      if ($(this).hasClass("slider_started")) {
        return "";
      }
      $(this).addClass("slider_started");
      const id = $(this).attr("id");
      const box = $(this).find(".slideshow");
      const autoplay = box.data("autoplay");
      const stopAutoplay = box.data("stop-autoplay");
      const delay = box.data("delay") * 1000;
      const speed = box.data("speed") * 1000;
      if (autoplay) {
        autoplayParm = {
          autoplay: {
            delay: delay,
            pauseOnMouseEnter: stopAutoplay,
            disableOnInteraction: false,
            waitForTransition: true,
          },
        };
      } else {
        autoplayParm = {};
      }
      let swiperParms = {
        parallax: box.data("parallax"),
        effect: box.data("effect"),
        speed: speed,
        loop: true,
        centeredSlides: false,
        autoHeight: false,
        calculateHeight: false,
        keyboard: true,
        allowTouchMove: true,
        watchSlidesProgress: true,
        preventInteractionOnTransition: true,
        mousewheel: {
          forceToAxis: true,
        },
        creativeEffect: {
          prev: {
            shadow: false,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        },
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        },
        flipEffect: {
          slideShadows: false,
        },
        navigation: {
          nextEl: `#${id} .swiper-button-next`,
          prevEl: `#${id} .swiper-button-prev`,
        },
        pagination: {
          el: `#${id} .swiper-pagination`,
          clickable: "true",
          type: "custom",
          renderCustom: function (swiper, current, total) {
            return `
						<span class="current-slide">${current < 10 ? "0" + current : current}</span>
						<span class="swiper-pagination-delimiter"></span>
						<span class="total-slides">${total < 10 ? "0" + total : total}</span>`;
          },
        },
        ...autoplayParm,
      };
      const swiper = new Swiper(`#${id} .slideshow__swiper`, swiperParms);
      swiper.on("slideChange", function () {
        colorScheme(this);
      });

      function colorScheme(context) {
        //const parent = $(context.el).parent();
        const parent = box.find(".swiper-controllers");
        const activeIndex = context.activeIndex;
        const activeSlide = context.slides[activeIndex];
        const changeItems = [parent[0]];
        const colorScheme = $(activeSlide)
          .find(".slideshow-slide")
          .data("color-scheme");
        changeItems.forEach((item) => {
          const classes = item?.classList;
          if (classes) {
            for (let className of classes) {
              if (/color-background-\d+$/.test(className)) {
                item.classList.remove(className);
              }
            }
          }

          item?.classList.add(colorScheme);
        });
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    slideshow();
    document.addEventListener("shopify:section:load", function () {
      slideshow();
    });
  });
})();
