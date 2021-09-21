import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable } from 'react-native'
import shuffle from 'shuffle-array'

export default function App() {

  const emojis = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"]
  const cards = getEmojis()
  const [timer, setTimer] = useState(60)
  const [intervalState, setIntervalState] = useState()
  const [timerOut, setTimerOut] = useState(true)
  const [card, setCard] = useState(cards)

  useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalState)
      setTimerOut(!timerOut)
      setTimer(60)
      setCard(cards)
    }
  }, [timer])

  useEffect(() => {
    let timerId

    async function removeCard() {
      
      const countOcurrences = card.filter(item => item.value === '' ? true : null).length
      if (countOcurrences === 20) {
        setCard(cards)
        clearInterval(intervalState)
        setTimerOut(!timerOut)
        setTimer(60)
        return
      }
      
      const turned = card.filter(item => item.show && !item.turned ? item : null)
      
      if (turned.length === 2) {
        if (String(turned[0].value) === String(turned[1].value)) {
          const items = card.filter(item => {
            if (item === turned[0] || item === turned[1]) {
              item.value = ''
              item.turned = true
              return item
            }
            return item
          })

          timerId = setTimeout(() => setCard(items), 300)
          return
        } else {
          const items = card.filter(item => {
            if (item.show && !item.turned) {
              item.show = !item.show
              return item
            }
            return item
          })
          timerId = setTimeout(() => setCard(items), 400)
        }
      }
    }

    removeCard()
    return () => clearTimeout(timerId)
  }, [card])

  function invert(index) {
    const countOcurrences = card.filter(item => item.show && !item.turned ? item.show : null ).length

    if (timerOut) return

    if (card[index].show) return

    if (card[index].turned) return


    if (countOcurrences >= 2) {
      const items = card.filter(item => {
        if (item.show && !item.turned) {
          item.show = !item.show
          return item
        }
        return item
      })
      
      setCard(items)
      return
    }
    
    const items = card.filter(item => {
      if (index === card.indexOf(item)) {
        item.show = !item.show
        return item
      }
      return item
    })
    

    //card[index].show = !card[index].show
    //setCard(card)
    setCard(items)
  }

  function getEmojis() {
    let selectedEmojis = []
    let emojisCards = []
    let objCards = []
    const interval = Math.floor(Math.random() * (emojis.length - 10))

    selectedEmojis = emojis.slice(interval, interval + 10)


    selectedEmojis.map(emoji => { emojisCards.push(emoji); emojisCards.push(emoji) })
    
    emojisCards.map(emoji => {
      objCards.push({
        value: emoji,
        id: `${Math.floor((Math.random() * 100) + emojisCards.indexOf(emoji))}`,
        show: false,
        turned: false
      })
    })

    return shuffle(objCards)
  }

  function start() {
    if (!timerOut) {
      return
    }
    setIntervalState(setInterval(() => {
      setTimer(prevState => prevState - 1)
    }, 1000))
    setTimerOut(!timerOut)
  }
 
  return (
    <View style={styles.container}>
      <View style={styles.game}>
        {/* Página principal do jogo */}

        <View>
          <Text style={{ fontSize: 50, alignSelf: 'center' }}>{timer}</Text>
        </View>

        <FlatList
          style={{ flexBasis: 0 }}
          data={card}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={4}
          renderItem={({ item, index }) => (
              <Pressable style={styles.card} onPress={() => invert(index)}>
                <Text style={{fontSize: 20 }}>
                  {item.show ? item.value : 'Virar!'}
                </Text>
              </Pressable>
          )}
        />

        <TouchableOpacity onPress={() => start()}>
          <Text style={{ fontSize: 20, alignSelf: 'center', marginBottom: 5}}>START</Text>
        </TouchableOpacity>

      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30
  },

  game: {
    flex: 1
  },

  card: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#FFF8E5',
    width: 80,
    height: 80,
    margin: 5,

    //textAlign: 'center',
    //textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
})