import React from "react";
import { useSubscribe, useFind } from "meteor/react-meteor-data";
import { RoomCollection } from "../api/rooms";
import { useNavigate } from "react-router-dom";
import "./game.css";

export const RoomList = () => {
  const navigate = useNavigate();
  const listLoading = useSubscribe('rooms');
  const rooms = useFind(() => RoomCollection.find({}), []);

  if (listLoading()) return "Loading...";

  return (
    <div className="room-list">
      <h1>Bienvenue au jeu Tic-Tac-Doe</h1>
      <button className="create-room-btn" onClick={() => Meteor.call("createRoom")}>
        Créer une salle
      </button>
      <ul className="room-list-ul">
        {rooms.map(({ _id, capacity, winner }) => (
          <li key={_id} className="room-list-item">
            Salle {_id} <br />
            {winner ? `Gagnant: ${winner}` : ""}
            <br />
            {!winner && (
              <button
                className="join-room-btn"
                onClick={() => {
                  Meteor.call(
                    "joinRoom",
                    { roomId: _id },
                    (err, { room, color }) => {
                      navigate(`/game/${room._id}`, { state: { color } });
                    }
                  );
                }}
              >
                Rejoindre la salle
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
