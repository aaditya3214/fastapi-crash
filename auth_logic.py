# auth_logic.py
def check_user_credentials(username, password):
    # this is for an example later we add this username and password in database
    if username == "admin" and password == "secret":
        return True
    return False