import { defineDb, defineTable, column } from 'astro:db';

const TestTable = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    created_at: column.date({ default: new Date() }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    test_table: TestTable,
  },
});
