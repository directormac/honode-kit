import fs from 'fs-extra';
import childProcess from 'child_process';
import 'dotenv/config';

/**
 * Start
 */
(async () => {
	try {
		// Remove current dist
		await remove('./dist/');

		if (await checkDir('../web/build')) {
			console.log('Copying public files');
			await copy('../web/build', './dist/public');
		}

		if (await checkDir('./dist/public')) {
			console.log('Web files copied successfully');
		}

		await exec('tspc --build tsconfig.build.json', './');
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
})();

function checkDir(dir: string): Promise<boolean> {
	return new Promise((res, rej) => {
		return fs.ensureDir(dir, (err) => {
			return !!err ? rej(err) : res(true);
		});
	});
}

/**
 * Remove file
 */
function remove(loc: string): Promise<void> {
	return new Promise((res, rej) => {
		return fs.remove(loc, (err) => {
			return !!err ? rej(err) : res();
		});
	});
}

/**
 * Copy file.
 */
function copy(src: string, dest: string): Promise<void> {
	return new Promise((res, rej) => {
		return fs.copy(src, dest, (err) => {
			return !!err ? rej(err) : res();
		});
	});
}

/**
 * Do command line command.
 */
function exec(cmd: string, loc: string): Promise<void> {
	return new Promise((res, rej) => {
		return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
			if (!!stdout) {
				// logger.info(stdout);
				console.log(stdout);
			}
			if (!!stderr) {
				// logger.warn(stderr);
				console.log(stderr);
			}
			return !!err ? rej(err) : res();
		});
	});
}
