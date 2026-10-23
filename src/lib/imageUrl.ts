import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './sanity';
import type { SanityImage } from '../types';

const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImage) {
  return builder.image(source);
}