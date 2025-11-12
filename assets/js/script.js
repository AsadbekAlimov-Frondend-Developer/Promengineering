$('.menu-btn').on('click', function () {
  const index = $('.menu-btn').index(this);
  $('.menu-btn').removeClass('active')
    .eq(index === 0 ? 1 : 0)
    .addClass('active');
  $('.hamburger').toggleClass('active');
});


// burger menu end


if (window.innerWidth <= 769) {
  new Swiper('.products_slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    pagination: {
      el: '.product_swiper-pagination',
    }
  });
}
if (window.innerWidth <= 769) {
  new Swiper('.certificate_slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    pagination: {
      el: '.certificate_swiper-pagination',
    }
  });
}
// ============================================

let swiper;

function initSwiper() {
  if (window.innerWidth <= 769) {
    swiper = new Swiper('.results_slider', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.certificate_swiper-pagination',
        clickable: true
      }
    });
  } else {
    swiper = new Swiper('.results_slider', {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      pagination: {
        el: '.certificate_swiper-pagination',
        type: 'progressbar',
      }
    });
  }
}

initSwiper();

window.addEventListener('resize', () => {
  if (swiper) swiper.destroy(true, true);
  initSwiper();
});

//==================================================== 

var $titles = $('.company .section-title');

if ($titles.length) {
  $titles.each(function () {
    var text = $(this).text();
    var newText = text.replace(/,(\s*)/, ',$1<br>');
    $(this).html(newText);
  });
}
// =================================contact
$(document).ready(function () {
  const $form = $('.contact_item');

  // Agar forma mavjud bo'lmasa, hech narsa qilmaymiz
  if (!$form.length) return;

  const $nameInput = $form.find('#name');
  const $phoneInput = $form.find('#phone_number');
  const $checkbox = $('#contact-checkbox');
  const $submitBtn = $('.contact_btn');

  // Agar kerakli elementlar bo'lmasa, to'xtatamiz
  if (!$nameInput.length || !$phoneInput.length || !$checkbox.length || !$submitBtn.length) return;

  $submitBtn.prop('disabled', true);

  let nameTouched = false;
  let phoneTouched = false;

  function isValid($input) {
    const val = $input.val().trim();
    if (!val) return false;
    if (!$input[0].checkValidity()) return false;
    if ($input.attr('type') === 'number' && val.length < 9) return false;
    return true;
  }

  function validate($input, touched) {
    if (!touched) return isValid($input);

    const valid = isValid($input);
    $input.css({
      'border': valid ? '1px solid #83CACC' : '1px solid #FF6363',
      'background': valid ? ' rgba(131, 202, 204, 0.42)' : 'rgba(255, 163, 163, 0.42)'
    });
    return valid;
  }

  function checkForm() {
    const allValid = isValid($nameInput) && isValid($phoneInput) && $checkbox.is(':checked');

    if (allValid) {
      $submitBtn.prop('disabled', false).removeAttr('disabled');
    } else {
      $submitBtn.prop('disabled', true).attr('disabled', 'disabled');
    }
  }

  $nameInput.on('input blur', function () {
    nameTouched = true;
    validate($(this), nameTouched);
    checkForm();
  });

  $phoneInput.on('input blur', function () {
    phoneTouched = true;
    validate($(this), phoneTouched);
    checkForm();
  });

  $checkbox.on('change', checkForm);


});

// =========================== team ==
if (window.innerWidth <= 769) {
  swiper = new Swiper('.team_slider', {
    slidesPerView: 1.3,
    spaceBetween: 38,
    loop: true,
    grabCursor: true,
    pagination: {
      el: '.team-pagination',
      type: 'progressbar',
    }
  });

}

// ==========================================


$(document).ready(function () {
  $('#phone_number').inputmask("+7 (999) 999-99-99");
});
