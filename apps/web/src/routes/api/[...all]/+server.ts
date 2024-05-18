import hono from '@honode-kit/shared/server';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => hono.fetch(request);
export const PUT: RequestHandler = ({ request }) => hono.fetch(request);
export const DELETE: RequestHandler = ({ request }) => hono.fetch(request);
export const POST: RequestHandler = ({ request }) => hono.fetch(request);
export const PATCH: RequestHandler = ({ request }) => hono.fetch(request);
export const fallback: RequestHandler = ({ request }) => hono.fetch(request);
