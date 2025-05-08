"use client";

import WithHydration from "@/HOC/withHydration";
import React, { useEffect } from "react";
import './winner.scss'

const Winner: React.FC = () => {
  useEffect(() => {
    class Confettiful {
      el: HTMLElement;
      containerEl: HTMLElement | null;
      confettiFrequency: number;
      confettiColors: string[];
      confettiAnimations: string[];
      confettiInterval: NodeJS.Timeout | null;

      constructor(el: HTMLElement) {
        this.el = el;
        this.containerEl = null;
        this.confettiFrequency = 10;
        this.confettiColors = ['#EF2964', '#00C09D', '#2D87B0', '#48485E', '#EFFF1D'];
        this.confettiAnimations = ['slow', 'medium', 'fast'];
        this.confettiInterval = null;
        this._setupElements();
        this._renderConfetti();
      }

      _setupElements() {
        const containerEl = document.createElement('div');
        const elPosition = this.el.style.position;

        if (elPosition !== 'relative' && elPosition !== 'absolute') {
          this.el.style.position = 'relative';
        }

        containerEl.classList.add('confetti-container');
        this.el.appendChild(containerEl);
        this.containerEl = containerEl;
      }

      _renderConfetti() {
        this.confettiInterval = setInterval(() => {
          if (!this.containerEl) return;

          const confettiEl:any = document.createElement('div');
          const confettiSize = `${Math.floor(Math.random() * 3) + 7}px`;
          const confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
          const confettiLeft = `${Math.floor(Math.random() * this.el.offsetWidth)}px`;
          const confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];

          confettiEl.classList.add('confetti', `confetti--animation-${confettiAnimation}`);
          confettiEl.style.left = confettiLeft;
          confettiEl.style.width = confettiSize;
          confettiEl.style.height = confettiSize;
          confettiEl.style.backgroundColor = confettiBackground;

          confettiEl.removeTimeout = setTimeout(() => {
            if (confettiEl.parentNode) {
              confettiEl.parentNode.removeChild(confettiEl);
            }
          }, 3000);

          this.containerEl.appendChild(confettiEl);
        }, 25);
      }
    }

    const container = document.querySelector('.js-container') as HTMLElement;
    if (container) {
      new Confettiful(container);
    }

    // Clean up the interval on component unmount
    return () => {
      const window1 :any  = window
      if (window1?.confettiful && window1.confettiful.confettiInterval) {
        clearInterval(window1?.confettiful.confettiInterval);
      }
    };
  }, []);

  return (
    <div className="js-container container fixed inset-0 pointer-events-none"></div>
  );
};

export default WithHydration(Winner);


