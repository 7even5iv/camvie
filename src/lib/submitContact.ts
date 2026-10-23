// src/lib/submitContact.ts
import { sanityWriteClient } from './sanity';
import type { ContactMessageInput } from '../types';

export async function submitContactMessage(input: ContactMessageInput) {
    // ✅ `_type` requis par Sanity sur tout document créé
    const doc = {
        _type: 'contactMessage',              // ← nom du schéma Sanity
        name: input.name,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        message: input.message,
        submittedAt: new Date().toISOString(),
        // Lien optionnel vers le bien immobilier concerné
        property: input.propertyId
            ? { _type: 'reference' as const, _ref: input.propertyId }
            : undefined,
    };

    return sanityWriteClient.create(doc);
}