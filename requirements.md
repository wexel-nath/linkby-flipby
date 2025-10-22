# Reselling Marketplace Web Application Requirements

## Overview

You are asked to build a small web application that allows users to **buy and sell their belongings online**.  
The selling process involves an **optional negotiation process** where multiple buyers can make offers to the seller against the same product, and the seller can also make **counter-offers** to each buyer.

---

## Negotiation Flow

1. A user can register a product to sell by entering product details, setting an initial price, and uploading images.
2. Other users can explore products in the application.
3. When a buyer finds a product they want to buy, they can:
   - Purchase the product directly, **or**
   - Make a **counter-offer** with a desired price.
4. When a seller receives a counter-offer, they can:
   - Accept the offer, **or**
   - Make another **counter-offer** back to the buyer.
5. There can be **unlimited counter-offers** between a buyer and seller.
6. Once an offer is accepted by either party, the buyer can proceed to purchase the product.

---

## Application Requirements

The web application will consist of **4 distinct UIs**:

1. Login
2. Product List
3. Product Registration
4. Product Details

You are free to structure URL routes in any way, as long as functional requirements are met.

---

## 1. Login UI

The application begins with a **login form** allowing both sellers and buyers to log in.  
There is **no distinction** between user types — any user can buy or sell products.

### Elements

- Email address
- Password
- Login button

> **Note:** There is no need to build a Register User UI.  
> Seed the database with test users for development purposes.

---

## 2. Product List UI

Upon login, users land on this page showing **all registered products**.

### Layout

- Display products in **card format** in a grid.
- Clicking a product card navigates to the **Product Details** page.

### Product Card Details

- First uploaded image (if exists)
- Product name
- Initial price
- Seller name
- Status indicator
  - Show “Reserved” or “Sold” on the bottom right if applicable.

> **Note:** Pagination is not required.

### Header Bar

- **Sell button** → navigates to _Product Registration_ page
- **Logout button** → logs out the user and returns to _Login_ UI

---

## 3. Product Registration UI

This UI allows a user to register a new product for sale.

### Elements

- Product Name
- Price
- Description
- Product Images
  - Up to **5 images per product**
  - **Max size:** 5MB per upload
- Submit button → adds product to system with **Available** status
- Cancel button → navigates back to _Product List_ page

---

## 4. Product Details UI

When a user clicks on a product, this page shows all product information and negotiation options.

### Product Information

- Product name
- Status (Available / Reserved / Sold)
- Initial price
- Description
- Uploaded images

---

### Purchase Button

**Visible only when:**

- Buyer has not made any counter-offers, **or**
- Buyer’s counter-offer has been accepted by the seller, **or**
- Seller’s counter-offer has been accepted by the buyer

**Hidden when:**

- Product is in **Sold** status
- Product is **Reserved** for another buyer

**Behavior:**

- On click → set product status to **Sold** and navigate back to _Product List UI_

---

### Counter Offer Button

**Visible only when:**

- Current user is a **buyer**
- Buyer has **not yet made** any counter-offers for the product

---

### Negotiation History Section

Appears when at least **one counter-offer** has been made.

Visible to **all buyers** (not just those who participated).

#### Display

A **timeline** or table showing all counter-offers (in chronological order), including:

- Timestamp
- Buyer name
- Whether offer was made by **buyer** or **seller**
- Offered price

---

### Actions

#### Counter Offer Button

Visible when:

- Logged-in user is the **seller** and a **buyer** made a counter-offer
- Logged-in user is the **buyer** and the **seller** made a counter-offer

On click:

- User enters a **new price**
- New counter-offer is logged into the timeline
- Return to _Product List UI_

---

#### Accept Button

Visible when:

- Seller is viewing a **buyer’s** counter-offer
- Buyer is viewing a **seller’s** counter-offer

On click:

- Set product status to **Reserved**
- Navigate back to _Product List UI_

---

## Product Status Flow

| Status        | Description                                               |
| ------------- | --------------------------------------------------------- |
| **Available** | Product is open for offers or direct purchase             |
| **Reserved**  | Buyer and seller have agreed on a price; purchase pending |
| **Sold**      | Product purchased and transaction complete                |

---

## Summary of Functional Flow

1. User logs in → lands on **Product List**
2. User can:
   - Register new product → **Product Registration**
   - View product → **Product Details**
   - Make / accept offers → updates negotiation history and product status
3. Once a deal is accepted → product status updates to **Reserved** or **Sold**
4. Logout returns to **Login** page

---
