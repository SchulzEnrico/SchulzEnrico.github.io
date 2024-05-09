(function(window, undefined) {

    'use strict';

    const smoothScroll = {

        init: function () {

            const _this = this;

            this.body = document.body;
            this.main = document.getElementById('portfolio');
            this.article = document.getElementById('article');
            this.content = document.getElementById('content');
            this.nav = document.getElementById('branches');
            this.height = 0;
            this.offset = 0;
            this.percent = 0;
            this.position = this.percent;
            this.transform = null;

            this.article.addEventListener('scroll', this.onScroll.bind(this), false);
            window.addEventListener('resize', this.onScroll.bind(this), false);

            this.onScroll();
            this.noun();

            setTimeout(function () {
                _this.main.classList.remove('loading');
            }, 3E3);

        },

        render: function (a, b, c) {
            return (1 - c) * a + c * b;
        },

        noun: function () {
            this.position = this.render(this.position, this.percent, 0.05);
            this.position = Math.floor(1E4 * this.position) / 1E4;
            this.transform = 'translate3d(0, ' + this.position + 'px, 0)';

            this.nav.style.transform = this.transform;

            this.loop = this.noun.bind(this);
            requestAnimationFrame(this.loop);
        },

        onScroll: function () {
            this.offset = this.article.scrollTop;
            this.percent = this.offset / (this.height - window.innerHeight) || 0;
            this.percent *= -0.08 * document.body.scrollWidth;
            this.height = this.nav.offsetHeight;
            this.content.style.height = this.height + 'px';
        }

    };

    smoothScroll.init();

})(window);

document.addEventListener('DOMContentLoaded', function() {
    const branchOne = document.querySelector('.branch-one');
    const branchTwo = document.querySelector('.branch-two');
    const branchThree = document.querySelector('.branch-three');
    const hoverBranchOnes = document.querySelectorAll('.hover-branch-one');
    const hoverBranchTwos = document.querySelectorAll('.hover-branch-two');
    const hoverBranchThrees = document.querySelectorAll('.hover-branch-three');

    const brightnessHover = '200%';
    const brightnessReset = '100%';
    const transitionTime = 450;

    function changeBrightness(elements, brightnessValue) {
        elements.forEach(function(element) {
            element.style.transition = `filter ${transitionTime}ms linear`;
            element.style.filter = `brightness(${brightnessValue})`;
        });
    }

    function resetBrightness(elements) {
        elements.forEach(function(element) {
            element.style.transition = `filter ${transitionTime}ms linear`;
            element.style.filter = `brightness(${brightnessReset})`;
        });
    }

    branchOne.addEventListener('mouseover', function() {
        changeBrightness(hoverBranchOnes, brightnessHover);
    });

    branchOne.addEventListener('mouseout', function() {
        resetBrightness(hoverBranchOnes);
    });

    branchTwo.addEventListener('mouseover', function() {
        changeBrightness(hoverBranchTwos, brightnessHover);
    });

    branchTwo.addEventListener('mouseout', function() {
        resetBrightness(hoverBranchTwos);
    });

    branchThree.addEventListener('mouseover', function() {
        changeBrightness(hoverBranchThrees, brightnessHover);
    });

    branchThree.addEventListener('mouseout', function() {
        resetBrightness(hoverBranchThrees);
    });
});