
from telegram import KeyboardButton, ReplyKeyboardMarkup, WebAppInfo, InlineKeyboardMarkup


def main_page(chat_id):
    key = [
        [
            KeyboardButton("Web-App",
                           web_app=WebAppInfo(f"https://49.12.97.130:8020/home/{chat_id}"))
        ]
    ]

    key = InlineKeyboardMarkup(key)

    return key
