import React, {useState, useEffect} from "react";
import axios from 'axios'
import Card from "./Card";
import "./Deck.css"

const BASE_URL = 'https://deckofcardsapi.com/api/deck'

const Deck = () => {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([])
    const [isShuffling, setIsShuffling] = useState(false)

    useEffect(() => {
        async function LoadDeck() {
            const res = await axios.get(`${BASE_URL}/new/shuffle/`)
            setDeck(res.data)
            console.log(deck)
        }
        LoadDeck()
    },[])

    async function Draw() {
        try{
            const drawRes = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/`)
            if(drawRes.data.remaining === 0) throw new Error('Deck is Empty')

            const card = drawRes.data.cards[0]
        

            setDrawn(deck => [
                ...deck,
                {
                    id: card.code,
                    name: card.value + " " + card.suit,
                    image: card.image
                }
            ])
            
        }
        catch(e){
            alert(e)
        }

    }

    async function startShuffling(){
        setIsShuffling(true);
        try{
            await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle/`)
            console.log()
            setDrawn([])   
        }   catch(err){
            alert(err)
        }   finally{
            setIsShuffling(false)
        }
    }

 

    const RenderCardBtn = () => {
        if(!deck) return null

        return (
            <button 
                className="Deck-gimme"
                onClick={Draw}>
                DRAW
             </button>
        )
    }

    function renderShuffleBtnIfOk() {
        if (!deck) return null;
        return (
          <button
            className="Deck-gimme"
            onClick={startShuffling}
            disabled={isShuffling}>
            SHUFFLE DECK
          </button>
        );
      }
    return (
        <main className="Deck">
          {renderShuffleBtnIfOk()}
          {RenderCardBtn()}
    
          <div className="Deck-cardarea">{
            drawn.map(c => (
              <Card key={c.id} name={c.name} image={c.image} />
            ))}
          </div>
    
        </main>
      );

}

export default Deck