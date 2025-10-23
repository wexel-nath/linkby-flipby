import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { Offer, OfferBy, Product } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price amount from cents to dollar format
 * @param priceAmount - Price in cents (e.g., 100 for $1, 150 for $1.50)
 * @param currency - Currency symbol (defaults to '$')
 * @returns Formatted price string (e.g., '$1' or '$1.50')
 */
export function formatPrice(priceAmount: number, currency: string = '$'): string {
  const dollars = priceAmount / 100
  const cents = priceAmount % 100

  if (cents === 0) {
    return `${currency}${Math.floor(dollars)}`
  }

  return `${currency}${dollars.toFixed(2)}`
}

export function getProductReservedFor(offers: Offer[]): string | null {
  // Find the first accepted offer
  const acceptedOffer = offers.find((offer) => offer.acceptedAt)

  if (!acceptedOffer) {
    return null
  }

  if (acceptedOffer.offerBy === OfferBy.Buyer) {
    return acceptedOffer.userId
  } else {
    return acceptedOffer.acceptedBy
  }
}
