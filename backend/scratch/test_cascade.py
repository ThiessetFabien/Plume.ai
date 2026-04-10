from database import SessionLocal
import models
import datetime

def test_cascade():
    db = SessionLocal()
    print("🧪 Test de la suppression en cascade...")

    # 1. Créer un joueur de test
    player = models.Player(
        full_name="Test Cascade",
        email="test@cascade.com",
        age=30,
        average_frequency=1.0
    )
    db.add(player)
    db.commit()
    db.refresh(player)
    player_id = player.id
    print(f"✅ Joueur créé (ID: {player_id})")

    # 2. Créer une réservation et un message
    res = models.Reservation(
        court_number=1,
        start_time=datetime.datetime.utcnow(),
        player_id=player_id
    )
    msg = models.CoachingMessage(
        message="Message de test cascade",
        player_id=player_id
    )
    db.add(res)
    db.add(msg)
    db.commit()
    print("✅ Réservation et message créés.")

    # 3. Supprimer le joueur
    print("🗑️ Suppression du joueur...")
    db.delete(player)
    db.commit()

    # 4. Vérifier les orphelins
    res_count = db.query(models.Reservation).filter(models.Reservation.player_id == player_id).count()
    msg_count = db.query(models.CoachingMessage).filter(models.CoachingMessage.player_id == player_id).count()

    if res_count == 0 and msg_count == 0:
        print("🎉 SUCCÈS : Les cascades fonctionnent parfaitement. Aucune donnée orpheline.")
    else:
        print(f"❌ ÉCHEC : Des données orphelines subsistent (Res: {res_count}, Msg: {msg_count})")

    db.close()

if __name__ == "__main__":
    test_cascade()
