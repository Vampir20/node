const TelegramBotApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const { json } = require('stream/consumers')

const token = "5657823036:AAF3QLLY0CcwarBUJqmYprlcMVZLQjKj16Q"

const bot = new TelegramBotApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage('chatId', 'бот загадывает цифру от 0 до 9')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о тебе'},
        {command: '/game', description: 'Игра угадай число'}
   ])
   
   bot.on('message', async msg=>{
       const text = msg.text
       const chatId = msg.chat.id
       if (text === '/start'){
           return bot.sendMessage(chatId, "добро пожаловать а телеграм бот")
       }
   
       if (text === '/info'){
           return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name}`)
       }

       if (text === '/game'){
        return startGame(chatId)
       }
       return bot.sendMessage(chatId, 'я тебя не понимаю')
   })

   bot.on('callback_query', async msg=>{
    const data = msg.text;
    const chatId = msg.message.chat.id;

    if (data == '/again'){
        return startGame(chatId)
    }

    if (data == chats[chatId]){
        return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
    }else{
        return bot.sendMessage(chatId, `Ты не отгадал цифру бота ${chats[chatId]}`, againOptions)
    }
    console.log(msg);
   })
   
}

start()