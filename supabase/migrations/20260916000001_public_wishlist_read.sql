-- Allow public (anon) read access to wishlist_items
-- Currently only authenticated users can read, blocking logged-out visitors

DROP POLICY IF EXISTS "wishlist_select_all" ON wishlist_items;
CREATE POLICY "wishlist_select_all" ON wishlist_items FOR SELECT
  TO anon, authenticated USING (true);