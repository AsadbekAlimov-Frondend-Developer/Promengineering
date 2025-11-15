(function ($) {
  'use strict';

  $(function () {

    // ========== MENU BUTTON ==========
    $('.menu-btn').on('click', function () {
      const $this = $(this);
      $('.menu-btn').removeClass('active');
      const index = $('.menu-btn').index(this);
      if ($('.menu-btn').length === 2) {
        $('.menu-btn').eq(index === 0 ? 1 : 0).addClass('active');
      } else {
        $this.toggleClass('active');
      }
      $('.hamburger').toggleClass('active');
    });

    // ========== SWIPER MANAGEMENT ==========
    const swiperInstances = {};
    const SWIPER_CONFIG = {
      '.products_slider': function () {
        const $slider = document.querySelector('.products_slider');
        if (!$slider) return null;
        const slideCount = $slider.querySelectorAll('.swiper-slide').length;
        const perView = window.innerWidth <= 769 ? 1 : 3;
        return {
          slidesPerView: perView,
          spaceBetween: 30,
          loop: slideCount >= perView * 2,
          pagination: { el: '.product_swiper-pagination', clickable: true }
        };
      },
      '.certificate_slider': function () {
        const $slider = document.querySelector('.certificate_slider');
        if (!$slider) return null;
        const slideCount = $slider.querySelectorAll('.swiper-slide').length;
        const perView = window.innerWidth <= 769 ? 1 : 4;
        return {
          slidesPerView: perView,
          spaceBetween: 30,
          loop: slideCount >= perView * 2,
          pagination: { el: '.certificate_swiper-pagination', clickable: true }
        };
      },
      '.results_slider': function () {
        const $slider = document.querySelector('.results_slider');
        if (!$slider) return null;
        const slideCount = $slider.querySelectorAll('.swiper-slide').length;
        return window.innerWidth <= 769 ? {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: slideCount >= 2,
          pagination: { el: '.results_swiper-pagination', clickable: true }
        } : {
          slidesPerView: 3,
          spaceBetween: 30,
          loop: slideCount >= 6,
          grabCursor: true,
          pagination: { el: '.results_swiper-pagination', type: 'progressbar' }
        };
      },
      '.team_slider': function () {
        if (window.innerWidth > 769) return null;

        const $slider = document.querySelector('.team_slider');
        if (!$slider) return null;
        const slideCount = $slider.querySelectorAll('.swiper-slide').length;

        return {
          slidesPerView: 1.3,
          spaceBetween: 38,
          loop: slideCount >= 3,
          grabCursor: true,
          pagination: { el: '.team-pagination', type: 'progressbar' }
        };
      }
    };

    function initOrUpdateSwipers() {
      Object.keys(SWIPER_CONFIG).forEach(selector => {
        const el = document.querySelector(selector);
        if (!el) return;
        const config = SWIPER_CONFIG[selector]();
        if (!config) return;
        if (swiperInstances[selector] && swiperInstances[selector].destroy) {
          try { swiperInstances[selector].destroy(true, true); } catch (e) { }
          delete swiperInstances[selector];
        }
        try { swiperInstances[selector] = new Swiper(selector, config); } catch (e) { }
      });
    }

    initOrUpdateSwipers();
    let resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initOrUpdateSwipers, 150);
    });

    // ========== THUMBS + MAIN SLIDERS ==========
    if (document.querySelector(".mainSlider")) {
      let m, t;
      function initThumbSlider() {
        if (m) m.destroy(true, true);
        if (t) t.destroy(true, true);
        if (window.innerWidth <= 769) {
          m = new Swiper(".mainSlider", {
            pagination: { el: ".main-pagination", clickable: true }
          });
        } else {
          t = new Swiper(".thumbsSlider", { slidesPerView: 4, spaceBetween: 20, watchSlidesProgress: true });
          m = new Swiper(".mainSlider", { thumbs: { swiper: t } });
        }
      }
      initThumbSlider();
      window.addEventListener("resize", initThumbSlider);
    }

    // ========== CONTACT FORM VALIDATION ==========
    const $form = $('.contact_item');
    if ($form.length) {
      const $nameInput = $('#name');
      const $phoneInput = $('#phone_number');
      const $checkbox = $('#contact-checkbox');
      const $submitBtn = $('.contact_btn');

      $submitBtn.prop('disabled', true);

      // InputMask
      if ($phoneInput.length && typeof $.fn.inputmask === 'function') {
        $phoneInput.inputmask({
          mask: '+7 (999) 999-99-99',
          placeholder: '_',
          showMaskOnHover: false,
          clearIncomplete: false
        });
      } else if ($phoneInput.length) {
        $phoneInput.on('input', function () {
          let value = $(this).val().replace(/\D/g, '');
          if (value.length > 0 && value[0] === '7') value = value.substring(1);
          let formatted = '+7';
          if (value.length > 0) formatted += ' (' + value.substring(0, 3);
          if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
          if (value.length >= 7) formatted += '-' + value.substring(6, 8);
          if (value.length >= 9) formatted += '-' + value.substring(8, 10);
          $(this).val(formatted);
        });
      }

      function isValidInput($input) {
        const val = ($input.val() || '').trim();
        if (!val) return false;
        if ($input.attr('id') === 'phone_number') {
          return val.replace(/\D/g, '').length === 11;
        }
        if ($input.attr('id') === 'name') {
          return val.length >= 2;
        }
        return true;
      }

      function updateFieldStyle($input, touched) {
        if (!touched) return false;
        const ok = isValidInput($input);
        $input.css({
          border: ok ? '1px solid #83CACC' : '1px solid #FF6363',
          background: ok ? 'rgba(131, 202, 204, 0.42)' : 'rgba(255, 163, 163, 0.42)',
          transition: 'all 0.3s ease'
        });
        return ok;
      }

      let nameTouched = false;
      let phoneTouched = false;

      function checkForm() {
        const nameValue = ($nameInput.val() || '').trim();
        const phoneValue = ($phoneInput.val() || '').trim();
        const nameValid = isValidInput($nameInput);
        const phoneValid = isValidInput($phoneInput);
        const checkboxValid = $checkbox.is(':checked');

        // Rang berish faqat touched bo'lganda
        if (nameTouched) {
          $nameInput.css({
            border: nameValid ? '1px solid #83CACC' : '1px solid #FF6363',
            background: nameValid ? 'rgba(131, 202, 204, 0.42)' : 'rgba(255, 163, 163, 0.42)',
            transition: 'all 0.3s ease'
          });
        }

        if (phoneTouched) {
          $phoneInput.css({
            border: phoneValid ? '1px solid #83CACC' : '1px solid #FF6363',
            background: phoneValid ? 'rgba(131, 202, 204, 0.42)' : 'rgba(255, 163, 163, 0.42)',
            transition: 'all 0.3s ease'
          });
        }

        // Button disabled bo'lishi: hamma input to'g'ri yozilmasa
        const allValid = nameValid && phoneValid && checkboxValid;

        $submitBtn.prop('disabled', !allValid).css({
          opacity: allValid ? '1' : '1',
          cursor: allValid ? 'pointer' : 'defoult'
        });
      }

      $nameInput.on('focus', function () {
        nameTouched = true;
      }).on('input blur', checkForm);

      $phoneInput.on('focus', function () {
        phoneTouched = true;
      }).on('input blur', checkForm);

      $checkbox.on('change', checkForm);

      $form.on('submit', function (e) {
        e.preventDefault();
        if (!$submitBtn.prop('disabled')) {
          $form[0].reset();
          nameTouched = false;
          phoneTouched = false;
          $nameInput.css({ border: '', background: '' });
          $phoneInput.css({ border: '', background: '' });
          checkForm();
        }
      });
    }


    // ========== CUSTOM SELECT ==========
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
        $selectSelected.text($(this).text().trim());
        $selectItems.removeClass('show').addClass('select-hide');
        $selectSelected.removeClass('select-arrow-active');
        $container.trigger('custom-select:changed', [$(this).data('value')]);
      });

      $(document).on('click.catalogSelect', function () {
        if ($selectItems.hasClass('show')) {
          $selectItems.removeClass('show').addClass('select-hide');
          $selectSelected.removeClass('select-arrow-active');
        }
      });
    }

    // ========== ACCORDION ==========
    $('.accordion-button').on('click', function () {
      $('.accordion-button').not(this).addClass('collapsed');
    });

    // ========== CATALOG TOGGLE ==========
    window.catalog_toggleActive = function () {
      const $section = $('.catalog_category');
      if ($section.length) $section.toggleClass('active');
    };

  });
})(jQuery);