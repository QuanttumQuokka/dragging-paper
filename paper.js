let highestZ = 1;

function touchAngle(t0, t1) {
  const dx = t1.clientX - t0.clientX;
  const dy = t1.clientY - t0.clientY;
  return Math.atan2(dy, dx) * 180 / Math.PI;
}

class Paper {
  constructor(el) {
    this.el = el;

    this.dragging = false;
    this.rotating = false;
    this.pointerId = null;

    this.currentX = 0;
    this.currentY = 0;

    this.lastX = 0;
    this.lastY = 0;

    this.rotation = Math.random() * 30 - 15;
    this.startRotation = this.rotation;

    this.setInitialTransform();
    this.addEvents();
  }

  setInitialTransform() {
    this.el.style.transform =
      `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
  }

  applyTransform() {
    this.el.style.transform =
      `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.rotation}deg)`;
  }

  addEvents() {
    this.el.addEventListener("pointerdown", (e) => {
      this.el.style.zIndex = ++highestZ;

      if (e.button === 2) {
        this.rotating = true;
        this.pointerId = e.pointerId;
        this.lastX = e.clientX;
        this.startRotation = this.rotation;
        this.el.setPointerCapture(e.pointerId);
        e.preventDefault();
        return;
      }

      this.dragging = true;
      this.pointerId = e.pointerId;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.el.setPointerCapture(e.pointerId);
    });

    this.el.addEventListener("pointermove", (e) => {
      if (e.pointerId !== this.pointerId) return;

      if (this.dragging) {
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;

        this.currentX += dx;
        this.currentY += dy;

        this.lastX = e.clientX;
        this.lastY = e.clientY;

        this.applyTransform();
      }

      if (this.rotating && e.pointerType === "mouse") {
        const dx = e.clientX - this.lastX;
        this.rotation = this.startRotation + dx * 0.5;
        this.applyTransform();
      }
    });

    this.el.addEventListener("pointerup", (e) => {
      if (e.pointerId !== this.pointerId) return;
      this.dragging = false;
      this.rotating = false;
      this.el.releasePointerCapture(e.pointerId);
    });

    this.el.addEventListener("contextmenu", (e) => e.preventDefault());

    this.el.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const angle = touchAngle(e.touches[0], e.touches[1]);
        this.rotation = angle;
        this.applyTransform();
      }
    }, { passive: false });
  }
}

window.Paper = Paper;
