

from telegram import Update, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CallbackContext, CommandHandler, MessageHandler, filters
from creds import bot_token


async def launch_web_ui(update: Update, callback: CallbackContext):
    await update.effective_chat.send_message("I hear you loud and clear !")


async def launch_web_ui(update: Update, callback: CallbackContext):
    kb = [
        [KeyboardButton("Show me Google!",
                        web_app=WebAppInfo("https://amirhosein24.github.io/tel_game/"))]
    ]
    await update.message.reply_text("Let's do this...", reply_markup=ReplyKeyboardMarkup(kb))


if __name__ == '__main__':
    application = ApplicationBuilder().token(bot_token).build()

    application.add_handler(CommandHandler('start', launch_web_ui))
    application.run_polling()
