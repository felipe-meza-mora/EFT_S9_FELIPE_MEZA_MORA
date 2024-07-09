import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideFirebaseApp(() => 
      initializeApp({
        "projectId":"db-dyf",
        "appId":"1:916680941903:web:6bc1c0a1a74e72aab0653a",
        "storageBucket":"db-dyf.appspot.com",
        "apiKey":"AIzaSyDp3dqLvIW0tkwHLXDIf6TZDSEXJD6AwLM",
        "authDomain":"db-dyf.firebaseapp.com",
        "messagingSenderId":"916680941903"
      })
    ), 
    provideFirestore(() => getFirestore())
  ]
};
