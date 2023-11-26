import React, { useEffect, useState } from "react";
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

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">X</button>
        {children}
      </div>
    </div>
  );
};

export const GameScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

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
      setModalContent(room.winner === color ? "Vous avez gagné !" : "Vous avez perdu !");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/");
      }, 3000);
    }
  }, [room, navigate, color]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  if (roomLoading) return "Loading...";

  return (
    <div>
      <Modal show={showModal} onClose={handleCloseModal}>
        <p>{modalContent}</p>
      </Modal>
      <div className="game">
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
    </div>
  );
};

export default GameScreen;
