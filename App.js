import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Button,
} from "react-native";

// Import card images
const cardImages = {
  // Red Numbers
  red_0: require("./assets/cards/Red_0.jpg"),
  red_1: require("./assets/cards/Red_1.jpg"),
  red_2: require("./assets/cards/Red_2.jpg"),
  red_3: require("./assets/cards/Red_3.jpg"),
  red_4: require("./assets/cards/Red_4.jpg"),
  red_5: require("./assets/cards/Red_5.jpg"),
  red_6: require("./assets/cards/Red_6.jpg"),
  red_7: require("./assets/cards/Red_7.jpg"),
  red_8: require("./assets/cards/Red_8.jpg"),
  red_9: require("./assets/cards/Red_9.jpg"),

  // Green Numbers
  green_0: require("./assets/cards/Green_0.jpg"),
  green_1: require("./assets/cards/Green_1.jpg"),
  green_2: require("./assets/cards/Green_2.jpg"),
  green_3: require("./assets/cards/Green_3.jpg"),
  green_4: require("./assets/cards/Green_4.jpg"),
  green_5: require("./assets/cards/Green_5.jpg"),
  green_6: require("./assets/cards/Green_6.jpg"),
  green_7: require("./assets/cards/Green_7.jpg"),
  green_8: require("./assets/cards/Green_8.jpg"),
  green_9: require("./assets/cards/Green_9.jpg"),

  // Blue Numbers
  blue_0: require("./assets/cards/Blue_0.jpg"),
  blue_1: require("./assets/cards/Blue_1.jpg"),
  blue_2: require("./assets/cards/Blue_2.jpg"),
  blue_3: require("./assets/cards/Blue_3.jpg"),
  blue_4: require("./assets/cards/Blue_4.jpg"),
  blue_5: require("./assets/cards/Blue_5.jpg"),
  blue_6: require("./assets/cards/Blue_6.jpg"),
  blue_7: require("./assets/cards/Blue_7.jpg"),
  blue_8: require("./assets/cards/Blue_8.jpg"),
  blue_9: require("./assets/cards/Blue_9.jpg"),

  // Yellow Numbers
  yellow_0: require("./assets/cards/Yellow_0.jpg"),
  yellow_1: require("./assets/cards/Yellow_1.jpg"),
  yellow_2: require("./assets/cards/Yellow_2.jpg"),
  yellow_3: require("./assets/cards/Yellow_3.jpg"),
  yellow_4: require("./assets/cards/Yellow_4.jpg"),
  yellow_5: require("./assets/cards/Yellow_5.jpg"),
  yellow_6: require("./assets/cards/Yellow_6.jpg"),
  yellow_7: require("./assets/cards/Yellow_7.jpg"),
  yellow_8: require("./assets/cards/Yellow_8.jpg"),
  yellow_9: require("./assets/cards/Yellow_9.jpg"),

  // Action cards
  red_skip: require("./assets/cards/Red_Skip.jpg"),
  red_reverse: require("./assets/cards/Red_Reverse.jpg"),
  red_draw2: require("./assets/cards/Red_Draw_2.jpg"),

  green_skip: require("./assets/cards/Green_Skip.jpg"),
  green_reverse: require("./assets/cards/Green_Reverse.jpg"),
  green_draw2: require("./assets/cards/Green_Draw_2.jpg"),

  blue_skip: require("./assets/cards/Blue_Skip.jpg"),
  blue_reverse: require("./assets/cards/Blue_Reverse.jpg"),
  blue_draw2: require("./assets/cards/Blue_Draw_2.jpg"),

  yellow_skip: require("./assets/cards/Yellow_Skip.jpg"),
  yellow_reverse: require("./assets/cards/Yellow_Reverse.jpg"),
  yellow_draw2: require("./assets/cards/Yellow_Draw_2.jpg"),

  // Wilds
  wild: require("./assets/cards/Wild.jpg"),
  wild_draw4: require("./assets/cards/Wild_Draw_4.jpg"),

  // Card back
  back: require("./assets/cards/back.jpg"),
};

// Helper functions
const getRandomCard = () => {
  const keys = Object.keys(cardImages).filter((k) => k !== "back");
  return keys[Math.floor(Math.random() * keys.length)];
};

const isPlayable = (card, topCard, chosenColor) => {
  if (!card || !topCard) return false;
  if (card.startsWith("wild")) return true;
  const [cardColor, cardValue] = card.split("_");
  const [topColor, topValue] = topCard.split("_");
  return (
    cardColor === topColor ||
    cardValue === topValue ||
    (chosenColor && cardColor === chosenColor)
  );
};

export default function App() {
  const [playerHand, setPlayerHand] = useState([]);
  const [opponentHand, setOpponentHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [turn, setTurn] = useState("player");
  const [chosenColor, setChosenColor] = useState(null);
  const [showColorModal, setShowColorModal] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    let player = Array(7).fill(null).map(getRandomCard);
    let opponent = Array(7).fill(null).map(getRandomCard);
    let startCard = getRandomCard();
    while (startCard.startsWith("wild")) {
      startCard = getRandomCard();
    }
    setPlayerHand(player);
    setOpponentHand(opponent);
    setDiscardPile([startCard]);
    setTurn("player");
    setWinner(null);
  };

  const topCard = discardPile[discardPile.length - 1];

  const playCard = (card, player = "player") => {
    if (!isPlayable(card, topCard, chosenColor)) return;

    // remove only ONE instance of the card
    if (player === "player") {
      setPlayerHand((prev) => {
        const newHand = [...prev];
        const idx = newHand.findIndex((c) => c === card);
        if (idx !== -1) newHand.splice(idx, 1);
        return newHand;
      });
    } else {
      setOpponentHand((prev) => {
        const newHand = [...prev];
        const idx = newHand.findIndex((c) => c === card);
        if (idx !== -1) newHand.splice(idx, 1);
        return newHand;
      });
    }

    // put on discard pile
    setDiscardPile((prev) => [...prev, card]);
    setChosenColor(null);

    const other = player === "player" ? "opponent" : "player";
    let nextTurn = other; // default: next player's turn

    // ACTION CARD HANDLING
    if (card.includes("draw2")) {
      const newCards = Array.from({ length: 2 }, () => getRandomCard());
      if (other === "player") setPlayerHand((prev) => [...prev, ...newCards]);
      else setOpponentHand((prev) => [...prev, ...newCards]);
      nextTurn = player;
    } else if (card.includes("wild_draw4")) {
      const newCards = Array.from({ length: 4 }, () => getRandomCard());
      if (other === "player") setPlayerHand((prev) => [...prev, ...newCards]);
      else setOpponentHand((prev) => [...prev, ...newCards]);
      nextTurn = player;
      setShowColorModal(true);
    } else if (card.includes("skip")) {
    nextTurn = player;
    } else if (card.includes("reverse")) {
      nextTurn = player;
    } else if (card.startsWith("wild")) {
      setShowColorModal(true);
    }

    setTurn(nextTurn);
  };


  const drawCard = (player = "player") => {
    const card = getRandomCard();
    if (player === "player") {
      const newHand = [...playerHand, card];
      setPlayerHand(newHand);

      // If playable, must play it immediately
      if (isPlayable(card, topCard, chosenColor)) {
        setTurn("player")
      } else {
        setTurn("opponent");
      }
    } else {
      const newHand = [...opponentHand, card];
      setOpponentHand(newHand);

      // Opponent auto plays if possible
      if (isPlayable(card, topCard, chosenColor)) {
        playCard(card, "opponent");
      } else {
        setTurn("player");
      }
    }
  };

  useEffect(() => {
    if (opponentHand.length === 0) setWinner("opponent");
    if (playerHand.length === 0) setWinner("player");
  }, [opponentHand, playerHand]);

  useEffect(() => {
    if (turn === "opponent" && !winner) {
      setTimeout(() => {
        const playable = opponentHand.find((c) =>
          isPlayable(c, topCard, chosenColor)
        );
        if (playable) {
          playCard(playable, "opponent");
        } else {
          drawCard("opponent");
        }
      }, 1200);
    }
  }, [turn, opponentHand]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UNO Game</Text>

      {/* Opponent hand */}
      <View style={styles.opponentHand}>
        {opponentHand.map((_, i) => (
          <Image
            key={i}
            source={cardImages["back"]}
            style={styles.cardBack}
          />
        ))}
      </View>
      <Text>Opponent: {opponentHand.length} cards</Text>

      {/* Discard pile */}
      <View style={styles.center}>
        {topCard && <Image source={cardImages[topCard]} style={styles.card} />}
        <TouchableOpacity onPress={() => turn === "player" && drawCard()}>
          <Image source={cardImages["back"]} style={styles.card} />
        </TouchableOpacity>
      </View>

      {/* Player hand */}
      <View style={styles.playerHand}>
        {playerHand.map((card, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => turn === "player" && playCard(card)}
          >
            <Image source={cardImages[card]} style={styles.card} />
          </TouchableOpacity>
        ))}
      </View>

      {winner && (
        <View style={styles.overlay}>
          <Text style={styles.winnerText}>
            {winner === "player" ? "You Win!" : "Opponent Wins!"}
          </Text>
          <Button title="Restart" onPress={startGame} />
        </View>
      )}

      {/* Color choose modal */}
      <Modal transparent={true} visible={showColorModal} animationType="slide">
        <View style={styles.modal}>
          <Text>Choose a color</Text>
          {["red", "green", "blue", "yellow"].map((color) => (
            <Button
              color={color}
              key={color}
              title={color}
              onPress={() => {
                setChosenColor(color);
                setShowColorModal(false);
                
              }}
            />
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#222", alignItems: "center" },
  title: { fontSize: 30, color: "yellow", marginTop: 50  },
  opponentHand: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, marginLeft: 10 },
  playerHand: { flexDirection: "row", flexWrap: "wrap", marginTop: 30, marginLeft: 10},
  center: { flexDirection: "row", marginTop: 40, marginBottom: 20 },
  card: { width: 60, height: 90, margin: 5, borderRadius: 10 },
  cardBack: { width: 60, height: 90, margin: 5,borderRadius: 10 },
  overlay: {
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  winnerText: { fontSize: 40, color: "yellow", marginBottom: 20 },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
});
