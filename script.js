$('.add-custom-scrollbar:not(.has-scrollbar)').each(function() {
    initScrollbar($(this));
});

$(window).on('resize', function() {
    $('.add-custom-scrollbar:not(.has-scrollbar)').each(function() {
        initScrollbar($(this));
    });
    $('.add-custom-scrollbar.has-scrollbar').each(function() {
        refreshScrollbar($(this));
    });
});

function initScrollbar(wrapper) {
    let element = wrapper.find('.custom-scrollbar-target');
    let elementOuterWidth = element.outerWidth();
    let elementScrollWidth = element[0].scrollWidth;
    let isElementOverflowing = elementOuterWidth / elementScrollWidth < 1;
    let scrollbarWidth = Math.floor((elementOuterWidth / elementScrollWidth) * 100);

    wrapper.append(`<div class="custom-scrollbar${isElementOverflowing ? '' : ' hidden'}">
                        <div class="custom-scrollbar__inner" style="width: ${scrollbarWidth}%;"></div>
                    </div>`);
    
    if (isElementOverflowing) {
        wrapper.addClass('has-scrollbar');
    } else {
        wrapper.addClass('no-overflow');
    }

    element.on('scroll', moveScrollbar);
}

function refreshScrollbar(wrapper) {
    let element = wrapper.find('.custom-scrollbar-target');
    let { isOverflowing, scrollbarWidth } = getElementScrollInfos(element);

    let scrollbar = wrapper.find('.custom-scrollbar');
    let scrollbarInner = wrapper.find('.custom-scrollbar__inner');

    scrollbarInner.css('width', scrollbarWidth + '%');
    
    if (isOverflowing) {
        wrapper.addClass('has-scrollbar');
        wrapper.removeClass('no-overflow');
        scrollbar.removeClass('hidden');
    } else {
        wrapper.addClass('no-overflow');
        wrapper.removeClass('has-scrollbar');
        scrollbar.addClass('hidden');
    }
}

function moveScrollbar() {
    let scrollbarWrapper = $(this).parent().find('.custom-scrollbar');
    let scrollbar = $(this).parent().find('.custom-scrollbar__inner');
    let scrollbarWrapperInnerWidth = scrollbarWrapper.outerWidth() - parseInt(scrollbar.css('margin-left')) - parseInt(scrollbar.css('margin-right'));
    let overflowSpace = scrollbarWrapperInnerWidth - scrollbar.outerWidth();
    console.log(overflowSpace);
    let { overflowLeftPercentage } = getElementScrollInfos($(this));
    scrollbar.css('left', overflowSpace * overflowLeftPercentage + 'px');
}

function getElementScrollInfos(element) {
    let infos = {};
    infos.outerWidth = element.outerWidth();
    infos.scrollLeft = element.scrollLeft();
    infos.scrollWidth = element[0].scrollWidth;
    infos.isOverflowing = infos.outerWidth / infos.scrollWidth < 1;
    infos.scrollbarWidth = Math.floor((infos.outerWidth / infos.scrollWidth) * 100);
    infos.overflow = infos.scrollWidth - infos.outerWidth;
    infos.overflowLeftPercentage = (infos.scrollLeft / infos.overflow);
    return infos;
}