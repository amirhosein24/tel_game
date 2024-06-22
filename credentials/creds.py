
def get_from_json():

    from os import path
    from json import loads

    home = path.dirname(path.dirname(__file__)) + "/"

    with open(home + "credentials/creds.json", "r", encoding="utf-8") as file:
        config = loads(file.read())

    tel_bot_token = config["tell_bot_token"]

    return tel_bot_token


TelegramBotToken = get_from_json()
