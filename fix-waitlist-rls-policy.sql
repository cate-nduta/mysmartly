DROP POLICY IF EXISTS "Allow authenticated full access waitlist" ON waitlist;
CREATE POLICY "Allow authenticated full access waitlist" ON waitlist
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

