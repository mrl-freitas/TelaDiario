import { Injectable, NgZone, inject } from '@angular/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import type { AccelListenerEvent } from '@capacitor/motion';
import { Observable, Subject } from 'rxjs';

export interface ShakeDetectionConfig {
  threshold: number;
  cooldownMs: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShakeDetectorService {
  private zone = inject(NgZone);
  private shakeSubject = new Subject<void>();
  private accelListener?: PluginListenerHandle;
  private lastShakeAt = 0;
  private config: ShakeDetectionConfig = {
    threshold: 18,
    cooldownMs: 2000,
  };

  readonly shake$: Observable<void> = this.shakeSubject.asObservable();

  async start(config?: Partial<ShakeDetectionConfig>): Promise<void> {
    this.config = { ...this.config, ...config };

    if (this.accelListener) {
      return;
    }

    this.accelListener = await Motion.addListener('accel', (event) => {
      this.handleAcceleration(event);
    });
  }

  async stop(): Promise<void> {
    if (!this.accelListener) {
      return;
    }

    await this.accelListener.remove();
    this.accelListener = undefined;
  }

  private handleAcceleration(event: AccelListenerEvent): void {
    const acceleration = event.accelerationIncludingGravity;
    const force = Math.sqrt(
      acceleration.x * acceleration.x +
        acceleration.y * acceleration.y +
        acceleration.z * acceleration.z,
    );

    if (force < this.config.threshold) {
      return;
    }

    const now = Date.now();

    // Evita que o mesmo movimento gere varios eventos enquanto o aparelho ainda esta balancando.
    if (now - this.lastShakeAt < this.config.cooldownMs) {
      return;
    }

    this.lastShakeAt = now;

    // Eventos nativos podem chegar fora da zona do Angular; reentrar garante atualizacao da UI.
    this.zone.run(() => this.shakeSubject.next());
  }
}
