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
