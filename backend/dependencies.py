from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

import crud
import schemas
import models
from database import get_db
from security import SECRET_KEY, ALGORITHM

# URL vers laquelle le client doit envoyer les identifiants pour obtenir un jeton
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_player(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> models.Player:
    """
    Dépendance réutilisable sur toutes les routes protégées.
    Valide le JWT et retourne l'objet Player correspondant.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    player = crud.get_player_by_email(db, email=token_data.email)
    if player is None:
        raise credentials_exception
    
    return player
