import type { UserFormSchema } from '../../../types';
import { Argon2id } from 'oslo/password';
import { db, eq } from '..';
import { user } from '../../../schemas';
import { generateId } from 'lucia';

export const createUser = async (form: UserFormSchema) =>
	await db.transaction(async (tx) => {
		const hashedPassword = await new Argon2id().hash(form.password);
		const [newUser] = await tx
			.insert(user)
			.values({
				...form,
				password: hashedPassword,
				id: generateId(15)
			})
			.returning({
				id: user.id
			});
		return newUser;
	});

export const updateUser = async (id: string, form: UserFormSchema) =>
	await db.transaction(async (tx) => {
		const { password, ...rest } = form;
		const [updatedUser] = await tx
			.update(user)
			.set({
				...rest
			})
			.where(eq(user.id, id))
			.returning({ id: user.id });

		return updatedUser;
	});

export const changePassword = async (id: string, newPassword: string) =>
	await db.transaction(async (tx) => {
		const hashedPassword = await new Argon2id().hash(newPassword);
		const [updatedUser] = await tx
			.update(user)
			.set({
				password: hashedPassword
			})
			.where(eq(user.id, id))
			.returning({ id: user.id });
		return updatedUser;
	});

export const deleteUsers = async (ids: string[]) =>
	await db.transaction(async (tx) => {
		for (const id of ids) {
			await tx.delete(user).where(eq(user.id, id));
		}
	});

export const deleteUser = async (id: string) =>
	await db.delete(user).where(eq(user.id, id)).returning({ id: user.id });
