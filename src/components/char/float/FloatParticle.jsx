const PARTICLE_ARRAY_LIST_INITIAL_CAPACITY = 1024;
const  IDEAL_FRAME_RATE = 60;

export class Particle {
  constructor(x, y) {
    this.observer = null;
    this.xPosition = x;
    this.yPosition = y;
    this.properFrameCount = 0;
  }

  setObserver(obs) {
    this.observer = obs;
  }

  update() {
    this.properFrameCount++;
  }

  display(ctx) {
    // This method should be implemented in derived classes
  }
}

class ParticleObserver {
  constructor() {
    this.newParticleList = [];
    this.deadParticleList = [];
  }

  registerNew(bornParticle) {
    this.newParticleList.push(bornParticle);
  }

  registerDead(killedParticle) {
    this.deadParticleList.push(killedParticle);
  }

  updateParticleListMembers(list) {
    // Remove dead particles
    for (let i = list.length - 1; i >= 0; i--) {
      if (this.deadParticleList.includes(list[i])) {
        list.splice(i, 1);
      }
    }

    // Clear the deadParticleList after removal
    this.deadParticleList.length = 0;

    // Add new particles
    list.push(...this.newParticleList);

    // Clear the newParticleList after adding
    this.newParticleList.length = 0;
  }

}

export class ParticleSystem {
  constructor() {
    this.liveParticleList = [];
    this.observer = new ParticleObserver();
  }

  run(ctx) {
    this.update();
    this.display(ctx);
  }

  update() {
    this.liveParticleList.forEach(currentObject => currentObject.update());
    this.observer.updateParticleListMembers(this.liveParticleList);
  }

  display(ctx) {
    this.liveParticleList.forEach(currentObject => currentObject.display(ctx));
  }

  registerNew(obj) {
    this.observer.registerNew(obj);
    obj.setObserver(this.observer);
  }
}

export class CharacterParticle extends Particle {

  constructor(w,h,x, y, c, sz, life) {
    super(x, y);
    this.width = w;
    this.height = h;
    this.lifeTime = life;
    this.charData = c;
    this.textSizeValue = sz;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.rotationAngle = 0;
    this.angularVelocity = 0;
    this.progressRatio = 0;
  }

 random(min, max) {
  return Math.random() * (max - min) + min;
}

  update() {
    super.update();


    if (this.properFrameCount > this.lifeTime) {
      this.observer.registerDead(this);
    }

    this.progressRatio = this.getProgressRatio();
    const waitTimeFactor = 0.1;
    const waftRatio = Math.max(0, this.progressRatio - waitTimeFactor) / (1 - waitTimeFactor);
    const v = 4 / IDEAL_FRAME_RATE;
    this.xVelocity += waftRatio * this.random(-v, v);
    this.yVelocity += waftRatio * (this.random(-v, v) - 0.2 / IDEAL_FRAME_RATE);
    this.xPosition += this.xVelocity;
    this.yPosition += this.yVelocity;

    const v2 = 0.1 / IDEAL_FRAME_RATE;
    this.angularVelocity += waftRatio * this.random(-v2, v2);
    this.rotationAngle += this.angularVelocity;

    if (this.isOutOfScreen(this.textSizeValue)) {
      this.observer.registerDead(this);
    }
  }


  easeOutQuad(t) {
    return -t * (t - 2);
  }

  easeInQuad(t) {
    return t * t;
  }

  easeOutQuart(t) {
    t--;
    return 1.0 - t * t * t * t;
  }


    getRandomColor = () => {
        // Generate a random integer between 0 and 255 for each color component
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        // Return the RGB color string
        return `rgb(${red}, ${green}, ${blue})`;
    };


  drawText(context, text, position) {
        context.save();
        context.translate(position.x, position.y);
        context.fillStyle = 'white'; // Text color
        context.font = '14px Arial'; // Text font and size
        context.textAlign = 'center';
        context.fillText(text, 0, 5); // Adjust the position if needed
        context.restore();
    };

  display(ctx) {
    const fadeInTimeFactor = 0.1;
    const fadeOutTimeFactor = 0.5;
    let alpha;
    if (this.getProgressRatio() < fadeInTimeFactor) {
      alpha = this.easeOutQuad(this.getProgressRatio() / fadeInTimeFactor);
    } else if (this.getProgressRatio() > 1 - fadeOutTimeFactor) {
      alpha = this.easeInQuad(this.getFadeRatio() / fadeOutTimeFactor);
    } else {
      alpha = 1;
    }

    const scaleFactor = 1 + 0.6 * (1 - this.easeOutQuart(Math.min(this.getProgressRatio() * 20, 1)));
    ctx.save(); // Save the current state of the canvas

    // Set text styles
    ctx.font = `${this.textSizeValue}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "white";// this.getRandomColor(); // Adjust alpha as needed

    // Apply transformations
    ctx.translate(this.xPosition, this.yPosition);
    if (scaleFactor > 1.05) {
      ctx.scale(scaleFactor, scaleFactor);
    }
    ctx.rotate(this.rotationAngle);

    // Draw the text
    ctx.fillText(this.charData, 0, 0);

    ctx.restore(); // Restore the canvas state

  }


  getProgressRatio() {
    return Math.min(this.properFrameCount, this.lifeTime) / this.lifeTime;
  }

  getFadeRatio() {
    return 1 - this.getProgressRatio();
  }

  isOutOfScreen(outerMargin) {
    if (this.yPosition < -outerMargin) return true;
    if (this.yPosition > this.height + outerMargin) return true;
    if (this.xPosition < -outerMargin) return true;
    if (this.xPosition > this.width + outerMargin) return true;
    return false;
  }
}

class CharacterParticleGenerator {
  constructor(currentParticleSystem,render_width,render_height,manager, stringData, delayFrames, x, y, sizeVal, intervalFrames, propotional, lifetime) {
    this.currentParticleSystem = currentParticleSystem;
    this.render_width = render_width;
    this.render_height = render_height;
    this.manager = manager;
    this.stringData = stringData;
    this.stringLength = stringData.length;
    this.delayFrameCount = delayFrames;
    this.initialXPosition = x;
    this.initialYPosition = y;
    this.currentXPosition = x;
    this.currentYPosition = y;
    this.textSizeValue = sizeVal;
    this.characterIntervalFrameCount = intervalFrames;
    this.propotionalIndicator = propotional;
    this.particleLifetimeFrameCount = lifetime;
    this.currentStringIndex = 0;
    this.properFrameCount = 0;
  }

  run() {
    if (this.delayFrameCount > 0) {
      this.delayFrameCount--;
      return;
    }
    if (this.currentStringIndex >= this.stringLength) {
      return;  // Just to be safe
    }

    if (this.characterIntervalFrameCount === 0) {
      this.generateAll();
      return;
    }
    if (this.properFrameCount % this.characterIntervalFrameCount === 0) {
      this.generateNext();
    }

    this.properFrameCount++;
  }

  generateNext() {
    while (this.stringData.substring(this.currentStringIndex, this.currentStringIndex + 1) === "\n") {
      this.breakLine();
      this.currentStringIndex++;
    }
    this.generateCharacterAt(this.currentStringIndex);

    if (this.propotionalIndicator) {
      textSize(this.textSizeValue);
      this.currentXPosition += textWidth(this.stringData.charAt(this.currentStringIndex));
    } else {
      this.currentXPosition += this.textSizeValue;
    }

    this.currentStringIndex++;
    if (this.currentStringIndex >= this.stringLength) {
      this.manager.registerCompletedGenerator(this);
    }
  }

  generateAll() {
    for (let i = 0; i < this.stringLength; i++) {
      if (this.stringData.substring(i, i + 1) === "\n") {
        this.breakLine();
        continue;
      }
      this.generateCharacterAt(i);
    }
    this.manager.registerCompletedGenerator(this);
    this.currentStringIndex = this.stringLength;
  }

  generateCharacterAt(index) {
    this.currentParticleSystem.registerNew(new CharacterParticle(this.render_width,this.render_height,this.currentXPosition, this.currentYPosition, this.stringData.charAt(index), this.textSizeValue, this.particleLifetimeFrameCount));
  }

  breakLine() {
    this.currentXPosition = this.initialXPosition;
    this.currentYPosition += this.textSizeValue * 1.25;
  }
}


export class CharacterParticleGenerateManager {


  constructor(currentParticleSystem,render_width,render_height) {
    this.currentParticleSystem = currentParticleSystem;
    this.render_width = render_width;
    this.render_height = render_height;
    this.generatorList = [];
    this.completedGeneratorList = [];
  }

  run(context) {
    
    for (const currentObject of this.generatorList) {
      currentObject.run();
    }
    this.generatorList = this.generatorList.filter(generator => !this.completedGeneratorList.includes(generator));
    this.completedGeneratorList = [];

    this.currentParticleSystem.run(context);
  }

  registerCompletedGenerator(generator) {
    this.completedGeneratorList.push(generator);
  }

  registerString(s) {
    this.generatorList.push(new CharacterParticleGenerator(this.currentParticleSystem, this.render_width,this.render_height, this, s, this.delayFrameCount, this.xPosition, this.yPosition, this.textSizeValue, this.intervalFrameCount, this.propotionalIndicator, this.particleLifetime));
    return this;
  }

  setPosition(x, y) {
    this.xPosition = x;
    this.yPosition = y;
    return this;
  }

  setXPosition(x) {
    this.xPosition = x;
    return this;
  }

  setYPosition(y) {
    this.yPosition = y;
    return this;
  }

  setDelayFrameCount(v) {
    this.delayFrameCount = v;
    return this;
  }

  setDelaySeconds(v) {
    this.delayFrameCount = Math.floor(v * IDEAL_FRAME_RATE);
    return this;
  }

  setTextSize(v) {
    this.textSizeValue = v;
    return this;
  }

  setIntervalFrameCount(v) {
    this.intervalFrameCount = v;
    return this;
  }

  setPropotionalIndicator(v) {
    this.propotionalIndicator = v;
    return this;
  }

  setLifetime(v) {
    this.particleLifetime = v;
    return this;
  }

  breakLine(factor) {
    this.yPosition += this.textSizeValue * 1.2 * factor;
    return this;
  }
}


export default ParticleSystem;