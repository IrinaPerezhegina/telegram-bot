/** @format */
const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./option");
const token = "5418366108:AAEvRbFikUNzmRaCmnDiWi-2HKQ0JIAQnq8";

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9`);
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, "Угадай?", gameOptions);
};

const start = () => {
	bot.setMyCommands([
		{ command: "/start", description: "Начальное приветствие" },
		{ command: "/info", description: "Получить информацию о пользователе" },
		{ command: "/game", description: "Игра 'угадай цифру'" },
	]);

	bot.on("message", async (msg) => {
		const text = msg.text;
		const chatId = msg.chat.id;
		if (text === "/start") {
			await bot.sendSticker(
				chatId,
				"https://chpic.su/_data/stickers/p/privetstvie_1/privetstvie_1_013.webp",
			);
			return bot.sendMessage(
				chatId,
				`Добро пожаловать в телеграм бот автора PerezhIV`,
			);
		}
		if (text === "/info") {
			return bot.sendMessage(
				chatId,
				`Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`,
			);
		}
		if (text === "/game") {
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!)`);
	});
	bot.on("callback_query", async (msg) => {
		const data = msg.data;
		const chadId = msg.message.chat.id;
		// bot.sendMessage(chadId, `Ты выбрал цифру ${data}`);
		if (data === "/again") {
			return startGame(chadId);
		}
		if (Number(data) === chats[chadId]) {
			return await bot.sendMessage(
				chadId,
				`Поздравляю, ты отгадал цифру ${chats[chadId]}`,
				againOptions,
			);
		} else {
			return await bot.sendMessage(
				chadId,
				`К сожалению, ты не угадал, бот загадал цирфу ${chats[chadId]}`,
				againOptions,
			);
		}
	});
};
start();
