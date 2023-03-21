class Orb {
	constructor(pos, vel, r, note, octave, color) {
		this.pos = pos;
		this.vel = vel;
		this.r = r;
		this.shine = this.r;
		this.note = note;
		this.octave = octave;
		this.color = color;
	}

	update() {
		this.pos.add(this.vel);

		// bounce off the edges
		let distance = dist(this.pos.x, this.pos.y, width / 2, height / 2);
		if (distance > containerRadius / 2 - this.r) {
			this.vel = createVector(width / 2 - this.pos.x, height / 2 - this.pos.y)
				.normalize()
				.rotate(random(-PI / 4, PI / 4))
				.mult(orbVelocity);
			

			this.playNote();
			this.shine = this.shine * 1.5;

		} else if (this.shine > orbRadius) {
			this.shine = this.shine - 0.5;
		}
	}

	playNote() {
		let audio = new Audio(`../../audio/notes/${this.note}${this.octave}.mp3`);
		audio.play();
	}
}
