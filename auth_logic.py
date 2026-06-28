# auth_logic.py
def check_user_credentials(username, password):
    # यह सिर्फ एक उदाहरण है, बाद में हम इसे डेटाबेस से जोड़ेंगे
    if username == "admin" and password == "secret":
        return True
    return False