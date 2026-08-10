-- RLS policies — public read, owner-only write.
-- Run after 0001_init.sql, once RLS is enabled on all tables.

alter table profiles enable row level security;
alter table favorite_items enable row level security;
alter table restaurant_details enable row level security;
alter table reviews enable row level security;
alter table lists enable row level security;
alter table list_items enable row level security;

-- profiles: anyone can view; only the owning auth user can create/edit their own row.
-- Username immutability is enforced at the application layer (never sent on update),
-- not here — a stricter version would need a trigger comparing old/new username.
create policy "profiles are publicly viewable" on profiles
  for select using (true);
create policy "owner can insert their profile" on profiles
  for insert with check (auth.uid() = user_id);
create policy "owner can update their profile" on profiles
  for update using (auth.uid() = user_id);

-- favorite_items: anyone can view; only the owning profile's user can write.
create policy "favorite_items are publicly viewable" on favorite_items
  for select using (true);
create policy "owner can manage their favorite_items" on favorite_items
  for all using (
    profile_id in (select id from profiles where user_id = auth.uid())
  ) with check (
    profile_id in (select id from profiles where user_id = auth.uid())
  );

-- restaurant_details: anyone can view; only the owning favorite_item's user can write.
create policy "restaurant_details are publicly viewable" on restaurant_details
  for select using (true);
create policy "owner can manage their restaurant_details" on restaurant_details
  for all using (
    favorite_item_id in (
      select fi.id from favorite_items fi
      join profiles p on p.id = fi.profile_id
      where p.user_id = auth.uid()
    )
  ) with check (
    favorite_item_id in (
      select fi.id from favorite_items fi
      join profiles p on p.id = fi.profile_id
      where p.user_id = auth.uid()
    )
  );

-- reviews: anyone can view; only the owning favorite_item's user can write.
create policy "reviews are publicly viewable" on reviews
  for select using (true);
create policy "owner can manage their reviews" on reviews
  for all using (
    favorite_item_id in (
      select fi.id from favorite_items fi
      join profiles p on p.id = fi.profile_id
      where p.user_id = auth.uid()
    )
  ) with check (
    favorite_item_id in (
      select fi.id from favorite_items fi
      join profiles p on p.id = fi.profile_id
      where p.user_id = auth.uid()
    )
  );

-- lists: anyone can view; only the owning profile's user can write.
create policy "lists are publicly viewable" on lists
  for select using (true);
create policy "owner can manage their lists" on lists
  for all using (
    profile_id in (select id from profiles where user_id = auth.uid())
  ) with check (
    profile_id in (select id from profiles where user_id = auth.uid())
  );

-- list_items: anyone can view; only the owning list's user can write.
create policy "list_items are publicly viewable" on list_items
  for select using (true);
create policy "owner can manage their list_items" on list_items
  for all using (
    list_id in (
      select l.id from lists l
      join profiles p on p.id = l.profile_id
      where p.user_id = auth.uid()
    )
  ) with check (
    list_id in (
      select l.id from lists l
      join profiles p on p.id = l.profile_id
      where p.user_id = auth.uid()
    )
  );
