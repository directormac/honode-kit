import pino from 'pino';
import pretty from 'pino-pretty';

const pinoPretty = pretty({
	colorize: true,
	translateTime: 'yyyy-mm-dd HH:MM:ss.l'
});

const logger = pino(pinoPretty);

export default logger;
