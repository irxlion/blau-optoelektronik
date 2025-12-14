/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google?: {
      maps?: typeof google.maps;
      charts?: any;
      visualization?: any;
    };
  }
}

export {};
