export default function randomBag(options){

    let shuffle = options

    for (let i = shuffle.length -1; i > 0; i--){

        const j = Math.floor(Math.random() * (i + 1));

        [shuffle[i], shuffle[j]] = [shuffle[j], shuffle [i]];

    }

    return shuffle;
}
