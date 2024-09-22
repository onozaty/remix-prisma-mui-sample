-- Prisma Database Comments Generator v1.0.1

-- customers comments
COMMENT ON TABLE "customers" IS 'Customer';
COMMENT ON COLUMN "customers"."customer_id" IS 'Customer ID';
COMMENT ON COLUMN "customers"."name" IS 'Customer Name';
COMMENT ON COLUMN "customers"."email" IS 'e-mail';
COMMENT ON COLUMN "customers"."type" IS E'Customer Type\nenum: customer_types(PERSONAL, CORPORATE)';

-- products comments
COMMENT ON TABLE "products" IS 'Product';
COMMENT ON COLUMN "products"."product_id" IS 'Product ID';
COMMENT ON COLUMN "products"."name" IS 'Product Name';
COMMENT ON COLUMN "products"."description" IS 'Product Description';
COMMENT ON COLUMN "products"."price" IS 'Price';

-- sales comments
COMMENT ON COLUMN "sales"."sale_id" IS 'Sale ID';
COMMENT ON COLUMN "sales"."customer_id" IS 'Customer ID';
COMMENT ON COLUMN "sales"."product_id" IS 'Product ID';
COMMENT ON COLUMN "sales"."quantity" IS 'Quantity';
COMMENT ON COLUMN "sales"."total_price" IS 'Total Price';
