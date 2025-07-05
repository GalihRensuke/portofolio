// Performance Monitor Script
// Add this to your browser console to monitor memory usage and performance

class PerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.memoryChecks = [];
    this.isMonitoring = false;
  }

  startMonitoring() {
    if (this.isMonitoring) {
      console.log('Monitor already running');
      return;
    }

    this.isMonitoring = true;
    console.log('🔍 Starting Performance Monitor...');
    
    // Check memory every 10 seconds
    this.monitorInterval = setInterval(() => {
      this.checkMemory();
    }, 10000);

    // Initial check
    this.checkMemory();
    this.checkParticles();
    this.checkAnimations();
  }

  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    this.isMonitoring = false;
    console.log('⏹️ Performance Monitor stopped');
  }

  checkMemory() {
    if ('memory' in performance) {
      const memory = performance.memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      
      this.memoryChecks.push({
        timestamp: Date.now(),
        usedMB,
        totalMB,
        limitMB
      });

      // Alert if memory usage is high
      if (usedMB > 500) {
        console.warn(`⚠️  High memory usage: ${usedMB}MB`);
      } else {
        console.log(`📊 Memory: ${usedMB}MB / ${totalMB}MB (Limit: ${limitMB}MB)`);
      }

      // Check for memory leaks (increasing trend)
      if (this.memoryChecks.length > 6) {
        const recent = this.memoryChecks.slice(-6);
        const increasing = recent.every((check, i) => {
          return i === 0 || check.usedMB >= recent[i - 1].usedMB;
        });
        
        if (increasing) {
          console.error('🚨 Potential memory leak detected - memory consistently increasing');
        }
      }
    } else {
      console.log('Memory monitoring not supported in this browser');
    }
  }

  checkParticles() {
    // Check for particle elements
    const particleContainer = document.getElementById('tsparticles');
    if (particleContainer) {
      const canvases = particleContainer.querySelectorAll('canvas');
      console.log(`🎨 Particle canvases found: ${canvases.length}`);
      
      canvases.forEach((canvas, i) => {
        const rect = canvas.getBoundingClientRect();
        console.log(`Canvas ${i}: ${rect.width}x${rect.height}`);
      });
    }

    // Check for transition particles
    const transitionParticles = document.querySelectorAll('[class*="particle"]');
    if (transitionParticles.length > 20) {
      console.warn(`⚠️  Many particle elements detected: ${transitionParticles.length}`);
    }
  }

  checkAnimations() {
    // Check for running animations
    const animatedElements = document.querySelectorAll('[style*="transform"], [style*="animation"]');
    console.log(`🎭 Animated elements: ${animatedElements.length}`);

    // Check for motion elements (framer-motion)
    const motionElements = document.querySelectorAll('[data-framer-name], [style*="transform"]');
    if (motionElements.length > 50) {
      console.warn(`⚠️  Many animated elements: ${motionElements.length}`);
    }
  }

  getReport() {
    const currentTime = performance.now();
    const sessionDuration = Math.round((currentTime - this.startTime) / 1000);
    
    console.log('\n📋 Performance Report:');
    console.log(`Session Duration: ${sessionDuration} seconds`);
    
    if (this.memoryChecks.length > 0) {
      const latest = this.memoryChecks[this.memoryChecks.length - 1];
      const initial = this.memoryChecks[0];
      const memoryGrowth = latest.usedMB - initial.usedMB;
      
      console.log(`Initial Memory: ${initial.usedMB}MB`);
      console.log(`Current Memory: ${latest.usedMB}MB`);
      console.log(`Memory Growth: ${memoryGrowth > 0 ? '+' : ''}${memoryGrowth}MB`);
      
      if (memoryGrowth > 100) {
        console.error('🚨 Significant memory growth detected!');
      } else if (memoryGrowth < 50) {
        console.log('✅ Memory usage stable');
      }
    }

    this.checkParticles();
    this.checkAnimations();
  }
}

// Usage Instructions:
console.log(`
🔍 MEMORY LEAK DETECTOR LOADED

Usage:
1. const monitor = new PerformanceMonitor();
2. monitor.startMonitoring();
3. Browse the website normally for 5-10 minutes
4. monitor.getReport();
5. monitor.stopMonitoring();

Expected Results After Fixes:
- Memory should stay under 200MB
- No consistent memory growth over time
- Particle count should be reasonable
- Stable performance during navigation

Warning Signs:
- Memory usage above 500MB
- Consistent memory growth
- Browser becoming slow/unresponsive
`);

// Auto-start if desired
// const monitor = new PerformanceMonitor();
// monitor.startMonitoring();