import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";

// Card assets
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

  // Back
  back: require("./assets/cards/back.jpg"),
};

// Helpers
const getRandomCard = () => {
  const keys = Object.keys(cardImages).filter((k) => k !== "back");
  return keys[Math.floor(Math.random() * keys.length)];
};
const isPlayable = (card, topCard, chosenColor) => {
  if (!card || !topCard) return false;
  if (card.startsWith("wild")) return true;
  const [cColor, cVal] = card.split("_");
  const [tColor, tVal] = topCard.split("_");
  return cColor === tColor || cVal === tVal || (chosenColor && cColor === chosenColor);
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
    while (startCard.startsWith("wild")) startCard = getRandomCard();
    setPlayerHand(player);
    setOpponentHand(opponent);
    setDiscardPile([startCard]);
    setTurn("player");
    setWinner(null);
  };

  const topCard = discardPile[discardPile.length - 1];

  const pickBestColor = (hand) => {
    const colorCount = { red: 0, green: 0, blue: 0, yellow: 0 };
    hand.forEach((c) => {
      const [color] = c.split("_");
      if (colorCount[color] !== undefined) colorCount[color]++;
    });
    return Object.entries(colorCount).sort((a, b) => b[1] - a[1])[0][0];
  };

  const playCard = (card, player = "player") => {
    if (!isPlayable(card, topCard, chosenColor)) return;

    if (player === "player") {
      setPlayerHand((prev) => {
        const newHand = [...prev];
        const idx = newHand.indexOf(card);
        if (idx !== -1) newHand.splice(idx, 1);
        return newHand;
      });
    } else {
      setOpponentHand((prev) => {
        const newHand = [...prev];
        const idx = newHand.indexOf(card);
        if (idx !== -1) newHand.splice(idx, 1);
        return newHand;
      });
    }

    setDiscardPile((prev) => [...prev, card]);
    setChosenColor(null);

    const other = player === "player" ? "opponent" : "player";
    let nextTurn = other;

    if (card.includes("draw2")) {
      const newCards = Array.from({ length: 2 }, () => getRandomCard());
      other === "player"
        ? setPlayerHand((p) => [...p, ...newCards])
        : setOpponentHand((o) => [...o, ...newCards]);
      nextTurn = player;
    } else if (card.includes("wild_draw4")) {
      const newCards = Array.from({ length: 4 }, () => getRandomCard());
      other === "player"
        ? setPlayerHand((p) => [...p, ...newCards])
        : setOpponentHand((o) => [...o, ...newCards]);
      if (player === "player") {
        setShowColorModal(true);
      } else {
        // Opponent picks random color
        setChosenColor(pickBestColor(opponentHand));
      }
    } else if (card.includes("skip") || card.includes("reverse")) {
      nextTurn = player;
    } else if (card.startsWith("wild")) {
      if (player === "player") {
        setShowColorModal(true);
      } else {
        // Opponent picks random color
        setChosenColor(pickBestColor(opponentHand));
      }
    }
    setTurn(nextTurn);
  };

  const drawCard = (who = "player") => {
    const card = getRandomCard();
    if (who === "player") {
      const newHand = [...playerHand, card];
      setPlayerHand(newHand);
      if (isPlayable(card, topCard, chosenColor)) {
       setTurn("player"); // auto play if valid
      } else {
        setTurn("opponent");
      }
    } else {
      const newHand = [...opponentHand, card];
      setOpponentHand(newHand);
      if (isPlayable(card, topCard, chosenColor)) playCard(card, "opponent");
      else setTurn("player");
    }
  };


  useEffect(() => {
    if (opponentHand.length === 0) setWinner("opponent");
    if (playerHand.length === 0) setWinner("player");
  }, [opponentHand, playerHand]);

  useEffect(() => {
    if (turn === "opponent" && !winner) {
      setTimeout(() => {
        const playable = opponentHand.find((c) => isPlayable(c, topCard, chosenColor));
        playable ? playCard(playable, "opponent") : drawCard("opponent");
      }, 1200);
    }
  }, [turn, opponentHand]);

  return (
    <LinearGradient colors={["#111", "#222", "#000"]} style={styles.container}>
      <Text style={styles.title}>🔥 UNO 🔥</Text>
      

      {/* Opponent */}
      <View style={styles.section}>
        <Text style={styles.label}>👤 Opponent ({opponentHand.length})</Text>
        <View style={styles.opponentHand}>
          {opponentHand.map((_, i) => (
            <Animated.Image
              entering={FadeInDown.delay(i * 50)}
              key={i}
              source={cardImages.back}
              style={styles.cardBack}
              pointerEvents="none"
            />
          ))}
        </View>
      </View>

      {/* Center Table */}
      <View style={styles.table}>
        {topCard && (
          <Animated.Image
            source={cardImages[topCard]}
            style={styles.card}
            entering={FadeInUp}
            layout={Layout.springify()}
            pointerEvents="none"
          />
        )}

        {/* Current Color Indicator */}
        {(chosenColor || topCard) && (
          <View style={[styles.colorIndicator, { backgroundColor: chosenColor || topCard.split("_")[0] }, {left: 5}]} />
        )}

        {/* Draw pile stack */}
        <View style={styles.drawPile} pointerEvents="box-none">
          {/* background stacked cards - ignore touches */}
          <Image
            source={cardImages.back}
            style={[styles.card, styles.pileCard, { top: -6, left: -6 }]}
            pointerEvents="none"
          />
          <Image
            source={cardImages.back}
            style={[styles.card, styles.pileCard, { top: -3, left: -3 }]}
            pointerEvents="none"
          />

          {/* clickable card on top (Touchable itself is absolute and has high zIndex) */}
          <TouchableOpacity
            onPress={() => {
              if (turn === "player") drawCard();
            }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            activeOpacity={0.85}
            style={[styles.card, styles.pileCard, styles.drawTouchable, { top: -5, left: -5 }]}
          >
            {/* inner image should not block touches (touches handled by TouchableOpacity) */}
            <Image source={cardImages.back} style={styles.card} pointerEvents="none" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Player */}
      <View style={styles.section}>
        <Text style={styles.label}>🙋 You ({playerHand.length})</Text>
        <Text style={styles.turnIndicator}>
          {turn === "player" ? "👉 Your Turn" : "🤖 Opponent's Turn"}
        </Text>
        <View style={styles.playerHand}>
          {playerHand.map((card, i) => (
            <Animated.View
              key={i}
              entering={FadeInUp.delay(i * 50)}
              layout={Layout.springify()}
            >
              <TouchableOpacity onPress={() => turn === "player" && playCard(card)}>
                <Image
                  source={cardImages[card]}
                  style={[
                    styles.card,
                    isPlayable(card, topCard, chosenColor) && styles.playableCard,
                  ]}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Winner Banner */}
      {winner && (
        <View style={styles.overlay}>
          <View style={styles.banner}>
            <Text style={styles.winnerText}>
              {winner === "player" ? "🎉 You Win!" : "💀 Opponent Wins!"}
            </Text>
            <Pressable style={styles.restartBtn} onPress={startGame}>
              <Text style={styles.restartText}>Restart</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Color Modal */}
      <Modal transparent visible={showColorModal} animationType="fade">
        <View style={styles.modal}>
          <Text style={styles.modalText}>Pick a color</Text>
          <View style={styles.colorRow}>
            {["red", "green", "blue", "yellow"].map((c) => (
              <Pressable
                key={c}
                style={[styles.colorBtn, { backgroundColor: c }]}
                onPress={() => {
                  setChosenColor(c);
                  setShowColorModal(false);
                  setTurn(turn === "player" ? "opponent" : "player");
                }}
              />
            ))}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 40 },
  title: { fontSize: 36, fontWeight: "bold", color: "#ff5252", marginBottom: 5 },
  turnIndicator: { fontSize: 20, fontWeight: "bold", color: "#ffd700", marginBottom: 10 },
  section: { alignItems: "center", marginVertical: 10 },
  label: { fontSize: 18, color: "#fff", marginBottom: 5 },
  opponentHand: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  playerHand: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  table: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#333",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  card: {
    width: 70,
    height: 100,
    margin: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardBack: {
    width: 45,
    height: 65,
    margin: 2,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  playableCard: {
    borderWidth: 3,
    borderColor: "#0f0",
    borderRadius: 10,
  },
  drawPile: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  pileCard: {
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  banner: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  winnerText: { fontSize: 28, color: "#fff", marginBottom: 15 },
  restartBtn: {
    backgroundColor: "#ff5252",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  restartText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  modalText: { color: "#fff", fontSize: 20, marginBottom: 20 },
  colorRow: { flexDirection: "row", gap: 20 },
  colorBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  drawTouchable: {
  zIndex: 0,        // make sure the Touchable is on top (iOS)
  elevation: 0,     // Android needs elevation for z-order
  position: "absolute" // ensures zIndex/elevation applies properly
  },
  colorIndicator: {
  width: 10,
  height: 10,
  borderRadius: 6,
  marginleft: 0,
  marginBottom: 20,
  borderWidth: 2,
  borderColor: "#fff",
  },


});
