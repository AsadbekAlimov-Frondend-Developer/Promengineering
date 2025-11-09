$('.menu-btn').on('click', function () {
  const index = $('.menu-btn').index(this);
  $('.menu-btn').removeClass('active')
    .eq(index === 0 ? 1 : 0)
    .addClass('active');
  $('.hamburger').toggleClass('active');
});


// burger menu end


if (window.innerWidth <= 768) {
  new Swiper('.products_slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop:true,
    pagination: {
      el: '.product_swiper-pagination',
    }
  });
}