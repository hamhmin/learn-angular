import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// 1. 기존의 app-root 실행
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
