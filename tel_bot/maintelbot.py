

from telegram import Update
from telegram.ext import ApplicationBuilder, CallbackContext, CommandHandler, MessageHandler, filters

import tel_bot.keyboards as keyboards

import json
from credentials.creds import TelegramBotToken


async def start_handler(update: Update, callback: CallbackContext):

    chat_id = update.message.chat_id
    print(chat_id)

    await update.message.reply_text("Let's do this...", reply_markup=keyboards.main_page(chat_id))
#     await update.message.reply_text("Your data was:")
#     for result in data:
#         await update.message.reply_text(f"{result['name']}: {result['value']}")


# async def web_app_data(update: Update, context: CallbackContext):
#     data = json.loads(update.message.web_app_data.data)
#     await update.message.reply_text("Your data was:")
#     for result in data:
#         await update.message.reply_text(f"{result['name']}: {result['value']}")


if __name__ == '__main__':

    application = ApplicationBuilder().token(TelegramBotToken).build()

    application.add_handler(CommandHandler('start', start_handler))
    # application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

    print(f"bot is live")
    application.run_polling()
