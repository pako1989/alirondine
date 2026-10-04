// js/hd2d-audio.js - Procedural Web Audio Sound Engine for 2D HD Modes
(function () {
  let ctx = null;

  function getAudioCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  const HD2DAudio = {
    playKick(power = 1) {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140 * power, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.09);
      gain.gain.setValueAtTime(0.35 * Math.min(1.2, power), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    },

    playBounce() {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    },

    playWall() {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    },

    playWhistle(double = false) {
      const ac = getAudioCtx();
      if (!ac) return;
      const now = ac.currentTime;
      const playNote = (time, dur) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(2600, time);
        osc.frequency.linearRampToValueAtTime(2900, time + dur * 0.5);
        osc.frequency.linearRampToValueAtTime(2550, time + dur);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.28, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(time);
        osc.stop(time + dur);
      };
      playNote(now, 0.22);
      if (double) {
        playNote(now + 0.28, 0.35);
      }
    },

    playTackle() {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      const bufferSize = ac.sampleRate * 0.12;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ac.createBufferSource();
      noise.buffer = buffer;
      const filter = ac.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, t);
      filter.frequency.exponentialRampToValueAtTime(100, t + 0.12);
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ac.destination);
      noise.start(t);
    },

    playPost() {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.28);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    },

    playGoal() {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      [330, 440, 554, 659].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);
        gain.gain.setValueAtTime(0.2, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.45);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.45);
      });
      this.playWhistle(true);
    },

    playEmblemClash() {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.15);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    },

    playEmblemCrit() {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      [523, 659, 783, 1046].forEach((f, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(f, t + i * 0.05);
        gain.gain.setValueAtTime(0.15, t + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t + i * 0.05);
        osc.stop(t + i * 0.05 + 0.25);
      });
    },

    playSelect() {
      const ac = getAudioCtx();
      if (!ac) return;
      const t = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.05);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  };

  window.HD2DAudio = HD2DAudio;
})();
