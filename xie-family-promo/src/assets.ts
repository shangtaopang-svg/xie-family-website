import { staticFile } from "remotion";

// All assets are in public/ folder - copied from website project

function sf(name: string): string {
  return staticFile(name);
}

// Carousel photos (compressed, from images/carousel)
export const VILLAGE_PHOTOS: string[] = [
  "11.jpg", "23.jpg", "36.jpg", "37.jpg", "38.jpg",
  "40.jpg", "42.jpg", "51.jpg", "52.jpg",
  "W020230307562232959074.jpg",
  "W020230307562236561236.jpg",
  "W020230307562239043622.jpg",
  "W020230307562241110405.jpg",
].map(sf);

// Temple photos (from images/ancestors)
export const TEMPLE_PHOTOS: string[] = [
  "ancestral_hall1.jpg",
  "ancestral_hall2.jpg",
  "ancestral_hall3.jpg",
].map(sf);

export const VILLAGE_PANORAMA = sf("village_panorama.jpg");

// Background music
export const BG_MUSIC = sf("background.wav");
