(function () {
  const searchModal = () => {
    $(".search-modal-trigger,.search-modal__overlay,.search__close").click(
      function (e) {
        e.preventDefault();
        searchToggle();
      }
    );
  };
  $(document).on("keyup", function (e) {
    if ($(".search-modal").hasClass("active") && e.key == "Escape") {
      searchToggle();
    }
  });
  function searchToggle() {
    $("#search-modal").toggleClass("active");
    if ($("#search-modal").hasClass("active")) {
      $("#search-modal").find(".search__input")[0].focus();
    } else {
      $(".search-modal-trigger").focus();
    }

    if ($(".search-modal").hasClass("active")) {
      $("body").addClass("overflow-hidden");
    } else {
      $("body").removeClass("overflow-hidden");
    }
  }
  document.addEventListener("shopify:section:load", searchModal);
  searchModal();
})();
