'use strict';

function initTestim() {
    var testim = document.getElementById("testim_v15");
    if (!testim) return;

    var testimDotsEl = document.getElementById("testim-dots_v15"),
        testimContentEl = document.getElementById("testim-content_v15"),
        testimLeftArrow = document.getElementById("left-arrow_v15"),
        testimRightArrow = document.getElementById("right-arrow_v15");

    if (!testimDotsEl || !testimContentEl || !testimLeftArrow || !testimRightArrow) return;

    var testimDots = Array.prototype.slice.call(testimDotsEl.children),
        testimContent = Array.prototype.slice.call(testimContentEl.children),
        testimSpeed = 4500,
        currentSlide = 0,
        currentActive = 0,
        testimTimer,
        touchStartPos,
        ignoreTouch = 30;

    function queueNext() {
        clearTimeout(testimTimer);
        if (document.hidden) return;
        testimTimer = setTimeout(function () {
            playSlide(currentSlide += 1);
        }, testimSpeed);
    }

    function playSlide(slide) {
        for (var k = 0; k < testimDots.length; k++) {
            testimContent[k].classList.remove("testim-active_v15");
            testimContent[k].classList.remove("testim-inactive_v15");
            testimDots[k].classList.remove("testim-active_v15");
        }

        if (slide < 0) {
            slide = testimContent.length - 1;
        }

        if (slide > testimContent.length - 1) {
            slide = 0;
        }

        if (currentActive != slide) {
            testimContent[currentActive].classList.add("testim-inactive_v15");
        }
        testimContent[slide].classList.add("testim-active_v15");
        testimDots[slide].classList.add("testim-active_v15");

        currentActive = slide;
        currentSlide = slide;

        queueNext();
    }

    testimLeftArrow.addEventListener("click", function () {
        playSlide(currentSlide -= 1);
    });

    testimRightArrow.addEventListener("click", function () {
        playSlide(currentSlide += 1);
    });

    for (var l = 0; l < testimDots.length; l++) {
        testimDots[l].addEventListener("click", function () {
            playSlide(currentSlide = testimDots.indexOf(this));
        });
    }

    playSlide(currentSlide);

    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 37:
                testimLeftArrow.click();
                break;
            case 39:
                testimRightArrow.click();
                break;
            default:
                break;
        }
    });

    testim.addEventListener("touchstart", function (e) {
        touchStartPos = e.changedTouches[0].clientX;
    }, { passive: true });

    testim.addEventListener("touchend", function (e) {
        var touchEndPos = e.changedTouches[0].clientX;
        var touchPosDiff = touchStartPos - touchEndPos;

        if (touchPosDiff > ignoreTouch) {
            testimRightArrow.click();
        } else if (touchPosDiff < -ignoreTouch) {
            testimLeftArrow.click();
        }
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            clearTimeout(testimTimer);
        } else {
            queueNext();
        }
    });
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    initTestim();
} else {
    document.addEventListener("DOMContentLoaded", initTestim);
}

