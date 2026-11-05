-- Run only against an isolated development/test database after migrations.
-- All test records are rolled back, including when an assertion fails.
BEGIN;

DO $$
DECLARE
  owner_id TEXT := gen_random_uuid()::TEXT;
  type_id TEXT := gen_random_uuid()::TEXT;
  collection_id TEXT := gen_random_uuid()::TEXT;
  item_id TEXT := gen_random_uuid()::TEXT;
  tag_id TEXT := gen_random_uuid()::TEXT;
BEGIN
  INSERT INTO "User" (id, email, "updatedAt")
  VALUES (owner_id, owner_id || '@example.invalid', NOW());
  INSERT INTO "ItemType" (id, name, "normalizedName", "contentKind", "userId", "updatedAt")
  VALUES (type_id, 'Test', 'test', 'TEXT', owner_id, NOW());
  INSERT INTO "Collection" (id, name, "userId", "updatedAt")
  VALUES (collection_id, 'Test', owner_id, NOW());
  INSERT INTO "Item" (id, title, content, "userId", "typeId", "collectionId", "updatedAt")
  VALUES (item_id, 'Test', 'Test content', owner_id, type_id, collection_id, NOW());
  INSERT INTO "Tag" (id, name, "normalizedName", "userId")
  VALUES (tag_id, 'Test', 'test', owner_id);
  INSERT INTO "ItemTag" ("itemId", "tagId") VALUES (item_id, tag_id);
  INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId")
  VALUES (owner_id, owner_id, 'oauth', 'github', owner_id);
  INSERT INTO "Session" (id, "sessionToken", "userId", expires)
  VALUES (owner_id, owner_id, owner_id, NOW() + INTERVAL '1 day');
  INSERT INTO "Subscription" (id, "userId", "stripeSubscriptionId", "stripePriceId", status, "updatedAt")
  VALUES (owner_id, owner_id, owner_id, 'test', 'active', NOW());

  BEGIN
    DELETE FROM "ItemType" WHERE id = type_id;
    RAISE EXCEPTION 'Referenced type deletion should fail';
  EXCEPTION WHEN foreign_key_violation OR restrict_violation THEN NULL;
  END;

  BEGIN
    INSERT INTO "Tag" (id, name, "normalizedName", "userId")
    VALUES (gen_random_uuid()::TEXT, 'TEST', 'test', owner_id);
    RAISE EXCEPTION 'Duplicate normalized tag should fail';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;

  BEGIN
    INSERT INTO "ItemType" (id, name, "normalizedName", "contentKind", "updatedAt")
    VALUES (gen_random_uuid()::TEXT, 'Invalid', 'invalid', 'TEXT', NOW());
    RAISE EXCEPTION 'Ownerless custom type should fail';
  EXCEPTION WHEN check_violation THEN NULL;
  END;

  BEGIN
    UPDATE "ItemType" SET "systemKey" = 'SNIPPET' WHERE id = type_id;
    RAISE EXCEPTION 'Owned system type should fail';
  EXCEPTION WHEN check_violation THEN NULL;
  END;

  BEGIN
    UPDATE "ItemType" SET "systemKey" = 'URL', "userId" = NULL WHERE id = type_id;
    RAISE EXCEPTION 'Invalid system storage kind should fail';
  EXCEPTION WHEN check_violation THEN NULL;
  END;

  DELETE FROM "Collection" WHERE id = collection_id;
  ASSERT EXISTS (SELECT 1 FROM "Item" WHERE id = item_id AND "collectionId" IS NULL),
    'Collection deletion must preserve the item in Inbox';

  DELETE FROM "Tag" WHERE id = tag_id;
  ASSERT NOT EXISTS (SELECT 1 FROM "ItemTag" WHERE "itemId" = item_id),
    'Tag deletion must remove joins';
  ASSERT EXISTS (SELECT 1 FROM "Item" WHERE id = item_id),
    'Tag deletion must preserve items';

  -- Account cleanup removes items before custom types because types use RESTRICT.
  DELETE FROM "Item" WHERE id = item_id;
  DELETE FROM "User" WHERE id = owner_id;
  ASSERT NOT EXISTS (SELECT 1 FROM "ItemType" WHERE id = type_id), 'Custom types must cascade';
  ASSERT NOT EXISTS (SELECT 1 FROM "Account" WHERE "userId" = owner_id), 'Accounts must cascade';
  ASSERT NOT EXISTS (SELECT 1 FROM "Session" WHERE "userId" = owner_id), 'Sessions must cascade';
  ASSERT NOT EXISTS (SELECT 1 FROM "Subscription" WHERE "userId" = owner_id), 'Subscriptions must cascade';
END $$;

ROLLBACK;
