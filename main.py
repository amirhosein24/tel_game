from telegram import Update, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CallbackContext, CommandHandler, MessageHandler, filters


import json

async def launch_web_ui(update: Update, callback: CallbackContext):
    # For now, let's just acknowledge that we received the command
    await update.effective_chat.send_message("I hear you loud and clear !")




async def launch_web_ui(update: Update, callback: CallbackContext):
    # display our web-app!
    kb = [
        [KeyboardButton(
            "Show me my Web-App!",
           web_app=WebAppInfo("https://calixtemayoraz.gitlab.io/web-interfacer-bot/") # obviously, set yours here.
        )]
    ]
    await update.message.reply_text("Let's do this...", reply_markup=ReplyKeyboardMarkup(kb))


async def web_app_data(update: Update, context: CallbackContext):
    data = json.loads(update.message.web_app_data.data)
    await update.message.reply_text("Your data was:")
    for result in data:
        await update.message.reply_text(f"{result['name']}: {result['value']}")


if __name__ == '__main__':
    # when we run the script we want to first create the bot from the token:
    application = ApplicationBuilder().token("--").build()
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))
    # and let's set a command listener for /start to trigger our Web UI
    application.add_handler(CommandHandler('start', launch_web_ui))

    # and send the bot on its way!
    print(f"Your bot is listening! Navigate to http://t.me/garshaspxbot to interact with it!")
    application.run_polling()