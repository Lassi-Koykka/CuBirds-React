import { ICard} from "./types";
import { birds } from "./birds.json";
import { v4 as uuidv4 } from "uuid"

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


//Creating card list from species
export const MakeCards = () => {

    let newCards: ICard[] = [];

    birds.forEach(bird => {

        for (let i = 0; i < bird.count; i++) {
            newCards.push({ uid: uuidv4(), name: bird.name, smallFlock: bird.smallFlock, largeFlock: bird.largeFlock, imageFile: bird.imageFile } as ICard)
        }
    });
    console.log(newCards);
}

// Count how many of each species in cards
export const CountSpecies = (cards: ICard[]): { [key: string]: number } => {
    let cardCounts: { [key: string]: number } = {};
    cards.forEach((c) => cardCounts[c.name] ? cardCounts[c.name] = cardCounts[c.name] + 1 : cardCounts[c.name] = 1 );

    return cardCounts;
}

// Check if player can send a flock home and return them
export const GetPossibleFlocks = (cards: ICard[]): Array<{species: string, size: "small" | "large"}> => {
    let possibleFlocks: Array<{species: string, size: "small" | "large"}> = []
    let speciesCounts = CountSpecies(cards);
    
    birds.forEach((bird) => {
        if(speciesCounts[bird.name] >= bird.largeFlock) {
            possibleFlocks.push({species: bird.name, size: "large"});
        } else if (speciesCounts[bird.name] >= bird.smallFlock) {
            possibleFlocks.push({species: bird.name, size: "small"});
        }
    })


    return possibleFlocks;
}