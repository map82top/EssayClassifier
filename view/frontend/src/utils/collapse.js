export function collapseVertical(element, margin) {
    let sectionHeight = element.scrollHeight;
    if(margin) {
        sectionHeight += margin;
    }

    let elementTransition = element.style.transition;
    element.style.transition = '';

  requestAnimationFrame(function() {
    element.style.height = sectionHeight + 'px';
    element.style.transition = elementTransition;

    requestAnimationFrame(function() {
      element.style.height = 0 + 'px';
    });
  });
}

export function expandVertical(element, margin) {
    let sectionHeight = element.scrollHeight;
    if(margin) {
        sectionHeight += margin;
    }
    // element.style.height = sectionHeight + 'px';
        element.style.height = 'max-content';
    // element.addEventListener('transitionend', function handler(e) {
    //     element.removeEventListener('transitionend', arguments.callee);
    //     element.style.height = null;
    // });
}

export function collapseHorizontal(element, margin) {
    let sectionWidth = element.scrollWidth;
    if(margin) {
        sectionWidth += margin;
    }

    let elementTransition = element.style.transition;
    element.style.transition = '';

  requestAnimationFrame(function() {
    element.style.width = sectionWidth + 'px';
    element.style.transition = elementTransition;

    requestAnimationFrame(function() {
      element.style.width = 0 + 'px';
    });
  });
}

export function expandHorizontal(element, margin) {
    let sectionWidth = element.scrollWidth;

    if(margin) {
        sectionWidth += margin;
    }

    element.style.width = sectionWidth + 'px';
}