import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
	schema: ['./packages/shared/src/schemas'],
	dialect: 'postgresql',
	out: './migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	},
	verbose: true
});
