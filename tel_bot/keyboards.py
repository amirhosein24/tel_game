
from telegram import KeyboardButton, ReplyKeyboardMarkup, WebAppInfo


MainPage = [
    [
        KeyboardButton("Show me my Web-App!",
                       web_app=WebAppInfo("https://amirhosein24.github.io/tel_game/"))
    ]
]

MainPage = ReplyKeyboardMarkup(MainPage)
