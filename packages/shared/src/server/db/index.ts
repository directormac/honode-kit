import { drizzle } from 'drizzle-orm/postgres-js';
import { alias } from 'drizzle-orm/pg-core';
import postgres from 'postgres';
import * as schema from '../../schemas';
import 'dotenv/config';
import {
	sql,
	eq,
	asc,
	ne,
	and,
	like,
	notLike,
	notInArray,
	or,
	not,
	desc,
	isNull,
	notExists
} from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!, {
	max: 10
});

const db = drizzle(client, {
	schema
});

export { client, db };

export {
	alias,
	sql,
	eq,
	asc,
	ne,
	and,
	like,
	notLike,
	notInArray,
	or,
	not,
	desc,
	isNull,
	notExists
};
