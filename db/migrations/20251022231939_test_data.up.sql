-- Initialize test data

INSERT INTO "user" (email, name, password_hash)
VALUES
  ('john@example.com', 'John Doe', crypt('password123', gen_salt('bf'))),
  ('jane@example.com', 'Jane Smith', crypt('password123', gen_salt('bf'))),
  ('bob@example.com', 'Bob Wilson', crypt('password123', gen_salt('bf')));

INSERT INTO product (user_id, name, price_amount, price_currency, description, images, status)
VALUES
  (
    (SELECT id FROM "user" WHERE email = 'john@example.com'),
    'Vintage Camera',
    25000,
    'USD',
    'Classic 35mm film camera in excellent condition. Perfect for photography enthusiasts.',
    ARRAY['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop', 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=500&h=500&fit=crop'],
    'Available'
  ),
  (
    (SELECT id FROM "user" WHERE email = 'jane@example.com'),
    'Designer Leather Jacket',
    45000,
    'USD',
    'Genuine leather jacket, size M. Barely worn, like new condition.',
    ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&h=500&fit=crop'],
    'Available'
  ),
  (
    (SELECT id FROM "user" WHERE email = 'john@example.com'),
    'Gaming Laptop',
    120000,
    'USD',
    'High-performance gaming laptop with RTX graphics. 16GB RAM, 512GB SSD.',
    ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop'],
    'Reserved'
  ),
  (
    (SELECT id FROM "user" WHERE email = 'bob@example.com'),
    'Acoustic Guitar',
    18000,
    'USD',
    'Beautiful acoustic guitar with a rich, warm tone. Includes case and strap.',
    ARRAY['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=500&fit=crop'],
    'Sold'
  ),
  (
    (SELECT id FROM "user" WHERE email = 'jane@example.com'),
    'Smart Watch',
    32000,
    'USD',
    'Latest model smartwatch with fitness tracking and heart rate monitor.',
    ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'],
    'Available'
  ),
  (
    (SELECT id FROM "user" WHERE email = 'john@example.com'),
    'Professional Camera Kit',
    85000,
    'USD',
    'Complete photography kit including DSLR camera, multiple lenses, tripod, and accessories. Perfect for professional photographers or serious hobbyists.',
    ARRAY['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop&q=80', 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=500&fit=crop'],
    'Available'
  ),
  (
    (SELECT id FROM "user" WHERE email = 'bob@example.com'),
    'Vintage Book Collection',
    7500,
    'USD',
    'Rare collection of vintage books from the 1950s. Great condition, perfect for collectors or literature enthusiasts. No photos available - contact seller for viewing.',
    ARRAY[]::TEXT[],
    'Available'
  );

INSERT INTO offer (created_at, product_id, user_id, offer_by, price_amount)
VALUES
  (
    NOW() - INTERVAL '1 hour',
    (SELECT id FROM "product" WHERE name = 'Gaming Laptop'),
    (SELECT id FROM "user" WHERE email = 'bob@example.com'),
    'Buyer',
    110000
  ),
  (
    NOW(),
    (SELECT id FROM "product" WHERE name = 'Gaming Laptop'),
    (SELECT id FROM "user" WHERE email = 'john@example.com'),
    'Seller',
    115000
  );
