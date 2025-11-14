(function ($) {
  'use strict';

  // Optimized script for Swipers, menu toggle, contact validation, custom select, and thumbnails
  $(function () {

    // ---------- MENU BUTTON ----------
    $('.menu-btn').on('click', function () {
      const $this = $(this);
      // Toggle active on hamburger and swap active class between the two menu-btns
      $('.menu-btn').removeClass('active');
      // If there are exactly two buttons, activate the other one. Otherwise toggle current.
      const index = $('.menu-btn').index(this);
      if ($('.menu-btn').length === 2) {
        $('.menu-btn').eq(index === 0 ? 1 : 0).addClass('active');
      } else {
        $this.toggleClass('active');
      }
      $('.hamburger').toggleClass('active');
    });

    // ---------- SWIPER MANAGEMENT ----------
    // Keep instances in a map keyed by selector
    const swiperInstances = {};

    // Config map for sliders - you can extend options per slider
    const SWIPER_CONFIG = {
      '.products_slider': function () {
        return {
          slidesPerView: window.innerWidth <= 769 ? 1 : 3,
          spaceBetween: 30,
          loop: true,
          pagination: { el: '.product_swiper-pagination', clickable: true }
        };
      },
      '.certificate_slider': function () {
        return {
          slidesPerView: window.innerWidth <= 769 ? 1 : 4,
          spaceBetween: 30,
          loop: true,
          pagination: { el: '.certificate_swiper-pagination', clickable: true }
        };
      },
      '.results_slider': function () {
        return window.innerWidth <= 769 ?
          {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: { el: '.results_swiper-pagination', clickable: true }
          } :
          {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            grabCursor: true,
            pagination: { el: '.results_swiper-pagination', type: 'progressbar' }
          };
      },
      '.team_slider': function () {
        return {
          slidesPerView: window.innerWidth <= 769 ? 1.3 : 3,
          spaceBetween: 38,
          loop: true,
          grabCursor: true,
          pagination: { el: '.team-pagination', type: 'progressbar' }
        };
      }
    };

    function initOrUpdateSwipers() {
      Object.keys(SWIPER_CONFIG).forEach(selector => {
        const el = document.querySelector(selector);
        if (!el) return; // skip if not on page

        const config = SWIPER_CONFIG[selector]();

        // If instance exists destroy it first to re-init with new options
        if (swiperInstances[selector] && swiperInstances[selector].destroy) {
          try {
            swiperInstances[selector].destroy(true, true);
          } catch (e) {
            // ignore
          }
          delete swiperInstances[selector];
        }

        // Create new instance
        swiperInstances[selector] = new Swiper(selector, config);
      });
    }

    // Initial init
    initOrUpdateSwipers();

    // Debounced resize handler
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        initOrUpdateSwipers();
      }, 150);
    });

    // ---------- THUMBS + MAIN SLIDERS (pair) ----------
    // Only init if DOM elements exist
    // if (document.querySelector('.thumbsSlider') && document.querySelector('.mainSlider')) {
    //   // Destroy previous if any
    //   if (swiperInstances['.thumbsSlider'] && swiperInstances['.thumbsSlider'].destroy) {
    //     try { swiperInstances['.thumbsSlider'].destroy(true, true); } catch (e) { }
    //   }
    //   if (swiperInstances['.mainSlider'] && swiperInstances['.mainSlider'].destroy) {
    //     try { swiperInstances['.mainSlider'].destroy(true, true); } catch (e) { }
    //   }

    //   swiperInstances['.thumbsSlider'] = new Swiper('.thumbsSlider', {
    //     spaceBetween: 20,
    //     slidesPerView: 4,
    //     freeMode: true,
    //     watchSlidesProgress: true
    //   });

    //   swiperInstances['.mainSlider'] = new Swiper('.mainSlider', {
    //     spaceBetween: 10,
    //     thumbs: { swiper: swiperInstances['.thumbsSlider'] }
    //   });
    // }
    if (!document.querySelector(".mainSlider")) return;

    let m, t;

    function init() {
      if (m) m.destroy(true, true);
      if (t) t.destroy(true, true);

      if (window.innerWidth <= 769) {
        m = new Swiper(".mainSlider", {
          pagination: { el: ".main-pagination", clickable: true }
        });
      } else {
        t = new Swiper(".thumbsSlider", { slidesPerView: 4, spaceBetween: 20 });
        m = new Swiper(".mainSlider", { thumbs: { swiper: t } });
      }
    }

    init();
    window.addEventListener("resize", init);

    // ---------- CONTACT FORM VALIDATION ----------
    const $form = $('.contact_item');
    if ($form.length) {
      const $nameInput = $form.find('#name');
      const $phoneInput = $form.find('#phone_number');
      const $checkbox = $form.find('#contact-checkbox');
      const $submitBtn = $form.find('.contact_btn');

      // If any required element is missing - skip
      if ($nameInput.length && $phoneInput.length && $checkbox.length && $submitBtn.length) {
        $submitBtn.prop('disabled', true);

        function isValidInput($input) {
          const val = $input.val() ? $input.val().trim() : '';
          if (!val) return false;
          // rely on native validation where possible
          if ($input.attr('type') === 'tel') {
            // phone mask "+7 (999) 999-99-99" -> check digits count
            const digits = (val.match(/\d/g) || []).length;
            return digits >= 10; // allow 10+ digits
          }
          return $input[0].checkValidity ? $input[0].checkValidity() : true;
        }

        function updateFieldStyle($input) {
          const ok = isValidInput($input);
          $input.css({
            border: ok ? '1px solid #83CACC' : '1px solid #FF6363',
            background: ok ? 'rgba(131, 202, 204, 0.42)' : 'rgba(255, 163, 163, 0.42)'
          });
          return ok;
        }

        function checkForm() {
          const allValid = isValidInput($nameInput) && isValidInput($phoneInput) && $checkbox.is(':checked');
          $submitBtn.prop('disabled', !allValid);
        }

        $nameInput.on('input blur', function () { updateFieldStyle($(this)); checkForm(); });
        $phoneInput.on('input blur', function () { updateFieldStyle($(this)); checkForm(); });
        $checkbox.on('change', checkForm);

        // run once on load
        checkForm();
      }
    }

    // ---------- CUSTOM SELECT (catalog_sort) ----------
    if ($('.catalog_sort .custom-select').length) {
      const $container = $('.catalog_sort');
      const $selectSelected = $container.find('.select-selected');
      const $selectItems = $container.find('.select-items');
      const $options = $selectItems.find('div');

      $selectSelected.on('click', function (e) {
        e.stopPropagation();
        $selectItems.toggleClass('select-hide show');
        $(this).toggleClass('select-arrow-active');
      });

      $options.on('click', function () {
        $options.removeClass('same-as-selected');
        $(this).addClass('same-as-selected');

        const text = $(this).text().trim();
        // If selected element contains an SVG (icon) that should be preserved, keep current HTML
        // Otherwise, replace text only (to not strip icons). We detect SVG by searching child <svg>.
        const hasSvg = $(this).find('svg').length > 0;
        if (hasSvg) {
          // If you want to also copy the SVG into selected, uncomment next line and adapt markup
          // $selectSelected.html($(this).html());
          $selectSelected.text(text);
        } else {
          $selectSelected.text(text);
        }

        $selectItems.removeClass('show').addClass('select-hide');
        $selectSelected.removeClass('select-arrow-active');

        const value = $(this).data('value');
        // Fire custom event for other parts of code to listen to
        $container.trigger('custom-select:changed', [value]);
      });

      // Close dropdown when clicking outside
      $(document).on('click.catalogSelect', function () {
        if ($selectItems.hasClass('show')) {
          $selectItems.removeClass('show').addClass('select-hide');
          $selectSelected.removeClass('select-arrow-active');
        }
      });
    }

    // ---------- TEAM SLIDER (small-screen only) ----------
    // Note: team slider already handled via SWIPER_CONFIG. Keep for backward compatibility.

    // ---------- INPUT MASK ----------
    if (typeof $.fn.inputmask === 'function' && $('#phone_number').length) {
      $('#phone_number').inputmask('+7 (999) 999-99-99');
    }

    // ---------- QUICK UTILITY: toggle catalog active ----------
    window.catalog_toggleActive = function () {
      const $section = $('.catalog_category');
      if ($section.length === 0) { console.warn('.catalog_category topilmadi'); return; }
      $section.toggleClass('active');
    };

  });
})(jQuery);
