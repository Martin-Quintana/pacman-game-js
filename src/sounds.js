
export class SoundManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isMuted = false;

        // Oscillators state
        this.sirenOsc = null;
        this.sirenGain = null;
    }

    init() {
        if (this.ctx) return;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Volume master
        this.masterGain.connect(this.ctx.destination);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(
                this.isMuted ? 0 : 0.3,
                this.ctx.currentTime
            );
        }
        return this.isMuted;
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // --- Sound Effects Generators ---

    // Waka Waka (Oscillating Triangle Wave)
    playWaka() {
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
    }

    // Siren (Background Hum)
    startSiren() {
        if (!this.ctx || this.sirenOsc) return;

        this.sirenOsc = this.ctx.createOscillator();
        this.sirenGain = this.ctx.createGain();

        this.sirenOsc.type = 'sawtooth'; // or sine
        this.sirenOsc.frequency.setValueAtTime(150, this.ctx.currentTime);

        // LFO for the siren warble
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 2; // 2 Hz warble
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 50; // Pitch variance

        lfo.connect(lfoGain);
        lfoGain.connect(this.sirenOsc.frequency);
        lfo.start();

        this.sirenGain.gain.value = 0.1;

        this.sirenOsc.connect(this.sirenGain);
        this.sirenGain.connect(this.masterGain);

        this.sirenOsc.start();
    }

    stopSiren() {
        if (this.sirenOsc) {
            this.sirenOsc.stop();
            this.sirenOsc.disconnect();
            this.sirenOsc = null;
        }
    }

    // Eat Ghost (Retro "Zip" sound)
    playEatGhost() {
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.11);
    }

    // Death (Downward slide)
    playDeath() {
        if (!this.ctx || this.isMuted) return;
        this.stopSiren();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
        // Long slide down
        for (let i = 0; i < 10; i++) {
            osc.frequency.exponentialRampToValueAtTime(100 - (i * 10), this.ctx.currentTime + (0.1 * i));
        }

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.6);
    }
}

export const sounds = new SoundManager();
