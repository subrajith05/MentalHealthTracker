from passlib.context import CryptContext

pwd_cxt = CryptContext(schemes=['bcrypt'], deprecated='auto')

class Hash:
    #Utility to encrypt the password
    def bcrypt(password):
        return pwd_cxt.hash(password)
    
    #Uitility to verify the password
    def verify_password(plain_password, hashed_password):
        return pwd_cxt.verify(plain_password, hashed_password)