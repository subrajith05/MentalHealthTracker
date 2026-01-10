from passlib.context import CryptContext

pwd_cxt = CryptContext(schemes=['bcrypt'], deprecated='auto')

class Hash:
    #Utility to encrypt the password
    def bcrypt(password):
        safe_password = password.encode("utf-8")[:72]
        return pwd_cxt.hash(safe_password)
    
    #Uitility to verify the password
    def verify_password(plain_password, hashed_password):
        safe_password = plain_password.encode("utf-8")[:72]
        return pwd_cxt.verify(safe_password, hashed_password)