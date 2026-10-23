export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  phone, whatsapp, email, address, socialLinks
}`;

export const publishedPropertiesQuery = `*[_type == "property" && status == "published"] | order(published_at desc){
  _id, title, slug, reference, type, location, area, price, status, is_featured, description, images, published_at
}`;

export const featuredPropertiesQuery = `*[_type == "property" && status == "published" && is_featured == true] | order(published_at desc){
  _id, title, slug, reference, location, area, price, images
}`;

export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id, title, slug, content
}`;

export const activeServicesQuery = `*[_type == "service" && is_active == true] | order(title asc){
  _id, title, slug, short_description, content, is_active
}`;

export const propertyBySlugQuery = `*[_type == "property" && slug.current == $slug && status == "published"][0]{
  _id, title, slug, reference, type, location, area, price, status, is_featured,
  description, images, published_at
}`;

export const galleryItemsQuery = `*[_type == "galleryItem" && is_active == true] | order(order asc, _createdAt desc){
  _id, title, type, image, videoUrl, caption, category, order
}`;