import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { useTracker } from "meteor/react-meteor-data";
import { RoomCollection } from "../api/rooms";
import { useNavigate } from "react-router-dom";
import "./game.css";  

const Slot = ({ id, gameState, color, roomId }) => {
  return (
    <div
      className="slot"
      onClick={() => {
        Meteor.call(
          "makePlay",
          { roomId, playState: { play: id - 1, color } },
          (err) => {
            if (err && err.error === "invalid-play") {
              alert(
                "This move is invalid. You might need to wait for your turn!"
              );
            } else if (err) {
              alert(err.message);
            }
          }
        );
      }}
    >
      {gameState[id - 1] === "cross" ? (
        <img src={"/cross.png"} alt="cross" />
      ) : (
        ""
      )}
      {gameState[id - 1] === "circle" ? (
        <img src={"/circle.png"} alt="circle" />
      ) : (
        ""
      )}
    </div>
  );
};

export const GameScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { color } = location.state;
  const { room, roomLoading } = useTracker(() => {
    const handle = Meteor.subscribe("room", { _id: id });
    const room = RoomCollection.findOne({ _id: id });
    return {
      room,
      roomLoading: !handle.ready(),
    };
  }, [id]);

  useEffect(() => {
    if (room && room.winner) {
      alert(room.winner === color ? "You Won!" : "You Lost!!");
      navigate("/");
    }
  }, [room, color, navigate]);

  if (roomLoading) return "Loading...";

  return (
    <div className="game">
      <h1>Let's go</h1>
      <div className="line">
        <Slot id={1} gameState={room.gameState} color={color} roomId={id} />
        <Slot id={2} gameState={room.gameState} color={color} roomId={id} />
        <Slot id={3} gameState={room.gameState} color={color} roomId={id} />
      </div>
      <div className="line">
        <Slot id={4} gameState={room.gameState} color={color} roomId={id} />
        <Slot id={5} gameState={room.gameState} color={color} roomId={id} />
        <Slot id={6} gameState={room.gameState} color={color} roomId={id} />
      </div>
      <div className="line">
        <Slot id={7} gameState={room.gameState} color={color} roomId={id} />
        <Slot id={8} gameState={room.gameState} color={color} roomId={id} />
        <Slot id={9} gameState={room.gameState} color={color} roomId={id} />
      </div>
    </div>
  );
};
